// Display de Ecos: el tiempo de retardo en grande, el historial del sonido con efecto (con una
// marca en cada repetición) y los medidores de entrada y salida.
import { HIST_SECONDS, type Telemetry } from '../shared/params';
import { C } from './theme';

type G = CanvasRenderingContext2D;

export interface DelayInfo {
  /** Tiempo objetivo en segundos y su texto (p. ej. "1/8." o "375 ms"). */
  seconds: number;
  label: string;
  bpm: number;
  sync: boolean;
  /** Estado del reloj: 'midi' si está llegando MIDI clock, 'manual' si no. */
  clock: 'midi' | 'manual';
  feedback: number;
  frozen: boolean;
  inputOn: boolean;
}

// Medidores con caída suave entre telemetrías.
let inLevel = 0, outLevel = 0;

export function drawDelayView(g: G, w: number, h: number, info: DelayInfo, tel: Telemetry | null) {
  g.fillStyle = C.panel; g.fillRect(0, 0, w, h);
  const small = h < 190;
  const meterW = 34, pad = 12;
  const gx = pad, gw = w - pad * 2 - meterW - 8;
  const top = small ? 44 : 64, gh = h - top - 14;

  // --- Texto: tiempo, tempo y estado ---
  g.textBaseline = 'top';
  g.fillStyle = C.accent;
  g.font = `800 ${small ? 24 : 34}px system-ui, sans-serif`;
  g.fillText(info.label, gx, small ? 8 : 12);
  const lw = g.measureText(info.label).width;
  g.font = '600 13px system-ui, sans-serif';
  g.fillStyle = C.text;
  const ms = info.seconds < 1 ? `${Math.round(info.seconds * 1000)} ms` : `${info.seconds.toFixed(2)} s`;
  const parts = [info.sync ? ms : '', `${info.bpm.toFixed(1)} BPM`, info.clock === 'midi' ? 'MIDI clock' : ''];
  g.fillText(parts.filter(Boolean).join('  ·  '), gx + lw + 14, small ? 16 : 26);
  if (info.frozen) {
    g.fillStyle = C.accent2;
    g.fillText('FREEZE', gx + gw - g.measureText('FREEZE').width, small ? 16 : 26);
  }

  // --- Historial: a la derecha, ahora; hacia la izquierda, el pasado ---
  g.fillStyle = C.bg; g.fillRect(gx, top, gw, gh);
  // Una marca por repetición, cada vez más tenue según el Feedback.
  const delay = tel ? tel.delay : info.seconds;
  const fb = info.frozen ? 1 : Math.min(1, info.feedback);
  g.fillStyle = C.accent;
  for (let n = 1, a = 1; n <= 64; n++, a *= fb) {
    const x = gx + gw - (n * delay / HIST_SECONDS) * gw;
    if (x < gx || a < 0.04) break;
    g.globalAlpha = 0.15 + 0.6 * a;
    g.fillRect(x - 1, top, 2, gh);
  }
  g.globalAlpha = 1;
  if (tel) {
    const hist = tel.hist, n = hist.length, bw = gw / n;
    g.fillStyle = info.frozen ? C.accent2 : C.wave;
    for (let i = 0; i < n; i++) {
      const v = Math.min(1, hist[i] * 1.6), bh = v * gh * 0.94;
      if (bh > 0.5) g.fillRect(gx + i * bw, top + (gh - bh) / 2, Math.max(1, bw - 1), bh);
    }
  }
  if (!info.inputOn) {
    g.fillStyle = C.dim; g.font = '600 13px system-ui, sans-serif';
    const t = 'Entrada apagada · pulsa I/O, o Probar para oír el efecto';
    if (g.measureText(t).width < gw - 16) g.fillText(t, gx + 8, top + gh - 22);
  }

  // --- Medidores de entrada y salida ---
  inLevel = Math.max(tel ? tel.inPeak : 0, inLevel * 0.9);
  outLevel = Math.max(tel ? tel.outPeak : 0, outLevel * 0.9);
  const mx = gx + gw + 8, mw = (meterW - 4) / 2;
  [[inLevel, 'IN'], [outLevel, 'OUT']].forEach(([lv, name], i) => {
    const x = mx + i * (mw + 4), v = Math.min(1, lv as number);
    g.fillStyle = C.bg; g.fillRect(x, top, mw, gh);
    g.fillStyle = v > 0.95 ? C.hot : i === 0 ? C.accent2 : C.accent;
    g.fillRect(x, top + gh * (1 - v), mw, gh * v);
    g.fillStyle = C.dim; g.font = '600 9px system-ui, sans-serif';
    g.fillText(name as string, x, top - 12);
  });
}
