// Globetrotter — Spelmotor och UI-logik för vertikal slice (BackPacker-estetik)

(function () {
  'use strict';

  const W = window.GT_WORLD;
  if (!W) {
    console.error('GT_WORLD saknas!');
    return;
  }

  // --- Moduler (balans, ljud, rutter, ekonomi, quiz) ---
  const BAL = window.GT_BALANCE || {};
  const AudioMgr = window.GT_AUDIO || { enabled: true, play() {}, toggle() { return false; } };
  const ROUTES = window.GT_ROUTES;
  const ECON = window.GT_ECONOMY;
  const QUIZ = window.GT_QUIZ;

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
    const m = CITY_STAMP_META[cityKey] || (window.GT_EXTRA_STAMPS && window.GT_EXTRA_STAMPS[cityKey]) || { code: cityKey.slice(0, 3).toUpperCase(), color: '#7a2222', shape: 'round', rot: -5 };
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

  // --- Geometri & Avstånd (delegeras till GT_ROUTES & GT_ECONOMY) ---
  function homeCityName() {
    return W.cities[W.startCity]?.name || 'startstaden';
  }

  function calcDistance(lat1, lon1, lat2, lon2) {
    return ROUTES.calcDistance(lat1, lon1, lat2, lon2);
  }
  const haversineKm = calcDistance;

  function getDistanceBetweenCities(cityKeyA, cityKeyB) {
    return ROUTES.getDistanceBetweenCities(W, cityKeyA, cityKeyB);
  }

  function calcSouvenirValue(souvenirKey, currentCityKey) {
    return ECON.calcSouvenirValue(W, souvenirKey, currentCityKey);
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
    doneWonderSpots: new Set(), // Avklarade delplatser inne på ett världsarv ("wonderId_idx")
    activeWonder: null, // Om spelaren just nu befinner sig på ett världsarv (egen mini-destination!)
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
      { day: 1, text: `Avresa från ${W.cities[W.startCity]?.name || 'Malmö'} med nystämplat pass, tom ryggsäck och ${(W.startCash || 4500).toLocaleString('sv-SE')} kr i reskassan.` }
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
    backpackLevel: 1, // 1 = Liten gul ryggsäck (5), 2 = Duffelbag (7), 3 = Stor vandringsryggsäck (9)
    mailedHome: [], // Array av { id, name, origin, mailedDay } — souvenirer postade hem!
    callsHomeUsed: 0, // Nödlån via hotelltelefonen (max 2 per resa)
    startCity: W.startCity,
    dayLimit: W.dayLimit,
    bots: [],
    botNews: [],
    botJobRecords: {},
    botDuelDoneToday: {},
    blockedRoutes: {},
    cityClaims: {},
    openContracts: [],
    claimedContracts: [],
    contractBonusPoints: 0,
    claimedCitiesCount: 0,
    regionKnowledge: {}, // { europa: 36, asien: 12, ... } (0–100 %)
    knowledgeCreditedIds: new Set(), // Frågor som redan gett lokalkännedom (ger aldrig dubbel ökning)
    streak: 0 // Antal rätta svar i rad (Reseflyt)
  };

  function getCurrentKnowledgeBonuses(cityKey = state.city) {
    const c = W.cities[cityKey];
    const reg = c ? ROUTES.normRegion(c.region) : '';
    const pct = (state.regionKnowledge && reg) ? (state.regionKnowledge[reg] || 0) : 0;
    return ECON.getKnowledgeBonuses(pct, state.streak || 0);
  }

  const BACKPACK_TIERS = BAL.BACKPACK_TIERS || [
    { level: 1, slots: 4, name: 'Liten resväska', price: 0, desc: 'Smidig startväska med plats för 4 föremål.' }
  ];

  function getMaxBackpackSlots() {
    return ECON.getMaxBackpackSlots(state.backpackLevel);
  }

  function hasGoalSouvenirFrom(cityKey) {
    const inPack = state.backpack.find(it => it.kind !== 'kurir' && it.origin === cityKey);
    if (inPack) return { item: inPack, mailed: false };
    const mailed = (state.mailedHome || []).find(it => it.origin === cityKey);
    if (mailed) return { item: mailed, mailed: true };
    return null;
  }

  // Slumpar fram resans obligatoriska mål — enbart bland städer som är 100 % nåbara tur-och-retur från startstaden!
  function generateJourneyGoals() {
    const reachable = ROUTES.getRoundTripReachableCities(W, W.startCity);
    const candidatePool = reachable.length >= 3 ? reachable : Object.keys(W.cities).filter(k => k !== W.startCity);
    const foreignKeys = candidatePool.filter(k => (W.cities[k].souvenirs || []).length > 0);
    const byRegion = {};
    foreignKeys.forEach(k => {
      const reg = ROUTES.normRegion(W.cities[k].region);
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

  function pickHardQuestions(count, region = '') {
    return QUIZ.pickHardQuestions(state, count, region);
  }

  function pickInteractiveQuestions(count, region = '') {
    return QUIZ.pickInteractiveQuestions(state, count, region);
  }

  function getQuestionsFor(cityKey, placeKey, fallbackList = []) {
    return QUIZ.getQuestionsFor(W, state, cityKey, placeKey, fallbackList);
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
        doneWonderSpots: Array.from(state.doneWonderSpots),
        activeWonder: state.activeWonder,
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
        mailedHome: state.mailedHome,
        callsHomeUsed: state.callsHomeUsed,
        startCity: state.startCity || W.startCity,
        dayLimit: state.dayLimit || W.dayLimit,
        bots: state.bots || [],
        botNews: state.botNews || [],
        botJobRecords: state.botJobRecords || {},
        botDuelDoneToday: state.botDuelDoneToday || {},
        blockedRoutes: state.blockedRoutes || {},
        cityClaims: state.cityClaims || {},
        openContracts: state.openContracts || [],
        claimedContracts: state.claimedContracts || [],
        contractBonusPoints: state.contractBonusPoints || 0,
        claimedCitiesCount: state.claimedCitiesCount || 0,
        regionKnowledge: state.regionKnowledge || {},
        knowledgeCreditedIds: Array.from(state.knowledgeCreditedIds || []),
        streak: state.streak || 0
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
    state.doneWonderSpots = new Set(d.doneWonderSpots || []);
    state.activeWonder = (d.activeWonder && W.wonders[d.activeWonder]) ? d.activeWonder : null;
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
    state.callsHomeUsed = d.callsHomeUsed || 0;
    if (d.startCity && W.cities[d.startCity]) {
      W.startCity = d.startCity;
      state.startCity = d.startCity;
    }
    if (d.dayLimit && Number(d.dayLimit) >= 10) {
      W.dayLimit = Number(d.dayLimit);
      state.dayLimit = Number(d.dayLimit);
    }
    state.bots = Array.isArray(d.bots) ? d.bots : [];
    state.botNews = Array.isArray(d.botNews) ? d.botNews : [];
    state.botJobRecords = d.botJobRecords || {};
    state.botDuelDoneToday = d.botDuelDoneToday || {};
    state.blockedRoutes = d.blockedRoutes || {};
    state.cityClaims = d.cityClaims || {};
    state.openContracts = Array.isArray(d.openContracts) && d.openContracts.length > 0
      ? d.openContracts
      : (window.GT_BOTS ? window.GT_BOTS.initOpenContracts() : []);
    state.claimedContracts = Array.isArray(d.claimedContracts) ? d.claimedContracts : [];
    state.contractBonusPoints = d.contractBonusPoints || 0;
    state.claimedCitiesCount = d.claimedCitiesCount || 0;
    state.regionKnowledge = (d.regionKnowledge && typeof d.regionKnowledge === 'object') ? d.regionKnowledge : {};
    state.knowledgeCreditedIds = new Set(Array.isArray(d.knowledgeCreditedIds) ? d.knowledgeCreditedIds : []);
    state.streak = Number(d.streak) || 0;
    window.GT_ACTIVE_BOTS = state.bots;
    window.GT_CITY_CLAIMS = state.cityClaims;
    ensureJourneyGoals();
    return true;
  }

  function checkPlayerOpenContracts() {
    if (!window.GT_BOTS) return;
    if (!Array.isArray(state.openContracts) || state.openContracts.length === 0) {
      state.openContracts = window.GT_BOTS.initOpenContracts();
    }
    const pEntry = {
      visitedCities: Array.from(state.visitedCities || []),
      doneWonders: Array.from(state.doneWonders || []),
      competencies: state.competencies || [],
      stamps: state.stamps || []
    };
    let wonAny = false;
    for (let i = state.openContracts.length - 1; i >= 0; i--) {
      const c = state.openContracts[i];
      const prog = window.GT_BOTS.getContractProgress(c, pEntry, W);
      if (prog.done >= prog.total) {
        wonAny = true;
        changeCash(c.rewardCash, `Bonuskontrakt: ${c.title}`);
        state.contractBonusPoints = (state.contractBonusPoints || 0) + c.rewardPoints;
        state.claimedContracts.push({ ...c, winner: state.playerFirstName || 'Du', color: '#ffd875', isPlayer: true, day: state.day });
        addJournal(`Knep bonuskontraktet "${c.title}" först av alla (+${c.rewardCash} kr & +${c.rewardPoints} p)!`);
        AudioMgr.play('fanfar');
        showToast(`📜 KONTRAKT KNIPET: ${c.title}! +${c.rewardCash} kr & +${c.rewardPoints} p!`, 4200);
        state.openContracts.splice(i, 1);
        const rep = window.GT_BOTS.drawReplacementContract(state.openContracts, state.claimedContracts);
        if (rep) state.openContracts.push(rep);
      }
    }
    if (wonAny) {
      saveGame();
      updateOpponentHUD();
    }
  }

  function syncBotsToCurrentDay() {
    window.GT_ACTIVE_BOTS = state.bots || [];
    window.GT_CITY_CLAIMS = state.cityClaims || {};
    if (!window.GT_BOTS || !Array.isArray(state.bots) || state.bots.length === 0) return;
    if (!Array.isArray(state.openContracts) || state.openContracts.length === 0) {
      state.openContracts = window.GT_BOTS.initOpenContracts();
    }
    window.GT_BOTS.advanceBotsToDay(state.bots, state.day, W, state.botNews, state.botJobRecords, {
      blockedRoutes: state.blockedRoutes,
      cityClaims: state.cityClaims,
      openContracts: state.openContracts,
      claimedContracts: state.claimedContracts
    });
    updateOpponentHUD();
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

  function requireNotLateNight(actionLabel = 'detta') {
    if (state.hour >= 24) {
      AudioMgr.play('time');
      showToast(`Klockan har passerat midnatt och staden har stängt! Checka in på hotellet för natten innan du kan fortsätta.`, 3600);
      return false;
    }
    return true;
  }

  function addHours(h) {
    state.hour += h;
    if (state.hour >= 24) {
      showToast("Klockan har passerat midnatt! Staden stänger för natten — checka in på hotellet.", 3400);
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

  // Kontrollera om staden blev gjord — ger pass-stämpel + gratis hotellnatt + 20 % avgångsrabatt!
  function checkCityCompletion() {
    const current = W.cities[state.city];
    if (!current) return;
    const allDone = current.highlights.every(h => state.donePlaces.has(h));
    if (allDone && !state.stamps.includes(state.city)) {
      state.stamps.push(state.city);

      // Verklig resenytta av att "göra" en stad: gratis hotellnatt (eller +250 kr) + 20 % avgångsrabatt!
      let hotelRewardTxt = '';
      if (!state.freeHotelCities.has(state.city)) {
        state.freeHotelCities.add(state.city);
        hotelRewardTxt = `1 gratis hotellnatt i ${current.name}`;
      } else {
        changeCash(BAL.STAMP_BONUS, `Stämpelbonus i ${current.name}`);
        hotelRewardTxt = `+${BAL.STAMP_BONUS} kr i resenärsbonus`;
      }
      const outPool = getCityRoutePool(state.city).map(r => r.to);
      let dealCityName = '';
      if (outPool.length > 0) {
        const dealTarget = outPool[Math.floor(Math.random() * outPool.length)];
        state.deals[dealTarget] = Math.max(state.deals[dealTarget] || 0, 20);
        state.departureBoard = null;
        dealCityName = W.cities[dealTarget]?.name || dealTarget;
      }

      let firstClaimBonus = false;
      if (!state.cityClaims) state.cityClaims = {};
      if (!state.cityClaims[state.city]) {
        state.cityClaims[state.city] = {
          holder: state.playerFirstName || 'Du',
          holderId: 'player',
          color: '#ffd875',
          isPlayer: true,
          day: state.day
        };
        window.GT_CITY_CLAIMS = state.cityClaims;
        state.claimedCitiesCount = (state.claimedCitiesCount || 0) + 1;
        changeCash(BAL.FIRST_CLAIM_BONUS || 250, `Först-på-plats-bonus i ${current.name}`);
        addJournal(`Mutade in ${current.name} som första resenär (+${BAL.FIRST_CLAIM_BONUS || 250} kr & egen flagga på jordgloben)!`);
        firstClaimBonus = true;
      }
      checkPlayerOpenContracts();
      triggerStampCelebration(current, firstClaimBonus, hotelRewardTxt, dealCityName);
    }
  }

  function triggerStampCelebration(city, firstClaimBonus = false, hotelRewardTxt = '', dealCityName = '') {
    AudioMgr.play('stamp');
    AudioMgr.play('fanfar');
    const cityKey = Object.keys(W.cities).find(k => W.cities[k] === city) || state.city;
    const claimHtml = firstClaimBonus
      ? `<div style="margin:8px auto; padding:6px 12px; background:#fff4d2; border:2px solid #c99a45; border-radius:6px; color:#7a4f12; font-size:12.5px; max-width:420px;"><b>🚩 FÖRST PÅ PLATS!</b> Du mutade in ${city.name} före alla andra (+${BAL.FIRST_CLAIM_BONUS || 250} kr &amp; gul flagga på jordgloben)!</div>`
      : '';
    const perkHtml = (hotelRewardTxt || dealCityName)
      ? `<div style="margin:8px auto; padding:7px 12px; background:#edf7ee; border:2px solid #2f7d43; border-radius:6px; color:#1c542b; font-size:12.5px; max-width:420px;"><b>★ RESENÄRSBELÖNING:</b> ${hotelRewardTxt}${dealCityName ? ` + <b>20 % rabatt</b> på flyg mot ${dealCityName}!` : '!'}</div>`
      : '';

    const html = `
      <div class="card-modal" style="text-align:center;">
        <div class="stamp-celebration">
          <h2 style="font-family:Georgia,serif; color:#7a4f12; margin:0;">STÄMPEL I PASSET!</h2>
          <div style="margin:12px auto;">${renderCityStampHtml(cityKey, true)}</div>
          <p style="font-size:16px; font-weight:600; color:#2f7d43; margin:0;">
            Du har gjort alla höjdpunkter i ${city.name}!
          </p>
          ${perkHtml}
          ${claimHtml}
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
    if (dockMiniBackpackRenderer) {
      dockMiniBackpackRenderer.setTier(state.backpackLevel);
    }
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

    // Event-remsa på stadsskylten om något pågår just i denna stad (döljs ute på världsarv)
    const cityEv = !state.activeWonder ? getCityEvent(state.city) : null;
    if (el.cityRegion && !state.activeWonder && W.cities[state.city]) {
      const c = W.cities[state.city];
      const kb = getCurrentKnowledgeBonuses(state.city);
      const perkTag = kb.tier === 2 ? ' (+30% lön, -10% resa)' : (kb.tier === 1 ? ' (+15% lön)' : '');
      const streakTag = kb.streakActive ? ` · 🔥 Flyt ×${state.streak}` : '';
      el.cityRegion.textContent = `${c.country} · ${ROUTES.regionLabel(c.region).toUpperCase()} · Kunskap ${kb.pct}%${perkTag}${streakTag}`;
    }
    if (el.cityEventRibbon) {
      if (cityEv) {
        el.cityEventRibbon.textContent = `★ ${cityEv.title}: ${cityEv.effectText}`;
        el.cityEventRibbon.classList.remove('hidden');
      } else {
        el.cityEventRibbon.classList.add('hidden');
      }
    }

    // Automatisk sparning i webbläsaren + realtidssynk i 2-spelarläge / bot-topplista
    saveGame();
    syncMultiplayerState();
    updateOpponentHUD();
  }

  function renderCity() {
    if (state.activeWonder && W.wonders && W.wonders[state.activeWonder]) {
      renderWonderDestination(W.wonders[state.activeWonder]);
      return;
    }
    const city = W.cities[state.city];
    if (!city) return;

    state.visitedCities.add(state.city);

    // Byt bakgrundsmontage
    // Bara städer med en egen karta visar en; andra visar enbart stadsfotot (ingen annans karta som fallback).
    el.mapLayer.style.backgroundImage = city.map ? `url(${city.map})` : 'none';
    el.photoLayer.style.backgroundImage = `url(${city.skyline || 'assets/skylines/skyline.jpg'})`;

    // Titlar
    el.cityName.textContent = city.name;
    el.cityRegion.textContent = `${city.country} · ${ROUTES.regionLabel(city.region).toUpperCase()}`;

    // Unik landstypisk stil på stadsskylten uppe till vänster!
    const badgeEl = document.querySelector('.city-plate');
    if (badgeEl) {
      // Skylttema efter stadens land (via flaggkoden). Länder utan eget tema får den neutrala skylten.
      const THEMED_COUNTRIES = ['se', 'eg', 'in', 'jp', 'us', 'fr', 'it', 'gb', 'tr', 'th', 'cn', 'au', 'za', 'br', 'mx'];
      const facts = window.GT_COUNTRY_FACTS || {};
      // Faktadatan är nycklad på stad eller landsnamn; annars lånas flaggan från en annan stad i samma land.
      const sameCountryKey = Object.keys(W.cities).find(k => W.cities[k].country === city.country && facts[k] && facts[k].flag);
      const flagPath = (facts[state.city] || facts[city.country] || facts[sameCountryKey] || {}).flag || '';
      const cc = (flagPath.match(/\/([a-z]{2})\.png$/) || [])[1];
      badgeEl.className = `city-plate city-badge${THEMED_COUNTRIES.includes(cc) ? ` theme-${cc}` : ''}`;
    }

    // Bygg BackPacker-kartikoner på scenen
    renderCitySpots(city);
    updateHUD();
    if (window.AmbientMgr) {
      window.AmbientMgr.setScene('city', city.region || 'Europa');
    }
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
    if (W.souvenirs[souvenirId] && W.souvenirs[souvenirId].photo) {
      return W.souvenirs[souvenirId].photo;
    }
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

    // 11 matematiskt krockfria ankarceller i 3 tydliga rader (dx >= 19 %, dy >= 22 %)
    // Fredar alltid stadsskylten (x<35, y<32), HUD (x>63, y<22) och dockan (x>61, y>72).
    const anchors = [
      [44, 23], [65, 26], [86, 26],
      [11, 47], [30, 48], [49, 48], [68, 50], [88, 50],
      [12, 75], [31, 75], [50, 75]
    ];
    // Blanda ankarna unikt för just denna stad
    const shuffled = anchors.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const coords = {};
    spotKeys.forEach((key, idx) => {
      const base = shuffled[idx % shuffled.length];
      // Lätt organisk förskjutning (±1.2 % i X, ±1.0 % i Y) som behåller full frizon runt både ikon och etikett
      const x = Math.max(9, Math.min(91, Math.round(base[0] + (rand() - 0.5) * 2.4)));
      const y = Math.max(22, Math.min(78, Math.round(base[1] + (rand() - 0.5) * 2.0)));
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

    // 3b. Bibliotek på kartan (med cirkelmätare för lokalkännedom % + 🔥-symbol vid aktivt Reseflyt!)
    const cf = (window.GT_COUNTRY_FACTS && window.GT_COUNTRY_FACTS[state.city]) || null;
    if (cf && posMap.library) {
      const libKb = getCurrentKnowledgeBonuses(state.city);
      const ringColor = libKb.tier === 2 ? '#66e38c' : (libKb.tier === 1 ? '#ffd875' : '#c99a45');
      const streakBadge = libKb.streakActive
        ? `<span class="lib-streak-pill" title="Reseflyt aktivt: ${state.streak} rätt i rad (+10% jobblön)">🔥${state.streak}</span>`
        : '';
      const libSpot = createSpot(
        posMap.library[0], posMap.library[1],
        'service library',
        `<div class="spot-badge lib-progress-ring" style="--lib-pct:${libKb.pct}%; --lib-color:${ringColor};" title="Bibliotek · Lokalkännedom i ${ROUTES.regionLabel(city.region)}: ${libKb.pct}%${libKb.streakActive ? ` · Reseflyt ×${state.streak}` : ''}">
           <img class="spot-model-img" src="${cf.libraryPhoto}" onerror="this.src='assets/photos/libraries/lib_stockholm.jpg'" alt="Bibliotek">
           ${streakBadge}
           <span class="lib-pct-pill" style="border-color:${ringColor}; color:${ringColor};">${libKb.pct}%</span>
         </div>`,
        `Bibliotek · ${libKb.pct}%${libKb.streakActive ? ` 🔥${state.streak}` : ''}`,
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
    if (!requireNotLateNight(sig.name)) return;
    const isOpen = state.hour >= sig.openFrom && state.hour < sig.openUntil;
    const doneToday = Boolean(state.signatureDoneToday[`${state.city}_${state.day}`]);
    const sigPack = (window.GT_SIGNATURE_QUIZZES && window.GT_SIGNATURE_QUIZZES[state.city]) || null;
    const rewardHint = sigPack
      ? sigPack.rewardLabel
      : `Klara minst 2 av 3 lokala frågor om ${city.name} för lokal bonus (+2 extra timmar & gratis hotellnatt i ${city.name})!`;

    const html = `
      <div class="scene-fullscreen scene-sight-full" style="background-image:url(${city.skyline})">
        <div class="sight-header-bar">
          <div class="sight-plaque" style="border-color:#ffd875;">
            <h3>${sig.name}</h3>
            <div class="sight-meta">Lokalt guldkorn i ${city.name} · Öppet ${String(sig.openFrom).padStart(2, '0')}:00–${String(sig.openUntil).padStart(2, '0')}:00 · Kostnad: ${sig.cost} kr (${sig.hours || 1} tim)</div>
          </div>
          ${exitIconBtn('Tillbaka till staden')}
        </div>
        <div class="sight-bottom-panel">
          <div id="quizContainer">
            <div class="sight-fact-card" style="margin-bottom:8px;">
              ${sig.desc}
              <div style="margin-top:6px; font-size:12px; color:#ffd875;"><b>Lokal utmaning (3 frågor):</b> ${rewardHint}</div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <span style="font-size:13px; color:#ffd875;">
                ${doneToday ? 'Du har redan upplevt detta idag, kom tillbaka imorgon!' : (!isOpen ? `Just nu är klockan ${String(state.hour).padStart(2, '0')}:00. Stängt tills kl ${String(sig.openFrom).padStart(2, '0')}:00!` : 'Öppet just nu, kliv in och testa dina lokala kunskaper!')}
              </span>
              <div>
                ${(!doneToday && isOpen) ? `<button class="stamp-action-btn" onclick="window.GT.doSignatureActivity()">Starta ${sig.name} (-${sig.cost} kr)</button>` : ''}
              </div>
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
    addHours(sig.hours || 1);
    state.signatureDoneToday[`${state.city}_${state.day}`] = true;

    const sigPack = (window.GT_SIGNATURE_QUIZZES && window.GT_SIGNATURE_QUIZZES[state.city]) || null;
    let questions = sigPack ? sigPack.questions.map(q => ({ ...q })) : [];
    if (questions.length < 3) {
      const localJobQs = getQuestionsFor(state.city, 'job', (city.job && city.job.questions) || []);
      const localExtra = localJobQs.slice(0, 3 - questions.length);
      questions = [...questions, ...localExtra];
    }
    if (questions.length < 3) {
      questions = [...questions, ...pickHardQuestions(3 - questions.length, city.region)];
    }

    const container = document.getElementById('quizContainer');
    if (!container || questions.length === 0) {
      closeModal();
      renderCitySpots(city);
      updateHUD();
      return;
    }

    runQuiz(questions.slice(0, 3), ({ correct, total }) => {
      const passed = correct >= Math.min(2, total);
      let rewardHtml = '';
      if (passed) {
        AudioMgr.play('fanfar');
        const rType = (sigPack && sigPack.rewardType) || (sig.kind === 'spice' ? 'local_spice_bonus' : (sig.kind === 'cash' ? 'local_cash_bonus' : 'local_energy_hotel'));

        if (rType === 'local_spice_bonus') {
          if (state.backpack.length < getMaxBackpackSlots() && W.souvenirs.kryddor) {
            const s = W.souvenirs.kryddor;
            state.backpack.push({ id: 'kryddor', name: s.name, origin: state.city, buyPrice: sig.cost, buyDay: state.day });
          }
          changeCash(BAL.SIGNATURE_BONUS, `Lokal bonus på ${sig.name}`);
          rewardHtml = `Du fick med dig en äkta kryddpåse + <b>${BAL.SIGNATURE_BONUS} kr</b> i lokal bonus!`;
          addJournal(`Klarade lokalutmaningen på ${sig.name} i ${city.name} (${correct}/${total}) och kammade hem kryddor och +${BAL.SIGNATURE_BONUS} kr!`);
        } else if (rType === 'local_cash_bonus') {
          changeCash(BAL.SIGNATURE_BONUS_HIGH, `Lokal bonus på ${sig.name}`);
          state.freeHotelCities.add(state.city);
          rewardHtml = `Imponerande lokalkännedom! Du fick <b>+${BAL.SIGNATURE_BONUS_HIGH} kr</b> i bonus samt en <b>gratis hotellnatt i ${city.name}</b>!`;
          addJournal(`Glänste på ${sig.name} i ${city.name} (${correct}/${total}) och belönades med +${BAL.SIGNATURE_BONUS_HIGH} kr och fri hotellnatt!`);
        } else {
          state.hour = Math.max(8, state.hour - 2);
          state.freeHotelCities.add(state.city);
          rewardHtml = `Mätt, glad och full av energi! Du fick tillbaka <b>2 timmar på klockan</b> samt en <b>gratis hotellnatt i ${city.name}</b>!`;
          addJournal(`Klarade lokalutmaningen på ${sig.name} i ${city.name} (${correct}/${total}) och belönades med ny energi (+2 tim) och gratis hotellnatt i ${city.name}!`);
        }
      } else {
        rewardHtml = `Gott ändå, men det krävdes minst 2 rätt för den lokala bonusen. Prova igen imorgon!`;
        addJournal(`Besökte ${sig.name} i ${city.name} (${correct}/${total} rätt).`);
      }

      saveGame();
      updateHUD();
      renderCitySpots(city);

      const box = document.getElementById('quizContainer');
      if (box) {
        box.innerHTML = `
          <div class="sight-fact-card" style="text-align:center;">
            <div style="font-size:16px; font-weight:bold; color:${passed ? '#78e08f' : '#ffd875'}; margin-bottom:6px;">
              ${passed ? `✓ Bra jobbat på ${sig.name}! (${correct}/${total} rätt)` : `${sig.name} avklarat (${correct}/${total} rätt)`}
            </div>
            <div style="font-size:13px; color:#f4ead6; margin-bottom:12px;">${rewardHtml}</div>
            <button class="stamp-action-btn" onclick="window.GT.closeModal()">Tillbaka till ${city.name} »</button>
          </div>
        `;
      }
    }, city.skyline, { finishLabel: 'Avsluta aktiviteten »' });
  }

  // --- Modalhantering ---
  function showModal(html) {
    el.modalContent.innerHTML = html;
    el.modalOverlay.classList.remove('hidden');
  }

  function closeModal() {
    AudioMgr.play('klick');
    if (state.quizInProgress) {
      state.quizInProgress = false;
      if ((state.streak || 0) > 0) {
        state.streak = 0;
        showToast('Du lämnade mitt i en fråga — ditt Reseflyt bröts!', 2800);
        updateHUD();
        renderCitySpots(W.cities[state.city]);
      }
    }
    el.modalOverlay.classList.add('hidden');
    el.modalContent.innerHTML = '';
    if (window.AmbientMgr) {
      const curRegion = (W.cities[state.city] && W.cities[state.city].region) || 'Europa';
      window.AmbientMgr.setScene(state.activeWonder ? 'wonder' : 'city', curRegion);
    }
  }

  // --- Höjdpunktsbesök (Visa alltid namn, pris och tid FÖRE beslutet — ingen kostnad i bakhåll!) ---
  function openPlaceModal(placeKey, place) {
    if (!requireNotLateNight(place.name)) return;
    const isDone = state.donePlaces.has(placeKey);
    const fee = Number(place.fee) || 0;
    const hours = Number(place.hours) || 2;
    const canAfford = isDone || state.cash >= fee;

    const html = `
      <div class="scene-fullscreen scene-sight-full" style="background-image:url(${place.photo})">
        <div class="sight-header-bar">
          <div class="sight-plaque">
            <h3>${place.name}</h3>
            <div class="sight-meta">
              ${isDone
                ? '<span style="color:#78e08f; font-weight:bold;">REDAN BESÖKT</span> · Repetition (Gratis)'
                : `Besök: ${hours} tim · Inträde: ${fee > 0 ? '-' + fee + ' kr' : 'Gratis'}`}
            </div>
          </div>
          ${exitIconBtn('Tillbaka till staden')}
        </div>

        <div class="sight-bottom-panel">
          <div class="sight-fact-card">${place.fact}</div>
          <div id="quizContainer">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:4px;">
              <span style="font-size:12.5px; color:#e6d7bd;">
                ${!canAfford
                  ? `<span style="color:#ff7675;">Inträdet kostar ${fee} kr — du behöver lite mer i reskassan.</span>`
                  : (isDone ? 'Vill du repetera frågorna här? Det kostar varken tid eller pengar.' : 'Kliv in för att utforska platsen! Full pott ger Guld & kunskapsbonus.')}
              </span>
              <div style="display:flex; gap:8px;">
                <button class="globe-brass-btn" onclick="window.GT.closeModal()">Avvakta</button>
                ${canAfford ? `<button class="stamp-action-btn" onclick="window.GT.startPlaceQuiz('${placeKey}', ${isDone})">${isDone ? 'Repetera quiz »' : `Besök platsen (${hours} tim${fee > 0 ? `, -${fee} kr` : ''}) »`}</button>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function startPlaceQuiz(placeKey, isRepeat = false) {
    const place = W.places[placeKey];
    if (!place) return;
    const fee = Number(place.fee) || 0;
    const hours = Number(place.hours) || 2;
    if (!isRepeat) {
      if (state.cash < fee) {
        showToast(`Inträdet till ${place.name} kostar ${fee} kr!`, 2600);
        return;
      }
      if (fee > 0) changeCash(-fee, `Inträde ${place.name}`);
      addHours(hours);
    }
    AudioMgr.play('sight');

    runQuiz(getQuestionsFor(place.city || state.city, placeKey, place.questions), ({ correct, total }) => {
      state.donePlaces.add(placeKey);
      const isPerfect = total > 0 && correct >= total;
      const tier = isPerfect ? 'GULD' : (correct >= Math.ceil(total * 0.5) ? 'SILVER' : 'BRONS');
      if (!isRepeat) {
        state.dayLog.activities.push(`Besökte ${place.name} (${tier})`);
        if (isPerfect && BAL.SIGHT_PERFECT_BONUS > 0) {
          changeCash(BAL.SIGHT_PERFECT_BONUS, `Full pott vid ${place.name}`);
        }
      }
      renderCitySpots(W.cities[state.city]);
      closeModal();
      if (!isRepeat) {
        const bonusTxt = isPerfect && BAL.SIGHT_PERFECT_BONUS > 0 ? ` · +${BAL.SIGHT_PERFECT_BONUS} kr kunskapsbonus!` : '';
        showToast(`${place.name}: ${Math.round(correct * 10) / 10}/${total} rätt (${tier})${bonusTxt}`, 3000);
      }
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

  // Unikt minispel kopplat till varje enskilt världsarv!
  const WONDER_MINIGAME_MAP = {
    ilulissat:      { id: 'arctic',           label: 'Arktisk naturbevakare (Isbjörnar)' },
    stonehenge:     { id: 'mg_architect',     label: 'Stenbyggaren vid Stonehenge' },
    pompeji:        { id: 'mg_archaeologist', label: 'Utgrävning i Pompeji' },
    kappadokien:    { id: 'lander',           label: 'Ballong- & Landningspilot' },
    giza:           { id: 'mg_antiques',      label: 'Skattkammarens antikarkiv' },
    petra:          { id: 'mg_safe',          label: 'Skattkammarens stenlås' },
    serengeti:      { id: 'mg_safari',        label: 'Fotosafari vid Kilimanjaro' },
    victoriafallen: { id: 'mg_birds',         label: 'Naturspanaren vid fallen' },
    everest:        { id: 'slalom',           label: 'Alpinslalom i Himalaya' },
    taj:            { id: 'mg_spice',         label: 'Kryddmarknaden i Agra' },
    angkorwat:      { id: 'mg_museum_mem',    label: 'Tempelarkivet i Angkor' },
    halong:         { id: 'navigator',        label: 'Djonk-navigatör i bukten' },
    kinesiskamuren: { id: 'mg_telegraph',     label: 'Vakttornets signalsändare' },
    fuji:           { id: 'camera',           label: 'Landskapsfotograf vid Fuji' },
    barriarrevet:   { id: 'diver',            label: 'Koralldykare på revet' },
    uluru:          { id: 'mg_tourguide',     label: 'Ökenguiden vid Uluru' },
    grandcanyon:    { id: 'lander',           label: 'Helikopterlandning i ravinen' },
    chichenitza:    { id: 'mg_archaeologist', label: 'Mayatemplets arkeolog' },
    machupicchu:    { id: 'mg_architect',     label: 'Inkas murbyggare i Anderna' },
    iguazu:         { id: 'mg_fruit',         label: 'Regnskogens fruktsorterare' }
  };

  function openWonderMinigame(wonderId) {
    const wonder = W.wonders[wonderId];
    const mg = WONDER_MINIGAME_MAP[wonderId];
    if (!wonder || !mg || !window.GT_MINIGAMES) return;

    const html = `
      <div class="scene-fullscreen scene-sight-full" style="background-image:url(${wonder.photo})">
        <div class="sight-header-bar">
          <div class="sight-plaque" style="border-color:#ffbe3d;">
            <h3>★ ${mg.label.toUpperCase()}</h3>
            <div class="sight-meta">${wonder.name} (${wonder.country}) · Världsarvsutmaning</div>
          </div>
          ${exitIconBtn(`Tillbaka till ${wonder.name}`)}
        </div>
        <div class="sight-bottom-panel">
          <div id="quizContainer"></div>
        </div>
      </div>
    `;
    showModal(html);

    const container = document.getElementById('quizContainer');
    window.GT_MINIGAMES.start(mg.id, container, ({ score, max, passed, summary }) => {
      const reward = passed ? 450 : Math.round((score / Math.max(1, max)) * 250);
      if (reward > 0) {
        changeCash(reward, `Världsarvsutmaning: ${wonder.name}`);
      }
      if (passed) {
        AudioMgr.play('fanfar');
        addJournal(`Klarade specialutmaningen "${mg.label}" vid världsarvet ${wonder.name} (+${reward} kr)!`);
      }
      container.innerHTML = `
        <div style="text-align:center; padding:14px; border:2px dashed #c99a45; background:rgba(20,14,9,0.92); color:#f4ead6; border-radius:6px;">
          <h4 style="color:${passed ? '#78e08f' : '#ffd875'}; font-size:19px; font-family:Georgia,serif; margin:0 0 6px;">
            ${passed ? 'Utmaning avklarad!' : 'Bra försök!'}
          </h4>
          <p style="margin:0 0 8px;">${summary}</p>
          <p style="font-size:17px; margin:0 0 12px; font-weight:bold; color:#ffd875;">Expeditionsbonus: +${reward} kr</p>
          <button class="stamp-action-btn" onclick="window.GT.closeModal()">Tillbaka till ${wonder.name}</button>
        </div>
      `;
    });
  }

  // --- Världsarv som eget resmål ("mini-stad" utan hotell/jobb/basar!) ---
  function renderWonderDestination(wonder) {
    el.mapLayer.style.backgroundImage = `url(${wonder.photo})`;
    el.photoLayer.style.backgroundImage = `url(${wonder.photo})`;

    el.cityName.textContent = wonder.name;
    el.cityRegion.textContent = `${wonder.country} · VÄRLDSARV`;

    const badgeEl = document.querySelector('.city-plate');
    if (badgeEl) {
      badgeEl.className = 'city-plate city-badge theme-wonder';
    }

    el.spotsContainer.innerHTML = '';

    const wId = wonder.id || state.activeWonder;
    const spotCoords = [
      [22, 48],
      [50, 39],
      [78, 50]
    ];
    const questions = wonder.questions || [];
    const spotTitles = wonder.spots || questions.map((_, i) => `Upptäcktsplats ${i + 1}`);

    questions.forEach((qObj, idx) => {
      const spotKey = `${wId}_${idx}`;
      const isDone = state.doneWonderSpots.has(spotKey);
      const pos = spotCoords[idx % spotCoords.length];
      const title = spotTitles[idx] || `Plats ${idx + 1}`;

      const badgeHtml = isDone
        ? `<div class="spot-photo" style="background-image:url(${wonder.photo}); border-color:#66e38c; position:relative;"><span style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(20,60,30,0.45); color:#8cf0a4; font-size:24px; font-weight:900;">✓</span></div>`
        : `<div class="spot-undiscovered-badge" style="border-color:#ffbe3d; color:#ffd875; box-shadow:0 0 18px rgba(255,190,61,0.55), 0 6px 14px rgba(0,0,0,0.85);"><span>★${idx + 1}</span></div>`;

      const spotEl = createSpot(
        pos[0], pos[1],
        `sight ${isDone ? 'done' : 'undiscovered'}`,
        badgeHtml,
        title,
        () => openWonderSpotQuiz(wId, idx)
      );
      el.spotsContainer.appendChild(spotEl);
    });

    // Unikt världsarvs-minispel direkt på platsen!
    const wonderMg = WONDER_MINIGAME_MAP[wId];
    if (wonderMg && window.GT_MINIGAMES) {
      const mgSpot = createSpot(
        60, 74,
        'sight',
        `<div class="spot-photo" style="background-image:url(${wonder.photo}); border-color:#ffbe3d; box-shadow:0 0 18px rgba(255,190,61,0.65);"></div>`,
        `★ Spela: ${wonderMg.label}`,
        () => openWonderMinigame(wId)
      );
      el.spotsContainer.appendChild(mgSpot);
    }

    // Tydlig återrese-ikon tillbaka till närmaste stad (alltid synlig etikett även på mobil!)
    const gwCity = W.cities[wonder.from];
    const gwName = gwCity ? gwCity.name : wonder.from;
    const returnSpot = createSpot(
      30, 75,
      'service wonder-return-spot',
      `<div class="spot-badge" style="border-color:#ffd875;"><img class="spot-model-img" src="assets/icons/airport_3d.jpg" alt="Återvänd"></div>`,
      `« Återvänd till ${gwName}`,
      () => returnFromWonder()
    );
    el.spotsContainer.appendChild(returnSpot);

    updateHUD();
    if (el.cityEventRibbon) {
      el.cityEventRibbon.innerHTML = `<button type="button" class="globe-brass-btn" style="padding:3px 10px; font-size:11px;" onclick="window.GT.returnFromWonder()">« Återvänd till ${gwName}</button>`;
      el.cityEventRibbon.classList.remove('hidden');
    }
    if (window.AmbientMgr) {
      window.AmbientMgr.setScene('wonder', wonder.region || 'Europa');
    }
  }

  function openWonderSpotQuiz(wonderId, spotIdx) {
    const wonder = W.wonders[wonderId];
    if (!wonder || !wonder.questions || !wonder.questions[spotIdx]) return;
    const spotTitle = (wonder.spots && wonder.spots[spotIdx]) || `${wonder.name} #${spotIdx + 1}`;
    const qObj = { ...wonder.questions[spotIdx], t: wonder.questions[spotIdx].t || wonder.questions[spotIdx].type || 'mc' };
    const wId = wonder.id || wonderId;
    const spotKey = `${wId}_${spotIdx}`;
    const isAlreadyDone = state.doneWonderSpots.has(spotKey);

    const html = `
      <div class="scene-fullscreen scene-sight-full" style="background-image:url(${wonder.photo})">
        <div class="sight-header-bar">
          <div class="sight-plaque" style="border-color:#ffbe3d;">
            <h3>★ ${spotTitle.toUpperCase()}</h3>
            <div class="sight-meta">
              ${wonder.name} (${wonder.country}) · Världsarv
              ${isAlreadyDone ? ' · <span style="color:#78e08f; font-weight:bold;">UTFORSKAD</span>' : ''}
            </div>
          </div>
          ${exitIconBtn(`Tillbaka till ${wonder.name}`)}
        </div>

        <div class="sight-bottom-panel">
          <div id="quizContainer"></div>
        </div>
      </div>
    `;
    showModal(html);

    runQuiz([qObj], ({ correct, total }) => {
      if (correct < total) {
        closeModal();
        showToast('Svara rätt för att utforska platsen! Prova igen.', 3000);
        return;
      }
      state.doneWonderSpots.add(spotKey);
      const totalSpots = (wonder.questions || []).length;
      const doneSpotsCount = (wonder.questions || []).filter((_, i) => state.doneWonderSpots.has(`${wId}_${i}`)).length;

      if (doneSpotsCount >= totalSpots && !state.doneWonders.has(wId)) {
        state.doneWonders.add(wId);
        state.dayLog.activities.push(`Utforskat världsarvet ${wonder.name}`);
        addJournal(`Utforskat hela världsarvet ${wonder.name} (${wonder.country}) under expeditionen från ${W.cities[wonder.from]?.name || wonder.from}.`);
        AudioMgr.play('fanfar');

        if (window.GT_MP && window.GT_MP.active) {
          const firstClaim = window.GT_MP.claimWonder(wonder.id, wonder.name, state.playerFirstName);
          if (firstClaim) {
            changeCash(BAL.FIRST_CLAIM_BONUS, `Först på världsarvet ${wonder.name}`);
            showToast(`FÖRST PÅ PLATS! +${BAL.FIRST_CLAIM_BONUS} kr för ${wonder.name}!`, 4000);
          }
        }

        if (wonder.souvenir && W.souvenirs[wonder.souvenir] && state.backpack.length < getMaxBackpackSlots()) {
          const itemDef = W.souvenirs[wonder.souvenir];
          state.backpack.push({
            id: wonder.souvenir,
            name: itemDef.name,
            origin: itemDef.origin,
            buyPrice: 0,
            buyDay: state.day
          });
          showToast(`Världsarv avklarat! Du fann även en unik souvenir: ${itemDef.name}!`, 4000);
        } else {
          showToast(`Världsarvet ${wonder.name} är nu helt utforskat och stämplat i passet (${state.doneWonders.size}/${Object.keys(W.wonders).length})!`, 4000);
        }
      } else {
        showToast(`${spotTitle} utforskad (${doneSpotsCount}/${totalSpots} på ${wonder.name})!`, 2400);
      }

      saveGame();
      closeModal();
      renderCity();
    }, wonder.photo);
  }

  function returnFromWonder() {
    if (!state.activeWonder) return;
    const wonder = W.wonders[state.activeWonder];
    const gwKey = wonder ? wonder.from : state.city;
    const gwCity = W.cities[gwKey];
    const gwName = gwCity ? gwCity.name : gwKey;
    const returnHours = wonder ? (wonder.hoursEach || 2) : 2;
    const wonderKey = state.activeWonder;

    closeModal();
    el.travelTitle.textContent = `ÅTERRESA: ${wonder ? wonder.name.toUpperCase() : 'VÄRLDSARV'} ➔ ${gwName.toUpperCase()}`;
    el.travelSub.textContent = `${wonder?.transportMode || 'Expedition'} · Restid tillbaka: ${returnHours} timmar`;

    const canvas = document.getElementById('flightGlobeCanvas');
    const flightGlobe = new window.GlobeRenderer(canvas, { interactive: false, radius: 220, doneWonders: state.doneWonders });
    if (wonder) {
      flightGlobe.centerLon = wonder.lon;
      flightGlobe.centerLat = wonder.lat;
    }

    const globeWrap = document.getElementById('travelGlobeWrap');
    const vigWrap = document.getElementById('travelVignetteWrap');
    if (globeWrap) globeWrap.classList.remove('hidden');
    if (vigWrap) vigWrap.classList.add('hidden');

    el.travelCinematic.classList.remove('hidden');
    AudioMgr.play('takeoff');

    let animFrame = null;
    const loop = () => {
      if (el.travelCinematic.classList.contains('hidden')) return;
      flightGlobe.render(state.travelHistory, state.city);
      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);

    let finished = false;
    const finishReturn = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(animFrame);
      el.travelCinematic.classList.add('hidden');
      el.travelSkipBtn.onclick = null;

      addHours(returnHours);
      state.activeWonder = null;
      state.city = gwKey;
      saveGame();
      AudioMgr.play('bell');
      renderCity();
      showToast(`Tillbaka i ${gwName} efter resan till ${wonder ? wonder.name : 'världsarvet'}!`, 3000);
    };

    el.travelSkipBtn.onclick = finishReturn;
    flightGlobe.animateFlight(wonderKey, gwKey, () => {
      setTimeout(finishReturn, 350);
    }, false, 2200);
  }

  function startWonderTrip(wonderKey) {
    const wonder = W.wonders[wonderKey];
    if (!wonder) return;
    if (state.activeWonder === wonderKey) {
      closeModal();
      renderCity();
      return;
    }
    if (state.city !== wonder.from) {
      const gwName = W.cities[wonder.from]?.name || wonder.from;
      showToast(`Res till ${gwName} först för att åka till ${wonder.name}.`, 3000);
      return;
    }
    const totalCost = wonder.transport + wonder.fee;
    if (state.cash < totalCost) {
      alert("Du har inte råd med expeditionen!");
      return;
    }

    const origin = W.cities[wonder.from];
    closeModal();

    el.travelTitle.textContent = `EXPEDITION: ${origin.name.toUpperCase()} ➔ ${wonder.name.toUpperCase()}`;
    el.travelSub.textContent = `${wonder.transportMode || 'Expedition'} · Utresa: ${wonder.hoursEach} tim · Pris t/r: ${totalCost} kr`;

    const canvas = document.getElementById('flightGlobeCanvas');
    const flightGlobe = new window.GlobeRenderer(canvas, { interactive: false, radius: 220, doneWonders: state.doneWonders });
    flightGlobe.centerLon = origin.lon;
    flightGlobe.centerLat = origin.lat;

    const globeWrap = document.getElementById('travelGlobeWrap');
    const vigWrap = document.getElementById('travelVignetteWrap');
    if (globeWrap) globeWrap.classList.remove('hidden');
    if (vigWrap) vigWrap.classList.add('hidden');

    el.travelCinematic.classList.remove('hidden');
    AudioMgr.play('takeoff');

    let animFrame = null;
    const loop = () => {
      if (el.travelCinematic.classList.contains('hidden')) return;
      flightGlobe.render(state.travelHistory, state.city);
      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);

    let finished = false;
    const arriveAtWonder = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(animFrame);
      el.travelCinematic.classList.add('hidden');
      el.travelSkipBtn.onclick = null;

      changeCash(-totalCost, `Expedition till ${wonder.name}`);
      addHours(wonder.hoursEach);
      state.activeWonder = wonderKey;
      saveGame();
      AudioMgr.play('bell');
      renderCity();
      showToast(`Framme vid världsarvet ${wonder.name}! Klicka på de 3 stjärnorna för att utforska platsen.`, 4200);
    };

    el.travelSkipBtn.onclick = arriveAtWonder;
    flightGlobe.animateFlight(wonder.from, wonderKey, () => {
      setTimeout(arriveAtWonder, 350);
    }, false, 2400);
  }

  // --- Quiz-motor (delegeras till GT_QUIZ) ---
  function runQuiz(questions, onComplete, contextPhoto = null, opts = {}) {
    return QUIZ.runQuiz({ W, state, AudioMgr, showToast, updateHUD, addJournal }, questions, onComplete, contextPhoto, opts);
  }

  // --- Jobbpass (Riktig 3-spaltig dagstidning där jobbannonsen är inringad med röd penna!) ---
  function openJobModal() {
    if (!requireNotLateNight('Dagstidningen')) return;
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
    const latestBotNews = (state.botNews && state.botNews.length > 0) ? state.botNews[state.botNews.length - 1] : null;
    const botNewsLine = latestBotNews ? ` · RESENYTT (Dag ${latestBotNews.day}): ${latestBotNews.text}` : '';
    const dealNotis = (dealCityKey
      ? `Sista-minuten: -${state.deals[dealCityKey]} % på flyg mot ${W.cities[dealCityKey].name} idag.`
      : `Kolla avgångstavlan på flygplatsen för dagens Stand by-biljetter (-25 %).`) + botNewsLine;

    const cityMg = window.GT_MINIGAMES ? window.GT_MINIGAMES.getForCity(state.city, state.day) : null;
    const camBonus = BAL.CAMERA_JOB_BONUS || 0.20;
    const camPct = Math.round(camBonus * 100);
    const kb = getCurrentKnowledgeBonuses(state.city);
    const kbJobPct = Math.round(kb.totalJobBonus * 100);
    const classifiedAdsHtml = cityJobs.slice(0, 3).map((job, idx) => {
      const finalPay = Math.round(job.pay * (1 + (hasCamera ? camBonus : 0) + kb.totalJobBonus) * evMult);
      const doneKey = `${state.city}_${state.day}_${idx}`;
      const alreadyDone = !!state.jobsDoneToday[doneKey];
      const isMinigameAd = (idx === 2 && cityMg);
      const adClass = idx === 0 ? 'bp-classified-ad circled' : 'bp-classified-ad';
      const titleText = isMinigameAd ? `${cityMg.title}` : `${job.title} sökes!`;
      const kickerText = isMinigameAd ? '★ PRAKTISKT MINISPEL' : (job.tag || `Platsannons #${idx + 1}`).toUpperCase();
      const pitch = isMinigameAd
        ? `Praktiskt skicklighetspass direkt på plats! Klara utmaningen för full lön och yrkeskompetens i passet.`
        : (job.adText || `${job.employer} söker en pålitlig resenär för dagens pass med kontant lön direkt i handen.`);

      const recKey = `${state.city}_${idx}`;
      const mpRec = (window.GT_MP && window.GT_MP.active && window.GT_MP.jobRecords[recKey]) || null;
      const botRec = (!mpRec && state.botJobRecords && state.botJobRecords[recKey]) || null;
      const rec = mpRec || botRec;
      const recBonusAmt = mpRec ? 400 : 350;
      const recBadge = rec
        ? (rec.holder === state.playerFirstName
          ? `<div class="bp-ad-bonus" style="color:#1c5c26;">★ Ditt rekord här: ${rec.score}/${rec.max}</div>`
          : `<div class="bp-ad-bonus" style="color:#9e1f1f; background:rgba(184,35,35,0.1); padding:2px 5px; border-radius:3px;">🏆 ${rec.holder.toUpperCase()}S REKORD: ${rec.score}/${rec.max} · Slå det (+${recBonusAmt} kr)!</div>`)
        : '';

      return `
        <article class="${adClass}">
          <div class="bp-ad-kicker" style="${isMinigameAd ? 'color:#8c1f1f;' : ''}">${kickerText}</div>
          <h5 class="bp-ad-title">${titleText}</h5>
          <div class="bp-ad-meta">
            <b>${job.employer}</b> · ${job.hours} tim · <span class="bp-ad-pay">Upp till ${finalPay} kr</span>
          </div>
          <p class="bp-ad-copy">${pitch}</p>
          ${recBadge}
          ${hasCamera ? `<div class="bp-ad-bonus">+${camPct} % Kamerabonus aktiv</div>` : ''}
          ${kbJobPct > 0 ? `<div class="bp-ad-bonus" style="color:#1c5c26;">+${kbJobPct} % Lokalkännedom${kb.streakActive ? ' &amp; Reseflyt' : ''}</div>` : ''}
          ${(cityEv && cityEv.jobBonus) ? `<div class="bp-ad-bonus">+${Math.round(cityEv.jobBonus * 100)} % eventbonus (${cityEv.title})</div>` : ''}
          <div class="bp-ad-action">
            ${alreadyDone
              ? `<div class="job-done-stamp">PASS AVKLARAT IDAG</div>`
              : (isMinigameAd
                ? `<button class="bp-news-apply-btn" style="background:#7a1c21; border-color:#7a1c21;" onclick="window.GT.startJobMinigame(${idx}, '${cityMg.id}')">Spela minispel (${job.hours} tim) »</button>`
                : `<button class="bp-news-apply-btn" onclick="window.GT.startJobShift(${idx})">Sök passet (${job.hours} tim) »</button>`)}
          </div>
        </article>
      `;
    }).join('');

    const html = `
      <div class="scene-fullscreen scene-newspaper-full">
        <div class="broadsheet-paper" style="position:relative;">
          <div style="position:absolute; top:8px; right:8px; z-index:10;">
            ${exitIconBtn('Vik ihop tidningen')}
          </div>
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
            </div>
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function startJobMinigame(jobIdx = 2, gameId = 'passport') {
    const city = W.cities[state.city];
    const cityJobs = (city && Array.isArray(city.jobs) && city.jobs.length > 0) ? city.jobs : [];
    const job = cityJobs[jobIdx] || cityJobs[0] || { title: 'Praktikpass', employer: city.name, hours: 4, pay: 900 };
    const mgInfo = window.GT_MINIGAMES ? window.GT_MINIGAMES.getForCity(state.city, state.day) : { id: gameId, title: job.title };
    const container = document.getElementById('quizContainer');
    if (!container || !window.GT_MINIGAMES) return;

    state.jobsDoneToday[`${state.city}_${state.day}_${jobIdx}`] = true;

    window.GT_MINIGAMES.start(gameId || mgInfo.id, container, ({ score, max, passed, summary }) => {
      // Arbetstiden dras när passet är klart, inte innan det har börjat.
      addHours(job.hours);
      const hasCamera = hasItem('kamera');
      const cityEv = getCityEvent(state.city);
      const evMult = (cityEv && cityEv.jobBonus) ? (1 + cityEv.jobBonus) : 1;
      const kbPay = getCurrentKnowledgeBonuses(state.city).totalJobBonus;
      const maxPay = Math.round(job.pay * (1 + (hasCamera ? (BAL.CAMERA_JOB_BONUS || 0.20) : 0) + kbPay) * evMult);
      const ratio = max > 0 ? Math.max(0, Math.min(1, score / max)) : 0;
      const earned = Math.round(ratio * maxPay);

      changeCash(earned, `Lön (minispel: ${mgInfo.title})`);
      addJournal(`Genomförde minispelet ${mgInfo.title} i ${city.name} (${score}/${max}) och tjänade ${earned} kr.`);

      let recordBanner = '';
      if (window.GT_MP && window.GT_MP.active) {
        const resRec = window.GT_MP.postJobRecord(`${state.city}_${jobIdx}`, state.playerFirstName, score, max, mgInfo.title, city.name);
        if (resRec.beatOpponent) {
          changeCash(BAL.MP_JOB_RECORD_BONUS, `Slog ${resRec.prev.holder}s jobbrekord`);
          recordBanner = `<div style="margin:8px 0; padding:6px 10px; background:#fff4d2; border:2px solid #c99a45; color:#7a4f12; font-size:12.5px;"><b>🏆 NYTT REKORD!</b> Du slog ${resRec.prev.holder} (${resRec.prev.score}/${max}) och fick <b>+${BAL.MP_JOB_RECORD_BONUS} kr duellbonus</b>!</div>`;
        }
      }

      const goals = ensureJourneyGoals();
      const compKey = `mg_${gameId}`;
      let compBanner = '';
      if (passed) {
        const alreadyHas = state.competencies.some(c => c.key === compKey);
        if (!alreadyHas) {
          state.competencies.push({ key: compKey, title: mgInfo.title, city: city.name });
          saveGame();
          AudioMgr.play('fanfar');
          compBanner = `
            <div style="margin:10px 0; padding:8px 12px; background:#edf7ee; border:2px solid #2f7d43; border-radius:4px; color:#1c542b; font-size:13px;">
              <b>YRKESKOMPETENS INFÖRD I PASSET!</b><br>
              Intyg: <b>${mgInfo.title}</b> · Nu <b>${state.competencies.length} / ${goals.requiredCompetencies}</b> yrken klara!
            </div>
          `;
        } else {
          compBanner = `<div style="margin:8px 0; font-size:12px; color:#5b4a36;"><i>Du har redan yrkeskompetens inom detta yrke.</i></div>`;
        }
      } else {
        compBanner = `<div style="margin:8px 0; font-size:12px; color:#8c4a00;">Lite mer träning behövs för yrkeskompetens i passet — men du får betalt för din insats!</div>`;
      }

      container.innerHTML = `
        <div style="text-align:center; padding:16px; border:2px dashed #6b4e2e; background:#fffaf0;">
          <h4 style="color:${passed ? '#2f7d43' : '#8c4a00'}; font-size:20px; font-family:Georgia,serif;">${passed ? 'Snyggt jobbat!' : 'Passet avslutat'}</h4>
          <p>${summary}</p>
          <p style="font-size:19px; margin:10px 0; font-weight:bold; color:#7a4f12;">Utbetald lön: +${earned} kr</p>
          ${recordBanner}
          ${compBanner}
          <button class="stamp-action-btn" onclick="window.GT.closeModal()">Stoppa sedlarna i fickan</button>
        </div>
      `;
    });
  }

  function startJobShift(jobIdx = 0) {
    const city = W.cities[state.city];
    const cityJobs = (city && Array.isArray(city.jobs) && city.jobs.length > 0)
      ? city.jobs
      : (city && city.job ? [city.job] : []);
    const job = cityJobs[jobIdx] || cityJobs[0];
    if (!job) return;

    state.jobsDoneToday[`${state.city}_${state.day}_${jobIdx}`] = true;

    // Klassiskt BackPacker 1 & 2-arbetsprov: 6 frågor per jobb (3 yrkes-/stadsfrågor + 2 svårare utmaningsfrågor + 1 interaktiv fråga)!
    let baseQuestions;
    if (job.isSignature || jobIdx === 0) {
      baseQuestions = getQuestionsFor(state.city, 'job', job.questions || []).slice(0, 3);
    } else {
      const pool = job.questions || [];
      const unused = pool.filter(q => !q.id || !state.usedQuestionIds.has(q.id));
      const src = unused.length >= 3 ? unused : pool;
      baseQuestions = src.slice().sort(() => Math.random() - 0.5).slice(0, 3).map(q => ({ ...q, t: q.type || q.t }));
    }
    const hardExtras = pickHardQuestions(2, city.region);
    const interactiveExtras = pickInteractiveQuestions(1, city.region);
    const fillNeed = Math.max(0, 6 - baseQuestions.length - hardExtras.length - interactiveExtras.length);
    const extraHard = fillNeed > 0 ? pickHardQuestions(fillNeed, '') : [];
    const questions = [...baseQuestions, ...hardExtras, ...interactiveExtras, ...extraHard]
      .slice(0, 6)
      .sort(() => Math.random() - 0.5);
    const container = document.getElementById('quizContainer');

    runQuiz(questions, ({ correct, total }) => {
      // Arbetstiden dras när passet är klart, inte innan första frågan.
      addHours(job.hours);
      const correctInJob = Math.round(correct * 10) / 10;
      const hasCamera = hasItem('kamera');
      const cityEv = getCityEvent(state.city);
      const evMult = (cityEv && cityEv.jobBonus) ? (1 + cityEv.jobBonus) : 1;
      const kbPay = getCurrentKnowledgeBonuses(state.city).totalJobBonus;
      const maxPay = Math.round(job.pay * (1 + (hasCamera ? (BAL.CAMERA_JOB_BONUS || 0.20) : 0) + kbPay) * evMult);
      const earned = Math.round((correctInJob / total) * maxPay);

      changeCash(earned, `Lön från ${job.employer}`);
      addJournal(`Arbetade som ${job.title} hos ${job.employer} i ${city.name} och fick ${earned} kr i handen.`);

      let recordBanner = '';
      if (window.GT_MP && window.GT_MP.active) {
        const resRec = window.GT_MP.postJobRecord(`${state.city}_${jobIdx}`, state.playerFirstName, correctInJob, total, job.title, city.name);
        if (resRec.beatOpponent) {
          changeCash(BAL.MP_JOB_RECORD_BONUS, `Slog ${resRec.prev.holder}s jobbrekord`);
          recordBanner = `<div style="margin:8px 0; padding:6px 10px; background:#fff4d2; border:2px solid #c99a45; color:#7a4f12; font-size:12.5px;"><b>🏆 NYTT REKORD!</b> Du slog ${resRec.prev.holder} (${resRec.prev.score}/${total}) och fick <b>+${BAL.MP_JOB_RECORD_BONUS} kr duellbonus</b>!</div>`;
        }
      } else if (state.botJobRecords) {
        const bKey = `${state.city}_${jobIdx}`;
        const prevBotRec = state.botJobRecords[bKey];
        if (prevBotRec && prevBotRec.isBot && correctInJob > prevBotRec.score) {
          changeCash(BAL.BOT_JOB_RECORD_BONUS, `Slog ${prevBotRec.holder}s jobbrekord`);
          state.botJobRecords[bKey] = { holder: state.playerFirstName, isBot: false, score: correctInJob, max: total, city: city.name };
          recordBanner = `<div style="margin:8px 0; padding:6px 10px; background:#fff4d2; border:2px solid #c99a45; color:#7a4f12; font-size:12.5px;"><b>🏆 NYTT REKORD!</b> Du slog ${prevBotRec.holder} (${prevBotRec.score}/${total}) och fick <b>+${BAL.BOT_JOB_RECORD_BONUS} kr rekordbonus</b>!</div>`;
        }
      }

      // BackPacker 1 & 2-yrkeskompetens: minst 4 av 6 rätt ger yrkesintyg i passet!
      const goals = ensureJourneyGoals();
      const passThreshold = Math.ceil(total * 0.66);
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
        compBanner = `<div style="margin:8px 0; font-size:12px; color:#8c4a00;">Minst ${passThreshold} av ${total} rätt krävs för yrkeskompetens i passet.</div>`;
      }

      container.innerHTML = `
        <div style="text-align:center; padding:16px; border:2px dashed #6b4e2e; background:#fffaf0;">
          <h4 style="color:#2f7d43; font-size:20px; font-family:Georgia,serif;">Passet avslutat!</h4>
          <p>Du klarade <b>${correctInJob} av ${total}</b> arbetsuppgifter.</p>
          <p style="font-size:19px; margin:10px 0; font-weight:bold; color:#7a4f12;">Utbetald lön: +${earned} kr</p>
          ${recordBanner}
          ${compBanner}
          <button class="stamp-action-btn" onclick="window.GT.closeModal()">Stoppa sedlarna i fickan</button>
        </div>
      `;
    }, city.skyline, {
      counterPrefix: 'UPPGIFT',
      finishLabel: 'Avsluta passet »',
      headerLabel: job.employer,
      finishLabel: 'Avsluta passet »',
      disableGuidebook: true
    });
  }

  // --- Stadens Bibliotek & Uppslagsverk om Landet (Fakta & Karta + Interaktiv Historietidslinje!) ---
  function openLibraryModal(activeTab = 'facts', timelineIdx = 0) {
    if (!requireNotLateNight('Biblioteket')) return;
    AudioMgr.play('paper');
    const city = W.cities[state.city];
    const cf = (window.GT_COUNTRY_FACTS && window.GT_COUNTRY_FACTS[state.city]) || null;
    const ch = (window.GT_COUNTRY_HISTORY && window.GT_COUNTRY_HISTORY[state.city]) || null;
    if (!cf) {
      showToast('Biblioteket är stängt för inventering idag.', 2200);
      return;
    }

    let bodyHtml = '';
    if (activeTab === 'knowledge') {
      const curRegNorm = ROUTES.normRegion(city.region);
      const kbNow = getCurrentKnowledgeBonuses(state.city);
      const knownRegions = new Set();
      Object.values(W.cities || {}).forEach(c => {
        if (c && c.region) knownRegions.add(ROUTES.normRegion(c.region));
      });
      const regionOrder = ['europa', 'afrika', 'asien', 'oceanien', 'nordamerika', 'sydamerika']
        .filter(r => knownRegions.has(r));
      const regionLabel = ROUTES.regionLabel;

      const barsHtml = regionOrder.map(rKey => {
        const pct = (state.regionKnowledge && state.regionKnowledge[rKey]) || 0;
        const rKb = ECON.getKnowledgeBonuses(pct, 0);
        const barColor = rKb.tier === 2 ? '#2f7d43' : (rKb.tier === 1 ? '#c98a1c' : '#8c6832');
        const statusTxt = rKb.tier === 2
          ? 'Nivå 2 · +30% lön, +15% prutning, -10% resa'
          : (rKb.tier === 1 ? 'Nivå 1 · +15% lön, +8% prutning' : 'Nybörjare · Nå 30% för Nivå 1');
        const isCurrent = rKey === curRegNorm;
        return `
          <div class="encyc-know-row ${isCurrent ? 'current' : ''}">
            <div class="encyc-know-head">
              <span><b>${regionLabel(rKey)}</b> ${isCurrent ? '<small>(Här är du nu)</small>' : ''}</span>
              <span style="font-weight:bold; color:${barColor};">${pct} %</span>
            </div>
            <div class="encyc-know-bar-bg">
              <div class="encyc-know-bar-fill" style="width:${pct}%; background:${barColor};"></div>
              <span class="encyc-know-mark" style="left:30%;" title="Nivå 1 (30%)"></span>
              <span class="encyc-know-mark" style="left:60%;" title="Nivå 2 (60%)"></span>
            </div>
            <div class="encyc-know-sub">${statusTxt}</div>
          </div>
        `;
      }).join('');

      bodyHtml = `
        <div class="encyc-know-single">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <div>
              <div class="encyc-section-title" style="margin-bottom:2px;">DIN LOKALKÄNNEDOM PER VÄRLDSDEL</div>
              <div style="font-size:11.5px; color:#5b4228;">
                🔥 Reseflyt: <b>${state.streak || 0} rätt i rad</b> ${kbNow.streakActive ? '<span style="color:#216e35; font-weight:bold;">(Aktivt: +10% jobblön!)</span>' : `(nå 3 för +10% jobblön)`}
              </div>
            </div>
            <button type="button" class="encyc-tab-btn" onclick="window.GT.openKnowledgeHelpPopup()">ⓘ Hur fungerar lokalkännedom?</button>
          </div>
          <div class="encyc-know-list">${barsHtml}</div>
        </div>
      `;
    } else if (activeTab === 'history' && ch && Array.isArray(ch.timeline) && ch.timeline.length > 0) {
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
                <div class="encyc-sub">${city.name} · ${ROUTES.regionLabel(city.region)}</div>
              </div>
              <div class="encyc-tabs">
                <button class="encyc-tab-btn ${activeTab === 'facts' ? 'active' : ''}" onclick="window.GT.openLibraryModal('facts', 0)">Fakta &amp; Karta</button>
                <button class="encyc-tab-btn ${activeTab === 'history' ? 'active' : ''}" onclick="window.GT.openLibraryModal('history', 0)">Historia &amp; Tidslinje</button>
                <button class="encyc-tab-btn ${activeTab === 'knowledge' ? 'active' : ''}" onclick="window.GT.openLibraryModal('knowledge', 0)">Lokalkännedom (${getCurrentKnowledgeBonuses(state.city).pct}%)</button>
              </div>
            </div>

            ${bodyHtml}
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function openKnowledgeHelpPopup() {
    AudioMgr.play('klick');
    const kbNow = getCurrentKnowledgeBonuses(state.city);
    const gain = BAL.KNOWLEDGE_GAIN_PER_CORRECT || 4;
    const html = `
      <div class="card-modal" style="max-width:520px; background:linear-gradient(180deg,#fdf7e8 0%,#f0e2c2 100%); border:3px ridge #9e7537;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:8px;">
          <div>
            <div style="font-size:10px; letter-spacing:1.4px; color:#8c5a18; font-weight:bold; text-transform:uppercase;">BIBLIOTEKETS RESEHANDBOK</div>
            <h3 style="margin:2px 0 0; font-family:Georgia,serif; color:#3d2410;">Så fungerar Lokalkännedom &amp; Reseflyt</h3>
          </div>
          <button type="button" class="globe-brass-btn" style="padding:4px 10px; font-size:11px;" onclick="window.GT.openLibraryModal('knowledge', 0)">✕ Stäng</button>
        </div>
        <p class="encyc-know-intro">
          Varje gång du svarar rätt på frågor i en världsdel (på <b>sevärdheter</b>, <b>jobbpass</b> eller <b>världsarv</b>) stiger din lokalkännedom i den världsdelen med <b>+${gain} %</b> (+${Math.round(gain / 2)} % vid delpoäng).
        </p>
        <div class="encyc-know-tier-list" style="margin-bottom:12px;">
          <div class="encyc-know-tier">
            <b>Nivå 1 (≥ 30 % lokalkännedom)</b>
            <span>+15 % högre lön på alla jobbpass och +8 % bättre chans när du prutar i världsdelen.</span>
          </div>
          <div class="encyc-know-tier gold">
            <b>Nivå 2 (≥ 60 % lokalkännedom)</b>
            <span>+30 % högre jobblön, +15 % bättre prutchans <b>och -10 % rabatt på alla flyg-, tåg- och båtbiljetter</b> härifrån!</span>
          </div>
          <div class="encyc-know-tier streak">
            <b>🔥 Reseflyt (3+ rätt i rad) · Nu: ${state.streak || 0} i rad</b>
            <span>Ger ytterligare <b>+10 % extra jobblön</b> så länge du inte svarar fel (${kbNow.streakActive ? 'AKTIVT JUST NU!' : `svara rätt på ${Math.max(1, 3 - (state.streak || 0))} fråga/frågor till`}).</span>
          </div>
        </div>
        <div class="modal-footer" style="justify-content:flex-end;">
          <button class="stamp-action-btn" onclick="window.GT.openLibraryModal('knowledge', 0)">Tillbaka till Biblioteket</button>
        </div>
      </div>
    `;
    showModal(html);
  }
  function getEffectiveBuyPrice(key) {
    return ECON.getEffectiveBuyPrice(W, state, key, getCityEvent(state.city));
  }

  function getEffectiveSellInfo(itemOrId) {
    return ECON.getEffectiveSellInfo(W, state, itemOrId, getCityEvent(state.city));
  }

  function getMarketInfo(cityKey) {
    return ECON.getMarketInfo(W, cityKey);
  }

  const GEAR_SHOP_ITEMS = BAL.GEAR_SHOP_ITEMS || [];
  const MAIL_HOME_COST = BAL.MAIL_HOME_COST || 250;

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
    changeCash(-MAIL_HOME_COST, `Postade hem ${item.name} till ${homeCityName()}`);
    AudioMgr.play('stamp');
    AudioMgr.play('paper');
    addJournal(`Postade hem ${item.name} (från ${W.cities[item.origin]?.name || item.origin}) till ${homeCityName()} för ${MAIL_HOME_COST} kr.`);
    showToast(`${item.name} är på väg hem till ${homeCityName()}! Plats frigjord i ryggsäcken.`, 2800);
    openBazaarModal(`Paketet med ${item.name} är frankerat och stämplat — tryggt på väg hem till ${homeCityName()}!`, 'gear');
  }

  function openBazaarModal(customSpeech = null, activeTab = 'market') {
    if (!requireNotLateNight('Marknaden')) return;
    if (window.AmbientMgr) window.AmbientMgr.setScene('bazaar');
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
              <span class="market-kind-pill">RYGGSÄCK NIVÅ ${nextTier.level} / ${BACKPACK_TIERS.length}</span>
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
                    <div class="market-item-desc">Från <b>${W.cities[item.origin]?.name || item.origin}</b> · Postas hem till ${homeCityName()} och frigör 1 ryggsäcksplats!</div>
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
             <b>Redan postat hem till ${homeCityName()} (${state.mailedHome.length} st):</b>
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
                      ? `<button class="market-btn-haggle" onclick="window.GT.haggleSouvenir('${k}', 'polite')" title="Säkert bud (-10 %, hög chans)">-10%</button>
                         <button class="market-btn-haggle" onclick="window.GT.haggleSouvenir('${k}', 'firm')" title="Lagom bud (-20 %, medelrisk)">-20%</button>
                         <button class="market-btn-haggle" onclick="window.GT.haggleSouvenir('${k}', 'bold')" title="Skambud (-35 %, risk för +15 % straffpris!)">-35%!</button>`
                      : `<span class="market-locked-note">${hState.won ? 'Prutat klart' : (hState.angry ? 'Sur handlare!' : 'Fast pris idag')}</span>`}
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
              <span class="market-keeper-quote">”${customSpeech || (activeTab === 'gear' ? `Behöver du större ryggsäck, smarta reseprylar eller skicka hem ett paket till ${homeCityName()}?` : keeper.greet)}”</span>
              ${cityEv && (cityEv.buyDiscount || cityEv.sellBonus) ? `<span class="market-event-pill">${cityEv.title}: ${cityEv.effectText}</span>` : ''}
            </div>
            ${bodyColumnsHtml}
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function haggleSouvenir(key, tier = 'firm') {
    const s = W.souvenirs[key];
    if (!s) return;
    const hKey = `${state.city}_${state.day}_${key}`;
    const basePrice = getEffectiveBuyPrice(key);
    const hasParlor = hasItem('parlor');
    const kb = getCurrentKnowledgeBonuses(state.city);
    const res = ECON.resolveHaggle(basePrice, tier, hasParlor, Math.random, kb.haggleBonus);

    state.haggleState[hKey] = {
      price: res.price,
      won: res.won,
      angry: res.outcome === 'angry',
      locked: true
    };

    if (res.outcome === 'won') {
      AudioMgr.play('right1');
      addJournal(`Prutade fram ett kanonpris på ${s.name} (${res.price} kr) i ${W.cities[state.city].name}!`);
      openBazaarModal(`Haha, du är en skarp förhandlare! Okej då — ${res.price} kr för ${s.name}, men inte ett öre lägre!`);
    } else if (res.outcome === 'half') {
      AudioMgr.play('klick');
      openBazaarModal(`Nja, lite väl hårt! Vi möts halvvägs på ${s.name}: ${res.price} kr.`);
    } else if (res.outcome === 'angry') {
      AudioMgr.play('wrong1');
      openBazaarModal(`Skambud?! För en sådan förolämpning mot äkta hantverk höjer jag priset på ${s.name} till ${res.price} kr idag!`);
    } else {
      AudioMgr.play('wrong1');
      openBazaarModal(`Tyvärr, jag kan inte gå lägre på ${s.name}. Fast pris ${res.price} kr idag.`);
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

  // --- Ruttnätverk & Daglig Avgångstavla (delegeras till GT_ROUTES) ---
  const CITY_AIRLINE_PREFIX = ROUTES.CITY_AIRLINE_PREFIX;

  function getCityRoutePool(cityKey) {
    return ROUTES.getCityRoutePool(W, cityKey);
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

  // --- Resor och Avgångar: Avgångshall (Flyg), Tågstation (Tåg) & Oceanhamn (Båt)! ---
  function openTravelModal(mode = 'air') {
    const currentCity = W.cities[state.city];
    const hasBoats = currentCity.boats && currentCity.boats.length > 0;
    const trains = ROUTES.getTrainsFrom(state.city);
    const hasTrains = trains.length > 0;

    if (window.AmbientMgr) {
      window.AmbientMgr.setScene(mode === 'sea' ? 'harbor' : (mode === 'train' ? 'train' : 'airport'));
    }

    const kbTravel = getCurrentKnowledgeBonuses(state.city);
    const kbDisc = kbTravel.ticketDiscount || 0;

    if (mode === 'train') {
      AudioMgr.play('flap');
      let trainsHtml = '';
      if (hasTrains) {
        trains.forEach(tr => {
          const dest = W.cities[tr.to];
          if (!dest) return;
          const dist = getDistanceBetweenCities(state.city, tr.to);
          const trPrice = Math.round(tr.price * (1 - kbDisc));
          trainsHtml += `
            <div class="flap-row" style="border-color:rgba(110, 210, 145, 0.35); background:rgba(14, 38, 24, 0.65);">
              <div>
                <div class="flap-dest" style="color:#a7f3c0;">🚂 ${tr.name.toUpperCase()} ${kbDisc > 0 ? `<span class="flight-standby">KUNSKAP -${Math.round(kbDisc * 100)}%</span>` : ''}</div>
                <div class="flap-meta">TÅGLINJE TILL ${dest.name.toUpperCase()} (${dist.toLocaleString('sv-SE')} KM) · RESTID: ${tr.hours} TIM · PRIS: ${trPrice} KR</div>
              </div>
              <div>
                <button class="ticket-btn" style="background:linear-gradient(180deg,#3b8d56 0%,#235c36 100%); color:#f7fff9;" onclick="window.GT.startTravel('${tr.to}', ${trPrice}, ${tr.hours}, false, true)">Köp tågbiljett<br>${trPrice} kr</button>
              </div>
            </div>
          `;
        });
      } else {
        trainsHtml = `<div style="padding:16px; color:#c8e5d0; font-style:italic; text-align:center;">Inga internationella långdistanståg avgår från ${currentCity.name}.</div>`;
      }

      const html = `
        <div class="scene-fullscreen scene-room-bg" style="background-image:url(assets/photos/airport_hall.jpg)">
          <div class="room-top-bar">
            <div class="sight-plaque" style="border-color:#56c278;">
              <h3>CENTRALSTATION &amp; TÅGTABELL · ${currentCity.name.toUpperCase()}</h3>
              <div class="sight-meta">Dag ${state.day} · Kassa: ${state.cash.toLocaleString('sv-SE')} kr · Prisvärda tågförbindelser över land</div>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="globe-brass-btn" onclick="window.GT.openTravelModal('air')">Till flygplatsen »</button>
              ${hasBoats ? `<button class="globe-brass-btn" onclick="window.GT.openTravelModal('sea')">Till oceanhamnen »</button>` : ''}
              ${exitIconBtn(`Stanna kvar i ${currentCity.name}`)}
            </div>
          </div>
          <div class="room-counter-dock" style="display:flex; justify-content:center;">
            <div class="modal-departure-board" style="max-width:780px; width:100%; max-height:none; border-color:#56c278;">
              <div class="board-header">
                <div class="board-title" style="color:#9ff0b8;">AVGÅNGAR SPÅR 1–4 · ${currentCity.name.toUpperCase()} C</div>
                <div class="board-ticket-css">INTERRAIL / TÅGBILJETT</div>
              </div>
              <div>${trainsHtml}</div>
              <div class="board-footnote">
                Tåg är oftast betydligt billigare än flyg och tar dig smidigt mellan grannstäderna utan väntan på flygplatsen.
              </div>
            </div>
          </div>
        </div>
      `;
      showModal(html);
      return;
    }

    if (mode === 'sea') {
      AudioMgr.play('ferry');
      let boatsHtml = '';
      if (hasBoats) {
        currentCity.boats.forEach(b => {
          const dest = W.cities[b.to];
          if (!dest) return;
          const dist = getDistanceBetweenCities(state.city, b.to);
          const bPrice = Math.round(b.price * (1 - kbDisc));
          boatsHtml += `
            <div class="flap-row boat-row">
              <div>
                <div class="flap-dest"><img class="inline-icon round" src="assets/icons/harbor_3d.jpg" alt=""> ${b.name.toUpperCase()} ${kbDisc > 0 ? `<span class="flight-standby">KUNSKAP -${Math.round(kbDisc * 100)}%</span>` : ''}</div>
                <div class="flap-meta">OCEANLINJE TILL ${dest.name.toUpperCase()} (${dist.toLocaleString('sv-SE')} KM) · RESTID: ${b.days} DAGAR · PRIS: ${bPrice} KR</div>
              </div>
              <div>
                <button class="ticket-btn" onclick="window.GT.startTravel('${b.to}', ${bPrice}, ${b.days}, true)">Mönstra på<br>${bPrice} kr</button>
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
      if (kbDisc > 0) {
        price = Math.round(price * (1 - kbDisc));
      }

      const finalPrice = price;
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
              ${kbDisc > 0 ? `<span class="flight-standby">KUNSKAP -${Math.round(kbDisc * 100)}%</span>` : ''}
            </div>
            <div class="flap-meta">STRÄCKA: ${dist.toLocaleString('sv-SE')} KM · FLYGTID: ${hours} TIM · PRIS: ${finalPrice} KR</div>
            ${destEv ? `<div class="flap-event-note">* ${destEv.title}: ${destEv.effectText}</div>` : ''}
          </div>
          <div>
            ${isClosed
              ? `<span class="flap-status-closed">${closedLabel}</span>`
              : `<button class="ticket-btn" onclick="window.GT.startTravel('${destKey}', ${finalPrice}, ${hours}, false)">Köp biljett<br>${finalPrice} kr</button>`}
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
            ${hasTrains ? `<button class="globe-brass-btn" onclick="window.GT.openTravelModal('train')">Till tågstationen »</button>` : ''}
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

  function openGlobeModal(focusBotId = null) {
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

    const goals = ensureJourneyGoals();
    const goalCitiesList = goals.souvenirCities.map(ck => ({
      key: ck,
      name: W.cities[ck]?.name || ck,
      done: Boolean(hasGoalSouvenirFrom(ck))
    }));
    const goalQuickHtml = `<div style="margin-top:4px; display:flex; flex-wrap:wrap; gap:5px; align-items:center;">
      <span style="font-size:10.5px; color:#ff9f43; font-weight:bold;">★ Dina passmål (klicka för att visa):</span>
      ${goalCitiesList.map(g => `<button type="button" class="globe-brass-btn" data-goal-focus="${g.key}" style="padding:2px 8px; font-size:10px; border-color:${g.done ? '#66e38c' : '#ff9f43'}; color:${g.done ? '#8cf0a4' : '#ffd875'};">${g.done ? '✓' : '★'} ${g.name}</button>`).join('')}
      <span style="font-size:10px; color:#9ec7a6; margin-left:4px;">· Streckade linjer = direktförbindelser härifrån</span>
    </div>`;

    const botLegendHtml = (state.bots && state.bots.length > 0)
      ? `<div style="margin-top:5px; padding-top:5px; border-top:1px dashed rgba(212,166,74,0.35); display:flex; flex-wrap:wrap; gap:5px; align-items:center;">
           <span style="font-size:10.5px; color:#ffd875; font-weight:bold;">Medresenärer (klicka för rutt):</span>
           <button type="button" class="globe-brass-btn" data-bot-focus="" style="padding:2px 7px; font-size:10px; ${!focusBotId ? 'border-color:#ffd875; color:#ffd875;' : ''}">Alla</button>
           ${state.bots.map(b => `<button type="button" class="globe-brass-btn" data-bot-focus="${b.id}" style="padding:2px 7px; font-size:10px; border-color:${b.color}; ${focusBotId === b.id ? `background:${b.color}; color:#120c07; font-weight:bold;` : ''}"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${b.color};margin-right:4px;"></span>${b.name} (${W.cities[b.city]?.name || b.city})</button>`).join('')}
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
            <button class="globe-brass-btn" id="globeToggleLabelsBtn" style="padding:6px 10px; font-size:11px; white-space:nowrap;" title="Visa eller dölj namn för mål och direktrutter">🏷️ Namn: AV</button>
            ${(state.bots && state.bots.length > 0) ? `<button class="globe-brass-btn" id="globeToggleBotsBtn" style="padding:6px 10px; font-size:11px; white-space:nowrap;">🤖 Bottar: PÅ</button>` : ''}
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
          <div id="globeCityCard" class="hidden" style="margin-bottom:6px; padding:8px 12px; background:rgba(16,11,7,0.95); border:1.5px solid #c99a45; border-radius:6px; color:#f4ead6; font-size:12px; box-shadow:0 6px 20px rgba(0,0,0,0.75);"></div>
          <div class="globe-info-strip">
            <div><b style="color:#ffd875;">Avverkade etapper:</b> ${routesSummary}</div>
            ${goalQuickHtml}
            ${botLegendHtml}
            ${eventsHtml}
          </div>
        </div>
      </div>
    `;
    showModal(html);

    const canvas = document.getElementById('globeCanvas');
    if (canvas && window.GlobeRenderer) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = Math.max(320, Math.min(1800, Math.round((window.innerWidth || 1120) * dpr)));
      const ch = Math.max(320, Math.min(1800, Math.round((window.innerHeight || 630) * dpr)));
      canvas.width = cw;
      canvas.height = ch;
      const isPortrait = ch > cw;
      const autoRadius = Math.round(Math.min(cw, ch) * (isPortrait ? 0.43 : 0.42));

      const renderGlobeCityCard = (cityKey) => {
        const cardEl = document.getElementById('globeCityCard');
        if (!cardEl) return;
        if (!cityKey || !W.cities[cityKey]) {
          cardEl.classList.add('hidden');
          cardEl.innerHTML = '';
          return;
        }
        const c = W.cities[cityKey];
        const isHere = cityKey === state.city;
        const dist = isHere ? 0 : getDistanceBetweenCities(state.city, cityKey);
        const directFromHere = !isHere && ROUTES.getAllOutgoingEdges(W, state.city).includes(cityKey);
        const goalItem = goalCitiesList.find(g => g.key === cityKey);
        const isStamped = state.stamps.includes(cityKey);
        const outEdges = ROUTES.getAllOutgoingEdges(W, cityKey).slice(0, 8);
        const outPills = outEdges.map(ok => {
          const oc = W.cities[ok];
          if (!oc) return '';
          return `<button type="button" class="globe-brass-btn" data-card-jump="${ok}" style="padding:2px 7px; font-size:10px;">${oc.name}</button>`;
        }).join('');

        cardEl.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
            <div>
              <div style="font-family:Georgia,serif; font-size:14px; font-weight:bold; color:#ffd875;">
                ${c.name} <span style="font-weight:normal; font-size:11.5px; color:#d8c4a0;">· ${c.country} (${ROUTES.regionLabel(c.region)})</span>
                ${goalItem ? `<span style="margin-left:5px; font-size:10px; padding:1px 6px; border-radius:3px; background:${goalItem.done ? '#1c542b' : '#7a3e0e'}; color:${goalItem.done ? '#8cf0a4' : '#ffd875'};">${goalItem.done ? '✓ MÅL KLART' : '★ PASSMÅL'}</span>` : ''}
                ${isStamped ? `<span style="margin-left:4px; font-size:10px; color:#8cf0a4;">✓ Stämplad</span>` : ''}
              </div>
              <div style="font-size:11px; color:#cbb997; margin-top:2px;">
                ${isHere
                  ? 'Du befinner dig här just nu.'
                  : `${dist.toLocaleString('sv-SE')} km från ${W.cities[state.city]?.name || state.city}${directFromHere ? ' · <b style="color:#8cf0a4;">✓ Direktförbindelse härifrån!</b>' : ''}`}
              </div>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              ${directFromHere ? `<button type="button" class="stamp-action-btn" style="padding:4px 10px; font-size:11px;" onclick="window.GT.openTravelModal('air')">Till avgångar »</button>` : ''}
              <button type="button" class="globe-brass-btn" id="globeCityCardClose" style="padding:2px 8px; font-size:11px;" title="Stäng">✕</button>
            </div>
          </div>
          ${outPills ? `<div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:4px; align-items:center;"><span style="font-size:10.5px; color:#9ec7a6;">Förbindelser från ${c.name}:</span>${outPills}</div>` : ''}
        `;
        cardEl.classList.remove('hidden');

        const closeBtn = document.getElementById('globeCityCardClose');
        if (closeBtn) {
          closeBtn.onclick = () => {
            activeGlobeRenderer.selectedCityKey = null;
            renderGlobeCityCard(null);
          };
        }
        cardEl.querySelectorAll('[data-card-jump]').forEach(btn => {
          btn.onclick = () => {
            const jk = btn.dataset.cardJump;
            const jc = jk && W.cities[jk];
            if (jc) {
              stopSpin();
              activeGlobeRenderer.selectedCityKey = jk;
              activeGlobeRenderer.focusOn(jc.lat, jc.lon, null, Math.max(250, activeGlobeRenderer.radius), 550);
              renderGlobeCityCard(jk);
              AudioMgr.play('klick');
            }
          };
        });
      };

      activeGlobeRenderer = new window.GlobeRenderer(canvas, {
        radius: autoRadius,
        doneWonders: state.doneWonders,
        goalCities: goalCitiesList,
        showRoutes: true,
        labelMode: 'off',
        onWonderClick: (wKey, w) => openWonderModal(wKey, w),
        onCitySelect: (cKey) => {
          renderGlobeCityCard(cKey);
          if (cKey) AudioMgr.play('klick');
        }
      });
      activeGlobeRenderer.focusBotId = focusBotId || null;
      const focusBot = focusBotId ? (state.bots || []).find(b => b.id === focusBotId) : null;
      const focusPt = (focusBot && W.cities[focusBot.city])
        || (state.activeWonder && W.wonders[state.activeWonder])
        || W.cities[state.city];
      if (focusPt) {
        activeGlobeRenderer.centerLon = focusPt.lon;
        activeGlobeRenderer.centerLat = focusPt.lat;
      }

      // Rotera mjukt centrerad över nuvarande plats tills spelaren klickar, drar eller zoomar
      let autoSpin = !focusBot;
      let spinPhase = 0;
      const baseLon = focusPt ? focusPt.lon : 18;
      const baseLat = focusPt ? focusPt.lat : 30;
      const stopSpin = () => { autoSpin = false; };
      canvas.addEventListener('mousedown', stopSpin);
      canvas.addEventListener('touchstart', stopSpin, { passive: true });
      canvas.addEventListener('wheel', stopSpin, { passive: true });

      document.querySelectorAll('[data-goal-focus]').forEach(btn => {
        btn.onclick = () => {
          const gKey = btn.dataset.goalFocus;
          const gc = gKey && W.cities[gKey];
          if (gc) {
            stopSpin();
            activeGlobeRenderer.selectedCityKey = gKey;
            activeGlobeRenderer.focusOn(gc.lat, gc.lon, null, Math.max(260, activeGlobeRenderer.radius), 600);
            renderGlobeCityCard(gKey);
            AudioMgr.play('klick');
          }
        };
      });

      const toggleLabelsBtn = document.getElementById('globeToggleLabelsBtn');
      if (toggleLabelsBtn) {
        toggleLabelsBtn.onclick = () => {
          activeGlobeRenderer.labelMode = activeGlobeRenderer.labelMode === 'routes' ? 'off' : 'routes';
          toggleLabelsBtn.textContent = activeGlobeRenderer.labelMode === 'routes' ? '🏷️ Namn: RUTTER & MÅL' : '🏷️ Namn: AV';
          AudioMgr.play('klick');
        };
      }

      document.querySelectorAll('[data-bot-focus]').forEach(btn => {
        btn.onclick = () => {
          const bid = btn.dataset.botFocus || null;
          stopSpin();
          activeGlobeRenderer.showBots = true;
          activeGlobeRenderer.focusBotId = bid;
          const bObj = bid ? (state.bots || []).find(b => b.id === bid) : null;
          if (bObj && W.cities[bObj.city]) {
            const c = W.cities[bObj.city];
            activeGlobeRenderer.focusOn(c.lat, c.lon, null, 285, 600);
          }
          AudioMgr.play('klick');
        };
      });

      const zoomInBtn = document.getElementById('globeZoomInBtn');
      const zoomOutBtn = document.getElementById('globeZoomOutBtn');
      const toggleBotsBtn = document.getElementById('globeToggleBotsBtn');
      if (toggleBotsBtn) {
        toggleBotsBtn.onclick = () => {
          activeGlobeRenderer.showBots = !activeGlobeRenderer.showBots;
          toggleBotsBtn.textContent = activeGlobeRenderer.showBots ? '🤖 Bottar: PÅ' : '🤖 Bottar: AV';
          AudioMgr.play('klick');
        };
      }
      if (zoomInBtn) {
        zoomInBtn.onclick = () => {
          stopSpin();
          activeGlobeRenderer.radius = Math.min(activeGlobeRenderer.maxRadius || 3600, activeGlobeRenderer.radius * 1.38);
        };
      }
      if (zoomOutBtn) {
        zoomOutBtn.onclick = () => {
          stopSpin();
          activeGlobeRenderer.radius = Math.max(activeGlobeRenderer.minRadius || activeGlobeRenderer.baseRadius * 0.72, activeGlobeRenderer.radius / 1.38);
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
        const opp = (window.GT_MP && window.GT_MP.active) ? window.GT_MP.opponent : null;
        activeGlobeRenderer.render(state.travelHistory, state.city, getActiveWorldEvents(), opp);
        globeAnimFrameId = requestAnimationFrame(loop);
      };
      globeAnimFrameId = requestAnimationFrame(loop);
    }
  }

  // Reseanimation: 3D Jordglob med röd reslinje (Flyg, Tåg eller Oceanångare!)
  function startTravel(destKey, price, timeValue, isBoat, isTrain = false) {
    if (state.cash < price) {
      alert("Du har inte råd med biljetten!");
      return;
    }
    const dest = W.cities[destKey];
    const origin = W.cities[state.city];
    const dist = getDistanceBetweenCities(state.city, destKey);
    state.departureBoard = null; // Glöm avgångstavlan vid avresa (BP1-regel)
    closeModal();

    el.travelTitle.textContent = isBoat
      ? `RESA TILL HAVS: ${origin.name.toUpperCase()} ➔ ${dest.name.toUpperCase()}`
      : (isTrain
        ? `TÅGRESA: ${origin.name.toUpperCase()} ➔ ${dest.name.toUpperCase()}`
        : `FLYGNING: ${origin.name.toUpperCase()} ➔ ${dest.name.toUpperCase()}`);
    
    el.travelSub.textContent = isBoat
      ? `Distans: ${dist.toLocaleString('sv-SE')} km · ${timeValue} dagar till sjöss`
      : (isTrain
        ? `Distans: ${dist.toLocaleString('sv-SE')} km · Tågtid: ${timeValue} timmar`
        : `Distans: ${dist.toLocaleString('sv-SE')} km · Flygtid: ${timeValue} timmar`);

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
        syncBotsToCurrentDay();
      } else {
        addHours(timeValue);
      }

      state.travelHistory.push({
        from: state.city,
        to: destKey,
        dist: dist,
        isBoat: isBoat,
        isTrain: isTrain
      });
      addJournal(`${isBoat ? 'Seglade med oceanångare' : (isTrain ? 'Åkte tåg' : 'Flög')} från ${origin.name} till ${dest.name} (${dist.toLocaleString('sv-SE')} km).`);

      state.city = destKey;
      state.visitedCities.add(destKey);
      checkPlayerOpenContracts();
      AudioMgr.play('bell');
      renderCity();
      showToast(`Välkommen till ${dest.name}!`, 3000);
      if (checkRoundTheWorldVictory()) return;

      // Kolla om spelaren har ett kurirpaket för denna stad, annars trigga resehändelse!
      const hasDelivery = state.backpack.some(item => item.kind === 'kurir' && item.relayTo === destKey);
      if (hasDelivery) {
        showToast(`Du har ett stafettpaket till ${dest.name}! Gå till hotellet för belöning!`, 4000);
      } else {
        maybeTriggerTravelEvent(isBoat, isTrain);
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
    if (window.AmbientMgr) window.AmbientMgr.setScene('hotel');
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

    // Telefonkiosk / Ringa hem till Sverige i hotellet (klassisk BackPacker-funktion!)
    if (tab === 'phone') {
      const goals = ensureJourneyGoals();
      const regionsVisited = getVisitedRegions().size;
      const loanAmt = BAL.CALL_HOME_AMOUNT || 1200;
      const loanThresh = BAL.CALL_HOME_THRESHOLD || 1500;
      const loanMax = BAL.CALL_HOME_MAX || 2;
      const loanPenalty = BAL.CALL_HOME_SCORE_PENALTY || 250;
      const canAskLoan = state.cash < loanThresh && (state.callsHomeUsed || 0) < loanMax;
      const callsLeft = Math.max(0, loanMax - (state.callsHomeUsed || 0));
      const parentGreeting = state.cash < loanThresh
        ? `"Hallå ${state.playerFirstName}! Vad roligt att du ringer från ${city.name}! Låter det lite tunt i reskassan? Vi kan föra över ett nödlån på ${loanAmt.toLocaleString('sv-SE')} kr — men det kostar ${loanPenalty} slutpoäng i klubben!"`
        : `"Hej älskling! Är du ända borta i ${city.name} på dag ${state.day}? Glöm inte att jobba, pruta smart och bygga lokalkännedom!"`;

      const html = `
        <div class="scene-fullscreen scene-hotel-desk" style="background-image:url(${getHotelPhoto(state.city)})">
          <div class="room-top-bar">
            <div class="sight-plaque">
              <h3>HOTELLTELEFON · RINGA HEM TILL SVERIGE</h3>
              <div class="sight-meta">Utlandssamtal från ${city.name} · Dag ${state.day} · Kassa: ${state.cash.toLocaleString('sv-SE')} kr</div>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="globe-brass-btn" onclick="window.GT.openHotelModal('reception')">« Till receptionen</button>
              ${exitIconBtn('Ut på stan')}
            </div>
          </div>
          <div class="room-counter-dock" style="display:flex; justify-content:center;">
            <div class="modal-departure-board" style="max-width:640px; width:100%; border-color:#d4a64a;">
              <div class="board-header">
                <div class="board-title">TELEFONKOPPLING · ${city.name.toUpperCase()} ➔ SVERIGE</div>
                <div class="board-ticket-css">RIKS / UTLAND</div>
              </div>
              <div style="padding:12px 6px; color:#f4ead6; font-family:Georgia,serif;">
                <div style="background:rgba(255,248,230,0.1); border-left:3px solid #ffd875; padding:10px 12px; font-style:italic; font-size:13.5px; line-height:1.45; margin-bottom:10px;">
                  ${tavernHtml || parentGreeting}
                </div>
                <div style="font-size:12px; color:#d8c4a0; margin-bottom:12px;">
                  <b>Status hemifrån:</b> ${regionsVisited}/${goals.requiredRegions} världsdelar · ${state.competencies.length}/${goals.requiredCompetencies} yrkeskompetenser · ${state.stamps.length} stämplar · ${state.doneWonders.size} världsarv.
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                  ${canAskLoan ? `
                    <button class="stamp-action-btn" onclick="window.GT.callHomeForMoney()">
                      Be om nödlån (+${loanAmt.toLocaleString('sv-SE')} kr · -${loanPenalty} p · ${callsLeft} kvar)
                    </button>
                  ` : `
                    <span style="font-size:11.5px; color:#c4b08e;">
                      ${(state.callsHomeUsed || 0) >= loanMax
                        ? 'Du har redan utnyttjat alla dina nödlån hemifrån under den här resan.'
                        : `Nödlån hemifrån (+${loanAmt.toLocaleString('sv-SE')} kr, -${loanPenalty} slutpoäng) kan begäras när din reskassa sjunker under ${loanThresh.toLocaleString('sv-SE')} kr.`}
                    </span>
                  `}
                  <button class="globe-brass-btn" onclick="window.GT.openHotelModal('reception')">Lägg på luren</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      showModal(html);
      return;
    }

    // Receptionsscenen (stadsanpassat hotellfoto + fysisk mahognydisk med mässingsklocka, telefon & pubskylt!)
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

          <button class="tavern-door-sign" onclick="window.GT.openHotelModal('phone')">
            <div class="sign-main">Ring hem till Sverige</div>
            <div class="sign-sub">Hotelltelefon · Kolla resmål eller be om nödpengar</div>
          </button>

          <button class="tavern-door-sign" onclick="window.GT.openHotelModal('tavern')">
            <div class="sign-main">Stig in i ${tavern.name} »</div>
            <div class="sign-sub">Prata med resenärer · Bjud på en runda · Stafettuppdrag</div>
          </button>
        </div>
      </div>
    `;
    showModal(html);
  }

  function callHomeForMoney() {
    const loanAmt = BAL.CALL_HOME_AMOUNT || 1200;
    const loanThresh = BAL.CALL_HOME_THRESHOLD || 1500;
    const loanMax = BAL.CALL_HOME_MAX || 2;
    const loanPenalty = BAL.CALL_HOME_SCORE_PENALTY || 250;
    if ((state.callsHomeUsed || 0) >= loanMax) {
      showToast('Du har redan fått dina nödlån hemifrån under denna resa.', 2600);
      return;
    }
    if (state.cash >= loanThresh) {
      showToast(`Du har gott om reskassa kvar! Nödlån behövs först under ${loanThresh.toLocaleString('sv-SE')} kr.`, 2600);
      return;
    }
    state.callsHomeUsed = (state.callsHomeUsed || 0) + 1;
    changeCash(loanAmt, `Nödlån hemifrån (-${loanPenalty} slutpoäng)`);
    addJournal(`Ringde hem till Sverige från ${W.cities[state.city]?.name || state.city} och tog ett nödlån på ${loanAmt.toLocaleString('sv-SE')} kr (-${loanPenalty} p).`);
    AudioMgr.play('cash');
    saveGame();
    const reply = state.callsHomeUsed === 1
      ? `"Självklart hjälper vi till, ${state.playerFirstName}! Vi förde just över ${loanAmt.toLocaleString('sv-SE')} kr. Ta gärna ett jobbpass i lokaltidningen och bygg lokalkännedom så pengarna räcker hela vägen hem!"`
      : `"Okej då, sista nödlånet på ${loanAmt.toLocaleString('sv-SE')} kr är på väg! Nu får du pruta smart på marknaden och jobba ihop resten själv."`;
    openHotelModal('phone', reply);
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
      const evCityName = W.cities[ev.city]?.name || ev.city;
      state.deals[ev.city] = Math.max(state.deals[ev.city] || 0, 15);
      saveGame();
      const rumorStory = ev.rumorText || ev.effectText;
      msg = `Du smyger ner på en barstol och hör en gammal reseledare berätta om <b>${ev.title}</b> i <b>${evCityName}</b>: <i>"${rumorStory}"</i><br><span style="color:#78e08f; font-size:11.5px;">★ Personlig kontakt: Reseledaren gav just dig en privat rabattkod på resan mot ${evCityName}!</span>`;
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
    state.sleptBroke = false;
    if (price === 0 && state.freeHotelCities.has(state.city)) {
      state.freeHotelCities.delete(state.city);
      state.dayLog.activities.push('Gratis hotellnatt (stafettbelöning)');
    } else if (state.cash < price) {
      state.sleptBroke = true;
      showToast('Ont om pengar! En obekväm natt på tågstationen kostar dig 3 morgontimmar imorgon.', 3400);
      addJournal(`Sov på en bänk på tågstationen i ${W.cities[state.city].name} med tom plånbok (vaknar först kl. ${BAL.BROKE_SLEEP_WAKE_HOUR || 11}:00).`);
    } else {
      changeCash(-price, 'Hotellnatt');
    }

    AudioMgr.play('hotel');

    const acts = state.dayLog.activities.length > 0 ?
      state.dayLog.activities.map(a => `<li>${a}</li>`).join('') :
      '<li>En lugn dag utan större strapatser.</li>';

    const tomorrowEvs = (W.worldEvents || []).filter(ev => (state.day + 1) >= ev.startDay && (state.day + 1) <= ev.endDay);
    const teaser = tomorrowEvs.length > 0
      ? `Pågår imorgon i ${W.cities[tomorrowEvs[0].city]?.name || tomorrowEvs[0].city}: <b>${tomorrowEvs[0].title}</b> — ${tomorrowEvs[0].effectText}`
      : TEASERS[state.day % TEASERS.length];

    state.deals = {};
    const routePool = getCityRoutePool(state.city).map(r => r.to);
    const cities = routePool.length > 0 ? routePool : Object.keys(W.cities).filter(k => k !== state.city);
    const luckyCity = cities[Math.floor(Math.random() * cities.length)];
    state.deals[luckyCity] = 25; // 25% sista-minuten-rabatt
    state.departureBoard = null; // Ny dag = ny avgångstavla i morgon bitti!

    const wakeHour = state.sleptBroke ? (BAL.BROKE_SLEEP_WAKE_HOUR || 11) : (BAL.DAY_START_HOUR || 8);
    const reportHtml = `
      <div class="modal-hotel-ledger" style="max-width:600px;">
        <h3 style="margin:0 0 10px; font-family:Georgia,serif; color:#4d2f18; border-bottom:2px solid #8c6832; padding-bottom:6px;">Kvällsrapport · Dag ${state.day}</h3>
        <p style="font-weight:600; color:#5b3b1c; margin:0 0 6px;">Dagens anteckningar:</p>
        <ul style="margin-left:20px; font-size:13.5px; line-height:1.6;">
          ${acts}
        </ul>
        ${state.sleptBroke ? `<div style="margin-top:8px; padding:6px 10px; background:#fae6e6; border-left:3px solid #a82828; font-size:12px; color:#7a1c1c;"><b>Trött efter natten på stationen:</b> Du försover dig och kommer ut på stan först kl. ${String(wakeHour).padStart(2, '0')}:00.</div>` : ''}
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
    const wakeHour = state.sleptBroke ? (BAL.BROKE_SLEEP_WAKE_HOUR || 11) : (BAL.DAY_START_HOUR || 8);
    state.hour = wakeHour;
    state.sleptBroke = false;
    state.dayLog.activities = [];
    syncBotsToCurrentDay();

    if (state.day > W.dayLimit) {
      triggerGameOver(false);
      return;
    }

    closeModal();
    renderCitySpots(W.cities[state.city]);
    updateHUD();
    const daysLeft = W.dayLimit - state.day;
    const homeName = W.cities[W.startCity]?.name || 'startstaden';
    if (daysLeft <= 5 && state.city !== W.startCity) {
      showToast(`SLUTSPURT! Endast ${daysLeft} dagar kvar, dags att ta dig hem till ${homeName}!`, 4000);
    } else {
      showToast(`Dag ${state.day} har grytt! Klockan är ${String(wakeHour).padStart(2, '0')}:00.`, 2500);
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

    const currentTierObj = BACKPACK_TIERS.find(t => t.level === (state.backpackLevel || 1)) || BACKPACK_TIERS[0];
    const bagTitle = currentTierObj.name;
    const html = `
      <div class="scene-fullscreen scene-passport-full">
        <div style="width:100%; height:100%; display:flex; flex-direction:column; padding:14px 20px; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="sight-plaque">
              <h3>${bagTitle.toUpperCase()} (${state.backpack.length} / ${getMaxBackpackSlots()} PLATSER)</h3>
              <div class="sight-meta">Nivå ${state.backpackLevel}/4 · Dra på väskan för att snurra 3D-modellen · Packning &amp; kurirpaket</div>
            </div>
            ${exitIconBtn('Stäng packningen')}
          </div>

          <div class="backpack-modal-grid">
            <div class="backpack-3d-pane">
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
      const bp3d = new window.Backpack3DRenderer(bpCanvas, { interactive: true, tier: state.backpackLevel, zoom: 4.2, speed: 0.012 });
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
        : 'Inga ännu — ta jobb i dagstidningen (minst 4/6 rätt)';

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
            ${Object.keys(state.regionKnowledge || {}).length > 0 ? `
              <div style="margin-top:6px; padding-top:5px; border-top:1px dotted rgba(130,108,78,0.35); font-size:10px; color:#4f371e;">
                <b>Regional lokalkännedom:</b>
                ${Object.entries(state.regionKnowledge).map(([rk, pct]) => `<span style="margin-right:6px;">${rk.charAt(0).toUpperCase() + rk.slice(1)} <b>${pct}%</b></span>`).join('')}
              </div>
            ` : ''}
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

  // --- Resehändelser under flyg, tåg eller oceanresa ---
  let activeTravelEvent = null;
  let lastTravelEventLeg = -10;
  const usedTravelEventIds = new Set();

  function maybeTriggerTravelEvent(isBoat, isTrain = false) {
    const modeKey = isBoat ? 'boat' : (isTrain ? 'train' : 'flight');
    const pool = (W.travelEvents && W.travelEvents[modeKey]) || [];
    if (pool.length === 0) return;

    const currentLeg = state.travelHistory.length;
    if (currentLeg - lastTravelEventLeg < 1) return;
    const chance = isBoat ? 0.70 : (isTrain ? 0.65 : 0.45);
    if (Math.random() > chance) return;

    lastTravelEventLeg = currentLeg;
    const unused = pool.filter(e => !usedTravelEventIds.has(e.id));
    const src = unused.length > 0 ? unused : pool;
    const ev = src[Math.floor(Math.random() * src.length)];
    if (ev.id) usedTravelEventIds.add(ev.id);
    activeTravelEvent = ev;

    const cityName = W.cities[state.city]?.name || state.city;
    const photoSrc = isBoat
      ? (Math.random() < 0.5 ? 'assets/travel/ship_ocean.jpg' : 'assets/travel/ship_harbor.jpg')
      : (isTrain
        ? 'assets/photos/airport_hall.jpg'
        : (Math.random() < 0.5 ? 'assets/travel/plane_wing.jpg' : 'assets/travel/plane_runway.jpg'));
    const modeTag = isBoat ? 'TILL SJÖSS' : (isTrain ? 'PÅ TÅGET' : 'UNDER FLYGRESAN');
    const modeKicker = isBoat ? 'OVÄNTAT TILL SJÖSS' : (isTrain ? 'MÖTE PÅ TÅGET' : 'OVÄNTAD RESEHÄNDELSE');
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
            <div class="travel-polaroid-cap">${modeTag} · DAG ${state.day}</div>
          </div>
        </div>
        <div class="travel-event-body-col">
          <div class="travel-event-kicker">${modeKicker} · ${cityName.toUpperCase()}</div>
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
        changeCash(ch.gamble.lose, 'Förlust på resan');
        AudioMgr.play('wrong1');
        showToast(`Otur! Du förlorade ${Math.abs(ch.gamble.lose)} kr.`, 2800);
      }
    } else if (ch.cash) {
      changeCash(ch.cash, ch.label);
    }

    if (ch.hours) {
      state.hour = Math.max(8, Math.min(24, state.hour + ch.hours));
    }

    if (ch.freeHotel) {
      state.freeHotelCities.add(state.city);
      AudioMgr.play('right1');
      showToast(`Gratis hotellnatt i ${W.cities[state.city]?.name || state.city} inlagd!`, 3000);
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
              <button class="bp90-menu-btn primary" onclick="window.GT.openNewGameSetup()">
                <span class="bp90-btn-title">STARTA NY RESA (1 SPELARE)</span>
                <span class="bp90-btn-sub">VÄLJ STARTSTAD, RESLÄNGD &amp; UPP TILL 6 BOTTAR »</span>
              </button>
              <button class="bp90-menu-btn continue" style="border-color:#ff9f43;" onclick="window.GT_INTERPOL && window.GT_INTERPOL.openIntroModal()">
                <span class="bp90-btn-title" style="color:#ffd875;">🕵️ INTERPOL-JAKTEN</span>
                <span class="bp90-btn-sub">SMITTA-JAKT ÖVER JORDGLOBEN · AGENT VS 5 RYMLINGAR</span>
              </button>
              <button class="bp90-menu-btn continue" style="border-color:#38b6ff;" onclick="window.GT.openMultiplayerLobby()">
                <span class="bp90-btn-title" style="color:#8cd7ff;">ONLINE DUELL (2 SPELARE)</span>
                <span class="bp90-btn-sub">SKAPA ELLER GÅ MED MED 4-SIFFRIG RUMSKOD · SAMMA PASSMÅL</span>
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

  function openNewGameSetup() {
    AudioMgr.play('klick');
    const savedFn = (document.getElementById('inpFirstName')?.value || state.playerFirstName || 'ALEX').trim() || 'ALEX';
    const savedLn = (document.getElementById('inpLastName')?.value || state.playerLastName || 'GLOBETROTTER').trim() || 'GLOBETROTTER';
    state.playerFirstName = savedFn;
    state.playerLastName = savedLn;

    const sortedCities = Object.keys(W.cities).sort((a, b) =>
      (W.cities[a].name || a).localeCompare(W.cities[b].name || b, 'sv')
    );
    const defaultStart = W.cities[state.startCity] ? state.startCity : W.startCity;
    const quickCities = ['malmo', 'stockholm', 'london', 'paris', 'newyork', 'tokyo', 'sydney'].filter(k => W.cities[k]);

    let selectedStartCity = defaultStart;
    let selectedDays = 30;
    let selectedBotCount = 0; // Solo som lugn standard — tävling mot bottar är ett aktivt val!
    let selectedDifficulty = 'mixed';

    const cityOptionsHtml = sortedCities.map(k => {
      const c = W.cities[k];
      return `<option value="${k}" ${k === selectedStartCity ? 'selected' : ''}>${c.name} (${c.country})</option>`;
    }).join('');

    const html = `
      <div class="scene-fullscreen" style="background:rgba(10,7,4,0.88); align-items:center; justify-content:center; padding:12px;">
        <div class="setup-modal-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div>
              <div class="setup-kicker">GLOBETROTTER · NY RESA</div>
              <h2 class="setup-title">Reseinställningar</h2>
            </div>
            <button class="globe-brass-btn" style="padding:5px 10px; font-size:11px;" onclick="window.GT.openStartScreen()">« Tillbaka</button>
          </div>

          <div class="setup-section">
            <div class="setup-label">1. Välj startstad &amp; hemort (${sortedCities.length} städer)</div>
            <div class="setup-city-row">
              <select id="setupStartCity" class="setup-select">${cityOptionsHtml}</select>
              <button type="button" class="globe-brass-btn" id="setupRandomCity" style="padding:7px 11px; font-size:12px;">🎲 Slumpa</button>
            </div>
            <div class="setup-pill-row" style="margin-top:7px;" id="setupQuickCities">
              ${quickCities.map(k => `<button type="button" class="setup-pill-btn ${k === selectedStartCity ? 'active' : ''}" data-city="${k}">${W.cities[k].name}</button>`).join('')}
            </div>
          </div>

          <div class="setup-section">
            <div class="setup-label">2. Resans längd</div>
            <div class="setup-pill-row" id="setupDaysRow">
              <button type="button" class="setup-pill-btn" data-days="20">20 dagar (Snabbresa)</button>
              <button type="button" class="setup-pill-btn active" data-days="30">30 dagar (Klassisk)</button>
              <button type="button" class="setup-pill-btn" data-days="45">45 dagar (Jorden runt)</button>
            </div>
          </div>

          <div class="setup-section">
            <div class="setup-label">3. Antal datormotståndare (0 till 6 bottar)</div>
            <div class="setup-pill-row" id="setupBotCountRow">
              ${[0, 1, 2, 3, 4, 5, 6].map(n => `<button type="button" class="setup-pill-btn ${n === selectedBotCount ? 'active' : ''}" data-bots="${n}">${n === 0 ? '0 (Solo)' : `${n} ${n === 1 ? 'bot' : 'bottar'}`}</button>`).join('')}
            </div>
          </div>

          <div class="setup-section" id="setupDiffSection">
            <div class="setup-label">4. Botarnas svårighetsgrad</div>
            <div class="setup-pill-row" id="setupDiffRow">
              <button type="button" class="setup-pill-btn active" data-diff="mixed">Blandat fält (Rek.)</button>
              <button type="button" class="setup-pill-btn" data-diff="easy">Turist (Lätt)</button>
              <button type="button" class="setup-pill-btn" data-diff="medium">Globetrotter (Medel)</button>
              <button type="button" class="setup-pill-btn" data-diff="hard">Mästerresenär (Svår)</button>
            </div>
            <div class="setup-bot-preview" id="setupBotPreview"></div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px; flex-wrap:wrap;">
            <button type="button" class="stamp-action-btn" id="setupLaunchBtn" style="padding:11px 22px; font-size:14px; width:100%;">
              STÄMPLA PASS &amp; STARTA RESAN »
            </button>
          </div>
        </div>
      </div>
    `;
    showModal(html);

    const citySel = document.getElementById('setupStartCity');
    const previewEl = document.getElementById('setupBotPreview');
    const diffSection = document.getElementById('setupDiffSection');

    const refreshPreview = () => {
      if (diffSection) diffSection.style.display = selectedBotCount > 0 ? '' : 'none';
      if (!previewEl || !window.GT_BOTS) return;
      if (selectedBotCount === 0) {
        previewEl.innerHTML = '';
        return;
      }
      const sample = window.GT_BOTS.createBots(selectedBotCount, selectedDifficulty, selectedStartCity, W);
      previewEl.innerHTML = sample.map(b => `
        <div class="setup-bot-chip">
          <span class="setup-bot-dot" style="background:${b.color};"></span>
          <div style="min-width:0;">
            <div style="font-weight:bold; color:#fff5df;">${b.name}</div>
            <div style="font-size:10px; color:#cbb997;">${b.difficultyLabel} · ${b.style}</div>
          </div>
        </div>
      `).join('');
    };

    const syncQuickBtns = () => {
      document.querySelectorAll('#setupQuickCities .setup-pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.city === selectedStartCity);
      });
    };

    if (citySel) {
      citySel.onchange = () => {
        selectedStartCity = citySel.value;
        syncQuickBtns();
      };
    }
    const rndBtn = document.getElementById('setupRandomCity');
    if (rndBtn) {
      rndBtn.onclick = () => {
        selectedStartCity = sortedCities[Math.floor(Math.random() * sortedCities.length)];
        if (citySel) citySel.value = selectedStartCity;
        syncQuickBtns();
        AudioMgr.play('klick');
      };
    }
    document.querySelectorAll('#setupQuickCities .setup-pill-btn').forEach(btn => {
      btn.onclick = () => {
        selectedStartCity = btn.dataset.city;
        if (citySel) citySel.value = selectedStartCity;
        syncQuickBtns();
        AudioMgr.play('klick');
      };
    });
    document.querySelectorAll('#setupDaysRow .setup-pill-btn').forEach(btn => {
      btn.onclick = () => {
        selectedDays = Number(btn.dataset.days) || 30;
        document.querySelectorAll('#setupDaysRow .setup-pill-btn').forEach(b => b.classList.toggle('active', b === btn));
        AudioMgr.play('klick');
      };
    });
    document.querySelectorAll('#setupBotCountRow .setup-pill-btn').forEach(btn => {
      btn.onclick = () => {
        selectedBotCount = Number(btn.dataset.bots) || 0;
        document.querySelectorAll('#setupBotCountRow .setup-pill-btn').forEach(b => b.classList.toggle('active', b === btn));
        refreshPreview();
        AudioMgr.play('klick');
      };
    });
    document.querySelectorAll('#setupDiffRow .setup-pill-btn').forEach(btn => {
      btn.onclick = () => {
        selectedDifficulty = btn.dataset.diff || 'mixed';
        document.querySelectorAll('#setupDiffRow .setup-pill-btn').forEach(b => b.classList.toggle('active', b === btn));
        refreshPreview();
        AudioMgr.play('klick');
      };
    });

    refreshPreview();

    const launchBtn = document.getElementById('setupLaunchBtn');
    if (launchBtn) {
      launchBtn.onclick = () => {
        startNewJourney({
          startCity: selectedStartCity,
          dayLimit: selectedDays,
          botCount: selectedBotCount,
          botDifficulty: selectedDifficulty
        });
      };
    }
  }

  function startNewJourney(opts = {}) {
    const fn = (document.getElementById('inpFirstName')?.value || state.playerFirstName || 'RESENÄR').trim() || 'RESENÄR';
    const ln = (document.getElementById('inpLastName')?.value || state.playerLastName || 'GLOBETROTTER').trim() || 'GLOBETROTTER';
    const chosenStart = (opts.startCity && W.cities[opts.startCity]) ? opts.startCity : W.startCity;
    const chosenDays = Number(opts.dayLimit) >= 10 ? Number(opts.dayLimit) : 30;
    const chosenBotCount = Math.max(0, Math.min(6, Number(opts.botCount) || 0));
    const chosenBotDiff = opts.botDifficulty || 'mixed';

    W.startCity = chosenStart;
    W.dayLimit = chosenDays;

    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    state.startCity = chosenStart;
    state.dayLimit = chosenDays;
    state.city = chosenStart;
    state.day = 1;
    state.hour = 8;
    state.cash = W.startCash;
    state.backpack = [];
    state.donePlaces = new Set();
    state.doneWonders = new Set();
    state.doneWonderSpots = new Set();
    state.activeWonder = null;
    state.visitedCities = new Set([chosenStart]);
    state.stamps = [];
    state.travelHistory = [];
    state.questionsTotal = 0;
    state.questionsCorrect = 0;
    state.dayLog = { activities: [], moneyStart: W.startCash };
    state.playerFirstName = fn;
    state.playerLastName = ln;
    state.signatureDoneToday = {};
    state.jobsDoneToday = {};
    state.usedQuestionIds = new Set();
    state.departureBoard = null;
    state.competencies = [];
    state.discoveredPlaces = new Set();
    state.backpackLevel = 1;
    state.mailedHome = [];
    state.callsHomeUsed = 0;
    state.botNews = [];
    state.botJobRecords = {};
    state.botDuelDoneToday = {};
    state.blockedRoutes = {};
    state.cityClaims = {};
    state.openContracts = window.GT_BOTS ? window.GT_BOTS.initOpenContracts() : [];
    state.claimedContracts = [];
    state.contractBonusPoints = 0;
    state.claimedCitiesCount = 0;
    state.regionKnowledge = {};
    state.knowledgeCreditedIds = new Set();
    state.streak = 0;
    state.bots = (window.GT_BOTS && chosenBotCount > 0)
      ? window.GT_BOTS.createBots(chosenBotCount, chosenBotDiff, chosenStart, W)
      : [];
    window.GT_ACTIVE_BOTS = state.bots;
    window.GT_CITY_CLAIMS = state.cityClaims;

    state.goals = generateJourneyGoals();
    const goalNames = state.goals.souvenirCities.map(ck => W.cities[ck]?.name || ck).join(', ');
    const startName = W.cities[chosenStart]?.name || chosenStart;
    const botSuffix = state.bots.length > 0 ? ` Tävlar mot ${state.bots.length} medresenärer.` : '';
    state.journal = [{ day: 1, text: `${fn} ${ln} påbörjade jorden-runt-resan från ${startName} (${chosenDays} dagar)! Mål i passet: ${state.goals.requiredCompetencies} yrkeskompetenser samt souvenirer från ${goalNames}.${botSuffix}` }];
    gameSessionStarted = true;
    saveGame();
    AudioMgr.play('fanfar');
    closeModal();
    renderCity();
    updateOpponentHUD();
    openDayOneBriefing();
  }

  // Tydlig välkomstbriefing på Dag 1 så spelaren direkt ser sitt ärende & kan planera på 3D-jordgloben!
  function openDayOneBriefing() {
    const goals = ensureJourneyGoals();
    const startName = W.cities[state.startCity]?.name || 'startstaden';
    const goalListHtml = goals.souvenirCities.map(ck => {
      const c = W.cities[ck];
      return `<li><b>${c ? c.name : ck}</b>${c ? ` (${c.country}, ${ROUTES.regionLabel(c.region)})` : ''}</li>`;
    }).join('');
    const html = `
      <div class="card-modal" style="max-width:560px; background:linear-gradient(180deg,#fdf7e8 0%,#f0e2c2 100%); border:3px ridge #9e7537;">
        <div style="font-size:10.5px; letter-spacing:1.6px; color:#8c5a18; font-weight:bold; text-transform:uppercase;">GLOBETROTTERKLUBBEN · INCHECKNING DAG 1</div>
        <h2 style="margin:4px 0 8px; font-family:Georgia,serif; color:#3d2410;">Välkommen till ${startName}, ${state.playerFirstName}!</h2>
        <p style="font-size:13px; color:#4f371e; margin:0 0 10px; line-height:1.45;">
          Du har <b>${W.dayLimit} dagar</b> och <b>${state.cash.toLocaleString('sv-SE')} kr</b> på dig att resa ut i världen och ta dig hem till <b>${startName}</b> igen. För att bli antagen i klubben krävs:
        </p>
        <div style="background:rgba(130,95,40,0.09); border-left:3px solid #9e7537; padding:9px 12px; font-size:13px; color:#2b1c0e; margin-bottom:12px;">
          <div style="margin-bottom:5px;"><b>1. Besök minst ${goals.requiredRegions} världsdelar</b> och kom hem i tid.</div>
          <div style="margin-bottom:5px;"><b>2. Klara ${goals.requiredCompetencies} olika jobbpass</b> i lokaltidningen (yrkeskompetens).</div>
          <div><b>3. Köp (eller posta hem) en souvenir från:</b>
            <ul style="margin:4px 0 0 18px; padding:0;">${goalListHtml}</ul>
          </div>
        </div>
        <p style="font-size:12px; color:#6b5235; margin:0 0 12px; line-height:1.45;">
          <b>Så klarar du resan:</b> Din startkassa (${state.cash.toLocaleString('sv-SE')} kr) räcker bara en bit. <b>Jobba</b> i dagstidningen, <b>handla souvenirer</b> för vinst långt bort, och <b>besök sevärdheter</b> för lokalkännedom (ger upp till +30 % lön, bättre prutning och -10 % biljettpris!).
        </p>
        <div class="modal-footer" style="justify-content:space-between; gap:8px; flex-wrap:wrap;">
          <button class="globe-brass-btn" onclick="window.GT.openGlobeModal()">🗺️ Planera rutt på jordgloben</button>
          <button class="stamp-action-btn" onclick="window.GT.closeModal()">Kliv ut i ${startName} »</button>
        </div>
      </div>
    `;
    showModal(html);
  }

  // --- 2-Spelare Online Duell (WebRTC / PeerJS med 4-siffrig rumskod, Live Poängmätare & Jobbdueller!) ---
  function getMyGoalProgress() {
    const goals = ensureJourneyGoals();
    const reg = Math.min(goals.requiredRegions, getVisitedRegions().size);
    const comp = Math.min(goals.requiredCompetencies, state.competencies.length);
    const souv = goals.souvenirCities.filter(ck => Boolean(hasGoalSouvenirFrom(ck))).length;
    return {
      done: reg + comp + souv,
      total: goals.requiredRegions + goals.requiredCompetencies + goals.souvenirCities.length
    };
  }

  function buildMySnapshot(won = false) {
    const acc = state.questionsTotal > 0 ? Math.round((state.questionsCorrect / state.questionsTotal) * 100) : 100;
    const gp = getMyGoalProgress();
    return {
      name: state.playerFirstName || 'Resenär',
      city: state.city,
      activeWonder: state.activeWonder,
      day: state.day,
      cash: state.cash,
      stamps: state.stamps.length,
      doneWonders: state.doneWonders.size,
      competencies: state.competencies.length,
      goalsDone: gp.done,
      goalsTotal: gp.total,
      questionsCorrect: Math.round(state.questionsCorrect * 10) / 10,
      accuracy: acc,
      travelHistory: state.travelHistory.slice(-25),
      won
    };
  }

  function checkKnowledgeStipend() {
    if (!window.GT_MP || !window.GT_MP.active || !window.GT_MP.opponent) return;
    if (state.day >= 5 && state.day % 5 === 0 && state.lastStipendDay !== state.day) {
      state.lastStipendDay = state.day;
      const myQ = state.questionsCorrect || 0;
      const oppQ = window.GT_MP.opponent.questionsCorrect || 0;
      if (myQ > oppQ && myQ >= 3) {
        changeCash(BAL.KNOWLEDGE_STIPEND, `Globetrotter-stipendium (Kunskapsduell Dag ${state.day})`);
        AudioMgr.play('fanfar');
        addJournal(`Vann 5-dagars Kunskapsduellen mot ${window.GT_MP.opponent.name} (${Math.round(myQ)} mot ${Math.round(oppQ)} rätt) och fick +${BAL.KNOWLEDGE_STIPEND} kr stipendium!`);
        showToast(`🏆 KUNSKAPSDUELL DAG ${state.day}: Du leder (${Math.round(myQ)} vs ${Math.round(oppQ)} rätt) → +${BAL.KNOWLEDGE_STIPEND} kr stipendium!`, 4600);
      }
    }
  }

  function syncMultiplayerState() {
    if (!window.GT_MP || !window.GT_MP.active) return;
    checkKnowledgeStipend();
    window.GT_MP.sendSnapshot(buildMySnapshot(false));
    updateOpponentHUD();
  }

  function getPlayerBotEntry() {
    const goals = ensureJourneyGoals();
    const souvDone = goals.souvenirCities.filter(ck => Boolean(hasGoalSouvenirFrom(ck))).length;
    return {
      name: state.playerFirstName || 'Du',
      city: state.city,
      stamps: state.stamps.length,
      competencies: state.competencies.length,
      regions: getVisitedRegions().size,
      goalSouvenirsDone: souvDone,
      wonders: state.doneWonders.size,
      cash: state.cash,
      finished: false,
      contractBonusPoints: state.contractBonusPoints || 0,
      claimedCitiesCount: state.claimedCitiesCount || 0
    };
  }

  function updateOpponentHUD() {
    const bar = document.getElementById('mpOpponentBar');
    if (!bar) return;

    // 1. Online 2-spelare har förtur om aktiv
    if (window.GT_MP && window.GT_MP.active && window.GT_MP.opponent) {
      const opp = window.GT_MP.opponent;
      const me = buildMySnapshot(false);
      const locName = (opp.activeWonder && W.wonders[opp.activeWonder]?.name)
        || (W.cities[opp.city]?.name)
        || opp.city;
      const challengeBtn = window.GT_MP.pendingChallenge
        ? `<button class="mp-challenge-pill-btn" onclick="window.GT.openIncomingChallenge()">⚡ DUELLFRÅGA!</button>`
        : '';
      bar.innerHTML = `
        <span class="mp-dot"></span>
        <span><b style="color:#ffd875;">DU: ${me.goalsDone}/${me.goalsTotal}</b> (${me.accuracy}%)</span>
        <span style="opacity:0.55;">VS</span>
        <span><b style="color:#8cd7ff;">${opp.name}: ${opp.goalsDone || 0}/${opp.goalsTotal || me.goalsTotal}</b> (${opp.accuracy ?? 100}%) · ${locName}</span>
        ${challengeBtn}
      `;
      bar.classList.remove('hidden');
      return;
    }

    // 2. AI-Bot-tävling: bara en kompakt, ren knapp (tar minimalt med plats!)
    if (window.GT_BOTS && Array.isArray(state.bots) && state.bots.length > 0) {
      const standings = window.GT_BOTS.getStandings(getPlayerBotEntry(), state.bots);
      const myRow = standings.find(r => r.isPlayer) || standings[0];
      const localBots = window.GT_BOTS.getBotsInCity(state.bots, state.city);
      const duelBot = localBots.find(b => !state.botDuelDoneToday[`${state.day}_${b.id}`]);
      const duelBtn = duelBot
        ? `<button class="mp-challenge-pill-btn" onclick="window.GT.startBotDuel('${duelBot.id}')">⚡ ${duelBot.name}</button>`
        : '';
      bar.innerHTML = `
        <button class="globe-brass-btn" style="padding:3px 10px; font-size:11px; border-color:#ffd875; color:#ffd875;" onclick="window.GT.openBotStandingsModal()" title="Öppna topplista &amp; bonuskontrakt">🏆 #${myRow.rank}/${standings.length} · Topplista</button>
        ${duelBtn}
      `;
      bar.classList.remove('hidden');
      return;
    }

    bar.classList.add('hidden');
  }

  function openBotStandingsModal() {
    if (!window.GT_BOTS || !Array.isArray(state.bots) || state.bots.length === 0) return;
    AudioMgr.play('klick');
    const standings = window.GT_BOTS.getStandings(getPlayerBotEntry(), state.bots);
    const localBots = window.GT_BOTS.getBotsInCity(state.bots, state.city);
    const rowsHtml = standings.map(r => {
      const cName = W.cities[r.city]?.name || r.city;
      const canDuel = !r.isPlayer && r.city === state.city && !r.finished && !state.botDuelDoneToday[`${state.day}_${r.id}`];
      const botObj = !r.isPlayer ? state.bots.find(b => b.id === r.id) : null;
      const routeTrail = botObj && botObj.travelHistory && botObj.travelHistory.length > 0
        ? [botObj.travelHistory[0].from, ...botObj.travelHistory.slice(-4).map(l => l.to)]
            .map(ck => W.cities[ck]?.name || ck)
            .join(' → ')
        : (r.isPlayer && state.travelHistory.length > 0
          ? [state.travelHistory[0].from, ...state.travelHistory.slice(-4).map(l => l.to)].map(ck => W.cities[ck]?.name || ck).join(' → ')
          : `Start: ${cName}`);
      const routeBtn = !r.isPlayer
        ? ` <button class="globe-brass-btn" style="font-size:9.5px; padding:1px 6px; margin-left:3px;" onclick="window.GT.openGlobeModal('${r.id}')">🗺️ Rutt</button>`
        : '';
      return `
        <tr class="${r.isPlayer ? 'is-player' : ''}">
          <td><b>#${r.rank}</b></td>
          <td>
            <span class="setup-bot-dot" style="display:inline-block; background:${r.color}; vertical-align:middle; margin-right:5px;"></span>
            ${r.name}${r.finished ? ' 🏁' : ''}
            <div style="font-size:9.5px; color:#b8a586; font-weight:normal;">${r.difficultyLabel}${r.isPlayer ? '' : ` · ${r.style}`}</div>
            <div style="font-size:9.5px; color:#9ec7a6; font-weight:normal; margin-top:1px;">${routeTrail}</div>
          </td>
          <td>${cName}${routeBtn}${canDuel ? ` <button class="mp-challenge-pill-btn" style="font-size:9.5px; padding:1px 6px; margin-left:4px;" onclick="window.GT.startBotDuel('${r.id}')">⚡ Duell</button>` : ''}</td>
          <td class="hide-sm">${r.stamps}</td>
          <td class="hide-sm">${r.competencies}</td>
          <td class="hide-sm">${r.regions}</td>
          <td><b style="color:#ffd875;">${r.score} p</b></td>
        </tr>
      `;
    }).join('');

    const recentNews = (state.botNews || []).slice(-6).reverse();
    const newsHtml = recentNews.length > 0
      ? recentNews.map(n => `<div style="font-size:11.5px; padding:3px 0; border-bottom:1px dotted rgba(201,154,69,0.22);"><b style="color:#ffd875;">Dag ${n.day}:</b> ${n.text}</div>`).join('')
      : '<div style="font-size:11.5px; color:#a89678; font-style:italic;">Resan har nyss börjat. Nyheter från dina medresenärer dyker upp här allt eftersom dagarna går!</div>';

    const localBanner = localBots.length > 0
      ? `<div style="margin:8px 0; padding:7px 10px; background:rgba(56,182,255,0.12); border:1px solid #38b6ff; border-radius:6px; font-size:12px; color:#bfe8ff;">
           <b>Just nu i ${W.cities[state.city]?.name}:</b> ${localBots.map(b => b.name).join(', ')} är i samma stad som du! Klicka på <b>⚡ Duell</b> för en snabb 3-frågorsduell om ${BAL.BOT_DUEL_WIN} kr.
         </div>`
      : '';

    const openContracts = (Array.isArray(state.openContracts) && state.openContracts.length > 0)
      ? state.openContracts
      : (window.GT_BOTS ? window.GT_BOTS.initOpenContracts() : []);
    const pContractEntry = {
      visitedCities: Array.from(state.visitedCities || []),
      doneWonders: Array.from(state.doneWonders || []),
      competencies: state.competencies || [],
      stamps: state.stamps || []
    };
    const contractsHtml = openContracts.map(c => {
      const pr = window.GT_BOTS ? window.GT_BOTS.getContractProgress(c, pContractEntry, W) : { done: 0, total: 1 };
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:5px 0; border-bottom:1px dotted rgba(201,154,69,0.28); font-size:11.5px;">
          <div>
            <b style="color:#ffd875;">📜 ${c.title}</b> <span style="color:#cbb997;">(${pr.done}/${pr.total})</span>
            <div style="font-size:10.5px; color:#d8cbb2;">${c.desc}</div>
          </div>
          <div style="text-align:right; white-space:nowrap; font-size:10.5px; color:#8cf0a4; font-weight:bold;">
            +${c.rewardCash} kr<br>+${c.rewardPoints} p
          </div>
        </div>
      `;
    }).join('');

    const html = `
      <div class="scene-fullscreen" style="background:rgba(10,7,4,0.86); align-items:center; justify-content:center; padding:12px;">
        <div class="setup-modal-card">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <div>
              <div class="setup-kicker">GLOBETROTTER · TÄVLINGSTABELL &amp; KONTRAKT</div>
              <h2 class="setup-title" style="margin-bottom:4px;">Topplista (Dag ${state.day} av ${W.dayLimit})</h2>
            </div>
            ${exitIconBtn('Stäng topplistan')}
          </div>
          ${localBanner}
          <table class="bot-standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Resenär</th>
                <th>Stad</th>
                <th class="hide-sm">Stämplar</th>
                <th class="hide-sm">Yrken</th>
                <th class="hide-sm">Världsdelar</th>
                <th>Poäng</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>

          <div class="setup-section" style="margin-top:10px;">
            <div class="setup-label">Öppna bonuskontrakt (Först till kvarn!)</div>
            ${contractsHtml}
          </div>

          <div class="setup-section" style="margin-top:10px; margin-bottom:0;">
            <div class="setup-label">Senaste nytt från medresenärerna</div>
            ${newsHtml}
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function openMenuModal() {
    AudioMgr.play('klick');
    const soundOn = AudioMgr.enabled !== false;
    const html = `
      <div class="scene-fullscreen" style="background:rgba(10,7,4,0.88); align-items:center; justify-content:center; padding:12px;">
        <div class="setup-modal-card" style="max-width:440px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px;">
            <div>
              <div class="setup-kicker">GLOBETROTTER</div>
              <h2 class="setup-title" style="margin:2px 0 0;">Meny &amp; Inställningar</h2>
            </div>
            ${exitIconBtn('Stäng menyn')}
          </div>

          <div class="setup-section">
            <div class="setup-label">Inställningar</div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:8px;">
              <span style="font-size:13px;">Ljud &amp; bakgrundsmusik</span>
              <button type="button" class="setup-pill-btn ${soundOn ? 'active' : ''}" id="menuSoundToggleBtn" onclick="window.GT.toggleSound()">
                ${soundOn ? '🔊 LJUD: PÅ' : '🔇 LJUD: AV'}
              </button>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
              <span style="font-size:13px;">Helskärmsläge (dölj adressfält)</span>
              <button type="button" class="setup-pill-btn ${document.fullscreenElement ? 'active' : ''}" id="menuFullscreenBtn" onclick="window.GT.toggleFullscreen()">
                ${document.fullscreenElement ? '⛶ HELSKÄRM: PÅ' : '⛶ HELSKÄRM'}
              </button>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
            ${(state.bots && state.bots.length > 0) ? `<button class="globe-brass-btn" style="padding:10px 14px; font-size:13px; text-align:left;" onclick="window.GT.openBotStandingsModal()">🏆 Topplista &amp; Öppna bonuskontrakt</button>` : ''}
            <button class="globe-brass-btn" style="padding:10px 14px; font-size:13px; text-align:left;" onclick="window.GT.openNewGameSetup()">🗺️ Starta nytt spel (välj stad &amp; bottar)</button>
            <button class="globe-brass-btn" style="padding:10px 14px; font-size:13px; text-align:left; border-color:#ff9f43; color:#ffd875;" onclick="window.GT_INTERPOL && window.GT_INTERPOL.openIntroModal()">🕵️ Interpol-jakten (Smitta-jakt)</button>
            <button class="globe-brass-btn" style="padding:10px 14px; font-size:13px; text-align:left; border-color:#38b6ff; color:#8cd7ff;" onclick="window.GT.openMultiplayerLobby()">⚡ Online Duell (2 spelare)</button>
            <button class="globe-brass-btn" style="padding:10px 14px; font-size:13px; text-align:left;" onclick="window.GT.openStartScreen()">🏠 Till startskärmen</button>
            <button class="stamp-action-btn" style="padding:10px 14px; font-size:13px; margin-top:4px;" onclick="window.GT.closeModal()">Fortsätt spela »</button>
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function startBotDuel(botId) {
    const bot = (state.bots || []).find(b => b.id === botId);
    if (!bot) return;
    if (state.botDuelDoneToday[`${state.day}_${bot.id}`]) {
      showToast(`Du har redan duellerat mot ${bot.name} idag!`, 2200);
      return;
    }
    state.botDuelDoneToday[`${state.day}_${bot.id}`] = true;
    AudioMgr.play('bell');

    const city = W.cities[state.city];
    const diff = (window.GT_BOTS && window.GT_BOTS.DIFFICULTY_PROFILES[bot.difficulty]) || { accuracy: 0.72 };
    let botScore = 0;
    for (let i = 0; i < 3; i++) {
      if (Math.random() < diff.accuracy) botScore++;
    }

    const duelQuestions = pickHardQuestions(3, city ? city.region : '');
    if (duelQuestions.length < 3) {
      const extra = pickInteractiveQuestions(3 - duelQuestions.length, city ? city.region : '');
      duelQuestions.push(...extra);
    }

    const html = `
      <div class="scene-fullscreen" style="background:rgba(10,7,4,0.90); align-items:center; justify-content:center; padding:12px;">
        <div class="setup-modal-card" style="max-width:660px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div>
              <div class="setup-kicker" style="color:${bot.color};">⚡ KUNSKAPSDUELL I ${(city?.name || '').toUpperCase()}</div>
              <h2 class="setup-title" style="margin:2px 0;">Du mot ${bot.fullName} (${bot.difficultyLabel})</h2>
            </div>
            <span style="font-size:12px; color:#ffd875; font-weight:bold;">Pott: ${BAL.BOT_DUEL_WIN} kr</span>
          </div>
          <div id="quizContainer"></div>
        </div>
      </div>
    `;
    showModal(html);

    runQuiz(duelQuestions.slice(0, 3), ({ correct, total }) => {
      const myScore = Math.round(correct * 10) / 10;
      let headline = '';
      let sub = '';
      if (myScore > botScore) {
        changeCash(BAL.BOT_DUEL_WIN, `Vann kunskapsduell mot ${bot.name}`);
        bot.cash = Math.max(0, bot.cash - 150);
        AudioMgr.play('fanfar');
        headline = `🏆 DU VANN DUELLEN! (${myScore}/${total} mot ${bot.name}s ${botScore}/${total})`;
        sub = `+${BAL.BOT_DUEL_WIN} kr rakt ner i din reskassa!`;
        addJournal(`Besegrade ${bot.name} i en kunskapsduell i ${city?.name || state.city} (${myScore}-${botScore}) och vann ${BAL.BOT_DUEL_WIN} kr.`);
      } else if (myScore === botScore) {
        changeCash(BAL.BOT_DUEL_DRAW, `Oavgjord duell mot ${bot.name}`);
        AudioMgr.play('right1');
        headline = `🤝 OAVGJORT! (${myScore}/${total} mot ${bot.name}s ${botScore}/${total})`;
        sub = `Ni delar på äran och du får +${BAL.BOT_DUEL_DRAW} kr i tröstpris.`;
      } else {
        AudioMgr.play('wrong1');
        bot.cash += 200;
        headline = `${bot.name} drog längsta strået (${botScore}/${total} mot dina ${myScore}/${total})`;
        sub = `Revanschlust! Plugga in fakta och möt ${bot.name} nästa gång ni korsar väg.`;
      }
      saveGame();
      updateOpponentHUD();
      const container = document.getElementById('quizContainer');
      if (container) {
        container.innerHTML = `
          <div style="text-align:center; padding:16px 8px;">
            <div style="font-size:17px; font-weight:bold; color:#ffd875; margin-bottom:8px;">${headline}</div>
            <div style="font-size:13px; color:#e6d9bf; margin-bottom:16px;">${sub}</div>
            <button class="stamp-action-btn" onclick="window.GT.closeModal()">Tillbaka till ${city?.name || 'staden'} »</button>
          </div>
        `;
      }
    }, city?.skyline, { finishLabel: 'Avsluta duellen »' });
  }

  function openIncomingChallenge() {
    const ch = window.GT_MP && window.GT_MP.pendingChallenge;
    if (!ch) return;
    window.GT_MP.pendingChallenge = null;
    updateOpponentHUD();

    const shuffled = ch.a.slice().sort(() => Math.random() - 0.5);
    const rightAns = ch.a[0];
    const letters = ['A', 'B', 'C', 'D'];
    const html = `
      <div class="card-modal" style="max-width:600px; background:linear-gradient(180deg,#1d140c 0%,#120c07 100%); color:#f4ead6; border:3px ridge #38b6ff;">
        <div style="font-size:10.5px; letter-spacing:1.6px; color:#8cd7ff; font-weight:bold; margin-bottom:4px;">⚡ DUELL-TELEGRAM FRÅN ${(ch.fromName || 'MOTSTÅNDAREN').toUpperCase()}</div>
        <h3 style="margin:0 0 8px; font-family:Georgia,serif; color:#ffd875; font-size:18px;">Svara rätt för +${BAL.CHALLENGE_BONUS} kr — annars tar ${ch.fromName} pengarna!</h3>
        ${ch.img ? `<div style="text-align:center; margin-bottom:8px;"><img src="${ch.img}" alt="" style="max-height:110px; border:2px solid #c99a45; border-radius:4px;"></div>` : ''}
        <div style="font-family:Georgia,serif; font-size:15px; font-weight:bold; margin-bottom:12px;">${ch.q}</div>
        <div class="quiz-options" id="mpChallengeOpts">
          ${shuffled.map((opt, i) => `
            <button class="quiz-btn" data-right="${opt === rightAns ? '1' : '0'}">
              <span class="quiz-letter-seal">${letters[i] || (i + 1)}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
        <div id="mpChallengeOutcome" style="margin-top:10px;"></div>
      </div>
    `;
    showModal(html);

    const btns = document.querySelectorAll('#mpChallengeOpts .quiz-btn');
    btns.forEach(btn => {
      btn.onclick = () => {
        btns.forEach(b => b.disabled = true);
        const ok = btn.dataset.right === '1';
        if (ok) {
          btn.classList.add('correct');
          AudioMgr.play('right1');
          changeCash(BAL.CHALLENGE_BONUS, `Vann duellfråga från ${ch.fromName}`);
        } else {
          btn.classList.add('wrong');
          AudioMgr.play('wrong1');
          btns.forEach(b => { if (b.dataset.right === '1') b.classList.add('correct'); });
        }
        window.GT_MP.sendChallengeResult(ok, state.playerFirstName, ch.q);
        const out = document.getElementById('mpChallengeOutcome');
        if (out) {
          out.innerHTML = `
            <div style="padding:10px; background:rgba(255,248,230,0.08); border-left:3px solid ${ok ? '#78e08f' : '#ff7675'}; font-size:12.5px; margin-bottom:10px;">
              <b style="color:${ok ? '#78e08f' : '#ff7675'};">${ok ? `✓ Rätt! Du vann +${BAL.CHALLENGE_BONUS} kr i duellen!` : `✕ Fel! Rätt svar var "${rightAns}" — ${ch.fromName} tog hem +${BAL.CHALLENGE_BONUS} kr.`}</b><br>
              <span style="color:#d6c5a5;">${ch.explain || ''}</span>
            </div>
            <div style="text-align:right;"><button class="stamp-action-btn" onclick="window.GT.closeModal()">Tillbaka till resan</button></div>
          `;
        }
      };
    });
  }

  function openMultiplayerLobby() {
    const fn = (document.getElementById('inpFirstName')?.value || state.playerFirstName || 'ALEX').trim() || 'ALEX';
    const ln = (document.getElementById('inpLastName')?.value || state.playerLastName || 'GLOBETROTTER').trim() || 'GLOBETROTTER';
    state.playerFirstName = fn;
    state.playerLastName = ln;

    const html = `
      <div class="scene-fullscreen bp90-start-scene">
        <div class="mp-lobby-card">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #b88b43; padding-bottom:8px; margin-bottom:12px;">
            <div>
              <div style="font-size:10px; letter-spacing:1.6px; color:#8cd7ff; font-weight:bold;">GLOBETROTTER · WEBRTC ONLINE DUELL</div>
              <h2 style="margin:2px 0 0; font-family:Georgia,serif; color:#ffd875; font-size:20px;">2 SPELARE ÖVER NÄTET</h2>
            </div>
            <button class="globe-brass-btn" onclick="window.GT_MP && window.GT_MP.disconnect(); window.GT.openStartScreen()">« Tillbaka</button>
          </div>

          <p style="font-size:12.5px; color:#e6d7bd; margin:0 0 12px; line-height:1.4;">
            Ni får <b>exakt samma slumpade passmål</b> och tävlar i realtid runt jorden! Ni ser varandras positioner och reslinjer (Röd vs. Blå) live på 3D-jordgloben. Först hem till <b>${homeCityName()}</b> med alla mål klara vinner!
          </p>

          <div class="mp-lobby-grid">
            <div class="mp-lobby-col">
              <h4>1. Skapa nytt rum (Spelare 1)</h4>
              <p style="font-size:11.5px; color:#c9b48f; margin:0 0 10px;">Skapa en 4-siffrig rumskod och skicka till din kompis.</p>
              <button class="stamp-action-btn" style="width:100%;" onclick="window.GT.mpCreateRoom()">Skapa online-rum »</button>
              <div id="mpHostBox" style="margin-top:10px;"></div>
            </div>

            <div class="mp-lobby-col">
              <h4>2. Gå med i rum (Spelare 2)</h4>
              <p style="font-size:11.5px; color:#c9b48f; margin:0 0 8px;">Skriv in den 4-siffriga rumskoden du fått:</p>
              <div style="display:flex; gap:8px;">
                <input id="mpJoinCode" class="bp-text-input" type="text" maxlength="4" placeholder="t.ex. 4821" style="text-align:center; letter-spacing:4px; font-size:18px; width:120px;">
                <button class="stamp-action-btn" style="flex:1;" onclick="window.GT.mpJoinRoom()">Anslut »</button>
              </div>
              <div id="mpGuestStatus" style="margin-top:8px; font-size:11.5px; color:#ffd875;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    showModal(html);
  }

  function startOnlineMatch(sharedGoals) {
    state.city = W.startCity;
    state.activeWonder = null;
    state.day = 1;
    state.hour = 8;
    state.cash = W.startCash;
    state.backpack = [];
    state.backpackLevel = 1;
    state.mailedHome = [];
    state.callsHomeUsed = 0;
    state.donePlaces = new Set();
    state.doneWonders = new Set();
    state.doneWonderSpots = new Set();
    state.discoveredPlaces = new Set();
    state.visitedCities = new Set([W.startCity]);
    state.stamps = [];
    state.travelHistory = [];
    state.competencies = [];
    state.questionsTotal = 0;
    state.questionsCorrect = 0;
    state.goals = sharedGoals;
    const goalNames = sharedGoals.souvenirCities.map(ck => W.cities[ck]?.name || ck).join(', ');
    state.journal = [{ day: 1, text: `Online-duell startad från ${W.cities[W.startCity]?.name || 'Malmö'}! Gemensamma mål: ${sharedGoals.requiredCompetencies} yrken + souvenirer från ${goalNames}.` }];
    gameSessionStarted = true;
    AudioMgr.play('fanfar');
    closeModal();
    renderCity();
    syncMultiplayerState();
    showToast('Online-duellen har börjat! Se era gemensamma mål i passet!', 4000);
  }

  function getMpCallbacks() {
    return {
      onMatchStart: (sharedGoals) => startOnlineMatch(sharedGoals),
      onOpponentUpdate: (opp) => {
        updateOpponentHUD();
      },
      onEvent: (msg) => {
        if (msg.type === 'WONDER_CLAIMED') {
          showToast(`${msg.playerName} hann först till världsarvet ${msg.wonderName}!`, 3800);
        } else if (msg.type === 'JOB_RECORD') {
          showToast(
            msg.beatOpponent
              ? `🏆 ${msg.holder} slog ditt jobbrekord på ${msg.jobTitle} i ${msg.cityName} (${msg.score}/${msg.max})!`
              : `📋 ${msg.holder} satte rekord på ${msg.jobTitle} i ${msg.cityName}: ${msg.score}/${msg.max}!`,
            4000
          );
        } else if (msg.type === 'CHALLENGE_Q') {
          AudioMgr.play('bell');
          updateOpponentHUD();
          showToast(`⚡ ${msg.challenge.fromName} skickade en Duellfråga! Klicka på "⚡ DUELLFRÅGA!" längst upp.`, 4500);
        } else if (msg.type === 'CHALLENGE_RESULT') {
          if (msg.opponentGotItRight) {
            showToast(`${msg.responderName} klarade din duellfråga och tog +${BAL.CHALLENGE_BONUS} kr!`, 3800);
          } else {
            changeCash(BAL.CHALLENGE_BONUS, `Vann frågeduell mot ${msg.responderName}`);
            AudioMgr.play('cash');
            showToast(`⚡ ${msg.responderName} svarade fel på din duellfråga! Du vann +${BAL.CHALLENGE_BONUS} kr!`, 4200);
          }
        } else if (msg.text) {
          showToast(msg.text, 3200);
        }
      },
      onOpponentVictory: (opp) => {
        AudioMgr.play('bell');
        triggerDuelResult(false, opp);
      },
      onDisconnect: () => {
        showToast('Motståndaren kopplade ifrån online-duellen.', 3600);
        updateOpponentHUD();
      }
    };
  }

  function mpCreateRoom() {
    const box = document.getElementById('mpHostBox');
    if (box) box.innerHTML = `<div style="font-size:12px; color:#ffd875;">Öppnar online-rum...</div>`;
    const sharedGoals = generateJourneyGoals();
    window.GT_MP.createRoom(state.playerFirstName, sharedGoals, {
      ...getMpCallbacks(),
      onRoomOpen: (code) => {
        if (box) {
          box.innerHTML = `
            <div class="mp-code-box">
              <div style="font-size:10px; color:#c9b48f; letter-spacing:1px;">DIN RUMSKOD:</div>
              <div class="mp-code-digits">${code}</div>
              <button class="globe-brass-btn" style="padding:4px 10px; font-size:11px;" onclick="window.GT.mpCopyCode('${code}')">Kopiera kod</button>
              <div style="font-size:11px; color:#8cd7ff; margin-top:6px;">Väntar på att Spelare 2 ansluter...</div>
            </div>
          `;
        }
      },
      onError: (err) => {
        if (box) box.innerHTML = `<div style="font-size:11.5px; color:#ff7675;">${err}</div>`;
      }
    });
  }

  function mpJoinRoom() {
    const code = document.getElementById('mpJoinCode')?.value || '';
    const st = document.getElementById('mpGuestStatus');
    if (st) st.textContent = `Ansluter till rum ${code}...`;
    window.GT_MP.joinRoom(code, state.playerFirstName, {
      ...getMpCallbacks(),
      onError: (err) => {
        if (st) st.innerHTML = `<span style="color:#ff7675;">${err}</span>`;
      }
    });
  }

  function mpCopyCode(code) {
    try { navigator.clipboard.writeText(code); showToast(`Rumskod ${code} kopierad!`, 2000); } catch (e) {}
  }

  function triggerDuelResult(iWon, opp) {
    const me = buildMySnapshot(iWon);
    const o = opp || { name: 'Motståndare', day: '-', stamps: 0, doneWonders: 0, competencies: 0, cash: 0, accuracy: 0 };
    const html = `
      <div class="card-modal" style="max-width:680px;">
        <div class="diploma">
          <div class="diploma-title">${iWon ? '★ DUELLSEGER! ★' : 'DUELLEN AVGJORD'}</div>
          <div class="diploma-rank">${iWon ? `Grattis ${me.name}! Du slog ${o.name} i racet jorden runt!` : `${o.name} hann först hem till ${homeCityName()} med alla mål klara!`}</div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
          <div class="stat-box" style="border:2px solid #c8322b; text-align:left; padding:10px;">
            <b style="color:#c8322b;">DU (${me.name})</b><br>
            Dag: <b>${me.day}</b> · Stämplar: <b>${me.stamps}</b><br>
            Världsarv: <b>${me.doneWonders}</b> · Yrken: <b>${me.competencies}</b><br>
            Kunskap: <b>${me.accuracy} %</b> · Kassa: <b>${me.cash.toLocaleString('sv-SE')} kr</b>
          </div>
          <div class="stat-box" style="border:2px solid #2b7bb9; text-align:left; padding:10px;">
            <b style="color:#2b7bb9;">MOTSTÅNDARE (${o.name})</b><br>
            Dag: <b>${o.day}</b> · Stämplar: <b>${o.stamps}</b><br>
            Världsarv: <b>${o.doneWonders}</b> · Yrken: <b>${o.competencies}</b><br>
            Kunskap: <b>${o.accuracy} %</b> · Kassa: <b>${(o.cash || 0).toLocaleString('sv-SE')} kr</b>
          </div>
        </div>
        <div class="modal-footer" style="justify-content:center; margin-top:14px;">
          <button class="stamp-action-btn" onclick="window.GT_MP && window.GT_MP.disconnect(); location.reload()">Tillbaka till startmenyn</button>
        </div>
      </div>
    `;
    showModal(html);
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
      if (W.cities[ck] && W.cities[ck].region) regs.add(ROUTES.normRegion(W.cities[ck].region));
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
      if (window.GT_MP && window.GT_MP.active) {
        const mySnap = buildMySnapshot(true);
        window.GT_MP.sendVictory(mySnap);
        AudioMgr.play('fanfar');
        triggerDuelResult(true, window.GT_MP.opponent);
        return true;
      }
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
    const daysLeft = Math.max(0, (W.dayLimit || 30) - state.day);
    const totalHomeSouvenirs = state.backpack.filter(it => it.kind !== 'kurir').length + (state.mailedHome || []).length;
    const loanPenaltyTotal = (state.callsHomeUsed || 0) * (BAL.CALL_HOME_SCORE_PENALTY || 250);
    const finalScore = Math.max(0,
      state.stamps.length * 150 +
      state.doneWonders.size * 220 +
      state.competencies.length * 140 +
      Math.round(accuracy * 300) +
      (completedRoundTrip ? daysLeft * 45 : 0) +
      Math.floor(Math.max(0, state.cash) / 100) +
      totalHomeSouvenirs * 60 +
      (state.contractBonusPoints || 0) -
      loanPenaltyTotal
    );

    if (completedRoundTrip) {
      if (finalScore >= 1650 && accuracy >= 0.70 && (state.callsHomeUsed || 0) === 0) {
        rank = 'Globetrotter';
      } else if (finalScore >= 1100) {
        rank = 'Upptäckare';
      } else {
        rank = 'Resenär';
      }
    }

    try {
      const museum = JSON.parse(localStorage.getItem('gt_museum') || '[]');
      const allHomeItems = [
        ...state.backpack.filter(it => it.kind !== 'kurir'),
        ...(state.mailedHome || [])
      ];
      allHomeItems.forEach(item => {
        if (!museum.some(m => m.id === item.id)) {
          museum.push({ id: item.id, name: item.name, origin: item.origin });
        }
      });
      localStorage.setItem('gt_museum', JSON.stringify(museum));
    } catch (e) {}

    let botStandingsHtml = '';
    if (window.GT_BOTS && Array.isArray(state.bots) && state.bots.length > 0) {
      const pEntry = { ...getPlayerBotEntry(), finished: completedRoundTrip };
      const finalTable = window.GT_BOTS.getStandings(pEntry, state.bots);
      botStandingsHtml = `
        <div style="margin-top:10px;">
          <h4 style="color:#6b461e; margin:0 0 4px; font-family:Georgia,serif;">Slutställning mot medresenärer:</h4>
          <table class="bot-standings-table" style="font-size:12px;">
            <thead><tr><th>#</th><th>Resenär</th><th>Stämplar</th><th>Yrken</th><th>Poäng</th></tr></thead>
            <tbody>
              ${finalTable.map(r => `<tr class="${r.isPlayer ? 'is-player' : ''}"><td><b>#${r.rank}</b></td><td>${r.name}${r.finished ? ' 🏁' : ''}</td><td>${r.stamps}</td><td>${r.competencies}</td><td><b>${r.score} p</b></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    const html = `
      <div class="card-modal" style="max-width:680px;">
        <div class="diploma">
          <div class="diploma-title">Globetrotterklubben</div>
          <div class="diploma-rank">Antagen som: <b>${rank}</b> · <span>${finalScore.toLocaleString('sv-SE')} p</span></div>
          <p style="font-size:14px; color:#5b3b1c;">
            ${completedRoundTrip ? 
              `Grattis! Du har rest jorden runt och återvänt hem till ${homeCityName()} inom tidsgränsen.` : 
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
          <div class="stat-box">Hemförda souvenirer: <b>${totalHomeSouvenirs} st</b></div>
        </div>

        ${botStandingsHtml}

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
    returnFromWonder,
    openSignatureModal,
    doSignatureActivity,
    openJobModal,
    startJobShift,
    startJobMinigame,
    openLibraryModal,
    openKnowledgeHelpPopup,
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
    callHomeForMoney,
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
    openStartScreen,
    openNewGameSetup,
    openMenuModal,
    openBotStandingsModal,
    startBotDuel,
    openMultiplayerLobby,
    mpCreateRoom,
    mpJoinRoom,
    mpCopyCode,
    openIncomingChallenge,
    toggleSound() {
      const active = AudioMgr.toggle();
      if (window.AmbientMgr) window.AmbientMgr.setEnabled(active);
      if (el.btnSound) el.btnSound.textContent = active ? 'LJUD: PÅ' : 'LJUD: AV';
      const mBtn = document.getElementById('menuSoundToggleBtn');
      if (mBtn) {
        mBtn.textContent = active ? '🔊 LJUD: PÅ' : '🔇 LJUD: AV';
        mBtn.classList.toggle('active', active);
      }
      showToast(active ? "Ljud & musik påslaget" : "Ljud & musik avstängt", 1200);
    },
    toggleFullscreen() {
      const rootEl = document.documentElement;
      const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      if (isFs) {
        const exitFn = document.exitFullscreen || document.webkitExitFullscreen;
        if (exitFn) exitFn.call(document).catch?.(() => {});
        const btn = document.getElementById('menuFullscreenBtn');
        if (btn) { btn.textContent = '⛶ HELSKÄRM'; btn.classList.remove('active'); }
        return;
      }
      const reqFn = rootEl.requestFullscreen || rootEl.webkitRequestFullscreen;
      if (reqFn) {
        Promise.resolve(reqFn.call(rootEl)).then(() => {
          const btn = document.getElementById('menuFullscreenBtn');
          if (btn) { btn.textContent = '⛶ HELSKÄRM: PÅ'; btn.classList.add('active'); }
          showToast('Helskärmsläge aktiverat!', 1800);
        }).catch(() => {
          showToast('På iPhone/iPad: tryck Dela (↑) → "Lägg till på hemskärmen" för 100 % helskärm utan adressfält!', 4800);
        });
      } else {
        showToast('På iPhone/iPad: tryck Dela (↑) → "Lägg till på hemskärmen" för 100 % helskärm utan adressfält!', 4800);
      }
    }
  };

  if (el.btnSound) {
    el.btnSound.onclick = () => { window.GT.toggleSound(); };
  }

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

  // Starta en ständigt snurrande 3D-väska i dockan (byts automatiskt mellan Tier 1, 2 och 3!)
  let dockMiniBackpackRenderer = null;
  function initDockMiniBackpack() {
    const bpCanvas = document.getElementById('dockMiniBackpack');
    if (!bpCanvas || !window.Backpack3DRenderer) return;
    dockMiniBackpackRenderer = new window.Backpack3DRenderer(bpCanvas, {
      interactive: false,
      tier: state.backpackLevel,
      zoom: 2.95,
      pitch: 0.14,
      speed: 0.018
    });
    const spinLoop = () => {
      dockMiniBackpackRenderer.render();
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
