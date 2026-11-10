// Estado de la aplicación (runes de Svelte 5) y acciones: parámetros, tablas de ondas y presets.
import { AudioHost } from '../audio/host';
import { base64ToBuf, bufToBase64, downloadBlob, encodeWav, parseWavMono } from '../audio/wav';
import { MAX_TABLES, MOD_TABLE, PARAMS, clampParam, defaultValues, formatParam, fromNorm, pdef, pidx, toNorm } from '../shared/params';
import { maxSend, startMidi } from '../midi/midi';
import { fromMax, MAX_PARAM_IDS, toMax } from '../shared/maxparams';
import {
  FACTORY_TABLES, FRAME, factoryTable, looksLikeWavetable, tableFromAudio, tableFromCycles, type Wavetable,
} from '../shared/wavetable';
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
    const saved = localStorage.getItem('tablas.layout');
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
    const v = Number(localStorage.getItem('tablas.tapMs'));
    if (TAP_SPEEDS.some((t) => t.ms === v)) return v;
  } catch { /* sin almacenamiento */ }
  return 1000;
}

export const ui = $state({
  tapMs: initialTapMs(),
  /** Interfaz: 'classic' (todo a la vista) o 'pages' (8 controles por página). */
  layout: initialLayout(),
  /** Página activa de la interfaz de páginas. */
  epage: 'osc1',
  values: Array.from(defaultValues()),
  /** Parámetro tocado por última vez: decide el panel de modulación y el display en modo Auto. */
  selected: 'o1Pos',
  page: 'osc1',
  display: 'auto' as 'auto' | 'wave' | 'mod',
  audio: 'off' as 'off' | 'running' | 'suspended',
  /** Tablas que se pueden elegir con el control Tabla: las de fábrica y después las del usuario. */
  tableNames: [...FACTORY_TABLES] as string[],
  /** Tabla cargada ahora en cada oscilador. */
  oscTable: ['', ''] as string[],
  /** Cambia cada vez que se sustituye una tabla (para redibujar el display). */
  tableVersion: 0,
  /** Oscilador (0 o 1) que recibe las tablas cargadas o capturadas. */
  tableTarget: 0,
  presetName: FACTORY_PRESETS[0].name,
  userPresets: [] as string[],
  // Capture
  capOn: false,
  capSource: '' as string, // '' = micrófono por defecto, 'resample' o deviceId
  capLength: 8,
  capInputs: [] as { id: string; label: string }[],
  /** Hay una tabla recién cargada o capturada que aún se puede cancelar o guardar. */
  capPending: false,
  /** Estado de la entrada MIDI. */
  midiKind: 'none' as 'native' | 'web' | 'max' | 'none',
  midiSources: [] as string[],
  cpu: 0,
  voices: 0,
  oscs: 0,
  toast: '',
});

host.onState = (s) => (ui.audio = s);
host.onTable = () => { ui.tableVersion++; };

export function val(id: string): number {
  return ui.values[pidx(id)];
}

// --- Max for Live: los parámetros se reflejan en los live.dial del dispositivo ---
/** Live ya envió sus valores: a partir de aquí los cambios de la app se escriben en Live. */
let maxSynced = false;
/** El cambio en curso viene de Live: no se le devuelve (evita bucles). */
let maxApplying = false;
function tellMax(id: string) {
  if (maxSynced && !maxApplying && MAX_PARAM_IDS.has(id)) maxSend(id, toMax(pdef(id), ui.values[pidx(id)]));
}

export function setParam(id: string, v: number) {
  const d = pdef(id), i = pidx(id);
  v = clampParam(d, v);
  if (ui.values[i] === v) return;
  ui.values[i] = v;
  host.setParam(i, v);
  tellMax(id);
  if (d.unit === 'tabla') void syncTable(id === 'o1Table' ? 0 : 1);
}

// --- Controles: posición normalizada, pasos y texto (el control Tabla va sobre la lista de tablas) ---

const isTable = (id: string) => pdef(id).unit === 'tabla';
/** ¿El control avanza por pasos con un toque (listas, interruptores y Tabla)? */
export function isStepped(id: string): boolean {
  const d = pdef(id);
  return d.curve === 'enum' || d.curve === 'bool' || d.unit === 'tabla';
}
/** Posición 0..1 del control. */
export function normOf(id: string): number {
  if (isTable(id)) return val(id) / Math.max(1, ui.tableNames.length - 1);
  return toNorm(pdef(id), val(id));
}
/** Mueve el control a una posición 0..1. */
export function setNorm(id: string, n: number) {
  n = Math.min(1, Math.max(0, n));
  if (isTable(id)) setParam(id, Math.round(n * (ui.tableNames.length - 1)));
  else setParam(id, fromNorm(pdef(id), n));
}
/** Pasa a la opción siguiente (vuelve al principio tras la última). */
export function stepNext(id: string) {
  const d = pdef(id), max = isTable(id) ? ui.tableNames.length - 1 : d.max;
  setParam(id, val(id) >= max ? d.min : val(id) + 1);
}
/** Texto del valor de un control. */
export function textOf(id: string): string {
  if (isTable(id)) return ui.tableNames[Math.round(val(id))] ?? '—';
  return formatParam(pdef(id), val(id));
}

export function setLayout(l: 'classic' | 'pages') {
  ui.layout = l;
  try { localStorage.setItem('tablas.layout', l); } catch { /* sin almacenamiento */ }
}

/** Pasa a la siguiente velocidad de doble toque y la recuerda. */
export function cycleTapSpeed() {
  const i = TAP_SPEEDS.findIndex((t) => t.ms === ui.tapMs);
  ui.tapMs = TAP_SPEEDS[(i + 1) % TAP_SPEEDS.length].ms;
  try { localStorage.setItem('tablas.tapMs', String(ui.tapMs)); } catch { /* sin almacenamiento */ }
}

/** Destinos que tienen panel de modulación, en orden. */
export const MOD_DESTS = Object.keys(MOD_TABLE);
// Parámetros secundarios que comparten el panel de su parámetro principal.
const MOD_ALIAS: Record<string, string> = {
  o1Table: 'o1Pos', o1Fx: 'o1Fx1', o1Semi: 'transpose', o1Fine: 'transpose', o1Level: 'volume',
  o2Table: 'o2Pos', o2Fx: 'o2Fx1', o2Semi: 'transpose', o2Fine: 'transpose', o2Level: 'volume',
  uniMode: 'uniAmt', uniVoices: 'uniAmt', pbRange: 'transpose',
  filterRes: 'filterFreq', filterWidth: 'filterFreq', filterMode: 'filterFreq',
  lfo1Div: 'lfo1Rate', lfo1Audio: 'lfo1Rate', lfo2Div: 'lfo2Rate', lfo2Audio: 'lfo2Rate',
};
/** Destino de modulación que corresponde al parámetro seleccionado. */
export function modDest(): string {
  return MOD_ALIAS[ui.selected] ?? ui.selected;
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

// ---------- Tablas de ondas ----------

/** Tablas del usuario disponibles en esta sesión (cargadas, capturadas o leídas de IndexedDB). */
const userTables = new Map<string, Wavetable>();
/** Nombres de las tablas guardadas en IndexedDB. */
let savedNames: string[] = [];

function refreshTableNames() {
  const user = [...new Set([...savedNames, ...userTables.keys()])].sort();
  ui.tableNames = [...FACTORY_TABLES, ...user].slice(0, MAX_TABLES);
}

async function getTable(name: string): Promise<Wavetable | null> {
  if (FACTORY_TABLES.includes(name)) return factoryTable(name);
  let t = userTables.get(name) ?? null;
  if (!t) {
    t = (await dbGet<Wavetable>('tables', name)) ?? null;
    if (t) userTables.set(name, t);
  }
  return t;
}

/** Carga en el oscilador la tabla que señala su control Tabla (si no es la que ya tiene). */
async function syncTable(osc: number) {
  const name = ui.tableNames[Math.round(val(osc === 0 ? 'o1Table' : 'o2Table'))] ?? FACTORY_TABLES[0];
  if (ui.oscTable[osc] === name) return;
  ui.oscTable[osc] = name;
  const t = (await getTable(name)) ?? factoryTable(FACTORY_TABLES[0]);
  if (ui.oscTable[osc] === name) host.setTable(osc, t); // por si se eligió otra mientras cargaba
}

/** Tabla anterior del oscilador de destino: a ella vuelve Cancel. */
let previous: { osc: number; name: string } | null = null;

/** Añade una tabla del usuario a la lista y la pone en el oscilador de destino. */
function useUserTable(t: Wavetable) {
  const osc = ui.tableTarget;
  previous = { osc, name: ui.oscTable[osc] };
  userTables.set(t.name, t);
  relist();
  ui.oscTable[osc] = ''; // fuerza la recarga aunque el nombre coincida
  const i = ui.tableNames.indexOf(t.name);
  const id = osc === 0 ? 'o1Table' : 'o2Table';
  if (i < 0) { toast('Hay demasiadas tablas; borra alguna para añadir más'); return; }
  if (val(id) === i) void syncTable(osc); else setParam(id, i);
  ui.capPending = true;
}

/**
 * Carga un archivo elegido en Archivos o soltado sobre la app.
 * - WAV cuya duración es un múltiplo exacto de 2048 muestras: tabla de ondas tal cual (formato Serum).
 * - WAV muy corto: un único ciclo.
 * - Cualquier otro audio: se convierte en tabla a partir de su espectro.
 */
export async function loadFile(file: File) {
  const name = file.name.replace(/\.[^.]+$/, '');
  try {
    const buf = await file.arrayBuffer();
    const exact = parseWavMono(buf);
    let t: Wavetable;
    if (exact && (looksLikeWavetable(exact.length) || exact.length < FRAME)) t = tableFromCycles(name, exact);
    else t = tableFromAudio(name, exact ?? (await host.decodeMono(buf)));
    useUserTable(t);
    toast(`Tabla cargada en Osc ${ui.tableTarget + 1}: ${name} (${t.count} ciclos)`);
  } catch (e) {
    const why = e instanceof Error && e.message ? ` (${e.message})` : '';
    toast(`No se pudo leer «${file.name}»${why}`);
  }
}

// ---------- Capture ----------

export async function setCaptureOn(on: boolean) {
  if (!on) { host.disableCapture(); ui.capOn = false; return; }
  try {
    await host.enableCapture(ui.capSource);
    ui.capOn = true;
    ui.capInputs = await host.listInputs(); // ahora ya con nombres
  } catch {
    ui.capOn = false;
    toast('No hay acceso a la entrada de audio. Revisa el permiso de micrófono.');
  }
}

export async function setCaptureSource(src: string) {
  ui.capSource = src;
  if (ui.capOn) await setCaptureOn(true);
}

export function setCaptureLength(seconds: number) {
  ui.capLength = seconds;
  host.setCaptureLength(seconds);
}

/** Convierte los últimos segundos grabados en una tabla de ondas para el oscilador de destino. */
export async function capture() {
  const r = await host.grabCapture();
  if (!r.ch || r.ch[0].length < FRAME * 2) { toast('Todavía no hay audio grabado'); return; }
  const mono = new Float32Array(r.ch[0].length);
  for (const c of r.ch) for (let i = 0; i < mono.length; i++) mono[i] += c[i] / r.ch.length;
  const t = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  useUserTable(tableFromAudio(`Captura ${pad(t.getHours())}.${pad(t.getMinutes())}.${pad(t.getSeconds())}`, mono));
}

/** Descarta la tabla recién cargada o capturada y vuelve a la anterior. */
export function cancelCapture() {
  if (!previous) return;
  const { osc, name } = previous;
  const dropped = ui.oscTable[osc];
  const i = ui.tableNames.indexOf(name);
  setParam(osc === 0 ? 'o1Table' : 'o2Table', i < 0 ? 0 : i);
  // Si no estaba guardada, desaparece de la lista.
  if (!savedNames.includes(dropped) && ui.oscTable[1 - osc] !== dropped) {
    userTables.delete(dropped);
    relist();
  }
  ui.capPending = false;
  previous = null;
}

/** Rehace la lista de tablas conservando la tabla elegida en cada oscilador. */
function relist() {
  const keep = [ui.oscTable[0], ui.oscTable[1]];
  refreshTableNames();
  ['o1Table', 'o2Table'].forEach((id, osc) => {
    const i = ui.tableNames.indexOf(keep[osc]);
    if (i >= 0 && val(id) !== i) { ui.values[pidx(id)] = i; host.setParam(pidx(id), i); tellMax(id); }
  });
}

/** Guarda la tabla del oscilador de destino en la app (IndexedDB) y la exporta como WAV a Archivos. */
export async function saveCapture() {
  const t = host.tables[ui.tableTarget];
  if (!t || FACTORY_TABLES.includes(t.name)) return;
  await dbPut('tables', t.name, { name: t.name, count: t.count, data: t.data });
  if (!savedNames.includes(t.name)) savedNames.push(t.name);
  ui.capPending = false;
  previous = null;
  toast(`Tabla guardada: ${t.name}`);
  try {
    await downloadBlob(new Blob([encodeWav([t.data], 48000)], { type: 'audio/wav' }), `${t.name}.wav`);
  } catch { /* el usuario cerró la hoja de compartir: la tabla ya está guardada en la app */ }
}

// ---------- Presets ----------

function currentPreset(name: string): Preset {
  const params: Record<string, number> = {};
  PARAMS.forEach((d, i) => { if (ui.values[i] !== d.def && d.unit !== 'tabla') params[d.id] = ui.values[i]; });
  return { name, params, tables: [ui.oscTable[0], ui.oscTable[1]] };
}

function applyParams(params: Record<string, number>, tables: [string, string]) {
  const a = defaultValues();
  for (const id of Object.keys(params)) {
    const i = PARAMS.findIndex((d) => d.id === id);
    if (i >= 0) a[i] = clampParam(PARAMS[i], params[id]); // ignora parámetros de versiones futuras
  }
  // Las tablas se guardan por nombre: su posición en la lista puede haber cambiado.
  tables.forEach((name, osc) => {
    const i = ui.tableNames.indexOf(name);
    a[pidx(osc === 0 ? 'o1Table' : 'o2Table')] = i < 0 ? 0 : i;
  });
  // Hold no se restaura: dejaría notas colgadas al cambiar de preset.
  a[pidx('hold')] = 0;
  ui.values = Array.from(a);
  host.send({ t: 'panic' });
  host.setAllParams(a);
  for (const id of MAX_PARAM_IDS) tellMax(id); // un preset cargado en la app actualiza Live
  void syncTable(0); void syncTable(1);
}

export async function applyPreset(p: Preset) {
  const missing = p.tables.filter((n) => !ui.tableNames.includes(n));
  if (missing.length) toast(`Falta la tabla «${missing[0]}»; se usa una de fábrica`);
  applyParams(p.params, p.tables);
  ui.presetName = p.name;
  ui.capPending = false;
  previous = null;
}

export async function refreshPresets() {
  try {
    ui.userPresets = (await dbKeys('presets')).sort();
    savedNames = await dbKeys('tables');
  } catch { ui.userPresets = []; savedNames = []; }
  relist();
}

export async function loadPresetByName(name: string) {
  const f = FACTORY_PRESETS.find((p) => p.name === name);
  if (f) return applyPreset(f);
  const p = await dbGet<Preset>('presets', name);
  if (p) await applyPreset(p);
}

/** Tablas del usuario que usa un preset, con sus datos. */
function presetUserTables(p: Preset): Wavetable[] {
  return [...new Set(p.tables)].map((n) => userTables.get(n)).filter((t): t is Wavetable => !!t);
}

/** Guarda el estado actual como preset de usuario (y sus tablas, si no son de fábrica). */
export async function savePreset(name: string) {
  name = name.trim();
  if (!name) return;
  if (FACTORY_PRESETS.some((p) => p.name === name)) { toast('Ese nombre es de un preset de fábrica'); return; }
  const p = currentPreset(name);
  for (const t of presetUserTables(p)) {
    await dbPut('tables', t.name, { name: t.name, count: t.count, data: t.data });
  }
  await dbPut('presets', name, p);
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
  const file: PresetFile = { tablas: 1, preset: p };
  const user = presetUserTables(p);
  if (user.length) {
    file.userTables = user.map((t) => ({ name: t.name, count: t.count, data: bufToBase64(t.data.slice().buffer) }));
  }
  void downloadBlob(new Blob([JSON.stringify(file)], { type: 'application/json' }), `${p.name}.tablas.json`).catch(() => {});
}

export async function importPreset(file: File) {
  try {
    const data = JSON.parse(await file.text()) as PresetFile;
    if (data.tablas !== 1 || !data.preset) throw new Error('formato');
    const p = data.preset;
    for (const t of data.userTables ?? []) {
      const table: Wavetable = { name: t.name, count: t.count, data: new Float32Array(base64ToBuf(t.data)) };
      if (table.data.length !== table.count * FRAME) throw new Error('tabla');
      userTables.set(table.name, table);
      await dbPut('tables', table.name, table);
    }
    if (FACTORY_PRESETS.some((f) => f.name === p.name)) p.name += ' (importado)';
    await dbPut('presets', p.name, p);
    await refreshPresets();
    await applyPreset(p);
    toast(`Preset importado: ${p.name}`);
  } catch {
    toast('Ese archivo no es un preset de Tablas');
  }
}

/** Arranque: carga el primer preset (el audio queda suspendido hasta el primer toque). */
export async function boot() {
  void host.ensure();
  void startMidi(
    { send: (m) => { void host.resume(); host.send(m); }, hold: (on) => setParam('hold', on ? 1 : 0),
      control: (st, d1, d2) => midiHooks.control(st, d1, d2),
      maxParam: (id, x) => {
        if (!MAX_PARAM_IDS.has(id)) return;
        maxApplying = true;
        setParam(id, fromMax(pdef(id), x));
        maxApplying = false;
      },
      maxSynced: () => { maxSynced = true; },
    },
    (st) => { ui.midiKind = st.kind; ui.midiSources = st.sources; },
  );
  await refreshPresets(); // primero la lista de tablas guardadas: los presets las buscan por nombre
  await applyPreset(FACTORY_PRESETS[0]);
}
