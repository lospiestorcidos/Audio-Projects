// Puente entre la UI y el worklet: crea el AudioContext, lo desbloquea con el primer toque,
// gestiona interrupciones (llamadas, segundo plano) y envía mensajes al motor.
import { defaultValues, type EngineMsg, type Telemetry } from '../shared/params';
import workletUrl from './worklet/processor.ts?worker&url';

export interface LoadedSample {
  name: string;
  ch: Float32Array[];
  sr: number;
}

export type AudioState = 'off' | 'running' | 'suspended';

/** Normaliza a 0 dB (pico = 1) in situ. */
export function normalize(ch: Float32Array[]): void {
  let peak = 0;
  for (const c of ch) for (let i = 0; i < c.length; i++) { const a = Math.abs(c[i]); if (a > peak) peak = a; }
  if (peak < 1e-6) return;
  const g = 1 / peak;
  for (const c of ch) for (let i = 0; i < c.length; i++) c[i] *= g;
}

export class AudioHost {
  ctx: AudioContext | null = null;
  node: AudioWorkletNode | null = null;
  sample: LoadedSample | null = null;
  /** Última telemetría recibida (la leen los canvas en cada frame). */
  tel: Telemetry | null = null;
  onState: (s: AudioState) => void = () => {};
  onSample: (s: LoadedSample) => void = () => {};
  private params = defaultValues();
  private ready: Promise<void> | null = null;

  /** Crea el contexto y carga el worklet. No necesita gesto del usuario (arranca suspendido). */
  ensure(): Promise<void> {
    if (this.ready) return this.ready;
    this.ready = (async () => {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx({ latencyHint: 'interactive' });
      this.ctx = ctx;
      // iOS: que el audio suene aunque el interruptor de silencio esté activado.
      const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
      if (session) { try { session.type = 'playback'; } catch { /* no disponible */ } }
      await ctx.audioWorklet.addModule(workletUrl);
      const node = new AudioWorkletNode(ctx, 'granos', {
        numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2],
      });
      node.port.onmessage = (e: MessageEvent) => { this.tel = e.data as Telemetry; };
      node.connect(ctx.destination);
      this.node = node;
      // Estado inicial completo.
      node.port.postMessage({ t: 'params', a: this.params.slice() } satisfies EngineMsg);
      if (this.sample) this.postSample(this.sample);
      ctx.onstatechange = () => this.onState(this.state());
      // Al volver a primer plano o tras una interrupción, intenta reanudar.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void this.resume();
      });
      this.onState(this.state());
    })();
    return this.ready;
  }

  state(): AudioState {
    if (!this.ctx) return 'off';
    return this.ctx.state === 'running' ? 'running' : 'suspended';
  }

  /** Llamar desde un gesto del usuario: desbloquea o reanuda el audio. */
  async resume(): Promise<void> {
    await this.ensure();
    if (this.ctx && this.ctx.state !== 'running') {
      try { await this.ctx.resume(); } catch { /* iOS puede rechazarlo fuera de un gesto */ }
    }
    this.onState(this.state());
  }

  send(m: EngineMsg, transfer: Transferable[] = []) {
    this.node?.port.postMessage(m, transfer);
  }

  setParam(i: number, v: number) {
    this.params[i] = v;
    this.send({ t: 'param', i, v });
  }

  setAllParams(a: ArrayLike<number>) {
    this.params.set(a);
    this.send({ t: 'params', a: this.params.slice() });
  }

  /** Sustituye el sample (normalizado a 0 dB). Los parámetros no se tocan. */
  setSample(s: LoadedSample) {
    normalize(s.ch);
    this.sample = s;
    this.postSample(s);
    this.onSample(s);
  }

  private postSample(s: LoadedSample) {
    const copy = s.ch.map((c) => c.slice());
    this.send({ t: 'sample', ch: copy, sr: s.sr }, copy.map((c) => c.buffer));
  }

  /** Decodifica un archivo de audio (WAV, AIFF, MP3, M4A…). */
  async decode(data: ArrayBuffer, name: string): Promise<LoadedSample> {
    await this.ensure();
    const buf = await this.ctx!.decodeAudioData(data);
    const ch: Float32Array[] = [];
    for (let c = 0; c < Math.min(2, buf.numberOfChannels); c++) ch.push(buf.getChannelData(c).slice());
    return { name, ch, sr: buf.sampleRate };
  }
}
