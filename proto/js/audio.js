// Globetrotter — Web Audio-ljudmotor (syntetiserade 90-talsljud & foley)

(function () {
  'use strict';

  const AudioMgr = {
    enabled: true,
    ctx: null,
    getCtx() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return this.ctx;
    },
    tone(freq, startOffset, dur, type = 'sine', vol = 0.12, endFreq = null) {
      const ctx = this.getCtx();
      if (!ctx) return;
      const t = ctx.currentTime + startOffset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + Math.min(0.015, dur * 0.2));
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },
    noise(dur, filterFreq, vol = 0.14, filterType = 'bandpass', startOffset = 0) {
      const ctx = this.getCtx();
      if (!ctx) return;
      const t = ctx.currentTime + startOffset;
      const bufLen = Math.max(1, Math.floor(ctx.sampleRate * dur));
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        const env = Math.sin((i / bufLen) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * vol;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value = filterFreq;
      src.connect(filter);
      filter.connect(ctx.destination);
      src.start(t);
    },
    play(soundName) {
      if (!this.enabled) return;
      try {
        switch (soundName) {
          case 'klick':
            this.tone(620, 0, 0.035, 'triangle', 0.11, 240);
            break;
          case 'paper':
            this.noise(0.14, 1850, 0.18, 'bandpass');
            break;
          case 'flap':
            [0, 0.055, 0.115].forEach(o => this.tone(520, o, 0.04, 'triangle', 0.13, 140));
            break;
          case 'clink':
            this.tone(1680, 0, 0.34, 'sine', 0.11);
            this.tone(2520, 0.03, 0.36, 'sine', 0.09);
            break;
          case 'stamp':
            this.tone(155, 0, 0.15, 'sine', 0.30, 44);
            this.noise(0.06, 600, 0.12, 'lowpass', 0.02);
            break;
          case 'bell':
            this.tone(1318, 0, 0.75, 'sine', 0.14);
            this.tone(2637, 0, 0.55, 'sine', 0.07);
            this.tone(3951, 0, 0.30, 'sine', 0.04);
            break;
          case 'cash':
          case 'cash_in':
            this.tone(1046, 0, 0.12, 'triangle', 0.11);
            this.tone(1568, 0.07, 0.22, 'sine', 0.12);
            break;
          case 'cash_out':
            this.tone(784, 0, 0.09, 'triangle', 0.09);
            this.tone(587, 0.06, 0.14, 'triangle', 0.09);
            break;
          case 'right1':
          case 'right2':
            this.tone(523, 0, 0.14, 'triangle', 0.12);
            this.tone(659, 0.07, 0.16, 'triangle', 0.12);
            this.tone(784, 0.14, 0.26, 'sine', 0.13);
            break;
          case 'wrong1':
          case 'wrong2':
            this.tone(290, 0, 0.16, 'triangle', 0.11, 240);
            this.tone(220, 0.12, 0.24, 'triangle', 0.11, 185);
            break;
          case 'fanfar':
            this.tone(523, 0, 0.14, 'triangle', 0.13);
            this.tone(659, 0.11, 0.14, 'triangle', 0.13);
            this.tone(784, 0.22, 0.16, 'triangle', 0.14);
            this.tone(1046, 0.34, 0.48, 'triangle', 0.16);
            break;
          case 'hotel':
            this.tone(523, 0, 0.25, 'sine', 0.10);
            this.tone(659, 0.18, 0.25, 'sine', 0.10);
            this.tone(587, 0.36, 0.42, 'sine', 0.09);
            break;
          case 'sight':
            this.tone(440, 0, 0.10, 'sine', 0.09);
            this.tone(660, 0.08, 0.18, 'sine', 0.10);
            break;
          case 'time':
            this.tone(920, 0, 0.025, 'sine', 0.07, 620);
            break;
          case 'takeoff':
            this.noise(1.1, 420, 0.12, 'lowpass');
            this.tone(130, 0, 0.95, 'sawtooth', 0.035, 290);
            break;
          case 'ferry':
            this.tone(98, 0, 0.95, 'sawtooth', 0.055, 92);
            this.tone(147, 0.04, 0.90, 'triangle', 0.05, 140);
            break;
          default:
            this.tone(520, 0, 0.05, 'triangle', 0.08);
        }
      } catch (e) {}
    },
    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  };

  window.GT_AUDIO = AudioMgr;
})();
