// Headless Bot-vs-Bot Simulator för Globetrotter: Scotland Yard 3D
// Speglar exakt reglerna i proto/js/scotland_mode.js och proto/js/scotland_data.js
// Kör 200 matcher med deterministiskt slumpfrö och mäter vinstgrad samt orsaker till förlust.

'use strict';

const fs = require('fs');
const path = require('path');

// Ladda spelets riktiga stadsdata
global.window = {};
eval(fs.readFileSync(path.join(__dirname, '../js/scotland_data.js'), 'utf8'));
const DATA = global.window.GT_SCOTLAND_DATA;
const CITIES = DATA.CITIES;
const CITY_IDS = Object.keys(CITIES);

// Deterministisk PRNG (Mulberry32)
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getFareKr(fromId, toId, mode) {
  const c1 = CITIES[fromId], c2 = CITIES[toId];
  const km = DATA.haversineKm(c1.center, c2.center);
  if (mode === 'flight') return Math.round((650 + km * 0.30) / 50) * 50;
  return Math.round((300 + km * 0.25) / 50) * 50;
}

function bfsPath(fromId, toId, allowFlights = true, avoidCities = null) {
  if (fromId === toId) return [];
  const q = [[fromId]];
  const seen = new Set([fromId]);
  while (q.length > 0) {
    const p = q.shift();
    const cur = p[p.length - 1];
    const c = CITIES[cur];
    const edges = allowFlights
      ? [...c.trains.map(id => ({ id, mode: 'train' })), ...c.flights.map(id => ({ id, mode: 'flight' }))]
      : c.trains.map(id => ({ id, mode: 'train' }));
    for (const e of edges) {
      if (e.id === toId) return [...p.slice(1), e.id];
      if (avoidCities && avoidCities.has(e.id) && e.id !== toId) continue;
      if (!seen.has(e.id)) {
        seen.add(e.id);
        q.push([...p, e.id]);
      }
    }
  }
  return null;
}

function bfsNextStep(fromId, toId, allowFlights = true, avoidCities = null) {
  const pathIds = bfsPath(fromId, toId, allowFlights, avoidCities);
  if (!pathIds || pathIds.length === 0) return null;
  const nxt = pathIds[0];
  const mode = (allowFlights && CITIES[fromId].flights.includes(nxt) && !CITIES[fromId].trains.includes(nxt))
    ? 'flight'
    : (allowFlights && CITIES[fromId].flights.includes(nxt) ? 'flight' : 'train');
  return { to: nxt, mode };
}

function moveTowards(from, to, maxMeters) {
  const d = DATA.distanceMeters(from, to);
  if (d <= maxMeters || d < 0.5) return [to[0], to[1]];
  const r = maxMeters / d;
  return [from[0] + (to[0] - from[0]) * r, from[1] + (to[1] - from[1]) * r];
}

// Konfigurerbara strategiversioner för Co-Evolution-loopen
const CONFIG = {
  thiefVersion: Number(process.env.THIEF_V || 1),
  policeVersion: Number(process.env.POLICE_V || 1),
  matches: Number(process.env.MATCHES || 200),
  // Spelparametrar (exakt som i scotland_mode.js)
  TOTAL_DAYS: 10,
  SEC_PER_DAY: 60,
  REVEAL_DAYS: [3, 6, 8],
  CAPTURE_DIST_M: 38,
  POLICE_VISION_M: 250,
  POLICE_LOSE_SIGHT_M: 285,
  PLAYER_SPEED_MPS: 115,
  POLICE_CHASE_MULT: 0.74,
  POLICE_SEARCH_MULT: 0.58,
  THIEF_TRAIN_BOARD_SEC: Number(process.env.THIEF_BOARD || 7),
  POLICE_BOARD_SEC: Number(process.env.POLICE_BOARD || 2),
  MIN_PRECINCT_HUB_M: Number(process.env.MIN_SPAWN_M || 0),
  START_CASH: Number(process.env.START_CASH || 1800),
  DT: 0.5 // 0.5s simuleringssteg
};

function runMatch(seed) {
  const rng = makeRng(seed);
  const policeStarts = DATA.POLICE_ROSTER.map(p => p.startCity);
  const thiefStart = shuffle(CITY_IDS.filter(id => !policeStarts.includes(id)), rng)[0];
  const pool = shuffle(CITY_IDS.filter(id => id !== thiefStart), rng);
  const realTargets = pool.slice(0, 3);
  const suspectPool = shuffle([...realTargets, ...pool.slice(3, 6)], rng);

  const st = {
    elapsedSec: 0,
    realTargets,
    collected: [],
    suspectPool,
    clearedSuspects: [],
    revealTriggered: {},
    lastPing: null,
    cash: CONFIG.START_CASH,
    thief: {
      city: thiefStart,
      coords: [...CITIES[thiefStart].hub.coords],
      travel: null,
      boarding: null,
      boostUntil: 0,
      boostCd: 0,
      hiddenUntil: 0,
      evadeUntil: 0,
      hideCd: {},
      workTimer: 0,
      needCashWork: false
    },
    police: DATA.POLICE_ROSTER.map((p, idx) => ({
      idx,
      id: p.id,
      city: p.startCity,
      coords: [...CITIES[p.startCity].precinct.coords],
      travel: null,
      boarding: null,
      spottedPos: null,
      alertState: 'patrol',
      aiCooldown: 2 + rng() * 3,
      reconCd: {}
    })),
    metrics: {
      encounters: 0,
      sightings: 0,
      emergencyEscapes: 0,
      ranLowCash: 0,
      cashJobsDone: 0,
      reveals: 0,
      flightsTaken: 0,
      trainsTaken: 0,
      capturedDuringBoarding: false,
      capturedDuringHeist: false,
      capturedOnStreet: false,
      policeReconPings: 0
    }
  };

  function triggerReveal(cityId, reason) {
    st.lastPing = { cityId, time: st.elapsedSec, reason };
    st.metrics.reveals++;
  }

  function startTravel(actor, to, mode, isThief, emergency = false) {
    const fromCity = actor.city;
    const dur = DATA.getTravelSeconds(fromCity, to, mode);
    if (isThief) {
      const fare = getFareKr(fromCity, to, mode);
      st.cash = Math.max(0, st.cash - fare);
      if (mode === 'flight') st.metrics.flightsTaken++;
      else st.metrics.trainsTaken++;
    }
    actor.travel = { from: fromCity, to, mode, startSec: st.elapsedSec, durationSec: dur };
    // Ny regel: Flyg & nödflykt avslöjar AVGÅNGSSTADEN (inte destinationen!)
    if (isThief && (mode === 'flight' || emergency)) {
      triggerReveal(fromCity, emergency ? 'emergency' : 'flight');
    }
  }

  const maxSec = CONFIG.TOTAL_DAYS * CONFIG.SEC_PER_DAY;
  let lastEncounterKey = '';

  while (st.elapsedSec < maxSec) {
    st.elapsedSec += CONFIG.DT;
    const day = Math.min(CONFIG.TOTAL_DAYS, Math.floor(st.elapsedSec / CONFIG.SEC_PER_DAY) + 1);

    // 1. Obligatoriska avslöjandedagar (Dag 3, 6, 8)
    for (const rd of CONFIG.REVEAL_DAYS) {
      if (day >= rd && !st.revealTriggered[rd]) {
        st.revealTriggered[rd] = true;
        const pc = st.thief.travel ? st.thief.travel.to : st.thief.city;
        triggerReveal(pc, 'mandatory');
      }
    }

    // 2. Boarding -> Resa
    const all = [{ a: st.thief, isThief: true }, ...st.police.map(p => ({ a: p, isThief: false }))];
    for (const { a, isThief } of all) {
      if (a.boarding && st.elapsedSec >= a.boarding.startSec + a.boarding.durationSec) {
        const b = a.boarding;
        a.boarding = null;
        startTravel(a, b.to, b.mode, isThief, b.emergency);
      }
      if (a.travel && st.elapsedSec >= a.travel.startSec + a.travel.durationSec) {
        const dest = a.travel.to;
        a.city = dest;
        a.travel = null;
        if (isThief) {
          a.coords = [...CITIES[dest].hub.coords];
        } else {
          let spawn = [...CITIES[dest].precinct.coords];
          // Valfri balansregel: garantera minst MIN_PRECINCT_HUB_M mellan polisspawn och station
          if (CONFIG.MIN_PRECINCT_HUB_M > 0) {
            const dHub = DATA.distanceMeters(spawn, CITIES[dest].hub.coords);
            if (dHub < CONFIG.MIN_PRECINCT_HUB_M) {
              const dx = spawn[0] - CITIES[dest].hub.coords[0] || 0.004;
              const dy = spawn[1] - CITIES[dest].hub.coords[1] || 0.003;
              const scale = CONFIG.MIN_PRECINCT_HUB_M / Math.max(10, dHub);
              spawn = [CITIES[dest].hub.coords[0] + dx * scale, CITIES[dest].hub.coords[1] + dy * scale];
            }
          }
          a.coords = spawn;
          a.spottedPos = null;
          a.alertState = 'patrol';
        }
      }
    }

    // 3. Uppdatera Tjuv-AI
    updateThiefBot(st, rng, CONFIG.thiefVersion);

    // 4. Uppdatera Polis-AI
    updatePoliceBots(st, rng, CONFIG.policeVersion, triggerReveal);

    // 5. Kolla möten & gripande i samma stad
    if (!st.thief.travel) {
      for (const p of st.police) {
        if (p.travel || p.city !== st.thief.city) continue;
        const encKey = `${st.thief.city}:${Math.floor(st.elapsedSec / 25)}`;
        if (encKey !== lastEncounterKey) {
          lastEncounterKey = encKey;
          st.metrics.encounters++;
        }
        const d = DATA.distanceMeters(p.coords, st.thief.coords);
        if (d <= CONFIG.CAPTURE_DIST_M) {
          if (st.thief.boarding) st.metrics.capturedDuringBoarding = true;
          else if (st.thief.workTimer > 0) st.metrics.capturedDuringHeist = true;
          else st.metrics.capturedOnStreet = true;
          return { winner: 'police', reason: 'capture', days: st.elapsedSec / CONFIG.SEC_PER_DAY, collected: st.collected.length, metrics: st.metrics };
        }
      }
    }

    // 6. Kolla vinst för tjuven
    if (st.collected.length >= 3) {
      return { winner: 'thief', reason: 'all_artifacts', days: st.elapsedSec / CONFIG.SEC_PER_DAY, collected: 3, metrics: st.metrics };
    }
  }

  return { winner: 'police', reason: 'timeout', days: CONFIG.TOTAL_DAYS, collected: st.collected.length, metrics: st.metrics };
}

function updateThiefBot(st, rng, version) {
  const th = st.thief;
  if (th.travel) return;

  const cur = CITIES[th.city];
  const speed = CONFIG.PLAYER_SPEED_MPS * (st.elapsedSec < th.boostUntil ? 1.7 : 1.0);
  const policeHere = st.police.find(p => !p.travel && p.city === th.city);

  if (th.boarding) {
    // V2+: Avbryt boarding om en polis närmar sig! (V4: avbryt även emergency om polisen hinner fram före avgång!)
    if (version >= 2 && policeHere) {
      const dPol = DATA.distanceMeters(policeHere.coords, th.coords);
      const remBoard = (th.boarding.startSec + th.boarding.durationSec) - st.elapsedSec;
      const policeReachM = remBoard * CONFIG.PLAYER_SPEED_MPS * CONFIG.POLICE_CHASE_MULT + CONFIG.CAPTURE_DIST_M + 25;
      if (version >= 4) {
        if (dPol < policeReachM) th.boarding = null;
      } else if (!th.boarding.emergency) {
        const abortDist = version >= 3 ? 210 : 95;
        if (dPol < abortDist) th.boarding = null;
      }
    }
    return;
  }

  // V3+: Smart flykt i staden (använder Sprint, folkmassa-gömställe och 2s nödflykt!)
  if (policeHere) {
    const dPol = DATA.distanceMeters(policeHere.coords, th.coords);
    const dHub = DATA.distanceMeters(th.coords, cur.hub.coords);
    const dPolToHub = DATA.distanceMeters(policeHere.coords, cur.hub.coords);

    // Använd Sprint-boost om polisen är nära
    if (version >= 2 && dPol < 190 && st.elapsedSec >= th.boostCd) {
      th.boostUntil = st.elapsedSec + 10;
      th.boostCd = st.elapsedSec + 25;
      st.lastPing = { cityId: th.city, time: st.elapsedSec, reason: 'sprint' };
      st.metrics.reveals++;
    }

    // V3+: Om polisen blockerar stationen (är närmare stationen än tjuven eller inom 150m av stationen)
    // och polisen är >= 85m bort → slink in på närmaste Hotell/Bibliotek för att smälta in i folkmassan (8s)!
    if (version >= 3 && dPol >= 85 && (dPolToHub < dHub + 80 || dPol < 160) && st.elapsedSec >= (th.hideCd[th.city] || 0)) {
      const hidePt = cur.landmark.coords; // Proxy för närliggande byggnad ~300m bort
      if (DATA.distanceMeters(th.coords, hidePt) <= 115) {
        th.hiddenUntil = st.elapsedSec + 8;
        th.hideCd[th.city] = st.elapsedSec + 35;
        policeHere.spottedPos = null;
        policeHere.alertState = 'searching';
      } else if (dHub > 140) {
        th.coords = moveTowards(th.coords, hidePt, speed * CONFIG.DT);
        return;
      }
    }

    // V5: Om polisen är närmare stationen än tjuven → kuta beslutsamt bort tills siktlinjen bryts (>300m)!
    if (version >= 5 && st.elapsedSec >= th.hiddenUntil) {
      if (dPolToHub < dHub + 50 && dPol < 295) {
        th.evadeUntil = Math.max(th.evadeUntil, st.elapsedSec + 3.5);
      }
      if (st.elapsedSec < th.evadeUntil && dPol < 310) {
        const dx = th.coords[0] - policeHere.coords[0] || 0.002;
        const dy = th.coords[1] - policeHere.coords[1] || 0.002;
        const away = [th.coords[0] + dx * 3, th.coords[1] + dy * 3];
        th.coords = moveTowards(th.coords, away, speed * CONFIG.DT);
        return;
      }
    } else if (version >= 3 && dPolToHub < 120 && dPol < 220 && st.elapsedSec >= th.hiddenUntil) {
      // Kuta bort från polisen för att bryta siktlinjen (>285m)!
      const away = [th.coords[0] + (th.coords[0] - policeHere.coords[0]), th.coords[1] + (th.coords[1] - policeHere.coords[1])];
      th.coords = moveTowards(th.coords, away, speed * CONFIG.DT);
      return;
    }

    th.coords = moveTowards(th.coords, cur.hub.coords, speed * CONFIG.DT);
    if (DATA.distanceMeters(th.coords, cur.hub.coords) <= 105) {
      const dangerous = new Set(st.police.map(p => (p.travel ? p.travel.to : p.city)));
      const safeTrains = cur.trains.filter(id => !dangerous.has(id));
      const pool = safeTrains.length > 0 ? safeTrains : cur.trains;
      const dest = pool[Math.floor(rng() * pool.length)];
      if (dest) {
        const polHiddenOrFar = st.elapsedSec < th.hiddenUntil || dPol > 320;
        if (!polHiddenOrFar) {
          st.cash = Math.max(0, st.cash - 250);
          th.boarding = { to: dest, mode: 'train', startSec: st.elapsedSec, durationSec: 2, emergency: true };
          st.metrics.emergencyEscapes++;
        } else {
          th.boarding = { to: dest, mode: 'train', startSec: st.elapsedSec, durationSec: CONFIG.THIEF_TRAIN_BOARD_SEC, emergency: false };
        }
      }
    }
    return;
  }

  // Är nuvarande stad ett oklarat mål?
  const isTargetHere = st.realTargets.includes(th.city) && !st.collected.includes(th.city);
  if (isTargetHere) {
    if (DATA.distanceMeters(th.coords, cur.landmark.coords) > 60) {
      th.coords = moveTowards(th.coords, cur.landmark.coords, speed * CONFIG.DT);
    } else {
      th.workTimer += CONFIG.DT;
      const workNeeded = version >= 3 ? 4.5 : (version >= 2 ? 5.5 : 8.0);
      if (th.workTimer >= workNeeded) {
        th.workTimer = 0;
        st.collected.push(th.city);
        st.cash += 600;
      }
    }
    return;
  }

  // Behöver tjuven tjäna pengar för nästa resa?
  const cheapestTrain = Math.min(...cur.trains.map(id => getFareKr(th.city, id, 'train')), 9999);
  if (st.cash < cheapestTrain || th.needCashWork) {
    if (!th.needCashWork) st.metrics.ranLowCash++;
    th.needCashWork = true;
    if (DATA.distanceMeters(th.coords, cur.landmark.coords) > 60) {
      th.coords = moveTowards(th.coords, cur.landmark.coords, speed * CONFIG.DT);
    } else {
      th.workTimer += CONFIG.DT;
      if (th.workTimer >= (version >= 3 ? 4.5 : 6.0)) {
        th.workTimer = 0;
        th.needCashWork = false;
        st.cash += 900;
        st.metrics.cashJobsDone++;
      }
    }
    return;
  }

  // Välj närmaste oklarade mål (V3+: undvik mål som just nu har en polis om ett annat mål är fritt!)
  const remaining = st.realTargets.filter(id => !st.collected.includes(id));
  if (remaining.length === 0) return;
  const dangerousCities = new Set(st.police.map(p => (p.travel ? p.travel.to : p.city)));
  let nextGoal = remaining[0];
  if (version >= 2 && remaining.length > 1) {
    remaining.sort((a, b) => {
      const penA = (version >= 3 && dangerousCities.has(a)) ? 4000 : 0;
      const penB = (version >= 3 && dangerousCities.has(b)) ? 4000 : 0;
      return (DATA.haversineKm(cur.center, CITIES[a].center) + penA) - (DATA.haversineKm(cur.center, CITIES[b].center) + penB);
    });
    nextGoal = remaining[0];
  }

  if (DATA.distanceMeters(th.coords, cur.hub.coords) > 70) {
    th.coords = moveTowards(th.coords, cur.hub.coords, speed * CONFIG.DT);
    return;
  }

  const policeCities = version >= 2 ? dangerousCities : null;
  const curDay = Math.floor(st.elapsedSec / CONFIG.SEC_PER_DAY) + 1;
  const allowFlight = version >= 6
    ? (curDay >= 6 && st.cash >= 1200)
    : (version >= 3 ? (st.cash >= 1800 && rng() < 0.15) : (rng() < 0.25));
  let step = (allowFlight ? bfsNextStep(th.city, nextGoal, true, policeCities) : null)
    || bfsNextStep(th.city, nextGoal, false, policeCities)
    || bfsNextStep(th.city, nextGoal, allowFlight, policeCities)
    || bfsNextStep(th.city, nextGoal, false, null)
    || bfsNextStep(th.city, nextGoal, true, null);

  if (step) {
    const fare = getFareKr(th.city, step.to, step.mode);
    if (st.cash < fare) {
      const trainStep = bfsNextStep(th.city, nextGoal, false, null);
      if (trainStep && st.cash >= getFareKr(th.city, trainStep.to, 'train')) {
        step = trainStep;
      } else {
        th.needCashWork = true;
        return;
      }
    }
    // V4: Ta inte nödflykt i förebyggande syfte om vi bara har 1–2s kvar — undvik avslöjande-spiralen!
    const incomingSoon = version === 3 && st.police.some(p => p.travel && p.travel.to === th.city && (p.travel.startSec + p.travel.durationSec - st.elapsedSec) < 8);
    if (incomingSoon && step.mode === 'train') {
      st.cash = Math.max(0, st.cash - 250);
      th.boarding = { to: step.to, mode: 'train', startSec: st.elapsedSec, durationSec: 2, emergency: true };
      st.metrics.emergencyEscapes++;
    } else {
      th.boarding = {
        to: step.to,
        mode: step.mode,
        startSec: st.elapsedSec,
        durationSec: step.mode === 'flight' ? 5 : CONFIG.THIEF_TRAIN_BOARD_SEC,
        emergency: false
      };
    }
  }
}

function updatePoliceBots(st, rng, version, triggerReveal) {
  const pingCity = st.lastPing ? st.lastPing.cityId : null;
  const pingAge = st.lastPing ? (st.elapsedSec - st.lastPing.time) : 999;
  const activeSuspects = st.suspectPool.filter(id => !st.collected.includes(id) && !st.clearedSuspects.includes(id));

  st.police.forEach((p, idx) => {
    if (p.travel || p.boarding) return;

    // 1. Samma stad som tjuven: siktlinje-jakt!
    if (!st.thief.travel && p.city === st.thief.city) {
      const d = DATA.distanceMeters(p.coords, st.thief.coords);
      const thiefHidden = st.elapsedSec < st.thief.hiddenUntil;
      const thiefSprinting = st.elapsedSec < st.thief.boostUntil;

      if (!thiefHidden && (d <= CONFIG.POLICE_VISION_M || thiefSprinting)) {
        if (p.alertState !== 'chasing') st.metrics.sightings++;
        p.alertState = 'chasing';
        p.spottedPos = [...st.thief.coords];
      } else if (p.alertState === 'chasing' && (d > CONFIG.POLICE_LOSE_SIGHT_M || thiefHidden)) {
        p.alertState = 'searching';
      }

      const speedMult = p.alertState === 'chasing'
        ? (version >= 3 && version !== 4 ? 0.80 : CONFIG.POLICE_CHASE_MULT)
        : (version >= 2 ? 0.68 : CONFIG.POLICE_SEARCH_MULT);

      let targetPt = p.spottedPos;
      if (!targetPt || DATA.distanceMeters(p.coords, targetPt) < 25) {
        p.alertState = 'searching';
        const c = CITIES[p.city];
        p.spottedPos = (DATA.distanceMeters(p.coords, c.hub.coords) > 120) ? [...c.hub.coords] : [...c.landmark.coords];
        targetPt = p.spottedPos;
      }
      p.coords = moveTowards(p.coords, targetPt, CONFIG.PLAYER_SPEED_MPS * speedMult * CONFIG.DT);
      return;
    }

    // V2 & V3: Recon-ping (V4: rättvis koordinerad polis UTAN gratis recon-ping-spam!)
    if ((version === 2 || version === 3) && activeSuspects.includes(p.city)) {
      const cdUntil = p.reconCd[p.city] || 0;
      if (st.elapsedSec >= cdUntil && p.aiCooldown <= 0.5) {
        p.reconCd[p.city] = st.elapsedSec + 45;
        if (!st.realTargets.includes(p.city) && !st.clearedSuspects.includes(p.city)) {
          st.clearedSuspects.push(p.city);
        }
        // 65% chans att AI-polisen klarar spaningsfrågan → färsk radarping!
        if (rng() < 0.65) {
          const pc = st.thief.travel ? st.thief.travel.to : st.thief.city;
          triggerReveal(pc, 'police_recon');
          st.metrics.policeReconPings++;
        }
      }
    }

    // 2. Glob-strategi
    p.aiCooldown -= CONFIG.DT;
    if (p.aiCooldown > 0) return;
    p.aiCooldown = version >= 2 ? (1.8 + rng() * 1.4) : (3.0 + rng() * 2.2);

    let goal = null;
    if (version === 1) {
      // Exakt nuvarande logik i scotland_mode.js
      if (idx === 0) {
        goal = (pingCity && pingCity !== p.city)
          ? pingCity
          : [...CITIES[p.city].trains, ...CITIES[p.city].flights][Math.floor(rng() * (CITIES[p.city].trains.length + CITIES[p.city].flights.length))];
      } else if (idx === 1) {
        if (pingCity) {
          const nb = [...CITIES[pingCity].trains, ...CITIES[pingCity].flights].filter(id => id !== p.city);
          goal = nb.find(id => activeSuspects.includes(id)) || nb[Math.floor(rng() * nb.length)];
        } else {
          const hubs = ['zurich', 'paris', 'berlin', 'milan'].filter(id => id !== p.city);
          goal = hubs[Math.floor(rng() * hubs.length)];
        }
      } else {
        const gc = activeSuspects.filter(id => id !== p.city);
        goal = gc[Math.floor(rng() * gc.length)] || CITY_IDS[0];
      }
    } else {
      // V2+: Smartare koordinering — undvik att 2 poliser åker till samma stad, och genskjut mot närmaste misstänkta mål från senaste ping!
      const claimedByOthers = new Set(st.police.filter(o => o.id !== p.id).map(o => (o.travel ? o.travel.to : o.city)));

      if (idx === 0) {
        // Spåraren: flyg direkt mot färskt spår (<25s), annars sök grannstad i riktning mot ett misstänkt mål
        if (pingCity && pingCity !== p.city && pingAge < 25) {
          goal = pingCity;
        } else if (pingCity) {
          const nb = [...CITIES[pingCity].trains, ...CITIES[pingCity].flights].filter(id => id !== p.city && !claimedByOthers.has(id));
          goal = nb.find(id => activeSuspects.includes(id)) || nb[Math.floor(rng() * nb.length)];
        } else {
          const cands = activeSuspects.filter(id => id !== p.city && !claimedByOthers.has(id));
          goal = cands[0] || activeSuspects[0];
        }
      } else if (idx === 1) {
        // Genskjutaren: ta närmaste misstänkta mål till senaste spåret (skär av rutt!)
        if (pingCity && activeSuspects.length > 0) {
          const sorted = activeSuspects
            .filter(id => id !== p.city && !claimedByOthers.has(id))
            .sort((a, b) => DATA.haversineKm(CITIES[pingCity].center, CITIES[a].center) - DATA.haversineKm(CITIES[pingCity].center, CITIES[b].center));
          goal = sorted[0];
        }
        if (!goal) {
          const hubs = ['zurich', 'paris', 'berlin', 'milan', 'prague'].filter(id => id !== p.city && !claimedByOthers.has(id));
          goal = hubs[Math.floor(rng() * hubs.length)];
        }
      } else {
        // Väktaren: vaktar ett oklarat misstänkt mål som ingen annan polis bevakar!
        const unguarded = activeSuspects.filter(id => id !== p.city && !claimedByOthers.has(id));
        goal = unguarded[Math.floor(rng() * unguarded.length)] || activeSuspects[0];
      }
    }

    if (goal && goal !== p.city) {
      const step = bfsNextStep(p.city, goal, true);
      if (step) {
        p.boarding = { to: step.to, mode: step.mode, startSec: st.elapsedSec, durationSec: CONFIG.POLICE_BOARD_SEC, emergency: false };
      }
    }
  });
}

// Kör batch-simulering
function runBatch() {
  let thiefWins = 0, policeCapture = 0, policeTimeout = 0;
  let totalDays = 0, totalArtifacts = 0, totalEncounters = 0, totalSightings = 0;
  let totalEmergency = 0, totalLowCash = 0, totalCashJobs = 0, totalRecon = 0;
  let capBoard = 0, capHeist = 0, capStreet = 0;

  for (let i = 0; i < CONFIG.matches; i++) {
    const r = runMatch(1000 + i * 7919);
    if (r.winner === 'thief') thiefWins++;
    else if (r.reason === 'capture') policeCapture++;
    else policeTimeout++;

    totalDays += r.days;
    totalArtifacts += r.collected;
    totalEncounters += r.metrics.encounters;
    totalSightings += r.metrics.sightings;
    totalEmergency += r.metrics.emergencyEscapes;
    totalLowCash += r.metrics.ranLowCash;
    totalCashJobs += r.metrics.cashJobsDone;
    totalRecon += r.metrics.policeReconPings;
    if (r.metrics.capturedDuringBoarding) capBoard++;
    if (r.metrics.capturedDuringHeist) capHeist++;
    if (r.metrics.capturedOnStreet) capStreet++;
  }

  const N = CONFIG.matches;
  console.log(`\n=== SIMULERING: THIEF_V=${CONFIG.thiefVersion} vs POLICE_V=${CONFIG.policeVersion} (${N} matcher) ===`);
  console.log(`Tjuv vinner:      ${thiefWins}/${N} (${(thiefWins / N * 100).toFixed(1)}%)`);
  console.log(`Polis (Gripande): ${policeCapture}/${N} (${(policeCapture / N * 100).toFixed(1)}%)  [Boarding: ${capBoard}, Kupp/Jobb: ${capHeist}, Gata: ${capStreet}]`);
  console.log(`Polis (Tidsgräns):${policeTimeout}/${N} (${(policeTimeout / N * 100).toFixed(1)}%)`);
  console.log(`Snitt längd:      ${(totalDays / N).toFixed(2)} / ${CONFIG.TOTAL_DAYS} dagar | Snitt föremål: ${(totalArtifacts / N).toFixed(2)}/3`);
  console.log(`Snitt möten/match:${(totalEncounters / N).toFixed(2)} | Ögonkontakt: ${(totalSightings / N).toFixed(2)} | Nödflykter: ${(totalEmergency / N).toFixed(2)}`);
  console.log(`Snitt pengabrist: ${(totalLowCash / N).toFixed(2)} | Pengajobb: ${(totalCashJobs / N).toFixed(2)} | Polis-spaningspings: ${(totalRecon / N).toFixed(2)}`);
}

runBatch();
