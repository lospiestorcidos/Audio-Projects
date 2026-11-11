import { describe, expect, it } from 'vitest';
import { EcosEngine } from '../src/audio/worklet/engine';
import { ClockTracker, TapTempo } from '../src/midi/clock';
import { delaySeconds, pidx } from '../src/shared/params';

const SR = 48000;

function make(params: Record<string, number> = {}): EcosEngine {
  const e = new EcosEngine(SR);
  // Valores neutros para medir: sin sincronía, sin filtros audibles y solo efecto.
  set(e, { sync: 0, time: 100, feedback: 0.5, mix: 1, lowCut: 20, highCut: 20000, ...params });
  run(e, null, 3); // deja asentarse el deslizamiento inicial del tiempo
  e.message({ t: 'clear' });
  return e;
}
function set(e: EcosEngine, params: Record<string, number>) {
  for (const k of Object.keys(params)) e.message({ t: 'param', i: pidx(k), v: params[k] });
}
/** Procesa `seconds` con la entrada dada (mono, o [L, R]) y devuelve la salida. */
function run(e: EcosEngine, input: Float32Array | [Float32Array, Float32Array] | null, seconds: number): [Float32Array, Float32Array] {
  const n = Math.round(seconds * SR);
  const L = new Float32Array(n), R = new Float32Array(n);
  const l = new Float32Array(128), r = new Float32Array(128), il = new Float32Array(128), ir = new Float32Array(128);
  const [inL, inR] = input ? (Array.isArray(input) ? input : [input, null]) : [null, null];
  for (let off = 0; off < n; off += 128) {
    const m = Math.min(128, n - off);
    il.fill(0); ir.fill(0);
    if (inL) il.set(inL.subarray(off, Math.min(inL.length, off + m)));
    if (inR) ir.set(inR.subarray(off, Math.min(inR.length, off + m)));
    e.process(inL ? il : null, inR ? ir : null, l, r, m);
    L.set(l.subarray(0, m), off); R.set(r.subarray(0, m), off);
  }
  return [L, R];
}
const impulse = (seconds = 1) => { const a = new Float32Array(seconds * SR); a[0] = 0.5; return a; };
/** Pico en una ventana de ±w muestras alrededor de `at`. */
const peakAt = (a: Float32Array, at: number, w = 4) => { let p = 0; for (let i = at - w; i <= at + w; i++) p = Math.max(p, Math.abs(a[i])); return p; };
const peak = (a: Float32Array, from = 0, to = a.length) => { let p = 0; for (let i = from; i < to; i++) p = Math.max(p, Math.abs(a[i])); return p; };

describe('Delay', () => {
  it('repite a su tiempo y cada repetición baja según el Feedback', () => {
    const e = make({ time: 100, feedback: 0.5 });
    const [L] = run(e, impulse(), 1);
    const d = 0.1 * SR;
    expect(peakAt(L, d)).toBeCloseTo(0.5, 1);
    expect(peakAt(L, 2 * d)).toBeCloseTo(0.25, 1);
    expect(peakAt(L, 3 * d)).toBeCloseTo(0.125, 1);
    expect(peak(L, d + 50, 2 * d - 50)).toBeLessThan(0.01); // silencio entre repeticiones
  });
  it('sincronizado: el tiempo sale del BPM y de la figura', () => {
    expect(delaySeconds(true, 0, 8, 120)).toBeCloseTo(0.5, 6); // 1/4 a 120
    expect(delaySeconds(true, 0, 7, 120)).toBeCloseTo(0.375, 6); // 1/8 con puntillo
    expect(delaySeconds(true, 0, 3, 90)).toBeCloseTo(60 / 90 / 3, 6); // tresillo de corchea
    expect(delaySeconds(true, 0, 12, 40)).toBeLessThanOrEqual(8); // nunca pasa del buffer
    const e = make({ sync: 1, div: 5, bpm: 150 }); // 1/8 a 150 = 200 ms
    const [L] = run(e, impulse(), 1);
    expect(peakAt(L, 0.2 * SR)).toBeGreaterThan(0.4);
  });
  it('Mezcla al 0 % deja solo la señal original; al 100 %, solo el efecto', () => {
    const dry = make({ mix: 0 });
    const [L] = run(dry, impulse(), 0.5);
    expect(L[0]).toBeCloseTo(0.5, 2);
    expect(peak(L, 100)).toBeLessThan(0.01);
    const wet = make({ mix: 1 });
    expect(Math.abs(run(wet, impulse(), 0.5)[0][0])).toBeLessThan(0.01);
  });
  it('ping-pong: las repeticiones alternan izquierda y derecha', () => {
    const e = make({ pingpong: 1, time: 100, feedback: 0.7 });
    const [L, R] = run(e, impulse(), 1);
    const d = 0.1 * SR;
    expect(peakAt(L, d)).toBeGreaterThan(0.3); expect(peakAt(R, d)).toBeLessThan(0.02);
    expect(peakAt(R, 2 * d)).toBeGreaterThan(0.2); expect(peakAt(L, 2 * d)).toBeLessThan(0.02);
    expect(peakAt(L, 3 * d)).toBeGreaterThan(0.1);
  });
  it('entrada estéreo: cada lado conserva su canal', () => {
    const e = make({ time: 50 });
    const l = impulse(), r = new Float32Array(SR);
    const [L, R] = run(e, [l, r], 0.3);
    expect(peakAt(L, 0.05 * SR)).toBeGreaterThan(0.4);
    expect(peak(R)).toBeLessThan(0.01);
  });
  it('con Feedback por encima del 100 % crece pero no se desboca', () => {
    const e = make({ time: 30, feedback: 1.1 });
    const noise = Float32Array.from({ length: SR }, (_, i) => Math.sin(i * 0.3) * 0.8);
    const [L] = run(e, noise, 6);
    expect(L.every(Number.isFinite)).toBe(true);
    expect(peak(L)).toBeLessThanOrEqual(1);
    expect(peak(L, 5 * SR)).toBeGreaterThan(0.3); // sigue sonando
  });
  it('Freeze mantiene el sonido sin que decaiga ni entre sonido nuevo', () => {
    const e = make({ time: 100, feedback: 0.3 });
    run(e, impulse(), 0.15);
    set(e, { freeze: 1 });
    const loud = Float32Array.from({ length: 4 * SR }, () => 0.9);
    const [L] = run(e, loud, 4);
    const early = peak(L, 0.2 * SR, 0.5 * SR), late = peak(L, 3.5 * SR, 3.8 * SR);
    expect(late).toBeGreaterThan(early * 0.9);
    expect(late).toBeLessThan(0.6); // la entrada (0,9) no ha entrado en el bucle
  });
  it('Corte de agudos apaga las repeticiones; Saturación no cambia el nivel con señal baja', () => {
    const tone = Float32Array.from({ length: SR / 10 }, (_, i) => Math.sin((2 * Math.PI * 6000 * i) / SR) * 0.5);
    const bright = make({ time: 200, feedback: 0.8 }), dark = make({ time: 200, feedback: 0.8, highCut: 800 });
    const b = peak(run(bright, tone, 1)[0], 0.6 * SR, 0.7 * SR), d = peak(run(dark, tone, 1)[0], 0.6 * SR, 0.7 * SR);
    expect(d).toBeLessThan(b * 0.1);
    // Con señal baja la saturación casi no actúa: la segunda repetición sale prácticamente igual.
    const second = (drive: number) => {
      const quiet = impulse(); quiet[0] = 0.01;
      return peakAt(run(make({ time: 100, feedback: 0.5, drive }), quiet, 0.5)[0], 0.2 * SR);
    };
    expect(second(1)).toBeGreaterThan(second(0) * 0.9);
    // Con señal alta sí comprime.
    const loud = (drive: number) => peakAt(run(make({ time: 100, feedback: 0.9, drive }), impulse(), 0.5)[0], 0.2 * SR);
    expect(loud(1)).toBeLessThan(loud(0) * 0.8);
  });
  it('cambiar el Tiempo con sonido dentro no produce clics', () => {
    const e = make({ time: 300, feedback: 0.6 });
    const tone = Float32Array.from({ length: SR }, (_, i) => Math.sin((2 * Math.PI * 220 * i) / SR) * 0.5);
    run(e, tone, 1);
    let worst = 0;
    for (const t of [120, 800, 60, 1500, 300]) {
      set(e, { time: t });
      const [L] = run(e, null, 0.4);
      for (let i = 1; i < L.length; i++) worst = Math.max(worst, Math.abs(L[i] - L[i - 1]));
    }
    expect(worst).toBeLessThan(0.12); // un clic sería un salto cercano a la amplitud completa
  });
  it('Duck baja el efecto mientras entra sonido; Borrar vacía la línea; el sonido de prueba suena', () => {
    const tone = Float32Array.from({ length: SR }, (_, i) => Math.sin((2 * Math.PI * 300 * i) / SR) * 0.5);
    const lv = (duck: number) => { const e = make({ time: 50, feedback: 0.5, duck }); return peak(run(e, tone, 1)[0], 0.5 * SR); };
    expect(lv(1)).toBeLessThan(lv(0) * 0.2);
    const e = make({ time: 100, feedback: 0.9 });
    run(e, impulse(), 0.3);
    e.message({ t: 'clear' });
    expect(peak(run(e, null, 0.5)[0])).toBe(0);
    e.message({ t: 'pluck' });
    const [L] = run(e, null, 0.5);
    expect(peak(L, 0.1 * SR + 100)).toBeGreaterThan(0.1);
    expect(e.telemetry(0).hist.some((v) => v > 0.05)).toBe(true);
  });
});

describe('Tempo', () => {
  it('MIDI clock: 24 pulsos por negra dan el tempo, también con algo de irregularidad', () => {
    const c = new ClockTracker();
    let bpm: number | null = null, t = 0;
    for (let i = 0; i < 96; i++) { t += 60000 / 128 / 24 + (i % 2 ? 0.4 : -0.4); bpm = c.tick(t); }
    expect(bpm).not.toBeNull();
    expect(Math.abs(bpm! - 128)).toBeLessThan(0.5);
    expect(c.alive(t + 200)).toBe(true);
    expect(c.alive(t + 1500)).toBe(false);
    // Tras una parada larga no da un tempo falso con el primer pulso.
    expect(c.tick(t + 5000)).toBeNull();
  });
  it('tap tempo: media de los toques; una pausa larga empieza de nuevo', () => {
    const t = new TapTempo();
    expect(t.tap(0)).toBeNull();
    expect(t.tap(500)).toBeCloseTo(120, 5);
    expect(t.tap(1010)).toBeCloseTo(60000 / 505, 3);
    expect(t.tap(6000)).toBeNull();
    expect(t.tap(6400)).toBeCloseTo(150, 5);
  });
});
