// Dos filtros de estado variable (SVF, topología TPT de Zavalishin/Cytomic) en serie.
// Los coeficientes se recalculan a "control rate"; el proceso es por muestra.

/** Qué salida usa cada etapa según el modo: 0 LP, 1 HP, 2 Notch, -1 = etapa desactivada. */
const STAGE1 = [0, 0, 0, 0, 2, 2, 1, 1, 1];
const STAGE2 = [0, -1, 1, 2, -1, 2, 2, -1, 1];
/** Modos en los que Width desplaza la frecuencia de la segunda etapa. */
const USES_WIDTH = [false, false, true, true, false, true, true, false, false];

export class DualSvf {
  // Estado de los integradores de las dos etapas.
  private a1 = 0; private a2 = 0; private b1 = 0; private b2 = 0;
  // Coeficientes etapa 1 (con resonancia) y etapa 2 (Q fija de Butterworth).
  private g1 = 0; private k1 = 1; private g2 = 0;
  private t1 = 0; private t2 = -1;

  reset() { this.a1 = this.a2 = this.b1 = this.b2 = 0; }

  /** freq en Hz, res 0..1, width en octavas (solo modos dobles). */
  set(mode: number, freq: number, res: number, width: number, sr: number) {
    const fmax = sr * 0.45;
    const f1 = freq < 20 ? 20 : freq > fmax ? fmax : freq;
    this.g1 = Math.tan((Math.PI * f1) / sr);
    this.k1 = 2 - 1.96 * res; // Q de 0.5 a 25
    this.t1 = STAGE1[mode];
    this.t2 = STAGE2[mode];
    if (this.t2 >= 0) {
      let f2 = USES_WIDTH[mode] ? f1 * Math.pow(2, width) : f1;
      f2 = f2 < 20 ? 20 : f2 > fmax ? fmax : f2;
      this.g2 = Math.tan((Math.PI * f2) / sr);
    }
  }

  /** Filtra buf[0..n) in situ. */
  process(buf: Float32Array, n: number) {
    let ic1 = this.a1, ic2 = this.a2;
    {
      const g = this.g1, k = this.k1, t = this.t1;
      const c1 = 1 / (1 + g * (g + k)), c2 = g * c1, c3 = g * c2;
      for (let i = 0; i < n; i++) {
        const v0 = buf[i];
        const v3 = v0 - ic2;
        const v1 = c1 * ic1 + c2 * v3;
        const v2 = ic2 + c2 * ic1 + c3 * v3;
        ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2;
        buf[i] = t === 0 ? v2 : t === 1 ? v0 - k * v1 - v2 : v0 - k * v1;
      }
      // Evita denormales cuando la voz queda en silencio.
      this.a1 = Math.abs(ic1) < 1e-20 ? 0 : ic1;
      this.a2 = Math.abs(ic2) < 1e-20 ? 0 : ic2;
    }
    if (this.t2 < 0) return;
    ic1 = this.b1; ic2 = this.b2;
    const g = this.g2, k = 1.4142, t = this.t2;
    const c1 = 1 / (1 + g * (g + k)), c2 = g * c1, c3 = g * c2;
    for (let i = 0; i < n; i++) {
      const v0 = buf[i];
      const v3 = v0 - ic2;
      const v1 = c1 * ic1 + c2 * v3;
      const v2 = ic2 + c2 * ic1 + c3 * v3;
      ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2;
      buf[i] = t === 0 ? v2 : t === 1 ? v0 - k * v1 - v2 : v0 - k * v1;
    }
    this.b1 = Math.abs(ic1) < 1e-20 ? 0 : ic1;
    this.b2 = Math.abs(ic2) < 1e-20 ? 0 : ic2;
  }
}

/** Respuesta en magnitud (lineal) del filtro doble a la frecuencia f. Solo para dibujar en la UI. */
export function filterMagnitude(mode: number, freq: number, res: number, width: number, f: number): number {
  const stage = (type: number, fc: number, k: number) => {
    // H(s) de un SVF analógico normalizado, con s = j·(f/fc).
    const w = f / fc, re = 1 - w * w, im = k * w;
    const den = re * re + im * im;
    const num = type === 0 ? 1 : type === 1 ? w * w * w * w : re * re;
    return Math.sqrt(num / den);
  };
  let m = stage(STAGE1[mode], freq, 2 - 1.96 * res);
  if (STAGE2[mode] >= 0) {
    const f2 = USES_WIDTH[mode] ? freq * Math.pow(2, width) : freq;
    m *= stage(STAGE2[mode], f2, 1.4142);
  }
  return m;
}
