<script lang="ts">
  // Teclado en pantalla con expresión tipo MPE por toque:
  //   X = pitch bend (una tecla de ancho = un semitono), Y = Slide,
  //   presión del Apple Pencil o tamaño del toque = Press.
  import { onMount } from 'svelte';
  import { host, setParam, ui, val } from '../state/store.svelte';

  const KEYS = 25;
  let base = $state(48);
  let velocity = $state(100);
  let wheel = $state(0);
  let el: HTMLDivElement;
  /** Toques activos: pointerId → nota y posición inicial. */
  const touches = new Map<number, { note: number; x0: number; keyW: number }>();
  let held = $state<Record<number, number>>({}); // nota → desplazamiento de bend en teclas

  const isBlack = (n: number) => [1, 3, 6, 8, 10].includes(((n % 12) + 12) % 12);
  const noteName = (n: number) => `C${Math.floor(n / 12) - 2}`; // C3 = 60

  function expr(e: PointerEvent, t: { note: number; x0: number; keyW: number }) {
    const r = el.getBoundingClientRect();
    // Zona muerta para que un toque quieto no desafine.
    let semis = (e.clientX - t.x0) / t.keyW;
    semis = Math.abs(semis) < 0.18 ? 0 : semis - Math.sign(semis) * 0.18;
    const range = val('pbRange');
    const bend = range > 0 ? Math.max(-1, Math.min(1, semis / range)) : 0;
    const slide = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
    let press = 0;
    if (e.pointerType === 'pen') press = e.pressure;
    else if (e.pointerType === 'touch') {
      // Sin 3D Touch en iPad: el área de contacto del dedo hace de presión.
      press = e.pressure > 0 && e.pressure !== 0.5 ? e.pressure : Math.max(0, Math.min(1, ((e.width + e.height) / 2 - 18) / 40));
    }
    host.send({ t: 'expr', id: t.note, bend, slide, press });
    held[t.note] = range > 0 ? bend * range : 0;
  }

  function down(e: PointerEvent) {
    void host.resume();
    try { el.setPointerCapture(e.pointerId); } catch { /* puntero ya liberado */ }
    const r = el.getBoundingClientRect();
    const keyW = r.width / KEYS;
    const idx = Math.max(0, Math.min(KEYS - 1, Math.floor((e.clientX - r.left) / keyW)));
    const t = { note: base + idx, x0: r.left + (idx + 0.5) * keyW, keyW };
    // El bend es relativo al punto del primer contacto, no al centro de la tecla.
    t.x0 = e.clientX;
    touches.set(e.pointerId, t);
    host.send({ t: 'on', id: t.note, note: t.note, vel: velocity / 127 });
    expr(e, t);
  }
  function move(e: PointerEvent) {
    const t = touches.get(e.pointerId);
    if (t) expr(e, t);
  }
  function up(e: PointerEvent) {
    const t = touches.get(e.pointerId);
    if (!t) return;
    touches.delete(e.pointerId);
    // Si otro dedo sigue en la misma tecla, la nota continúa.
    for (const o of touches.values()) if (o.note === t.note) return;
    host.send({ t: 'off', id: t.note });
    delete held[t.note];
  }

  // Teclado del ordenador (útil para probar en escritorio).
  const PC = 'awsedftgyhujkolp';
  onMount(() => {
    const kd = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || (e.target as HTMLElement).tagName === 'INPUT') return;
      const i = PC.indexOf(e.key.toLowerCase());
      if (i < 0) return;
      void host.resume();
      host.send({ t: 'on', id: base + 12 + i, note: base + 12 + i, vel: velocity / 127 });
      held[base + 12 + i] = 0;
    };
    const ku = (e: KeyboardEvent) => {
      const i = PC.indexOf(e.key.toLowerCase());
      if (i < 0) return;
      host.send({ t: 'off', id: base + 12 + i });
      delete held[base + 12 + i];
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  });

  function shift(d: number) {
    host.send({ t: 'panic' });
    held = {};
    touches.clear();
    base = Math.max(0, Math.min(96, base + d));
  }
</script>

<div class="kb">
  <div class="ctl">
    <button class:on={val('hold') >= 0.5} onclick={() => setParam('hold', val('hold') >= 0.5 ? 0 : 1)}>Hold</button>
    <div class="oct">
      <button aria-label="Octava abajo" onclick={() => shift(-12)}>−</button>
      <span>{noteName(base)}</span>
      <button aria-label="Octava arriba" onclick={() => shift(12)}>+</button>
    </div>
    <label><span>Vel {velocity}</span>
      <input type="range" min="1" max="127" bind:value={velocity} />
    </label>
    <label><span>Mod {Math.round(wheel * 100)}</span>
      <input type="range" min="0" max="1" step="0.01" bind:value={wheel} oninput={() => host.send({ t: 'wheel', v: wheel })} />
    </label>
  </div>
  <div class="keys" bind:this={el} role="application" aria-label="Teclado"
    onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}>
    {#each Array(KEYS) as _, i}
      {@const n = base + i}
      <div class="key" class:black={isBlack(n)} class:down={held[n] !== undefined}>
        {#if held[n] !== undefined}<div class="bend" style:transform={`translateX(${held[n] * 100}%)`}></div>{/if}
        {#if n % 12 === 0}<span>{noteName(n)}</span>{/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .kb { display: flex; gap: 10px; padding: 8px 10px calc(8px + env(safe-area-inset-bottom)); height: 100%; }
  .ctl { width: 156px; flex: 0 0 auto; display: flex; flex-direction: column; gap: 6px; justify-content: space-between; }
  .ctl > button { min-height: 38px; }
  .oct button { min-height: 38px; }
  .oct { display: flex; align-items: center; justify-content: space-between; gap: 4px; }
  .oct button { min-width: 44px; padding: 0; }
  .oct span { font-weight: 700; }
  label { font-size: 12px; color: var(--dim); display: flex; align-items: center; gap: 6px; white-space: nowrap; touch-action: none; }
  label span { width: 52px; flex: 0 0 auto; }
  input[type='range'] { flex: 1 1 auto; min-width: 0; height: 24px; accent-color: var(--accent); touch-action: none; }
  .keys { flex: 1 1 auto; display: flex; gap: 3px; touch-action: none; min-width: 0; }
  .key { flex: 1 1 0; position: relative; background: #dfe5ec; border-radius: 0 0 8px 8px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 6px; pointer-events: none; overflow: hidden; }
  .key.black { background: #2a323c; border: 1px solid #45505d; }
  .key.down { background: var(--accent); }
  .key span { font-size: 11px; font-weight: 700; color: #39424d; }
  .bend { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.25); }
</style>
