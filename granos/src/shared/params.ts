// Esquema único de parámetros de Granos.
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
  /** Si es una ruta de modulación: destino y fuente. */
  dest?: string;
  src?: SourceId;
}

export const MODES = ['Classic', 'Loop', 'Cloud'] as const;
export const FILTER_MODES = [
  'LP 24', 'LP 12', 'LP→HP', 'LP→Notch', 'Notch', 'Notch ×2', 'HP→Notch', 'HP 12', 'HP 24',
] as const;
export const LFO_MODES = ['Libre', 'Sync', 'Audio'] as const;
export const LFO_DIVS = ['1/16', '1/8', '1/4', '1/2', '1 compás', '2 compases'] as const;
/** Duración en negras de cada división de LFO_DIVS. */
export const LFO_DIV_BEATS = [0.25, 0.5, 1, 2, 4, 8];
export const LFO_SHAPES = ['Sine', 'Triangle', 'Up', 'Down', 'Rect', 'S&H', 'Rand', 'Move'] as const;
export const LFO_STEREO = ['0°', '90°', '180°'] as const;

// Fuentes de modulación. El orden define el índice en el vector de fuentes de cada voz.
export const SOURCES = ['lfo', 'env1', 'env2', 'key', 'vel', 'bend', 'slide', 'press', 'rand'] as const;
export type SourceId = (typeof SOURCES)[number];
export const SOURCE_LABELS: Record<SourceId, string> = {
  lfo: 'LFO', env1: 'Env 1', env2: 'Env 2', key: 'Key', vel: 'Velocity',
  bend: 'Bend (X)', slide: 'Slide (Y)', press: 'Press', rand: 'Random',
};

// Qué fuentes admite cada destino y su valor por defecto (no todos admiten todas).
export const MOD_TABLE: Record<string, Partial<Record<SourceId, number>>> = {
  position: { lfo: 0, env2: 0, key: 0, vel: 0, bend: 0, slide: 0, press: 0 },
  scanSpeed: { key: 0, vel: 0, slide: 0, env2: 0, lfo: 0 },
  size: { key: 0, vel: 0, slide: 0, press: 0, lfo: 0, env2: 0 },
  shape: { slide: 0, press: 0, lfo: 0, env2: 0 },
  variation: { slide: 0, press: 0, lfo: 0, env2: 0, key: 0, vel: 0 },
  transpose: { key: 1, press: 0, env2: 0, lfo: 0, rand: 0 },
  spread: { vel: 0, slide: 0, press: 0, env2: 0, lfo: 0 },
  volume: { key: 0, vel: 0.5, slide: 0, press: 0, lfo: 0 },
  filterFreq: { bend: 0, slide: 0, press: 0, env1: 0, env2: 0, key: 1, vel: 0, lfo: 0 },
  lfoRate: { bend: 0, slide: 0, env2: 0, key: 0, vel: 0, rand: 0 },
  lfoAmount: { slide: 0, press: 0, env2: 0, key: 0, vel: 0 },
};

const defs: ParamDef[] = [];
function P(
  group: string, id: string, label: string, min: number, max: number, def: number,
  curve: Curve = 'lin', unit = '', options?: readonly string[],
) {
  defs.push({ id, label, min, max, def, curve, unit, group, options: options ? [...options] : undefined });
}
function E(group: string, id: string, label: string, options: readonly string[], def = 0) {
  P(group, id, label, 0, options.length - 1, def, 'enum', '', options);
}
function B(group: string, id: string, label: string, def = 0) {
  P(group, id, label, 0, 1, def, 'bool');
}

// --- Grano ---
E('grain', 'mode', 'Modo', MODES, 0);
P('grain', 'position', 'Position', 0, 1, 0.25, 'lin', '%');
P('grain', 'size', 'Grain Size', 2, 2000, 120, 'log', 'ms');
P('grain', 'shape', 'Shape', 0, 1, 0.5, 'lin', '%');
P('grain', 'reverse', 'Reverse', 0, 1, 0, 'lin', '%');
P('grain', 'density', 'Density', 1, 20, 8, 'int', '');
P('grain', 'transpose', 'Transpose', -48, 48, 0, 'int', 'st');
P('grain', 'tune', 'Tune', -100, 100, 0, 'lin', 'ct');
P('grain', 'spread', 'Spread', 0, 1, 0, 'lin', '%');
P('grain', 'volume', 'Volume', -36, 12, 0, 'lin', 'dB');
// --- Scan ---
P('scan', 'scanSpeed', 'Scan Speed', 0, 2, 0, 'lin', '%');
P('scan', 'scanDist', 'Distance', -1, 1, 1, 'lin', '%');
B('scan', 'scanLoop', 'Loop', 1);
// --- Variation ---
P('var', 'variation', 'Variation', 0, 1, 0, 'lin', '%');
P('var', 'varPos', 'Var Position', 0, 2, 0.1, 'lin', 's');
P('var', 'varSize', 'Var Size', 0, 1, 0, 'lin', '%');
P('var', 'varPitch', 'Var Transp', 0, 1, 0, 'lin', '%');
P('var', 'varVol', 'Var Volume', 0, 1, 0, 'lin', '%');
// --- Filtro ---
B('filter', 'filterOn', 'Filtro', 1);
E('filter', 'filterMode', 'Tipo', FILTER_MODES, 0);
P('filter', 'filterFreq', 'Frequency', 20, 20000, 20000, 'log', 'Hz');
P('filter', 'filterRes', 'Resonance', 0, 1, 0.15, 'lin', '%');
P('filter', 'filterWidth', 'Width', -4, 4, -1, 'lin', 'oct');
// --- Envolventes ---
P('env1', 'e1A', 'Attack', 0.001, 20, 0.005, 'log', 's');
P('env1', 'e1D', 'Decay', 0.001, 60, 0.5, 'log', 's');
P('env1', 'e1S', 'Sustain', 0, 1, 1, 'lin', '%');
P('env1', 'e1R', 'Release', 0.001, 60, 0.3, 'log', 's');
P('env1', 'e1Key', 'Key', -1, 1, 0, 'lin', '%');
P('env2', 'e2A', 'Attack', 0.001, 20, 0.5, 'log', 's');
P('env2', 'e2D', 'Decay', 0.001, 60, 1, 'log', 's');
P('env2', 'e2S', 'Sustain', 0, 1, 0.5, 'lin', '%');
P('env2', 'e2R', 'Release', 0.001, 60, 0.5, 'log', 's');
P('env2', 'e2Key', 'Key', -1, 1, 0, 'lin', '%');
// --- LFO ---
E('lfo', 'lfoMode', 'Modo', LFO_MODES, 0);
P('lfo', 'lfoRate', 'Rate', 0.01, 20, 1, 'log', 'Hz');
E('lfo', 'lfoDiv', 'Sync', LFO_DIVS, 2);
P('lfo', 'lfoAudio', 'Audio Rate', 20, 800, 110, 'log', 'Hz');
E('lfo', 'lfoShape', 'Forma', LFO_SHAPES, 0);
P('lfo', 'lfoPhase', 'Phase', 0, 1, 0, 'lin', '°');
B('lfo', 'lfoRandPhase', 'Fase aleatoria', 0);
E('lfo', 'lfoStereo', 'Stereo', LFO_STEREO, 0);
P('lfo', 'lfoQuant', 'Quant', 0, 16, 0, 'int', '');
P('lfo', 'lfoAmount', 'Amount', 0, 1, 1, 'lin', '%');
B('lfo', 'lfoModWheel', 'Use Mod Wheel', 0);
P('lfo', 'bpm', 'BPM', 40, 240, 120, 'int', '');
// --- Voces ---
B('voices', 'mono', 'Mono', 0);
P('voices', 'glide', 'Glide', 0, 2, 0, 'lin', 's');
B('voices', 'hold', 'Hold', 0);
P('voices', 'pbRange', 'PB Range', 0, 48, 2, 'int', 'st');

// --- Rutas de modulación: un parámetro bipolar (-1..1) por cada par destino>fuente ---
for (const dest of Object.keys(MOD_TABLE)) {
  const srcs = MOD_TABLE[dest];
  for (const src of Object.keys(srcs) as SourceId[]) {
    defs.push({
      id: `${dest}>${src}`, label: SOURCE_LABELS[src], min: -1, max: 1, def: srcs[src]!,
      curve: 'lin', unit: '%', group: 'mod', dest, src,
    });
  }
}

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
    case '°': return `${Math.round(v * 360)}°`;
    case 'ms': return v < 10 ? `${v.toFixed(1)} ms` : v < 1000 ? `${Math.round(v)} ms` : `${(v / 1000).toFixed(2)} s`;
    case 's': return v < 0.1 ? `${Math.round(v * 1000)} ms` : v < 10 ? `${v.toFixed(2)} s` : `${v.toFixed(1)} s`;
    case 'Hz': return v < 10 ? `${v.toFixed(2)} Hz` : v < 1000 ? `${Math.round(v)} Hz` : `${(v / 1000).toFixed(1)} kHz`;
    case 'dB': return `${v > 0 ? '+' : ''}${v.toFixed(1)} dB`;
    case 'st': return `${v > 0 ? '+' : ''}${Math.round(v)} st`;
    case 'ct': return `${v > 0 ? '+' : ''}${Math.round(v)} ct`;
    case 'oct': return `${v > 0 ? '+' : ''}${v.toFixed(2)} oct`;
    default: return d.curve === 'int' ? `${Math.round(v)}` : v.toFixed(2);
  }
}

// Mensajes UI → worklet.
export type EngineMsg =
  | { t: 'param'; i: number; v: number }
  | { t: 'params'; a: Float32Array }
  | { t: 'sample'; ch: Float32Array[]; sr: number }
  | { t: 'on'; id: number; note: number; vel: number }
  | { t: 'off'; id: number }
  | { t: 'expr'; id: number; bend: number; slide: number; press: number }
  | { t: 'wheel'; v: number }
  | { t: 'panic' };

// Telemetría worklet → UI (~30 Hz).
export interface Telemetry {
  t: 'tel';
  cpu: number; // fracción del tiempo real usada por el DSP (0..1)
  voices: number;
  grainCount: number;
  /** Tripletas [posición 0..1, nivel 0..1, canal 0/1] de los granos activos. */
  grains: Float32Array;
  /** Posición de lectura base (0..1) de cada voz activa. */
  heads: Float32Array;
  /** Voz más reciente: env1, env2, lfoL, lfoR. */
  mod: Float32Array;
  peak: number;
}
