<script lang="ts">
  // Interfaz de páginas: una sola pantalla con 8 controles y botones para cambiar de página.
  // Las posiciones de los controles son fijas en cada página; los que no aplican al modo actual
  // se atenúan en lugar de desaparecer.
  import { MOD_TABLE, pdef, type SourceId } from '../shared/params';
  import { MOD_DESTS, modDest, select, ui, val } from '../state/store.svelte';
  import Display from './Display.svelte';
  import ECapture from './ECapture.svelte';
  import Enc from './Enc.svelte';
  import Keyboard from './Keyboard.svelte';
  import TopBar from './TopBar.svelte';

  type Slot = { id: string; label?: string; off?: boolean } | null;
  const S = (id: string, label?: string, off = false): Slot => ({ id, label, off });

  const mode = $derived(Math.round(val('mode')));
  const lfoMode = $derived(Math.round(val('lfoMode')));
  const dest = $derived(MOD_TABLE[modDest()] ? modDest() : 'position');

  const PAGES = [
    { id: 'grain', title: 'Grano' }, { id: 'note', title: 'Nota' }, { id: 'var', title: 'Variación' },
    { id: 'filter', title: 'Filtro' }, { id: 'env1', title: 'Env 1' }, { id: 'env2', title: 'Env 2' },
    { id: 'lfo1', title: 'LFO 1' }, { id: 'lfo2', title: 'LFO 2' }, { id: 'mod', title: 'Mod' },
    { id: 'capture', title: 'Capture' },
  ];

  function slotsFor(page: string): Slot[] {
    switch (page) {
      case 'grain': return [
        S('mode'), S('position'), S('size', 'Size'), S('shape', undefined, mode === 2),
        S('reverse', undefined, mode !== 1), S('density', undefined, mode !== 2), S('spread'), S('volume'),
      ];
      case 'note': return [
        S('transpose'), S('tune'), S('pbRange', 'PB Range'), S('mono'),
        S('glide', undefined, val('mono') < 0.5), S('scanSpeed', 'Scan'), S('scanDist', 'Scan Dist'), S('scanLoop', 'Scan Loop'),
      ];
      case 'var': return [
        S('variation', 'Amount'), S('varPos', 'Position'), S('varSize', 'Size'), S('varPitch', 'Transp', mode !== 2),
        S('varVol', 'Volume'), null, null, null,
      ];
      case 'filter': return [
        S('filterOn', 'Filtro'), S('filterMode', 'Tipo'), S('filterFreq', 'Freq'), S('filterRes', 'Reso'),
        S('filterWidth'), null, null, null,
      ];
      case 'env1': return [S('e1A'), S('e1D'), S('e1S'), S('e1R'), S('e1Key'), null, null, null];
      case 'env2': return [S('e2A'), S('e2D'), S('e2S'), S('e2R'), S('e2Key'), null, null, null];
      case 'lfo1': return [
        S('lfoMode'), S(['lfoRate', 'lfoDiv', 'lfoAudio'][lfoMode], 'Rate'), S('lfoShape'), S('lfoAmount'),
        S('lfoStereo'), S('lfoQuant'), S('lfoPhase'), S('lfoRandPhase', 'Fase aleat.'),
      ];
      case 'lfo2': return [S('bpm', undefined, lfoMode !== 1), S('lfoModWheel', 'Mod Wheel'), null, null, null, null, null, null];
      case 'mod': {
        const out: Slot[] = (Object.keys(MOD_TABLE[dest]) as SourceId[]).map((s) => S(`${dest}>${s}`));
        while (out.length < 8) out.push(null);
        return out;
      }
      default: return [];
    }
  }
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
        <span class="info">{ui.voices} voces · {ui.grains} granos</span>
      {/if}
    </div>
    <div class="grid">
      {#if ui.epage === 'capture'}
        <ECapture />
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
    grid-template-rows: auto minmax(90px, 22%) auto auto minmax(110px, 1fr);
    grid-template-areas: 'top' 'disp' 'work' 'nav' 'kbd';
    padding: 0 env(safe-area-inset-right) 0 env(safe-area-inset-left);
  }
  .top { grid-area: top; min-width: 0; }
  .disp { grid-area: disp; display: flex; min-height: 0; min-width: 0; }
  .work { grid-area: work; display: flex; flex-direction: column; min-height: 0; min-width: 0; padding: 0 6px 6px; }
  nav { grid-area: nav; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 5px; padding: 0 6px 4px; }
  .kbd { grid-area: kbd; min-height: 0; min-width: 0; }

  .title { display: flex; align-items: center; gap: 8px; height: 34px; flex: 0 0 auto; }
  .title b { font-size: 15px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }
  .title .info { margin-left: auto; font-size: 12px; color: var(--dim); font-variant-numeric: tabular-nums; }
  .title .dest { font-weight: 700; min-width: 96px; text-align: center; }
  .title button { min-height: 30px; min-width: 40px; padding: 0; }

  .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-template-rows: repeat(2, 104px); gap: 6px; }
  .empty { border: 2px dashed var(--line); border-radius: 12px; opacity: 0.3; }

  nav button { min-height: 42px; padding: 0 2px; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* Horizontal (teléfono tumbado o iPad): display a la izquierda, los 8 controles a la derecha. */
  @media (orientation: landscape) {
    .pg {
      grid-template-columns: minmax(0, 42fr) minmax(0, 58fr);
      grid-template-rows: auto minmax(0, 1fr) auto minmax(84px, 28%);
      grid-template-areas: 'top top' 'disp work' 'nav nav' 'kbd kbd';
    }
    .work { padding: 0 6px 6px 0; }
    .grid { flex: 1 1 auto; min-height: 0; grid-template-rows: repeat(2, minmax(0, 1fr)); }
    nav { grid-template-columns: repeat(10, minmax(0, 1fr)); }
    .title { height: 30px; }
  }
  @media (orientation: landscape) and (max-height: 480px) {
    nav button { min-height: 34px; font-size: 12px; }
    .title { height: 24px; }
  }
</style>
