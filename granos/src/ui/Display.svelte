<script lang="ts">
  // Zona 1: display principal. Forma de onda con granos en vivo, o envolventes/LFO/filtro.
  // En modo Auto cambia según el parámetro que se esté tocando.
  import { onMount } from 'svelte';
  import { drawModView } from '../display/modview';
  import { WaveView } from '../display/wave';
  import { pdef } from '../shared/params';
  import { host, loadFile, select, setParam, ui, val } from '../state/store.svelte';

  let { compact = false }: { compact?: boolean } = $props();
  let canvas: HTMLCanvasElement;
  let wrap: HTMLDivElement;
  const wave = new WaveView();
  let dropping = $state(false);
  /** Centro del zoom congelado mientras se arrastra Position (si no, la vista se escaparía). */
  let frozenCenter: number | null = null;
  let seenVersion = -1;

  const MOD_GROUPS = ['env1', 'env2', 'lfo', 'filter'];
  const selGroup = $derived(pdef(ui.selected).group);
  const showing = $derived(
    ui.display === 'auto' ? (MOD_GROUPS.includes(selGroup) ? 'mod' : 'wave') : ui.display,
  );

  function view(): [number, number] {
    return WaveView.window(frozenCenter ?? val('position'), ui.zoom);
  }

  onMount(() => {
    const g = canvas.getContext('2d')!;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(2, Math.round(wrap.clientWidth * dpr));
      canvas.height = Math.max(2, Math.round(wrap.clientHeight * dpr));
    });
    ro.observe(wrap);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const w = canvas.width, h = canvas.height;
      if (seenVersion !== ui.sampleVersion && host.sample) {
        wave.setSample(host.sample.ch[0]); // solo canal izquierdo si es estéreo
        seenVersion = ui.sampleVersion;
      }
      const tel = ui.audio === 'running' ? host.tel : null;
      if (showing === 'wave') {
        const [v0, v1] = view();
        wave.draw(g, w, h, v0, v1, val('position'), val('scanDist'), val('scanSpeed') > 0, tel, seenVersion);
      } else {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        g.save(); g.scale(dpr, dpr);
        drawModView(g, w / dpr, h / dpr, val, tel, selGroup, compact);
        g.restore();
      }
    };
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  });

  // Tocar o arrastrar sobre la forma de onda fija Position.
  let dragId = -1;
  function setPos(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    const [v0, v1] = view();
    setParam('position', v0 + ((e.clientX - r.left) / r.width) * (v1 - v0));
  }
  function down(e: PointerEvent) {
    if (showing !== 'wave') return;
    try { canvas.setPointerCapture(e.pointerId); } catch { /* puntero ya liberado */ }
    dragId = e.pointerId;
    frozenCenter = val('position');
    select('position');
    setPos(e);
  }
  function move(e: PointerEvent) { if (e.pointerId === dragId) setPos(e); }
  function up(e: PointerEvent) { if (e.pointerId === dragId) { dragId = -1; frozenCenter = null; } }

  function drop(e: DragEvent) {
    e.preventDefault();
    dropping = false;
    const f = e.dataTransfer?.files?.[0];
    if (f) void loadFile(f);
  }
</script>

<div
  class="display" class:compact class:dropping role="application" aria-label="Display"
  ondragover={(e) => { e.preventDefault(); dropping = true; }}
  ondragleave={() => (dropping = false)} ondrop={drop}
>
  <div class="canvas" bind:this={wrap}>
    <canvas bind:this={canvas} onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}></canvas>
    {#if showing === 'wave'}<div class="name">{ui.sampleName}</div>{/if}
    {#if dropping}<div class="drop">Suelta el audio aquí</div>{/if}
  </div>
  {#if compact}
    <!-- Pantalla pequeña: dos botones que van rotando entre las opciones. -->
    <div class="side">
      <button onclick={() => (ui.display = ui.display === 'auto' ? 'wave' : ui.display === 'wave' ? 'mod' : 'auto')}>
        {ui.display === 'auto' ? 'Auto' : ui.display === 'wave' ? 'Onda' : 'Mod'}
      </button>
      <button onclick={() => (ui.zoom = ui.zoom >= 64 ? 1 : ui.zoom * 2)}>{ui.zoom === 1 ? 'ALL' : `×${ui.zoom}`}</button>
    </div>
  {:else}
    <div class="side">
      {#each [['auto', 'Auto'], ['wave', 'Onda'], ['mod', 'Mod']] as [k, t]}
        <button class:on={ui.display === k} onclick={() => (ui.display = k as typeof ui.display)}>{t}</button>
      {/each}
      <div class="sp"></div>
      <button aria-label="Acercar" onclick={() => (ui.zoom = Math.min(64, ui.zoom * 2))}>+</button>
      <button aria-label="Alejar" onclick={() => (ui.zoom = Math.max(1, ui.zoom / 2))}>−</button>
      <button class:on={ui.zoom === 1} onclick={() => (ui.zoom = 1)}>ALL</button>
    </div>
  {/if}
</div>

<style>
  .display { display: flex; min-height: 0; flex: 1 1 auto; gap: 8px; padding: 8px 10px; }
  .canvas { position: relative; flex: 1 1 auto; min-width: 0; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
  .dropping .canvas { border-color: var(--accent); }
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; }
  .name { position: absolute; left: 12px; bottom: 8px; font-size: 13px; color: var(--dim); pointer-events: none; }
  .drop { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(11, 13, 16, 0.8); font-size: 22px; font-weight: 700; color: var(--accent); pointer-events: none; }
  .side { display: flex; flex-direction: column; gap: 6px; width: 64px; flex: 0 0 auto; }
  .side button { padding: 0; min-height: 0; flex: 1 1 0; max-height: 48px; font-size: 14px; }
  .sp { flex: 0 1 12px; }
  .compact { padding: 6px; gap: 6px; }
  .compact .side { width: 50px; }
  .compact .side button { max-height: none; font-size: 13px; }
</style>
