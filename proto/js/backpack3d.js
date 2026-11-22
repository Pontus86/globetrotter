// Globetrotter - 3D Väskor & Ryggsäckar i 4 nivåer (WebGL)
// Tier 1 (2 platser): Juicy Couture Daydreamer Bag (Sketchfab)
// Tier 2 (5 platser): Yellow Backpack av Jungle Jim (Sketchfab, CC BY)
// Tier 3 (7 platser): Duffle Bag av MadeByYeshe (Sketchfab, CC BY)
// Tier 4 (9 platser): Vandringsryggsäck av DailyArt (Sketchfab, CC BY-NC)

(function () {
  'use strict';

  const TIER_SPECS = {
    1: {
      mesh: 'assets/models/backpack_tier0.bin',
      tex: 'assets/models/tier0_juicy_atlas.jpg',
      zoomMult: 1.02
    },
    2: {
      mesh: 'assets/models/backpack_tier1.bin',
      tex: 'assets/models/tier1_yellow_tex.jpg',
      zoomMult: 0.96
    },
    3: {
      mesh: 'assets/models/backpack_tier2.bin',
      tex: 'assets/models/tier2_duffle_atlas.jpg',
      zoomMult: 1.04
    },
    4: {
      mesh: 'assets/models/backpack_dailyart.bin',
      tex: 'assets/models/dailyart_backpack_atlas.jpg',
      zoomMult: 1.0
    }
  };

  const VERT_SRC = `
    attribute vec3 a_pos;
    attribute vec3 a_norm;
    attribute vec2 a_uv;

    uniform mat4 u_mvp;
    uniform mat3 u_normMat;

    varying vec3 v_norm;
    varying vec2 v_uv;

    void main() {
      v_norm = normalize(u_normMat * a_norm);
      v_uv = a_uv;
      gl_Position = u_mvp * vec4(a_pos, 1.0);
    }
  `;

  const FRAG_SRC = `
    precision mediump float;

    uniform sampler2D u_tex;

    varying vec3 v_norm;
    varying vec2 v_uv;

    void main() {
      vec3 N = normalize(v_norm);
      vec3 L1 = normalize(vec3(-0.55, 0.72, 0.85));
      vec3 L2 = normalize(vec3(0.75, -0.10, 0.45));
      vec3 V  = vec3(0.0, 0.0, 1.0);

      float d1 = max(dot(N, L1), 0.0);
      float d2 = max(dot(N, L2), 0.0);

      vec3 albedo = texture2D(u_tex, v_uv).rgb;

      vec3 H = normalize(L1 + V);
      float spec = pow(max(dot(N, H), 0.0), 28.0) * 0.18;
      float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.24;

      vec3 col = albedo * (0.42 + 0.70 * d1 + 0.22 * d2)
               + vec3(1.0, 0.96, 0.90) * spec
               + vec3(0.95, 0.86, 0.70) * rim;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  // Delad cache per tier så varje 3D-modell bara laddas en gång
  const TIER_CACHE = {};

  function normalizeTier(t) {
    const n = Number(t) || 1;
    if (n <= 1) return 1;
    if (n === 2) return 2;
    if (n === 3) return 3;
    return 4;
  }

  function ensureTierLoaded(tier, cb) {
    const t = normalizeTier(tier);
    if (!TIER_CACHE[t]) {
      TIER_CACHE[t] = { loading: false, ready: false, verts: null, indices: null, image: null, listeners: [] };
    }
    const entry = TIER_CACHE[t];
    if (entry.ready) {
      if (cb) cb(entry);
      return;
    }
    if (cb) entry.listeners.push(cb);
    if (entry.loading) return;
    entry.loading = true;

    const spec = TIER_SPECS[t];
    const meshPromise = fetch(spec.mesh)
      .then(r => r.arrayBuffer())
      .then(buf => {
        const header = new Uint32Array(buf, 0, 2);
        const vertCount = header[0];
        const idxCount = header[1];
        const vByteLen = vertCount * 8 * 4;
        entry.verts = new Float32Array(buf, 8, vertCount * 8);
        entry.indices = new Uint16Array(buf, 8 + vByteLen, idxCount);
      });

    const texPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        entry.image = img;
        resolve();
      };
      img.onerror = reject;
      img.src = spec.tex;
    });

    Promise.all([meshPromise, texPromise])
      .then(() => {
        entry.ready = true;
        entry.listeners.forEach(fn => { try { fn(entry); } catch (e) {} });
        entry.listeners = [];
      })
      .catch(err => {
        console.warn(`Kunde inte ladda ryggsäck tier ${t}:`, err);
      });
  }

  // Förladda Tier 1 direkt vid start
  ensureTierLoaded(1);

  function makeMVP(yaw, pitch, aspect, zoom) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);

    const r00 = cy,       r01 = sy * sp,  r02 = sy * cp;
    const r10 = 0,        r11 = cp,       r12 = -sp;
    const r20 = -sy,      r21 = cy * sp,  r22 = cy * cp;

    const fov = 34 * Math.PI / 180;
    const f = 1.0 / Math.tan(fov / 2);
    const near = 0.2, far = 20.0;
    const tz = -zoom;

    const mvp = new Float32Array(16);
    const a = f / aspect;
    const nf = 1 / (near - far);

    mvp[0]  = a * r00;
    mvp[1]  = f * r10;
    mvp[2]  = (far + near) * nf * r20;
    mvp[3]  = -r20;

    mvp[4]  = a * r01;
    mvp[5]  = f * r11;
    mvp[6]  = (far + near) * nf * r21;
    mvp[7]  = -r21;

    mvp[8]  = a * r02;
    mvp[9]  = f * r12;
    mvp[10] = (far + near) * nf * r22;
    mvp[11] = -r22;

    mvp[12] = 0;
    mvp[13] = 0;
    mvp[14] = (far + near) * nf * tz + 2 * far * near * nf;
    mvp[15] = -tz;

    const normMat = new Float32Array([
      r00, r10, r20,
      r01, r11, r21,
      r02, r12, r22
    ]);

    return { mvp, normMat };
  }

  class Backpack3DRenderer {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.interactive = Boolean(options.interactive);
      this.baseZoom = options.zoom || 3.4;
      this.tier = normalizeTier(options.tier || 1);
      this.yaw = options.yaw !== undefined ? options.yaw : 0.35;
      this.pitch = options.pitch !== undefined ? options.pitch : 0.14;
      this.speed = options.speed !== undefined ? options.speed : 0.013;
      this.isDragging = false;
      this.lastX = 0;
      this.lastY = 0;
      this.uploadedTier = null;
      this.gpuBuffers = {}; // tier -> { vbo, ibo, tex, indexCount }

      this.gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
      if (!this.gl) return;

      this.initProgram();
      if (this.interactive) this.initEvents();

      this.setTier(this.tier);
    }

    initProgram() {
      const gl = this.gl;
      const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT_SRC));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG_SRC));
      gl.linkProgram(prog);
      this.program = prog;
      gl.useProgram(prog);

      this.locPos = gl.getAttribLocation(prog, 'a_pos');
      this.locNorm = gl.getAttribLocation(prog, 'a_norm');
      this.locUV = gl.getAttribLocation(prog, 'a_uv');
      this.uMVP = gl.getUniformLocation(prog, 'u_mvp');
      this.uNorm = gl.getUniformLocation(prog, 'u_normMat');
      this.uTex = gl.getUniformLocation(prog, 'u_tex');

      gl.enable(gl.DEPTH_TEST);
    }

    setTier(tier) {
      const t = normalizeTier(tier);
      this.tier = t;
      if (!this.gl) return;
      if (this.gpuBuffers[t]) {
        this.uploadedTier = t;
        return;
      }
      ensureTierLoaded(t, (entry) => {
        this.uploadTierToGPU(t, entry);
      });
    }

    uploadTierToGPU(t, entry) {
      if (!this.gl || !entry || !entry.ready || this.gpuBuffers[t]) return;
      const gl = this.gl;
      gl.useProgram(this.program);

      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, entry.verts, gl.STATIC_DRAW);

      const ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, entry.indices, gl.STATIC_DRAW);

      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, entry.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);

      this.gpuBuffers[t] = { vbo, ibo, tex, indexCount: entry.indices.length };
      if (this.tier === t) this.uploadedTier = t;
    }

    initEvents() {
      const c = this.canvas;
      c.style.cursor = 'grab';
      c.addEventListener('mousedown', e => {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        c.style.cursor = 'grabbing';
      });
      window.addEventListener('mousemove', e => {
        if (!this.isDragging) return;
        this.yaw += (e.clientX - this.lastX) * 0.012;
        this.pitch = Math.max(-0.6, Math.min(0.65, this.pitch + (e.clientY - this.lastY) * 0.008));
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      });
      window.addEventListener('mouseup', () => {
        this.isDragging = false;
        c.style.cursor = 'grab';
      });
    }

    render() {
      if (!this.gl || !this.program) return;
      const buf = this.gpuBuffers[this.tier];
      if (!buf) return;

      const gl = this.gl;
      if (!this.isDragging) {
        this.yaw += this.speed;
      }
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const spec = TIER_SPECS[this.tier] || TIER_SPECS[1];
      const aspect = this.canvas.width / Math.max(1, this.canvas.height);
      const { mvp, normMat } = makeMVP(this.yaw, this.pitch, aspect, this.baseZoom * spec.zoomMult);

      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf.vbo);
      const stride = 8 * 4;
      gl.enableVertexAttribArray(this.locPos);
      gl.vertexAttribPointer(this.locPos, 3, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(this.locNorm);
      gl.vertexAttribPointer(this.locNorm, 3, gl.FLOAT, false, stride, 12);
      gl.enableVertexAttribArray(this.locUV);
      gl.vertexAttribPointer(this.locUV, 2, gl.FLOAT, false, stride, 24);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.ibo);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, buf.tex);
      gl.uniform1i(this.uTex, 0);
      gl.uniformMatrix4fv(this.uMVP, false, mvp);
      gl.uniformMatrix3fv(this.uNorm, false, normMat);
      gl.drawElements(gl.TRIANGLES, buf.indexCount, gl.UNSIGNED_SHORT, 0);
    }
  }

  window.Backpack3DRenderer = Backpack3DRenderer;
})();
