// Presets: parámetros en JSON + referencia al sample (de fábrica o guardado en IndexedDB).

export interface Preset {
  name: string;
  /** Solo los parámetros que difieren del valor por defecto. */
  params: Record<string, number>;
  sample: { kind: 'factory' | 'user'; name: string };
}

/** Formato de exportación: el preset y, si el sample es del usuario, su audio en WAV base64. */
export interface PresetFile {
  granos: 1;
  preset: Preset;
  wav?: string;
}

const F = (name: string, sample: string, params: Record<string, number>): Preset => ({
  name, params, sample: { kind: 'factory', name: sample },
});

export const FACTORY_PRESETS: Preset[] = [
  F('Inicio', 'Cuerdas', { size: 120, spread: 0.3, e1A: 0.02, e1R: 0.6 }),
  F('Nube de campanas', 'Campanas', {
    mode: 2, density: 14, size: 260, position: 0.35, variation: 0.8, varPos: 1.4, varPitch: 0.5, varVol: 0.4,
    spread: 0.8, e1A: 0.8, e1R: 4, filterFreq: 9000, 'position>lfo': 0.15, lfoShape: 7, lfoRate: 0.15,
    lfoStereo: 1, volume: 3,
  }),
  F('Coro congelado', 'Voz', {
    mode: 0, size: 85, shape: 0.5, position: 0.4, spread: 0.6, variation: 0.3, varPos: 0.05,
    'position>lfo': 0.25, lfoShape: 1, lfoRate: 0.07, lfoStereo: 1, e1A: 0.25, e1R: 1.5,
    filterFreq: 6000, 'position>slide': 0.3,
  }),
  F('Loop de cuerda', 'Pulsada', {
    mode: 1, size: 900, shape: 0.25, position: 0.02, scanSpeed: 0.5, scanDist: 0.9, scanLoop: 1,
    e1A: 0.005, e1R: 0.8, spread: 0.2,
  }),
  F('Dron profundo', 'Cuerdas', {
    mode: 2, density: 18, size: 900, transpose: -12, position: 0.2, variation: 1, varPos: 2, varSize: 0.4,
    spread: 1, scanSpeed: 0.05, scanDist: 0.6, e1A: 3, e1R: 8, filterMode: 0, filterFreq: 500,
    filterRes: 0.35, 'filterFreq>env2': 0.35, e2A: 6, e2D: 10, e2S: 0.4, e2R: 8,
    'filterFreq>lfo': 0.12, lfoShape: 7, lfoRate: 0.2, lfoStereo: 1, volume: 4,
  }),
  F('Glitch rítmico', 'Pulsada', {
    mode: 0, size: 125, shape: 0.02, position: 0.3, 'position>lfo': 0.5, lfoMode: 1, lfoDiv: 1, lfoShape: 5,
    lfoQuant: 8, bpm: 120, e1R: 0.2, filterMode: 7, filterFreq: 180, 'transpose>key': 1, variation: 0.3,
    varVol: 0.6,
  }),
  F('Marea', 'Textura', {
    mode: 1, size: 700, shape: 0.9, reverse: 0.5, position: 0.1, scanSpeed: 0.3, scanDist: 0.8,
    variation: 0.5, varPos: 0.6, spread: 0.7, filterMode: 5, filterFreq: 1200, filterRes: 0.5,
    filterWidth: -1.5, 'filterFreq>lfo': 0.25, lfoShape: 0, lfoRate: 0.12, lfoStereo: 1, e1A: 1.2, e1R: 3,
  }),
  F('MPE expresivo', 'Voz', {
    mode: 0, size: 60, position: 0.15, pbRange: 48, 'position>slide': 0.6, 'filterFreq>slide': 0.5,
    'filterFreq>press': 0.3, filterFreq: 900, filterRes: 0.3, 'volume>press': 0.5, 'variation>press': 0.6,
    variation: 0.1, varPos: 0.3, spread: 0.4, 'spread>slide': 0.5, e1A: 0.03, e1R: 0.7,
  }),
];
