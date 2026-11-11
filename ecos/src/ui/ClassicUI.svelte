<script lang="ts">
  // Interfaz clásica: display grande y las mismas páginas de 8 controles en una fila con pestañas.
  import { PAGES, slotsFor } from '../state/pages.svelte';
  import { ui } from '../state/store.svelte';
  import Display from './Display.svelte';
  import EIo from './EIo.svelte';
  import Enc from './Enc.svelte';
  import Strip from './Strip.svelte';
  import TopBar from './TopBar.svelte';

  const slots = $derived(slotsFor(ui.epage));
</script>

<main>
  <TopBar />
  <Display />
  <nav>
    {#each PAGES as p}
      <button class:on={ui.epage === p.id} onclick={() => (ui.epage = p.id)}>{p.title}</button>
    {/each}
  </nav>
  <section class="params">
    {#if ui.epage === 'io'}
      <EIo />
    {:else}
      {#each slots as s, i (ui.epage + i + (s?.id ?? ''))}
        {#if s}<Enc id={s.id} label={s.label} off={s.off} />{:else}<div class="empty"></div>{/if}
      {/each}
    {/if}
  </section>
  <div class="midi">
    <b>MIDI</b>
    {#if ui.midiKind === 'none'}
      <span>No disponible en este navegador (el MIDI clock funciona en Chrome o Edge en el ordenador).</span>
    {:else if ui.midiSources.length}
      <span>{ui.midiSources.join(', ')}{ui.clockAlive ? ' · recibiendo clock' : ''}</span>
    {:else}
      <span>Ningún dispositivo conectado</span>
    {/if}
  </div>
  <div class="keyboard"><Strip /></div>
</main>

<style>
  main { height: 100%; display: flex; flex-direction: column; padding: 0 env(safe-area-inset-right) 0 env(safe-area-inset-left); }
  nav { display: flex; gap: 5px; padding: 6px 10px 0; background: var(--panel); }
  nav button { flex: 1 1 0; min-height: 38px; border-radius: 10px 10px 0 0; border-bottom: none; padding: 0 4px; font-size: 13px; white-space: nowrap; }
  .params {
    display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px; padding: 8px 10px; height: 128px;
    flex: 0 0 auto; background: var(--panel); border-top: 2px solid var(--accent);
  }
  .empty { border: 2px dashed var(--line); border-radius: 12px; opacity: 0.3; }
  .midi { display: flex; align-items: center; gap: 12px; padding: 0 12px 6px; font-size: 13px; color: var(--dim); background: var(--panel); }
  .midi b { color: var(--text); }
  .keyboard { height: 96px; flex: 0 0 auto; }
</style>
