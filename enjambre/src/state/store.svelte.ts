// Estado de la aplicación (runes de Svelte 5) y acciones: parámetros, entrada de audio, tempo y presets.
import { AudioHost } from '../audio/host';
import { downloadBlob } from '../audio/wav';
import { ccToParam } from '../midi/ccchart';
import { ClockTracker, TapTempo } from '../midi/clock';
import { startMidi } from '../midi/midi';
import { PARAMS, clampParam, defaultValues, formatParam, fromNorm, pdef, pidx, toNorm } from '../shared/params';
import { dbDel, dbGet, dbKeys, dbPut } from './db';
import { FACTORY_PRESETS, type Preset, type PresetFile } from './presets';

export const host = new AudioHost();

/** Gancho que instala state/midimap.svelte.ts para interceptar knobs y botones del controlador. */
export const midiHooks = { control: (_status: number, _d1: number, _d2: number): boolean => false };

/** Interfaz inicial: la guardada; si no hay, la de páginas en pantallas pequeñas (teléfono). */
function initialLayout(): 'classic' | 'pages' {
  try {
    const q = new URLSearchParams(location.search).get('ui');
    if (q === 'pages' || q === 'classic') return q;
    const saved = localStorage.getItem('enjambre.layout');
    if (saved === 'pages' || saved === 'classic') return saved;
  } catch { /* sin almacenamiento */ }
  return Math.min(window.innerWidth, window.innerHeight) < 600 ? 'pages' : 'classic';
}

/** Tiempo máximo (ms) entre los dos toques de un doble toque. Por defecto, lento. */
export const TAP_SPEEDS = [
  { ms: 400, label: 'rápido' }, { ms: 1000, label: 'lento' }, { ms: 2000, label: 'muy lento' },
];
function initialTapMs(): number {
  try {
    const v = Number(localStorage.getItem('enjambre.tapMs'));
    if (TAP_SPEEDS.some((t) => t.ms === v)) return v;
  } catch { /* sin almacenamiento */ }
  return 1000;
}

export const ui = $state({
  tapMs: initialTapMs(),
  /** Interfaz: 'classic' (todo a la vista) o 'pages' (8 controles por página). */
  layout: initialLayout(),
  /** Página activa (la comparten las dos interfaces). */
  epage: 'effect',
  values: Array.from(defaultValues()),
  /** Parámetro tocado por última vez. */
  selected: 'activity',
  audio: 'off' as 'off' | 'running' | 'suspended',
  presetName: FACTORY_PRESETS[0].name,
  userPresets: [] as string[],
  // Entrada de audio
  ioOn: false,
  ioSource: '' as string, // '' = entrada por defecto, o un deviceId
  ioInputs: [] as { id: string; label: string }[],
  /** Estado de la entrada MIDI. */
  midiKind: 'none' as 'native' | 'web' | 'none',
  midiSources: [] as string[],
  /** Está llegando MIDI clock ahora mismo. */
  clockAlive: false,
  cpu: 0,
  toast: '',
});

host.onState = (s) => (ui.audio = s);

export function val(id: string): number {
  return ui.values[pidx(id)];
}

export function setParam(id: string, v: number) {
  const d = pdef(id), i = pidx(id);
  v = clampParam(d, v);
  if (ui.values[i] === v) return;
  ui.values[i] = v;
  host.setParam(i, v);
}

// --- Controles: posición normalizada, pasos y texto ---

/** ¿El control avanza por pasos con un toque (listas e interruptores)? */
export function isStepped(id: string): boolean {
  const d = pdef(id);
  return d.curve === 'enum' || d.curve === 'bool';
}
/** Posición 0..1 del control. */
export function normOf(id: string): number {
  return toNorm(pdef(id), val(id));
}
/** Mueve el control a una posición 0..1. */
export function setNorm(id: string, n: number) {
  setParam(id, fromNorm(pdef(id), n));
}
/** Pasa a la opción siguiente (vuelve al principio tras la última). */
export function stepNext(id: string) {
  const d = pdef(id);
  setParam(id, val(id) >= d.max ? d.min : val(id) + 1);
}
/** Texto del valor de un control. */
export function textOf(id: string): string {
  return formatParam(pdef(id), val(id));
}

export function setLayout(l: 'classic' | 'pages') {
  ui.layout = l;
  try { localStorage.setItem('enjambre.layout', l); } catch { /* sin almacenamiento */ }
}

/** Pasa a la siguiente velocidad de doble toque y la recuerda. */
export function cycleTapSpeed() {
  const i = TAP_SPEEDS.findIndex((t) => t.ms === ui.tapMs);
  ui.tapMs = TAP_SPEEDS[(i + 1) % TAP_SPEEDS.length].ms;
  try { localStorage.setItem('enjambre.tapMs', String(ui.tapMs)); } catch { /* sin almacenamiento */ }
}

export function select(id: string) {
  ui.selected = id;
}

let toastTimer = 0;
export function toast(msg: string) {
  ui.toast = msg;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (ui.toast = ''), 2600);
}

// ---------- Entrada de audio ----------

export async function setIoOn(on: boolean) {
  if (!on) { host.disableInput(); ui.ioOn = false; return; }
  try {
    await host.enableInput(ui.ioSource);
    ui.ioOn = true;
    ui.ioInputs = await host.listInputs(); // ahora ya con nombres
  } catch {
    ui.ioOn = false;
    toast('No hay acceso a la entrada de audio. Revisa el permiso de micrófono.');
  }
}

export async function setIoSource(src: string) {
  ui.ioSource = src;
  if (ui.ioOn) await setIoOn(true);
}

/** Sonido de prueba: un arpegio corto que entra al efecto (sirve para oírlo sin micrófono). */
export function pluck() {
  void host.resume();
  host.send({ t: 'pluck' });
}

/** Vacía el historial y las colas (y quita el Hold). */
export function clearAll() {
  setParam('hold', 0);
  host.send({ t: 'clear' });
}

// ---------- Tempo ----------

const taps = new TapTempo();
/** Tap tempo: cada toque afina el BPM con la media de los últimos. */
export function tapTempo() {
  const bpm = taps.tap(performance.now());
  if (bpm !== null) setParam('bpm', bpm);
}

const clock = new ClockTracker();
/** Mensajes de tiempo real MIDI: el reloj fija el BPM mientras MIDI Clock esté activado. */
function onRealtime(status: number, time: number) {
  if (status !== 0xf8) return;
  const bpm = clock.tick(time);
  ui.clockAlive = true;
  if (bpm !== null && val('clockSync') >= 0.5) setParam('bpm', Math.round(bpm * 10) / 10);
}

// ---------- Presets ----------

function currentPreset(name: string): Preset {
  const params: Record<string, number> = {};
  // El BPM no se guarda: es del momento (tap, MIDI clock), no del sonido.
  PARAMS.forEach((d, i) => { if (ui.values[i] !== d.def && d.id !== 'bpm') params[d.id] = ui.values[i]; });
  return { name, params };
}

export function applyPreset(p: Preset) {
  const a = defaultValues();
  for (const id of Object.keys(p.params)) {
    const i = PARAMS.findIndex((d) => d.id === id);
    if (i >= 0) a[i] = clampParam(PARAMS[i], p.params[id]); // ignora parámetros de versiones futuras
  }
  // Se conservan el tempo, la ganancia de entrada y el seguimiento del reloj: son del montaje, no del preset.
  for (const id of ['bpm', 'inGain', 'clockSync']) a[pidx(id)] = ui.values[pidx(id)];
  a[pidx('hold')] = 0;
  a[pidx('bypass')] = 0;
  ui.values = Array.from(a);
  host.setAllParams(a);
  ui.presetName = p.name;
}

export async function refreshPresets() {
  try { ui.userPresets = (await dbKeys('presets')).sort(); } catch { ui.userPresets = []; }
}

export async function loadPresetByName(name: string) {
  const f = FACTORY_PRESETS.find((p) => p.name === name);
  if (f) return applyPreset(f);
  const p = await dbGet<Preset>('presets', name);
  if (p) applyPreset(p);
}

export async function savePreset(name: string) {
  name = name.trim();
  if (!name) return;
  if (FACTORY_PRESETS.some((p) => p.name === name)) { toast('Ese nombre es de un preset de fábrica'); return; }
  await dbPut('presets', name, currentPreset(name));
  ui.presetName = name;
  await refreshPresets();
  toast(`Preset guardado: ${name}`);
}

export async function deletePreset(name: string) {
  await dbDel('presets', name);
  await refreshPresets();
  toast(`Preset borrado: ${name}`);
}

export function exportPreset() {
  const p = currentPreset(ui.presetName);
  const file: PresetFile = { enjambre: 1, preset: p };
  void downloadBlob(new Blob([JSON.stringify(file)], { type: 'application/json' }), `${p.name}.enjambre.json`).catch(() => {});
}

export async function importPreset(file: File) {
  try {
    const data = JSON.parse(await file.text()) as PresetFile;
    if (data.enjambre !== 1 || !data.preset) throw new Error('formato');
    const p = data.preset;
    if (FACTORY_PRESETS.some((f) => f.name === p.name)) p.name += ' (importado)';
    await dbPut('presets', p.name, p);
    await refreshPresets();
    applyPreset(p);
    toast(`Preset importado: ${p.name}`);
  } catch {
    toast('Ese archivo no es un preset de Enjambre');
  }
}

/** CC de la tabla del Microcosm (en cualquier canal). */
function applyCc(status: number, cc: number, value: number): boolean {
  if ((status & 0xf0) !== 0xb0) return false;
  const r = ccToParam(cc, value);
  if (!r) return false;
  setParam(r[0], r[1]);
  return true;
}

/** Arranque: carga el primer preset (el audio queda suspendido hasta el primer toque). */
export async function boot() {
  void host.ensure();
  void startMidi(
    {
      // Primero lo que se haya enseñado con el asistente; si no, la tabla de CC del Microcosm.
      control: (st, d1, d2) => midiHooks.control(st, d1, d2) || applyCc(st, d1, d2),
      realtime: onRealtime,
    },
    (st) => { ui.midiKind = st.kind; ui.midiSources = st.sources; },
  );
  // Si el reloj deja de llegar, se avisa en pantalla (el BPM se queda donde estaba).
  setInterval(() => { if (ui.clockAlive && !clock.alive(performance.now())) { ui.clockAlive = false; clock.reset(); } }, 500);
  applyPreset(FACTORY_PRESETS[0]);
  await refreshPresets();
}
