// Medida de rendimiento fuera del navegador: carga del DSP respecto al tiempo real.
import { describe, expect, it } from 'vitest';
import { makeEngine, render } from './helpers';

function bench(name: string, params: Record<string, number>, voices = 8, seconds = 10): number {
  const e = makeEngine(params, true);
  for (let i = 0; i < voices; i++) e.message({ t: 'on', id: i, note: 48 + i * 3, vel: 1 });
  render(e, 1); // calentamiento del JIT
  const t0 = performance.now();
  render(e, seconds);
  const load = (performance.now() - t0) / (seconds * 1000);
  console.log(`[bench] ${name}: ${(load * 100).toFixed(2)} % de un núcleo (${(1 / load).toFixed(0)}× tiempo real)`);
  return load;
}

describe('rendimiento', () => {
  it('8 voces en los tres modos', () => {
    bench('Classic, 8 voces, filtro LP24', { mode: 0, size: 100 });
    bench('Loop, 8 voces, filtro LP24', { mode: 1, size: 400 });
    bench('Cloud ×20, 8 voces, sin filtro', { mode: 2, size: 300, density: 20, filterOn: 0 });
    const worst = bench('Cloud ×20, 8 voces, filtro doble + LFO + variación', {
      mode: 2, size: 300, density: 20, filterMode: 2, variation: 1, varPos: 1, varPitch: 0.5,
      spread: 1, 'filterFreq>lfo': 0.5, 'position>lfo': 0.3, lfoRate: 3,
    });
    expect(worst).toBeLessThan(0.5);
  });
});
