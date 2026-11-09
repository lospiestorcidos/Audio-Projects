// Motor completo de Granos, independiente del navegador: se puede ejecutar en un AudioWorklet
// o en Node (tests y medidas de rendimiento). Preparado para sustituirse por una versión Rust/WASM
// con la misma interfaz (message / process / telemetry).
import { defaultValues, pidx, type EngineMsg, type Telemetry } from '../../shared/params';
import { BLOCK, MAX_GRAINS, SampleData, Voice } from './voice';

export const NUM_VOICES = 8;
const MASTER_GAIN = 0.6;
const MAX_VIZ_GRAINS = 160;

const P_MONO = pidx('mono'), P_GLIDE = pidx('glide'), P_HOLD = pidx('hold');
const P_LFO_PHASE = pidx('lfoPhase'), P_LFO_RAND = pidx('lfoRandPhase');

interface StackNote { id: number; note: number; vel: number }

export class GranosEngine {
  readonly p = defaultValues();
  readonly smp = new SampleData();
  readonly voices: Voice[] = [];
  private sr: number;
  private wheel = 0;
  private clock = 1;
  private seed = 12345;
  /** Notas físicamente pulsadas. */
  private down = new Set<number>();
  /** Notas retenidas por Hold (ya soltadas). */
  private latched = new Set<number>();
  /** Pila de notas en modo mono. */
  private stack: StackNote[] = [];
  peak = 0;

  private vizGrains = new Float32Array(MAX_VIZ_GRAINS * 3);
  private vizHeads = new Float32Array(NUM_VOICES);
  private vizMod = new Float32Array(4);

  constructor(sampleRate: number) {
    this.sr = sampleRate;
    for (let i = 0; i < NUM_VOICES; i++) this.voices.push(new Voice());
  }

  message(m: EngineMsg) {
    switch (m.t) {
      case 'param': this.setParam(m.i, m.v); break;
      case 'params':
        for (let i = 0; i < m.a.length && i < this.p.length; i++) this.setParam(i, m.a[i]);
        break;
      case 'sample': this.smp.set(m.ch, m.sr); break;
      case 'on': this.noteOn(m.id, m.note, m.vel); break;
      case 'off': this.noteOff(m.id); break;
      case 'expr': {
        const v = this.find(m.id);
        if (v) v.expression(m.bend, m.slide, m.press);
        break;
      }
      case 'wheel': this.wheel = m.v; break;
      case 'panic':
        for (const v of this.voices) v.kill();
        this.down.clear(); this.latched.clear(); this.stack.length = 0;
        break;
    }
  }

  private setParam(i: number, v: number) {
    const old = this.p[i];
    this.p[i] = v;
    if (i === P_HOLD && old >= 0.5 && v < 0.5) this.releaseLatched();
    if (i === P_MONO && (old >= 0.5) !== (v >= 0.5)) {
      // Al cambiar entre poli y mono se sueltan todas las notas para no dejar voces colgadas.
      for (const vc of this.voices) if (vc.active) vc.release();
      this.stack.length = 0; this.latched.clear();
    }
  }

  private find(id: number): Voice | null {
    for (const v of this.voices) if (v.active && v.id === id) return v;
    return null;
  }

  private nextSeed(): number {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) | 0;
    return this.seed;
  }

  private lfoPhase(): number {
    return this.p[P_LFO_RAND] >= 0.5 ? (this.nextSeed() >>> 0) / 4294967296 : this.p[P_LFO_PHASE];
  }

  /** Suelta las notas retenidas por Hold que ya no están pulsadas. */
  private releaseLatched() {
    for (const id of this.latched) {
      const i = this.stack.findIndex((n) => n.id === id);
      if (i >= 0) this.stack.splice(i, 1);
      if (this.p[P_MONO] >= 0.5) continue;
      const v = this.find(id);
      if (v) v.release();
    }
    this.latched.clear();
    if (this.p[P_MONO] >= 0.5) {
      const v = this.voices[0];
      if (this.stack.length === 0) { if (v.active) v.release(); }
      else {
        const top = this.stack[this.stack.length - 1];
        if (v.id !== top.id) v.glideTo(top.id, top.note, this.p[P_GLIDE], this.sr);
      }
    }
  }

  private noteOn(id: number, note: number, vel: number) {
    // Hold: al soltar todas las teclas y tocar una nueva, se borran las retenidas.
    if (this.down.size === 0 && this.latched.size > 0) this.releaseLatched();
    this.latched.delete(id);
    this.down.add(id);
    const age = this.clock++;

    if (this.p[P_MONO] >= 0.5) {
      const v = this.voices[0];
      const overlap = this.stack.length > 0 && v.active && v.gate;
      const i = this.stack.findIndex((n) => n.id === id);
      if (i >= 0) this.stack.splice(i, 1);
      this.stack.push({ id, note, vel });
      // El Glide solo actúa en notas solapadas (legato); si no, se redispara.
      if (overlap) v.glideTo(id, note, this.p[P_GLIDE], this.sr);
      else v.start(id, note, vel, this.nextSeed(), this.lfoPhase(), age);
      return;
    }

    // Poli: misma nota → reutiliza su voz; si no, una libre; si no, roba.
    let v = this.find(id);
    if (!v) {
      for (const c of this.voices) if (!c.active) { v = c; break; }
    }
    if (!v) {
      // Prefiere robar una voz ya soltada (la de menor nivel); si no hay, la más antigua.
      let best: Voice | null = null;
      for (const c of this.voices) {
        if (!c.gate && (!best || c.env1.value < best.env1.value)) best = c;
      }
      if (!best) {
        best = this.voices[0];
        for (const c of this.voices) if (c.age < best.age) best = c;
      }
      v = best;
    }
    v.start(id, note, vel, this.nextSeed(), this.lfoPhase(), age);
  }

  private noteOff(id: number) {
    if (!this.down.delete(id)) return;
    if (this.p[P_HOLD] >= 0.5) { this.latched.add(id); return; }
    if (this.p[P_MONO] >= 0.5) {
      const i = this.stack.findIndex((n) => n.id === id);
      if (i >= 0) this.stack.splice(i, 1);
      const v = this.voices[0];
      if (this.stack.length === 0) { if (v.active && v.id === id) v.release(); }
      else {
        // Vuelve (con glide) a la última nota que sigue pulsada.
        const top = this.stack[this.stack.length - 1];
        if (v.id !== top.id) v.glideTo(top.id, top.note, this.p[P_GLIDE], this.sr);
      }
      return;
    }
    const v = this.find(id);
    if (v) v.release();
  }

  /** Genera n muestras estéreo (sobrescribe outL/outR). */
  process(outL: Float32Array, outR: Float32Array, n: number) {
    for (let i = 0; i < n; i++) { outL[i] = 0; outR[i] = 0; }
    const mono = this.p[P_MONO] >= 0.5;
    for (let off = 0; off < n; off += BLOCK) {
      const m = n - off < BLOCK ? n - off : BLOCK;
      for (let k = 0; k < NUM_VOICES; k++) {
        const v = this.voices[k];
        if (!v.active) continue;
        if (mono && k > 0 && v.gate) v.release(); // restos del modo poli
        v.render(this.p, this.smp, outL, outR, off, m, this.sr, this.wheel);
      }
    }
    // Ganancia maestra y saturación suave (cúbica) para que 8 voces no recorten en seco.
    let pk = this.peak;
    for (let i = 0; i < n; i++) {
      let l = outL[i] * MASTER_GAIN, r = outR[i] * MASTER_GAIN;
      l = l > 1.5 ? 1 : l < -1.5 ? -1 : l - 0.1481481 * l * l * l;
      r = r > 1.5 ? 1 : r < -1.5 ? -1 : r - 0.1481481 * r * r * r;
      outL[i] = l; outR[i] = r;
      const a = l < 0 ? -l : l;
      if (a > pk) pk = a;
    }
    this.peak = pk;
  }

  /** Instantánea para la UI. cpu lo mide quien llama a process(). */
  telemetry(cpu: number): Telemetry {
    let nv = 0, ng = 0, total = 0;
    let newest: Voice | null = null;
    const len = this.smp.len || 1;
    for (const v of this.voices) {
      if (!v.active) continue;
      this.vizHeads[nv++] = v.head;
      if (!newest || v.age > newest.age) newest = v;
      for (let k = 0; k < 2 * MAX_GRAINS; k++) {
        if (!v.gActive[k]) continue;
        total++;
        if (ng >= MAX_VIZ_GRAINS) continue;
        const ph = v.gPhase[k];
        this.vizGrains[ng * 3] = v.gPos[k] / len;
        this.vizGrains[ng * 3 + 1] = Math.sin(Math.PI * ph) * v.env1.value;
        this.vizGrains[ng * 3 + 2] = k < MAX_GRAINS ? 0 : 1;
        ng++;
      }
    }
    if (newest) {
      this.vizMod[0] = newest.env1.value; this.vizMod[1] = newest.env2.value;
      this.vizMod[2] = newest.lfoOut[0]; this.vizMod[3] = newest.lfoOut[1];
    } else this.vizMod.fill(0);
    const peak = this.peak;
    this.peak = 0;
    return {
      t: 'tel', cpu, voices: nv, grainCount: total,
      grains: this.vizGrains.slice(0, ng * 3), heads: this.vizHeads.slice(0, nv),
      mod: this.vizMod.slice(), peak,
    };
  }
}
