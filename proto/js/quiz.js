// Globetrotter — Frågeurval & Quiz-motor
// Stöder flerval (mc), bildfrågor (image), para ihop (match), ordna (order),
// fritext (text), mässingsmätare (num) och 3D-jordglob (globe).

(function () {
  'use strict';

  let lastPickedWasGlobe = false;

  function normReg(r) {
    return window.GT_ROUTES ? window.GT_ROUTES.normRegion(r) : String(r || '').trim().toLowerCase();
  }

  function prepareNumericGauge(q) {
    const step = q.step || 1;
    const baseSpan = Math.max(step * 4, q.max - q.min);
    const stepsCount = Math.max(4, Math.round(baseSpan / step));
    const span = stepsCount * step;

    const targetFrac = 0.08 + Math.random() * 0.84;
    let effMin = Math.round((q.ans - targetFrac * span) / step) * step;
    if (q.min >= 0 && effMin < 0) effMin = 0;
    let effMax = effMin + span;

    const isYear = q.unit === 'år' || (q.unit === '' && q.ans >= 1500 && q.ans <= 2025);
    if (isYear && effMax > 2026) {
      effMax = 2026;
      effMin = Math.max(0, effMax - span);
    }
    if (q.ans < effMin) {
      effMin = Math.max(0, Math.floor((q.ans - step) / step) * step);
      effMax = effMin + span;
    } else if (q.ans > effMax) {
      effMax = Math.ceil((q.ans + step) / step) * step;
      effMin = Math.max(0, effMax - span);
    }

    return { min: effMin, max: effMax, step, start: effMin };
  }

  function gradeNumericGauge(userVal, q, gMin, gMax) {
    const span = Math.max(q.step || 1, gMax - gMin);
    const diff = Math.abs(userVal - q.ans);
    if (span <= 15) {
      if (diff === 0) return 'exact';
      if (diff <= 1) return 'close';
      return 'miss';
    }
    const ratio = diff / span;
    if (ratio <= 0.055) return 'exact';
    if (ratio <= 0.11) return 'close';
    return 'miss';
  }

  function pickHardQuestions(state, count, region = '') {
    const pool = window.GT_HARD_QUESTIONS || [];
    if (pool.length === 0 || count <= 0) return [];
    const rNorm = normReg(region);
    const regPool = rNorm ? pool.filter(q => normReg(q.region) === rNorm) : pool;
    const basePool = regPool.length > 0 ? regPool : pool;
    const unused = basePool.filter(q => !q.id || !state.usedQuestionIds.has(q.id));
    const src = unused.length >= count ? unused : basePool;
    return src.slice().sort(() => Math.random() - 0.5).slice(0, count).map(q => ({ ...q }));
  }

  function pickInteractiveQuestions(state, count, region = '') {
    const pool = window.GT_INTERACTIVE_POOL || [];
    if (pool.length === 0 || count <= 0) return [];
    const rNorm = normReg(region);

    const regPool = rNorm ? pool.filter(q => normReg(q.region) === rNorm) : pool;
    const nonGlobeFallback = pool.filter(q => q.t !== 'globe');
    const basePool = regPool.length > 0 ? regPool : nonGlobeFallback;
    const unused = basePool.filter(q => !q.id || !state.usedQuestionIds.has(q.id));
    const src = unused.length >= count ? unused : basePool;

    const allowGlobe = !lastPickedWasGlobe && Math.random() < 0.25;
    const filtered = allowGlobe ? src : src.filter(q => q.t !== 'globe');
    const finalSrc = (filtered.length >= count ? filtered : src).slice().sort(() => Math.random() - 0.5);

    const picked = [];
    const usedTypes = new Set();
    let globePicked = false;
    for (const q of finalSrc) {
      if (picked.length >= count) break;
      if (q.t === 'globe' && globePicked) continue;
      if (!usedTypes.has(q.t) || finalSrc.length - picked.length <= count - picked.length) {
        picked.push({ ...q });
        usedTypes.add(q.t);
        if (q.t === 'globe') globePicked = true;
      }
    }
    while (picked.length < count && finalSrc.length > picked.length) {
      const next = finalSrc.find(q => !picked.some(p => p.id === q.id) && (q.t !== 'globe' || !globePicked));
      if (!next) break;
      picked.push({ ...next });
      if (next.t === 'globe') globePicked = true;
    }
    lastPickedWasGlobe = globePicked;
    return picked;
  }

  function getQuestionsFor(W, state, cityKey, placeKey, fallbackList = []) {
    const bank = window.GT_QUESTIONS || [];
    const matching = bank.filter(q => q.place === placeKey && (!cityKey || q.city === cityKey));
    const pool = matching.length > 0 ? matching : fallbackList;

    const unused = pool.filter(q => !q.id || !state.usedQuestionIds.has(q.id));
    const source = unused.length > 0 ? unused : pool;
    const maxCount = placeKey === 'job' ? 6 : 3;
    const picked = source.slice().sort(() => Math.random() - 0.5).slice(0, maxCount).map(q => ({ ...q, t: q.type || q.t }));

    const region = (cityKey && W.cities[cityKey] && W.cities[cityKey].region) || '';
    if (placeKey !== 'job' && picked.length >= 3 && Math.random() < 0.30) {
      const regionalHard = pickHardQuestions(state, 1, region);
      if (regionalHard.length > 0) {
        picked[picked.length - 1] = regionalHard[0];
      }
    }
    return picked;
  }

  function runQuiz(ctx, questions, onComplete, contextPhoto = null, opts = {}) {
    const { W, state, AudioMgr, showToast, updateHUD, addJournal } = ctx;
    const haversineKm = (lat1, lon1, lat2, lon2) =>
      window.GT_ROUTES ? window.GT_ROUTES.calcDistance(lat1, lon1, lat2, lon2) : 0;

    let qIndex = 0;
    let sessionCorrect = 0;
    const container = document.getElementById('quizContainer');
    const counterPrefix = opts.counterPrefix || 'FRÅGA';
    const headerLabel = opts.headerLabel || 'Allmänbildningsprov';
    const finishBtnLabel = opts.finishLabel || 'Avsluta besöket »';

    const currentCity = W.cities[state.city];
    const region = normReg(currentCity?.region || '');
    const bal = window.GT_BALANCE || {};
    const gainPerCorrect = bal.KNOWLEDGE_GAIN_PER_CORRECT || 12;

    function recordOutcome(kind) {
      if (!state.regionKnowledge || typeof state.regionKnowledge !== 'object') state.regionKnowledge = {};
      if (kind === 'full' || kind === 'partial') {
        state.streak = (state.streak || 0) + 1;
        if (region) {
          const prev = Number(state.regionKnowledge[region]) || 0;
          const delta = kind === 'full' ? gainPerCorrect : Math.round(gainPerCorrect * 0.5);
          state.regionKnowledge[region] = Math.min(100, prev + delta);
        }
      } else {
        state.streak = 0;
      }
    }

    const guidebook = !opts.disableGuidebook && state.backpack.find(i => {
      const def = W.souvenirs[i.id];
      return def && def.kind === 'kunskap' && (!def.region || normReg(def.region) === region) && (i.uses || def.uses) > 0;
    });

    state.quizInProgress = true;

    function renderQuestion() {
      if (qIndex >= questions.length) {
        state.quizInProgress = false;
        onComplete({ correct: sessionCorrect, total: questions.length });
        return;
      }

      const q = questions[qIndex];
      if (q.id) state.usedQuestionIds.add(q.id);
      state.questionsTotal++;

      const canUseGuide = guidebook && (q.t === 'mc' || q.t === 'image');
      let html = `
        <div class="quiz-box">
          <div class="bp-quiz-header">
            <span class="bp-quiz-counter">${counterPrefix} ${qIndex + 1} / ${questions.length}</span>
            ${canUseGuide ? `<button class="globe-brass-btn" style="padding:3px 9px; font-size:11px;" id="useGuideBtn">Använd guidebok (${guidebook.uses ?? 3} kvar)</button>` : `<span style="font-size:11px; color:#c9b48f; font-style:italic;">${headerLabel}</span>`}
          </div>
          <div class="quiz-q">${q.q}</div>
      `;

      let activeGauge = null;
      let matchRightList = null;
      let orderState = null;

      if (q.t === 'mc') {
        const shuffled = [...q.a].sort(() => Math.random() - 0.5);
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        const colsClass = shuffled.length === 2 ? 'cols-2' : (shuffled.length === 3 ? 'cols-3' : (shuffled.length >= 5 ? 'cols-many' : ''));
        html += `<div class="quiz-options ${colsClass}">`;
        shuffled.forEach((opt, i) => {
          const isRight = (opt === q.a[0]);
          html += `<button class="quiz-btn" data-right="${isRight ? '1' : '0'}"><span class="quiz-letter-seal">${letters[i] || (i + 1)}</span><span>${opt}</span></button>`;
        });
        html += `</div>`;
      } else if (q.t === 'image') {
        const shuffled = [...q.a].sort(() => Math.random() - 0.5);
        const letters = ['A', 'B', 'C', 'D'];
        html += `
          <div class="bp-image-quiz-wrap">
            <div class="bp-image-quiz-frame">
              <img src="${q.img}" alt="Bildfråga">
            </div>
            <div class="quiz-options" style="flex:1;">
              ${shuffled.map((opt, i) => {
                const isRight = (opt === q.a[0]);
                return `<button class="quiz-btn" data-right="${isRight ? '1' : '0'}"><span class="quiz-letter-seal">${letters[i] || (i + 1)}</span><span>${opt}</span></button>`;
              }).join('')}
            </div>
          </div>
        `;
      } else if (q.t === 'match') {
        matchRightList = q.pairs.map((p, idx) => ({ text: p[1], idx })).sort(() => Math.random() - 0.5);
        html += `
          <div class="bp-match-wrap">
            <div class="bp-match-grid">
              <div class="bp-match-col" id="matchLeftCol">
                ${q.pairs.map((p, idx) => `<button class="bp-match-btn left" data-left="${idx}"><span class="bp-match-badge" id="mlBadge${idx}">${idx + 1}</span><span>${p[0]}</span></button>`).join('')}
              </div>
              <div class="bp-match-col" id="matchRightCol">
                ${matchRightList.map((r, rPos) => `<button class="bp-match-btn right" data-right="${r.idx}" data-rpos="${rPos}"><span class="bp-match-badge empty" id="mrBadge${rPos}">?</span><span>${r.text}</span></button>`).join('')}
              </div>
            </div>
            <div class="bp-match-footer">
              <span id="matchHint" style="font-size:11.5px; color:#d6c5a5;">Klicka först till vänster och sedan på rätt par till höger.</span>
              <button class="stamp-action-btn" id="matchSubmit" disabled style="opacity:0.45; padding:6px 14px; font-size:12px;">Lås paren</button>
            </div>
          </div>
        `;
      } else if (q.t === 'order') {
        orderState = q.items.map((text, idx) => ({ text, idx }));
        for (let tries = 0; tries < 5; tries++) {
          orderState.sort(() => Math.random() - 0.5);
          if (orderState.some((it, pos) => it.idx !== pos)) break;
        }
        html += `
          <div class="bp-order-wrap">
            <div class="bp-order-list" id="orderList"></div>
            <div class="bp-match-footer">
              <span style="font-size:11.5px; color:#d6c5a5;">Flytta raderna med ▲ / ▼ tills ordningen från 1 till ${q.items.length} stämmer.</span>
              <button class="stamp-action-btn" id="orderSubmit" style="padding:6px 14px; font-size:12px;">Lås ordningen</button>
            </div>
          </div>
        `;
      } else if (q.t === 'text') {
        html += `
          <div class="bp-text-quiz">
            <input type="text" id="textQuizInput" class="bp-text-input" placeholder="Skriv ditt svar här..." autocomplete="off">
            <button class="stamp-action-btn" id="textQuizSubmit">Svara</button>
          </div>
        `;
      } else if (q.t === 'num') {
        activeGauge = prepareNumericGauge(q);
        html += `
          <div class="brass-caliper">
            <div class="caliper-scale-labels">
              <span>${activeGauge.min.toLocaleString('sv-SE')} ${q.unit}</span>
              <span>MÄSSINGSMÄTARE</span>
              <span>${activeGauge.max.toLocaleString('sv-SE')} ${q.unit}</span>
            </div>
            <input type="range" id="gaugeInput" min="${activeGauge.min}" max="${activeGauge.max}" step="${activeGauge.step}" value="${activeGauge.start}">
            <div class="caliper-readout">
              <span>Gissning: <b id="gaugeVal">${activeGauge.start.toLocaleString('sv-SE')}</b> ${q.unit}</span>
              <button class="stamp-action-btn" id="gaugeSubmit">Lås mätaren</button>
            </div>
          </div>
        `;
      } else if (q.t === 'globe') {
        html += `
          <div class="globe-quiz-wrap">
            <canvas id="quizGlobeCanvas" class="globe-quiz-canvas" width="320" height="210"></canvas>
            <div id="globeQuizSide">
              <div style="font-size:12px; color:#d6c5a5; margin-bottom:6px;">
                Snurra den blinda 3D-kartan (med landsgränser) och <b>klicka</b> för att sätta nålen!
              </div>
              <div class="globe-quiz-tools">
                <button type="button" class="globe-brass-btn" id="qGlobeZoomIn" style="padding:3px 9px; font-size:11px;">+ Zooma in</button>
                <button type="button" class="globe-brass-btn" id="qGlobeZoomOut" style="padding:3px 9px; font-size:11px;">− Zooma ut</button>
              </div>
              <div id="globeQuizStatus" style="font-family:'Courier New',monospace; font-size:11.5px; color:#ffd875; margin:6px 0 8px;">
                Ingen nål satt ännu...
              </div>
              <button class="stamp-action-btn" id="globeQuizSubmit" disabled style="opacity:0.45;">Lås nålen &amp; svara</button>
            </div>
          </div>
        `;
      }

      html += `</div>`;
      container.innerHTML = html;

      const guideBtn = document.getElementById('useGuideBtn');
      if (guideBtn) {
        guideBtn.onclick = () => {
          if (!guidebook) return;
          const wrongBtns = Array.from(container.querySelectorAll('.quiz-btn[data-right="0"]:not(.disabled)'));
          if (wrongBtns.length > 0) {
            wrongBtns[0].classList.add('disabled');
            guidebook.uses = (guidebook.uses ?? 3) - 1;
            AudioMgr.play('klick');
            showToast('Guideboken strök ett felaktigt alternativ!', 2000);
            if (guidebook.uses <= 0) {
              const idx = state.backpack.indexOf(guidebook);
              if (idx >= 0) state.backpack.splice(idx, 1);
              updateHUD();
              showToast('Din guidebok är nu förbrukad.', 2500);
            }
            guideBtn.remove();
          }
        };
      }

      function showAnswerDeepDive(isCorrect, rightAnswerText, customNote = null) {
        const imgSrc = q.photo || contextPhoto || W.cities[state.city]?.skyline || 'assets/photos/gamlastan.jpg';
        const deepText = customNote || q.explain || (W.answerExplanations && W.answerExplanations[rightAnswerText]) ||
          `Det rätta svaret på frågan är ${rightAnswerText}.`;

        const canChallenge = Boolean(
          isCorrect &&
          window.GT_MP && window.GT_MP.active &&
          (q.t === 'mc' || q.t === 'image') &&
          Array.isArray(q.a) && q.a.length >= 2 &&
          state.duelSentDay !== state.day
        );
        const oppName = (window.GT_MP && window.GT_MP.opponent && window.GT_MP.opponent.name) || 'Motståndaren';

        const box = container.querySelector('.quiz-box');
        if (!box) return;
        box.innerHTML = `
          <div class="bp-quiz-header" style="margin-bottom:8px;">
            <span class="bp-quiz-counter">${counterPrefix} ${qIndex + 1} / ${questions.length} · ${isCorrect ? 'RÄTT SVAR' : 'FEL SVAR'}</span>
            <span style="font-size:11px; color:#d8c39e; font-style:italic; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:60%;">${q.q}</span>
          </div>
          <div class="quiz-explain-card ${isCorrect ? '' : 'wrong-border'}">
            <img class="quiz-explain-thumb" src="${imgSrc}" alt="${rightAnswerText}">
            <div class="quiz-explain-body">
              <div class="quiz-explain-title" style="color:${isCorrect ? '#216e35' : '#9c2222'};">
                ${isCorrect ? '✓ Rätt! ' : '✕ Rätt svar: '}${rightAnswerText}
              </div>
              <div class="quiz-explain-text">${deepText}</div>
            </div>
            <div class="quiz-explain-action" style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
              ${canChallenge ? `<button class="globe-brass-btn" style="padding:5px 10px; font-size:11px; border-color:#38b6ff; color:#8cd7ff; white-space:nowrap;" id="quizChallengeBtn">⚡ Utmana ${oppName}</button>` : ''}
              <button class="stamp-action-btn" style="padding:8px 16px; font-size:12.5px; white-space:nowrap;" id="quizNextBtn">
                ${qIndex + 1 < questions.length ? 'Nästa fråga »' : finishBtnLabel}
              </button>
            </div>
          </div>
        `;
        const chBtn = document.getElementById('quizChallengeBtn');
        if (chBtn) {
          chBtn.onclick = () => {
            state.duelSentDay = state.day;
            window.GT_MP.sendChallenge({
              fromName: state.playerFirstName || 'Spelare',
              q: q.q,
              a: q.a.slice(0, 4),
              explain: deepText,
              img: q.img || null
            });
            chBtn.disabled = true;
            chBtn.textContent = '✓ Utmaning skickad!';
            AudioMgr.play('bell');
            showToast(`Duellfråga skickad till ${oppName}! Klarar hen den inte vinner du +250 kr!`, 3200);
          };
        }
        document.getElementById('quizNextBtn').onclick = () => {
          AudioMgr.play('klick');
          qIndex++;
          renderQuestion();
        };
      }

      if (q.t === 'mc' || q.t === 'image') {
        const btns = container.querySelectorAll('.quiz-btn');
        btns.forEach(btn => {
          btn.onclick = () => {
            btns.forEach(b => b.disabled = true);
            const isRight = btn.dataset.right === '1';
            if (isRight) {
              btn.classList.add('correct');
              AudioMgr.play('right1');
              state.questionsCorrect++;
              sessionCorrect++;
              recordOutcome('full');
            } else {
              btn.classList.add('wrong');
              AudioMgr.play('wrong1');
              recordOutcome('miss');
              btns.forEach(b => { if (b.dataset.right === '1') b.classList.add('correct'); });
            }
            showAnswerDeepDive(isRight, q.a[0]);
          };
        });
      } else if (q.t === 'match') {
        let selectedLeft = 0;
        const pairsChosen = {};
        const leftBtns = Array.from(container.querySelectorAll('.bp-match-btn.left'));
        const rightBtns = Array.from(container.querySelectorAll('.bp-match-btn.right'));
        const submitBtn = document.getElementById('matchSubmit');
        const hintEl = document.getElementById('matchHint');

        const refreshMatchUI = () => {
          leftBtns.forEach(b => {
            const li = Number(b.dataset.left);
            b.classList.toggle('selected', selectedLeft === li);
            b.classList.toggle('paired', pairsChosen[li] !== undefined);
          });
          rightBtns.forEach(b => {
            const rp = Number(b.dataset.rpos);
            const badge = document.getElementById(`mrBadge${rp}`);
            const ownerLeft = Object.keys(pairsChosen).find(k => pairsChosen[k] === rp);
            if (ownerLeft !== undefined) {
              b.classList.add('paired');
              if (badge) { badge.textContent = String(Number(ownerLeft) + 1); badge.classList.remove('empty'); }
            } else {
              b.classList.remove('paired');
              if (badge) { badge.textContent = '?'; badge.classList.add('empty'); }
            }
          });
          const ready = Object.keys(pairsChosen).length === q.pairs.length;
          if (submitBtn) {
            submitBtn.disabled = !ready;
            submitBtn.style.opacity = ready ? '1' : '0.45';
          }
        };

        leftBtns.forEach(b => {
          b.onclick = () => {
            selectedLeft = Number(b.dataset.left);
            AudioMgr.play('klick');
            if (hintEl) hintEl.textContent = `Vald: ${q.pairs[selectedLeft][0]} — klicka nu på dess par till höger!`;
            refreshMatchUI();
          };
        });
        rightBtns.forEach(b => {
          b.onclick = () => {
            if (selectedLeft === null) {
              if (hintEl) hintEl.textContent = 'Välj först ett alternativ i vänstra spalten!';
              return;
            }
            const rp = Number(b.dataset.rpos);
            Object.keys(pairsChosen).forEach(k => { if (pairsChosen[k] === rp) delete pairsChosen[k]; });
            pairsChosen[selectedLeft] = rp;
            AudioMgr.play('klick');
            const nextLeft = q.pairs.findIndex((_, i) => pairsChosen[i] === undefined);
            selectedLeft = nextLeft >= 0 ? nextLeft : null;
            if (hintEl) hintEl.textContent = selectedLeft === null ? 'Alla par ihopkopplade! Klicka "Lås paren".' : `Vald: ${q.pairs[selectedLeft][0]} — klicka på dess par till höger.`;
            refreshMatchUI();
          };
        });
        refreshMatchUI();

        submitBtn.onclick = () => {
          submitBtn.disabled = true;
          let rightCount = 0;
          q.pairs.forEach((p, li) => {
            const rp = pairsChosen[li];
            if (rp !== undefined && matchRightList[rp] && matchRightList[rp].idx === li) rightCount++;
          });
          const allRight = rightCount === q.pairs.length;
          const partial = rightCount >= q.pairs.length - 1;
          if (allRight) { AudioMgr.play('right1'); state.questionsCorrect++; sessionCorrect++; recordOutcome('full'); }
          else if (partial) { AudioMgr.play('right1'); state.questionsCorrect += 0.5; sessionCorrect += 0.5; recordOutcome('partial'); }
          else { AudioMgr.play('wrong1'); recordOutcome('miss'); }
          const summary = q.pairs.map(p => `${p[0]} = ${p[1]}`).join(' · ');
          showAnswerDeepDive(partial, summary, `Du fick ${rightCount} av ${q.pairs.length} par rätt. ${q.explain || ''}`);
        };
      } else if (q.t === 'order') {
        const listEl = document.getElementById('orderList');
        const submitBtn = document.getElementById('orderSubmit');
        const renderOrder = () => {
          if (!listEl) return;
          listEl.innerHTML = orderState.map((it, pos) => `
            <div class="bp-order-row">
              <span class="bp-order-num">${pos + 1}</span>
              <span class="bp-order-text">${it.text}</span>
              <div class="bp-order-arrows">
                <button type="button" class="bp-order-move" data-dir="-1" data-pos="${pos}" ${pos === 0 ? 'disabled' : ''}>▲</button>
                <button type="button" class="bp-order-move" data-dir="1" data-pos="${pos}" ${pos === orderState.length - 1 ? 'disabled' : ''}>▼</button>
              </div>
            </div>
          `).join('');
          listEl.querySelectorAll('.bp-order-move').forEach(btn => {
            btn.onclick = () => {
              const p = Number(btn.dataset.pos);
              const d = Number(btn.dataset.dir);
              const target = p + d;
              if (target < 0 || target >= orderState.length) return;
              [orderState[p], orderState[target]] = [orderState[target], orderState[p]];
              AudioMgr.play('klick');
              renderOrder();
            };
          });
        };
        renderOrder();
        submitBtn.onclick = () => {
          submitBtn.disabled = true;
          let exactPositions = 0;
          orderState.forEach((it, pos) => { if (it.idx === pos) exactPositions++; });
          const allRight = exactPositions === q.items.length;
          const partial = exactPositions >= 2;
          if (allRight) { AudioMgr.play('right1'); state.questionsCorrect++; sessionCorrect++; recordOutcome('full'); }
          else if (partial) { AudioMgr.play('right1'); state.questionsCorrect += 0.5; sessionCorrect += 0.5; recordOutcome('partial'); }
          else { AudioMgr.play('wrong1'); recordOutcome('miss'); }
          const rightSeq = q.items.join(' → ');
          const note = `${allRight ? 'Helt rätt ordning!' : `Du fick ${exactPositions} av ${q.items.length} på exakt rätt plats.`} ${q.explain || ''}`;
          showAnswerDeepDive(allRight || partial, rightSeq, note);
        };
      } else if (q.t === 'num') {
        const slider = document.getElementById('gaugeInput');
        const display = document.getElementById('gaugeVal');
        const submit = document.getElementById('gaugeSubmit');

        slider.oninput = () => { display.textContent = Number(slider.value).toLocaleString('sv-SE'); };
        submit.onclick = () => {
          submit.disabled = true;
          slider.disabled = true;
          const userVal = Number(slider.value);
          const gMin = activeGauge ? activeGauge.min : q.min;
          const gMax = activeGauge ? activeGauge.max : q.max;
          const grade = gradeNumericGauge(userVal, q, gMin, gMax);
          let ok = false;
          let note = '';
          if (grade === 'exact') {
            AudioMgr.play('right1');
            state.questionsCorrect++;
            sessionCorrect++;
            recordOutcome('full');
            ok = true;
            note = `Du gissade ${userVal.toLocaleString('sv-SE')} ${q.unit} — imponerande nära det exakta värdet ${q.ans.toLocaleString('sv-SE')} ${q.unit}!`;
            addJournal(`Satte en knivskarp uppskattning (${userVal.toLocaleString('sv-SE')} ${q.unit}) i ${W.cities[state.city].name}!`);
          } else if (grade === 'close') {
            AudioMgr.play('right1');
            state.questionsCorrect += 0.5;
            sessionCorrect += 0.5;
            recordOutcome('partial');
            ok = true;
            note = `Din gissning (${userVal.toLocaleString('sv-SE')} ${q.unit}) var tillräckligt nära det exakta svaret ${q.ans.toLocaleString('sv-SE')} ${q.unit} för delpoäng.`;
          } else {
            AudioMgr.play('wrong1');
            recordOutcome('miss');
            note = `Du gissade ${userVal.toLocaleString('sv-SE')} ${q.unit}, medan det exakta svaret är ${q.ans.toLocaleString('sv-SE')} ${q.unit}.`;
          }
          showAnswerDeepDive(ok, `${q.ans.toLocaleString('sv-SE')} ${q.unit}`, note);
        };
      } else if (q.t === 'globe') {
        const qCanvas = document.getElementById('quizGlobeCanvas');
        const sideEl = document.getElementById('globeQuizSide');
        const statusEl = document.getElementById('globeQuizStatus');
        const submitBtn = document.getElementById('globeQuizSubmit');
        const zoomInBtn = document.getElementById('qGlobeZoomIn');
        const zoomOutBtn = document.getElementById('qGlobeZoomOut');
        let chosen = null;
        let qGlobeFrame = null;

        if (qCanvas && window.GlobeRenderer) {
          const offsetSign = Math.random() < 0.5 ? 1 : -1;
          const offsetLon = offsetSign * (75 + Math.random() * 75);
          let randStartLon = q.targetLon + offsetLon;
          if (randStartLon > 180) randStartLon -= 360;
          if (randStartLon < -180) randStartLon += 360;
          const randStartLat = Math.max(-42, Math.min(50, (q.targetLat > 8 ? -14 : 26) + (Math.random() * 24 - 12)));

          const qGlobe = new window.GlobeRenderer(qCanvas, {
            quizMode: true,
            radius: 122,
            centerLat: randStartLat,
            centerLon: randStartLon,
            onGlobeClick: (lat, lon) => {
              if (submitBtn.dataset.locked === '1') return;
              chosen = { lat, lon };
              qGlobe.pinMarker = { lat, lon, label: 'Din nål', color: '#ff4757' };
              statusEl.textContent = `Nål satt: ${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;
              submitBtn.disabled = false;
              submitBtn.style.opacity = '1';
              AudioMgr.play('klick');
            }
          });

          if (zoomInBtn) zoomInBtn.onclick = () => { qGlobe.radius = Math.min(340, qGlobe.radius + 40); };
          if (zoomOutBtn) zoomOutBtn.onclick = () => { qGlobe.radius = Math.max(92, qGlobe.radius - 40); };

          const qLoop = () => {
            if (!document.getElementById('quizGlobeCanvas')) {
              cancelAnimationFrame(qGlobeFrame);
              return;
            }
            qGlobe.render([], '__none__', []);
            qGlobeFrame = requestAnimationFrame(qLoop);
          };
          qGlobeFrame = requestAnimationFrame(qLoop);

          submitBtn.onclick = () => {
            if (!chosen) return;
            submitBtn.dataset.locked = '1';
            submitBtn.disabled = true;
            const distKm = Math.round(haversineKm(chosen.lat, chosen.lon, q.targetLat, q.targetLon));
            qGlobe.pinMarker = { lat: chosen.lat, lon: chosen.lon, label: 'Din nål', color: '#ff4757' };
            qGlobe.targetMarker = { lat: q.targetLat, lon: q.targetLon, label: q.targetName, color: '#2ecc71' };

            if (distKm <= 5000) {
              const midLat = (chosen.lat + q.targetLat) / 2;
              let dLon = q.targetLon - chosen.lon;
              if (dLon > 180) dLon -= 360;
              if (dLon < -180) dLon += 360;
              let midLon = chosen.lon + dLon / 2;
              if (midLon > 180) midLon -= 360;
              if (midLon < -180) midLon += 360;
              const targetRad = distKm <= 1200 ? 175 : (distKm <= 2800 ? 140 : 112);
              qGlobe.focusOn(midLat, midLon, null, targetRad, 650);
            } else {
              qGlobe.focusOn(q.targetLat, q.targetLon, null, 130, 650);
            }

            let ok = false;
            let headline = '';
            if (distKm <= 650) {
              ok = true;
              state.questionsCorrect++;
              sessionCorrect++;
              recordOutcome('full');
              AudioMgr.play('right1');
              headline = `✓ Mitt i prick! (${distKm.toLocaleString('sv-SE')} km ifrån)`;
            } else if (distKm <= 1500) {
              ok = true;
              state.questionsCorrect += 0.5;
              sessionCorrect += 0.5;
              recordOutcome('partial');
              AudioMgr.play('right1');
              headline = `✓ Nära! (${distKm.toLocaleString('sv-SE')} km ifrån · delpoäng)`;
            } else {
              recordOutcome('miss');
              AudioMgr.play('wrong1');
              headline = `✕ ${distKm.toLocaleString('sv-SE')} km ifrån rätt plats`;
            }

            if (sideEl) {
              sideEl.innerHTML = `
                <div style="font-weight:bold; font-size:13px; color:${ok ? '#78e08f' : '#ff7675'}; margin-bottom:4px;">${headline}</div>
                <div style="font-size:11px; color:#f2e6cf; margin-bottom:6px; display:flex; flex-wrap:wrap; gap:8px;">
                  <span><span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:#ff4757; vertical-align:middle; margin-right:3px;"></span>Din nål</span>
                  <span><span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:#2ecc71; vertical-align:middle; margin-right:3px;"></span>Rätt: <b>${q.targetName}</b></span>
                </div>
                <div style="font-size:11.5px; color:#d8cbb2; line-height:1.4; margin-bottom:8px;">
                  ${q.explain || `Den exakta platsen är ${q.targetName}.`}
                </div>
                <div class="globe-quiz-tools" style="margin-bottom:8px;">
                  <button type="button" class="globe-brass-btn" id="qGlobeShowTarget" style="padding:3px 8px; font-size:10.5px;">Visa rätt plats</button>
                  <button type="button" class="globe-brass-btn" id="qGlobeShowPin" style="padding:3px 8px; font-size:10.5px;">Visa din nål</button>
                </div>
                <button class="stamp-action-btn" style="padding:8px 16px; font-size:12.5px;" id="quizNextBtn">
                  ${qIndex + 1 < questions.length ? 'Nästa fråga »' : finishBtnLabel}
                </button>
              `;
              const showTargetBtn = document.getElementById('qGlobeShowTarget');
              const showPinBtn = document.getElementById('qGlobeShowPin');
              if (showTargetBtn) showTargetBtn.onclick = () => qGlobe.focusOn(q.targetLat, q.targetLon, null, 155, 500);
              if (showPinBtn) showPinBtn.onclick = () => qGlobe.focusOn(chosen.lat, chosen.lon, null, 155, 500);
              const nextBtn = document.getElementById('quizNextBtn');
              if (nextBtn) {
                nextBtn.onclick = () => { AudioMgr.play('klick'); qIndex++; renderQuestion(); };
              }
            }
          };
        }
      } else if (q.t === 'text') {
        const inp = document.getElementById('textQuizInput');
        const submit = document.getElementById('textQuizSubmit');
        if (inp) inp.focus();
        const normTxt = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        const levenshtein = (a, b) => {
          const m = a.length, n = b.length;
          if (!m) return n;
          if (!n) return m;
          const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
          for (let i = 0; i <= m; i++) dp[i][0] = i;
          for (let j = 0; j <= n; j++) dp[0][j] = j;
          for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
              const cost = a[i - 1] === b[j - 1] ? 0 : 1;
              dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
            }
          }
          return dp[m][n];
        };
        const fuzzyMatch = (userRaw, targetRaw) => {
          const u = normTxt(userRaw);
          const t = normTxt(targetRaw);
          if (u.length < 2 || !t) return false;
          if (u === t) return true;
          if (u.includes(t) || (t.includes(u) && u.length >= Math.min(4, t.length))) return true;
          const words = t.split(' ').filter(w => w.length >= 3);
          const lastName = words.length > 1 ? words[words.length - 1] : null;
          const candidates = lastName ? [t, lastName] : [t];
          return candidates.some(cand => {
            const maxDist = cand.length >= 7 ? 2 : (cand.length >= 4 ? 1 : 0);
            return levenshtein(u, cand) <= maxDist;
          });
        };
        const checkText = () => {
          if (submit.disabled) return;
          submit.disabled = true;
          inp.disabled = true;
          const raw = (inp.value || '').trim();
          const accepted = (q.accept || [q.ans]);
          const isRight = raw.length >= 2 && accepted.some(a => fuzzyMatch(raw, a));
          if (isRight) {
            inp.style.borderColor = '#2f7d43';
            inp.style.background = '#e6f5ea';
            AudioMgr.play('right1');
            state.questionsCorrect++;
            sessionCorrect++;
            recordOutcome('full');
          } else {
            inp.style.borderColor = '#a82828';
            inp.style.background = '#fae6e6';
            AudioMgr.play('wrong1');
            recordOutcome('miss');
          }
          showAnswerDeepDive(isRight, q.ans, q.explain);
        };
        submit.onclick = checkText;
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') checkText(); });
      }
    }

    renderQuestion();
  }

  window.GT_QUIZ = {
    prepareNumericGauge,
    gradeNumericGauge,
    pickHardQuestions,
    pickInteractiveQuestions,
    getQuestionsFor,
    runQuiz
  };
})();
