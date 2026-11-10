// Definición de las páginas de la interfaz de 8 controles. La comparten la pantalla y el
// controlador MIDI (el knob físico n mueve el control n de la página activa).
import { MOD_TABLE, type SourceId } from '../shared/params';
import { modDest, val } from './store.svelte';

export type Slot = { id: string; label?: string; off?: boolean } | null;
const S = (id: string, label?: string, off = false): Slot => ({ id, label, off });

export const PAGES = [
  { id: 'grain', title: 'Grano' }, { id: 'note', title: 'Nota' }, { id: 'var', title: 'Variación' },
  { id: 'filter', title: 'Filtro' }, { id: 'env1', title: 'Env 1' }, { id: 'env2', title: 'Env 2' },
  { id: 'lfo1', title: 'LFO 1' }, { id: 'lfo2', title: 'LFO 2' }, { id: 'mod', title: 'Mod' },
  { id: 'capture', title: 'Capture' },
];

/** Destino de modulación que muestra la página Mod. */
export function pageModDest(): string {
  return MOD_TABLE[modDest()] ? modDest() : 'position';
}

/** Los 8 controles de una página (null = hueco). Los que no aplican al modo actual van con off. */
export function slotsFor(page: string): Slot[] {
  const mode = Math.round(val('mode'));
  const lfoMode = Math.round(val('lfoMode'));
  switch (page) {
    case 'grain': return [
      S('mode'), S('position'), S('size', 'Size'), S('shape', undefined, mode === 2),
      S('reverse', undefined, mode !== 1), S('density', undefined, mode !== 2), S('spread'), S('volume'),
    ];
    case 'note': return [
      S('transpose'), S('tune'), S('pbRange', 'PB Range'), S('mono'),
      S('glide', undefined, val('mono') < 0.5), S('scanSpeed', 'Scan'), S('scanDist', 'Scan Dist'), S('scanLoop', 'Scan Loop'),
    ];
    case 'var': return [
      S('variation', 'Amount'), S('varPos', 'Position'), S('varSize', 'Size'), S('varPitch', 'Transp', mode !== 2),
      S('varVol', 'Volume'), null, null, null,
    ];
    case 'filter': return [
      S('filterOn', 'Filtro'), S('filterMode', 'Tipo'), S('filterFreq', 'Freq'), S('filterRes', 'Reso'),
      S('filterWidth'), null, null, null,
    ];
    case 'env1': return [S('e1A'), S('e1D'), S('e1S'), S('e1R'), S('e1Key'), null, null, null];
    case 'env2': return [S('e2A'), S('e2D'), S('e2S'), S('e2R'), S('e2Key'), null, null, null];
    case 'lfo1': return [
      S('lfoMode'), S(['lfoRate', 'lfoDiv', 'lfoAudio'][lfoMode], 'Rate'), S('lfoShape'), S('lfoAmount'),
      S('lfoStereo'), S('lfoQuant'), S('lfoPhase'), S('lfoRandPhase', 'Fase aleat.'),
    ];
    case 'lfo2': return [S('bpm', undefined, lfoMode !== 1), S('lfoModWheel', 'Mod Wheel'), null, null, null, null, null, null];
    case 'mod': {
      const dest = pageModDest();
      const out: Slot[] = (Object.keys(MOD_TABLE[dest]) as SourceId[]).map((s) => S(`${dest}>${s}`));
      while (out.length < 8) out.push(null);
      return out;
    }
    default: return [];
  }
}
