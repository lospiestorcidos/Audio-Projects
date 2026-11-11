<script lang="ts">
  // Display principal: tiempo de retardo, historial de repeticiones y medidores.
  import { onMount } from 'svelte';
  import { drawDelayView } from '../display/delayview';
  import { DIVS, delaySeconds, formatParam, pdef } from '../shared/params';
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
      const sync = val('sync') >= 0.5;
      g.save(); g.scale(k, k);
      drawDelayView(g, w, h, {
        seconds: delaySeconds(sync, val('time'), val('div'), val('bpm')),
        label: sync ? DIVS[Math.round(val('div'))] : formatParam(pdef('time'), val('time')),
        bpm: val('bpm'), sync,
        clock: ui.clockAlive && val('clockSync') >= 0.5 ? 'midi' : 'manual',
        feedback: val('feedback'), frozen: val('freeze') >= 0.5, inputOn: ui.ioOn,
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
