<script lang="ts">
  // Franja de acciones (ocupa el sitio del teclado de los sintes): lo que se toca mientras suena.
  import { pluck, setIoOn, setParam, tapTempo, ui, val } from '../state/store.svelte';

  const hold = $derived(val('hold') >= 0.5);
  const bypass = $derived(val('bypass') >= 0.5);
</script>

<div class="strip">
  <button class:on={ui.ioOn} onclick={() => setIoOn(!ui.ioOn)}>I/O</button>
  <button onpointerdown={tapTempo}>Tap {val('bpm').toFixed(0)}</button>
  <button class:on={hold} class="hold" onclick={() => setParam('hold', hold ? 0 : 1)}>Hold</button>
  <button class:on={bypass} class="byp" onclick={() => setParam('bypass', bypass ? 0 : 1)}>Bypass</button>
  <button onpointerdown={pluck}>Probar</button>
</div>

<style>
  .strip { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; height: 100%; padding: 6px calc(6px + env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) 6px; }
  button { min-height: 0; padding: 0 4px; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; touch-action: manipulation; }
  .hold.on { background: var(--accent2); border-color: var(--accent2); }
  .byp.on { background: var(--hot); border-color: var(--hot); }
</style>
