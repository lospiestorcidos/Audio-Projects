// Entrada MIDI. Dos vías:
//  - App nativa (Capacitor): plugin GranosMidi con CoreMIDI (USB, Bluetooth, red), con MPE.
//  - Navegadores con Web MIDI (Chrome de escritorio). Safari en iPad no lo tiene:
//    en modo PWA se toca con el teclado en pantalla.
import { registerPlugin, type PluginListenerHandle } from '@capacitor/core';
import { MidiByteStream, MidiParser, type MidiSink } from './parser';

interface GranosMidiPlugin {
  start(): Promise<{ sources: string[] }>;
  listSources(): Promise<{ sources: string[] }>;
  showBluetooth(): Promise<void>;
  addListener(event: 'midi', fn: (e: { bytes: number[] }) => void): Promise<PluginListenerHandle>;
  addListener(event: 'sources', fn: (e: { sources: string[] }) => void): Promise<PluginListenerHandle>;
}

export type MidiStatus = { kind: 'native' | 'web' | 'max' | 'none'; sources: string[] };

/** API que Max inyecta en las páginas cargadas dentro de [jweb~] (dispositivo de Max for Live). */
interface MaxApi {
  bindInlet(name: string, fn: (...args: number[]) => void): void;
  outlet(...args: unknown[]): void;
}
const maxApi = (): MaxApi | undefined => {
  const m = (window as unknown as { max?: MaxApi }).max;
  return m && typeof m.bindInlet === 'function' ? m : undefined;
};
/** true si la app corre dentro de un dispositivo de Max for Live. */
export const isMaxHost = (): boolean => !!maxApi();

export const isNative = (): boolean =>
  !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();

let native: GranosMidiPlugin | null = null;

export async function startMidi(sink: MidiSink, onStatus: (s: MidiStatus) => void): Promise<void> {
  const parser = new MidiParser(sink);

  // Dentro de Max for Live: el MIDI de la pista llega byte a byte con el mensaje "b <byte>".
  const bindMax = (): boolean => {
    const max = maxApi();
    if (!max) return false;
    const stream = new MidiByteStream(parser);
    max.bindInlet('b', (byte) => stream.push(byte));
    onStatus({ kind: 'max', sources: ['Pista de Ableton Live'] });
    max.outlet('ready', 1);
    return true;
  };
  if (bindMax()) return;
  // Por si Max inyecta su API después de cargar la página.
  let tries = 0;
  const retry = setInterval(() => { if (bindMax() || ++tries >= 5) clearInterval(retry); }, 1000);

  if (isNative()) {
    native = registerPlugin<GranosMidiPlugin>('GranosMidi');
    try {
      await native.addListener('midi', (e) => parser.feed(e.bytes));
      await native.addListener('sources', (e) => onStatus({ kind: 'native', sources: e.sources }));
      const r = await native.start();
      onStatus({ kind: 'native', sources: r.sources });
    } catch {
      onStatus({ kind: 'none', sources: [] });
    }
    return;
  }

  if (navigator.requestMIDIAccess) {
    try {
      const access = await navigator.requestMIDIAccess();
      const bind = () => {
        const names: string[] = [];
        access.inputs.forEach((inp) => {
          names.push(inp.name ?? 'MIDI');
          inp.onmidimessage = (e) => { const d = e.data; if (d && d.length >= 2) parser.message(d[0], d[1], d[2] ?? 0); };
        });
        onStatus({ kind: 'web', sources: names });
      };
      access.onstatechange = bind;
      bind();
      return;
    } catch { /* permiso denegado */ }
  }
  onStatus({ kind: 'none', sources: [] });
}

/** Abre el panel del sistema para emparejar dispositivos MIDI Bluetooth (solo app nativa). */
export function showBluetoothMidi() {
  void native?.showBluetooth();
}
