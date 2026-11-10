// Controlador MIDI físico: 8 knobs → los 8 controles de la página activa; botones → páginas.
// Incluye el asistente de aprendizaje (se mueve cada knob y se pulsa cada botón una vez).
import { controlMsg, emptyMap, pageForKey, Pickup, unassign, type ControlMapData } from '../midi/control';
import { fromNorm, pdef, toNorm } from '../shared/params';
import { PAGES, slotsFor } from './pages.svelte';
import { midiHooks, select, setParam, toast, ui, val } from './store.svelte';

const STORE_KEY = 'granos.midiMap';

function load(): ControlMapData {
  try {
    const d = JSON.parse(localStorage.getItem(STORE_KEY) ?? 'null') as ControlMapData | null;
    if (d && Array.isArray(d.knobs) && d.knobs.length === 8 && d.pages) return d;
  } catch { /* sin almacenamiento o dato corrupto */ }
  return emptyMap();
}

/** Pasos del asistente: primero los 8 knobs, luego un botón por página. */
export const LEARN_STEPS = [
  ...Array.from({ length: 8 }, (_, i) => ({ kind: 'knob' as const, index: i, page: '', text: `Mueve el knob ${i + 1}` })),
  ...PAGES.map((p) => ({ kind: 'page' as const, index: 0, page: p.id, text: `Pulsa el botón para la página «${p.title}»` })),
];

export const midiMap = $state({
  map: load(),
  /** Con potenciómetros con tope: true = el knob espera a alcanzar el valor (sin saltos). */
  pickup: (() => { try { return localStorage.getItem('granos.midiPickup') === '1'; } catch { return false; } })(),
  /** Asistente: paso actual (-1 = cerrado) y mapa en construcción. */
  step: -1,
  draft: emptyMap(),
  /** Último control recibido durante el aprendizaje (para mostrarlo). */
  lastKey: '',
});

const pickups = Array.from({ length: 8 }, () => new Pickup());
const assigned = () => midiMap.map.knobs.some((k) => k) || Object.keys(midiMap.map.pages).length > 0;
export const hasMidiMap = assigned;

export function startLearn() {
  midiMap.draft = emptyMap();
  midiMap.lastKey = '';
  midiMap.step = 0;
}
export function cancelLearn() { midiMap.step = -1; }
export function learnBack() { if (midiMap.step > 0) midiMap.step--; }
export function learnSkip() { advance(); }

function advance() {
  midiMap.step++;
  if (midiMap.step < LEARN_STEPS.length) return;
  // Fin: se guarda el mapa nuevo.
  midiMap.map = $state.snapshot(midiMap.draft);
  midiMap.step = -1;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(midiMap.map)); } catch { /* sin almacenamiento */ }
  pickups.forEach((p) => p.release());
  toast('Controlador MIDI configurado');
}

export function clearMidiMap() {
  midiMap.map = emptyMap();
  try { localStorage.removeItem(STORE_KEY); } catch { /* sin almacenamiento */ }
  toast('Configuración del controlador borrada');
}

export function togglePickup() {
  midiMap.pickup = !midiMap.pickup;
  try { localStorage.setItem('granos.midiPickup', midiMap.pickup ? '1' : '0'); } catch { /* sin almacenamiento */ }
}

/** El knob físico `index` mueve el control `index` de la página activa. */
function turnKnob(index: number, value: number) {
  const slot = slotsFor(ui.epage)[index];
  if (!slot || slot.off) return;
  const d = pdef(slot.id);
  const target = value / 127;
  if (midiMap.pickup && !pickups[index].test(slot.id, target, toNorm(d, val(slot.id)))) return;
  if (!d.dest) select(slot.id);
  setParam(slot.id, fromNorm(d, target));
}

/**
 * Recibe cada mensaje MIDI antes que el sintetizador. Devuelve true si era de un control
 * asignado (o si el asistente está abierto) y por tanto no debe sonar como nota.
 */
function handle(status: number, d1: number, d2: number): boolean {
  const m = controlMsg(status, d1, d2);
  if (!m) return false;

  if (midiMap.step >= 0) {
    const step = LEARN_STEPS[midiMap.step];
    if (m.off) return true;
    // Un knob solo puede ser un CC; un botón puede enviar CC, nota o cambio de programa.
    if (step.kind === 'knob' && m.kind !== 'cc') return true;
    // Se ignoran los controles ya asignados en esta sesión (el knob anterior sigue enviando).
    const d = midiMap.draft;
    if (d.knobs.includes(m.key) || pageForKey(d, m.key)) return true;
    if (step.kind === 'knob') d.knobs[step.index] = m.key;
    else d.pages[step.page] = m.key;
    midiMap.lastKey = m.key;
    advance();
    return true;
  }

  const map = midiMap.map;
  const k = map.knobs.indexOf(m.key);
  if (k >= 0) { if (m.kind === 'cc') turnKnob(k, m.value); return true; }
  const page = pageForKey(map, m.key);
  if (page) {
    // Sirve tanto para botones momentáneos como de enclavamiento: cualquier pulsación selecciona.
    if (!m.off && ui.epage !== page) { ui.epage = page; pickups.forEach((p) => p.release()); }
    return true;
  }
  return false;
}

midiHooks.control = handle;
// Para que `unassign` quede disponible a quien edite el mapa a mano en el futuro.
export { unassign };
