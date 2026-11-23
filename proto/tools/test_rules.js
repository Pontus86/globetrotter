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

// Test 10: Spelarsimulering av ekonomin (100 resor med 16-timmarsdag, spelarens riktiga flygpriser, startkassa & lokalkännedom)
let simWins = 0;
let simWorked = 0;
for (let run = 0; run < 100; run++) {
  let cash = BAL.START_CASH;
  let day = 1;
  let hour = 8;
  let cur = 'malmo';
  const reach = ROUTES.getRoundTripReachableCities(W, cur);
  const targets = reach.slice().sort(() => Math.random() - 0.5).slice(0, 3);
  const collected = new Set();
  let comps = 0;
  let knowledge = 0;
  let didWork = false;

  const sleepNight = () => {
    const hPrice = W.cities[cur].hotel?.price || 400;
    if (cash >= hPrice) { cash -= hPrice; hour = 8; }
    else { hour = BAL.BROKE_SLEEP_WAKE_HOUR || 11; }
    day += 1;
  };

  const nextHop = (from, to) => {
    if (from === to) return null;
    const q = [[from]];
    const seen = new Set([from]);
    while (q.length) {
      const pathArr = q.shift();
      const last = pathArr[pathArr.length - 1];
      for (const nxt of ROUTES.getAllOutgoingEdges(W, last)) {
        if (nxt === to) return pathArr[1] || nxt;
        if (!seen.has(nxt)) { seen.add(nxt); q.push([...pathArr, nxt]); }
      }
    }
    return null;
  };

  let guard = 0;
  while (day <= 30 && guard++ < 300) {
    if (hour >= 24) { sleepNight(); continue; }

    // Köp målsouvenir om vi är i rätt stad
    if (targets.includes(cur) && !collected.has(cur)) {
      const sk = (W.cities[cur].souvenirs || [])[0];
      const sp = sk ? ECON.getSouvenirBasePrice(W.souvenirs[sk]) : 300;
      if (cash >= sp) { cash -= sp; collected.add(cur); }
    }

    const nextGoal = targets.find(t => !collected.has(t)) || 'malmo';
    if (nextGoal === 'malmo' && cur === 'malmo' && collected.size === 3 && comps >= 3) {
      simWins++;
      if (didWork) simWorked++;
      break;
    }

    const hop = nextHop(cur, nextGoal);
    if (!hop) break;
    const dist = ROUTES.getDistanceBetweenCities(W, cur, hop);
    const kb = ECON.getKnowledgeBonuses(knowledge, 3);
    const flightHours = Math.max(2, Math.round(1 + dist / 800));
    const price = Math.round((BAL.FLIGHT_BASE_PRICE + dist * BAL.FLIGHT_PRICE_PER_KM) * (1 - kb.ticketDiscount));

    // Jobba om vi saknar pengar till biljetten ELLER saknar 3 yrkeskompetenser
    if (cash < price + 200 || comps < 3) {
      const basePay = (W.cities[cur].jobs && W.cities[cur].jobs[0] && W.cities[cur].jobs[0].pay) || 850;
      cash += Math.round(basePay * 0.80 * (1 + kb.totalJobBonus));
      knowledge = Math.min(100, knowledge + 36);
      if (comps < 3) comps++;
      didWork = true;
      hour += 4;
      continue;
    }

    cash -= price;
    cur = hop;
    hour += flightHours;
  }
}
console.log(`Ekonomisimulering (100 resor från Malmö, startkassa ${BAL.START_CASH} kr): ${simWins}/100 klarade inom 30 dagar (${simWorked} behövde jobba).`);
assert(simWins >= 75, `För få resor gick att klara i ekonomisimuleringen: ${simWins}/100`);

if (failures > 0) {
  console.error(`\n${failures} test(er) misslyckades.`);
  process.exit(1);
} else {
  console.log('\nALLA REGELTESTER GICK IGENOM!');
}
