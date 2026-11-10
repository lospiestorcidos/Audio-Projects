<script lang="ts">
  // Interfaz clásica: display grande, panel de modulación siempre a la vista y las mismas páginas
  // de 8 controles en una fila con pestañas.
  import { PAGES, slotsFor } from '../state/pages.svelte';
  import { isNative, showBluetoothMidi } from '../midi/midi';
  import { ui } from '../state/store.svelte';
  import Display from './Display.svelte';
  import ETables from './ETables.svelte';
  import Enc from './Enc.svelte';
  import Keyboard from './Keyboard.svelte';
  import ModPanel from './ModPanel.svelte';
  import TopBar from './TopBar.svelte';

  // La página Mod no hace falta aquí: el panel de modulación está siempre visible.
  const tabs = PAGES.filter((p) => p.id !== 'mod');
  const page = $derived(tabs.some((p) => p.id === ui.page) ? ui.page : tabs[0].id);
  const slots = $derived(slotsFor(page));
</script>

<main>
  <TopBar />
  <Display />
  <ModPanel />
  <nav>
    {#each tabs as p}
      <button class:on={page === p.id} onclick={() => (ui.page = p.id)}>{p.title}</button>
    {/each}
  </nav>
  <section class="params">
    {#if page === 'tables'}
      <ETables />
    {:else}
      {#each slots as s, i (page + i + (s?.id ?? ''))}
        {#if s}<Enc id={s.id} label={s.label} off={s.off} />{:else}<div class="empty"></div>{/if}
      {/each}
    {/if}
  </section>
  {#if page === 'note'}
    <div class="midi">
      <b>MIDI</b>
      {#if ui.midiKind === 'none'}
        <span>{isNative() ? 'No disponible' : 'No disponible en este navegador (usa Chrome o Edge en el ordenador).'}</span>
      {:else if ui.midiSources.length}
        <span>{ui.midiSources.join(', ')}</span>
      {:else}
        <span>Ningún dispositivo conectado</span>
      {/if}
      {#if ui.midiKind === 'native'}<button onclick={showBluetoothMidi}>Bluetooth MIDI…</button>{/if}
    </div>
  {/if}
  <div class="keyboard"><Keyboard /></div>
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
  .keyboard { height: 23%; min-height: 130px; max-height: 220px; flex: 0 0 auto; }
</style>
