// Parámetros que el dispositivo de Max for Live expone a Ableton Live, agrupados en bancos de 8
// (los mismos que las páginas de la interfaz). De aquí sale max/params.json, que usa
// max/build_device.py para crear un live.dial por parámetro y definir los bancos.
import { pdef, toNorm, fromNorm, type ParamDef } from './params';

/** [id del parámetro, nombre que se ve en Live y en el controlador]. "" = hueco. */
type Entry = [string, string] | null;

export const MAX_BANKS: { name: string; params: Entry[] }[] = [
  { name: 'Grano', params: [
    ['mode', 'Modo'], ['position', 'Position'], ['size', 'Grain Size'], ['shape', 'Shape'],
    ['reverse', 'Reverse'], ['density', 'Density'], ['spread', 'Spread'], ['volume', 'Volume'],
  ] },
  { name: 'Nota', params: [
    ['transpose', 'Transpose'], ['tune', 'Tune'], ['pbRange', 'PB Range'], ['mono', 'Mono'],
    ['glide', 'Glide'], ['scanSpeed', 'Scan Speed'], ['scanDist', 'Scan Dist'], ['scanLoop', 'Scan Loop'],
  ] },
  { name: 'Variacion', params: [
    ['variation', 'Var Amount'], ['varPos', 'Var Position'], ['varSize', 'Var Size'], ['varPitch', 'Var Transp'],
    ['varVol', 'Var Volume'], null, null, null,
  ] },
  { name: 'Filtro', params: [
    ['filterOn', 'Filter On'], ['filterMode', 'Filter Type'], ['filterFreq', 'Filter Freq'], ['filterRes', 'Filter Reso'],
    ['filterWidth', 'Filter Width'], null, null, null,
  ] },
  { name: 'Env 1', params: [
    ['e1A', 'E1 Attack'], ['e1D', 'E1 Decay'], ['e1S', 'E1 Sustain'], ['e1R', 'E1 Release'], ['e1Key', 'E1 Key'],
    null, null, null,
  ] },
  { name: 'Env 2', params: [
    ['e2A', 'E2 Attack'], ['e2D', 'E2 Decay'], ['e2S', 'E2 Sustain'], ['e2R', 'E2 Release'], ['e2Key', 'E2 Key'],
    null, null, null,
  ] },
  { name: 'LFO 1', params: [
    ['lfoMode', 'LFO Mode'], ['lfoRate', 'LFO Rate'], ['lfoShape', 'LFO Shape'], ['lfoAmount', 'LFO Amount'],
    ['lfoStereo', 'LFO Stereo'], ['lfoQuant', 'LFO Quant'], ['lfoPhase', 'LFO Phase'], ['lfoRandPhase', 'LFO Rnd Phase'],
  ] },
  { name: 'LFO 2', params: [
    ['bpm', 'BPM'], ['lfoModWheel', 'LFO ModWheel'], ['lfoDiv', 'LFO Sync'], ['lfoAudio', 'LFO Audio Rate'],
    null, null, null, null,
  ] },
];

export const MAX_PARAM_IDS = new Set(MAX_BANKS.flatMap((b) => b.params.filter((p) => p).map((p) => p![0])));

const stepped = (d: ParamDef) => d.curve === 'enum' || d.curve === 'bool';

/** Valor de Granos → valor del live.dial: índice en listas e interruptores, 0–100 % en el resto. */
export function toMax(d: ParamDef, v: number): number {
  return stepped(d) ? Math.round(v - d.min) : Math.round(toNorm(d, v) * 10000) / 100;
}
/** Valor del live.dial → valor de Granos. */
export function fromMax(d: ParamDef, x: number): number {
  return stepped(d) ? d.min + Math.round(x) : fromNorm(d, x / 100);
}

/** Descripción que consume max/build_device.py. */
export function maxParamsJson() {
  return MAX_BANKS.map((b) => ({
    name: b.name,
    params: b.params.map((p) => {
      if (!p) return null;
      const d = pdef(p[0]);
      const options = d.curve === 'enum' ? d.options! : d.curve === 'bool' ? ['Off', 'On'] : null;
      return { id: p[0], name: p[1], options, initial: toMax(d, d.def) };
    }),
  }));
}
