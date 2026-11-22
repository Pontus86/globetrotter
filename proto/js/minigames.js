// Globetrotter - 8 Egna HTML5 Canvas & Web Audio Minispel (100 % egen kod & grafik)
// 1. lander (Raketlandaren)      2. piano (Pianisten)
// 3. navigator (Skeppsnavigatör) 4. camera (Pressfotografen)
// 5. diver (Skattdykaren)        6. stoker (Ånglokets eldare)
// 7. slalom (Alpinslalom)        8. passport (Passkontrollanten)

(function () {
  'use strict';

  const CITY_MINIGAME = {
    malmo:        { id: 'navigator', title: 'Skeppsnavigatör i Öresund' },
    stockholm:    { id: 'arctic',    title: 'Arktisk naturbevakare (Grönland)' },
    paris:        { id: 'piano',     title: 'Konsertpianist vid Seine' },
    rom:          { id: 'slalom',    title: 'Alpinslalom i Dolomiterna' },
    london:       { id: 'camera',    title: 'Pressfotograf på Fleet Street' },
    istanbul:     { id: 'navigator', title: 'Lots genom Bosporen' },
    kairo:        { id: 'camera',    title: 'Dokumentärfotograf vid Nilen' },
    kapstaden:    { id: 'navigator', title: 'Kapten runt Godahoppsudden' },
    delhi:        { id: 'stoker',    title: 'Eldare på Indiens ånglok' },
    bangkok:      { id: 'diver',     title: 'Skattdykare i Siambukten' },
    peking:       { id: 'stoker',    title: 'Eldare på Nordexpressen' },
    tokyo:        { id: 'camera',    title: 'Gatufotograf i Shibuya' },
    sydney:       { id: 'diver',     title: 'Koralldykare utanför Sydney' },
    sanfrancisco: { id: 'lander',    title: 'Testpilot (Landningsmodul)' },
    newyork:      { id: 'lander',    title: 'Rymdpilot i simulator' },
    mexicocity:   { id: 'passport',  title: 'Passkontrollant på flygplatsen' },
    rio:          { id: 'diver',     title: 'Smaragddykare vid Copacabana' }
  };

  function beep(freq, dur = 0.12, type = 'triangle', vol = 0.14) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!beep._ctx) beep._ctx = new AC();
      const ctx = beep._ctx;
      if (ctx.state === 'suspended') ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur + 0.02);
    } catch (e) {}
  }

  function makeShell(container, title, subtitle, controlsHint) {
    container.innerHTML = `
      <div class="mg-shell">
        <div class="mg-top">
          <div>
            <div class="mg-title">★ ${title}</div>
            <div class="mg-sub">${subtitle}</div>
          </div>
          <div class="mg-hud" id="mgHud">Redo</div>
        </div>
        <div class="mg-stage" id="mgStage"></div>
        <div class="mg-footer">
          <span class="mg-hint">${controlsHint}</span>
          <button class="globe-brass-btn" id="mgQuitBtn" style="padding:4px 10px; font-size:11px;">Avbryt passet</button>
        </div>
      </div>
    `;
    return {
      stage: container.querySelector('#mgStage'),
      hud: container.querySelector('#mgHud'),
      quitBtn: container.querySelector('#mgQuitBtn')
    };
  }

  // =========================================================================
  // 1. RAKETLANDAREN (lander)
  // =========================================================================
  function runLander(container, onFinish) {
    const ui = makeShell(container, 'RAKETLANDAREN', 'Landa mjukt på guldplattformen (3 landningar)', 'Styr med ← ↑ → eller W A D · Mjuk landning krävs!');
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 250;
    canvas.className = 'mg-canvas';
    ui.stage.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const keys = {};
    const onDown = e => { keys[e.code] = true; if (['ArrowUp', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault(); };
    const onUp = e => { keys[e.code] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    let round = 1, wins = 0, fuel = 100, ended = false, raf = 0;
    let ship = {}, pad = {};
    const stars = Array.from({ length: 55 }, () => ({ x: Math.random() * 640, y: Math.random() * 190, r: 0.7 + Math.random() * 1.3 }));

    function resetRound() {
      fuel = 100;
      pad = { x: 110 + Math.random() * 400, w: 96, y: 226 };
      ship = { x: 90 + Math.random() * 460, y: 34, vx: (Math.random() - 0.5) * 1.1, vy: 0.2 };
    }
    resetRound();

    function cleanup(score) {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      onFinish({ score, max: 3, passed: score >= 2, summary: `Du klarade ${score} av 3 mjuka raketlandningar!` });
    }
    ui.quitBtn.onclick = () => cleanup(wins);

    function loop() {
      if (ended || !canvas.isConnected) { cleanup(wins); return; }
      const thrust = (keys.ArrowUp || keys.KeyW || keys.Space) && fuel > 0;
      const left = (keys.ArrowLeft || keys.KeyA) && fuel > 0;
      const right = (keys.ArrowRight || keys.KeyD) && fuel > 0;

      ship.vy += 0.036; // mångravitation
      if (thrust) { ship.vy -= 0.095; fuel = Math.max(0, fuel - 0.45); }
      if (left)   { ship.vx -= 0.055; fuel = Math.max(0, fuel - 0.22); }
      if (right)  { ship.vx += 0.055; fuel = Math.max(0, fuel - 0.22); }
      ship.vx *= 0.992;
      ship.x = Math.max(18, Math.min(622, ship.x + ship.vx));
      ship.y += ship.vy;

      // Render
      ctx.fillStyle = '#090e18';
      ctx.fillRect(0, 0, 640, 250);
      ctx.fillStyle = '#dbe7ff';
      stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); });

      // Mark & plattform
      ctx.fillStyle = '#332b22';
      ctx.fillRect(0, 226, 640, 24);
      ctx.fillStyle = '#ffbe3d';
      ctx.fillRect(pad.x, pad.y - 3, pad.w, 6);
      ctx.fillStyle = '#fff5d0';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('LANDNINGSZON', pad.x + 12, pad.y + 15);

      // Raket
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.fillStyle = '#e8edf5';
      ctx.beginPath();
      ctx.moveTo(0, -14); ctx.lineTo(10, 8); ctx.lineTo(-10, 8); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#c8322b';
      ctx.fillRect(-4, -5, 8, 5);
      // Ben
      ctx.strokeStyle = '#ffd875'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-7, 8); ctx.lineTo(-12, 14); ctx.moveTo(7, 8); ctx.lineTo(12, 14); ctx.stroke();
      if (thrust) {
        ctx.fillStyle = '#ff922b';
        ctx.beginPath(); ctx.moveTo(-5, 9); ctx.lineTo(5, 9); ctx.lineTo(0, 22 + Math.random() * 6); ctx.closePath(); ctx.fill();
      }
      ctx.restore();

      const speedOk = Math.abs(ship.vy) <= 2.1 && Math.abs(ship.vx) <= 1.6;
      ui.hud.innerHTML = `Försök <b>${round}/3</b> · Landningar: <b style="color:#78e08f">${wins}</b> · Bränsle: <b>${Math.round(fuel)}%</b> · Fart: <b style="color:${speedOk ? '#78e08f' : '#ff7675'}">${ship.vy.toFixed(1)}</b>`;

      if (ship.y + 14 >= pad.y) {
        const onPad = ship.x >= pad.x + 6 && ship.x <= pad.x + pad.w - 6;
        if (onPad && speedOk) {
          wins++;
          beep(523, 0.14); setTimeout(() => beep(659, 0.18), 110);
        } else {
          beep(140, 0.28, 'sawtooth');
        }
        round++;
        if (round > 3) { cleanup(wins); return; }
        resetRound();
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  // =========================================================================
  // 2. PIANISTEN — GEHÖRSSPEL (piano)
  // =========================================================================
  function runPiano(container, onFinish) {
    const ui = makeShell(container, 'KONSERTPIANISTEN', 'Lyssna på melodin och spela tillbaka rätt tangenter (4 rundor)', 'Klicka på tangenterna eller använd A S D F G H J K');
    const notes = [
      { label: 'C', key: 'KeyA', freq: 261.63 },
      { label: 'D', key: 'KeyS', freq: 293.66 },
      { label: 'E', key: 'KeyD', freq: 329.63 },
      { label: 'F', key: 'KeyF', freq: 349.23 },
      { label: 'G', key: 'KeyG', freq: 392.00 },
      { label: 'A', key: 'KeyH', freq: 440.00 },
      { label: 'B', key: 'KeyJ', freq: 493.88 },
      { label: 'C5', key: 'KeyK', freq: 523.25 }
    ];

    ui.stage.innerHTML = `
      <div class="mg-piano-wrap">
        <div class="mg-piano-msg" id="pianoMsg">Lyssna noga på slingan...</div>
        <div class="mg-piano-keys" id="pianoKeys">
          ${notes.map((n, i) => `<button class="mg-key" data-idx="${i}"><span>${n.label}</span><small>${n.key.replace('Key', '')}</small></button>`).join('')}
        </div>
      </div>
    `;

    const msgEl = ui.stage.querySelector('#pianoMsg');
    const keyBtns = Array.from(ui.stage.querySelectorAll('.mg-key'));
    let round = 1, score = 0, seq = [], playerIdx = 0, playing = true, ended = false;

    function flashKey(idx, cls = 'active') {
      const b = keyBtns[idx];
      if (!b) return;
      b.classList.add(cls);
      beep(notes[idx].freq, 0.28, 'triangle', 0.16);
      setTimeout(() => b.classList.remove(cls), 260);
    }

    function startRound() {
      if (ended) return;
      playing = true;
      playerIdx = 0;
      const len = round + 2; // 3, 4, 5, 6 toner
      seq = Array.from({ length: len }, () => Math.floor(Math.random() * notes.length));
      ui.hud.innerHTML = `Runda <b>${round}/4</b> · Rätt: <b style="color:#78e08f">${score}</b>`;
      msgEl.textContent = `Lyssna på melodin (${len} toner)...`;
      seq.forEach((nIdx, step) => {
        setTimeout(() => {
          if (ended) return;
          flashKey(nIdx, 'demo');
          if (step === seq.length - 1) {
            setTimeout(() => {
              playing = false;
              msgEl.textContent = 'Din tur! Spela tillbaka samma toner!';
            }, 340);
          }
        }, 500 + step * 460);
      });
    }

    function cleanup(finalScore) {
      if (ended) return;
      ended = true;
      window.removeEventListener('keydown', onKey);
      onFinish({ score: finalScore, max: 4, passed: finalScore >= 2, summary: `Du spelade rätt på ${finalScore} av 4 melodier!` });
    }
    ui.quitBtn.onclick = () => cleanup(score);

    function pressNote(idx) {
      if (playing || ended) return;
      if (idx === seq[playerIdx]) {
        flashKey(idx, 'correct');
        playerIdx++;
        if (playerIdx >= seq.length) {
          score++;
          playing = true;
          msgEl.textContent = 'Briljant spelat! Nästa melodi...';
          round++;
          if (round > 4) setTimeout(() => cleanup(score), 650);
          else setTimeout(startRound, 800);
        }
      } else {
        flashKey(idx, 'wrong');
        beep(130, 0.25, 'sawtooth', 0.14);
        playing = true;
        msgEl.textContent = 'Fel ton! Vi provar nästa slinga...';
        round++;
        if (round > 4) setTimeout(() => cleanup(score), 650);
        else setTimeout(startRound, 850);
      }
    }

    keyBtns.forEach(b => { b.onclick = () => pressNote(Number(b.dataset.idx)); });
    const onKey = e => {
      const idx = notes.findIndex(n => n.key === e.code);
      if (idx >= 0) pressNote(idx);
    };
    window.addEventListener('keydown', onKey);
    startRound();
  }

  // =========================================================================
  // 3. SKEPPSNAVIGATÖREN (navigator)
  // =========================================================================
  function runNavigator(container, onFinish) {
    const ui = makeShell(container, 'SKEPPSNAVIGATÖREN', 'Styr fartyget förbi reven in i den gröna hamnen (3 etapper)', 'Styr med ↑ ↓ ← → eller W A S D');
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 250;
    canvas.className = 'mg-canvas';
    ui.stage.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const keys = {};
    const onDown = e => { keys[e.code] = true; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault(); };
    const onUp = e => { keys[e.code] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    let round = 1, wins = 0, ended = false, raf = 0;
    let boat = {}, goal = {}, reefs = [];

    function setupRound() {
      boat = { x: 42, y: 125, angle: 0 };
      goal = { x: 590, y: 50 + Math.random() * 150, r: 22 };
      reefs = [];
      for (let i = 0; i < 6 + round * 2; i++) {
        reefs.push({ x: 135 + Math.random() * 380, y: 26 + Math.random() * 198, r: 14 + Math.random() * 15 });
      }
    }
    setupRound();

    function cleanup(s) {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      onFinish({ score: s, max: 3, passed: s >= 2, summary: `Du lotsade fartyget säkert i hamn ${s} av 3 gånger!` });
    }
    ui.quitBtn.onclick = () => cleanup(wins);

    function loop() {
      if (ended || !canvas.isConnected) { cleanup(wins); return; }
      const spd = 2.1;
      if (keys.ArrowUp || keys.KeyW) boat.y -= spd;
      if (keys.ArrowDown || keys.KeyS) boat.y += spd;
      if (keys.ArrowLeft || keys.KeyA) boat.x -= spd * 0.7;
      if (keys.ArrowRight || keys.KeyD) boat.x += spd * 1.15;
      else boat.x += 0.85; // mild framdrift
      boat.x = Math.max(16, Math.min(624, boat.x));
      boat.y = Math.max(16, Math.min(234, boat.y));

      // Sjökort
      ctx.fillStyle = '#0d2b45';
      ctx.fillRect(0, 0, 640, 250);
      ctx.strokeStyle = 'rgba(255,220,140,0.12)';
      for (let x = 0; x < 640; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 250); ctx.stroke(); }
      for (let y = 0; y < 250; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(640, y); ctx.stroke(); }

      // Rev
      reefs.forEach(rf => {
        ctx.beginPath(); ctx.arc(rf.x, rf.y, rf.r, 0, Math.PI * 2);
        ctx.fillStyle = '#4a3d2d'; ctx.fill();
        ctx.strokeStyle = '#9ecae1'; ctx.lineWidth = 2; ctx.stroke();
      });

      // Hamn
      ctx.beginPath(); ctx.arc(goal.x, goal.y, goal.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(72, 219, 120, 0.25)'; ctx.fill();
      ctx.strokeStyle = '#66e38c'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = '#c8ffd8'; ctx.font = 'bold 10px Georgia,serif';
      ctx.fillText('HAMN', goal.x - 16, goal.y + 4);

      // Fartyg
      ctx.save();
      ctx.translate(boat.x, boat.y);
      ctx.fillStyle = '#fff5e0';
      ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-10, -7); ctx.lineTo(-10, 7); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#c8322b'; ctx.fillRect(-5, -3, 6, 6);
      ctx.restore();

      ui.hud.innerHTML = `Etapp <b>${round}/3</b> · I hamn: <b style="color:#78e08f">${wins}</b>`;

      // Kollision med rev
      if (reefs.some(rf => Math.hypot(boat.x - rf.x, boat.y - rf.y) < rf.r + 8)) {
        beep(130, 0.25, 'sawtooth');
        round++;
        if (round > 3) { cleanup(wins); return; }
        setupRound();
      } else if (Math.hypot(boat.x - goal.x, boat.y - goal.y) < goal.r + 6) {
        wins++;
        beep(587, 0.14); setTimeout(() => beep(784, 0.18), 110);
        round++;
        if (round > 3) { cleanup(wins); return; }
        setupRound();
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  // =========================================================================
  // 4. PRESSFOTOGRAFEN (camera)
  // =========================================================================
  function runCamera(container, onFinish) {
    const ui = makeShell(container, 'PRESSFOTOGRAFEN', 'Fånga 5 rörliga guldmotiv i kamerasökaren på 20 sekunder!', 'Rör musen och klicka för att ta foto!');
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 250;
    canvas.className = 'mg-canvas';
    canvas.style.cursor = 'crosshair';
    ui.stage.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let mx = 320, my = 125, hits = 0, shots = 0, timeLeft = 20, flash = 0, ended = false, raf = 0;
    let target = spawnTarget();
    const startTs = performance.now();

    function spawnTarget() {
      return {
        x: 60 + Math.random() * 520,
        y: 45 + Math.random() * 160,
        vx: (Math.random() < 0.5 ? -1 : 1) * (1.8 + Math.random() * 1.6),
        vy: (Math.random() < 0.5 ? -1 : 1) * (1.1 + Math.random() * 1.1),
        r: 20
      };
    }

    function cleanup(s) {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      onFinish({ score: Math.min(5, s), max: 5, passed: s >= 3, summary: `Du fångade ${Math.min(5, s)} av 5 skarpa pressbilder!` });
    }
    ui.quitBtn.onclick = () => cleanup(hits);

    canvas.onmousemove = e => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) * (640 / r.width);
      my = (e.clientY - r.top) * (250 / r.height);
    };
    canvas.onclick = () => {
      if (ended) return;
      shots++;
      flash = 1.0;
      if (Math.hypot(mx - target.x, my - target.y) <= target.r + 16) {
        hits++;
        beep(740, 0.09); setTimeout(() => beep(987, 0.12), 70);
        if (hits >= 5) { cleanup(5); return; }
        target = spawnTarget();
      } else {
        beep(210, 0.12, 'square', 0.08);
      }
    };

    function loop(now) {
      if (ended || !canvas.isConnected) { cleanup(hits); return; }
      timeLeft = Math.max(0, 20 - (now - startTs) / 1000);
      if (timeLeft <= 0) { cleanup(hits); return; }

      target.x += target.vx; target.y += target.vy;
      if (target.x < 35 || target.x > 605) target.vx *= -1;
      if (target.y < 30 || target.y > 220) target.vy *= -1;
      flash = Math.max(0, flash - 0.08);

      // Bakgrund (stads-silhuett)
      const g = ctx.createLinearGradient(0, 0, 0, 250);
      g.addColorStop(0, '#1e2c44'); g.addColorStop(1, '#4a3525');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 640, 250);
      ctx.fillStyle = '#14110f';
      for (let i = 0; i < 16; i++) {
        const bh = 45 + ((i * 37) % 85);
        ctx.fillRect(i * 42, 250 - bh, 38, bh);
      }

      // Guld-motiv
      ctx.beginPath(); ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 200, 70, 0.9)'; ctx.fill();
      ctx.strokeStyle = '#fff8dc'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = '#241608'; ctx.font = 'bold 16px Georgia,serif';
      ctx.fillText('★', target.x - 7, target.y + 6);

      // Kamerasökare
      ctx.strokeStyle = '#ffd875'; ctx.lineWidth = 2;
      ctx.strokeRect(mx - 36, my - 26, 72, 52);
      ctx.beginPath(); ctx.moveTo(mx - 10, my); ctx.lineTo(mx + 10, my); ctx.moveTo(mx, my - 10); ctx.lineTo(mx, my + 10); ctx.stroke();

      if (flash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${flash * 0.65})`;
        ctx.fillRect(0, 0, 640, 250);
      }
      ui.hud.innerHTML = `Bilder: <b style="color:#78e08f">${hits}/5</b> · Tid: <b>${timeLeft.toFixed(1)}s</b>`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  // =========================================================================
  // 5. SKATTDYKAREN (diver)
  // =========================================================================
  function runDiver(container, onFinish) {
    const ui = makeShell(container, 'SKATTDYKAREN', 'Samla 5 guldkistor på havsbotten — undvik maneter och hämta luft vid ytan!', 'Styr med ← ↑ ↓ → eller W A S D');
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 250;
    canvas.className = 'mg-canvas';
    ui.stage.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const keys = {};
    const onDown = e => { keys[e.code] = true; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault(); };
    const onUp = e => { keys[e.code] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    let diver = { x: 320, y: 36 }, oxygen = 100, found = 0, ended = false, raf = 0;
    const chests = Array.from({ length: 5 }, (_, i) => ({ x: 70 + i * 122 + (Math.random() - 0.5) * 35, y: 224, taken: false }));
    const jellies = Array.from({ length: 4 }, (_, i) => ({ x: 120 + i * 135, y: 90 + Math.random() * 90, vx: (i % 2 ? 1 : -1) * 1.4 }));

    function cleanup(s) {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      onFinish({ score: s, max: 5, passed: s >= 3, summary: `Du bärgade ${s} av 5 sjunkna skatter!` });
    }
    ui.quitBtn.onclick = () => cleanup(found);

    function loop() {
      if (ended || !canvas.isConnected) { cleanup(found); return; }
      const spd = 2.6;
      if (keys.ArrowUp || keys.KeyW) diver.y -= spd;
      if (keys.ArrowDown || keys.KeyS) diver.y += spd;
      if (keys.ArrowLeft || keys.KeyA) diver.x -= spd;
      if (keys.ArrowRight || keys.KeyD) diver.x += spd;
      diver.x = Math.max(18, Math.min(622, diver.x));
      diver.y = Math.max(24, Math.min(230, diver.y));

      if (diver.y <= 34) oxygen = Math.min(100, oxygen + 1.4);
      else oxygen = Math.max(0, oxygen - 0.18);
      if (oxygen <= 0) { beep(120, 0.3, 'sawtooth'); cleanup(found); return; }

      jellies.forEach(j => {
        j.x += j.vx;
        if (j.x < 30 || j.x > 610) j.vx *= -1;
        if (Math.hypot(diver.x - j.x, diver.y - j.y) < 18) {
          oxygen = Math.max(0, oxygen - 18);
          diver.y = Math.max(26, diver.y - 24);
          beep(170, 0.16, 'sawtooth');
        }
      });

      chests.forEach(c => {
        if (!c.taken && Math.hypot(diver.x - c.x, diver.y - c.y) < 22) {
          c.taken = true;
          found++;
          beep(659, 0.1); setTimeout(() => beep(880, 0.14), 80);
          if (found >= 5) { cleanup(5); }
        }
      });

      const g = ctx.createLinearGradient(0, 0, 0, 250);
      g.addColorStop(0, '#1e6e9c'); g.addColorStop(1, '#072238');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 640, 250);
      ctx.fillStyle = '#c2a673'; ctx.fillRect(0, 234, 640, 16);
      ctx.fillStyle = 'rgba(200,240,255,0.25)'; ctx.fillRect(0, 0, 640, 28);

      chests.forEach(c => {
        if (c.taken) return;
        ctx.fillStyle = '#d49b2b'; ctx.fillRect(c.x - 11, c.y - 8, 22, 14);
        ctx.strokeStyle = '#fff1b8'; ctx.lineWidth = 1.5; ctx.strokeRect(c.x - 11, c.y - 8, 22, 14);
      });

      jellies.forEach(j => {
        ctx.beginPath(); ctx.arc(j.x, j.y, 11, Math.PI, 0);
        ctx.fillStyle = 'rgba(255, 130, 195, 0.85)'; ctx.fill();
      });

      ctx.beginPath(); ctx.arc(diver.x, diver.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#ffe066'; ctx.fill();
      ctx.strokeStyle = '#1c140c'; ctx.lineWidth = 2; ctx.stroke();

      ui.hud.innerHTML = `Skatter: <b style="color:#78e08f">${found}/5</b> · Syre: <b style="color:${oxygen > 30 ? '#74c0fc' : '#ff7675'}">${Math.round(oxygen)}%</b>`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  // =========================================================================
  // 6. ÅNGLOKETS ELDARE (stoker)
  // =========================================================================
  function runStoker(container, onFinish) {
    const ui = makeShell(container, 'ÅNGLOKETS ELDARE', 'Håll ångtrycket i den gröna zonen (40–75 %) under hela backen (16 sek)!', 'Klicka "Skyffla kol" (eller Mellanslag) / "Släpp ut ånga" (eller V)');
    ui.stage.innerHTML = `
      <div class="mg-stoker-wrap">
        <div class="mg-gauge-bar">
          <div class="mg-gauge-green"></div>
          <div class="mg-gauge-needle" id="stokerNeedle"></div>
        </div>
        <div class="mg-stoker-btns">
          <button class="stamp-action-btn" id="btnCoal">Skyffla kol (+tryck)</button>
          <button class="globe-brass-btn" id="btnVent">Släpp ut ånga (−tryck)</button>
        </div>
      </div>
    `;
    const needle = ui.stage.querySelector('#stokerNeedle');
    const btnCoal = ui.stage.querySelector('#btnCoal');
    const btnVent = ui.stage.querySelector('#btnVent');

    let pressure = 55, goodTicks = 0, totalTicks = 0, ended = false;
    const startTs = performance.now();

    const addCoal = () => { pressure = Math.min(100, pressure + 12); beep(220, 0.08, 'triangle', 0.1); };
    const ventSteam = () => { pressure = Math.max(0, pressure - 11); beep(460, 0.09, 'sine', 0.08); };
    btnCoal.onclick = addCoal;
    btnVent.onclick = ventSteam;
    const onKey = e => {
      if (e.code === 'Space') { e.preventDefault(); addCoal(); }
      if (e.code === 'KeyV') ventSteam();
    };
    window.addEventListener('keydown', onKey);

    let timer = 0;
    function cleanup() {
      if (ended) return;
      ended = true;
      clearInterval(timer);
      window.removeEventListener('keydown', onKey);
      const ratio = totalTicks > 0 ? goodTicks / totalTicks : 0;
      const pct = Math.round(ratio * 100);
      const pts = Math.round(ratio * 5);
      onFinish({ score: pts, max: 5, passed: pct >= 55, summary: `Du höll perfekt ångtryck under ${pct} % av tågresan!` });
    }
    ui.quitBtn.onclick = cleanup;

    timer = setInterval(() => {
      const elapsed = (performance.now() - startTs) / 1000;
      if (elapsed >= 16 || !needle.isConnected) { cleanup(); return; }
      // Varierande uppförsbacke drar ner trycket
      pressure = Math.max(0, Math.min(100, pressure - (1.8 + Math.sin(elapsed * 0.9) * 1.2)));
      totalTicks++;
      const inGreen = pressure >= 40 && pressure <= 75;
      if (inGreen) goodTicks++;
      needle.style.left = `${pressure}%`;
      ui.hud.innerHTML = `Tryck: <b style="color:${inGreen ? '#78e08f' : '#ff7675'}">${Math.round(pressure)}%</b> · I grön zon: <b>${Math.round((goodTicks / totalTicks) * 100)}%</b> · Tid: <b>${(16 - elapsed).toFixed(1)}s</b>`;
    }, 100);
  }

  // =========================================================================
  // 7. ALPINSLALOM (slalom)
  // =========================================================================
  function runSlalom(container, onFinish) {
    const ui = makeShell(container, 'ALPINSLALOM', 'Åk igenom så många portar som möjligt (10 portar)!', 'Styr med ← → eller A / D');
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 250;
    canvas.className = 'mg-canvas';
    ui.stage.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const keys = {};
    const onDown = e => { keys[e.code] = true; if (['ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault(); };
    const onUp = e => { keys[e.code] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    let skierX = 320, passed = 0, totalGates = 10, gateIdx = 0, ended = false, raf = 0;
    const gates = Array.from({ length: totalGates }, (_, i) => ({
      x: 110 + Math.random() * 420,
      y: 260 + i * 130,
      w: 88,
      checked: false,
      color: i % 2 === 0 ? '#d63031' : '#0984e3'
    }));

    function cleanup(s) {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      onFinish({ score: s, max: totalGates, passed: s >= 6, summary: `Du tog dig igenom ${s} av ${totalGates} slalomportar!` });
    }
    ui.quitBtn.onclick = () => cleanup(passed);

    function loop() {
      if (ended || !canvas.isConnected) { cleanup(passed); return; }
      if (keys.ArrowLeft || keys.KeyA) skierX -= 4.2;
      if (keys.ArrowRight || keys.KeyD) skierX += 4.2;
      skierX = Math.max(24, Math.min(616, skierX));

      ctx.fillStyle = '#eef5fb';
      ctx.fillRect(0, 0, 640, 250);

      gates.forEach(gt => {
        gt.y -= 2.8;
        if (!gt.checked && gt.y <= 62) {
          gt.checked = true;
          gateIdx++;
          if (Math.abs(skierX - gt.x) <= gt.w / 2) {
            passed++;
            beep(660, 0.08);
          } else {
            beep(180, 0.14, 'sawtooth');
          }
        }
        if (gt.y > -20 && gt.y < 270) {
          ctx.fillStyle = gt.color;
          ctx.fillRect(gt.x - gt.w / 2 - 4, gt.y - 16, 6, 20);
          ctx.fillRect(gt.x + gt.w / 2 - 2, gt.y - 16, 6, 20);
        }
      });

      // Skidåkare
      ctx.fillStyle = '#1f2937';
      ctx.beginPath(); ctx.arc(skierX, 58, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#d63031'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(skierX - 5, 50); ctx.lineTo(skierX - 5, 72); ctx.moveTo(skierX + 5, 50); ctx.lineTo(skierX + 5, 72); ctx.stroke();

      ui.hud.innerHTML = `Portar: <b style="color:#246b36">${passed}/${totalGates}</b> · Kvar: <b>${totalGates - gateIdx}</b>`;
      if (gateIdx >= totalGates) { cleanup(passed); return; }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  // =========================================================================
  // 8. PASSKONTROLLANTEN (passport)
  // =========================================================================
  function runPassportControl(container, onFinish) {
    const ui = makeShell(container, 'PASSKONTROLLANTEN', 'Granska 5 resenärers pass! Godkänn giltiga pass (1996+), neka utgångna eller ogiltiga.', 'Klicka GODKÄND eller NEKAD');
    const names = ['Anna Lindqvist', 'Carlos Rivera', 'Kenji Sato', 'Claire Moreau', 'Omar Hassan', 'Lisa Bergman'];
    const countries = ['Sverige', 'Mexiko', 'Japan', 'Frankrike', 'Egypten', 'Australien'];
    const cases = Array.from({ length: 5 }, (_, i) => {
      const valid = Math.random() < 0.55;
      const reason = valid ? null : (Math.random() < 0.5 ? 'expired' : 'seal');
      return {
        name: names[(i + Math.floor(Math.random() * 2)) % names.length],
        country: countries[i % countries.length],
        expiry: reason === 'expired' ? (1990 + Math.floor(Math.random() * 5)) : (1997 + Math.floor(Math.random() * 6)),
        seal: reason === 'seal' ? 'SAKNAS' : 'ÄKTA SIGILL ✓',
        valid
      };
    });

    let idx = 0, score = 0, ended = false;
    function cleanup(s) {
      if (ended) return;
      ended = true;
      onFinish({ score: s, max: 5, passed: s >= 3, summary: `Du fattade rätt beslut i ${s} av 5 passkontroller!` });
    }
    ui.quitBtn.onclick = () => cleanup(score);

    function renderCase() {
      if (idx >= cases.length) { cleanup(score); return; }
      const c = cases[idx];
      ui.hud.innerHTML = `Resenär <b>${idx + 1}/5</b> · Rätt: <b style="color:#78e08f">${score}</b>`;
      ui.stage.innerHTML = `
        <div class="mg-pass-card">
          <div class="mg-pass-row"><span>Namn:</span><b>${c.name}</b></div>
          <div class="mg-pass-row"><span>Nationalitet:</span><b>${c.country}</b></div>
          <div class="mg-pass-row"><span>Giltigt till år:</span><b style="color:${c.expiry < 1996 ? '#a82828' : '#1b4d27'}">${c.expiry}</b></div>
          <div class="mg-pass-row"><span>Säkerhetssigill:</span><b>${c.seal}</b></div>
          <div class="mg-pass-btns">
            <button class="stamp-action-btn" id="btnApprove" style="background:#2f7d43;">✓ GODKÄND</button>
            <button class="stamp-action-btn" id="btnDeny" style="background:#a82828;">✕ NEKAD</button>
          </div>
        </div>
      `;
      const decide = (approved) => {
        if (approved === c.valid) { score++; beep(660, 0.1); }
        else { beep(160, 0.18, 'sawtooth'); }
        idx++;
        renderCase();
      };
      ui.stage.querySelector('#btnApprove').onclick = () => decide(true);
      ui.stage.querySelector('#btnDeny').onclick = () => decide(false);
    }
    renderCase();
  }

  // =========================================================================
  // 9. ARKTISK NATURBEVAKARE — ISBJÖRNSJÄGAREN / MÄRKNINGSPIL PÅ GRÖNLAND (arctic)
  // =========================================================================
  function runArcticBear(container, onFinish) {
    const ui = makeShell(container, 'ARKTISK NATURBEVAKARE · GRÖNLAND', 'Träffa 6 vandrande isbjörnar med märkningspilar på isflaken (22 sek) — undvik pingviner/sälar!', 'Sikta med musen och klicka för att skjuta pil!');
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 250;
    canvas.className = 'mg-canvas';
    canvas.style.cursor = 'crosshair';
    ui.stage.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let mx = 320, my = 125, hits = 0, ammo = 12, ended = false, raf = 0, recoil = 0;
    const startTs = performance.now();

    function spawnBear() {
      const fromLeft = Math.random() < 0.5;
      return {
        x: fromLeft ? -35 : 675,
        y: 125 + Math.random() * 82,
        vx: (fromLeft ? 1 : -1) * (1.8 + Math.random() * 1.9),
        hitFlash: 0
      };
    }
    let bears = [spawnBear(), spawnBear()];
    const seal = { x: 180, y: 196, vx: 1.1 };

    function cleanup(s) {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      onFinish({ score: Math.min(6, s), max: 6, passed: s >= 4, summary: `Du träffade ${Math.min(6, s)} av 6 isbjörnar på Grönlands isflak!` });
    }
    ui.quitBtn.onclick = () => cleanup(hits);

    canvas.onmousemove = e => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) * (640 / r.width);
      my = (e.clientY - r.top) * (250 / r.height);
    };
    canvas.onclick = () => {
      if (ended || ammo <= 0) return;
      ammo--;
      recoil = 1;
      let hitAny = false;
      for (let i = 0; i < bears.length; i++) {
        const b = bears[i];
        if (Math.abs(mx - b.x) < 28 && Math.abs(my - b.y) < 18) {
          hitAny = true;
          hits++;
          beep(540, 0.08); setTimeout(() => beep(760, 0.12), 70);
          bears[i] = spawnBear();
          break;
        }
      }
      if (!hitAny) {
        if (Math.hypot(mx - seal.x, my - seal.y) < 18) {
          hits = Math.max(0, hits - 1);
          beep(120, 0.22, 'sawtooth');
        } else {
          beep(220, 0.08, 'square', 0.08);
        }
      }
      if (hits >= 6 || ammo <= 0) setTimeout(() => cleanup(hits), 160);
    };

    function loop(now) {
      if (ended || !canvas.isConnected) { cleanup(hits); return; }
      const timeLeft = Math.max(0, 22 - (now - startTs) / 1000);
      if (timeLeft <= 0) { cleanup(hits); return; }
      recoil = Math.max(0, recoil - 0.12);

      // Arktisk himmel & isberg
      const sky = ctx.createLinearGradient(0, 0, 0, 120);
      sky.addColorStop(0, '#10253f'); sky.addColorStop(1, '#4b7fa8');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, 640, 120);
      // Norrsken
      ctx.fillStyle = 'rgba(102, 240, 170, 0.16)';
      ctx.beginPath(); ctx.ellipse(320, 42, 240, 18, -0.06, 0, Math.PI * 2); ctx.fill();
      // Snö & isflak
      ctx.fillStyle = '#dcebf7'; ctx.fillRect(0, 118, 640, 132);
      ctx.fillStyle = '#b9d6ee';
      ctx.beginPath(); ctx.moveTo(40, 118); ctx.lineTo(135, 58); ctx.lineTo(230, 118); ctx.fill();
      ctx.beginPath(); ctx.moveTo(420, 118); ctx.lineTo(525, 48); ctx.lineTo(615, 118); ctx.fill();

      // Säl (ej mål!)
      seal.x += seal.vx;
      if (seal.x < 40 || seal.x > 600) seal.vx *= -1;
      ctx.fillStyle = '#536270';
      ctx.beginPath(); ctx.ellipse(seal.x, seal.y, 16, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#222'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('SÄL', seal.x - 9, seal.y + 18);

      // Isbjörnar
      bears.forEach((b, idx) => {
        b.x += b.vx;
        if (b.x < -50 || b.x > 690) bears[idx] = spawnBear();
        ctx.save();
        ctx.translate(b.x, b.y);
        if (b.vx < 0) ctx.scale(-1, 1);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#7b93a8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(0, 0, 22, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(20, -4, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1b1b1b';
        ctx.beginPath(); ctx.arc(26, -4, 2, 0, Math.PI * 2); ctx.fill(); // nos
        ctx.fillRect(-16, 8, 6, 8); ctx.fillRect(8, 8, 6, 8); // ben
        ctx.restore();
      });

      // Kikarsikte
      ctx.strokeStyle = recoil > 0.3 ? '#ff4757' : '#d63031';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(mx, my, 18, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mx - 24, my); ctx.lineTo(mx + 24, my); ctx.moveTo(mx, my - 24); ctx.lineTo(mx, my + 24); ctx.stroke();

      ui.hud.innerHTML = `Isbjörnar: <b style="color:#78e08f">${hits}/6</b> · Pilar: <b>${ammo}</b> · Tid: <b>${timeLeft.toFixed(1)}s</b>`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  const RUNNERS = {
    lander: runLander,
    piano: runPiano,
    navigator: runNavigator,
    camera: runCamera,
    diver: runDiver,
    stoker: runStoker,
    slalom: runSlalom,
    passport: runPassportControl,
    arctic: runArcticBear
  };

  window.GT_MINIGAMES = {
    getForCity(cityKey) {
      return CITY_MINIGAME[cityKey] || { id: 'passport', title: 'Passkontrollant' };
    },
    start(gameId, container, onFinish) {
      const fn = RUNNERS[gameId] || runPassportControl;
      fn(container, onFinish);
    }
  };
})();
