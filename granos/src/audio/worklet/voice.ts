// Una voz de Granos: planificador de granos (Classic / Loop / Cloud), modulación, filtro y envolventes.
// Todo está preasignado: en el hilo de audio no se reserva memoria.
import { MOD_TABLE, SOURCES, pidx, LFO_DIV_BEATS, type SourceId } from '../../shared/params';
import { Envelope, ENV_IDLE } from './envelope';
import { Lfo } from './lfo';
import { DualSvf } from './filter';
import { Rng } from './rng';

/** Tamaño del bloque de control: LFO, envolventes y modulación se calculan cada BLOCK muestras. */
export const BLOCK = 16;
/** Máximo de granos simultáneos por canal y por voz (modo Cloud). */
export const MAX_GRAINS = 20;

const MODE_CLASSIC = 0, MODE_LOOP = 1, MODE_CLOUD = 2;
const G_HANN = 0, G_CLASSIC = 1, G_LOOP = 2;

// Índices de fuentes en el vector de modulación.
const S_LFO = SOURCES.indexOf('lfo'), S_ENV1 = SOURCES.indexOf('env1'), S_ENV2 = SOURCES.indexOf('env2');
const S_KEY = SOURCES.indexOf('key'), S_VEL = SOURCES.indexOf('vel'), S_BEND = SOURCES.indexOf('bend');
const S_SLIDE = SOURCES.indexOf('slide'), S_PRESS = SOURCES.indexOf('press'), S_RAND = SOURCES.indexOf('rand');

// Índices de parámetros (resueltos una sola vez al cargar el módulo).
const P = {
  mode: pidx('mode'), position: pidx('position'), size: pidx('size'), shape: pidx('shape'),
  reverse: pidx('reverse'), density: pidx('density'), transpose: pidx('transpose'), tune: pidx('tune'),
  spread: pidx('spread'), volume: pidx('volume'),
  scanSpeed: pidx('scanSpeed'), scanDist: pidx('scanDist'), scanLoop: pidx('scanLoop'),
  variation: pidx('variation'), varPos: pidx('varPos'), varSize: pidx('varSize'),
  varPitch: pidx('varPitch'), varVol: pidx('varVol'),
  filterOn: pidx('filterOn'), filterMode: pidx('filterMode'), filterFreq: pidx('filterFreq'),
  filterRes: pidx('filterRes'), filterWidth: pidx('filterWidth'),
  e1A: pidx('e1A'), e1D: pidx('e1D'), e1S: pidx('e1S'), e1R: pidx('e1R'), e1Key: pidx('e1Key'),
  e2A: pidx('e2A'), e2D: pidx('e2D'), e2S: pidx('e2S'), e2R: pidx('e2R'), e2Key: pidx('e2Key'),
  lfoMode: pidx('lfoMode'), lfoRate: pidx('lfoRate'), lfoDiv: pidx('lfoDiv'), lfoAudio: pidx('lfoAudio'),
  lfoShape: pidx('lfoShape'), lfoPhase: pidx('lfoPhase'), lfoRandPhase: pidx('lfoRandPhase'),
  lfoStereo: pidx('lfoStereo'), lfoQuant: pidx('lfoQuant'), lfoAmount: pidx('lfoAmount'),
  lfoModWheel: pidx('lfoModWheel'), bpm: pidx('bpm'), pbRange: pidx('pbRange'),
};

/** Rutas de modulación de un destino: pares (fuente, índice del parámetro de cantidad). */
interface Route { src: Int32Array; par: Int32Array; key: number }
function route(dest: string): Route {
  const srcs = Object.keys(MOD_TABLE[dest]) as SourceId[];
  return {
    src: Int32Array.from(srcs.map((s) => SOURCES.indexOf(s))),
    par: Int32Array.from(srcs.map((s) => pidx(`${dest}>${s}`))),
    key: srcs.includes('key') ? pidx(`${dest}>key`) : -1,
  };
}
const R = {
  position: route('position'), scanSpeed: route('scanSpeed'), size: route('size'), shape: route('shape'),
  variation: route('variation'), transpose: route('transpose'), spread: route('spread'),
  volume: route('volume'), filterFreq: route('filterFreq'), lfoRate: route('lfoRate'),
  lfoAmount: route('lfoAmount'),
};

/** Suma de (fuente × cantidad) de un destino, sin Key (Key se escala aparte en cada destino). */
function sumEx(r: Route, s: Float32Array, p: Float32Array): number {
  let acc = 0;
  for (let i = 0; i < r.src.length; i++) {
    const k = r.src[i];
    if (k !== S_KEY) acc += s[k] * p[r.par[i]];
  }
  return acc;
}
/** Modulación multiplicativa (Volume, LFO Amount): cada fuente escala la ganancia. */
function factor(r: Route, s: Float32Array, p: Float32Array): number {
  let f = 1;
  for (let i = 0; i < r.src.length; i++) {
    const a = p[r.par[i]];
    if (a === 0) continue;
    const k = r.src[i], v = s[k];
    if (k === S_KEY) f *= Math.pow(2, a * v); // ±6 dB por octava al 100 %
    else if (k === S_LFO) { const m = 1 + a * v; f *= m > 0 ? m : 0; }
    else f *= a >= 0 ? 1 - a + a * v : 1 + a * v;
  }
  return f;
}

// Tablas de envolvente de grano (con dos puntos de guarda para interpolar).
const TBL = 2048;
const HANN = new Float32Array(TBL + 2);
const EXPD = new Float32Array(TBL + 2);
for (let i = 0; i <= TBL + 1; i++) {
  const x = Math.min(1, i / TBL);
  HANN[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * x);
  EXPD[i] = Math.exp(-5.5 * x) * (1 - x); // decay exponencial que llega a cero al final
}

/** Sample compartido por todas las voces. Cada canal lleva una muestra de guarda al final. */
export class SampleData {
  ch: Float32Array[] = [];
  len = 0;
  sr = 48000;
  set(channels: Float32Array[], sr: number) {
    const len = channels.length ? channels[0].length : 0;
    if (len < 256) { this.ch = []; this.len = 0; return; }
    this.ch = channels.slice(0, 2).map((c) => {
      const d = new Float32Array(len + 1);
      d.set(c);
      d[len] = c[0]; // guarda para la interpolación lineal en el wrap
      return d;
    });
    this.len = len;
    this.sr = sr;
  }
}

export class Voice {
  active = false;
  id = -1;
  note = 60;
  vel = 0;
  gate = false;
  /** Contador global en el momento del note-on (para robar la voz más antigua). */
  age = 0;

  env1 = new Envelope();
  env2 = new Envelope();
  lfo = new Lfo();
  /** Salida del LFO ya con Amount (L, R), para la telemetría. */
  lfoOut = new Float32Array(2);

  // Nota con glide (en octavas respecto a C3 = 60).
  private keyOct = 0;
  private keyInc = 0;
  private keySteps = 0;
  // Expresión MPE: objetivo y valor suavizado.
  private bendT = 0; private slideT = 0; private pressT = 0;
  private bend = 0; private slide = 0; private press = 0;
  private exprFresh = true;
  private randNote = 0;

  private src = new Float32Array(SOURCES.length);
  private scan = 0;
  /** Posición base (0..1) de lectura, para el playhead de la UI. */
  head = 0;

  // Valores de control por canal, recalculados cada bloque.
  private cPos = new Float64Array(2);
  private cSize = new Float32Array(2);
  private cShape = new Float32Array(2);
  private cVar = new Float32Array(2);
  private cRate = new Float32Array(2);
  private cGain = new Float32Array(2);
  private prevGain = new Float32Array(2);
  private spreadEff = 0;

  // Planificador por canal.
  private rng = [new Rng(1), new Rng(1)];
  private next = new Float64Array(2);

  // Granos en estructura de arrays: canal c ocupa los slots [c*MAX_GRAINS, (c+1)*MAX_GRAINS).
  gActive = new Uint8Array(2 * MAX_GRAINS);
  gPos = new Float64Array(2 * MAX_GRAINS);
  gPhase = new Float64Array(2 * MAX_GRAINS);
  private gMul = new Float32Array(2 * MAX_GRAINS);
  private gPhInc = new Float64Array(2 * MAX_GRAINS);
  private gGain = new Float32Array(2 * MAX_GRAINS);
  private gType = new Uint8Array(2 * MAX_GRAINS);
  private gA = new Float32Array(2 * MAX_GRAINS);
  private gB = new Float32Array(2 * MAX_GRAINS);
  private gStart = new Int32Array(2 * MAX_GRAINS);

  private filt = [new DualSvf(), new DualSvf()];
  private buf = new Float32Array(BLOCK);

  // Robo de voz sin clic: fundido rápido y después arranca la nota pendiente.
  private killBlocks = 0;
  private pendId = 0; private pendNote = 0; private pendVel = 0; private pendSeed = 0;
  private pendPhase = 0;

  /** Inicia una nota. Si la voz está sonando, la apaga en ~3 ms antes de arrancar. */
  start(id: number, note: number, vel: number, seed: number, lfoPhase: number, age: number) {
    this.age = age;
    if (this.active && this.env1.value > 0.005) {
      this.pendId = id; this.pendNote = note; this.pendVel = vel; this.pendSeed = seed;
      this.pendPhase = lfoPhase;
      this.killBlocks = 8;
      this.id = id; // la voz ya responde a este id (note-off, expresión)
      this.gate = true;
      return;
    }
    this.doStart(id, note, vel, seed, lfoPhase);
  }

  private doStart(id: number, note: number, vel: number, seed: number, lfoPhase: number) {
    this.active = true;
    this.id = id; this.note = note; this.vel = vel;
    this.gate = true;
    this.killBlocks = 0;
    this.keyOct = (note - 60) / 12;
    this.keySteps = 0;
    this.bendT = this.slideT = this.pressT = 0;
    this.bend = this.slide = this.press = 0;
    this.exprFresh = true;
    // Mismo estado inicial en L y R: con Spread = 0 los dos canales van sincronizados.
    this.rng[0].seed(seed); this.rng[1].seed(seed);
    this.randNote = new Rng(seed ^ 0x5bd1e995).bi();
    this.env1.reset(); this.env2.reset();
    this.env1.gateOn(); this.env2.gateOn();
    this.lfo.reset(lfoPhase, seed * 31 + 7);
    this.scan = 0;
    this.next[0] = this.next[1] = 0;
    this.gActive.fill(0);
    this.prevGain[0] = this.prevGain[1] = 0;
    this.filt[0].reset(); this.filt[1].reset();
  }

  /** Legato en mono: cambia de nota sin redisparar; el Key se desliza durante glide segundos. */
  glideTo(id: number, note: number, glide: number, sr: number) {
    this.id = id; this.note = note;
    const target = (note - 60) / 12;
    const steps = Math.round((glide * sr) / BLOCK);
    if (steps < 1) { this.keyOct = target; this.keySteps = 0; return; }
    this.keySteps = steps;
    this.keyInc = (target - this.keyOct) / steps;
  }

  release() {
    this.gate = false;
    if (this.killBlocks > 0) { this.killBlocks = 0; this.pendVel = 0; }
    this.env1.gateOff(); this.env2.gateOff();
  }

  kill() { this.active = false; this.gate = false; this.gActive.fill(0); this.env1.reset(); this.env2.reset(); }

  expression(bend: number, slide: number, press: number) {
    this.bendT = bend; this.slideT = slide; this.pressT = press;
    if (this.exprFresh) { this.bend = bend; this.slide = slide; this.press = press; this.exprFresh = false; }
  }

  /** Renderiza n (≤ BLOCK) muestras y las suma en outL/outR a partir de off. */
  render(
    p: Float32Array, smp: SampleData, outL: Float32Array, outR: Float32Array,
    off: number, n: number, sr: number, wheel: number,
  ) {
    // --- Robo de voz ---
    let killGain = 1;
    if (this.killBlocks > 0) {
      this.killBlocks--;
      killGain = this.killBlocks / 8;
      if (this.killBlocks === 0) {
        this.doStart(this.pendId, this.pendNote, this.pendVel, this.pendSeed, this.pendPhase);
        killGain = 1;
      }
    }

    const s = this.src;
    const blockRate = sr / n;

    // --- Glide y suavizado de la expresión ---
    if (this.keySteps > 0) { this.keyOct += this.keyInc; this.keySteps--; }
    this.bend += (this.bendT - this.bend) * 0.2;
    this.slide += (this.slideT - this.slide) * 0.2;
    this.press += (this.pressT - this.press) * 0.2;
    const key = this.keyOct;

    // --- Envolventes (Key acorta o alarga los tiempos según la nota) ---
    const e1 = this.env1.tick(p[P.e1A], p[P.e1D], p[P.e1S], p[P.e1R], blockRate, Math.pow(2, -p[P.e1Key] * key));
    const e2 = this.env2.tick(p[P.e2A], p[P.e2D], p[P.e2S], p[P.e2R], blockRate, Math.pow(2, -p[P.e2Key] * key));
    if (this.env1.state === ENV_IDLE && !this.gate) { this.kill(); return; }

    s[S_ENV1] = e1; s[S_ENV2] = e2; s[S_KEY] = key; s[S_VEL] = this.vel;
    s[S_BEND] = this.bend; s[S_SLIDE] = this.slide; s[S_PRESS] = this.press; s[S_RAND] = this.randNote;
    s[S_LFO] = 0;

    // --- LFO ---
    const lm = p[P.lfoMode];
    let lfoHz = lm === 1 ? p[P.bpm] / 60 / LFO_DIV_BEATS[p[P.lfoDiv]] : lm === 2 ? p[P.lfoAudio] : p[P.lfoRate];
    lfoHz *= Math.pow(2, (R.lfoRate.key >= 0 ? p[R.lfoRate.key] * key : 0) + sumEx(R.lfoRate, s, p) * 4);
    this.lfo.tick(lfoHz / blockRate, p[P.lfoShape], p[P.lfoStereo], p[P.lfoQuant]);
    let lfoAmt = p[P.lfoAmount] * factor(R.lfoAmount, s, p);
    if (p[P.lfoModWheel] >= 0.5) lfoAmt *= wheel;
    this.lfoOut[0] = this.lfo.out[0] * lfoAmt;
    this.lfoOut[1] = this.lfo.out[1] * lfoAmt;

    // --- Scan: rampa que arranca con la nota y desplaza la posición ---
    s[S_LFO] = this.lfoOut[0];
    const dist = p[P.scanDist];
    const speed = p[P.scanSpeed];
    if (speed > 0 && dist !== 0 && smp.len > 0) {
      const sp = speed * Math.pow(2, p[R.scanSpeed.key] * key + sumEx(R.scanSpeed, s, p) * 3);
      const step = (sp * n * smp.sr) / (sr * smp.len); // fracción del sample por bloque
      this.scan += dist > 0 ? step : -step;
      if (Math.abs(this.scan) >= Math.abs(dist)) this.scan = p[P.scanLoop] >= 0.5 ? 0 : dist;
    } else if (speed <= 0) this.scan = 0;

    const mode = p[P.mode];
    const vol = Math.pow(10, p[P.volume] / 20) * e1 * killGain;
    const filterOn = p[P.filterOn] >= 0.5;
    const buf = this.buf;
    const nch = smp.ch.length;

    for (let c = 0; c < 2; c++) {
      s[S_LFO] = this.lfoOut[c];

      // --- Valores de control del canal ---
      let sp = p[P.spread] + sumEx(R.spread, s, p);
      sp = sp < 0 ? 0 : sp > 1 ? 1 : sp;
      this.spreadEff = sp;
      const semis = p[P.transpose] + p[P.tune] * 0.01 + p[R.transpose.key] * key * 12
        + this.bend * p[P.pbRange] + sumEx(R.transpose, s, p) * 24 + (c === 0 ? -0.3 : 0.3) * sp;
      let rate = Math.pow(2, semis / 12) * (smp.sr / sr);
      if (rate > 64) rate = 64;
      this.cRate[c] = rate;
      let sz = p[P.size] * Math.pow(2, p[R.size.key] * key + sumEx(R.size, s, p) * 5);
      sz = sz < 2 ? 2 : sz > 2000 ? 2000 : sz;
      this.cSize[c] = sz * 0.001 * sr;
      let sh = p[P.shape] + sumEx(R.shape, s, p);
      this.cShape[c] = sh < 0 ? 0 : sh > 1 ? 1 : sh;
      let va = p[P.variation] + sumEx(R.variation, s, p) + p[R.variation.key] * key * 0.25;
      this.cVar[c] = va < 0 ? 0 : va > 1 ? 1 : va;
      this.cPos[c] = p[P.position] + sumEx(R.position, s, p) + p[R.position.key] * key * 0.25 + this.scan;
      this.cGain[c] = vol * factor(R.volume, s, p);
      if (c === 0) { const h = this.cPos[0]; this.head = h - Math.floor(h); }

      for (let i = 0; i < n; i++) buf[i] = 0;

      if (smp.len > 0) {
        // --- Planificador: lanza los granos que tocan dentro de este bloque (precisión de muestra) ---
        while (this.next[c] < n) {
          const at = this.next[c] | 0;
          this.next[c] += this.launch(c, at < 0 ? 0 : at, mode, p, smp, sr);
        }
        this.next[c] -= n;

        // --- Render de los granos activos ---
        this.renderGrains(c, smp.ch[c < nch ? c : 0], smp.len, n, rate);
      }

      // --- Filtro ---
      if (filterOn) {
        const f = p[P.filterFreq] * Math.pow(2, p[R.filterFreq.key] * key + sumEx(R.filterFreq, s, p) * 7);
        this.filt[c].set(p[P.filterMode], f, p[P.filterRes], p[P.filterWidth], sr);
        this.filt[c].process(buf, n);
      }

      // --- Mezcla con rampa de ganancia (sin escalones entre bloques) ---
      const out = c === 0 ? outL : outR;
      let g = this.prevGain[c];
      const dg = (this.cGain[c] - g) / n;
      for (let i = 0; i < n; i++) { g += dg; out[off + i] += buf[i] * g; }
      this.prevGain[c] = this.cGain[c];
    }
  }

  /**
   * Lanza un grano en el canal c. Tamaño, Shape y Variation se fijan aquí: los cambios de
   * Grain Size solo afectan al grano siguiente (el actual termina antes; sin clics).
   * Devuelve el intervalo en muestras hasta el siguiente grano.
   */
  private launch(c: number, at: number, mode: number, p: Float32Array, smp: SampleData, sr: number): number {
    const rng = this.rng[c];
    // Siempre se consumen los mismos aleatorios para que L y R sigan a la par con Spread = 0.
    const rSize = rng.bi(), rPos = rng.next(), rPitch = rng.bi(), rVol = rng.bi(), rMisc = rng.next();
    const v = this.cVar[c];

    let N = this.cSize[c] * Math.pow(2, rSize * p[P.varSize] * v * 2);
    const nMin = 0.002 * sr, nMax = 2 * sr;
    N = N < nMin ? nMin : N > nMax ? nMax : N;

    const len = smp.len;
    let pos = this.cPos[c];
    pos = (pos - Math.floor(pos)) * len; // Position + Scan > 100 % vuelve al principio
    pos += rPos * p[P.varPos] * v * smp.sr; // variación absoluta, solo positiva (0–2 s)

    let mul = 1;
    let gain = 1 + rVol * p[P.varVol] * v;
    let type = G_CLASSIC, a = 0, b = 0, interval: number;
    const limit = mode === MODE_CLOUD ? MAX_GRAINS : 4;

    if (mode === MODE_CLASSIC) {
      // Dos granos solapados al 50 %. Shape: 0 = ataque seco + decay exp., 0.5 = Hann, 1 = espejo.
      const sh = this.cShape[c];
      a = Math.abs(2 * sh - 1);
      b = sh > 0.5 ? 1 : 0;
      interval = N * 0.5;
    } else if (mode === MODE_LOOP) {
      // Grano con crossfade al inicio y al final; el siguiente empieza cuando este entra en su fundido.
      type = G_LOOP;
      let xf = this.cShape[c] * N * 0.5;
      if (xf < 32) xf = 32;
      if (xf > N * 0.5) xf = N * 0.5;
      a = N / xf; // inverso del ancho del fundido en fase
      interval = N - xf;
      if (rMisc < p[P.reverse]) { // Reverse: probabilidad de que el grano suene al revés
        pos += N * this.cRate[c];
        mul = -1;
      }
    } else {
      // Cloud: lanzamientos aleatorios no sincronizados; Density = número medio de granos solapados.
      type = G_HANN;
      const d = p[P.density];
      mul = Math.pow(2, rPitch * p[P.varPitch] * v * 2); // variación de pitch (solo Cloud), ±2 octavas
      gain *= 1.3 / Math.sqrt(d);
      interval = (N / d) * (0.5 + rMisc);
    }
    // Spread desincroniza el canal derecho.
    if (c === 1 && this.spreadEff > 0) interval *= 1 + this.spreadEff * 0.3 * rng.next();

    // Busca un slot libre; si no hay, el grano se descarta.
    const base = c * MAX_GRAINS;
    for (let k = base; k < base + limit; k++) {
      if (this.gActive[k]) continue;
      pos %= len;
      this.gActive[k] = 1;
      this.gPos[k] = pos;
      this.gPhase[k] = 0;
      this.gPhInc[k] = 1 / N;
      this.gMul[k] = mul;
      this.gGain[k] = gain;
      this.gType[k] = type;
      this.gA[k] = a; this.gB[k] = b;
      this.gStart[k] = at;
      break;
    }
    return interval < 1 ? 1 : interval;
  }

  private renderGrains(c: number, data: Float32Array, len: number, n: number, rate: number) {
    const buf = this.buf;
    const base = c * MAX_GRAINS;
    for (let k = base; k < base + MAX_GRAINS; k++) {
      if (!this.gActive[k]) continue;
      let pos = this.gPos[k], ph = this.gPhase[k];
      const inc = this.gMul[k] * rate, phInc = this.gPhInc[k], gg = this.gGain[k];
      const a = this.gA[k];
      let i = this.gStart[k];
      this.gStart[k] = 0;
      let alive = 1;
      switch (this.gType[k]) {
        case G_HANN:
          for (; i < n; i++) {
            const x = ph * TBL, xi = x | 0;
            const w = HANN[xi] + (x - xi) * (HANN[xi + 1] - HANN[xi]);
            const pi = pos | 0;
            buf[i] += (data[pi] + (pos - pi) * (data[pi + 1] - data[pi])) * w * gg;
            pos += inc; if (pos >= len) pos -= len; else if (pos < 0) pos += len;
            ph += phInc; if (ph >= 1) { alive = 0; break; }
          }
          break;
        case G_CLASSIC: {
          const mirror = this.gB[k] > 0;
          const invEdge = 1 / (phInc * 24); // rampa de 24 muestras en el extremo abrupto
          for (; i < n; i++) {
            const x = ph * TBL, xi = x | 0;
            const w = HANN[xi] + (x - xi) * (HANN[xi + 1] - HANN[xi]);
            const pe = mirror ? 1 - ph : ph;
            const y = pe * TBL, yi = y | 0;
            let e = EXPD[yi] + (y - yi) * (EXPD[yi + 1] - EXPD[yi]);
            const edge = pe * invEdge;
            if (edge < 1) e *= edge;
            const pi = pos | 0;
            buf[i] += (data[pi] + (pos - pi) * (data[pi + 1] - data[pi])) * (w + a * (e - w)) * gg;
            pos += inc; if (pos >= len) pos -= len; else if (pos < 0) pos += len;
            ph += phInc; if (ph >= 1) { alive = 0; break; }
          }
          break;
        }
        default:
          for (; i < n; i++) {
            let e = (ph < 0.5 ? ph : 1 - ph) * a;
            e = e < 1 ? e * e * (3 - 2 * e) : 1; // fundido suave que suma 1 con el grano vecino
            const pi = pos | 0;
            buf[i] += (data[pi] + (pos - pi) * (data[pi + 1] - data[pi])) * e * gg;
            pos += inc; if (pos >= len) pos -= len; else if (pos < 0) pos += len;
            ph += phInc; if (ph >= 1) { alive = 0; break; }
          }
      }
      this.gActive[k] = alive;
      this.gPos[k] = pos;
      this.gPhase[k] = ph;
    }
  }
}
