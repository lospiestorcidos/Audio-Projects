// Esquema único de parámetros de Ecos (delay).
// De aquí salen el DSP (índices en un Float32Array), la UI (rangos, etiquetas) y los presets.

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
  /** No se usa en Ecos (no hay matriz de modulación); se conserva por compatibilidad con los controles. */
  dest?: string;
}

/** Figuras del tiempo sincronizado (T = tresillo, . = con puntillo) y su duración en negras. */
export const DIVS = ['1/32', '1/16T', '1/16', '1/8T', '1/16.', '1/8', '1/4T', '1/8.', '1/4', '1/2T', '1/4.', '1/2', '1/1'] as const;
export const DIV_BEATS = [0.125, 1 / 6, 0.25, 1 / 3, 0.375, 0.5, 2 / 3, 0.75, 1, 4 / 3, 1.5, 2, 4];
/** Retardo máximo que cabe en el buffer, en segundos. */
export const MAX_DELAY = 8;

const defs: ParamDef[] = [];
function P(
  group: string, id: string, label: string, min: number, max: number, def: number,
  curve: Curve = 'lin', unit = '', options?: readonly string[],
) {
  defs.push({ id, label, min, max, def, curve, unit, group, options: options ? [...options] : undefined });
}
const B = (group: string, id: string, label: string, def = 0) => P(group, id, label, 0, 1, def, 'bool');

// --- Delay ---
B('delay', 'sync', 'Sync', 1);
P('delay', 'time', 'Tiempo', 10, 2000, 375, 'log', 'ms');
P('delay', 'div', 'Tiempo', 0, DIVS.length - 1, 7, 'enum', '', DIVS);
P('delay', 'feedback', 'Feedback', 0, 1.1, 0.45, 'lin', '%');
P('delay', 'mix', 'Mezcla', 0, 1, 0.4, 'lin', '%');
B('delay', 'pingpong', 'Ping-pong', 0);
P('delay', 'spread', 'Estéreo', 0, 1, 0, 'lin', '%');
P('delay', 'duck', 'Duck', 0, 1, 0, 'lin', '%');
B('delay', 'freeze', 'Freeze', 0);
P('delay', 'outGain', 'Volumen', -24, 12, 0, 'lin', 'dB');
// --- Tono: lo que le pasa al sonido en cada repetición ---
P('tone', 'lowCut', 'Corte graves', 20, 2000, 20, 'log', 'Hz');
P('tone', 'highCut', 'Corte agudos', 500, 20000, 9000, 'log', 'Hz');
P('tone', 'drive', 'Saturación', 0, 1, 0, 'lin', '%');
P('tone', 'modRate', 'Mod Rate', 0.05, 8, 0.5, 'log', 'Hz');
P('tone', 'modDepth', 'Mod Cantidad', 0, 1, 0, 'lin', '%');
// --- Entrada y tempo ---
P('io', 'inGain', 'Ganancia', -24, 24, 0, 'lin', 'dB');
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
    case 'ms': return v < 1000 ? `${Math.round(v)} ms` : `${(v / 1000).toFixed(2)} s`;
    case 'Hz': return v < 10 ? `${v.toFixed(2)} Hz` : v < 1000 ? `${Math.round(v)} Hz` : `${(v / 1000).toFixed(1)} kHz`;
    case 'dB': return `${v > 0 ? '+' : ''}${v.toFixed(1)} dB`;
    case 'bpm': return v.toFixed(1);
    default: return d.curve === 'int' ? `${Math.round(v)}` : v.toFixed(2);
  }
}

/** Tiempo de retardo en segundos que resulta de los parámetros (sincronizado o libre). */
export function delaySeconds(sync: boolean, timeMs: number, div: number, bpm: number): number {
  const s = sync ? (60 / bpm) * DIV_BEATS[Math.round(div)] : timeMs / 1000;
  return Math.min(MAX_DELAY, Math.max(0.001, s));
}

// Mensajes UI → worklet.
export type EngineMsg =
  | { t: 'param'; i: number; v: number }
  | { t: 'params'; a: Float32Array }
  /** Vacía la línea de retardo. */
  | { t: 'clear' }
  /** Sonido de prueba: una nota corta que entra al delay como si viniera del micrófono. */
  | { t: 'pluck' };

/** Puntos del historial de salida que se envían a la UI. */
export const HIST_POINTS = 160;
/** Segundos que abarca el historial. */
export const HIST_SECONDS = 6;

// Telemetría worklet → UI (~30 Hz).
export interface Telemetry {
  t: 'tel';
  cpu: number; // fracción del tiempo real usada por el DSP (0..1)
  /** Picos de entrada y de salida desde la última telemetría. */
  inPeak: number;
  outPeak: number;
  /** Retardo real ahora mismo, en segundos (se desliza al cambiar el tiempo). */
  delay: number;
  /** Envolvente del sonido con efecto en los últimos HIST_SECONDS (del más antiguo al más reciente). */
  hist: Float32Array;
}
