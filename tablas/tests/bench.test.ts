// Medida de rendimiento fuera del navegador: carga del DSP respecto al tiempo real.
import { describe, expect, it } from 'vitest';
import { makeEngine, render } from './helpers';

function bench(name: string, params: Record<string, number>, voices = 8, seconds = 6): number {
  const e = makeEngine(params);
  for (let i = 0; i < voices; i++) e.message({ t: 'on', id: i, note: 48 + i * 3, vel: 1 });
  render(e, 1); // calentamiento del JIT
  const t0 = performance.now();
  render(e, seconds);
  const load = (performance.now() - t0) / (seconds * 1000);
  console.log(`[bench] ${name}: ${(load * 100).toFixed(2)} % de un núcleo (${(1 / load).toFixed(0)}× tiempo real)`);
  return load;
}

describe('rendimiento', () => {
  it('8 notas', () => {
    bench('1 oscilador, sin unísono', { o1Pos: 0.5 });
    bench('2 osciladores + sub', { o1Pos: 0.5, o2Level: 0.8, subLevel: 0.5 });
    bench('2 osciladores × 4 de unísono', { o1Pos: 0.5, o2Level: 0.8, uniVoices: 4 });
    const worst = bench('2 osciladores × 8 de unísono con FM, LFO y filtro doble (128 osciladores)', {
      o1Pos: 0.5, o2Level: 0.8, uniVoices: 8, uniAmt: 0.5, o1Fx: 1, o1Fx1: 0.5, o2Fx: 3, o2Fx1: 0.5, o2Fx2: 0.5,
      filterMode: 2, 'filterFreq>lfo1': 0.5, 'o1Pos>lfo2': 0.3, subLevel: 0.5,
    });
    expect(worst).toBeLessThan(0.6);
  }, 60000);
});
