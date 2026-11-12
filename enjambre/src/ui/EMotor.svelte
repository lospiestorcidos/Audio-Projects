<script lang="ts">
  // Página Motor: motor y variación, entrada de audio y tempo. 8 celdas: 4 controles y 4 botones.
  import { onMount } from 'svelte';
  import { host, pluck, setIoOn, setIoSource, tapTempo, ui, val } from '../state/store.svelte';
  import Enc from './Enc.svelte';

  let level = $state(0);
  onMount(() => {
    const t = setInterval(() => (level = ui.ioOn ? Math.max(host.tel?.inPeak ?? 0, level * 0.7) : 0), 80);
    void host.listInputs().then((l) => (ui.ioInputs = l));
    return () => clearInterval(t);
  });

  const sources = $derived([
    { id: '', label: 'Por defecto' },
    ...ui.ioInputs.filter((d) => d.id && d.id !== 'default').map((d) => ({ id: d.id, label: d.label })),
  ]);
  const srcLabel = $derived(sources.find((s) => s.id === ui.ioSource)?.label ?? 'Por defecto');
  function nextSource() {
    const i = sources.findIndex((s) => s.id === ui.ioSource);
    void setIoSource(sources[(i + 1) % sources.length].id);
  }
</script>

<Enc id="engine" />
<Enc id="variation" />
<button class="cell" class:on={ui.ioOn} onclick={() => setIoOn(!ui.ioOn)}>
  <small>Entrada</small><b>I/O</b>
  <div class="bar"><div style:width={`${Math.min(100, level * 100)}%`} class:clip={level > 0.98}></div></div>
</button>
<button class="cell" onclick={nextSource}><small>Fuente</small><b>{srcLabel}</b></button>
<Enc id="bpm" />
<Enc id="clockSync" label={ui.clockAlive ? 'MIDI Clock ●' : 'MIDI Clock'} />
<button class="cell" onpointerdown={tapTempo}><small>Tempo</small><b>Tap</b><small>{val('bpm').toFixed(1)}</small></button>
<button class="cell" onpointerdown={pluck}><small>Sonido</small><b>Probar</b></button>

<style>
  .cell {
    min-width: 0; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;
    padding: 4px; background: var(--panel); border: 2px solid var(--line); border-radius: 12px; overflow: hidden;
  }
  .cell.on { background: var(--accent); border-color: var(--accent); color: #000; }
  .cell.on small { color: #000; }
  small { font-size: 11px; font-weight: 700; color: var(--dim); text-transform: uppercase; letter-spacing: 0.04em; }
  b { font-size: 15px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bar { width: 70%; height: 8px; border: 1px solid var(--line); border-radius: 4px; overflow: hidden; background: var(--bg); }
  .bar div { height: 100%; background: var(--accent2); }
  .bar div.clip { background: var(--hot); }
</style>
