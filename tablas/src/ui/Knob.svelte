<script lang="ts">
  // Knob táctil: arrastre vertical, doble toque = valor por defecto. Cada knob captura su propio
  // puntero, así se pueden mover varios a la vez (multitouch real).
  import { pdef, toNorm } from '../shared/params';
  import { isStepped, normOf, select, setNorm, setParam, stepNext, textOf, ui, val } from '../state/store.svelte';

  let { id, label, small = false }: { id: string; label?: string; small?: boolean } = $props();

  const d = $derived(pdef(id));
  const v = $derived(val(id));
  const n = $derived(normOf(id));
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
    // 220 px de recorrido = rango completo.
    if (drag.moved) setNorm(id, drag.n + dy / 220);
  }
  function up(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.pid) return;
    const now = performance.now();
    // Solo cuentan como toque los gestos sin arrastre; el doble toque usa la velocidad elegida en el menú.
    const tap = !drag.moved && now - drag.t < Math.max(600, ui.tapMs);
    const downAt = drag.t;
    drag = null; active = false;
    if (!tap) return;
    if (downAt - lastTap < ui.tapMs) { setParam(id, d.def); lastTap = 0; return; }
    lastTap = now;
  }

  // Arco de 270° (de -135° a +135°, 0° = arriba).
  const R = 26, CX = 32, CY = 32;
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
  class="knob" class:small class:selected class:active
  role="slider" tabindex="-1" aria-label={label ?? d.label} aria-valuenow={v}
  onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}
>
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path class="track" d={arc(0, 1)} />
    <path class="value" d={arc(zero, n)} />
    <line class="needle" x1={CX + 10 * Math.sin(ang)} y1={CY - 10 * Math.cos(ang)} x2={CX + R * Math.sin(ang)} y2={CY - R * Math.cos(ang)} />
  </svg>
  <div class="val">{textOf(id)}</div>
  <div class="lab">{label ?? d.label}</div>
</div>

<style>
  .knob {
    width: 80px; outline: none; flex: 0 0 auto; display: flex; flex-direction: column; align-items: center;
    padding: 4px 2px 6px; border-radius: 12px; border: 2px solid transparent; touch-action: none; cursor: ns-resize;
  }
  .knob.small { width: 74px; }
  .knob.selected { border-color: var(--accent); background: var(--panel); }
  .knob.active { background: var(--panel2); }
  svg { width: 60px; height: 60px; }
  .small svg { width: 48px; height: 48px; }
  path { fill: none; stroke-width: 6; stroke-linecap: round; }
  .track { stroke: var(--line); }
  .value { stroke: var(--accent); }
  .small .value { stroke: var(--accent2); }
  .needle { stroke: var(--text); stroke-width: 4; stroke-linecap: round; }
  .val { font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .lab { font-size: 12px; color: var(--dim); white-space: nowrap; margin-top: 1px; }
</style>
