// AudioWorkletProcessor: envoltorio fino del motor. Todo el DSP corre aquí, en el hilo de audio.
import type { EngineMsg } from '../../shared/params';
import { EcosEngine } from './engine';

// Declaraciones mínimas del ámbito global del worklet (no están en lib.dom).
declare const sampleRate: number;
declare class AudioWorkletProcessor {
  readonly port: MessagePort;
  constructor();
}
declare function registerProcessor(name: string, ctor: unknown): void;

// Reloj para medir la carga: performance.now() si existe en el worklet; si no, Date.now().
const g = globalThis as unknown as { performance?: { now(): number } };
const now: () => number = g.performance ? () => g.performance!.now() : () => Date.now();

class EcosProcessor extends AudioWorkletProcessor {
  private engine = new EcosEngine(sampleRate);
  private busy = 0; // ms de DSP acumulados en la ventana
  private frames = 0;
  private sinceTel = 0;
  private cpu = 0;
  private scratchR = new Float32Array(128);

  constructor() {
    super();
    this.port.onmessage = (e: MessageEvent) => this.engine.message(e.data as EngineMsg);
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    const out = outputs[0];
    const L = out[0];
    if (!L) return true;
    const n = L.length;
    if (this.scratchR.length < n) this.scratchR = new Float32Array(n);
    const R = out[1] ?? this.scratchR;
    // Sin fuente conectada, inputs[0] llega vacío.
    const inp = inputs[0];
    const inL = inp && inp[0] ? inp[0] : null;
    const inR = inp && inp[1] ? inp[1] : null;

    const t0 = now();
    this.engine.process(inL, inR, L, R, n);
    this.busy += now() - t0;

    this.frames += n;
    this.sinceTel += n;
    // Carga de CPU: tiempo de DSP / tiempo real, promediada cada ~0,5 s.
    if (this.frames >= sampleRate * 0.5) {
      this.cpu = this.busy / ((this.frames / sampleRate) * 1000);
      this.busy = 0; this.frames = 0;
    }
    // Telemetría a ~30 Hz.
    if (this.sinceTel >= sampleRate / 30) {
      this.sinceTel = 0;
      this.port.postMessage(this.engine.telemetry(this.cpu));
    }
    return true;
  }
}

registerProcessor('ecos', EcosProcessor);
