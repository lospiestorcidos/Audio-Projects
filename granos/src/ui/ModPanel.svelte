<script lang="ts">
  // Zona 2: modulaciones del parámetro seleccionado. Cada destino admite solo sus fuentes.
  import { MOD_TABLE, pdef, type SourceId } from '../shared/params';
  import { ui } from '../state/store.svelte';
  import Knob from './Knob.svelte';

  // Parámetros secundarios que comparten el panel de su parámetro principal.
  const ALIAS: Record<string, string> = {
    lfoDiv: 'lfoRate', lfoAudio: 'lfoRate', tune: 'transpose', pbRange: 'transpose',
    varPos: 'variation', varSize: 'variation', varPitch: 'variation', varVol: 'variation',
    scanDist: 'scanSpeed', scanLoop: 'scanSpeed', filterRes: 'filterFreq', filterWidth: 'filterFreq',
    filterMode: 'filterFreq',
  };
  const dest = $derived(ALIAS[ui.selected] ?? ui.selected);
  const sources = $derived(MOD_TABLE[dest] ? (Object.keys(MOD_TABLE[dest]) as SourceId[]) : []);
</script>

<div class="mod">
  <div class="title">
    <span class="k">Modulación</span>
    <span class="p">{pdef(dest).label}</span>
  </div>
  {#if sources.length}
    {#each sources as s (dest + s)}
      <Knob id={`${dest}>${s}`} small />
    {/each}
  {:else}
    <div class="none">Este parámetro no tiene modulaciones. Toca Position, Grain Size, Filter Frequency…</div>
  {/if}
</div>

<style>
  .mod { display: flex; align-items: center; gap: 2px; padding: 0 10px; background: var(--panel); border-top: 1px solid var(--line); min-height: 104px; overflow: hidden; }
  .title { width: 118px; flex: 0 0 auto; display: flex; flex-direction: column; gap: 2px; }
  .k { font-size: 12px; color: var(--dim); text-transform: uppercase; letter-spacing: 0.06em; }
  .p { font-size: 16px; font-weight: 700; color: var(--accent); }
  .none { color: var(--dim); font-size: 14px; }
</style>
