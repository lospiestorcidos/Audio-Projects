<script lang="ts">
  // Asistente para enseñar a la app un controlador MIDI: se mueve cada knob y se pulsa cada botón
  // una sola vez. No hay que programar nada en el controlador.
  import { cancelLearn, learnBack, learnSkip, LEARN_STEPS, midiMap } from '../state/midimap.svelte';
  import { ui } from '../state/store.svelte';

  const step = $derived(midiMap.step >= 0 ? LEARN_STEPS[midiMap.step] : null);
  const names: Record<string, string> = { cc: 'CC', n: 'nota', pc: 'programa' };
  const pretty = (k: string) => k.replace(/^(cc|n|pc)(\d+)$/, (_, t: string, n: string) => `${names[t]} ${n}`);
</script>

{#if step}
  <div class="veil">
    <div class="box" role="dialog" aria-label="Configurar controlador MIDI">
      <div class="count">Paso {midiMap.step + 1} de {LEARN_STEPS.length}</div>
      <div class="ask">{step.text}</div>
      {#if ui.midiKind === 'none'}
        <p class="warn">
          Este navegador no recibe MIDI. Funciona en Chrome o Edge en el ordenador, y en la app nativa del iPad.
        </p>
      {:else if !ui.midiSources.length}
        <p class="warn">No hay ningún controlador MIDI conectado.</p>
      {:else}
        <p>Controlador: {ui.midiSources.join(', ')}</p>
      {/if}
      <p class="last">{midiMap.lastKey ? `Anterior: ${pretty(midiMap.lastKey)} ✓` : ' '}</p>
      <div class="row">
        <button disabled={midiMap.step === 0} onclick={learnBack}>Atrás</button>
        <button onclick={learnSkip}>Saltar</button>
        <button onclick={cancelLearn}>Cancelar</button>
      </div>
      <p class="hint">Si te faltan botones para alguna página, pulsa «Saltar». Al terminar se guarda solo.</p>
    </div>
  </div>
{/if}

<style>
  .veil { position: fixed; inset: 0; z-index: 40; background: rgba(11, 13, 16, 0.88); display: grid; place-items: center; padding: 16px; }
  .box { width: min(460px, 100%); background: var(--panel); border: 2px solid var(--accent); border-radius: 16px; padding: 20px; text-align: center; }
  .count { font-size: 13px; color: var(--dim); text-transform: uppercase; letter-spacing: 0.06em; }
  .ask { font-size: 24px; font-weight: 800; margin: 10px 0 12px; }
  p { margin: 6px 0; font-size: 14px; color: var(--dim); }
  .warn { color: var(--hot); font-weight: 600; }
  .last { color: var(--accent2); min-height: 20px; white-space: pre; }
  .row { display: flex; gap: 8px; margin: 14px 0 8px; }
  .row button { flex: 1 1 0; min-height: 52px; }
  .hint { font-size: 12px; }
</style>
