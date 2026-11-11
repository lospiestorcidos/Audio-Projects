<script lang="ts">
  // Interfaz de páginas: una sola pantalla con 8 controles y botones para cambiar de página.
  // Las posiciones de los controles son fijas en cada página; los que no aplican al modo actual
  // se atenúan en lugar de desaparecer.
  import { pdef } from '../shared/params';
  import { PAGES, pageModDest, slotsFor } from '../state/pages.svelte';
  import { MOD_DESTS, select, ui } from '../state/store.svelte';
  import Display from './Display.svelte';
  import ETables from './ETables.svelte';
  import Enc from './Enc.svelte';
  import Keyboard from './Keyboard.svelte';
  import TopBar from './TopBar.svelte';

  const dest = $derived(pageModDest());
  const slots = $derived(slotsFor(ui.epage));

  /** En la página Mod: pasa al destino anterior o siguiente. */
  function stepDest(d: number) {
    const i = MOD_DESTS.indexOf(dest);
    select(MOD_DESTS[(i + d + MOD_DESTS.length) % MOD_DESTS.length]);
  }
</script>

<main class="pg">
  <div class="top"><TopBar compact /></div>
  <div class="disp"><Display compact /></div>

  <section class="work">
    <div class="title">
      <b>{PAGES.find((p) => p.id === ui.epage)?.title}</b>
      {#if ui.epage === 'mod'}
        <button aria-label="Destino anterior" onclick={() => stepDest(-1)}>◀</button>
        <span class="dest">{pdef(dest).label}</span>
        <button aria-label="Destino siguiente" onclick={() => stepDest(1)}>▶</button>
      {:else}
        <span class="info">{ui.voices} voces · {ui.oscs} osc</span>
      {/if}
    </div>
    <div class="grid">
      {#if ui.epage === 'tables'}
        <ETables />
      {:else}
        {#each slots as s, i (ui.epage + i + (s?.id ?? ''))}
          {#if s}<Enc id={s.id} label={s.label} off={s.off} />{:else}<div class="empty"></div>{/if}
        {/each}
      {/if}
    </div>
  </section>

  <nav>
    {#each PAGES as p}
      <button class:on={ui.epage === p.id} onclick={() => (ui.epage = p.id)}>{p.title}</button>
    {/each}
  </nav>

  <div class="kbd"><Keyboard compact /></div>
</main>

<style>
  /* Vertical (teléfono de pie): todo en una columna. */
  .pg {
    height: 100%; display: grid; grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(90px, 1fr) auto auto 66px;
    grid-template-areas: 'top' 'disp' 'work' 'nav' 'kbd';
    padding: 0 env(safe-area-inset-right) 0 env(safe-area-inset-left);
  }
  .top { grid-area: top; min-width: 0; }
  .disp { grid-area: disp; display: flex; min-height: 0; min-width: 0; }
  .work { grid-area: work; display: flex; flex-direction: column; min-height: 0; min-width: 0; padding: 0 6px 6px; }
  nav { grid-area: nav; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 5px; padding: 0 6px 4px; }
  .kbd { grid-area: kbd; min-height: 0; min-width: 0; }

  .title { display: flex; align-items: center; gap: 8px; height: 34px; flex: 0 0 auto; }
  .title b { font-size: 15px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }
  .title .info { margin-left: auto; font-size: 12px; color: var(--dim); font-variant-numeric: tabular-nums; }
  .title .dest { font-weight: 700; min-width: 96px; text-align: center; }
  .title button { min-height: 30px; min-width: 40px; padding: 0; }

  .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-template-rows: repeat(2, 104px); gap: 6px; }
  .empty { border: 2px dashed var(--line); border-radius: 12px; opacity: 0.3; }

  nav button { min-height: 56px; padding: 0 2px; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  /* Teclado compacto: franja baja, con sus controles reducidos. */
  .kbd :global(.kb) { height: 100%; padding: 4px 6px; gap: 6px; }
  .kbd :global(.compact .ctl > button), .kbd :global(.compact .oct button) { min-height: 26px; }
  .kbd :global(.compact label) { font-size: 11px; }

  /* Horizontal (teléfono tumbado o iPad): display a la izquierda, los 8 controles a la derecha. */
  @media (orientation: landscape) {
    .pg {
      grid-template-columns: minmax(0, 42fr) minmax(0, 58fr);
      grid-template-rows: auto minmax(0, 1fr) auto 66px;
      grid-template-areas: 'top top' 'disp work' 'nav nav' 'kbd kbd';
    }
    .work { padding: 0 6px 6px 0; }
    .grid { flex: 1 1 auto; min-height: 0; grid-template-rows: repeat(2, minmax(0, 1fr)); }
    nav { grid-template-columns: repeat(12, minmax(0, 1fr)); }
    .title { height: 30px; }
  }
  @media (orientation: landscape) and (max-height: 480px) {
    nav button { min-height: 46px; font-size: 12px; }
    .title { height: 24px; }
  }
</style>
