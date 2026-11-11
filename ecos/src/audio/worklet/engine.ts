// Motor de Ecos: un delay estéreo con realimentación filtrada. No depende del navegador:
// corre en un AudioWorklet o en Node (tests). Todo está preasignado.
import {
  defaultValues, delaySeconds, HIST_POINTS, HIST_SECONDS, MAX_DELAY, pidx, type EngineMsg, type Telemetry,
} from '../../shared/params';

const P = {
  sync: pidx('sync'), time: pidx('time'), div: pidx('div'), feedback: pidx('feedback'), mix: pidx('mix'),
  pingpong: pidx('pingpong'), spread: pidx('spread'), duck: pidx('duck'), freeze: pidx('freeze'),
  outGain: pidx('outGain'), lowCut: pidx('lowCut'), highCut: pidx('highCut'), drive: pidx('drive'),
  modRate: pidx('modRate'), modDepth: pidx('modDepth'), inGain: pidx('inGain'), bpm: pidx('bpm'),
};
const TAU = Math.PI * 2;
const db = (x: number) => Math.pow(10, x / 20);
/** Saturación suave: transparente con poca señal, comprime al subir. */
const soft = (x: number) => x / (1 + (x < 0 ? -x : x) * 0.5);

export class EcosEngine {
  readonly p = defaultValues();
  private sr: number;
  // Líneas de retardo (tamaño potencia de 2 para envolver con una máscara).
  private size: number;
  private mask: number;
  private bufL: Float32Array;
  private bufR: Float32Array;
  private w = 0;
  /** Retardo actual en muestras; se desliza hacia el objetivo (efecto de cinta, sin clics). */
  private dCur = 0;
  // Filtros de un polo dentro de la realimentación, por canal.
  private hpL = 0; private hpR = 0; private lpL = 0; private lpR = 0;
  private lfo = 0;
  private envIn = 0;
  // Valores suavizados para que los cambios de control no hagan escalones.
  private sMix = 0.4; private sFb = 0.45; private sOut = 1; private sIn = 1;
  // Sonido de prueba.
  private pluck = 0;
  private pluckPhase = 0;
  // Telemetría.
  private inPeak = 0; private outPeak = 0;
  private hist = new Float32Array(HIST_POINTS);
  private histPos = 0; private histAcc = 0; private histCount = 0; private histStep: number;

  constructor(sampleRate: number) {
    this.sr = sampleRate;
    let size = 1;
    while (size < sampleRate * (MAX_DELAY + 0.5)) size <<= 1;
    this.size = size; this.mask = size - 1;
    this.bufL = new Float32Array(size); this.bufR = new Float32Array(size);
    this.histStep = Math.max(1, Math.round((sampleRate * HIST_SECONDS) / HIST_POINTS));
    this.dCur = this.target();
  }

  private target(): number {
    return delaySeconds(this.p[P.sync] >= 0.5, this.p[P.time], this.p[P.div], this.p[P.bpm]) * this.sr;
  }

  message(m: EngineMsg) {
    switch (m.t) {
      case 'param': this.p[m.i] = m.v; break;
      case 'params': for (let i = 0; i < m.a.length && i < this.p.length; i++) this.p[i] = m.a[i]; break;
      case 'clear':
        this.bufL.fill(0); this.bufR.fill(0); this.hist.fill(0);
        this.hpL = this.hpR = this.lpL = this.lpR = 0;
        break;
      case 'pluck': this.pluck = Math.round(this.sr * 0.18); this.pluckPhase = 0; break;
    }
  }

  /** Procesa n muestras. inL/inR pueden ser null (sin entrada conectada); inR null = entrada mono. */
  process(inL: Float32Array | null, inR: Float32Array | null, outL: Float32Array, outR: Float32Array, n: number) {
    const p = this.p, sr = this.sr, mask = this.mask, bufL = this.bufL, bufR = this.bufR;
    const freeze = p[P.freeze] >= 0.5, ping = p[P.pingpong] >= 0.5;
    const dTarget = this.target();
    // El retardo se acerca a su objetivo con una constante de ~80 ms.
    const glide = 1 - Math.exp(-1 / (0.08 * sr));
    const smooth = 1 - Math.exp(-1 / (0.02 * sr));
    const tMix = p[P.mix], tFb = freeze ? 1 : p[P.feedback], tOut = db(p[P.outGain]), tIn = db(p[P.inGain]);
    // Coeficientes de los filtros de la realimentación (se calculan una vez por bloque).
    const aHp = 1 - Math.exp((-TAU * p[P.lowCut]) / sr), aLp = 1 - Math.exp((-TAU * Math.min(p[P.highCut], sr * 0.45)) / sr);
    const g = 1 + p[P.drive] * 6, drive = p[P.drive] > 0;
    const depth = p[P.modDepth] * 0.004 * sr, lfoInc = p[P.modRate] / sr;
    const spread = p[P.spread], duck = p[P.duck];
    const envRel = Math.exp(-1 / (0.25 * sr));
    const maxD = this.size - 4;

    let w = this.w, dCur = this.dCur, lfo = this.lfo, envIn = this.envIn;
    let hpL = this.hpL, hpR = this.hpR, lpL = this.lpL, lpR = this.lpR;
    let sMix = this.sMix, sFb = this.sFb, sOut = this.sOut, sIn = this.sIn;
    let inPeak = this.inPeak, outPeak = this.outPeak;

    for (let i = 0; i < n; i++) {
      sMix += (tMix - sMix) * smooth; sFb += (tFb - sFb) * smooth;
      sOut += (tOut - sOut) * smooth; sIn += (tIn - sIn) * smooth;

      // --- Entrada (más el sonido de prueba) ---
      let xl = inL ? inL[i] * sIn : 0;
      let xr = inL ? (inR ? inR[i] : inL[i]) * sIn : 0;
      if (this.pluck > 0) {
        const env = this.pluck / (sr * 0.18);
        const s = (Math.sin(TAU * this.pluckPhase) + 0.4 * Math.sin(TAU * this.pluckPhase * 2)) * env * env * 0.5;
        this.pluckPhase += 440 / sr;
        this.pluck--;
        xl += s; xr += s;
      }
      const a = xl < 0 ? -xl : xl, b = xr < 0 ? -xr : xr, m = a > b ? a : b;
      if (m > inPeak) inPeak = m;
      envIn = m > envIn ? m : envIn * envRel; // seguidor de envolvente para Duck

      // --- Lectura de las dos líneas (interpolación lineal) ---
      // Como una cinta: la cabeza se mueve como mucho a 0,75 muestras por muestra, así el cambio de
      // tiempo suena a subida o bajada de tono y no a zumbido.
      let step = (dTarget - dCur) * glide;
      step = step > 0.75 ? 0.75 : step < -0.75 ? -0.75 : step;
      dCur += step;
      lfo += lfoInc; if (lfo >= 1) lfo -= 1;
      const mod = depth > 0 ? depth * Math.sin(TAU * lfo) : 0;
      let dl = dCur + mod, dr = dCur * (1 + spread * 0.03) - mod * spread;
      dl = dl < 1 ? 1 : dl > maxD ? maxD : dl;
      dr = dr < 1 ? 1 : dr > maxD ? maxD : dr;
      let rp = w - dl, ri = Math.floor(rp), fr = rp - ri;
      const wl = bufL[ri & mask] + fr * (bufL[(ri + 1) & mask] - bufL[ri & mask]);
      rp = w - dr; ri = Math.floor(rp); fr = rp - ri;
      const wr = bufR[ri & mask] + fr * (bufR[(ri + 1) & mask] - bufR[ri & mask]);

      // --- Realimentación ---
      let fl: number, fRight: number;
      if (freeze) {
        // Freeze: el contenido da vueltas tal cual y no entra sonido nuevo.
        fl = wl; fRight = wr;
      } else {
        // Corte de graves y de agudos, y saturación: cada repetición sale un poco más cambiada.
        hpL += aHp * (wl - hpL); let yl = wl - hpL; lpL += aLp * (yl - lpL); yl = lpL;
        hpR += aHp * (wr - hpR); let yr = wr - hpR; lpR += aLp * (yr - lpR); yr = lpR;
        if (drive) { yl = soft(yl * g) / g; yr = soft(yr * g) / g; }
        yl *= sFb; yr *= sFb;
        if (ping) {
          // Ping-pong: la entrada va solo a la izquierda y las repeticiones saltan de lado.
          fl = (xl + xr) * 0.5 + yr; fRight = yl;
        } else { fl = xl + yl; fRight = xr + yr; }
        // Seguro: con feedback por encima del 100 % la señal crece, pero no se desboca.
        fl = fl > 2 ? 2 : fl < -2 ? -2 : fl; fRight = fRight > 2 ? 2 : fRight < -2 ? -2 : fRight;
        if (fl > 1 || fl < -1) fl = soft(fl) * 1.5;
        if (fRight > 1 || fRight < -1) fRight = soft(fRight) * 1.5;
      }
      bufL[w] = fl; bufR[w] = fRight;
      w = (w + 1) & mask;

      // --- Salida: mezcla de potencia constante; Duck baja el efecto mientras entra sonido ---
      const k = sMix * (Math.PI / 2);
      let wetG = Math.sin(k);
      if (duck > 0) { const e = envIn * 4; wetG *= 1 - duck * (e > 1 ? 1 : e); }
      const dryG = Math.cos(k);
      let ol = (xl * dryG + wl * wetG) * sOut, or = (xr * dryG + wr * wetG) * sOut;
      // Limitador de salida: transparente hasta 0,9 y redondeado por encima (nunca pasa de 1).
      if (ol > 0.9) ol = 0.9 + 0.1 * Math.tanh((ol - 0.9) * 10); else if (ol < -0.9) ol = -0.9 - 0.1 * Math.tanh((-ol - 0.9) * 10);
      if (or > 0.9) or = 0.9 + 0.1 * Math.tanh((or - 0.9) * 10); else if (or < -0.9) or = -0.9 - 0.1 * Math.tanh((-or - 0.9) * 10);
      outL[i] = ol; outR[i] = or;
      const oa = ol < 0 ? -ol : ol;
      if (oa > outPeak) outPeak = oa;

      // --- Historial para el display: pico del sonido con efecto por tramo ---
      const wa = (wl < 0 ? -wl : wl) > (wr < 0 ? -wr : wr) ? (wl < 0 ? -wl : wl) : (wr < 0 ? -wr : wr);
      if (wa > this.histAcc) this.histAcc = wa;
      if (++this.histCount >= this.histStep) {
        this.hist[this.histPos] = this.histAcc;
        this.histPos = (this.histPos + 1) % HIST_POINTS;
        this.histAcc = 0; this.histCount = 0;
      }
    }

    const tiny = (x: number) => (x < 1e-20 && x > -1e-20 ? 0 : x); // sin denormales en silencio
    this.w = w; this.dCur = dCur; this.lfo = lfo; this.envIn = tiny(envIn);
    this.hpL = tiny(hpL); this.hpR = tiny(hpR); this.lpL = tiny(lpL); this.lpR = tiny(lpR);
    this.sMix = sMix; this.sFb = sFb; this.sOut = sOut; this.sIn = sIn;
    this.inPeak = inPeak; this.outPeak = outPeak;
  }

  /** Instantánea para la UI. cpu lo mide quien llama a process(). */
  telemetry(cpu: number): Telemetry {
    const hist = new Float32Array(HIST_POINTS);
    for (let i = 0; i < HIST_POINTS; i++) hist[i] = this.hist[(this.histPos + i) % HIST_POINTS];
    const t: Telemetry = { t: 'tel', cpu, inPeak: this.inPeak, outPeak: this.outPeak, delay: this.dCur / this.sr, hist };
    this.inPeak = 0; this.outPeak = 0;
    return t;
  }
}
