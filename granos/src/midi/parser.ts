// Traduce mensajes MIDI (incluido MPE) a mensajes del motor. No depende del navegador.
import type { EngineMsg } from '../shared/params';

export interface MidiSink {
  send(m: EngineMsg): void;
  /** Pedal de sustain (CC 64) → Hold. */
  hold(on: boolean): void;
  /** Controlador físico: si devuelve true, el mensaje era de un knob o botón asignado y no sigue. */
  control?(status: number, d1: number, d2: number): boolean;
}

/**
 * MPE: cada nota llega por su propio canal, así que pitch bend, CC 74 (Slide) y presión de canal
 * (Press) se aplican solo a las notas de ese canal. Un teclado normal (todo por un canal) funciona
 * igual: su bend afecta a todas sus notas.
 */
export class MidiParser {
  private bend = new Float32Array(16);
  private slide = new Float32Array(16);
  private press = new Float32Array(16);
  private notes: Set<number>[] = Array.from({ length: 16 }, () => new Set<number>());

  constructor(private sink: MidiSink) {}

  /** Identificador de nota único por canal + nota. */
  private id(ch: number, note: number) { return ch * 128 + note; }

  private expr(ch: number, id: number, press = this.press[ch]) {
    this.sink.send({ t: 'expr', id, bend: this.bend[ch], slide: this.slide[ch], press });
  }
  private exprAll(ch: number) {
    for (const id of this.notes[ch]) this.expr(ch, id);
  }

  message(status: number, d1: number, d2: number) {
    if (this.sink.control?.(status, d1, d2)) return;
    const type = status & 0xf0, ch = status & 0x0f;
    switch (type) {
      case 0x90:
        if (d2 > 0) {
          const id = this.id(ch, d1);
          this.notes[ch].add(id);
          this.sink.send({ t: 'on', id, note: d1, vel: d2 / 127 });
          this.expr(ch, id); // en MPE el bend y el slide iniciales llegan antes del note-on
          break;
        }
      // note-on con velocidad 0 = note-off
      // falls through
      case 0x80: {
        const id = this.id(ch, d1);
        this.notes[ch].delete(id);
        this.sink.send({ t: 'off', id });
        break;
      }
      case 0xa0: // aftertouch polifónico: solo esa nota
        if (this.notes[ch].has(this.id(ch, d1))) this.expr(ch, this.id(ch, d1), d2 / 127);
        break;
      case 0xb0:
        if (d1 === 74) { this.slide[ch] = d2 / 127; this.exprAll(ch); }
        else if (d1 === 1 || d1 === 2) this.sink.send({ t: 'wheel', v: d2 / 127 });
        else if (d1 === 64) this.sink.hold(d2 >= 64);
        else if (d1 === 120 || d1 === 123) { this.sink.send({ t: 'panic' }); this.notes.forEach((s) => s.clear()); }
        break;
      case 0xd0: // presión de canal
        this.press[ch] = d1 / 127;
        this.exprAll(ch);
        break;
      case 0xe0: { // pitch bend de 14 bits → -1..1 (el rango en semitonos lo pone PB Range)
        const v = ((d2 << 7) | d1) - 8192;
        this.bend[ch] = v < 0 ? v / 8192 : v / 8191;
        this.exprAll(ch);
        break;
      }
    }
  }

  /** Tripletas [status, d1, d2, …] tal como las envía el plugin nativo. */
  feed(bytes: ArrayLike<number>) {
    for (let i = 0; i + 2 < bytes.length; i += 3) this.message(bytes[i], bytes[i + 1], bytes[i + 2]);
  }
}
