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
- `[midiin]` entrega el MIDI de la pista byte a byte; `[prepend b]` lo envía a la página, que lo
  recompone (`MidiByteStream` en `src/midi/parser.ts`) y lo trata igual que cualquier otra entrada
  MIDI, incluido el asistente de controlador.
- La página detecta que está dentro de Max por el objeto `window.max`.

## Regenerar el dispositivo

```bash
python3 build_device.py                       # usa la dirección publicada
python3 build_device.py http://localhost:5173 # para desarrollo, con `npm run dev`
```

El script escribe `Granos.amxd` y `Granos.maxpat` sin necesitar Max.

## Estado

Generado sin Max: **no se ha abierto nunca en Max ni en Live**. Lo comprobado es el formato del
archivo y, en Chromium con la API de Max simulada, que la página recibe las notas. Requiere una
versión de Max que incluya `jweb~`.
