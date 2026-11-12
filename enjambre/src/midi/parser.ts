// Entrada MIDI de Enjambre. Un efecto no toca notas: del MIDI solo interesan los controles
// (knobs y botones de un controlador físico) y el reloj para sincronizar el tempo.

export interface MidiSink {
  /** Mensaje de canal (nota, CC, cambio de programa…): lo recibe el mapa del controlador. */
  control?(status: number, d1: number, d2: number): boolean;
  /** Mensaje de tiempo real (0xF8 reloj, 0xFA start, 0xFC stop…), con su marca de tiempo en ms. */
  realtime?(status: number, time: number): void;
}

export class MidiParser {
  constructor(private sink: MidiSink) {}

  message(status: number, d1: number, d2: number) {
    this.sink.control?.(status, d1, d2);
  }

  /** Reloj y transporte MIDI (un solo byte). */
  realtime(status: number, time = performance.now()) {
    this.sink.realtime?.(status, time);
  }

  /** Tripletas [status, d1, d2, …] tal como las envía el plugin nativo. */
  feed(bytes: ArrayLike<number>) {
    for (let i = 0; i + 2 < bytes.length; i += 3) this.message(bytes[i], bytes[i + 1], bytes[i + 2]);
  }
}
