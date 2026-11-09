// Envolvente ADSR con segmentos exponenciales. Se evalúa a "control rate" (una vez por bloque).

export const ENV_IDLE = 0, ENV_A = 1, ENV_D = 2, ENV_S = 3, ENV_R = 4;

export class Envelope {
  state = ENV_IDLE;
  value = 0;

  gateOn() { this.state = ENV_A; }
  gateOff() { if (this.state !== ENV_IDLE) this.state = ENV_R; }
  reset() { this.state = ENV_IDLE; this.value = 0; }

  /**
   * Avanza un bloque. Tiempos en segundos; blockRate = bloques por segundo;
   * timeScale multiplica todos los tiempos (parámetro Key de la envolvente).
   */
  tick(a: number, d: number, s: number, r: number, blockRate: number, timeScale: number): number {
    switch (this.state) {
      case ENV_A: {
        // Objetivo 1.3 para que el ataque no sea asintótico; llega a 1 en ~1.47 tau.
        const tau = Math.max(1e-4, a * timeScale) / 1.466;
        this.value += (1.3 - this.value) * (1 - Math.exp(-1 / (tau * blockRate)));
        if (this.value >= 1) { this.value = 1; this.state = ENV_D; }
        break;
      }
      case ENV_D: {
        const tau = Math.max(1e-4, d * timeScale) / 6.9;
        this.value += (s - this.value) * (1 - Math.exp(-1 / (tau * blockRate)));
        if (Math.abs(this.value - s) < 1e-4) { this.value = s; this.state = ENV_S; }
        break;
      }
      case ENV_S:
        // Sigue el sustain si se mueve el control mientras suena.
        this.value += (s - this.value) * 0.2;
        break;
      case ENV_R: {
        const tau = Math.max(1e-4, r * timeScale) / 6.9;
        this.value -= this.value * (1 - Math.exp(-1 / (tau * blockRate)));
        if (this.value < 1e-4) { this.value = 0; this.state = ENV_IDLE; }
        break;
      }
    }
    return this.value;
  }
}
