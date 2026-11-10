// Tablas de ondas: formato, limitación en banda (mipmaps), tablas de fábrica y conversión de audio.
// Código puro (sin DOM): lo usan la UI, el worklet y los tests.
import { fft } from './fft';

/** Muestras por ciclo (el estándar de facto: Serum, Vital, Ableton…). */
export const FRAME = 2048;
/** Niveles de mipmap: el nivel k conserva los armónicos 1..(1024 >> k). */
export const LEVELS = 11;
export const MAX_FRAMES = 256;

/** Tabla sin procesar: `count` ciclos de FRAME muestras, uno detrás de otro. */
export interface Wavetable {
  name: string;
  count: number;
  data: Float32Array;
}

/**
 * Versiones limitadas en banda de cada ciclo, para tocar sin aliasing a cualquier altura.
 * Disposición: [nivel][ciclo][FRAME + 1 muestras] (la última repite la primera: guarda para interpolar).
 * También quita la componente continua y normaliza la tabla a pico 1.
 */
export function buildMipmaps(t: Wavetable): Float32Array {
  const F = t.count, stride = FRAME + 1;
  const out = new Float32Array(LEVELS * F * stride);
  const re = new Float64Array(FRAME), im = new Float64Array(FRAME);
  const sr = new Float64Array(FRAME), si = new Float64Array(FRAME);
  let peak = 0;
  for (let f = 0; f < F; f++) {
    for (let i = 0; i < FRAME; i++) { sr[i] = t.data[f * FRAME + i]; si[i] = 0; }
    fft(sr, si);
    sr[0] = 0; si[0] = 0; // sin continua
    for (let k = 0; k < LEVELS; k++) {
      const maxH = 1024 >> k;
      re.fill(0); im.fill(0);
      for (let h = 1; h <= maxH && h < FRAME / 2; h++) {
        re[h] = sr[h]; im[h] = si[h];
        re[FRAME - h] = sr[FRAME - h]; im[FRAME - h] = si[FRAME - h];
      }
      fft(re, im, true);
      const base = (k * F + f) * stride;
      for (let i = 0; i < FRAME; i++) {
        const v = re[i] / FRAME;
        out[base + i] = v;
        if (k === 0) { const a = v < 0 ? -v : v; if (a > peak) peak = a; }
      }
      out[base + FRAME] = out[base];
    }
  }
  if (peak > 1e-9) { const g = 1 / peak; for (let i = 0; i < out.length; i++) out[i] *= g; }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Construcción de ciclos
// ---------------------------------------------------------------------------------------------

/** Un ciclo a partir de amplitudes de armónicos (amps[h] = armónico h+1) y fases opcionales (en ciclos). */
export function fromHarmonics(amps: ArrayLike<number>, phases?: ArrayLike<number>): Float32Array {
  const re = new Float64Array(FRAME), im = new Float64Array(FRAME);
  for (let h = 1; h <= amps.length && h < FRAME / 2; h++) {
    const a = amps[h - 1];
    if (!a) continue;
    // Seno de amplitud a y fase ph: bins ±h con parte imaginaria (y real si hay fase).
    const ph = phases ? phases[h - 1] * 2 * Math.PI : 0;
    const r = (a / 2) * Math.sin(ph), i = (-a / 2) * Math.cos(ph);
    re[h] = r; im[h] = i; re[FRAME - h] = r; im[FRAME - h] = -i;
  }
  fft(re, im, true);
  const out = new Float32Array(FRAME);
  for (let i = 0; i < FRAME; i++) out[i] = re[i];
  return out;
}

function table(name: string, count: number, frame: (t: number, index: number) => Float32Array): Wavetable {
  const data = new Float32Array(count * FRAME);
  for (let f = 0; f < count; f++) data.set(frame(count > 1 ? f / (count - 1) : 0, f), f * FRAME);
  return { name, count, data };
}

function rng(seed: number) {
  let s = seed;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

const H = 256; // armónicos que usan las tablas de fábrica aditivas
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Seno → triángulo → sierra → cuadrada, interpolando sus espectros. */
function basica(): Wavetable {
  const shapes = [
    (h: number) => (h === 1 ? 1 : 0),
    (h: number) => (h % 2 ? ((h >> 1) % 2 ? -1 : 1) / (h * h) : 0),
    (h: number) => 1 / h,
    (h: number) => (h % 2 ? 1 / h : 0),
  ];
  return table('Básica', 64, (t) => {
    const x = t * (shapes.length - 1), i = Math.min(shapes.length - 2, Math.floor(x)), f = x - i;
    return fromHarmonics(Array.from({ length: H }, (_, k) => lerp(shapes[i](k + 1), shapes[i + 1](k + 1), f)));
  });
}

/** Pulso con el ancho yendo del 50 % al 3 %. */
function pulso(): Wavetable {
  return table('Pulso', 64, (t) => {
    const w = lerp(0.5, 0.03, t), out = new Float32Array(FRAME);
    for (let i = 0; i < FRAME; i++) out[i] = i / FRAME < w ? 1 : -1;
    return out;
  });
}

/** Un pico de resonancia que recorre los armónicos sobre una base de sierra suave. */
function armonicos(): Wavetable {
  return table('Armónicos', 64, (t) => {
    const center = 1 + t * 40;
    return fromHarmonics(Array.from({ length: H }, (_, k) => {
      const h = k + 1, d = (h - center) / (1.5 + t * 2);
      return 0.35 / (h * h) + Math.exp(-d * d) / Math.sqrt(h);
    }));
  });
}

/** Sierra pasada por los formantes de las vocales A-E-I-O-U (a 110 Hz de referencia). */
function formantes(): Wavetable {
  const vowels = [[800, 1150, 2900], [400, 1700, 2600], [300, 2300, 3000], [450, 800, 2830], [325, 700, 2700]];
  return table('Formantes', 64, (t) => {
    const x = t * (vowels.length - 1), i = Math.min(vowels.length - 2, Math.floor(x)), f = x - i;
    const fm = vowels[i].map((v, k) => lerp(v, vowels[i + 1][k], f));
    return fromHarmonics(Array.from({ length: H }, (_, k) => {
      const hz = (k + 1) * 110;
      let g = 0.02;
      fm.forEach((c, n) => { const d = (hz - c) / (90 + n * 40); g += [1, 0.6, 0.35][n] / (1 + d * d); });
      return g / (k + 1) ** 0.5;
    }));
  });
}

/** Espectros aleatorios escalonados que se transforman unos en otros. */
function digital(): Wavetable {
  const r = rng(77), keys = 9;
  const spectra = Array.from({ length: keys }, (_, n) =>
    Array.from({ length: 64 }, (_, k) => (r() < 0.25 + n * 0.04 ? r() / (1 + k * 0.08) : 0)));
  spectra.forEach((s) => (s[0] = 0.6 + 0.4 * s[0]));
  return table('Digital', 64, (t) => {
    const x = t * (keys - 1), i = Math.min(keys - 2, Math.floor(x)), f = x - i;
    return fromHarmonics(spectra[i].map((a, k) => lerp(a, spectra[i + 1][k], f)));
  });
}

/** Parciales de campana (redondeados al armónico más próximo), de apagada a brillante. */
function campanas(): Wavetable {
  const partials = [1, 2.76, 5.4, 8.93, 13.34, 18.64, 24.8, 31.9];
  return table('Campanas', 64, (t) => {
    const amps = new Array(H).fill(0);
    partials.forEach((p, n) => {
      const h = Math.max(1, Math.round(p * lerp(1, 2.2, t)));
      if (h <= H) amps[h - 1] += Math.exp(-n * lerp(1.1, 0.25, t));
    });
    return fromHarmonics(amps);
  });
}

/** Seno plegado cada vez con más ganancia (waveshaping). */
function plegada(): Wavetable {
  return table('Plegada', 64, (t) => {
    const g = 1 + t * 7, out = new Float32Array(FRAME);
    for (let i = 0; i < FRAME; i++) out[i] = Math.sin((Math.PI / 2) * g * Math.sin((2 * Math.PI * i) / FRAME));
    return out;
  });
}

/** Seno sincronizado: cada vez caben más ciclos dentro de una ventana. */
function sync(): Wavetable {
  return table('Sync', 64, (t) => {
    const ratio = 1 + t * 7, out = new Float32Array(FRAME);
    for (let i = 0; i < FRAME; i++) {
      const p = i / FRAME;
      out[i] = Math.sin(2 * Math.PI * p * ratio) * (0.5 - 0.5 * Math.cos(2 * Math.PI * p));
    }
    return out;
  });
}

const GENERATORS: Record<string, () => Wavetable> = {
  'Básica': basica, Pulso: pulso, 'Armónicos': armonicos, Formantes: formantes,
  Digital: digital, Campanas: campanas, Plegada: plegada, Sync: sync,
};
export const FACTORY_TABLES = Object.keys(GENERATORS);
const cache = new Map<string, Wavetable>();

/** Tabla de fábrica por nombre (se genera la primera vez que se pide). */
export function factoryTable(name: string): Wavetable {
  const key = GENERATORS[name] ? name : FACTORY_TABLES[0];
  if (!cache.has(key)) cache.set(key, GENERATORS[key]());
  return cache.get(key)!;
}

// ---------------------------------------------------------------------------------------------
// Tablas a partir de audio
// ---------------------------------------------------------------------------------------------

/**
 * Importa un archivo de tabla de ondas: ciclos de FRAME muestras seguidos (formato Serum y similares).
 * Si el audio es más corto que un ciclo, se estira a un único ciclo.
 */
export function tableFromCycles(name: string, mono: Float32Array): Wavetable {
  if (mono.length < FRAME) {
    const data = new Float32Array(FRAME);
    for (let i = 0; i < FRAME; i++) {
      const x = (i / FRAME) * mono.length, xi = Math.floor(x), fr = x - xi;
      data[i] = mono[xi] + fr * (mono[(xi + 1) % mono.length] - mono[xi]);
    }
    return { name, count: 1, data };
  }
  const count = Math.min(MAX_FRAMES, Math.floor(mono.length / FRAME));
  return { name, count, data: mono.slice(0, count * FRAME) };
}

/** ¿Parece un archivo de tabla de ondas (múltiplo exacto de FRAME y no demasiado largo)? */
export function looksLikeWavetable(length: number): boolean {
  return length >= FRAME && length % FRAME === 0 && length / FRAME <= MAX_FRAMES;
}

/**
 * Convierte cualquier audio (un sample, una captura) en tabla de ondas "espectral":
 * cada ciclo lleva el espectro del sonido en un instante. Las fases son fijas por armónico
 * en toda la tabla, así el paso de un ciclo a otro es suave y sin cancelaciones.
 */
export function tableFromAudio(name: string, mono: Float32Array, count = 64): Wavetable {
  const data = new Float32Array(count * FRAME);
  const re = new Float64Array(FRAME), im = new Float64Array(FRAME);
  const r = rng(1234);
  const phases = Float32Array.from({ length: 512 }, () => r());
  const amps = new Float32Array(512);
  const span = Math.max(0, mono.length - FRAME);
  for (let f = 0; f < count; f++) {
    const start = Math.floor(count > 1 ? (f / (count - 1)) * span : 0);
    for (let i = 0; i < FRAME; i++) {
      const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / FRAME);
      re[i] = (start + i < mono.length ? mono[start + i] : 0) * w;
      im[i] = 0;
    }
    fft(re, im);
    for (let h = 1; h <= 512; h++) amps[h - 1] = Math.hypot(re[h], im[h]);
    data.set(fromHarmonics(amps, phases), f * FRAME);
  }
  return { name, count, data };
}
