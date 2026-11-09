<script lang="ts">
  // Selector para parámetros de lista: botones si hay pocas opciones, menú nativo si hay muchas.
  import { pdef } from '../shared/params';
  import { select, setParam, val } from '../state/store.svelte';
  let { id, label }: { id: string; label?: string } = $props();
  const d = $derived(pdef(id));
  const v = $derived(Math.round(val(id)));
  // El modo del motor no cambia el parámetro seleccionado (no tiene modulaciones).
  const pick = (i: number) => { if (id !== 'mode') select(id); setParam(id, i); };
</script>

<div class="cell">
  {#if d.options!.length <= 3}
    <div class="seg">
      {#each d.options! as o, i}
        <button class:on={v === i} onclick={() => { pick(i); }}>{o}</button>
      {/each}
    </div>
  {:else}
    <select value={v} aria-label={label ?? d.label} onchange={(e) => { pick(+e.currentTarget.value); }}>
      {#each d.options! as o, i}<option value={i}>{o}</option>{/each}
    </select>
  {/if}
  <div class="lab">{label ?? d.label}</div>
</div>

<style>
  .cell { flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 0 4px; }
  .seg { display: flex; }
  .seg button { border-radius: 0; min-height: 48px; padding: 0 9px; margin-left: -1px; }
  .seg button:first-child { border-radius: 10px 0 0 10px; margin-left: 0; }
  .seg button:last-child { border-radius: 0 10px 10px 0; }
  select { min-height: 48px; }
  .lab { font-size: 12px; color: var(--dim); }
</style>
