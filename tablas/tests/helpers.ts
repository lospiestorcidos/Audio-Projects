// Utilidades de test: ejecutan el motor fuera del navegador.
import { TablasEngine } from '../src/audio/worklet/engine';
import { pidx } from '../src/shared/params';
import { buildMipmaps, factoryTable } from '../src/shared/wavetable';

export const SR = 48000;

export function makeEngine(params: Record<string, number> = {}, tables = ['Básica', 'Formantes']): TablasEngine {
  const e = new TablasEngine(SR);
  tables.forEach((name, osc) => {
    const t = factoryTable(name);
    e.message({ t: 'table', osc, frames: t.count, data: buildMipmaps(t) });
  });
  set(e, params);
  return e;
}

export function set(e: TablasEngine, params: Record<string, number>) {
  for (const k of Object.keys(params)) e.message({ t: 'param', i: pidx(k), v: params[k] });
}

/** Renderiza `seconds` y devuelve los dos canales. */
export function render(e: TablasEngine, seconds: number): [Float32Array, Float32Array] {
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
