import { useSettingsStore } from '@/data/settingsStore';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private lastSoundTime: number = 0;
  private minIntervalMs: number = 40; // Prevent overlapping clicks

  private init() {
    if (typeof window === 'undefined') return;
    if (this.ctx) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);

      // Create a 0.2s white noise buffer for tactile piece impacts
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.2);
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } catch {
      // AudioContext unavailable in environment
    }
  }

  private canPlay(): boolean {
    const { soundEnabled, soundVolume } = useSettingsStore.getState();
    if (!soundEnabled || soundVolume <= 0) return false;

    this.init();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const now = performance.now();
    if (now - this.lastSoundTime < this.minIntervalMs) {
      return false;
    }
    this.lastSoundTime = now;

    // Apply master volume
    const vol = Math.max(0, Math.min(1, soundVolume));
    this.masterGain.gain.setValueAtTime(vol * 0.7, this.ctx.currentTime);
    return true;
  }

  /**
   * Move: subtle acoustic wooden snap with short low body resonance
   */
  public move() {
    if (!this.canPlay() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // Low wood thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.05);

    oscGain.gain.setValueAtTime(0.7, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.06);

    // Tactile click burst
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t);
      filter.Q.setValueAtTime(3, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(t);
      noise.stop(t + 0.04);
    }
  }

  /**
   * Capture: heavier, tactile double-impact wooden strike
   */
  public capture() {
    if (!this.canPlay() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // Dual-tone transient
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(260, t);
    osc1.frequency.exponentialRampToValueAtTime(65, t + 0.075);

    gain1.gain.setValueAtTime(0.9, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.085);

    // Filtered noise snap
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, t);
      filter.Q.setValueAtTime(2, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.65, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(t);
      noise.stop(t + 0.065);
    }
  }

  /**
   * Check: distinct high harmonic alert chime with soft decay
   */
  public check() {
    if (!this.canPlay() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const playTone = (freq: number, delay: number, dur: number) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0.4, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + delay);
      osc.stop(t + delay + dur + 0.01);
    };

    playTone(1046.5, 0, 0.22); // C6
    playTone(1318.5, 0.03, 0.26); // E6
  }

  /**
   * Castle: rapid double-tap wood clack
   */
  public castle() {
    this.move();
    setTimeout(() => {
      this.move();
    }, 90);
  }

  /**
   * Promote: cheerful rising arpeggio
   */
  public promote() {
    if (!this.canPlay() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const startTime = t + idx * 0.055;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.16);
    });
  }

  /**
   * Illegal move: dampened double buzz / rejection thud
   */
  public illegal() {
    if (!this.canPlay() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(110, t + 0.08);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.17);
  }

  /**
   * Game End: pleasant final chord resolution
   */
  public gameEnd() {
    if (!this.canPlay() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const chord = [392.0, 493.88, 587.33, 783.99]; // G major

    chord.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.7);
    });
  }

  /**
   * Puzzle Correct: bright celebratory bell chime
   */
  public puzzleCorrect() {
    if (!this.canPlay() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const notes = [698.46, 880.0, 1046.5]; // F5, A5, C6

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const startTime = t + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.32);
    });
  }

  /**
   * Puzzle Wrong: gentle descending minor thud
   */
  public puzzleWrong() {
    if (!this.canPlay() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.18);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }
}

export const sound = new SoundEngine();
