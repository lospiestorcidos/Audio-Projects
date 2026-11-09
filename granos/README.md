# Granos

Sintetizador granular polifónico para iPad (app web / PWA, preparada para Capacitor).
Motor inspirado en las prestaciones de Granulator III; interfaz y código propios.

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo (abre la URL en el iPad, misma red)
npm run build    # compila a dist/
npm test         # tests del motor DSP (se ejecutan en Node, sin navegador)
npm run bench    # mide la carga del DSP con 8 voces
```

## Arquitectura

- `src/shared/params.ts` — esquema único de parámetros y rutas de modulación (lo usan DSP, UI y presets).
- `src/audio/worklet/` — todo el DSP, dentro de un AudioWorklet:
  `engine.ts` (voces, mono/glide/hold), `voice.ts` (granos Classic/Loop/Cloud, modulación),
  `filter.ts` (2 SVF en serie), `envelope.ts`, `lfo.ts`. No depende del DOM: se puede portar a Rust/WASM.
- `src/audio/host.ts` — AudioContext, desbloqueo por toque, interrupciones, mensajes UI↔worklet.
- `src/ui/` — componentes Svelte 5. `src/display/` — dibujo en Canvas 2D.
- `src/state/` — estado, presets e IndexedDB.
- `tests/` — pruebas del motor y benchmark.
- `src/midi/` — parser MIDI/MPE y puente con el plugin nativo.
- `ios/` — proyecto Xcode de Capacitor; `ios/App/App/GranosMidiPlugin.swift` es el plugin CoreMIDI.

## Probar en el iPad

**Como PWA (sin Mac):** publica `dist/` en cualquier servidor HTTPS, ábrelo en Safari y elige
*Compartir › Añadir a pantalla de inicio*. Funciona sin conexión. Safari no tiene Web MIDI:
en este modo se toca con el teclado en pantalla.

**Como app nativa (con MIDI y MPE):** hace falta un Mac con Xcode.

```bash
npm install
npm run ios        # compila la web y la copia al proyecto Xcode
npm run ios:open   # abre Xcode; elige tu equipo de firma y pulsa Run con el iPad conectado
```

El identificador `app.granos.synth` de `capacitor.config.ts` es provisional.

## Rendimiento medido

Carga del DSP con 8 voces (`npm run bench`, un núcleo de servidor x86, Node 22):

| Caso | Carga |
| --- | --- |
| Classic, filtro LP24 | ~6 % |
| Loop, filtro LP24 | ~4 % |
| Cloud ×20 granos por canal, sin filtro | ~14 % |
| Cloud ×20, filtro doble + LFO + variación (320 granos) | ~15 % |

En Chromium, dentro del AudioWorklet, el peor caso marca un 15–17 %. La app muestra la carga real
en la barra superior (% CPU, voces y granos), que es la cifra a mirar en el iPad.

## Pendiente de validar en un iPad real

- Plugin CoreMIDI (Swift): escrito pero no compilado en este entorno (no hay Xcode).
- Press por tamaño del toque y presión del Apple Pencil.
- Interrupciones de audio (llamadas, segundo plano) y permiso de micrófono.
