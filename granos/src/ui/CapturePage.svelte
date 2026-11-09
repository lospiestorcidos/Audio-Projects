<script lang="ts">
  // Página Capture: grabación permanente en buffer circular y sustitución del sample en vivo.
  import { onMount } from 'svelte';
  import {
    cancelCapture, capture, host, saveCapture, setCaptureLength, setCaptureOn, setCaptureSource, ui,
  } from '../state/store.svelte';

  let level = $state(0);
  onMount(() => {
    const t = setInterval(() => (level = ui.capOn ? Math.max(host.inputLevel, level * 0.7) : 0), 80);
    void host.listInputs().then((l) => (ui.capInputs = l));
    return () => clearInterval(t);
  });
</script>

<div class="cap">
  <button class="io" class:on={ui.capOn} onclick={() => setCaptureOn(!ui.capOn)}>I/O</button>

  <label>Fuente
    <select value={ui.capSource} onchange={(e) => setCaptureSource(e.currentTarget.value)}>
      <option value="">Micrófono</option>
      {#each ui.capInputs.filter((d) => d.id && d.id !== 'default') as d}
        <option value={d.id}>Entrada: {d.label}</option>
      {/each}
      <option value="resample">Resampling (salida del sinte)</option>
    </select>
  </label>

  <label>Length · {ui.capLength} s
    <input type="range" min="1" max="30" step="1" value={ui.capLength}
      oninput={(e) => setCaptureLength(+e.currentTarget.value)} />
  </label>

  <div class="meter" aria-label="Nivel de entrada"><div style:width={`${Math.min(100, level * 100)}%`} class:clip={level > 0.98}></div></div>

  <button class="big" disabled={!ui.capOn} onclick={capture}>Capture</button>
  <button disabled={!ui.capPending} onclick={cancelCapture}>Cancel</button>
  <button disabled={!ui.capPending} onclick={saveCapture}>Save</button>
</div>

<style>
  .cap { display: flex; align-items: center; gap: 12px; width: 100%; }
  .io { min-width: 64px; min-height: 56px; }
  .big { min-height: 56px; min-width: 110px; background: var(--hot); border-color: var(--hot); color: #000; }
  .cap > button:not(.io):not(.big) { min-height: 56px; min-width: 84px; }
  label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--dim); }
  select { max-width: 230px; color: var(--text); }
  input[type='range'] { width: 150px; height: 28px; accent-color: var(--accent); touch-action: none; }
  .meter { width: 110px; height: 14px; border: 1px solid var(--line); border-radius: 7px; overflow: hidden; background: var(--bg); }
  .meter div { height: 100%; background: var(--accent2); }
  .meter div.clip { background: var(--hot); }
</style>
