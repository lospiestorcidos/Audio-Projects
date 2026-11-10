<script lang="ts">
  // Display principal: las tablas de ondas de los dos osciladores en perspectiva, o
  // envolventes/LFO/filtro. En modo Auto cambia según el parámetro que se esté tocando.
  import { onMount } from 'svelte';
  import { drawModView } from '../display/modview';
  import { TableView } from '../display/tableview';
  import { C } from '../display/theme';
  import { pdef } from '../shared/params';
  import { host, loadFile, select, setParam, ui, val } from '../state/store.svelte';

  let { compact = false }: { compact?: boolean } = $props();
  let canvas: HTMLCanvasElement;
  let wrap: HTMLDivElement;
  const views = [new TableView(), new TableView()];
  let dropping = $state(false);

  const MOD_GROUPS = ['env1', 'env2', 'env3', 'lfo1', 'lfo2', 'filter'];
  const selGroup = $derived(pdef(ui.selected).dest ? '' : pdef(ui.selected).group);
  const showing = $derived(
    ui.display === 'auto' ? (MOD_GROUPS.includes(selGroup) ? 'mod' : 'wave') : ui.display,
  );
  /** En pantallas pequeñas se ve una sola tabla: la del oscilador que se está tocando. */
  const soloOsc = $derived(selGroup === 'osc2' ? 1 : 0);

  const dpr = () => Math.min(2, window.devicePixelRatio || 1);

  onMount(() => {
    const g = canvas.getContext('2d')!;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      canvas.width = Math.max(2, Math.round(wrap.clientWidth * dpr()));
      canvas.height = Math.max(2, Math.round(wrap.clientHeight * dpr()));
    });
    ro.observe(wrap);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const k = dpr(), w = canvas.width / k, h = canvas.height / k;
      const tel = ui.audio === 'running' && host.tel && host.tel.voices > 0 ? host.tel : null;
      g.save(); g.scale(k, k);
      if (showing === 'wave') {
        g.fillStyle = C.bg; g.fillRect(0, 0, w, h);
        const oscs = compact ? [soloOsc] : [0, 1];
        const gap = 8, pw = (w - gap * (oscs.length - 1)) / oscs.length;
        oscs.forEach((o, i) => {
          g.save(); g.translate(i * (pw + gap), 0);
          const name = ui.oscTable[o] || '…';
          views[o].draw(g, pw, h, host.tables[o], val(`o${o + 1}Pos`), tel ? tel.mod[o] : -1,
            o === 0 ? C.accent : C.accent2, `OSC ${o + 1} · ${name}`, ui.tableVersion);
          g.restore();
        });
      } else {
        drawModView(g, w, h, val, tel, selGroup, compact);
      }
      g.restore();
    };
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  });

  // Tocar o arrastrar sobre una tabla fija la posición de ese oscilador (abajo = 0 %, arriba = 100 %).
  let drag: { pid: number; osc: number } | null = null;
  function setPos(e: PointerEvent) {
    if (!drag) return;
    const r = canvas.getBoundingClientRect();
    setParam(`o${drag.osc + 1}Pos`, 1 - (e.clientY - r.top - r.height * 0.1) / (r.height * 0.8));
  }
  function down(e: PointerEvent) {
    if (showing !== 'wave') return;
    try { canvas.setPointerCapture(e.pointerId); } catch { /* puntero ya liberado */ }
    const r = canvas.getBoundingClientRect();
    const osc = compact ? soloOsc : e.clientX - r.left < r.width / 2 ? 0 : 1;
    drag = { pid: e.pointerId, osc };
    select(`o${osc + 1}Pos`);
    setPos(e);
  }
  function move(e: PointerEvent) { if (drag && e.pointerId === drag.pid) setPos(e); }
  function up(e: PointerEvent) { if (drag && e.pointerId === drag.pid) drag = null; }

  function drop(e: DragEvent) {
    e.preventDefault();
    dropping = false;
    const f = e.dataTransfer?.files?.[0];
    if (f) void loadFile(f);
  }
  const MODES = [['auto', 'Auto'], ['wave', 'Tabla'], ['mod', 'Mod']] as const;
</script>

<div
  class="display" class:compact class:dropping role="application" aria-label="Display"
  ondragover={(e) => { e.preventDefault(); dropping = true; }}
  ondragleave={() => (dropping = false)} ondrop={drop}
>
  <div class="canvas" bind:this={wrap}>
    <canvas bind:this={canvas} onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}></canvas>
    {#if dropping}<div class="drop">Suelta la tabla o el audio aquí</div>{/if}
  </div>
  <div class="side">
    {#if compact}
      <!-- Pantalla pequeña: un botón que va rotando entre las vistas. -->
      <button onclick={() => (ui.display = ui.display === 'auto' ? 'wave' : ui.display === 'wave' ? 'mod' : 'auto')}>
        {MODES.find((m) => m[0] === ui.display)?.[1]}
      </button>
    {:else}
      {#each MODES as [k, t]}
        <button class:on={ui.display === k} onclick={() => (ui.display = k)}>{t}</button>
      {/each}
    {/if}
  </div>
</div>

<style>
  .display { display: flex; min-height: 0; flex: 1 1 auto; gap: 8px; padding: 8px 10px; }
  .canvas { position: relative; flex: 1 1 auto; min-width: 0; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
  .dropping .canvas { border-color: var(--accent); }
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; }
  .drop { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(11, 13, 16, 0.8); font-size: 22px; font-weight: 700; color: var(--accent); pointer-events: none; }
  .side { display: flex; flex-direction: column; gap: 6px; width: 64px; flex: 0 0 auto; }
  .side button { padding: 0; min-height: 0; flex: 1 1 0; max-height: 56px; font-size: 14px; }
  .compact { padding: 6px; gap: 6px; }
  .compact .side { width: 50px; }
  .compact .side button { max-height: none; font-size: 13px; }
</style>
