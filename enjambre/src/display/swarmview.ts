// Display de Enjambre: motor y variación, la rejilla del tempo, la entrada de los últimos 8 s y las
// cabezas que la están leyendo (a la derecha, ahora; hacia la izquierda, el pasado; arriba, más rápido).
import { ENGINE_INFO, ENGINES, HIST_SECONDS, VARIATION_INFO, VARIATIONS, type Telemetry } from '../shared/params';
import { C } from './theme';

type G = CanvasRenderingContext2D;

export interface SwarmInfo {
  engine: number;
  variation: number;
  time: string;
  bpm: number;
  midiClock: boolean;
  hold: boolean;
  bypass: boolean;
  inputOn: boolean;
}

let inLevel = 0, outLevel = 0;

export function drawSwarmView(g: G, w: number, h: number, info: SwarmInfo, tel: Telemetry | null) {
  g.fillStyle = C.panel; g.fillRect(0, 0, w, h);
  const small = h < 190, narrow = w < 420;
  const meterW = 34, pad = 12;
  const gx = pad, gw = w - pad * 2 - meterW - 8;
  const top = small ? 46 : 70, gh = h - top - 14;

  // --- Cabecera: motor, variación y tempo ---
  g.textBaseline = 'top';
  g.fillStyle = C.accent;
  g.font = `800 ${small ? 22 : 30}px system-ui, sans-serif`;
  const title = `${ENGINES[info.engine]} ${VARIATIONS[info.variation]}`;
  g.fillText(title, gx, small ? 8 : 10);
  const tw = g.measureText(title).width;
  g.font = '600 13px system-ui, sans-serif';
  g.fillStyle = C.text;
  const line = `${info.time} · ${info.bpm.toFixed(1)} BPM${info.midiClock ? ' · MIDI clock' : ''}`;
  if (!narrow) g.fillText(line, gx + tw + 14, small ? 14 : 20);
  g.fillStyle = C.dim;
  if (!small) g.fillText(`${ENGINE_INFO[info.engine]} · ${VARIATION_INFO[info.engine][info.variation]}`, gx, 46);
  else if (narrow) g.fillText(line, gx + tw + 10, 14);
  // Estados a la derecha.
  const flags = [info.hold ? 'HOLD' : '', info.bypass ? 'BYPASS' : ''].filter(Boolean).join('  ');
  if (flags) {
    g.fillStyle = info.bypass ? C.hot : C.accent2;
    g.font = '700 13px system-ui, sans-serif';
    g.fillText(flags, gx + gw - g.measureText(flags).width, small ? 14 : 20);
  }

  // --- Rejilla: cuatro puntos, el del paso actual encendido ---
  if (tel) {
    for (let k = 0; k < 4; k++) {
      g.fillStyle = tel.step % 4 === k ? C.accent : C.grid;
      g.fillRect(gx + gw - 4 * 14 + k * 14, small ? 34 : 50, 10, 4);
    }
  }

  // --- Entrada de los últimos segundos ---
  g.fillStyle = C.bg; g.fillRect(gx, top, gw, gh);
  if (tel) {
    const hist = tel.hist, n = hist.length, bw = gw / n, mid = top + gh / 2;
    g.fillStyle = info.hold ? C.accent2 : C.wave;
    g.globalAlpha = 0.55;
    for (let i = 0; i < n; i++) {
      const v = Math.min(1, hist[i] * 1.5), bh = v * gh * 0.9;
      if (bh > 0.5) g.fillRect(gx + i * bw, mid - bh / 2, Math.max(1, bw - 0.5), bh);
    }
    g.globalAlpha = 1;
    // --- Cabezas: dónde lee cada una (antigüedad) y a qué velocidad (altura) ---
    const hd = tel.heads;
    for (let i = 0; i + 2 < hd.length; i += 3) {
      const age = hd[i], lv = Math.min(1, hd[i + 1]), rate = hd[i + 2];
      if (age < 0 || age > HIST_SECONDS) continue;
      const x = gx + gw - (age / HIST_SECONDS) * gw;
      // log2 de la velocidad: 4x arriba, 1/4x abajo.
      const r = Math.max(-2, Math.min(2, Math.log2(Math.abs(rate) || 1)));
      const y = mid - (r / 2) * (gh / 2 - 10);
      g.globalAlpha = 0.25 + 0.75 * lv;
      g.fillStyle = C.accent;
      g.beginPath(); g.arc(x, y, 3 + lv * 5, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
  }
  if (!info.inputOn) {
    g.fillStyle = C.dim; g.font = '600 13px system-ui, sans-serif';
    const t = 'Entrada apagada · pulsa I/O, o Probar para oírlo';
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
