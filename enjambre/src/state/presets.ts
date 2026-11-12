// Presets: solo parámetros (los que difieren del valor por defecto).

export interface Preset {
  name: string;
  params: Record<string, number>;
}

/** Formato de exportación. */
export interface PresetFile {
  enjambre: 1;
  preset: Preset;
}

const F = (name: string, params: Record<string, number>): Preset => ({ name, params });

// engine: 0 Shards, 1 Mist, 2 Glide, 3 Pattern, 4 Seq, 5 Drone, 6 Rake, 7 Chops, 8 Stutter, 9 Arp, 10 Warp.
// time: 2 = 1/4, 3 = 1/8, 4 = 1/16.
export const FACTORY_PRESETS: Preset[] = [
  F('Inicio', { engine: 0, variation: 0, activity: 0.5, repeats: 0.5, mix: 0.5, space: 0.3 }),
  F('Cristales', { engine: 0, variation: 2, activity: 0.7, repeats: 0.6, shape: 0.66, space: 0.5, room: 2, filter: 0.15 }),
  F('Niebla', { engine: 1, variation: 0, activity: 0.8, repeats: 0.8, shape: 1, mix: 0.6, space: 0.6, room: 2, filter: -0.25 }),
  F('Polvo de octavas', { engine: 1, variation: 2, activity: 0.6, repeats: 0.35, shape: 1, space: 0.4 }),
  F('Cinta que cae', { engine: 2, variation: 1, activity: 0.4, repeats: 0.7, shape: 0.33, space: 0.4, modDepth: 0.2 }),
  F('Remolino', { engine: 2, variation: 3, activity: 0.6, repeats: 0.8, shape: 1, space: 0.7, room: 3, mix: 0.6 }),
  F('Eco en tresillos', { engine: 3, variation: 3, activity: 0.5, repeats: 0.55, time: 3, space: 0.25, filter: -0.15 }),
  F('Racimos', { engine: 3, variation: 2, activity: 0.8, repeats: 0.6, time: 4, space: 0.35, filter: 0.2 }),
  F('Secuencia barajada', { engine: 4, variation: 2, activity: 0.6, repeats: 0.4, time: 3, space: 0.3 }),
  F('Drone que respira', { engine: 5, variation: 0, activity: 0.7, repeats: 0.9, mix: 0.6, space: 0.6, room: 2 }),
  F('Órgano resonante', { engine: 5, variation: 2, activity: 1, repeats: 0.8, mix: 0.6, space: 0.5, room: 2 }),
  F('Rastrillo', { engine: 6, variation: 2, activity: 0.8, repeats: 0.6, time: 3, space: 0.3 }),
  F('Bloques', { engine: 7, variation: 1, activity: 0.7, repeats: 0.7, time: 3, space: 0.2 }),
  F('Tartamudeo', { engine: 8, variation: 1, activity: 0.5, repeats: 0.6, time: 3, mix: 0.6 }),
  F('Arpegio de quintas', { engine: 9, variation: 1, activity: 0.9, repeats: 0.6, time: 3, space: 0.35 }),
  F('Warp resonante', { engine: 10, variation: 1, activity: 0.6, repeats: 0.6, time: 3, space: 0.3 }),
];
