
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

class AudioController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      // @ts-ignore - Handle Webkit prefix for Safari support if needed
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // Master volume
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  private resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Sci-fi Data Telemetry Tick (Hover)
  public playHover = () => {
    if (this.isMuted) return;
    this.init();
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // High frequency sine blip
    osc.type = 'sine';
    // Fast frequency modulation for a "chirp" texture
    osc.frequency.setValueAtTime(2200, t);
    osc.frequency.exponentialRampToValueAtTime(2800, t + 0.04);
    
    // Very short, sharp envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.06);
  };

  // Sci-fi Interface Actuation (Click)
  public playClick = () => {
    if (this.isMuted) return;
    this.init();
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    
    // Layer 1: Low mechanical thud (Triangle wave)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(120, t);
    osc1.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    gain1.gain.setValueAtTime(0.6, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    
    // Layer 2: High digital "zipp" (Square wave)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    const filter2 = this.ctx.createBiquadFilter();
    
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(800, t);
    osc2.frequency.exponentialRampToValueAtTime(100, t + 0.1);
    
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(3000, t);
    filter2.frequency.linearRampToValueAtTime(500, t + 0.1);

    gain2.gain.setValueAtTime(0.08, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc1.connect(gain1);
    
    osc2.connect(filter2);
    filter2.connect(gain2);
    
    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);

    osc1.start(t);
    osc1.stop(t + 0.2);
    osc2.start(t);
    osc2.stop(t + 0.2);
  };
  
  // Sci-fi System Online / Access Granted (Success)
  public playSuccess = () => {
    if (this.isMuted) return;
    this.init();
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Futuristic chord sweep
    // E Major 7th chord-ish components for a positive, uplifting sound
    const harmonics = [1, 1.25, 1.5, 2, 4]; // Ratios relative to fundamental
    const fundamental = 330; // E4

    harmonics.forEach((h, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      // Sawtooth gives a rich, synth-like timbre
      osc.type = 'sawtooth';
      
      // Slight detune for chorus effect
      const detune = (Math.random() - 0.5) * 10;
      osc.detune.value = detune;

      // Pitch sweep up
      osc.frequency.setValueAtTime(fundamental * h * 0.5, t); // Start lower
      osc.frequency.exponentialRampToValueAtTime(fundamental * h, t + 0.15); // Sweep up quickly
      
      // Filter sweep (The "Wah" sound)
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, t);
      filter.frequency.exponentialRampToValueAtTime(8000, t + 0.4);
      
      // Volume envelope
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.08 / harmonics.length, t + 0.1); // Attack
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2); // Long decay
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(t);
      osc.stop(t + 1.5);
    });
    
    // Add a shimmering high-end sparkle
    const sparkleOsc = this.ctx.createOscillator();
    const sparkleGain = this.ctx.createGain();
    sparkleOsc.type = 'sine';
    sparkleOsc.frequency.setValueAtTime(2000, t);
    sparkleOsc.frequency.linearRampToValueAtTime(4000, t + 0.5);
    sparkleGain.gain.setValueAtTime(0, t);
    sparkleGain.gain.linearRampToValueAtTime(0.02, t + 0.2);
    sparkleGain.gain.linearRampToValueAtTime(0, t + 0.8);
    
    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(this.masterGain);
    sparkleOsc.start(t);
    sparkleOsc.stop(t + 1);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const audioManager = new AudioController();
