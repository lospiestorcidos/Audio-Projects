// Buffer circular de grabación permanente: siempre contiene los últimos `seconds` de audio.

export class RingRecorder {
  private L: Float32Array;
  private R: Float32Array;
  private w = 0;
  private filled = 0;
  private stereo = false;
  peak = 0;

  constructor(private sr: number, seconds: number) {
    const n = Math.max(1, Math.round(sr * seconds));
    this.L = new Float32Array(n);
    this.R = new Float32Array(n);
  }

  /** Cambia la duración conservando lo ya grabado que quepa. */
  resize(seconds: number) {
    const old = this.grab();
    const n = Math.max(1, Math.round(this.sr * seconds));
    this.L = new Float32Array(n); this.R = new Float32Array(n);
    this.w = 0; this.filled = 0;
    const st = this.stereo;
    if (old) this.write(old[0], old[1] ?? null, old[0].length);
    this.stereo = st;
  }

  write(l: Float32Array, r: Float32Array | null, n: number) {
    const size = this.L.length;
    let start = 0;
    if (n > size) { start = n - size; }
    if (r) this.stereo = true;
    let w = this.w, pk = this.peak;
    for (let i = start; i < n; i++) {
      const a = l[i];
      this.L[w] = a;
      this.R[w] = r ? r[i] : a;
      const m = a < 0 ? -a : a;
      if (m > pk) pk = m;
      if (++w === size) w = 0;
    }
    this.w = w; this.peak = pk;
    this.filled = Math.min(size, this.filled + (n - start));
  }

  /** Devuelve lo grabado en orden cronológico (mono si la entrada lo era), o null si está vacío. */
  grab(): Float32Array[] | null {
    const n = this.filled, size = this.L.length;
    if (n === 0) return null;
    const start = (this.w - n + size) % size;
    const out = (src: Float32Array) => {
      const d = new Float32Array(n);
      const first = Math.min(n, size - start);
      d.set(src.subarray(start, start + first));
      if (first < n) d.set(src.subarray(0, n - first), first);
      return d;
    };
    return this.stereo ? [out(this.L), out(this.R)] : [out(this.L)];
  }

  clear() { this.w = 0; this.filled = 0; this.stereo = false; }
}
