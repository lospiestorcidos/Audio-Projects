# Granos para Max for Live

`Granos.amxd` es un instrumento de Max for Live que carga la web de Granos dentro de una pista
de Ableton Live: el sonido sale por la pista y las notas le llegan desde ella.

## Uso

1. Arrastra `Granos.amxd` a una pista MIDI de Live.
2. Pulsa **Abrir Granos**: se abre una ventana con la interfaz.
3. Haz clic una vez dentro de la ventana para activar el audio.
4. Toca desde el teclado o el controlador de la pista.

Necesita conexión a internet la primera vez (carga la app desde su dirección publicada).

## Cómo funciona

- `[jweb~]` es un navegador integrado en Max cuyo audio sale como señal; va a `[plugout~ 1 2]`.
- **MIDI**: `[midiin]` entrega el MIDI de la pista byte a byte; `[prepend b]` lo envía a la página,
  que lo recompone (`MidiByteStream` en `src/midi/parser.ts`). La dirección lleva `host=max`, y con
  eso la página no usa Web MIDI: solo suenan las notas de la pista.
- **Parámetros**: hay un `live.dial` oculto por parámetro (48), agrupados en 8 bancos de 8 con los
  mismos nombres y orden que las páginas de la interfaz: Grano, Nota, Variacion, Filtro, Env 1,
  Env 2, LFO 1 y LFO 2. Así aparecen en los controladores (APC64, Push…), se pueden automatizar
  y se guardan con el set de Live.
  - Live mueve un dial → `p <id> <valor>` → la página.
  - La página cambia algo → `<id> <valor>` → `[route]` → `set <valor>` → el dial (sin eco).
  - Al arrancar, la página envía `ready`; Max responde con todos sus valores y `synced`.
- Los parámetros continuos se muestran en Live como 0–100 % del recorrido del control; el valor
  real (ms, Hz, dB…) se ve en la ventana de Granos. Las listas e interruptores sí muestran su texto.
- El sample y el preset elegidos **no** se guardan con el set de Live; los parámetros sí.

La lista de parámetros sale de `src/shared/maxparams.ts`. El test `tests/maxparams.test.ts`
comprueba que `params.json` está al día; `UPDATE_MAX=1 npm test` lo regenera.

## Regenerar el dispositivo

```bash
python3 build_device.py                       # usa la dirección publicada
python3 build_device.py http://localhost:5173 # para desarrollo, con `npm run dev`
```

El script escribe `Granos.amxd` y `Granos.maxpat` sin necesitar Max.

## Estado

La primera versión (audio, ventana y MIDI) se probó en Live y funciona. Los parámetros y bancos
se han generado sin Max: comprobado el formato del archivo y, en Chromium con la API de Max
simulada, el intercambio de valores; **falta probarlos en Live**. Requiere una
versión de Max que incluya `jweb~`.
