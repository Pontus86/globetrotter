// Globetrotter - AI-Botmotor (upp till 6 medresenärer med svårighetsgrad, personlighet & rivalitet)

(function () {
  'use strict';

  const BOT_PROFILES = [
    { id: 'bot_astrid', name: 'Astrid', fullName: 'Astrid Lind', color: '#ff6b6b', style: 'Stämpeljägare', styleKey: 'stamps' },
    { id: 'bot_kenji',  name: 'Kenji',  fullName: 'Kenji Sato',  color: '#4ecdc4', style: 'Karriärist',     styleKey: 'jobs' },
    { id: 'bot_fatima', name: 'Fatima', fullName: 'Fatima Mansoor', color: '#f9c74f', style: 'Souvenirsamlare', styleKey: 'souvenirs' },
    { id: 'bot_marco',  name: 'Marco',  fullName: 'Marco Rossi', color: '#a78bfa', style: 'Världsarvsforskare', styleKey: 'wonders' },
    { id: 'bot_elena',  name: 'Elena',  fullName: 'Elena Novak', color: '#fb923c', style: 'Globetrotter',   styleKey: 'balanced' },
    { id: 'bot_kalle',  name: 'Kalle',  fullName: 'Kalle Ström', color: '#60a5fa', style: 'Budgetresenär',  styleKey: 'budget' }
  ];

  const DIFFICULTY_PROFILES = {
    easy:   { key: 'easy',   label: 'Turist',         accuracy: 0.56, actionsPerDay: 1.0,  smartRouting: 0.35 },
    medium: { key: 'medium', label: 'Globetrotter',   accuracy: 0.72, actionsPerDay: 1.45, smartRouting: 0.72 },
    hard:   { key: 'hard',   label: 'Mästerresenär',  accuracy: 0.88, actionsPerDay: 1.95, smartRouting: 0.94 }
  };

  function distKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function pickRandomSouvenirCities(world, startCity) {
    const keys = Object.keys(world.cities || {}).filter(k => k !== startCity && (world.cities[k].souvenirs || []).length > 0);
    const shuffled = keys.slice().sort(() => Math.random() - 0.5);
    const chosen = [];
    const usedRegions = new Set();
    for (const k of shuffled) {
      if (chosen.length >= 3) break;
      const reg = world.cities[k].region;
      if (!usedRegions.has(reg) || shuffled.length < 6) {
        chosen.push(k);
        usedRegions.add(reg);
      }
    }
    return chosen;
  }

  function createBots(count, difficultyMode, startCity, world) {
    const n = Math.max(0, Math.min(6, Number(count) || 0));
    if (n === 0 || !world || !world.cities) return [];

    const mixedOrder = ['hard', 'medium', 'easy', 'hard', 'medium', 'easy'];
    const profiles = BOT_PROFILES.slice(0, n);

    return profiles.map((p, idx) => {
      const diffKey = difficultyMode === 'mixed'
        ? mixedOrder[idx % mixedOrder.length]
        : (DIFFICULTY_PROFILES[difficultyMode] ? difficultyMode : 'medium');
      const diff = DIFFICULTY_PROFILES[diffKey];
      const homeReg = world.cities[startCity]?.region || 'Europa';
      return {
        id: p.id,
        name: p.name,
        fullName: p.fullName,
        color: p.color,
        style: p.style,
        styleKey: p.styleKey,
        difficulty: diff.key,
        difficultyLabel: diff.label,
        homeCity: startCity,
        city: startCity,
        cash: world.startCash || 10000,
        day: 1,
        actionBudget: 0,
        stamps: [],
        cityProgress: {},
        competencies: [],
        visitedCities: [startCity],
        visitedRegions: [homeReg],
        doneWonders: [],
        goalSouvenirs: pickRandomSouvenirCities(world, startCity),
        collectedSouvenirs: [],
        requiredRegions: 4,
        requiredCompetencies: 4,
        travelHistory: [],
        finished: false,
        finishedDay: null
      };
    });
  }

  function hasMetAllGoals(bot) {
    const regOk = (bot.visitedRegions || []).length >= (bot.requiredRegions || 4);
    const compOk = (bot.competencies || []).length >= (bot.requiredCompetencies || 4);
    const souvOk = (bot.goalSouvenirs || []).every(ck => (bot.collectedSouvenirs || []).includes(ck));
    return regOk && compOk && souvOk;
  }

  function computeScore(entry) {
    const stamps = Array.isArray(entry.stamps) ? entry.stamps.length : (entry.stamps || 0);
    const comps = Array.isArray(entry.competencies) ? entry.competencies.length : (entry.competencies || 0);
    const regs = Array.isArray(entry.visitedRegions) ? entry.visitedRegions.length : (entry.regions || 1);
    const souvs = Array.isArray(entry.collectedSouvenirs) ? entry.collectedSouvenirs.length : (entry.goalSouvenirsDone || 0);
    const wonders = Array.isArray(entry.doneWonders) ? entry.doneWonders.length : (entry.wonders || 0);
    const cash = Math.max(0, Number(entry.cash) || 0);
    const finishedBonus = entry.finished ? 600 : 0;
    return stamps * 120 + comps * 180 + regs * 150 + souvs * 160 + wonders * 140 + Math.floor(cash / 250) + finishedBonus;
  }

  function pushNews(newsLog, day, text) {
    if (!Array.isArray(newsLog)) return;
    newsLog.push({ day, text });
    if (newsLog.length > 24) newsLog.shift();
  }

  function chooseNextCity(bot, diff, world) {
    const allKeys = Object.keys(world.cities || {}).filter(k => k !== bot.city);
    if (allKeys.length === 0) return null;

    // Alla mål klara? Flyg hem till startstaden!
    if (hasMetAllGoals(bot)) {
      return bot.homeCity !== bot.city ? bot.homeCity : null;
    }

    const cur = world.cities[bot.city];
    const smart = Math.random() < diff.smartRouting;

    if (smart) {
      // 1. Prioritera stad med saknad målsouvenir
      const missingSouv = (bot.goalSouvenirs || []).filter(ck => !(bot.collectedSouvenirs || []).includes(ck) && ck !== bot.city);
      if (missingSouv.length > 0 && (bot.styleKey === 'souvenirs' || Math.random() < 0.65)) {
        missingSouv.sort((a, b) => {
          const ca = world.cities[a], cb = world.cities[b];
          return distKm(cur.lat, cur.lon, ca.lat, ca.lon) - distKm(cur.lat, cur.lon, cb.lat, cb.lon);
        });
        return missingSouv[0];
      }

      // 2. Prioritera obesökt världsdel om boten fortfarande behöver fler världsdelar
      if ((bot.visitedRegions || []).length < (bot.requiredRegions || 4)) {
        const newRegCities = allKeys.filter(k => !bot.visitedRegions.includes(world.cities[k].region));
        if (newRegCities.length > 0) {
          return newRegCities[Math.floor(Math.random() * newRegCities.length)];
        }
      }

      // 3. Obesökt stad relativt nära (smarta rutter)
      const unvisited = allKeys.filter(k => !(bot.visitedCities || []).includes(k));
      const pool = unvisited.length > 0 ? unvisited : allKeys;
      pool.sort((a, b) => {
        const ca = world.cities[a], cb = world.cities[b];
        return distKm(cur.lat, cur.lon, ca.lat, ca.lon) - distKm(cur.lat, cur.lon, cb.lat, cb.lon);
      });
      const topSlice = pool.slice(0, Math.min(8, pool.length));
      return topSlice[Math.floor(Math.random() * topSlice.length)];
    }

    // Mindre optimal (Turist): slumpmässig stad
    return allKeys[Math.floor(Math.random() * allKeys.length)];
  }

  function simulateOneAction(bot, diff, world, currentDay, newsLog, jobRecords) {
    const city = world.cities[bot.city];
    if (!city) return;

    // 0. Klar med resan?
    if (hasMetAllGoals(bot) && bot.city === bot.homeCity && (bot.travelHistory || []).length > 0) {
      bot.finished = true;
      bot.finishedDay = currentDay;
      pushNews(newsLog, currentDay, `${bot.fullName} (${bot.difficultyLabel}) landade hemma i ${city.name} och gick i mål!`);
      return;
    }

    // 1. Behöver pengar eller yrkeskompetens? Ta ett jobb!
    const needMoney = bot.cash < 1350;
    const needComp = bot.competencies.length < bot.requiredCompetencies &&
      !bot.competencies.includes(bot.city) &&
      (bot.styleKey === 'jobs' ? Math.random() < 0.6 : Math.random() < 0.36);

    if (needMoney || needComp) {
      let score = 0;
      for (let i = 0; i < 6; i++) {
        if (Math.random() < diff.accuracy) score++;
      }
      const basePay = (city.jobs && city.jobs[0] && city.jobs[0].pay) || (city.job && city.job.pay) || 1400;
      const earned = Math.round((score / 6) * basePay);
      bot.cash += earned;

      if (score >= 4 && !bot.competencies.includes(bot.city)) {
        bot.competencies.push(bot.city);
        pushNews(newsLog, currentDay, `${bot.name} tog yrkeskompetens i ${city.name} (${score}/6 rätt).`);
      }

      // Sätt bot-jobbrekord i staden om det är starkt (minst 4/6)
      if (jobRecords && score >= 4) {
        const recKey = `${bot.city}_0`;
        const prev = jobRecords[recKey];
        if (!prev || score > prev.score) {
          jobRecords[recKey] = {
            holder: bot.name,
            isBot: true,
            botId: bot.id,
            score,
            max: 6,
            city: city.name
          };
        }
      }
      return;
    }

    // 2. Köp saknad målsouvenir om boten är i rätt stad!
    if ((bot.goalSouvenirs || []).includes(bot.city) && !(bot.collectedSouvenirs || []).includes(bot.city)) {
      const souv = (city.souvenirs && city.souvenirs[0]) || { name: 'Souvenir', price: 450 };
      const price = souv.price || 450;
      if (bot.cash >= price + 300) {
        bot.cash -= price;
        bot.collectedSouvenirs.push(bot.city);
        pushNews(newsLog, currentDay, `${bot.name} fyndade målsouveniren ${souv.name} i ${city.name}!`);
        return;
      }
    }

    // 3. Besök närliggande världsarv ibland (särskilt Marco / Mästerresenär)
    if (world.wonders && (bot.styleKey === 'wonders' ? Math.random() < 0.35 : Math.random() < 0.14)) {
      const nearbyW = Object.keys(world.wonders).find(wk => {
        const w = world.wonders[wk];
        return w && w.nearestCity === bot.city && !bot.doneWonders.includes(wk);
      });
      if (nearbyW && bot.cash >= 600) {
        bot.cash -= 350;
        if (Math.random() < diff.accuracy + 0.08) {
          bot.doneWonders.push(nearbyW);
          pushNews(newsLog, currentDay, `${bot.name} utforskade världsarvet ${world.wonders[nearbyW].name}!`);
        }
        return;
      }
    }

    // 4. Samla stadsstämpel (sevärdheter)
    const alreadyStamped = bot.stamps.includes(bot.city);
    const wantsStamp = !alreadyStamped && (bot.styleKey === 'stamps' ? Math.random() < 0.78 : Math.random() < 0.55);
    if (wantsStamp) {
      const prog = (bot.cityProgress[bot.city] || 0) + (Math.random() < diff.accuracy + 0.12 ? 2 : 1);
      bot.cityProgress[bot.city] = prog;
      if (prog >= 3) {
        bot.stamps.push(bot.city);
        pushNews(newsLog, currentDay, `${bot.name} säkrade ny pass-stämpel i ${city.name} (${bot.stamps.length} st).`);
      }
      return;
    }

    // 5. Res vidare till nästa stad!
    const nextKey = chooseNextCity(bot, diff, world);
    if (!nextKey || !world.cities[nextKey]) return;
    const nextCity = world.cities[nextKey];
    const km = distKm(city.lat, city.lon, nextCity.lat, nextCity.lon);
    const ticketCost = Math.min(2400, Math.max(380, Math.round(km * (bot.styleKey === 'budget' ? 0.19 : 0.24))));

    if (bot.cash < ticketCost + 250) {
      // För lite pengar för resan -> ta ett snabbjobb nästa drag
      bot.cash += 500;
      return;
    }

    bot.cash -= ticketCost;
    bot.travelHistory.push({ from: bot.city, to: nextKey, dist: km, day: currentDay });
    if (bot.travelHistory.length > 16) bot.travelHistory.shift();
    bot.city = nextKey;
    if (!bot.visitedCities.includes(nextKey)) bot.visitedCities.push(nextKey);
    if (nextCity.region && !bot.visitedRegions.includes(nextCity.region)) {
      bot.visitedRegions.push(nextCity.region);
      pushNews(newsLog, currentDay, `${bot.name} nådde en ny världsdel (${nextCity.region}) via ${nextCity.name}!`);
    }
  }

  function advanceBotsToDay(bots, targetDay, world, newsLog, jobRecords) {
    if (!Array.isArray(bots) || bots.length === 0 || !world) return;
    bots.forEach(bot => {
      if (bot.finished) return;
      const diff = DIFFICULTY_PROFILES[bot.difficulty] || DIFFICULTY_PROFILES.medium;
      const startD = Math.max(1, bot.day || 1);
      for (let d = startD + 1; d <= targetDay; d++) {
        if (bot.finished) break;
        bot.day = d;
        // Liten daglig hotellkostnad så bottarna lever under samma ekonomi
        bot.cash = Math.max(0, bot.cash - 180);
        bot.actionBudget = (bot.actionBudget || 0) + diff.actionsPerDay;
        let safety = 0;
        while (bot.actionBudget >= 1 && !bot.finished && safety < 4) {
          bot.actionBudget -= 1;
          simulateOneAction(bot, diff, world, d, newsLog, jobRecords);
          safety++;
        }
      }
    });
  }

  function getStandings(playerEntry, bots) {
    const list = [];
    if (playerEntry) {
      list.push({
        id: 'player',
        isPlayer: true,
        name: playerEntry.name || 'Du',
        color: '#ffd875',
        difficultyLabel: 'Du',
        style: 'Spelare',
        city: playerEntry.city,
        stamps: playerEntry.stamps || 0,
        competencies: playerEntry.competencies || 0,
        regions: playerEntry.regions || 1,
        goalSouvenirsDone: playerEntry.goalSouvenirsDone || 0,
        wonders: playerEntry.wonders || 0,
        cash: playerEntry.cash || 0,
        finished: Boolean(playerEntry.finished),
        score: computeScore(playerEntry)
      });
    }
    (bots || []).forEach(b => {
      list.push({
        id: b.id,
        isPlayer: false,
        name: b.name,
        fullName: b.fullName,
        color: b.color,
        difficulty: b.difficulty,
        difficultyLabel: b.difficultyLabel,
        style: b.style,
        city: b.city,
        stamps: (b.stamps || []).length,
        competencies: (b.competencies || []).length,
        regions: (b.visitedRegions || []).length,
        goalSouvenirsDone: (b.collectedSouvenirs || []).length,
        wonders: (b.doneWonders || []).length,
        cash: b.cash || 0,
        finished: Boolean(b.finished),
        score: computeScore(b)
      });
    });
    list.sort((a, b) => (b.finished - a.finished) || (b.score - a.score));
    list.forEach((row, i) => { row.rank = i + 1; });
    return list;
  }

  function getBotsInCity(bots, cityKey) {
    if (!Array.isArray(bots)) return [];
    return bots.filter(b => b.city === cityKey && !b.finished);
  }

  window.GT_BOTS = {
    BOT_PROFILES,
    DIFFICULTY_PROFILES,
    createBots,
    advanceBotsToDay,
    computeScore,
    getStandings,
    getBotsInCity
  };
})();
