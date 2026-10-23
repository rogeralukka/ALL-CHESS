import { useSettingsStore } from '@/data/settingsStore';

export type SoundType =
  | 'move'
  | 'capture'
  | 'check'
  | 'castle'
  | 'promote'
  | 'illegal'
  | 'game_start'
  | 'game_end'
  | 'puzzle_correct'
  | 'puzzle_wrong';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private buffers: Map<SoundType, AudioBuffer> = new Map();
  private loadingPromises: Map<SoundType, Promise<AudioBuffer | null>> = new Map();
  private lastSoundTime: number = 0;
  private minIntervalMs: number = 40; // Never play two board sounds within 40ms
  private unlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // In test environment, mark unlocked immediately
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
        this.unlocked = true;
      }

      // Unlock AudioContext on the first user gesture
      const unlock = () => {
        if (this.unlocked) return;
        this.unlocked = true;
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        this.preloadAll();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('pointerup', unlock);
        window.removeEventListener('click', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
      };

      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('pointerup', unlock, { passive: true });
      window.addEventListener('click', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
    }
  }

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.unlocked) return;
    if (this.ctx) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Preload a single sound buffer with MP3 -> OGG fallback
   */
  private async loadSound(name: SoundType): Promise<AudioBuffer | null> {
    if (this.buffers.has(name)) return this.buffers.get(name)!;
    if (this.loadingPromises.has(name)) return this.loadingPromises.get(name)!;

    const promise = (async () => {
      this.init();
      if (!this.ctx) return null;

      const formats = ['mp3', 'ogg'];
      for (const ext of formats) {
        try {
          const res = await fetch(`/assets/sound/${name}.${ext}`);
          if (!res.ok) continue;
          const arrayBuffer = await res.arrayBuffer();
          const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
          this.buffers.set(name, audioBuffer);
          return audioBuffer;
        } catch {
          // Try next format
        }
      }
      return null;
    })();

    this.loadingPromises.set(name, promise);
    return promise;
  }

  /**
   * Preload all recorded CC0 audio samples into memory
   */
  public preloadAll() {
    const allSounds: SoundType[] = [
      'move',
      'capture',
      'check',
      'castle',
      'promote',
      'illegal',
      'game_start',
      'game_end',
      'puzzle_correct',
      'puzzle_wrong',
    ];
    allSounds.forEach((s) => this.loadSound(s).catch(() => {}));
  }

  private canPlay(): boolean {
    if (!this.unlocked) return false;
    const { soundEnabled, soundVolume } = useSettingsStore.getState();
    if (!soundEnabled || soundVolume <= 0) return false;

    this.init();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const now = performance.now();
    if (now - this.lastSoundTime < this.minIntervalMs) {
      return false; // Prevent overlapping within 40ms
    }
    this.lastSoundTime = now;

    // Apply master volume normalized to -16 LUFS baseline
    const vol = Math.max(0, Math.min(1, soundVolume));
    this.masterGain.gain.setValueAtTime(vol * 0.85, this.ctx.currentTime);
    return true;
  }

  /**
   * Calculate stereo pan (-0.15 to +0.15) based on file letter ('a'..'h')
   */
  private getPanForFileOrSquare(fileOrSquare?: string): number {
    if (!fileOrSquare) return 0;
    const fileChar = fileOrSquare.trim().toLowerCase()[0];
    const fileIndex = 'abcdefgh'.indexOf(fileChar);
    if (fileIndex < 0) return 0;
    // Map index 0..7 to -0.15 .. +0.15
    return -0.15 + (fileIndex / 7) * 0.3;
  }

  /**
   * Play a recorded sample buffer with optional stereo pan
   */
  private playBuffer(buffer: AudioBuffer, pan: number = 0) {
    if (!this.ctx || !this.masterGain) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    if (this.ctx.createStereoPanner && pan !== 0) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(pan, this.ctx.currentTime);
      source.connect(panner);
      panner.connect(this.masterGain);
    } else {
      source.connect(this.masterGain);
    }

    source.start();
  }

  /**
   * Play named sound effect
   */
  public async play(type: SoundType, fileOrSquare?: string) {
    if (!this.canPlay() || !this.ctx) return;
    const pan = this.getPanForFileOrSquare(fileOrSquare);

    let buffer = this.buffers.get(type);
    if (!buffer) {
      buffer = (await this.loadSound(type)) || undefined;
    }

    if (buffer) {
      this.playBuffer(buffer, pan);
    } else {
      // Fallback synthetic acoustic sound if buffer failed to decode
      this.playSyntheticFallback(type);
    }
  }

  /**
   * Fallback synthesis if recorded sample has not finished loading
   */
  private playSyntheticFallback(type: SoundType) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'move' || type === 'castle') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.05);
      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    } else if (type === 'capture') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.07);
      gain.gain.setValueAtTime(0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    } else if (type === 'check') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, t);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    } else if (type === 'illegal' || type === 'puzzle_wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, t);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, t);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // --- Public convenience methods matching original API ---

  public move(fileOrSquare?: string) {
    this.play('move', fileOrSquare);
  }

  public capture(fileOrSquare?: string) {
    this.play('capture', fileOrSquare);
  }

  public check(fileOrSquare?: string) {
    this.play('check', fileOrSquare);
  }

  public castle() {
    this.play('castle');
  }

  public promote(fileOrSquare?: string) {
    this.play('promote', fileOrSquare);
  }

  public illegal() {
    this.play('illegal');
  }

  public gameStart() {
    this.play('game_start');
  }

  public gameEnd() {
    this.play('game_end');
  }

  public puzzleCorrect() {
    this.play('puzzle_correct');
  }

  public puzzleWrong() {
    this.play('puzzle_wrong');
  }
}

export const sound = new SoundEngine();
