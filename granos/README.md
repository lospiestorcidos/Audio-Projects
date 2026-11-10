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

## Dos interfaces

- **Clásica**: todos los controles de una sección a la vista (pensada para iPad).
- **De páginas**: una pantalla con 8 controles y botones de página (Grano, Nota, Variación,
  Filtro, Env 1, Env 2, LFO 1, LFO 2, Mod, Capture). Se adapta a teléfono, en vertical y horizontal.

Se cambia en el menú **⋯**. En pantallas pequeñas arranca la de páginas; también se puede forzar
con `?ui=pages` o `?ui=classic` en la dirección.

## Controlador MIDI físico

En el menú **⋯ › Configurar controlador MIDI…** la app aprende el controlador: se mueve cada uno
de los 8 knobs y se pulsa un botón por página. Después, el knob *n* mueve el control *n* de la
página activa y los botones cambian de página; los pads siguen tocando notas. La configuración se
guarda en el dispositivo. Con potenciómetros con tope, «Knobs MIDI: sin saltos» hace que el knob
espere a alcanzar el valor antes de moverlo.

Requiere MIDI: Chrome o Edge en el ordenador, o la app nativa en iPad (Safari no tiene Web MIDI).

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

**Como app nativa (con MIDI y MPE):** hace falta un Mac. Xcode y un Apple ID normal bastan;
no hay que pagar la cuenta de desarrollador. Con cuenta gratuita la app caduca a los 7 días:
para renovarla, conecta el iPad y pulsa Run otra vez (presets y samples se conservan).

1. Doble clic en `abrir_en_xcode.command` (la primera vez: clic derecho › Abrir).
   Instala dependencias, compila y abre Xcode. Si falta Node.js o Xcode, te lleva a su descarga.
2. En Xcode: **Xcode › Settings › Accounts › +** y entra con tu Apple ID.
3. En la barra lateral, pulsa **App** (icono azul) › pestaña **Signing & Capabilities**:
   - marca **Automatically manage signing**;
   - en **Team**, elige tu nombre (*Personal Team*);
   - en **Bundle Identifier**, cambia `app.granos.synth` por algo único, p. ej. `com.tunombre.granos`.
4. Conecta el iPad por cable y acepta "Confiar en este ordenador".
5. En el iPad: **Ajustes › Privacidad y seguridad › Modo de desarrollador** › activar (reinicia).
6. Arriba en Xcode, elige tu iPad como destino y pulsa **Run (▶)**.
7. La primera vez, en el iPad: **Ajustes › General › VPN y gestión de dispositivos** ›
   tu Apple ID › **Confiar**. Después abre Granos.

El MIDI aparece en la página **Voces** de la app (dispositivos conectados y botón Bluetooth MIDI).

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
