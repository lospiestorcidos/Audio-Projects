// Dibujo de una tabla de ondas en perspectiva: los ciclos apilados hacia el fondo, con el ciclo
// de la posición actual resaltado.
import { FRAME, type Wavetable } from '../shared/wavetable';
import { C } from './theme';

type G = CanvasRenderingContext2D;
const MAX_LINES = 28;
const POINTS = 160;

export class TableView {
  private cache: HTMLCanvasElement | null = null;
  private key = '';

  /** Geometría común: cada ciclo se desplaza hacia arriba y a la derecha según su posición 0..1. */
  private geo(w: number, h: number) {
    const padX = 14, top = 34, bottom = 12;
    const depthX = w * 0.16, depthY = (h - top - bottom) * 0.5;
    const cw = w - padX * 2 - depthX, amp = (h - top - bottom - depthY) * 0.38;
    const baseY = h - bottom - amp;
    return { padX, depthX, depthY, cw, amp, baseY };
  }

  /** Traza un ciclo (interpolado entre los dos vecinos de la posición t). */
  private trace(g: G, t: Wavetable, pos: number, w: number, h: number) {
    const { padX, depthX, depthY, cw, amp, baseY } = this.geo(w, h);
    const x = pos * (t.count - 1), f0 = Math.floor(x), f1 = Math.min(t.count - 1, f0 + 1), fr = x - f0;
    const ox = padX + depthX * pos, oy = baseY - depthY * pos;
    // Cada punto es la media de su tramo del ciclo: las tablas con muchos armónicos (por ejemplo las
    // creadas desde audio) se ven como una curva limpia en vez de una mancha.
    const seg = FRAME / POINTS, a = f0 * FRAME, b = f1 * FRAME;
    g.beginPath();
    for (let i = 0; i < POINTS; i++) {
      const k0 = Math.floor(i * seg), k1 = Math.max(k0 + 1, Math.floor((i + 1) * seg));
      let acc = 0;
      for (let k = k0; k < k1; k++) acc += t.data[a + k] * (1 - fr) + t.data[b + k] * fr;
      const px = ox + ((i + 0.5) / POINTS) * cw, py = oy - (acc / (k1 - k0)) * amp;
      if (i) g.lineTo(px, py); else g.moveTo(px, py);
    }
    g.stroke();
  }

  /**
   * Dibuja la tabla en el rectángulo (0,0,w,h) del contexto ya trasladado.
   * pos = posición del control; live = posición real de la voz que suena (o -1).
   */
  draw(g: G, w: number, h: number, t: Wavetable | null, pos: number, live: number, color: string, title: string, version: number) {
    const key = `${w}|${h}|${version}|${t?.name ?? ''}|${title}`;
    if (key !== this.key) {
      if (!this.cache) this.cache = document.createElement('canvas');
      this.cache.width = Math.max(1, Math.round(w)); this.cache.height = Math.max(1, Math.round(h));
      const c = this.cache.getContext('2d')!;
      c.fillStyle = C.panel; c.fillRect(0, 0, w, h);
      c.fillStyle = color; c.font = '600 13px system-ui, sans-serif'; c.textBaseline = 'top';
      c.fillText(title, 10, 8);
      if (t) {
        // Peso de la tabla: del fondo hacia delante, para que los ciclos cercanos tapen a los lejanos.
        const lines = Math.min(MAX_LINES, t.count);
        c.strokeStyle = C.wave; c.lineWidth = 1;
        for (let i = lines - 1; i >= 0; i--) this.trace(c, t, lines > 1 ? i / (lines - 1) : 0, w, h);
      }
      this.key = key;
    }
    g.drawImage(this.cache!, 0, 0);
    if (!t) return;
    if (live >= 0 && Math.abs(live - pos) > 0.004) {
      g.strokeStyle = C.text; g.lineWidth = 1.5; g.globalAlpha = 0.75;
      this.trace(g, t, live, w, h);
      g.globalAlpha = 1;
    }
    g.strokeStyle = color; g.lineWidth = 2.5;
    this.trace(g, t, pos, w, h);
  }
}
