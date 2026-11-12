<script lang="ts">
  // Display principal: motor, rejilla, entrada reciente y las cabezas que la leen.
  import { onMount } from 'svelte';
  import { drawSwarmView } from '../display/swarmview';
  import { TIMES } from '../shared/params';
  import { host, ui, val } from '../state/store.svelte';

  let { compact = false }: { compact?: boolean } = $props();
  let canvas: HTMLCanvasElement;
  let wrap: HTMLDivElement;
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
      g.save(); g.scale(k, k);
      drawSwarmView(g, w, h, {
        engine: Math.round(val('engine')), variation: Math.round(val('variation')),
        time: TIMES[Math.round(val('time'))], bpm: val('bpm'),
        midiClock: ui.clockAlive && val('clockSync') >= 0.5,
        hold: val('hold') >= 0.5, bypass: val('bypass') >= 0.5, inputOn: ui.ioOn,
      }, ui.audio === 'running' ? host.tel : null);
      g.restore();
    };
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  });
</script>

<div class="display" class:compact>
  <div class="canvas" bind:this={wrap}><canvas bind:this={canvas}></canvas></div>
</div>

<style>
  .display { display: flex; min-height: 0; flex: 1 1 auto; padding: 8px 10px; }
  .canvas { position: relative; flex: 1 1 auto; min-width: 0; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
  .compact { padding: 6px; }
</style>
