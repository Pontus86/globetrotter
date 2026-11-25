// Globetrotter: Scotland Yard 3D — Integrerad i huvudspelet (#stage + 90-tals HUD, klappertavla, pass, 39 minispel & polisradio)
// Kör MapLibre GL JS v5 (3D-glob + högupplösta 3D-städer med gatukollision & brostöd) i en egen ren modul.

window.GT_SCOTLAND = (function () {
  'use strict';

  const DATA = () => window.GT_SCOTLAND_DATA;
  const AUDIO = () => window.GT_AUDIO || { play() {} };

  const TOTAL_DAYS = 10;
  const REVEAL_DAYS = [3, 6, 8];
  const CAPTURE_DIST_M = 70;
  const INTERACT_DIST_M = 120;
  const PLAYER_BASE_SPEED_MPS = 115;
  const POLICE_RECON_COOLDOWN_SEC = 45;

  const CITY_MG_ID = {
    stockholm: 'mg_spy',
    oslo: 'navigator',
    copenhagen: 'mg_fish',
    london: 'camera',
    amsterdam: 'mg_antiques',
    brussels: 'passport',
    paris: 'piano',
    berlin: 'mg_detective',
    prague: 'mg_safe',
    vienna: 'piano',
    zurich: 'mg_safe',
    milan: 'mg_antiques',
    rome: 'camera',
    barcelona: 'mg_fruit',
    madrid: 'mg_detective',
    lisbon: 'navigator',
    athens: 'mg_archaeologist',
    istanbul: 'mg_spice'
  };

  let active = false;
  let map = null;
  let mapReady = false;
  let buildingLayers = [];
  let waterLayers = [];
  let walkableLayers = [];
  let rafId = null;
  let lastFrameTs = 0;

  let state = null;
  let matchToken = 0;
  let mgSessionId = 0;
  let keysDown = new Set();
  let markers = { cities: {}, police: {}, thief: null, ping: null, pois: [] };

  let lockRafId = null;
  let lockLastTs = 0;
  let lockState = { active: false, pos: 0.1, dir: 1, speed: 0.9, zoneStart: 0.36, zoneWidth: 0.22, hits: 0 };

  let setupPrefs = { role: 'thief', secPerDay: 60, missLimit: 2 };
  let uiMounted = false;
  let keyListenersBound = false;
  let hudSnapshot = null;

  // --- Hjälpfunktioner ---
  function $(id) { return document.getElementById(id); }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatClock(elapsedSec, secPerDay) {
    const f = elapsedSec / secPerDay;
    const day = Math.min(TOTAL_DAYS, Math.floor(f) + 1);
    const frac = f - Math.floor(f);
    const mins = Math.floor(frac * 24 * 60);
    return {
      day,
      hh: String(Math.floor(mins / 60)).padStart(2, '0'),
      mm: String(mins % 60).padStart(2, '0')
    };
  }

  function moveCoordsByMeters(coords, dxM, dyM) {
    const latRad = coords[1] * Math.PI / 180;
    return [
      coords[0] + dxM / (111320 * Math.max(0.2, Math.cos(latRad))),
      coords[1] + dyM / 111320
    ];
  }

  function lerpCoords(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }

  function bfsNextStep(fromId, toId, allowFlights = true) {
    const CITIES = DATA().CITIES;
    if (fromId === toId) return null;
    const q = [[fromId]];
    const seen = new Set([fromId]);
    while (q.length > 0) {
      const path = q.shift();
      const cur = path[path.length - 1];
      const c = CITIES[cur];
      if (!c) continue;
      const edges = allowFlights ? [...c.flights, ...c.trains] : c.trains;
      for (const nxt of edges) {
        if (nxt === toId) {
          const first = path.length === 1 ? nxt : path[1];
          const mode = (allowFlights && CITIES[fromId].flights.includes(first)) ? 'flight' : 'train';
          return { to: first, mode };
        }
        if (!seen.has(nxt)) {
          seen.add(nxt);
          q.push([...path, nxt]);
        }
      }
    }
    return null;
  }

  // --- Spara & återställ klassiska HUD:en så exit() aldrig lämnar smutsig DOM ---
  function snapshotClassicHud() {
    if (hudSnapshot) return;
    hudSnapshot = {};
    ['cityName', 'cityRegion', 'hudDay', 'hudTime', 'hudCash', 'dockStampCount', 'dockGlobeDist', 'dockBackpackCount'].forEach(id => {
      const el = $(id);
      if (el) hudSnapshot[id] = el.innerHTML;
    });
  }

  function restoreClassicHud() {
    if (!hudSnapshot) return;
    Object.keys(hudSnapshot).forEach(id => {
      const el = $(id);
      if (el) el.innerHTML = hudSnapshot[id];
    });
    hudSnapshot = null;
  }

  // --- Gatukollision (bara springa på gator & broar, aldrig över hus eller öppet vatten!) ---
  function detectMapCollisionLayers() {
    if (!map) return;
    const style = map.getStyle();
    if (!style || !style.layers) return;
    buildingLayers = [];
    waterLayers = [];
    walkableLayers = [];

    style.layers.forEach(l => {
      const id = (l.id || '').toLowerCase();
      const sl = (l['source-layer'] || '').toLowerCase();
      if (l.type === 'symbol') return;

      if (id.includes('bridge') || id.includes('road') || id.includes('path') || id.includes('tunnel') || sl === 'transportation') {
        walkableLayers.push(l.id);
      } else if (id.includes('building') || sl === 'building') {
        buildingLayers.push(l.id);
      } else if (id === 'water' || sl === 'water') {
        waterLayers.push(l.id);
      }
    });
  }

  function isBlockedOnMap(coords) {
    if (!mapReady || !map) return false;
    if (!state || state.viewMode !== 'city' || map.getZoom() < 14) return false;
    try {
      const pt = map.project(coords);
      const canvas = map.getCanvas();
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (pt.x < 8 || pt.y < 8 || pt.x > w - 8 || pt.y > h - 8) return false;
      const box = [[pt.x - 3, pt.y - 3], [pt.x + 3, pt.y + 3]];

      // 1. Hus blockerar alltid
      if (buildingLayers.length > 0) {
        const bFeats = map.queryRenderedFeatures(box, { layers: buildingLayers });
        if (bFeats && bFeats.length > 0) return true;
      }

      // 2. Vatten blockerar ENDAST om det inte ligger en bro/väg/gångstig ovanpå!
      if (waterLayers.length > 0) {
        const wFeats = map.queryRenderedFeatures(box, { layers: waterLayers });
        if (wFeats && wFeats.length > 0) {
          if (walkableLayers.length > 0) {
            const bridgeBox = [[pt.x - 6, pt.y - 6], [pt.x + 6, pt.y + 6]];
            const rFeats = map.queryRenderedFeatures(bridgeBox, { layers: walkableLayers });
            if (rFeats && rFeats.length > 0) return false; // På en bro → gåbart!
          }
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function tryStepOnStreet(fromCoords, dxM, dyM) {
    const stepLen = Math.hypot(dxM, dyM);
    if (stepLen < 0.01) return fromCoords;
    const direct = moveCoordsByMeters(fromCoords, dxM, dyM);
    if (!isBlockedOnMap(direct)) return direct;

    const baseAngle = Math.atan2(dyM, dxM);
    for (const off of [0.55, -0.55, 1.1, -1.1, 1.5, -1.5, 2.0, -2.0]) {
      const a = baseAngle + off;
      const cand = moveCoordsByMeters(fromCoords, Math.cos(a) * stepLen * 0.85, Math.sin(a) * stepLen * 0.85);
      if (!isBlockedOnMap(cand)) return cand;
    }
    if (isBlockedOnMap(fromCoords)) return direct;
    return fromCoords;
  }

  function nudgeToOpenStreet(coords) {
    if (!isBlockedOnMap(coords)) return coords;
    for (let dist = 12; dist <= 72; dist += 12) {
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const cand = moveCoordsByMeters(coords, Math.cos(a) * dist, Math.sin(a) * dist);
        if (!isBlockedOnMap(cand)) return cand;
      }
    }
    return coords;
  }

  // --- Rensa alla markörer & animationer rent ---
  function clearAllMarkers() {
    Object.values(markers.cities).forEach(m => m.remove());
    markers.cities = {};
    Object.values(markers.police).forEach(m => m.remove());
    markers.police = {};
    if (markers.thief) { markers.thief.remove(); markers.thief = null; }
    if (markers.ping) { markers.ping.remove(); markers.ping = null; }
    markers.pois.forEach(m => m.remove());
    markers.pois = [];
  }

  function stopLockLoop() {
    lockState.active = false;
    if (lockRafId) {
      cancelAnimationFrame(lockRafId);
      lockRafId = null;
    }
  }

  function cleanupMountedMinigame() {
    mgSessionId++;
    const mount = $('syMgMount');
    if (mount) {
      const quitBtn = mount.querySelector('#mgQuitBtn');
      if (quitBtn) {
        try { quitBtn.click(); } catch (e) {}
      }
      mount.innerHTML = '';
    }
  }

  // --- Montera 90-tals UI-lager inuti huvudspelets #stage ---
  function ensureMounted() {
    if (uiMounted) return;
    const stage = $('stage');
    if (!stage) return;

    const mapDiv = document.createElement('div');
    mapDiv.id = 'scotlandMapLayer';
    stage.insertBefore(mapDiv, stage.firstChild);

    const overlayHtml = `
      <div id="syDangerVignette" class="sy-danger-vignette hidden"></div>

      <aside id="syCompassPanel" class="sy-compass-panel hidden">
        <div class="sy-panel-top">
          <span class="sy-role-tag" id="syRoleTag">🕵️ TJUV</span>
          <span class="sy-stealth-pill" id="syStealthPill">DOLD</span>
        </div>
        <div class="sy-ping-strip">
          <span id="syNextPingTxt">📡 Ping: Dag 3 · 00:00</span>
          <span id="syMissStrip">Missar: 0/2</span>
        </div>
        <div id="syPoliceTabs" class="sy-police-tabs hidden"></div>
        <div id="syChaseAlert" class="sy-chase-alert hidden">
          <span id="syChaseMsg">🚨 POLIS I STADEN!</span> <span id="syChaseDist">200 m</span>
        </div>
        <div id="syTravelCard" class="sy-travel-card hidden">
          <div class="sy-travel-label" id="syTravelLabel">🚂 Tåg mot Paris...</div>
          <div class="sy-travel-bar"><div class="sy-travel-fill" id="syTravelFill"></div></div>
          <div class="sy-travel-eta" id="syTravelEta">12 s kvar</div>
        </div>
        <div class="sy-btn-stack" id="syActionButtons">
          <button class="sy-brass-btn gold" id="syBtnLandmark">
            <span id="syBtnLandmarkTxt">🏃 Spring till sevärdhet</span>
            <small id="syBtnLandmarkDist">–</small>
          </button>
          <button class="sy-brass-btn blue" id="syBtnDepartures">
            <span id="syBtnDeparturesTxt">🚉 Spring till stationen</span>
            <small id="syBtnHubDist">–</small>
          </button>
          <button class="sy-brass-btn" id="syBtnToggleView">
            <span id="syBtnToggleViewTxt">🏙️ Gå in i 3D-staden</span>
            <small>🌍/🏙️</small>
          </button>
          <button class="sy-brass-btn red" id="syBtnSprint">
            <span id="syBtnSprintTxt">⚡ Sprint-boost (Avslöjar dig)</span>
            <small>10s</small>
          </button>
        </div>
        <div class="sy-hint-note">
          <b>WASD / Piltangenter</b> eller klicka på gatan. Ta dig till <b>stationen</b> för att resa vidare, eller <b>sevärdheten</b> för Frågekort/Kassaskåp/Minispel.
        </div>
      </aside>

      <button type="button" id="syScannerToggleBtn" class="sy-scanner-toggle hidden" title="Visa/dölj Polisscanner">📻 RADIO</button>

      <aside id="syScannerBox" class="sy-scanner-box hidden">
        <div class="sy-scanner-head">
          <span>📻 POLISSCANNER · 148.2 MHz</span>
          <span class="sy-led">● LIVE</span>
        </div>
        <div class="sy-scanner-lcd" id="syScannerLcd"></div>
        <div class="sy-scanner-quick" id="syScannerQuick"></div>
        <form class="sy-scanner-form" id="syScannerForm">
          <input type="text" id="syScannerInput" placeholder="Prata på polisradion..." maxlength="90" autocomplete="off">
          <button type="submit">SÄND</button>
        </form>
      </aside>

      <div id="syModalLayer" class="sy-modal-layer hidden"></div>
    `;

    const wrap = document.createElement('div');
    wrap.id = 'syUiContainer';
    wrap.innerHTML = overlayHtml;
    stage.appendChild(wrap);

    $('syBtnLandmark').addEventListener('click', triggerLandmarkAction);
    $('syBtnDepartures').addEventListener('click', triggerHubAction);
    $('syBtnToggleView').addEventListener('click', toggleView);
    $('syBtnSprint').addEventListener('click', activateSprintBoost);
    $('syScannerToggleBtn').addEventListener('click', () => {
      $('syScannerBox').classList.toggle('mobile-open');
    });

    $('syScannerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = $('syScannerInput');
      sendRadioMessage(inp.value);
      inp.value = '';
      inp.blur();
    });

    if (!keyListenersBound) {
      keyListenersBound = true;
      window.addEventListener('keydown', (e) => {
        if (!active) return;
        if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
        const k = e.key.toLowerCase();
        keysDown.add(k);
        if (k === ' ' && lockState.active) {
          e.preventDefault();
          handleLockHit();
        }
      });
      window.addEventListener('keyup', (e) => {
        keysDown.delete(e.key.toLowerCase());
      });
    }

    uiMounted = true;
  }

  function renderRadioQuickButtons() {
    const box = $('syScannerQuick');
    if (!box || !state) return;
    const btns = state.playerRole === 'thief'
      ? [
          { label: '😏 Retas', msg: 'Ni letar i fel stad 😉' },
          { label: '🎭 Bluffa', msg: 'Hälsa Rom från mig!' }
        ]
      : [
          { label: '📢 Omringa!', msg: 'Stäng av flygplatserna, vi har tjuven snart!' },
          { label: '📡 Lägesrapport', msg: 'Alla enheter, rapportera era städer!' }
        ];
    box.innerHTML = btns.map(b => `<button type="button" data-msg="${escapeHtml(b.msg)}">${b.label}</button>`).join('');
    box.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => sendRadioMessage(b.getAttribute('data-msg')));
    });
  }

  function initMapIfNeeded(onReady) {
    if (map && mapReady) {
      map.resize();
      if (onReady) onReady();
      return;
    }
    if (map) {
      map.once('style.load', () => { if (onReady) onReady(); });
      return;
    }
    if (typeof window.maplibregl === 'undefined') {
      alert('MapLibre GL JS kunde inte laddas (kräver internetuppkoppling för 3D-kartan).');
      return;
    }

    map = new window.maplibregl.Map({
      container: 'scotlandMapLayer',
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [10.5, 49.5],
      zoom: 3.4,
      pitch: 15,
      bearing: 0,
      maxPitch: 70,
      antialias: true
    });

    map.on('style.load', () => {
      try { map.setProjection({ type: 'globe' }); } catch (e) {}
      setupMapLayers();
      detectMapCollisionLayers();
      mapReady = true;
      if (onReady) onReady();
    });

    map.on('click', (e) => {
      if (!active || !state || state.finished || state.viewMode !== 'city') return;
      if (!$('syModalLayer').classList.contains('hidden')) return;
      const actor = getControlledActor();
      if (!actor || actor.travel) return;
      actor.walkTarget = [e.lngLat.lng, e.lngLat.lat];
      actor.pendingAction = null;
      actor.stuckTimer = 0;
    });
  }

  function setupMapLayers() {
    const CITIES = DATA().CITIES;
    const ids = Object.keys(CITIES);
    const trains = [];
    const flights = [];
    const seen = new Set();

    ids.forEach(id => {
      const c = CITIES[id];
      c.trains.forEach(t => {
        const k = [id, t].sort().join('--') + ':t';
        if (seen.has(k) || !CITIES[t]) return;
        seen.add(k);
        trains.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: [c.center, CITIES[t].center] } });
      });
      c.flights.forEach(f => {
        const k = [id, f].sort().join('--') + ':f';
        if (seen.has(k) || !CITIES[f]) return;
        seen.add(k);
        flights.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: [c.center, CITIES[f].center] } });
      });
    });

    map.addSource('sy-trains', { type: 'geojson', data: { type: 'FeatureCollection', features: trains } });
    map.addSource('sy-flights', { type: 'geojson', data: { type: 'FeatureCollection', features: flights } });
    map.addSource('sy-active-routes', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

    map.addLayer({
      id: 'sy-trains-layer',
      type: 'line',
      source: 'sy-trains',
      maxzoom: 9,
      paint: { 'line-color': '#34d399', 'line-width': 2.2, 'line-opacity': 0.62, 'line-dasharray': [2, 2] }
    });
    map.addLayer({
      id: 'sy-flights-layer',
      type: 'line',
      source: 'sy-flights',
      maxzoom: 9,
      paint: { 'line-color': '#f5c556', 'line-width': 1.6, 'line-opacity': 0.38 }
    });
    map.addLayer({
      id: 'sy-active-routes-layer',
      type: 'line',
      source: 'sy-active-routes',
      maxzoom: 11,
      paint: { 'line-color': ['get', 'color'], 'line-width': 4, 'line-opacity': 0.92 }
    });
  }

  // --- Öppna Setup-skärmen direkt i huvudspelet ---
  function openSetup() {
    snapshotClassicHud();
    ensureMounted();
    if (window.GT && window.GT.closeModal) window.GT.closeModal();

    // Pausa eventuell pågående match & rensa markörer/tangenter
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    stopLockLoop();
    cleanupMountedMinigame();
    keysDown.clear();
    clearAllMarkers();
    matchToken++;

    active = true;
    document.body.classList.add('scotland-active');
    $('syCompassPanel').classList.add('hidden');
    $('syScannerBox').classList.add('hidden');
    $('syScannerToggleBtn').classList.add('hidden');
    $('syDangerVignette').classList.add('hidden');
    initMapIfNeeded();

    const html = `
      <div class="sy-card-90s">
        <h2>🕵️ Globetrotter: Scotland Yard (3D)</h2>
        <p class="sy-card-sub">
          Klockan tickar kontinuerligt över 10 dagar. En tjuv jagar 3 stöldgods i Europas 3D-städer — 3 poliser samarbetar över polisradion för att ringa in och gripa tjuven på gatorna.
        </p>

        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#d6c39e;margin-bottom:5px;">VÄLJ DIN ROLL</div>
        <div class="sy-choice-grid" id="syRoleGrid">
          <button type="button" class="sy-choice-card ${setupPrefs.role === 'thief' ? 'active' : ''}" data-role="thief">
            <b>🕵️ Mästertjuv (Du vs 3 Poliser)</b>
            <span>Stjäl 3 föremål via Frågekort, Kassaskåp eller Minispel. Avlyssna och bluffa på polisradion!</span>
          </button>
          <button type="button" class="sy-choice-card ${setupPrefs.role === 'police' ? 'active' : ''}" data-role="police">
            <b>🚓 Polischef (Styr 3 Poliser vs AI-Tjuv)</b>
            <span>Samarbeta med dina kollegor på spaningsfrågor och genskjut tjuven i 3D-städerna.</span>
          </button>
        </div>

        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#d6c39e;margin-bottom:5px;">MATCHLÄNGD (10 DAGAR I REALTID)</div>
        <div class="sy-choice-grid cols-3" id="syDurGrid">
          <button type="button" class="sy-choice-card ${setupPrefs.secPerDay === 30 ? 'active' : ''}" data-sec="30"><b>5 min</b><span>30 s / dag</span></button>
          <button type="button" class="sy-choice-card ${setupPrefs.secPerDay === 60 ? 'active' : ''}" data-sec="60"><b>10 min</b><span>60 s / dag</span></button>
          <button type="button" class="sy-choice-card ${setupPrefs.secPerDay === 90 ? 'active' : ''}" data-sec="90"><b>15 min</b><span>90 s / dag</span></button>
        </div>

        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#d6c39e;margin-bottom:5px;">MISSAR INNAN LARMET AVSLÖJAR TJUVEN (X)</div>
        <div class="sy-choice-grid cols-4" id="syMissGrid">
          <button type="button" class="sy-choice-card ${setupPrefs.missLimit === 1 ? 'active' : ''}" data-m="1"><b>1 miss</b><span>Hårt</span></button>
          <button type="button" class="sy-choice-card ${setupPrefs.missLimit === 2 ? 'active' : ''}" data-m="2"><b>2 missar</b><span>Standard</span></button>
          <button type="button" class="sy-choice-card ${setupPrefs.missLimit === 3 ? 'active' : ''}" data-m="3"><b>3 missar</b><span>Förlåtande</span></button>
          <button type="button" class="sy-choice-card ${setupPrefs.missLimit === 5 ? 'active' : ''}" data-m="5"><b>5 missar</b><span>Lugnt</span></button>
        </div>

        <div class="sy-modal-actions">
          <button type="button" class="sy-brass-btn" style="width:auto;" id="sySetupBack">← Till startskärmen</button>
          <button type="button" class="sy-brass-btn gold" style="width:auto;padding:11px 22px;" id="sySetupStart">🚀 STARTA JAKTEN</button>
        </div>
      </div>
    `;
    showSyModal(html);

    $('syRoleGrid').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      $('syRoleGrid').querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      setupPrefs.role = b.getAttribute('data-role');
    }));
    $('syDurGrid').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      $('syDurGrid').querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      setupPrefs.secPerDay = Number(b.getAttribute('data-sec')) || 60;
    }));
    $('syMissGrid').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      $('syMissGrid').querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      setupPrefs.missLimit = Number(b.getAttribute('data-m')) || 2;
    }));
    $('sySetupBack').addEventListener('click', exit);
    $('sySetupStart').addEventListener('click', () => startMatch(setupPrefs.role, setupPrefs.secPerDay, setupPrefs.missLimit));
  }

  function showSyModal(html) {
    keysDown.clear();
    const layer = $('syModalLayer');
    layer.innerHTML = html;
    layer.classList.remove('hidden');
  }

  function closeSyModal() {
    stopLockLoop();
    cleanupMountedMinigame();
    if (state) state.heistContext = null;
    const layer = $('syModalLayer');
    if (layer) {
      layer.innerHTML = '';
      layer.classList.add('hidden');
    }
  }

  // --- Starta match ---
  function startMatch(playerRole, secPerDay, missLimit) {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    stopLockLoop();
    cleanupMountedMinigame();
    clearAllMarkers();
    keysDown.clear();
    matchToken++;

    const CITIES = DATA().CITIES;
    const CITY_IDS = Object.keys(CITIES);
    const policeStarts = DATA().POLICE_ROSTER.map(p => p.startCity);
    const thiefStart = shuffle(CITY_IDS.filter(id => !policeStarts.includes(id)))[0];
    const pool = shuffle(CITY_IDS.filter(id => id !== thiefStart));
    const realTargets = pool.slice(0, 3);
    const suspectPool = shuffle([...realTargets, ...pool.slice(3, 6)]);

    state = {
      playerRole,
      secPerDay,
      missLimit,
      missesCount: 0,
      elapsedSec: 0,
      viewMode: 'globe',
      focusedCityId: playerRole === 'thief' ? thiefStart : DATA().POLICE_ROSTER[0].startCity,
      selectedPoliceId: DATA().POLICE_ROSTER[0].id,
      realTargets,
      collectedTargets: [],
      clearedSuspects: [],
      suspectPool,
      reconCooldownUntil: {}, // cityId -> elapsedSec (förhindrar oändlig ping-spam som polis)
      revealTriggered: {},
      lastPing: null,
      aiRadioTauntTimer: 22 + Math.random() * 18,
      finished: false,
      stats: { reveals: 0, solved: 0, travels: 0 },
      feed: [],
      heistContext: null,
      thief: {
        id: 'thief',
        name: 'Mästertjuven',
        city: thiefStart,
        coords: [...CITIES[thiefStart].hub.coords],
        walkTarget: null,
        pendingAction: null,
        stuckTimer: 0,
        travel: null,
        boostUntilSec: 0,
        boostCooldownSec: 0,
        aiWorkTimer: 0
      },
      police: DATA().POLICE_ROSTER.map(p => ({
        id: p.id,
        name: p.name,
        short: p.short,
        color: p.color,
        city: p.startCity,
        coords: [...CITIES[p.startCity].precinct.coords],
        walkTarget: null,
        pendingAction: null,
        stuckTimer: 0,
        travel: null,
        aiCooldown: 2 + Math.random() * 3
      }))
    };

    closeSyModal();
    $('syCompassPanel').classList.remove('hidden');
    $('syScannerBox').classList.remove('hidden');
    $('syScannerToggleBtn').classList.remove('hidden');
    $('syDangerVignette').classList.add('hidden');
    $('syRoleTag').textContent = playerRole === 'thief' ? '🕵️ MÄSTERTJUV' : '🚓 POLISCHEF';
    $('syPoliceTabs').classList.toggle('hidden', playerRole !== 'police');
    $('syBtnSprint').classList.toggle('hidden', playerRole !== 'thief');
    renderRadioQuickButtons();

    if (playerRole === 'thief') {
      addLog(`Startar i ${CITIES[thiefStart].name}. Stjäl 3 föremål inom 10 dagar — kolla Passet för dina mål!`, 'good');
    } else {
      addLog('6 misstänkta målstäder markerade i Passet. Genskjut tjuven på 3D-gatorna!', 'police');
    }

    AUDIO().play('fanfar');
    initMapIfNeeded(() => {
      rebuildCityMarkers();
      syncActorMarkers();
      updateRouteLines();
      switchToView('globe');
    });

    renderPanelState();
    lastFrameTs = performance.now();
    rafId = requestAnimationFrame(gameLoop);
  }

  function exit() {
    active = false;
    matchToken++;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    stopLockLoop();
    cleanupMountedMinigame();
    clearAllMarkers();
    keysDown.clear();
    closeSyModal();
    document.body.classList.remove('scotland-active');
    if ($('syCompassPanel')) $('syCompassPanel').classList.add('hidden');
    if ($('syScannerBox')) {
      $('syScannerBox').classList.add('hidden');
      $('syScannerBox').classList.remove('mobile-open');
    }
    if ($('syScannerToggleBtn')) $('syScannerToggleBtn').classList.add('hidden');
    if ($('syDangerVignette')) $('syDangerVignette').classList.add('hidden');
    restoreClassicHud();
    if (window.GT && window.GT.openStartScreen) window.GT.openStartScreen();
  }

  function getControlledActor() {
    if (!state) return null;
    if (state.playerRole === 'thief') return state.thief;
    return state.police.find(p => p.id === state.selectedPoliceId) || state.police[0];
  }

  // --- Logg & Polisscanner ---
  function addLog(text, type = '') {
    if (!state) return;
    const clk = formatClock(state.elapsedSec, state.secPerDay);
    state.feed.unshift({ text: `D${clk.day} ${clk.hh}:${clk.mm} ${text}`, type });
    if (state.feed.length > 22) state.feed.pop();
    const lcd = $('syScannerLcd');
    if (lcd) {
      lcd.innerHTML = state.feed.map(i => `<div class="sy-log-line ${i.type}">${escapeHtml(i.text)}</div>`).join('');
    }
  }

  function sendRadioMessage(rawMsg) {
    if (!state || !rawMsg || !rawMsg.trim()) return;
    const msg = rawMsg.trim();
    const CITIES = DATA().CITIES;
    const ids = Object.keys(CITIES);
    const myToken = matchToken;
    AUDIO().play('klick');

    if (state.playerRole === 'thief') {
      addLog(`🎙️ Du (kapad radio): "${msg}"`, 'thief');
      setTimeout(() => {
        if (!active || !state || state.finished || matchToken !== myToken) return;
        const sp = state.police[Math.floor(Math.random() * state.police.length)];
        const low = msg.toLowerCase();
        const hit = ids.find(id => low.includes(CITIES[id].name.toLowerCase()));
        if (hit) {
          addLog(`📻 ${sp.short}: "Tjuven nämnde ${CITIES[hit].name} — bluff eller misstag?"`, 'police');
        } else {
          const replies = [
            `📻 ${sp.short}: "Tjuven kapar vår frekvens! Håll skärpan!"`,
            `📻 ${sp.short}: "Skratta du — vi stänger in dig snart."`,
            `📻 ${sp.short}: "Spåra sändaren! Nästa ping närmar sig."`
          ];
          addLog(replies[Math.floor(Math.random() * replies.length)], 'police');
        }
      }, 1100);
    } else {
      addLog(`📻 Polischef (du): "${msg}"`, 'police');
      setTimeout(() => {
        if (!active || !state || state.finished || matchToken !== myToken) return;
        const sp = state.police[Math.floor(Math.random() * state.police.length)];
        addLog(`📻 ${sp.short}: "Uppfattat chefen! Befinner mig i ${CITIES[sp.city].name}."`, 'police');
      }, 850);
    }
  }

  // --- Vy-växling: 3D-Glob ↔ 3D-Stad ---
  function toggleView() {
    if (!state) return;
    const actor = getControlledActor();
    if (state.viewMode === 'globe') {
      if (actor && actor.travel) return;
      switchToView('city', actor ? actor.city : state.focusedCityId);
    } else {
      switchToView('globe');
    }
  }

  function switchToView(mode, cityIdOverride = null) {
    if (!state || !mapReady) return;
    const CITIES = DATA().CITIES;
    const actor = getControlledActor();
    const targetId = cityIdOverride || (actor ? actor.city : state.focusedCityId);
    const city = CITIES[targetId];
    if (!city) return;

    state.viewMode = mode;
    state.focusedCityId = targetId;
    AUDIO().play('paper');

    if (mode === 'city') {
      $('syBtnToggleViewTxt').textContent = '🌍 Zooma ut till 3D-Glob';
      map.flyTo({
        center: actor && actor.city === targetId && !actor.travel ? actor.coords : city.center,
        zoom: 16.0,
        pitch: 60,
        bearing: -18,
        duration: 1100
      });
      rebuildCityPois(targetId);
      const myToken = matchToken;
      map.once('idle', () => {
        if (!active || !state || matchToken !== myToken) return;
        if (actor && !actor.travel && actor.city === targetId) {
          actor.coords = nudgeToOpenStreet(actor.coords);
        }
      });
    } else {
      $('syBtnToggleViewTxt').textContent = '🏙️ Gå in i 3D-staden';
      clearCityPois();
      map.flyTo({ center: city.center, zoom: 3.8, pitch: 15, bearing: 0, duration: 950 });
    }

    rebuildCityMarkers();
    renderPanelState();
  }

  // --- Markörer ---
  function rebuildCityMarkers() {
    Object.values(markers.cities).forEach(m => m.remove());
    markers.cities = {};
    if (!mapReady || !state || state.viewMode === 'city') return;

    const CITIES = DATA().CITIES;
    const actor = getControlledActor();

    Object.keys(CITIES).forEach(id => {
      const c = CITIES[id];
      const el = document.createElement('div');
      el.className = 'sy-map-city';
      const isCur = actor && actor.city === id && !actor.travel;
      const isTarget = state.playerRole === 'thief'
        ? (state.realTargets.includes(id) && !state.collectedTargets.includes(id))
        : (state.suspectPool.includes(id) && !state.clearedSuspects.includes(id));

      const pin = document.createElement('div');
      pin.className = 'sy-city-pin' + (isCur ? ' current' : isTarget ? ' target' : '');
      const tag = document.createElement('div');
      tag.className = 'sy-city-tag';
      tag.textContent = (isTarget ? (state.playerRole === 'thief' ? c.landmark.icon + ' ' : '❓ ') : '') + c.name;

      el.appendChild(pin);
      el.appendChild(tag);
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        handleGlobeCityClick(id);
      });

      markers.cities[id] = new window.maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(c.center)
        .addTo(map);
    });
  }

  function clearCityPois() {
    markers.pois.forEach(m => m.remove());
    markers.pois = [];
  }

  function rebuildCityPois(cityId) {
    clearCityPois();
    const c = DATA().CITIES[cityId];
    if (!c || !mapReady) return;

    const isRealTarget = state.realTargets.includes(cityId) && !state.collectedTargets.includes(cityId);
    const lmEl = document.createElement('div');
    lmEl.className = 'sy-poi-pin';
    lmEl.innerHTML = `<div class="sy-poi-pill">${
      state.playerRole === 'thief' && isRealTarget
        ? `${c.landmark.icon} ${c.landmark.name} (STÖLDMÅL)`
        : `🏛️ ${c.landmark.name} (FRÅGA / MINISPEL)`
    }</div>`;
    lmEl.addEventListener('click', (ev) => { ev.stopPropagation(); triggerLandmarkAction(); });
    markers.pois.push(new window.maplibregl.Marker({ element: lmEl, anchor: 'bottom' }).setLngLat(c.landmark.coords).addTo(map));

    const hubEl = document.createElement('div');
    hubEl.className = 'sy-poi-pin';
    hubEl.innerHTML = `<div class="sy-poi-pill hub">🚉 ${c.hub.name} (AVGÅNGAR)</div>`;
    hubEl.addEventListener('click', (ev) => { ev.stopPropagation(); triggerHubAction(); });
    markers.pois.push(new window.maplibregl.Marker({ element: hubEl, anchor: 'bottom' }).setLngLat(c.hub.coords).addTo(map));
  }

  function getActorDisplayCoords(actor) {
    const CITIES = DATA().CITIES;
    if (actor.travel) {
      const p = Math.min(1, (state.elapsedSec - actor.travel.startSec) / actor.travel.durationSec);
      return lerpCoords(CITIES[actor.travel.from].center, CITIES[actor.travel.to].center, p);
    }
    if (state.viewMode === 'city' && actor.city === state.focusedCityId) return actor.coords;
    return CITIES[actor.city].center;
  }

  function syncActorMarkers() {
    if (!mapReady || !state) return;

    state.police.forEach(p => {
      const pos = getActorDisplayCoords(p);
      if (!markers.police[p.id]) {
        const el = document.createElement('div');
        el.className = 'sy-actor-pin police';
        el.innerHTML = `🚓<span class="sy-actor-caption">${p.short}</span>`;
        if (state.playerRole === 'police') {
          el.style.cursor = 'pointer';
          el.addEventListener('click', (ev) => {
            ev.stopPropagation();
            state.selectedPoliceId = p.id;
            renderPanelState();
          });
        }
        markers.police[p.id] = new window.maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(pos).addTo(map);
      } else {
        markers.police[p.id].setLngLat(pos);
      }
    });

    const policeInThiefCity = state.police.some(p => !p.travel && !state.thief.travel && p.city === state.thief.city);
    const showThief = state.playerRole === 'thief' || policeInThiefCity;
    if (showThief) {
      const tPos = getActorDisplayCoords(state.thief);
      if (!markers.thief) {
        const el = document.createElement('div');
        el.className = 'sy-actor-pin thief';
        el.innerHTML = `🕵️<span class="sy-actor-caption">${state.playerRole === 'thief' ? 'DU' : 'TJUV!'}</span>`;
        markers.thief = new window.maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(tPos).addTo(map);
      } else {
        markers.thief.setLngLat(tPos);
      }
    } else if (markers.thief) {
      markers.thief.remove();
      markers.thief = null;
    }

    if (state.lastPing && state.viewMode === 'globe') {
      const c = DATA().CITIES[state.lastPing.cityId];
      if (c) {
        if (!markers.ping) {
          const el = document.createElement('div');
          el.className = 'sy-actor-pin ping';
          el.innerHTML = `📡<span class="sy-actor-caption">Spår D${state.lastPing.day}</span>`;
          markers.ping = new window.maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(c.center).addTo(map);
        } else {
          markers.ping.setLngLat(c.center);
          const cap = markers.ping.getElement().querySelector('.sy-actor-caption');
          if (cap) cap.textContent = `Spår D${state.lastPing.day} ${state.lastPing.hh}:${state.lastPing.mm}`;
        }
      }
    } else if (markers.ping) {
      markers.ping.remove();
      markers.ping = null;
    }
  }

  function updateRouteLines() {
    if (!mapReady || !state) return;
    const src = map.getSource('sy-active-routes');
    if (!src) return;
    const CITIES = DATA().CITIES;
    const feats = [];
    const pushLine = (a, color) => {
      if (!a.travel) return;
      feats.push({
        type: 'Feature',
        properties: { color },
        geometry: { type: 'LineString', coordinates: [CITIES[a.travel.from].center, CITIES[a.travel.to].center] }
      });
    };
    state.police.forEach(p => pushLine(p, '#38bdf8'));
    if (state.playerRole === 'thief') pushLine(state.thief, '#f5c556');
    src.setData({ type: 'FeatureCollection', features: feats });
  }

  // --- Interaktioner: Glob, Sevärdhet, Station (Ingen fusk-teleportering vid jakt!) ---
  function isAtStation(actor) {
    if (!actor || actor.travel) return false;
    const c = DATA().CITIES[actor.city];
    return DATA().distanceMeters(actor.coords, c.hub.coords) <= INTERACT_DIST_M;
  }

  function isChaseActiveFor(actor) {
    if (!state || !actor || actor.travel) return false;
    if (actor.id === 'thief') {
      return state.police.some(p => !p.travel && p.city === actor.city);
    }
    return !state.thief.travel && state.thief.city === actor.city;
  }

  function handleGlobeCityClick(cityId) {
    const actor = getControlledActor();
    if (!actor || actor.travel) return;
    if (actor.city === cityId) {
      switchToView('city', cityId);
      return;
    }

    // Förhindra teleportering bort från en pågående jakt i 3D-staden — måste nå stationen!
    if (state.playerRole === 'thief' && !isAtStation(actor)) {
      addLog(`🚉 Du måste ta dig till ${DATA().CITIES[actor.city].hub.name} innan du kan resa vidare!`, 'alert');
      switchToView('city', actor.city);
      actor.walkTarget = [...DATA().CITIES[actor.city].hub.coords];
      actor.pendingAction = 'hub';
      actor.stuckTimer = 0;
      return;
    }

    const cur = DATA().CITIES[actor.city];
    if (cur.trains.includes(cityId)) startTravel(actor, cityId, 'train');
    else if (cur.flights.includes(cityId)) startTravel(actor, cityId, 'flight');
    else openDepartureBoardModal();
  }

  function triggerLandmarkAction() {
    const actor = getControlledActor();
    if (!actor || actor.travel) return;
    if (state.viewMode !== 'city') {
      switchToView('city', actor.city);
    }
    const c = DATA().CITIES[actor.city];
    const d = DATA().distanceMeters(actor.coords, c.landmark.coords);
    if (d <= INTERACT_DIST_M) {
      openChallengeModal();
    } else {
      actor.walkTarget = [...c.landmark.coords];
      actor.pendingAction = 'landmark';
      actor.stuckTimer = 0;
      addLog(`🏃 Springer längs gatorna mot ${c.landmark.name} (${Math.round(d)} m)...`, 'good');
    }
  }

  function triggerHubAction() {
    const actor = getControlledActor();
    if (!actor || actor.travel) return;
    const c = DATA().CITIES[actor.city];
    const atHub = isAtStation(actor);

    // Polischef på globen kan skicka sina 3 poliser smidigt; Tjuven (eller om man är i 3D-stad borta från stationen) måste springa till stationen!
    const mustRunToHub = !atHub && (state.playerRole === 'thief' || state.viewMode === 'city' || isChaseActiveFor(actor));
    if (mustRunToHub) {
      if (state.viewMode !== 'city') switchToView('city', actor.city);
      actor.walkTarget = [...c.hub.coords];
      actor.pendingAction = 'hub';
      actor.stuckTimer = 0;
      const d = Math.round(DATA().distanceMeters(actor.coords, c.hub.coords));
      addLog(`🏃 Springer till ${c.hub.name} för avresa (${d} m)...`, 'good');
      return;
    }
    openDepartureBoardModal();
  }

  function activateSprintBoost() {
    if (!state || state.playerRole !== 'thief' || state.thief.travel) return;
    if (state.elapsedSec < state.thief.boostCooldownSec) return;
    state.thief.boostUntilSec = state.elapsedSec + 10;
    state.thief.boostCooldownSec = state.elapsedSec + 25;
    triggerThiefReveal(state.thief.city, 'Sprint-boost aktiverad!');
  }

  // --- Mekanisk Klappertavla (Avgångar) ---
  function openDepartureBoardModal() {
    if (!state || state.finished) return;
    const actor = getControlledActor();
    if (!actor || actor.travel) return;
    const CITIES = DATA().CITIES;
    const c = CITIES[actor.city];
    AUDIO().play('flap');

    const rowHtml = (destId, mode) => {
      const d = CITIES[destId];
      const sec = DATA().getTravelSeconds(actor.city, destId, mode);
      const isTarget = state.playerRole === 'thief' && state.realTargets.includes(destId) && !state.collectedTargets.includes(destId);
      const hasPol = state.police.some(p => !p.travel && p.city === destId);
      const badge = mode === 'train'
        ? '<span class="sy-flap-badge stealth">OSYNLIG</span>'
        : '<span class="sy-flap-badge loud">AVSLÖJAR DIG</span>';
      return `
        <button type="button" class="sy-flap-row" data-to="${destId}" data-mode="${mode}">
          <span>${mode === 'train' ? '🚂' : '✈️'} ${d.name.toUpperCase()} ${isTarget ? '🎯' : ''}${hasPol ? ' 🚓' : ''} ${badge}</span>
          <span>${sec} SEK</span>
        </button>
      `;
    };

    const html = `
      <div class="sy-card-90s">
        <h2>🚉 Avgångstavla — ${c.name}</h2>
        <p class="sy-card-sub">
          Välj tåg/båt för att resa helt osynligt, eller direktflyg för att komma fram snabbare mot att din destination avslöjas för poliserna.
        </p>
        <div class="sy-flap-board">
          <div class="sy-flap-head"><span>🚂 TÅG &amp; BÅT (SMYGRUTT)</span><span>RESTID</span></div>
          ${c.trains.map(id => rowHtml(id, 'train')).join('')}
        </div>
        <div class="sy-flap-board">
          <div class="sy-flap-head"><span>✈️ DIREKTFLYG (SNABBT · RADARPING)</span><span>RESTID</span></div>
          ${c.flights.map(id => rowHtml(id, 'flight')).join('')}
        </div>
        <div class="sy-modal-actions">
          <button type="button" class="sy-brass-btn" style="width:auto;" id="syCloseDep">Stäng tavlan</button>
        </div>
      </div>
    `;
    showSyModal(html);

    $('syModalLayer').querySelectorAll('.sy-flap-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const to = btn.getAttribute('data-to');
        const mode = btn.getAttribute('data-mode');
        closeSyModal();
        startTravel(actor, to, mode);
      });
    });
    $('syCloseDep').addEventListener('click', closeSyModal);
  }

  // --- Svenskt Uppdragspass ---
  function openPassportModal() {
    if (!state) return;
    const CITIES = DATA().CITIES;
    AUDIO().play('paper');

    const rows = state.playerRole === 'thief'
      ? state.realTargets.map(id => {
          const c = CITIES[id];
          const done = state.collectedTargets.includes(id);
          return `<div class="sy-flap-row" style="cursor:default;${done ? 'opacity:0.6;text-decoration:line-through;' : ''}">
            <span>${c.landmark.icon} ${c.landmark.artifact} — <b>${c.name}</b> (${c.landmark.name})</span>
            <span>${done ? '✅ STULEN' : '🎯 MÅL'}</span>
          </div>`;
        }).join('')
      : state.suspectPool.map(id => {
          const c = CITIES[id];
          const stolen = state.collectedTargets.includes(id);
          const cleared = state.clearedSuspects.includes(id);
          return `<div class="sy-flap-row" style="cursor:default;">
            <span>${stolen ? '🚨' : cleared ? '✓' : '❓'} <b>${c.name}</b> (${c.landmark.name})</span>
            <span>${stolen ? 'STULEN' : cleared ? 'AVSKRIVEN' : 'MISSTÄNKT'}</span>
          </div>`;
        }).join('');

    showSyModal(`
      <div class="sy-card-90s">
        <h2>🛂 ${state.playerRole === 'thief' ? 'Tjuvens Uppdragspass' : 'Interpols Spaningsakt'}</h2>
        <p class="sy-card-sub">
          ${state.playerRole === 'thief'
            ? `Samla alla 3 föremål inom 10 dagar. Larmgräns: ${state.missLimit} missar. Obligatoriska radar-pings: Dag 3, 6 och 8.`
            : `3 av dessa 6 städer är tjuvens riktiga mål. Gör spaningsfrågor vid sevärdheter eller genskjut tjuven på gatorna!`}
        </p>
        <div class="sy-flap-board">${rows}</div>
        <div class="sy-modal-actions">
          <button type="button" class="sy-brass-btn gold" style="width:auto;" id="syClosePass">Stäng passet</button>
        </div>
      </div>
    `);
    $('syClosePass').addEventListener('click', closeSyModal);
  }

  // --- Resa mellan städer ---
  function startTravel(actor, destId, mode) {
    if (!state || state.finished || actor.travel) return;
    const CITIES = DATA().CITIES;
    const fromId = actor.city;
    if (fromId === destId) return;

    const durationSec = DATA().getTravelSeconds(fromId, destId, mode);
    actor.travel = { from: fromId, to: destId, mode, startSec: state.elapsedSec, durationSec };
    actor.walkTarget = null;
    actor.pendingAction = null;

    if (actor === getControlledActor()) {
      state.stats.travels++;
      AUDIO().play(mode === 'flight' ? 'takeoff' : 'ferry');
      if (state.viewMode === 'city') switchToView('globe', fromId);
    }

    if (actor.id === 'thief' && mode === 'flight') {
      triggerThiefReveal(destId, `Tog direktflyg mot ${CITIES[destId].name}!`);
    } else if (actor.id === 'thief' && state.playerRole === 'thief') {
      addLog(`🚂 Smyger med tåg/båt mot ${CITIES[destId].name} (${durationSec}s).`, 'good');
    } else if (actor.id !== 'thief' && state.playerRole === 'police') {
      addLog(`🚓 ${actor.short} skickad med ${mode === 'flight' ? 'flyg' : 'tåg'} till ${CITIES[destId].name}.`, 'police');
    }

    updateRouteLines();
    renderPanelState();
  }

  function triggerThiefReveal(cityId, reason) {
    if (!state) return;
    const clk = formatClock(state.elapsedSec, state.secPerDay);
    state.lastPing = { cityId, day: clk.day, hh: clk.hh, mm: clk.mm, reason };
    state.stats.reveals++;
    AUDIO().play('stamp');
    addLog(`📡 RADARPING i ${DATA().CITIES[cityId].name}! (${reason})`, 'alert');
    syncActorMarkers();
  }

  // --- Frågekort, Kassaskåp & Huvudspelets 39 Minispel ---
  function getQuestionForCity(cityId) {
    const c = DATA().CITIES[cityId];
    const pool = [...c.questions];
    if (window.GT_WORLD && window.GT_WORLD.cities && window.GT_WORLD.cities[cityId]) {
      const wc = window.GT_WORLD.cities[cityId];
      if (wc.places) {
        wc.places.forEach(pid => {
          const p = window.GT_WORLD.places && window.GT_WORLD.places[pid];
          if (p && p.questions) {
            p.questions.forEach(q => {
              if (q.q && q.options && typeof q.answer === 'number') {
                pool.push({ q: q.q, options: q.options, correct: q.answer });
              }
            });
          }
        });
      }
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function openChallengeModal() {
    if (!state || state.finished) return;
    const actor = getControlledActor();
    if (!actor || actor.travel) return;
    const cityId = actor.city;
    const c = DATA().CITIES[cityId];
    const isPolice = state.playerRole === 'police';

    // Förhindra oändlig spanings-spam på samma sevärdhet som Polis
    if (isPolice && state.reconCooldownUntil[cityId] && state.elapsedSec < state.reconCooldownUntil[cityId]) {
      const rem = Math.ceil(state.reconCooldownUntil[cityId] - state.elapsedSec);
      addLog(`🔍 Spaning vid ${c.landmark.name} redan gjord — ny spaning möjlig om ${rem}s.`, 'police');
      AUDIO().play('klick');
      return;
    }

    const isRealTarget = state.realTargets.includes(cityId) && !state.collectedTargets.includes(cityId);
    const qObj = getQuestionForCity(cityId);
    state.heistContext = { cityId, isPolice, isRealTarget, qObj, answered: false, activeTab: 'quiz' };

    const html = `
      <div class="sy-card-90s" style="max-width:720px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:12px;font-weight:800;color:#ffd875;">
            ${isPolice ? `🔍 SPANING · ${c.name.toUpperCase()}` : isRealTarget ? `${c.landmark.icon} STÖLDMÅL: ${c.landmark.artifact.toUpperCase()}` : `🎭 BONUS · ${c.name.toUpperCase()}`}
          </span>
          <span style="font-family:'Courier New',monospace;font-size:11px;color:#fca5a5;background:rgba(220,38,38,0.2);padding:3px 8px;border-radius:5px;">
            ⏱️ KLOCKAN TICKAR · <span id="syModalMissCount">Missar ${state.missesCount}/${state.missLimit}</span>
          </span>
        </div>
        <h2>${c.landmark.name}</h2>

        <div class="sy-tabs">
          <button type="button" class="sy-tab active" id="syTabQuiz">❓ Frågekort</button>
          <button type="button" class="sy-tab" id="syTabLock">🔐 Kassaskåp</button>
          <button type="button" class="sy-tab" id="syTabMg">🎮 Minispel</button>
        </div>

        <div id="syPaneQuiz">
          <div class="sy-quiz-paper">
            <div id="syRadioHint"></div>
            <div class="sy-quiz-q" id="syQuizQ"></div>
            <div class="sy-quiz-opts" id="syQuizOpts"></div>
          </div>
          <div class="sy-feedback" id="syQuizFb"></div>
        </div>

        <div id="syPaneLock" class="hidden">
          <p class="sy-card-sub">Tryck <b>STOPP / MELLANSLAG</b> när visaren är i den gröna zonen — <b>3 träffar</b> öppnar valvet tyst!</p>
          <div class="sy-lock-bar">
            <div class="sy-lock-zone" id="syLockZone"></div>
            <div class="sy-lock-needle" id="syLockNeedle"></div>
          </div>
          <div class="sy-lock-pips" id="syLockPips">
            <span class="sy-pip"></span><span class="sy-pip"></span><span class="sy-pip"></span>
          </div>
          <button type="button" class="sy-brass-btn gold" style="justify-content:center;" id="syLockHitBtn">🎯 STOPP! (Mellanslag)</button>
          <div class="sy-feedback" id="syLockFb"></div>
        </div>

        <div id="syPaneMg" class="hidden">
          <div id="syMgMount"></div>
          <div class="sy-feedback" id="syMgFb"></div>
        </div>

        <div class="sy-modal-actions">
          ${(!isPolice && isRealTarget)
            ? '<button type="button" class="sy-brass-btn red" style="width:auto;" id="syLoudBtn">💥 SNABBKUPP (TA DIREKT · AVSLÖJAR DIG)</button>'
            : '<span></span>'}
          <button type="button" class="sy-brass-btn" style="width:auto;" id="syCancelCh">Avbryt</button>
        </div>
      </div>
    `;
    showSyModal(html);
    renderQuizInModal(qObj, isPolice);

    $('syTabQuiz').addEventListener('click', () => setChallengeTab('quiz'));
    $('syTabLock').addEventListener('click', () => setChallengeTab('lock'));
    $('syTabMg').addEventListener('click', () => setChallengeTab('mg'));
    $('syLockHitBtn').addEventListener('click', handleLockHit);
    $('syCancelCh').addEventListener('click', closeSyModal);
    const loudBtn = $('syLoudBtn');
    if (loudBtn) {
      loudBtn.addEventListener('click', () => {
        closeSyModal();
        collectArtifact(cityId, true);
      });
    }
  }

  function setChallengeTab(tab) {
    if (!state || !state.heistContext) return;
    if (state.heistContext.activeTab === tab) return;
    state.heistContext.activeTab = tab;

    $('syTabQuiz').classList.toggle('active', tab === 'quiz');
    $('syTabLock').classList.toggle('active', tab === 'lock');
    $('syTabMg').classList.toggle('active', tab === 'mg');
    $('syPaneQuiz').classList.toggle('hidden', tab !== 'quiz');
    $('syPaneLock').classList.toggle('hidden', tab !== 'lock');
    $('syPaneMg').classList.toggle('hidden', tab !== 'mg');

    stopLockLoop();
    cleanupMountedMinigame();

    if (tab === 'lock') {
      startLockpick();
    } else if (tab === 'mg') {
      launchMainGameMinigame(state.heistContext.cityId);
    }
  }

  function renderQuizInModal(qObj, isPolice) {
    const opts = shuffle(qObj.options.map((text, i) => ({ text, ok: i === qObj.correct })));
    if (isPolice) {
      const rightTxt = opts.find(o => o.ok).text;
      const wrongTxt = opts.find(o => !o.ok).text;
      const others = state.police.filter(p => p.id !== state.selectedPoliceId);
      const t1 = Math.random() < 0.78 ? rightTxt : wrongTxt;
      const t2 = Math.random() < 0.55 ? rightTxt : wrongTxt;
      $('syRadioHint').innerHTML = `
        <div style="background:#e6f2fa;border-left:4px solid #0284c7;padding:7px 10px;border-radius:4px;margin-bottom:10px;font-size:12px;">
          <b>📻 POLISRADIO:</b><br>
          <b>${others[0].short}:</b> "Jag tror på <i>${escapeHtml(t1)}</i>!"<br>
          <b>${others[1].short}:</b> "Kan det inte vara <i>${escapeHtml(t2)}</i>?"
        </div>`;
    }
    $('syQuizQ').textContent = qObj.q;
    const box = $('syQuizOpts');
    box.innerHTML = '';
    opts.forEach(o => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sy-quiz-opt';
      b.textContent = o.text;
      b.addEventListener('click', () => {
        if (!state.heistContext || state.heistContext.answered) return;
        if (o.ok) {
          b.classList.add('right');
          $('syQuizFb').textContent = '✅ Rätt svar!';
          completeChallengeSuccess();
        } else {
          b.classList.add('wrong');
          b.disabled = true;
          registerMiss(state.heistContext.cityId, `Fel svar vid ${DATA().CITIES[state.heistContext.cityId].landmark.name}`, $('syQuizFb'));
        }
      });
      box.appendChild(b);
    });
  }

  function startLockpick() {
    stopLockLoop();
    lockState = { active: true, pos: 0.06, dir: 1, speed: 0.9, zoneStart: 0.34 + Math.random() * 0.25, zoneWidth: 0.22, hits: 0 };
    updateLockVisuals();
    if ($('syLockFb')) $('syLockFb').textContent = '';
    lockLastTs = performance.now();
    lockRafId = requestAnimationFrame(tickLock);
  }

  function tickLock(ts) {
    if (!lockState.active || !$('syLockNeedle')) {
      lockRafId = null;
      return;
    }
    const dt = Math.min(0.05, Math.max(0.001, (ts - lockLastTs) / 1000));
    lockLastTs = ts;
    lockState.pos += lockState.dir * lockState.speed * dt;
    if (lockState.pos >= 0.98) { lockState.pos = 0.98; lockState.dir = -1; }
    if (lockState.pos <= 0.02) { lockState.pos = 0.02; lockState.dir = 1; }
    $('syLockNeedle').style.left = `calc(${lockState.pos * 100}% - 3px)`;
    lockRafId = requestAnimationFrame(tickLock);
  }

  function updateLockVisuals() {
    if (!$('syLockZone')) return;
    $('syLockZone').style.left = `${lockState.zoneStart * 100}%`;
    $('syLockZone').style.width = `${lockState.zoneWidth * 100}%`;
    $('syLockPips').querySelectorAll('.sy-pip').forEach((el, i) => el.classList.toggle('lit', i < lockState.hits));
  }

  function handleLockHit() {
    if (!lockState.active || !state.heistContext) return;
    const hit = lockState.pos >= lockState.zoneStart && lockState.pos <= (lockState.zoneStart + lockState.zoneWidth);
    if (hit) {
      lockState.hits++;
      AUDIO().play('right1');
      if (lockState.hits >= 3) {
        stopLockLoop();
        updateLockVisuals();
        $('syLockFb').textContent = '🔓 Valvet öppet tyst!';
        completeChallengeSuccess();
      } else {
        lockState.speed += 0.24;
        lockState.zoneWidth = Math.max(0.14, lockState.zoneWidth - 0.03);
        lockState.zoneStart = 0.14 + Math.random() * (0.72 - lockState.zoneWidth);
        updateLockVisuals();
        $('syLockFb').textContent = `✅ Klick ${lockState.hits}/3!`;
      }
    } else {
      registerMiss(state.heistContext.cityId, 'Kassaskåpslarm', $('syLockFb'));
    }
  }

  function launchMainGameMinigame(cityId) {
    const mount = $('syMgMount');
    const fb = $('syMgFb');
    if (!mount || !fb) return;
    fb.textContent = '';
    if (!window.GT_MINIGAMES) {
      fb.textContent = 'Minispel ej tillgängligt — använd Frågekort eller Kassaskåp!';
      return;
    }
    const mySession = ++mgSessionId;
    const mgId = CITY_MG_ID[cityId] || 'passport';
    window.GT_MINIGAMES.start(mgId, mount, (res) => {
      // Ignorera föråldrade callbacks när spelaren bytte flik eller stängde modalen
      if (mySession !== mgSessionId || !active || !state || !state.heistContext || state.heistContext.answered) return;
      if (res && res.passed) {
        fb.textContent = `✅ ${res.summary || 'Avklarat!'}`;
        completeChallengeSuccess();
      } else {
        registerMiss(cityId, 'Misslyckat minispel', fb);
        mount.innerHTML = `<div style="text-align:center;padding:18px;">
          <p style="margin-bottom:12px;color:#f5ebd6;">${escapeHtml(res && res.summary ? res.summary : 'Minispelet avbröts.')}</p>
          <button type="button" class="sy-brass-btn gold" style="width:auto;margin:0 auto;" id="syMgRetryBtn">🔄 Försök igen</button>
        </div>`;
        const retry = $('syMgRetryBtn');
        if (retry) retry.addEventListener('click', () => launchMainGameMinigame(cityId));
      }
    });
  }

  function registerMiss(cityId, reason, fbEl) {
    AUDIO().play('wrong1');
    if (state.playerRole !== 'thief') {
      if (fbEl) fbEl.textContent = '❌ Miss! Försök igen medan klockan tickar...';
      return;
    }
    state.missesCount++;
    if (state.missesCount >= state.missLimit) {
      state.missesCount = 0;
      if (fbEl) fbEl.textContent = `🚨 LARM! (${state.missLimit}/${state.missLimit} missar) — Poliserna ser din stad!`;
      triggerThiefReveal(cityId, `${reason} (${state.missLimit} missar)`);
    } else {
      const left = state.missLimit - state.missesCount;
      if (fbEl) fbEl.textContent = `⚠️ Miss (${state.missesCount}/${state.missLimit})! ${left} kvar innan larmet går!`;
    }
    if ($('syModalMissCount')) {
      $('syModalMissCount').textContent = `Missar ${state.missesCount}/${state.missLimit}`;
    }
  }

  function completeChallengeSuccess() {
    if (!state || !state.heistContext || state.heistContext.answered) return;
    state.heistContext.answered = true;
    const { cityId, isPolice, isRealTarget } = state.heistContext;
    const myToken = matchToken;
    state.stats.solved++;
    AUDIO().play('right1');

    if (isPolice) {
      state.reconCooldownUntil[cityId] = state.elapsedSec + POLICE_RECON_COOLDOWN_SEC;
      if (!state.realTargets.includes(cityId) && !state.clearedSuspects.includes(cityId)) {
        state.clearedSuspects.push(cityId);
        addLog(`🔍 ${DATA().CITIES[cityId].name} avskriven som skenmål!`, 'police');
      }
      const pingCity = state.thief.travel ? state.thief.travel.to : state.thief.city;
      triggerThiefReveal(pingCity, `Spaningsgenombrott i ${DATA().CITIES[cityId].name}!`);
      setTimeout(() => {
        if (!active || !state || state.finished || matchToken !== myToken) return;
        closeSyModal();
      }, 750);
    } else if (isRealTarget) {
      setTimeout(() => {
        if (!active || !state || state.finished || matchToken !== myToken) return;
        closeSyModal();
        collectArtifact(cityId, false);
      }, 600);
    } else {
      state.thief.boostCooldownSec = 0;
      addLog(`🎭 Bonus i ${DATA().CITIES[cityId].name}: Sprint-boost fulladdad!`, 'good');
      setTimeout(() => {
        if (!active || !state || state.finished || matchToken !== myToken) return;
        closeSyModal();
      }, 650);
    }
  }

  function collectArtifact(cityId, loud) {
    if (state.collectedTargets.includes(cityId)) return;
    state.collectedTargets.push(cityId);
    const c = DATA().CITIES[cityId];
    AUDIO().play('fanfar');

    if (state.playerRole === 'thief') {
      addLog(`🏆 Stöldgods: ${c.landmark.icon} ${c.landmark.artifact} i ${c.name} (${state.collectedTargets.length}/3)!`, 'good');
    } else {
      addLog(`🚨 LARM! ${c.landmark.artifact} stals i ${c.name} (${state.collectedTargets.length}/3)!`, 'alert');
      triggerThiefReveal(cityId, `Stöldlarm vid ${c.landmark.name}`);
    }
    if (loud) triggerThiefReveal(cityId, `Snabbkupp vid ${c.landmark.name}!`);

    rebuildCityMarkers();
    if (state.viewMode === 'city') rebuildCityPois(state.focusedCityId);

    if (state.collectedTargets.length >= 3) {
      endGame(state.playerRole === 'thief', 'Tjuven lyckades stjäla alla 3 föremål innan tiden tog slut!');
    }
  }

  // --- Huvudloop (Kontinuerlig realtid) ---
  function gameLoop(ts) {
    if (!active || !state || state.finished) return;
    const dt = Math.min(0.1, (ts - lastFrameTs) / 1000);
    lastFrameTs = ts;

    state.elapsedSec += dt;
    const clk = formatClock(state.elapsedSec, state.secPerDay);

    if (state.elapsedSec >= TOTAL_DAYS * state.secPerDay) {
      endGame(state.playerRole === 'police', 'Tiden tog slut efter 10 dagar! Poliserna stoppade kuppen.');
      return;
    }

    REVEAL_DAYS.forEach(rd => {
      if (clk.day >= rd && !state.revealTriggered[rd]) {
        state.revealTriggered[rd] = true;
        const pc = state.thief.travel ? state.thief.travel.to : state.thief.city;
        triggerThiefReveal(pc, `Obligatorisk radarping Dag ${rd}`);
      }
    });

    // Resor
    const CITIES = DATA().CITIES;
    [state.thief, ...state.police].forEach(actor => {
      if (!actor.travel) return;
      if (state.elapsedSec >= actor.travel.startSec + actor.travel.durationSec) {
        const destId = actor.travel.to;
        actor.city = destId;
        actor.travel = null;
        actor.coords = actor.id === 'thief' ? [...CITIES[destId].hub.coords] : [...CITIES[destId].precinct.coords];
        actor.walkTarget = null;
        actor.pendingAction = null;
        actor.stuckTimer = 0;

        if (actor === getControlledActor()) {
          AUDIO().play('bell');
          addLog(`Framme i ${CITIES[destId].name}!`, 'good');
          rebuildCityMarkers();
          renderPanelState();
          if (state.playerRole === 'thief' && state.realTargets.includes(destId) && !state.collectedTargets.includes(destId)) {
            switchToView('city', destId);
          } else if (state.playerRole === 'police' && state.thief.city === destId && !state.thief.travel) {
            addLog(`🚨 KONTAKT! Tjuven är i ${CITIES[destId].name}! Zoomar in!`, 'alert');
            switchToView('city', destId);
          }
        } else {
          if (state.playerRole === 'police' && actor.id !== 'thief') {
            renderPanelState(); // Uppdatera polisflikarna även för icke-valda poliser
            if (!state.thief.travel && state.thief.city === destId) {
              addLog(`🚨 ${actor.short} har hittat tjuven i ${CITIES[destId].name}! Välj ${actor.short} för att jaga!`, 'alert');
              AUDIO().play('bell');
            }
          } else if (actor.id !== 'thief' && state.playerRole === 'thief' && destId === state.thief.city && !state.thief.travel) {
            addLog(`🚨 VARNING! ${actor.name} har landat i ${CITIES[destId].name}!`, 'alert');
            AUDIO().play('wrong1');
          }
        }
        updateRouteLines();
      }
    });

    updatePlayerMovement(dt);
    if (state.playerRole === 'thief') updateAiPolice(dt);
    else updateAiThief(dt);

    checkCapture();
    if (state.finished) return;

    syncActorMarkers();
    updateLiveHud(clk);
    rafId = requestAnimationFrame(gameLoop);
  }

  function updatePlayerMovement(dt) {
    if (state.viewMode !== 'city') return;
    if (!$('syModalLayer').classList.contains('hidden')) return;
    const actor = getControlledActor();
    if (!actor || actor.travel || actor.city !== state.focusedCityId) return;

    const speed = PLAYER_BASE_SPEED_MPS * (actor.id === 'thief' && state.elapsedSec < actor.boostUntilSec ? 1.7 : 1.0);
    let sx = 0, sy = 0;
    if (keysDown.has('w') || keysDown.has('arrowup')) sy += 1;
    if (keysDown.has('s') || keysDown.has('arrowdown')) sy -= 1;
    if (keysDown.has('a') || keysDown.has('arrowleft')) sx -= 1;
    if (keysDown.has('d') || keysDown.has('arrowright')) sx += 1;

    if (sx !== 0 || sy !== 0) {
      actor.walkTarget = null;
      actor.pendingAction = null;
      actor.stuckTimer = 0;
      const len = Math.hypot(sx, sy);
      // Rotera skärmriktningen efter kartans aktuella bearing (t.ex. -18°)
      const bearingRad = (map.getBearing() || 0) * Math.PI / 180;
      const nx = sx / len;
      const ny = sy / len;
      const dxM = (nx * Math.cos(bearingRad) + ny * Math.sin(bearingRad)) * speed * dt;
      const dyM = (-nx * Math.sin(bearingRad) + ny * Math.cos(bearingRad)) * speed * dt;
      actor.coords = tryStepOnStreet(actor.coords, dxM, dyM);
      map.jumpTo({ center: actor.coords });
    } else if (actor.walkTarget) {
      const dist = DATA().distanceMeters(actor.coords, actor.walkTarget);
      if (dist < 18 || (actor.pendingAction && dist <= INTERACT_DIST_M - 10)) {
        const act = actor.pendingAction;
        actor.walkTarget = null;
        actor.pendingAction = null;
        actor.stuckTimer = 0;
        if (act === 'landmark') openChallengeModal();
        else if (act === 'hub') openDepartureBoardModal();
      } else {
        const prev = actor.coords;
        const latRad = actor.coords[1] * Math.PI / 180;
        const dxM = (actor.walkTarget[0] - actor.coords[0]) * 111320 * Math.max(0.2, Math.cos(latRad));
        const dyM = (actor.walkTarget[1] - actor.coords[1]) * 111320;
        const len = Math.hypot(dxM, dyM) || 1;
        const step = Math.min(dist, speed * dt);
        actor.coords = tryStepOnStreet(actor.coords, (dxM / len) * step, (dyM / len) * step);
        const moved = DATA().distanceMeters(prev, actor.coords);
        if (moved < 0.8) {
          actor.stuckTimer = (actor.stuckTimer || 0) + dt;
          if (actor.stuckTimer > 0.7) {
            actor.walkTarget = null;
            actor.pendingAction = null;
            actor.stuckTimer = 0;
            addLog('🚧 Husblock i vägen — styr runt hörnet med WASD eller klicka på gatan runt kvarteret!', '');
          }
        } else {
          actor.stuckTimer = 0;
        }
        map.jumpTo({ center: actor.coords });
      }
    }
  }

  function updateAiPolice(dt) {
    const CITIES = DATA().CITIES;
    const pingCity = state.lastPing ? state.lastPing.cityId : null;
    state.police.forEach((p, idx) => {
      if (p.travel) return;
      if (!state.thief.travel && p.city === state.thief.city) {
        const latRad = p.coords[1] * Math.PI / 180;
        const dxM = (state.thief.coords[0] - p.coords[0]) * 111320 * Math.max(0.2, Math.cos(latRad));
        const dyM = (state.thief.coords[1] - p.coords[1]) * 111320;
        const len = Math.hypot(dxM, dyM) || 1;
        const step = Math.min(len, PLAYER_BASE_SPEED_MPS * 0.84 * dt);
        p.coords = tryStepOnStreet(p.coords, (dxM / len) * step, (dyM / len) * step);
        return;
      }

      p.aiCooldown -= dt;
      if (p.aiCooldown > 0) return;
      p.aiCooldown = 3.5 + Math.random() * 2.5;

      const others = state.suspectPool.filter(id => id !== p.city);
      const goal = (pingCity && idx < 2) ? pingCity : others[Math.floor(Math.random() * others.length)];
      if (goal && goal !== p.city) {
        const step = bfsNextStep(p.city, goal, true);
        if (step) {
          startTravel(p, step.to, step.mode);
          if (Math.random() < 0.65) {
            addLog(
              pingCity === goal
                ? `📻 ${p.short}: "Följer spåret mot ${CITIES[step.to].name}!"`
                : `📻 ${p.short}: "Kollar upp ${CITIES[step.to].name} härnäst."`,
              'police'
            );
          }
        }
      }
    });
  }

  function updateAiThief(dt) {
    const CITIES = DATA().CITIES;
    const th = state.thief;

    // Låt AI-tjuven kapa polisradion ibland för extra liv i Polischef-läget!
    state.aiRadioTauntTimer -= dt;
    if (state.aiRadioTauntTimer <= 0) {
      state.aiRadioTauntTimer = 32 + Math.random() * 24;
      const fakeCity = CITIES[state.suspectPool[Math.floor(Math.random() * state.suspectPool.length)]].name;
      const lines = [
        `🎙️ Tjuven (kapad radio): "Ni är helt fel ute — kaffe i ${fakeCity} var fantastiskt!"`,
        `🎙️ Tjuven (kapad radio): "Hör ni mig, kommissarie? Ni hinner aldrig!"`,
        `🎙️ Tjuven (kapad radio): "Snygg polisradio ni har... 😉"`
      ];
      addLog(lines[Math.floor(Math.random() * lines.length)], 'thief');
    }

    if (th.travel) return;
    const cur = CITIES[th.city];
    const policeHere = state.police.find(p => !p.travel && p.city === th.city);

    const walkTo = (targetCoords, mult) => {
      const latRad = th.coords[1] * Math.PI / 180;
      const dxM = (targetCoords[0] - th.coords[0]) * 111320 * Math.max(0.2, Math.cos(latRad));
      const dyM = (targetCoords[1] - th.coords[1]) * 111320;
      const len = Math.hypot(dxM, dyM) || 1;
      th.coords = tryStepOnStreet(th.coords, (dxM / len) * PLAYER_BASE_SPEED_MPS * mult * dt, (dyM / len) * PLAYER_BASE_SPEED_MPS * mult * dt);
    };

    if (policeHere) {
      walkTo(cur.hub.coords, 0.92);
      if (DATA().distanceMeters(th.coords, cur.hub.coords) < 75) {
        const opts = [...cur.trains.map(id => ({ id, mode: 'train' })), ...cur.flights.map(id => ({ id, mode: 'flight' }))];
        const safe = opts.filter(o => !state.police.some(p => p.city === o.id));
        const pick = (safe.length ? safe : opts)[Math.floor(Math.random() * (safe.length || opts.length))];
        if (pick) startTravel(th, pick.id, pick.mode);
      }
      return;
    }

    if (state.realTargets.includes(th.city) && !state.collectedTargets.includes(th.city)) {
      if (DATA().distanceMeters(th.coords, cur.landmark.coords) > 55) {
        walkTo(cur.landmark.coords, 0.85);
      } else {
        th.aiWorkTimer += dt;
        if (th.aiWorkTimer >= 8) {
          th.aiWorkTimer = 0;
          collectArtifact(th.city, false);
        }
      }
      return;
    }

    const nextGoal = state.realTargets.find(id => !state.collectedTargets.includes(id));
    if (!nextGoal) return;
    if (DATA().distanceMeters(th.coords, cur.hub.coords) > 65) {
      walkTo(cur.hub.coords, 0.9);
      return;
    }
    const step = bfsNextStep(th.city, nextGoal, Math.random() < 0.25) || bfsNextStep(th.city, nextGoal, true);
    if (step) startTravel(th, step.to, step.mode);
  }

  function checkCapture() {
    if (state.thief.travel) {
      $('syDangerVignette').classList.add('hidden');
      $('syChaseAlert').classList.add('hidden');
      return;
    }
    let minD = Infinity;
    let chaser = null;
    state.police.forEach(p => {
      if (p.travel || p.city !== state.thief.city) return;
      const d = DATA().distanceMeters(p.coords, state.thief.coords);
      if (d < minD) { minD = d; chaser = p; }
    });

    $('syDangerVignette').classList.toggle('hidden', !chaser);
    $('syChaseAlert').classList.toggle('hidden', !chaser);
    if (chaser) {
      $('syChaseMsg').textContent = state.playerRole === 'thief'
        ? '🚨 POLIS I STADEN! FLY TILL STATIONEN!'
        : `🚨 TJUVEN I ${DATA().CITIES[state.thief.city].name.toUpperCase()}! GRIP TJUVEN!`;
      $('syChaseDist').textContent = `(${Math.round(minD)} m)`;
      if (minD <= CAPTURE_DIST_M) {
        endGame(state.playerRole === 'police', `${chaser.name} grep tjuven på gatorna i ${DATA().CITIES[state.thief.city].name}!`);
      }
    }
  }

  // --- Uppdatera huvudspelets 90-tals HUD + sidopanel ---
  function renderPanelState() {
    if (!state) return;
    const CITIES = DATA().CITIES;
    const actor = getControlledActor();
    if (!actor) return;

    if (state.playerRole === 'police') {
      $('syPoliceTabs').innerHTML = state.police.map(p => `
        <button type="button" class="sy-police-tab ${p.id === state.selectedPoliceId ? 'active' : ''}" data-pid="${p.id}">
          🚓 ${p.short}<small>${p.travel ? '→ ' + CITIES[p.travel.to].name : CITIES[p.city].name}</small>
        </button>
      `).join('');
      $('syPoliceTabs').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        state.selectedPoliceId = b.getAttribute('data-pid');
        const p = getControlledActor();
        if (state.viewMode === 'city' && p && !p.travel) switchToView('city', p.city);
        else renderPanelState();
      }));
    }
  }

  function updateLiveHud(clk) {
    const CITIES = DATA().CITIES;
    const actor = getControlledActor();
    if (!actor) return;
    const c = CITIES[actor.city];

    if ($('cityName')) $('cityName').textContent = actor.travel ? `${CITIES[actor.travel.from].name} → ${CITIES[actor.travel.to].name}` : c.name;
    if ($('cityRegion')) $('cityRegion').textContent = actor.travel
      ? (actor.travel.mode === 'flight' ? 'DIREKTFLYG · AVSLÖJAD' : 'TÅG / BÅT · OSYNLIG')
      : `${c.country} · ${state.viewMode === 'city' ? '3D-STAD' : '3D-GLOB'}`;

    if ($('hudDay')) $('hudDay').innerHTML = `<span class="cal-top">DAG</span><span class="cal-num"><b>${clk.day}</b>/${TOTAL_DAYS}</span>`;
    if ($('hudTime')) $('hudTime').innerHTML = `<span class="watch-label">REALTID</span><span class="watch-digits"><b>${clk.hh}:${clk.mm}</b></span>`;
    if ($('hudCash')) $('hudCash').innerHTML = `<div class="wallet-card-css" aria-hidden="true"><span>SY</span></div><div class="wallet-text"><span class="wallet-amount"><b>${state.collectedTargets.length} / 3</b></span></div>`;
    if ($('dockStampCount')) $('dockStampCount').textContent = `${state.collectedTargets.length}/3`;
    if ($('dockGlobeDist')) $('dockGlobeDist').textContent = state.viewMode === 'city' ? 'GLOB' : '3D-STAD';
    if ($('dockBackpackCount')) $('dockBackpackCount').textContent = 'RES';

    const nextPing = REVEAL_DAYS.find(d => !state.revealTriggered[d]);
    $('syNextPingTxt').textContent = nextPing ? `📡 Ping: Dag ${nextPing} · 00:00` : '📡 Alla pings gjorda';
    $('syMissStrip').textContent = `Missar: ${state.missesCount}/${state.missLimit}`;

    const pill = $('syStealthPill');
    const exposed = state.lastPing && state.lastPing.cityId === state.thief.city && !state.thief.travel;
    pill.textContent = state.playerRole === 'thief' ? (exposed ? 'AVSLÖJAD' : 'DOLD') : actor.short.toUpperCase();
    pill.className = 'sy-stealth-pill' + (state.playerRole === 'thief' && exposed ? ' exposed' : '');

    const traveling = Boolean(actor.travel);
    $('syTravelCard').classList.toggle('hidden', !traveling);
    $('syActionButtons').classList.toggle('hidden', traveling);
    if (traveling) {
      const el = state.elapsedSec - actor.travel.startSec;
      const p = Math.min(1, el / actor.travel.durationSec);
      $('syTravelLabel').textContent = `${actor.travel.mode === 'flight' ? '✈️ Flyg' : '🚂 Tåg/Båt'} → ${CITIES[actor.travel.to].name}`;
      $('syTravelFill').style.width = `${p * 100}%`;
      $('syTravelEta').textContent = `${Math.max(0, Math.ceil(actor.travel.durationSec - el))} s kvar`;
    } else {
      const dLm = Math.round(DATA().distanceMeters(actor.coords, c.landmark.coords));
      const dHub = Math.round(DATA().distanceMeters(actor.coords, c.hub.coords));
      const isTarget = state.realTargets.includes(actor.city) && !state.collectedTargets.includes(actor.city);

      $('syBtnLandmarkDist').textContent = `${dLm} m`;
      $('syBtnHubDist').textContent = `${dHub} m`;
      $('syBtnLandmarkTxt').textContent = dLm <= INTERACT_DIST_M
        ? (state.playerRole === 'police' ? '🔍 Spaning / Minispel nu' : isTarget ? `🔓 Stjäl ${c.landmark.artifact}` : '🎮 Frågekort / Minispel')
        : `🏃 ${c.landmark.name}`;
      $('syBtnDeparturesTxt').textContent = (dHub <= INTERACT_DIST_M || (state.playerRole === 'police' && state.viewMode === 'globe'))
        ? '✈️ Öppna Klappertavla (Res)'
        : `🚉 Spring till ${c.hub.name}`;

      if (state.playerRole === 'thief') {
        const sb = $('syBtnSprint');
        if (state.elapsedSec < actor.boostUntilSec) {
          sb.disabled = true;
          $('syBtnSprintTxt').textContent = `⚡ Sprint aktiv (${Math.ceil(actor.boostUntilSec - state.elapsedSec)}s)`;
        } else if (state.elapsedSec < actor.boostCooldownSec) {
          sb.disabled = true;
          $('syBtnSprintTxt').textContent = `⚡ Sprint laddar (${Math.ceil(actor.boostCooldownSec - state.elapsedSec)}s)`;
        } else {
          sb.disabled = false;
          $('syBtnSprintTxt').textContent = '⚡ Sprint-boost (Avslöjar dig)';
        }
      }
    }
  }

  function endGame(won, summary) {
    if (!state || state.finished) return;
    state.finished = true;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    stopLockLoop();
    cleanupMountedMinigame();
    $('syDangerVignette').classList.add('hidden');
    AUDIO().play(won ? 'fanfar' : 'wrong1');
    const clk = formatClock(state.elapsedSec, state.secPerDay);

    showSyModal(`
      <div class="sy-card-90s" style="text-align:center;">
        <div style="font-size:48px;margin-bottom:6px;">${won ? '🏆' : '🚨'}</div>
        <h2>${won ? 'Seger!' : 'Spelet är över!'}</h2>
        <p class="sy-card-sub">${escapeHtml(summary)}</p>
        <div class="sy-choice-grid cols-3">
          <div class="sy-choice-card"><b>Dag ${clk.day}</b><span>Tid: ${clk.hh}:${clk.mm}</span></div>
          <div class="sy-choice-card"><b>${state.collectedTargets.length} / 3</b><span>Föremål stulna</span></div>
          <div class="sy-choice-card"><b>${state.stats.solved}</b><span>Utmaningar lösta</span></div>
        </div>
        <div class="sy-modal-actions" style="justify-content:center;">
          <button type="button" class="sy-brass-btn gold" style="width:auto;padding:11px 22px;" id="syAgainBtn">🔄 Spela igen</button>
          <button type="button" class="sy-brass-btn" style="width:auto;" id="syExitBtn">🏠 Till startskärmen</button>
        </div>
      </div>
    `);
    $('syAgainBtn').addEventListener('click', openSetup);
    $('syExitBtn').addEventListener('click', exit);
  }

  function openMenu() {
    if (!active) return;
    AUDIO().play('klick');
    showSyModal(`
      <div class="sy-card-90s" style="max-width:440px;">
        <h2>☰ Scotland Yard — Meny</h2>
        <div class="sy-btn-stack" style="margin-top:12px;">
          <button type="button" class="sy-brass-btn gold" id="syMResume">▶ Fortsätt jakten</button>
          <button type="button" class="sy-brass-btn" id="syMPass">🛂 Öppna Uppdragspass</button>
          <button type="button" class="sy-brass-btn" id="syMDep">🚉 Till stationen / Avgångar</button>
          <button type="button" class="sy-brass-btn" id="syMRestart">🔄 Ny match / Ändra inställningar</button>
          <button type="button" class="sy-brass-btn" id="syMSound">🔊 Ljud på/av</button>
          <button type="button" class="sy-brass-btn red" id="syMExit">🏠 Avsluta till huvudmenyn</button>
        </div>
      </div>
    `);
    $('syMResume').addEventListener('click', closeSyModal);
    $('syMPass').addEventListener('click', openPassportModal);
    $('syMDep').addEventListener('click', () => { closeSyModal(); triggerHubAction(); });
    $('syMRestart').addEventListener('click', openSetup);
    $('syMSound').addEventListener('click', () => { AUDIO().toggle && AUDIO().toggle(); closeSyModal(); });
    $('syMExit').addEventListener('click', exit);
  }

  return {
    isActive: () => active,
    openSetup,
    exit,
    toggleView,
    openPassportModal,
    openDepartureBoardModal: triggerHubAction,
    openMenu
  };
})();
