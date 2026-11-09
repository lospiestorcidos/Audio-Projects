import { describe, expect, it } from 'vitest';
import { allFinite, makeEngine, maxStep, render, rms, set, SR, zeroCrossFreq } from './helpers';
import { Lfo } from '../src/audio/worklet/lfo';
import { filterMagnitude } from '../src/audio/worklet/filter';

const on = (e: ReturnType<typeof makeEngine>, id: number, note = 60, vel = 1) =>
  e.message({ t: 'on', id, note, vel });
const off = (e: ReturnType<typeof makeEngine>, id: number) => e.message({ t: 'off', id });
const near = (f: number, target: number) => expect(Math.abs(f - target) / target).toBeLessThan(0.05);
const active = (e: ReturnType<typeof makeEngine>) => e.voices.filter((v) => v.active).length;

describe('Fase 1 · Classic', () => {
  it('suena, afinado y con nivel estable (dos granos Hann solapados)', () => {
    const e = makeEngine({ size: 100 });
    on(e, 1);
    const [L] = render(e, 1);
    expect(allFinite(L)).toBe(true);
    expect(rms(L, SR / 2)).toBeGreaterThan(0.2);
    near(zeroCrossFreq(L, SR / 2), 220);
    // Nivel casi constante entre ventanas de 50 ms.
    const a = rms(L, 24000, 26400), b = rms(L, 36000, 38400);
    expect(Math.abs(a - b) / a).toBeLessThan(0.1);
  });
  it('Key al 100 %: una octava arriba dobla la frecuencia', () => {
    const e = makeEngine({ size: 100 });
    on(e, 1, 72);
    const [L] = render(e, 1);
    near(zeroCrossFreq(L, SR / 2), 440);
  });
  it('al soltar, la voz se apaga y queda libre', () => {
    const e = makeEngine({ e1R: 0.05 });
    on(e, 1);
    render(e, 0.2);
    off(e, 1);
    const [L] = render(e, 0.5);
    expect(active(e)).toBe(0);
    expect(rms(L, SR * 0.4)).toBe(0);
  });
  it('cambiar Grain Size en caliente no produce clics', () => {
    const e = makeEngine({ size: 200 });
    on(e, 1);
    const [ref] = render(e, 0.5);
    let worst = 0;
    for (let i = 0; i < 40; i++) {
      set(e, { size: 5 + Math.random() * 800 });
      worst = Math.max(worst, maxStep(render(e, 0.03)[0]));
    }
    // Un clic real sería un salto de 0,3 o más; el seno sin clics da ~0,015–0,03.
    expect(maxStep(ref)).toBeLessThan(0.03);
    expect(worst).toBeLessThan(0.08);
  });
  it('Shape extremo (ataque seco / final abrupto) no genera valores fuera de rango', () => {
    for (const shape of [0, 1]) {
      const e = makeEngine({ size: 40, shape });
      on(e, 1);
      const [L] = render(e, 0.5);
      expect(allFinite(L)).toBe(true);
      expect(rms(L)).toBeGreaterThan(0.02);
    }
  });
  it('polifonía limitada a 8 voces', () => {
    const e = makeEngine();
    for (let i = 0; i < 12; i++) { on(e, i, 48 + i); render(e, 0.02); }
    expect(active(e)).toBe(8);
  });
});

describe('Fase 2 · Loop y Cloud', () => {
  it('Loop reproduce el fragmento sin alterar', () => {
    const e = makeEngine({ mode: 1, size: 500, shape: 0.2 });
    on(e, 1);
    const [L] = render(e, 1.5);
    near(zeroCrossFreq(L, SR / 2), 220);
    expect(rms(L, SR / 2)).toBeGreaterThan(0.25);
  });
  it('Loop con Reverse al 100 % sigue sonando', () => {
    const e = makeEngine({ mode: 1, size: 300, reverse: 1 });
    on(e, 1);
    const [L] = render(e, 1);
    expect(allFinite(L)).toBe(true);
    expect(rms(L, SR / 2)).toBeGreaterThan(0.2);
  });
  it('Cloud: Density controla los granos y nunca pasa de 20 por canal', () => {
    const count = (density: number) => {
      const e = makeEngine({ mode: 2, size: 200, density });
      on(e, 1);
      let max = 0, sum = 0, n = 0;
      for (let i = 0; i < 100; i++) {
        render(e, 0.02);
        const v = e.voices.find((x) => x.active)!;
        let c = 0;
        for (let k = 0; k < 20; k++) c += v.gActive[k];
        max = Math.max(max, c);
        if (i > 20) { sum += c; n++; }
      }
      return { max, mean: sum / n };
    };
    const lo = count(3), hi = count(20);
    expect(lo.mean).toBeGreaterThan(1.5);
    expect(lo.mean).toBeLessThan(5);
    expect(hi.mean).toBeGreaterThan(12);
    expect(hi.max).toBeLessThanOrEqual(20);
  });
});

describe('Fase 3 · Scan, Variation y Spread', () => {
  it('Scan desplaza la posición y vuelve al principio con Loop', () => {
    const e = makeEngine({ position: 0.5, scanSpeed: 1, scanDist: 0.25, scanLoop: 1 });
    on(e, 1);
    const v = () => e.voices.find((x) => x.active)!;
    render(e, 0.25);
    expect(v().head).toBeCloseTo(0.625, 1); // 0,25 s de un sample de 2 s = 12,5 %
    render(e, 0.35);
    expect(v().head).toBeLessThan(0.6); // ya ha reiniciado
  });
  it('Scan sin Loop se detiene al final de Distance; Position + Scan hace wrap', () => {
    const e = makeEngine({ position: 0.9, scanSpeed: 2, scanDist: 0.3, scanLoop: 0 });
    on(e, 1);
    render(e, 1);
    expect(e.voices.find((x) => x.active)!.head).toBeCloseTo(0.2, 2);
  });
  it('Spread = 0 es mono exacto; Spread > 0 abre el estéreo', () => {
    const e = makeEngine({ variation: 1, varPos: 0.5, varSize: 0.5 });
    on(e, 1);
    const [L, R] = render(e, 0.5);
    let diff = 0;
    for (let i = 0; i < L.length; i++) diff = Math.max(diff, Math.abs(L[i] - R[i]));
    expect(diff).toBe(0);
    const e2 = makeEngine({ spread: 1 });
    on(e2, 1);
    const [L2, R2] = render(e2, 0.5);
    let d2 = 0;
    for (let i = 0; i < L2.length; i++) d2 = Math.max(d2, Math.abs(L2[i] - R2[i]));
    expect(d2).toBeGreaterThan(0.1);
  });
  it('Variation de volumen cambia el nivel grano a grano', () => {
    const e = makeEngine({ mode: 1, size: 50, shape: 0.1, variation: 1, varVol: 1 });
    on(e, 1);
    const [L] = render(e, 2);
    const levels: number[] = [];
    for (let i = SR / 2; i + 2400 <= L.length; i += 2400) levels.push(rms(L, i, i + 2400));
    expect(Math.max(...levels) / Math.min(...levels)).toBeGreaterThan(1.5);
  });
});

describe('Fase 4 · Filtro, envolventes y LFO', () => {
  it('LP 24 atenúa por encima del corte y HP 24 por debajo', () => {
    const level = (params: Record<string, number>) => {
      const e = makeEngine({ size: 100, 'filterFreq>key': 0, ...params });
      on(e, 1);
      return rms(render(e, 1)[0], SR / 2);
    };
    const dry = level({ filterOn: 0 });
    expect(level({ filterMode: 0, filterFreq: 20000 }) / dry).toBeGreaterThan(0.9);
    expect(level({ filterMode: 0, filterFreq: 60 }) / dry).toBeLessThan(0.02);
    expect(level({ filterMode: 8, filterFreq: 3000 }) / dry).toBeLessThan(0.02);
    expect(level({ filterMode: 4, filterFreq: 220, filterRes: 0 }) / dry).toBeLessThan(0.2); // notch
  });
  it('los 9 modos son estables con resonancia máxima', () => {
    for (let mode = 0; mode < 9; mode++) {
      const e = makeEngine({ filterMode: mode, filterFreq: 800, filterRes: 1, 'filterFreq>lfo': 1, lfoRate: 15 });
      on(e, 1);
      const [L] = render(e, 1);
      expect(allFinite(L)).toBe(true);
      expect(Math.max(...L.map(Math.abs))).toBeLessThanOrEqual(1);
    }
  });
  it('la curva dibujada del filtro coincide con el corte', () => {
    expect(filterMagnitude(1, 1000, 0.15, 0, 100)).toBeCloseTo(1, 1);
    expect(filterMagnitude(0, 1000, 0.15, 0, 8000)).toBeLessThan(0.001);
  });
  it('Env 1: ataque lento sube poco a poco', () => {
    const e = makeEngine({ e1A: 1 });
    on(e, 1);
    const [L] = render(e, 1.2);
    expect(rms(L, 0, 4800)).toBeLessThan(rms(L, 24000, 28800));
    expect(rms(L, 24000, 28800)).toBeLessThan(rms(L, 52000, 56800));
  });
  it('LFO a volumen produce trémolo; con Amount = 0 no', () => {
    const swing = (amount: number) => {
      const e = makeEngine({ size: 30, 'volume>lfo': 1, lfoRate: 4, lfoAmount: amount });
      on(e, 1);
      const [L] = render(e, 1.5);
      const lv: number[] = [];
      for (let i = SR / 2; i + 1200 <= L.length; i += 1200) lv.push(rms(L, i, i + 1200));
      return Math.max(...lv) / (Math.min(...lv) + 1e-6);
    };
    expect(swing(1)).toBeGreaterThan(5);
    expect(swing(0)).toBeLessThan(1.3);
  });
  it('formas del LFO: rangos, unipolares y estéreo', () => {
    const l = new Lfo();
    for (let shape = 0; shape < 8; shape++) {
      for (let stereo = 0; stereo < 3; stereo++) {
        l.reset(0, 99);
        let min = 9, max = -9;
        for (let i = 0; i < 4000; i++) {
          l.tick(0.013, shape, stereo, 0);
          min = Math.min(min, l.out[0], l.out[1]); max = Math.max(max, l.out[0], l.out[1]);
          if (stereo === 0) expect(l.out[1]).toBe(l.out[0]);
        }
        expect(max).toBeLessThanOrEqual(1.0001);
        expect(min).toBeGreaterThanOrEqual(shape === 2 || shape === 3 ? 0 : -1.0001);
        expect(max - min).toBeGreaterThan(0.8);
      }
    }
    // Quant: solo niveles discretos.
    l.reset(0, 1);
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) { l.tick(0.01, 0, 0, 4); seen.add(Math.round(l.out[0] * 1000)); }
    expect(seen.size).toBeLessThanOrEqual(9);
  });
});

describe('Fase 5 · Modulación, MPE, mono y Hold', () => {
  it('Transpose>Key = 0 deja todas las notas a la misma altura', () => {
    const e = makeEngine({ size: 100, 'transpose>key': 0 });
    on(e, 1, 84);
    near(zeroCrossFreq(render(e, 1)[0], SR / 2), 220);
  });
  it('Pitch Bend MPE por nota con rango de 48 st', () => {
    const e = makeEngine({ size: 100, pbRange: 48 });
    on(e, 1);
    e.message({ t: 'expr', id: 1, bend: 0.25, slide: 0, press: 0 }); // +12 st
    near(zeroCrossFreq(render(e, 1)[0], SR / 2), 440);
  });
  it('Slide y Press modulan sus destinos (filtro y volumen)', () => {
    const lv = (press: number) => {
      const e = makeEngine({ size: 100, 'volume>press': 1 });
      on(e, 1);
      e.message({ t: 'expr', id: 1, bend: 0, slide: 0, press });
      return rms(render(e, 0.6)[0], SR * 0.3);
    };
    expect(lv(0.1)).toBeLessThan(lv(1) * 0.2);
  });
  it('Mono: una sola voz y Glide solo en notas solapadas', () => {
    const e = makeEngine({ size: 100, mono: 1, glide: 1 });
    on(e, 1, 60);
    render(e, 0.3);
    on(e, 2, 72); // solapada → glide de 1 s
    expect(active(e)).toBe(1);
    const mid = zeroCrossFreq(render(e, 0.5)[0], SR * 0.4);
    expect(mid).toBeGreaterThan(250);
    expect(mid).toBeLessThan(420);
    near(zeroCrossFreq(render(e, 1)[0], SR * 0.7), 440);
    off(e, 2); // vuelve a la nota que sigue pulsada
    near(zeroCrossFreq(render(e, 1.5)[0], SR * 1.2), 220);
    off(e, 1);
    // Nota no solapada: salta sin glide.
    render(e, 1);
    on(e, 3, 72);
    near(zeroCrossFreq(render(e, 0.3)[0], SR * 0.1), 440);
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
    off(e, 3);
    set(e, { hold: 0 });
    render(e, 0.01);
    expect(e.voices.filter((v) => v.active && v.gate).length).toBe(0);
  });
  it('sample estéreo: cada canal lee su lado', () => {
    const e = makeEngine({ size: 100 }, true);
    on(e, 1);
    const [L, R] = render(e, 1);
    near(zeroCrossFreq(L, SR / 2), 220);
    near(zeroCrossFreq(R, SR / 2), 330);
  });
});
