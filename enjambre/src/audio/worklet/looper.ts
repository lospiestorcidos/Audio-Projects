// Looper de Enjambre: hasta 60 s estéreo, con una capa de sobregrabación que se puede deshacer.
// Código puro (sin DOM): lo usa el motor dentro del AudioWorklet y lo prueban los tests en Node.
//
// El bucle es la suma de dos memorias: la base (lo grabado y las sobregrabaciones ya fijadas) y la
// capa (la última sobregrabación). Deshacer vacía la capa. Al empezar otra sobregrabación, la capa
// anterior se suma a la base y la nueva empieza vacía.

export const LOOP_MAX_SECONDS = 60;
export const LOOP_EMPTY = 0, LOOP_REC = 1, LOOP_PLAY = 2, LOOP_DUB = 3, LOOP_STOP = 4;
export const LOOP_STATE_NAMES = ['Vacío', 'Grabando', 'Sonando', 'Sobregrabando', 'Parado'];

/**
 * Acciones: 'loop' es el botón único (grabar → cerrar → sobregrabar → dejar de sobregrabar…);
 * 'rec', 'play' y 'dub' son las de la tabla de CC del Microcosm.
 */
export type LoopAction = 'loop' | 'rec' | 'play' | 'dub' | 'stop' | 'undo' | 'clear';
export const LOOP_ACTIONS: readonly LoopAction[] = ['loop', 'rec', 'play', 'dub', 'stop', 'undo', 'clear'];

/** Acciones que, con Cuantizar, esperan al siguiente paso de la rejilla. */
const QUANTIZED: readonly LoopAction[] = ['loop', 'rec', 'play', 'dub'];

export class Looper {
  state = LOOP_EMPTY;
  /** Muestras del bucle. */
  len = 0;
  /** Posición de lectura (con decimales: la velocidad puede no ser 1). */
  pos = 0;
  hasLayer = false;
  /** Acción esperando al siguiente paso (Cuantizar). */
  pending: LoopAction | null = null;
  /** Salida de la última muestra (sin reservar memoria en cada llamada). */
  outL = 0;
  outR = 0;

  private sr: number;
  private max: number;
  private baseL: Float32Array | null = null;
  private baseR: Float32Array | null = null;
  private layL: Float32Array | null = null;
  private layR: Float32Array | null = null;
  /** Fundido al parar o al borrar: ganancia actual y paso por muestra (0 = sin fundido en curso). */
  private gain = 1;
  private fadeStep = 0;
  private afterFade: 'stop' | 'clear' | null = null;
  /** Fundido corto en los bordes del bucle, para que la costura no haga clic. */
  private edge: number;

  constructor(sampleRate: number) {
    this.sr = sampleRate;
    this.max = Math.round(LOOP_MAX_SECONDS * sampleRate);
    this.edge = Math.round(0.003 * sampleRate);
  }

  /** La memoria (unos 46 MB a 48 kHz) se reserva la primera vez que se graba. */
  private alloc() {
    if (this.baseL) return;
    this.baseL = new Float32Array(this.max); this.baseR = new Float32Array(this.max);
    this.layL = new Float32Array(this.max); this.layR = new Float32Array(this.max);
  }

  /** Pide una acción. Con quantize, las que empiezan o cierran algo esperan al siguiente paso. */
  action(a: LoopAction, quantize: boolean) {
    if (quantize && QUANTIZED.includes(a)) { this.pending = a; return; }
    this.pending = null;
    this.exec(a);
  }

  /** Llamar en cada paso de la rejilla: ejecuta la acción que esperaba. */
  onStep() {
    if (this.pending) { const a = this.pending; this.pending = null; this.exec(a); }
  }

  private exec(a: LoopAction) {
    const s = this.state;
    switch (a) {
      case 'loop':
        if (s === LOOP_EMPTY) this.startRec();
        else if (s === LOOP_REC) this.closeRec();
        else if (s === LOOP_PLAY) this.startDub();
        else if (s === LOOP_DUB) this.state = LOOP_PLAY;
        else this.restart();
        break;
      case 'rec':
        if (s === LOOP_REC) this.closeRec();
        else this.startRec(); // también desde un bucle existente: empieza una toma nueva
        break;
      case 'play':
        if (s === LOOP_REC) this.closeRec();
        else if (s === LOOP_STOP) this.restart();
        else if (s === LOOP_DUB) this.state = LOOP_PLAY;
        break;
      case 'dub':
        if (s === LOOP_PLAY) this.startDub();
        else if (s === LOOP_DUB) this.state = LOOP_PLAY;
        break;
      case 'stop':
        if (s === LOOP_REC) { this.closeRec(); this.state = LOOP_STOP; this.pos = 0; }
        else if (s === LOOP_PLAY || s === LOOP_DUB) { this.state = LOOP_PLAY; this.fadeOut('stop'); }
        break;
      case 'undo':
        if (this.hasLayer) {
          this.layL!.fill(0, 0, this.len); this.layR!.fill(0, 0, this.len);
          this.hasLayer = false;
        }
        if (s === LOOP_DUB) this.state = LOOP_PLAY;
        break;
      case 'clear':
        if (s === LOOP_PLAY || s === LOOP_DUB) this.fadeOut('clear');
        else this.reset();
        break;
    }
  }

  private startRec() {
    this.alloc();
    this.state = LOOP_REC;
    this.len = 0; this.pos = 0; this.hasLayer = false;
    this.gain = 1; this.fadeStep = 0; this.afterFade = null;
  }

  private closeRec() {
    // Un bucle de menos de 50 ms se descarta (un doble toque por error).
    if (this.len < 0.05 * this.sr) { this.reset(); return; }
    this.layL!.fill(0, 0, this.len); this.layR!.fill(0, 0, this.len);
    this.state = LOOP_PLAY;
    this.pos = 0;
  }

  private startDub() {
    // La capa anterior pasa a la base: solo se puede deshacer la última sobregrabación.
    if (this.hasLayer) {
      const bl = this.baseL!, br = this.baseR!, ll = this.layL!, lr = this.layR!;
      for (let i = 0; i < this.len; i++) { bl[i] += ll[i]; br[i] += lr[i]; ll[i] = 0; lr[i] = 0; }
      this.hasLayer = false;
    }
    this.state = LOOP_DUB;
  }

  private restart() {
    this.state = LOOP_PLAY; this.pos = 0; this.gain = 1; this.fadeStep = 0; this.afterFade = null;
  }

  private fadeOut(then: 'stop' | 'clear') {
    this.afterFade = then;
    // El fundido dura lo que diga Fade loop (lo pone process); como mínimo 10 ms.
    this.fadeStep = -1;
  }

  private reset() {
    this.state = LOOP_EMPTY; this.len = 0; this.pos = 0; this.hasLayer = false;
    this.gain = 1; this.fadeStep = 0; this.afterFade = null; this.pending = null;
  }

  /**
   * Una muestra. inL/inR = lo que se graba o se sobregraba; speed = velocidad de reproducción;
   * fadeSeconds = duración del fundido al parar. Deja la salida en outL/outR.
   */
  tick(inL: number, inR: number, speed: number, reverse: boolean, fadeSeconds: number) {
    this.outL = 0; this.outR = 0;
    const s = this.state;
    if (s === LOOP_REC) {
      this.baseL![this.len] = inL; this.baseR![this.len] = inR;
      if (++this.len >= this.max) this.closeRec(); // 60 s: se cierra solo
      return;
    }
    if (s !== LOOP_PLAY && s !== LOOP_DUB) return;

    // Fundido de parada (o de borrado) en curso.
    if (this.fadeStep === -1) this.fadeStep = 1 / Math.max(0.01 * this.sr, fadeSeconds * this.sr);
    if (this.fadeStep > 0) {
      this.gain -= this.fadeStep;
      if (this.gain <= 0) {
        const then = this.afterFade;
        this.gain = 1; this.fadeStep = 0; this.afterFade = null;
        if (then === 'clear') this.reset(); else { this.state = LOOP_STOP; this.pos = 0; }
        return;
      }
    }

    const len = this.len, bl = this.baseL!, br = this.baseR!, ll = this.layL!, lr = this.layR!;
    const p = this.pos, ip = Math.floor(p), fr = p - ip, j1 = ip + 1 < len ? ip + 1 : 0;
    let l = bl[ip] + ll[ip], r = br[ip] + lr[ip];
    l += fr * (bl[j1] + ll[j1] - l);
    r += fr * (br[j1] + lr[j1] - r);
    // Fundido corto junto a la costura del bucle.
    const d = ip < len - ip ? ip : len - ip;
    const e = d < this.edge ? d / this.edge : 1;
    this.outL = l * e * this.gain; this.outR = r * e * this.gain;

    if (s === LOOP_DUB) {
      // Sobregrabación: se suma en la capa, en la posición que está sonando.
      ll[ip] += inL; lr[ip] += inR;
      this.hasLayer = true;
    }

    let np = p + (reverse ? -speed : speed);
    if (np >= len) np -= len;
    else if (np < 0) np += len;
    this.pos = np;
  }
}
