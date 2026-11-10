// LFO estéreo por voz. Se evalúa a "control rate".
import { Rng } from './rng';

const TAU = Math.PI * 2;

export class Lfo {
  phase = 0;
  out = new Float32Array(2); // salida L/R ya cuantizada (sin Amount)
  private rng = new Rng();
  // Valores aleatorios [canal][anterior, siguiente] para S&H, Rand y Move.
  private r0 = new Float32Array(4);
  private r1 = new Float32Array(4);
  private phase2 = 0; // segundo generador lento de Move

  reset(startPhase: number, seed: number) {
    this.rng.seed(seed);
    this.phase = startPhase - Math.floor(startPhase);
    this.phase2 = this.rng.next();
    for (let i = 0; i < 4; i++) { this.r0[i] = this.rng.bi(); this.r1[i] = this.rng.bi(); }
  }

  /**
   * Avanza dPhase ciclos y calcula la salida.
   * shape: 0 Sine,1 Tri,2 Up,3 Down,4 Rect,5 S&H,6 Rand,7 Move. stereo: 0=0°,1=90°,2=180°.
   */
  tick(dPhase: number, shape: number, stereo: number, quant: number) {
    this.phase += dPhase;
    if (this.phase >= 1) {
      this.phase -= Math.floor(this.phase);
      // Nuevo par de valores aleatorios para el generador principal (L=0, R=1).
      this.r0[0] = this.r1[0]; this.r0[1] = this.r1[1];
      this.r1[0] = this.rng.bi(); this.r1[1] = this.rng.bi();
    }
    this.phase2 += dPhase * 0.381966; // razón irracional: los dos aleatorios de Move nunca coinciden
    if (this.phase2 >= 1) {
      this.phase2 -= Math.floor(this.phase2);
      this.r0[2] = this.r1[2]; this.r0[3] = this.r1[3];
      this.r1[2] = this.rng.bi(); this.r1[3] = this.rng.bi();
    }
    const uni = shape === 2 || shape === 3; // Up y Down son unipolares
    for (let c = 0; c < 2; c++) {
      let v: number;
      if (c === 1 && stereo === 0) { this.out[1] = this.out[0]; break; }
      if (c === 1 && stereo === 2) { this.out[1] = uni ? 1 - this.out[0] : -this.out[0]; break; }
      // 90°: desfase de un cuarto de ciclo en las formas periódicas; secuencia independiente en las aleatorias.
      let p = this.phase + (c === 1 ? 0.25 : 0);
      if (p >= 1) p -= 1;
      switch (shape) {
        case 0: v = Math.sin(TAU * p); break;
        case 1: v = p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4; break;
        case 2: v = p; break;
        case 3: v = 1 - p; break;
        case 4: v = p < 0.5 ? 1 : -1; break;
        case 5: v = this.r0[c]; break;
        case 6: v = this.r0[c] + (this.r1[c] - this.r0[c]) * this.phase; break;
        default: {
          // Move: suma de dos aleatorios continuos (interpolación coseno) a ritmos distintos.
          const a = 0.5 - 0.5 * Math.cos(Math.PI * this.phase);
          const b = 0.5 - 0.5 * Math.cos(Math.PI * this.phase2);
          v = 0.6 * (this.r0[c] + (this.r1[c] - this.r0[c]) * a)
            + 0.4 * (this.r0[2 + c] + (this.r1[2 + c] - this.r0[2 + c]) * b);
        }
      }
      if (quant >= 2) v = Math.round(v * quant) / quant; // Quant: antes del Amount
      this.out[c] = v;
    }
  }
}
