# Enjambre

Efecto granular y de micro-bucles sobre la entrada de audio (micrófono o interfaz), como app web /
PWA. Hermano de Granos, Tablas y Ecos: misma base, mismas dos interfaces de 8 controles por página y
el mismo asistente de controlador MIDI.

Publicado en: https://lospiestorcidos.github.io/Recent-Projects/enjambre/

## Referencia

La organización de motores, variaciones y controles sigue la de
[DigiSwarm](https://github.com/irpina/digicosm) (antes DigiCosm), un mod del Digitone mk1 inspirado en
el Hologram Microcosm, tomada de su documentación. El código de Enjambre es propio: no copia el de
DigiSwarm (GPL) ni tiene relación con Hologram Electronics.

## Cómo funciona

- La entrada se graba sin parar en un historial de ~11 s.
- Cada motor es un planificador que lanza **cabezas**: lectores de ese historial, con interpolación
  y ventana, como bucles (que dan varias vueltas) o como granos sueltos. Hasta 16 a la vez.
- Después: modulación de tono, filtro (paso bajo a la izquierda, paso alto a la derecha), Space
  (reverb de 8 retardos realimentados, 4 salas) y la mezcla con la señal original.
- **Hold** deja de grabar y los motores siguen leyendo lo último que entró. **Bypass** deja pasar la
  señal original y deja sonar las colas.

## Motores (fase 1)

| | Motor | A | B | C | D |
|---|---|---|---|---|---|
| 1 | Shards: bucles a varias velocidades | 1x y 2x | 1x y 0,5x | todo a 2x | 0,5x, 1x, 2x y 4x |
| 2 | Mist: nubes de granos | estirada | aleatoria | 1x y 2x | 1x y 0,5x |
| 3 | Glide: bucles cuya velocidad se desliza | 0,5x → 1x | 2x → 0,5x | 1x → 2x | sube y baja a la vez |
| 4 | Pattern: repeticiones de un delay | regular | sincopado | racimos | tresillos |

**Activity** es la densidad (bucles, granos o repeticiones), **Repeats** cuánto dura cada uno (o el
feedback en Pattern) y **Shape** la forma de cada bucle o grano: Plana, Crece, Golpe o Arco.
**Time** es la rejilla: de 1 compás a 1/32 del tempo.

## Páginas

| Página | Controles |
|---|---|
| Efecto | Activity, Repeats, Shape, Filter, Mix, Time, Space, Loop (fase 2) |
| Shift | Ganancia, Mod Depth, Mod Rate, Resonancia, Vol. efecto, Vel. loop (fase 2), Sala, Fade loop (fase 2) |
| Motor | Motor, Variación, I/O, Fuente, BPM, MIDI Clock, Tap, Probar |

Abajo, siempre a mano: I/O, Tap, Hold, Bypass y Probar.

## MIDI

- **Tabla de CC del Microcosm** (la misma numeración que DigiSwarm), en cualquier canal: 5 Time en
  pasos, 6 Activity, 7 Shape, 8 Filter, 9 Mix, 10 Time, 11 Repeats, 12 Space, 13 Loop, 14 Mod Rate,
  15 Resonancia, 16 Vol. efecto, 17/18 Vel. loop, 19 Mod Depth, 20 Sala, 21 Fade loop, 48 Hold,
  102 Bypass.
- **MIDI clock** y el asistente de controlador, como en Ecos. Solo donde el navegador tiene Web MIDI
  (Chrome o Edge en el ordenador): Safari en iPad no recibe MIDI.

## Pendiente

- Fase 2: looper (60 s, una capa de sobregrabación y deshacer), Reverse, Loop, Vel. loop y Fade loop.
- Fase 3: los otros 7 motores (Seq, Drone, Rake, Chops, Stutter, Arp, Warp).

## Sin validar

- No probado en iPad ni teléfono reales; no se ha escuchado. Los motores están afinados a ojo.
