// Presets: solo parámetros (los que difieren del valor por defecto).

export interface Preset {
  name: string;
  params: Record<string, number>;
}

/** Formato de exportación. */
export interface PresetFile {
  ecos: 1;
  preset: Preset;
}

const F = (name: string, params: Record<string, number>): Preset => ({ name, params });

// div: 5 = 1/8, 7 = 1/8 con puntillo, 8 = 1/4, 10 = 1/4 con puntillo.
export const FACTORY_PRESETS: Preset[] = [
  F('Inicio', { sync: 1, div: 7, feedback: 0.45, mix: 0.4 }),
  F('Slapback', { sync: 0, time: 110, feedback: 0.12, mix: 0.4, highCut: 5000 }),
  F('Ping-pong', { sync: 1, div: 5, pingpong: 1, feedback: 0.55, mix: 0.4 }),
  F('Cinta oscura', {
    sync: 0, time: 380, feedback: 0.6, mix: 0.45, highCut: 2200, lowCut: 150, drive: 0.5, modRate: 0.6, modDepth: 0.5,
  }),
  F('Espacio', { sync: 1, div: 10, feedback: 0.75, mix: 0.45, highCut: 4000, spread: 1, modDepth: 0.3, duck: 0.5 }),
  F('Solo efecto', { sync: 1, div: 8, feedback: 0.5, mix: 1 }),
  F('Infinito', { sync: 1, div: 8, feedback: 1, mix: 0.5, drive: 0.3, highCut: 3000, lowCut: 200 }),
];
