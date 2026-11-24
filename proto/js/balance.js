// Globetrotter — Central balans- och regelkonfiguration
// Samlar alla ekonomiska, tidsmässiga och spelmekaniska värden på ett ställe.

(function () {
  'use strict';

  window.GT_BALANCE = {
    // Startvärden & tid
    START_CASH: 4500, // Knappare startkassa: tvingar fram riktiga val kring jobb, tåg/båt och handel!
    DAY_START_HOUR: 8,
    DAY_END_HOUR: 24,
    BROKE_SLEEP_WAKE_HOUR: 11, // Sova pank på stationen kostar 3 förlorade morgontimmar

    // Resor & biljettpriser
    FLIGHT_BASE_PRICE: 500,
    FLIGHT_PRICE_PER_KM: 0.22,
    STANDBY_DISCOUNT: 0.25,
    ROUTE_BLOCK_SURCHARGE: 1.6,

    // Ekonomi & utrustning
    MAIL_HOME_COST: 250,
    CAMERA_JOB_BONUS: 0.20, // +20 % lön på alla jobb (matchar butikstexten!)
    CALL_HOME_AMOUNT: 1200,
    CALL_HOME_MAX: 2,
    CALL_HOME_THRESHOLD: 1500,
    CALL_HOME_SCORE_PENALTY: 250, // Varje nödlån kostar 250 slutpoäng
    FIRST_CLAIM_BONUS: 250,
    BOT_JOB_RECORD_BONUS: 250,
    MP_JOB_RECORD_BONUS: 300,
    SIGHT_PERFECT_BONUS: 120, // Bonus för full pott (Guld) på en sevärdhet
    STAMP_BONUS: 250, // Stämpel i passet när en stad är gjord (om hotellnatten redan är betald)
    SIGNATURE_BONUS: 250, // Klarad lokal signaturaktivitet
    SIGNATURE_BONUS_HIGH: 350, // Signaturaktivitet med hög lokalkännedom
    KNOWLEDGE_STIPEND: 500, // Kunskapsduellen var 5:e dag i onlineduell
    BOT_DUEL_WIN: 300, // Vinst i snabbduell mot bot
    BOT_DUEL_DRAW: 100, // Oavgjord snabbduell mot bot
    CHALLENGE_BONUS: 250, // Duellfråga via telegram (online)

    // Regional lokalkännedom (0-100 % per världsdel) — knyter kunskap direkt till ekonomi & resor!
    KNOWLEDGE_GAIN_PER_CORRECT: 4,
    KNOWLEDGE_TIER1: 30, // >= 30 %: +15 % lön, +8 % prutchans
    KNOWLEDGE_TIER2: 60, // >= 60 %: +30 % lön, +15 % prutchans, -10 % biljettpris
    KNOWLEDGE_TIER1_JOB_BONUS: 0.15,
    KNOWLEDGE_TIER2_JOB_BONUS: 0.30,
    KNOWLEDGE_TIER1_HAGGLE_BONUS: 0.08,
    KNOWLEDGE_TIER2_HAGGLE_BONUS: 0.15,
    KNOWLEDGE_TIER2_TICKET_DISCOUNT: 0.10,

    // Reseflyt (streak av rätta svar i rad)
    STREAK_THRESHOLD: 3, // 3+ rätt i rad ger +10 % extra jobblön
    STREAK_JOB_BONUS: 0.10,

    // Prutning i basaren (3 risknivåer — skambud kan höja priset!)
    HAGGLE_OPTIONS: {
      polite: { label: 'Artigt bud (-10 %)', discount: 0.10, baseChance: 0.88, parlorChance: 0.96, penaltyMult: 1.00 },
      firm:   { label: 'Tufft bud (-20 %)',  discount: 0.20, baseChance: 0.60, parlorChance: 0.82, penaltyMult: 1.05 },
      bold:   { label: 'Skambud (-35 %)',    discount: 0.35, baseChance: 0.28, parlorChance: 0.48, penaltyMult: 1.15 }
    },

    // Ryggsäcksnivåer (start med 4 platser så handel & mål fungerar från dag 1)
    BACKPACK_TIERS: [
      { level: 1, slots: 4, name: 'Liten resväska',            price: 0,    desc: 'Smidig startväska med plats för 4 föremål.' },
      { level: 2, slots: 6, name: 'Gul dagstursryggsäck',      price: 950,  desc: 'Lätt gul ryggsäck som rymmer 6 packplatser.' },
      { level: 3, slots: 8, name: 'Reseduffelbag 65L',         price: 1700, desc: 'Rymlig duffelbag med axelrem och 8 packplatser.' },
      { level: 4, slots: 10, name: 'Stor vandringsryggsäck 85L', price: 2800, desc: 'Fullutrustad proffsryggsäck med sidofickor och hela 10 platser!' }
    ],

    // Utrustningsbutiken
    GEAR_SHOP_ITEMS: [
      { id: 'parlor',      name: 'Språkparlör',     price: 650, photo: 'assets/souvenirs/guide_amerika.jpg', desc: 'Artiga fraser på 20 språk — höjer kraftigt chansen att lyckas pruta på alla nivåer.', effect: 'Bättre prutchans', unique: true },
      { id: 'guide_asien', name: 'Fickguidebok',    price: 550, photo: 'assets/souvenirs/guide_asien.jpg',   desc: 'Avslöjar outforskade landmärken på stadskartan och stryker ett felaktigt svar i quiz (3 ggr).', effect: 'Avslöjar kartan + 3 tips', uses: 3, unique: false },
      { id: 'kamera',      name: 'Systemkamera',    price: 900, photo: 'assets/souvenirs/kamera.jpg',        desc: 'Kompakt 35mm-kamera som gör dig eftertraktad på redaktioner och uppdrag.', effect: '+20 % lön på alla jobb', unique: true },
      { id: 'kangor',      name: 'Vandringskängor', price: 700, photo: 'assets/souvenirs/kangor.jpg',        desc: 'Ingångna läderkängor som kortar restiden på långa underverksexpeditioner.', effect: 'Snabbare underverk', unique: true }
    ]
  };
})();
