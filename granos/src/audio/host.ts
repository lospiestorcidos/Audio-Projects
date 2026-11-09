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

  // --- Capture ---
  /** Nivel de pico de la entrada de Capture (0..1). */
  inputLevel = 0;
  private capNode: AudioWorkletNode | null = null;
  private capStream: MediaStream | null = null;
  private capSource: AudioNode | null = null;
  private capLength = 8;
  private grabWaiters: ((r: { ch: Float32Array[] | null; sr: number }) => void)[] = [];

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

  // ---------- Capture ----------

  /** Entradas de audio disponibles (los nombres solo aparecen tras conceder el permiso). */
  async listInputs(): Promise<{ id: string; label: string }[]> {
    if (!navigator.mediaDevices?.enumerateDevices) return [];
    const devs = await navigator.mediaDevices.enumerateDevices();
    return devs.filter((d) => d.kind === 'audioinput')
      .map((d, i) => ({ id: d.deviceId, label: d.label || `Entrada ${i + 1}` }));
  }

  private setSession(type: 'playback' | 'play-and-record') {
    const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (session) { try { session.type = type; } catch { /* no disponible */ } }
  }

  /**
   * Activa la grabación permanente. source: 'resample' (la salida del sinte) o el deviceId de una
   * entrada ('' = micrófono por defecto). Lanza un error si no hay permiso de micrófono.
   */
  async enableCapture(source: string): Promise<void> {
    await this.ensure();
    this.disableCapture();
    const ctx = this.ctx!;
    if (!this.capNode) {
      this.capNode = new AudioWorkletNode(ctx, 'granos-capture', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1] });
      this.capNode.port.onmessage = (e: MessageEvent) => {
        const m = e.data as { t: 'level'; v: number } | { t: 'grab'; ch: Float32Array[] | null; sr: number };
        if (m.t === 'level') this.inputLevel = m.v;
        else this.grabWaiters.splice(0).forEach((w) => w({ ch: m.ch, sr: m.sr }));
      };
      // Un nodo sin salida conectada no se procesa: se conecta en silencio al destino.
      const mute = ctx.createGain();
      mute.gain.value = 0;
      this.capNode.connect(mute).connect(ctx.destination);
      this.capNode.port.postMessage({ t: 'len', seconds: this.capLength });
    }
    this.capNode.port.postMessage({ t: 'clear' });
    if (source === 'resample') {
      this.capSource = this.node!;
      this.node!.connect(this.capNode);
      return;
    }
    this.setSession('play-and-record');
    // Sin procesado de voz: queremos la señal tal cual (micrófono o interfaz USB).
    this.capStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: source ? { exact: source } : undefined,
        echoCancellation: false, noiseSuppression: false, autoGainControl: false,
      },
    });
    this.capSource = ctx.createMediaStreamSource(this.capStream);
    this.capSource.connect(this.capNode);
    await this.resume();
  }

  disableCapture() {
    if (this.capSource && this.capNode) {
      try { this.capSource.disconnect(this.capNode); } catch { /* ya desconectado */ }
    }
    this.capSource = null;
    if (this.capStream) {
      this.capStream.getTracks().forEach((t) => t.stop());
      this.capStream = null;
      this.setSession('playback');
    }
    this.inputLevel = 0;
  }

  setCaptureLength(seconds: number) {
    this.capLength = seconds;
    this.capNode?.port.postMessage({ t: 'len', seconds });
  }

  /** Devuelve los últimos segundos grabados (sin normalizar), o null si no hay nada. */
  grabCapture(): Promise<{ ch: Float32Array[] | null; sr: number }> {
    if (!this.capNode) return Promise.resolve({ ch: null, sr: 0 });
    return new Promise((resolve) => {
      this.grabWaiters.push(resolve);
      this.capNode!.port.postMessage({ t: 'grab' });
    });
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
