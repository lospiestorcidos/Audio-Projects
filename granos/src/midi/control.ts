// Mapa de controlador MIDI: qué mensaje mueve cada uno de los 8 controles de la página y
// qué mensaje selecciona cada página. La app "aprende" el controlador (no hay que programarlo).

export interface ControlMapData {
  /** Clave del mensaje asignado a cada uno de los 8 controles (null = sin asignar). */
  knobs: (string | null)[];
  /** Página → clave del mensaje que la selecciona. */
  pages: Record<string, string>;
}

export const emptyMap = (): ControlMapData => ({ knobs: Array(8).fill(null), pages: {} });

export interface ControlMsg {
  /** Identifica el control físico: "cc21", "n36" (nota) o "pc3" (cambio de programa). */
  key: string;
  kind: 'cc' | 'note' | 'pc';
  /** Valor 0..127 (para CC); 127 en notas y cambios de programa. */
  value: number;
  /** Nota soltada: no dispara nada, pero se consume si la nota está asignada. */
  off: boolean;
}

/** Clasifica un mensaje MIDI como posible control. El canal se ignora a propósito. */
export function controlMsg(status: number, d1: number, d2: number): ControlMsg | null {
  switch (status & 0xf0) {
    case 0xb0: return { key: `cc${d1}`, kind: 'cc', value: d2, off: false };
    case 0x90: return { key: `n${d1}`, kind: 'note', value: 127, off: d2 === 0 };
    case 0x80: return { key: `n${d1}`, kind: 'note', value: 0, off: true };
    case 0xc0: return { key: `pc${d1}`, kind: 'pc', value: 127, off: false };
    default: return null;
  }
}

/** Quita una clave de donde estuviera (un control físico solo puede hacer una cosa). */
export function unassign(map: ControlMapData, key: string) {
  map.knobs = map.knobs.map((k) => (k === key ? null : k));
  for (const p of Object.keys(map.pages)) if (map.pages[p] === key) delete map.pages[p];
}

export function pageForKey(map: ControlMapData, key: string): string | null {
  for (const p of Object.keys(map.pages)) if (map.pages[p] === key) return p;
  return null;
}

/**
 * Recogida ("pickup") para potenciómetros con tope: al cambiar de página, el knob físico no está
 * donde el valor; no toma el control hasta que alcanza o cruza el valor actual (evita saltos).
 */
export class Pickup {
  private last: number | null = null;
  private owner = '';
  /** target y current en 0..1. Devuelve true si el knob ya gobierna el parámetro `id`. */
  test(id: string, target: number, current: number): boolean {
    const prev = this.last;
    this.last = target;
    if (this.owner === id) return true;
    const reached = Math.abs(target - current) < 0.04
      || (prev !== null && (prev - current) * (target - current) <= 0);
    if (reached) this.owner = id;
    return reached;
  }
  release() { this.owner = ''; }
}
