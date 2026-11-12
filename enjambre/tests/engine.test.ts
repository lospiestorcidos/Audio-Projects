import { describe, expect, it } from 'vitest';
import { EnjambreEngine } from '../src/audio/worklet/engine';
import { fft } from './fft';
import { ENGINES, pidx, stepSeconds } from '../src/shared/params';

const SR = 48000;
type E = EnjambreEngine;

function make(params: Record<string, number> = {}): E {
  const e = new EnjambreEngine(SR);
  set(e, { mix: 1, space: 0, bpm: 120, time: 2, ...params }); // solo efecto, sin reverb, pasos de 1/4 (0,5 s)
  return e;
}
function set(e: E, params: Record<string, number>) {
  for (const k of Object.keys(params)) e.message({ t: 'param', i: pidx(k), v: params[k] });
}
/** Procesa `seconds` con la entrada dada (mono) o en silencio. */
function run(e: E, input: Float32Array | null, seconds: number): [Float32Array, Float32Array] {
  const n = Math.round(seconds * SR);
  const L = new Float32Array(n), R = new Float32Array(n);
  const l = new Float32Array(128), r = new Float32Array(128), il = new Float32Array(128);
  for (let off = 0; off < n; off += 128) {
    const m = Math.min(128, n - off);
    il.fill(0);
    if (input) il.set(input.subarray(Math.min(input.length, off), Math.min(input.length, off + m)));
    e.process(input ? il : null, null, l, r, m);
    L.set(l.subarray(0, m), off); R.set(r.subarray(0, m), off);
  }
  return [L, R];
}
const sine = (hz: number, seconds: number, amp = 0.5) =>
  Float32Array.from({ length: Math.round(seconds * SR) }, (_, i) => Math.sin((2 * Math.PI * hz * i) / SR) * amp);
const rms = (a: Float32Array, from = 0, to = a.length) => { let s = 0; for (let i = from; i < to; i++) s += a[i] * a[i]; return Math.sqrt(s / Math.max(1, to - from)); };
const peak = (a: Float32Array, from = 0, to = a.length) => { let p = 0; for (let i = from; i < to; i++) p = Math.max(p, Math.abs(a[i])); return p; };
/** Energía (relativa) cerca de cada frecuencia, en una ventana de 16384 muestras. */
function bands(a: Float32Array, from: number, freqs: number[]): number[] {
  const N = 16384, re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < N; i++) re[i] = (a[from + i] ?? 0) * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N));
  fft(re, im);
  const total = re.reduce((s, _, k) => (k < N / 2 ? s + re[k] * re[k] + im[k] * im[k] : s), 0) || 1;
  return freqs.map((f) => {
    const c = Math.round((f * N) / SR);
    let s = 0;
    for (let k = c - 6; k <= c + 6; k++) s += re[k] * re[k] + im[k] * im[k];
    return s / total;
  });
}

describe('Motores (fase 1)', () => {
  it('con la entrada en silencio no suena nada y no falla', () => {
    for (let engine = 0; engine < ENGINES.length; engine++) {
      const e = make({ engine });
      const [L] = run(e, null, 2);
      expect(peak(L)).toBe(0);
    }
  });
  it('los 11 motores y sus 4 variaciones suenan con un arpegio de prueba y no se desbordan', () => {
    for (let engine = 0; engine < ENGINES.length; engine++) {
      for (let variation = 0; variation < 4; variation++) {
        // Stutter lanza ráfagas al azar en algunos pasos: con pasos cortos hay más ocasiones de oírlas.
        const e = make({ engine, variation, activity: 0.8, repeats: 0.6, ...(engine === 8 ? { activity: 1, time: 4 } : {}) });
        e.message({ t: 'pluck' });
        const [L, R] = run(e, null, 4);
        expect(L.every(Number.isFinite) && R.every(Number.isFinite)).toBe(true);
        expect(peak(L)).toBeLessThanOrEqual(1);
        // Después de que termine el arpegio (1,4 s) sigue sonando el efecto. Stutter repite lo que está
        // entrando en ese momento, así que se mide mientras suena el arpegio.
        const [from, to] = engine === 8 ? [0.3 * SR, 1.6 * SR] : [1.6 * SR, 4 * SR];
        expect(rms(L, from, to) + rms(R, from, to), `${ENGINES[engine]} ${'ABCD'[variation]}`).toBeGreaterThan(0.005);
      }
    }
  });
  it('Shards C reproduce una octava arriba; Shards D incluye una octava abajo', () => {
    const tone = sine(440, 3);
    const c = make({ engine: 0, variation: 2, activity: 1, repeats: 1 });
    const [Lc] = run(c, tone, 3);
    const [lo, mid, hi] = bands(Lc, 2 * SR, [220, 440, 880]);
    expect(hi).toBeGreaterThan(mid * 3);
    expect(hi).toBeGreaterThan(lo * 3);
    const d = make({ engine: 0, variation: 3, activity: 1, repeats: 1 });
    let low = 0;
    for (let s = 0; s < 3; s++) {
      const [Ld] = run(d, tone, 1);
      low = Math.max(low, bands(Ld, 0, [220])[0]);
    }
    expect(low).toBeGreaterThan(0.02);
  });
  it('Glide A empieza a media velocidad (una octava abajo) y sube', () => {
    const e = make({ engine: 2, variation: 0, activity: 1, repeats: 1, time: 2 });
    const [L] = run(e, sine(880, 4), 4);
    // Los bucles empiezan a 0,5x: aparece energía por debajo de 700 Hz, que la entrada no tiene.
    const low = bands(L, Math.round(1.05 * SR), [440, 455, 470, 485, 500, 520, 540, 560]).reduce((a, b) => a + b, 0);
    expect(low).toBeGreaterThan(0.1);
  });
  it('Pattern A: las repeticiones caen en múltiplos exactos del paso', () => {
    const e = make({ engine: 3, variation: 0, activity: 0.3, repeats: 0.5, time: 3 }); // 1/8 a 120 = 0,25 s
    const click = new Float32Array(2 * SR); click[100] = 0.8;
    const [L, R] = run(e, click, 2);
    const step = stepSeconds(3, 120) * SR;
    expect(peak(L, 100 + step - 3, 100 + step + 6) + peak(R, 100 + step - 3, 100 + step + 6)).toBeGreaterThan(0.3);
    expect(peak(L, 100 + 2 * step - 3, 100 + 2 * step + 6) + peak(R, 100 + 2 * step - 3, 100 + 2 * step + 6)).toBeGreaterThan(0.15);
    expect(peak(L, 100 + 20, 100 + step - 30)).toBeLessThan(0.01); // nada entre medias
  });
  it('Activity controla cuántas cabezas suenan; nunca más de 16', () => {
    const count = (activity: number) => {
      const e = make({ engine: 1, activity, repeats: 0.6 });
      let max = 0, sum = 0;
      for (let i = 0; i < 60; i++) { run(e, sine(300, 0.05), 0.05); const c = e.activeHeads(); max = Math.max(max, c); sum += c; }
      return { max, mean: sum / 60 };
    };
    const lo = count(0.05), hi = count(1);
    expect(hi.mean).toBeGreaterThan(lo.mean * 2);
    expect(hi.max).toBeLessThanOrEqual(16);
  });
});

describe('Hold, Bypass y la cadena de salida', () => {
  it('Hold: sigue sonando con la entrada en silencio y no graba lo nuevo', () => {
    const e = make({ engine: 1, activity: 0.8, repeats: 0.6 });
    run(e, sine(330, 2), 2);
    set(e, { hold: 1 });
    const [L] = run(e, null, 3);
    expect(rms(L, 2 * SR)).toBeGreaterThan(0.02);
    const off = make({ engine: 1, activity: 0.8, repeats: 0.6 });
    run(off, sine(330, 2), 2);
    const [L2] = run(off, null, 6);
    expect(rms(L2, 5 * SR)).toBeLessThan(0.001); // sin Hold, el silencio acaba entrando
  });
  it('Bypass deja pasar la señal original y no nace nada nuevo', () => {
    const e = make({ engine: 0, activity: 1, repeats: 0.3, mix: 0.5, bypass: 1 });
    const tone = sine(500, 2);
    const [L] = run(e, tone, 2);
    expect(e.activeHeads()).toBe(0);
    expect(Math.abs(L[SR] - tone[SR])).toBeLessThan(0.01);
  });
  it('Mix al 0 %: solo la señal original', () => {
    const e = make({ engine: 0, activity: 1, mix: 0 });
    const tone = sine(500, 2);
    const [L] = run(e, tone, 2);
    let d = 0;
    for (let i = SR; i < 2 * SR; i++) d = Math.max(d, Math.abs(L[i] - tone[i]));
    expect(d).toBeLessThan(0.01);
  });
  it('Filter: paso bajo a la izquierda quita agudos; Space alarga la cola', () => {
    const bright = (filter: number) => {
      const e = make({ engine: 3, activity: 0.2, filter });
      const [L] = run(e, sine(5000, 1), 1.5);
      return rms(L, 0.6 * SR, 1.2 * SR);
    };
    expect(bright(-0.6)).toBeLessThan(bright(0) * 0.1);
    const tail = (space: number) => {
      const e = make({ engine: 3, activity: 0, repeats: 0, space, room: 2 });
      const burst = sine(400, 0.2);
      const [L] = run(e, burst, 3);
      return rms(L, 1.5 * SR, 2.5 * SR);
    };
    expect(tail(1)).toBeGreaterThan(tail(0) * 5 + 1e-4);
  });
  it('Space con la sala Infinita no se desborda', () => {
    const e = make({ engine: 0, activity: 1, repeats: 1, space: 1, room: 3, fxVol: 12 });
    const [L] = run(e, sine(200, 4, 0.9), 8);
    expect(L.every(Number.isFinite)).toBe(true);
    expect(peak(L)).toBeLessThanOrEqual(1);
  });
});

describe('Rendimiento', () => {
  it('peor caso: 16 cabezas, Pattern 8 taps, reverb, filtro y modulación', () => {
    const e = make({ engine: 1, activity: 1, repeats: 1, space: 1, filter: -0.3, modDepth: 1 });
    const tone = sine(300, 1);
    run(e, tone, 1);
    const t0 = performance.now();
    run(e, tone, 4);
    const load = (performance.now() - t0) / 4000;
    console.log(`[bench] Mist al máximo con reverb: ${(load * 100).toFixed(2)} % de un núcleo`);
    expect(load).toBeLessThan(0.5);
  }, 30000);
});

describe('Motores (fase 3)', () => {
  /** Notas cortas de `hz` cada `every` segundos (con ataques claros), durante `seconds`. */
  const plucks = (hz: number, every: number, seconds: number) =>
    Float32Array.from({ length: Math.round(seconds * SR) }, (_, i) => {
      const t = (i / SR) % every;
      return Math.sin(2 * Math.PI * hz * (i / SR)) * Math.exp(-t * 12) * Math.min(1, t * 2000) * 0.6;
    });

  it('Rake A: un ataque se repite a intervalos de un paso', () => {
    const e = make({ engine: 6, variation: 0, activity: 1, repeats: 0.4, time: 3 }); // 1/8 a 120 = 0,25 s
    run(e, null, 0.5); // historial con algo de pasado
    const click = new Float32Array(2 * SR);
    for (let i = 0; i < 2000; i++) click[i] = Math.sin(i * 0.3) * Math.exp(-i / 300) * 0.8;
    const [L, R] = run(e, click, 2);
    const step = stepSeconds(3, 120) * SR;
    const at = (t: number) => rms(L, Math.round(t), Math.round(t + 800)) + rms(R, Math.round(t), Math.round(t + 800));
    expect(at(step)).toBeGreaterThan(0.02);
    expect(at(2 * step)).toBeGreaterThan(0.01);
    expect(at(step * 0.5)).toBeLessThan(at(step) * 0.3); // entre medias, poco
  });
  it('Stutter: durante las ráfagas la señal original se calla', () => {
    const e = make({ engine: 8, variation: 1, activity: 1, repeats: 1, mix: 0 }); // Mix 0: solo se oye la señal original
    const [L] = run(e, sine(330, 6, 0.5), 6);
    let silentWindows = 0;
    for (let t = SR; t + 2400 < 6 * SR; t += 2400) if (rms(L, t, t + 2400) < 0.05) silentWindows++;
    expect(silentWindows).toBeGreaterThan(3);
  });
  it('Drone: sigue sonando segundos después de que la entrada calle', () => {
    const e = make({ engine: 5, variation: 0, activity: 1, repeats: 1 });
    run(e, sine(220, 2, 0.5), 2);
    const [L, R] = run(e, null, 4);
    expect(rms(L, 2 * SR, 3 * SR) + rms(R, 2 * SR, 3 * SR)).toBeGreaterThan(0.02);
  });
  it('Arp B: aparece la quinta (1,5x) de las notas que entran', () => {
    const e = make({ engine: 9, variation: 1, activity: 1, repeats: 1, time: 3 });
    const [L] = run(e, plucks(440, 0.5, 4), 4);
    const [fifth] = bands(L, 2 * SR, [660]);
    const off = make({ engine: 9, variation: 0, activity: 1, repeats: 1, time: 3 });
    const [L0] = run(off, plucks(440, 0.5, 4), 4);
    expect(fifth).toBeGreaterThan(bands(L0, 2 * SR, [660])[0] * 5 + 0.002);
  });
  it('Seq A filtra los agudos; Seq B no', () => {
    const hi = (variation: number) => {
      const e = make({ engine: 4, variation, activity: 1, repeats: 0.5 });
      const [L, R] = run(e, sine(7000, 3, 0.5), 3);
      return rms(L, SR, 3 * SR) + rms(R, SR, 3 * SR);
    };
    expect(hi(0)).toBeLessThan(hi(1) * 0.35);
  });
  it('Warp y Chops no se desbordan al máximo, con Reverse', () => {
    for (const engine of [7, 10]) {
      for (let variation = 0; variation < 4; variation++) {
        const e = make({ engine, variation, activity: 1, repeats: 1, reverse: 1 });
        const [L] = run(e, plucks(300, 0.25, 3), 3);
        expect(L.every(Number.isFinite)).toBe(true);
        expect(peak(L)).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('Rendimiento (fase 3)', () => {
  it('cada motor al máximo, con reverb y filtro', () => {
    let worst = 0, name = '';
    for (let engine = 0; engine < ENGINES.length; engine++) {
      const e = make({ engine, variation: 2, activity: 1, repeats: 1, space: 1, filter: -0.3, modDepth: 1 });
      const input = Float32Array.from({ length: 3 * SR }, (_, i) => Math.sin(i * 0.05) * Math.exp(-((i / SR) % 0.3) * 10) * 0.5);
      run(e, input, 1);
      const t0 = performance.now();
      run(e, input.subarray(SR), 2);
      const load = (performance.now() - t0) / 2000;
      if (load > worst) { worst = load; name = ENGINES[engine]; }
    }
    console.log(`[bench] peor motor: ${name}, ${(worst * 100).toFixed(2)} % de un núcleo`);
    expect(worst).toBeLessThan(0.5);
  }, 60000);
});

describe('Formas de las cabezas', () => {
  it('el nivel de cada cabeza (ventana) está siempre entre 0 y 1', () => {
    for (const engine of [6, 9, 7, 5]) {
      const e = make({ engine, variation: 2, activity: 1, repeats: 1, time: 3 });
      e.message({ t: 'pluck' });
      for (let i = 0; i < 40; i++) {
        run(e, null, 0.05);
        const h = e.telemetry(0).heads;
        for (let k = 1; k < h.length; k += 3) { expect(h[k]).toBeGreaterThanOrEqual(0); expect(h[k]).toBeLessThanOrEqual(1.0001); }
      }
    }
  });
});
