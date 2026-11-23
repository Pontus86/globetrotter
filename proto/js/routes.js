// Globetrotter — Geografi, regionnormalisering, ruttnätverk & nåbarhetskontroll

(function () {
  'use strict';

  const CITY_AIRLINE_PREFIX = {
    malmo: 'SK', stockholm: 'SK', london: 'BA', paris: 'AF', rom: 'AZ', istanbul: 'TK',
    kairo: 'MS', kapstaden: 'SA', delhi: 'AI', bangkok: 'TG', peking: 'CA',
    tokyo: 'JL', sydney: 'QF', sanfrancisco: 'UA', newyork: 'AA',
    mexicocity: 'AM', rio: 'RG'
  };

  const CITY_ROUTES = {
    malmo: [
      { to: 'kopenhamn', chance: 92 }, { to: 'stockholm', chance: 90 }, { to: 'london', chance: 90 },
      { to: 'paris', chance: 86 }, { to: 'rom', chance: 78 }, { to: 'istanbul', chance: 72 },
      { to: 'kairo', chance: 62 }, { to: 'newyork', chance: 55, standby: true }
    ],
    stockholm: [
      { to: 'malmo', chance: 90 }, { to: 'oslo', chance: 88 }, { to: 'helsingfors', chance: 86 },
      { to: 'london', chance: 90 }, { to: 'paris', chance: 85 }, { to: 'rom', chance: 75 },
      { to: 'istanbul', chance: 70 }, { to: 'newyork', chance: 62 }, { to: 'kairo', chance: 58 },
      { to: 'peking', chance: 45, standby: true }
    ],
    london: [
      { to: 'malmo', chance: 85 }, { to: 'stockholm', chance: 85 }, { to: 'paris', chance: 95 },
      { to: 'dublin', chance: 90 }, { to: 'reykjavik', chance: 78 }, { to: 'amsterdam', chance: 88 }, { to: 'rom', chance: 80 },
      { to: 'newyork', chance: 88 }, { to: 'kairo', chance: 65 }, { to: 'kapstaden', chance: 60 },
      { to: 'delhi', chance: 55, standby: true }
    ],
    paris: [
      { to: 'malmo', chance: 82 }, { to: 'london', chance: 95 }, { to: 'rom', chance: 90 },
      { to: 'madrid', chance: 86 }, { to: 'zurich', chance: 84 }, { to: 'stockholm', chance: 78 },
      { to: 'istanbul', chance: 75 }, { to: 'newyork', chance: 78 }, { to: 'kairo', chance: 68 },
      { to: 'rio', chance: 55, standby: true }
    ],
    rom: [
      { to: 'malmo', chance: 74 }, { to: 'paris', chance: 90 }, { to: 'london', chance: 80 },
      { to: 'aten', chance: 88 }, { to: 'wien', chance: 82 }, { to: 'istanbul', chance: 88 },
      { to: 'kairo', chance: 85 }, { to: 'stockholm', chance: 70 }, { to: 'kapstaden', chance: 55, standby: true }
    ],
    istanbul: [
      { to: 'rom', chance: 88 }, { to: 'aten', chance: 90 }, { to: 'kairo', chance: 92 },
      { to: 'dubai', chance: 84 }, { to: 'paris', chance: 75 }, { to: 'delhi', chance: 82 },
      { to: 'stockholm', chance: 65 }, { to: 'bangkok', chance: 58 }, { to: 'peking', chance: 55, standby: true }
    ],
    kairo: [
      { to: 'istanbul', chance: 92 }, { to: 'rom', chance: 85 }, { to: 'jerusalem', chance: 86 },
      { to: 'nairobi', chance: 80 }, { to: 'tunis', chance: 82 }, { to: 'delhi', chance: 82 },
      { to: 'kapstaden', chance: 80 }, { to: 'paris', chance: 70 }, { to: 'london', chance: 65 },
      { to: 'bangkok', chance: 52, standby: true }
    ],
    kapstaden: [
      { to: 'kairo', chance: 82 }, { to: 'nairobi', chance: 84 }, { to: 'antananarivo', chance: 76 },
      { to: 'london', chance: 78 }, { to: 'rio', chance: 82 }, { to: 'rom', chance: 62 },
      { to: 'sydney', chance: 60, standby: true }, { to: 'delhi', chance: 55 }
    ],
    delhi: [
      { to: 'mumbai', chance: 92 }, { to: 'katmandu', chance: 88 }, { to: 'colombo', chance: 84 },
      { to: 'bangkok', chance: 92 }, { to: 'istanbul', chance: 82 }, { to: 'kairo', chance: 80 },
      { to: 'peking', chance: 80 }, { to: 'london', chance: 65 }, { to: 'tokyo', chance: 62 },
      { to: 'sydney', chance: 55, standby: true }
    ],
    bangkok: [
      { to: 'singapore', chance: 92 }, { to: 'hanoi', chance: 90 }, { to: 'delhi', chance: 92 },
      { to: 'peking', chance: 86 }, { to: 'tokyo', chance: 86 }, { to: 'sydney', chance: 85 },
      { to: 'istanbul', chance: 60 }, { to: 'kairo', chance: 55, standby: true }
    ],
    peking: [
      { to: 'seoul', chance: 92 }, { to: 'hongkong', chance: 90 }, { to: 'tokyo', chance: 95 },
      { to: 'bangkok', chance: 86 }, { to: 'delhi', chance: 80 }, { to: 'sanfrancisco', chance: 72 },
      { to: 'sydney', chance: 65 }, { to: 'istanbul', chance: 60 }, { to: 'stockholm', chance: 55, standby: true }
    ],
    tokyo: [
      { to: 'kyoto', chance: 92 }, { to: 'seoul', chance: 92 }, { to: 'peking', chance: 95 },
      { to: 'bangkok', chance: 86 }, { to: 'sydney', chance: 86 }, { to: 'sanfrancisco', chance: 86 },
      { to: 'delhi', chance: 65 }, { to: 'newyork', chance: 58, standby: true }
    ],
    sydney: [
      { to: 'melbourne', chance: 94 }, { to: 'auckland', chance: 90 }, { to: 'tokyo', chance: 86 },
      { to: 'bangkok', chance: 85 }, { to: 'sanfrancisco', chance: 76 }, { to: 'peking', chance: 65 },
      { to: 'kapstaden', chance: 60, standby: true }, { to: 'delhi', chance: 55 }
    ],
    sanfrancisco: [
      { to: 'losangeles', chance: 94 }, { to: 'vancouver', chance: 88 }, { to: 'newyork', chance: 95 },
      { to: 'mexicocity', chance: 90 }, { to: 'tokyo', chance: 86 }, { to: 'sydney', chance: 75 },
      { to: 'peking', chance: 70 }, { to: 'london', chance: 58, standby: true }
    ],
    newyork: [
      { to: 'toronto', chance: 92 }, { to: 'chicago', chance: 92 }, { to: 'miami', chance: 90 },
      { to: 'london', chance: 92 }, { to: 'sanfrancisco', chance: 95 }, { to: 'mexicocity', chance: 86 },
      { to: 'paris', chance: 80 }, { to: 'rio', chance: 80 }, { to: 'malmo', chance: 72 },
      { to: 'stockholm', chance: 68 }, { to: 'tokyo', chance: 55, standby: true }
    ],
    mexicocity: [
      { to: 'havanna', chance: 86 }, { to: 'panamacity', chance: 86 }, { to: 'sanfrancisco', chance: 90 },
      { to: 'newyork', chance: 90 }, { to: 'rio', chance: 85 }, { to: 'paris', chance: 62 },
      { to: 'london', chance: 58 }, { to: 'tokyo', chance: 50, standby: true }
    ],
    rio: [
      { to: 'buenosaires', chance: 92 }, { to: 'santiago', chance: 86 }, { to: 'lima', chance: 84 },
      { to: 'bogota', chance: 80 }, { to: 'mexicocity', chance: 85 }, { to: 'newyork', chance: 85 },
      { to: 'kapstaden', chance: 82 }, { to: 'paris', chance: 72 }, { to: 'rom', chance: 65 },
      { to: 'london', chance: 60, standby: true }
    ]
  };

  const CITY_TRAINS = {
    malmo: [
      { to: 'kopenhamn', name: 'Öresundståget över bron till Köpenhamn', hours: 1, price: 140 },
      { to: 'stockholm', name: 'X2000 Snabbtåg till Stockholm C', hours: 4, price: 360 }
    ],
    stockholm: [
      { to: 'malmo', name: 'X2000 Snabbtåg till Malmö C', hours: 4, price: 360 },
      { to: 'oslo', name: 'SJ Snabbtåg Stockholm–Oslo', hours: 5, price: 390 }
    ],
    london: [
      { to: 'paris', name: 'Eurostar genom Kanaltunneln', hours: 3, price: 480 },
      { to: 'bryssel', name: 'Eurostar till Bryssel', hours: 2, price: 440 }
    ],
    paris: [
      { to: 'london', name: 'Eurostar genom Kanaltunneln', hours: 3, price: 480 },
      { to: 'bryssel', name: 'Thalys till Bryssel', hours: 2, price: 320 },
      { to: 'zurich', name: 'TGV Lyria till Zürich', hours: 4, price: 460 },
      { to: 'rom', name: 'Alpexressen (Nattåg genom Alperna)', hours: 10, price: 590 }
    ],
    rom: [
      { to: 'paris', name: 'Alpexressen mot Paris Gare de Lyon', hours: 10, price: 590 },
      { to: 'zurich', name: 'Gotthard-expressen till Zürich', hours: 7, price: 480 },
      { to: 'istanbul', name: 'Balkan- & Orientexpressen', hours: 15, price: 690 }
    ],
    istanbul: [
      { to: 'rom', name: 'Orientexpressen västerut mot Rom', hours: 15, price: 690 }
    ],
    sanfrancisco: [
      { to: 'losangeles', name: 'Coast Starlight söderut mot Los Angeles', hours: 10, price: 460 },
      { to: 'newyork', name: 'California Zephyr (Amtrak kust-till-kust)', hours: 18, price: 880 }
    ],
    newyork: [
      { to: 'toronto', name: 'Maple Leaf Express till Toronto', hours: 11, price: 540 },
      { to: 'chicago', name: 'Lake Shore Limited till Chicago', hours: 16, price: 680 },
      { to: 'sanfrancisco', name: 'California Zephyr (Amtrak västerut)', hours: 18, price: 880 },
      { to: 'mexicocity', name: 'Pan-American Express söderut', hours: 16, price: 840 }
    ],
    mexicocity: [
      { to: 'newyork', name: 'Pan-American Express norrut', hours: 16, price: 840 }
    ],
    delhi: [
      { to: 'bangkok', name: 'Trans-Asiatiska landvägståget', hours: 16, price: 760 }
    ],
    bangkok: [
      { to: 'delhi', name: 'Trans-Asiatiska landvägståget västerut', hours: 16, price: 760 },
      { to: 'peking', name: 'Sydostasiatiska Expressen norrut', hours: 16, price: 790 }
    ],
    peking: [
      { to: 'bangkok', name: 'Sydostasiatiska Expressen söderut', hours: 16, price: 790 }
    ],
    tokyo: [
      { to: 'kyoto', name: 'Shinkansen Nozomi till Kyoto', hours: 2, price: 390 }
    ],
    sydney: [
      { to: 'melbourne', name: 'XPT Express Sydney–Melbourne', hours: 10, price: 490 }
    ]
  };

  // Konsekvent regionnormalisering så "Europa" och "europa" alltid blir samma världsdel!
  function normRegion(region) {
    const raw = String(region || '').trim().toLowerCase();
    if (!raw) return 'varlden';
    if (raw === 'nordamerika' || raw === 'sydamerika' || raw === 'amerika') return raw;
    return raw;
  }

  function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  function getDistanceBetweenCities(W, cityKeyA, cityKeyB) {
    const cA = W && W.cities && W.cities[cityKeyA];
    const cB = W && W.cities && W.cities[cityKeyB];
    if (!cA || !cB) return 0;
    return calcDistance(cA.lat, cA.lon, cB.lat, cB.lon);
  }

  function getCityRoutePool(W, cityKey) {
    const defined = (W.cities[cityKey] && W.cities[cityKey].routes) || CITY_ROUTES[cityKey];
    if (defined && defined.length > 0) {
      return defined.filter(r => W.cities[r.to] && r.to !== cityKey);
    }
    return Object.keys(W.cities)
      .filter(k => k !== cityKey)
      .map(k => ({ to: k, dist: getDistanceBetweenCities(W, cityKey, k) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 6)
      .map((r, i) => ({ to: r.to, chance: Math.max(55, 90 - i * 6) }));
  }

  function getTrainsFrom(cityKey) {
    const base = CITY_TRAINS[cityKey] || [];
    const extra = (window.GT_EXTRA_TRAINS && window.GT_EXTRA_TRAINS[cityKey]) || [];
    const seen = new Set();
    const out = [];
    [...base, ...extra].forEach(tr => {
      if (tr && tr.to && !seen.has(tr.to)) {
        seen.add(tr.to);
        out.push(tr);
      }
    });
    return out;
  }

  function getAllOutgoingEdges(W, cityKey) {
    const set = new Set();
    getCityRoutePool(W, cityKey).forEach(r => set.add(r.to));
    getTrainsFrom(cityKey).forEach(tr => { if (W.cities[tr.to]) set.add(tr.to); });
    const c = W.cities[cityKey];
    if (c && Array.isArray(c.boats)) {
      c.boats.forEach(b => { if (W.cities[b.to]) set.add(b.to); });
    }
    return Array.from(set);
  }

  // Returnerar alla städer som går att både NÅ från startCity OCH återvända till startCity ifrån!
  function getRoundTripReachableCities(W, startCity) {
    const allKeys = Object.keys((W && W.cities) || {});
    if (!allKeys.includes(startCity)) return [];

    // 1. Framåt-BFS från startCity
    const forward = new Set([startCity]);
    const q1 = [startCity];
    while (q1.length > 0) {
      const cur = q1.shift();
      for (const nxt of getAllOutgoingEdges(W, cur)) {
        if (!forward.has(nxt)) {
          forward.add(nxt);
          q1.push(nxt);
        }
      }
    }

    // 2. Bakåt-BFS (vilka städer kan ta sig hem till startCity?)
    const rev = {};
    allKeys.forEach(k => { rev[k] = []; });
    allKeys.forEach(from => {
      getAllOutgoingEdges(W, from).forEach(to => {
        if (rev[to]) rev[to].push(from);
      });
    });

    const backward = new Set([startCity]);
    const q2 = [startCity];
    while (q2.length > 0) {
      const cur = q2.shift();
      for (const prev of (rev[cur] || [])) {
        if (!backward.has(prev)) {
          backward.add(prev);
          q2.push(prev);
        }
      }
    }

    return allKeys.filter(k => k !== startCity && forward.has(k) && backward.has(k));
  }

  window.GT_ROUTES = {
    CITY_AIRLINE_PREFIX,
    CITY_ROUTES,
    CITY_TRAINS,
    normRegion,
    calcDistance,
    getDistanceBetweenCities,
    getCityRoutePool,
    getTrainsFrom,
    getAllOutgoingEdges,
    getRoundTripReachableCities
  };
})();
