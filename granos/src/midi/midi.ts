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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bindInlet(name: string, fn: (...args: any[]) => void): void;
  outlet(...args: unknown[]): void;
}
const maxApi = (): MaxApi | undefined => {
  const m = (window as unknown as { max?: MaxApi }).max;
  return m && typeof m.bindInlet === 'function' ? m : undefined;
};
/** true si la app corre dentro de un dispositivo de Max for Live. */
/** La dirección lleva ?host=max cuando la carga el dispositivo de Max for Live. */
const maxRequested = (): boolean => {
  try { return new URLSearchParams(location.search).get('host') === 'max'; } catch { return false; }
};
export const isMaxHost = (): boolean => maxRequested() || !!maxApi();

/** Envía un mensaje a Max por la salida de [jweb~] (no hace nada fuera de Max). */
export function maxSend(...args: unknown[]) {
  maxApi()?.outlet(...args);
}

export const isNative = (): boolean =>
  !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();

let native: GranosMidiPlugin | null = null;

export async function startMidi(sink: MidiSink, onStatus: (s: MidiStatus) => void): Promise<void> {
  const parser = new MidiParser(sink);

  // Dentro de Max for Live: el MIDI de la pista llega byte a byte con el mensaje "b <byte>".
  // No se usa Web MIDI: sonarían las notas de todos los controladores, no solo las de la pista.
  const bindMax = (): boolean => {
    const max = maxApi();
    if (!max) return false;
    const stream = new MidiByteStream(parser);
    max.bindInlet('b', (byte: number) => stream.push(byte));
    max.bindInlet('p', (id: string, value: number) => sink.maxParam?.(String(id), Number(value)));
    max.bindInlet('synced', () => sink.maxSynced?.());
    onStatus({ kind: 'max', sources: ['Pista de Ableton Live'] });
    max.outlet('ready', 1); // Max responde con todos sus parámetros y luego "synced"
    return true;
  };
  if (bindMax()) return;
  if (maxRequested()) {
    // Max puede inyectar su API un poco después de cargar la página: se reintenta durante 20 s.
    onStatus({ kind: 'max', sources: ['Pista de Ableton Live'] });
    let tries = 0;
    const retry = setInterval(() => { if (bindMax() || ++tries >= 100) clearInterval(retry); }, 200);
    return;
  }

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
