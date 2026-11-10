// Una voz de Tablas: dos osciladores de tabla de ondas con unísono y efectos, suboscilador,
// filtro, tres envolventes y dos LFO. Todo está preasignado: en el hilo de audio no se reserva memoria.
import { MOD_TABLE, SOURCES, pidx, LFO_DIV_BEATS, type SourceId } from '../../shared/params';
import { FRAME, LEVELS } from '../../shared/wavetable';
import { Envelope, ENV_IDLE } from './envelope';
import { Lfo } from './lfo';
import { DualSvf } from './filter';
import { Rng } from './rng';

/** Tamaño del bloque de control: LFO, envolventes y modulación se calculan cada BLOCK muestras. */
export const BLOCK = 16;
/** Máximo de voces de unísono por oscilador. */
export const MAX_UNISON = 8;

const FX_FM = 1, FX_CLASSIC = 2, FX_MODERN = 3;
const STRIDE = FRAME + 1;
const TAU = Math.PI * 2;
/** Frecuencia de la nota MIDI 60. */
const C_REF = 261.6255653;

const S = (id: SourceId) => SOURCES.indexOf(id);
const S_LFO1 = S('lfo1'), S_LFO2 = S('lfo2'), S_ENV1 = S('env1'), S_ENV2 = S('env2'), S_ENV3 = S('env3');
const S_KEY = S('key'), S_VEL = S('vel'), S_BEND = S('bend'), S_SLIDE = S('slide'), S_PRESS = S('press');
const S_RAND = S('rand');

// Índices de parámetros (resueltos una sola vez al cargar el módulo).
const osc = (n: number) => ({
  pos: pidx(`o${n}Pos`), fx: pidx(`o${n}Fx`), fx1: pidx(`o${n}Fx1`), fx2: pidx(`o${n}Fx2`),
  semi: pidx(`o${n}Semi`), fine: pidx(`o${n}Fine`), level: pidx(`o${n}Level`),
});
const env = (n: number) => ({
  a: pidx(`e${n}A`), d: pidx(`e${n}D`), s: pidx(`e${n}S`), r: pidx(`e${n}R`), key: pidx(`e${n}Key`),
});
const lfo = (n: number) => ({
  mode: pidx(`lfo${n}Mode`), rate: pidx(`lfo${n}Rate`), div: pidx(`lfo${n}Div`), audio: pidx(`lfo${n}Audio`),
  shape: pidx(`lfo${n}Shape`), phase: pidx(`lfo${n}Phase`), randPhase: pidx(`lfo${n}RandPhase`),
  stereo: pidx(`lfo${n}Stereo`), quant: pidx(`lfo${n}Quant`), amount: pidx(`lfo${n}Amount`),
});
const P = {
  osc: [osc(1), osc(2)], env: [env(1), env(2), env(3)], lfo: [lfo(1), lfo(2)],
  subLevel: pidx('subLevel'), subOct: pidx('subOct'), subTone: pidx('subTone'),
  uniMode: pidx('uniMode'), uniVoices: pidx('uniVoices'), uniAmt: pidx('uniAmt'),
  oscSpread: pidx('oscSpread'), volume: pidx('volume'),
  filterOn: pidx('filterOn'), filterMode: pidx('filterMode'), filterFreq: pidx('filterFreq'),
  filterRes: pidx('filterRes'), filterWidth: pidx('filterWidth'),
  transpose: pidx('transpose'), pbRange: pidx('pbRange'), bpm: pidx('bpm'), lfoModWheel: pidx('lfoModWheel'),
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
  pos: [route('o1Pos'), route('o2Pos')], fx1: [route('o1Fx1'), route('o2Fx1')], fx2: [route('o1Fx2'), route('o2Fx2')],
  transpose: route('transpose'), uniAmt: route('uniAmt'), volume: route('volume'), filterFreq: route('filterFreq'),
  lfoRate: [route('lfo1Rate'), route('lfo2Rate')], lfoAmount: [route('lfo1Amount'), route('lfo2Amount')],
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
    else if (k === S_LFO1 || k === S_LFO2) { const m = 1 + a * v; f *= m > 0 ? m : 0; }
    else f *= a >= 0 ? 1 - a + a * v : 1 + a * v;
  }
  return f;
}
// Tabla de seno (con guarda) para el modulador de FM y el suboscilador: más barata que Math.sin.
const SIN_N = 4096;
const SIN = new Float32Array(SIN_N + 1);
for (let i = 0; i <= SIN_N; i++) SIN[i] = Math.sin((TAU * i) / SIN_N);

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Tabla de un oscilador, ya limitada en banda. La comparten todas las voces. */
export class TableData {
  data: Float32Array | null = null;
  frames = 0;
  set(data: Float32Array, frames: number) {
    if (data.length !== LEVELS * frames * STRIDE) { this.data = null; this.frames = 0; return; }
    this.data = data;
    this.frames = frames;
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

  env = [new Envelope(), new Envelope(), new Envelope()];
  lfo = [new Lfo(), new Lfo()];
  /** Salida de cada LFO ya con Amount: [lfo1 L, lfo1 R, lfo2 L, lfo2 R]. */
  lfoOut = new Float32Array(4);
  /** Posición real (0..1) de cada oscilador, para el display. */
  posOut = new Float32Array(2);
  /** Osciladores que sonaron en el último bloque (con unísono). */
  oscCount = 0;

  // Nota con glide (en octavas respecto a la nota 60).
  private keyOct = 0;
  private keyInc = 0;
  private keySteps = 0;
  // Expresión MPE: objetivo y valor suavizado.
  private bendT = 0; private slideT = 0; private pressT = 0;
  private bend = 0; private slide = 0; private press = 0;
  private exprFresh = true;
  private randNote = 0;
  private src = new Float32Array(SOURCES.length);

  // Estado de los osciladores: [osc * MAX_UNISON + voz de unísono].
  private phase = new Float64Array(2 * MAX_UNISON);
  private mphase = new Float64Array(2 * MAX_UNISON); // modulador de FM
  private rDet = new Float32Array(2 * MAX_UNISON); // desafinación aleatoria por nota (modo Aleatorio)
  private rPan = new Float32Array(2 * MAX_UNISON);
  private subPhase = 0;
  // Reparto de unísono ya calculado (razón de frecuencia y ganancias L/R); solo se rehace si cambia algo.
  private uRatio = new Float32Array(2 * MAX_UNISON);
  private uGl = new Float32Array(2 * MAX_UNISON);
  private uGr = new Float32Array(2 * MAX_UNISON);
  private uPos = new Float32Array(2 * MAX_UNISON);
  private uSig = new Float64Array(2).fill(-1);

  private cGain = new Float32Array(2);
  private prevGain = new Float32Array(2);
  private filt = [new DualSvf(), new DualSvf()];
  private bufL = new Float32Array(BLOCK);
  private bufR = new Float32Array(BLOCK);

  // Robo de voz sin clic: fundido rápido y después arranca la nota pendiente.
  private killBlocks = 0;
  private pendId = 0; private pendNote = 0; private pendVel = 0; private pendSeed = 0;

  /** Inicia una nota. Si la voz está sonando, la apaga en ~3 ms antes de arrancar. */
  start(id: number, note: number, vel: number, seed: number, age: number, p: Float32Array) {
    this.age = age;
    if (this.active && this.env[0].value > 0.005) {
      this.pendId = id; this.pendNote = note; this.pendVel = vel; this.pendSeed = seed;
      this.killBlocks = 8;
      this.id = id; // la voz ya responde a este id (note-off, expresión)
      this.gate = true;
      return;
    }
    this.doStart(id, note, vel, seed, p);
  }

  private doStart(id: number, note: number, vel: number, seed: number, p: Float32Array) {
    this.active = true;
    this.id = id; this.note = note; this.vel = vel;
    this.gate = true;
    this.killBlocks = 0;
    this.keyOct = (note - 60) / 12;
    this.keySteps = 0;
    this.bendT = this.slideT = this.pressT = 0;
    this.bend = this.slide = this.press = 0;
    this.exprFresh = true;
    const rng = new Rng(seed);
    this.randNote = rng.bi();
    const unison = p[P.uniVoices] > 1;
    for (let i = 0; i < 2 * MAX_UNISON; i++) {
      // Con una sola voz se arranca en fase 0 (ataque siempre igual); con unísono, fases repartidas.
      this.phase[i] = unison ? rng.next() : 0;
      this.mphase[i] = 0;
      this.rDet[i] = rng.bi(); this.rPan[i] = rng.bi();
    }
    this.subPhase = 0;
    this.uSig.fill(-1); // los valores aleatorios de unísono han cambiado
    for (const e of this.env) { e.reset(); e.gateOn(); }
    for (let n = 0; n < 2; n++) {
      const L = P.lfo[n];
      this.lfo[n].reset(p[L.randPhase] >= 0.5 ? rng.next() : p[L.phase], seed * 31 + 7 + n * 101);
    }
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
    for (const e of this.env) e.gateOff();
  }

  kill() { this.active = false; this.gate = false; this.oscCount = 0; for (const e of this.env) e.reset(); }

  expression(bend: number, slide: number, press: number) {
    this.bendT = bend; this.slideT = slide; this.pressT = press;
    if (this.exprFresh) { this.bend = bend; this.slide = slide; this.press = press; this.exprFresh = false; }
  }

  /** Renderiza n (≤ BLOCK) muestras y las suma en outL/outR a partir de off. */
  render(
    p: Float32Array, tables: TableData[], outL: Float32Array, outR: Float32Array,
    off: number, n: number, sr: number, wheel: number,
  ) {
    // --- Robo de voz ---
    let killGain = 1;
    if (this.killBlocks > 0) {
      this.killBlocks--;
      killGain = this.killBlocks / 8;
      if (this.killBlocks === 0) {
        this.doStart(this.pendId, this.pendNote, this.pendVel, this.pendSeed, p);
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
    for (let e = 0; e < 3; e++) {
      const E = P.env[e];
      s[S_ENV1 + e] = this.env[e].tick(p[E.a], p[E.d], p[E.s], p[E.r], blockRate, Math.pow(2, -p[E.key] * key));
    }
    if (this.env[0].state === ENV_IDLE && !this.gate) { this.kill(); return; }
    const e1 = s[S_ENV1];

    s[S_KEY] = key; s[S_VEL] = this.vel;
    s[S_BEND] = this.bend; s[S_SLIDE] = this.slide; s[S_PRESS] = this.press; s[S_RAND] = this.randNote;
    s[S_LFO1] = 0; s[S_LFO2] = 0;

    // --- LFO ---
    for (let l = 0; l < 2; l++) {
      const L = P.lfo[l], rr = R.lfoRate[l];
      const m = p[L.mode];
      let hz = m === 1 ? p[P.bpm] / 60 / LFO_DIV_BEATS[p[L.div]] : m === 2 ? p[L.audio] : p[L.rate];
      hz *= Math.pow(2, p[rr.key] * key + sumEx(rr, s, p) * 4);
      this.lfo[l].tick(hz / blockRate, p[L.shape], p[L.stereo], p[L.quant]);
      let amt = p[L.amount] * factor(R.lfoAmount[l], s, p);
      if (l === 0 && p[P.lfoModWheel] >= 0.5) amt *= wheel;
      this.lfoOut[l * 2] = this.lfo[l].out[0] * amt;
      this.lfoOut[l * 2 + 1] = this.lfo[l].out[1] * amt;
    }
    // Los osciladores usan el lado izquierdo de los LFO; filtro y volumen, cada canal el suyo.
    s[S_LFO1] = this.lfoOut[0]; s[S_LFO2] = this.lfoOut[2];

    // --- Afinación común ---
    const semis = p[P.transpose] + p[R.transpose.key] * key * 12 + this.bend * p[P.pbRange]
      + sumEx(R.transpose, s, p) * 24;
    const uniN = Math.max(1, Math.min(MAX_UNISON, Math.round(p[P.uniVoices])));
    const uniAmt = clamp01(p[P.uniAmt] + sumEx(R.uniAmt, s, p));
    const uniMode = p[P.uniMode];
    const spread = p[P.oscSpread];

    const bufL = this.bufL, bufR = this.bufR;
    for (let i = 0; i < n; i++) { bufL[i] = 0; bufR[i] = 0; }
    let count = 0;

    // --- Osciladores ---
    for (let o = 0; o < 2; o++) {
      const O = P.osc[o], tb = tables[o];
      const level = p[O.level];
      const pos = clamp01(p[O.pos] + sumEx(R.pos[o], s, p) + p[R.pos[o].key] * key * 0.25);
      this.posOut[o] = pos;
      if (level <= 0 || !tb.data) continue;
      const fx = p[O.fx];
      const fx1 = clamp01(p[O.fx1] + sumEx(R.fx1[o], s, p));
      const fx2 = clamp01(p[O.fx2] + sumEx(R.fx2[o], s, p));
      let freq = C_REF * Math.pow(2, (semis + p[O.semi] + p[O.fine] * 0.01) / 12);
      if (freq > sr * 0.45) freq = sr * 0.45;
      // El reparto de unísono (desafinación, paneo y desplazamiento de posición) solo se recalcula
      // cuando cambia alguno de sus controles: ahorra potencias y trigonometría en cada bloque.
      const sig = uniN + uniMode * 16 + uniAmt * 1024 + spread * 65536 + level * 4194304;
      if (sig !== this.uSig[o]) {
        this.uSig[o] = sig;
        const g = level / Math.sqrt(uniN);
        const oscPan = o === 0 ? -spread : spread;
        for (let u = 0; u < uniN; u++) {
          const k = o * MAX_UNISON + u;
          const sp = uniN > 1 ? (u / (uniN - 1)) * 2 - 1 : 0; // reparto de -1 a 1
          let det = 0, pan = oscPan, dpos = 0;
          if (uniN > 1) {
            if (uniMode === 0) { det = sp * uniAmt * 0.5; pan += sp * uniAmt; }
            else if (uniMode === 1) { det = sp * uniAmt * 0.08; pan += sp * uniAmt; dpos = sp * uniAmt * 0.5; }
            else { det = this.rDet[k] * uniAmt * 0.5; pan += this.rPan[k] * uniAmt; }
          }
          pan = pan < -1 ? -1 : pan > 1 ? 1 : pan;
          const a = (pan + 1) * (Math.PI / 4); // paneo de potencia constante
          this.uRatio[k] = Math.pow(2, det / 12);
          this.uGl[k] = g * Math.cos(a) * 1.4142;
          this.uGr[k] = g * Math.sin(a) * 1.4142;
          this.uPos[k] = dpos;
        }
      }
      for (let u = 0; u < uniN; u++) {
        const k = o * MAX_UNISON + u;
        const f = freq * this.uRatio[k];
        const posU = this.uPos[k] === 0 ? pos : clamp01(pos + this.uPos[k]);
        this.renderOsc(k, tb, posU, f / sr, fx, fx1, fx2, this.uGl[k], this.uGr[k], n, f, sr);
        count++;
      }
    }

    // --- Suboscilador: seno que Tono va saturando hacia cuadrada ---
    const subLevel = p[P.subLevel];
    if (subLevel > 0) {
      const inc = (C_REF * Math.pow(2, semis / 12 + p[P.subOct] - 2)) / sr;
      const a = p[P.subTone] * 8, norm = subLevel * (1 + a);
      let ph = this.subPhase;
      for (let i = 0; i < n; i++) {
        const t = ph * SIN_N, ti = t | 0;
        const x = SIN[ti] + (t - ti) * (SIN[ti + 1] - SIN[ti]);
        const y = (x * norm) / (1 + a * (x < 0 ? -x : x));
        bufL[i] += y; bufR[i] += y;
        ph += inc; if (ph >= 1) ph -= 1;
      }
      this.subPhase = ph;
      count++;
    }
    this.oscCount = count;

    // --- Filtro y mezcla por canal ---
    const vol = Math.pow(10, p[P.volume] / 20) * e1 * killGain;
    const filterOn = p[P.filterOn] >= 0.5;
    for (let c = 0; c < 2; c++) {
      s[S_LFO1] = this.lfoOut[c]; s[S_LFO2] = this.lfoOut[2 + c];
      const buf = c === 0 ? bufL : bufR;
      if (filterOn) {
        const f = p[P.filterFreq] * Math.pow(2, p[R.filterFreq.key] * key + sumEx(R.filterFreq, s, p) * 7);
        this.filt[c].set(p[P.filterMode], f, p[P.filterRes], p[P.filterWidth], sr);
        this.filt[c].process(buf, n);
      }
      this.cGain[c] = vol * factor(R.volume, s, p);
      // Rampa de ganancia (sin escalones entre bloques).
      const out = c === 0 ? outL : outR;
      let g = this.prevGain[c];
      const dg = (this.cGain[c] - g) / n;
      for (let i = 0; i < n; i++) { g += dg; out[off + i] += buf[i] * g; }
      this.prevGain[c] = this.cGain[c];
    }
  }

  /**
   * Una voz de unísono de un oscilador. Lee la tabla interpolando entre muestras y entre los dos
   * ciclos vecinos de la posición, en el nivel de mipmap que no produce aliasing a esa frecuencia.
   */
  private renderOsc(
    k: number, tb: TableData, pos: number, inc: number, fx: number, fx1: number, fx2: number,
    gl: number, gr: number, n: number, freq: number, sr: number,
  ) {
    const T = tb.data!, F = tb.frames;
    // Nivel de mipmap: armónicos que caben por debajo de Nyquist (el sync sube la frecuencia efectiva).
    const eff = fx === FX_CLASSIC ? freq * (1 + fx2 * 7) : freq;
    const maxH = (sr * 0.5) / eff;
    let lv = 0;
    while (lv < LEVELS - 1 && 1024 >> lv > maxH) lv++;
    // Ciclos vecinos de la posición.
    const x = pos * (F - 1), f0 = x | 0, pf = x - f0;
    const a0 = (lv * F + f0) * STRIDE, a1 = (lv * F + (f0 + 1 < F ? f0 + 1 : f0)) * STRIDE;
    const bufL = this.bufL, bufR = this.bufR;
    let ph = this.phase[k];

    if (fx === FX_FM) {
      // FM (modulación de fase): FX 1 = cantidad, FX 2 = afinación del modulador (0,5× a 8×).
      const depth = fx1 * 0.6, minc = inc * (0.5 + Math.round(fx2 * 15) * 0.5);
      let mph = this.mphase[k];
      for (let i = 0; i < n; i++) {
        let q = ph + depth * SIN[(mph * SIN_N) | 0];
        q -= Math.floor(q);
        const t = q * FRAME, ti = t | 0, fr = t - ti;
        const s0 = T[a0 + ti] + fr * (T[a0 + ti + 1] - T[a0 + ti]);
        const s1 = T[a1 + ti] + fr * (T[a1 + ti + 1] - T[a1 + ti]);
        const v = s0 + pf * (s1 - s0);
        bufL[i] += v * gl; bufR[i] += v * gr;
        ph += inc; if (ph >= 1) ph -= 1;
        mph += minc; if (mph >= 1) mph -= Math.floor(mph);
      }
      this.mphase[k] = mph;
    } else if (fx === FX_CLASSIC) {
      // Classic: FX 1 = ancho de pulso (comprime medio ciclo), FX 2 = sync (repite el ciclo).
      const pw = 0.5 - fx1 * 0.47, ka = 0.5 / pw, kb = 0.5 / (1 - pw), sync = 1 + fx2 * 7;
      for (let i = 0; i < n; i++) {
        let q = ph < pw ? ph * ka : 0.5 + (ph - pw) * kb;
        q *= sync; q -= Math.floor(q);
        const t = q * FRAME, ti = t | 0, fr = t - ti;
        const s0 = T[a0 + ti] + fr * (T[a0 + ti + 1] - T[a0 + ti]);
        const s1 = T[a1 + ti] + fr * (T[a1 + ti + 1] - T[a1 + ti]);
        const v = s0 + pf * (s1 - s0);
        bufL[i] += v * gl; bufR[i] += v * gr;
        ph += inc; if (ph >= 1) ph -= 1;
      }
    } else if (fx === FX_MODERN) {
      // Modern: FX 1 = warp (dobla la fase), FX 2 = fold (pliega la onda).
      // El warp es una curva racional (q = ph / (ph + c·(1 − ph))): dobla la fase sin potencias por muestra.
      const c = Math.pow(2, fx1 * 3), drive = 1 + fx2 * 6, warp = fx1 > 0, fold = fx2 > 0;
      for (let i = 0; i < n; i++) {
        const q = warp ? ph / (ph + c * (1 - ph)) : ph;
        const t = q * FRAME, ti = t | 0, fr = t - ti;
        const s0 = T[a0 + ti] + fr * (T[a0 + ti + 1] - T[a0 + ti]);
        const s1 = T[a1 + ti] + fr * (T[a1 + ti + 1] - T[a1 + ti]);
        let v = s0 + pf * (s1 - s0);
        if (fold) {
          let w = (v * drive + 1) * 0.25;
          w -= Math.floor(w);
          v = 1 - 4 * (w < 0.5 ? 0.5 - w : w - 0.5);
        }
        bufL[i] += v * gl; bufR[i] += v * gr;
        ph += inc; if (ph >= 1) ph -= 1;
      }
    } else {
      for (let i = 0; i < n; i++) {
        const t = ph * FRAME, ti = t | 0, fr = t - ti;
        const s0 = T[a0 + ti] + fr * (T[a0 + ti + 1] - T[a0 + ti]);
        const s1 = T[a1 + ti] + fr * (T[a1 + ti + 1] - T[a1 + ti]);
        const v = s0 + pf * (s1 - s0);
        bufL[i] += v * gl; bufR[i] += v * gr;
        ph += inc; if (ph >= 1) ph -= 1;
      }
    }
    this.phase[k] = ph;
  }
}
