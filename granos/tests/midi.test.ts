import { describe, expect, it } from 'vitest';
import { MidiByteStream, MidiParser } from '../src/midi/parser';
import type { EngineMsg } from '../src/shared/params';

function setup() {
  const out: EngineMsg[] = [];
  const holds: boolean[] = [];
  const p = new MidiParser({ send: (m) => out.push(m), hold: (on) => holds.push(on) });
  return { p, out, holds };
}

describe('Fase 8 · parser MIDI / MPE', () => {
  it('note on/off y note-on con velocidad 0', () => {
    const { p, out } = setup();
    p.feed([0x90, 60, 127, 0x90, 60, 0, 0x91, 64, 64, 0x81, 64, 0]);
    expect(out.filter((m) => m.t === 'on')).toEqual([
      { t: 'on', id: 60, note: 60, vel: 1 },
      { t: 'on', id: 128 + 64, note: 64, vel: 64 / 127 },
    ]);
    expect(out.filter((m) => m.t === 'off').map((m) => (m as { id: number }).id)).toEqual([60, 192]);
  });
  it('MPE: bend, slide y press afectan solo a la nota de su canal', () => {
    const { p, out } = setup();
    p.feed([0x91, 60, 100, 0x92, 67, 100]);
    out.length = 0;
    p.feed([0xe1, 0, 96]); // canal 2: bend +0,5
    p.feed([0xb2, 74, 127]); // canal 3: slide al máximo
    p.feed([0xd2, 64, 0]); // canal 3: presión
    const ex = out as Extract<EngineMsg, { t: 'expr' }>[];
    expect(ex[0].id).toBe(128 + 60);
    expect(ex[0].bend).toBeCloseTo(0.5, 2);
    expect(ex[1]).toMatchObject({ id: 256 + 67, slide: 1, bend: 0 });
    expect(ex[2].press).toBeCloseTo(64 / 127, 5);
    expect(ex.every((m) => m.t === 'expr')).toBe(true);
  });
  it('el bend previo al note-on se aplica a la nota nueva (inicio MPE)', () => {
    const { p, out } = setup();
    p.feed([0xe3, 0, 0, 0x93, 50, 90]);
    expect(out[1]).toMatchObject({ t: 'expr', id: 3 * 128 + 50, bend: -1 });
  });
  it('mod wheel (CC 1 y CC 2), sustain → Hold y All Notes Off', () => {
    const { p, out, holds } = setup();
    p.feed([0xb0, 1, 127, 0xb0, 2, 0, 0xb0, 64, 127, 0xb0, 64, 0, 0xb0, 123, 0]);
    expect(out).toEqual([{ t: 'wheel', v: 1 }, { t: 'wheel', v: 0 }, { t: 'panic' }]);
    expect(holds).toEqual([true, false]);
  });
  it('flujo de bytes de Max: running status, tiempo real intercalado y sysex', () => {
    const { p, out } = setup();
    const st = new MidiByteStream(p);
    // note-on, reloj en medio, segunda nota con running status, sysex, presión de canal, note-off
    for (const b of [0x90, 60, 0xf8, 100, 64, 90, 0xf0, 1, 2, 3, 0xf7, 0xd0, 80, 0x80, 60, 0]) st.push(b);
    expect(out.filter((m) => m.t === 'on')).toEqual([
      { t: 'on', id: 60, note: 60, vel: 100 / 127 },
      { t: 'on', id: 64, note: 64, vel: 90 / 127 },
    ]);
    expect(out.some((m) => m.t === 'expr' && Math.abs(m.press - 80 / 127) < 1e-6)).toBe(true);
    expect(out[out.length - 1]).toEqual({ t: 'off', id: 60 });
  });
});
