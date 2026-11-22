// Globetrotter — Spelmotor och UI-logik för vertikal slice (BackPacker-estetik)

(function () {
  'use strict';

  const W = window.GT_WORLD;
  if (!W) {
    console.error('GT_WORLD saknas!');
    return;
  }

  // --- 100 % egen Web Audio-ljudmotor (mysiga 90-tals-ljud & foley — noll upphovsrättsskyddade ljudfiler!) ---
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
            // Klar mässings-receptionsklocka med harmoniska övertoner
            this.tone(1318, 0, 0.75, 'sine', 0.14);
            this.tone(2637, 0, 0.55, 'sine', 0.07);
            this.tone(3951, 0, 0.30, 'sine', 0.04);
            break;
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

  // --- Egna unika bläckstämplar för passet (100 % egen design med IATA-kod, land & sliten bläckstil) ---
  const CITY_STAMP_META = {
    malmo:        { code: 'MMX', color: '#8f2424', shape: 'oval',  rot: 4 },
    stockholm:    { code: 'ARN', color: '#1b4f8c', shape: 'round', rot: -6 },
    kairo:        { code: 'CAI', color: '#8f2424', shape: 'oval',  rot: 5 },
    delhi:        { code: 'DEL', color: '#9c4a12', shape: 'rect',  rot: -4 },
    tokyo:        { code: 'HND', color: '#a11b2d', shape: 'round', rot: 7 },
    sanfrancisco: { code: 'SFO', color: '#1e5b46', shape: 'rect',  rot: -5 },
    newyork:      { code: 'JFK', color: '#1d3c78', shape: 'oval',  rot: 4 },
    paris:        { code: 'CDG', color: '#273c75', shape: 'oval',  rot: -7 },
    rom:          { code: 'FCO', color: '#8c2323', shape: 'round', rot: 6 },
    london:       { code: 'LHR', color: '#203f6e', shape: 'rect',  rot: -3 },
    istanbul:     { code: 'IST', color: '#8c1d40', shape: 'oval',  rot: 5 },
    bangkok:      { code: 'BKK', color: '#5c2d82', shape: 'round', rot: -6 },
    peking:       { code: 'PEK', color: '#a11b1b', shape: 'rect',  rot: 4 },
    sydney:       { code: 'SYD', color: '#16635b', shape: 'oval',  rot: -5 },
    kapstaden:    { code: 'CPT', color: '#246636', shape: 'round', rot: 6 },
    rio:          { code: 'GIG', color: '#1e6b3a', shape: 'oval',  rot: -4 },
    mexicocity:   { code: 'MEX', color: '#8f2c1b', shape: 'rect',  rot: 5 }
  };

  // Enhetlig 90-tals symbolknapp för att stänga / lämna en vy (utan överflödig text)
  function exitIconBtn(tooltip = 'Tillbaka') {
    return `<button class="bp-icon-close-btn" onclick="window.GT.closeModal()" title="${tooltip}" aria-label="${tooltip}">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    </button>`;
  }

  function renderCityStampHtml(cityKey, large = false) {
    const c = W.cities[cityKey] || { name: cityKey, country: '' };
    const m = CITY_STAMP_META[cityKey] || { code: cityKey.slice(0, 3).toUpperCase(), color: '#7a2222', shape: 'round', rot: -5 };
    return `
      <div class="ink-stamp shape-${m.shape} ${large ? 'large' : ''}" style="--stamp-color:${m.color}; transform:rotate(${m.rot}deg);">
        <div class="ink-stamp-inner">
          <div class="ink-stamp-top">★ ${m.code} ★</div>
          <div class="ink-stamp-city">${c.name.toUpperCase()}</div>
          <div class="ink-stamp-sub">${(c.country || '').toUpperCase()}</div>
        </div>
      </div>
    `;
  }

  // --- Geometri & Avstånd ---
  function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }
  const haversineKm = calcDistance;

  function getDistanceBetweenCities(cityKeyA, cityKeyB) {
    const cA = W.cities[cityKeyA];
    const cB = W.cities[cityKeyB];
    if (!cA || !cB) return 0;
    return calcDistance(cA.lat, cA.lon, cB.lat, cB.lon);
  }

  // Avståndspris för souvenirer:
  // - I ursprungsstaden: lokalt andrahandsvärde (55 %) för att förhindra köp-sälj-loopar.
  // - Utomlands: grundpris × (1 + 0.15 × tusen km), max 3.0x.
  function calcSouvenirValue(souvenirKey, currentCityKey) {
    const s = W.souvenirs[souvenirKey];
    if (!s) return { price: 0, dist: 0, factor: 1, isLocal: false };
    const originCityKey = s.origin;
    if (originCityKey === currentCityKey) {
      return {
        price: Math.max(10, Math.round(s.price * 0.55)),
        dist: 0,
        factor: 0.55,
        isLocal: true
      };
    }
    let dist = 0;
    if (W.cities[originCityKey] && W.cities[currentCityKey]) {
      dist = getDistanceBetweenCities(originCityKey, currentCityKey);
    }
    const factor = Math.min(3.0, 1 + 0.15 * (dist / 1000));
    return {
      price: Math.round(s.price * factor),
      dist,
      factor,
      isLocal: false
    };
  }

  // --- Speltillstånd ---
  const state = {
    city: W.startCity,
    day: 1,
    hour: 8, // 08:00 till 24:00 (16 speltimmar/dygn)
    cash: W.startCash,
    backpack: [], // Array av { id, name, origin, buyPrice, buyDay, uses }
    donePlaces: new Set(),
    doneWonders: new Set(),
    visitedCities: new Set([W.startCity]),
    stamps: [], // Städer som är officiellt "gjorda"
    travelHistory: [], // Array av { from, to, dist, isBoat } som ritar den röda linjen på globen
    questionsTotal: 0,
    questionsCorrect: 0,
    dayLog: {
      activities: [],
      moneyStart: W.startCash
    },
    deals: { kairo: 20 }, // Starta med ett sista-minuten-fynd så spelaren direkt ser REA-lappen!
    journal: [
      { day: 1, text: `Avresa från ${W.cities[W.startCity]?.name || 'Malmö'} med nystämplat pass, tom ryggsäck och 10 000 kr i reskassan.` }
    ],
    haggleState: {}, // { "city_day_item": { price, mood, locked } }
    completedRelays: new Set(),
    freeHotelCities: new Set(),
    playerFirstName: 'RESENÄR',
    playerLastName: 'GLOBETROTTER',
    signatureDoneToday: {}, // { "city_day": true }
    jobsDoneToday: {}, // { "city_day_jobIdx": true }
    usedQuestionIds: new Set(), // Så samma fråga aldrig kommer två gånger under en resa!
    departureBoard: null, // { city, day, flights: [{ to, flightNo, standby, status }] } (BP1/BP2 daglig klappertavla)
    competencies: [], // Array av { key, title, city } — yrkeskompetenser intjänade med godkänt jobbprov (BP1-krav)
    goals: null, // { requiredRegions: 3, requiredCompetencies: 3, souvenirCities: [cityKey1, cityKey2, cityKey3] }
    discoveredPlaces: new Set(), // Avslöjade sevärdheter på stadskartan (BP2-utforskningskänsla!)
    backpackLevel: 1, // 1 = 5 platser, 2 = 7 platser, 3 = 9 platser
    mailedHome: [] // Array av { id, name, origin, mailedDay } — souvenirer postade hem till Stockholm!
  };

  const BACKPACK_TIERS = [
    { level: 1, slots: 5, name: 'Klassisk 45L-ryggsäck', price: 0, desc: 'Pålitlig startryggsäck med 5 packplatser.' },
    { level: 2, slots: 7, name: 'Expeditionsryggsäck 65L', price: 1400, desc: 'Rymligare vandringsryggsäck med 7 packplatser.' },
    { level: 3, slots: 9, name: 'Globetrotter-ramryggsäck 85L', price: 2800, desc: 'Fullutrustad proffsryggsäck med sidofickor och hela 9 platser!' }
  ];

  function getMaxBackpackSlots() {
    const tier = BACKPACK_TIERS.find(t => t.level === (state.backpackLevel || 1)) || BACKPACK_TIERS[0];
    return tier.slots;
  }

  function hasGoalSouvenirFrom(cityKey) {
    const inPack = state.backpack.find(it => it.kind !== 'kurir' && it.origin === cityKey);
    if (inPack) return { item: inPack, mailed: false };
    const mailed = (state.mailedHome || []).find(it => it.origin === cityKey);
    if (mailed) return { item: mailed, mailed: true };
    return null;
  }

  // Slumpar fram resans obligatoriska mål (BackPacker 1-stil):
  // 3 olika utländska resmål från spridda världsdelar för souvenirer + 3 yrkeskompetenser.
  function generateJourneyGoals() {
    const foreignKeys = Object.keys(W.cities).filter(k => k !== W.startCity && (W.cities[k].souvenirs || []).length > 0);
    const byRegion = {};
    foreignKeys.forEach(k => {
      const reg = W.cities[k].region || 'Världen';
      if (!byRegion[reg]) byRegion[reg] = [];
      byRegion[reg].push(k);
    });
    const regions = Object.keys(byRegion).sort(() => Math.random() - 0.5);
    const picked = [];
    for (const reg of regions) {
      if (picked.length >= 3) break;
      const list = byRegion[reg];
      picked.push(list[Math.floor(Math.random() * list.length)]);
    }
    const rest = foreignKeys.filter(k => !picked.includes(k)).sort(() => Math.random() - 0.5);
    while (picked.length < 3 && rest.length > 0) {
      picked.push(rest.pop());
    }
    return {
      requiredRegions: 3,
      requiredCompetencies: 3,
      souvenirCities: picked
    };
  }

  function ensureJourneyGoals() {
    if (!state.goals || !Array.isArray(state.goals.souvenirCities) || state.goals.souvenirCities.length < 3) {
      state.goals = generateJourneyGoals();
    }
    if (!Array.isArray(state.competencies)) {
      state.competencies = [];
    }
    return state.goals;
  }
  ensureJourneyGoals();

  // Förbereder mässingsmätaren så svaret inte alltid ligger nära mitten:
  // slumpförskjuter skalan [min, max] så rätt svar hamnar på en oförutsägbar position (10–90 %),
  // och startar alltid reglaget vid vänsterkanten så spelaren måste dra det själv.
  function prepareNumericGauge(q) {
    const step = q.step || 1;
    const baseSpan = Math.max(step * 4, q.max - q.min);
    const stepsCount = Math.max(4, Math.round(baseSpan / step));
    const span = stepsCount * step;

    // Slumpa var på skalan rätt svar hamnar (8 % – 92 %)
    const targetFrac = 0.08 + Math.random() * 0.84;
    let effMin = Math.round((q.ans - targetFrac * span) / step) * step;
    if (q.min >= 0 && effMin < 0) effMin = 0;
    let effMax = effMin + span;

    // Låt inte årtalsfrågor glida in i framtiden
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

  // Bedömer drag-svar utifrån skalans faktiska spann (inte q.ans, som gjorde hela skalan rätt på årtal!)
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

  // Hämta frågor från den centrala frågebanken (window.GT_QUESTIONS) med fall-back till inline
  function getQuestionsFor(cityKey, placeKey, fallbackList = []) {
    const bank = window.GT_QUESTIONS || [];
    const matching = bank.filter(q => q.place === placeKey && (!cityKey || q.city === cityKey));
    const pool = matching.length > 0 ? matching : fallbackList;

    // Prioritera obesvarade frågor och välj ett varierat set (max 3 per sevärdhet, 4 per jobb)
    const unused = pool.filter(q => !q.id || !state.usedQuestionIds.has(q.id));
    const source = unused.length > 0 ? unused : pool;
    const maxCount = placeKey === 'job' ? 4 : 3;
    const picked = source.slice().sort(() => Math.random() - 0.5).slice(0, maxCount);
    return picked.map(q => ({ ...q, t: q.type || q.t }));
  }

  const SAVE_KEY = 'gt_save_v1';
  let gameSessionStarted = false;

  function saveGame() {
    if (!gameSessionStarted) return;
    try {
      const payload = {
        city: state.city,
        day: state.day,
        hour: state.hour,
        cash: state.cash,
        backpack: state.backpack,
        donePlaces: Array.from(state.donePlaces),
        doneWonders: Array.from(state.doneWonders),
        visitedCities: Array.from(state.visitedCities),
        stamps: state.stamps,
        travelHistory: state.travelHistory,
        questionsTotal: state.questionsTotal,
        questionsCorrect: state.questionsCorrect,
        dayLog: state.dayLog,
        deals: state.deals,
        journal: state.journal,
        completedRelays: Array.from(state.completedRelays),
        freeHotelCities: Array.from(state.freeHotelCities),
        playerFirstName: state.playerFirstName,
        playerLastName: state.playerLastName,
        signatureDoneToday: state.signatureDoneToday,
        jobsDoneToday: state.jobsDoneToday,
        usedQuestionIds: Array.from(state.usedQuestionIds),
        departureBoard: state.departureBoard,
        competencies: state.competencies,
        goals: state.goals,
        discoveredPlaces: Array.from(state.discoveredPlaces),
        backpackLevel: state.backpackLevel,
        mailedHome: state.mailedHome
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch (e) {}
  }

  function getSavedSummary() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || !d.city || !W.cities[d.city]) return null;
      return d;
    } catch (e) { return null; }
  }

  function loadSavedGame() {
    const d = getSavedSummary();
    if (!d) return false;
    state.city = d.city;
    state.day = d.day || 1;
    state.hour = d.hour || 8;
    state.cash = d.cash !== undefined ? d.cash : W.startCash;
    state.backpack = Array.isArray(d.backpack) ? d.backpack : [];
    state.donePlaces = new Set(d.donePlaces || []);
    state.doneWonders = new Set(d.doneWonders || []);
    state.visitedCities = new Set(d.visitedCities || [W.startCity]);
    state.stamps = Array.isArray(d.stamps) ? d.stamps : [];
    state.travelHistory = Array.isArray(d.travelHistory) ? d.travelHistory : [];
    state.questionsTotal = d.questionsTotal || 0;
    state.questionsCorrect = d.questionsCorrect || 0;
    state.dayLog = d.dayLog || { activities: [], moneyStart: state.cash };
    state.deals = d.deals || {};
    state.journal = Array.isArray(d.journal) && d.journal.length ? d.journal : state.journal;
    state.completedRelays = new Set(d.completedRelays || []);
    state.freeHotelCities = new Set(d.freeHotelCities || []);
    state.playerFirstName = d.playerFirstName || 'RESENÄR';
    state.playerLastName = d.playerLastName || 'GLOBETROTTER';
    state.signatureDoneToday = d.signatureDoneToday || {};
    state.jobsDoneToday = d.jobsDoneToday || {};
    state.usedQuestionIds = new Set(d.usedQuestionIds || []);
    state.departureBoard = d.departureBoard || null;
    state.competencies = Array.isArray(d.competencies) ? d.competencies : [];
    state.goals = d.goals || null;
    state.discoveredPlaces = new Set(d.discoveredPlaces || []);
    state.backpackLevel = d.backpackLevel || 1;
    state.mailedHome = Array.isArray(d.mailedHome) ? d.mailedHome : [];
    ensureJourneyGoals();
    return true;
  }

  function addJournal(text) {
    state.journal.push({ day: state.day, text });
  }

  function getActiveWorldEvents() {
    return (W.worldEvents || []).filter(ev => state.day >= ev.startDay && state.day <= ev.endDay);
  }

  function getCityEvent(cityKey) {
    return getActiveWorldEvents().find(ev => ev.city === cityKey) || null;
  }

  const TEASERS = [
    "I morgon: Ryktet på basaren säger att kryddor från Orienten betingar rekordpriser i Amerika!",
    "I morgon: Vackert väder väntas. Perfekt läge för en expedition till ett av antikens underverk!",
    "I morgon: Nya avgångar anslås på flygplatsen med chans till förmånliga sista-minuten-priser.",
    "I morgon: Lokala arbetsgivare söker nyfikna globetrotters med god allmänbildning.",
    "I morgon: Slå upp 3D-jordgloben — tillfälliga festivaler och händelser runt världen kan ge stor bonus!"
  ];

  // --- DOM-element ---
  const el = {
    stage: document.getElementById('stage'),
    mapLayer: document.getElementById('mapLayer'),
    photoLayer: document.getElementById('photoLayer'),
    timeLightLayer: document.getElementById('timeLightLayer'),
    cityName: document.getElementById('cityName'),
    cityRegion: document.getElementById('cityRegion'),
    cityEventRibbon: document.getElementById('cityEventRibbon'),
    hudDay: document.getElementById('hudDay'),
    hudTime: document.getElementById('hudTime'),
    hudCash: document.getElementById('hudCash'),
    dockBackpackCount: document.getElementById('dockBackpackCount'),
    dockStampCount: document.getElementById('dockStampCount'),
    dockGlobeDist: document.getElementById('dockGlobeDist'),
    dockGlobeEventDot: document.getElementById('dockGlobeEventDot'),
    spotsContainer: document.getElementById('spotsContainer'),
    toast: document.getElementById('toastNotice'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalContent: document.getElementById('modalContent'),
    btnSound: document.getElementById('btnSound'),
    travelCinematic: document.getElementById('travelCinematic'),
    travelVideo: document.getElementById('travelVideo'),
    travelTitle: document.getElementById('travelTitle'),
    travelSub: document.getElementById('travelSub'),
    travelSkipBtn: document.getElementById('travelSkipBtn')
  };

  function showToast(msg, duration = 2200) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    setTimeout(() => {
      el.toast.classList.remove('show');
    }, duration);
  }

  function addHours(h) {
    state.hour += h;
    if (state.hour >= 24) {
      showToast("Klockan har blivit sen! Ta in på hotellet för natten.", 3000);
      AudioMgr.play('time');
    }
    updateHUD();
  }

  function changeCash(delta, reason = '') {
    state.cash += delta;
    if (delta > 0) {
      AudioMgr.play('cash_in');
    } else if (delta < 0) {
      AudioMgr.play('cash_out');
    }
    if (reason) {
      state.dayLog.activities.push(`${reason} (${delta >= 0 ? '+' : ''}${delta} kr)`);
    }
    updateHUD();
  }

  function hasItem(itemId) {
    return state.backpack.some(item => item.id === itemId);
  }

  // Kontrollera om staden blev gjord (visas INTE på meny i förväg – belönas med stämpel!)
  function checkCityCompletion() {
    const current = W.cities[state.city];
    if (!current) return;
    const allDone = current.highlights.every(h => state.donePlaces.has(h));
    if (allDone && !state.stamps.includes(state.city)) {
      state.stamps.push(state.city);
      triggerStampCelebration(current);
    }
  }

  function triggerStampCelebration(city) {
    AudioMgr.play('stamp');
    AudioMgr.play('fanfar');
    const cityKey = Object.keys(W.cities).find(k => W.cities[k] === city) || state.city;

    const html = `
      <div class="card-modal" style="text-align:center;">
        <div class="stamp-celebration">
          <h2 style="font-family:Georgia,serif; color:#7a4f12; margin:0;">STÄMPEL I PASSET!</h2>
          <div style="margin:12px auto;">${renderCityStampHtml(cityKey, true)}</div>
          <p style="font-size:16px; font-weight:600; color:#2f7d43; margin:0;">
            Du har gjort alla höjdpunkter i ${city.name}!
          </p>
          <p style="font-size:13px; color:#5b3b1c; max-width:440px;">
            Staden räknas nu som officiellt gjord. Stämpeln har förts in i ditt officiella pass.
          </p>
          <div class="modal-footer" style="justify-content:center; margin-top:8px;">
            <button class="btn-primary" onclick="window.GT.closeModal()">Fortsätt resan</button>
          </div>
        </div>
      </div>
    `;
    showModal(html);
    updateHUD();
  }

  function updateHUD() {
    const h = Math.min(24, state.hour);
    const timeFormatted = `${String(h).padStart(2, '0')}:00`;
    let timeOfDay = 'Morgon';
    let lightClass = 'morning';
    if (h >= 11 && h < 15) { timeOfDay = 'Dag'; lightClass = 'day'; }
    else if (h >= 15 && h < 18) { timeOfDay = 'Eftermiddag'; lightClass = 'afternoon'; }
    else if (h >= 18 && h < 21) { timeOfDay = 'Kväll'; lightClass = 'evening'; }
    else if (h >= 21) { timeOfDay = 'Sen kväll'; lightClass = 'night'; }

    // Dygnsljus över stadsvyn
    if (el.timeLightLayer) {
      el.timeLightLayer.className = `layer time-light ${lightClass}`;
    }

    // Taktila 90-tals reseinstrument
    el.hudDay.innerHTML = `<span class="cal-top">DAG</span><span class="cal-num"><b>${state.day}</b>/${W.dayLimit}</span>`;
    el.hudTime.innerHTML = `<span class="watch-label">${timeOfDay}</span><span class="watch-digits"><b>${timeFormatted}</b></span>`;
    el.hudCash.innerHTML = `
      <div class="wallet-card-css" aria-hidden="true"><span>GT</span></div>
      <div class="wallet-text">
        <span class="wallet-amount"><b>${state.cash.toLocaleString('sv-SE')} kr</b></span>
      </div>
    `;

    // Varmt kvällssken på hotellmedaljongen efter 18:00
    const hotelSpotEl = document.querySelector('.spot.service.hotel');
    if (hotelSpotEl) {
      hotelSpotEl.classList.toggle('hotel-evening-glow', h >= 18);
    }

    // Dock-brickor nere i hörnet
    el.dockBackpackCount.textContent = `${state.backpack.length}/${getMaxBackpackSlots()}`;
    el.dockStampCount.textContent = `${state.stamps.length} st`;

    const totalDist = state.travelHistory.reduce((sum, leg) => sum + (leg.dist || 0), 0);
    if (el.dockGlobeDist) {
      el.dockGlobeDist.textContent = `${totalDist.toLocaleString('sv-SE')} km`;
    }

    // Indikator på 3D-jordgloben när aktiva världshändelser pågår
    const activeEvents = getActiveWorldEvents();
    if (el.dockGlobeEventDot) {
      el.dockGlobeEventDot.classList.toggle('hidden', activeEvents.length === 0);
    }

    // Event-remsa på stadsskylten om något pågår just i denna stad
    const cityEv = getCityEvent(state.city);
    if (el.cityEventRibbon) {
      if (cityEv) {
        el.cityEventRibbon.textContent = `PÅGÅR NU: ${cityEv.title} — ${cityEv.effectText}`;
        el.cityEventRibbon.classList.remove('hidden');
      } else {
        el.cityEventRibbon.classList.add('hidden');
      }
    }

    // Automatisk sparning i webbläsaren
    saveGame();
  }

  function renderCity() {
    const city = W.cities[state.city];
    if (!city) return;

    state.visitedCities.add(state.city);

    // Byt bakgrundsmontage
    el.mapLayer.style.backgroundImage = `url(${city.map || 'assets/maps/map1914a.jpg'})`;
    el.photoLayer.style.backgroundImage = `url(${city.skyline || 'assets/skylines/skyline.jpg'})`;

    // Titlar
    el.cityName.textContent = city.name;
    el.cityRegion.textContent = `${city.country} · ${city.region.toUpperCase()}`;

    // Unik landstypisk stil på stadsskylten uppe till vänster!
    const badgeEl = document.querySelector('.city-badge');
    if (badgeEl) {
      const themeMap = {
        malmo: 'theme-se', stockholm: 'theme-se', kairo: 'theme-eg', delhi: 'theme-in',
        tokyo: 'theme-jp', sanfrancisco: 'theme-us', newyork: 'theme-us', paris: 'theme-fr',
        rom: 'theme-it', london: 'theme-gb', istanbul: 'theme-tr', bangkok: 'theme-th',
        peking: 'theme-cn', sydney: 'theme-au', kapstaden: 'theme-za', rio: 'theme-br',
        mexicocity: 'theme-mx'
      };
      badgeEl.className = `city-badge ${themeMap[state.city] || 'theme-se'}`;
    }

    // Bygg BackPacker-kartikoner på scenen
    renderCitySpots(city);
    updateHUD();
  }

  // Skapa interaktiv kartspot på scenen
  function createSpot(left, top, className, badgeContent, labelContent, onClick) {
    const spot = document.createElement('div');
    spot.className = `spot ${className}`;
    spot.style.left = `${left}%`;
    spot.style.top = `${top}%`;
    spot.innerHTML = `
      ${badgeContent}
      <div class="spot-label">${labelContent}</div>
    `;
    spot.onclick = (e) => {
      e.stopPropagation();
      AudioMgr.play('klick');
      onClick();
    };
    return spot;
  }

  // Regionala hotellfoton (fria Wikimedia Commons-foton) så varje del av världen har sin egen hotellkänsla
  const CITY_HOTEL_PHOTO = {
    malmo:        'assets/photos/hotel_lobby.jpg',
    stockholm:    'assets/photos/hotel_lobby.jpg',
    paris:        'assets/photos/hotels/hotel_paris.jpg',
    rom:          'assets/photos/hotels/hotel_paris.jpg',
    london:       'assets/photos/hotels/hotel_paris.jpg',
    kairo:        'assets/photos/hotels/hotel_orient.jpg',
    istanbul:     'assets/photos/hotels/hotel_orient.jpg',
    delhi:        'assets/photos/hotels/hotel_india.jpg',
    tokyo:        'assets/photos/hotels/hotel_ryokan.jpg',
    peking:       'assets/photos/hotels/hotel_ryokan.jpg',
    newyork:      'assets/photos/hotels/hotel_america.jpg',
    sanfrancisco: 'assets/photos/hotels/hotel_america.jpg',
    sydney:       'assets/photos/hotels/hotel_america.jpg',
    bangkok:      'assets/photos/hotels/hotel_tropics.jpg',
    rio:          'assets/photos/hotels/hotel_colonial.jpg',
    mexicocity:   'assets/photos/hotels/hotel_colonial.jpg',
    kapstaden:    'assets/photos/hotels/hotel_colonial.jpg'
  };

  function getHotelPhoto(cityKey) {
    return CITY_HOTEL_PHOTO[cityKey] || 'assets/photos/hotel_lobby.jpg';
  }

  const CITY_TAVERN_PHOTO = {
    malmo:        'assets/photos/hotel_tavern.jpg',
    stockholm:    'assets/photos/hotel_tavern.jpg',
    paris:        'assets/photos/taverns/tavern_paris.jpg',
    rom:          'assets/photos/taverns/tavern_paris.jpg',
    london:       'assets/photos/taverns/tavern_london.jpg',
    sydney:       'assets/photos/taverns/tavern_london.jpg',
    kairo:        'assets/photos/taverns/tavern_orient.jpg',
    istanbul:     'assets/photos/taverns/tavern_orient.jpg',
    delhi:        'assets/photos/taverns/tavern_orient.jpg',
    peking:       'assets/photos/taverns/tavern_orient.jpg',
    tokyo:        'assets/photos/taverns/tavern_japan.jpg',
    bangkok:      'assets/photos/taverns/tavern_japan.jpg',
    newyork:      'assets/photos/taverns/tavern_america.jpg',
    sanfrancisco: 'assets/photos/taverns/tavern_america.jpg',
    kapstaden:    'assets/photos/taverns/tavern_america.jpg',
    rio:          'assets/photos/taverns/tavern_latin.jpg',
    mexicocity:   'assets/photos/taverns/tavern_latin.jpg'
  };

  function getTavernPhoto(cityKey) {
    return CITY_TAVERN_PHOTO[cityKey] || 'assets/photos/hotel_tavern.jpg';
  }

  function getSouvenirPhoto(souvenirId) {
    if (!souvenirId) return '';
    return `assets/souvenirs/${souvenirId}.jpg`;
  }

  // Deterministisk, fri och krockfri placering av ikoner över stadskartan (olika i varje stad!)
  function getFreeCitySpotCoords(cityKey, spotKeys) {
    let seed = 0;
    for (let i = 0; i < cityKey.length; i++) {
      seed = ((seed << 5) - seed + cityKey.charCodeAt(i) * (i + 17)) | 0;
    }
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) | 0;
      return ((seed >>> 0) % 10000) / 10000;
    };

    // 14 luftiga, förskjutna ankarceller (minst ~18-21 % avstånd mellan grannar så etiketter aldrig överlappar!)
    // Fredar alltid stadsskylten (uppe vänster: x<34, y<32), HUD (uppe höger: x>64, y<22) och dockan (nere höger: x>62, y>74).
    const anchors = [
      [44, 23], [66, 26], [87, 27],
      [13, 40], [35, 42], [56, 41], [78, 43],
      [22, 59], [44, 59], [67, 60], [88, 60],
      [14, 78], [35, 78], [54, 78]
    ];
    // Blanda ankarna unikt för just denna stad
    const shuffled = anchors.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const coords = {};
    const placed = [];
    spotKeys.forEach((key, idx) => {
      const base = shuffled[idx % shuffled.length];
      // Diskret organisk förskjutning (±1.8 % i X, ±1.5 % i Y) utan att krocka med grannar eller UI
      let x = Math.max(10, Math.min(90, Math.round(base[0] + (rand() - 0.5) * 3.6)));
      let y = Math.max(21, Math.min(80, Math.round(base[1] + (rand() - 0.5) * 3.0)));
      if (x < 35 && y < 34) y = 38;
      if (x > 61 && y > 72) y = 64;
      // Extra krockkontroll mot redan placerade ikoner
      const collides = placed.some(p => Math.abs(p[0] - x) < 16 && Math.abs(p[1] - y) < 14);
      if (collides) {
        x = base[0];
        y = base[1];
      }
      placed.push([x, y]);
      coords[key] = [x, y];
    });
    return coords;
  }

  function renderCitySpots(city) {
    el.spotsContainer.innerHTML = '';

    // Samla alla ikoner i staden och ge dem en unik, fri layout för just denna stad
    const spotKeys = ['hotel', 'job', 'shop', 'library', 'airport'];
    if (city.boats && city.boats.length > 0) spotKeys.push('harbor');
    (city.highlights || []).forEach(k => spotKeys.push(k));
    (city.extras || []).forEach(k => spotKeys.push(k));
    (city.wonders || []).forEach(k => spotKeys.push(k));
    if (city.signature) spotKeys.push('signature');

    const posMap = getFreeCitySpotCoords(state.city, spotKeys);
    const hasGuidebook = state.backpack.some(i => i.id && i.id.startsWith('guide_'));

    // 1. Hotell på kartan (stads-/regionanpassat hotellfoto!)
    const hotelPos = posMap.hotel;
    const hotelSpot = createSpot(
      hotelPos[0], hotelPos[1],
      'service hotel',
      `<div class="spot-badge"><img class="spot-model-img" src="${getHotelPhoto(state.city)}" alt="Hotell"></div>`,
      city.hotel.name,
      () => openHotelModal()
    );
    el.spotsContainer.appendChild(hotelSpot);

    // 2. Jobb / Dagstidning på kartan
    const jobPos = posMap.job;
    const jobSpot = createSpot(
      jobPos[0], jobPos[1],
      'service job',
      `<div class="spot-badge"><img class="spot-model-img" src="assets/icons/job_3d.jpg" alt="Dagstidning"></div>`,
      `Dagstidning & Jobb`,
      () => openJobModal()
    );
    el.spotsContainer.appendChild(jobSpot);

    // 3. Marknad / Basar på kartan (Basar bara i Kairo, Istanbul & Delhi; Marknad i övriga städer!)
    const marketInfo = getMarketInfo(state.city);
    const shopPos = posMap.shop;
    const shopSpot = createSpot(
      shopPos[0], shopPos[1],
      'service bazaar',
      `<div class="spot-badge"><img class="spot-model-img" src="assets/photos/bazaar_market.jpg" alt="${marketInfo.shortLabel}"></div>`,
      marketInfo.shortLabel,
      () => openBazaarModal()
    );
    el.spotsContainer.appendChild(shopSpot);

    // 3b. Bibliotek på kartan (med stadens eget bibliotek på knappen! Öppnar landets uppslagsbok)
    const cf = (window.GT_COUNTRY_FACTS && window.GT_COUNTRY_FACTS[state.city]) || null;
    if (cf && posMap.library) {
      const libSpot = createSpot(
        posMap.library[0], posMap.library[1],
        'service library',
        `<div class="spot-badge"><img class="spot-model-img" src="${cf.libraryPhoto}" onerror="this.src='assets/photos/libraries/lib_stockholm.jpg'" alt="Bibliotek"></div>`,
        `Bibliotek`,
        () => openLibraryModal()
      );
      el.spotsContainer.appendChild(libSpot);
    }

    // 4. Flygplats & Resor på kartan
    const airPos = posMap.airport;
    const hasDeal = Object.keys(state.deals).some(k => k !== state.city && state.deals[k] > 0);
    const airportSpot = createSpot(
      airPos[0], airPos[1],
      'service airport',
      `<div style="position:relative; display:inline-block;">
         ${hasDeal ? `<span class="spot-rea-tag">REA!</span>` : ''}
         <div class="spot-badge"><img class="spot-model-img" src="assets/icons/airport_3d.jpg" alt="Flygplats"></div>
       </div>`,
      `Flygplats & Resor`,
      () => openTravelModal('air')
    );
    el.spotsContainer.appendChild(airportSpot);

    // Eventuell Hamn för båtförbindelser (egen hamnterminal!)
    if (city.boats && city.boats.length > 0 && posMap.harbor) {
      const harborSpot = createSpot(
        posMap.harbor[0], posMap.harbor[1],
        'service harbor',
        `<div class="spot-badge"><img class="spot-model-img" src="assets/icons/harbor_3d.jpg" alt="Oceanhamn"></div>`,
        `Oceanhamn`,
        () => openTravelModal('sea')
      );
      el.spotsContainer.appendChild(harborSpot);
    }

    // 5. Sevärdheter (Medelvägen: börjar som outforskade landmärken tills man besöker dem, har guidebok eller frågar i baren!)
    const renderSightSpot = (k) => {
      const place = W.places[k];
      if (!place) return;
      const pos = posMap[k] || [50, 45];
      const isDone = state.donePlaces.has(k);
      const isDiscovered = isDone || hasGuidebook || state.discoveredPlaces.has(k);

      const badgeHtml = isDiscovered
        ? `<div class="spot-photo" style="background-image:url(${place.photo})"></div>`
        : `<div class="spot-compass-badge"><span>?</span></div>`;
      const labelText = isDiscovered ? place.name : 'Outforskat landmärke';

      const sightSpot = createSpot(
        pos[0], pos[1],
        `sight ${isDone ? 'done' : ''} ${!isDiscovered ? 'undiscovered' : ''}`,
        badgeHtml,
        labelText,
        () => {
          if (!state.discoveredPlaces.has(k)) {
            state.discoveredPlaces.add(k);
            saveGame();
            renderCitySpots(city);
          }
          openPlaceModal(k, place);
        }
      );
      el.spotsContainer.appendChild(sightSpot);
    };

    (city.highlights || []).forEach(renderSightSpot);
    if (city.extras) city.extras.forEach(renderSightSpot);

    // 6. Underverk på kartan
    if (city.wonders) {
      city.wonders.forEach(k => {
        const wonder = W.wonders[k];
        if (!wonder) return;
        const pos = posMap[k] || [20, 36];
        const isDone = state.doneWonders.has(k);
        const wonderSpot = createSpot(
          pos[0], pos[1],
          `wonder ${isDone ? 'done' : ''}`,
          `<div class="spot-photo" style="background-image:url(${wonder.photo})"></div>`,
          `${wonder.name} · Underverk`,
          () => openWonderModal(k, wonder)
        );
        el.spotsContainer.appendChild(wonderSpot);
      });
    }

    // 7. Stadsspecifik Signaturaktivitet med öppettider
    if (city.signature) {
      const sig = city.signature;
      const pos = posMap.signature || [14, 60];
      const isOpen = state.hour >= sig.openFrom && state.hour < sig.openUntil;
      const doneToday = Boolean(state.signatureDoneToday[`${state.city}_${state.day}`]);
      const sigSpot = createSpot(
        pos[0], pos[1],
        `signature ${(!isOpen || doneToday) ? 'closed' : ''}`,
        `<div class="spot-badge"><span>${String(sig.openFrom).padStart(2, '0')}–${String(sig.openUntil).padStart(2, '0')}</span><small style="font-size:8px; opacity:0.85;">${doneToday ? 'BESÖKT' : (isOpen ? 'ÖPPET' : 'STÄNGT')}</small></div>`,
        sig.name,
        () => openSignatureModal(city, sig)
      );
      el.spotsContainer.appendChild(sigSpot);
    }
  }

  function openSignatureModal(city, sig) {
    const isOpen = state.hour >= sig.openFrom && state.hour < sig.openUntil;
    const doneToday = Boolean(state.signatureDoneToday[`${state.city}_${state.day}`]);
    const html = `
      <div class="scene-fullscreen scene-sight-full" style="background-image:url(${city.skyline})">
        <div class="sight-header-bar">
          <div class="sight-plaque" style="border-color:#ffd875;">
            <h3>${sig.name}</h3>
            <div class="sight-meta">Unikt för ${city.name} · Öppettider: ${String(sig.openFrom).padStart(2, '0')}:00–${String(sig.openUntil).padStart(2, '0')}:00 · Kostnad: ${sig.cost} kr (${sig.hours} tim)</div>
          </div>
          ${exitIconBtn('Tillbaka till staden')}
        </div>
        <div class="sight-bottom-panel">
          <div class="sight-fact-card">${sig.desc}</div>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <span style="font-size:13px; color:#ffd875;">
              ${doneToday ? 'Du har redan njutit av detta idag — kom tillbaka imorgon!' : (!isOpen ? `Just nu är klockan ${String(state.hour).padStart(2, '0')}:00. Stängt tills kl ${String(sig.openFrom).padStart(2, '0')}:00!` : 'Öppet just nu — kliv in!')}
            </span>
            <div>
              ${(!doneToday && isOpen) ? `<button class="stamp-action-btn" onclick="window.GT.doSignatureActivity()">Upplev ${sig.name} (-${sig.cost} kr, ${sig.hours} tim)</button>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function doSignatureActivity() {
    const city = W.cities[state.city];
    const sig = city && city.signature;
    if (!sig) return;
    if (state.cash < sig.cost) {
      showToast('Du har inte råd just nu!', 2200);
      return;
    }
    changeCash(-sig.cost, sig.name);
    addHours(sig.hours);
    state.signatureDoneToday[`${state.city}_${state.day}`] = true;
    AudioMgr.play('right1');

    if (sig.kind === 'deal') {
      const pool = getCityRoutePool(state.city).map(r => r.to);
      const others = pool.length > 0 ? pool : Object.keys(W.cities).filter(k => k !== state.city);
      const target = others[Math.floor(Math.random() * others.length)];
      state.deals[target] = Math.max(state.deals[target] || 0, 25);
      // Tvinga omritning av dagens tavla så rabattflyget syns om man går direkt till flygplatsen
      if (state.departureBoard && state.departureBoard.city === state.city && state.departureBoard.day === state.day) {
        if (!state.departureBoard.flights.some(f => f.to === target)) {
          state.departureBoard = null;
        }
      }
      addJournal(`Besökte ${sig.name} i ${city.name} och fick tips om 25 % billigare flyg till ${W.cities[target].name}!`);
      showToast(`Hett tips! 25 % rabatt på flyg till ${W.cities[target].name}!`, 3200);
    } else if (sig.kind === 'spice') {
      if (state.backpack.length < getMaxBackpackSlots()) {
        const s = W.souvenirs.kryddor;
        state.backpack.push({ id: 'kryddor', name: s.name, origin: 'delhi', buyPrice: sig.cost, buyDay: state.day });
        updateHUD();
        addJournal(`Ropade in en billig påse kryddor på ${sig.name}!`);
        showToast('Fynd! Du ropade in en påse kryddor till ryggsäcken!', 3000);
      } else {
        changeCash(180, 'Auktionsvinst');
        showToast('Ryggsäcken var full, men du sålde fyndet direkt (+180 kr)!', 3000);
      }
    } else {
      const bonus = 240 + Math.floor(Math.random() * 180);
      changeCash(bonus, `Bonus från ${sig.name}`);
      addJournal(`Upplevde ${sig.name} i ${city.name} och gick därifrån +${bonus - sig.cost} kr rikare!`);
      showToast(`Vilken upplevelse! Du fick +${bonus} kr!`, 3000);
    }
    closeModal();
    renderCitySpots(city);
    updateHUD();
  }

  // --- Modalhantering ---
  function showModal(html) {
    el.modalContent.innerHTML = html;
    el.modalOverlay.classList.remove('hidden');
  }

  function closeModal() {
    AudioMgr.play('klick');
    el.modalOverlay.classList.add('hidden');
    el.modalContent.innerHTML = '';
  }

  // --- Höjdpunktsbesök (Fullskärmsfoto i äkta 90-tals BackPacker-stil!) ---
  function openPlaceModal(placeKey, place) {
    const isDone = state.donePlaces.has(placeKey);

    if (!isDone && state.cash < place.fee) {
      showToast(`Inträdet till ${place.name} kostar ${place.fee} kr — du behöver lite mer i reskassan!`, 3200);
      return;
    }

    const html = `
      <div class="scene-fullscreen scene-sight-full" style="background-image:url(${place.photo})">
        <div class="sight-header-bar">
          <div class="sight-plaque">
            <h3>${place.name}</h3>
            <div class="sight-meta">
              ${isDone
                ? '<span style="color:#78e08f; font-weight:bold;">REDAN BESÖKT</span> · Repetition'
                : `Besök: ${place.hours} tim · Inträde: ${place.fee > 0 ? '-' + place.fee + ' kr' : 'Gratis'}`}
            </div>
          </div>
          ${exitIconBtn('Tillbaka till staden')}
        </div>

        <div class="sight-bottom-panel">
          <div class="sight-fact-card">${place.fact}</div>
          <div id="quizContainer"></div>
        </div>
      </div>
    `;
    showModal(html);

    // Beslutet fattades när man klickade på landmärket — hoppa direkt in till första frågan!
    startPlaceQuiz(placeKey, isDone);
  }

  function startPlaceQuiz(placeKey, isRepeat = false) {
    const place = W.places[placeKey];
    if (!place) return;
    if (!isRepeat) {
      if (place.fee > 0) changeCash(-place.fee, `Inträde ${place.name}`);
      addHours(place.hours);
    }
    AudioMgr.play('sight');

    runQuiz(getQuestionsFor(place.city, placeKey, place.questions), () => {
      state.donePlaces.add(placeKey);
      if (!isRepeat) {
        state.dayLog.activities.push(`Besökte ${place.name}`);
      }
      renderCitySpots(W.cities[state.city]);
      closeModal();
      checkCityCompletion();
    }, place.photo);
  }

  // --- Världsarv & Expeditioner (Egna resmål nåbara från närmaste stad!) ---
  function openWonderModal(wonderKey, wonder) {
    wonder = wonder || W.wonders[wonderKey];
    if (!wonder) return;
    const isDone = state.doneWonders.has(wonderKey);
    const hasGear = wonder.gear ? hasItem(wonder.gear) : false;
    const actualHours = (wonder.hoursEach * 2) + (hasGear ? wonder.gearVisitHours : wonder.visitHours);
    const totalCost = wonder.transport + wonder.fee;
    const gwCity = W.cities[wonder.from];
    const gwName = gwCity ? gwCity.name : wonder.from;
    const isAtGateway = (state.city === wonder.from);

    const html = `
      <div class="scene-fullscreen scene-sight-full" style="background-image:url(${wonder.photo})">
        <div class="sight-header-bar">
          <div class="sight-plaque" style="border-color:#ffbe3d;">
            <h3>★ ${wonder.name.toUpperCase()} · ${wonder.country ? wonder.country.toUpperCase() : 'VÄRLDSARV'}</h3>
            <div class="sight-meta">
              Utgår från: <b>${gwName}</b> · ${wonder.transportMode || 'Expedition'} · ${actualHours} tim t/r · ${totalCost} kr
              ${isDone ? ' · <span style="color:#78e08f; font-weight:bold;">BESÖKT VÄRLDSARV</span>' : ''}
            </div>
          </div>
          ${exitIconBtn('Stäng')}
        </div>

        <div class="sight-bottom-panel">
          <div class="sight-fact-card" style="border-left-color:#ffbe3d;">${wonder.fact}</div>
          ${wonder.gear ? `
            <div style="background:rgba(20,14,9,0.88); border:1px solid #b88b43; padding:7px 12px; font-size:12px; margin-bottom:8px; color:#f4ead6;">
              <span class="gear-inline-badge">PACKNING</span> <b>Utrustning:</b> ${hasGear ? 
                '<span style="color:#78e08f">Du har rätt utrustning! Expeditionen tar ' + actualHours + ' timmar istället för ' + (wonder.hoursEach * 2 + wonder.visitHours) + ' timmar.</span>' : 
                '<span style="color:#ff7675">Du saknar ' + (W.souvenirs[wonder.gear]?.name || wonder.gear) + '. Expeditionen tar ' + actualHours + ' timmar.</span>'}
            </div>
          ` : ''}
          <div id="quizContainer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            ${isAtGateway ? `
              <span style="font-size:12.5px; color:#e6d7bd; font-style:italic;">
                ${isDone ? 'Du har redan besökt detta världsarv, men kan resa tillbaka när som helst.' : 'Klarar du expeditionen registreras världsarvet i ditt pass!'}
              </span>
              <div style="display:flex; gap:10px;">
                <button class="globe-brass-btn" onclick="window.GT.openGlobeModal()">Till världskartan</button>
                <button class="stamp-action-btn" onclick="window.GT.startWonderTrip('${wonderKey}')">
                  Starta expedition (${totalCost} kr, ${actualHours} tim)
                </button>
              </div>
            ` : `
              <span style="font-size:12.5px; color:#ffd875;">
                Du befinner dig i <b>${W.cities[state.city]?.name || state.city}</b>. Res till <b>${gwName}</b> först för att påbörja expeditionen hit!
              </span>
              <div style="display:flex; gap:10px;">
                <button class="globe-brass-btn" onclick="window.GT.openGlobeModal()">Tillbaka till världskartan</button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function startWonderTrip(wonderKey) {
    const wonder = W.wonders[wonderKey];
    if (!wonder) return;
    if (state.city !== wonder.from) {
      const gwName = W.cities[wonder.from]?.name || wonder.from;
      showToast(`Res till ${gwName} först för att åka till ${wonder.name}.`, 3000);
      return;
    }
    const hasGear = wonder.gear ? hasItem(wonder.gear) : false;
    const actualHours = (wonder.hoursEach * 2) + (hasGear ? wonder.gearVisitHours : wonder.visitHours);
    const totalCost = wonder.transport + wonder.fee;

    if (state.cash < totalCost) {
      alert("Du har inte råd med expeditionen!");
      return;
    }

    changeCash(-totalCost, `Expedition till ${wonder.name}`);
    addHours(actualHours);
    AudioMgr.play('takeoff');

    const questions = (wonder.questions && wonder.questions.length > 0)
      ? wonder.questions
      : getQuestionsFor(wonder.from, wonderKey, []);

    runQuiz(questions, () => {
      const firstTime = !state.doneWonders.has(wonderKey);
      state.doneWonders.add(wonderKey);
      state.dayLog.activities.push(`Expedition till ${wonder.name}`);
      if (firstTime) {
        addJournal(`Genomförde expeditionen till världsarvet ${wonder.name} (${wonder.country}) från ${W.cities[wonder.from]?.name || wonder.from}.`);
      }

      if (wonder.souvenir && W.souvenirs[wonder.souvenir]) {
        if (state.backpack.length < getMaxBackpackSlots()) {
          const itemDef = W.souvenirs[wonder.souvenir];
          state.backpack.push({
            id: wonder.souvenir,
            name: itemDef.name,
            origin: itemDef.origin,
            buyPrice: 0,
            buyDay: state.day
          });
          showToast(`Världsarv avklarat! Du fann en unik souvenir: ${itemDef.name}!`, 3600);
        } else {
          showToast(`Världsarv avklarat! Ryggsäcken var dock full för ${wonder.name}-souveniren.`, 3200);
        }
      } else if (firstTime) {
        showToast(`Världsarvet ${wonder.name} registrerades i ditt pass (${state.doneWonders.size}/${Object.keys(W.wonders).length})!`, 3600);
      }

      updateHUD();
      saveGame();
      renderCitySpots(W.cities[state.city]);
      closeModal();
    }, wonder.photo);
  }

  // --- Quiz-motor (med djupgående förklaring & bild efter varje svar!) ---
  function runQuiz(questions, onComplete, contextPhoto = null) {
    let qIndex = 0;
    const container = document.getElementById('quizContainer');

    const currentCity = W.cities[state.city];
    const region = currentCity?.region || '';
    const guidebook = state.backpack.find(i => {
      const def = W.souvenirs[i.id];
      return def && def.kind === 'kunskap' && def.region === region && (i.uses || def.uses) > 0;
    });

    function renderQuestion() {
      if (qIndex >= questions.length) {
        container.innerHTML = `
          <div style="text-align:center; padding:16px;">
            <h4 style="color:#2f7d43; font-size:20px;">Väl genomfört!</h4>
            <p>Du har svarat på alla frågorna.</p>
            <button class="btn-primary" style="margin-top:12px;" id="quizDoneBtn">Avsluta besöket</button>
          </div>
        `;
        document.getElementById('quizDoneBtn').onclick = onComplete;
        return;
      }

      const q = questions[qIndex];
      if (q.id) state.usedQuestionIds.add(q.id);
      state.questionsTotal++;

      let html = `
        <div class="quiz-box">
          <div class="bp-quiz-header">
            <span class="bp-quiz-counter">FRÅGA ${qIndex + 1} / ${questions.length}</span>
            ${guidebook ? `<button class="globe-brass-btn" style="padding:3px 9px; font-size:11px;" id="useGuideBtn">Använd guidebok (${guidebook.uses ?? 3} kvar)</button>` : '<span style="font-size:11px; color:#c9b48f; font-style:italic;">Allmänbildningsprov</span>'}
          </div>
          <div class="quiz-q">${q.q}</div>
      `;

      let activeGauge = null;
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
            <canvas id="quizGlobeCanvas" class="globe-quiz-canvas" width="300" height="190"></canvas>
            <div>
              <div style="font-size:12px; color:#d6c5a5; margin-bottom:8px;">
                Snurra 3D-jordgloben med musen och <b>klicka</b> där du tror platsen ligger!
              </div>
              <div id="globeQuizStatus" style="font-family:'Courier New',monospace; font-size:12px; color:#ffd875; margin-bottom:10px;">
                Ingen nål satt ännu...
              </div>
              <button class="stamp-action-btn" id="globeQuizSubmit" disabled style="opacity:0.45;">Lås nålen & svara</button>
            </div>
          </div>
        `;
      }

      html += `</div>`;
      container.innerHTML = html;

      // Guidebok
      const guideBtn = document.getElementById('useGuideBtn');
      if (guideBtn) {
        guideBtn.onclick = () => {
          if (!guidebook) return;
          const wrongBtns = Array.from(container.querySelectorAll('.quiz-btn[data-right="0"]:not(.disabled)'));
          if (wrongBtns.length > 0) {
            wrongBtns[0].classList.add('disabled');
            guidebook.uses = (guidebook.uses ?? 3) - 1;
            AudioMgr.play('klick');
            showToast("Guideboken strök ett felaktigt alternativ!", 2000);
            if (guidebook.uses <= 0) {
              const idx = state.backpack.indexOf(guidebook);
              if (idx >= 0) state.backpack.splice(idx, 1);
              updateHUD();
              showToast("Din guidebok är nu förbrukad.", 2500);
            }
            guideBtn.remove();
          }
        };
      }

      function showAnswerDeepDive(isCorrect, rightAnswerText, customNote = null) {
        const imgSrc = q.photo || contextPhoto || W.cities[state.city]?.skyline || 'assets/photos/gamlastan.jpg';
        const deepText = customNote || q.explain || (W.answerExplanations && W.answerExplanations[rightAnswerText]) ||
          `Det rätta svaret på frågan är ${rightAnswerText}.`;

        const box = container.querySelector('.quiz-box');
        if (!box) return;
        box.innerHTML = `
          <div class="bp-quiz-header" style="margin-bottom:8px;">
            <span class="bp-quiz-counter">FRÅGA ${qIndex + 1} / ${questions.length} · ${isCorrect ? 'RÄTT SVAR' : 'FEL SVAR'}</span>
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
            <div class="quiz-explain-action">
              <button class="stamp-action-btn" style="padding:8px 16px; font-size:12.5px; white-space:nowrap;" id="quizNextBtn">
                ${qIndex + 1 < questions.length ? 'Nästa fråga »' : 'Avsluta besöket »'}
              </button>
            </div>
          </div>
        `;
        document.getElementById('quizNextBtn').onclick = () => {
          AudioMgr.play('klick');
          qIndex++;
          renderQuestion();
        };
      }

      if (q.t === 'mc') {
        const btns = container.querySelectorAll('.quiz-btn');
        btns.forEach(btn => {
          btn.onclick = () => {
            btns.forEach(b => b.disabled = true);
            const isRight = btn.dataset.right === '1';
            if (isRight) {
              btn.classList.add('correct');
              AudioMgr.play('right1');
              state.questionsCorrect++;
            } else {
              btn.classList.add('wrong');
              AudioMgr.play('wrong1');
              btns.forEach(b => { if (b.dataset.right === '1') b.classList.add('correct'); });
            }
            showAnswerDeepDive(isRight, q.a[0]);
          };
        });
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
            display.innerHTML = `<span style="color:#78e08f">Mitt i prick! Rätt svar: ${q.ans.toLocaleString('sv-SE')} ${q.unit}</span>`;
            AudioMgr.play('right1');
            state.questionsCorrect++;
            ok = true;
            note = `Du gissade ${userVal.toLocaleString('sv-SE')} ${q.unit} — imponerande nära det exakta värdet ${q.ans.toLocaleString('sv-SE')} ${q.unit}!`;
            addJournal(`Satte en knivskarp uppskattning (${userVal.toLocaleString('sv-SE')} ${q.unit}) i ${W.cities[state.city].name}!`);
          } else if (grade === 'close') {
            display.innerHTML = `<span style="color:#ffd875">Nära! Rätt svar var ${q.ans.toLocaleString('sv-SE')} ${q.unit} (godkänt!)</span>`;
            AudioMgr.play('right1');
            state.questionsCorrect += 0.5;
            ok = true;
            note = `Din gissning (${userVal.toLocaleString('sv-SE')} ${q.unit}) var tillräckligt nära det exakta svaret ${q.ans.toLocaleString('sv-SE')} ${q.unit} för delpoäng.`;
          } else {
            display.innerHTML = `<span style="color:#ff7675">En bit ifrån — rätt svar var ${q.ans.toLocaleString('sv-SE')} ${q.unit}.</span>`;
            AudioMgr.play('wrong1');
            note = `Du gissade ${userVal.toLocaleString('sv-SE')} ${q.unit}, medan det exakta svaret är ${q.ans.toLocaleString('sv-SE')} ${q.unit}.`;
          }
          showAnswerDeepDive(ok, `${q.ans.toLocaleString('sv-SE')} ${q.unit}`, note);
        };
      } else if (q.t === 'globe') {
        const qCanvas = document.getElementById('quizGlobeCanvas');
        const statusEl = document.getElementById('globeQuizStatus');
        const submitBtn = document.getElementById('globeQuizSubmit');
        let chosen = null;
        let qGlobeFrame = null;

        if (qCanvas && window.GlobeRenderer) {
          const qGlobe = new window.GlobeRenderer(qCanvas, {
            radius: 115,
            centerLat: q.startLat !== undefined ? q.startLat : 30,
            centerLon: q.startLon !== undefined ? q.startLon : 15,
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
            qGlobe.targetMarker = { lat: q.targetLat, lon: q.targetLon, label: q.targetName, color: '#2ecc71' };
            qGlobe.focusOn(q.targetLat, q.targetLon, null, 130, 600);

            let ok = false;
            let verdict = '';
            if (distKm <= 900) {
              ok = true;
              state.questionsCorrect++;
              AudioMgr.play('right1');
              verdict = `Mitt i prick! Endast ${distKm.toLocaleString('sv-SE')} km från ${q.targetName}. ${q.explain || ''}`;
            } else if (distKm <= 2200) {
              ok = true;
              state.questionsCorrect += 0.5;
              AudioMgr.play('right1');
              verdict = `Bra riktning! Du hamnade ${distKm.toLocaleString('sv-SE')} km från ${q.targetName} (delpoäng). ${q.explain || ''}`;
            } else {
              AudioMgr.play('wrong1');
              verdict = `Du hamnade ${distKm.toLocaleString('sv-SE')} km från ${q.targetName}. ${q.explain || ''}`;
            }
            statusEl.innerHTML = `<b style="color:${ok ? '#78e08f' : '#ff7675'}">Avstånd: ${distKm.toLocaleString('sv-SE')} km</b>`;
            showAnswerDeepDive(ok, q.targetName, verdict);
          };
        }
      } else if (q.t === 'text') {
        const inp = document.getElementById('textQuizInput');
        const submit = document.getElementById('textQuizSubmit');
        if (inp) inp.focus();
        const checkText = () => {
          if (submit.disabled) return;
          submit.disabled = true;
          inp.disabled = true;
          const raw = (inp.value || '').trim().toLowerCase();
          const accepted = (q.accept || [q.ans]).map(s => String(s).toLowerCase());
          const isRight = raw.length >= 2 && accepted.some(a => raw.includes(a) || a.includes(raw) && raw.length >= Math.min(4, a.length));
          if (isRight) {
            inp.style.borderColor = '#2f7d43';
            inp.style.background = '#e6f5ea';
            AudioMgr.play('right1');
            state.questionsCorrect++;
          } else {
            inp.style.borderColor = '#a82828';
            inp.style.background = '#fae6e6';
            AudioMgr.play('wrong1');
          }
          showAnswerDeepDive(isRight, q.ans, q.explain);
        };
        submit.onclick = checkText;
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') checkText(); });
      }
    }

    renderQuestion();
  }

  // --- Jobbpass (Riktig 3-spaltig dagstidning där jobbannonsen är inringad med röd penna!) ---
  function openJobModal() {
    AudioMgr.play('paper');
    const city = W.cities[state.city];
    const cityJobs = (city && Array.isArray(city.jobs) && city.jobs.length > 0)
      ? city.jobs
      : (city && city.job ? [city.job] : []);
    if (!city || cityJobs.length === 0) {
      showToast("Det finns inga lediga jobb här just nu!", 2000);
      return;
    }
    const hasCamera = hasItem('kamera');
    const cityEv = getCityEvent(state.city);
    const evMult = (cityEv && cityEv.jobBonus) ? (1 + cityEv.jobBonus) : 1;
    const activeEvs = getActiveWorldEvents();
    const leadEv = cityEv || activeEvs[0] || null;
    const leadHeadline = leadEv
      ? `${(W.cities[leadEv.city]?.name || city.name).toUpperCase()}: ${leadEv.title.toUpperCase()}`
      : `LIVFULL DAG I ${city.name.toUpperCase()}`;
    const leadText = leadEv
      ? `${leadEv.effectText} Resenärer från hela världen strömmar till staden under veckan, och lokala arbetsgivare söker extra personal.`
      : `Stadens gator, marknader och kaféer vaknar till liv. Flera lokala verksamheter annonserar idag efter tillfällig hjälp med kontant betalning.`;
    const dealCityKey = Object.keys(state.deals).find(k => k !== state.city && state.deals[k] > 0);
    const dealNotis = dealCityKey
      ? `Sista-minuten: -${state.deals[dealCityKey]} % på flyg mot ${W.cities[dealCityKey].name} idag.`
      : `Kolla avgångstavlan på flygplatsen för dagens Stand by-biljetter (-25 %).`;

    const classifiedAdsHtml = cityJobs.slice(0, 3).map((job, idx) => {
      const finalPay = Math.round(job.pay * (hasCamera ? 1.5 : 1) * evMult);
      const doneKey = `${state.city}_${state.day}_${idx}`;
      const alreadyDone = !!state.jobsDoneToday[doneKey];
      const adClass = idx === 0 ? 'bp-classified-ad circled' : 'bp-classified-ad';
      const pitch = job.adText || `${job.employer} söker en pålitlig resenär för dagens pass med kontant lön direkt i handen.`;

      return `
        <article class="${adClass}">
          <div class="bp-ad-kicker">${(job.tag || `Platsannons #${idx + 1}`).toUpperCase()}</div>
          <h5 class="bp-ad-title">${job.title} sökes!</h5>
          <div class="bp-ad-meta">
            <b>${job.employer}</b> · ${job.hours} tim · <span class="bp-ad-pay">Upp till ${finalPay} kr</span>
          </div>
          <p class="bp-ad-copy">${pitch}</p>
          ${hasCamera ? `<div class="bp-ad-bonus">+50 % Kamerabonus aktiv</div>` : ''}
          ${(cityEv && cityEv.jobBonus) ? `<div class="bp-ad-bonus">+${Math.round(cityEv.jobBonus * 100)} % eventbonus (${cityEv.title})</div>` : ''}
          <div class="bp-ad-action">
            ${alreadyDone
              ? `<div class="job-done-stamp">PASS AVKLARAT IDAG</div>`
              : `<button class="bp-news-apply-btn" onclick="window.GT.startJobShift(${idx})">Sök passet (${job.hours} tim) »</button>`}
          </div>
        </article>
      `;
    }).join('');

    const html = `
      <div class="scene-fullscreen scene-newspaper-full">
        <div class="broadsheet-paper">
          <div class="broadsheet-masthead">
            <div class="masthead-top-row">
              <div class="masthead-ear">
                <b>PRIS: 5 KR</b>
                <span>Lösnummer</span>
              </div>
              <div class="broadsheet-title">${city.name}s Dagblad</div>
              <div class="masthead-ear right">
                <b>DAG ${state.day}</b>
                <span>Kl. ${String(state.hour).padStart(2, '0')}:00</span>
              </div>
            </div>
            <div class="broadsheet-dateline">
              <span>ÅRGÅNG 96 · NR ${100 + state.day}</span>
              <span>${city.name.toUpperCase()}, ${city.country.toUpperCase()} · MORGONUPPLAGAN</span>
              <span>LEDIGA PLATSER &amp; RESENYTT</span>
            </div>
          </div>

          <div id="quizContainer" class="broadsheet-body">
            <div class="broadsheet-frontgrid">
              <!-- Vänster nyhetsspalt: Canva/BackPacker-redaktionell förstasida med gråskale-tidningsfoto -->
              <section class="news-editorial-col">
                <div class="news-section-rule">DAGENS NYHET</div>
                <h4 class="news-lead-headline">${leadHeadline}</h4>
                <figure class="news-halftone-figure">
                  <img src="${city.skyline || 'assets/skylines/skyline.jpg'}" alt="${city.name}">
                  <figcaption>Foto: ${city.name}s Dagblad · Vy över ${city.name}.</figcaption>
                </figure>
                <p class="news-lead-copy">${leadText}</p>
                <div class="news-brief-box">
                  <b>RESENOTIS:</b> ${dealNotis}
                </div>
              </section>

              <!-- Höger del: Klassisk BackPacker-platsannonssida (3 spalter i tidningsformat) -->
              <section class="news-classifieds-col">
                <div class="news-classifieds-banner">LEDIGA PLATSER · EXTRAJOBB IDAG</div>
                <div class="bp-classifieds-grid">
                  ${classifiedAdsHtml}
                </div>
              </section>
            </div>

            <div class="broadsheet-footer">
              <span>Tryckt i ${city.name} · Globetrotter Press · Kontant lön vid godkänt arbetsprov</span>
              ${exitIconBtn('Vik ihop tidningen')}
            </div>
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function startJobShift(jobIdx = 0) {
    const city = W.cities[state.city];
    const cityJobs = (city && Array.isArray(city.jobs) && city.jobs.length > 0)
      ? city.jobs
      : (city && city.job ? [city.job] : []);
    const job = cityJobs[jobIdx] || cityJobs[0];
    if (!job) return;

    state.jobsDoneToday[`${state.city}_${state.day}_${jobIdx}`] = true;
    addHours(job.hours);

    let questions;
    if (job.isSignature || jobIdx === 0) {
      questions = getQuestionsFor(state.city, 'job', job.questions || []);
    } else {
      const pool = job.questions || [];
      const unused = pool.filter(q => !q.id || !state.usedQuestionIds.has(q.id));
      const src = unused.length >= 4 ? unused : pool;
      questions = src.slice().sort(() => Math.random() - 0.5).slice(0, 4).map(q => ({ ...q, t: q.type || q.t }));
    }
    let correctInJob = 0;
    let qIdx = 0;
    const container = document.getElementById('quizContainer');

    function nextJobQ() {
      if (qIdx >= questions.length) {
        const hasCamera = hasItem('kamera');
        const cityEv = getCityEvent(state.city);
        const evMult = (cityEv && cityEv.jobBonus) ? (1 + cityEv.jobBonus) : 1;
        const maxPay = Math.round(job.pay * (hasCamera ? 1.5 : 1) * evMult);
        const earned = Math.round((correctInJob / questions.length) * maxPay);

        changeCash(earned, `Lön från ${job.employer}`);
        addJournal(`Arbetade som ${job.title} hos ${job.employer} i ${city.name} och fick ${earned} kr i handen.`);

        // BackPacker 1-yrkeskompetens: minst 3 av 4 rätt ger yrkesintyg i passet!
        const goals = ensureJourneyGoals();
        const passThreshold = Math.ceil(questions.length * 0.75);
        const compKey = job.isSignature ? `${state.city}_sig` : (job.role || job.title);
        let compBanner = '';
        if (correctInJob >= passThreshold) {
          const alreadyHas = state.competencies.some(c => c.key === compKey);
          if (!alreadyHas) {
            state.competencies.push({ key: compKey, title: job.title, city: city.name });
            saveGame();
            AudioMgr.play('fanfar');
            addJournal(`Erhöll yrkeskompetens som ${job.title} i ${city.name} (${state.competencies.length}/${goals.requiredCompetencies})!`);
            compBanner = `
              <div style="margin:10px 0; padding:8px 12px; background:#edf7ee; border:2px solid #2f7d43; border-radius:4px; color:#1c542b; font-size:13px;">
                <b>YRKESKOMPETENS INFÖRD I PASSET!</b><br>
                Intyg: <b>${job.title}</b> · Nu <b>${state.competencies.length} / ${goals.requiredCompetencies}</b> yrken klara!
              </div>
            `;
          } else {
            compBanner = `<div style="margin:8px 0; font-size:12px; color:#5b4a36;"><i>Du har redan yrkeskompetens inom detta yrke (${state.competencies.length}/${goals.requiredCompetencies} klara).</i></div>`;
          }
        } else {
          compBanner = `<div style="margin:8px 0; font-size:12px; color:#8c4a00;">Minst ${passThreshold} av ${questions.length} rätt krävs för yrkeskompetens i passet.</div>`;
        }

        container.innerHTML = `
          <div style="text-align:center; padding:16px; border:2px dashed #6b4e2e; background:#fffaf0;">
            <h4 style="color:#2f7d43; font-size:20px; font-family:Georgia,serif;">Passet avslutat!</h4>
            <p>Du klarade <b>${correctInJob} av ${questions.length}</b> arbetsuppgifter.</p>
            <p style="font-size:19px; margin:10px 0; font-weight:bold; color:#7a4f12;">Utbetald lön: +${earned} kr</p>
            ${compBanner}
            <button class="stamp-action-btn" onclick="window.GT.closeModal()">Stoppa sedlarna i fickan</button>
          </div>
        `;
        return;
      }

      const q = questions[qIdx];
      if (q.id) state.usedQuestionIds.add(q.id);
      state.questionsTotal++;
      let html = `
        <div class="quiz-box">
          <div class="bp-quiz-header">
            <span class="bp-quiz-counter">UPPGIFT ${qIdx + 1} / ${questions.length}</span>
            <span style="font-size:11px; color:#c9b48f; font-style:italic;">${job.employer}</span>
          </div>
          <div class="quiz-q">${q.q}</div>
      `;

      let activeGauge = null;
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
            <input type="range" id="jobGaugeInput" min="${activeGauge.min}" max="${activeGauge.max}" step="${activeGauge.step}" value="${activeGauge.start}">
            <div class="caliper-readout">
              <span>Svar: <b id="jobGaugeVal">${activeGauge.start.toLocaleString('sv-SE')}</b> ${q.unit}</span>
              <button class="stamp-action-btn" id="jobGaugeSubmit">Lås svar</button>
            </div>
          </div>
        `;
      }

      html += `</div>`;
      container.innerHTML = html;

      if (q.t === 'mc') {
        const btns = container.querySelectorAll('.quiz-btn');
        btns.forEach(btn => {
          btn.onclick = () => {
            btns.forEach(b => b.disabled = true);
            const isRight = btn.dataset.right === '1';
            if (isRight) {
              btn.classList.add('correct');
              AudioMgr.play('right2');
              correctInJob++;
              state.questionsCorrect++;
            } else {
              btn.classList.add('wrong');
              AudioMgr.play('wrong2');
              btns.forEach(b => { if (b.dataset.right === '1') b.classList.add('correct'); });
            }
            setTimeout(() => {
              qIdx++;
              nextJobQ();
            }, 1000);
          };
        });
      } else if (q.t === 'text') {
        const inp = document.getElementById('textQuizInput');
        const sub = document.getElementById('textQuizSubmit');
        const checkText = () => {
          if (!inp || sub.disabled) return;
          sub.disabled = true;
          inp.disabled = true;
          const userAns = inp.value.trim().toLowerCase();
          const expected = String(q.ans || '').trim().toLowerCase();
          const ok = userAns.length > 0 && (userAns === expected || (userAns.length >= 3 && expected.includes(userAns)) || (expected.length >= 3 && userAns.includes(expected)));
          if (ok) {
            inp.style.borderColor = '#2f7d43';
            AudioMgr.play('right2');
            correctInJob++;
            state.questionsCorrect++;
          } else {
            inp.style.borderColor = '#a33';
            AudioMgr.play('wrong2');
            showToast(`Rätt svar var: ${q.ans}`, 2000);
          }
          setTimeout(() => {
            qIdx++;
            nextJobQ();
          }, 1100);
        };
        if (sub) sub.onclick = checkText;
        if (inp) {
          inp.focus();
          inp.onkeydown = (e) => { if (e.key === 'Enter') checkText(); };
        }
      } else if (q.t === 'num') {
        const slider = document.getElementById('jobGaugeInput');
        const display = document.getElementById('jobGaugeVal');
        const submit = document.getElementById('jobGaugeSubmit');
        slider.oninput = () => { display.textContent = Number(slider.value).toLocaleString('sv-SE'); };
        submit.onclick = () => {
          submit.disabled = true;
          slider.disabled = true;
          const userVal = Number(slider.value);
          const gMin = activeGauge ? activeGauge.min : q.min;
          const gMax = activeGauge ? activeGauge.max : q.max;
          const grade = gradeNumericGauge(userVal, q, gMin, gMax);
          if (grade === 'exact' || grade === 'close') {
            display.innerHTML = `<span style="color:#2f7d43">${grade === 'exact' ? 'Mitt i prick!' : 'Nära nog!'} Rätt var ${q.ans.toLocaleString('sv-SE')} ${q.unit}</span>`;
            AudioMgr.play('right2');
            correctInJob++;
            state.questionsCorrect++;
          } else {
            display.innerHTML = `<span style="color:#a33">För långt ifrån — rätt svar var ${q.ans.toLocaleString('sv-SE')} ${q.unit}</span>`;
            AudioMgr.play('wrong2');
          }
          setTimeout(() => {
            qIdx++;
            nextJobQ();
          }, 1200);
        };
      }
    }

    nextJobQ();
  }

  // --- Stadens Bibliotek & Uppslagsverk om Landet (Fakta & Karta + Interaktiv Historietidslinje!) ---
  function openLibraryModal(activeTab = 'facts', timelineIdx = 0) {
    AudioMgr.play('paper');
    const city = W.cities[state.city];
    const cf = (window.GT_COUNTRY_FACTS && window.GT_COUNTRY_FACTS[state.city]) || null;
    const ch = (window.GT_COUNTRY_HISTORY && window.GT_COUNTRY_HISTORY[state.city]) || null;
    if (!cf) {
      showToast('Biblioteket är stängt för inventering idag.', 2200);
      return;
    }

    let bodyHtml = '';
    if (activeTab === 'history' && ch && Array.isArray(ch.timeline) && ch.timeline.length > 0) {
      const safeIdx = Math.max(0, Math.min(ch.timeline.length - 1, timelineIdx));
      const item = ch.timeline[safeIdx];
      const itemImg = `assets/history/${item.id}.jpg`;
      const nodesHtml = ch.timeline.map((ev, i) => `
        <button class="timeline-node ${i === safeIdx ? 'active' : ''}" onclick="window.GT.openLibraryModal('history', ${i})" title="${ev.year}: ${ev.name}">
          <div class="timeline-avatar">
            <img src="assets/history/${ev.id}.jpg" alt="${ev.name}" onerror="this.style.display='none'">
          </div>
          <span class="timeline-year">${ev.year}</span>
          <span class="timeline-short">${ev.name}</span>
        </button>
      `).join('');

      bodyHtml = `
        <div class="encyc-timeline-wrap">
          <div class="encyc-section-title">HISTORISK TIDSLINJE (${ch.timeline.length} PUNKTER) · KLICKA PÅ ETT PORTRÄTT</div>
          <div class="timeline-track">${nodesHtml}</div>
          <div class="timeline-detail-card with-portrait">
            <div class="timeline-portrait-frame">
              <img src="${itemImg}" alt="${item.name}" onerror="this.parentElement.style.display='none'">
            </div>
            <div class="timeline-detail-right">
              <div class="timeline-detail-meta">
                <span class="timeline-year-stamp">${item.year}</span>
                <div>
                  <h3 class="timeline-person-name">${item.name}</h3>
                  <div class="timeline-person-role">${item.role}</div>
                </div>
              </div>
              <p class="timeline-person-text">${item.text}</p>
            </div>
          </div>
        </div>
      `;
    } else {
      const triviaHtml = (cf.trivia || []).map(t => `<li>${t}</li>`).join('');
      const mapSrc = (ch && ch.map) || '';
      bodyHtml = `
        <div class="encyc-columns-3">
          <div class="encyc-map-box">
            <div class="encyc-section-title">KARTA · ${cf.country.toUpperCase()}</div>
            ${mapSrc
              ? `<div class="encyc-map-frame"><img src="${mapSrc}" alt="Karta över ${cf.country}" onerror="this.parentElement.style.display='none'"></div>`
              : ''}
            <div class="encyc-dish-note"><span>Klassisk mat:</span> <b>${cf.dish}</b></div>
          </div>

          <div class="encyc-facts-box">
            <div class="encyc-section-title">SNABBFAKTA OM LANDET</div>
            <div class="encyc-fact-grid">
              <div><span>Huvudstad</span><b>${cf.capital}</b></div>
              <div><span>Folkmängd</span><b>${cf.population}</b></div>
              <div><span>Yta</span><b>${cf.area}</b></div>
              <div><span>Språk</span><b>${cf.language}</b></div>
              <div><span>Valuta</span><b>${cf.currency}</b></div>
              <div><span>Statsskick</span><b>${cf.government}</b></div>
              <div style="grid-column:1 / -1;"><span>Tidszon</span><b>${cf.timezone}</b></div>
            </div>
          </div>

          <div class="encyc-trivia-box">
            <div class="encyc-section-title">VISSTE DU ATT…?</div>
            <ul class="encyc-trivia-list">
              ${triviaHtml}
            </ul>
          </div>
        </div>
      `;
    }

    const html = `
      <div class="scene-fullscreen scene-room-bg" style="background-image:url(${cf.libraryPhoto}), url(assets/photos/libraries/lib_stockholm.jpg)">
        <div class="room-top-bar">
          <div class="sight-plaque">
            <h3>${cf.libraryName}</h3>
            <div class="sight-meta">${city.name} · Läsesalen · Fri entré</div>
          </div>
          ${exitIconBtn('Lämna biblioteket')}
        </div>

        <div class="library-book-dock">
          <div class="library-encyclopedia">
            <div class="encyc-header">
              <img class="encyc-flag" src="${cf.flag}" alt="Flagga ${cf.country}" onerror="this.style.display='none'">
              <div style="flex:1;">
                <div class="encyc-kicker">VÄRLDSATLAS &amp; UPPSLAGSVERK</div>
                <h2 class="encyc-country">${cf.country}</h2>
                <div class="encyc-sub">${city.name} · ${city.region}</div>
              </div>
              <div class="encyc-tabs">
                <button class="encyc-tab-btn ${activeTab === 'facts' ? 'active' : ''}" onclick="window.GT.openLibraryModal('facts', 0)">Fakta &amp; Karta</button>
                <button class="encyc-tab-btn ${activeTab === 'history' ? 'active' : ''}" onclick="window.GT.openLibraryModal('history', 0)">Historia &amp; Tidslinje</button>
              </div>
            </div>

            ${bodyHtml}
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  // --- Basar / Marknad, Pruta & Sälja (90-tals Basardisk!) ---
  function getEffectiveBuyPrice(key) {
    const s = W.souvenirs[key];
    if (!s) return 0;
    const hKey = `${state.city}_${state.day}_${key}`;
    if (state.haggleState[hKey] && state.haggleState[hKey].price) {
      return state.haggleState[hKey].price;
    }
    const cityEv = getCityEvent(state.city);
    const disc = (cityEv && cityEv.buyDiscount) ? (1 - cityEv.buyDiscount) : 1;
    return Math.round(s.price * disc);
  }

  function getEffectiveSellInfo(itemOrId) {
    const isObj = itemOrId && typeof itemOrId === 'object';
    const itemId = isObj ? itemOrId.id : itemOrId;
    const buyPrice = isObj && typeof itemOrId.buyPrice === 'number' ? itemOrId.buyPrice : null;
    const base = calcSouvenirValue(itemId, state.city);
    // I ursprungsstaden kan man aldrig tjäna på att sälja tillbaka en prutad/rabatterad vara
    if (base.isLocal) {
      const cappedPrice = buyPrice !== null
        ? Math.max(10, Math.min(base.price, Math.floor(buyPrice * 0.70)))
        : base.price;
      return { ...base, price: cappedPrice };
    }
    const cityEv = getCityEvent(state.city);
    if (cityEv && cityEv.sellBonus) {
      return {
        ...base,
        price: Math.round(base.price * (1 + cityEv.sellBonus)),
        eventBonus: Math.round(cityEv.sellBonus * 100)
      };
    }
    return base;
  }

  // Stadsanpassat marknadsnamn: "Basar" bara där det passar (Kairo, Istanbul, Delhi), annars "Marknad"
  function getMarketInfo(cityKey) {
    const cityName = W.cities[cityKey]?.name || cityKey;
    const custom = {
      kairo:        { shortLabel: 'Basar',   title: 'Basaren i Kairo',            leaveText: 'Lämna basaren',   keeperFallback: 'Basarhandlaren i Kairo' },
      istanbul:     { shortLabel: 'Basar',   title: 'Stora basaren i Istanbul',   leaveText: 'Lämna basaren',   keeperFallback: 'Basarhandlaren i Istanbul' },
      delhi:        { shortLabel: 'Basar',   title: 'Kryddbasaren i Delhi',       leaveText: 'Lämna basaren',   keeperFallback: 'Basarhandlaren i Delhi' },
      malmo:        { shortLabel: 'Marknad', title: 'Möllevångstorget · Marknad', leaveText: 'Lämna marknaden', keeperFallback: 'Torghandlaren på Möllan' },
      stockholm:    { shortLabel: 'Marknad', title: 'Torghandel & Marknad',       leaveText: 'Lämna marknaden', keeperFallback: 'Torghandlaren i Stockholm' },
      paris:        { shortLabel: 'Marknad', title: 'Marknaden på Rue Mouffetard',leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Paris' },
      rom:          { shortLabel: 'Marknad', title: 'Marknaden på Campo de’ Fiori',leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Rom' },
      london:       { shortLabel: 'Marknad', title: 'Portobello-marknaden',       leaveText: 'Lämna marknaden', keeperFallback: 'Antikhandlaren i London' },
      tokyo:        { shortLabel: 'Marknad', title: 'Hantverksmarknaden i Tokyo', leaveText: 'Lämna marknaden', keeperFallback: 'Handlaren i Tokyo' },
      bangkok:      { shortLabel: 'Marknad', title: 'Gatumarknaden i Bangkok',    leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Bangkok' },
      peking:       { shortLabel: 'Marknad', title: 'Antikmarknaden i Peking',    leaveText: 'Lämna marknaden', keeperFallback: 'Handlaren i Peking' },
      sydney:       { shortLabel: 'Marknad', title: 'The Rocks-marknaden',        leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Sydney' },
      kapstaden:    { shortLabel: 'Marknad', title: 'Torgmarknaden i Kapstaden',  leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Kapstaden' },
      rio:          { shortLabel: 'Marknad', title: 'Hantverksmarknaden i Rio',   leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Rio' },
      mexicocity:   { shortLabel: 'Marknad', title: 'Mercado de la Ciudadela',    leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Mexico City' },
      sanfrancisco: { shortLabel: 'Marknad', title: 'Hamnmarknaden vid Pier 39',  leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i San Francisco' },
      newyork:      { shortLabel: 'Marknad', title: 'Gatumarknaden på Manhattan', leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i New York' }
    };
    return custom[cityKey] || {
      shortLabel: 'Marknad',
      title: `Marknaden i ${cityName}`,
      leaveText: 'Lämna marknaden',
      keeperFallback: `Marknadshandlaren i ${cityName}`
    };
  }

  const GEAR_SHOP_ITEMS = [
    { id: 'parlor',      name: 'Språkparlör',    price: 650, photo: 'assets/souvenirs/guide_amerika.jpg', desc: 'Lär dig artiga fraser på 20 språk — höjer chansen att lyckas pruta från 62 % till 85 %!', effect: '85 % prutchans', unique: true },
    { id: 'guide_asien', name: 'Fickguidebok',   price: 550, photo: 'assets/souvenirs/guide_asien.jpg',   desc: 'Avslöjar outforskade landmärken på stadskartan och stryker ett felaktigt svar i quiz (3 ggr).', effect: 'Avslöjar kartan + 3 tips', uses: 3, unique: false },
    { id: 'kamera',      name: 'Systemkamera',   price: 900, photo: 'assets/souvenirs/kamera.jpg',        desc: 'Kompakt 35mm-kamera som gör dig eftertraktad på redaktioner och uppdrag.', effect: '+50 % lön på alla jobb', unique: true },
    { id: 'kangor',      name: 'Vandringskängor',price: 700, photo: 'assets/souvenirs/kangor.jpg',        desc: 'Ingångna läderkängor som kortar restiden på långa underverksexpeditioner.', effect: 'Snabbare underverk', unique: true }
  ];

  const MAIL_HOME_COST = 250;

  function upgradeBackpack() {
    const nextTier = BACKPACK_TIERS.find(t => t.level === (state.backpackLevel || 1) + 1);
    if (!nextTier) {
      showToast('Din ryggsäck är redan maximalt uppgraderad!', 2200);
      return;
    }
    if (state.cash < nextTier.price) {
      showToast(`Du behöver ${nextTier.price.toLocaleString('sv-SE')} kr för ${nextTier.name}!`, 2400);
      return;
    }
    state.backpackLevel = nextTier.level;
    changeCash(-nextTier.price, `Uppgraderade till ${nextTier.name}`);
    AudioMgr.play('fanfar');
    addJournal(`Uppgraderade packningen till ${nextTier.name} (${nextTier.slots} platser) i ${W.cities[state.city].name}!`);
    showToast(`Ny ryggsäck! Nu har du ${nextTier.slots} packplatser!`, 2800);
    openBazaarModal(`Ett rejält lyft! Med ${nextTier.name} får du plats med hela ${nextTier.slots} prylar på ryggen.`, 'gear');
  }

  function buyGearItem(gearId) {
    const gear = GEAR_SHOP_ITEMS.find(g => g.id === gearId);
    if (!gear) return;
    if (gear.unique && hasItem(gear.id)) {
      showToast(`Du har redan ${gear.name} i ryggsäcken!`, 2000);
      return;
    }
    if (state.backpack.length >= getMaxBackpackSlots()) {
      showToast('Ryggsäcken är full! Uppgradera ryggsäcken eller posta hem en souvenir först.', 2600);
      return;
    }
    if (state.cash < gear.price) {
      showToast(`Du har inte råd med ${gear.name} (${gear.price} kr)!`, 2400);
      return;
    }
    state.backpack.push({
      id: gear.id,
      name: gear.name,
      origin: state.city,
      buyPrice: gear.price,
      buyDay: state.day,
      uses: gear.uses
    });
    changeCash(-gear.price, `Köpte utrustning: ${gear.name}`);
    AudioMgr.play('right1');
    addJournal(`Köpte ${gear.name} i utrustningsbutiken i ${W.cities[state.city].name}.`);
    renderCitySpots(W.cities[state.city]);
    showToast(`Packade ner ${gear.name}!`, 2200);
    openBazaarModal(`Klokt val! ${gear.name} kommer vara guld värd ute på vägarna.`, 'gear');
  }

  function mailSouvenirHome(idx) {
    if (idx < 0 || idx >= state.backpack.length) return;
    const item = state.backpack[idx];
    if (item.kind === 'kurir') {
      showToast('Kurirpaket måste lämnas personligen på destinationshotellet!', 2400);
      return;
    }
    if (state.cash < MAIL_HOME_COST) {
      showToast(`Det kostar ${MAIL_HOME_COST} kr i porto att posta hem ett paket.`, 2400);
      return;
    }
    state.backpack.splice(idx, 1);
    state.mailedHome.push({
      id: item.id,
      name: item.name,
      origin: item.origin,
      mailedDay: state.day
    });
    changeCash(-MAIL_HOME_COST, `Postade hem ${item.name} till Stockholm`);
    AudioMgr.play('stamp');
    AudioMgr.play('paper');
    addJournal(`Postade hem ${item.name} (från ${W.cities[item.origin]?.name || item.origin}) till Stockholm för ${MAIL_HOME_COST} kr.`);
    showToast(`${item.name} är på väg hem till Stockholm! Plats frigjord i ryggsäcken.`, 2800);
    openBazaarModal(`Paketet med ${item.name} är frankerat och stämplat — tryggt på väg hem till Stockholm!`, 'gear');
  }

  function openBazaarModal(customSpeech = null, activeTab = 'market') {
    const city = W.cities[state.city];
    const mInfo = getMarketInfo(state.city);
    const localSouvenirKeys = city.souvenirs || [];
    const keeper = (W.shopkeepers && W.shopkeepers[state.city]) || {
      name: mInfo.keeperFallback,
      greet: 'Välkommen! Titta på dagens varor — vågar du lägga ett bud?'
    };
    const cityEv = getCityEvent(state.city);
    const goals = ensureJourneyGoals();
    const isGoalCity = goals.souvenirCities.includes(state.city);
    const alreadyHasFromHere = Boolean(hasGoalSouvenirFrom(state.city));
    const maxSlots = getMaxBackpackSlots();

    let bodyColumnsHtml = '';

    if (activeTab === 'gear') {
      const currentTier = BACKPACK_TIERS.find(t => t.level === (state.backpackLevel || 1)) || BACKPACK_TIERS[0];
      const nextTier = BACKPACK_TIERS.find(t => t.level === currentTier.level + 1);

      const upgradeCardHtml = nextTier
        ? `
          <div class="market-card goal-highlight">
            <div class="market-card-top">
              <div class="market-item-name">Uppgradera: ${nextTier.name}</div>
              <div class="market-price-tag">${nextTier.price.toLocaleString('sv-SE')} kr</div>
            </div>
            <div class="market-item-desc">${nextTier.desc} (Nuvarande: ${currentTier.slots} platser → <b>${nextTier.slots} platser</b>)</div>
            <div class="market-card-footer">
              <span class="market-kind-pill">RYGGSÄCK NIVÅ ${nextTier.level} / 3</span>
              <button class="market-btn-buy" onclick="window.GT.upgradeBackpack()">Uppgradera · ${nextTier.price} kr</button>
            </div>
          </div>
        `
        : `
          <div class="market-card keep-highlight">
            <div class="market-card-top">
              <div class="market-item-name">${currentTier.name}</div>
              <div class="market-price-tag sell">MAXNIVÅ (9 PLATSER)</div>
            </div>
            <div class="market-item-desc">Du bär redan den största expeditionsryggsäcken som finns att köpa!</div>
          </div>
        `;

      const gearListHtml = GEAR_SHOP_ITEMS.map(g => {
        const owned = g.unique && hasItem(g.id);
        return `
          <div class="market-card">
            <div class="market-card-with-img">
              <img class="souvenir-thumb" src="${g.photo}" alt="${g.name}" onerror="this.style.display='none'">
              <div class="market-card-main">
                <div class="market-card-top">
                  <div class="market-item-name">${g.name}</div>
                  <div class="market-price-tag ${owned ? 'sell' : ''}">${owned ? '✓ ÄGD' : g.price + ' kr'}</div>
                </div>
                <div class="market-item-desc">${g.desc}</div>
                <div class="market-card-footer">
                  <span class="market-item-effect" style="margin:0;">${g.effect}</span>
                  ${owned
                    ? `<span class="market-locked-note">Redan i din packning</span>`
                    : `<button class="market-btn-buy" onclick="window.GT.buyGearItem('${g.id}')">Köp · ${g.price} kr</button>`}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      const mailableItems = state.backpack
        .map((item, idx) => ({ item, idx }))
        .filter(x => x.item.kind !== 'kurir');

      const mailListHtml = mailableItems.length === 0
        ? '<div class="market-empty-note">Inga souvenirer i ryggsäcken att skicka hem just nu.</div>'
        : mailableItems.map(({ item, idx }) => {
            const isGoal = goals.souvenirCities.includes(item.origin);
            return `
              <div class="market-card ${isGoal ? 'keep-highlight' : ''}">
                <div class="market-card-with-img">
                  <img class="souvenir-thumb" src="${getSouvenirPhoto(item.id)}" alt="${item.name}" onerror="this.style.display='none'">
                  <div class="market-card-main">
                    <div class="market-card-top">
                      <div class="market-item-name">
                        ${item.name}
                        ${isGoal ? '<span class="market-goal-tag done">★ MÅL I PASSET</span>' : ''}
                      </div>
                      <div class="market-price-tag">${MAIL_HOME_COST} kr</div>
                    </div>
                    <div class="market-item-desc">Från <b>${W.cities[item.origin]?.name || item.origin}</b> · Postas hem till Stockholm och frigör 1 ryggsäcksplats!</div>
                    <div class="market-card-footer">
                      <span class="market-kind-pill">FLYGPACKET · SVERIGE</span>
                      <button class="market-btn-sell" onclick="window.GT.mailSouvenirHome(${idx})">Posta hem · ${MAIL_HOME_COST} kr</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('');

      const mailedSummaryHtml = state.mailedHome.length > 0
        ? `<div style="margin-top:8px; padding:7px 9px; background:rgba(47,125,67,0.18); border:1px dashed #6bc982; border-radius:4px; font-size:11.5px; color:#d8f5de;">
             <b>Redan postat hem till Stockholm (${state.mailedHome.length} st):</b>
             ${state.mailedHome.map(m => `${m.name} (${W.cities[m.origin]?.name || m.origin})`).join(', ')}
           </div>`
        : '';

      bodyColumnsHtml = `
        <div class="market-columns">
          <div class="market-col">
            <div class="market-col-head">
              <span>RYGGSÄCK &amp; RESEUTRUSTNING</span>
              <small>Nuvarande: ${maxSlots} platser</small>
            </div>
            <div class="market-card-list">
              ${upgradeCardHtml}
              ${gearListHtml}
            </div>
          </div>
          <div class="market-col">
            <div class="market-col-head">
              <span>POSTKONTORET · SKICKA HEM PAKET</span>
              <small>Porto: ${MAIL_HOME_COST} kr / st</small>
            </div>
            <div class="market-card-list">
              ${mailListHtml}
              ${mailedSummaryHtml}
            </div>
          </div>
        </div>
      `;
    } else {
      let buyHtml = '';
      localSouvenirKeys.forEach(k => {
        const s = W.souvenirs[k];
        if (!s) return;
        const hKey = `${state.city}_${state.day}_${k}`;
        const hState = state.haggleState[hKey];
        const currentPrice = getEffectiveBuyPrice(k);
        const canHaggle = !hState || !hState.locked;

        buyHtml += `
          <div class="market-card ${isGoalCity ? 'goal-highlight' : ''}">
            <div class="market-card-with-img">
              <img class="souvenir-thumb" src="${getSouvenirPhoto(k)}" alt="${s.name}" onerror="this.style.display='none'">
              <div class="market-card-main">
                <div class="market-card-top">
                  <div class="market-item-name">
                    ${s.name}
                    ${isGoalCity ? `<span class="market-goal-tag ${alreadyHasFromHere ? 'done' : ''}">${alreadyHasFromHere ? '✓ MÅL KLART' : '★ MÅL I PASSET'}</span>` : ''}
                  </div>
                  <div class="market-price-tag">
                    ${currentPrice} kr ${hState && hState.won ? '<small>PRUTAT</small>' : ''}
                  </div>
                </div>
                <div class="market-item-desc">${s.desc || ''}</div>
                ${s.effect ? `<div class="market-item-effect">Egenskap: ${s.effect}</div>` : ''}
                <div class="market-card-footer">
                  <span class="market-kind-pill">${s.kind}</span>
                  <div class="market-btn-group">
                    ${canHaggle
                      ? `<button class="market-btn-haggle" onclick="window.GT.haggleSouvenir('${k}')">Pruta -20 %</button>`
                      : `<span class="market-locked-note">${hState.won ? 'Prutat klart' : 'Fast pris idag'}</span>`}
                    <button class="market-btn-buy" onclick="window.GT.buySouvenir('${k}')">Köp · ${currentPrice} kr</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      let sellHtml = '';
      if (state.backpack.length === 0) {
        sellHtml = '<div class="market-empty-note">Din ryggsäck är tom. Köp lokala fynd här och sälj dem med god vinst på andra sidan jorden!</div>';
      } else {
        state.backpack.forEach((item, idx) => {
          if (item.kind === 'kurir') {
            const destName = W.cities[item.relayTo]?.name || item.relayTo;
            sellHtml += `
              <div class="market-card courier-locked">
                <div class="market-card-top">
                  <div class="market-item-name">[KURIRPAKET] ${item.name}</div>
                  <div class="market-price-tag locked">EJ TILL SALU</div>
                </div>
                <div class="market-item-desc">Stafettpaket som ska lämnas på hotellet i <b>${destName}</b>.</div>
              </div>
            `;
            return;
          }
          const valInfo = getEffectiveSellInfo(item);
          const profit = valInfo.price - item.buyPrice;
          const isGoalSouvenir = goals.souvenirCities.includes(item.origin);
          sellHtml += `
            <div class="market-card ${isGoalSouvenir ? 'keep-highlight' : ''}">
              <div class="market-card-with-img">
                <img class="souvenir-thumb" src="${getSouvenirPhoto(item.id)}" alt="${item.name}" onerror="this.style.display='none'">
                <div class="market-card-main">
                  <div class="market-card-top">
                    <div class="market-item-name">
                      ${item.name}
                      ${isGoalSouvenir ? '<span class="market-goal-tag done">BEHÅLL / POSTA HEM!</span>' : ''}
                    </div>
                    <div class="market-price-tag sell">
                      +${valInfo.price} kr ${valInfo.eventBonus ? `<small>+${valInfo.eventBonus}%</small>` : ''}
                    </div>
                  </div>
                  <div class="market-item-desc">
                    Köpt i <b>${W.cities[item.origin]?.name || item.origin}</b> för ${item.buyPrice} kr ·
                    ${valInfo.isLocal
                      ? '<span style="color:#8c2b2b;">Lokal vara — lågt inbytespris här</span>'
                      : `${valInfo.dist.toLocaleString('sv-SE')} km bort (${valInfo.factor.toFixed(2)}×)`}
                  </div>
                  <div class="market-card-footer">
                    <span class="market-profit-pill ${profit >= 0 ? 'pos' : 'neg'}">
                      ${profit >= 0 ? '+' : ''}${profit} kr ${profit >= 0 ? 'vinst' : 'förlust'}
                    </span>
                    <button class="market-btn-sell" onclick="window.GT.sellSouvenir(${idx})">Sälj · +${valInfo.price} kr</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      }

      bodyColumnsHtml = `
        <div class="market-columns">
          <div class="market-col">
            <div class="market-col-head">
              <span>PÅ DISKEN IDAG</span>
              <small>${localSouvenirKeys.length} varor</small>
            </div>
            <div class="market-card-list">${buyHtml}</div>
          </div>
          <div class="market-col">
            <div class="market-col-head">
              <span>I DIN RYGGSÄCK</span>
              <small>${state.backpack.length} / ${maxSlots} platser</small>
            </div>
            <div class="market-card-list">${sellHtml}</div>
          </div>
        </div>
      `;
    }

    const html = `
      <div class="scene-fullscreen scene-room-bg" style="background-image:url(assets/photos/bazaar_market.jpg)">
        <div class="room-top-bar">
          <div class="sight-plaque">
            <h3>${mInfo.title}</h3>
            <div class="sight-meta">${keeper.name} · Dag ${state.day} · Kassa: ${state.cash.toLocaleString('sv-SE')} kr</div>
          </div>
          ${exitIconBtn(mInfo.leaveText)}
        </div>

        <div class="market-counter-dock">
          <div class="market-counter-panel">
            <div class="market-tabs">
              <button class="market-tab-btn ${activeTab === 'market' ? 'active' : ''}" onclick="window.GT.openBazaarModal(null, 'market')">
                Souvenirer &amp; Handel
              </button>
              <button class="market-tab-btn ${activeTab === 'gear' ? 'active' : ''}" onclick="window.GT.openBazaarModal(null, 'gear')">
                Reseutrustning &amp; Post (Ryggsäck ${state.backpack.length}/${maxSlots})
              </button>
            </div>
            <div class="market-keeper-strip">
              <span class="market-keeper-tag">${activeTab === 'gear' ? 'Utrustnings- & Postdisken' : keeper.name}</span>
              <span class="market-keeper-quote">”${customSpeech || (activeTab === 'gear' ? 'Behöver du större ryggsäck, smarta reseprylar eller skicka hem ett paket till Stockholm?' : keeper.greet)}”</span>
              ${cityEv && (cityEv.buyDiscount || cityEv.sellBonus) ? `<span class="market-event-pill">${cityEv.title}: ${cityEv.effectText}</span>` : ''}
            </div>
            ${bodyColumnsHtml}
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function haggleSouvenir(key) {
    const s = W.souvenirs[key];
    if (!s) return;
    const hKey = `${state.city}_${state.day}_${key}`;
    const basePrice = getEffectiveBuyPrice(key);
    const hasParlor = hasItem('parlor');
    const roll = Math.random();

    if (roll < (hasParlor ? 0.85 : 0.62)) {
      const discounted = Math.max(20, Math.round(basePrice * 0.80));
      state.haggleState[hKey] = { price: discounted, won: true, locked: true };
      AudioMgr.play('right1');
      addJournal(`Prutade fram ett kanonpris på ${s.name} (${discounted} kr) i ${W.cities[state.city].name}!`);
      openBazaarModal(`Haha, du är en skarp förhandlare! Okej då — ${discounted} kr för ${s.name}, men inte ett öre lägre!`);
    } else if (roll < 0.88) {
      const slight = Math.max(20, Math.round(basePrice * 0.90));
      state.haggleState[hKey] = { price: slight, won: true, locked: true };
      AudioMgr.play('klick');
      openBazaarModal(`Nja, 20 procent rånar mig på mat på bordet! Vi möts halvvägs på ${s.name}: ${slight} kr.`);
    } else {
      state.haggleState[hKey] = { price: basePrice, won: false, locked: true };
      AudioMgr.play('wrong1');
      openBazaarModal(`Hmph! Skambud på äkta hantverk! För ${s.name} gäller fast pris ${basePrice} kr idag.`);
    }
  }

  function buySouvenir(key) {
    const s = W.souvenirs[key];
    if (!s) return;
    const price = getEffectiveBuyPrice(key);
    if (state.backpack.length >= getMaxBackpackSlots()) {
      showToast("Ryggsäcken är full! Sälj något först.", 2400);
      return;
    }
    if (state.cash < price) {
      showToast("Du har inte råd med detta föremål!", 2400);
      return;
    }
    state.backpack.push({
      id: key,
      name: s.name,
      origin: s.origin,
      buyPrice: price,
      buyDay: state.day,
      uses: s.uses
    });
    changeCash(-price, `Köpte ${s.name}`);
    showToast(`Köpte ${s.name} för ${price} kr!`, 1800);
    openBazaarModal(`Tack för affären! Ta väl hand om ${s.name} ute i världen.`);
  }

  function sellSouvenir(idx) {
    if (idx < 0 || idx >= state.backpack.length) return;
    const item = state.backpack[idx];
    if (item.kind === 'kurir') {
      showToast("Kurirpaket kan inte säljas i basaren!", 2200);
      return;
    }
    const valInfo = getEffectiveSellInfo(item);
    state.backpack.splice(idx, 1);
    changeCash(valInfo.price, `Sålde ${item.name}`);
    addJournal(`Sålde ${item.name} (från ${W.cities[item.origin]?.name || item.origin}) i ${W.cities[state.city].name} för ${valInfo.price} kr.`);
    showToast(`Sålde ${item.name} för ${valInfo.price} kr!`, 1800);
    const speech = valInfo.isLocal
      ? `Tja, jag har ju hyllan full av sådana här redan — men jag tar tillbaka ${item.name} i inbyte för ${valInfo.price} kr.`
      : `Vilket fynd från ${W.cities[item.origin]?.name || item.origin}! Här har du ${valInfo.price} kr kontant.`;
    openBazaarModal(speech);
  }

  // --- Ruttnätverk & Daglig Avgångstavla (BackPacker 1 & 2-systemet!) ---
  // Varje stad har ett realistiskt ruttnätverk (grannstäder + utvalda långdistansnav)
  // med sannolikhet (chance) och eventuell Stand by-linje, precis som i BP1/BP2.
  const CITY_AIRLINE_PREFIX = {
    malmo: 'SK', stockholm: 'SK', london: 'BA', paris: 'AF', rom: 'AZ', istanbul: 'TK',
    kairo: 'MS', kapstaden: 'SA', delhi: 'AI', bangkok: 'TG', peking: 'CA',
    tokyo: 'JL', sydney: 'QF', sanfrancisco: 'UA', newyork: 'AA',
    mexicocity: 'AM', rio: 'RG'
  };

  const CITY_ROUTES = {
    malmo: [
      { to: 'stockholm', chance: 90 }, { to: 'london', chance: 90 }, { to: 'paris', chance: 86 },
      { to: 'rom', chance: 78 }, { to: 'istanbul', chance: 72 }, { to: 'kairo', chance: 62 },
      { to: 'newyork', chance: 55, standby: true }
    ],
    stockholm: [
      { to: 'malmo', chance: 90 }, { to: 'london', chance: 90 }, { to: 'paris', chance: 85 }, { to: 'rom', chance: 75 },
      { to: 'istanbul', chance: 70 }, { to: 'newyork', chance: 62 }, { to: 'kairo', chance: 58 },
      { to: 'peking', chance: 45, standby: true }
    ],
    london: [
      { to: 'malmo', chance: 85 }, { to: 'stockholm', chance: 85 }, { to: 'paris', chance: 95 }, { to: 'rom', chance: 80 },
      { to: 'newyork', chance: 88 }, { to: 'kairo', chance: 65 }, { to: 'kapstaden', chance: 60 },
      { to: 'delhi', chance: 55, standby: true }
    ],
    paris: [
      { to: 'malmo', chance: 82 }, { to: 'london', chance: 95 }, { to: 'rom', chance: 90 }, { to: 'stockholm', chance: 78 },
      { to: 'istanbul', chance: 75 }, { to: 'newyork', chance: 78 }, { to: 'kairo', chance: 68 },
      { to: 'rio', chance: 55, standby: true }
    ],
    rom: [
      { to: 'malmo', chance: 74 }, { to: 'paris', chance: 90 }, { to: 'london', chance: 80 }, { to: 'istanbul', chance: 88 },
      { to: 'kairo', chance: 85 }, { to: 'stockholm', chance: 70 }, { to: 'kapstaden', chance: 55, standby: true }
    ],
    istanbul: [
      { to: 'rom', chance: 88 }, { to: 'kairo', chance: 92 }, { to: 'paris', chance: 75 },
      { to: 'delhi', chance: 82 }, { to: 'stockholm', chance: 65 }, { to: 'bangkok', chance: 58 },
      { to: 'peking', chance: 55, standby: true }
    ],
    kairo: [
      { to: 'istanbul', chance: 92 }, { to: 'rom', chance: 85 }, { to: 'delhi', chance: 82 },
      { to: 'kapstaden', chance: 80 }, { to: 'paris', chance: 70 }, { to: 'london', chance: 65 },
      { to: 'bangkok', chance: 52, standby: true }
    ],
    kapstaden: [
      { to: 'kairo', chance: 82 }, { to: 'london', chance: 78 }, { to: 'rio', chance: 82 },
      { to: 'rom', chance: 62 }, { to: 'sydney', chance: 60, standby: true }, { to: 'delhi', chance: 55 }
    ],
    delhi: [
      { to: 'bangkok', chance: 92 }, { to: 'istanbul', chance: 82 }, { to: 'kairo', chance: 80 },
      { to: 'peking', chance: 80 }, { to: 'london', chance: 65 }, { to: 'tokyo', chance: 62 },
      { to: 'sydney', chance: 55, standby: true }
    ],
    bangkok: [
      { to: 'delhi', chance: 92 }, { to: 'peking', chance: 86 }, { to: 'tokyo', chance: 86 },
      { to: 'sydney', chance: 85 }, { to: 'istanbul', chance: 60 }, { to: 'kairo', chance: 55, standby: true }
    ],
    peking: [
      { to: 'tokyo', chance: 95 }, { to: 'bangkok', chance: 86 }, { to: 'delhi', chance: 80 },
      { to: 'sanfrancisco', chance: 72 }, { to: 'sydney', chance: 65 }, { to: 'istanbul', chance: 60 },
      { to: 'stockholm', chance: 55, standby: true }
    ],
    tokyo: [
      { to: 'peking', chance: 95 }, { to: 'bangkok', chance: 86 }, { to: 'sydney', chance: 86 },
      { to: 'sanfrancisco', chance: 86 }, { to: 'delhi', chance: 65 }, { to: 'newyork', chance: 58, standby: true }
    ],
    sydney: [
      { to: 'tokyo', chance: 86 }, { to: 'bangkok', chance: 85 }, { to: 'sanfrancisco', chance: 76 },
      { to: 'peking', chance: 65 }, { to: 'kapstaden', chance: 60, standby: true }, { to: 'delhi', chance: 55 }
    ],
    sanfrancisco: [
      { to: 'newyork', chance: 95 }, { to: 'mexicocity', chance: 90 }, { to: 'tokyo', chance: 86 },
      { to: 'sydney', chance: 75 }, { to: 'peking', chance: 70 }, { to: 'london', chance: 58, standby: true }
    ],
    newyork: [
      { to: 'london', chance: 92 }, { to: 'sanfrancisco', chance: 95 }, { to: 'mexicocity', chance: 86 },
      { to: 'paris', chance: 80 }, { to: 'rio', chance: 80 }, { to: 'malmo', chance: 72 }, { to: 'stockholm', chance: 68 },
      { to: 'tokyo', chance: 55, standby: true }
    ],
    mexicocity: [
      { to: 'sanfrancisco', chance: 90 }, { to: 'newyork', chance: 90 }, { to: 'rio', chance: 85 },
      { to: 'paris', chance: 62 }, { to: 'london', chance: 58 }, { to: 'tokyo', chance: 50, standby: true }
    ],
    rio: [
      { to: 'mexicocity', chance: 85 }, { to: 'newyork', chance: 85 }, { to: 'kapstaden', chance: 82 },
      { to: 'paris', chance: 72 }, { to: 'rom', chance: 65 }, { to: 'london', chance: 60, standby: true }
    ]
  };

  function getCityRoutePool(cityKey) {
    const defined = (W.cities[cityKey] && W.cities[cityKey].routes) || CITY_ROUTES[cityKey];
    if (defined && defined.length > 0) {
      return defined.filter(r => W.cities[r.to] && r.to !== cityKey);
    }
    // BP2-fallback: om en ny stad saknar handgjord lista, välj de 6 närmaste städerna geografiskt
    return Object.keys(W.cities)
      .filter(k => k !== cityKey)
      .map(k => ({ to: k, dist: getDistanceBetweenCities(cityKey, k) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 6)
      .map((r, i) => ({ to: r.to, chance: Math.max(55, 90 - i * 6) }));
  }

  // Drar dagens avgångar en gång per stad/dag (BP1: DEPDD / OriginalRules.departureBoard)
  function getDailyDepartureBoard() {
    if (
      state.departureBoard &&
      state.departureBoard.city === state.city &&
      state.departureBoard.day === state.day &&
      Array.isArray(state.departureBoard.flights) &&
      state.departureBoard.flights.length > 0
    ) {
      return state.departureBoard;
    }

    const pool = getCityRoutePool(state.city);
    const maxRows = Math.min(5, pool.length);
    const minRows = Math.min(4, pool.length);
    const picked = [];
    const pickedSet = new Set();

    // Eventuella aktiva sista-minuten-rabatter i nuvarande ruttnätverk garanteras på tavlan
    pool.forEach(r => {
      if (state.deals[r.to] > 0 && picked.length < maxRows && !pickedSet.has(r.to)) {
        picked.push(r);
        pickedSet.add(r.to);
      }
    });

    // Blanda resten och dra utifrån varje rutts sannolikhet (chance), sänk tröskeln tills minRows fylls
    const rest = pool.filter(r => !pickedSet.has(r.to)).sort(() => Math.random() - 0.5);
    let luckSeed = 95;
    for (let pass = 0; pass < 6 && picked.length < minRows; pass++) {
      for (const r of rest) {
        if (picked.length >= maxRows) break;
        if (pickedSet.has(r.to)) continue;
        const roll = Math.floor(Math.random() * luckSeed) + 1;
        if (r.chance >= roll) {
          picked.push(r);
          pickedSet.add(r.to);
        }
      }
      luckSeed = Math.max(20, luckSeed - 20);
    }
    // Säkerställ att minst minRows fylls
    for (const r of rest) {
      if (picked.length >= minRows) break;
      if (!pickedSet.has(r.to)) {
        picked.push(r);
        pickedSet.add(r.to);
      }
    }

    const prefix = CITY_AIRLINE_PREFIX[state.city] || 'GT';
    const flightBase = 100 + Math.floor(Math.random() * 80) * 10;
    let hasUnavailable = false;
    let hasStandby = false;

    const flights = picked.map((r, i) => {
      let status = 'open';
      // BP1: liten chans att en avgång är FULLBOKAD eller INSTÄLLD (aldrig om deal, högst 1 per tavla, aldrig på dag 1)
      if (
        !hasUnavailable &&
        state.day > 1 &&
        picked.length >= 4 &&
        !(state.deals[r.to] > 0) &&
        Math.random() < 0.12
      ) {
        status = Math.random() < 0.65 ? 'full' : 'cancelled';
        hasUnavailable = true;
      }
      const isStandby = status === 'open' && !hasStandby && (r.standby || Math.random() < 0.14);
      if (isStandby) hasStandby = true;

      return {
        to: r.to,
        flightNo: `${prefix} ${flightBase + i + 1}`,
        standby: isStandby,
        status
      };
    });

    state.departureBoard = {
      city: state.city,
      day: state.day,
      flights
    };
    saveGame();
    return state.departureBoard;
  }

  // --- Resor och Avgångar: Separat Avgångshall (Flyg) & Oceanhamn (Rederikontor)! ---
  function openTravelModal(mode = 'air') {
    const currentCity = W.cities[state.city];
    const hasBoats = currentCity.boats && currentCity.boats.length > 0;

    if (mode === 'sea') {
      AudioMgr.play('ferry');
      let boatsHtml = '';
      if (hasBoats) {
        currentCity.boats.forEach(b => {
          const dest = W.cities[b.to];
          if (!dest) return;
          const dist = getDistanceBetweenCities(state.city, b.to);
          boatsHtml += `
            <div class="flap-row boat-row">
              <div>
                <div class="flap-dest"><img class="inline-icon round" src="assets/icons/harbor_3d.jpg" alt=""> ${b.name.toUpperCase()}</div>
                <div class="flap-meta">OCEANLINJE TILL ${dest.name.toUpperCase()} (${dist.toLocaleString('sv-SE')} KM) · RESTID: ${b.days} DAGAR · PRIS: ${b.price} KR</div>
              </div>
              <div>
                <button class="ticket-btn" onclick="window.GT.startTravel('${b.to}', ${b.price}, ${b.days}, true)">Mönstra på<br>${b.price} kr</button>
              </div>
            </div>
          `;
        });
      } else {
        boatsHtml = `<div style="padding:16px; color:#c8d6e5; font-style:italic; text-align:center;">Inga oceanångare avgår från ${currentCity.name} idag.</div>`;
      }

      const html = `
        <div class="scene-fullscreen scene-room-bg" style="background-image:url(assets/travel/ship_harbor.jpg)">
          <div class="room-top-bar">
            <div class="sight-plaque">
              <h3>OCEANHAMN &amp; REDERIKONTOR · ${currentCity.name.toUpperCase()}</h3>
              <div class="sight-meta">Dag ${state.day} · Kassa: ${state.cash.toLocaleString('sv-SE')} kr · Långsam, vilsam &amp; prisvärd sjöresa</div>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="globe-brass-btn" onclick="window.GT.openTravelModal('air')">Till flygplatsen »</button>
              ${exitIconBtn(`Stanna kvar i ${currentCity.name}`)}
            </div>
          </div>
          <div class="room-counter-dock" style="display:flex; justify-content:center;">
            <div class="modal-departure-board" style="max-width:780px; width:100%; max-height:none; border-color:#4ea8de;">
              <div class="board-header">
                <div class="board-title" style="color:#9ad7ff;">TURISTA · OCEANLINJER FRÅN ${currentCity.name.toUpperCase()}</div>
                <div class="board-ticket-css">HYTTBILJETT · REDERI</div>
              </div>
              <div>${boatsHtml}</div>
              <div class="board-footnote">
                Sjöresor tar flera dagar men är ofta billigare än flyg — och på däck kan oväntade resehändelser hända!
              </div>
            </div>
          </div>
        </div>
      `;
      showModal(html);
      return;
    }

    AudioMgr.play('flap');
    const board = getDailyDepartureBoard();

    let flightsHtml = '';
    board.flights.forEach(entry => {
      const destKey = entry.to;
      const dest = W.cities[destKey];
      if (!dest) return;
      const dist = getDistanceBetweenCities(state.city, destKey);
      
      let price = Math.round(500 + (dist * 0.22));
      const hours = Math.max(2, Math.round(1 + (dist / 800)));

      if (entry.standby) {
        price = Math.round(price * 0.75);
      }

      const dealPercent = state.deals[destKey] || 0;
      if (dealPercent > 0) {
        price = Math.round(price * (1 - dealPercent / 100));
      }

      const destEv = getCityEvent(destKey);
      if (destEv && destEv.flightMult) {
        price = Math.round(price * destEv.flightMult);
      }

      const isClosed = entry.status !== 'open';
      const closedLabel = entry.status === 'cancelled' ? 'INSTÄLLD' : 'FULLBOKAD';

      flightsHtml += `
        <div class="flap-row ${isClosed ? 'unavailable' : ''}">
          <div>
            <div class="flap-dest">
              <span class="flap-flight-no">${entry.flightNo}</span>
              <img class="inline-icon round" src="assets/icons/airport_3d.jpg" alt="">
              ${dest.name.toUpperCase()} (${dest.country.toUpperCase()})
              ${entry.standby ? `<span class="flight-standby">STAND BY -25%</span>` : ''}
              ${dealPercent > 0 ? `<span class="flight-deal">SISTA MINUTEN -${dealPercent}%</span>` : ''}
            </div>
            <div class="flap-meta">STRÄCKA: ${dist.toLocaleString('sv-SE')} KM · FLYGTID: ${hours} TIM · PRIS: ${price} KR</div>
            ${destEv ? `<div class="flap-event-note">* ${destEv.title}: ${destEv.effectText}</div>` : ''}
          </div>
          <div>
            ${isClosed
              ? `<span class="flap-status-closed">${closedLabel}</span>`
              : `<button class="ticket-btn" onclick="window.GT.startTravel('${destKey}', ${price}, ${hours}, false)">Köp biljett<br>${price} kr</button>`}
          </div>
        </div>
      `;
    });

    const localWonders = Object.entries(W.wonders || {}).filter(([, w]) => w.from === state.city);
    let wondersHtml = '';
    if (localWonders.length > 0) {
      wondersHtml = `
        <div style="margin-top:8px; padding-top:8px; border-top:1px dashed rgba(255, 190, 61, 0.45);">
          <div style="font-size:10px; letter-spacing:1.4px; color:#ffd875; text-transform:uppercase; font-weight:bold; margin-bottom:5px;">
            ★ Världsarv &amp; Expeditioner från ${currentCity.name}
          </div>
          ${localWonders.map(([wKey, w]) => {
            const isDone = state.doneWonders.has(wKey);
            const totalCost = w.transport + w.fee;
            const totalHours = (w.hoursEach * 2) + w.visitHours;
            return `
              <div class="flap-row" style="border-color:rgba(255,190,61,0.35); background:rgba(46,32,12,0.55);">
                <div>
                  <div class="flap-dest" style="color:#ffd875;">
                    ★ ${w.name.toUpperCase()} (${w.country.toUpperCase()})
                    ${isDone ? '<span style="margin-left:6px; font-size:10px; color:#78e08f;">✓ BESÖKT</span>' : ''}
                  </div>
                  <div class="flap-meta">${(w.transportMode || 'EXPEDITION').toUpperCase()} · TID: ${totalHours} TIM T/R · PRIS: ${totalCost} KR</div>
                </div>
                <div>
                  <button class="ticket-btn" style="background:linear-gradient(180deg,#d89b2b 0%,#9e6a12 100%); color:#1a1004;" onclick="window.GT.openWonderModal('${wKey}')">Expedition<br>${totalCost} kr</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    const totalRoutes = getCityRoutePool(state.city).length;
    const html = `
      <div class="scene-fullscreen scene-room-bg" style="background-image:url(assets/photos/airport_hall.jpg)">
        <div class="room-top-bar">
          <div class="sight-plaque">
            <h3>AVGÅNGSHALL · ${currentCity.name.toUpperCase()}</h3>
            <div class="sight-meta">Dag ${state.day} · Kassa: ${state.cash.toLocaleString('sv-SE')} kr · Direktlinjer idag: ${board.flights.length} av ${totalRoutes}</div>
          </div>
          <div style="display:flex; gap:8px;">
            ${hasBoats ? `<button class="globe-brass-btn" onclick="window.GT.openTravelModal('sea')">Till oceanhamnen »</button>` : ''}
            ${exitIconBtn(`Stanna kvar i ${currentCity.name}`)}
          </div>
        </div>
        <div class="room-counter-dock" style="display:flex; justify-content:center;">
          <div class="modal-departure-board" style="max-width:780px; width:100%; max-height:none;">
            <div class="board-header">
              <div class="board-title">AVGÅNGSTAVLA · ${currentCity.name}</div>
              <div class="board-ticket-css">BOARDING PASS · GT</div>
            </div>
            <div>
              ${flightsHtml}
              ${wondersHtml}
            </div>
            <div class="board-footnote">
              Dagens flygavgångar från ${currentCity.name} (Dag ${state.day}) · Världsarv syns även som guldstjärnor på 3D-jordgloben.
            </div>
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  // --- 3D Jordglob Modal & Visning ---
  let activeGlobeRenderer = null;
  let globeAnimFrameId = null;

  function openGlobeModal() {
    const totalDist = state.travelHistory.reduce((sum, leg) => sum + (leg.dist || 0), 0);
    let routesSummary = '';
    if (state.travelHistory.length === 0) {
      routesSummary = 'Ingen resa ännu. Flyg eller segla ut i världen för att rita ut den röda linjen!';
    } else {
      const recent = state.travelHistory.slice(-3);
      const startNum = state.travelHistory.length - recent.length;
      const prefix = startNum > 0 ? `<span style="opacity:0.7;">… (${startNum} tidigare) · </span>` : '';
      routesSummary = prefix + recent.map((leg, i) => {
        const fromName = W.cities[leg.from]?.name || leg.from;
        const toName = W.cities[leg.to]?.name || leg.to;
        return `<b>${startNum + i + 1}.</b> ${fromName} ➔ ${toName}`;
      }).join(' · ');
    }

    const activeEvs = getActiveWorldEvents().slice(0, 2);
    const eventsHtml = activeEvs.length > 0
      ? `<div style="margin-top:4px; padding-top:4px; border-top:1px dashed rgba(212,166,74,0.45);">
           <b style="color:#ffd875;">Världshändelser (Dag ${state.day}):</b>
           ${activeEvs.map(ev => `<div style="font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">• <b style="color:${ev.color || '#ffd875'};">${W.cities[ev.city]?.name}: ${ev.title}</b> (${ev.effectText})</div>`).join('')}
         </div>`
      : '';

    const html = `
      <div class="scene-fullscreen scene-globe-full">
        <canvas id="globeCanvas" width="1120" height="630"></canvas>

        <div class="globe-overlay-top">
          <div class="globe-title-plate">
            <div class="globe-plate-kicker">GLOBETROTTER · NAVIGATION</div>
            <h3>VÄRLDSKARTA</h3>
            <div class="globe-sub">AVVERKAD STRÄCKA: <b style="color:#8cf0a4;">${totalDist.toLocaleString('sv-SE')} KM</b> · <b style="color:#ffd875;">★ ${state.doneWonders.size}/${Object.keys(W.wonders).length} VÄRLDSARV</b> (KLICKA PÅ ★)</div>
          </div>
          <div class="globe-top-actions">
            <button class="bp-icon-close-btn zoom-btn" id="globeZoomInBtn" title="Zooma in" aria-label="Zooma in">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button class="bp-icon-close-btn zoom-btn" id="globeZoomOutBtn" title="Zooma ut" aria-label="Zooma ut">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            ${exitIconBtn('Stäng jordgloben')}
          </div>
        </div>

        <div class="globe-overlay-bottom">
          <div class="globe-info-strip">
            <div><b style="color:#ffd875;">Avverkade etapper:</b> ${routesSummary}</div>
            ${eventsHtml}
          </div>
        </div>
      </div>
    `;
    showModal(html);

    const canvas = document.getElementById('globeCanvas');
    if (canvas && window.GlobeRenderer) {
      activeGlobeRenderer = new window.GlobeRenderer(canvas, {
        radius: 278,
        doneWonders: state.doneWonders,
        onWonderClick: (wKey, w) => openWonderModal(wKey, w)
      });
      const curCity = W.cities[state.city];
      if (curCity) {
        activeGlobeRenderer.centerLon = curCity.lon;
        activeGlobeRenderer.centerLat = curCity.lat;
      }

      // Rotera mjukt centrerad över nuvarande stad tills spelaren klickar, drar eller zoomar
      let autoSpin = true;
      let spinPhase = 0;
      const baseLon = curCity ? curCity.lon : 18;
      const baseLat = curCity ? curCity.lat : 30;
      const stopSpin = () => { autoSpin = false; };
      canvas.addEventListener('mousedown', stopSpin);
      canvas.addEventListener('touchstart', stopSpin, { passive: true });
      canvas.addEventListener('wheel', stopSpin, { passive: true });

      const zoomInBtn = document.getElementById('globeZoomInBtn');
      const zoomOutBtn = document.getElementById('globeZoomOutBtn');
      if (zoomInBtn) {
        zoomInBtn.onclick = () => {
          stopSpin();
          activeGlobeRenderer.radius = Math.min(780, activeGlobeRenderer.radius + 70);
        };
      }
      if (zoomOutBtn) {
        zoomOutBtn.onclick = () => {
          stopSpin();
          activeGlobeRenderer.radius = Math.max(activeGlobeRenderer.baseRadius * 0.72, activeGlobeRenderer.radius - 70);
        };
      }

      const loop = () => {
        if (el.modalOverlay.classList.contains('hidden') || !document.getElementById('globeCanvas')) {
          cancelAnimationFrame(globeAnimFrameId);
          return;
        }
        if (autoSpin && !activeGlobeRenderer.isDragging) {
          spinPhase += 0.008;
          activeGlobeRenderer.centerLon = baseLon + Math.sin(spinPhase) * 22;
          activeGlobeRenderer.centerLat = baseLat;
        }
        activeGlobeRenderer.render(state.travelHistory, state.city, getActiveWorldEvents());
        globeAnimFrameId = requestAnimationFrame(loop);
      };
      globeAnimFrameId = requestAnimationFrame(loop);
    }
  }

  // Reseanimation: 3D Jordglob med röd flyglinje (BackPacker-stil)
  function startTravel(destKey, price, timeValue, isBoat) {
    if (state.cash < price) {
      alert("Du har inte råd med biljetten!");
      return;
    }
    const dest = W.cities[destKey];
    const origin = W.cities[state.city];
    const dist = getDistanceBetweenCities(state.city, destKey);
    state.departureBoard = null; // Glöm avgångstavlan vid avresa (BP1-regel)
    closeModal();

    el.travelTitle.textContent = isBoat ? 
      `RESA TILL HAVS: ${origin.name.toUpperCase()} ➔ ${dest.name.toUpperCase()}` : 
      `FLYGNING: ${origin.name.toUpperCase()} ➔ ${dest.name.toUpperCase()}`;
    
    el.travelSub.textContent = isBoat ? 
      `Distans: ${dist.toLocaleString('sv-SE')} km · ${timeValue} dagar till sjöss` : 
      `Distans: ${dist.toLocaleString('sv-SE')} km · Flygtid: ${timeValue} timmar`;

    const canvas = document.getElementById('flightGlobeCanvas');
    const flightGlobe = new window.GlobeRenderer(canvas, { interactive: false, radius: 210 });
    flightGlobe.centerLon = origin.lon;
    flightGlobe.centerLat = origin.lat;

    const globeWrap = document.getElementById('travelGlobeWrap');
    const vigWrap = document.getElementById('travelVignetteWrap');
    const vigImg = document.getElementById('travelVignetteImg');
    const vigTag = document.getElementById('travelVignetteTag');
    const vigText = document.getElementById('travelVignetteText');
    if (globeWrap) globeWrap.classList.remove('hidden');
    if (vigWrap) vigWrap.classList.add('hidden');

    el.travelCinematic.classList.remove('hidden');
    AudioMgr.play(isBoat ? 'ferry' : 'takeoff');

    let animFrame = null;
    const timers = [];
    const flightLoop = () => {
      if (el.travelCinematic.classList.contains('hidden')) return;
      flightGlobe.render(state.travelHistory, state.city);
      animFrame = requestAnimationFrame(flightLoop);
    };
    animFrame = requestAnimationFrame(flightLoop);

    let finished = false;
    function finishTrip() {
      if (finished) return;
      finished = true;
      timers.forEach(t => clearTimeout(t));
      cancelAnimationFrame(animFrame);
      if (vigWrap) vigWrap.classList.add('hidden');
      if (globeWrap) globeWrap.classList.remove('hidden');
      el.travelCinematic.classList.add('hidden');
      el.travelSkipBtn.onclick = null;

      changeCash(-price, isBoat ? `Båtbiljett till ${dest.name}` : `Flygbiljett till ${dest.name}`);
      if (isBoat) {
        state.day += timeValue;
        state.hour = 8;
      } else {
        addHours(timeValue);
      }

      // Spara resrutten i reshistoriken så den röda linjen syns permanent på globen!
      state.travelHistory.push({
        from: state.city,
        to: destKey,
        dist: dist,
        isBoat: isBoat
      });
      addJournal(`${isBoat ? 'Seglade med oceanångare' : 'Flög'} från ${origin.name} till ${dest.name} (${dist.toLocaleString('sv-SE')} km).`);

      state.city = destKey;
      AudioMgr.play('bell');
      renderCity();
      showToast(`Välkommen till ${dest.name}!`, 3000);
      if (checkRoundTheWorldVictory()) return;

      // Kolla om spelaren har ett kurirpaket för denna stad, annars trigga resehändelse!
      const hasDelivery = state.backpack.some(item => item.kind === 'kurir' && item.relayTo === destKey);
      if (hasDelivery) {
        showToast(`Du har ett stafettpaket till ${dest.name}! Gå till hotellet för belöning!`, 4000);
      } else {
        maybeTriggerTravelEvent(isBoat);
      }
    }

    el.travelSkipBtn.onclick = finishTrip;

    function playArrivalVignettes() {
      if (finished || !vigWrap || !vigImg) { finishTrip(); return; }
      const airClips = [
        { img: 'assets/travel/plane_wing.jpg', tag: 'INFLYGNING', text: `Går ner genom molntäcket mot ${dest.name}...` },
        { img: 'assets/travel/plane_landing.jpg', tag: 'LANDNING', text: `Landningsstället ute — hjulen tar mark i ${dest.name}!` },
        { img: 'assets/travel/plane_runway.jpg', tag: 'ANKOMSTTERMINAL', text: `Taxar in mot gaten på flygplatsen i ${dest.name}...` }
      ];
      const seaClips = [
        { img: 'assets/travel/ship_ocean.jpg', tag: 'LAND I SIKTE', text: `Kustlinjen vid ${dest.name} reser sig vid horisonten...` },
        { img: 'assets/travel/ship_harbor.jpg', tag: 'HAMNANKOMST', text: `Trossarna kastas iland vid kajen i ${dest.name}!` }
      ];
      const clip1 = isBoat
        ? seaClips[Math.floor(Math.random() * seaClips.length)]
        : airClips[Math.floor(Math.random() * airClips.length)];
      const firstSightKey = (dest.highlights || [])[0];
      const cityPhoto = (firstSightKey && W.places[firstSightKey]?.photo) || dest.skyline || clip1.img;

      const showSlide = (src, tag, text, panClass) => {
        vigImg.className = 'travel-vignette-img';
        void vigImg.offsetWidth;
        vigImg.src = src;
        vigImg.classList.add(panClass);
        if (vigTag) vigTag.textContent = tag;
        if (vigText) vigText.textContent = text;
      };

      if (globeWrap) globeWrap.classList.add('hidden');
      vigWrap.classList.remove('hidden');
      showSlide(clip1.img, clip1.tag, clip1.text, 'pan-zoom');

      timers.push(setTimeout(() => {
        if (finished) return;
        showSlide(cityPhoto, `VÄLKOMMEN TILL ${dest.name.toUpperCase()}`, `${dest.country} · ${dest.tagline || 'Ett nytt kapitel på resan väntar!'}`, 'pan-slide');
      }, 2100));

      timers.push(setTimeout(() => {
        finishTrip();
      }, 4200));
    }

    // Starta den animerade röda flyglinjen på 3D-jordgloben med lugn inzoomning, följt av ankomstbilder!
    flightGlobe.animateFlight(state.city, destKey, () => {
      timers.push(setTimeout(playArrivalVignettes, 550));
    }, isBoat);
  }

  // --- Hotell (90-tals diegetisk receptionsdisk & separat Pub/Kafé-scen — ingen gästbok!) ---
  function openHotelModal(tab = 'reception', tavernHtml = null) {
    const city = W.cities[state.city];
    const hotel = city.hotel || { name: 'Vandrarhem', price: 400 };
    const tavern = (W.taverns && W.taverns[state.city]) || { name: 'Hotellbaren', drink: 'en runda', drinkCost: 120, vibe: 'Sorl av resenärer.' };
    const hasFreeNight = state.freeHotelCities.has(state.city);
    const effectivePrice = hasFreeNight ? 0 : hotel.price;

    // Kolla om spelaren bär på ett stafettpaket (kurir) som ska lämnas i JUST DENNA stad!
    const deliverableIdx = state.backpack.findIndex(item => item.kind === 'kurir' && item.relayTo === state.city);
    const deliverCard = deliverableIdx >= 0 ? (() => {
      const pkg = state.backpack[deliverableIdx];
      return `
        <div class="tavern-encounter-box" style="margin:0; border-left-color:#2f7d43; max-width:340px;">
          <span class="relay-badge" style="background:#2f7d43;">KURIRLEVERANS!</span>
          <div>Kontakten väntar på <b>${pkg.name}</b>!</div>
          <button class="stamp-action-btn" style="margin-top:6px; padding:6px 12px; font-size:12px; background:#2f7d43; border-color:#6bc982;" onclick="window.GT.deliverRelayQuest(${deliverableIdx})">
            Lämna över (+${pkg.rewardCash} kr &amp; gratis natt!)
          </button>
        </div>
      `;
    })() : '';

    if (tab === 'tavern') {
      const html = `
        <div class="scene-fullscreen scene-hotel-desk" style="background-image:url(${getTavernPhoto(state.city)})">
          <div class="room-top-bar">
            <div class="sight-plaque">
              <h3>${tavern.name}</h3>
              <div class="sight-meta">${hotel.name}, ${city.name} · ${tavern.vibe}</div>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="globe-brass-btn" onclick="window.GT.openHotelModal('reception')">« Tillbaka till receptionen</button>
              ${exitIconBtn('Ut på stan')}
            </div>
          </div>

          <div class="tavern-floor-grid">
            <div class="tavern-chalkboard">
              <div class="chalk-title">IKVÄLL I BAREN</div>
              <button class="chalk-choice-btn" onclick="window.GT.tavernListen()">
                Sätt dig &amp; lyssna vid bardisken
                <small>1 timme · Gratis · Hör rykten om världen</small>
              </button>
              <button class="chalk-choice-btn" onclick="window.GT.tavernBuyRound()">
                Bjud bordet på ${tavern.drink}
                <small>1 timme · -${tavern.drinkCost} kr · Chans på stafettuppdrag!</small>
              </button>
            </div>

            <div>
              ${deliverCard}
              ${tavernHtml || `<div class="tavern-encounter-box">Sorlet går högt inne på <b>${tavern.name}</b>. Bjuder du grannbordet på en runda lossnar tungorna — kanske söker någon en pålitlig kurir till nästa världsdel!</div>`}
            </div>
          </div>
        </div>
      `;
      showModal(html);
      return;
    }

    // Receptionsscenen (stadsanpassat hotellfoto + fysisk mahognydisk med mässingsklocka & pubskylt!)
    const html = `
      <div class="scene-fullscreen scene-hotel-desk" style="background-image:url(${getHotelPhoto(state.city)})">
        <div class="room-top-bar">
          <div class="sight-plaque">
            <h3>${hotel.name}</h3>
            <div class="sight-meta">${city.name} · Dag ${state.day} · ${hasFreeNight ? 'GRATIS NATT INNESTÅENDE!' : hotel.price + ' kr / natt'}</div>
          </div>
          ${exitIconBtn('Ut på stan')}
        </div>

        <div class="hotel-mahogany-counter">
          <button class="desk-bell-object" onclick="window.GT.sleepHotel(${effectivePrice})">
            <div class="brass-bell-css" aria-hidden="true"><span class="bell-knob"></span><span class="bell-dome"></span><span class="bell-base"></span></div>
            <div>
              <span class="room-key-tag">RUM ${100 + state.day}</span>
              <div style="font-family:Georgia,serif; font-size:15px; font-weight:bold;">Ring i klockan &amp; checka in</div>
              <div style="font-size:11.5px; color:#d4b88c; margin-top:2px;">
                ${hasFreeNight ? 'GRATIS (Bjuden via stafettuppdrag!)' : 'Avsluta dag ' + state.day + ' · Kostnad: -' + hotel.price + ' kr'}
              </div>
            </div>
          </button>

          ${deliverCard}

          <button class="tavern-door-sign" onclick="window.GT.openHotelModal('tavern')">
            <div class="sign-main">Stig in i ${tavern.name} »</div>
            <div class="sign-sub">Prata med resenärer · Bjud på en runda · Stafettuppdrag</div>
          </button>
        </div>
      </div>
    `;
    showModal(html);
  }

  function tavernListen() {
    addHours(1);
    AudioMgr.play('klick');
    const activeEvs = getActiveWorldEvents();
    const city = W.cities[state.city];
    const hiddenSights = [...(city.highlights || []), ...(city.extras || [])].filter(
      k => !state.discoveredPlaces.has(k) && !state.donePlaces.has(k)
    );
    let msg = '';
    if (hiddenSights.length > 0) {
      const revealKey = hiddenSights[Math.floor(Math.random() * hiddenSights.length)];
      const revealPlace = W.places[revealKey];
      state.discoveredPlaces.add(revealKey);
      saveGame();
      renderCitySpots(city);
      msg = `Bartendern ritar ett kryss på din stadskarta: <i>"Missa inte <b>${revealPlace ? revealPlace.name : revealKey}</b> medan du är i ${city.name}! Jag markerade vägen åt dig."</i>`;
    } else if (activeEvs.length > 0) {
      const ev = activeEvs[Math.floor(Math.random() * activeEvs.length)];
      msg = `Du smyger ner på en barstol och råkar höra två reseledare viska: <i>"Har du hört om <b>${ev.title}</b> i ${W.cities[ev.city]?.name}? ${ev.effectText}"</i>`;
    } else {
      msg = `Två luttrade backpackers vid grannbordet diskuterar souvenirpriser: <i>"Köp billigt i ${city.name}, men sälj så långt bort över jordgloben du bara kan!"</i>`;
    }
    openHotelModal('tavern', `<div class="tavern-encounter-box"><b>Tjuvlyssnat vid baren (1 tim):</b><br>${msg}</div>`);
  }

  function tavernBuyRound() {
    const tavern = (W.taverns && W.taverns[state.city]) || { name: 'Hotellbaren', drink: 'en runda', drinkCost: 120 };
    if (state.cash < tavern.drinkCost) {
      showToast('Du har inte råd att bjuda på en runda just nu!', 2200);
      return;
    }
    changeCash(-tavern.drinkCost, `Bjöd på runda på ${tavern.name}`);
    AudioMgr.play('clink');
    addHours(1);

    // Leta upp ett stafettuppdrag från denna stad som spelaren inte redan har/slutfört
    const quest = (W.relayQuests || []).find(q =>
      q.from === state.city &&
      !state.completedRelays.has(q.id) &&
      !state.backpack.some(item => item.relayId === q.id)
    );

    if (quest) {
      const destCity = W.cities[quest.to];
      const box = `
        <div class="tavern-encounter-box">
          <span class="relay-badge">STAFETTUPPDRAG ERBJUDS!</span>
          <div><b>${quest.giver}</b> slår sig ner vid ditt bord med ett leende efter att du bjudit på ${tavern.drink}:</div>
          <div style="margin:6px 0; font-style:italic;">"${quest.desc}"</div>
          <div style="font-size:12px; color:#2f7d43; font-weight:bold;">
            Destination: ${destCity ? destCity.name : quest.to} · Belöning: +${quest.rewardCash} kr + 1 gratis hotellnatt!
          </div>
          <div style="margin-top:8px;">
            <button class="stamp-action-btn" style="padding:6px 14px; font-size:12px;" onclick="window.GT.acceptRelayQuest('${quest.id}')">
              Ta emot paketet: ${quest.itemName} (1 plats i ryggsäcken)
            </button>
          </div>
        </div>
      `;
      openHotelModal('tavern', box);
    } else {
      const dealCities = Object.keys(W.cities).filter(k => k !== state.city);
      const tipCity = dealCities[Math.floor(Math.random() * dealCities.length)];
      state.deals[tipCity] = Math.max(state.deals[tipCity] || 0, 20);
      renderCitySpots(W.cities[state.city]);
      const box = `
        <div class="tavern-encounter-box">
          <b>God stämning på ${tavern.name}!</b><br>
          En flygvärdinna vid bardisken tackar för rundan och viskar ett hemligt tips: hon ordnar <b>20 % kompisrabatt på flyg till ${W.cities[tipCity].name}</b> direkt på avgångstavlan!
        </div>
      `;
      openHotelModal('tavern', box);
    }
  }

  function acceptRelayQuest(questId) {
    const quest = (W.relayQuests || []).find(q => q.id === questId);
    if (!quest) return;
    if (state.backpack.length >= getMaxBackpackSlots()) {
      showToast('Ryggsäcken är full! Sälj något först för att få plats med paketet.', 2600);
      return;
    }
    state.backpack.push({
      id: quest.id,
      name: quest.itemName,
      origin: quest.from,
      buyPrice: 0,
      buyDay: state.day,
      kind: 'kurir',
      relayId: quest.id,
      relayTo: quest.to,
      rewardCash: quest.rewardCash,
      freeHotel: quest.freeHotel
    });
    AudioMgr.play('right1');
    addJournal(`Tog emot ett stafettuppdrag av ${quest.giver} i ${W.cities[state.city].name}: leverera ${quest.itemName} till ${W.cities[quest.to]?.name}.`);
    updateHUD();
    showToast(`Packade ner ${quest.itemName} till ${W.cities[quest.to]?.name}!`, 2600);
    openHotelModal('tavern', `<div class="tavern-encounter-box" style="border-left-color:#2f7d43;"><b>Uppdrag antaget!</b> ${quest.itemName} ligger säkert i din ryggsäck. Lämna över det på hotellet när du kommer fram till <b>${W.cities[quest.to]?.name}</b>!</div>`);
  }

  function deliverRelayQuest(backpackIdx) {
    const pkg = state.backpack[backpackIdx];
    if (!pkg || pkg.kind !== 'kurir') return;
    state.backpack.splice(backpackIdx, 1);
    state.completedRelays.add(pkg.relayId);
    changeCash(pkg.rewardCash, `Stafettbelöning: ${pkg.name}`);
    if (pkg.freeHotel) {
      state.freeHotelCities.add(state.city);
    }
    AudioMgr.play('fanfar');
    addJournal(`Levererade stafettpaketet ${pkg.name} i ${W.cities[state.city].name} och fick +${pkg.rewardCash} kr samt gratis hotellnatt!`);
    showToast(`Stafettuppdrag klart! +${pkg.rewardCash} kr & gratis hotellnatt!`, 3200);
    openHotelModal('reception');
  }

  function sleepHotel(price) {
    if (price === 0 && state.freeHotelCities.has(state.city)) {
      state.freeHotelCities.delete(state.city);
      state.dayLog.activities.push('Gratis hotellnatt (stafettbelöning)');
    } else if (state.cash < price) {
      showToast("Du har ont om pengar! Du tar ett enklare logi på tågstationen.", 3000);
      addJournal(`Sov på en bänk på tågstationen i ${W.cities[state.city].name} med tom plånbok.`);
    } else {
      changeCash(-price, 'Hotellnatt');
    }

    AudioMgr.play('hotel');

    const acts = state.dayLog.activities.length > 0 ? 
      state.dayLog.activities.map(a => `<li>${a}</li>`).join('') : 
      '<li>En lugn dag utan större strapatser.</li>';

    const teaser = TEASERS[state.day % TEASERS.length];

    state.deals = {};
    const routePool = getCityRoutePool(state.city).map(r => r.to);
    const cities = routePool.length > 0 ? routePool : Object.keys(W.cities).filter(k => k !== state.city);
    const luckyCity = cities[Math.floor(Math.random() * cities.length)];
    state.deals[luckyCity] = 25; // 25% sista-minuten-rabatt
    state.departureBoard = null; // Ny dag = ny avgångstavla i morgon bitti!

    const reportHtml = `
      <div class="modal-hotel-ledger" style="max-width:600px;">
        <h3 style="margin:0 0 10px; font-family:Georgia,serif; color:#4d2f18; border-bottom:2px solid #8c6832; padding-bottom:6px;">Kvällsrapport · Dag ${state.day}</h3>
        <p style="font-weight:600; color:#5b3b1c; margin:0 0 6px;">Dagens anteckningar:</p>
        <ul style="margin-left:20px; font-size:13.5px; line-height:1.6;">
          ${acts}
        </ul>
        <div class="guestbook-note" style="margin-top:12px;">
          <div style="font-weight:bold; font-style:normal; color:#7a4f12; margin-bottom:4px;">Morgondagens spaning:</div>
          <div>${teaser}</div>
          <div style="margin-top:5px; font-style:normal; font-size:12px; color:#9c2b23;"><b>Tips:</b> Sista-minuten-rabatt (-25 %) till ${W.cities[luckyCity].name} anslås imorgon!</div>
        </div>
        <div class="modal-footer" style="margin-top:14px;">
          <button class="stamp-action-btn" onclick="window.GT.wakeUpNextDay()">God morgon! (Börja Dag ${state.day + 1})</button>
        </div>
      </div>
    `;

    showModal(reportHtml);
  }

  function wakeUpNextDay() {
    state.day++;
    state.hour = 8;
    state.dayLog.activities = [];

    if (state.day > W.dayLimit) {
      triggerGameOver(false);
      return;
    }

    closeModal();
    renderCitySpots(W.cities[state.city]);
    updateHUD();
    const daysLeft = W.dayLimit - state.day;
    if (daysLeft <= 5 && state.city !== W.startCity) {
      showToast(`SLUTSPURT! Endast ${daysLeft} dagar kvar — dags att ta dig hem till Stockholm!`, 4000);
    } else {
      showToast(`Dag ${state.day} har grytt! Klockan är 08:00.`, 2500);
    }
  }

  // --- Ryggsäcksvy (Fullskärms 90-tals vy med stor roterande 3D-vandringsryggsäck!) ---
  let backpackAnimFrameId = null;

  function openBackpackModal() {
    let itemsHtml = '';
    if (state.backpack.length === 0) {
      itemsHtml = '<p style="padding:12px; color:#d6c5a5; font-style:italic;">Din vandringsryggsäck är tom. Köp souvenirer i basaren eller ta emot ett stafettpaket i hotellbaren!</p>';
    } else {
      state.backpack.forEach(item => {
        if (item.kind === 'kurir') {
          const destName = W.cities[item.relayTo]?.name || item.relayTo;
          itemsHtml += `
            <div class="item-row" style="border-left:4px solid #b82323;">
              <div class="item-header">
                <span><b>[KURIRPAKET]</b> ${item.name}</span>
                <span class="item-price" style="color:#8c2323;">Belöning: +${item.rewardCash} kr</span>
              </div>
              <div class="item-desc">Stafettuppdrag! Lämna över på hotellet i <b>${destName}</b> för hittelön + 1 gratis hotellnatt.</div>
            </div>
          `;
          return;
        }
        const def = W.souvenirs[item.id] || {};
        const val = getEffectiveSellInfo(item);
        itemsHtml += `
          <div class="item-row">
            <div class="market-card-with-img">
              <img class="souvenir-thumb" src="${getSouvenirPhoto(item.id)}" alt="${item.name}" onerror="this.style.display='none'">
              <div class="market-card-main">
                <div class="item-header">
                  <span>${item.name} (${def.kind || 'föremål'})</span>
                  <span class="item-price">Värde här: ${val.price} kr</span>
                </div>
                <div class="item-desc">${def.desc || ''}</div>
                ${def.effect ? `<div style="font-size:11px; color:#8c5a0b; font-weight:600;">Egenskap: ${def.effect}</div>` : ''}
                <div style="font-size:11px; color:#5b4a36;">
                  Inköpt i ${W.cities[item.origin]?.name || item.origin} för ${item.buyPrice} kr på dag ${item.buyDay}.
                </div>
              </div>
            </div>
          </div>
        `;
      });
    }

    const html = `
      <div class="scene-fullscreen scene-passport-full">
        <div style="width:100%; height:100%; display:flex; flex-direction:column; padding:14px 20px; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="sight-plaque">
              <h3>DIN VANDRINGSRYGGSÄCK (${state.backpack.length} / ${getMaxBackpackSlots()} PLATSER)</h3>
              <div class="sight-meta">Dra på ryggsäcken för att snurra 3D-modellen · Packning & kurirpaket</div>
            </div>
            ${exitIconBtn('Stäng ryggsäcken')}
          </div>

          <div style="flex:1; min-height:0; display:grid; grid-template-columns: 320px 1fr; gap:16px; align-items:center;">
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; background:radial-gradient(circle at center, rgba(60,42,24,0.55) 0%, rgba(12,8,5,0.85) 75%); border:2px solid #9e7537; border-radius:6px; box-shadow:inset 0 0 28px rgba(0,0,0,0.8);">
              <canvas id="backpackModalCanvas" width="300" height="360" style="width:100%; height:100%; max-height:360px; object-fit:contain;"></canvas>
            </div>
            <div class="room-dark-panel" style="height:100%; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">
              <div class="shop-col-title" style="margin-bottom:4px;">Packat i säcken</div>
              ${itemsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
    showModal(html);

    const bpCanvas = document.getElementById('backpackModalCanvas');
    if (bpCanvas && window.Backpack3DRenderer) {
      const bp3d = new window.Backpack3DRenderer(bpCanvas, { interactive: true, zoom: 4.2, speed: 0.012 });
      const loop = () => {
        if (el.modalOverlay.classList.contains('hidden') || !document.getElementById('backpackModalCanvas')) {
          cancelAnimationFrame(backpackAnimFrameId);
          return;
        }
        bp3d.render();
        backpackAnimFrameId = requestAnimationFrame(loop);
      };
      backpackAnimFrameId = requestAnimationFrame(loop);
    }
  }

  // --- Modernt Svenskt Pass (Bläddringsbar passbok med dynamiska stämpelsidor för alla 16 städer!) ---
  function openPassportModal(spreadIdx = 0) {
    AudioMgr.play('paper');
    const allCityKeys = Object.keys(W.cities);
    const visaSpreads = Math.ceil(allCityKeys.length / 6); // 6 städer per uppslag (3 vänster + 3 höger)
    const totalSpreads = 1 + visaSpreads + 1; // Uppslag 0: ID, 1..visaSpreads: Stämplar, sista: Dagbok & Museum
    const spread = Math.max(0, Math.min(totalSpreads - 1, spreadIdx));
    const totalDist = state.travelHistory.reduce((sum, leg) => sum + (leg.dist || 0), 0);
    const accuracy = state.questionsTotal > 0 ? Math.round((state.questionsCorrect / state.questionsTotal) * 100) : 100;

    let leftPageHtml = '';
    let rightPageHtml = '';

    if (spread === 0) {
      // UPPSLAG 1: Redan uppslaget pass — Sida 1 (Datasidan till vänster) + Sida 2 (Officiella anteckningar & Resestatus till höger)
      const regionsVisited = getVisitedRegions().size;
      leftPageHtml = `
        <div class="passport-page left polycarbonate-id">
          <div style="position:relative; z-index:3;">
            <div class="passport-id-header">
              <span>SVERIGE · SWEDEN · SUÈDE</span>
              <span>TYP P · SWE · GT960412</span>
            </div>
            <div class="passport-id-grid">
              <div class="passport-photo-frame">
                <img src="assets/photos/gamlastan.jpg" alt="Resenär i Stockholm">
              </div>
              <div class="passport-fields">
                <div>
                  <div class="pp-field-lbl">1. Efternamn / Surname</div>
                  <div class="pp-field-val">${(state.playerLastName || 'GLOBETROTTER').toUpperCase()}</div>
                </div>
                <div>
                  <div class="pp-field-lbl">2. Förnamn / Given names</div>
                  <div class="pp-field-val">${(state.playerFirstName || 'RESENÄR').toUpperCase()}</div>
                </div>
                <div>
                  <div class="pp-field-lbl">3. Nationalitet / Nationality</div>
                  <div class="pp-field-val">SVENSK / SWE</div>
                </div>
                <div>
                  <div class="pp-field-lbl">4. Hemort / Place of birth</div>
                  <div class="pp-field-val">${(W.cities[W.startCity]?.name || 'Malmö').toUpperCase()}</div>
                </div>
                <div>
                  <div class="pp-field-lbl">5. Myndighet / Authority</div>
                  <div class="pp-field-val">GLOBETROTTERKLUBBEN</div>
                </div>
                <div>
                  <div class="pp-field-lbl">6. Giltighet / Expiry</div>
                  <div class="pp-field-val">Dag ${state.day} av ${W.dayLimit}</div>
                </div>
              </div>
            </div>
          </div>
          <div style="position:relative; z-index:3;">
            <div class="passport-mrz">
              P&lt;SWE${(state.playerLastName || 'GLOBETROTTER').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 14)}&lt;&lt;${(state.playerFirstName || 'RESENAR').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 12)}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br>
              GT9604128SWE${String(state.day).padStart(2, '0')}11205M3012319&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
            </div>
            <div class="passport-page-num">Sida 1 · Datasida</div>
          </div>
        </div>
      `;

      const goals = ensureJourneyGoals();
      const compCount = state.competencies.length;
      const compDone = compCount >= goals.requiredCompetencies;
      const regDone = regionsVisited >= goals.requiredRegions;
      const compNames = compCount > 0
        ? state.competencies.map(c => c.title).join(', ')
        : 'Inga ännu — ta jobb i dagstidningen (minst 3/4 rätt)';

      const souvenirChecklistHtml = goals.souvenirCities.map(ck => {
        const cName = W.cities[ck]?.name || ck;
        const found = hasGoalSouvenirFrom(ck);
        return `
          <div style="display:flex; justify-content:space-between; font-size:10.5px; padding:2px 0; border-bottom:1px dotted rgba(130,108,78,0.35);">
            <span>${found ? '<b style="color:#246b36;">✓</b>' : '○'} <b>${cName}</b></span>
            <span style="color:${found ? '#246b36' : '#7a5c3c'};">${found ? (found.mailed ? `Postad hem (${found.item.name})` : found.item.name) : 'Saknas'}</span>
          </div>
        `;
      }).join('');
      const souvDoneCount = goals.souvenirCities.filter(ck => Boolean(hasGoalSouvenirFrom(ck))).length;

      rightPageHtml = `
        <div class="passport-page right">
          <div>
            <div class="visa-page-title">OFFICIELLA MÅL / RESEUPPDRAG</div>
            <div style="background:transparent; border-bottom:1px dotted rgba(130,108,78,0.45); padding:4px 2px 7px; margin-bottom:7px;">
              <div style="font-size:10px; font-weight:bold; letter-spacing:0.6px; color:#6b461e; text-transform:uppercase; margin-bottom:4px;">
                Krav för att klara resan hem till ${W.cities[W.startCity]?.name || 'Malmö'}:
              </div>
              <div style="font-size:11px; color:#2b2015; margin-bottom:3px;">
                ${regDone ? '<b style="color:#246b36;">✓</b>' : '○'} <b>Världsdelar:</b> ${regionsVisited} / ${goals.requiredRegions}
              </div>
              <div style="font-size:11px; color:#2b2015; margin-bottom:2px;">
                ${compDone ? '<b style="color:#246b36;">✓</b>' : '○'} <b>Yrkeskompetens:</b> ${compCount} / ${goals.requiredCompetencies} yrken
              </div>
              <div style="font-size:9.5px; color:#5b4a36; font-style:italic; margin:0 0 5px 12px; line-height:1.3;">
                ${compNames}
              </div>
              <div style="font-size:11px; color:#2b2015; margin-bottom:2px;">
                ${souvDoneCount >= goals.souvenirCities.length ? '<b style="color:#246b36;">✓</b>' : '○'} <b>Souvenirer hem (${souvDoneCount}/${goals.souvenirCities.length}):</b>
              </div>
              <div style="margin-left:8px;">
                ${souvenirChecklistHtml}
              </div>
            </div>
            <div class="passport-fields" style="background:transparent; padding:4px 2px; gap:4px 10px;">
              <div>
                <div class="pp-field-lbl">Stämplar</div>
                <div class="pp-field-val">${state.stamps.length} / ${allCityKeys.length}</div>
              </div>
              <div>
                <div class="pp-field-lbl">Underverk</div>
                <div class="pp-field-val">${state.doneWonders.size} / ${Object.keys(W.wonders).length}</div>
              </div>
              <div>
                <div class="pp-field-lbl">Sträcka</div>
                <div class="pp-field-val">${totalDist.toLocaleString('sv-SE')} km</div>
              </div>
              <div>
                <div class="pp-field-lbl">Kunskap</div>
                <div class="pp-field-val">${accuracy} % rätt</div>
              </div>
            </div>
          </div>
          <div class="passport-page-num">Sida 2</div>
        </div>
      `;
    } else if (spread >= 1 && spread <= visaSpreads) {
      // UPPSLAG 2..N: Viseringar & Stämplar (6 städer per uppslag, 3 per sida)
      const offset = (spread - 1) * 6;
      const pageNumLeft = 1 + spread * 2;
      const pageNumRight = pageNumLeft + 1;
      const renderVisaCol = (keys) => keys.map(k => {
        const c = W.cities[k];
        const stamped = state.stamps.includes(k);
        const doneCount = c.highlights.filter(h => state.donePlaces.has(h)).length;
        const totalCount = c.highlights.length;
        return `
          <div class="visa-slot ${stamped ? 'stamped' : ''}">
            <div>
              <div style="font-family:Georgia,serif; font-weight:bold; font-size:13px; color:${stamped ? '#7a1c21' : '#4a3d2e'};">${c.name}</div>
              <div style="font-size:10.5px; color:#6b5c49;">${c.country} · Sevärdheter: <b>${doneCount}/${totalCount}</b></div>
              <div style="font-size:10px; color:${stamped ? '#2f7d43' : '#887a68'}; margin-top:2px;">
                ${stamped ? 'Officiellt stämplad!' : (state.visitedCities.has(k) ? `Besökt — gör alla ${totalCount} för stämpel` : 'Ej besökt ännu')}
              </div>
            </div>
            ${stamped
              ? renderCityStampHtml(k, false)
              : `<div style="width:52px; height:40px; border:1px dotted #b8a68a; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:8px; color:#a3937b; text-transform:uppercase;">Tom ruta</div>`
            }
          </div>
        `;
      }).join('');

      leftPageHtml = `
        <div class="passport-page left">
          <div class="visa-page-title">VISERINGAR / VISAS</div>
          <div class="visa-slots-grid">${renderVisaCol(allCityKeys.slice(offset, offset + 3))}</div>
          <div class="passport-page-num">Sida ${pageNumLeft}</div>
        </div>
      `;
      rightPageHtml = `
        <div class="passport-page right">
          <div class="visa-page-title">VISERINGAR / VISAS</div>
          <div class="visa-slots-grid">${renderVisaCol(allCityKeys.slice(offset + 3, offset + 6))}</div>
          <div class="passport-page-num">Sida ${pageNumRight}</div>
        </div>
      `;
    } else {
      // UPPSLAG 3: Resedagbok (vänster) + Permanent Hemmamuseum (höger)
      let museum = [];
      try { museum = JSON.parse(localStorage.getItem('gt_museum') || '[]'); } catch (e) {}
      const museumHtml = museum.length === 0
        ? '<p style="color:#7a6b57; font-style:italic; font-size:12px;">Museet är tomt. Souvenirer du tar med dig hem vid resans slut ställs ut här för alltid!</p>'
        : `<div style="display:flex; flex-wrap:wrap; gap:6px;">${museum.map(m => `<div style="border:1px solid #b89f78; padding:4px 8px; background:#fffdf7; font-size:11.5px;"><b>${m.name}</b> <small>(${m.origin})</small></div>`).join('')}</div>`;

      const journalHtml = state.journal.slice().reverse().map(j => `
        <div class="scrapbook-entry"><span class="scrapbook-day">Dag ${j.day}:</span> ${j.text}</div>
      `).join('');

      leftPageHtml = `
        <div class="passport-page left">
          <div class="visa-page-title">RESEDAGBOK / JOURNAL</div>
          <div class="scrapbook-box" style="flex:1; max-height:none; margin-top:0;">${journalHtml}</div>
          <div class="passport-page-num">Sida 4</div>
        </div>
      `;
      rightPageHtml = `
        <div class="passport-page right">
          <div>
            <div class="visa-page-title">PERMANENT HEMMAMUSEUM</div>
            ${museumHtml}
            <div style="margin-top:14px; padding-top:10px; border-top:1px dashed #b8a68a; text-align:center;">
              <button class="stamp-action-btn" style="font-size:12px; padding:7px 14px;" onclick="window.GT.exportTravelPostcard()">Spara resevykort från din resa (PNG)</button>
            </div>
          </div>
          <div class="passport-page-num">Sida 5</div>
        </div>
      `;
    }

    const html = `
      <div class="scene-fullscreen scene-passport-full">
        <div class="passport-book-shell">
          <div class="passport-nav-bar">
            <div style="font-family:Georgia,serif; color:#ffd875; font-size:14px; font-weight:bold;">
              SVENSKT RESEPASS · Uppslag ${spread + 1} av ${totalSpreads}
            </div>
            ${exitIconBtn('Stäng passet')}
          </div>

          <div class="passport-spread">
            ${leftPageHtml}
            ${rightPageHtml}
          </div>

          <div class="passport-nav-bar">
            <button class="globe-brass-btn" ${spread === 0 ? 'disabled style="opacity:0.4; cursor:default;"' : `onclick="window.GT.openPassportModal(${spread - 1})"`}>« Bläddra bakåt</button>
            <div style="display:flex; gap:6px;">
              <button class="globe-brass-btn" style="${spread === 0 ? 'border-color:#ffd875; color:#ffd875;' : ''}" onclick="window.GT.openPassportModal(0)">ID-sida</button>
              <button class="globe-brass-btn" style="${spread >= 1 && spread <= visaSpreads ? 'border-color:#ffd875; color:#ffd875;' : ''}" onclick="window.GT.openPassportModal(1)">Stämplar (${state.stamps.length}/${allCityKeys.length})</button>
              <button class="globe-brass-btn" style="${spread === totalSpreads - 1 ? 'border-color:#ffd875; color:#ffd875;' : ''}" onclick="window.GT.openPassportModal(${totalSpreads - 1})">Dagbok &amp; Museum</button>
            </div>
            <button class="globe-brass-btn" ${spread >= totalSpreads - 1 ? 'disabled style="opacity:0.4; cursor:default;"' : `onclick="window.GT.openPassportModal(${spread + 1})"`}>Bläddra framåt »</button>
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  // --- Resehändelser under flyg / oceanresa ---
  let activeTravelEvent = null;

  let lastTravelEventLeg = -10;

  function maybeTriggerTravelEvent(isBoat) {
    const pool = (W.travelEvents && (isBoat ? W.travelEvents.boat : W.travelEvents.flight)) || [];
    if (pool.length === 0) return;

    // Mer sällsynta & speciella resehändelser: aldrig två resor i rad, 25 % chans på flyg, 45 % på båt
    const currentLeg = state.travelHistory.length;
    if (currentLeg - lastTravelEventLeg < 2) return;
    const chance = isBoat ? 0.45 : 0.25;
    if (Math.random() > chance) return;

    lastTravelEventLeg = currentLeg;
    const ev = pool[Math.floor(Math.random() * pool.length)];
    activeTravelEvent = ev;

    const cityName = W.cities[state.city]?.name || state.city;
    const photoSrc = isBoat
      ? (Math.random() < 0.5 ? 'assets/travel/ship_ocean.jpg' : 'assets/travel/ship_harbor.jpg')
      : (Math.random() < 0.5 ? 'assets/travel/plane_wing.jpg' : 'assets/travel/plane_runway.jpg');
    const letters = ['A', 'B', 'C'];

    const choicesHtml = ev.choices.map((ch, idx) => `
      <button class="travel-event-choice" onclick="window.GT.resolveTravelEvent(${idx})">
        <span class="travel-choice-seal">${letters[idx] || (idx + 1)}</span>
        <span class="travel-choice-label">${ch.label}</span>
      </button>
    `).join('');

    const html = `
      <div class="travel-event-shell">
        <div class="travel-event-photo-col">
          <div class="travel-event-polaroid">
            <img src="${photoSrc}" alt="Resehändelse">
            <div class="travel-polaroid-cap">${isBoat ? 'TILL SJÖSS' : 'UNDER RESAN'} · DAG ${state.day}</div>
          </div>
        </div>
        <div class="travel-event-body-col">
          <div class="travel-event-kicker">${isBoat ? 'OVÄNTAT TILL SJÖSS' : 'OVÄNTAD RESEHÄNDELSE'} · ${cityName.toUpperCase()}</div>
          <h3 class="travel-event-heading">${ev.title}</h3>
          <p class="travel-event-story">${ev.text}</p>
          <div class="travel-event-choices">${choicesHtml}</div>
        </div>
      </div>
    `;
    setTimeout(() => {
      AudioMgr.play('paper');
      showModal(html);
    }, 420);
  }

  function resolveTravelEvent(choiceIdx) {
    if (!activeTravelEvent) { closeModal(); return; }
    const ch = activeTravelEvent.choices[choiceIdx];
    activeTravelEvent = null;
    if (!ch) { closeModal(); return; }

    if (ch.gamble) {
      if (Math.random() < ch.gamble.chance) {
        changeCash(ch.gamble.win, 'Vinst på resan');
        AudioMgr.play('right1');
        showToast(`Snyggt! Du vann +${ch.gamble.win} kr!`, 2800);
      } else {
        changeCash(ch.gamble.lose, 'Förlust i salongen');
        AudioMgr.play('wrong1');
        showToast(`Otur! Du förlorade ${Math.abs(ch.gamble.lose)} kr.`, 2800);
      }
    } else if (ch.cash) {
      changeCash(ch.cash, ch.label);
    }

    if (ch.hours) {
      state.hour = Math.max(8, Math.min(24, state.hour + ch.hours));
    }

    if (ch.deal) {
      const routePool = getCityRoutePool(state.city).map(r => r.to);
      const others = routePool.length > 0 ? routePool : Object.keys(W.cities).filter(k => k !== state.city);
      const target = others[Math.floor(Math.random() * others.length)];
      state.deals[target] = Math.max(state.deals[target] || 0, ch.deal);
      state.departureBoard = null;
      AudioMgr.play('right1');
      showToast(`Tips! ${ch.deal} % sista-minuten-rabatt till ${W.cities[target].name}!`, 3000);
    }

    if (ch.log) addJournal(ch.log);
    closeModal();
    renderCitySpots(W.cities[state.city]);
    updateHUD();
  }

  // --- Delbart Resevykort (PNG-export) ---
  function exportTravelPostcard() {
    const c = document.createElement('canvas');
    c.width = 900;
    c.height = 540;
    const ctx = c.getContext('2d');

    // Antik vykortspapper-bakgrund
    ctx.fillStyle = '#f4ead4';
    ctx.fillRect(0, 0, 900, 540);

    // Klassisk röd-blå flygpostkant (PAR AVION)
    for (let x = 0; x < 900; x += 40) {
      ctx.fillStyle = (x / 40) % 2 === 0 ? '#b82828' : '#1f4e79';
      ctx.fillRect(x, 0, 26, 14);
      ctx.fillRect(x, 526, 26, 14);
    }
    for (let y = 14; y < 526; y += 40) {
      ctx.fillStyle = Math.floor(y / 40) % 2 === 0 ? '#1f4e79' : '#b82828';
      ctx.fillRect(0, y, 14, 26);
      ctx.fillRect(886, y, 14, 26);
    }

    // Inre ram
    ctx.strokeStyle = '#8c6832';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, 852, 492);

    // Vänster halva: Mini-3D-jordglob med dina röda rutter
    const gCanvas = document.createElement('canvas');
    gCanvas.width = 390;
    gCanvas.height = 390;
    if (window.GlobeRenderer) {
      const g = new window.GlobeRenderer(gCanvas, { interactive: false, radius: 170, centerLat: 30, centerLon: 25 });
      g.render(state.travelHistory, state.city, getActiveWorldEvents());
      ctx.fillStyle = '#071320';
      ctx.fillRect(44, 72, 390, 390);
      ctx.drawImage(gCanvas, 44, 72);
      ctx.strokeStyle = '#c99a45';
      ctx.lineWidth = 3;
      ctx.strokeRect(44, 72, 390, 390);
    }

    // Höger halva: Resehälsning & Statistik
    const totalDist = state.travelHistory.reduce((s, l) => s + (l.dist || 0), 0);
    const accuracy = state.questionsTotal > 0 ? Math.round((state.questionsCorrect / state.questionsTotal) * 100) : 100;

    ctx.fillStyle = '#7a1c21';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText('GLOBETROTTERKLUBBEN', 462, 108);

    ctx.fillStyle = '#5b462e';
    ctx.font = 'italic 15px Georgia, serif';
    ctx.fillText('PAR AVION · Jorden runt mot klockan', 462, 134);

    ctx.strokeStyle = '#b89f78';
    ctx.beginPath(); ctx.moveTo(462, 150); ctx.lineTo(845, 150); ctx.stroke();

    ctx.fillStyle = '#23170b';
    ctx.font = 'bold 19px Georgia, serif';
    ctx.fillText(`${state.playerFirstName} ${state.playerLastName}`, 462, 192);

    ctx.font = '15px Georgia, serif';
    const lines = [
      `Nuvarande stad: ${W.cities[state.city]?.name || state.city}`,
      `Resdag: Dag ${state.day} av ${W.dayLimit}`,
      `Stämplar i passet: ${state.stamps.length} av ${Object.keys(W.cities).length} städer`,
      `Besökta underverk: ${state.doneWonders.size} av ${Object.keys(W.wonders).length}`,
      `Tillryggalagd sträcka: ${totalDist.toLocaleString('sv-SE')} km`,
      `Allmänbildning: ${accuracy} % rätt`,
      `Reskassa: ${state.cash.toLocaleString('sv-SE')} kr`
    ];
    lines.forEach((line, i) => {
      ctx.fillText(line, 462, 232 + i * 30);
    });

    ctx.fillStyle = '#8c2323';
    ctx.font = 'bold 13px Courier New, monospace';
    ctx.fillText('STÄMPLAD & GODKÄND AV GLOBETROTTERKLUBBEN', 462, 462);

    const a = document.createElement('a');
    a.download = `globetrotter-vykort-dag${state.day}.png`;
    a.href = c.toDataURL('image/png');
    a.click();
    showToast('Ditt resevykort sparades som PNG!', 2600);
  }

  // --- Startskärm (90-tals Incheckning i Globetrotterklubben + Auto-save!) ---
  let startGlobeFrame = null;

  function openStartScreen() {
    const saved = getSavedSummary();
    const continueBtn = saved
      ? `<button class="bp90-menu-btn continue" onclick="window.GT.continueSavedGame()">
           <span class="bp90-btn-title">FORTSÄTT RESAN</span>
           <span class="bp90-btn-sub">${(saved.playerFirstName || 'Resenär').toUpperCase()} · DAG ${saved.day} I ${(W.cities[saved.city]?.name || saved.city).toUpperCase()}</span>
         </button>`
      : '';

    const html = `
      <div class="scene-fullscreen bp90-start-scene">
        <!-- Stor roterande 3D-jordglob rakt bakom titeln (90-tals BackPacker-stil!) -->
        <div class="bp90-globe-backdrop">
          <canvas id="startGlobeCanvas" width="760" height="760"></canvas>
        </div>
        <div class="bp90-vignette"></div>

        <!-- Centrerat 90-tals huvudmeny-skikt -->
        <div class="bp90-start-foreground">
          <div class="bp90-hero-title-wrap">
            <div class="bp90-edition-tag">SVENSKT RESEÄVENTYR · CD-ROM EDITION</div>
            <h1 class="bp90-red-logo" data-text="GLOBETROTTER">GLOBETROTTER</h1>
            <div class="bp90-tagline">Jorden runt mot klockan · Tjäna reskassan på vägen · Fyll ditt svenska pass</div>
          </div>

          <div class="bp90-menu-dock">
            <div class="bp90-passport-strip">
              <span class="bp90-strip-label">NAMN I PASSET:</span>
              <input id="inpFirstName" class="bp90-name-input" type="text" value="ALEX" maxlength="16" placeholder="Förnamn" aria-label="Förnamn">
              <input id="inpLastName" class="bp90-name-input" type="text" value="GLOBETROTTER" maxlength="18" placeholder="Efternamn" aria-label="Efternamn">
            </div>

            <div class="bp90-menu-buttons">
              ${continueBtn}
              <button class="bp90-menu-btn primary" onclick="window.GT.startNewJourney()">
                <span class="bp90-btn-title">STARTA NY RESA</span>
                <span class="bp90-btn-sub">STÄMPLA PASS &amp; AVRESA FRÅN ${(W.cities[W.startCity]?.name || 'MALMÖ').toUpperCase()} »</span>
              </button>
            </div>
          </div>

          <div class="bp90-footer-credits">
            ${Object.keys(W.cities).length} STÄDER · ${Object.keys(W.places).length} SEVÄRDHETER · ${Object.keys(W.cities).length * 3} JOBB · ${Object.keys(W.wonders).length} UNDERVERK · ${(window.GT_QUESTIONS || []).length + 60} FRÅGOR
          </div>
        </div>
      </div>
    `;
    showModal(html);

    const sc = document.getElementById('startGlobeCanvas');
    if (sc && window.GlobeRenderer) {
      const sg = new window.GlobeRenderer(sc, { interactive: false, radius: 318, centerLat: 24, centerLon: 16 });
      const loop = () => {
        if (!document.getElementById('startGlobeCanvas')) {
          cancelAnimationFrame(startGlobeFrame);
          return;
        }
        sg.centerLon = (sg.centerLon + 0.24) % 360;
        sg.render([], 'stockholm', getActiveWorldEvents());
        startGlobeFrame = requestAnimationFrame(loop);
      };
      startGlobeFrame = requestAnimationFrame(loop);
    }
  }

  function startNewJourney() {
    const fn = (document.getElementById('inpFirstName')?.value || 'RESENÄR').trim() || 'RESENÄR';
    const ln = (document.getElementById('inpLastName')?.value || 'GLOBETROTTER').trim() || 'GLOBETROTTER';
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    state.playerFirstName = fn;
    state.playerLastName = ln;
    state.competencies = [];
    state.discoveredPlaces = new Set();
    state.backpackLevel = 1;
    state.mailedHome = [];
    state.goals = generateJourneyGoals();
    const goalNames = state.goals.souvenirCities.map(ck => W.cities[ck]?.name || ck).join(', ');
    const startName = W.cities[W.startCity]?.name || 'Malmö';
    state.city = W.startCity;
    state.visitedCities = new Set([W.startCity]);
    state.journal = [{ day: 1, text: `${fn} ${ln} påbörjade jorden-runt-resan från ${startName}! Mål i passet: ${state.goals.requiredCompetencies} yrkeskompetenser samt souvenirer från ${goalNames}.` }];
    gameSessionStarted = true;
    saveGame();
    AudioMgr.play('fanfar');
    closeModal();
    renderCity();
    showToast(`Trevlig resa, ${fn}! Se dina slumpade resmål i passet.`, 3400);
  }

  function continueSavedGame() {
    if (loadSavedGame()) {
      gameSessionStarted = true;
      AudioMgr.play('klick');
      closeModal();
      renderCity();
      showToast(`Välkommen tillbaka, ${state.playerFirstName}!`, 2400);
    }
  }

  // --- Vinstkontroll (Riktigt jorden-runt-krav: minst 3 världsdelar!) & Slutrevy ---
  function getVisitedRegions() {
    const regs = new Set();
    state.visitedCities.forEach(ck => {
      if (W.cities[ck] && W.cities[ck].region) regs.add(W.cities[ck].region);
    });
    return regs;
  }

  function checkRoundTheWorldVictory() {
    if (state.city !== W.startCity || state.travelHistory.length === 0) return false;
    const goals = ensureJourneyGoals();
    const regions = getVisitedRegions();
    const missing = [];
    if (regions.size < goals.requiredRegions) {
      missing.push(`${goals.requiredRegions - regions.size} världsdel(ar)`);
    }
    if (state.competencies.length < goals.requiredCompetencies) {
      missing.push(`${goals.requiredCompetencies - state.competencies.length} yrkeskompetens(er)`);
    }
    const missingSouv = goals.souvenirCities.filter(ck => !hasGoalSouvenirFrom(ck));
    if (missingSouv.length > 0) {
      missing.push(`souvenir från ${missingSouv.map(ck => W.cities[ck]?.name || ck).join(' & ')}`);
    }

    if (missing.length === 0) {
      triggerGameOver(true);
      return true;
    }

    showToast(`Mellanlandning i ${W.cities[W.startCity]?.name || 'Malmö'}! Kvar för att klara spelet: ${missing.join(', ')}. Öppna passet för detaljer!`, 4800);
    return false;
  }

  function triggerGameOver(completedRoundTrip) {
    AudioMgr.play('fanfar');

    let rank = 'Turist';
    const accuracy = state.questionsTotal > 0 ? (state.questionsCorrect / state.questionsTotal) : 0;
    
    if (completedRoundTrip) {
      if (state.stamps.length >= 4 && state.doneWonders.size >= 2 && accuracy >= 0.75) {
        rank = 'Globetrotter';
      } else if (state.stamps.length >= 3 && state.doneWonders.size >= 1) {
        rank = 'Upptäckare';
      } else {
        rank = 'Resenär';
      }
    }

    try {
      const museum = JSON.parse(localStorage.getItem('gt_museum') || '[]');
      state.backpack.forEach(item => {
        if (!museum.some(m => m.id === item.id)) {
          museum.push({ id: item.id, name: item.name, origin: item.origin });
        }
      });
      localStorage.setItem('gt_museum', JSON.stringify(museum));
    } catch(e) {}

    const html = `
      <div class="card-modal" style="max-width:680px;">
        <div class="diploma">
          <div class="diploma-title">Globetrotterklubben</div>
          <div class="diploma-rank">Antagen som: <b>${rank}</b></div>
          <p style="font-size:14px; color:#5b3b1c;">
            ${completedRoundTrip ? 
              'Grattis! Du har rest jorden runt och återvänt hem till Stockholm inom tidsgränsen.' : 
              'Tiden tog slut innan du hann hela vägen hem. Men du har samlat minnen och kunskap för livet!'}
          </p>
        </div>

        <div class="stats-grid">
          <div class="stat-box">Gjorda städer: <b>${state.stamps.length}</b></div>
          <div class="stat-box">Yrkeskompetenser: <b>${state.competencies.length} / ${ensureJourneyGoals().requiredCompetencies}</b></div>
          <div class="stat-box">Besökta underverk: <b>${state.doneWonders.size}</b></div>
          <div class="stat-box">Allmänbildning: <b>${Math.round(accuracy * 100)} % rätt</b></div>
          <div class="stat-box">Kvarvarande kassa: <b>${state.cash.toLocaleString('sv-SE')} kr</b></div>
          <div class="stat-box">Dagar använda: <b>${state.day} av ${W.dayLimit}</b></div>
          <div class="stat-box">Hemförda souvenirer: <b>${state.backpack.length} st</b></div>
        </div>

        <div style="margin-top:10px;">
          <h4 style="color:#6b461e; margin:0 0 4px; font-family:Georgia,serif;">Resans Klippbok:</h4>
          <div class="scrapbook-box">
            ${state.journal.map(j => `<div class="scrapbook-entry"><span class="scrapbook-day">Dag ${j.day}:</span> ${j.text}</div>`).join('')}
          </div>
        </div>

        <p style="font-size:13px; color:#776a5b; text-align:center; margin-top:10px;">Dina hemförda souvenirer har nu ställts ut i ditt permanenta hemmamuseum!</p>

        <div class="modal-footer" style="justify-content:center; gap:10px;">
          <button class="globe-brass-btn" onclick="window.GT.exportTravelPostcard()">Spara vykort från resan (PNG)</button>
          <button class="stamp-action-btn" onclick="localStorage.removeItem('gt_save_v1'); location.reload()">Starta en ny resa</button>
        </div>
      </div>
    `;
    showModal(html);
  }

  // --- Globalt API ---
  window.GT = {
    closeModal,
    openGlobeModal,
    startPlaceQuiz,
    openWonderModal,
    startWonderTrip,
    openSignatureModal,
    doSignatureActivity,
    openJobModal,
    startJobShift,
    openLibraryModal,
    openBazaarModal,
    upgradeBackpack,
    buyGearItem,
    mailSouvenirHome,
    haggleSouvenir,
    buySouvenir,
    sellSouvenir,
    openTravelModal,
    startTravel,
    resolveTravelEvent,
    openHotelModal,
    tavernListen,
    tavernBuyRound,
    acceptRelayQuest,
    deliverRelayQuest,
    sleepHotel,
    wakeUpNextDay,
    openBackpackModal,
    openPassportModal,
    exportTravelPostcard,
    startNewJourney,
    continueSavedGame,
    toggleSound() {
      const active = AudioMgr.toggle();
      el.btnSound.textContent = active ? 'LJUD: PÅ' : 'LJUD: AV';
      showToast(active ? "Ljud påslaget" : "Ljud avstängt", 1200);
    }
  };

  el.btnSound.onclick = () => { window.GT.toggleSound(); };

  // Starta en ständigt snurrande 3D-miniglob i dockan (BackPacker 2 Landsnurr-känsla!)
  function initDockMiniGlobe() {
    const miniCanvas = document.getElementById('dockMiniGlobe');
    if (!miniCanvas || !window.GlobeRenderer) return;
    const miniGlobe = new window.GlobeRenderer(miniCanvas, {
      mini: true,
      interactive: false,
      radius: 19,
      centerLat: 24,
      centerLon: 18
    });
    const spinLoop = () => {
      miniGlobe.centerLon = (miniGlobe.centerLon + 0.55) % 360;
      miniGlobe.render([], state.city, getActiveWorldEvents());
      requestAnimationFrame(spinLoop);
    };
    requestAnimationFrame(spinLoop);
  }

  // Starta en ständigt snurrande 3D-vandringsryggsäck i dockan (BackPacker 1-koffertkänsla!)
  function initDockMiniBackpack() {
    const bpCanvas = document.getElementById('dockMiniBackpack');
    if (!bpCanvas || !window.Backpack3DRenderer) return;
    const miniPack = new window.Backpack3DRenderer(bpCanvas, {
      interactive: false,
      zoom: 2.85,
      pitch: 0.14,
      speed: 0.018
    });
    const spinLoop = () => {
      miniPack.render();
      requestAnimationFrame(spinLoop);
    };
    requestAnimationFrame(spinLoop);
  }

  // Starta spelet med 90-tals startskärm & auto-save!
  renderCity();
  initDockMiniGlobe();
  initDockMiniBackpack();
  openStartScreen();
})();
