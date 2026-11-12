<script lang="ts">
  // Página Looper: 4 botones (Loop, Stop, Undo, Clear) y 4 controles (Reverse, Ruta, Cuantizar, Hold).
  import { loopAction, ui } from '../state/store.svelte';
  import Enc from './Enc.svelte';
  import { LOOP_BUTTON, LOOP_STATE_SHORT } from './loopLabel';

  const st = $derived(ui.loopState);
</script>

<button class="cell loop" class:rec={st === 1} class:dub={st === 3} class:wait={ui.loopPending} onpointerdown={() => loopAction('loop')}>
  <small>Loop · {ui.loopPending ? 'espera al paso' : LOOP_STATE_SHORT[st]}</small><b>{LOOP_BUTTON[st]}</b>
</button>
<button class="cell" disabled={st === 0} onpointerdown={() => loopAction('stop')}><small>Bucle</small><b>Stop</b></button>
<button class="cell" disabled={!ui.loopLayer} onclick={() => loopAction('undo')}><small>Capa</small><b>Undo</b></button>
<button class="cell" disabled={st === 0} onclick={() => loopAction('clear')}><small>Bucle</small><b>Clear</b></button>
<Enc id="reverse" />
<Enc id="loopRoute" />
<Enc id="loopQuant" />
<Enc id="hold" />

<style>
  .cell {
    min-width: 0; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;
    padding: 4px; background: var(--panel); border: 2px solid var(--line); border-radius: 12px; overflow: hidden;
    touch-action: manipulation;
  }
  .loop { border-color: var(--accent); }
  .loop.rec { background: var(--hot); border-color: var(--hot); color: #000; }
  .loop.dub { background: #ffb000; border-color: #ffb000; color: #000; }
  .loop.rec small, .loop.dub small { color: #000; }
  .loop.wait { animation: blink 0.5s steps(2) infinite; }
  @keyframes blink { 50% { opacity: 0.55; } }
  small { font-size: 11px; font-weight: 700; color: var(--dim); text-transform: uppercase; letter-spacing: 0.04em; text-align: center; }
  b { font-size: 15px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
