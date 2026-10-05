/**
 * Web Audio API based Sound Engine for TickTen
 * Generates zero-latency synthetic beeps and subtle tick sounds
 * without needing external audio asset downloads.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private beepVolume: number = 0.8;
  private tickVolume: number = 0.3;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch((err) => console.warn('Failed to resume AudioContext:', err));
    }
    return this.ctx;
  }

  /**
   * Must be called during a user gesture (e.g., clicking Start or Test button)
   * to comply with browser autoplay policies.
   */
  public async unlock(): Promise<boolean> {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      return ctx.state === 'running';
    } catch (e) {
      console.error('Audio unlock error:', e);
      return false;
    }
  }

  /**
   * Plays a subtle, very soft 1-second tick sound.
   */
  public playTick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft high-frequency ping / woodblock-like tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

      const targetGain = Math.max(0.001, this.masterVolume * this.tickVolume * 0.25);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      console.warn('Tick playback error:', e);
    }
  }

  /**
   * Plays the prominent interval beep (e.g. at 10s, 20s, 30s...).
   * Uses a dual-frequency pleasant chime (880Hz + 1760Hz harmonic) for clarity.
   */
  public playBeep(customFreq?: number): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 0.18; // 180ms

      const fundamentalFreq = customFreq || 880; // A5 tone

      // Primary tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(fundamentalFreq, now);

      // Harmonic overtone for crisp presence in noisy workout spaces
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(fundamentalFreq * 2, now);

      const baseVolume = this.masterVolume * this.beepVolume;
      const primaryGain = Math.max(0.001, baseVolume * 0.6);
      const overtoneGain = Math.max(0.001, baseVolume * 0.15);

      // Gain envelope for primary tone (smooth attack & release)
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(primaryGain, now + 0.015);
      gain1.gain.setValueAtTime(primaryGain, now + duration - 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Gain envelope for overtone
      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.linearRampToValueAtTime(overtoneGain, now + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.01);
      osc2.stop(now + duration + 0.01);
    } catch (e) {
      console.warn('Beep playback error:', e);
    }
  }

  /**
   * Double beep for milestone/goal complete (e.g. 60s or target)
   */
  public playDoubleBeep(): void {
    this.playBeep(880);
    setTimeout(() => {
      this.playBeep(1174.66); // D6
    }, 180);
  }

  // Volume & Settings
  public setMasterVolume(v: number): void {
    this.masterVolume = Math.max(0, Math.min(1, v));
  }

  public setBeepVolume(v: number): void {
    this.beepVolume = Math.max(0, Math.min(1, v));
  }

  public setTickVolume(v: number): void {
    this.tickVolume = Math.max(0, Math.min(1, v));
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public getSettings() {
    return {
      masterVolume: this.masterVolume,
      beepVolume: this.beepVolume,
      tickVolume: this.tickVolume,
      isMuted: this.isMuted,
    };
  }
}

export const audioEngine = new AudioEngine();
