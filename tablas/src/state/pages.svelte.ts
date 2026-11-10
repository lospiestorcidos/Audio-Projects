// Definición de las páginas de 8 controles. La comparten las dos interfaces y el controlador MIDI
// (el knob físico n mueve el control n de la página activa).
import { MOD_TABLE, type SourceId } from '../shared/params';
import { modDest, val } from './store.svelte';

export type Slot = { id: string; label?: string; off?: boolean } | null;
const S = (id: string, label?: string, off = false): Slot => ({ id, label, off });

export const PAGES = [
  { id: 'osc1', title: 'Osc 1' }, { id: 'osc2', title: 'Osc 2' }, { id: 'mix', title: 'Mezcla' },
  { id: 'filter', title: 'Filtro' }, { id: 'env1', title: 'Env 1' }, { id: 'env2', title: 'Env 2' },
  { id: 'env3', title: 'Env 3' }, { id: 'lfo1', title: 'LFO 1' }, { id: 'lfo2', title: 'LFO 2' },
  { id: 'note', title: 'Nota' }, { id: 'mod', title: 'Mod' }, { id: 'tables', title: 'Tablas' },
];

/** Destino de modulación que muestra la página Mod. */
export function pageModDest(): string {
  return MOD_TABLE[modDest()] ? modDest() : 'o1Pos';
}

/** Nombre de los dos controles del efecto del oscilador, según el efecto elegido. */
const FX_LABELS = [['FX 1', 'FX 2'], ['FM Cant.', 'FM Tono'], ['Ancho', 'Sync'], ['Warp', 'Fold']];

function oscPage(n: number): Slot[] {
  const o = `o${n}`, fx = Math.round(val(`${o}Fx`));
  return [
    S(`${o}Table`), S(`${o}Pos`), S(`${o}Fx`), S(`${o}Fx1`, FX_LABELS[fx][0], fx === 0),
    S(`${o}Fx2`, FX_LABELS[fx][1], fx === 0), S(`${o}Semi`), S(`${o}Fine`), S(`${o}Level`),
  ];
}
function lfoPage(n: number): Slot[] {
  const l = `lfo${n}`, mode = Math.round(val(`${l}Mode`));
  return [
    S(`${l}Mode`), S([`${l}Rate`, `${l}Div`, `${l}Audio`][mode], 'Rate'), S(`${l}Shape`), S(`${l}Amount`),
    S(`${l}Stereo`), S(`${l}Quant`), S(`${l}Phase`), S(`${l}RandPhase`, 'Fase aleat.'),
  ];
}
const envPage = (n: number): Slot[] =>
  [S(`e${n}A`), S(`e${n}D`), S(`e${n}S`), S(`e${n}R`), S(`e${n}Key`), null, null, null];

/** Los 8 controles de una página (null = hueco). Los que no aplican ahora mismo van con off. */
export function slotsFor(page: string): Slot[] {
  switch (page) {
    case 'osc1': return oscPage(1);
    case 'osc2': return oscPage(2);
    case 'mix': {
      const solo = val('uniVoices') < 2;
      return [
        S('subLevel'), S('subOct'), S('subTone', undefined, val('subLevel') <= 0), S('uniMode', undefined, solo),
        S('uniVoices'), S('uniAmt', undefined, solo), S('oscSpread'), S('volume'),
      ];
    }
    case 'filter': return [
      S('filterOn', 'Filtro'), S('filterMode', 'Tipo'), S('filterFreq', 'Freq'), S('filterRes', 'Reso'),
      S('filterWidth'), null, null, null,
    ];
    case 'env1': return envPage(1);
    case 'env2': return envPage(2);
    case 'env3': return envPage(3);
    case 'lfo1': return lfoPage(1);
    case 'lfo2': return lfoPage(2);
    case 'note': return [
      S('transpose'), S('pbRange'), S('mono'), S('glide', undefined, val('mono') < 0.5),
      S('bpm'), S('lfoModWheel', 'Mod Wheel'), null, null,
    ];
    case 'mod': {
      const dest = pageModDest();
      const out: Slot[] = (Object.keys(MOD_TABLE[dest]) as SourceId[]).map((s) => S(`${dest}>${s}`));
      while (out.length < 8) out.push(null);
      return out;
    }
    default: return [];
  }
}
