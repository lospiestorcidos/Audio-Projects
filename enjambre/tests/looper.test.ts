import { describe, expect, it } from 'vitest';
import { EnjambreEngine } from '../src/audio/worklet/engine';
import { LOOP_DUB, LOOP_EMPTY, LOOP_PLAY, LOOP_REC, LOOP_STOP, Looper } from '../src/audio/worklet/looper';
import { pidx, stepSeconds } from '../src/shared/params';

const SR = 48000;

describe('Looper (solo)', () => {
  /** Pasa n muestras por el looper; input(i) da la entrada. Devuelve la salida izquierda. */
  function feed(lp: Looper, n: number, input: (i: number) => number, speed = 1, reverse = false, fade = 0.01): Float32Array {
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = input(i); lp.tick(x, x, speed, reverse, fade); out[i] = lp.outL; }
    return out;
  }
  const ramp = (i: number) => ((i % 1000) / 1000) * 0.5 + 0.1;

  it('grabar, cerrar y reproducir: el bucle suena igual que lo grabado', () => {
    const lp = new Looper(SR);
    lp.action('loop', false); expect(lp.state).toBe(LOOP_REC);
    feed(lp, SR / 2, ramp);
    lp.action('loop', false); expect(lp.state).toBe(LOOP_PLAY);
    expect(lp.len).toBe(SR / 2);
    const out = feed(lp, SR / 2, () => 0);
    for (const i of [1000, 7000, 20000]) expect(out[i]).toBeCloseTo(ramp(i), 5);
  });
  it('sobregrabar suma una capa; deshacer la quita; la siguiente sobregrabación fija la anterior', () => {
    const lp = new Looper(SR);
    lp.action('rec', false); feed(lp, 24000, () => 0.2); lp.action('play', false);
    lp.action('dub', false); expect(lp.state).toBe(LOOP_DUB);
    feed(lp, 24000, () => 0.1); // una vuelta entera sobregrabando
    lp.action('dub', false); expect(lp.state).toBe(LOOP_PLAY);
    expect(feed(lp, 24000, () => 0)[5000]).toBeCloseTo(0.3, 5);
    lp.action('undo', false); expect(lp.hasLayer).toBe(false);
    expect(feed(lp, 24000, () => 0)[5000]).toBeCloseTo(0.2, 5);
    // Dos sobregrabaciones seguidas: deshacer solo quita la última.
    lp.action('dub', false); feed(lp, 24000, () => 0.1); lp.action('dub', false);
    lp.action('dub', false); feed(lp, 24000, () => 0.05); lp.action('dub', false);
    lp.action('undo', false);
    expect(feed(lp, 24000, () => 0)[5000]).toBeCloseTo(0.3, 5);
  });
  it('parar con fundido, volver a empezar desde el principio, y borrar', () => {
    const lp = new Looper(SR);
    lp.action('loop', false); feed(lp, 24000, () => 0.5); lp.action('loop', false);
    lp.action('stop', false);
    const out = feed(lp, SR, () => 0, 1, false, 0.5); // fundido de 0,5 s
    expect(Math.abs(out[1000])).toBeGreaterThan(0.4); // (las primeras muestras llevan el fundido de la costura)
    expect(Math.abs(out[12000])).toBeLessThan(0.4);
    expect(lp.state).toBe(LOOP_STOP);
    expect(Math.abs(out[SR - 1])).toBe(0);
    lp.action('loop', false); expect(lp.state).toBe(LOOP_PLAY); expect(lp.pos).toBe(0);
    lp.action('clear', false); feed(lp, 1000, () => 0);
    expect(lp.state).toBe(LOOP_EMPTY); expect(lp.len).toBe(0);
  });
  it('velocidad 2x tarda la mitad; Reverse lee hacia atrás', () => {
    const lp = new Looper(SR);
    lp.action('loop', false); feed(lp, 10000, (i) => i / 10000); lp.action('loop', false);
    const fast = feed(lp, 2500, () => 0, 2);
    expect(fast[2000]).toBeCloseTo(0.4, 3); // la muestra 4000 del bucle
    lp.action('stop', false); feed(lp, 2000, () => 0); lp.action('play', false);
    const rev = feed(lp, 3000, () => 0, 1, true);
    expect(rev[2000]).toBeCloseTo(0.8, 3); // desde 0 hacia atrás: la muestra 8000
  });
  it('un toque doble por error (menos de 50 ms) no deja un bucle', () => {
    const lp = new Looper(SR);
    lp.action('loop', false); feed(lp, 1000, () => 0.3); lp.action('loop', false);
    expect(lp.state).toBe(LOOP_EMPTY);
  });
  it('Cuantizar: grabar y cerrar esperan al siguiente paso', () => {
    const lp = new Looper(SR);
    lp.action('loop', true); expect(lp.state).toBe(LOOP_EMPTY);
    lp.onStep(); expect(lp.state).toBe(LOOP_REC);
    feed(lp, 20000, () => 0.2);
    lp.action('loop', true); feed(lp, 4000, () => 0.2); expect(lp.state).toBe(LOOP_REC);
    lp.onStep(); expect(lp.state).toBe(LOOP_PLAY); expect(lp.len).toBe(24000);
  });
});

describe('Looper dentro del efecto', () => {
  function make(params: Record<string, number>): EnjambreEngine {
    const e = new EnjambreEngine(SR);
    for (const [k, v] of Object.entries({ mix: 0, space: 0, bpm: 120, ...params })) e.message({ t: 'param', i: pidx(k), v });
    return e;
  }
  function run(e: EnjambreEngine, input: (i: number) => number, seconds: number): Float32Array {
    const n = Math.round(seconds * SR), L = new Float32Array(n);
    const l = new Float32Array(128), r = new Float32Array(128), il = new Float32Array(128);
    for (let off = 0; off < n; off += 128) {
      const m = Math.min(128, n - off);
      for (let i = 0; i < m; i++) il[i] = input(off + i);
      e.process(il, null, l, r, m);
      L.set(l.subarray(0, m), off);
    }
    return L;
  }
  const tone = (i: number) => Math.sin((2 * Math.PI * 300 * i) / SR) * 0.4;
  const rms = (a: Float32Array, from: number, to: number) => { let s = 0; for (let i = from; i < to; i++) s += a[i] * a[i]; return Math.sqrt(s / (to - from)); };

  it('ruta Post: lo grabado vuelve a sonar cuando la entrada calla; Loop baja su nivel', () => {
    const e = make({ loopLevel: 1 });
    e.message({ t: 'loop', a: 'loop' });
    run(e, tone, 1);
    e.message({ t: 'loop', a: 'loop' });
    const out = run(e, () => 0, 1);
    expect(rms(out, 1000, SR - 1000)).toBeGreaterThan(0.2);
    e.message({ t: 'param', i: pidx('loopLevel'), v: 0.25 });
    const quiet = run(e, () => 0, 1);
    expect(rms(quiet, 5000, SR - 1000)).toBeLessThan(rms(out, 1000, SR - 1000) * 0.4);
  });
  it('ruta Pre: el bucle entra al efecto (un efecto 100 % húmedo lo procesa)', () => {
    const e = make({ loopRoute: 1, mix: 1, engine: 3, activity: 0.2, time: 3 });
    e.message({ t: 'loop', a: 'loop' });
    run(e, tone, 1);
    e.message({ t: 'loop', a: 'loop' });
    // Entrada en silencio: solo suena el efecto, alimentado por el bucle.
    const out = run(e, () => 0, 2);
    expect(rms(out, SR, 2 * SR)).toBeGreaterThan(0.05);
    expect(e.looper.state).toBe(LOOP_PLAY);
  });
  it('Cuantizar con el tempo: el bucle mide un número exacto de pasos', () => {
    const e = make({ loopQuant: 1, time: 3 }); // 1/8 a 120 = 0,25 s
    run(e, tone, 0.1);
    e.message({ t: 'loop', a: 'loop' });
    run(e, tone, 1.1);
    e.message({ t: 'loop', a: 'loop' });
    run(e, tone, 0.5);
    const step = stepSeconds(3, 120) * SR;
    expect(e.looper.len % Math.round(step)).toBeLessThan(2);
    expect(e.telemetry(0).loopState).toBe(LOOP_PLAY);
  });
});
