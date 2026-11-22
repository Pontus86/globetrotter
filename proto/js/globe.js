// Globetrotter — Fotorealistisk 3D-Jordglob (WebGL Ray-Sphere + NASA Blue Marble)
// Stödjer fri 3D-rotering, mushjulszoom, dynamisk inzoomning vid flygning,
// molnlager, havsblänk, atmosfärglöd, röda BackPacker-reslinjer och världshändelser.

(function () {
  'use strict';

  // Delade NASA Blue Marble-texturer (Public Domain) som laddas en gång för alla glober
  const EARTH_ASSETS = {
    day: null,
    spec: null,
    normal: null,
    loaded: false,
    loadingStarted: false
  };

  function loadEarthTextures(onReady) {
    if (EARTH_ASSETS.loaded) {
      if (onReady) onReady();
      return;
    }
    if (EARTH_ASSETS.loadingStarted) return;
    EARTH_ASSETS.loadingStarted = true;

    const specs = [
      { key: 'day', src: 'assets/globe/earth_day.jpg' },
      { key: 'spec', src: 'assets/globe/earth_spec.jpg' },
      { key: 'normal', src: 'assets/globe/earth_normal.jpg' }
    ];

    let remaining = specs.length;
    specs.forEach(item => {
      const img = new Image();
      img.onload = () => {
        EARTH_ASSETS[item.key] = img;
        remaining--;
        if (remaining === 0) {
          EARTH_ASSETS.loaded = true;
          if (onReady) onReady();
        }
      };
      img.onerror = () => {
        remaining--;
        if (remaining === 0 && EARTH_ASSETS.day) {
          EARTH_ASSETS.loaded = true;
          if (onReady) onReady();
        }
      };
      img.src = item.src;
    });
  }

  // Starta förladdning direkt när skriptet laddas
  loadEarthTextures();

  // Matematiska hjälpfunktioner för sfärisk geometri
  function deg2rad(d) { return d * Math.PI / 180; }
  function rad2deg(r) { return r * 180 / Math.PI; }

  function latLonToVector(lat, lon) {
    const phi = deg2rad(lat);
    const lam = deg2rad(lon);
    return [
      Math.cos(phi) * Math.cos(lam),
      Math.sin(phi),
      Math.cos(phi) * Math.sin(lam)
    ];
  }

  function vectorToLatLon(v) {
    const phi = Math.asin(Math.max(-1, Math.min(1, v[1])));
    const lam = Math.atan2(v[2], v[0]);
    return [rad2deg(phi), rad2deg(lam)];
  }

  // Slerp (Spherical Linear Interpolation) för perfekta storcirkelbågar
  function slerp(p1, p2, t) {
    const dot = Math.max(-1, Math.min(1, p1[0] * p2[0] + p1[1] * p2[1] + p1[2] * p2[2]));
    const theta = Math.acos(dot);
    if (Math.abs(theta) < 1e-5) return p1;
    const sinT = Math.sin(theta);
    const a = Math.sin((1 - t) * theta) / sinT;
    const b = Math.sin(t * theta) / sinT;
    return [
      a * p1[0] + b * p2[0],
      a * p1[1] + b * p2[1],
      a * p1[2] + b * p2[2]
    ];
  }

  // --- GLSL Shaders för fotorealistisk 3D-jordglob ---
  const VERT_SRC = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const FRAG_SRC = `
    precision highp float;
    varying vec2 v_uv;

    uniform vec2 u_res;
    uniform float u_radius;
    uniform float u_centerLat;
    uniform float u_centerLon;
    uniform float u_isMini;

    uniform sampler2D u_texDay;
    uniform sampler2D u_texSpec;
    uniform sampler2D u_texNormal;

    const float PI = 3.14159265359;

    void main() {
      // Koordinater relativt globens mittpunkt (i enheter av radien)
      vec2 px = vec2(v_uv.x * u_res.x, (1.0 - v_uv.y) * u_res.y);
      vec2 center = u_res * 0.5;
      vec2 p = vec2((px.x - center.x) / u_radius, (center.y - px.y) / u_radius);

      float rho2 = dot(p, p);
      float rho = sqrt(rho2);

      // Yttre atmosfärsglöd runt jorden (NASA-känsla)
      if (rho2 > 1.0) {
        if (rho < 1.14) {
          float glow = pow(1.0 - clamp((rho - 1.0) / 0.14, 0.0, 1.0), 2.6);
          vec3 atmoColor = vec3(0.32, 0.68, 1.0);
          gl_FragColor = vec4(atmoColor * glow * 0.85, glow * 0.82);
        } else {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
        return;
      }

      // Exakt invers ortografisk projektion -> sfärisk normal & lat/lon
      float nz = sqrt(max(0.0, 1.0 - rho2));
      vec3 N = normalize(vec3(p.x, p.y, nz));

      float cosP0 = cos(u_centerLat);
      float sinP0 = sin(u_centerLat);

      float sinPhi = clamp(p.y * cosP0 + nz * sinP0, -1.0, 1.0);
      float phi = asin(sinPhi);
      float dLam = atan(p.x, nz * cosP0 - p.y * sinP0);
      float lam = u_centerLon + dLam;

      // Ekvirektangulära UV-koordinater (exakt linjerade med NASA Blue Marble)
      float u = fract(lam / (2.0 * PI) + 0.5);
      float v = clamp(0.5 - phi / PI, 0.001, 0.999);

      vec3 dayCol = texture2D(u_texDay, vec2(u, v)).rgb;
      float specMask = texture2D(u_texSpec, vec2(u, v)).r;

      // Topografisk normalmap (3D-relief vid Himalaya, Anderna, Klippiga bergen, Alperna m.fl.)
      vec3 mapN = texture2D(u_texNormal, vec2(u, v)).xyz * 2.0 - 1.0;
      // Öst-tangent (T) och Nord-bitangent (B) i kamerarymd
      vec3 T = normalize(vec3(cos(dLam), sinP0 * sin(dLam), -cosP0 * sin(dLam)));
      vec3 B = normalize(cross(N, T));

      // Förstärk reliefen på land (noll på vatten via 1.0 - specMask) så bergskedjorna verkligen reser sig (1.5x förstärkt!)
      float landMask = clamp(1.0 - specMask * 1.15, 0.0, 1.0);
      float bumpStrength = (u_isMini > 0.5 ? 3.3 : 5.4) * landMask;
      vec3 Nbumped = normalize(N + T * (mapN.x * bumpStrength) + B * (mapN.y * bumpStrength));

      // 3D-studiobelysning (snedställt solljus från övre vänster för tydliga bergskuggor)
      vec3 lightDir = normalize(vec3(-0.62, 0.44, 0.65));
      vec3 viewDir = vec3(0.0, 0.0, 1.0);

      float baseDiff = max(dot(N, lightDir), 0.0);
      float bumpDiff = max(dot(Nbumped, lightDir), 0.0);
      float diff = mix(baseDiff, bumpDiff, landMask);
      float lit = 0.26 + 0.86 * pow(diff, 0.88);

      // Extra reliefkontrast i bergskedjorna (ljusa kammar, djupare dalar — 1.5x förstärkt)
      float slope = length(mapN.xy) * landMask;
      float ridgeHighlight = max(0.0, bumpDiff - baseDiff) * 0.68 * landMask;
      float valleyShadow = max(0.0, baseDiff - bumpDiff) * 0.63 * landMask;

      // Blinn-Phong spegelblänk enbart på haven (via specular-masken)
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(N, halfVec), 0.0), 38.0) * specMask * 0.55;

      vec3 surface = dayCol * (lit - valleyShadow) + vec3(1.0, 0.96, 0.88) * ridgeHighlight + vec3(0.82, 0.92, 1.0) * spec;
      // Diskret relief-skärpning på höga berg
      surface *= (1.0 + slope * 0.12);

      // Diskret guldtonat gradnät på större globen (antikt reseinstrument)
      if (u_isMini < 0.5) {
        float latDeg = abs(phi * 180.0 / PI);
        float lonDeg = abs(mod(lam * 180.0 / PI + 180.0, 30.0) - 15.0);
        float latGrid = smoothstep(0.35, 0.0, abs(mod(latDeg + 15.0, 30.0) - 15.0));
        float lonGrid = smoothstep(0.35, 0.0, abs(lonDeg - 15.0)) * cos(phi);
        float eqGrid = smoothstep(0.42, 0.0, latDeg);
        float grid = max(max(latGrid, lonGrid) * 0.14, eqGrid * 0.24);
        surface = mix(surface, vec3(0.92, 0.78, 0.45), grid);
      }

      // Inre atmosfärisk Fresnel-kantglöd (ljusblå horisont)
      float fresnel = pow(1.0 - nz, 3.0);
      surface += vec3(0.28, 0.62, 1.0) * fresnel * 0.55;

      // Mjuk kantutjämning runt sfären
      float edgeAA = smoothstep(1.0, 0.988, rho);
      gl_FragColor = vec4(surface, edgeAA);
    }
  `;

  function compileShader(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('Globe shader error:', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  // --- Jordglobsklassen ---
  class GlobeRenderer {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.mini = Boolean(options.mini);
      this.interactive = options.interactive !== undefined ? options.interactive : !this.mini;
      this.baseRadius = options.radius || Math.round(Math.min(canvas.width, canvas.height) * 0.43);
      this.radius = this.baseRadius;
      this.centerLon = options.centerLon !== undefined ? options.centerLon : 18;
      this.centerLat = options.centerLat !== undefined ? options.centerLat : 38;
      this.isDragging = false;
      this.dragMoved = false;
      this.dragStart = { x: 0, y: 0 };
      this.lastMouse = { x: 0, y: 0 };
      this.hoverPos = null; // { x, y } i canvas-koordinater för tooltip på gråa städer
      this.autoRotate = Boolean(options.autoRotate);
      this.flightAnimation = null;
      this.onGlobeClick = options.onGlobeClick || null;
      this.onWonderClick = options.onWonderClick || null;
      this.doneWonders = options.doneWonders || null;
      this.pinMarker = null;   // { lat, lon, label, color }
      this.targetMarker = null; // { lat, lon, label, color }

      // Generera subtil stjärnhimmel i bakgrunden (ej i mini-läge)
      this.stars = [];
      if (!this.mini) {
        for (let i = 0; i < 95; i++) {
          this.stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 0.6 + Math.random() * 1.2,
            a: 0.25 + Math.random() * 0.6
          });
        }
      }

      // Initiera WebGL-renderare på separat offscreen-canvas
      this.glReady = false;
      this.texturesUploaded = false;
      this.initWebGL();

      if (this.interactive) {
        this.initEvents();
      }
    }

    initWebGL() {
      try {
        this.glCanvas = document.createElement('canvas');
        this.glCanvas.width = this.canvas.width;
        this.glCanvas.height = this.canvas.height;
        const gl = this.glCanvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
        if (!gl) return;
        this.gl = gl;

        const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
        const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
        if (!vs || !fs) return;

        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

        this.program = prog;
        gl.useProgram(prog);

        // Fullskärmsquad
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          -1, -1,  1, -1,  -1, 1,
          -1,  1,  1, -1,   1, 1
        ]), gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(prog, 'a_pos');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        this.loc = {
          res: gl.getUniformLocation(prog, 'u_res'),
          radius: gl.getUniformLocation(prog, 'u_radius'),
          centerLat: gl.getUniformLocation(prog, 'u_centerLat'),
          centerLon: gl.getUniformLocation(prog, 'u_centerLon'),
          isMini: gl.getUniformLocation(prog, 'u_isMini'),
          texDay: gl.getUniformLocation(prog, 'u_texDay'),
          texSpec: gl.getUniformLocation(prog, 'u_texSpec'),
          texNormal: gl.getUniformLocation(prog, 'u_texNormal')
        };

        this.glReady = true;
        if (EARTH_ASSETS.loaded) {
          this.uploadTextures();
        } else {
          loadEarthTextures(() => this.uploadTextures());
        }
      } catch (e) {
        console.warn('WebGL globe init fallback:', e);
        this.glReady = false;
      }
    }

    uploadTextures() {
      if (!this.glReady || this.texturesUploaded || !EARTH_ASSETS.day) return;
      const gl = this.gl;

      const makeTex = (img, unit) => {
        const tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        if (img) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return tex;
      };

      makeTex(EARTH_ASSETS.day, 0);
      makeTex(EARTH_ASSETS.spec, 1);
      makeTex(EARTH_ASSETS.normal, 2);

      gl.useProgram(this.program);
      gl.uniform1i(this.loc.texDay, 0);
      gl.uniform1i(this.loc.texSpec, 1);
      gl.uniform1i(this.loc.texNormal, 2);

      this.texturesUploaded = true;
    }

    initEvents() {
      const c = this.canvas;

      const onStart = (x, y) => {
        this.isDragging = true;
        this.dragMoved = false;
        this.dragStart = { x, y };
        this.lastMouse = { x, y };
        this.autoRotate = false;
      };

      const onMove = (x, y) => {
        if (!this.isDragging) return;
        const dx = x - this.lastMouse.x;
        const dy = y - this.lastMouse.y;
        if (Math.hypot(x - this.dragStart.x, y - this.dragStart.y) > 5) {
          this.dragMoved = true;
        }
        const sensitivity = 0.42 * (this.baseRadius / Math.max(120, this.radius));
        this.centerLon -= dx * sensitivity;
        this.centerLat += dy * sensitivity;
        this.centerLat = Math.max(-85, Math.min(85, this.centerLat));
        this.lastMouse = { x, y };
      };

      const onEnd = (e) => {
        if (this.isDragging && !this.dragMoved && e && e.clientX !== undefined) {
          const rect = c.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const sx = (e.clientX - rect.left) * (c.width / rect.width);
            const sy = (e.clientY - rect.top) * (c.height / rect.height);
            // Kolla först om spelaren klickade på ett världsarv på jordgloben
            if (this.onWonderClick && window.GT_WORLD && window.GT_WORLD.wonders) {
              let bestKey = null;
              let bestDist = 18;
              Object.entries(window.GT_WORLD.wonders).forEach(([wKey, w]) => {
                if (w.lat === undefined || w.lon === undefined) return;
                const p = this.project(w.lat, w.lon);
                if (!p.visible) return;
                const d = Math.hypot(sx - p.x, sy - p.y);
                if (d < bestDist) {
                  bestDist = d;
                  bestKey = wKey;
                }
              });
              if (bestKey) {
                this.isDragging = false;
                this.onWonderClick(bestKey, window.GT_WORLD.wonders[bestKey]);
                return;
              }
            }
            if (this.onGlobeClick) {
              const ll = this.unproject(sx, sy);
              if (ll) this.onGlobeClick(ll.lat, ll.lon);
            }
          }
        }
        this.isDragging = false;
      };

      c.addEventListener('mousedown', e => onStart(e.clientX, e.clientY));
      window.addEventListener('mousemove', e => {
        onMove(e.clientX, e.clientY);
        const rect = c.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const sx = (e.clientX - rect.left) * (c.width / rect.width);
          const sy = (e.clientY - rect.top) * (c.height / rect.height);
          if (sx >= 0 && sx <= c.width && sy >= 0 && sy <= c.height) {
            this.hoverPos = { x: sx, y: sy };
          } else {
            this.hoverPos = null;
          }
        }
      });
      c.addEventListener('mouseleave', () => { this.hoverPos = null; });
      window.addEventListener('mouseup', onEnd);

      // Mushjulszoom för att kunna zooma in på kontinenter och resrutter
      c.addEventListener('wheel', e => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -36 : 36;
        this.radius = Math.max(this.baseRadius * 0.72, Math.min(780, this.radius + delta));
      }, { passive: false });

      c.addEventListener('touchstart', e => {
        if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      window.addEventListener('touchmove', e => {
        if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      window.addEventListener('touchend', onEnd);
    }

    // Exakt invers projektion: skärmpunkt (sx, sy) -> { lat, lon } på sfären (eller null utanför)
    unproject(sx, sy) {
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      const nx = (sx - cx) / this.radius;
      const ny = (cy - sy) / this.radius;
      const rho2 = nx * nx + ny * ny;
      if (rho2 > 1.0) return null;

      const nz = Math.sqrt(Math.max(0, 1.0 - rho2));
      const phi0 = deg2rad(this.centerLat);
      const lam0 = deg2rad(this.centerLon);

      const sinPhi = Math.max(-1, Math.min(1, ny * Math.cos(phi0) + nz * Math.sin(phi0)));
      const phi = Math.asin(sinPhi);
      const dLam = Math.atan2(nx, nz * Math.cos(phi0) - ny * Math.sin(phi0));
      let lon = rad2deg(lam0 + dLam);
      while (lon > 180) lon -= 360;
      while (lon < -180) lon += 360;
      return { lat: rad2deg(phi), lon };
    }

    // Ortografisk 3D-projektion från sfär till 2D-skärm (exakt samma matte som GLSL-shadern)
    project(lat, lon) {
      const phi = deg2rad(lat);
      const lam = deg2rad(lon);
      const phi0 = deg2rad(this.centerLat);
      const lam0 = deg2rad(this.centerLon);

      const dLam = lam - lam0;
      const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(dLam);

      const x = this.radius * Math.cos(phi) * Math.sin(dLam);
      const y = this.radius * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dLam));

      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;

      return {
        x: cx + x,
        y: cy - y,
        visible: cosC > 0,
        cosC: cosC
      };
    }

    renderWebGLSphere() {
      if (!this.glReady) return false;
      if (!this.texturesUploaded && EARTH_ASSETS.loaded) {
        this.uploadTextures();
      }
      if (!this.texturesUploaded) return false;

      const gl = this.gl;
      if (this.glCanvas.width !== this.canvas.width || this.glCanvas.height !== this.canvas.height) {
        this.glCanvas.width = this.canvas.width;
        this.glCanvas.height = this.canvas.height;
      }

      gl.viewport(0, 0, this.glCanvas.width, this.glCanvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(this.program);
      gl.uniform2f(this.loc.res, this.glCanvas.width, this.glCanvas.height);
      gl.uniform1f(this.loc.radius, this.radius);
      gl.uniform1f(this.loc.centerLat, deg2rad(this.centerLat));
      gl.uniform1f(this.loc.centerLon, deg2rad(this.centerLon));
      gl.uniform1f(this.loc.isMini, this.mini ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      return true;
    }

    render(travelHistory = [], currentCityKey = 'stockholm', activeEvents = []) {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = this.radius;

      ctx.clearRect(0, 0, w, h);

      // 1. Subtil stjärnhimmel bakom jordgloben (ej i mini-läge)
      if (!this.mini && this.stars.length > 0) {
        ctx.save();
        this.stars.forEach(s => {
          ctx.fillStyle = `rgba(235, 242, 255, ${s.a})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 2. Rita den fotorealistiska 3D-jordgloben via WebGL (eller snabb reservsfär medan textur laddar)
      const drewWebGL = this.renderWebGLSphere();
      if (drewWebGL) {
        ctx.drawImage(this.glCanvas, 0, 0);
      } else {
        ctx.save();
        const oceanGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
        oceanGrad.addColorStop(0, '#1e5788');
        oceanGrad.addColorStop(0.7, '#0d2c4a');
        oceanGrad.addColorStop(1, '#041120');
        ctx.fillStyle = oceanGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Klipp överlagrade reslinjer innanför jordglobens sfär
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const zoomScale = Math.max(0.85, Math.min(1.6, Math.sqrt(this.radius / Math.max(1, this.baseRadius))));

      // 3b. Diskreta landsgränser (Natural Earth 110m Public Domain) på stora jordgloben
      if (!this.mini && window.GT_COUNTRY_BORDERS && window.GT_COUNTRY_BORDERS.length > 0) {
        const borders = window.GT_COUNTRY_BORDERS;
        const DEG = Math.PI / 180;
        const phi0 = this.centerLat * DEG;
        const lam0 = this.centerLon * DEG;
        const sinP0 = Math.sin(phi0);
        const cosP0 = Math.cos(phi0);
        const maxJump2 = (r * 0.35) * (r * 0.35);

        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < borders.length; i++) {
          const line = borders[i];
          let drawing = false;
          let prevX = 0;
          let prevY = 0;
          for (let j = 0; j < line.length; j += 2) {
            const phi = line[j] * DEG;
            const dLam = line[j + 1] * DEG - lam0;
            const sinP = Math.sin(phi);
            const cosP = Math.cos(phi);
            const cosD = Math.cos(dLam);
            const cosC = sinP0 * sinP + cosP0 * cosP * cosD;
            if (cosC > 0.02) {
              const x = cx + r * cosP * Math.sin(dLam);
              const y = cy - r * (cosP0 * sinP - sinP0 * cosP * cosD);
              if (!drawing) {
                ctx.moveTo(x, y);
                drawing = true;
              } else {
                const dx = x - prevX;
                const dy = y - prevY;
                if (dx * dx + dy * dy < maxJump2) {
                  ctx.lineTo(x, y);
                } else {
                  ctx.moveTo(x, y);
                }
              }
              prevX = x;
              prevY = y;
            } else {
              drawing = false;
            }
          }
        }
        ctx.lineWidth = Math.min(1.2, 0.78 * Math.sqrt(zoomScale));
        ctx.strokeStyle = 'rgba(255, 245, 215, 0.32)';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
      }

      // 4. Tidigare avklarade resrutter (Röda linjen precis som i BackPacker!)
      if (!this.mini && travelHistory && travelHistory.length > 0) {
        ctx.save();
        ctx.lineWidth = 3.2 * zoomScale;
        ctx.strokeStyle = '#e62e2e';
        ctx.shadowColor = 'rgba(255, 60, 60, 0.9)';
        ctx.shadowBlur = 9;

        travelHistory.forEach(leg => {
          const c1 = window.GT_WORLD.cities[leg.from];
          const c2 = window.GT_WORLD.cities[leg.to];
          if (!c1 || !c2) return;

          const v1 = latLonToVector(c1.lat, c1.lon);
          const v2 = latLonToVector(c2.lat, c2.lon);

          ctx.beginPath();
          let drawing = false;
          const segments = 64;
          for (let s = 0; s <= segments; s++) {
            const v = slerp(v1, v2, s / segments);
            const ll = vectorToLatLon(v);
            const pt = this.project(ll[0], ll[1]);
            if (pt.visible) {
              if (!drawing) { ctx.moveTo(pt.x, pt.y); drawing = true; }
              else { ctx.lineTo(pt.x, pt.y); }
            } else {
              drawing = false;
            }
          }
          ctx.stroke();
        });
        ctx.restore();
      }

      // 5. Aktiv animerad flyglinje (vid pågående resa)
      if (!this.mini && this.flightAnimation) {
        const anim = this.flightAnimation;
        ctx.save();

        // Streckad förhandslinje längs hela storcirkelbågen
        ctx.beginPath();
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 2.0 * zoomScale;
        ctx.strokeStyle = 'rgba(255, 232, 155, 0.55)';
        let dashDrawing = false;
        const previewSteps = 64;
        for (let s = 0; s <= previewSteps; s++) {
          const v = slerp(anim.fromV, anim.toV, s / previewSteps);
          const ll = vectorToLatLon(v);
          const pt = this.project(ll[0], ll[1]);
          if (pt.visible) {
            if (!dashDrawing) { ctx.moveTo(pt.x, pt.y); dashDrawing = true; }
            else { ctx.lineTo(pt.x, pt.y); }
          } else {
            dashDrawing = false;
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Själva den glödande röda reslinjen
        ctx.lineWidth = 4.4 * zoomScale;
        ctx.strokeStyle = '#ff2626';
        ctx.shadowColor = 'rgba(255, 75, 75, 0.95)';
        ctx.shadowBlur = 14;

        ctx.beginPath();
        let drawing = false;
        const totalSteps = 84;
        const currentSteps = Math.max(1, Math.floor(totalSteps * anim.progress));
        let tipPt = null;
        let prevPt = null;

        for (let s = 0; s <= currentSteps; s++) {
          const v = slerp(anim.fromV, anim.toV, s / totalSteps);
          const ll = vectorToLatLon(v);
          const pt = this.project(ll[0], ll[1]);
          if (pt.visible) {
            if (!drawing) { ctx.moveTo(pt.x, pt.y); drawing = true; }
            else { ctx.lineTo(pt.x, pt.y); }
            prevPt = tipPt || pt;
            tipPt = pt;
          } else {
            drawing = false;
          }
        }
        ctx.stroke();

        // Rita metalliskt 90-tals flygplan / oceanångare i exakt kursriktning
        if (tipPt && tipPt.visible) {
          const angle = prevPt && (tipPt.x !== prevPt.x || tipPt.y !== prevPt.y)
            ? Math.atan2(tipPt.y - prevPt.y, tipPt.x - prevPt.x)
            : 0;
          this.drawCraftMarker(ctx, tipPt.x, tipPt.y, angle, zoomScale, anim.isBoat);
        }
        ctx.restore();
      }

      // 5b. Alla världens huvudstäder & BackPacker-städer (gråa prickar så man ser vad som är utbyggt!)
      if (!this.mini && window.GT_WORLD_CITIES && window.GT_WORLD_CITIES.length > 0) {
        const builtCities = (window.GT_WORLD && window.GT_WORLD.cities)
          ? Object.values(window.GT_WORLD.cities)
          : [];
        const showZoomLabels = this.radius >= 380 && !this.flightAnimation;
        const placedBoxes = [];
        let hoveredGray = null;
        let hoveredDist = 14;

        ctx.save();
        for (let i = 0; i < window.GT_WORLD_CITIES.length; i++) {
          const entry = window.GT_WORLD_CITIES[i];
          const name = entry[0];
          const lat = entry[1];
          const lon = entry[2];

          // Hoppa över om vi redan byggt upp staden (eller mycket nära)
          let isBuilt = false;
          for (let b = 0; b < builtCities.length; b++) {
            if (Math.abs(builtCities[b].lat - lat) < 0.9 && Math.abs(builtCities[b].lon - lon) < 0.9) {
              isBuilt = true;
              break;
            }
          }
          if (isBuilt) continue;

          const proj = this.project(lat, lon);
          if (!proj.visible || proj.cosC < 0.08) continue;

          // Grå prick (diskret så våra utbyggda städer lyser ut tydligt)
          const dotR = Math.min(3.2, 2.2 * Math.sqrt(zoomScale));
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(175, 182, 192, 0.72)';
          ctx.strokeStyle = 'rgba(20, 24, 30, 0.75)';
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();

          // Kolla om muspekaren hovrar över staden
          if (this.hoverPos && !this.isDragging && !this.flightAnimation) {
            const d = Math.hypot(this.hoverPos.x - proj.x, this.hoverPos.y - proj.y);
            if (d < hoveredDist) {
              hoveredDist = d;
              hoveredGray = { name, x: proj.x, y: proj.y };
            }
          }

          // Vid inzoomning: visa diskreta grå etiketter utan överlapp
          if (showZoomLabels && proj.cosC > 0.35) {
            ctx.font = '10px Georgia, serif';
            const tw = ctx.measureText(name).width;
            const bx = proj.x + 6;
            const by = proj.y - 6;
            const bw = tw + 6;
            const bh = 13;
            let overlaps = false;
            for (let p = 0; p < placedBoxes.length; p++) {
              const o = placedBoxes[p];
              if (bx < o.x + o.w && bx + bw > o.x && by < o.y + o.h && by + bh > o.y) {
                overlaps = true;
                break;
              }
            }
            if (!overlaps) {
              placedBoxes.push({ x: bx, y: by, w: bw, h: bh });
              ctx.fillStyle = 'rgba(15, 18, 22, 0.68)';
              ctx.fillRect(bx, by, bw, bh);
              ctx.fillStyle = 'rgba(195, 202, 212, 0.85)';
              ctx.fillText(name, bx + 3, by + 10);
            }
          }
        }

        // Visa tydlig grå tooltip vid hovring över ej byggd stad
        if (hoveredGray) {
          const label = `${hoveredGray.name} (ej byggd än)`;
          ctx.font = '11px Georgia, serif';
          const tw = ctx.measureText(label).width;
          const bx = hoveredGray.x + 10;
          const by = hoveredGray.y - 11;
          ctx.fillStyle = 'rgba(20, 23, 28, 0.92)';
          ctx.fillRect(bx, by, tw + 12, 20);
          ctx.strokeStyle = 'rgba(175, 182, 192, 0.85)';
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, by, tw + 12, 20);
          ctx.fillStyle = '#d3d9e2';
          ctx.fillText(label, bx + 6, by + 14);
        }
        ctx.restore();
      }

      // 6. Städer och aktiva världshändelser som markörer på jordgloben
      if (window.GT_WORLD && window.GT_WORLD.cities) {
        Object.entries(window.GT_WORLD.cities).forEach(([key, city]) => {
          const proj = this.project(city.lat, city.lon);
          if (!proj.visible) return;

          const isCurrent = (key === currentCityKey);
          const cityEvent = activeEvents && activeEvents.find(ev => ev.city === key);

          if (this.mini) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, isCurrent ? 2.6 : (cityEvent ? 2.2 : 1.5), 0, Math.PI * 2);
            ctx.fillStyle = isCurrent ? '#ffcc00' : (cityEvent ? cityEvent.color : '#fff');
            ctx.fill();
            ctx.restore();
            return;
          }

          // Pulserande händelsering för aktiva världshändelser
          if (cityEvent) {
            const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 280);
            ctx.save();
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, (13 + pulse * 6) * zoomScale, 0, Math.PI * 2);
            ctx.strokeStyle = cityEvent.color || '#ff8fb1';
            ctx.globalAlpha = 0.9 - pulse * 0.45;
            ctx.lineWidth = 2.6;
            ctx.stroke();
            ctx.restore();
          }

          // Pulserande guld-ring för aktuell stad
          if (isCurrent) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, 11 * zoomScale, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 214, 92, 0.95)';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.restore();
          }

          // Stadsknapp/nål
          ctx.save();
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, (isCurrent ? 5.5 : 4.2) * zoomScale, 0, Math.PI * 2);
          ctx.fillStyle = isCurrent ? '#ffcc00' : (cityEvent ? cityEvent.color : '#ffffff');
          ctx.strokeStyle = '#181008';
          ctx.lineWidth = 1.6;
          ctx.fill();
          ctx.stroke();

          // Namnskylt
          const fontSize = Math.round((isCurrent ? 13 : 11.5) * Math.min(1.25, zoomScale));
          ctx.font = `${isCurrent ? 'bold ' : ''}${fontSize}px Georgia, serif`;
          const textW = ctx.measureText(city.name).width;
          const boxH = fontSize + 6;

          ctx.fillStyle = 'rgba(14, 11, 8, 0.88)';
          ctx.fillRect(proj.x + 10, proj.y - boxH / 2, textW + 10, boxH);
          ctx.strokeStyle = isCurrent ? '#e9b949' : (cityEvent ? cityEvent.color : 'rgba(244, 234, 214, 0.55)');
          ctx.lineWidth = 1;
          ctx.strokeRect(proj.x + 10, proj.y - boxH / 2, textW + 10, boxH);

          ctx.fillStyle = isCurrent ? '#ffd875' : '#f7f0e2';
          ctx.fillText(city.name, proj.x + 15, proj.y + fontSize * 0.34);

          if (cityEvent && !this.flightAnimation) {
            ctx.font = 'bold 10px sans-serif';
            const evText = `* ${cityEvent.title}`;
            const evW = ctx.measureText(evText).width;
            ctx.fillStyle = 'rgba(18, 12, 8, 0.92)';
            ctx.fillRect(proj.x + 10, proj.y + boxH / 2 + 2, evW + 10, 15);
            ctx.strokeStyle = cityEvent.color || '#e9b949';
            ctx.strokeRect(proj.x + 10, proj.y + boxH / 2 + 2, evW + 10, 15);
            ctx.fillStyle = cityEvent.color || '#ffd27a';
            ctx.fillText(evText, proj.x + 15, proj.y + boxH / 2 + 13);
          }
          ctx.restore();
        });
      }

      // 6b. 20 Världsarv & Naturunder på jordgloben (gyllene stjärnmarkörer + expeditionslinje till närmaste stad)
      if (!this.mini && window.GT_WORLD && window.GT_WORLD.wonders) {
        const wonders = Object.entries(window.GT_WORLD.wonders);
        let hoveredWonder = null;
        let hoveredDist = 18;

        // Hitta närmaste hovrade världsarv
        if (this.hoverPos && !this.isDragging && !this.flightAnimation) {
          wonders.forEach(([wKey, w]) => {
            if (w.lat === undefined || w.lon === undefined) return;
            const p = this.project(w.lat, w.lon);
            if (!p.visible) return;
            const d = Math.hypot(this.hoverPos.x - p.x, this.hoverPos.y - p.y);
            if (d < hoveredDist) {
              hoveredDist = d;
              hoveredWonder = { key: wKey, w, x: p.x, y: p.y };
            }
          });
        }
        if (this.interactive && this.onWonderClick) {
          this.canvas.style.cursor = hoveredWonder ? 'pointer' : (this.isDragging ? 'grabbing' : 'grab');
        }

        const showLabels = this.radius >= 370 && !this.flightAnimation;

        wonders.forEach(([wKey, w]) => {
          if (w.lat === undefined || w.lon === undefined) return;
          const proj = this.project(w.lat, w.lon);
          if (!proj.visible) return;

          const isDone = Boolean(this.doneWonders && this.doneWonders.has(wKey));
          const isFromHere = (w.from === currentCityKey);
          const isHov = Boolean(hoveredWonder && hoveredWonder.key === wKey);

          // Diskret streckad expeditionslinje från närmaste stad (visas vid hovring, inzoomning eller från nuvarande stad)
          if ((isFromHere || isHov || showLabels) && w.from && window.GT_WORLD.cities[w.from]) {
            const gw = window.GT_WORLD.cities[w.from];
            const v1 = latLonToVector(gw.lat, gw.lon);
            const v2 = latLonToVector(w.lat, w.lon);
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([3, 3]);
            ctx.lineWidth = isHov ? 2.0 : 1.15;
            ctx.strokeStyle = isDone
              ? 'rgba(110, 230, 145, 0.65)'
              : (isHov || isFromHere ? 'rgba(255, 206, 86, 0.85)' : 'rgba(255, 206, 86, 0.38)');
            let drawing = false;
            for (let s = 0; s <= 24; s++) {
              const v = slerp(v1, v2, s / 24);
              const ll = vectorToLatLon(v);
              const pt = this.project(ll[0], ll[1]);
              if (pt.visible) {
                if (!drawing) { ctx.moveTo(pt.x, pt.y); drawing = true; }
                else { ctx.lineTo(pt.x, pt.y); }
              } else {
                drawing = false;
              }
            }
            ctx.stroke();
            ctx.restore();
          }

          // Rita gyllene 4-uddig stjärna / kompassdiamant för världsarvet
          const sz = (isHov ? 7.5 : (isFromHere ? 6.2 : 5.0)) * Math.min(1.25, Math.sqrt(zoomScale));
          ctx.save();
          ctx.translate(proj.x, proj.y);
          if (isFromHere || isHov) {
            ctx.shadowColor = isDone ? 'rgba(94, 224, 135, 0.9)' : 'rgba(255, 198, 70, 0.95)';
            ctx.shadowBlur = isHov ? 12 : 7;
          }
          ctx.beginPath();
          ctx.moveTo(0, -sz);
          ctx.lineTo(sz * 0.42, -sz * 0.42);
          ctx.lineTo(sz, 0);
          ctx.lineTo(sz * 0.42, sz * 0.42);
          ctx.lineTo(0, sz);
          ctx.lineTo(-sz * 0.42, sz * 0.42);
          ctx.lineTo(-sz, 0);
          ctx.lineTo(-sz * 0.42, -sz * 0.42);
          ctx.closePath();
          ctx.fillStyle = isDone ? '#66e38c' : '#ffbe3d';
          ctx.strokeStyle = '#1b1106';
          ctx.lineWidth = 1.3;
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Diskret namnskylt för världsarv nära nuvarande stad eller vid inzoomning (ej hovrade, de ritas överst)
          if (!isHov && (isFromHere || (showLabels && proj.cosC > 0.38))) {
            ctx.save();
            ctx.font = 'bold 10px Georgia, serif';
            const lbl = `★ ${w.name}`;
            const tw = ctx.measureText(lbl).width;
            const bx = proj.x + 8;
            const by = proj.y - 7;
            ctx.fillStyle = 'rgba(22, 15, 7, 0.82)';
            ctx.fillRect(bx, by, tw + 8, 15);
            ctx.strokeStyle = isDone ? 'rgba(102, 227, 140, 0.7)' : 'rgba(255, 190, 61, 0.72)';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx, by, tw + 8, 15);
            ctx.fillStyle = isDone ? '#8cf0a4' : '#ffd875';
            ctx.fillText(lbl, bx + 4, by + 11);
            ctx.restore();
          }
        });

        // Rita hovrat världsarvs-kort allra överst
        if (hoveredWonder) {
          const { key, w, x, y } = hoveredWonder;
          const isDone = Boolean(this.doneWonders && this.doneWonders.has(key));
          const gwName = (window.GT_WORLD.cities[w.from] && window.GT_WORLD.cities[w.from].name) || w.from;
          const line1 = `★ ${w.name} (${w.country})`;
          const line2 = w.from === currentCityKey
            ? `${isDone ? 'Besökt · ' : ''}Klicka för expedition från ${gwName}!`
            : `Närmaste stad: ${gwName} · Klicka för info`;
          ctx.save();
          ctx.font = 'bold 11.5px Georgia, serif';
          const w1 = ctx.measureText(line1).width;
          ctx.font = '10px Georgia, serif';
          const w2 = ctx.measureText(line2).width;
          const bw = Math.max(w1, w2) + 16;
          const bh = 34;
          const bx = (x + 12 + bw > this.canvas.width - 10) ? (x - bw - 12) : (x + 12);
          const by = Math.max(10, Math.min(this.canvas.height - bh - 10, y - 17));
          ctx.fillStyle = 'rgba(18, 13, 7, 0.95)';
          ctx.fillRect(bx, by, bw, bh);
          ctx.strokeStyle = isDone ? '#66e38c' : '#ffbe3d';
          ctx.lineWidth = 1.4;
          ctx.strokeRect(bx, by, bw, bh);
          ctx.font = 'bold 11.5px Georgia, serif';
          ctx.fillStyle = isDone ? '#8cf0a4' : '#ffd875';
          ctx.fillText(line1, bx + 8, by + 14);
          ctx.font = '10px Georgia, serif';
          ctx.fillStyle = '#e7dbc6';
          ctx.fillText(line2, bx + 8, by + 27);
          ctx.restore();
        }
      }

      // 7. Quiz-nålar (spelarens gissning + rätt mål med avståndsbåge!)
      if (!this.mini && (this.pinMarker || this.targetMarker)) {
        ctx.save();
        if (this.pinMarker && this.targetMarker) {
          const v1 = latLonToVector(this.pinMarker.lat, this.pinMarker.lon);
          const v2 = latLonToVector(this.targetMarker.lat, this.targetMarker.lon);
          ctx.beginPath();
          ctx.setLineDash([5, 4]);
          ctx.lineWidth = 2.6;
          ctx.strokeStyle = '#ffd875';
          let drawing = false;
          for (let s = 0; s <= 40; s++) {
            const ll = vectorToLatLon(slerp(v1, v2, s / 40));
            const pt = this.project(ll[0], ll[1]);
            if (pt.visible) {
              if (!drawing) { ctx.moveTo(pt.x, pt.y); drawing = true; }
              else ctx.lineTo(pt.x, pt.y);
            } else drawing = false;
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
        [this.pinMarker, this.targetMarker].forEach(m => {
          if (!m) return;
          const pt = this.project(m.lat, m.lon);
          if (!pt.visible) return;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = m.color || '#ff4757';
          ctx.strokeStyle = '#181008';
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();
          if (m.label) {
            ctx.font = 'bold 11px Georgia, serif';
            const tw = ctx.measureText(m.label).width;
            ctx.fillStyle = 'rgba(14, 11, 8, 0.9)';
            ctx.fillRect(pt.x + 9, pt.y - 9, tw + 10, 18);
            ctx.strokeStyle = m.color || '#ffd875';
            ctx.lineWidth = 1;
            ctx.strokeRect(pt.x + 9, pt.y - 9, tw + 10, 18);
            ctx.fillStyle = '#fff6e0';
            ctx.fillText(m.label, pt.x + 14, pt.y + 4);
          }
        });
        ctx.restore();
      }

      ctx.restore(); // Återställ clip()
    }

    // Rita metallisk 90-talsmodell av flygplan eller oceanångare på jordgloben
    drawCraftMarker(ctx, x, y, angle, scale, isBoat) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const s = 1.08 * Math.min(1.45, scale);
      ctx.scale(s, s);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 5;

      if (isBoat) {
        ctx.fillStyle = '#f5f2eb';
        ctx.strokeStyle = '#2b241d';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.quadraticCurveTo(8, 5, -12, 4);
        ctx.lineTo(-14, 0);
        ctx.lineTo(-12, -4);
        ctx.quadraticCurveTo(8, -5, 14, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#c8322b';
        ctx.fillRect(-3, -2, 5, 4);
      } else {
        const metalGrad = ctx.createLinearGradient(0, -14, 0, 14);
        metalGrad.addColorStop(0, '#ffffff');
        metalGrad.addColorStop(0.45, '#d7dde6');
        metalGrad.addColorStop(0.55, '#8e9bab');
        metalGrad.addColorStop(1, '#eef3f8');

        ctx.fillStyle = metalGrad;
        ctx.strokeStyle = '#1b2633';
        ctx.lineWidth = 1.1;

        ctx.beginPath();
        ctx.moveTo(16, 0);
        ctx.quadraticCurveTo(11, 2.2, 4, 2.4);
        ctx.lineTo(-4, 14);
        ctx.lineTo(-7.5, 13.5);
        ctx.lineTo(-2.5, 2.3);
        ctx.lineTo(-11, 1.8);
        ctx.lineTo(-15, 6.2);
        ctx.lineTo(-17, 5.5);
        ctx.lineTo(-14.5, 0.8);
        ctx.lineTo(-16.5, 0);
        ctx.lineTo(-14.5, -0.8);
        ctx.lineTo(-17, -5.5);
        ctx.lineTo(-15, -6.2);
        ctx.lineTo(-11, -1.8);
        ctx.lineTo(-2.5, -2.3);
        ctx.lineTo(-7.5, -13.5);
        ctx.lineTo(-4, -14);
        ctx.lineTo(4, -2.4);
        ctx.quadraticCurveTo(11, -2.2, 16, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#1d3b5c';
        ctx.beginPath();
        ctx.ellipse(10.5, 0, 2.4, 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Centrera och zooma globen mjukt mot en specifik latitud, longitud och radie
    focusOn(lat, lon, onComplete, targetRadius = null, duration = 900) {
      const targetLon = lon;
      const targetLat = Math.max(-75, Math.min(75, lat));
      const startLon = this.centerLon;
      const startLat = this.centerLat;
      const startRadius = this.radius;
      const endRadius = targetRadius !== null ? targetRadius : this.baseRadius;

      let dLon = (targetLon - startLon) % 360;
      if (dLon > 180) dLon -= 360;
      if (dLon < -180) dLon += 360;

      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        this.centerLon = startLon + dLon * ease;
        this.centerLat = startLat + (targetLat - startLat) * ease;
        this.radius = startRadius + (endRadius - startRadius) * ease;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          this.centerLon = targetLon;
          this.centerLat = targetLat;
          this.radius = endRadius;
          if (onComplete) onComplete();
        }
      };

      requestAnimationFrame(animate);
    }

    // Beräkna optimal inzoomningsradie så rutten fyller större delen av skärmen
    computeRouteZoomRadius(c1, c2, midLat, midLon) {
      const phi0 = deg2rad(midLat);
      const lam0 = deg2rad(midLon);

      const unitProj = (lat, lon) => {
        const phi = deg2rad(lat);
        const lam = deg2rad(lon);
        const dLam = lam - lam0;
        return {
          x: Math.cos(phi) * Math.sin(dLam),
          y: Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dLam)
        };
      };

      const p1 = unitProj(c1.lat, c1.lon);
      const p2 = unitProj(c2.lat, c2.lon);
      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);

      const targetW = this.canvas.width * 0.68;
      const targetH = this.canvas.height * 0.62;

      const rx = dx > 0.04 ? targetW / dx : 900;
      const ry = dy > 0.04 ? targetH / dy : 900;
      const desired = Math.min(rx, ry);

      return Math.max(250, Math.min(820, Math.round(desired)));
    }

    // Animera den röda reslinjen från stad A till stad B (eller världsarv!) med dynamisk inzoomning!
    animateFlight(fromCityKey, toCityKey, onFinish, isBoat = false, customDuration = null) {
      const resolvePt = (k) => (k && typeof k === 'object')
        ? k
        : (window.GT_WORLD.cities[k] || (window.GT_WORLD.wonders && window.GT_WORLD.wonders[k]));
      const c1 = resolvePt(fromCityKey);
      const c2 = resolvePt(toCityKey);
      if (!c1 || !c2) { if (onFinish) onFinish(); return; }

      const v1 = latLonToVector(c1.lat, c1.lon);
      const v2 = latLonToVector(c2.lat, c2.lon);

      const vMid = slerp(v1, v2, 0.5);
      const midLL = vectorToLatLon(vMid);
      const zoomRadius = this.computeRouteZoomRadius(c1, c2, midLL[0], midLL[1]);

      this.focusOn(midLL[0], midLL[1], () => {
        const duration = customDuration || (isBoat ? 5200 : 4400);
        const startTime = performance.now();

        this.flightAnimation = {
          fromV: v1,
          toV: v2,
          progress: 0,
          isBoat: isBoat
        };

        const step = (now) => {
          const elapsed = now - startTime;
          const t = Math.min(1, elapsed / duration);
          const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          this.flightAnimation.progress = ease;

          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            this.flightAnimation = null;
            if (onFinish) onFinish();
          }
        };

        requestAnimationFrame(step);
      }, zoomRadius, 950);
    }
  }

  window.GlobeRenderer = GlobeRenderer;
})();
