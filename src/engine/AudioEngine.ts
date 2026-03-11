export class AudioEngine {
  private ctx: AudioContext | null = null;
  private boringBuffer: AudioBuffer | null = null;
  private massBuffer: AudioBuffer | null = null;
  private boringSource: AudioBufferSourceNode | null = null;
  private massSource: AudioBufferSourceNode | null = null;
  private boringGain: GainNode | null = null;
  private massGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isBoringPlaying = false;
  private isMassPlaying = false;

  async init(): Promise<void> {
    this.ctx = new AudioContext();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.connect(this.ctx.destination);
  }

  async preload(boringUrl: string, massUrl: string): Promise<void> {
    if (!this.ctx) await this.init();
    const ctx = this.ctx!;

    const [boringResp, massResp] = await Promise.all([
      fetch(boringUrl),
      fetch(massUrl),
    ]);

    const [boringData, massData] = await Promise.all([
      boringResp.arrayBuffer(),
      massResp.arrayBuffer(),
    ]);

    this.boringBuffer = await ctx.decodeAudioData(boringData);
    this.massBuffer = await ctx.decodeAudioData(massData);
  }

  playBoring(): void {
    if (!this.ctx || !this.boringBuffer || this.isBoringPlaying) return;

    this.boringSource = this.ctx.createBufferSource();
    this.boringSource.buffer = this.boringBuffer;
    this.boringSource.loop = true;

    this.boringGain = this.ctx.createGain();
    this.boringGain.gain.value = 0.35;

    this.boringSource.connect(this.boringGain);
    this.boringGain.connect(this.ctx.destination);
    this.boringSource.start(0);
    this.isBoringPlaying = true;
  }

  async tapeStop(): Promise<void> {
    if (!this.ctx || !this.boringSource || !this.boringGain) return;

    const now = this.ctx.currentTime;
    const duration = 0.8;

    // Pitch ramp down (tape stop effect)
    this.boringSource.playbackRate.setValueAtTime(1, now);
    this.boringSource.playbackRate.linearRampToValueAtTime(0.01, now + duration);

    // Volume fade
    this.boringGain.gain.setValueAtTime(this.boringGain.gain.value, now);
    this.boringGain.gain.linearRampToValueAtTime(0, now + duration);

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          this.boringSource?.stop();
        } catch { /* already stopped */ }
        this.isBoringPlaying = false;
        resolve();
      }, duration * 1000);
    });
  }

  playMass(): void {
    if (!this.ctx || !this.massBuffer || this.isMassPlaying) return;

    this.massSource = this.ctx.createBufferSource();
    this.massSource.buffer = this.massBuffer;
    this.massSource.loop = true;

    this.massGain = this.ctx.createGain();
    this.massGain.gain.value = 1.0;

    this.massSource.connect(this.massGain);
    this.massGain.connect(this.analyser!);
    this.massSource.start(0);
    this.isMassPlaying = true;
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  resume(): void {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  destroy(): void {
    try { this.boringSource?.stop(); } catch { /* */ }
    try { this.massSource?.stop(); } catch { /* */ }
    this.ctx?.close();
    this.ctx = null;
  }
}

// Singleton
let instance: AudioEngine | null = null;
export function getAudioEngine(): AudioEngine {
  if (!instance) {
    instance = new AudioEngine();
  }
  return instance;
}
