import { describe, expect, it } from 'vitest';
import { fft } from '../src/shared/fft';
import {
  buildMipmaps, FACTORY_TABLES, factoryTable, FRAME, fromHarmonics, LEVELS, looksLikeWavetable,
  tableFromAudio, tableFromCycles,
} from '../src/shared/wavetable';

/** Amplitud de cada armónico de un ciclo. */
function spectrum(cycle: ArrayLike<number>): Float64Array {
  const re = Float64Array.from({ length: FRAME }, (_, i) => cycle[i]), im = new Float64Array(FRAME);
  fft(re, im);
  return Float64Array.from({ length: FRAME / 2 }, (_, h) => Math.hypot(re[h], im[h]) / (FRAME / 2));
}

describe('FFT y tablas de ondas', () => {
  it('FFT ida y vuelta devuelve la señal', () => {
    const x = Float64Array.from({ length: 64 }, (_, i) => Math.sin(i * 0.7) + 0.3 * Math.cos(i * 2.1));
    const re = x.slice(), im = new Float64Array(64);
    fft(re, im); fft(re, im, true);
    for (let i = 0; i < 64; i++) expect(re[i] / 64).toBeCloseTo(x[i], 9);
  });
  it('fromHarmonics coloca cada armónico con su amplitud', () => {
    const s = spectrum(fromHarmonics([1, 0, 0.5, 0, 0.25]));
    expect(s[1]).toBeCloseTo(1, 5); expect(s[2]).toBeCloseTo(0, 5);
    expect(s[3]).toBeCloseTo(0.5, 5); expect(s[5]).toBeCloseTo(0.25, 5);
  });
  it('cada nivel de mipmap no tiene armónicos por encima de su límite', () => {
    const t = factoryTable('Pulso');
    const m = buildMipmaps(t), stride = FRAME + 1;
    for (const k of [0, 3, 6, 10]) {
      const base = (k * t.count + 40) * stride;
      const s = spectrum(m.subarray(base, base + FRAME));
      const maxH = 1024 >> k;
      let above = 0, below = 0;
      for (let h = 1; h < FRAME / 2; h++) { if (h > maxH) above = Math.max(above, s[h]); else below = Math.max(below, s[h]); }
      expect(above).toBeLessThan(1e-6);
      expect(below).toBeGreaterThan(0.1);
      expect(m[base + FRAME]).toBe(m[base]); // muestra de guarda
    }
    expect(m.length).toBe(LEVELS * t.count * stride);
  });
  it('todas las tablas de fábrica son válidas, sin continua y normalizadas', () => {
    for (const name of FACTORY_TABLES) {
      const t = factoryTable(name);
      expect(t.data.length).toBe(t.count * FRAME);
      const m = buildMipmaps(t);
      let peak = 0, ok = true;
      for (let i = 0; i < t.count * (FRAME + 1); i++) { if (!Number.isFinite(m[i])) ok = false; peak = Math.max(peak, Math.abs(m[i])); }
      expect(ok).toBe(true);
      expect(peak).toBeCloseTo(1, 3);
      // El primer y el último ciclo son distintos: la posición hace algo.
      let diff = 0;
      for (let i = 0; i < FRAME; i++) diff = Math.max(diff, Math.abs(t.data[i] - t.data[(t.count - 1) * FRAME + i]));
      expect(diff).toBeGreaterThan(0.05);
    }
  });
  it('importa ciclos seguidos y estira audio corto a un ciclo', () => {
    expect(looksLikeWavetable(FRAME * 16)).toBe(true);
    expect(looksLikeWavetable(FRAME * 16 + 5)).toBe(false);
    const t = tableFromCycles('x', new Float32Array(FRAME * 3 + 100));
    expect(t.count).toBe(3);
    expect(tableFromCycles('y', new Float32Array(600).fill(0.5)).count).toBe(1);
  });
  it('tabla desde audio: el espectro de cada ciclo sigue al sonido', () => {
    // Audio que pasa de 500 Hz a 3000 Hz: el armónico dominante de la tabla debe subir.
    const sr = 48000, a = new Float32Array(sr);
    for (let i = 0; i < sr; i++) a[i] = Math.sin((2 * Math.PI * (i < sr / 2 ? 500 : 3000) * i) / sr);
    const t = tableFromAudio('z', a, 16);
    const top = (f: number) => { const s = spectrum(t.data.subarray(f * FRAME, (f + 1) * FRAME)); let b = 1; for (let h = 2; h < 600; h++) if (s[h] > s[b]) b = h; return b; };
    expect(Math.abs(top(1) - (500 * FRAME) / sr)).toBeLessThan(2);
    expect(Math.abs(top(14) - (3000 * FRAME) / sr)).toBeLessThan(2);
  });
});
