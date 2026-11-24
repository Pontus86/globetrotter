// Globetrotter — Interpol-jakten (Smitta-jakt över 3D-jordgloben!)
// 1 Interpol-agent jagar 5 mästertjuvar. Varje gripen tjuv omvänds till agent tills alla är tagna eller tiden tar slut!

(function () {
  'use strict';

  const THIEF_NAMES = [
    { id: 't1', name: 'Carmen',  color: '#ff6b6b' },
    { id: 't2', name: 'Arsène',  color: '#ff9f43' },
    { id: 't3', name: 'Vesper',  color: '#a78bfa' },
    { id: 't4', name: 'Lukas',   color: '#4ecdc4' },
    { id: 't5', name: 'Sora',    color: '#f9c74f' }
  ];

  const AGENT_NAMES = [
    { id: 'a1', name: 'Kommissarie Holm', color: '#38b6ff' }
  ];

  let hunt = null;
  let globeRenderer = null;
  let rafId = null;

  function W() { return window.GT_WORLD; }
  function ROUTES() { return window.GT_ROUTES; }
  function AUDIO() { return window.GT_AUDIO || { play() {} }; }

  function pickSpreadCities(count, exclude = []) {
    const world = W();
    const routes = ROUTES();
    const pool = routes.getRoundTripReachableCities(world, 'london');
    const usable = (pool.length >= count ? pool : Object.keys(world.cities)).filter(k => !exclude.includes(k));
    const shuffled = usable.slice().sort(() => Math.random() - 0.5);
    const chosen = [];
    for (const ck of shuffled) {
      if (chosen.length >= count) break;
      const c = world.cities[ck];
      const tooClose = chosen.some(other => routes.getDistanceBetweenCities(world, other, ck) < 1600);
      if (!tooClose || shuffled.length - chosen.length <= count) {
        chosen.push(ck);
      }
    }
    while (chosen.length < count && shuffled.length > 0) {
      const nxt = shuffled.pop();
      if (!chosen.includes(nxt)) chosen.push(nxt);
    }
    return chosen;
  }

  // BFS nästa steg mot en målstad (används av AI-agenter för att jaga senaste kända spår!)
  function nextStepTowards(fromKey, targetKey) {
    if (fromKey === targetKey) return fromKey;
    const world = W();
    const routes = ROUTES();
    const q = [[fromKey]];
    const seen = new Set([fromKey]);
    while (q.length > 0) {
      const path = q.shift();
      const last = path[path.length - 1];
      const edges = routes.getAllOutgoingEdges(world, last);
      for (const nxt of edges) {
        if (nxt === targetKey) return path[1] || nxt;
        if (!seen.has(nxt)) {
          seen.add(nxt);
          q.push([...path, nxt]);
        }
      }
    }
    const edges = routes.getAllOutgoingEdges(world, fromKey);
    return edges.length > 0 ? edges[Math.floor(Math.random() * edges.length)] : fromKey;
  }

  function isStealthEdge(fromKey, toKey) {
    const world = W();
    const routes = ROUTES();
    const trains = routes.getTrainsFrom(fromKey);
    if (trains.some(t => t.to === toKey)) return { stealth: true, mode: 'Tåg', icon: '🚂' };
    const boats = (world.cities[fromKey] && world.cities[fromKey].boats) || [];
    if (boats.some(b => b.to === toKey)) return { stealth: true, mode: 'Båt', icon: '🚢' };
    return { stealth: false, mode: 'Flyg', icon: '✈️' };
  }

  function startHunt(playerRole = 'agent') {
    const world = W();
    const startAgentCity = world.cities.london ? 'london' : Object.keys(world.cities)[0];
    const thiefStarts = pickSpreadCities(5, [startAgentCity]);

    const actors = [];
    if (playerRole === 'agent') {
      actors.push({
        id: 'player',
        name: 'Du (Agent)',
        isPlayer: true,
        role: 'agent',
        city: startAgentCity,
        color: '#38b6ff',
        lastKnownCity: startAgentCity,
        lastKnownDay: 1
      });
      THIEF_NAMES.forEach((t, i) => {
        const cKey = thiefStarts[i] || startAgentCity;
        actors.push({
          id: t.id,
          name: t.name,
          isPlayer: false,
          role: 'thief',
          city: cKey,
          color: t.color,
          lastKnownCity: cKey,
          lastKnownDay: 1
        });
      });
    } else {
      actors.push({
        id: 'player',
        name: 'Du (Rymling)',
        isPlayer: true,
        role: 'thief',
        city: thiefStarts[0] || 'paris',
        color: '#ffd875',
        lastKnownCity: thiefStarts[0] || 'paris',
        lastKnownDay: 1
      });
      actors.push({
        id: AGENT_NAMES[0].id,
        name: AGENT_NAMES[0].name,
        isPlayer: false,
        role: 'agent',
        city: startAgentCity,
        color: '#38b6ff',
        lastKnownCity: startAgentCity,
        lastKnownDay: 1
      });
      THIEF_NAMES.slice(0, 4).forEach((t, i) => {
        const cKey = thiefStarts[i + 1] || startAgentCity;
        actors.push({
          id: t.id,
          name: t.name,
          isPlayer: false,
          role: 'thief',
          city: cKey,
          color: t.color,
          lastKnownCity: cKey,
          lastKnownDay: 1
        });
      });
    }

    hunt = {
      playerRole,
      day: 1,
      maxDays: playerRole === 'agent' ? 18 : 15,
      actors,
      log: [
        playerRole === 'agent'
          ? 'Dag 1: Jakten har börjat! 5 mästertjuvar är på fri fot. Varje tjuv du griper omvänds till Interpol-agent!'
          : 'Dag 1: Interpol är dig i hälarna! Fly med tåg/båt för att dölja ditt spår — flyg avslöjar dig direkt!'
      ],
      playerHistory: [],
      finished: false,
      won: false,
      resultText: ''
    };

    AUDIO().play('fanfar');
    renderHuntUI();
  }

  function addLog(text) {
    if (!hunt) return;
    hunt.log.unshift(text);
    if (hunt.log.length > 14) hunt.log.pop();
  }

  function checkCaptures() {
    const world = W();
    const agents = hunt.actors.filter(a => a.role === 'agent');
    const thieves = hunt.actors.filter(a => a.role === 'thief');

    thieves.forEach(th => {
      const catcher = agents.find(ag => ag.city === th.city);
      if (catcher) {
        th.role = 'agent';
        th.color = '#38b6ff';
        th.lastKnownCity = th.city;
        th.lastKnownDay = hunt.day;
        AUDIO().play('stamp');
        const cName = world.cities[th.city]?.name || th.city;
        if (th.isPlayer) {
          addLog(`🚨 Dag ${hunt.day}: ${catcher.name} grep dig i ${cName}! Du omvändes till Interpol-agent!`);
          hunt.finished = true;
          hunt.won = false;
          hunt.resultText = `Du blev gripen i ${cName} på dag ${hunt.day} av ${catcher.name} och omvänd till Interpol-agent!`;
        } else {
          addLog(`🚨 Dag ${hunt.day}: ${catcher.name} grep ${th.name} i ${cName}! ${th.name} är nu Interpol-agent!`);
        }
      }
    });

    const remainingThieves = hunt.actors.filter(a => a.role === 'thief');
    if (!hunt.finished && remainingThieves.length === 0) {
      hunt.finished = true;
      hunt.won = hunt.playerRole === 'agent';
      hunt.resultText = hunt.playerRole === 'agent'
        ? `Alla 5 mästertjuvar greps och omvändes på bara ${hunt.day} dagar! Snyggt polisarbete!`
        : `Alla rymlingar greps före tidsgränsen.`;
      AUDIO().play('fanfar');
    } else if (!hunt.finished && hunt.day >= hunt.maxDays) {
      hunt.finished = true;
      if (hunt.playerRole === 'thief') {
        hunt.won = true;
        hunt.resultText = `Du överlevde alla ${hunt.maxDays} dagar på fri fot trots ${hunt.actors.filter(a => a.role === 'agent').length} jagande agenter!`;
        AUDIO().play('fanfar');
      } else {
        hunt.won = false;
        hunt.resultText = `Tiden tog slut efter ${hunt.maxDays} dagar — ${remainingThieves.length} mästertjuv(ar) kom undan!`;
        AUDIO().play('wrong1');
      }
    }
  }

  function advanceAiActors() {
    const world = W();
    const routes = ROUTES();
    const revealDay = (hunt.day % 3 === 0);

    // 1. AI-rymlingar flyttar (försöker öka avståndet till närmaste agent!)
    const agents = hunt.actors.filter(a => a.role === 'agent');
    hunt.actors.filter(a => !a.isPlayer && a.role === 'thief').forEach(th => {
      const edges = routes.getAllOutgoingEdges(world, th.city);
      if (edges.length === 0) return;
      // Välj en stad som är långt från agenterna (och gärna tåg/båt)
      let bestCity = edges[0];
      let bestScore = -1e9;
      edges.forEach(cand => {
        let minAgentDist = 1e9;
        agents.forEach(ag => {
          const d = routes.getDistanceBetweenCities(world, cand, ag.city);
          if (d < minAgentDist) minAgentDist = d;
        });
        const stealth = isStealthEdge(th.city, cand).stealth ? 1800 : 0;
        const score = minAgentDist + stealth + Math.random() * 1400;
        if (score > bestScore) {
          bestScore = score;
          bestCity = cand;
        }
      });
      const edgeInfo = isStealthEdge(th.city, bestCity);
      th.city = bestCity;
      if (!edgeInfo.stealth || revealDay) {
        th.lastKnownCity = bestCity;
        th.lastKnownDay = hunt.day;
        if (hunt.playerRole === 'agent') {
          addLog(`📡 Dag ${hunt.day}: Spår efter ${th.name} i ${world.cities[bestCity]?.name || bestCity} (${edgeInfo.stealth ? 'spaningsrapport' : 'tog flyg!'}).`);
        }
      }
    });

    // 2. AI-agenter flyttar mot närmaste kända tjuvspår!
    const thieves = hunt.actors.filter(a => a.role === 'thief');
    hunt.actors.filter(a => !a.isPlayer && a.role === 'agent').forEach(ag => {
      if (thieves.length === 0) return;
      let targetThief = thieves[0];
      let bestDist = 1e9;
      thieves.forEach(th => {
        const d = routes.getDistanceBetweenCities(world, ag.city, th.lastKnownCity || th.city);
        if (d < bestDist) { bestDist = d; targetThief = th; }
      });
      const goalCity = targetThief.lastKnownCity || targetThief.city;
      const step = nextStepTowards(ag.city, goalCity);
      if (step && step !== ag.city) {
        ag.city = step;
        ag.lastKnownCity = step;
        ag.lastKnownDay = hunt.day;
      }
    });
  }

  function playerMoveTo(destKey) {
    if (!hunt || hunt.finished) return;
    const world = W();
    const player = hunt.actors.find(a => a.isPlayer);
    if (!player || !world.cities[destKey]) return;

    const edgeInfo = isStealthEdge(player.city, destKey);
    const prevCity = player.city;
    const dist = ROUTES().getDistanceBetweenCities(world, prevCity, destKey);
    hunt.playerHistory.push({ from: prevCity, to: destKey, dist, isBoat: edgeInfo.mode === 'Båt' });
    if (hunt.playerHistory.length > 20) hunt.playerHistory.shift();

    player.city = destKey;
    hunt.day++;

    const revealDay = (hunt.day % 3 === 0);
    if (player.role === 'agent' || !edgeInfo.stealth || revealDay) {
      player.lastKnownCity = destKey;
      player.lastKnownDay = hunt.day;
      if (player.role === 'thief') {
        addLog(`📡 Dag ${hunt.day}: Du tog ${edgeInfo.mode.toLowerCase()} till ${world.cities[destKey].name} — ditt spår avslöjades!`);
      }
    } else {
      addLog(`🥷 Dag ${hunt.day}: Du smög med ${edgeInfo.mode.toLowerCase()} till ${world.cities[destKey].name} (osynlig för Interpol!).`);
    }

    AUDIO().play(edgeInfo.stealth ? 'klick' : 'takeoff');
    checkCaptures();
    if (!hunt.finished) {
      advanceAiActors();
      checkCaptures();
    }
    renderHuntUI();
  }

  function playerScout() {
    if (!hunt || hunt.finished) return;
    const world = W();
    const player = hunt.actors.find(a => a.isPlayer);
    if (!player) return;

    hunt.day++;
    if (player.role === 'agent') {
      const thieves = hunt.actors.filter(a => a.role === 'thief');
      if (thieves.length > 0) {
        const pick = thieves[Math.floor(Math.random() * thieves.length)];
        pick.lastKnownCity = pick.city;
        pick.lastKnownDay = hunt.day;
        const c = world.cities[pick.city];
        addLog(`🔍 Dag ${hunt.day}: Interpol-spaning! ${pick.name} siktades precis i ${c?.name || pick.city} (${c ? window.GT_ROUTES.regionLabel(c.region) : ''})!`);
      }
    } else {
      const edges = ROUTES().getAllOutgoingEdges(world, player.city);
      const decoy = edges.length > 0 ? edges[Math.floor(Math.random() * edges.length)] : player.city;
      player.lastKnownCity = decoy;
      player.lastKnownDay = hunt.day;
      addLog(`🎭 Dag ${hunt.day}: Du lade ut ett falskt spår mot ${world.cities[decoy]?.name || decoy}!`);
    }

    AUDIO().play('bell');
    advanceAiActors();
    checkCaptures();
    renderHuntUI();
  }

  function stopGlobeLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function openIntroModal() {
    stopGlobeLoop();
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalContent || !modalOverlay) return;

    modalContent.innerHTML = `
      <div class="scene-fullscreen" style="background:rgba(8,11,18,0.92); align-items:center; justify-content:center; padding:12px;">
        <div class="setup-modal-card" style="max-width:560px; border-color:#38b6ff;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:8px;">
            <div>
              <div class="setup-kicker" style="color:#8cd7ff;">NYTT SPELLÄGE · SMITTA-JAKT</div>
              <h2 class="setup-title" style="margin:2px 0;">🕵️ Interpol-jakten</h2>
            </div>
            <button class="globe-brass-btn" style="padding:5px 10px; font-size:11px;" onclick="window.GT.openStartScreen()">« Tillbaka</button>
          </div>
          <p style="font-size:13px; color:#e6d7bd; line-height:1.48; margin:0 0 12px;">
            En klassisk jakt över 3D-jordgloben! <b>1 Interpol-agent</b> jagar <b>5 mästertjuvar</b>. Varje gång en tjuv grips <b>omvänds den till agent</b> och hjälper till att jaga resten!
          </p>
          <div style="background:rgba(56,182,255,0.1); border-left:3px solid #38b6ff; padding:8px 11px; font-size:12px; color:#d8ebff; margin-bottom:14px; line-height:1.45;">
            <b>Regler:</b> Flyg (✈️) är snabba men avslöjar alltid tjuvens spår. Tåg &amp; båt (🚂/🚢) håller spåret dolt (utom var 3:e dag).
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <button class="stamp-action-btn" style="padding:12px 10px; background:linear-gradient(180deg,#1e5f8a 0%,#123a57 100%); border-color:#38b6ff;" onclick="window.GT_INTERPOL.startHunt('agent')">
              🕵️ Spela som Agent<br><small style="font-weight:normal; opacity:0.9;">Fånga alla 5 inom 18 dagar</small>
            </button>
            <button class="stamp-action-btn" style="padding:12px 10px; background:linear-gradient(180deg,#8c2b23 0%,#571611 100%); border-color:#ff9f43;" onclick="window.GT_INTERPOL.startHunt('thief')">
              🎭 Spela som Rymling<br><small style="font-weight:normal; opacity:0.9;">Överlev 15 dagar på fri fot</small>
            </button>
          </div>
        </div>
      </div>
    `;
    modalOverlay.classList.remove('hidden');
  }

  function renderHuntUI() {
    stopGlobeLoop();
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalContent || !modalOverlay || !hunt) return;

    const world = W();
    const routes = ROUTES();
    const player = hunt.actors.find(a => a.isPlayer);
    const curCity = world.cities[player.city];
    const agents = hunt.actors.filter(a => a.role === 'agent');
    const thieves = hunt.actors.filter(a => a.role === 'thief');

    const edges = routes.getAllOutgoingEdges(world, player.city);
    const moveBtnsHtml = hunt.finished
      ? `<div style="text-align:center; padding:8px 4px;">
           <div style="font-size:16px; font-weight:bold; color:${hunt.won ? '#78e08f' : '#ff7675'}; margin-bottom:6px;">
             ${hunt.won ? '🏆 SEGER!' : '🚨 JAKTEN ÖVER'}
           </div>
           <div style="font-size:12.5px; color:#f4ead6; margin-bottom:10px;">${hunt.resultText}</div>
           <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
             <button class="stamp-action-btn" onclick="window.GT_INTERPOL.openIntroModal()">Spela igen »</button>
             <button class="globe-brass-btn" onclick="window.GT_INTERPOL.exit()">Till startmenyn</button>
           </div>
         </div>`
      : `<div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
           ${edges.map(destKey => {
             const dc = world.cities[destKey];
             if (!dc) return '';
             const ei = isStealthEdge(player.city, destKey);
             return `<button class="globe-brass-btn" style="padding:6px 10px; font-size:11.5px; border-color:${ei.stealth ? '#66e38c' : '#ff9f43'};" onclick="window.GT_INTERPOL.playerMoveTo('${destKey}')">${ei.icon} ${dc.name}</button>`;
           }).join('')}
           <button class="stamp-action-btn" style="padding:6px 11px; font-size:11.5px;" onclick="window.GT_INTERPOL.playerScout()">
             ${player.role === 'agent' ? '🔍 Spana (+1 dag)' : '🎭 Falskt spår (+1 dag)'}
           </button>
         </div>`;

    const trackerChips = hunt.actors.filter(a => !a.isPlayer).map(a => {
      const cName = world.cities[a.lastKnownCity]?.name || a.lastKnownCity;
      const isAg = a.role === 'agent';
      return `<span style="font-size:10.5px; padding:2px 6px; border-radius:4px; background:${isAg ? 'rgba(56,182,255,0.2)' : 'rgba(255,159,67,0.18)'}; border:1px solid ${isAg ? '#38b6ff' : '#ff9f43'}; color:#fff;">
        ${isAg ? '🕵️' : '🎭'} ${a.name}: ${cName}${!isAg ? ` (Dag ${a.lastKnownDay})` : ''}
      </span>`;
    }).join('');

    modalContent.innerHTML = `
      <div class="scene-fullscreen scene-globe-full" style="display:flex; flex-direction:column;">
        <canvas id="interpolGlobeCanvas" width="1120" height="630" style="position:absolute; inset:0; width:100%; height:100%;"></canvas>

        <div class="globe-overlay-top" style="z-index:5;">
          <div class="globe-title-plate" style="border-color:#38b6ff;">
            <div class="globe-plate-kicker" style="color:#8cd7ff;">INTERPOL-JAKTEN · DAG ${hunt.day}/${hunt.maxDays}</div>
            <h3>${curCity ? curCity.name.toUpperCase() : player.city}</h3>
            <div class="globe-sub">🕵️ ${agents.length} Agenter · 🎭 ${thieves.length} Rymlingar kvar</div>
          </div>
          <div class="globe-top-actions">
            <button class="globe-brass-btn" style="padding:6px 10px; font-size:11px;" onclick="window.GT_INTERPOL.exit()">✕ Avsluta</button>
          </div>
        </div>

        <div class="globe-overlay-bottom" style="z-index:5;">
          <div class="globe-info-strip" style="max-height:none; padding:9px 11px;">
            <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:7px;">${trackerChips}</div>
            <div style="margin-bottom:7px;">${moveBtnsHtml}</div>
            <div style="font-size:11px; color:#cbb997; border-top:1px dashed rgba(201,154,69,0.35); padding-top:5px;">
              <b>Senaste:</b> ${hunt.log[0] || ''}
            </div>
          </div>
        </div>
      </div>
    `;
    modalOverlay.classList.remove('hidden');

    const canvas = document.getElementById('interpolGlobeCanvas');
    if (canvas && window.GlobeRenderer) {
      const cw = Math.max(320, Math.min(1200, Math.round(window.innerWidth || 1120)));
      const ch = Math.max(320, Math.min(1200, Math.round(window.innerHeight || 630)));
      canvas.width = cw;
      canvas.height = ch;
      const autoRadius = Math.round(Math.min(cw, ch) * 0.40);

      // Visa agenter och senaste kända tjuvspår som målmarkeringar på 3D-jordgloben!
      const markers = hunt.actors.filter(a => !a.isPlayer).map(a => ({
        key: a.lastKnownCity,
        done: a.role === 'agent'
      }));

      globeRenderer = new window.GlobeRenderer(canvas, {
        radius: autoRadius,
        goalCities: markers,
        showRoutes: true,
        labelMode: 'routes',
        centerLat: curCity ? curCity.lat : 48,
        centerLon: curCity ? curCity.lon : 10
      });

      const loop = () => {
        if (!document.getElementById('interpolGlobeCanvas')) {
          stopGlobeLoop();
          return;
        }
        globeRenderer.render(hunt.playerHistory, player.city, [], null);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }
  }

  function exit() {
    stopGlobeLoop();
    hunt = null;
    if (window.GT && window.GT.openStartScreen) {
      window.GT.openStartScreen();
    }
  }

  window.GT_INTERPOL = {
    openIntroModal,
    startHunt,
    playerMoveTo,
    playerScout,
    exit
  };
})();
