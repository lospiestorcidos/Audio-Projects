import { describe, expect, it } from 'vitest';
import { RingRecorder } from '../src/audio/worklet/ring';

const ramp = (from: number, n: number) => Float32Array.from({ length: n }, (_, i) => from + i);

describe('Fase 6 · buffer circular de Capture', () => {
  it('conserva solo los últimos segundos, en orden', () => {
    const r = new RingRecorder(100, 1); // 100 muestras
    for (let k = 0; k < 7; k++) r.write(ramp(k * 32, 32), null, 32);
    const [l] = r.grab()!;
    expect(l.length).toBe(100);
    expect(l[0]).toBe(224 - 100);
    expect(l[99]).toBe(223);
  });
  it('antes de llenarse devuelve solo lo grabado; vacío devuelve null', () => {
    const r = new RingRecorder(100, 1);
    expect(r.grab()).toBeNull();
    r.write(ramp(0, 40), null, 40);
    expect(r.grab()![0].length).toBe(40);
  });
  it('estéreo y cambio de Length conservando el final', () => {
    const r = new RingRecorder(100, 1);
    r.write(ramp(0, 80), ramp(1000, 80), 80);
    r.resize(0.5);
    const g = r.grab()!;
    expect(g.length).toBe(2);
    expect(g[0].length).toBe(50);
    expect(g[0][49]).toBe(79);
    expect(g[1][0]).toBe(1030);
  });
  it('un bloque mayor que el buffer no desborda', () => {
    const r = new RingRecorder(100, 0.1);
    r.write(ramp(0, 64), null, 64);
    const [l] = r.grab()!;
    expect(l.length).toBe(10);
    expect(l[9]).toBe(63);
  });
});
