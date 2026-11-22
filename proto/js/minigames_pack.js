// Globetrotter - 30 Fotografiska BackPacker-minispel (8 fotografiska motorer, 0 SVG-ikoner!)
// Alla spel använder riktiga foton som bakgrunder, kort och objekt i äkta 90-tals CD-ROM-stil.

(function () {
  'use strict';

  function beep(freq, dur = 0.11, type = 'triangle', vol = 0.13) {
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

  function makePhotoShell(container, title, subtitle, bgImg, hint) {
    container.innerHTML = `
      <div class="mg-shell mg-photo-shell" style="background-image:linear-gradient(180deg, rgba(16,12,8,0.82) 0%, rgba(12,9,6,0.74) 100%), url('${bgImg}');">
        <div class="mg-top">
          <div>
            <div class="mg-title">★ ${title}</div>
            <div class="mg-sub">${subtitle}</div>
          </div>
          <div class="mg-hud" id="mgHud">Redo</div>
        </div>
        <div class="mg-stage mg-photo-stage" id="mgStage"></div>
        <div class="mg-footer">
          <span class="mg-hint">${hint}</span>
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
  // MOTOR A: RULLBANDSSORTERAREN (Fisk, Frukt, Post, Kryddor, Bagage)
  // =========================================================================
  function runConveyorSorter(container, cfg, onFinish) {
    const ui = makePhotoShell(container, cfg.title, cfg.subtitle, cfg.bg, 'Klicka på rätt låda (eller tangenterna 1, 2, 3) innan fotokortet når kanten!');
    ui.stage.innerHTML = `
      <div class="mg-belt-wrap">
        <div class="mg-belt-track" id="beltTrack"></div>
        <div class="mg-crates-row">
          ${cfg.bins.map((b, i) => `
            <button class="mg-crate-btn" data-bin="${i}">
              <span class="mg-crate-key">${i + 1}</span>
              <img src="${b.img}" alt="${b.label}" onerror="this.style.display='none'">
              <span>${b.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    const track = ui.stage.querySelector('#beltTrack');
    let score = 0, total = 0, maxItems = cfg.count || 10, ended = false, raf = 0;
    let cur = null;

    function spawn() {
      if (total >= maxItems) { finish(); return; }
      const item = cfg.items[Math.floor(Math.random() * cfg.items.length)];
      cur = { ...item, x: 2 };
      track.innerHTML = `
        <div class="mg-belt-card" id="beltCard" style="left:2%;">
          <img src="${cur.img}" alt="${cur.label}">
          <span>${cur.label}</span>
        </div>
      `;
    }

    function chooseBin(binIdx) {
      if (!cur || ended) return;
      total++;
      if (binIdx === cur.bin) {
        score++;
        beep(660, 0.08);
      } else {
        beep(170, 0.16, 'sawtooth');
      }
      cur = null;
      spawn();
    }

    function finish() {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      const passed = score >= Math.ceil(maxItems * 0.65);
      onFinish({ score, max: maxItems, passed, summary: `Du sorterade ${score} av ${maxItems} rätt på bandet!` });
    }
    ui.quitBtn.onclick = finish;

    ui.stage.querySelectorAll('.mg-crate-btn').forEach(btn => {
      btn.onclick = () => chooseBin(Number(btn.dataset.bin));
    });
    const onKey = e => {
      if (e.key === '1' || e.key === '2' || e.key === '3') chooseBin(Number(e.key) - 1);
    };
    window.addEventListener('keydown', onKey);

    spawn();
    function loop() {
      if (ended || !track.isConnected) { finish(); return; }
      if (cur) {
        cur.x += (cfg.speed || 0.52);
        const card = track.querySelector('#beltCard');
        if (card) card.style.left = `${cur.x}%`;
        if (cur.x >= 86) {
          total++;
          beep(150, 0.18, 'sawtooth');
          cur = null;
          spawn();
        }
      }
      ui.hud.innerHTML = `Sorterade: <b style="color:#78e08f">${score}/${maxItems}</b> · Kvar: <b>${Math.max(0, maxItems - total)}</b>`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  // =========================================================================
  // MOTOR B: SPIONSPELET & DETEKTIVBYRÅN (Fototavla med ledtrådar!)
  // =========================================================================
  function runPhotoLineup(container, cfg, onFinish) {
    const ui = makePhotoShell(container, cfg.title, cfg.subtitle, cfg.bg, 'Läs ledtrådarna och klicka på rätt foto på anslagstavlan!');
    let round = 0, score = 0, ended = false;
    const cases = cfg.cases.slice().sort(() => Math.random() - 0.5).slice(0, 4);

    function finish() {
      if (ended) return;
      ended = true;
      onFinish({ score, max: cases.length, passed: score >= 3, summary: `Du löste ${score} av ${cases.length} hemliga fall!` });
    }
    ui.quitBtn.onclick = finish;

    function renderRound() {
      if (round >= cases.length) { finish(); return; }
      const c = cases[round];
      const opts = c.opts.slice().sort(() => Math.random() - 0.5);
      ui.hud.innerHTML = `Fall <b>${round + 1}/${cases.length}</b> · Lösta: <b style="color:#78e08f">${score}</b>`;
      ui.stage.innerHTML = `
        <div class="mg-spy-wrap">
          <div class="mg-spy-clue"><b>TELEGRAM / LEDTRÅD:</b> ${c.clue}</div>
          <div class="mg-spy-grid">
            ${opts.map((o, i) => `
              <button class="mg-photo-card" data-right="${o.right ? '1' : '0'}">
                <img src="${o.img}" alt="${o.label}">
                <span>${o.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      ui.stage.querySelectorAll('.mg-photo-card').forEach(btn => {
        btn.onclick = () => {
          if (btn.dataset.right === '1') {
            score++;
            btn.classList.add('correct');
            beep(660, 0.1);
          } else {
            btn.classList.add('wrong');
            beep(160, 0.18, 'sawtooth');
          }
          round++;
          setTimeout(renderRound, 420);
        };
      });
    }
    renderRound();
  }

  // =========================================================================
  // MOTOR C: FOTOGRAFISK KIKARE / SAFARI / FÅGELSKÅDARE
  // =========================================================================
  function runPhotoSpotter(container, cfg, onFinish) {
    const ui = makePhotoShell(container, cfg.title, cfg.subtitle, cfg.bg, 'Klicka snabbt på rätt fotomotiv när de dyker upp i landskapet (undvik fel motiv)!');
    ui.stage.innerHTML = `<div class="mg-spotter-field" id="spotField" style="background-image:url('${cfg.bg}')"></div>`;
    const field = ui.stage.querySelector('#spotField');

    let score = 0, targetGoal = 6, timeLeft = 22, ended = false, timer = 0, spawner = 0;
    const startTs = performance.now();

    function finish() {
      if (ended) return;
      ended = true;
      clearInterval(timer);
      clearInterval(spawner);
      onFinish({ score: Math.min(targetGoal, score), max: targetGoal, passed: score >= 4, summary: `Du fångade ${Math.min(targetGoal, score)} av ${targetGoal} fotomotiv!` });
    }
    ui.quitBtn.onclick = finish;

    function spawnOne() {
      if (ended || !field.isConnected) return;
      field.innerHTML = '';
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const isGood = (i === 0) ? true : (Math.random() < 0.45);
        const list = isGood ? cfg.good : cfg.bad;
        const item = list[Math.floor(Math.random() * list.length)];
        const el = document.createElement('button');
        el.className = `mg-spot-pop ${isGood ? 'good' : 'decoy'}`;
        el.style.left = `${10 + Math.random() * 72}%`;
        el.style.top = `${12 + Math.random() * 64}%`;
        el.innerHTML = `<img src="${item.img}" alt="${item.label}"><span>${item.label}</span>`;
        el.onclick = () => {
          if (ended) return;
          if (isGood) {
            score++;
            beep(720, 0.09);
            el.remove();
            if (score >= targetGoal) finish();
          } else {
            score = Math.max(0, score - 1);
            beep(150, 0.18, 'sawtooth');
            el.remove();
          }
        };
        field.appendChild(el);
      }
    }

    spawnOne();
    spawner = setInterval(spawnOne, 1850);
    timer = setInterval(() => {
      timeLeft = Math.max(0, 22 - (performance.now() - startTs) / 1000);
      ui.hud.innerHTML = `Fångade: <b style="color:#78e08f">${score}/${targetGoal}</b> · Tid: <b>${timeLeft.toFixed(1)}s</b>`;
      if (timeLeft <= 0 || !field.isConnected) finish();
    }, 100);
  }

  // =========================================================================
  // MOTOR D: KÖK, KAFÉ & BARTENDER (Beställningar med riktiga foton!)
  // =========================================================================
  function runPhotoKitchen(container, cfg, onFinish) {
    const ui = makePhotoShell(container, cfg.title, cfg.subtitle, cfg.bg, 'Klicka på de 3 ingredienserna i exakt samma ordning som gästens bricka!');
    let round = 0, score = 0, totalRounds = 5, ended = false;
    let order = [], picked = [];

    function finish() {
      if (ended) return;
      ended = true;
      onFinish({ score, max: totalRounds, passed: score >= 3, summary: `Du serverade ${score} av ${totalRounds} nöjda gäster!` });
    }
    ui.quitBtn.onclick = finish;

    function nextGuest() {
      if (round >= totalRounds) { finish(); return; }
      order = Array.from({ length: 3 }, () => Math.floor(Math.random() * cfg.ingredients.length));
      picked = [];
      render();
    }

    function render() {
      ui.hud.innerHTML = `Gäst <b>${round + 1}/${totalRounds}</b> · Nöjda: <b style="color:#78e08f">${score}</b>`;
      ui.stage.innerHTML = `
        <div class="mg-kitchen-wrap">
          <div class="mg-order-tray">
            <span class="mg-tray-lbl">BESTÄLLNING:</span>
            ${order.map((idx, step) => {
              const ing = cfg.ingredients[idx];
              const done = step < picked.length;
              return `<div class="mg-tray-item ${done ? 'done' : ''}"><img src="${ing.img}" alt="${ing.label}"><span>${step + 1}. ${ing.label}</span></div>`;
            }).join('')}
          </div>
          <div class="mg-ing-grid">
            ${cfg.ingredients.map((ing, i) => `
              <button class="mg-photo-card small" data-ing="${i}">
                <img src="${ing.img}" alt="${ing.label}">
                <span>${ing.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      ui.stage.querySelectorAll('[data-ing]').forEach(btn => {
        btn.onclick = () => {
          const i = Number(btn.dataset.ing);
          const expected = order[picked.length];
          if (i === expected) {
            picked.push(i);
            beep(580 + picked.length * 90, 0.08);
            if (picked.length >= order.length) {
              score++;
              round++;
              setTimeout(nextGuest, 320);
            } else {
              render();
            }
          } else {
            beep(150, 0.18, 'sawtooth');
            round++;
            setTimeout(nextGuest, 420);
          }
        };
      });
    }
    nextGuest();
  }

  // =========================================================================
  // MOTOR E: FOTOGRAFISKT MINNESSPEL (6 par på sammetsduk)
  // =========================================================================
  function runPhotoMemory(container, cfg, onFinish) {
    const ui = makePhotoShell(container, cfg.title, cfg.subtitle, cfg.bg, 'Vänd två fotokort åt gången och hitta alla 6 par inom 22 drag!');
    const deck = [...cfg.cards, ...cfg.cards].map((c, i) => ({ ...c, uid: i, matched: false })).sort(() => Math.random() - 0.5);
    let flipped = [], moves = 0, maxMoves = 22, matches = 0, locked = false, ended = false;

    function finish() {
      if (ended) return;
      ended = true;
      onFinish({ score: matches, max: 6, passed: matches >= 4, summary: `Du hittade ${matches} av 6 par på ${moves} drag!` });
    }
    ui.quitBtn.onclick = finish;

    function render() {
      ui.hud.innerHTML = `Par: <b style="color:#78e08f">${matches}/6</b> · Drag kvar: <b>${Math.max(0, maxMoves - moves)}</b>`;
      ui.stage.innerHTML = `
        <div class="mg-mem-grid">
          ${deck.map((c, idx) => {
            const open = c.matched || flipped.includes(idx);
            return `
              <button class="mg-mem-card ${open ? 'open' : ''} ${c.matched ? 'matched' : ''}" data-idx="${idx}">
                ${open ? `<img src="${c.img}" alt="${c.label}">` : `<span>★</span>`}
              </button>
            `;
          }).join('')}
        </div>
      `;
      ui.stage.querySelectorAll('.mg-mem-card').forEach(btn => {
        btn.onclick = () => {
          if (locked || ended) return;
          const idx = Number(btn.dataset.idx);
          if (deck[idx].matched || flipped.includes(idx)) return;
          flipped.push(idx);
          beep(480, 0.06);
          render();
          if (flipped.length === 2) {
            moves++;
            locked = true;
            const [a, b] = flipped;
            if (deck[a].label === deck[b].label) {
              deck[a].matched = deck[b].matched = true;
              matches++;
              beep(740, 0.12);
              flipped = [];
              locked = false;
              render();
              if (matches >= 6) setTimeout(finish, 350);
            } else {
              setTimeout(() => {
                flipped = [];
                locked = false;
                render();
                if (moves >= maxMoves) finish();
              }, 650);
            }
          }
        };
      });
    }
    render();
  }

  // =========================================================================
  // MOTOR F: TIMING-BÄNKEN (Snickaren, Arkitekten, Fiolbyggaren, Auktion)
  // =========================================================================
  function runPrecisionBench(container, cfg, onFinish) {
    const ui = makePhotoShell(container, cfg.title, cfg.subtitle, cfg.bg, 'Tryck på knappen (eller Mellanslag) exakt när markören är i den gyllene zonen!');
    ui.stage.innerHTML = `
      <div class="mg-bench-wrap">
        <div class="mg-bench-preview">
          <img src="${cfg.propImg}" alt="${cfg.title}">
          <div class="mg-bench-status" id="benchStatus">Gör dig redo!</div>
        </div>
        <div class="mg-gauge-bar">
          <div class="mg-gauge-green" id="benchZone" style="left:40%; width:20%;"></div>
          <div class="mg-gauge-needle" id="benchNeedle" style="left:10%;"></div>
        </div>
        <button class="stamp-action-btn" id="benchHitBtn">${cfg.actionLabel || 'SLÅ TILL! (Mellanslag)'}</button>
      </div>
    `;
    const needle = ui.stage.querySelector('#benchNeedle');
    const zoneEl = ui.stage.querySelector('#benchZone');
    const statusEl = ui.stage.querySelector('#benchStatus');
    const hitBtn = ui.stage.querySelector('#benchHitBtn');

    let round = 1, maxRounds = cfg.rounds || 6, score = 0, pos = 10, dir = 1, zoneLeft = 38, zoneW = 22, ended = false, raf = 0;

    function nextZone() {
      zoneLeft = 18 + Math.random() * 58;
      zoneW = Math.max(14, 24 - round * 1.4);
      zoneEl.style.left = `${zoneLeft}%`;
      zoneEl.style.width = `${zoneW}%`;
    }
    nextZone();

    function finish() {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      onFinish({ score, max: maxRounds, passed: score >= Math.ceil(maxRounds * 0.6), summary: `Du satte ${score} av ${maxRounds} perfekta träffar!` });
    }
    ui.quitBtn.onclick = finish;

    function strike() {
      if (ended) return;
      const hit = pos >= zoneLeft && pos <= zoneLeft + zoneW;
      if (hit) {
        score++;
        statusEl.textContent = '✓ MITT I PRICK!';
        statusEl.style.color = '#78e08f';
        beep(690, 0.1);
      } else {
        statusEl.textContent = '✕ LITE VID SIDAN AV!';
        statusEl.style.color = '#ff7675';
        beep(170, 0.15, 'sawtooth');
      }
      round++;
      if (round > maxRounds) { setTimeout(finish, 320); return; }
      nextZone();
    }
    hitBtn.onclick = strike;
    const onKey = e => { if (e.code === 'Space') { e.preventDefault(); strike(); } };
    window.addEventListener('keydown', onKey);

    function loop() {
      if (ended || !needle.isConnected) { finish(); return; }
      pos += dir * (1.8 + round * 0.28);
      if (pos >= 96) { pos = 96; dir = -1; }
      if (pos <= 4)  { pos = 4;  dir = 1; }
      needle.style.left = `${pos}%`;
      ui.hud.innerHTML = `Försök <b>${Math.min(round, maxRounds)}/${maxRounds}</b> · Träffar: <b style="color:#78e08f">${score}</b>`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  // =========================================================================
  // MOTOR G: KASSASKÅP, TELEGRAF & VÄXLINGSKONTOR (Snabb kalkyl / kod!)
  // =========================================================================
  function runCodeAndCounter(container, cfg, onFinish) {
    const ui = makePhotoShell(container, cfg.title, cfg.subtitle, cfg.bg, 'Välj rätt svar snabbt för 5 kunder/koder!');
    let round = 0, score = 0, ended = false;
    const rounds = cfg.makeRounds();

    function finish() {
      if (ended) return;
      ended = true;
      onFinish({ score, max: rounds.length, passed: score >= 3, summary: `Du klarade ${score} av ${rounds.length} uppdrag på kontoret!` });
    }
    ui.quitBtn.onclick = finish;

    function render() {
      if (round >= rounds.length) { finish(); return; }
      const r = rounds[round];
      ui.hud.innerHTML = `Uppdrag <b>${round + 1}/${rounds.length}</b> · Rätt: <b style="color:#78e08f">${score}</b>`;
      ui.stage.innerHTML = `
        <div class="mg-counter-card">
          <img class="mg-counter-img" src="${r.img || cfg.propImg}" alt="">
          <div class="mg-counter-prompt">${r.prompt}</div>
          <div class="mg-counter-opts">
            ${r.opts.map(o => `<button class="stamp-action-btn" data-right="${o.right ? '1' : '0'}">${o.label}</button>`).join('')}
          </div>
        </div>
      `;
      ui.stage.querySelectorAll('[data-right]').forEach(btn => {
        btn.onclick = () => {
          if (btn.dataset.right === '1') { score++; beep(660, 0.1); }
          else { beep(160, 0.16, 'sawtooth'); }
          round++;
          render();
        };
      });
    }
    render();
  }

  // =========================================================================
  // DE 30 NYA FOTOGRAFISKA MINISPELEN (Registreras in i window.GT_MINIGAMES!)
  // =========================================================================
  const PACK_GAMES = {
    // --- 5 Rullbandssorterare ---
    mg_fish: {
      title: 'Fisksorteraren i Hamnen',
      run: (c, done) => runConveyorSorter(c, {
        title: 'FISKSORTERAREN', subtitle: 'Sortera nyfångad lax, räkor och krabba i rätt islådor!',
        bg: 'assets/travel/ship_harbor.jpg', count: 10, speed: 0.55,
        bins: [
          { label: 'Lax', img: 'assets/minigames/fish_salmon.jpg' },
          { label: 'Räkor', img: 'assets/minigames/fish_shrimp.jpg' },
          { label: 'Krabba', img: 'assets/minigames/fish_crab.jpg' }
        ],
        items: [
          { label: 'Färsk Lax', img: 'assets/minigames/fish_salmon.jpg', bin: 0 },
          { label: 'Ishavsräkor', img: 'assets/minigames/fish_shrimp.jpg', bin: 1 },
          { label: 'Krabbtaska', img: 'assets/minigames/fish_crab.jpg', bin: 2 }
        ]
      }, done)
    },
    mg_fruit: {
      title: 'Fruktsorteraren på Marknaden',
      run: (c, done) => runConveyorSorter(c, {
        title: 'FRUKTSORTERAREN', subtitle: 'Sortera mango, ananas och kryddor i rätt trälådor!',
        bg: 'assets/photos/bazaar_market.jpg', count: 10, speed: 0.56,
        bins: [
          { label: 'Mango', img: 'assets/minigames/fruit_mango.jpg' },
          { label: 'Ananas', img: 'assets/minigames/fruit_pineapple.jpg' },
          { label: 'Kryddor', img: 'assets/souvenirs/kryddor.jpg' }
        ],
        items: [
          { label: 'Söt Mango', img: 'assets/minigames/fruit_mango.jpg', bin: 0 },
          { label: 'Ananas', img: 'assets/minigames/fruit_pineapple.jpg', bin: 1 },
          { label: 'Kryddpåse', img: 'assets/souvenirs/kryddor.jpg', bin: 2 }
        ]
      }, done)
    },
    mg_mail: {
      title: 'Postsorteraren (Flygpost)',
      run: (c, done) => runConveyorSorter(c, {
        title: 'POSTSORTERAREN', subtitle: 'Sortera flygpostpaketen till rätt världsdel!',
        bg: 'assets/photos/airport_hall.jpg', count: 10, speed: 0.58,
        bins: [
          { label: 'Europa', img: 'assets/flags/se.png' },
          { label: 'Asien', img: 'assets/flags/jp.png' },
          { label: 'Amerika', img: 'assets/flags/us.png' }
        ],
        items: [
          { label: 'Till Paris', img: 'assets/flags/fr.png', bin: 0 },
          { label: 'Till Rom', img: 'assets/flags/it.png', bin: 0 },
          { label: 'Till London', img: 'assets/flags/gb.png', bin: 0 },
          { label: 'Till Tokyo', img: 'assets/flags/jp.png', bin: 1 },
          { label: 'Till Bangkok', img: 'assets/flags/th.png', bin: 1 },
          { label: 'Till Peking', img: 'assets/flags/cn.png', bin: 1 },
          { label: 'Till New York', img: 'assets/flags/us.png', bin: 2 },
          { label: 'Till Rio', img: 'assets/flags/br.png', bin: 2 },
          { label: 'Till Mexiko', img: 'assets/flags/mx.png', bin: 2 }
        ]
      }, done)
    },
    mg_spice: {
      title: 'Kryddsorteraren i Basaren',
      run: (c, done) => runConveyorSorter(c, {
        title: 'KRYDDSORTERAREN', subtitle: 'Sortera kryddor, te och olivolja i rätt handelskorgar!',
        bg: 'assets/photos/grandbazaar.jpg', count: 10, speed: 0.54,
        bins: [
          { label: 'Kryddor', img: 'assets/souvenirs/kryddor.jpg' },
          { label: 'Te & Kaffe', img: 'assets/souvenirs/earlgrey.jpg' },
          { label: 'Olivolja', img: 'assets/souvenirs/olivolja.jpg' }
        ],
        items: [
          { label: 'Saffran & Chili', img: 'assets/souvenirs/kryddor.jpg', bin: 0 },
          { label: 'Earl Grey-te', img: 'assets/souvenirs/earlgrey.jpg', bin: 1 },
          { label: 'Rooiboste', img: 'assets/souvenirs/rooiboste.jpg', bin: 1 },
          { label: 'Kaffebönor', img: 'assets/souvenirs/kaffebonor_rio.jpg', bin: 1 },
          { label: 'Olivolja', img: 'assets/souvenirs/olivolja.jpg', bin: 2 }
        ]
      }, done)
    },
    mg_baggage: {
      title: 'Bagagehanteraren på Flygplatsen',
      run: (c, done) => runConveyorSorter(c, {
        title: 'BAGAGEHANTERAREN', subtitle: 'Skicka souvenirer & kollin till rätt avgångsgate!',
        bg: 'assets/photos/airport_hall.jpg', count: 10, speed: 0.58,
        bins: [
          { label: 'Gate A (Kläder)', img: 'assets/souvenirs/jeans.jpg' },
          { label: 'Gate B (Porslin)', img: 'assets/souvenirs/tekanna_kina.jpg' },
          { label: 'Gate C (Utrustning)', img: 'assets/souvenirs/kamera.jpg' }
        ],
        items: [
          { label: 'Denimjeans', img: 'assets/souvenirs/jeans.jpg', bin: 0 },
          { label: 'Baskermössa', img: 'assets/souvenirs/baskermossa.jpg', bin: 0 },
          { label: 'Thaisiden', img: 'assets/souvenirs/thaisiden.jpg', bin: 0 },
          { label: 'Tekanna', img: 'assets/souvenirs/tekanna_kina.jpg', bin: 1 },
          { label: 'Marmorask', img: 'assets/souvenirs/marmorask.jpg', bin: 1 },
          { label: 'Systemkamera', img: 'assets/souvenirs/kamera.jpg', bin: 2 },
          { label: 'Vandringskängor', img: 'assets/souvenirs/kangor.jpg', bin: 2 }
        ]
      }, done)
    },

    // --- 4 Spion- & Detektivspel ---
    mg_spy: {
      title: 'Spionjägaren (Hemliga Telegram)',
      run: (c, done) => runPhotoLineup(c, {
        title: 'SPIONJÄGAREN', subtitle: 'Avslöja rätt agent på fototavlan utifrån de hemliga telegrammen!',
        bg: 'assets/photos/libraries/lib_london.jpg',
        cases: [
          {
            clue: 'Agenten gömmer sig nära en berömd klocka vid Themsen i London.',
            opts: [
              { label: 'Big Ben', img: 'assets/photos/bigben.jpg', right: true },
              { label: 'Eiffeltornet', img: 'assets/photos/eiffel.jpg', right: false },
              { label: 'Colosseum', img: 'assets/photos/colosseum.jpg', right: false },
              { label: 'Tokyo Tower', img: 'assets/photos/tokyotower.jpg', right: false }
            ]
          },
          {
            clue: 'Mötesplatsen är en röd hängbro i dimman vid Stilla havet.',
            opts: [
              { label: 'Golden Gate', img: 'assets/photos/goldengate.jpg', right: true },
              { label: 'Brooklyn Bridge', img: 'assets/photos/brooklynbridge.jpg', right: false },
              { label: 'Harbour Bridge', img: 'assets/photos/harbourbridge.jpg', right: false },
              { label: 'Turning Torso', img: 'assets/photos/turningtorso.jpg', right: false }
            ]
          },
          {
            clue: 'Spionen lämnade ett kuvert under ett vitt snäckformat tak i Australien.',
            opts: [
              { label: 'Operahuset', img: 'assets/photos/sydneyopera.jpg', right: true },
              { label: 'Taj Mahal', img: 'assets/photos/taj.jpg', right: false },
              { label: 'Hagia Sofia', img: 'assets/photos/hagiasophia.jpg', right: false },
              { label: 'Louvren', img: 'assets/photos/louvre.jpg', right: false }
            ]
          },
          {
            clue: 'Slutdestinationen är en grön staty som vaktar inloppet till New York.',
            opts: [
              { label: 'Frihetsgudinnan', img: 'assets/photos/liberty.jpg', right: true },
              { label: 'Kristusstatyn', img: 'assets/photos/christredeemer.jpg', right: false },
              { label: 'Pyramiderna', img: 'assets/photos/pyramids.jpg', right: false },
              { label: 'Pantheon', img: 'assets/photos/pantheon.jpg', right: false }
            ]
          }
        ]
      }, done)
    },
    mg_detective: {
      title: 'Privatdetektiven (Fotofallen)',
      run: (c, done) => runPhotoLineup(c, {
        title: 'PRIVATDETEKTIVEN', subtitle: 'Vem på fotoväggen matchar vittnesmålet?',
        bg: 'assets/photos/libraries/lib_newyork.jpg',
        cases: [
          {
            clue: 'Vittnet såg en legendarisk brasiliansk fotbollskung lämna hotellet.',
            opts: [
              { label: 'Pelé', img: 'assets/history/br_pele.jpg', right: true },
              { label: 'James Cook', img: 'assets/history/au_cook.jpg', right: false },
              { label: 'Konfucius', img: 'assets/history/cn_confucius.jpg', right: false },
              { label: 'Oscar Niemeyer', img: 'assets/history/br_niemeyer.jpg', right: false }
            ]
          },
          {
            clue: 'Den eftersökte sjöfararen kartlade Australiens östkust på 1770-talet.',
            opts: [
              { label: 'James Cook', img: 'assets/history/au_cook.jpg', right: true },
              { label: 'Ned Kelly', img: 'assets/history/au_kelly.jpg', right: false },
              { label: 'Sun Tzu', img: 'assets/history/cn_sun_tzu.jpg', right: false },
              { label: 'Pedro II', img: 'assets/history/br_pedro2.jpg', right: false }
            ]
          },
          {
            clue: 'En berömd kinesisk filosof och lärare från 500-talet f.Kr. är nyckeln.',
            opts: [
              { label: 'Konfucius', img: 'assets/history/cn_confucius.jpg', right: true },
              { label: 'Cai Lun', img: 'assets/history/cn_cailun.jpg', right: false },
              { label: 'Kejsar Qin', img: 'assets/history/cn_qin.jpg', right: false },
              { label: 'Jørn Utzon', img: 'assets/history/au_utzon.jpg', right: false }
            ]
          },
          {
            clue: 'Den danska arkitekten bakom Sydneys ikoniska operahus!',
            opts: [
              { label: 'Jørn Utzon', img: 'assets/history/au_utzon.jpg', right: true },
              { label: 'Oscar Niemeyer', img: 'assets/history/br_niemeyer.jpg', right: false },
              { label: 'Nellie Melba', img: 'assets/history/au_melba.jpg', right: false },
              { label: 'Santos-Dumont', img: 'assets/history/br_santos.jpg', right: false }
            ]
          }
        ]
      }, done)
    },
    mg_curator: {
      title: 'Konst- & Museiexperten',
      run: (c, done) => runPhotoLineup(c, {
        title: 'MUSEIEXPERTEN', subtitle: 'Matcha arkivkortet med rätt fotografiskt mästerverk!',
        bg: 'assets/photos/louvre.jpg',
        cases: [
          {
            clue: 'Katalogkort: Romersk amfiteater invigd år 80 e.Kr. för 50 000 åskådare.',
            opts: [
              { label: 'Colosseum', img: 'assets/photos/colosseum.jpg', right: true },
              { label: 'Pantheon', img: 'assets/photos/pantheon.jpg', right: false },
              { label: 'Fontana di Trevi', img: 'assets/photos/trevi.jpg', right: false },
              { label: 'Notre-Dame', img: 'assets/photos/notredame.jpg', right: false }
            ]
          },
          {
            clue: 'Katalogkort: Världens största kejsarpalats i centrala Peking.',
            opts: [
              { label: 'Förbjudna staden', img: 'assets/photos/forbiddencity.jpg', right: true },
              { label: 'Himmelens tempel', img: 'assets/photos/templeheaven.jpg', right: false },
              { label: 'Röda fortet', img: 'assets/photos/redfort.jpg', right: false },
              { label: 'Topkapipalatset', img: 'assets/photos/topkapi.jpg', right: false }
            ]
          },
          {
            clue: 'Katalogkort: Regalskepp från 1628 bärgat ur Stockholms ström.',
            opts: [
              { label: 'Vasamuseet', img: 'assets/photos/vasa.jpg', right: true },
              { label: 'Malmöhus', img: 'assets/photos/malmohus.jpg', right: false },
              { label: 'Stadshuset', img: 'assets/photos/stadshuset.jpg', right: false },
              { label: 'Tower of London', img: 'assets/photos/towerlondon.jpg', right: false }
            ]
          },
          {
            clue: 'Katalogkort: Mexikansk konstnärinnas koboltblå hem i Coyoacán.',
            opts: [
              { label: 'Frida Kahlo-museet', img: 'assets/photos/fridakahlo.jpg', right: true },
              { label: 'Zócalo', img: 'assets/photos/zocalo.jpg', right: false },
              { label: 'Chapultepec', img: 'assets/photos/chapultepec.jpg', right: false },
              { label: 'Xochimilco', img: 'assets/photos/xochimilco.jpg', right: false }
            ]
          }
        ]
      }, done)
    },
    mg_archaeologist: {
      title: 'Arkeologen (Världsarvsfynd)',
      run: (c, done) => runPhotoLineup(c, {
        title: 'ARKEOLOGEN', subtitle: 'Identifiera rätt forntida plats utifrån utgrävningsrapporten!',
        bg: 'assets/wonders/petra.jpg',
        cases: [
          {
            clue: 'Rapport: Uthuggen rosaröd tempelfasad i Jordanien skapad av nabatéerna.',
            opts: [
              { label: 'Petra', img: 'assets/wonders/petra.jpg', right: true },
              { label: 'Pompeji', img: 'assets/wonders/pompeji.jpg', right: false },
              { label: 'Kappadokien', img: 'assets/wonders/kappadokien.jpg', right: false },
              { label: 'Uluru', img: 'assets/wonders/uluru.jpg', right: false }
            ]
          },
          {
            clue: 'Rapport: Trappstegspyramid med 365 steg i Yucatáns djungel.',
            opts: [
              { label: 'Chichén Itzá', img: 'assets/wonders/chichenitza.jpg', right: true },
              { label: 'Machu Picchu', img: 'assets/wonders/machupicchu.jpg', right: false },
              { label: 'Pyramiderna i Giza', img: 'assets/photos/pyramids.jpg', right: false },
              { label: 'Angkor Wat', img: 'assets/wonders/angkorwat.jpg', right: false }
            ]
          },
          {
            clue: 'Rapport: Förhistorisk stenkrets på Salisbury-slätten linjerad mot sommarsolståndet.',
            opts: [
              { label: 'Stonehenge', img: 'assets/wonders/stonehenge.jpg', right: true },
              { label: 'Pompeji', img: 'assets/wonders/pompeji.jpg', right: false },
              { label: 'Kinesiska muren', img: 'assets/photos/greatwall.jpg', right: false },
              { label: 'Uluru', img: 'assets/wonders/uluru.jpg', right: false }
            ]
          },
          {
            clue: 'Rapport: Inkarikets gömda bergstad 2 430 meter upp i peruanska Anderna.',
            opts: [
              { label: 'Machu Picchu', img: 'assets/wonders/machupicchu.jpg', right: true },
              { label: 'Angkor Wat', img: 'assets/wonders/angkorwat.jpg', right: false },
              { label: 'Mount Everest', img: 'assets/wonders/everest.jpg', right: false },
              { label: 'Grand Canyon', img: 'assets/photos/grandcanyon.jpg', right: false }
            ]
          }
        ]
      }, done)
    },

    // --- 4 Fotografisk Kikare / Safari / Fågelskådare ---
    mg_birds: {
      title: 'Fågelskådaren vid Kusten',
      run: (c, done) => runPhotoSpotter(c, {
        title: 'FÅGELSKÅDAREN', subtitle: 'Fånga 6 natur- och kustfynd i kikaren (undvik fel prylar)!',
        bg: 'assets/photos/ribersborg.jpg',
        good: [
          { label: 'Strutsägg', img: 'assets/souvenirs/strutsegg.jpg' },
          { label: 'Fossil', img: 'assets/souvenirs/fossil.jpg' },
          { label: 'Solfjäder', img: 'assets/souvenirs/solfjader.jpg' }
        ],
        bad: [
          { label: 'Taxiskylt', img: 'assets/souvenirs/taxiskylt.jpg' },
          { label: 'Paraply', img: 'assets/souvenirs/paraply_london.jpg' }
        ]
      }, done)
    },
    mg_safari: {
      title: 'Fotosafari vid Kilimanjaro',
      run: (c, done) => runPhotoSpotter(c, {
        title: 'FOTOSAFARI', subtitle: 'Knäpp 6 skarpa naturbilder i fält (undvik turistprylar)!',
        bg: 'assets/wonders/serengeti.jpg',
        good: [
          { label: 'Strutsägg', img: 'assets/souvenirs/strutsegg.jpg' },
          { label: 'Fossilfynd', img: 'assets/souvenirs/fossil.jpg' },
          { label: 'Opalsten', img: 'assets/souvenirs/opal_sydney.jpg' }
        ],
        bad: [
          { label: 'Snöglob', img: 'assets/souvenirs/snoglob.jpg' },
          { label: 'Vespa', img: 'assets/souvenirs/vespamodell.jpg' }
        ]
      }, done)
    },
    mg_paparazzi: {
      title: 'Kändisfotografen i Storstan',
      run: (c, done) => runPhotoSpotter(c, {
        title: 'KÄNDISFOTOGRAFEN', subtitle: 'Fånga 6 VIP-profiler med blixtkameran på gatan!',
        bg: 'assets/photos/shibuya.jpg',
        good: [
          { label: 'Pelé', img: 'assets/history/br_pele.jpg' },
          { label: 'Nellie Melba', img: 'assets/history/au_melba.jpg' },
          { label: 'Oscar Niemeyer', img: 'assets/history/br_niemeyer.jpg' }
        ],
        bad: [
          { label: 'Tuk-tuk', img: 'assets/souvenirs/tuktuk_modell.jpg' },
          { label: 'Paraply', img: 'assets/souvenirs/paraply_london.jpg' }
        ]
      }, done)
    },
    mg_whale: {
      title: 'Havsspanaren vid Barriärrevet',
      run: (c, done) => runPhotoSpotter(c, {
        title: 'HAVSSPANAREN', subtitle: 'Markera 6 havsdjur i kikaren över revet (undvik skräp)!',
        bg: 'assets/wonders/barriarrevet.jpg',
        good: [
          { label: 'Laxstim', img: 'assets/minigames/fish_salmon.jpg' },
          { label: 'Krabba', img: 'assets/minigames/fish_crab.jpg' },
          { label: 'Räkor', img: 'assets/minigames/fish_shrimp.jpg' }
        ],
        bad: [
          { label: 'Kängor', img: 'assets/souvenirs/kangor.jpg' },
          { label: 'Taxiskylt', img: 'assets/souvenirs/taxiskylt.jpg' }
        ]
      }, done)
    },

    // --- 5 Kök, Kafé & Bartender ---
    mg_sushi: {
      title: 'Sushikocken i Tokyo',
      run: (c, done) => runPhotoKitchen(c, {
        title: 'SUSHIKOCKEN', subtitle: 'Montera 5 perfekta sushibrickor efter gästernas beställning!',
        bg: 'assets/photos/taverns/tavern_japan.jpg',
        ingredients: [
          { label: 'Sushi', img: 'assets/minigames/food_sushi.jpg' },
          { label: 'Lax', img: 'assets/minigames/fish_salmon.jpg' },
          { label: 'Räka', img: 'assets/minigames/fish_shrimp.jpg' },
          { label: 'Krabba', img: 'assets/minigames/fish_crab.jpg' },
          { label: 'Grönt te', img: 'assets/souvenirs/tekanna_kina.jpg' }
        ]
      }, done)
    },
    mg_barista: {
      title: 'Espressomästaren på Kaféet',
      run: (c, done) => runPhotoKitchen(c, {
        title: 'ESPRESSOMÄSTAREN', subtitle: 'Servera 5 kafébeställningar i exakt rätt ordning!',
        bg: 'assets/photos/taverns/tavern_paris.jpg',
        ingredients: [
          { label: 'Kaffebönor', img: 'assets/souvenirs/kaffebonor_rio.jpg' },
          { label: 'Kaffekanna', img: 'assets/souvenirs/kaffekanna.jpg' },
          { label: 'Earl Grey', img: 'assets/souvenirs/earlgrey.jpg' },
          { label: 'Spettkaka', img: 'assets/souvenirs/spettkaka.jpg' },
          { label: 'Rooiboste', img: 'assets/souvenirs/rooiboste.jpg' }
        ]
      }, done)
    },
    mg_bartender: {
      title: 'Bartendern på Hotellbaren',
      run: (c, done) => runPhotoKitchen(c, {
        title: 'BARTENDERN', subtitle: 'Blanda 5 klassiska drinkbrickor åt hotellgästerna!',
        bg: 'assets/photos/hotel_tavern.jpg',
        ingredients: [
          { label: 'Ananasjuice', img: 'assets/minigames/fruit_pineapple.jpg' },
          { label: 'Mango', img: 'assets/minigames/fruit_mango.jpg' },
          { label: 'Kaffe', img: 'assets/souvenirs/kaffekanna.jpg' },
          { label: 'Krydda', img: 'assets/souvenirs/kryddor.jpg' },
          { label: 'Te', img: 'assets/souvenirs/earlgrey.jpg' }
        ]
      }, done)
    },
    mg_taco: {
      title: 'Taqueria-kocken i Mexico City',
      run: (c, done) => runPhotoKitchen(c, {
        title: 'TAQUERIA-KOCKEN', subtitle: 'Servera 5 heta mexikanska tallrikar i rätt ordning!',
        bg: 'assets/photos/taverns/tavern_latin.jpg',
        ingredients: [
          { label: 'Chilikrydda', img: 'assets/souvenirs/kryddor.jpg' },
          { label: 'Mango-salsa', img: 'assets/minigames/fruit_mango.jpg' },
          { label: 'Ananas', img: 'assets/minigames/fruit_pineapple.jpg' },
          { label: 'Kaffe', img: 'assets/souvenirs/kaffebonor_rio.jpg' },
          { label: 'Olivolja', img: 'assets/souvenirs/olivolja.jpg' }
        ]
      }, done)
    },
    mg_curry: {
      title: 'Kryddkocken i Delhi & Bangkok',
      run: (c, done) => runPhotoKitchen(c, {
        title: 'KRYDDKOCKEN', subtitle: 'Komponera 5 kryddiga festrätter efter gästens recept!',
        bg: 'assets/photos/taverns/tavern_orient.jpg',
        ingredients: [
          { label: 'Garam Masala', img: 'assets/souvenirs/kryddor.jpg' },
          { label: 'Räkor', img: 'assets/minigames/fish_shrimp.jpg' },
          { label: 'Mango', img: 'assets/minigames/fruit_mango.jpg' },
          { label: 'Chai-te', img: 'assets/souvenirs/earlgrey.jpg' },
          { label: 'Ananas', img: 'assets/minigames/fruit_pineapple.jpg' }
        ]
      }, done)
    },

    // --- 3 Fotografiska Minnesspel ---
    mg_antiques: {
      title: 'Antikhandlaren i Basaren',
      run: (c, done) => runPhotoMemory(c, {
        title: 'ANTIKHANDLAREN', subtitle: 'Hitta alla 6 matchande antikviteter på sammetsduken!',
        bg: 'assets/photos/bazaar_market.jpg',
        cards: [
          { label: 'Skarabé', img: 'assets/souvenirs/skarabe.jpg' },
          { label: 'Papyrus', img: 'assets/souvenirs/papyrus.jpg' },
          { label: 'Turkisk matta', img: 'assets/souvenirs/turkisk_matta.jpg' },
          { label: 'Jadestatyett', img: 'assets/souvenirs/jadestatyett.jpg' },
          { label: 'Marmorask', img: 'assets/souvenirs/marmorask.jpg' },
          { label: 'Aztekkalender', img: 'assets/souvenirs/aztekkalender.jpg' }
        ]
      }, done)
    },
    mg_flags_mem: {
      title: 'Diplomatens Flaggarkiv',
      run: (c, done) => runPhotoMemory(c, {
        title: 'DIPLOMATENS FLAGGARKIV', subtitle: 'Para ihop de 6 nationsflaggorna på ambassadbordet!',
        bg: 'assets/photos/libraries/lib_stockholm.jpg',
        cards: [
          { label: 'Sverige', img: 'assets/flags/se.png' },
          { label: 'Japan', img: 'assets/flags/jp.png' },
          { label: 'Brasilien', img: 'assets/flags/br.png' },
          { label: 'Egypten', img: 'assets/flags/eg.png' },
          { label: 'Australien', img: 'assets/flags/au.png' },
          { label: 'Mexiko', img: 'assets/flags/mx.png' }
        ]
      }, done)
    },
    mg_museum_mem: {
      title: 'Museiintendentens Porträttsal',
      run: (c, done) => runPhotoMemory(c, {
        title: 'PORTRÄTTSALEN', subtitle: 'Para ihop 6 par historiska porträtt i museets samling!',
        bg: 'assets/photos/libraries/lib_paris.jpg',
        cards: [
          { label: 'Pelé', img: 'assets/history/br_pele.jpg' },
          { label: 'James Cook', img: 'assets/history/au_cook.jpg' },
          { label: 'Konfucius', img: 'assets/history/cn_confucius.jpg' },
          { label: 'Sun Tzu', img: 'assets/history/cn_sun_tzu.jpg' },
          { label: 'Jørn Utzon', img: 'assets/history/au_utzon.jpg' },
          { label: 'Nellie Melba', img: 'assets/history/au_melba.jpg' }
        ]
      }, done)
    },

    // --- 3 Precision / Timing över riktigt foto ---
    mg_nails: {
      title: 'Snickaren (Spikaren)',
      run: (c, done) => runPrecisionBench(c, {
        title: 'SNICKAREN', subtitle: 'Slå i 6 spikar rakt ner i bjälken med exakt tajming!',
        bg: 'assets/photos/skansen.jpg', propImg: 'assets/souvenirs/dalahast.jpg',
        rounds: 6, actionLabel: 'SLÅ MED HAMMAREN! (Mellanslag)'
      }, done)
    },
    mg_architect: {
      title: 'Arkitekten (Valvbyggaren)',
      run: (c, done) => runPrecisionBench(c, {
        title: 'ARKITEKTEN', subtitle: 'Placera 6 stenvalv med millimeterprecision!',
        bg: 'assets/photos/colosseum.jpg', propImg: 'assets/souvenirs/mursten_kina.jpg',
        rounds: 6, actionLabel: 'LÄGG STENBLOCK! (Mellanslag)'
      }, done)
    },
    mg_luthier: {
      title: 'Fiolbyggaren (Stämning)',
      run: (c, done) => runPrecisionBench(c, {
        title: 'FIOLBYGGAREN', subtitle: 'Stäm 6 strängar exakt till ren konsertton!',
        bg: 'assets/photos/libraries/lib_rom.jpg', propImg: 'assets/souvenirs/karnevalsmask.jpg',
        rounds: 6, actionLabel: 'STÄM STRÄNG! (Mellanslag)'
      }, done)
    },

    // --- 3 Kassaskåp, Telegraf & Auktion ---
    mg_safe: {
      title: 'Låssmeden (Kassaskåpet)',
      run: (c, done) => runPrecisionBench(c, {
        title: 'LÅSSMEDEN', subtitle: 'Lyssna efter klicket och stanna låskolven 5 gånger i rätt läge!',
        bg: 'assets/photos/towerlondon.jpg', propImg: 'assets/souvenirs/marmorask.jpg',
        rounds: 5, actionLabel: 'LÅS UPP KLICK! (Mellanslag)'
      }, done)
    },
    mg_auction: {
      title: 'Auktionsutroparen',
      run: (c, done) => runPrecisionBench(c, {
        title: 'AUKTIONSUTROPAREN', subtitle: 'Klubba in 5 dyrbara partier precis när budet står som högst!',
        bg: 'assets/photos/bazaar_market.jpg', propImg: 'assets/souvenirs/opal_sydney.jpg',
        rounds: 5, actionLabel: 'FÖRSTA, ANDRA, TREDJE! (Mellanslag)'
      }, done)
    },
    mg_telegraph: {
      title: 'Telegrafisten (Morsekod)',
      run: (c, done) => runCodeAndCounter(c, {
        title: 'TELEGRAFISTEN', subtitle: 'Avkoda 5 korta SOS- och hamnsignaler i morsekod!',
        bg: 'assets/travel/ship_harbor.jpg', propImg: 'assets/souvenirs/guide_amerika.jpg',
        makeRounds: () => [
          { prompt: 'Vilken nödsignal är "· · ·  — — —  · · ·"?', opts: [{ label: 'SOS', right: true }, { label: 'OK', right: false }, { label: 'MAYDAY', right: false }] },
          { prompt: 'Vilken bokstav är en enda kort punkt "·"?', opts: [{ label: 'E', right: true }, { label: 'T', right: false }, { label: 'A', right: false }] },
          { prompt: 'Vilken bokstav är ett enda långt streck "—"?', opts: [{ label: 'T', right: true }, { label: 'M', right: false }, { label: 'N', right: false }] },
          { prompt: 'Vilken bokstav är "· —" (kort-lång)?', opts: [{ label: 'A', right: true }, { label: 'I', right: false }, { label: 'O', right: false }] },
          { prompt: 'Vilken bokstav är "— —" (två långa)?', opts: [{ label: 'M', right: true }, { label: 'S', right: false }, { label: 'K', right: false }] }
        ].map(r => ({ ...r, opts: r.opts.sort(() => Math.random() - 0.5) }))
      }, done)
    },

    // --- 3 Växling, Tullröntgen & Stadsguide ---
    mg_cashier: {
      title: 'Växlingskontoret (Snabbväxel)',
      run: (c, done) => runCodeAndCounter(c, {
        title: 'VÄXLINGSKONTORET', subtitle: 'Räkna ut exakt rätt växel åt 5 stressade resenärer!',
        bg: 'assets/photos/hotel_lobby.jpg', propImg: 'assets/souvenirs/snoglob.jpg',
        makeRounds: () => Array.from({ length: 5 }, () => {
          const bill = [500, 1000][Math.floor(Math.random() * 2)];
          const cost = 120 + Math.floor(Math.random() * 28) * 10;
          const ans = bill - cost;
          return {
            prompt: `Resenären betalar ${bill} kr för en biljett som kostar ${cost} kr. Hur mycket växel ska lämnas tillbaka?`,
            opts: [
              { label: `${ans} kr`, right: true },
              { label: `${ans + 20} kr`, right: false },
              { label: `${Math.max(10, ans - 30)} kr`, right: false }
            ].sort(() => Math.random() - 0.5)
          };
        })
      }, done)
    },
    mg_customs: {
      title: 'Tullinspektören (Bagageröntgen)',
      run: (c, done) => runCodeAndCounter(c, {
        title: 'TULLINSPEKTÖREN', subtitle: 'Granska 5 bagagekollin — godkänn tillåtna souvenirer och stoppa färsk frukt/djur!',
        bg: 'assets/photos/airport_hall.jpg', propImg: 'assets/souvenirs/kamera.jpg',
        makeRounds: () => [
          { img: 'assets/minigames/fruit_mango.jpg', prompt: 'Färsk tropisk mango i resväskan vid ankomst till Australien. Vad gör du?', opts: [{ label: 'STOPPA (Förbjuden färskvara)', right: true }, { label: 'SLÄPP IGENOM', right: false }] },
          { img: 'assets/souvenirs/kamera.jpg', prompt: 'Privat systemkamera och två filmrullar. Vad gör du?', opts: [{ label: 'SLÄPP IGENOM', right: true }, { label: 'STOPPA', right: false }] },
          { img: 'assets/minigames/fish_crab.jpg', prompt: 'Levande krabba i en plastpåse i handbagaget! Vad gör du?', opts: [{ label: 'STOPPA (Levande djur)', right: true }, { label: 'SLÄPP IGENOM', right: false }] },
          { img: 'assets/souvenirs/dalahast.jpg', prompt: 'Målad svensk trähäst (Dalahäst) inslagen som gåva. Vad gör du?', opts: [{ label: 'SLÄPP IGENOM', right: true }, { label: 'STOPPA', right: false }] },
          { img: 'assets/souvenirs/baskermossa.jpg', prompt: 'En klassisk fransk baskermössa och ett paraply. Vad gör du?', opts: [{ label: 'SLÄPP IGENOM', right: true }, { label: 'STOPPA', right: false }] }
        ]
      }, done)
    },
    mg_tourguide: {
      title: 'Stadsguiden (Snabbfotoguidning)',
      run: (c, done) => runPhotoLineup(c, {
        title: 'STADSGUIDEN', subtitle: 'Peka ut rätt sevärdhetsfoto åt din turistgrupp!',
        bg: 'assets/photos/copacabana.jpg',
        cases: [
          {
            clue: 'Gruppen vill se den berömda Art Deco-statyn på berget Corcovado i Rio!',
            opts: [
              { label: 'Kristusstatyn', img: 'assets/photos/christredeemer.jpg', right: true },
              { label: 'Sockertoppen', img: 'assets/photos/sugarloaf.jpg', right: false },
              { label: 'Copacabana', img: 'assets/photos/copacabana.jpg', right: false },
              { label: 'Maracanã', img: 'assets/photos/maracana.jpg', right: false }
            ]
          },
          {
            clue: 'Gruppen vill ta foton vid det ikoniska sluttande templet Wat Arun i Bangkok!',
            opts: [
              { label: 'Wat Arun', img: 'assets/photos/watarun.jpg', right: true },
              { label: 'Grand Palace', img: 'assets/photos/grandpalace.jpg', right: false },
              { label: 'Wat Pho', img: 'assets/photos/watpho.jpg', right: false },
              { label: 'Senso-ji', img: 'assets/photos/sensoji.jpg', right: false }
            ]
          },
          {
            clue: 'Gruppen frågar efter det snurrande vita höghuset i Västra Hamnen i Malmö!',
            opts: [
              { label: 'Turning Torso', img: 'assets/photos/turningtorso.jpg', right: true },
              { label: 'Malmöhus', img: 'assets/photos/malmohus.jpg', right: false },
              { label: 'Lilla torg', img: 'assets/photos/lillatorg.jpg', right: false },
              { label: 'Ribersborg', img: 'assets/photos/ribersborg.jpg', right: false }
            ]
          },
          {
            clue: 'Gruppen vill kliva iland på den ökända fängelseön i San Francisco-bukten!',
            opts: [
              { label: 'Alcatraz', img: 'assets/photos/alcatraz.jpg', right: true },
              { label: 'Fisherman’s Wharf', img: 'assets/photos/fishermans.jpg', right: false },
              { label: 'Lombard Street', img: 'assets/photos/lombard.jpg', right: false },
              { label: 'Golden Gate', img: 'assets/photos/goldengate.jpg', right: false }
            ]
          }
        ]
      }, done)
    }
  };

  // Koppla in alla 30 nya fotografiska minispel i window.GT_MINIGAMES + stadsrotation!
  const CITY_POOLS = {
    malmo:        ['mg_fish', 'mg_birds', 'mg_telegraph', 'mg_nails', 'navigator'],
    stockholm:    ['arctic', 'mg_mail', 'mg_flags_mem', 'mg_nails', 'slalom'],
    paris:        ['piano', 'mg_curator', 'mg_barista', 'mg_museum_mem', 'mg_luthier'],
    rom:          ['mg_architect', 'mg_barista', 'mg_paparazzi', 'mg_luthier', 'slalom'],
    london:       ['mg_spy', 'mg_mail', 'mg_bartender', 'mg_safe', 'camera'],
    istanbul:     ['mg_spy', 'mg_spice', 'mg_antiques', 'navigator'],
    kairo:        ['mg_archaeologist', 'mg_antiques', 'mg_tourguide', 'camera'],
    kapstaden:    ['mg_safari', 'mg_birds', 'navigator'],
    delhi:        ['mg_spice', 'mg_curry', 'mg_auction', 'stoker'],
    bangkok:      ['mg_fruit', 'mg_curry', 'mg_cashier', 'diver'],
    peking:       ['mg_architect', 'mg_baggage', 'stoker'],
    tokyo:        ['mg_sushi', 'mg_fish', 'mg_auction', 'mg_cashier', 'camera'],
    sydney:       ['mg_whale', 'mg_customs', 'mg_baggage', 'diver'],
    sanfrancisco: ['lander', 'mg_detective', 'mg_whale', 'mg_customs'],
    newyork:      ['lander', 'mg_detective', 'mg_bartender', 'mg_baggage', 'mg_telegraph'],
    mexicocity:   ['mg_taco', 'mg_archaeologist', 'mg_tourguide', 'passport'],
    rio:          ['mg_fruit', 'mg_tourguide', 'diver']
  };

  if (window.GT_MINIGAMES) {
    const baseStart = window.GT_MINIGAMES.start;
    const baseGetForCity = window.GT_MINIGAMES.getForCity;

    window.GT_MINIGAMES.getPoolForCity = (cityKey) => {
      const ids = CITY_POOLS[cityKey] || ['mg_fish', 'mg_spy', 'passport'];
      return ids.map(id => ({
        id,
        title: (PACK_GAMES[id] && PACK_GAMES[id].title) || (id === 'arctic' ? 'Arktisk naturbevakare (Grönland)' : baseGetForCity(cityKey).title)
      }));
    };

    window.GT_MINIGAMES.getForCity = (cityKey, day = 1) => {
      const pool = window.GT_MINIGAMES.getPoolForCity(cityKey);
      return pool[(Math.max(1, day) - 1) % pool.length];
    };

    window.GT_MINIGAMES.start = (gameId, container, onFinish) => {
      if (PACK_GAMES[gameId]) {
        PACK_GAMES[gameId].run(container, onFinish);
      } else {
        baseStart(gameId, container, onFinish);
      }
    };

    window.GT_MINIGAMES.listAll = () => Object.keys(PACK_GAMES);
  }
})();
