// Esquema único de parámetros de Enjambre (efecto granular y de micro-bucles sobre la entrada).
// De aquí salen el DSP (índices en un Float32Array), la UI (rangos, etiquetas) y los presets.
// La organización de controles sigue la de DigiSwarm (mod del Digitone inspirado en el Microcosm):
// Activity, Repeats, Shape, Filter, Mix, Time, Space…; el código es propio.

export type Curve = 'lin' | 'log' | 'int' | 'bool' | 'enum';

export interface ParamDef {
  id: string;
  label: string;
  min: number;
  max: number;
  def: number;
  curve: Curve;
  unit: string;
  group: string;
  options?: string[];
  /** No se usa (no hay matriz de modulación); se conserva por compatibilidad con los controles. */
  dest?: string;
}

/** Motores disponibles. Cada uno tiene 4 variaciones (A–D). */
export const ENGINES = ['Shards', 'Mist', 'Glide', 'Pattern'] as const;
export const ENGINE_INFO = [
  'Bucles a varias velocidades',
  'Nubes de granos',
  'Bucles cuya velocidad se desliza',
  'Repeticiones de un delay en patrones',
];
export const VARIATIONS = ['A', 'B', 'C', 'D'] as const;
/** Qué hace cada variación de cada motor (para mostrarlo en pantalla). */
export const VARIATION_INFO: string[][] = [
  ['1x y 2x', '1x y 0,5x', 'todo a 2x', '0,5x, 1x, 2x y 4x'],
  ['estirada', 'aleatoria', '1x y 2x', '1x y 0,5x'],
  ['0,5x → 1x', '2x → 0,5x', '1x → 2x', 'sube y baja a la vez'],
  ['regular', 'sincopado', 'racimos', 'tresillos'],
];
/** Subdivisión del tempo (rejilla de los motores) y su duración en negras. */
export const TIMES = ['1 compás', '1/2', '1/4', '1/8', '1/16', '1/32'] as const;
export const TIME_BEATS = [4, 2, 1, 0.5, 0.25, 0.125];
/** Salas de la reverb (Space). */
export const ROOMS = ['Pequeña', 'Sala', 'Grande', 'Infinita'] as const;
/** Velocidades del looper y su factor. */
export const LOOP_SPEEDS = ['1/4x', '1/2x', '1x', '2x', '4x'] as const;
export const LOOP_SPEED_RATES = [0.25, 0.5, 1, 2, 4];
/**
 * Dónde está el looper. Post: graba lo que se oye (la señal y el efecto) y lo reproduce tal cual.
 * Pre: graba la entrada y su reproducción pasa por el efecto, como si fuera otra fuente.
 */
export const LOOP_ROUTES = ['Post', 'Pre'] as const;
/** Duración del fundido al parar el bucle, en segundos (Fade loop de 0 a 1). */
export const loopFadeSeconds = (v: number) => 0.01 + v * v * 8;
/** Nombres de las formas de cada bucle o grano (Shape). */
export const SHAPES = ['Plana', 'Crece', 'Golpe', 'Arco'] as const;

const defs: ParamDef[] = [];
function P(
  group: string, id: string, label: string, min: number, max: number, def: number,
  curve: Curve = 'lin', unit = '', options?: readonly string[],
) {
  defs.push({ id, label, min, max, def, curve, unit, group, options: options ? [...options] : undefined });
}
const E = (group: string, id: string, label: string, options: readonly string[], def = 0) =>
  P(group, id, label, 0, options.length - 1, def, 'enum', '', options);
const B = (group: string, id: string, label: string, def = 0) => P(group, id, label, 0, 1, def, 'bool');

// --- Efecto ---
E('effect', 'engine', 'Motor', ENGINES, 0);
E('effect', 'variation', 'Variación', VARIATIONS, 0);
P('effect', 'activity', 'Activity', 0, 1, 0.5, 'lin', '%');
P('effect', 'repeats', 'Repeats', 0, 1, 0.5, 'lin', '%');
P('effect', 'shape', 'Shape', 0, 1, 0, 'lin', 'shape');
P('effect', 'filter', 'Filter', -1, 1, 0, 'lin', 'filt');
P('effect', 'mix', 'Mix', 0, 1, 0.5, 'lin', '%');
E('effect', 'time', 'Time', TIMES, 3);
P('effect', 'space', 'Space', 0, 1, 0.25, 'lin', '%');
// --- Shift ---
P('shift', 'inGain', 'Ganancia', -24, 24, 0, 'lin', 'dB');
P('shift', 'modDepth', 'Mod Depth', 0, 1, 0, 'lin', '%');
P('shift', 'modRate', 'Mod Rate', 0.05, 8, 0.6, 'log', 'Hz');
P('shift', 'reso', 'Resonancia', 0, 1, 0.2, 'lin', '%');
P('shift', 'fxVol', 'Vol. efecto', -24, 12, 0, 'lin', 'dB');
E('shift', 'room', 'Sala', ROOMS, 1);
// --- Looper ---
P('looper', 'loopLevel', 'Loop', 0, 1, 0.8, 'lin', '%');
E('looper', 'loopSpeed', 'Vel. loop', LOOP_SPEEDS, 2);
P('looper', 'loopFade', 'Fade loop', 0, 1, 0, 'lin', 'fade');
B('looper', 'reverse', 'Reverse', 0);
E('looper', 'loopRoute', 'Ruta loop', LOOP_ROUTES, 0);
B('looper', 'loopQuant', 'Cuantizar', 0);
// --- Estados ---
B('state', 'hold', 'Hold', 0);
B('state', 'bypass', 'Bypass', 0);
// --- Tempo ---
P('io', 'bpm', 'BPM', 40, 240, 120, 'lin', 'bpm');
B('io', 'clockSync', 'MIDI Clock', 1);

export const PARAMS: readonly ParamDef[] = defs;
export const NUM_PARAMS = defs.length;
export const PARAM_INDEX: Record<string, number> = {};
defs.forEach((d, i) => (PARAM_INDEX[d.id] = i));

export function pidx(id: string): number {
  const i = PARAM_INDEX[id];
  if (i === undefined) throw new Error(`Parámetro desconocido: ${id}`);
  return i;
}
export function pdef(id: string): ParamDef {
  return defs[pidx(id)];
}

export function defaultValues(): Float32Array {
  const a = new Float32Array(NUM_PARAMS);
  defs.forEach((d, i) => (a[i] = d.def));
  return a;
}

export function clampParam(d: ParamDef, v: number): number {
  if (d.curve === 'int' || d.curve === 'enum' || d.curve === 'bool') v = Math.round(v);
  return Math.min(d.max, Math.max(d.min, v));
}

/** Valor real → posición normalizada 0..1 del control. */
export function toNorm(d: ParamDef, v: number): number {
  if (d.curve === 'log') return Math.log(v / d.min) / Math.log(d.max / d.min);
  return (v - d.min) / (d.max - d.min);
}
/** Posición normalizada 0..1 → valor real. */
export function fromNorm(d: ParamDef, n: number): number {
  n = Math.min(1, Math.max(0, n));
  if (d.curve === 'log') return d.min * Math.pow(d.max / d.min, n);
  return clampParam(d, d.min + n * (d.max - d.min));
}

/** Texto legible de un valor. */
export function formatParam(d: ParamDef, v: number): string {
  if (d.curve === 'enum') return d.options![Math.round(v)] ?? '';
  if (d.curve === 'bool') return v >= 0.5 ? 'On' : 'Off';
  switch (d.unit) {
    case '%': return `${Math.round(v * 100)} %`;
    case 'shape': return SHAPES[Math.min(3, Math.round(v * 3))];
    case 'fade': { const t = loopFadeSeconds(v); return t < 1 ? `${Math.round(t * 1000)} ms` : `${t.toFixed(1)} s`; }
    case 'filt':
      if (Math.abs(v) < FILTER_DEAD) return 'Off';
      return `${v < 0 ? 'LP' : 'HP'} ${Math.round(Math.abs(v) * 100)}`;
    case 'Hz': return v < 10 ? `${v.toFixed(2)} Hz` : `${Math.round(v)} Hz`;
    case 'dB': return `${v > 0 ? '+' : ''}${v.toFixed(1)} dB`;
    case 'bpm': return v.toFixed(1);
    default: return d.curve === 'int' ? `${Math.round(v)}` : v.toFixed(2);
  }
}

/** Zona central del control Filter en la que el filtro está apagado. */
export const FILTER_DEAD = 0.03;

/** Duración de un paso de la rejilla, en segundos. */
export function stepSeconds(time: number, bpm: number): number {
  return (60 / bpm) * TIME_BEATS[Math.round(time)];
}

// Mensajes UI → worklet.
export type EngineMsg =
  | { t: 'param'; i: number; v: number }
  | { t: 'params'; a: Float32Array }
  /** Vacía el historial, las cabezas y la reverb. */
  | { t: 'clear' }
  /** Sonido de prueba: un arpegio corto que entra al efecto como si viniera de la entrada. */
  | { t: 'pluck' }
  /** Acción del looper (ver audio/worklet/looper.ts). */
  | { t: 'loop'; a: 'loop' | 'rec' | 'play' | 'dub' | 'stop' | 'undo' | 'clear' };

/** Puntos del historial de entrada que se envían a la UI, y segundos que abarcan. */
export const HIST_POINTS = 200;
export const HIST_SECONDS = 8;
/** Máximo de cabezas (lectores) sonando a la vez. */
export const MAX_HEADS = 16;

// Telemetría worklet → UI (~30 Hz).
export interface Telemetry {
  t: 'tel';
  cpu: number; // fracción del tiempo real usada por el DSP (0..1)
  inPeak: number;
  outPeak: number;
  /** Envolvente de la entrada en los últimos HIST_SECONDS (del más antiguo al más reciente). */
  hist: Float32Array;
  /**
   * Cabezas activas: por cada una, [antigüedad en segundos de lo que lee, nivel 0..1, velocidad].
   * Con Hold, la antigüedad se mide desde el momento en que se activó.
   */
  heads: Float32Array;
  /** Posición dentro del paso actual (0..1) y número de paso. */
  stepPhase: number;
  step: number;
  /** Looper: estado (0 vacío, 1 grabando, 2 sonando, 3 sobregrabando, 4 parado), duración en s, posición 0..1. */
  loopState: number;
  loopLen: number;
  loopPos: number;
  /** Hay una sobregrabación que se puede deshacer. */
  loopLayer: boolean;
  /** Hay una acción esperando al siguiente paso (Cuantizar). */
  loopPending: boolean;
}
