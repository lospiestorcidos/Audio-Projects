// Esquema único de parámetros de Tablas.
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

export const OSC_FX = ['Off', 'FM', 'Classic', 'Modern'] as const;
export const SUB_OCT = ['-2', '-1', '0'] as const;
export const UNI_MODES = ['Clásico', 'Posición', 'Aleatorio'] as const;
/** Máximo de tablas que se pueden elegir con el control Tabla (fábrica + usuario). */
export const MAX_TABLES = 64;
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
export const SOURCES = ['lfo1', 'lfo2', 'env1', 'env2', 'env3', 'key', 'vel', 'bend', 'slide', 'press', 'rand'] as const;
export type SourceId = (typeof SOURCES)[number];
export const SOURCE_LABELS: Record<SourceId, string> = {
  lfo1: 'LFO 1', lfo2: 'LFO 2', env1: 'Env 1', env2: 'Env 2', env3: 'Env 3', key: 'Key', vel: 'Velocity',
  bend: 'Bend (X)', slide: 'Slide (Y)', press: 'Press', rand: 'Random',
};

// Qué fuentes admite cada destino y su valor por defecto (máximo 8: caben en una página).
const POS = { lfo1: 0, lfo2: 0, env2: 0, env3: 0, key: 0, vel: 0, slide: 0, press: 0 };
const FX1 = { lfo1: 0, lfo2: 0, env2: 0, env3: 0, vel: 0, slide: 0, press: 0 };
const FX2 = { lfo1: 0, lfo2: 0, env2: 0, env3: 0, slide: 0, press: 0 };
const RATE = { key: 0, vel: 0, slide: 0, env2: 0, env3: 0, rand: 0 };
const AMT = { slide: 0, press: 0, env2: 0, env3: 0, key: 0, vel: 0 };
export const MOD_TABLE: Record<string, Partial<Record<SourceId, number>>> = {
  o1Pos: { ...POS }, o1Fx1: { ...FX1 }, o1Fx2: { ...FX2 },
  o2Pos: { ...POS }, o2Fx1: { ...FX1 }, o2Fx2: { ...FX2 },
  transpose: { key: 1, lfo1: 0, lfo2: 0, env2: 0, env3: 0, press: 0, rand: 0 },
  uniAmt: { lfo1: 0, lfo2: 0, env2: 0, env3: 0, slide: 0, press: 0 },
  volume: { key: 0, vel: 0.5, slide: 0, press: 0, lfo1: 0, lfo2: 0 },
  filterFreq: { lfo1: 0, lfo2: 0, env2: 0, env3: 0, key: 1, vel: 0, slide: 0, press: 0 },
  lfo1Rate: { ...RATE }, lfo1Amount: { ...AMT },
  lfo2Rate: { ...RATE }, lfo2Amount: { ...AMT },
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

// --- Osciladores ---
for (const n of [1, 2]) {
  const g = `osc${n}`, o = `o${n}`;
  // Índice en la lista de tablas (fábrica + usuario); la UI muestra el nombre.
  P(g, `${o}Table`, 'Tabla', 0, MAX_TABLES - 1, n === 1 ? 0 : 3, 'int', 'tabla');
  P(g, `${o}Pos`, 'Posición', 0, 1, 0, 'lin', '%');
  E(g, `${o}Fx`, 'Efecto', OSC_FX, 0);
  P(g, `${o}Fx1`, 'FX 1', 0, 1, 0, 'lin', '%');
  P(g, `${o}Fx2`, 'FX 2', 0, 1, 0, 'lin', '%');
  P(g, `${o}Semi`, 'Semitonos', -24, 24, 0, 'int', 'st');
  P(g, `${o}Fine`, 'Fino', -100, 100, 0, 'lin', 'ct');
  P(g, `${o}Level`, 'Nivel', 0, 1, n === 1 ? 0.8 : 0, 'lin', '%');
}
// --- Mezcla ---
P('mix', 'subLevel', 'Sub Nivel', 0, 1, 0, 'lin', '%');
E('mix', 'subOct', 'Sub Octava', SUB_OCT, 1);
P('mix', 'subTone', 'Sub Tono', 0, 1, 0, 'lin', '%');
E('mix', 'uniMode', 'Unísono', UNI_MODES, 0);
P('mix', 'uniVoices', 'Uni Voces', 1, 8, 1, 'int', '');
P('mix', 'uniAmt', 'Uni Cantidad', 0, 1, 0.3, 'lin', '%');
P('mix', 'oscSpread', 'Osc Estéreo', 0, 1, 0, 'lin', '%');
P('mix', 'volume', 'Volume', -36, 12, 0, 'lin', 'dB');
// --- Filtro ---
B('filter', 'filterOn', 'Filtro', 1);
E('filter', 'filterMode', 'Tipo', FILTER_MODES, 0);
P('filter', 'filterFreq', 'Frequency', 20, 20000, 20000, 'log', 'Hz');
P('filter', 'filterRes', 'Resonance', 0, 1, 0.15, 'lin', '%');
P('filter', 'filterWidth', 'Width', -4, 4, -1, 'lin', 'oct');
// --- Envolventes: 1 = amplitud; 2 y 3 = modulación ---
for (const n of [1, 2, 3]) {
  const g = `env${n}`, e = `e${n}`;
  P(g, `${e}A`, 'Attack', 0.001, 20, n === 1 ? 0.005 : 0.5, 'log', 's');
  P(g, `${e}D`, 'Decay', 0.001, 60, n === 1 ? 0.5 : 1, 'log', 's');
  P(g, `${e}S`, 'Sustain', 0, 1, n === 1 ? 1 : 0.5, 'lin', '%');
  P(g, `${e}R`, 'Release', 0.001, 60, n === 1 ? 0.3 : 0.5, 'log', 's');
  P(g, `${e}Key`, 'Key', -1, 1, 0, 'lin', '%');
}
// --- LFO ---
for (const n of [1, 2]) {
  const g = `lfo${n}`, l = `lfo${n}`;
  E(g, `${l}Mode`, 'Modo', LFO_MODES, 0);
  P(g, `${l}Rate`, 'Rate', 0.01, 20, n === 1 ? 1 : 0.2, 'log', 'Hz');
  E(g, `${l}Div`, 'Sync', LFO_DIVS, 2);
  P(g, `${l}Audio`, 'Audio Rate', 20, 800, 110, 'log', 'Hz');
  E(g, `${l}Shape`, 'Forma', LFO_SHAPES, 0);
  P(g, `${l}Phase`, 'Phase', 0, 1, 0, 'lin', '°');
  B(g, `${l}RandPhase`, 'Fase aleatoria', 0);
  E(g, `${l}Stereo`, 'Stereo', LFO_STEREO, 0);
  P(g, `${l}Quant`, 'Quant', 0, 16, 0, 'int', '');
  P(g, `${l}Amount`, 'Amount', 0, 1, 1, 'lin', '%');
}
// --- Nota ---
P('note', 'transpose', 'Transpose', -48, 48, 0, 'int', 'st');
P('note', 'pbRange', 'PB Range', 0, 48, 2, 'int', 'st');
B('note', 'mono', 'Mono', 0);
P('note', 'glide', 'Glide', 0, 2, 0, 'lin', 's');
P('note', 'bpm', 'BPM', 40, 240, 120, 'int', '');
B('note', 'lfoModWheel', 'Mod Wheel', 0);
B('note', 'hold', 'Hold', 0);

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
    case 'tabla': return `${Math.round(v) + 1}`;
    case 'oct': return `${v > 0 ? '+' : ''}${v.toFixed(2)} oct`;
    default: return d.curve === 'int' ? `${Math.round(v)}` : v.toFixed(2);
  }
}

// Mensajes UI → worklet.
export type EngineMsg =
  | { t: 'param'; i: number; v: number }
  | { t: 'params'; a: Float32Array }
  /** Tabla ya limitada en banda (buildMipmaps) para el oscilador 0 o 1. */
  | { t: 'table'; osc: number; frames: number; data: Float32Array }
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
  /** Osciladores sonando (cuenta las voces de unísono). */
  oscs: number;
  /** Voz más reciente: posición real (0..1) de osc 1 y osc 2, env1..3, lfo1 L, lfo2 L. */
  mod: Float32Array;
  peak: number;
}
