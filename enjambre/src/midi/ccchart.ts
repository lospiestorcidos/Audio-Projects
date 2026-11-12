// Tabla de CC MIDI de Enjambre. Sigue la misma numeración que DigiSwarm, que a su vez sigue la
// tabla publicada del Microcosm: un controlador preparado para el pedal mueve aquí lo mismo.
import { fromNorm, pdef } from '../shared/params';

/** Qué parámetro mueve cada CC: 'knob' = recorrido 0–127; 'steps' = el valor es directamente el paso. */
const CHART: Record<number, { id: string; mode: 'knob' | 'steps' | 'switch' }> = {
  5: { id: 'time', mode: 'steps' },
  6: { id: 'activity', mode: 'knob' },
  7: { id: 'shape', mode: 'knob' },
  8: { id: 'filter', mode: 'knob' },
  9: { id: 'mix', mode: 'knob' },
  10: { id: 'time', mode: 'knob' },
  11: { id: 'repeats', mode: 'knob' },
  12: { id: 'space', mode: 'knob' },
  13: { id: 'loopLevel', mode: 'knob' },
  14: { id: 'modRate', mode: 'knob' },
  15: { id: 'reso', mode: 'knob' },
  16: { id: 'fxVol', mode: 'knob' },
  17: { id: 'loopSpeed', mode: 'knob' },
  18: { id: 'loopSpeed', mode: 'steps' },
  19: { id: 'modDepth', mode: 'knob' },
  20: { id: 'room', mode: 'knob' },
  21: { id: 'loopFade', mode: 'knob' },
  48: { id: 'hold', mode: 'switch' },
  102: { id: 'bypass', mode: 'switch' },
};

/** Traduce un CC a [parámetro, valor]. Devuelve null si ese CC no está en la tabla. */
export function ccToParam(cc: number, value: number): [string, number] | null {
  const c = CHART[cc];
  if (!c) return null;
  const d = pdef(c.id);
  if (c.mode === 'switch') return [c.id, value >= 64 ? 1 : 0];
  if (c.mode === 'steps') return [c.id, Math.max(d.min, Math.min(d.max, Math.round(value)))];
  if (d.curve === 'enum') {
    // Un knob recorre las opciones a partes iguales.
    const n = d.max - d.min + 1;
    return [c.id, d.min + Math.min(n - 1, Math.floor((value / 128) * n))];
  }
  return [c.id, fromNorm(d, value / 127)];
}
