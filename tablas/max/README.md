# Tablas para Max for Live

`Tablas.amxd` es un instrumento de Max for Live que carga la web de Tablas dentro de una pista
de Ableton Live: el sonido sale por la pista y las notas le llegan desde ella.

## Uso

1. Arrastra `Tablas.amxd` a una pista MIDI de Live.
2. Pulsa **Abrir Tablas**: se abre una ventana con la interfaz.
3. Haz clic una vez dentro de la ventana para activar el audio.
4. Toca desde el teclado o el controlador de la pista.

Necesita conexión a internet la primera vez (carga la app desde su dirección publicada).

## Cómo funciona

- `[jweb~]` es un navegador integrado en Max cuyo audio sale como señal; va a `[plugout~ 1 2]`.
- **MIDI**: `[midiin]` entrega el MIDI de la pista byte a byte; `[prepend b]` lo envía a la página,
  que lo recompone (`MidiByteStream` en `src/midi/parser.ts`). La dirección lleva `host=max`, y con
  eso la página no usa Web MIDI: solo suenan las notas de la pista.
- **Parámetros**: hay un `live.dial` oculto por parámetro (70), agrupados en 11 bancos de 8 con el
  mismo orden que las páginas de la interfaz: Osc 1, Osc 2, Mezcla, Filtro, Env 1, Env 2, Env 3,
  LFO 1, LFO 2, Nota y LFO Sync. Así aparecen en los controladores (APC64, Push…), se pueden
  automatizar y se guardan con el set de Live.
  - Live mueve un dial → `p <id> <valor>` → la página.
  - La página cambia algo → `<id> <valor>` → `[route]` → `set <valor>` → el dial (sin eco).
  - Al arrancar, la página envía `ready`; Max responde con todos sus valores y `synced`.
- Los parámetros continuos se muestran en Live como 0–100 % del recorrido; los enteros (semitonos,
  voces, número de tabla) con su valor real; las listas e interruptores, con su texto.
- Las tablas del usuario **no** se guardan con el set de Live: el set guarda el número de tabla.

La lista de parámetros sale de `src/shared/maxparams.ts`. El test `tests/maxparams.test.ts`
comprueba que `params.json` está al día; `UPDATE_MAX=1 npm test` lo regenera.

## Regenerar el dispositivo

```bash
python3 build_device.py                       # usa la dirección publicada
python3 build_device.py http://localhost:5173 # para desarrollo, con `npm run dev`
```

El script escribe `Tablas.amxd` y `Tablas.maxpat` sin necesitar Max.

## Estado

Generado sin Max: **no se ha abierto nunca en Max ni en Live**. Usa el mismo método que el
dispositivo de Granos, que sí carga y suena en Live. Comprobado el formato del archivo.
