<script lang="ts">
  // Estructura general: barra superior, display (zona 1), modulación (zona 2),
  // fila de parámetros por páginas (zona 3) y teclado.
  import { onMount } from 'svelte';
  import { boot, host, ui, val } from '../state/store.svelte';
  import CapturePage from './CapturePage.svelte';
  import Choice from './Choice.svelte';
  import Display from './Display.svelte';
  import Keyboard from './Keyboard.svelte';
  import Knob from './Knob.svelte';
  import ModPanel from './ModPanel.svelte';
  import Toggle from './Toggle.svelte';
  import TopBar from './TopBar.svelte';

  type Item = { k: 'knob' | 'toggle' | 'choice' | 'sep'; id?: string; label?: string; show?: () => boolean };
  const K = (id: string, label?: string, show?: () => boolean): Item => ({ k: 'knob', id, label, show });
  const T = (id: string, label?: string): Item => ({ k: 'toggle', id, label });
  const Ch = (id: string, label?: string): Item => ({ k: 'choice', id, label });
  const SEP: Item = { k: 'sep' };
  const mode = () => Math.round(val('mode'));
  const lfoMode = () => Math.round(val('lfoMode'));

  const PAGES: { id: string; title: string; items: Item[] }[] = [
    { id: 'grain', title: 'Grano', items: [
      K('position'), K('size'),
      K('shape', undefined, () => mode() !== 2), // en Cloud la forma del grano no es ajustable
      K('reverse', undefined, () => mode() === 1),
      K('density', undefined, () => mode() === 2),
      SEP, K('transpose'), K('tune'), K('spread'), K('volume'),
    ] },
    { id: 'scan', title: 'Scan · Variation', items: [
      K('scanSpeed', 'Speed'), K('scanDist'), T('scanLoop', 'Scan Loop'), SEP,
      K('variation', 'Amount'), K('varPos', 'Position'), K('varSize', 'Size'),
      K('varPitch', 'Transp', () => mode() === 2), // variación de pitch solo en Cloud
      K('varVol', 'Volume'),
    ] },
    { id: 'filter', title: 'Filtro', items: [
      T('filterOn'), Ch('filterMode'), K('filterFreq'), K('filterRes'), K('filterWidth'),
    ] },
    { id: 'env', title: 'Envolventes', items: [
      K('e1A', 'E1 Attack'), K('e1D', 'E1 Decay'), K('e1S', 'E1 Sustain'), K('e1R', 'E1 Release'), K('e1Key', 'E1 Key'), SEP,
      K('e2A', 'E2 Attack'), K('e2D', 'E2 Decay'), K('e2S', 'E2 Sustain'), K('e2R', 'E2 Release'), K('e2Key', 'E2 Key'),
    ] },
    { id: 'lfo', title: 'LFO', items: [
      Ch('lfoMode'),
      K('lfoRate', undefined, () => lfoMode() === 0),
      { k: 'choice', id: 'lfoDiv', show: () => lfoMode() === 1 },
      K('bpm', undefined, () => lfoMode() === 1),
      K('lfoAudio', undefined, () => lfoMode() === 2),
      Ch('lfoShape'), K('lfoAmount'), K('lfoPhase'), T('lfoRandPhase', 'Fase aleat.'), Ch('lfoStereo'),
      K('lfoQuant'), T('lfoModWheel', 'Mod Wheel'),
    ] },
    { id: 'voices', title: 'Voces', items: [T('mono'), K('glide'), K('pbRange')] },
    { id: 'capture', title: 'Capture', items: [] },
  ];
  const page = $derived(PAGES.find((p) => p.id === ui.page) ?? PAGES[0]);

  onMount(() => {
    void boot();
    // El primer toque en cualquier parte desbloquea el audio; también lo reanuda tras una interrupción.
    const unlock = () => { if (ui.audio !== 'running') void host.resume(); };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
    return () => { window.removeEventListener('pointerdown', unlock, true); window.removeEventListener('keydown', unlock, true); };
  });
</script>

<main>
  <TopBar />
  <Display />
  <ModPanel />
  <nav>
    {#each PAGES as p}
      <button class:on={ui.page === p.id} onclick={() => (ui.page = p.id)}>{p.title}</button>
    {/each}
  </nav>
  <section class="params">
    {#if page.id === 'capture'}<CapturePage />{/if}
    {#each page.items as it (page.id + (it.id ?? Math.random()))}
      {#if it.k === 'sep'}
        <div class="sep"></div>
      {:else if !it.show || it.show()}
        {#if it.k === 'knob'}<Knob id={it.id!} label={it.label} />
        {:else if it.k === 'toggle'}<Toggle id={it.id!} label={it.label} />
        {:else}<Choice id={it.id!} label={it.label} />{/if}
      {/if}
    {/each}
  </section>
  <div class="keyboard"><Keyboard /></div>

  {#if ui.audio !== 'running'}
    <div class="unlock">Toca la pantalla para activar el audio</div>
  {/if}
  {#if ui.toast}<div class="toast">{ui.toast}</div>{/if}
</main>

<style>
  main { height: 100%; display: flex; flex-direction: column; padding: 0 env(safe-area-inset-right) 0 env(safe-area-inset-left); }
  nav { display: flex; gap: 6px; padding: 6px 10px 0; background: var(--panel); }
  nav button { flex: 1 1 0; min-height: 38px; border-radius: 10px 10px 0 0; border-bottom: none; padding: 0 6px; font-size: 14px; }
  .params { display: flex; align-items: center; gap: 2px; padding: 4px 10px; min-height: 112px; background: var(--panel); border-top: 2px solid var(--accent); overflow-x: auto; overflow-y: hidden; touch-action: pan-x; scrollbar-width: none; }
  .sep { width: 1px; align-self: stretch; margin: 10px 8px; background: var(--line); flex: 0 0 auto; }
  .keyboard { height: 23%; min-height: 130px; max-height: 220px; flex: 0 0 auto; }
  .unlock { position: fixed; top: 64px; left: 50%; transform: translateX(-50%); background: var(--accent); color: #000; font-weight: 700; padding: 10px 18px; border-radius: 999px; pointer-events: none; z-index: 30; }
  .toast { position: fixed; top: 112px; left: 50%; transform: translateX(-50%); background: var(--panel2); border: 1px solid var(--accent); padding: 10px 18px; border-radius: 12px; font-weight: 600; z-index: 30; pointer-events: none; }
</style>
