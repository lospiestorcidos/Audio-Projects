// Motor de Enjambre: efecto granular y de micro-bucles sobre la entrada de audio.
//
// La entrada se graba sin parar en un historial de ~11 s. Cada motor es un planificador que lanza
// "cabezas": lectores de ese historial, con interpolación y ventana, como bucles (que se repiten
// un número de veces) o como granos sueltos. Pattern, en cambio, lee repeticiones fijas (taps) del
// historial, como un delay. Después van la modulación de tono, el filtro, la reverb (Space) y la
// mezcla con la señal original.
//
// No depende del navegador: corre en un AudioWorklet o en Node (tests). Todo está preasignado.
import {
  defaultValues, FILTER_DEAD, HIST_POINTS, HIST_SECONDS, LOOP_SPEED_RATES, loopFadeSeconds, MAX_HEADS, pidx,
  stepSeconds, type EngineMsg, type Telemetry,
} from '../../shared/params';
import { Looper } from './looper';

const P = {
  engine: pidx('engine'), variation: pidx('variation'), activity: pidx('activity'), repeats: pidx('repeats'),
  shape: pidx('shape'), filter: pidx('filter'), mix: pidx('mix'), time: pidx('time'), space: pidx('space'),
  inGain: pidx('inGain'), modDepth: pidx('modDepth'), modRate: pidx('modRate'), reso: pidx('reso'),
  fxVol: pidx('fxVol'), room: pidx('room'), hold: pidx('hold'), bypass: pidx('bypass'), bpm: pidx('bpm'),
  loopLevel: pidx('loopLevel'), loopSpeed: pidx('loopSpeed'), loopFade: pidx('loopFade'), reverse: pidx('reverse'),
  loopRoute: pidx('loopRoute'), loopQuant: pidx('loopQuant'),
};

const TAU = Math.PI * 2;
const db = (x: number) => Math.pow(10, x / 20);

/** Historial: 2^19 muestras (10,9 s a 48 kHz) por canal. */
const HIST = 1 << 19;
const MASK = HIST - 1;
/** Margen que se deja entre lo que se escribe y lo más antiguo que se lee. */
const SAFE = 4096;

// --- Formas de cada bucle o grano (Shape): Plana, Crece, Golpe y Arco, en tablas ---
const SHAPE_N = 1024;
const SHAPE_TABLES = [0, 1, 2, 3].map((k) => {
  const t = new Float32Array(SHAPE_N + 1);
  for (let i = 0; i <= SHAPE_N; i++) {
    const x = i / SHAPE_N;
    const edgeIn = Math.min(1, x / 0.03), edgeOut = Math.min(1, (1 - x) / 0.03);
    t[i] = k === 0 ? Math.min(edgeIn, edgeOut)
      : k === 1 ? x * x * edgeOut
      : k === 2 ? (1 - x) * (1 - x) * Math.min(1, x / 0.01)
      : Math.sin(Math.PI * x);
  }
  return t;
});

// --- Velocidades de cada variación ---
const SHARDS_RATES = [[1, 2], [1, 0.5], [2], [0.5, 1, 2, 4]];
const MIST_RATES = [[1], [1], [1, 2], [1, 0.5]];
/** Glide: velocidad inicial y final; la variación D lanza las dos a la vez. */
const GLIDE_PAIRS = [[[0.5, 1]], [[2, 0.5]], [[1, 2]], [[1, 2], [1, 0.5]]];
/** Pattern: posición de cada repetición, en pasos de la rejilla. */
const PATTERN_TAPS = [
  [1, 2, 3, 4, 5, 6, 7, 8],
  [1.5, 2.5, 3, 4.5, 5.5, 6, 7.5, 8.5],
  [1, 1.125, 1.25, 3, 3.125, 3.25, 5, 5.125],
  [2 / 3, 4 / 3, 2, 8 / 3, 10 / 3, 4, 14 / 3, 16 / 3],
];

// --- Reverb (Space): red de 8 retardos realimentados (FDN) con mezcla de Hadamard ---
const FDN_MS = [23.1, 29.3, 31.7, 37.9, 41.3, 43.7, 47.1, 53.3];
/** Por sala: escala de los retardos, tiempo de caída (s) y amortiguación de agudos. */
const ROOM_SETS = [
  { scale: 0.8, t60: 0.7, damp: 0.35 },
  { scale: 1.5, t60: 2.0, damp: 0.3 },
  { scale: 2.4, t60: 4.5, damp: 0.25 },
  { scale: 2.9, t60: 40, damp: 0.12 },
];
const FDN_SIZE = 16384;

/** Generador xorshift32: rápido y sin reservas de memoria. */
class Rng {
  private s = 0x2545f491;
  next(): number {
    let x = this.s;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    this.s = x;
    return (x >>> 0) / 4294967296;
  }
  pick(a: number[]): number { return a[Math.floor(this.next() * a.length) % a.length]; }
}

export class EnjambreEngine {
  readonly p = defaultValues();
  private sr: number;
  private rng = new Rng();

  // --- Historial ---
  private bufL = new Float32Array(HIST);
  private bufR = new Float32Array(HIST);
  /** Muestras escritas en total: el "ahora" del historial. Se detiene con Hold. */
  private wt = 0;
  /** Puntero que sigue avanzando con Hold, dentro de una ventana del historial congelado. */
  private play = 0;
  private holdOn = false;

  // --- Cabezas (estructura de arrays) ---
  private hOn = new Uint8Array(MAX_HEADS);
  private hLoop = new Uint8Array(MAX_HEADS);
  private hBase = new Float64Array(MAX_HEADS); // inicio del segmento en el historial
  private hLen = new Float64Array(MAX_HEADS); // muestras del segmento
  private hPos = new Float64Array(MAX_HEADS); // posición dentro del segmento
  private hRate = new Float64Array(MAX_HEADS);
  private hRateMul = new Float64Array(MAX_HEADS); // Glide: la velocidad se multiplica por esto cada muestra
  private hLife = new Float64Array(MAX_HEADS); // muestras que le quedan
  private hTotal = new Float64Array(MAX_HEADS);
  private hGl = new Float32Array(MAX_HEADS);
  private hGr = new Float32Array(MAX_HEADS);
  private hShapeI = new Uint8Array(MAX_HEADS);
  private hShapeF = new Float32Array(MAX_HEADS);
  private hLevel = new Float32Array(MAX_HEADS); // último nivel, para la pantalla

  // --- Rejilla y planificación ---
  private sc = 0; // muestras dentro del paso actual
  private step = 0;
  private mistNext = 0;
  private scan = 0; // Mist A: lector que avanza a 1/4 de velocidad
  /** Pattern: duración del paso suavizada (cambiar el tempo no hace saltar las repeticiones). */
  private patStep = 0;

  // --- Cadena de salida ---
  private modL = new Float32Array(4096);
  private modR = new Float32Array(4096);
  private modW = 0;
  private lfo = 0;
  private f1L = 0; private f2L = 0; private f1R = 0; private f2R = 0;
  private fdn: Float32Array[] = Array.from({ length: 8 }, () => new Float32Array(FDN_SIZE));
  private fdnLp = new Float32Array(8);
  private fdnW = 0;
  private fdnLen = new Int32Array(8);
  private fdnG = new Float32Array(8);
  private fdnDamp = 0.3;
  private room = -1;

  // --- Suavizados y entrada ---
  private sMix = 0.5; private sIn = 1; private sFx = 1; private sSpace = 0.25;
  private pluckT = -1;

  /** Looper (60 s, una capa de sobregrabación). */
  readonly looper: Looper;

  // --- Telemetría ---
  private inPeak = 0; private outPeak = 0;
  private hist = new Float32Array(HIST_POINTS);
  private histPos = 0; private histAcc = 0; private histCount = 0;
  private histStep: number;
  private taps = new Float32Array(16); // [antigüedad, nivel] de cada tap de Pattern

  constructor(sampleRate: number) {
    this.sr = sampleRate;
    this.histStep = Math.max(1, Math.round((sampleRate * HIST_SECONDS) / HIST_POINTS));
    this.patStep = stepSeconds(this.p[P.time], this.p[P.bpm]) * sampleRate;
    this.setRoom(this.p[P.room]);
    this.looper = new Looper(sampleRate);
  }

  message(m: EngineMsg) {
    switch (m.t) {
      case 'param': this.p[m.i] = m.v; break;
      case 'params': for (let i = 0; i < m.a.length && i < this.p.length; i++) this.p[i] = m.a[i]; break;
      case 'clear':
        this.bufL.fill(0); this.bufR.fill(0); this.hOn.fill(0); this.hist.fill(0);
        for (const d of this.fdn) d.fill(0);
        this.modL.fill(0); this.modR.fill(0);
        this.f1L = this.f2L = this.f1R = this.f2R = 0;
        break;
      case 'pluck': this.pluckT = 0; break;
      case 'loop': this.looper.action(m.a, this.p[P.loopQuant] >= 0.5); break;
    }
  }

  private setRoom(r: number) {
    r = Math.max(0, Math.min(3, Math.round(r)));
    if (r === this.room) return;
    this.room = r;
    const set = ROOM_SETS[r];
    for (let i = 0; i < 8; i++) {
      const len = Math.min(FDN_SIZE - 2, Math.round((FDN_MS[i] * set.scale * this.sr) / 1000));
      this.fdnLen[i] = len;
      // Ganancia para que cada línea caiga 60 dB en t60 segundos.
      this.fdnG[i] = Math.pow(10, (-3 * len) / (set.t60 * this.sr));
    }
    this.fdnDamp = set.damp;
  }

  /** "Ahora" para las cabezas nuevas: lo último grabado. */
  private get ref(): number { return this.wt; }

  /** Busca una cabeza libre. Devuelve -1 si están todas ocupadas. */
  private freeHead(): number {
    for (let k = 0; k < MAX_HEADS; k++) if (!this.hOn[k]) return k;
    return -1;
  }

  /** Lanza una cabeza. len y life en muestras; base = inicio del segmento en el historial. */
  private spawn(base: number, len: number, rate: number, rateEnd: number, life: number, loop: boolean, gain: number, pan: number) {
    const k = this.freeHead();
    if (k < 0 || len < 64 || life < 64) return;
    // No se lee nada más antiguo que lo que queda en el historial al final de la vida de la cabeza.
    if (base < this.wt - HIST + SAFE + life) return;
    if (base < 0) return;
    this.hOn[k] = 1;
    this.hLoop[k] = loop ? 1 : 0;
    this.hBase[k] = base;
    this.hLen[k] = len;
    this.hPos[k] = 0;
    this.hRate[k] = rate;
    this.hRateMul[k] = rateEnd === rate ? 1 : Math.pow(rateEnd / rate, 1 / life);
    this.hLife[k] = life;
    this.hTotal[k] = life;
    const a = (Math.max(-1, Math.min(1, pan)) + 1) * (Math.PI / 4); // paneo de potencia constante
    this.hGl[k] = gain * Math.cos(a) * Math.SQRT2;
    this.hGr[k] = gain * Math.sin(a) * Math.SQRT2;
    const sh = this.p[P.shape] * 3, si = Math.min(2, Math.floor(sh));
    this.hShapeI[k] = si;
    this.hShapeF[k] = sh - si;
  }

  /** Un paso de la rejilla: Shards y Glide lanzan bucles hechos con el último paso de entrada. */
  private onStep(stepLen: number) {
    const engine = Math.round(this.p[P.engine]), v = Math.round(this.p[P.variation]);
    const act = this.p[P.activity], rep = this.p[P.repeats], sr = this.sr;
    // El segmento es el último paso grabado, como mucho 2,5 s.
    const len = Math.min(stepLen, 2.5 * sr);
    const maxLife = 7.5 * sr;
    if (engine === 0) {
      // Shards: Activity = bucles nuevos por paso; Repeats = cuántas vueltas da cada uno.
      const expected = 0.25 + act * 2.25;
      let n = Math.floor(expected);
      if (this.rng.next() < expected - n) n++;
      for (let i = 0; i < n; i++) {
        const rate = this.rng.pick(SHARDS_RATES[v]);
        const cycles = 1 + Math.round(rep * 15);
        const life = Math.min(maxLife, (cycles * len) / rate);
        this.spawn(this.ref - len, len, rate, rate, life, true, 0.6, (this.rng.next() * 2 - 1) * 0.8);
      }
    } else if (engine === 2) {
      // Glide: menos bucles, más largos; la velocidad se desliza durante toda su vida.
      const expected = 0.2 + act * 1.3;
      let n = Math.floor(expected);
      if (this.rng.next() < expected - n) n++;
      for (let i = 0; i < n; i++) {
        const life = Math.min(maxLife, len * (1 + rep * 7));
        for (const [r0, r1] of GLIDE_PAIRS[v]) {
          this.spawn(this.ref - len, len, r0, r1, life, true, 0.55, (this.rng.next() * 2 - 1) * 0.8);
        }
      }
    }
  }

  /** Mist: lanza un grano. */
  private spawnGrain() {
    const v = Math.round(this.p[P.variation]), sr = this.sr;
    const act = this.p[P.activity], rep = this.p[P.repeats];
    const grain = 0.03 * Math.pow(2, rep * 3.8) * sr; // duración: de 30 a 420 ms
    const rate = this.rng.pick(MIST_RATES[v]);
    const span = grain * rate; // muestras del historial que lee
    const perSec = 3 + act * 57;
    const overlap = Math.max(1, (perSec * grain) / sr);
    let base: number;
    if (v === 0) {
      // Estirada: los granos salen de un lector que avanza a 1/4 de la velocidad real.
      base = this.scan + (this.rng.next() * 2 - 1) * 0.02 * sr;
    } else {
      base = this.ref - span - this.rng.next() * (v === 1 ? 3 : 1.5) * sr;
    }
    base = Math.min(base, this.ref - span);
    this.spawn(base, span, rate, rate, grain, false, 0.9 / Math.sqrt(overlap), (this.rng.next() * 2 - 1) * 0.9);
  }

  /** Procesa n muestras. inL/inR pueden ser null (sin entrada conectada); inR null = entrada mono. */
  process(inL: Float32Array | null, inR: Float32Array | null, outL: Float32Array, outR: Float32Array, n: number) {
    const p = this.p, sr = this.sr, bufL = this.bufL, bufR = this.bufR;
    const engine = Math.round(p[P.engine]), v = Math.round(p[P.variation]);
    const hold = p[P.hold] >= 0.5, bypass = p[P.bypass] >= 0.5;
    if (hold && !this.holdOn) this.play = this.wt;
    this.holdOn = hold;
    this.setRoom(p[P.room]);

    // --- Parámetros por bloque ---
    const stepLen = Math.max(64, stepSeconds(p[P.time], p[P.bpm]) * sr);
    const smooth = 1 - Math.exp(-1 / (0.02 * sr));
    const tMix = p[P.mix], tIn = db(p[P.inGain]), tFx = db(p[P.fxVol]), tSpace = p[P.space];
    // Pattern: taps activos, sus ganancias (Repeats hace de feedback) y su lado.
    const nTaps = engine === 3 ? 1 + Math.round(p[P.activity] * 7) : 0;
    const fb = 0.2 + p[P.repeats] * 0.72;
    const tapMult = PATTERN_TAPS[v];
    // Ventana que recorre Pattern con Hold: 8 pasos, como mucho 8 s.
    const holdWin = Math.min(8 * stepLen, 8 * sr);
    const mistPerSec = 3 + p[P.activity] * 57;
    // Modulación de tono: un retardo corto que oscila (vibrato) sobre el efecto.
    const depth = p[P.modDepth] * 0.004 * sr, lfoInc = p[P.modRate] / sr, modBase = 0.0045 * sr;
    // Filtro: a la izquierda paso bajo, a la derecha paso alto, apagado en el centro.
    const f = p[P.filter], fOn = Math.abs(f) >= FILTER_DEAD, hp = f > 0;
    const cut = Math.min(sr * 0.45, hp ? 20 * Math.pow(1000, f) : 20 * Math.pow(1000, 1 + f));
    const g = Math.tan((Math.PI * cut) / sr), kq = 2 - 1.9 * p[P.reso];
    const c1 = 1 / (1 + g * (g + kq)), c2 = g * c1, c3 = g * c2;
    const damp = this.fdnDamp;
    // Looper y Reverse.
    const looper = this.looper, reverse = p[P.reverse] >= 0.5, pre = p[P.loopRoute] >= 0.5;
    const loopSpeed = LOOP_SPEED_RATES[Math.round(p[P.loopSpeed])], loopFade = loopFadeSeconds(p[P.loopFade]);
    const loopLevel = p[P.loopLevel];

    let { wt, play, sc, step, mistNext, scan } = this;
    let sMix = this.sMix, sIn = this.sIn, sFx = this.sFx, sSpace = this.sSpace;
    let inPeak = this.inPeak, outPeak = this.outPeak;
    let ic1L = this.f1L, ic2L = this.f2L, ic1R = this.f1R, ic2R = this.f2R;

    for (let i = 0; i < n; i++) {
      sMix += (tMix - sMix) * smooth; sIn += (tIn - sIn) * smooth;
      sFx += (tFx - sFx) * smooth; sSpace += (tSpace - sSpace) * smooth;

      // --- Entrada (más el sonido de prueba) ---
      let xl = inL ? inL[i] * sIn : 0;
      let xr = inL ? (inR ? inR[i] : inL[i]) * sIn : 0;
      if (this.pluckT >= 0) {
        // Arpegio de prueba: La, Do#, Mi, La agudo, una nota cada 0,25 s.
        const t = this.pluckT / sr;
        let s = 0;
        for (let k = 0; k < 4; k++) {
          const tk = t - k * 0.25;
          if (tk >= 0 && tk < 0.6) {
            const fq = [440, 554.37, 659.25, 880][k];
            s += Math.sin(TAU * fq * tk) * Math.exp(-tk * 9) * Math.min(1, tk * 400) * 0.45;
          }
        }
        xl += s; xr += s;
        if (++this.pluckT > 1.4 * sr) this.pluckT = -1;
      }
      const a = xl < 0 ? -xl : xl, b = xr < 0 ? -xr : xr, m = a > b ? a : b;
      if (m > inPeak) inPeak = m;
      // Ruta Pre: el looper graba la entrada y lo que suena del bucle entra al efecto como otra fuente.
      if (pre) {
        looper.tick(xl, xr, loopSpeed, reverse, loopFade);
        xl += looper.outL * loopLevel; xr += looper.outR * loopLevel;
      }

      // --- Historial: con Hold no se graba; con Bypass se graba silencio (las colas siguen) ---
      if (!hold) {
        const w = wt & MASK;
        bufL[w] = bypass ? 0 : xl;
        bufR[w] = bypass ? 0 : xr;
        wt++;
        play = wt;
        if (!bypass && m > this.histAcc) this.histAcc = m;
        if (++this.histCount >= this.histStep) {
          this.hist[this.histPos] = this.histAcc;
          this.histPos = (this.histPos + 1) % HIST_POINTS;
          this.histAcc = 0; this.histCount = 0;
        }
      } else {
        // Con Hold, el puntero de reproducción da vueltas por los últimos 8 pasos grabados.
        play++;
        if (play >= wt) play -= holdWin;
      }

      // --- Rejilla y planificación (con Bypass no nace nada nuevo) ---
      if (++sc >= stepLen) {
        sc -= stepLen;
        step++;
        looper.onStep(); // acciones del looper que esperaban al paso (Cuantizar)
        if (!bypass && wt > stepLen) this.onStep(stepLen);
      }
      if (engine === 1) {
        if (!hold) {
          scan += 0.25;
          if (wt - scan > 3 * sr || scan > wt) scan = wt - 0.25 * sr;
        }
        if (--mistNext <= 0) {
          mistNext += (sr / mistPerSec) * (0.5 + this.rng.next());
          if (!bypass && wt > sr * 0.5) this.spawnGrain();
        }
      }

      // --- Cabezas ---
      let wl = 0, wr = 0;
      for (let k = 0; k < MAX_HEADS; k++) {
        if (!this.hOn[k]) continue;
        const len = this.hLen[k];
        let pos = this.hPos[k];
        // Ventana del bucle o grano, interpolando entre las dos formas vecinas.
        const x = (pos / len) * SHAPE_N, xi = x | 0, xf = x - xi;
        const t0 = SHAPE_TABLES[this.hShapeI[k]], t1 = SHAPE_TABLES[this.hShapeI[k] + 1];
        const w0 = t0[xi] + xf * (t0[xi + 1] - t0[xi]), w1 = t1[xi] + xf * (t1[xi + 1] - t1[xi]);
        let win = w0 + this.hShapeF[k] * (w1 - w0);
        // Fundido de 8 ms al nacer y al morir (sin clics).
        const life = this.hLife[k], el = this.hTotal[k] - life, fade = 0.008 * sr;
        if (el < fade) win *= el / fade;
        if (life < fade) win *= life / fade;
        this.hLevel[k] = win;
        // Con Reverse, cada bucle o grano se lee de atrás hacia delante.
        const rp = this.hBase[k] + (reverse ? len - pos : pos), ip = Math.floor(rp), fr = rp - ip, j = ip & MASK, j1 = (ip + 1) & MASK;
        wl += (bufL[j] + fr * (bufL[j1] - bufL[j])) * win * this.hGl[k];
        wr += (bufR[j] + fr * (bufR[j1] - bufR[j])) * win * this.hGr[k];
        pos += this.hRate[k];
        if (pos >= len) {
          if (this.hLoop[k]) pos -= len; else { this.hOn[k] = 0; continue; }
        }
        this.hPos[k] = pos;
        this.hRate[k] *= this.hRateMul[k];
        if ((this.hLife[k] = life - 1) <= 0) this.hOn[k] = 0;
      }

      // --- Pattern: repeticiones fijas del historial ---
      if (nTaps) {
        // El paso se acerca al nuevo valor sin saltos (como una cinta que cambia de velocidad).
        let d = (stepLen - this.patStep) * 0.0005;
        d = d > 0.09 ? 0.09 : d < -0.09 ? -0.09 : d;
        this.patStep += d;
        let gk = 0.8;
        for (let k = 0; k < nTaps; k++, gk *= fb) {
          const dly = tapMult[k] * this.patStep;
          if (dly > HIST - SAFE * 2) break;
          // Se descuenta el retardo fijo de la modulación de tono, para que cada repetición caiga en su sitio.
          let rp = play - dly + modBase;
          if (hold) { const lo = wt - holdWin; rp = lo + (((rp - lo) % holdWin) + holdWin) % holdWin; }
          const ip = Math.floor(rp), fr = rp - ip, j = ip & MASK, j1 = (ip + 1) & MASK;
          const s = gk * (k & 1 ? 0.55 : 1), o = gk * (k & 1 ? 1 : 0.55);
          wl += (bufL[j] + fr * (bufL[j1] - bufL[j])) * s;
          wr += (bufR[j] + fr * (bufR[j1] - bufR[j])) * o;
          if (i === 0) { this.taps[k * 2] = dly / sr; this.taps[k * 2 + 1] = gk; }
        }
      }

      // --- Modulación de tono (vibrato) ---
      const mw = this.modW;
      this.modL[mw] = wl; this.modR[mw] = wr;
      this.modW = (mw + 1) & 4095;
      this.lfo += lfoInc; if (this.lfo >= 1) this.lfo -= 1;
      const md = modBase + (depth > 0 ? depth * Math.sin(TAU * this.lfo) : 0);
      {
        const rp = mw - md, ip = Math.floor(rp), fr = rp - ip, j = ip & 4095, j1 = (ip + 1) & 4095;
        wl = this.modL[j] + fr * (this.modL[j1] - this.modL[j]);
        wr = this.modR[j] + fr * (this.modR[j1] - this.modR[j]);
      }

      // --- Filtro (SVF, topología TPT) ---
      if (fOn) {
        let v3 = wl - ic2L, v1 = c1 * ic1L + c2 * v3, v2 = ic2L + c2 * ic1L + c3 * v3;
        ic1L = 2 * v1 - ic1L; ic2L = 2 * v2 - ic2L;
        wl = hp ? wl - kq * v1 - v2 : v2;
        v3 = wr - ic2R; v1 = c1 * ic1R + c2 * v3; v2 = ic2R + c2 * ic1R + c3 * v3;
        ic1R = 2 * v1 - ic1R; ic2R = 2 * v2 - ic2R;
        wr = hp ? wr - kq * v1 - v2 : v2;
      }
      wl *= sFx; wr *= sFx;

      // --- Space: reverb FDN alimentada por el efecto ---
      let rl = 0, rr = 0;
      if (sSpace > 0.001) {
        const fw = this.fdnW, lines = this.fdn;
        // Lectura de las 8 líneas, con amortiguación de agudos.
        let s0 = 0, s1 = 0, s2 = 0, s3 = 0, s4 = 0, s5 = 0, s6 = 0, s7 = 0;
        for (let k = 0; k < 8; k++) {
          const y = lines[k][(fw - this.fdnLen[k]) & (FDN_SIZE - 1)];
          const lp = (this.fdnLp[k] += (y - this.fdnLp[k]) * (1 - damp));
          const val = lp * this.fdnG[k];
          if (k === 0) s0 = val; else if (k === 1) s1 = val; else if (k === 2) s2 = val; else if (k === 3) s3 = val;
          else if (k === 4) s4 = val; else if (k === 5) s5 = val; else if (k === 6) s6 = val; else s7 = val;
        }
        rl = (s0 + s2 + s4 + s6) * 0.5; rr = (s1 + s3 + s5 + s7) * 0.5;
        // Mezcla de Hadamard 8×8 (sin pérdidas), normalizada.
        const a0 = s0 + s1, a1 = s0 - s1, a2 = s2 + s3, a3 = s2 - s3, a4 = s4 + s5, a5 = s4 - s5, a6 = s6 + s7, a7 = s6 - s7;
        const b0 = a0 + a2, b1 = a1 + a3, b2 = a0 - a2, b3 = a1 - a3, b4 = a4 + a6, b5 = a5 + a7, b6 = a4 - a6, b7 = a5 - a7;
        const h = 0.35355339; // 1/√8
        const inp = (wl + wr) * 0.5;
        lines[0][fw] = (b0 + b4) * h + inp;
        lines[1][fw] = (b1 + b5) * h - inp;
        lines[2][fw] = (b2 + b6) * h + inp;
        lines[3][fw] = (b3 + b7) * h - inp;
        lines[4][fw] = (b0 - b4) * h + inp;
        lines[5][fw] = (b1 - b5) * h - inp;
        lines[6][fw] = (b2 - b6) * h + inp;
        lines[7][fw] = (b3 - b7) * h - inp;
        this.fdnW = (fw + 1) & (FDN_SIZE - 1);
      }
      wl = wl * (1 - 0.3 * sSpace) + rl * sSpace;
      wr = wr * (1 - 0.3 * sSpace) + rr * sSpace;

      // --- Mezcla con la señal original; con Bypass pasa la señal entera y suenan las colas ---
      const kk = sMix * (Math.PI / 2);
      const dryG = bypass ? 1 : Math.cos(kk), wetG = Math.sin(kk);
      let ol = xl * dryG + wl * wetG, or = xr * dryG + wr * wetG;
      // Ruta Post: el looper graba lo que se oye (sin el propio bucle) y lo suma a la salida.
      if (!pre) {
        looper.tick(ol, or, loopSpeed, reverse, loopFade);
        ol += looper.outL * loopLevel; or += looper.outR * loopLevel;
      }
      // Limitador de salida: transparente hasta 0,9 y redondeado por encima (nunca pasa de 1).
      if (ol > 0.9) ol = 0.9 + 0.1 * Math.tanh((ol - 0.9) * 10); else if (ol < -0.9) ol = -0.9 - 0.1 * Math.tanh((-ol - 0.9) * 10);
      if (or > 0.9) or = 0.9 + 0.1 * Math.tanh((or - 0.9) * 10); else if (or < -0.9) or = -0.9 - 0.1 * Math.tanh((-or - 0.9) * 10);
      outL[i] = ol; outR[i] = or;
      const oa = ol < 0 ? -ol : ol, ob = or < 0 ? -or : or;
      if (oa > outPeak) outPeak = oa;
      if (ob > outPeak) outPeak = ob;
    }

    const tiny = (x: number) => (x < 1e-20 && x > -1e-20 ? 0 : x); // sin denormales en silencio
    this.wt = wt; this.play = play; this.sc = sc; this.step = step; this.mistNext = mistNext; this.scan = scan;
    this.sMix = sMix; this.sIn = sIn; this.sFx = sFx; this.sSpace = sSpace;
    this.inPeak = inPeak; this.outPeak = outPeak;
    this.f1L = tiny(ic1L); this.f2L = tiny(ic2L); this.f1R = tiny(ic1R); this.f2R = tiny(ic2R);
    for (let k = 0; k < 8; k++) this.fdnLp[k] = tiny(this.fdnLp[k]);
    if (engine !== 3) this.taps.fill(0);
    else for (let k = nTaps; k < 8; k++) { this.taps[k * 2] = 0; this.taps[k * 2 + 1] = 0; }
  }

  /** Cabezas activas ahora (para tests y para la pantalla). */
  activeHeads(): number {
    let c = 0;
    for (let k = 0; k < MAX_HEADS; k++) c += this.hOn[k];
    return c;
  }

  /** Instantánea para la UI. cpu lo mide quien llama a process(). */
  telemetry(cpu: number): Telemetry {
    const hist = new Float32Array(HIST_POINTS);
    for (let i = 0; i < HIST_POINTS; i++) hist[i] = this.hist[(this.histPos + i) % HIST_POINTS];
    const heads: number[] = [];
    for (let k = 0; k < MAX_HEADS; k++) {
      if (!this.hOn[k]) continue;
      heads.push((this.wt - (this.hBase[k] + this.hPos[k])) / this.sr, this.hLevel[k], this.hRate[k]);
    }
    for (let k = 0; k < 8; k++) if (this.taps[k * 2 + 1] > 0) heads.push(this.taps[k * 2], this.taps[k * 2 + 1], 1);
    const stepLen = Math.max(64, stepSeconds(this.p[P.time], this.p[P.bpm]) * this.sr);
    const t: Telemetry = {
      t: 'tel', cpu, inPeak: this.inPeak, outPeak: this.outPeak, hist,
      heads: Float32Array.from(heads), stepPhase: this.sc / stepLen, step: this.step,
      loopState: this.looper.state, loopLen: this.looper.len / this.sr,
      loopPos: this.looper.len ? this.looper.pos / this.looper.len : 0,
      loopLayer: this.looper.hasLayer, loopPending: this.looper.pending !== null,
    };
    this.inPeak = 0; this.outPeak = 0;
    return t;
  }
}
