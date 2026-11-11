<script lang="ts">
  // Control de la interfaz de páginas (uno de los 8). Arrastre vertical para cambiar el valor.
  // En listas e interruptores, un toque pasa a la opción siguiente; en el resto, doble toque = valor por defecto.
  import { pdef, toNorm } from '../shared/params';
  import { isStepped, normOf, select, setNorm, setParam, stepNext, textOf, ui, val } from '../state/store.svelte';

  let { id, label, off = false }: { id: string; label?: string; off?: boolean } = $props();

  const d = $derived(pdef(id));
  const v = $derived(val(id));
  const n = $derived(normOf(id));
  const stepped = $derived(isStepped(id));
  const bipolar = $derived(d.min < 0 && d.curve !== 'log');
  const selected = $derived(!d.dest && ui.selected === id);

  let drag: { pid: number; y: number; n: number; t: number; moved: boolean } | null = null;
  let active = $state(false);
  let lastTap = 0;
  /** Desplazamiento (px) a partir del cual el gesto es un arrastre y no un toque. */
  const TAP_SLOP = 12;

  function down(e: PointerEvent) {
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* puntero ya liberado */ }
    if (!d.dest) select(id);
    drag = { pid: e.pointerId, y: e.clientY, n, t: performance.now(), moved: false };
    active = true;
  }
  function move(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.pid) return;
    const dy = drag.y - e.clientY;
    if (Math.abs(dy) > TAP_SLOP) drag.moved = true;
    if (drag.moved) setNorm(id, drag.n + dy / (stepped ? 120 : 200));
  }
  function up(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.pid) return;
    const now = performance.now();
    // Un toque puede ser lento: vale mientras el dedo no se haya desplazado.
    const tap = !drag.moved && now - drag.t < Math.max(600, ui.tapMs);
    const downAt = drag.t;
    drag = null; active = false;
    if (!tap) return;
    if (stepped) stepNext(id); // toque: opción siguiente
    else if (downAt - lastTap < ui.tapMs) { setParam(id, d.def); lastTap = 0; return; }
    lastTap = now;
  }

  // Arco de 270° (de -135° a +135°, 0° = arriba).
  const R = 25, CX = 32, CY = 31;
  const pt = (a: number) => `${CX + R * Math.sin(a)} ${CY - R * Math.cos(a)}`;
  function arc(n0: number, n1: number): string {
    const a0 = (-135 + 270 * Math.min(n0, n1)) * (Math.PI / 180), a1 = (-135 + 270 * Math.max(n0, n1)) * (Math.PI / 180);
    if (a1 - a0 < 0.001) return '';
    return `M ${pt(a0)} A ${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${pt(a1)}`;
  }
  const zero = $derived(bipolar ? toNorm(d, 0) : 0);
  const ang = $derived((-135 + 270 * n) * (Math.PI / 180));
</script>

<div
  class="enc" class:selected class:active class:off class:mod={!!d.dest}
  role="slider" tabindex="-1" aria-label={label ?? d.label} aria-valuenow={v} aria-disabled={off}
  onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}
>
  <div class="lab">{label ?? d.label}</div>
  <svg viewBox="0 0 64 56" aria-hidden="true">
    <path class="track" d={arc(0, 1)} />
    <path class="value" d={arc(zero, n)} />
    <line class="needle" x1={CX + 9 * Math.sin(ang)} y1={CY - 9 * Math.cos(ang)} x2={CX + R * Math.sin(ang)} y2={CY - R * Math.cos(ang)} />
  </svg>
  <div class="val">{textOf(id)}</div>
</div>

<style>
  .enc {
    min-width: 0; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-between;
    padding: 6px 2px; background: var(--panel); border: 2px solid var(--line); border-radius: 12px;
    touch-action: none; outline: none; cursor: ns-resize; overflow: hidden;
  }
  .enc.selected { border-color: var(--accent); }
  .enc.active { background: var(--panel2); }
  .enc.off { opacity: 0.28; pointer-events: none; }
  svg { flex: 1 1 0; min-height: 0; width: 100%; }
  path { fill: none; stroke-width: 6; stroke-linecap: round; }
  .track { stroke: var(--line); }
  .value { stroke: var(--accent); }
  .mod .value { stroke: var(--accent2); }
  .needle { stroke: var(--text); stroke-width: 4; stroke-linecap: round; }
  .lab { font-size: 11px; font-weight: 700; color: var(--dim); text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
  .val { font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
</style>
