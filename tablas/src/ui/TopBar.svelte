<script lang="ts">
  // Barra superior: presets, carga de tablas, medidor de CPU y menú.
  import { onMount } from 'svelte';
  import { FACTORY_PRESETS } from '../state/presets';
  import {
    deletePreset, exportPreset, host, importPreset, loadFile, loadPresetByName,
    cycleTapSpeed, savePreset, setLayout, TAP_SPEEDS, ui,
  } from '../state/store.svelte';
  import { clearMidiMap, hasMidiMap, midiMap, startLearn, togglePickup } from '../state/midimap.svelte';

  let { compact = false }: { compact?: boolean } = $props();
  let fileInput: HTMLInputElement;
  let presetInput: HTMLInputElement;
  let menu = $state(false);

  // Los contadores se refrescan 4 veces por segundo (no en cada frame) para no cargar la UI.
  onMount(() => {
    const t = setInterval(() => {
      const tel = host.tel;
      if (!tel || ui.audio !== 'running') { ui.cpu = 0; ui.voices = 0; ui.oscs = 0; return; }
      ui.cpu = tel.cpu; ui.voices = tel.voices; ui.oscs = tel.oscs;
    }, 250);
    return () => clearInterval(t);
  });

  const isUser = $derived(ui.userPresets.includes(ui.presetName));

  function save() {
    const name = prompt('Nombre del preset', isUser ? ui.presetName : '');
    if (name) void savePreset(name);
    menu = false;
  }
</script>

<header class:compact>
  <div class="logo">TABLAS</div>

  <select class="preset" aria-label="Preset" value={ui.presetName} onchange={(e) => loadPresetByName(e.currentTarget.value)}>
    <optgroup label="Fábrica">
      {#each FACTORY_PRESETS as p}<option value={p.name}>{p.name}</option>{/each}
    </optgroup>
    {#if ui.userPresets.length}
      <optgroup label="Mis presets">
        {#each ui.userPresets as n}<option value={n}>{n}</option>{/each}
      </optgroup>
    {/if}
  </select>
  <div class="menuwrap">
    <button aria-label="Menú de presets" onclick={() => (menu = !menu)}>⋯</button>
    {#if menu}
      <div class="menu">
        <button onclick={() => { fileInput.click(); menu = false; }}>Cargar tabla o audio…</button>
        <hr />
        <button onclick={save}>Guardar preset…</button>
        <button onclick={() => { exportPreset(); menu = false; }}>Exportar</button>
        <button onclick={() => { presetInput.click(); menu = false; }}>Importar…</button>
        <button disabled={!isUser} onclick={() => { void deletePreset(ui.presetName); menu = false; }}>Borrar</button>
        <hr />
        <button onclick={() => { setLayout(ui.layout === 'pages' ? 'classic' : 'pages'); menu = false; }}>
          {ui.layout === 'pages' ? 'Interfaz clásica' : 'Interfaz de páginas'}
        </button>
        <!-- No cierra el menú: se puede pulsar varias veces hasta dar con la velocidad cómoda. -->
        <button onclick={cycleTapSpeed}>Doble toque: {TAP_SPEEDS.find((t) => t.ms === ui.tapMs)?.label}</button>
        <hr />
        <button onclick={() => { startLearn(); menu = false; }}>Configurar controlador MIDI…</button>
        {#if hasMidiMap()}
          <button onclick={togglePickup}>Knobs MIDI: {midiMap.pickup ? 'sin saltos' : 'directo'}</button>
          <button onclick={() => { clearMidiMap(); menu = false; }}>Borrar controlador MIDI</button>
        {/if}
        <button onclick={() => { host.send({ t: 'panic' }); menu = false; }}>Pánico</button>
      </div>
    {/if}
  </div>

  <!-- El selector de archivos de iPad solo se abre desde un toque directo en un botón,
       no desde el cambio de un menú desplegable. -->
  <button class="load" aria-label="Cargar tabla o audio desde Archivos" onclick={() => fileInput.click()}>
    <span aria-hidden="true">📂</span><span> Osc {ui.tableTarget + 1}</span>
  </button>
  
  <div class="grow"></div>
  <div class="meter" class:hot={ui.cpu > 0.6} title="Carga del motor de audio">
    <div><b>{Math.round(ui.cpu * 100)}%</b> CPU</div>
    {#if !compact}<div>{ui.voices} voces · {ui.oscs} osc</div>{/if}
  </div>
  {#if !compact}<button class="panic" onclick={() => host.send({ t: 'panic' })}>Pánico</button>{/if}

  <input bind:this={fileInput} type="file" hidden accept="audio/*,.wav,.aif,.aiff,.mp3,.m4a,.flac,.ogg"
    onchange={(e) => { const f = e.currentTarget.files?.[0]; if (f) void loadFile(f); e.currentTarget.value = ''; }} />
  <input bind:this={presetInput} type="file" hidden accept=".json,application/json"
    onchange={(e) => { const f = e.currentTarget.files?.[0]; if (f) void importPreset(f); e.currentTarget.value = ''; }} />
</header>

<style>
  header { display: flex; align-items: center; gap: 8px; padding: calc(6px + env(safe-area-inset-top)) 10px 6px; background: var(--panel); border-bottom: 1px solid var(--line); }
  .logo { font-weight: 800; letter-spacing: 0.14em; color: var(--accent); margin-right: 4px; }
  .preset { width: 170px; min-width: 0; flex: 0 1 auto; }
  .grow { flex: 1 1 auto; }
  .panic { flex: 0 0 auto; }
  .meter { font-size: 12px; text-align: right; line-height: 1.25; color: var(--dim); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .meter b { color: var(--text); }
  .meter.hot b { color: var(--hot); }
  .menuwrap { position: relative; }
  .load { flex: 0 0 auto; padding: 0 12px; }
  .menu { position: absolute; top: 46px; left: 0; z-index: 20; display: flex; flex-direction: column; gap: 4px; padding: 6px; background: var(--panel2); border: 1px solid var(--line); border-radius: 12px; width: 250px; max-height: 80vh; overflow-y: auto; }
  .menu button { text-align: left; }
  .menu hr { width: 100%; border: none; border-top: 1px solid var(--line); margin: 2px 0; }
  .compact { gap: 6px; padding-left: 6px; padding-right: 6px; }
  .compact .logo { display: none; }
  .compact .preset { width: auto; flex: 1 1 0; }
  .compact .grow { display: none; }
  header :global(.cell .lab) { display: none; }
  header :global(.seg button) { min-height: 40px; }
</style>
