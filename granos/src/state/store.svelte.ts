// Estado de la aplicación (runes de Svelte 5) y acciones: parámetros, sample y presets.
import { AudioHost, type LoadedSample } from '../audio/host';
import { factorySample } from '../audio/factory';
import { base64ToBuf, bufToBase64, decodeWav16, downloadBlob, encodeWav } from '../audio/wav';
import { MOD_TABLE, PARAMS, clampParam, defaultValues, pdef, pidx } from '../shared/params';
import { maxSend, startMidi } from '../midi/midi';
import { fromMax, MAX_PARAM_IDS, toMax } from '../shared/maxparams';
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
    const saved = localStorage.getItem('granos.layout');
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
    const v = Number(localStorage.getItem('granos.tapMs'));
    if (TAP_SPEEDS.some((t) => t.ms === v)) return v;
  } catch { /* sin almacenamiento */ }
  return 1000;
}

export const ui = $state({
  tapMs: initialTapMs(),
  /** Interfaz: 'classic' (todo a la vista) o 'pages' (8 controles por página). */
  layout: initialLayout(),
  /** Página activa de la interfaz de páginas. */
  epage: 'grain',
  values: Array.from(defaultValues()),
  /** Parámetro tocado por última vez: decide el panel de modulación y el display en modo Auto. */
  selected: 'position',
  page: 'grain',
  display: 'auto' as 'auto' | 'wave' | 'mod',
  zoom: 1,
  audio: 'off' as 'off' | 'running' | 'suspended',
  sampleName: '',
  sampleKind: 'factory' as 'factory' | 'user',
  /** Cambia cada vez que se sustituye el sample (para redibujar la forma de onda). */
  sampleVersion: 0,
  presetName: FACTORY_PRESETS[0].name,
  userPresets: [] as string[],
  userSamples: [] as string[],
  // Capture
  capOn: false,
  capSource: '' as string, // '' = micrófono por defecto, 'resample' o deviceId
  capLength: 8,
  capInputs: [] as { id: string; label: string }[],
  /** Hay una captura sonando que aún se puede cancelar. */
  capPending: false,
  /** Estado de la entrada MIDI. */
  midiKind: 'none' as 'native' | 'web' | 'max' | 'none',
  midiSources: [] as string[],
  cpu: 0,
  voices: 0,
  grains: 0,
  toast: '',
});

host.onState = (s) => (ui.audio = s);
host.onSample = (s) => { ui.sampleName = s.name; ui.sampleVersion++; };

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
}

export function setLayout(l: 'classic' | 'pages') {
  ui.layout = l;
  try { localStorage.setItem('granos.layout', l); } catch { /* sin almacenamiento */ }
}

/** Pasa a la siguiente velocidad de doble toque y la recuerda. */
export function cycleTapSpeed() {
  const i = TAP_SPEEDS.findIndex((t) => t.ms === ui.tapMs);
  ui.tapMs = TAP_SPEEDS[(i + 1) % TAP_SPEEDS.length].ms;
  try { localStorage.setItem('granos.tapMs', String(ui.tapMs)); } catch { /* sin almacenamiento */ }
}

/** Destinos que tienen panel de modulación, en orden. */
export const MOD_DESTS = Object.keys(MOD_TABLE);
// Parámetros secundarios que comparten el panel de su parámetro principal.
const MOD_ALIAS: Record<string, string> = {
  lfoDiv: 'lfoRate', lfoAudio: 'lfoRate', tune: 'transpose', pbRange: 'transpose',
  varPos: 'variation', varSize: 'variation', varPitch: 'variation', varVol: 'variation',
  scanDist: 'scanSpeed', scanLoop: 'scanSpeed', filterRes: 'filterFreq', filterWidth: 'filterFreq',
  filterMode: 'filterFreq',
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

// ---------- Samples ----------

/** Último sample cargado (no capturado): a él vuelve Cancel. */
let lastLoaded: { kind: 'factory' | 'user'; sample: LoadedSample } | null = null;

function remember(kind: 'factory' | 'user', s: LoadedSample) {
  lastLoaded = { kind, sample: { name: s.name, sr: s.sr, ch: s.ch.map((c) => c.slice()) } };
  ui.capPending = false;
}

export function loadUserSample(s: LoadedSample) {
  ui.sampleKind = 'user';
  host.setSample(s);
  remember('user', s);
}

export function loadFactorySample(name: string) {
  ui.sampleKind = 'factory';
  const s = factorySample(name);
  host.setSample(s);
  remember('factory', s);
}

export async function loadSavedSample(name: string) {
  const s = await dbGet<LoadedSample>('samples', name);
  if (s) loadUserSample(s);
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

/** Sustituye el sample por los últimos segundos grabados. Los parámetros no cambian. */
export async function capture() {
  const r = await host.grabCapture();
  if (!r.ch || r.ch[0].length < 2048) { toast('Todavía no hay audio grabado'); return; }
  const t = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const name = `Captura ${pad(t.getHours())}.${pad(t.getMinutes())}.${pad(t.getSeconds())}`;
  ui.sampleKind = 'user';
  host.setSample({ name, ch: r.ch, sr: r.sr }); // se normaliza a 0 dB
  ui.capPending = true;
}

/** Descarta la captura y vuelve al último sample cargado. */
export function cancelCapture() {
  if (!lastLoaded) return;
  const { kind, sample } = lastLoaded;
  ui.sampleKind = kind;
  host.setSample({ name: sample.name, sr: sample.sr, ch: sample.ch.map((c) => c.slice()) });
  ui.capPending = false;
}

/** Guarda la captura en la app (IndexedDB) y la exporta como WAV a Archivos. */
export async function saveCapture() {
  const s = host.sample;
  if (!s) return;
  await dbPut('samples', s.name, s);
  try {
    await downloadBlob(new Blob([encodeWav(s.ch, s.sr)], { type: 'audio/wav' }), `${s.name}.wav`);
  } catch { /* el usuario cerró la hoja de compartir: la captura ya está guardada en la app */ }
  remember('user', s); // ya es un sample "cargado": Cancel no lo descarta
  await refreshPresets();
  toast(`Guardado: ${s.name}`);
}

/** Carga un archivo de audio elegido en Archivos o soltado sobre la app. */
export async function loadFile(file: File) {
  try {
    const s = await host.decode(await file.arrayBuffer(), file.name.replace(/\.[^.]+$/, ''));
    loadUserSample(s);
    toast(`Sample cargado: ${s.name}`);
  } catch {
    toast('No se pudo leer ese archivo de audio');
  }
}

// ---------- Presets ----------

function currentPreset(name: string): Preset {
  const params: Record<string, number> = {};
  PARAMS.forEach((d, i) => { if (ui.values[i] !== d.def) params[d.id] = ui.values[i]; });
  return { name, params, sample: { kind: ui.sampleKind, name: ui.sampleName } };
}

function applyParams(params: Record<string, number>) {
  const a = defaultValues();
  for (const id of Object.keys(params)) {
    const i = PARAMS.findIndex((d) => d.id === id);
    if (i >= 0) a[i] = clampParam(PARAMS[i], params[id]); // ignora parámetros de versiones futuras
  }
  // Hold no se restaura: dejaría notas colgadas al cambiar de preset.
  a[pidx('hold')] = 0;
  ui.values = Array.from(a);
  host.send({ t: 'panic' });
  host.setAllParams(a);
  for (const id of MAX_PARAM_IDS) tellMax(id); // un preset cargado en la app actualiza Live
}

export async function applyPreset(p: Preset) {
  applyParams(p.params);
  ui.presetName = p.name;
  if (p.sample.kind === 'user') {
    const s = await dbGet<LoadedSample>('samples', p.sample.name);
    if (s) { loadUserSample(s); return; }
    toast('Falta el sample de este preset; se usa uno de fábrica');
    loadFactorySample('Cuerdas');
  } else loadFactorySample(p.sample.name);
}

export async function refreshPresets() {
  try {
    ui.userPresets = (await dbKeys('presets')).sort();
    ui.userSamples = (await dbKeys('samples')).sort();
  } catch { ui.userPresets = []; ui.userSamples = []; }
}

export async function loadPresetByName(name: string) {
  const f = FACTORY_PRESETS.find((p) => p.name === name);
  if (f) return applyPreset(f);
  const p = await dbGet<Preset>('presets', name);
  if (p) await applyPreset(p);
}

/** Guarda el estado actual como preset de usuario (y su sample, si no es de fábrica). */
export async function savePreset(name: string) {
  name = name.trim();
  if (!name) return;
  if (FACTORY_PRESETS.some((p) => p.name === name)) { toast('Ese nombre es de un preset de fábrica'); return; }
  const p = currentPreset(name);
  if (p.sample.kind === 'user' && host.sample) await dbPut('samples', p.sample.name, host.sample);
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
  const file: PresetFile = { granos: 1, preset: p };
  if (p.sample.kind === 'user' && host.sample) file.wav = bufToBase64(encodeWav(host.sample.ch, host.sample.sr));
  void downloadBlob(new Blob([JSON.stringify(file)], { type: 'application/json' }), `${p.name}.granos.json`).catch(() => {});
}

export async function importPreset(file: File) {
  try {
    const data = JSON.parse(await file.text()) as PresetFile;
    if (data.granos !== 1 || !data.preset) throw new Error('formato');
    const p = data.preset;
    if (data.wav) {
      const w = decodeWav16(base64ToBuf(data.wav));
      await dbPut('samples', p.sample.name, { name: p.sample.name, ch: w.ch, sr: w.sr });
    }
    if (FACTORY_PRESETS.some((f) => f.name === p.name)) p.name += ' (importado)';
    await dbPut('presets', p.name, p);
    await refreshPresets();
    await applyPreset(p);
    toast(`Preset importado: ${p.name}`);
  } catch {
    toast('Ese archivo no es un preset de Granos');
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
  await applyPreset(FACTORY_PRESETS[0]);
  void refreshPresets();
}
