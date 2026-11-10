// Parámetros que el dispositivo de Max for Live expone a Ableton Live, agrupados en bancos de 8
// (los mismos que las páginas de la interfaz). De aquí sale max/params.json, que usa
// max/build_device.py para crear un live.dial por parámetro y definir los bancos.
import { pdef, toNorm, fromNorm, type ParamDef } from './params';

/** [id del parámetro, nombre que se ve en Live y en el controlador]. null = hueco. */
type Entry = [string, string] | null;

const oscBank = (n: number): Entry[] => [
  [`o${n}Table`, `O${n} Table`], [`o${n}Pos`, `O${n} Position`], [`o${n}Fx`, `O${n} FX Type`], [`o${n}Fx1`, `O${n} FX 1`],
  [`o${n}Fx2`, `O${n} FX 2`], [`o${n}Semi`, `O${n} Semi`], [`o${n}Fine`, `O${n} Fine`], [`o${n}Level`, `O${n} Level`],
];
const envBank = (n: number): Entry[] => [
  [`e${n}A`, `E${n} Attack`], [`e${n}D`, `E${n} Decay`], [`e${n}S`, `E${n} Sustain`], [`e${n}R`, `E${n} Release`],
  [`e${n}Key`, `E${n} Key`], null, null, null,
];
const lfoBank = (n: number): Entry[] => [
  [`lfo${n}Mode`, `L${n} Mode`], [`lfo${n}Rate`, `L${n} Rate`], [`lfo${n}Shape`, `L${n} Shape`], [`lfo${n}Amount`, `L${n} Amount`],
  [`lfo${n}Stereo`, `L${n} Stereo`], [`lfo${n}Quant`, `L${n} Quant`], [`lfo${n}Phase`, `L${n} Phase`], [`lfo${n}RandPhase`, `L${n} Rnd Phase`],
];

export const MAX_BANKS: { name: string; params: Entry[] }[] = [
  { name: 'Osc 1', params: oscBank(1) },
  { name: 'Osc 2', params: oscBank(2) },
  { name: 'Mezcla', params: [
    ['subLevel', 'Sub Level'], ['subOct', 'Sub Octave'], ['subTone', 'Sub Tone'], ['uniMode', 'Unison Mode'],
    ['uniVoices', 'Unison Voices'], ['uniAmt', 'Unison Amount'], ['oscSpread', 'Osc Stereo'], ['volume', 'Volume'],
  ] },
  { name: 'Filtro', params: [
    ['filterOn', 'Filter On'], ['filterMode', 'Filter Type'], ['filterFreq', 'Filter Freq'], ['filterRes', 'Filter Reso'],
    ['filterWidth', 'Filter Width'], null, null, null,
  ] },
  { name: 'Env 1', params: envBank(1) },
  { name: 'Env 2', params: envBank(2) },
  { name: 'Env 3', params: envBank(3) },
  { name: 'LFO 1', params: lfoBank(1) },
  { name: 'LFO 2', params: lfoBank(2) },
  { name: 'Nota', params: [
    ['transpose', 'Transpose'], ['pbRange', 'PB Range'], ['mono', 'Mono'], ['glide', 'Glide'],
    ['bpm', 'BPM'], ['lfoModWheel', 'L1 ModWheel'], null, null,
  ] },
  { name: 'LFO Sync', params: [
    ['lfo1Div', 'L1 Sync'], ['lfo1Audio', 'L1 Audio Rate'], ['lfo2Div', 'L2 Sync'], ['lfo2Audio', 'L2 Audio Rate'],
    null, null, null, null,
  ] },
];

export const MAX_PARAM_IDS = new Set(MAX_BANKS.flatMap((b) => b.params.filter((p) => p).map((p) => p![0])));

/** Listas, interruptores y enteros viajan con su valor real; el resto, como 0–100 % del recorrido. */
const discrete = (d: ParamDef) => d.curve === 'enum' || d.curve === 'bool' || d.curve === 'int';

/** Valor de Tablas → valor del live.dial. */
export function toMax(d: ParamDef, v: number): number {
  if (d.curve === 'int') return Math.round(v);
  return discrete(d) ? Math.round(v - d.min) : Math.round(toNorm(d, v) * 10000) / 100;
}
/** Valor del live.dial → valor de Tablas. */
export function fromMax(d: ParamDef, x: number): number {
  if (d.curve === 'int') return Math.round(x);
  return discrete(d) ? d.min + Math.round(x) : fromNorm(d, x / 100);
}

/** Descripción que consume max/build_device.py. */
export function maxParamsJson() {
  return MAX_BANKS.map((b) => ({
    name: b.name,
    params: b.params.map((p) => {
      if (!p) return null;
      const d = pdef(p[0]);
      const options = d.curve === 'enum' ? d.options! : d.curve === 'bool' ? ['Off', 'On'] : null;
      const range = d.curve === 'int' ? [d.min, d.max] : null;
      return { id: p[0], name: p[1], options, range, initial: toMax(d, d.def) };
    }),
  }));
}
