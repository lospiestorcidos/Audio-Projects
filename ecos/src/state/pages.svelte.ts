// Definición de las páginas de 8 controles. La comparten las dos interfaces y el controlador MIDI
// (el knob físico n mueve el control n de la página activa).
import { val } from './store.svelte';

export type Slot = { id: string; label?: string; off?: boolean } | null;
const S = (id: string, label?: string, off = false): Slot => ({ id, label, off });

export const PAGES = [
  { id: 'delay', title: 'Delay' }, { id: 'tone', title: 'Tono' }, { id: 'io', title: 'Entrada' },
];

/** Los 8 controles de una página (null = hueco o celda con botón propio). */
export function slotsFor(page: string): Slot[] {
  switch (page) {
    case 'delay': {
      const sync = val('sync') >= 0.5, frozen = val('freeze') >= 0.5;
      return [
        S('sync'), S(sync ? 'div' : 'time'), S('feedback', undefined, frozen), S('mix'),
        S('pingpong'), S('spread'), S('duck'), S('outGain'),
      ];
    }
    case 'tone': return [
      S('lowCut'), S('highCut'), S('drive'), S('modRate', undefined, val('modDepth') <= 0), S('modDepth'),
      S('freeze'), null, null,
    ];
    // En Entrada, las celdas 1, 2, 6, 7 y 8 son botones (I/O, Fuente, Tap, Probar y Borrar).
    case 'io': return [null, null, S('inGain'), S('bpm'), S('clockSync'), null, null, null];
    default: return [];
  }
}
