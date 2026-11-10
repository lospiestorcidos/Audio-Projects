<script lang="ts">
  // Raíz: arranca el audio y muestra la interfaz elegida (clásica o de páginas).
  import { onMount } from 'svelte';
  import { boot, host, ui } from '../state/store.svelte';
  import ClassicUI from './ClassicUI.svelte';
  import PagesUI from './PagesUI.svelte';

  onMount(() => {
    void boot();
    // El primer toque en cualquier parte desbloquea el audio; también lo reanuda tras una interrupción.
    const unlock = () => { if (ui.audio !== 'running') void host.resume(); };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
    return () => { window.removeEventListener('pointerdown', unlock, true); window.removeEventListener('keydown', unlock, true); };
  });
</script>

{#if ui.layout === 'pages'}<PagesUI />{:else}<ClassicUI />{/if}

{#if ui.audio !== 'running'}
  <div class="unlock">Toca la pantalla para activar el audio</div>
{/if}
{#if ui.toast}<div class="toast">{ui.toast}</div>{/if}

<style>
  .unlock { position: fixed; top: 64px; left: 50%; transform: translateX(-50%); background: var(--accent); color: #000; font-weight: 700; padding: 10px 18px; border-radius: 999px; pointer-events: none; z-index: 30; white-space: nowrap; }
  .toast { position: fixed; top: 112px; left: 50%; transform: translateX(-50%); background: var(--panel2); border: 1px solid var(--accent); padding: 10px 18px; border-radius: 12px; font-weight: 600; z-index: 30; pointer-events: none; max-width: 90vw; }
</style>
