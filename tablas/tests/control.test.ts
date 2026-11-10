import { describe, expect, it } from 'vitest';
import { controlMsg, emptyMap, pageForKey, Pickup, unassign } from '../src/midi/control';
import { MidiParser } from '../src/midi/parser';
import type { EngineMsg } from '../src/shared/params';

describe('controlador MIDI físico', () => {
  it('clasifica CC, notas y cambios de programa sin mirar el canal', () => {
    expect(controlMsg(0xb3, 21, 90)).toEqual({ key: 'cc21', kind: 'cc', value: 90, off: false });
    expect(controlMsg(0x99, 36, 100)).toMatchObject({ key: 'n36', kind: 'note', off: false });
    expect(controlMsg(0x99, 36, 0)).toMatchObject({ key: 'n36', off: true });
    expect(controlMsg(0x89, 36, 0)).toMatchObject({ key: 'n36', off: true });
    expect(controlMsg(0xc0, 5, 0)).toMatchObject({ key: 'pc5', kind: 'pc' });
    expect(controlMsg(0xe0, 0, 64)).toBeNull();
  });
  it('un control físico solo puede estar asignado a una cosa', () => {
    const m = emptyMap();
    m.knobs[2] = 'cc10'; m.pages.filter = 'cc30';
    expect(pageForKey(m, 'cc30')).toBe('filter');
    unassign(m, 'cc30'); unassign(m, 'cc10');
    expect(pageForKey(m, 'cc30')).toBeNull();
    expect(m.knobs[2]).toBeNull();
  });
  it('recogida: el knob no toma el control hasta alcanzar o cruzar el valor', () => {
    const p = new Pickup();
    expect(p.test('size', 0.9, 0.3)).toBe(false); // lejos
    expect(p.test('size', 0.6, 0.3)).toBe(false); // acercándose
    expect(p.test('size', 0.25, 0.3)).toBe(true); // cruza el valor
    expect(p.test('size', 0.8, 0.25)).toBe(true); // ya lo gobierna
    expect(p.test('shape', 0.8, 0.1)).toBe(false); // otra página: vuelve a esperar
    expect(p.test('shape', 0.12, 0.1)).toBe(true); // llega cerca
  });
  it('los mensajes de un control asignado no llegan al sintetizador', () => {
    const out: EngineMsg[] = [];
    const seen: number[] = [];
    const p = new MidiParser({
      send: (m) => out.push(m), hold: () => {},
      control: (st, d1) => { seen.push(d1); return (st & 0xf0) === 0xb0 && d1 === 21; },
    });
    p.feed([0xb0, 21, 64, 0x90, 60, 100, 0xb0, 1, 127]);
    expect(seen).toEqual([21, 60, 1]);
    expect(out.map((m) => m.t)).toEqual(['on', 'expr', 'wheel']);
  });
});
