import { describe, expect, it } from 'vitest';
import { ccToParam } from '../src/midi/ccchart';

describe('Tabla de CC (la del Microcosm)', () => {
  it('knobs, pasos e interruptores', () => {
    expect(ccToParam(6, 127)).toEqual(['activity', 1]);
    expect(ccToParam(9, 0)).toEqual(['mix', 0]);
    expect(ccToParam(5, 3)).toEqual(['time', 3]);
    expect(ccToParam(5, 99)).toEqual(['time', 5]);
    expect(ccToParam(10, 127)).toEqual(['time', 5]);
    expect(ccToParam(20, 64)).toEqual(['room', 2]);
    expect(ccToParam(48, 64)).toEqual(['hold', 1]);
    expect(ccToParam(102, 10)).toEqual(['bypass', 0]);
    expect(ccToParam(8, 64)![1]).toBeCloseTo(0.0079, 3); // Filter: el centro es «apagado»
    expect(ccToParam(1, 64)).toBeNull();
  });
});
