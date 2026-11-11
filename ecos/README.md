# Ecos

Delay como app web / PWA: procesa en vivo lo que entra por el micrófono o por una interfaz de
audio. Hermano de [Granos](../granos) y [Tablas](../tablas): misma base, mismas dos interfaces de
8 controles por página y el mismo asistente de controlador MIDI.

Publicado en: https://lospiestorcidos.github.io/Recent-Projects/ecos/

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # compila a dist/
npm test         # tests del motor, del tempo y del MIDI (en Node, sin navegador)
```

Para probarlo: auriculares (con micrófono o con una interfaz), pulsar **I/O** y aceptar el
permiso. Con el micrófono y el altavoz del propio dispositivo a la vez se acopla. **Probar**
lanza una nota corta al delay para oír el efecto sin entrada.

## Controles

- **Delay**: Sync, Tiempo (10 ms–2 s, o figuras de 1/32 a 1/1 con tresillos y puntillos),
  Feedback (hasta 110 %), Mezcla, Ping-pong, Estéreo, Duck y Volumen.
- **Tono** (lo que le pasa al sonido en cada repetición): Corte de graves, Corte de agudos,
  Saturación, modulación del tiempo (Rate y Cantidad) y Freeze.
- **Entrada**: I/O, Fuente, Ganancia, BPM, MIDI Clock, Tap, Probar y Borrar.

Al cambiar el Tiempo, el retardo se desliza como una cinta (sube o baja el tono) en vez de saltar.

## Tempo

- **Tap**: media de los últimos toques.
- **MIDI clock**: si llega reloj MIDI y «MIDI Clock» está activado, fija el BPM. Solo donde el
  navegador tiene Web MIDI (Chrome o Edge en el ordenador). **Safari en iPad no recibe MIDI**: ahí
  el tempo se pone con Tap o con el control BPM.

## Arquitectura

- `src/audio/worklet/engine.ts` — el delay (AudioWorklet): líneas de retardo, realimentación
  filtrada, saturación, ping-pong, Freeze, Duck y limitador.
- `src/audio/host.ts` — AudioContext y entrada de audio (`getUserMedia`, sin procesado de voz).
- `src/midi/clock.ts` — tempo desde MIDI clock y desde tap. `src/midi/` — controladores.
- `src/shared/params.ts` — esquema único de parámetros. `src/state/`, `src/ui/`, `src/display/`.

## Limitaciones

- **Latencia**: el audio que entra y sale por el navegador llega con un pequeño retraso. Para
  usar el delay en directo conviene Mezcla al 100 % (preset «Solo efecto») y mezclar la señal
  original por fuera.
- No hay versión para Max for Live: el objeto con el que se integran Granos y Tablas solo saca
  audio, no lo recibe.
- Con auriculares Bluetooth, al activar el micrófono el sistema suele bajar la calidad del audio.

## Sin validar

- No probado en iPad ni teléfono reales, ni con un MIDI clock real; no se ha escuchado.
