// Utilidades de test: ejecutan el motor fuera del navegador.
import { GranosEngine } from '../src/audio/worklet/engine';
import { pidx } from '../src/shared/params';

export const SR = 48000;

/** Sample de prueba: 2 s de seno a 220 Hz con amplitud creciente (para distinguir posiciones). */
export function testSample(seconds = 2, freq = 220): Float32Array {
  const a = new Float32Array(seconds * SR);
  for (let i = 0; i < a.length; i++) a[i] = Math.sin((2 * Math.PI * freq * i) / SR) * 0.9;
  return a;
}

export function makeEngine(params: Record<string, number> = {}, stereo = false): GranosEngine {
  const e = new GranosEngine(SR);
  const s = testSample();
  e.message({ t: 'sample', ch: stereo ? [s, testSample(2, 330)] : [s], sr: SR });
  set(e, params);
  return e;
}

export function set(e: GranosEngine, params: Record<string, number>) {
  for (const k of Object.keys(params)) e.message({ t: 'param', i: pidx(k), v: params[k] });
}

/** Renderiza `seconds` y devuelve los dos canales. */
export function render(e: GranosEngine, seconds: number): [Float32Array, Float32Array] {
  const n = Math.round(seconds * SR);
  const L = new Float32Array(n), R = new Float32Array(n);
  const l = new Float32Array(128), r = new Float32Array(128);
  for (let off = 0; off < n; off += 128) {
    const m = Math.min(128, n - off);
    e.process(l, r, m);
    L.set(l.subarray(0, m), off); R.set(r.subarray(0, m), off);
  }
  return [L, R];
}

export function rms(a: Float32Array, from = 0, to = a.length): number {
  let s = 0;
  for (let i = from; i < to; i++) s += a[i] * a[i];
  return Math.sqrt(s / (to - from));
}

/** Mayor salto entre muestras consecutivas (detector de clics). */
export function maxStep(a: Float32Array): number {
  let m = 0;
  for (let i = 1; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - a[i - 1]));
  return m;
}

/** Frecuencia fundamental estimada por cruces por cero ascendentes. */
export function zeroCrossFreq(a: Float32Array, from = 0, to = a.length): number {
  let n = 0;
  for (let i = from + 1; i < to; i++) if (a[i - 1] <= 0 && a[i] > 0) n++;
  return (n * SR) / (to - from);
}

export function allFinite(a: Float32Array): boolean {
  for (let i = 0; i < a.length; i++) if (!Number.isFinite(a[i])) return false;
  return true;
}
