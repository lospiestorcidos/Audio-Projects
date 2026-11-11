// Tempo a partir de MIDI clock (24 pulsos por negra) y de pulsaciones de "tap tempo". Código puro.

/** Estima el tempo midiendo el tiempo entre pulsos de MIDI clock. */
export class ClockTracker {
  private last = -1;
  private intervals: number[] = [];

  /** Registra un pulso (tiempo en ms). Devuelve el tempo estimado, o null si aún no hay bastantes. */
  tick(t: number): number | null {
    if (this.last >= 0) {
      const d = t - this.last;
      // Un hueco largo es una parada del reloj: se empieza de nuevo.
      if (d > 500 || d <= 0) this.intervals.length = 0;
      else {
        this.intervals.push(d);
        if (this.intervals.length > 48) this.intervals.shift(); // dos negras de ventana
      }
    }
    this.last = t;
    if (this.intervals.length < 12) return null;
    const mean = this.intervals.reduce((a, b) => a + b, 0) / this.intervals.length;
    return 60000 / (mean * 24);
  }

  /** ¿Ha llegado algún pulso en el último segundo? */
  alive(now: number): boolean {
    return this.last >= 0 && now - this.last < 1000;
  }

  reset() { this.last = -1; this.intervals.length = 0; }
}

/** Tempo por pulsaciones: media de los intervalos entre toques seguidos. */
export class TapTempo {
  private taps: number[] = [];

  /** Registra un toque (tiempo en ms). Devuelve el tempo, o null si es el primero de una serie. */
  tap(t: number): number | null {
    // Más de 2 s sin tocar empieza una serie nueva.
    if (this.taps.length && t - this.taps[this.taps.length - 1] > 2000) this.taps.length = 0;
    this.taps.push(t);
    if (this.taps.length > 6) this.taps.shift();
    if (this.taps.length < 2) return null;
    const span = this.taps[this.taps.length - 1] - this.taps[0];
    return 60000 / (span / (this.taps.length - 1));
  }
}
