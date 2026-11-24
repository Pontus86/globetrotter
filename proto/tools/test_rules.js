// Automatiserat regeltest för Globetrotter
// Kör med: node proto/tools/test_rules.js

'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const protoDir = path.resolve(__dirname, '..');

// Skapa ett minimalt window-objekt för att ladda datamodulerna och rena regelmoduler
const sandbox = {
  window: {},
  console,
  Math,
  Date,
  Set,
  Map,
  Array,
  Object,
  Number,
  String,
  Boolean,
  JSON,
  RegExp
};
sandbox.global = sandbox.window;
sandbox.self = sandbox.window;
vm.createContext(sandbox);

function loadScript(relPath) {
  const full = path.join(protoDir, relPath);
  const code = fs.readFileSync(full, 'utf8');
  vm.runInContext(code, sandbox, { filename: relPath });
}

// 1. Ladda all världsdata + nya regelmoduler
const scriptsToLoad = [
  'data/world.js',
  'data/travel_events.js',
  'data/questions.js',
  'data/interactive_questions.js',
  'data/hard_questions.js',
  'data/world_expansion.js',
  'data/world_wonders.js',
  'data/jobs_catalog.js',
  'data/country_facts.js',
  'data/country_history.js',
  'data/world_50_cities.js',
  'js/balance.js',
  'js/audio.js',
  'js/routes.js',
  'js/economy.js',
  'js/quiz.js',
  'js/bots.js'
];

scriptsToLoad.forEach(loadScript);

const W = sandbox.window.GT_WORLD;
const ROUTES = sandbox.window.GT_ROUTES;
const ECON = sandbox.window.GT_ECONOMY;
const BAL = sandbox.window.GT_BALANCE;

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failures++;
  }
}

const cityKeys = Object.keys(W.cities);
console.log(`Testar ${cityKeys.length} städer, ${Object.keys(W.souvenirs).length} souvenirer, ${Object.keys(W.places).length} sevärdheter...`);

// Test 1: Inga NaN-priser i hela souvenirkatalogen (varken köp eller försäljning)
let badPrices = 0;
Object.entries(W.souvenirs).forEach(([k, s]) => {
  const base = ECON.getSouvenirBasePrice(s);
  if (!Number.isFinite(base) || base <= 0) badPrices++;
  const localVal = ECON.calcSouvenirValue(W, k, s.origin || 'malmo');
  const farVal = ECON.calcSouvenirValue(W, k, s.origin === 'tokyo' ? 'malmo' : 'tokyo');
  if (!Number.isFinite(localVal.price) || localVal.price <= 0) badPrices++;
  if (!Number.isFinite(farVal.price) || farVal.price <= 0) badPrices++;
});
assert(badPrices === 0, `Hittade ${badPrices} souvenirer med ogiltigt/NaN pris!`);

// Test 2: Specifikt Oslos osthyvel (190 kr -> 4 310 kr kvar av 4 500 kr startkassa)
const ostPrice = ECON.getEffectiveBuyPrice(W, { city: 'oslo', day: 1, haggleState: {} }, 'osthyvel', null);
assert(ostPrice === 190, `Osthyveln i Oslo borde kosta 190 kr, fick ${ostPrice}`);
assert(BAL.START_CASH === 4500 && W.startCash === 4500, `Startkassan borde vara 4500 kr, fick BAL=${BAL.START_CASH}, W=${W.startCash}`);
assert(BAL.START_CASH - ostPrice === 4310, `Saldo efter osthyvel borde bli 4310, fick ${BAL.START_CASH - ostPrice}`);

// Test 3: Konsekvent regionräkning (Malmö + Stockholm = 1 världsdel, inte 2!)
const rMalmo = ROUTES.normRegion(W.cities.malmo.region);
const rSthlm = ROUTES.normRegion(W.cities.stockholm.region);
assert(rMalmo === rSthlm, `Malmö (${rMalmo}) och Stockholm (${rSthlm}) måste ha samma normaliserade region!`);

// Test 4: Nåbarhet tur-och-retur från varje startstad + Malmö -> Köpenhamn
const malmoEdges = ROUTES.getAllOutgoingEdges(W, 'malmo');
assert(malmoEdges.includes('kopenhamn'), 'Malmö måste kunna nå Köpenhamn!');
const malmoReachable = ROUTES.getRoundTripReachableCities(W, 'malmo');
console.log(`Från Malmö kan man nå ${malmoReachable.length} av ${cityKeys.length - 1} andra städer tur-och-retur.`);
assert(malmoReachable.length >= 50, `För få städer nåbara från Malmö: ${malmoReachable.length}`);

// Kontrollera att alla 67 startstäder kan nå minst 3 målstäder tur-och-retur
let stuckStarts = [];
cityKeys.forEach(start => {
  const reach = ROUTES.getRoundTripReachableCities(W, start);
  if (reach.length < 3) stuckStarts.push(`${start}(${reach.length})`);
});
assert(stuckStarts.length === 0, `Startstäder med <3 nåbara mål: ${stuckStarts.join(', ')}`);

// Test 5: Alla 67 städer har giltiga öppettider på signaturaktiviteter och bibliotek
let brokenSigs = 0;
let missingLibs = 0;
cityKeys.forEach(k => {
  const sig = W.cities[k].signature;
  if (sig && (typeof sig.openFrom !== 'number' || typeof sig.openUntil !== 'number')) {
    brokenSigs++;
  }
  if (!sandbox.window.GT_COUNTRY_FACTS[k]) {
    missingLibs++;
  }
});
assert(brokenSigs === 0, `Hittade ${brokenSigs} städer med trasiga öppettider på signaturaktivitet!`);
assert(missingLibs === 0, `Hittade ${missingLibs} städer utan bibliotek i GT_COUNTRY_FACTS!`);

// Test 6: Prutning med 3 nivåer fungerar och ger straffpris på misslyckat skambud
const boldLose = ECON.resolveHaggle(500, 'bold', false, () => 0.99);
assert(boldLose.outcome === 'angry' && boldLose.price > 500, `Skambud som misslyckas borde höja priset, fick ${JSON.stringify(boldLose)}`);
const politeWin = ECON.resolveHaggle(500, 'polite', false, () => 0.1);
assert(politeWin.outcome === 'won' && politeWin.price === 450, `Artigt bud (-10 %) på 500 kr borde ge 450 kr, fick ${JSON.stringify(politeWin)}`);

// Test 7: Kamerabonus i GT_BALANCE matchar butikstexten
const cam = BAL.GEAR_SHOP_ITEMS.find(g => g.id === 'kamera');
assert(cam && cam.effect.includes(`+${Math.round(BAL.CAMERA_JOB_BONUS * 100)} %`), 'Kamerans effekttext matchar inte CAMERA_JOB_BONUS!');

// Test 8: Minst 25 resehändelser fördelade över flyg, tåg och båt
const te = W.travelEvents || {};
const totalEvents = (te.flight || []).length + (te.train || []).length + (te.boat || []).length;
assert((te.flight || []).length >= 8, `För få flyghändelser: ${(te.flight || []).length}`);
assert((te.train || []).length >= 6, `För få tåghändelser: ${(te.train || []).length}`);
assert((te.boat || []).length >= 6, `För få båthändelser: ${(te.boat || []).length}`);
assert(totalEvents >= 25, `Totalt antal resehändelser bör vara >= 25, fick ${totalEvents}`);
console.log(`Resehändelser: ${totalEvents} st (${(te.flight || []).length} flyg, ${(te.train || []).length} tåg, ${(te.boat || []).length} båt).`);

// Test 9: Regional lokalkännedom och reseflyt ger rätt bonusnivåer
const kb0 = ECON.getKnowledgeBonuses(0, 0);
const kb1 = ECON.getKnowledgeBonuses(36, 2);
const kb2 = ECON.getKnowledgeBonuses(64, 4);
assert(kb0.tier === 0 && kb0.totalJobBonus === 0 && kb0.ticketDiscount === 0, 'Tier 0 fel');
assert(kb1.tier === 1 && Math.abs(kb1.totalJobBonus - 0.15) < 0.001 && kb1.haggleBonus > 0, 'Tier 1 fel');
assert(kb2.tier === 2 && Math.abs(kb2.totalJobBonus - 0.40) < 0.001 && kb2.ticketDiscount === 0.10, 'Tier 2 + Reseflyt fel');

// Test 10: Spelarsimulering av ekonomin med spelarens regler och fast slumpfrö (deterministisk).
// Simuleringen följer reglerna i game.js så nära som möjligt:
// - passmål lottas som i spelet: en souvenirstad per världsdel bland städer nåbara tur och retur
// - dagens avgångstavla visar högst 5 slumpade avgångar; finns ingen som leder närmare målet får man jobba eller vänta
// - jobbpass: riktiga timmar och löner, 6 frågor, lön efter andel rätt, yrkeskompetens vid minst 4 rätt i ett nytt yrke
// - varje jobb kan bara tas en gång per stad och dag
// - lokalkännedom ökar med KNOWLEDGE_GAIN_PER_CORRECT per rätt svar
// - minst 3 världsdelar krävs
// - nödlån hemifrån (CALL_HOME_*) när kassan är låg
// Sevärdheter, handel med vinst, resehändelser och prutning ingår inte.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// jobsOncePerJourney: designförslaget i DESIGN.md §5.4, där varje jobb bara kan tas en gång per resa.
function simulateJourneys({ runs, accuracy, seed, dayLimit = 30, home = 'malmo', jobsOncePerJourney = false, startCash = BAL.START_CASH }) {
  const rng = mulberry32(seed);
  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const reach = ROUTES.getRoundTripReachableCities(W, home);
  const edgesCache = {};
  const edgesOf = k => (edgesCache[k] = edgesCache[k] || ROUTES.getAllOutgoingEdges(W, k));
  const allKeys = Object.keys(W.cities);
  const distCache = {};
  // Antal byten från varje stad till målet (BFS bakåt från målet)
  const hops = goal => {
    if (distCache[goal]) return distCache[goal];
    const dist = { [goal]: 0 };
    const q = [goal];
    while (q.length) {
      const cur = q.shift();
      for (const k of allKeys) {
        if (dist[k] === undefined && edgesOf(k).includes(cur)) { dist[k] = dist[cur] + 1; q.push(k); }
      }
    }
    return (distCache[goal] = dist);
  };

  let wins = 0;
  let daysUsedTotal = 0;
  const failReasons = { tid: 0, pank: 0, fast: 0 };
  let loansTotal = 0;

  for (let run = 0; run < runs; run++) {
    // Passmål som i generateJourneyGoals
    const byRegion = {};
    reach.filter(k => (W.cities[k].souvenirs || []).length > 0).forEach(k => {
      const r = ROUTES.normRegion(W.cities[k].region);
      (byRegion[r] = byRegion[r] || []).push(k);
    });
    const targets = shuffle(Object.keys(byRegion)).slice(0, 3)
      .map(r => byRegion[r][Math.floor(rng() * byRegion[r].length)]);

    let cash = startCash;
    let day = 1;
    let hour = BAL.DAY_START_HOUR;
    let cur = home;
    let knowledge = 0;
    const collected = new Set();
    const comps = new Set();
    const regions = new Set([ROUTES.normRegion(W.cities[home].region)]);
    let jobsTaken = new Set();
    const jobsDoneJourney = new Set(); // "stad_index" när jobbet bara får tas en gång per resa
    let loans = 0;
    let board = null;
    let won = false;
    let guard = 0;

    const sleep = () => {
      const price = W.cities[cur].hotel?.price || 400;
      if (cash >= price) { cash -= price; hour = BAL.DAY_START_HOUR; } else { hour = BAL.BROKE_SLEEP_WAKE_HOUR; }
      day++;
      jobsTaken = new Set();
      board = null;
    };

    while (day <= dayLimit && guard++ < 2000) {
      if (hour >= BAL.DAY_END_HOUR) { sleep(); continue; }
      if (!board) board = shuffle(edgesOf(cur)).slice(0, 5);

      // Nödlån hemifrån som i spelet (hotelltelefonen)
      if (cash < BAL.CALL_HOME_THRESHOLD && loans < BAL.CALL_HOME_MAX) { cash += BAL.CALL_HOME_AMOUNT; loans++; }

      if (targets.includes(cur) && !collected.has(cur)) {
        const sk = (W.cities[cur].souvenirs || [])[0];
        const sp = sk ? ECON.getSouvenirBasePrice(W.souvenirs[sk]) : 300;
        if (cash >= sp) { cash -= sp; collected.add(cur); }
      }

      const allGoalsDone = collected.size === targets.length && comps.size >= 3 && regions.size >= 3;
      if (allGoalsDone && cur === home) { won = true; break; }
      const goal = (collected.size === targets.length) ? home : targets.find(t => !collected.has(t));

      // Dagens bästa avgång: en som leder närmare målet
      const d = hops(goal);
      const myDist = d[cur] ?? Infinity;
      const hop = board.find(k => (d[k] ?? Infinity) < myDist) || null;
      const km = hop ? ROUTES.getDistanceBetweenCities(W, cur, hop) : 0;
      const kb = ECON.getKnowledgeBonuses(knowledge, 0);
      const price = hop ? Math.round((BAL.FLIGHT_BASE_PRICE + km * BAL.FLIGHT_PRICE_PER_KM) * (1 - kb.ticketDiscount)) : 0;
      const travelHours = hop ? Math.max(2, Math.round(1 + km / 800)) : 0;

      // Jobba om det behövs pengar eller yrken och det finns ett ledigt jobb som hinns med idag
      // Med en chans per jobb tar spelaren alla lediga jobb i staden innan resan fortsätter
      const needWork = jobsOncePerJourney || comps.size < 3 || (hop && cash < price + 200) || (!hop && cash < 1500);
      const jobs = W.cities[cur].jobs || [];
      const jobIdx = jobs.findIndex((j, i) => !jobsTaken.has(i) && !jobsDoneJourney.has(`${cur}_${i}`) && hour + (j.hours || 4) <= BAL.DAY_END_HOUR);
      if (needWork && jobIdx >= 0) {
        const job = jobs[jobIdx];
        jobsTaken.add(jobIdx);
        if (jobsOncePerJourney) jobsDoneJourney.add(`${cur}_${jobIdx}`);
        let correct = 0;
        for (let i = 0; i < 6; i++) if (rng() < accuracy) correct++;
        cash += Math.round((job.pay || 800) * (correct / 6) * (1 + kb.totalJobBonus));
        knowledge = Math.min(100, knowledge + correct * BAL.KNOWLEDGE_GAIN_PER_CORRECT);
        if (correct >= 4) comps.add(job.isSignature ? `${cur}_sig` : (job.role || job.title));
        hour += job.hours || 4;
        continue;
      }

      // Pank och utan jobb kvar: ta billigaste avgången på tavlan till en stad som har lediga jobb (en riktig spelare gör så)
      if (jobsOncePerJourney && jobIdx < 0 && (!hop || cash < price)) {
        const workCity = board
          .filter(k => (W.cities[k].jobs || []).some((j, i) => !jobsDoneJourney.has(`${k}_${i}`)))
          .map(k => ({ k, p: Math.round(BAL.FLIGHT_BASE_PRICE + ROUTES.getDistanceBetweenCities(W, cur, k) * BAL.FLIGHT_PRICE_PER_KM) }))
          .filter(o => o.p <= cash)
          .sort((a, b) => a.p - b.p)[0];
        if (workCity) {
          cash -= workCity.p;
          hour += 2;
          cur = workCity.k;
          board = null;
          jobsTaken = new Set();
          regions.add(ROUTES.normRegion(W.cities[cur].region));
          continue;
        }
      }

      if (hop && cash >= price) {
        cash -= price;
        hour += travelHours;
        cur = hop;
        board = null;
        jobsTaken = new Set();
        regions.add(ROUTES.normRegion(W.cities[cur].region));
        continue;
      }
      sleep();
    }
    loansTotal += loans;
    const cheapest = Math.min(...edgesOf(cur).map(k => BAL.FLIGHT_BASE_PRICE + ROUTES.getDistanceBetweenCities(W, cur, k) * BAL.FLIGHT_PRICE_PER_KM));
    const jobsLeftHere = (W.cities[cur].jobs || []).some((j, i) => !jobsDoneJourney.has(`${cur}_${i}`));
    if (won) { wins++; daysUsedTotal += day; }
    else if (cash < cheapest && !jobsLeftHere) failReasons.pank++;
    else if (day > dayLimit) failReasons.tid++;
    else failReasons.fast++;
  }
  return { wins, runs, avgDays: wins ? Math.round(daysUsedTotal / wins * 10) / 10 : null, failReasons, avgLoans: Math.round(loansTotal / runs * 10) / 10 };
}

const simLevels = [0.6, 0.75, 0.9].map(acc => Object.assign({ acc }, simulateJourneys({ runs: 200, accuracy: acc, seed: 20261124 })));
const printSim = (label, r) => console.log(`${label} (startkassa ${BAL.START_CASH} kr, ${Math.round(r.acc * 100)} % rätt): ${r.wins}/${r.runs} klarade inom 30 dagar` +
  (r.avgDays ? `, snitt ${r.avgDays} dagar` : '') + `, ${r.avgLoans} nödlån/resa (tiden tog slut: ${r.failReasons.tid}, pank: ${r.failReasons.pank}, fastnade: ${r.failReasons.fast}).`);
simLevels.forEach(r => printSim('Ekonomisimulering', r));
// Designförslaget (DESIGN.md §5.4): varje jobb bara en gång per resa. Bara information, inget krav ännu.
[0.6, 0.75, 0.9].forEach(acc => printSim('Förslag: en chans per jobb', Object.assign({ acc }, simulateJourneys({ runs: 200, accuracy: acc, seed: 20261124, jobsOncePerJourney: true }))));
const sim75 = simLevels.find(r => r.acc === 0.75);
const sim90 = simLevels.find(r => r.acc === 0.9);
assert(sim75.wins / sim75.runs >= 0.85, `En spelare med 75 % rätt klarade för få resor: ${sim75.wins}/${sim75.runs}`);
assert(sim90.wins >= sim75.wins, 'Fler rätt svar borde inte ge färre klarade resor');

// Test 11: Svaret på en sevärdhetsfråga får inte stå ordagrant i sevärdhetens faktatext (DESIGN.md §5.2)
const leaks = [];
(sandbox.window.GT_QUESTIONS || []).forEach(q => {
  const place = W.places[q.place];
  const type = q.type || q.t;
  if (!place || !place.fact || !Array.isArray(q.a) || !['mc', 'image'].includes(type)) return;
  const ans = String(q.a[0]).toLowerCase().trim();
  if (ans.length >= 4 && place.fact.toLowerCase().includes(ans)) leaks.push(`${place.name} → ${q.a[0]}`);
});
assert(leaks.length === 0, `Svaret står i faktatexten för ${leaks.length} frågor: ${leaks.join(', ')}`);

if (failures > 0) {
  console.error(`\n${failures} test(er) misslyckades.`);
  process.exit(1);
} else {
  console.log('\nALLA REGELTESTER GICK IGENOM!');
}
