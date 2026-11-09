// Forma de onda (canal izquierdo) con zoom centrado en Position, playheads y granos en tiempo real.
import type { Telemetry } from '../shared/params';
import { C } from './theme';

const PEAK_BLOCK = 256;

export class WaveView {
  private data: Float32Array | null = null;
  private pmin = new Float32Array(0);
  private pmax = new Float32Array(0);
  private cache: HTMLCanvasElement | null = null;
  private cacheKey = '';

  /** Precalcula picos por bloques para dibujar rápido samples largos. */
  setSample(left: Float32Array) {
    this.data = left;
    const nb = Math.ceil(left.length / PEAK_BLOCK);
    this.pmin = new Float32Array(nb); this.pmax = new Float32Array(nb);
    for (let b = 0; b < nb; b++) {
      let lo = 1, hi = -1;
      const end = Math.min(left.length, (b + 1) * PEAK_BLOCK);
      for (let i = b * PEAK_BLOCK; i < end; i++) { const v = left[i]; if (v < lo) lo = v; if (v > hi) hi = v; }
      this.pmin[b] = lo; this.pmax[b] = hi;
    }
    this.cacheKey = '';
  }

  /** Ventana visible [v0, v1] (fracción del sample) para un zoom centrado en `center`. */
  static window(center: number, zoom: number): [number, number] {
    const w = 1 / zoom;
    let v0 = center - w / 2;
    if (v0 < 0) v0 = 0;
    if (v0 + w > 1) v0 = 1 - w;
    return [v0, v0 + w];
  }

  private renderWave(w: number, h: number, v0: number, v1: number) {
    if (!this.cache) this.cache = document.createElement('canvas');
    const cv = this.cache;
    cv.width = w; cv.height = h;
    const g = cv.getContext('2d')!;
    g.fillStyle = C.bg; g.fillRect(0, 0, w, h);
    g.strokeStyle = C.grid; g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
    const d = this.data;
    if (!d) return;
    const n = d.length, s0 = v0 * n, spp = ((v1 - v0) * n) / w, mid = h / 2, amp = h * 0.46;
    g.fillStyle = C.wave;
    for (let x = 0; x < w; x++) {
      const a = Math.floor(s0 + x * spp), b = Math.min(n, Math.max(a + 1, Math.floor(s0 + (x + 1) * spp)));
      let lo = 1, hi = -1;
      if (spp >= PEAK_BLOCK * 2) {
        for (let k = Math.floor(a / PEAK_BLOCK); k <= Math.floor((b - 1) / PEAK_BLOCK); k++) {
          if (this.pmin[k] < lo) lo = this.pmin[k];
          if (this.pmax[k] > hi) hi = this.pmax[k];
        }
      } else {
        for (let i = a; i < b; i++) { const v = d[i]; if (v < lo) lo = v; if (v > hi) hi = v; }
      }
      if (lo > hi) continue;
      const y0 = mid - hi * amp, y1 = mid - lo * amp;
      g.fillRect(x, y0, 1, Math.max(1, y1 - y0));
    }
  }

  draw(
    g: CanvasRenderingContext2D, w: number, h: number, v0: number, v1: number,
    position: number, scanDist: number, scanOn: boolean, tel: Telemetry | null, version: number,
  ) {
    const key = `${w}|${h}|${v0.toFixed(6)}|${v1.toFixed(6)}|${version}`;
    if (key !== this.cacheKey) { this.renderWave(w, h, v0, v1); this.cacheKey = key; }
    g.drawImage(this.cache!, 0, 0);
    const X = (f: number) => ((f - v0) / (v1 - v0)) * w;

    // Zona que recorre Scan (desde Position hasta Position + Distance, con wrap).
    if (scanOn && scanDist !== 0) {
      g.fillStyle = 'rgba(255,176,0,0.10)';
      const a = Math.min(position, position + scanDist), b = Math.max(position, position + scanDist);
      for (const sh of [-1, 0, 1]) {
        const xa = X(Math.max(0, a + sh)), xb = X(Math.min(1, b + sh));
        if (xb > xa) g.fillRect(xa, 0, xb - xa, h);
      }
    }

    if (tel) {
      // Granos: canal izquierdo arriba, derecho abajo; la opacidad sigue la envolvente del grano.
      const gr = tel.grains;
      for (let i = 0; i < gr.length; i += 3) {
        const x = X(gr[i]);
        if (x < 0 || x > w) continue;
        const right = gr[i + 2] > 0.5;
        g.fillStyle = right ? C.accent2 : C.accent;
        g.globalAlpha = Math.min(1, 0.15 + gr[i + 1] * 0.85);
        g.fillRect(x - 1.5, right ? h / 2 + 2 : h * 0.06, 3, h * 0.44 - 2);
      }
      g.globalAlpha = 1;
      // Playhead de cada voz.
      g.fillStyle = C.text;
      for (let i = 0; i < tel.heads.length; i++) g.fillRect(X(tel.heads[i]) - 0.5, 0, 1, h);
    }

    // Marcador de Position.
    const px = X(position);
    g.fillStyle = C.accent;
    g.fillRect(px - 1.5, 0, 3, h);
    g.beginPath(); g.moveTo(px - 9, 0); g.lineTo(px + 9, 0); g.lineTo(px, 12); g.closePath(); g.fill();
  }
}
