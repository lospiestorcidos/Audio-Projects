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
