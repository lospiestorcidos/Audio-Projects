// Puente entre la UI y el worklet: crea el AudioContext, lo desbloquea con el primer toque,
// conecta la entrada de audio (micrófono o interfaz) al delay y envía mensajes al motor.
import { defaultValues, type EngineMsg, type Telemetry } from '../shared/params';
import workletUrl from './worklet/processor.ts?worker&url';

export type AudioState = 'off' | 'running' | 'suspended';

export class AudioHost {
  ctx: AudioContext | null = null;
  node: AudioWorkletNode | null = null;
  /** Última telemetría recibida (la leen los canvas en cada frame). */
  tel: Telemetry | null = null;
  onState: (s: AudioState) => void = () => {};
  private params = defaultValues();
  private ready: Promise<void> | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  /** Crea el contexto y carga el worklet. No necesita gesto del usuario (arranca suspendido). */
  ensure(): Promise<void> {
    if (this.ready) return this.ready;
    this.ready = (async () => {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx({ latencyHint: 'interactive' });
      this.ctx = ctx;
      this.setSession('playback');
      await ctx.audioWorklet.addModule(workletUrl);
      const node = new AudioWorkletNode(ctx, 'ecos', {
        numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2],
      });
      node.port.onmessage = (e: MessageEvent) => { this.tel = e.data as Telemetry; };
      node.connect(ctx.destination);
      this.node = node;
      node.port.postMessage({ t: 'params', a: this.params.slice() } satisfies EngineMsg);
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

  send(m: EngineMsg) {
    this.node?.port.postMessage(m);
  }

  setParam(i: number, v: number) {
    this.params[i] = v;
    this.send({ t: 'param', i, v });
  }

  setAllParams(a: ArrayLike<number>) {
    this.params.set(a);
    this.send({ t: 'params', a: this.params.slice() });
  }

  // ---------- Entrada de audio ----------

  /** iOS: 'playback' suena aunque el interruptor de silencio esté puesto; 'play-and-record' permite además grabar. */
  private setSession(type: 'playback' | 'play-and-record') {
    const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (session) { try { session.type = type; } catch { /* no disponible */ } }
  }

  /** Entradas de audio disponibles (los nombres solo aparecen tras conceder el permiso). */
  async listInputs(): Promise<{ id: string; label: string }[]> {
    if (!navigator.mediaDevices?.enumerateDevices) return [];
    const devs = await navigator.mediaDevices.enumerateDevices();
    return devs.filter((d) => d.kind === 'audioinput')
      .map((d, i) => ({ id: d.deviceId, label: d.label || `Entrada ${i + 1}` }));
  }

  /**
   * Conecta una entrada al delay. source = deviceId ('' = entrada por defecto: el micrófono del
   * iPad, el de unos auriculares o una interfaz). Lanza un error si no hay permiso.
   */
  async enableInput(source: string): Promise<void> {
    await this.ensure();
    this.disableInput();
    this.setSession('play-and-record');
    // Sin procesado de voz: queremos la señal tal cual.
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: source ? { exact: source } : undefined,
        echoCancellation: false, noiseSuppression: false, autoGainControl: false,
      },
    });
    this.source = this.ctx!.createMediaStreamSource(this.stream);
    this.source.connect(this.node!);
    await this.resume();
  }

  disableInput() {
    if (this.source) {
      try { this.source.disconnect(); } catch { /* ya desconectado */ }
      this.source = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
      this.setSession('playback');
    }
  }
}
