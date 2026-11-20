// Globetrotter — Fotorealistisk 3D-skulpterad Vandringsryggsäck (WebGL)
// Laddar en äkta 67 907-trianglars 3D-modell (Survival Backpack, CC BY Berk Gedik / LearnOpenGL)
// med fotorealistisk diffuse- och specular-textur, studiobelysning och fri 3D-rotering!

(function () {
  'use strict';

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

    varying vec3 v_norm;
    varying vec2 v_uv;

    uniform sampler2D u_texDiff;
    uniform sampler2D u_texSpec;

    void main() {
      vec3 N = normalize(v_norm);
      vec3 L1 = normalize(vec3(-0.55, 0.65, 0.85)); // Huvudljus snett framifrån
      vec3 L2 = normalize(vec3(0.75, -0.15, 0.45)); // Varmt fyllnadsljus höger
      vec3 V  = vec3(0.0, 0.0, 1.0);

      vec3 albedo = texture2D(u_texDiff, v_uv).rgb;
      float specMask = texture2D(u_texSpec, v_uv).r;

      float d1 = max(dot(N, L1), 0.0);
      float d2 = max(dot(N, L2), 0.0);

      vec3 H = normalize(L1 + V);
      float spec = pow(max(dot(N, H), 0.0), 32.0) * (0.18 + specMask * 0.75);

      // Mjuk varm kantglöd så ryggsäcken lyser ut snyggt mot mörk bakgrund
      float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.24;

      vec3 col = albedo * (0.36 + 0.74 * d1 + 0.24 * d2)
               + vec3(1.0, 0.96, 0.88) * spec
               + vec3(0.95, 0.84, 0.62) * rim;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  // Delad cache så 3D-modellen + texturerna bara laddas EN gång för både dockan & modalen!
  const SHARED = {
    loading: false,
    ready: false,
    verts: null,
    indices: null,
    diffImg: null,
    specImg: null,
    listeners: []
  };

  function ensureAssetsLoaded(cb) {
    if (SHARED.ready) {
      if (cb) cb();
      return;
    }
    if (cb) SHARED.listeners.push(cb);
    if (SHARED.loading) return;
    SHARED.loading = true;

    let pending = 3;
    const doneOne = () => {
      pending--;
      if (pending === 0 && SHARED.verts && SHARED.indices && SHARED.diffImg) {
        SHARED.ready = true;
        SHARED.listeners.forEach(fn => { try { fn(); } catch (e) {} });
        SHARED.listeners = [];
      }
    };

    // 1. Ladda binär 3D-mesh (49 355 vertices, 67 907 trianglar)
    fetch('assets/models/backpack.bin')
      .then(r => r.arrayBuffer())
      .then(buf => {
        const header = new Uint32Array(buf, 0, 2);
        const vertCount = header[0];
        const idxCount = header[1];
        const vByteLen = vertCount * 8 * 4;
        SHARED.verts = new Float32Array(buf, 8, vertCount * 8);
        SHARED.indices = new Uint16Array(buf, 8 + vByteLen, idxCount);
        doneOne();
      })
      .catch(err => {
        console.warn('Kunde inte ladda backpack.bin:', err);
        doneOne();
      });

    // 2. Ladda diffuse-textur
    const dImg = new Image();
    dImg.onload = () => { SHARED.diffImg = dImg; doneOne(); };
    dImg.onerror = () => doneOne();
    dImg.src = 'assets/models/backpack_diffuse.jpg';

    // 3. Ladda specular-textur
    const sImg = new Image();
    sImg.onload = () => { SHARED.specImg = sImg; doneOne(); };
    sImg.onerror = () => doneOne();
    sImg.src = 'assets/models/backpack_spec.jpg';
  }

  // Förladda direkt när skriptet laddas
  ensureAssetsLoaded();

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
      this.zoom = options.zoom || 3.1;
      this.yaw = options.yaw !== undefined ? options.yaw : 0.4;
      this.pitch = options.pitch !== undefined ? options.pitch : 0.10;
      this.speed = options.speed !== undefined ? options.speed : 0.013;
      this.isDragging = false;
      this.lastX = 0;
      this.lastY = 0;
      this.uploaded = false;

      this.gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
      if (!this.gl) return;

      this.initProgram();
      if (this.interactive) this.initEvents();

      if (SHARED.ready) {
        this.uploadMeshAndTextures();
      } else {
        ensureAssetsLoaded(() => this.uploadMeshAndTextures());
      }
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
      this.locUv = gl.getAttribLocation(prog, 'a_uv');
      this.uMVP = gl.getUniformLocation(prog, 'u_mvp');
      this.uNorm = gl.getUniformLocation(prog, 'u_normMat');
      this.uTexDiff = gl.getUniformLocation(prog, 'u_texDiff');
      this.uTexSpec = gl.getUniformLocation(prog, 'u_texSpec');

      gl.enable(gl.DEPTH_TEST);
    }

    uploadMeshAndTextures() {
      if (this.uploaded || !this.gl || !SHARED.ready) return;
      const gl = this.gl;
      gl.useProgram(this.program);

      // Interleaved VBO: 8 floats (32 bytes) per vertex
      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, SHARED.verts, gl.STATIC_DRAW);

      const stride = 8 * 4;
      gl.enableVertexAttribArray(this.locPos);
      gl.vertexAttribPointer(this.locPos, 3, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(this.locNorm);
      gl.vertexAttribPointer(this.locNorm, 3, gl.FLOAT, false, stride, 12);
      gl.enableVertexAttribArray(this.locUv);
      gl.vertexAttribPointer(this.locUv, 2, gl.FLOAT, false, stride, 24);

      const ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, SHARED.indices, gl.STATIC_DRAW);
      this.indexCount = SHARED.indices.length;

      const makeTex = (img, unit) => {
        const tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        if (img) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128, 255]));
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        return tex;
      };

      makeTex(SHARED.diffImg, 0);
      makeTex(SHARED.specImg, 1);
      gl.uniform1i(this.uTexDiff, 0);
      gl.uniform1i(this.uTexSpec, 1);

      this.uploaded = true;
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
      if (!this.uploaded) {
        if (SHARED.ready) this.uploadMeshAndTextures();
        else return;
      }
      const gl = this.gl;
      if (!this.isDragging) {
        this.yaw += this.speed;
      }
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const aspect = this.canvas.width / Math.max(1, this.canvas.height);
      const { mvp, normMat } = makeMVP(this.yaw, this.pitch, aspect, this.zoom);
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(this.uMVP, false, mvp);
      gl.uniformMatrix3fv(this.uNorm, false, normMat);
      gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    }
  }

  window.Backpack3DRenderer = Backpack3DRenderer;
})();
