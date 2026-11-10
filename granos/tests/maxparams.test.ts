import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fromMax, MAX_BANKS, MAX_PARAM_IDS, maxParamsJson, toMax } from '../src/shared/maxparams';
import { pdef } from '../src/shared/params';

const FILE = 'max/params.json';

describe('parámetros de Max for Live', () => {
  it('cada banco tiene 8 huecos y no hay nombres ni ids repetidos', () => {
    for (const b of MAX_BANKS) expect(b.params.length).toBe(8);
    const all = MAX_BANKS.flatMap((b) => b.params.filter((p) => p).map((p) => p!));
    expect(new Set(all.map((p) => p[0])).size).toBe(all.length);
    expect(new Set(all.map((p) => p[1])).size).toBe(all.length);
    expect(MAX_PARAM_IDS.size).toBe(all.length);
  });
  it('ida y vuelta de valores (listas exactas; continuos con error mínimo)', () => {
    for (const id of MAX_PARAM_IDS) {
      const d = pdef(id);
      for (const v of [d.min, d.def, d.max]) {
        const back = fromMax(d, toMax(d, v));
        expect(Math.abs(back - v)).toBeLessThanOrEqual(Math.abs(d.max - d.min) * 0.002 + 1e-9);
      }
    }
  });
  it('max/params.json está al día con el esquema (UPDATE_MAX=1 lo regenera)', () => {
    const text = JSON.stringify(maxParamsJson(), null, 1) + '\n';
    if (process.env.UPDATE_MAX || !existsSync(FILE)) writeFileSync(FILE, text);
    expect(readFileSync(FILE, 'utf8')).toBe(text);
  });
});
