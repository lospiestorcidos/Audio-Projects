<script lang="ts">
  // Franja de acciones (ocupa el sitio del teclado de los sintes): lo que se toca mientras suena.
  // Tap y Probar están en la página Motor.
  import { loopAction, setIoOn, setParam, ui, val } from '../state/store.svelte';
  import { LOOP_BUTTON_SHORT } from './loopLabel';

  const hold = $derived(val('hold') >= 0.5);
  const bypass = $derived(val('bypass') >= 0.5);
  const st = $derived(ui.loopState);
</script>

<div class="strip">
  <button class="loop" class:rec={st === 1} class:dub={st === 3} class:wait={ui.loopPending} onpointerdown={() => loopAction('loop')}>
    {LOOP_BUTTON_SHORT[st]}
  </button>
  <button disabled={st === 0} onpointerdown={() => loopAction('stop')}>Stop</button>
  <button class:on={hold} class="hold" onclick={() => setParam('hold', hold ? 0 : 1)}>Hold</button>
  <button class:on={bypass} class="byp" onclick={() => setParam('bypass', bypass ? 0 : 1)}>Bypass</button>
  <button class:on={ui.ioOn} onclick={() => setIoOn(!ui.ioOn)}>I/O</button>
</div>

<style>
  .strip { display: grid; grid-template-columns: 1.5fr repeat(4, minmax(0, 1fr)); gap: 6px; height: 100%; padding: 6px calc(6px + env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) 6px; }
  button { min-height: 0; padding: 0 4px; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; touch-action: manipulation; }
  @media (max-width: 500px) { button { font-size: 13px; } }
  .loop { border-color: var(--accent); }
  .loop.rec { background: var(--hot); border-color: var(--hot); color: #000; }
  .loop.dub { background: #ffb000; border-color: #ffb000; color: #000; }
  .loop.wait { animation: blink 0.5s steps(2) infinite; }
  @keyframes blink { 50% { opacity: 0.55; } }
  .hold.on { background: var(--accent2); border-color: var(--accent2); }
  .byp.on { background: var(--hot); border-color: var(--hot); }
</style>
