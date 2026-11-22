// Globetrotter - Regional Bakgrundsmusik & Atmosfäriskt Stadssorl (Web Audio API)
// Skapar mjuk regional stämningsmusik och levande ljudkulisser för stad, flygplats,
// tågstation, oceanhamn, hotellbar och basar — helt utan externa ljudfiler.

(function () {
  'use strict';

  const REGION_SCALES = {
    'Europa':       { root: 220, notes: [0, 2, 4, 7, 9, 12, 14], wave: 'triangle', tempo: 1900 },
    'Afrika':       { root: 196, notes: [0, 1, 4, 5, 7, 8, 12],  wave: 'sine',     tempo: 1650 },
    'Asien':        { root: 247, notes: [0, 2, 5, 7, 10, 12],    wave: 'triangle', tempo: 2100 },
    'Oceanien':     { root: 261, notes: [0, 2, 4, 6, 7, 11, 12], wave: 'sine',     tempo: 2000 },
    'Nordamerika':  { root: 233, notes: [0, 3, 5, 7, 10, 12],    wave: 'triangle', tempo: 1750 },
    'Sydamerika':   { root: 207, notes: [0, 2, 4, 7, 9, 11, 12], wave: 'triangle', tempo: 1450 }
  };

  const SCENE_NOISE = {
    city:    { freq: 420,  q: 0.7, gain: 0.022 },
    airport: { freq: 680,  q: 1.1, gain: 0.032 },
    train:   { freq: 340,  q: 0.9, gain: 0.034 },
    harbor:  { freq: 260,  q: 0.6, gain: 0.036 },
    hotel:   { freq: 520,  q: 1.3, gain: 0.026 },
    bazaar:  { freq: 920,  q: 1.0, gain: 0.030 },
    wonder:  { freq: 300,  q: 0.5, gain: 0.020 }
  };

  const AmbientMgr = {
    ctx: null,
    masterGain: null,
    noiseFilter: null,
    noiseGain: null,
    enabled: true,
    started: false,
    scene: 'city',
    region: 'Europa',
    musicTimer: null,
    accentTimer: null,
    stepIdx: 0,

    init() {
      if (this.started) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.enabled ? 0.55 : 0.0;
        this.masterGain.connect(this.ctx.destination);

        // Kontinuerligt mjukt pink-noise-sorl filtrerat efter aktuell miljö
        const bufSize = this.ctx.sampleRate * 3;
        const noiseBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const out = noiseBuf.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }
        const src = this.ctx.createBufferSource();
        src.buffer = noiseBuf;
        src.loop = true;

        this.noiseFilter = this.ctx.createBiquadFilter();
        this.noiseFilter.type = 'bandpass';
        this.noiseFilter.frequency.value = 420;
        this.noiseFilter.Q.value = 0.7;

        this.noiseGain = this.ctx.createGain();
        this.noiseGain.gain.value = 0.022;

        src.connect(this.noiseFilter);
        this.noiseFilter.connect(this.noiseGain);
        this.noiseGain.connect(this.masterGain);
        src.start();

        this.started = true;
        this.applySceneFilter();
        this.scheduleMusic();
        this.scheduleAccent();
      } catch (e) {}
    },

    setEnabled(on) {
      this.enabled = Boolean(on);
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.enabled ? 0.55 : 0.0, this.ctx.currentTime, 0.25);
      }
    },

    setScene(scene, region = null) {
      if (scene) this.scene = scene;
      if (region) this.region = region;
      if (this.started) {
        this.applySceneFilter();
      }
    },

    applySceneFilter() {
      if (!this.ctx || !this.noiseFilter || !this.noiseGain) return;
      const cfg = SCENE_NOISE[this.scene] || SCENE_NOISE.city;
      const now = this.ctx.currentTime;
      this.noiseFilter.frequency.setTargetAtTime(cfg.freq, now, 0.4);
      this.noiseFilter.Q.setTargetAtTime(cfg.q, now, 0.4);
      this.noiseGain.gain.setTargetAtTime(cfg.gain, now, 0.4);
    },

    playSoftNote(freq, dur, vol, wave = 'triangle') {
      if (!this.ctx || !this.enabled || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(vol, now + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + dur + 0.05);
    },

    scheduleMusic() {
      if (this.musicTimer) clearTimeout(this.musicTimer);
      const scale = REGION_SCALES[this.region] || REGION_SCALES['Europa'];
      const delay = scale.tempo + Math.round((Math.random() - 0.5) * 450);
      this.musicTimer = setTimeout(() => {
        if (this.enabled && this.ctx && this.ctx.state === 'running') {
          const semi = scale.notes[Math.floor(Math.random() * scale.notes.length)];
          const freq = scale.root * Math.pow(2, semi / 12);
          // Mjuk melodi-plockning
          this.playSoftNote(freq, 1.8, 0.036, scale.wave);
          // Vart fjärde slag: mjuk bas-klang som ger värme
          if (this.stepIdx % 4 === 0) {
            this.playSoftNote(scale.root * 0.5, 3.2, 0.028, 'sine');
          }
          this.stepIdx++;
        }
        this.scheduleMusic();
      }, delay);
    },

    scheduleAccent() {
      if (this.accentTimer) clearTimeout(this.accentTimer);
      const delay = 5200 + Math.round(Math.random() * 4800);
      this.accentTimer = setTimeout(() => {
        if (this.enabled && this.ctx && this.ctx.state === 'running') {
          if (this.scene === 'airport') {
            // Diskret 2-tons flygplats-pling (bing-bong)
            this.playSoftNote(587.3, 0.55, 0.032, 'sine');
            setTimeout(() => this.playSoftNote(440.0, 0.85, 0.030, 'sine'), 340);
          } else if (this.scene === 'train') {
            // Diskret räls-dunk (ka-dunk)
            this.playSoftNote(110, 0.14, 0.038, 'triangle');
            setTimeout(() => this.playSoftNote(98, 0.16, 0.034, 'triangle'), 160);
          } else if (this.scene === 'harbor') {
            // Mjuk vågsvallning på filtret
            if (this.noiseGain) {
              const now = this.ctx.currentTime;
              this.noiseGain.gain.linearRampToValueAtTime(0.052, now + 1.4);
              this.noiseGain.gain.linearRampToValueAtTime(0.026, now + 3.2);
            }
          }
        }
        this.scheduleAccent();
      }, delay);
    }
  };

  // Starta mjukt vid spelarens första klick (krävs av webbläsares autoplay-policy)
  const unlock = () => {
    AmbientMgr.init();
    if (AmbientMgr.ctx && AmbientMgr.ctx.state === 'suspended') {
      AmbientMgr.ctx.resume().catch(() => {});
    }
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);

  window.AmbientMgr = AmbientMgr;
})();
