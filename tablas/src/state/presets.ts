// Presets: parámetros en JSON + el nombre de la tabla de cada oscilador (de fábrica o de usuario).

export interface Preset {
  name: string;
  /** Solo los parámetros que difieren del valor por defecto. */
  params: Record<string, number>;
  /** Tabla del oscilador 1 y del oscilador 2, por nombre. */
  tables: [string, string];
}

/** Formato de exportación: el preset y, si usa tablas del usuario, sus datos en base64. */
export interface PresetFile {
  tablas: 1;
  preset: Preset;
  userTables?: { name: string; count: number; data: string }[];
}

const F = (name: string, t1: string, t2: string, params: Record<string, number>): Preset => ({
  name, params, tables: [t1, t2],
});

export const FACTORY_PRESETS: Preset[] = [
  F('Inicio', 'Básica', 'Formantes', {
    o1Pos: 0.66, filterFreq: 1800, filterRes: 0.25, 'filterFreq>env2': 0.35, e2A: 0.005, e2D: 0.7, e2S: 0.25,
    e1R: 0.4, uniVoices: 2, uniAmt: 0.2,
  }),
  F('Pad en movimiento', 'Formantes', 'Armónicos', {
    o1Pos: 0.3, 'o1Pos>lfo1': 0.3, lfo1Rate: 0.12, lfo1Shape: 7, o2Level: 0.5, o2Pos: 0.2, 'o2Pos>lfo2': 0.25,
    lfo2Rate: 0.07, lfo2Shape: 1, uniVoices: 5, uniAmt: 0.4, oscSpread: 0.4, e1A: 1.2, e1R: 3, filterFreq: 5000,
    'filterFreq>lfo2': 0.1, volume: -2,
  }),
  F('Bajo FM', 'Básica', 'Básica', {
    o1Pos: 0, o1Fx: 1, o1Fx1: 0.25, o1Fx2: 0.2, 'o1Fx1>env2': 0.6, e2A: 0.001, e2D: 0.25, e2S: 0.1, subLevel: 0.6,
    mono: 1, glide: 0.05, transpose: -12, filterFreq: 2500, e1R: 0.15,
  }),
  F('Supersierra', 'Básica', 'Básica', {
    o1Pos: 0.66, o2Pos: 0.66, o2Level: 0.6, o2Semi: 12, uniVoices: 7, uniAmt: 0.45, oscSpread: 0.3,
    filterFreq: 9000, e1A: 0.01, e1R: 0.5, volume: -3,
  }),
  F('Campanas de cristal', 'Campanas', 'Armónicos', {
    o1Pos: 0.8, 'o1Pos>env3': -0.6, e3A: 0.001, e3D: 1.5, e3S: 0, e1D: 2.5, e1S: 0, e1R: 2, uniMode: 1, uniVoices: 3,
    uniAmt: 0.3, o2Level: 0.25, o2Semi: 12, o2Pos: 0.5, 'volume>vel': 0.8,
  }),
  F('Voz MPE', 'Formantes', 'Básica', {
    o1Pos: 0.1, 'o1Pos>slide': 0.9, pbRange: 48, filterFreq: 1500, 'filterFreq>press': 0.4, 'volume>press': 0.4,
    e1A: 0.04, e1R: 0.6, uniVoices: 2, uniAmt: 0.15, 'transpose>lfo1': 0.004, lfo1Rate: 5,
  }),
  F('Digital rítmico', 'Digital', 'Pulso', {
    o1Pos: 0.5, 'o1Pos>lfo1': 0.5, lfo1Mode: 1, lfo1Div: 0, lfo1Shape: 5, lfo1Quant: 8, e1D: 0.3, e1S: 0.4, e1R: 0.15,
    o2Level: 0.4, o2Semi: -12, o2Pos: 0.3, filterMode: 2, filterFreq: 4000, filterWidth: -3,
  }),
  F('Solo sync', 'Sync', 'Básica', {
    o1Pos: 0.1, 'o1Pos>env2': 0.8, e2A: 0.01, e2D: 0.8, e2S: 0.3, o1Fx: 2, 'o1Fx2>slide': 0.7, mono: 1, glide: 0.08,
    filterFreq: 7000, e1R: 0.3, 'transpose>lfo1': 0.005, lfo1Rate: 5.5, lfoModWheel: 1,
  }),
];
