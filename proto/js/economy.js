// Globetrotter — Ekonomi, souvenirpriser, prutning, marknadsnamn & ryggsäck

(function () {
  'use strict';

  function getBalance() {
    return window.GT_BALANCE || {};
  }

  // Säker grundprisuppslagning (hanterar både .price och .basePrice så NaN aldrig kan uppstå!)
  function getSouvenirBasePrice(souvenirDef) {
    if (!souvenirDef) return 0;
    const raw = Number(souvenirDef.price !== undefined ? souvenirDef.price : souvenirDef.basePrice);
    return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : 200;
  }

  // Avståndspris för souvenirer:
  // - I ursprungsstaden: lokalt andrahandsvärde (55 %) för att förhindra köp-sälj-loopar.
  // - Utomlands: grundpris × (1 + 0.15 × tusen km), max 3.0x.
  function calcSouvenirValue(W, souvenirKey, currentCityKey) {
    const s = W && W.souvenirs && W.souvenirs[souvenirKey];
    if (!s) return { price: 0, dist: 0, factor: 1, isLocal: false };
    const basePrice = getSouvenirBasePrice(s);
    const originCityKey = s.origin;
    if (originCityKey === currentCityKey) {
      return {
        price: Math.max(10, Math.round(basePrice * 0.55)),
        dist: 0,
        factor: 0.55,
        isLocal: true
      };
    }
    let dist = 0;
    if (window.GT_ROUTES && W.cities[originCityKey] && W.cities[currentCityKey]) {
      dist = window.GT_ROUTES.getDistanceBetweenCities(W, originCityKey, currentCityKey);
    }
    const factor = Math.min(3.0, 1 + 0.15 * (dist / 1000));
    return {
      price: Math.round(basePrice * factor),
      dist,
      factor,
      isLocal: false
    };
  }

  function getEffectiveBuyPrice(W, state, key, cityEv) {
    const s = W && W.souvenirs && W.souvenirs[key];
    if (!s) return 0;
    const hKey = `${state.city}_${state.day}_${key}`;
    if (state.haggleState[hKey] && Number.isFinite(state.haggleState[hKey].price)) {
      return state.haggleState[hKey].price;
    }
    const basePrice = getSouvenirBasePrice(s);
    const disc = (cityEv && cityEv.buyDiscount) ? (1 - cityEv.buyDiscount) : 1;
    return Math.round(basePrice * disc);
  }

  function getEffectiveSellInfo(W, state, itemOrId, cityEv) {
    const isObj = itemOrId && typeof itemOrId === 'object';
    const itemId = isObj ? itemOrId.id : itemOrId;
    const buyPrice = isObj && typeof itemOrId.buyPrice === 'number' && Number.isFinite(itemOrId.buyPrice)
      ? itemOrId.buyPrice
      : null;
    const base = calcSouvenirValue(W, itemId, state.city);
    if (base.isLocal) {
      const cappedPrice = buyPrice !== null
        ? Math.max(10, Math.min(base.price, Math.floor(buyPrice * 0.70)))
        : base.price;
      return { ...base, price: cappedPrice };
    }
    if (cityEv && cityEv.sellBonus) {
      return {
        ...base,
        price: Math.round(base.price * (1 + cityEv.sellBonus)),
        eventBonus: Math.round(cityEv.sellBonus * 100)
      };
    }
    return base;
  }

  // Beräknar spelarens aktuella fördelar utifrån regional lokalkännedom (0-100 %) och reseflyt (streak)
  function getKnowledgeBonuses(regionKnowledgePct = 0, streak = 0) {
    const b = getBalance();
    const pct = Math.max(0, Math.min(100, Number(regionKnowledgePct) || 0));
    const t1 = b.KNOWLEDGE_TIER1 || 30;
    const t2 = b.KNOWLEDGE_TIER2 || 60;
    let jobBonus = 0;
    let haggleBonus = 0;
    let ticketDiscount = 0;
    let tier = 0;

    if (pct >= t2) {
      tier = 2;
      jobBonus = b.KNOWLEDGE_TIER2_JOB_BONUS || 0.30;
      haggleBonus = b.KNOWLEDGE_TIER2_HAGGLE_BONUS || 0.15;
      ticketDiscount = b.KNOWLEDGE_TIER2_TICKET_DISCOUNT || 0.10;
    } else if (pct >= t1) {
      tier = 1;
      jobBonus = b.KNOWLEDGE_TIER1_JOB_BONUS || 0.15;
      haggleBonus = b.KNOWLEDGE_TIER1_HAGGLE_BONUS || 0.08;
    }

    const streakActive = (Number(streak) || 0) >= (b.STREAK_THRESHOLD || 3);
    const streakJobBonus = streakActive ? (b.STREAK_JOB_BONUS || 0.10) : 0;

    return {
      pct,
      tier,
      jobBonus,
      haggleBonus,
      ticketDiscount,
      streakActive,
      streakJobBonus,
      totalJobBonus: jobBonus + streakJobBonus
    };
  }

  // Prutning med verklig risk/reward: artigt (-10%), tufft (-20%) eller skambud (-35% men risk för sur handlare +15%!)
  function resolveHaggle(basePrice, tierKey, hasParlor, rng = Math.random, knowledgeHaggleBonus = 0) {
    const opts = getBalance().HAGGLE_OPTIONS || {};
    const opt = opts[tierKey] || opts.firm || { discount: 0.20, baseChance: 0.60, parlorChance: 0.82, penaltyMult: 1.05 };
    const chance = Math.min(0.97, (hasParlor ? opt.parlorChance : opt.baseChance) + (Number(knowledgeHaggleBonus) || 0));
    const roll = rng();

    if (roll < chance) {
      const newPrice = Math.max(20, Math.round(basePrice * (1 - opt.discount)));
      return { outcome: 'won', price: newPrice, locked: true, won: true };
    }
    if (tierKey === 'firm' && roll < chance + 0.18) {
      const halfPrice = Math.max(20, Math.round(basePrice * (1 - opt.discount * 0.5)));
      return { outcome: 'half', price: halfPrice, locked: true, won: true };
    }
    const penaltyPrice = Math.max(20, Math.round(basePrice * (opt.penaltyMult || 1)));
    return {
      outcome: penaltyPrice > basePrice ? 'angry' : 'rejected',
      price: penaltyPrice,
      locked: true,
      won: false
    };
  }

  function getMaxBackpackSlots(backpackLevel) {
    const tiers = getBalance().BACKPACK_TIERS || [{ level: 1, slots: 4 }];
    const tier = tiers.find(t => t.level === (backpackLevel || 1)) || tiers[0];
    return tier.slots;
  }

  function getSouvenirPhoto(W, souvenirId) {
    if (!souvenirId) return '';
    if (W && W.souvenirs && W.souvenirs[souvenirId] && W.souvenirs[souvenirId].photo) {
      return W.souvenirs[souvenirId].photo;
    }
    return `assets/souvenirs/${souvenirId}.jpg`;
  }

  function getMarketInfo(W, cityKey) {
    const cityName = (W && W.cities && W.cities[cityKey] && W.cities[cityKey].name) || cityKey;
    const custom = {
      kairo:        { shortLabel: 'Basar',   title: 'Basaren i Kairo',             leaveText: 'Lämna basaren',   keeperFallback: 'Basarhandlaren i Kairo' },
      istanbul:     { shortLabel: 'Basar',   title: 'Stora basaren i Istanbul',    leaveText: 'Lämna basaren',   keeperFallback: 'Basarhandlaren i Istanbul' },
      delhi:        { shortLabel: 'Basar',   title: 'Kryddbasaren i Delhi',        leaveText: 'Lämna basaren',   keeperFallback: 'Basarhandlaren i Delhi' },
      malmo:        { shortLabel: 'Marknad', title: 'Möllevångstorget · Marknad',  leaveText: 'Lämna marknaden', keeperFallback: 'Torghandlaren på Möllan' },
      stockholm:    { shortLabel: 'Marknad', title: 'Torghandel & Marknad',        leaveText: 'Lämna marknaden', keeperFallback: 'Torghandlaren i Stockholm' },
      paris:        { shortLabel: 'Marknad', title: 'Marknaden på Rue Mouffetard', leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Paris' },
      rom:          { shortLabel: 'Marknad', title: 'Marknaden på Campo de’ Fiori',leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Rom' },
      london:       { shortLabel: 'Marknad', title: 'Portobello-marknaden',        leaveText: 'Lämna marknaden', keeperFallback: 'Antikhandlaren i London' },
      tokyo:        { shortLabel: 'Marknad', title: 'Hantverksmarknaden i Tokyo',  leaveText: 'Lämna marknaden', keeperFallback: 'Handlaren i Tokyo' },
      bangkok:      { shortLabel: 'Marknad', title: 'Gatumarknaden i Bangkok',     leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Bangkok' },
      peking:       { shortLabel: 'Marknad', title: 'Antikmarknaden i Peking',     leaveText: 'Lämna marknaden', keeperFallback: 'Handlaren i Peking' },
      sydney:       { shortLabel: 'Marknad', title: 'The Rocks-marknaden',         leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Sydney' },
      kapstaden:    { shortLabel: 'Marknad', title: 'Torgmarknaden i Kapstaden',   leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Kapstaden' },
      rio:          { shortLabel: 'Marknad', title: 'Hantverksmarknaden i Rio',    leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Rio' },
      mexicocity:   { shortLabel: 'Marknad', title: 'Mercado de la Ciudadela',     leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i Mexico City' },
      sanfrancisco: { shortLabel: 'Marknad', title: 'Hamnmarknaden vid Pier 39',   leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i San Francisco' },
      newyork:      { shortLabel: 'Marknad', title: 'Gatumarknaden på Manhattan',  leaveText: 'Lämna marknaden', keeperFallback: 'Marknadshandlaren i New York' }
    };
    return custom[cityKey] || {
      shortLabel: 'Marknad',
      title: `Marknaden i ${cityName}`,
      leaveText: 'Lämna marknaden',
      keeperFallback: `Marknadshandlaren i ${cityName}`
    };
  }

  window.GT_ECONOMY = {
    getSouvenirBasePrice,
    calcSouvenirValue,
    getEffectiveBuyPrice,
    getEffectiveSellInfo,
    getKnowledgeBonuses,
    resolveHaggle,
    getMaxBackpackSlots,
    getSouvenirPhoto,
    getMarketInfo
  };
})();
