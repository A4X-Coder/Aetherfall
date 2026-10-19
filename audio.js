/**
 * Aetherfall ASMR Sound Synthesis Engine
 * Pure procedural Web Audio API - glassy, subtle, organic, relaxing
 */
class AetherAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.ambientGain = null;

    this.masterVolume = parseFloat(localStorage.getItem('aether_vol_master') ?? 0.8);
    this.sfxVolume = parseFloat(localStorage.getItem('aether_vol_sfx') ?? 0.8);
    this.musicVolume = parseFloat(localStorage.getItem('aether_vol_music') ?? 0.45);
    this.isMuted = localStorage.getItem('aether_muted') === 'true';

    this.ambientNodes = [];
    this.isInitialized = false;

    // Pentatonic frequencies for musical match resolution (ASMR calming tones)
    this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
  }

  init() {
    if (this.isInitialized) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    this.startAmbient();
    this.isInitialized = true;
  }

  setMaster(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    localStorage.setItem('aether_vol_master', this.masterVolume);
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.04);
    }
  }

  setSfx(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    localStorage.setItem('aether_vol_sfx', this.sfxVolume);
    if (this.sfxGain) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.04);
    }
  }

  setMusic(val) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    localStorage.setItem('aether_vol_music', this.musicVolume);
    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.04);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('aether_muted', this.isMuted);
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime, 0.04);
    }
    return this.isMuted;
  }

  // 1. Crystal Selection / Touch Feedback
  playSelect() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880 + (Math.random() * 60 - 30), now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(6, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // 2. Crystal Swap Sound
  playSwap() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // 3. Invalid Swap Rebound (Soft low wood/glass chime)
  playInvalid() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(170, now + 0.14);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  // 4. Crystal Match & Cascade (Pentatonic Harmonic Shimmer)
  playMatch(combo = 1, matchCount = 3) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const baseIndex = Math.min(this.scale.length - 1, 2 + (combo - 1) * 2);
    const freq1 = this.scale[baseIndex];
    const freq2 = this.scale[Math.min(this.scale.length - 1, baseIndex + 2)];

    [freq1, freq2].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.035);

      const duration = 0.45 + (matchCount > 3 ? 0.2 : 0);
      gain.gain.setValueAtTime(0.001, now + idx * 0.035);
      gain.gain.linearRampToValueAtTime(0.16 / (idx + 1), now + idx * 0.035 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + duration);

      if (panner) {
        panner.pan.setValueAtTime(idx === 0 ? -0.2 : 0.2, now);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.sfxGain);
      } else {
        osc.connect(gain);
        gain.connect(this.sfxGain);
      }

      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + duration + 0.05);
    });
  }

  // 5. Crystal Landing / Fall Drop
  playLand() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320 + Math.random() * 40, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // 6. Special Crystal Creation / Beam Laser Activation
  playSpecial() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  // 7. Victory Sound
  playWin() {
    if (!this.ctx || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.75);
      }, i * 110);
    });
  }

  // 8. Level Failure Sound (Gentle, non-punitive)
  playLose() {
    if (!this.ctx || this.isMuted) return;
    const notes = [392.00, 329.63, 261.63];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.14, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.55);
      }, i * 160);
    });
  }

  // Background Ambient Cosmic Texture (Dual Detuned Breathing Drone)
  startAmbient() {
    if (!this.ctx || this.ambientNodes.length > 0) return;

    const freqs = [110.0, 110.45, 164.81]; // A2 + harmonic fifth
    freqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc.start();
      this.ambientNodes.push({ osc, gain, filter });
    });

    // LFO Modulation for gentle celestial breathing
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 12.5s cycle
    lfoGain.gain.setValueAtTime(70, this.ctx.currentTime);

    lfo.connect(lfoGain);
    this.ambientNodes.forEach(n => lfoGain.connect(n.filter.frequency));
    lfo.start();
    this.ambientNodes.push({ osc: lfo, gain: lfoGain });
  }
}

window.aetherAudio = new AetherAudio();