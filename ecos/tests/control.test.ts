import { describe, expect, it } from 'vitest';
import { controlMsg, emptyMap, pageForKey, Pickup, unassign } from '../src/midi/control';
import { MidiParser } from '../src/midi/parser';

describe('MIDI', () => {
  it('clasifica CC, notas y cambios de programa sin mirar el canal', () => {
    expect(controlMsg(0xb3, 21, 90)).toEqual({ key: 'cc21', kind: 'cc', value: 90, off: false });
    expect(controlMsg(0x99, 36, 0)).toMatchObject({ key: 'n36', off: true });
    expect(controlMsg(0xe0, 0, 64)).toBeNull();
  });
  it('un control físico solo puede estar asignado a una cosa; recogida sin saltos', () => {
    const m = emptyMap();
    m.knobs[2] = 'cc10'; m.pages.tone = 'cc30';
    expect(pageForKey(m, 'cc30')).toBe('tone');
    unassign(m, 'cc30');
    expect(pageForKey(m, 'cc30')).toBeNull();
    const p = new Pickup();
    expect(p.test('time', 0.9, 0.3)).toBe(false);
    expect(p.test('time', 0.25, 0.3)).toBe(true);
  });
  it('el reloj y los controles llegan cada uno a su sitio', () => {
    const ctl: number[] = [], rt: number[] = [];
    const p = new MidiParser({ control: (st) => { ctl.push(st); return true; }, realtime: (st, t) => { rt.push(st, t); } });
    p.feed([0xb0, 7, 100]);
    p.realtime(0xf8, 1234);
    expect(ctl).toEqual([0xb0]);
    expect(rt).toEqual([0xf8, 1234]);
  });
});
