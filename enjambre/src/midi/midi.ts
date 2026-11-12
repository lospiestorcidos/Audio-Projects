// Entrada MIDI (controladores y reloj). Dos vías:
//  - Navegadores con Web MIDI (Chrome o Edge de escritorio): controles y MIDI clock.
//  - App nativa (Capacitor), si algún día se empaqueta: solo controles.
// Safari en iPad no tiene Web MIDI: ahí el tempo se pone con Tap o con el control BPM.
import { registerPlugin, type PluginListenerHandle } from '@capacitor/core';
import { MidiParser, type MidiSink } from './parser';

interface EnjambreMidiPlugin {
  start(): Promise<{ sources: string[] }>;
  listSources(): Promise<{ sources: string[] }>;
  showBluetooth(): Promise<void>;
  addListener(event: 'midi', fn: (e: { bytes: number[] }) => void): Promise<PluginListenerHandle>;
  addListener(event: 'sources', fn: (e: { sources: string[] }) => void): Promise<PluginListenerHandle>;
}

export type MidiStatus = { kind: 'native' | 'web' | 'none'; sources: string[] };

export const isNative = (): boolean =>
  !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();

let native: EnjambreMidiPlugin | null = null;

export async function startMidi(sink: MidiSink, onStatus: (s: MidiStatus) => void): Promise<void> {
  const parser = new MidiParser(sink);

  if (isNative()) {
    native = registerPlugin<EnjambreMidiPlugin>('EnjambreMidi');
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
          inp.onmidimessage = (e) => {
            const d = e.data;
            if (!d || !d.length) return;
            // El reloj MIDI llega como mensajes de un solo byte, con su marca de tiempo.
            if (d[0] >= 0xf8) parser.realtime(d[0], e.timeStamp || performance.now());
            else if (d.length >= 2) parser.message(d[0], d[1], d[2] ?? 0);
          };
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
