<script lang="ts">
  // Interruptor para parámetros booleanos.
  import { pdef } from '../shared/params';
  import { select, setParam, val } from '../state/store.svelte';
  let { id, label }: { id: string; label?: string } = $props();
  const d = $derived(pdef(id));
  const on = $derived(val(id) >= 0.5);
</script>

<div class="cell">
  <button class:on aria-pressed={on} onclick={() => { select(id); setParam(id, on ? 0 : 1); }}>
    {label ?? d.label}
  </button>
</div>

<style>
  .cell { flex: 0 0 auto; display: flex; align-items: center; padding: 0 4px; }
  button { min-height: 52px; min-width: 64px; padding: 0 10px; }
</style>
