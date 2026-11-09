// Estado de la aplicación (runes de Svelte 5) y acciones: parámetros, sample y presets.
import { AudioHost, type LoadedSample } from '../audio/host';
import { factorySample } from '../audio/factory';
import { base64ToBuf, bufToBase64, decodeWav16, downloadBlob, encodeWav } from '../audio/wav';
import { PARAMS, clampParam, defaultValues, pdef, pidx } from '../shared/params';
import { dbDel, dbGet, dbKeys, dbPut } from './db';
import { FACTORY_PRESETS, type Preset, type PresetFile } from './presets';

export const host = new AudioHost();

export const ui = $state({
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

export function setParam(id: string, v: number) {
  const d = pdef(id), i = pidx(id);
  v = clampParam(d, v);
  if (ui.values[i] === v) return;
  ui.values[i] = v;
  host.setParam(i, v);
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

export function loadUserSample(s: LoadedSample) {
  ui.sampleKind = 'user';
  host.setSample(s);
}

export function loadFactorySample(name: string) {
  ui.sampleKind = 'factory';
  host.setSample(factorySample(name));
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
  try { ui.userPresets = (await dbKeys('presets')).sort(); } catch { ui.userPresets = []; }
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
  downloadBlob(new Blob([JSON.stringify(file)], { type: 'application/json' }), `${p.name}.granos.json`);
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
  await applyPreset(FACTORY_PRESETS[0]);
  void refreshPresets();
}
