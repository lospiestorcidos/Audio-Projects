// Samples de fábrica generados por código (la app no incluye grabaciones).
// Se sintetizan al pedirlos, así funcionan offline y no ocupan espacio.
import type { LoadedSample } from './host';

const SR = 48000;
const TAU = Math.PI * 2;
const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

/** Aleatorio determinista: el mismo sample en cada arranque. */
function rng(seed: number) {
  let s = seed;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

/** Acordes de sierras desafinadas con paso bajo: material clásico para granular. */
function cuerdas(): Float32Array[] {
  const n = SR * 8, L = new Float32Array(n), R = new Float32Array(n);
  const chords = [[48, 55, 60, 64, 67], [45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [43, 50, 55, 59, 62]];
  const r = rng(11);
  chords.forEach((ch, ci) => {
    const start = ci * 2 * SR, dur = 2.4 * SR;
    for (const m of ch) for (let d = 0; d < 3; d++) {
      const f = mtof(m) * (1 + (d - 1) * 0.004), pan = r();
      let ph = r(), lp = 0;
      for (let i = 0; i < dur && start + i < n; i++) {
        ph += f / SR; if (ph >= 1) ph -= 1;
        const env = Math.min(1, i / (0.3 * SR)) * Math.min(1, (dur - i) / (0.5 * SR));
        lp += (2 * ph - 1 - lp) * 0.12;
        L[start + i] += lp * env * (1 - pan); R[start + i] += lp * env * pan;
      }
    }
  });
  return [L, R];
}

/** Campanas FM en escala pentatónica. */
function campanas(): Float32Array[] {
  const n = SR * 8, L = new Float32Array(n), R = new Float32Array(n);
  const scale = [60, 62, 65, 67, 69, 72, 74, 77, 79, 84], r = rng(23);
  for (let k = 0; k < 28; k++) {
    const start = Math.floor(r() * (n - SR * 2)), f = mtof(scale[Math.floor(r() * scale.length)]);
    const pan = r(), amp = 0.3 + r() * 0.7, ratio = [1.4, 2.76, 3.5][Math.floor(r() * 3)];
    for (let i = 0; i < SR * 2.5 && start + i < n; i++) {
      const t = i / SR, env = Math.exp(-t * 2.2);
      const s = Math.sin(TAU * f * t + 3 * Math.exp(-t * 4) * Math.sin(TAU * f * ratio * t)) * env * amp;
      L[start + i] += s * (1 - pan); R[start + i] += s * pan;
    }
  }
  return [L, R];
}

/** Voz sintética: pulso glotal por tres resonadores, recorriendo las vocales A-E-I-O-U. */
function voz(): Float32Array[] {
  const n = SR * 6, out = new Float32Array(n);
  const vowels = [[800, 1150, 2900], [400, 1700, 2600], [300, 2300, 3000], [450, 800, 2830], [325, 700, 2700]];
  const st = [0, 0, 0, 0, 0, 0];
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n, x = t * (vowels.length - 1), vi = Math.min(vowels.length - 2, Math.floor(x)), fr = x - vi;
    const f0 = 130 * (1 + 0.012 * Math.sin(TAU * 5.2 * i / SR)) * (1 + 0.15 * Math.sin(TAU * t));
    ph += f0 / SR; if (ph >= 1) ph -= 1;
    const src = (ph < 0.4 ? Math.sin(Math.PI * ph / 0.4) ** 2 : 0) - 0.2;
    let s = 0;
    for (let k = 0; k < 3; k++) {
      // Resonador paso banda de dos polos (SVF de Chamberlin).
      const fc = vowels[vi][k] + (vowels[vi + 1][k] - vowels[vi][k]) * fr;
      const g = 2 * Math.sin(Math.PI * fc / SR), q = 0.08;
      st[k * 2] += g * st[k * 2 + 1];
      const hp = src - st[k * 2] - q * st[k * 2 + 1];
      st[k * 2 + 1] += g * hp;
      s += st[k * 2 + 1] * [1, 0.6, 0.3][k];
    }
    out[i] = s * Math.min(1, i / 2000) * Math.min(1, (n - i) / 4000);
  }
  return [out];
}

/** Cuerda pulsada (Karplus-Strong) en arpegio. */
function pulsada(): Float32Array[] {
  const n = SR * 8, L = new Float32Array(n), R = new Float32Array(n), r = rng(37);
  const notes = [40, 47, 52, 56, 59, 64, 59, 56, 45, 52, 57, 61, 64, 69, 64, 61];
  notes.forEach((m, k) => {
    const start = Math.floor(k * 0.5 * SR), period = Math.round(SR / mtof(m));
    const line = new Float32Array(period);
    for (let i = 0; i < period; i++) line[i] = r() * 2 - 1;
    const pan = 0.3 + 0.4 * r();
    let idx = 0, prev = 0;
    for (let i = 0; i < SR * 3 && start + i < n; i++) {
      const cur = line[idx];
      line[idx] = (cur + prev) * 0.498;
      prev = cur;
      idx = (idx + 1) % period;
      L[start + i] += cur * (1 - pan); R[start + i] += cur * pan;
    }
  });
  return [L, R];
}

/** Textura de ruido: bandas resonantes que se mueven y chasquidos. */
function textura(): Float32Array[] {
  const n = SR * 6, L = new Float32Array(n), R = new Float32Array(n), r = rng(51);
  const s = [0, 0, 0, 0];
  for (let i = 0; i < n; i++) {
    const t = i / SR, noise = r() * 2 - 1;
    for (let c = 0; c < 2; c++) {
      const fc = 300 * Math.pow(2, 2.5 + 2.4 * Math.sin(TAU * (0.11 + c * 0.03) * t + c));
      const g = 2 * Math.sin(Math.PI * fc / SR);
      s[c * 2] += g * s[c * 2 + 1];
      s[c * 2 + 1] += g * (noise - s[c * 2] - 0.05 * s[c * 2 + 1]);
      (c ? R : L)[i] = s[c * 2 + 1] * (0.6 + 0.4 * Math.sin(TAU * 0.7 * t + c * 2));
    }
    if (r() < 0.0004) { const a = r(); L[i] += a * 6; R[i] += (1 - a) * 6; }
  }
  return [L, R];
}

const GENERATORS: Record<string, () => Float32Array[]> = {
  Cuerdas: cuerdas, Campanas: campanas, Voz: voz, Pulsada: pulsada, Textura: textura,
};
export const FACTORY_SAMPLES = Object.keys(GENERATORS);
const cache = new Map<string, Float32Array[]>();

export function factorySample(name: string): LoadedSample {
  const key = GENERATORS[name] ? name : FACTORY_SAMPLES[0];
  if (!cache.has(key)) cache.set(key, GENERATORS[key]());
  // Copia: el host normaliza in situ y puede transferir los buffers.
  return { name: key, ch: cache.get(key)!.map((c) => c.slice()), sr: SR };
}
