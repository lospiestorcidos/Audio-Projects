# Tablas

Sintetizador de tablas de ondas (wavetable) como app web / PWA. Hermano de [Granos](../granos):
comparte su arquitectura, sus dos interfaces, el asistente de controlador MIDI y el método para
convertirlo en dispositivo de Max for Live. Prestaciones inspiradas en Wavetable de Ableton;
interfaz, código y tablas propios.

Publicado en: https://lospiestorcidos.github.io/Audio-Projects/tablas/

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # compila a dist/
npm test         # tests del motor, de las tablas y del MIDI (en Node, sin navegador)
npm run bench    # mide la carga del DSP con 8 notas
```

## Motor

- **Dos osciladores de tabla de ondas**: Tabla, Posición (transición suave entre ciclos), afinación y nivel.
- **Efecto por oscilador**: FM (cantidad y afinación del modulador), Classic (ancho de pulso y sync)
  y Modern (warp y fold).
- **Sin aliasing**: cada tabla se guarda en 11 versiones con menos armónicos; cada voz lee la que
  cabe por debajo de la frecuencia de Nyquist a su altura.
- **Suboscilador**, **unísono** de hasta 8 voces (Clásico, Posición, Aleatorio) y estéreo entre osciladores.
- **Filtro** de dos etapas con 9 modos, **tres envolventes** (la 1 es la amplitud), **dos LFO** estéreo.
- **Matriz de modulación** por parámetro, MPE por nota, 8 notas, mono con Glide y Hold.

## Tablas de ondas

- **De fábrica** (generadas por código): Básica, Pulso, Armónicos, Formantes, Digital, Campanas, Plegada, Sync.
- **Importar**: un WAV cuya duración sea un múltiplo exacto de 2048 muestras se carga como tabla
  tal cual (formato de Serum y similares). Un WAV más corto que un ciclo se usa como ciclo único.
- **Crear desde audio**: cualquier otro archivo, o una captura (micrófono, entrada o la propia
  salida del sinte), se convierte en tabla: cada ciclo lleva el espectro del sonido en un instante.
- Las tablas del usuario se guardan en el dispositivo (IndexedDB) y viajan dentro de los presets exportados.

## Interfaces

Las mismas dos de Granos, sobre las mismas páginas de 8 controles: Osc 1, Osc 2, Mezcla, Filtro,
Env 1, Env 2, Env 3, LFO 1, LFO 2, Nota, Mod y Tablas. Se cambia en el menú **⋯**.

## Arquitectura

- `src/shared/wavetable.ts` — formato de tabla, limitación en banda, tablas de fábrica y conversión de audio.
- `src/shared/fft.ts` — FFT usada por lo anterior.
- `src/shared/params.ts` — esquema único de parámetros y rutas de modulación.
- `src/audio/worklet/` — DSP en AudioWorklet: `engine.ts` (voces), `voice.ts` (osciladores, sub,
  modulación), `filter.ts`, `envelope.ts`, `lfo.ts`.
- `src/state/` — estado, páginas, presets, tablas e IndexedDB. `src/ui/` y `src/display/` — interfaz.
- `max/` — dispositivo de Max for Live (`Tablas.amxd`) y su generador.

El código parte de una copia de Granos: las dos apps son independientes y no comparten archivos.

## Rendimiento medido

Carga del DSP con 8 notas (`npm run bench`, un núcleo de servidor x86, Node 22):

| Caso | Carga |
| --- | --- |
| 1 oscilador | ~4 % |
| 2 osciladores + sub | ~6 % |
| 2 osciladores × 4 de unísono (64 osciladores) | ~12 % |
| 2 osciladores × 8 de unísono con FM, Modern, LFO y filtro doble (128 osciladores) | ~26 % |

En Chromium, dentro del AudioWorklet, 128 osciladores marcan alrededor de un 11 %.

## Sin validar

- No probado en iPad, teléfono ni Ableton Live reales; no se ha escuchado.
- No incluye proyecto nativo de iPad (el de Granos sirve de modelo si hace falta).
