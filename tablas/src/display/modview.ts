// Dibujo de envolventes, LFO y respuesta del filtro.
import { filterMagnitude } from '../audio/worklet/filter';
import { Lfo } from '../audio/worklet/lfo';
import type { Telemetry } from '../shared/params';
import { C } from './theme';

type G = CanvasRenderingContext2D;
type Get = (id: string) => number;

function frame(g: G, x: number, y: number, w: number, h: number, title: string, active: boolean) {
  g.fillStyle = C.panel;
  g.fillRect(x, y, w, h);
  g.strokeStyle = active ? C.accent : C.grid;
  g.lineWidth = active ? 2 : 1;
  g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  g.fillStyle = active ? C.accent : C.dim;
  g.font = '600 13px system-ui, sans-serif';
  g.textBaseline = 'top';
  g.fillText(title, x + 10, y + 8);
}

/** ADSR con el eje de tiempo comprimido (t^0.35) para que quepan tiempos de ms a minutos. */
function envPath(g: G, x: number, y: number, w: number, h: number, a: number, d: number, s: number, r: number, color: string) {
  const k = (t: number) => Math.pow(t, 0.35);
  const wa = k(a), wd = k(d), ws = 0.8, wr = k(r), tot = wa + wd + ws + wr;
  const X = (u: number) => x + (u / tot) * w, Y = (v: number) => y + h - v * h;
  g.strokeStyle = color; g.lineWidth = 2.5; g.beginPath();
  g.moveTo(X(0), Y(0));
  for (let i = 1; i <= 20; i++) { const u = i / 20; g.lineTo(X(wa * u), Y((1 - Math.exp(-u * 1.466)) * 1.3)); }
  for (let i = 1; i <= 24; i++) { const u = i / 24; g.lineTo(X(wa + wd * u), Y(s + (1 - s) * Math.exp(-u * 6.9))); }
  g.lineTo(X(wa + wd + ws), Y(s));
  for (let i = 1; i <= 24; i++) { const u = i / 24; g.lineTo(X(wa + wd + ws + wr * u), Y(s * Math.exp(-u * 6.9))); }
  g.stroke();
}

function drawEnvs(g: G, x: number, y: number, w: number, h: number, get: Get, tel: Telemetry | null, sel: string) {
  frame(g, x, y, w, h, w < 300 ? 'ENV 1 · 2 · 3' : 'ENV 1 · amplitud     ENV 2 · ENV 3', sel.startsWith('env'));
  const ix = x + 14, iy = y + 34, iw = w - 54, ih = h - 48;
  const colors = [C.accent, C.accent2, C.accent3];
  // La envolvente del parámetro tocado se dibuja la última (encima de las otras).
  const order = [2, 1, 0].sort((a, b) => Number(sel === `env${a + 1}`) - Number(sel === `env${b + 1}`));
  for (const e of order) {
    const n = e + 1;
    envPath(g, ix, iy, iw, ih, get(`e${n}A`), get(`e${n}D`), get(`e${n}S`), get(`e${n}R`), colors[e]);
  }
  if (tel) {
    // Nivel en vivo de la voz más reciente.
    for (let e = 0; e < 3; e++) {
      const v = tel.mod[2 + e];
      g.fillStyle = colors[e]; g.fillRect(x + w - 34 + e * 9, iy + ih - v * ih, 7, v * ih);
    }
  }
}

const lfo = new Lfo();
function drawLfo(g: G, x: number, y: number, w: number, h: number, get: Get, tel: Telemetry | null, sel: string) {
  // Se muestra el LFO del parámetro tocado (LFO 1 si no es ninguno).
  const n = sel === 'lfo2' ? 2 : 1, p = `lfo${n}`;
  frame(g, x, y, w, h, `LFO ${n} · L / R`, sel === 'lfo1' || sel === 'lfo2');
  const ix = x + 14, iy = y + 34, iw = w - 44, ih = h - 48, mid = iy + ih / 2;
  g.strokeStyle = C.grid; g.lineWidth = 1;
  g.beginPath(); g.moveTo(ix, mid); g.lineTo(ix + iw, mid); g.stroke();
  const shape = get(`${p}Shape`), stereo = get(`${p}Stereo`), quant = get(`${p}Quant`), amt = get(`${p}Amount`);
  const steps = Math.max(60, Math.floor(iw / 2)), cycles = shape >= 5 ? 8 : 2;
  const ys = [new Float32Array(steps), new Float32Array(steps)];
  lfo.reset(get(`${p}Phase`), 4242);
  for (let i = 0; i < steps; i++) {
    lfo.tick(i === 0 ? 0 : cycles / steps, shape, stereo, quant);
    ys[0][i] = lfo.out[0]; ys[1][i] = lfo.out[1];
  }
  for (const c of [1, 0]) {
    g.strokeStyle = c ? C.accent2 : C.accent; g.lineWidth = 2.5; g.beginPath();
    for (let i = 0; i < steps; i++) {
      const px = ix + (i / (steps - 1)) * iw, py = mid - ys[c][i] * amt * ih * 0.48;
      if (i) g.lineTo(px, py); else g.moveTo(px, py);
    }
    g.stroke();
  }
  if (tel) {
    const v = tel.mod[4 + n];
    g.fillStyle = C.text; g.fillRect(x + w - 20, mid - v * ih * 0.48 - 3, 9, 6);
  }
}

function drawFilter(g: G, x: number, y: number, w: number, h: number, get: Get, sel: string) {
  const on = get('filterOn') >= 0.5;
  frame(g, x, y, w, h, on ? 'FILTRO' : 'FILTRO · apagado', sel === 'filter');
  const ix = x + 14, iy = y + 34, iw = w - 28, ih = h - 48;
  const DB_TOP = 24, DB_BOT = -48;
  const Y = (db: number) => iy + ((DB_TOP - db) / (DB_TOP - DB_BOT)) * ih;
  g.strokeStyle = C.grid; g.lineWidth = 1;
  g.beginPath(); g.moveTo(ix, Y(0)); g.lineTo(ix + iw, Y(0));
  for (const f of [100, 1000, 10000]) {
    const fx = ix + (Math.log(f / 20) / Math.log(1000)) * iw;
    g.moveTo(fx, iy); g.lineTo(fx, iy + ih);
  }
  g.stroke();
  const mode = get('filterMode'), freq = get('filterFreq'), res = get('filterRes'), width = get('filterWidth');
  g.strokeStyle = on ? C.accent : C.dim; g.lineWidth = 2.5; g.beginPath();
  for (let i = 0; i <= iw; i += 2) {
    const f = 20 * Math.pow(1000, i / iw);
    const db = Math.max(DB_BOT, Math.min(DB_TOP, 20 * Math.log10(filterMagnitude(mode, freq, res, width, f) + 1e-9)));
    if (i) g.lineTo(ix + i, Y(db)); else g.moveTo(ix + i, Y(db));
  }
  g.stroke();
}

/**
 * Vista de moduladores: envolventes, LFO y filtro. `sel` = grupo del parámetro tocado (se resalta).
 * Con `single` (pantallas pequeñas) se dibuja solo el panel de ese grupo, a todo el ancho.
 */
export function drawModView(g: G, w: number, h: number, get: Get, tel: Telemetry | null, sel: string, single = false) {
  g.fillStyle = C.bg; g.fillRect(0, 0, w, h);
  if (single) {
    if (sel === 'lfo1' || sel === 'lfo2') drawLfo(g, 0, 0, w, h, get, tel, sel);
    else if (sel === 'filter') drawFilter(g, 0, 0, w, h, get, sel);
    else drawEnvs(g, 0, 0, w, h, get, tel, sel);
    return;
  }
  const gap = 8, pw = (w - gap * 2) / 3;
  drawEnvs(g, 0, 0, pw, h, get, tel, sel);
  drawLfo(g, pw + gap, 0, pw, h, get, tel, sel);
  drawFilter(g, (pw + gap) * 2, 0, pw, h, get, sel);
}
