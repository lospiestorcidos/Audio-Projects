// Generador xorshift32: rápido, determinista y sin reservas de memoria (apto para el hilo de audio).
export class Rng {
  private s: number;
  constructor(seed = 0x9e3779b9) { this.s = seed | 0 || 1; }
  seed(v: number) { this.s = v | 0 || 1; }
  /** Uniforme en [0, 1). */
  next(): number {
    let x = this.s;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    this.s = x;
    return (x >>> 0) / 4294967296;
  }
  /** Uniforme en [-1, 1). */
  bi(): number { return this.next() * 2 - 1; }
}
