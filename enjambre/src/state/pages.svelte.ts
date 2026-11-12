// Definición de las páginas de 8 controles. La comparten las dos interfaces y el controlador MIDI
// (el knob físico n mueve el control n de la página activa). El orden de Efecto y Shift es el de
// DigiSwarm (A-D, E-H).

export type Slot = { id: string; label?: string; off?: boolean } | null;
const S = (id: string, label?: string, off = false): Slot => ({ id, label, off });

export const PAGES = [
  { id: 'effect', title: 'Efecto' }, { id: 'shift', title: 'Shift' }, { id: 'looper', title: 'Looper' },
  { id: 'motor', title: 'Motor' },
];

/** Los 8 controles de una página (null = celda con botón propio). */
export function slotsFor(page: string): Slot[] {
  switch (page) {
    case 'effect': return [
      S('activity'), S('repeats'), S('shape'), S('filter'), S('mix'), S('time'), S('space'), S('loopLevel'),
    ];
    case 'shift': return [
      S('inGain'), S('modDepth'), S('modRate'), S('reso'), S('fxVol'), S('loopSpeed'), S('room'), S('loopFade'),
    ];
    // En Looper, las 4 primeras celdas son botones (Loop, Stop, Undo, Clear).
    case 'looper': return [null, null, null, null, S('reverse'), S('loopRoute'), S('loopQuant'), S('hold')];
    // En Motor, las celdas 3, 4, 7 y 8 son botones (I/O, Fuente, Tap y Probar).
    case 'motor': return [S('engine'), S('variation'), null, null, S('bpm'), S('clockSync'), null, null];
    default: return [];
  }
}
