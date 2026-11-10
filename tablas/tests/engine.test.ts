import { describe, expect, it } from 'vitest';
import { TablasEngine } from '../src/audio/worklet/engine';
import { fft } from '../src/shared/fft';
import { allFinite, makeEngine, maxStep, render, rms, set, SR, zeroCrossFreq } from './helpers';

type E = ReturnType<typeof makeEngine>;
const on = (e: E, id: number, note = 60, vel = 1) => e.message({ t: 'on', id, note, vel });
const off = (e: E, id: number) => e.message({ t: 'off', id });
const near = (f: number, target: number, tol = 0.03) => expect(Math.abs(f - target) / target).toBeLessThan(tol);
const active = (e: E) => e.voices.filter((v) => v.active).length;
const voice = (e: E) => e.voices.find((v) => v.active)!;
const SAW = 2 / 3; // posición de la sierra en la tabla «Básica»

/** Espectro de potencia (ventana de Hann) de N muestras a partir de `from`. */
function power(a: Float32Array, from: number, N = 16384): Float64Array {
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < N; i++) re[i] = a[from + i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N));
  fft(re, im);
  return Float64Array.from({ length: N / 2 }, (_, k) => re[k] * re[k] + im[k] * im[k]);
}
/** Fracción de la energía que NO cae en los armónicos de f0 (aliasing y ruido). */
function inharmonic(a: Float32Array, f0: number): number {
  const N = 16384, p = power(a, SR / 2, N);
  let harm = 0, total = 0;
  for (let k = 4; k < N / 2; k++) {
    const hz = (k * SR) / N, d = Math.abs(hz / f0 - Math.round(hz / f0)) * f0;
    total += p[k];
    if (d < 12) harm += p[k]; // ±12 Hz: lóbulo principal de la ventana
  }
  return 1 - harm / total;
}
/** Fracción de la energía por encima de `hz`. */
function above(a: Float32Array, hz: number): number {
  const N = 16384, p = power(a, SR / 2, N);
  let hi = 0, total = 0;
  for (let k = 1; k < N / 2; k++) { total += p[k]; if ((k * SR) / N > hz) hi += p[k]; }
  return hi / total;
}

describe('Osciladores de tabla de ondas', () => {
  it('seno afinado: nota 60 = 261,6 Hz y una octava arriba dobla', () => {
    const e = makeEngine();
    on(e, 1, 60);
    const [L] = render(e, 1);
    expect(allFinite(L)).toBe(true);
    expect(rms(L, SR / 2)).toBeGreaterThan(0.1);
    near(zeroCrossFreq(L, SR / 2), 261.63, 0.01);
    const e2 = makeEngine();
    on(e2, 1, 72);
    near(zeroCrossFreq(render(e2, 1)[0], SR / 2), 523.25, 0.01);
  });
  it('la posición cambia el timbre (de seno a sierra)', () => {
    const bright = (pos: number) => { const e = makeEngine({ o1Pos: pos }); on(e, 1); return above(render(e, 1)[0], 1000); };
    expect(bright(0)).toBeLessThan(0.001);
    expect(bright(SAW)).toBeGreaterThan(0.02);
  });
  it('sin aliasing en notas agudas (sierra a 2093 Hz y a 6272 Hz)', () => {
    for (const [note, f0] of [[96, 2093.0], [115, 6271.9]] as const) {
      const e = makeEngine({ o1Pos: SAW, 'filterFreq>key': 0 });
      on(e, 1, note);
      expect(inharmonic(render(e, 1)[0], f0)).toBeLessThan(0.002);
    }
  });
  it('mover la posición con la nota sonando no produce clics', () => {
    const e = makeEngine({ o1Pos: 0.2 });
    on(e, 1);
    render(e, 0.3);
    let worst = 0;
    // Tramo seno → triángulo (ondas sin saltos propios): un clic sería un escalón grande entre muestras.
    for (let i = 0; i < 60; i++) { set(e, { o1Pos: (i / 60) * 0.33 }); worst = Math.max(worst, maxStep(render(e, 0.02)[0])); }
    expect(worst).toBeLessThan(0.05);
  });
  it('oscilador 2 con su tabla y afinación propias; suboscilador una octava abajo', () => {
    const e = makeEngine({ o1Level: 0, o2Level: 0.8, o2Semi: 12 }, ['Básica', 'Básica']);
    on(e, 1);
    near(zeroCrossFreq(render(e, 1)[0], SR / 2), 523.25, 0.01);
    const s = makeEngine({ o1Level: 0, subLevel: 0.8, subOct: 1 });
    on(s, 1);
    near(zeroCrossFreq(render(s, 1)[0], SR / 2), 130.81, 0.01);
  });
  it('sin tabla cargada no suena ni falla', () => {
    const e = new TablasEngine(SR);
    on(e, 1);
    const [L] = render(e, 0.2);
    expect(rms(L)).toBe(0);
  });
});

describe('Unísono y efectos', () => {
  it('una voz es mono exacto; con unísono se abre el estéreo y se cuentan los osciladores', () => {
    const e = makeEngine({ o1Pos: SAW });
    on(e, 1);
    const [L, R] = render(e, 0.3);
    let d = 0;
    for (let i = 0; i < L.length; i++) d = Math.max(d, Math.abs(L[i] - R[i]));
    expect(d).toBeLessThan(1e-6);
    expect(voice(e).oscCount).toBe(1);
    for (const mode of [0, 1, 2]) {
      const u = makeEngine({ o1Pos: 0.5, uniVoices: 7, uniAmt: 0.6, uniMode: mode });
      on(u, 1);
      const [l, r] = render(u, 0.5);
      let diff = 0;
      for (let i = 0; i < l.length; i++) diff = Math.max(diff, Math.abs(l[i] - r[i]));
      expect(diff).toBeGreaterThan(0.05);
      expect(voice(u).oscCount).toBe(7);
      expect(allFinite(l)).toBe(true);
    }
  });
  it('Osc Estéreo separa los dos osciladores a izquierda y derecha', () => {
    const e = makeEngine({ o2Level: 0.8, o2Semi: 7, oscSpread: 1 }, ['Básica', 'Básica']);
    on(e, 1);
    const [L, R] = render(e, 1);
    near(zeroCrossFreq(L, SR / 2), 261.63, 0.01);
    near(zeroCrossFreq(R, SR / 2), 392.0, 0.01);
  });
  it('FM, Classic y Modern cambian el sonido y no se desbordan', () => {
    const dry = makeEngine({ o1Pos: 0 });
    on(dry, 1);
    const ref = above(render(dry, 1)[0], 600);
    for (const [fx, fx1, fx2] of [[1, 0.8, 0.3], [2, 0.7, 0], [2, 0, 0.6], [3, 0.8, 0], [3, 0, 0.7]]) {
      const e = makeEngine({ o1Pos: 0, o1Fx: fx, o1Fx1: fx1, o1Fx2: fx2 });
      on(e, 1);
      const [L] = render(e, 1);
      expect(allFinite(L)).toBe(true);
      expect(Math.max(...L.map(Math.abs))).toBeLessThanOrEqual(1);
      expect(above(L, 600)).toBeGreaterThan(ref + 0.01); // aparecen armónicos nuevos
    }
  });
});

describe('Filtro, envolventes, LFO y modulación', () => {
  it('LP 24 atenúa por encima del corte', () => {
    const lv = (p: Record<string, number>) => { const e = makeEngine({ o1Pos: SAW, 'filterFreq>key': 0, ...p }); on(e, 1); return rms(render(e, 1)[0], SR / 2); };
    expect(lv({ filterFreq: 60 }) / lv({ filterOn: 0 })).toBeLessThan(0.05);
  });
  it('Env 1 con ataque lento sube poco a poco, y al soltar la voz queda libre', () => {
    const e = makeEngine({ e1A: 1, e1R: 0.05 });
    on(e, 1);
    const [L] = render(e, 1.2);
    expect(rms(L, 0, 4800)).toBeLessThan(rms(L, 24000, 28800));
    off(e, 1);
    render(e, 0.5);
    expect(active(e)).toBe(0);
  });
  it('LFO 1 y Env 3 mueven la posición del oscilador', () => {
    const e = makeEngine({ o1Pos: 0.5, 'o1Pos>lfo1': 0.4, lfo1Rate: 5 });
    on(e, 1);
    let min = 1, max = 0;
    for (let i = 0; i < 60; i++) { render(e, 0.01); min = Math.min(min, voice(e).posOut[0]); max = Math.max(max, voice(e).posOut[0]); }
    expect(max - min).toBeGreaterThan(0.6);
    const g = makeEngine({ o1Pos: 0, 'o1Pos>env3': 1, e3A: 0.2, e3S: 1 });
    on(g, 1);
    render(g, 0.02);
    const early = voice(g).posOut[0];
    render(g, 0.5);
    expect(voice(g).posOut[0]).toBeGreaterThan(early + 0.5);
  });
  it('LFO 2 a volumen produce trémolo', () => {
    const e = makeEngine({ 'volume>lfo2': 1, lfo2Rate: 4 });
    on(e, 1);
    const [L] = render(e, 1.5);
    const lv: number[] = [];
    for (let i = SR / 2; i + 1200 <= L.length; i += 1200) lv.push(rms(L, i, i + 1200));
    expect(Math.max(...lv) / (Math.min(...lv) + 1e-6)).toBeGreaterThan(5);
  });
  it('Transpose>Key = 0 iguala las notas; pitch bend MPE con rango de 48 st', () => {
    const e = makeEngine({ 'transpose>key': 0 });
    on(e, 1, 84);
    near(zeroCrossFreq(render(e, 1)[0], SR / 2), 261.63, 0.01);
    const b = makeEngine({ pbRange: 48 });
    on(b, 1);
    b.message({ t: 'expr', id: 1, bend: 0.25, slide: 0, press: 0 });
    near(zeroCrossFreq(render(b, 1)[0], SR / 2), 523.25, 0.01);
  });
});

describe('Voces', () => {
  it('polifonía limitada a 8', () => {
    const e = makeEngine();
    for (let i = 0; i < 12; i++) { on(e, i, 48 + i); render(e, 0.02); }
    expect(active(e)).toBe(8);
  });
  it('mono: una sola voz y Glide solo en notas solapadas', () => {
    const e = makeEngine({ mono: 1, glide: 1 });
    on(e, 1, 60);
    render(e, 0.3);
    on(e, 2, 72);
    expect(active(e)).toBe(1);
    const mid = zeroCrossFreq(render(e, 0.5)[0], SR * 0.4);
    expect(mid).toBeGreaterThan(290);
    expect(mid).toBeLessThan(500);
    near(zeroCrossFreq(render(e, 1)[0], SR * 0.7), 523.25, 0.01);
  });
  it('Hold retiene las notas y las borra al tocar una nueva tras soltar todas', () => {
    const e = makeEngine({ hold: 1 });
    on(e, 1, 60); on(e, 2, 64);
    render(e, 0.1);
    off(e, 1); off(e, 2);
    render(e, 0.5);
    expect(e.voices.filter((v) => v.active && v.gate).length).toBe(2);
    on(e, 3, 67);
    render(e, 0.01);
    expect(e.voices.filter((v) => v.active && v.gate).length).toBe(1);
  });
});
