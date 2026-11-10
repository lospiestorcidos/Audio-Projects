<script lang="ts">
  // Página Capture de la interfaz de páginas: las mismas funciones, en celdas grandes.
  import { onMount } from 'svelte';
  import {
    cancelCapture, capture, host, saveCapture, setCaptureLength, setCaptureOn, setCaptureSource, ui,
  } from '../state/store.svelte';

  const LENGTHS = [2, 4, 8, 12, 20, 30];
  let level = $state(0);
  onMount(() => {
    const t = setInterval(() => (level = ui.capOn ? Math.max(host.inputLevel, level * 0.7) : 0), 80);
    void host.listInputs().then((l) => (ui.capInputs = l));
    return () => clearInterval(t);
  });

  // Fuentes disponibles: micrófono, cada entrada externa y resampling.
  const sources = $derived([
    { id: '', label: 'Micrófono' },
    ...ui.capInputs.filter((d) => d.id && d.id !== 'default').map((d) => ({ id: d.id, label: d.label })),
    { id: 'resample', label: 'Resampling' },
  ]);
  const srcLabel = $derived(sources.find((s) => s.id === ui.capSource)?.label ?? 'Micrófono');
  function nextSource() {
    const i = sources.findIndex((s) => s.id === ui.capSource);
    void setCaptureSource(sources[(i + 1) % sources.length].id);
  }
  function nextLength() {
    const i = LENGTHS.indexOf(ui.capLength);
    setCaptureLength(LENGTHS[(i + 1) % LENGTHS.length]);
  }
</script>

<button class="cell" class:on={ui.capOn} onclick={() => setCaptureOn(!ui.capOn)}><small>Grabación</small><b>I/O</b></button>
<button class="cell" onclick={nextSource}><small>Fuente</small><b>{srcLabel}</b></button>
<button class="cell" onclick={nextLength}><small>Length</small><b>{ui.capLength} s</b></button>
<div class="cell meter"><small>Nivel</small><div class="bar"><div style:width={`${Math.min(100, level * 100)}%`} class:clip={level > 0.98}></div></div></div>
<button class="cell rec" disabled={!ui.capOn} onclick={capture}><b>Capture</b></button>
<button class="cell" disabled={!ui.capPending} onclick={cancelCapture}><b>Cancel</b></button>
<button class="cell" disabled={!ui.capPending} onclick={saveCapture}><b>Save</b></button>
<div class="cell empty"></div>

<style>
  .cell {
    min-width: 0; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
    padding: 4px; background: var(--panel); border: 2px solid var(--line); border-radius: 12px; overflow: hidden;
  }
  .cell.on { background: var(--accent); border-color: var(--accent); color: #000; }
  .cell.on small { color: #000; }
  .cell.rec:not(:disabled) { background: var(--hot); border-color: var(--hot); color: #000; }
  .cell.empty { border-style: dashed; opacity: 0.3; }
  small { font-size: 11px; font-weight: 700; color: var(--dim); text-transform: uppercase; letter-spacing: 0.04em; }
  b { font-size: 15px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bar { width: 80%; height: 14px; border: 1px solid var(--line); border-radius: 7px; overflow: hidden; background: var(--bg); }
  .bar div { height: 100%; background: var(--accent2); }
  .bar div.clip { background: var(--hot); }
</style>
