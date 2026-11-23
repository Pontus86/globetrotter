// Globetrotter, Världsexpansion: 10 nya städer, 40 sevärdheter, 1 nytt underverk (Kinesiska muren),
// 10 yrken, 20 souvenirer, 10 pubar/kaféer, 10 stafettuppdrag och 100+ varierade frågor!
// Laddas direkt efter world.js och questions.js och slås ihop med GT_WORLD & GT_QUESTIONS.

(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : global;
  const W = root.GT_WORLD;
  const Q = root.GT_QUESTIONS;
  if (!W || !Q) return;

  const NEW_CITIES = {
    paris: {
      name: 'Paris',
      country: 'Frankrike',
      region: 'europa',
      lat: 48.86,
      lon: 2.35,
      skyline: 'assets/photos/eiffel.jpg',
      map: 'assets/maps/map_stockholm.jpg',
      hotel: { name: 'Hôtel Montmartre', price: 620 },
      highlights: ['eiffel', 'louvre', 'notredame', 'montmartre'],
      wonders: [],
      souvenirs: ['baskermossa', 'parfym_paris'],
      spots: {
        hotel: [18, 76], job: [38, 80], shop: [58, 78], airport: [82, 76], signature: [10, 60],
        eiffel: [20, 42], louvre: [42, 36], notredame: [64, 46], montmartre: [84, 38]
      },
      signature: {
        name: 'Bistro vid Seine',
        openFrom: 11, openUntil: 22, cost: 85, hours: 1,
        desc: 'Slå dig ner med croissant och espresso vid Seine (11:00–22:00) och snappa upp restips mot Sydeuropa!',
        kind: 'deal'
      },
      job: { title: 'Konstguide', employer: 'Galleri Marais', pay: 920, hours: 6 }
    },

    rom: {
      name: 'Rom',
      country: 'Italien',
      region: 'europa',
      lat: 41.90,
      lon: 12.50,
      skyline: 'assets/photos/colosseum.jpg',
      map: 'assets/maps/map_stockholm.jpg',
      hotel: { name: 'Pensione Trastevere', price: 540 },
      highlights: ['colosseum', 'trevi', 'vatican', 'pantheon'],
      wonders: [],
      souvenirs: ['olivolja', 'vespamodell'],
      spots: {
        hotel: [18, 78], job: [38, 82], shop: [58, 78], airport: [82, 78], signature: [10, 60],
        colosseum: [18, 42], trevi: [40, 36], vatican: [62, 46], pantheon: [84, 38]
      },
      signature: {
        name: 'Gelateria på Piazza Navona',
        openFrom: 10, openUntil: 23, cost: 55, hours: 1,
        desc: 'Ät hantverksgelato i den romerska kvällssolen (10:00–23:00) och hör lokala flygtips!',
        kind: 'deal'
      },
      job: { title: 'Pizzabagare', employer: 'Trattoria Roma', pay: 840, hours: 6 }
    },

    london: {
      name: 'London',
      country: 'Storbritannien',
      region: 'europa',
      lat: 51.51,
      lon: -0.13,
      skyline: 'assets/photos/bigben.jpg',
      map: 'assets/maps/map_stockholm.jpg',
      hotel: { name: 'Kensington Inn', price: 680 },
      highlights: ['towerlondon', 'bigben', 'britishmuseum', 'buckingham'],
      wonders: [],
      souvenirs: ['earlgrey', 'paraply_london'],
      boats: [{ to: 'newyork', name: 'Atlantångare Southampton–New York', days: 7, price: 1650 }],
      spots: {
        hotel: [16, 78], job: [34, 82], shop: [52, 78], airport: [70, 82], harbor: [88, 76], signature: [10, 60],
        towerlondon: [18, 42], bigben: [40, 36], britishmuseum: [62, 46], buckingham: [84, 38]
      },
      signature: {
        name: 'Afternoon Tea i Soho',
        openFrom: 13, openUntil: 18, cost: 95, hours: 1,
        desc: 'Klassiskt brittiskt eftermiddagste med scones (13:00–18:00), ger tips om billiga flyg!',
        kind: 'deal'
      },
      job: { title: 'Busskonduktör', employer: 'London Red Bus', pay: 960, hours: 6 }
    },

    istanbul: {
      name: 'Istanbul',
      country: 'Turkiet',
      region: 'europa',
      lat: 41.01,
      lon: 28.98,
      skyline: 'assets/photos/hagiasophia.jpg',
      map: 'assets/maps/map1914a.jpg',
      hotel: { name: 'Sultanahmet Han', price: 320 },
      highlights: ['hagiasophia', 'bluemosque', 'grandbazaar', 'topkapi'],
      wonders: [],
      souvenirs: ['turkisk_matta', 'kaffekanna'],
      spots: {
        hotel: [18, 78], job: [38, 82], shop: [58, 80], airport: [82, 78], signature: [10, 60],
        hagiasophia: [18, 42], bluemosque: [40, 36], grandbazaar: [62, 46], topkapi: [84, 38]
      },
      signature: {
        name: 'Bosporen-färjan',
        openFrom: 8, openUntil: 20, cost: 40, hours: 1,
        desc: 'Korsa sundet mellan Europa och Asien på 20 minuter (08:00–20:00) och kamma hem resetips!',
        kind: 'deal'
      },
      job: { title: 'Mattförsäljare', employer: 'Kapalıçarşı Handel', pay: 560, hours: 6 }
    },

    bangkok: {
      name: 'Bangkok',
      country: 'Thailand',
      region: 'asien',
      lat: 13.76,
      lon: 100.50,
      skyline: 'assets/photos/watarun.jpg',
      map: 'assets/maps/map_delhi.jpg',
      hotel: { name: 'Khao San Guesthouse', price: 180 },
      highlights: ['grandpalace', 'watarun', 'watpho', 'chaophraya'],
      wonders: [],
      souvenirs: ['thaisiden', 'tuktuk_modell'],
      spots: {
        hotel: [18, 78], job: [38, 82], shop: [58, 80], airport: [82, 78], signature: [10, 60],
        grandpalace: [18, 42], watarun: [40, 36], watpho: [62, 46], chaophraya: [84, 38]
      },
      signature: {
        name: 'Nattmarknad i Chinatown',
        openFrom: 17, openUntil: 24, cost: 60, hours: 1,
        desc: 'Endast öppen kvällstid (17:00–24:00)! Hjälp en gatukock och tjäna en extra hacka!',
        kind: 'cash'
      },
      job: { title: 'Tuk-tuk-förare', employer: 'Siam Express', pay: 460, hours: 6 }
    },

    peking: {
      name: 'Peking',
      country: 'Kina',
      region: 'asien',
      lat: 39.90,
      lon: 116.41,
      skyline: 'assets/photos/forbiddencity.jpg',
      map: 'assets/maps/map_tokyo.jpg',
      hotel: { name: 'Hutong Courtyard Inn', price: 340 },
      highlights: ['forbiddencity', 'tiananmen', 'summerpalace', 'templeheaven'],
      wonders: ['greatwall'],
      souvenirs: ['jadestatyett', 'tekanna_kina'],
      spots: {
        hotel: [18, 78], job: [38, 82], shop: [58, 80], airport: [82, 78], signature: [10, 60],
        greatwall: [14, 36], forbiddencity: [34, 44], tiananmen: [54, 36], summerpalace: [72, 46], templeheaven: [88, 36]
      },
      signature: {
        name: 'Tehus i en Hutong',
        openFrom: 9, openUntil: 20, cost: 70, hours: 1,
        desc: 'Delta i en traditionell teceremoni i Pekings gamla gränder (09:00–20:00) och hör heta flygtips!',
        kind: 'deal'
      },
      job: { title: 'Kalligrafiassistent', employer: 'Liulichang Kultur', pay: 620, hours: 6 }
    },

    sydney: {
      name: 'Sydney',
      country: 'Australien',
      region: 'oceanien',
      lat: -33.87,
      lon: 151.21,
      skyline: 'assets/photos/sydneyopera.jpg',
      map: 'assets/maps/map_sanfrancisco.jpg',
      hotel: { name: 'Harbour View Hostel', price: 590 },
      highlights: ['sydneyopera', 'harbourbridge', 'bondibeach', 'therocks'],
      wonders: [],
      souvenirs: ['bumerang', 'opal_sydney'],
      boats: [{ to: 'tokyo', name: 'Söderhavskryssare till Tokyo', days: 8, price: 1450 }],
      spots: {
        hotel: [16, 78], job: [34, 82], shop: [52, 78], airport: [70, 82], harbor: [88, 76], signature: [10, 60],
        sydneyopera: [18, 42], harbourbridge: [40, 36], bondibeach: [62, 46], therocks: [84, 38]
      },
      signature: {
        name: 'Surfskola på Bondi',
        openFrom: 8, openUntil: 16, cost: 90, hours: 2,
        desc: 'Fånga morgonvågorna på Bondi Beach (08:00–16:00) och hjälp instruktören mot bonuslön!',
        kind: 'cash'
      },
      job: { title: 'Badbevakare', employer: 'Bondi Surf Patrol', pay: 940, hours: 6 }
    },

    kapstaden: {
      name: 'Kapstaden',
      country: 'Sydafrika',
      region: 'afrika',
      lat: -33.92,
      lon: 18.42,
      skyline: 'assets/photos/tablemountain.jpg',
      map: 'assets/maps/map1914a.jpg',
      hotel: { name: 'Table Bay Lodge', price: 360 },
      highlights: ['tablemountain', 'capegoodhope', 'robbenisland', 'vawaterfront'],
      wonders: [],
      souvenirs: ['rooiboste', 'strutsegg'],
      boats: [{ to: 'rio', name: 'Sydatlant-fartyg till Rio de Janeiro', days: 7, price: 1350 }],
      spots: {
        hotel: [16, 78], job: [34, 82], shop: [52, 78], airport: [70, 82], harbor: [88, 76], signature: [10, 60],
        tablemountain: [18, 42], capegoodhope: [40, 36], robbenisland: [62, 46], vawaterfront: [84, 38]
      },
      signature: {
        name: 'Vingårdstur i Stellenbosch',
        openFrom: 10, openUntil: 18, cost: 80, hours: 2,
        desc: 'Besök de gröna dalarna utanför Kapstaden (10:00–18:00) och få tips om billiga flyg!',
        kind: 'deal'
      },
      job: { title: 'Naturguide', employer: 'Cape Safari Tours', pay: 640, hours: 6 }
    },

    rio: {
      name: 'Rio de Janeiro',
      country: 'Brasilien',
      region: 'sydamerika',
      lat: -22.91,
      lon: -43.17,
      skyline: 'assets/photos/christredeemer.jpg',
      map: 'assets/maps/map_newyork.jpg',
      hotel: { name: 'Pousada Ipanema', price: 380 },
      highlights: ['christredeemer', 'sugarloaf', 'copacabana', 'maracana'],
      wonders: [],
      souvenirs: ['kaffebonor_rio', 'karnevalsmask'],
      boats: [{ to: 'kapstaden', name: 'Sydatlant-fartyg till Kapstaden', days: 7, price: 1350 }],
      spots: {
        hotel: [16, 78], job: [34, 82], shop: [52, 78], airport: [70, 82], harbor: [88, 76], signature: [10, 60],
        christredeemer: [18, 42], sugarloaf: [40, 36], copacabana: [62, 46], maracana: [84, 38]
      },
      signature: {
        name: 'Sambaskola i Lapa',
        openFrom: 18, openUntil: 24, cost: 75, hours: 2,
        desc: 'Trummorna dånar på kvällen (18:00–24:00)! Hjälp till med karnevalsförberedelser för bonus!',
        kind: 'cash'
      },
      job: { title: 'Fotbollsreporter', employer: 'Jornal do Brasil', pay: 680, hours: 6 }
    },

    mexicocity: {
      name: 'Mexico City',
      country: 'Mexiko',
      region: 'amerika',
      lat: 19.43,
      lon: -99.13,
      skyline: 'assets/photos/zocalo.jpg',
      map: 'assets/maps/map_sanfrancisco.jpg',
      hotel: { name: 'Casa Coyoacán', price: 310 },
      highlights: ['zocalo', 'fridakahlo', 'chapultepec', 'xochimilco'],
      wonders: [],
      souvenirs: ['sombrero', 'aztekkalender'],
      spots: {
        hotel: [18, 78], job: [38, 82], shop: [58, 80], airport: [82, 78], signature: [10, 60],
        zocalo: [18, 42], fridakahlo: [40, 36], chapultepec: [62, 46], xochimilco: [84, 38]
      },
      signature: {
        name: 'Mariachi-kväll på Garibaldi',
        openFrom: 17, openUntil: 24, cost: 65, hours: 1,
        desc: 'Lyssna på mariachiband i skymningen (17:00–24:00) och kamma hem restips mot Sydamerika!',
        kind: 'deal'
      },
      job: { title: 'Arkeologiassistent', employer: 'Museo Antropología', pay: 590, hours: 6 }
    }
  };

  const NEW_PLACES = {
    // Paris
    eiffel: { name: 'Eiffeltornet', city: 'paris', photo: 'assets/photos/eiffel.jpg', hours: 2, fee: 220, fact: 'Järntornet vid Marsfältet byggdes som pampig entréport till världsutställningen och skulle ursprungligen rivas efter 20 år, men räddades tack vare sin nytta som radiomast.' },
    louvre: { name: 'Louvren', city: 'paris', photo: 'assets/photos/louvre.jpg', hours: 3, fee: 200, fact: 'Det före detta kungapalatset vid Seine är världens mest besökta konstmuseum med sin kända glaspyramid på borggården och tiotusentals mästerverk.' },
    notredame: { name: 'Notre-Dame', city: 'paris', photo: 'assets/photos/notredame.jpg', hours: 2, fee: 0, fact: 'På ön Île de la Cité i Seine reser sig den gotiska katedralen med sina strävbågar, rosettfönster och groteska vattenkastare. Efter branden 2019 återöppnade den i praktfullt skick 2024.' },
    montmartre: { name: 'Montmartre & Sacré-Cœur', city: 'paris', photo: 'assets/photos/montmartre.jpg', hours: 2, fee: 0, fact: 'På Paris högsta kulle lockar bohemkvarteren med porträttmålare på Place du Tertre och den kritvita basilikan som blickar ut över hela staden.' },
    // Rom
    colosseum: { name: 'Colosseum', city: 'rom', photo: 'assets/photos/colosseum.jpg', hours: 3, fee: 190, fact: 'Antikens största amfiteater byggdes av kejsare ur den flaviska ätten och kunde rymma omkring 50 000 åskådare under gladiatorspel och skådespel.' },
    trevi: { name: 'Fontana di Trevi', city: 'rom', photo: 'assets/photos/trevi.jpg', hours: 1, fee: 0, fact: 'Roms mest berömda barockfontän matas fortfarande av en antik akvedukt. Traditionen bjuder att kasta ett mynt över vänster axel för att vara säker på att återvända till Rom.' },
    vatican: { name: 'Vatikanen & Peterskyrkan', city: 'rom', photo: 'assets/photos/vatican.jpg', hours: 3, fee: 180, fact: 'Mitt inne i Rom ligger världens minsta självständiga stat, med Petersplatsens kolonnader och en av världens mest magnifika renässanskupoler.' },
    pantheon: { name: 'Pantheon', city: 'rom', photo: 'assets/photos/pantheon.jpg', hours: 2, fee: 60, fact: 'Det bäst bevarade templet från det antika Rom kröns av världens största oarmerade betongkupol med en öppen ljusöppning (oculus) rakt mot himlen.' },
    // London
    towerlondon: { name: 'Tower of London', city: 'london', photo: 'assets/photos/towerlondon.jpg', hours: 3, fee: 320, fact: 'Den medeltida borgen vid Themsen har fungerat som kungligt palats, skattkammare och ökänt fängelse, vaktad av Beefeaters och sex tama korpar.' },
    bigben: { name: 'Big Ben & Parliament', city: 'london', photo: 'assets/photos/bigben.jpg', hours: 2, fee: 0, fact: 'Vid Westminsterpalatset reser sig det nygotiska klocktornet Elizabeth Tower, vars tunga slagklocka hörs över hela centrala London.' },
    britishmuseum: { name: 'British Museum', city: 'london', photo: 'assets/photos/britishmuseum.jpg', hours: 3, fee: 0, fact: 'Ett av världens största kulturhistoriska museer med fritt inträde och samlingar som spänner över två miljoner år av mänsklig historia.' },
    buckingham: { name: 'Buckingham Palace', city: 'london', photo: 'assets/photos/buckingham.jpg', hours: 2, fee: 0, fact: 'Den brittiska monarkens officiella Londonresidens vid slutet av paradgatan The Mall, berömt för den dagliga högvaktsavlösningen i björnskinnsmössor.' },
    // Istanbul
    hagiasophia: { name: 'Hagia Sofia', city: 'istanbul', photo: 'assets/photos/hagiasophia.jpg', hours: 2, fee: 240, fact: 'Det arkitektoniska underverket från 537 e.Kr. var i tusen år världens största kyrka, blev sedan kejserlig osmansk moské och därefter museum innan den åter blev moské 2020.' },
    bluemosque: { name: 'Blå moskén', city: 'istanbul', photo: 'assets/photos/bluemosque.jpg', hours: 2, fee: 0, fact: 'Sultan Ahmet-moskén kallas Blå moskén efter de mer än 20 000 handmålade blå Iznik-kakelplattor som klär väggarna och kupolerna invändigt.' },
    grandbazaar: { name: 'Stora basaren', city: 'istanbul', photo: 'assets/photos/grandbazaar.jpg', hours: 2, fee: 0, fact: 'En av världens äldsta och största täckta marknader med över 60 labyrintiska gator och tusentals bodar för mattor, guld, keramik och lyktor.' },
    topkapi: { name: 'Topkapipalatset', city: 'istanbul', photo: 'assets/photos/topkapi.jpg', hours: 3, fee: 260, fact: 'Med utsikt över Bosporen och Gyllene hornet var detta de osmanska sultanernas hem och maktcentrum i närmare 400 år.' },
    // Bangkok
    grandpalace: { name: 'Grand Palace', city: 'bangkok', photo: 'assets/photos/grandpalace.jpg', hours: 3, fee: 160, fact: 'Ett bländande område av förgyllda spiror, mosaiker och tempelbyggnader som var den thailändska kungafamiljens officiella residens från 1782.' },
    watarun: { name: 'Wat Arun', city: 'bangkok', photo: 'assets/photos/watarun.jpg', hours: 2, fee: 60, fact: 'Gryningens tempel reser sig på västra sidan av floden Chao Phraya, klätt i tusentals färgglada porslinsskärvor som gnistrar i solskenet.' },
    watpho: { name: 'Wat Pho', city: 'bangkok', photo: 'assets/photos/watpho.jpg', hours: 2, fee: 80, fact: 'Bangkoks äldsta tempelkomplex rymmer en enorm 46 meter lång vilande förgylld Buddha och anses vara den traditionella thaimassagens vagga.' },
    chaophraya: { name: 'Chao Phraya & Klonger', city: 'bangkok', photo: 'assets/photos/chaophraya.jpg', hours: 2, fee: 70, fact: 'Längs floden och stadens smala sidokanaler (klonger) glider långsvansbåtar förbi trähus på pålar, flytande marknader och stillsamma tempel.' },
    // Peking
    forbiddencity: { name: 'Förbjudna staden', city: 'peking', photo: 'assets/photos/forbiddencity.jpg', hours: 3, fee: 120, fact: 'Världens största bevarade träpalatskomplex med nästan 1 000 byggnader och röda murar var hem åt Kinas kejsare under Ming- och Qingdynastierna.' },
    tiananmen: { name: 'Himmelska fridens torg', city: 'peking', photo: 'assets/photos/tiananmen.jpg', hours: 2, fee: 0, fact: 'Ett av världens största offentliga torg mitt i Peking, omgivet av Folkets stora hall, Nationalmuseet och porten mot Förbjudna staden.' },
    summerpalace: { name: 'Sommarpalatset', city: 'peking', photo: 'assets/photos/summerpalace.jpg', hours: 3, fee: 100, fact: 'Kejsarnas svalkande sommarresidens kring den stora Kunmingsjön, känd för sin 700 meter långa målade träkorridor och Marmorbåten.' },
    templeheaven: { name: 'Himmelens tempel', city: 'peking', photo: 'assets/photos/templeheaven.jpg', hours: 2, fee: 80, fact: 'I en vidsträckt park där morgongymnaster övar tai chi står den runda, djupblå tempelbyggnaden där kejsarna bad om god skörd.' },
    // Sydney
    sydneyopera: { name: 'Operahuset i Sydney', city: 'sydney', photo: 'assets/photos/sydneyopera.jpg', hours: 2, fee: 220, fact: 'De vita, snäckliknande seglen på Bennelong Point vid Sydneys hamninlopp räknas som ett av 1900-talets mest banbrytande byggnadsverk.' },
    harbourbridge: { name: 'Sydney Harbour Bridge', city: 'sydney', photo: 'assets/photos/harbourbridge.jpg', hours: 2, fee: 0, fact: 'Den mäktiga stålbågbron, kärleksfullt kallad "Klädhängaren" av lokalbefolkningen, spänner över hamnen mellan centrum och North Shore.' },
    bondibeach: { name: 'Bondi Beach', city: 'sydney', photo: 'assets/photos/bondibeach.jpg', hours: 2, fee: 0, fact: 'Australiens mest kända halvmåneformade sandstrand, berömd för sina surfvågor, havspooler och kustpromenaden söderut mot Coogee.' },
    therocks: { name: 'The Rocks', city: 'sydney', photo: 'assets/photos/therocks.jpg', hours: 2, fee: 0, fact: 'Sydneys äldsta kvarter med kullerstensgränder och sandstenshus där de första europeiska bosättarna slog läger år 1788.' },
    // Kapstaden
    tablemountain: { name: 'Taffelberget', city: 'kapstaden', photo: 'assets/photos/tablemountain.jpg', hours: 3, fee: 210, fact: 'Det mäktiga, helt platta platåberget reser sig över 1 000 meter rakt upp bakom Kapstaden och kläs ofta i en vit molnduk som kallas "bordsduken".' },
    capegoodhope: { name: 'Godahoppsudden', city: 'kapstaden', photo: 'assets/photos/capegoodhope.jpg', hours: 3, fee: 160, fact: 'Den dramatiska klippudden på Kaphalvön har i århundraden varit ett mytomspunnet sjömärke för sjöfarare mellan Atlanten och Indiska oceanen.' },
    robbenisland: { name: 'Robben Island', city: 'kapstaden', photo: 'assets/photos/robbenisland.jpg', hours: 3, fee: 240, fact: 'Fängelseön ute i Taffelbukten är idag ett världsarv och minnesmärke över kampen mot apartheid och demokratins seger i Sydafrika.' },
    vawaterfront: { name: 'V&A Waterfront', city: 'kapstaden', photo: 'assets/photos/vawaterfront.jpg', hours: 2, fee: 0, fact: 'Kapstadens levande historiska hamnkvarter med hantverksmarknader, gatumusikanter och utsikt mot både sälar i bassängen och Taffelberget.' },
    // Rio de Janeiro
    christredeemer: { name: 'Kristusstatyn (Corcovado)', city: 'rio', photo: 'assets/photos/christredeemer.jpg', hours: 3, fee: 180, fact: 'Högst upp på berget Corcovado i Tijucaskogen står den 30 meter höga art déco-statyn i täljsten med utsträckta armar över hela Guanabarabukten.' },
    sugarloaf: { name: 'Sockertoppen', city: 'rio', photo: 'assets/photos/sugarloaf.jpg', hours: 2, fee: 170, fact: 'Den sockertoppsformade granitklippan Pão de Açúcar vid hamninloppet nås med två luftiga linbanor och bjuder på svindlande solnedgångsvyer.' },
    copacabana: { name: 'Copacabana', city: 'rio', photo: 'assets/photos/copacabana.jpg', hours: 2, fee: 0, fact: 'Den fyra kilometer långa strandpromenaden med sitt berömda svartvita vågmönster i kalksten sjuder av strandfotboll, musik och folkliv.' },
    maracana: { name: 'Maracanã', city: 'rio', photo: 'assets/photos/maracana.jpg', hours: 2, fee: 130, fact: 'En av världens mest legendariska fotbollsarenor, byggd inför VM 1950 och skådeplats för både VM-finalen 2014 och OS-invigningen 2016.' },
    // Mexico City
    zocalo: { name: 'Zócalo & Templo Mayor', city: 'mexicocity', photo: 'assets/photos/zocalo.jpg', hours: 2, fee: 90, fact: 'Under det väldiga centrala torget vilar ruinerna av aztekernas huvudstad Tenochtitlán, precis intill katedralen och Nationalpalatset.' },
    fridakahlo: { name: 'Frida Kahlo-museet', city: 'mexicocity', photo: 'assets/photos/fridakahlo.jpg', hours: 2, fee: 150, fact: 'Det koboltblå huset "La Casa Azul" i stadsdelen Coyoacán var konstnärinnan Frida Kahlos födelsehem och ateljé, fyllt av färgstark mexikansk folkkonst.' },
    chapultepec: { name: 'Chapultepec-slottet', city: 'mexicocity', photo: 'assets/photos/chapultepec.jpg', hours: 2, fee: 80, fact: 'På en grön kulle mitt i stadens jättepark ligger det enda riktiga kungliga slottet på den nordamerikanska kontinenten.' },
    xochimilco: { name: 'Xochimilco-kanalerna', city: 'mexicocity', photo: 'assets/photos/xochimilco.jpg', hours: 3, fee: 110, fact: 'De sista resterna av aztekernas urgamla flytande trädgårdar (chinampas), där färgglada träbåtar (trajineras) glider fram ackompanjerade av mariachimusik.' }
  };

  const NEW_WONDERS = {
    greatwall: {
      name: 'Kinesiska muren',
      from: 'peking',
      region: 'asien',
      lat: 40.43,
      lon: 116.57,
      photo: 'assets/photos/greatwall.jpg',
      hoursEach: 2,
      transport: 180,
      fee: 160,
      visitHours: 4,
      gearVisitHours: 2,
      gear: 'kangor',
      souvenir: 'mursten_kina',
      lodge: 240,
      fact: 'Som en jättelik stendrake slingrar sig världens längsta försvarsverk över bergskammarna norr om Peking. Muren byggdes om och byggdes ut av flera dynastier under mer än två tusen år.'
    }
  };

  const NEW_SOUVENIRS = {
    baskermossa: { name: 'Fransk basker', origin: 'paris', price: 140, kind: 'samlar', desc: 'Klassisk mörkblå yllebasker från Montmartre.' },
    parfym_paris: { name: 'Parfymflaska', origin: 'paris', price: 290, kind: 'handel', desc: 'Exklusiv fransk parfym, högt försäljningsvärde i fjärran länder!' },
    olivolja: { name: 'Toskansk olivolja', origin: 'rom', price: 110, kind: 'handel', desc: 'Kallpressad grön olivolja i vacker keramikflaska.' },
    vespamodell: { name: 'Vespa i plåt', origin: 'rom', price: 170, kind: 'samlar', desc: 'Röd retro-miniatyr av Italiens ikoniska skoter.' },
    earlgrey: { name: 'Plåtburk Earl Grey', origin: 'london', price: 95, kind: 'handel', desc: 'Aromatiskt svart te med bergamott från en klassisk tehandel.' },
    paraply_london: { name: 'Brittiskt paraply', origin: 'london', price: 210, kind: 'samlar', desc: 'Stilrent svart paraply med handtag i böjt trä.' },
    turkisk_matta: { name: 'Vävd kelimmatta', origin: 'istanbul', price: 320, kind: 'handel', desc: 'Handvävd liten matta i rika mönster, betingar topppris i Amerika!' },
    kaffekanna: { name: 'Kopparkanna (Cezve)', origin: 'istanbul', price: 130, kind: 'samlar', desc: 'Blankpolerad liten kopparkanna för äkta turkiskt kaffe.' },
    thaisiden: { name: 'Thaisiden-scarf', origin: 'bangkok', price: 140, kind: 'handel', desc: 'Skimrande handvävt siden, billigt i Bangkok, dyrt i Europa!' },
    tuktuk_modell: { name: 'Tuk-tuk i mässing', origin: 'bangkok', price: 85, kind: 'samlar', desc: 'Charmig miniatyr av Bangkoks trehjuliga motorriksha.' },
    jadestatyett: { name: 'Liten jadedrake', origin: 'peking', price: 260, kind: 'samlar', desc: 'Utskuren lyckobringande drake i grön jadesten.' },
    tekanna_kina: { name: 'Yixing-tekanna', origin: 'peking', price: 190, kind: 'handel', desc: 'Liten oglaserad lerkanna som samlar smak för varje bryggning.' },
    mursten_kina: { name: 'Medaljong från Muren', origin: 'greatwall', price: 220, kind: 'samlar', desc: 'Unik minnesmedaljong i brons från expeditionen till Kinesiska muren.' },
    bumerang: { name: 'Målad bumerang', origin: 'sydney', price: 160, kind: 'samlar', desc: 'Traditionellt prickmålad bumerang i eukalyptusträ.' },
    opal_sydney: { name: 'Australisk opal', origin: 'sydney', price: 360, kind: 'handel', desc: 'Färgskiftande ädelsten, ger enorm vinst på andra sidan klotet!' },
    rooiboste: { name: 'Rooibos-te', origin: 'kapstaden', price: 75, kind: 'handel', desc: 'Rött sydafrikanskt örtte från Cederbergbergen.' },
    strutsegg: { name: 'Målat strutsegg', origin: 'kapstaden', price: 210, kind: 'samlar', desc: 'Konstnärligt dekorerat skal med savannmotiv.' },
    kaffebonor_rio: { name: 'Brasilianska kaffebönor', origin: 'rio', price: 85, kind: 'handel', desc: 'Nymalet mörkrostat specialkaffe, hett eftertraktat i norr!' },
    karnevalsmask: { name: 'Karnevalsmask', origin: 'rio', price: 180, kind: 'samlar', desc: 'Fjäderprydd, glittrande mask från karnevalen i Rio.' },
    sombrero: { name: 'Broderad sombrero', origin: 'mexicocity', price: 150, kind: 'samlar', desc: 'Färgstark mexikansk hatt med silvertrådsbroderier.' },
    aztekkalender: { name: 'Aztekisk solsten', origin: 'mexicocity', price: 220, kind: 'samlar', desc: 'Detaljrik replika i vulkansten av aztekernas berömda kalender.' }
  };

  const NEW_SHOPKEEPERS = {
    paris: { name: 'Madame Colette på Rue Mouffetard', greet: 'Bonjour! Kvalitet och elegans kostar, men en charmig resenär kan alltid pröva lyckan.' },
    rom: { name: 'Giuseppe på Campo de\' Fiori', greet: 'Buongiorno amico! Färsk olivolja och romerska minnen, vad bjuder du?' },
    london: { name: 'Mr. Arthur på Portobello Road', greet: 'Splendid day! Antikviteter och te från hela samväldet. Ska vi göra affär?' },
    istanbul: { name: 'Mehmet i Stora basaren', greet: 'Hoş geldiniz! Här i basaren vore det nästan oartigt att INTE pruta lite!' },
    bangkok: { name: 'Nong på Chatuchak-marknaden', greet: 'Sawasdee! Siden, hantverk och bra priser, lägg ett leende bud!' },
    peking: { name: 'Mästare Wei på Panjiayuan', greet: 'Nǐ hǎo! Jade, porslin och te. Visa din respekt så kan vi tala om priset.' },
    sydney: { name: 'Jack på The Rocks Market', greet: 'G\'day mate! Äkta opaler och bumeranger rakt från Australien!' },
    kapstaden: { name: 'Thabo på Greenmarket Square', greet: 'Välkommen till Kapstaden! Handla lokalt hantverk innan du seglar vidare!' },
    rio: { name: 'Camila på Feira Hippie', greet: 'Olá! Färger, kaffe och sambaglädje, ta med lite av Rio i ryggsäcken!' },
    mexicocity: { name: 'Mateo på Mercado de la Ciudadela', greet: '¡Bienvenidos! Mexikanskt hantverk i världsklass, kom med ett bra bud!' }
  };

  const NEW_TAVERNS = {
    paris: { name: 'Café de Flore-hörnan', drink: 'en runda café au lait & macaroner', drinkCost: 140, vibe: 'Runda marmorbord, lågmäld dragspelsmusik och författare i hörnet.' },
    rom: { name: 'Osteria del Vicolo', drink: 'en karaff husets druvjuice & bruschetta', drinkCost: 110, vibe: 'Rödrutiga dukar, varma stenvalv och livliga diskussioner om fotboll.' },
    london: { name: 'The Crown & Compass Pub', drink: 'en runda ale & fish and chips', drinkCost: 150, vibe: 'Mörk ekpanel, mässingskranar och globetrotters som jämför kartor.' },
    istanbul: { name: 'Bosporen Çay-Salong', drink: 'glas med rykande turkiskt te & lokum', drinkCost: 70, vibe: 'Tulpanglas som klirrar, utsikt över sundet och berättelser från Sidenvägen.' },
    bangkok: { name: 'Khao San Bamboo Bar', drink: 'en runda isad thailändsk mangojuice', drinkCost: 65, vibe: 'Ljusslingor, fläktar i taket och ryggsäcksresenärer från alla hörn av världen.' },
    peking: { name: 'Drakens Tehus', drink: 'en kanna jasminte & ångade dumplings', drinkCost: 85, vibe: 'Röda lyktor, träsniderier och lågmält skvaller om norra Kinas rutter.' },
    sydney: { name: 'The Harbour Tavern', drink: 'en runda kall ingefärsöl', drinkCost: 145, vibe: 'Saltstänkt bris från hamnen, surfbrädor på väggen och glada aussies.' },
    kapstaden: { name: 'Cape Mariner\'s Inn', drink: 'en runda rooibos-iste & biltong', drinkCost: 90, vibe: 'Gamla sjökort på väggarna och sjömän som just rundat Godahoppsudden.' },
    rio: { name: 'Boteco da Lapa', drink: 'en runda färskpressad lime & acai', drinkCost: 85, vibe: 'Bossa nova ur högtalarna, öppna fönster och skön kvällsvärme.' },
    mexicocity: { name: 'Cantina La Antigualla', drink: 'en runda agua fresca & tacos', drinkCost: 80, vibe: 'Kaklade väggar, gitarrtoner och äventyrare på väg genom Latinamerika.' }
  };

  const NEW_RELAYS = [
    { id: 'relay_paris_rom', from: 'paris', to: 'rom', giver: 'Konsthandlaren Henri', itemName: 'Inramad skissrulle', desc: 'Ta med denna akvarellskiss till min kollega i Rom!', rewardCash: 850, freeHotel: true },
    { id: 'relay_rom_istanbul', from: 'rom', to: 'istanbul', giver: 'Arkeologen Sofia', itemName: 'Antik myntask', desc: 'Ett museum i Istanbul väntar på dessa avgjutningar av romerska mynt.', rewardCash: 950, freeHotel: true },
    { id: 'relay_london_ny', from: 'london', to: 'newyork', giver: 'Redaktören Eleanor', itemName: 'Förseglat pressmanus', desc: 'Kan du leverera detta manuskript till vår korrespondent i New York?', rewardCash: 1200, freeHotel: true },
    { id: 'relay_istanbul_bangkok', from: 'istanbul', to: 'bangkok', giver: 'Kryddskepparen Kemal', itemName: 'Sällsynt saffranspaket', desc: 'En känd kock i Bangkok betalar rejält om du tar med detta paket österut!', rewardCash: 1350, freeHotel: true },
    { id: 'relay_bangkok_peking', from: 'bangkok', to: 'peking', giver: 'Sidenhandlaren Mali', itemName: 'Gyllene sidenrulle', desc: 'Leverera denna sidenrulle till en skräddare i Peking för fin hittelön!', rewardCash: 1050, freeHotel: true },
    { id: 'relay_peking_sydney', from: 'peking', to: 'sydney', giver: 'Botanikern Dr. Chen', itemName: 'Fröpåse med sällsynta orkidéer', desc: 'Botaniska trädgården i Sydney väntar på dessa frön!', rewardCash: 1300, freeHotel: true },
    { id: 'relay_sydney_sf', from: 'sydney', to: 'sanfrancisco', giver: 'Kapten Bruce', itemName: 'Loggbok från Söderhavet', desc: 'Ta denna sjöfartsloggbok över Stilla havet till San Francisco!', rewardCash: 1450, freeHotel: true },
    { id: 'relay_kap_rio', from: 'kapstaden', to: 'rio', giver: 'Geologen Zanele', itemName: 'Mineralprov i mässingsask', desc: 'En forskare i Rio de Janeiro väntar på detta prov från Taffelberget!', rewardCash: 1250, freeHotel: true },
    { id: 'relay_rio_mex', from: 'rio', to: 'mexicocity', giver: 'Musikern Thiago', itemName: 'Handgjorda gitarrsträngar', desc: 'Ta med dessa strängar till en mariachimusiker i Mexico City!', rewardCash: 1200, freeHotel: true },
    { id: 'relay_mex_london', from: 'mexicocity', to: 'london', giver: 'Kuratorn Elena', itemName: 'Historisk kartrulle', desc: 'British Museum i London väntar på denna gamla sjökortsrulle!', rewardCash: 1400, freeHotel: true }
  ];

  const NEW_EVENTS = [
    { id: 'rio_carnival', city: 'rio', title: 'Karneval i Rio', startDay: 4, endDay: 14, effectText: '+40 % extra på souvenirer & +30 % på jobb i Rio!', sellBonus: 0.40, jobBonus: 0.30, color: '#f39c12' },
    { id: 'paris_fashion', city: 'paris', title: 'Modevecka i Paris', startDay: 1, endDay: 9, effectText: '+35 % extra på alla souvenirer du säljer i Paris!', sellBonus: 0.35, color: '#e84393' },
    { id: 'bangkok_songkran', city: 'bangkok', title: 'Vattenfestival i Bangkok', startDay: 7, endDay: 18, effectText: '20 % billigare inköp i basaren & 20 % billigare flyg hit!', buyDiscount: 0.20, flightMult: 0.80, color: '#00cec9' },
    { id: 'sydney_vivid', city: 'sydney', title: 'Ljusfestival i Sydney', startDay: 12, endDay: 26, effectText: '+35 % extra jobblön i Sydney!', jobBonus: 0.35, color: '#74b9ff' }
  ];

  // --- 95+ NYA VARIERADE FRÅGOR (2–6 val, fritext, mässingsmätare & peka-på-globen!) ---
  const NEW_QUESTIONS = [
    // PARIS
    { id: 'par_eif_1', city: 'paris', place: 'eiffel', region: 'europa', type: 'num', difficulty: 2, q: 'Vilket årtal invigdes Eiffeltornet till världsutställningen i Paris?', ans: 1889, min: 1840, max: 1930, step: 1, unit: 'år', explain: 'Eiffeltornet stod klart 1889 för att fira 100-årsminnet av franska revolutionen 1789 och var världens högsta byggnad i över 40 år.' },
    { id: 'par_eif_2', city: 'paris', place: 'eiffel', region: 'europa', type: 'mc', difficulty: 1, q: 'Sant eller falskt: Eiffeltornet kan växa upp till 15 centimeter på varma sommardagar.', a: ['Sant', 'Falskt'], explain: 'Sant! Eftersom tornet är byggt av järn expanderar metallen i sommarvärmen, vilket gör att toppen höjer sig upp till 15 cm.' },
    { id: 'par_lou_1', city: 'paris', place: 'louvre', region: 'europa', type: 'text', difficulty: 1, q: 'Vilket världsberömt porträtt av Leonardo da Vinci lockar miljoner besökare till Louvren varje år?', ans: 'Mona Lisa', accept: ['mona lisa', 'monalisa', 'gioconda'], explain: 'Mona Lisa målades av Leonardo da Vinci i början av 1500-talet och hänger bakom skottsäkert glas i Louvren.' },
    { id: 'par_lou_2', city: 'paris', place: 'louvre', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilken känd antik grekisk marmorstaty utan armar finns utställd på Louvren?', a: ['Venus från Milo', 'David', 'Tänkaren', 'Diskuskastaren', 'Laokoon'], explain: 'Venus från Milo hittades på den grekiska ön Milos 1820 och är ett av antikens mest ikoniska konstverk.' },
    { id: 'par_nd_1', city: 'paris', place: 'notredame', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken fransk författare skrev den berömda romanen "Ringaren i Notre-Dame" (1831)?', a: ['Victor Hugo', 'Alexandre Dumas', 'Jules Verne', 'Émile Zola', 'Honoré de Balzac'], explain: 'Victor Hugos roman blev en sådan succé att den räddade den då förfallna katedralen från rivning och ledde till en stor restaurering!' },
    { id: 'par_nd_2', city: 'paris', place: 'notredame', region: 'europa', type: 'text', difficulty: 1, q: 'Vad heter floden som rinner rakt genom Paris och omger ön där Notre-Dame står?', ans: 'Seine', accept: ['seine'], explain: 'Floden Seine är 777 km lång och delar Paris i den norra (Rive Droite) och södra (Rive Gauche) stranden.' },
    { id: 'par_mm_1', city: 'paris', place: 'montmartre', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilken berömd röd väderkvarn och kabaréscen ligger vid foten av Montmartre?', a: ['Moulin Rouge', 'Folies Bergère', 'Lido', 'Olympia'], explain: 'Moulin Rouge öppnade 1889, samma år som Eiffeltornet, och blev odödliggjord av konstnären Henri de Toulouse-Lautrec.' },
    { id: 'par_mm_2', city: 'paris', place: 'montmartre', region: 'europa', type: 'mc', difficulty: 1, q: 'Vad betyder det franska ordet "Sacré-Cœur" på svenska?', a: ['Heliga hjärtat', 'Vita berget', 'Korsets kyrka'], explain: 'Basilikan Sacré-Cœur ("Heliga hjärtat") byggdes i vit travertinsten som blir ännu vitare när det regnar!' },
    { id: 'par_job_1', city: 'paris', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken berömd paradgata i Paris leder från Place de la Concorde upp till Triumfbågen?', a: ['Champs-Élysées', 'Rue de Rivoli', 'Boulevard Haussmann', 'Saint-Germain'], explain: 'Avenue des Champs-Élysées är nästan 2 km lång och målgång för cykeltävlingen Tour de France.' },
    { id: 'par_job_2', city: 'paris', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken valuta används i Frankrike idag?', a: ['Euro', 'Franc', 'Pund', 'Krona'], explain: 'Frankrike ersatte den franska francen med euron år 2002.' },
    { id: 'par_job_3', city: 'paris', place: 'job', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilken fransk nationaldag firas den 14 juli till minne av stormningen av Bastiljen 1789?', a: ['Bastiljdagen', 'Segerdagen', 'Republikdagen'], explain: 'Den 14 juli 1789 stormades fängelset Bastiljen i Paris, vilket blev startskottet för franska revolutionen.' },
    { id: 'par_job_4', city: 'paris', place: 'job', region: 'europa', type: 'num', difficulty: 2, q: 'Hur många miljoner invånare bor i storstadsområdet Paris (ungefär)?', ans: 11, min: 3, max: 25, step: 1, unit: 'miljoner', explain: 'Själva Paris stad har drygt 2,1 miljoner invånare, medan hela storstadsområdet (Île-de-France) har cirka 11–12 miljoner invånare.' },

    // ROM
    { id: 'rom_col_1', city: 'rom', place: 'colosseum', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken berömd flod rinner genom Rom?', a: ['Tibern', 'Po', 'Arno', 'Rubicon', 'Donau'], explain: 'Enligt legenden räddades Roms grundare Romulus och Remus ur floden Tibern av en varginna.' },
    { id: 'rom_col_2', city: 'rom', place: 'colosseum', region: 'europa', type: 'mc', difficulty: 2, q: 'Sant eller falskt: Colosseum hette ursprungligen "Flaviska amfiteatern".', a: ['Sant', 'Falskt'], explain: 'Sant! Namnet Colosseum kom senare från en jättelik kolossalstaty av kejsar Nero som stod intill.' },
    { id: 'rom_tre_1', city: 'rom', place: 'trevi', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilken klassisk svensk skådespelerska badade i Fontana di Trevi i Fellinis film "Det ljuva livet" (1960)?', a: ['Anita Ekberg', 'Ingrid Bergman', 'Greta Garbo', 'Bibi Andersson'], explain: 'Scenen där Anita Ekberg vadar ut i Fontana di Trevi i aftonklänning är en av filmhistoriens mest ikoniska!' },
    { id: 'rom_tre_2', city: 'rom', place: 'trevi', region: 'europa', type: 'mc', difficulty: 1, q: 'Vad händer med de cirka 1,5 miljoner euro i mynt som turister kastar i Fontana di Trevi varje år?', a: ['De skänks till välgörenhet', 'De betalar stadens elräkning', 'De smälts ner till nya mynt'], explain: 'Välgörenhetsorganisationen Caritas samlar regelbundet in mynten för att hjälpa behövande i Rom.' },
    { id: 'rom_vat_1', city: 'rom', place: 'vatican', region: 'europa', type: 'text', difficulty: 1, q: 'Vilken berömd renässanskonstnär målade taket i Sixtinska kapellet i Vatikanen?', ans: 'Michelangelo', accept: ['michelangelo', 'mikelangelo'], explain: 'Michelangelo arbetade på ställningar under taket i fyra år (1508–1512) för att måla de världsberömda freskerna, bland annat "Adams skapelse".' },
    { id: 'rom_vat_2', city: 'rom', place: 'vatican', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilket lands medborgare utgör påvens traditionella livvakt i färgglada uniformer?', a: ['Schweiz', 'Italien', 'Österrike', 'Spanien', 'Frankrike'], explain: 'Schweizergardet har vaktat påven i Vatikanen ända sedan 1506!' },
    { id: 'rom_pan_1', city: 'rom', place: 'pantheon', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilket antikt språk var det officiella språket i Romarriket?', a: ['Latin', 'Grekiska', 'Etruskiska', 'Italienska'], explain: 'Latin är moderspråk till dagens romanska språk: italienska, spanska, franska, portugisiska och rumänska.' },
    { id: 'rom_pan_2', city: 'rom', place: 'pantheon', region: 'europa', type: 'globe', difficulty: 2, q: 'Peka på 3D-jordgloben: Var ligger den berömda vulkanen Vesuvius (nära Neapel, söder om Rom)?', targetLat: 40.82, targetLon: 14.43, targetName: 'Vesuvius', startLat: 42, startLon: 12, explain: 'Vesuvius ligger vid Neapelbukten och begravde staden Pompeji i aska år 79 e.Kr.' },
    { id: 'rom_job_1', city: 'rom', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'På hur många kullar sägs det antika Rom ursprungligen ha byggts?', a: ['7 kullar', '3 kullar', '5 kullar', '12 kullar'], explain: 'Roms sju klassiska kullar är bland annat Palatinen, Kapitolium och Aventinen.' },
    { id: 'rom_job_2', city: 'rom', place: 'job', region: 'europa', type: 'text', difficulty: 1, q: 'Vad heter den italienska maträtten som härstammar från Neapel med tomatsås, mozzarella och basilika?', ans: 'Pizza Margherita', accept: ['pizza', 'margherita'], explain: 'Enligt traditionen skapades Pizza Margherita 1889 i den italienska flaggans färger: röd tomat, vit mozzarella och grön basilika!' },
    { id: 'rom_job_3', city: 'rom', place: 'job', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilken känd italiensk stad är känd för sina kanaler och gondoler?', a: ['Venedig', 'Milano', 'Florens', 'Bologna', 'Turin'], explain: 'Venedig är byggd på över 100 små öar i en lagun vid Adriatiska havet.' },
    { id: 'rom_job_4', city: 'rom', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'Vad kallas den romerske fältherren som mördades i senaten år 44 f.Kr.?', a: ['Julius Caesar', 'Augustus', 'Nero', 'Marcus Aurelius'], explain: 'Julius Caesar mördades på "Idus Martiae" (15 mars) år 44 f.Kr., vilket banade väg för kejsardömet under Augustus.' },

    // LONDON
    { id: 'lon_tow_1', city: 'london', place: 'towerlondon', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilka ovärderliga skatter förvaras under hård bevakning inne i Tower of London?', a: ['De brittiska kronjuvelerna', 'Magna Carta', 'Rosettastenen', 'Shakespeares manuskript'], explain: 'Kronjuvelerna, inklusive imperiekronan med diamanten Cullinan II, vaktas av Yeoman Warders (Beefeaters).' },
    { id: 'lon_tow_2', city: 'london', place: 'towerlondon', region: 'europa', type: 'text', difficulty: 1, q: 'Vad heter den berömda floden som slingrar sig genom centrala London?', ans: 'Themsen', accept: ['themsen', 'thames'], explain: 'Themsen (River Thames) är 346 km lång och har tidvatten ända upp genom centrala London!' },
    { id: 'lon_big_1', city: 'london', place: 'bigben', region: 'europa', type: 'mc', difficulty: 2, q: 'Sant eller falskt: "Big Ben" är egentligen smeknamnet på den stora slagklockan inuti tornet, inte själva tornet.', a: ['Sant', 'Falskt'], explain: 'Sant! Själva tornet heter sedan 2012 officiellt Elizabeth Tower, medan den 13,7 ton tunga klockan kallas Big Ben.' },
    { id: 'lon_big_2', city: 'london', place: 'bigben', region: 'europa', type: 'mc', difficulty: 1, q: 'Vad heter den välkända tunnelbanan i London i folkmun?', a: ['The Tube', 'The Metro', 'The Sub', 'The Loop'], explain: 'London Underground ("The Tube") öppnade redan 1863 och är världens allra äldsta tunnelbana!' },
    { id: 'lon_bm_1', city: 'london', place: 'britishmuseum', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilken berömd egyptisk sten med tre skriftspråk är en av British Museums mest besökta föremål?', a: ['Rosettastenen', 'Stele of Ur', 'Cyrus cylinder', 'Hammurabis lag'], explain: 'Rosettastenen har stått utställd på British Museum nästan oavbrutet sedan 1802.' },
    { id: 'lon_bm_2', city: 'london', place: 'britishmuseum', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken känd fiktiv detektiv hade sin adress på 221B Baker Street i London?', a: ['Sherlock Holmes', 'Hercule Poirot', 'Miss Marple', 'James Bond'], explain: 'Sir Arthur Conan Doyle lät Sherlock Holmes och dr Watson bo på Baker Street, där det idag finns ett eget Sherlock Holmes-museum.' },
    { id: 'lon_buc_1', city: 'london', place: 'buckingham', region: 'europa', type: 'mc', difficulty: 1, q: 'Vem blev Storbritanniens monark efter drottning Elizabeth II år 2022?', a: ['Kung Charles III', 'Kung William V', 'Kung George VII', 'Kung Edward IX'], explain: 'Charles III besteg tronen i september 2022 och kröntes i Westminster Abbey i maj 2023.' },
    { id: 'lon_buc_2', city: 'london', place: 'buckingham', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken valuta betalar man med i London?', a: ['Brittiskt pund', 'Euro', 'Dollar', 'Shilling'], explain: 'Storbritannien behöll pund sterling (£) även under åren i EU.' },
    { id: 'lon_job_1', city: 'london', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'På vilken sida av vägen kör bilar och röda dubbeldäckare i Storbritannien?', a: ['Vänster sida', 'Höger sida'], explain: 'Storbritannien har haft vänstertrafik i århundraden, precis som Sverige hade fram till Dagen H år 1967!' },
    { id: 'lon_job_2', city: 'london', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken engelsk dramatiker skrev "Hamlet" och "Romeo och Julia" och spelade på Globe Theatre i London?', a: ['William Shakespeare', 'Charles Dickens', 'Oscar Wilde', 'Jane Austen'], explain: 'William Shakespeare (1564–1616) är världens mest spelade dramatiker och hans teater The Globe är idag rekonstruerad vid Themsen.' },
    { id: 'lon_job_3', city: 'london', place: 'job', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilken stadsdel i östra London har gett namn åt nollmeridianen (GMT) som delar jorden i öst och väst?', a: ['Greenwich', 'Chelsea', 'Camden', 'Westminster', 'Soho'], explain: 'Vid det kungliga observatoriet i Greenwich kan man stå med ena foten på östra och andra på västra halvklotet!' },
    { id: 'lon_job_4', city: 'london', place: 'job', region: 'europa', type: 'num', difficulty: 2, q: 'Ungefär hur många miljoner invånare bor i Storlondon (Greater London) idag?', ans: 9, min: 3, max: 18, step: 1, unit: 'miljoner', explain: 'Greater London har idag omkring 9 miljoner invånare och över 300 talade språk!' },

    // ISTANBUL
    { id: 'ist_hag_1', city: 'istanbul', place: 'hagiasophia', region: 'europa', type: 'text', difficulty: 1, q: 'Vad hette Istanbul under över tusen år som huvudstad i det Bysantinska riket (och innan 1930)?', ans: 'Konstantinopel', accept: ['konstantinopel', 'constantinople', 'byzantion'], explain: 'Kejsar Konstantin gjorde staden till Romarrikets nya huvudstad år 330 e.Kr. Namnet Istanbul blev det enda officiella namnet 1930.' },
    { id: 'ist_hag_2', city: 'istanbul', place: 'hagiasophia', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilka två världsdelar möts mitt i Istanbul vid sundet Bosporen?', a: ['Europa och Asien', 'Europa och Afrika', 'Asien och Afrika'], explain: 'Istanbul är världens mest kända transkontinentala storstad, du kan ta en färja från Europa till Asien på 20 minuter!' },
    { id: 'ist_blu_1', city: 'istanbul', place: 'bluemosque', region: 'europa', type: 'num', difficulty: 2, q: 'Hur många höga minareter omger den berömda Blå moskén i Istanbul?', ans: 6, min: 1, max: 12, step: 1, unit: 'st', explain: 'Blå moskén har sex slanka minareter, något som väckte stor uppståndelse 1616 eftersom bara den heliga moskén i Mecka hade lika många.' },
    { id: 'ist_blu_2', city: 'istanbul', place: 'bluemosque', region: 'europa', type: 'mc', difficulty: 1, q: 'Sant eller falskt: Istanbul är Turkiets officiella huvudstad.', a: ['Falskt', 'Sant'], explain: 'Falskt! Istanbul är Turkiets största stad, men sedan 1923 är Ankara landets huvudstad.' },
    { id: 'ist_gb_1', city: 'istanbul', place: 'grandbazaar', region: 'europa', type: 'mc', difficulty: 1, q: 'Vad heter Turkiets officiella valuta?', a: ['Turkisk lira', 'Dinar', 'Drachma', 'Euro', 'Pund'], explain: 'I Stora basaren och resten av Turkiet betalar man med turkisk lira (TRY).' },
    { id: 'ist_gb_2', city: 'istanbul', place: 'grandbazaar', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilket klassiskt sött gelégodis med pistage och rosenvatten är känt som "Turkish Delight"?', a: ['Lokum', 'Baklava', 'Halva', 'Künefe'], explain: 'Lokum har tillverkats i Istanbul sedan slutet av 1700-talet och serveras ofta till en liten kopp starkt turkiskt kaffe.' },
    { id: 'ist_top_1', city: 'istanbul', place: 'topkapi', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilket mäktigt rike hade sitt centrum i Topkapipalatset från 1400-talet fram till första världskriget?', a: ['Osmanska riket', 'Persiska riket', 'Romerska riket', 'Habsburgska riket'], explain: 'Osmanska riket styrdes av sultaner från Istanbul och sträckte sig som störst från Wien till Bagdad och Nordafrika.' },
    { id: 'ist_top_2', city: 'istanbul', place: 'topkapi', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilket innanhav ligger direkt norr om Bosporen?', a: ['Svarta havet', 'Kaspiska havet', 'Röda havet', 'Adriatiska havet'], explain: 'Bosporen förbinder Svarta havet med Marmarasjön och vidare ut i Medelhavet.' },
    { id: 'ist_job_1', city: 'istanbul', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'Vem grundade den moderna republiken Turkiet 1923 och fick hedersnamnet "Atatürk" (turkarnas fader)?', a: ['Mustafa Kemal', 'Suleyman den store', 'Mehmed II', 'Saladin'], explain: 'Mustafa Kemal Atatürk införde bland annat det latinska alfabetet och moderniserade staten efter Osmanska rikets fall.' },
    { id: 'ist_job_2', city: 'istanbul', place: 'job', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilken svensk kung bodde i flera år i det Osmanska riket efter nederlaget vid Poltava 1709?', a: ['Karl XII', 'Gustav II Adolf', 'Gustav III', 'Karl XI'], explain: 'Karl XII vistades i Bender i Osmanska riket och tog med sig både kåldolmar och kaffevanor hem till Sverige!' },
    { id: 'ist_job_3', city: 'istanbul', place: 'job', region: 'europa', type: 'text', difficulty: 1, q: 'Vad heter Turkiets huvudstad som ligger inne i centrala Anatolien?', ans: 'Ankara', accept: ['ankara'], explain: 'Ankara blev republiken Turkiets huvudstad den 13 oktober 1923.' },
    { id: 'ist_job_4', city: 'istanbul', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilket berömt lyxtåg gick historiskt hela vägen från Paris till Sirkeci-stationen i Istanbul?', a: ['Orientexpressen', 'Transsibiriska järnvägen', 'Glaciärexpressen'], explain: 'Orientexpressen blev världsberömd inte minst genom Agatha Christies deckare "Mordet på Orientexpressen".' },

    // BANGKOK
    { id: 'bkk_gp_1', city: 'bangkok', place: 'grandpalace', region: 'asien', type: 'mc', difficulty: 1, q: 'Vilken religion är den absolut största i Thailand, vars gyllene tempel präglar hela Bangkok?', a: ['Buddhism', 'Hinduism', 'Islam', 'Shinto'], explain: 'Över 90 % av Thailands befolkning är theravadabuddhister och landet har över 40 000 tempel (wat).' },
    { id: 'bkk_gp_2', city: 'bangkok', place: 'grandpalace', region: 'asien', type: 'mc', difficulty: 1, q: 'Vad hette Thailand officiellt fram till 1939?', a: ['Siam', 'Burma', 'Ceylon', 'Indokina', 'Formosa'], explain: 'Kungariket Siam bytte namn till Thailand ("de frias land"), landet är det enda i Sydostasien som aldrig koloniserades av en europeisk makt!' },
    { id: 'bkk_wa_1', city: 'bangkok', place: 'watarun', region: 'asien', type: 'mc', difficulty: 1, q: 'Vad heter Thailands officiella valuta?', a: ['Baht', 'Rupie', 'Ringgit', 'Dong', 'Yen'], explain: 'Den thailändska valutan baht (THB) har använts i hundratals år.' },
    { id: 'bkk_wa_2', city: 'bangkok', place: 'watarun', region: 'asien', type: 'mc', difficulty: 2, q: 'Vad kallas det traditionella thailändska nyåret i april som firas med världens största vattenkrig?', a: ['Songkran', 'Diwali', 'Hanami', 'Tet'], explain: 'Under Songkran stänker man vatten på varandra som en symbol för rening och välgång inför det nya året.' },
    { id: 'bkk_wp_1', city: 'bangkok', place: 'watpho', region: 'asien', type: 'mc', difficulty: 1, q: 'Vad heter Thailands världsberömda wokade nudelrätt med jordnötter, lime och tamarind?', a: ['Pad Thai', 'Pho', 'Ramen', 'Biryani'], explain: 'Pad Thai blev Thailands nationalrätt på 1930- och 40-talen och lagas i varenda gathörn i Bangkok.' },
    { id: 'bkk_wp_2', city: 'bangkok', place: 'watpho', region: 'asien', type: 'mc', difficulty: 2, q: 'Sant eller falskt: Bangkoks fullständiga ceremoniella namn på thailändska har över 160 bokstäver och har världsrekord som längsta ortnamn.', a: ['Sant', 'Falskt'], explain: 'Sant! Lokalbefolkningen förkortar det tack och lov till "Krung Thep" ("Änglarnas stad").' },
    { id: 'bkk_cp_1', city: 'bangkok', place: 'chaophraya', region: 'asien', type: 'text', difficulty: 1, q: 'Vad kallas de karaktäristiska trehjuliga motorrikshorna som kryssar genom Bangkoks trafik?', ans: 'Tuk-tuk', accept: ['tuktuk', 'tuk-tuk', 'tuk tuk'], explain: 'Namnet tuk-tuk kommer helt enkelt från det smattrande ljudet från den lilla tvåtaktsmotorn!' },
    { id: 'bkk_cp_2', city: 'bangkok', place: 'chaophraya', region: 'asien', type: 'mc', difficulty: 2, q: 'Vilken känd thailändsk kampsport kallas "de åtta lemmarnas konst" eftersom både knän och armbågar används?', a: ['Muay Thai', 'Karate', 'Taekwondo', 'Judo'], explain: 'Muay Thai är Thailands nationalsport med anor från 1500-talets krigarkonst.' },
    { id: 'bkk_job_1', city: 'bangkok', place: 'job', region: 'asien', type: 'mc', difficulty: 1, q: 'Vilket grannland ligger direkt öster om Thailand, känt för tempelstaden Angkor Wat?', a: ['Kambodja', 'Vietnam', 'Malaysia', 'Filippinerna'], explain: 'Angkor Wat i Kambodja är världens största religiösa monument och ett av Sydostasiens stora resmål.' },
    { id: 'bkk_job_2', city: 'bangkok', place: 'job', region: 'asien', type: 'mc', difficulty: 1, q: 'Vilken berömd illaluktande men älskad tropisk frukt kallas "frukternas konung" i Sydostasien?', a: ['Durian', 'Mango', 'Papaya', 'Litchi'], explain: 'Durian luktar så kraftigt att den ofta är förbjuden att ta med på hotell och i tunnelbanan i Bangkok!' },
    { id: 'bkk_job_3', city: 'bangkok', place: 'job', region: 'asien', type: 'mc', difficulty: 2, q: 'Vilket hav ligger söder om Bangkok?', a: ['Siambukten', 'Arabiska havet', 'Korallhavet'], explain: 'Floden Chao Phraya mynnar ut i Siambukten bara några mil söder om Bangkok.' },
    { id: 'bkk_job_4', city: 'bangkok', place: 'job', region: 'asien', type: 'mc', difficulty: 1, q: 'Vilken svensk turistfavorit är Thailands största ö?', a: ['Phuket', 'Koh Samui', 'Koh Lanta', 'Koh Phi Phi'], explain: 'Phuket i Andamansjön är Thailands största ö och har förbindelse till fastlandet via bro.' },

    // PEKING + KINESISKA MUREN
    { id: 'pek_fc_1', city: 'peking', place: 'forbiddencity', region: 'asien', type: 'mc', difficulty: 1, q: 'Vad heter Kinas officiella valuta?', a: ['Yuan', 'Yen', 'Won', 'Hongkongdollar'], explain: 'Valutan heter officiellt Renminbi ("folkets valuta") och enheten heter Yuan (CNY).' },
    { id: 'pek_fc_2', city: 'peking', place: 'forbiddencity', region: 'asien', type: 'mc', difficulty: 1, q: 'Vilket sällsynt svartvitt djur lever vilt i bambuskogarna i västra Kina och är landets nationalsymbol?', a: ['Jättepanda', 'Snöleopard', 'Sibirisk tiger', 'Röd räv'], explain: 'Jättepandan lever vilt i bergskedjorna i Sichuan och äter upp till 12–38 kilo bambu varje dag!' },
    { id: 'pek_ti_1', city: 'peking', place: 'tiananmen', region: 'asien', type: 'mc', difficulty: 1, q: 'Vilket år stod Peking värd för de olympiska sommarspelen med arenan "Fågelboet"?', a: ['2008', '2000', '2012', '2016'], explain: 'Peking arrangerade sommar-OS 2008 och blev 2022 världens första stad som arrangerat både sommar- och vinter-OS!' },
    { id: 'pek_ti_2', city: 'peking', place: 'tiananmen', region: 'asien', type: 'text', difficulty: 1, q: 'Vad heter världens mest talade språk (som modersmål), som talas i Peking?', ans: 'Mandarin', accept: ['mandarin', 'kinesiska'], explain: 'Standardkinesiska (mandarin) har omkring en miljard modersmålstalare världen över.' },
    { id: 'pek_sp_1', city: 'peking', place: 'summerpalace', region: 'asien', type: 'mc', difficulty: 2, q: 'Vilken känd venetiansk resenär besökte Peking (då kallat Khanbalik) på 1200-talet och skrev om Kinas rikedomar?', a: ['Marco Polo', 'Vasco da Gama', 'Christofer Columbus', 'Ibn Battuta'], explain: 'Marco Polo tillbringade 17 år vid Kublai Khans hov och introducerade européerna till både papperspengar och kol.' },
    { id: 'pek_sp_2', city: 'peking', place: 'summerpalace', region: 'asien', type: 'mc', difficulty: 1, q: 'Vilken uppfinning kommer INTE ursprungligen från det forntida Kina?', a: ['Ångmaskinen', 'Papperet', 'Kompassen', 'Krutet', 'Boktryckarkonsten'], explain: 'Kinas "fyra stora uppfinningar" är papper, boktryckarkonst, krut och kompass, medan ångmaskinen utvecklades i Storbritannien på 1700-talet.' },
    { id: 'pek_th_1', city: 'peking', place: 'templeheaven', region: 'asien', type: 'mc', difficulty: 2, q: 'Vad heter Kinas längsta flod (och världens tredje längsta)?', a: ['Yangtze', 'Gula floden', 'Mekong', 'Pärlfloden'], explain: 'Yangtze är 6 300 km lång och rinner från Tibet ända ut till Shanghai.' },
    { id: 'pek_th_2', city: 'peking', place: 'templeheaven', region: 'asien', type: 'mc', difficulty: 1, q: 'Vilken berömd antik armé av tusentals lersoldater hittades 1974 nära staden Xi\'an?', a: ['Terrakottaarmén', 'Bronsarmén', 'Jadegardet'], explain: 'Över 8 000 unika terrakottasoldater i naturlig storlek skapades för att vakta Kinas förste kejsare Qin Shi Huangdis grav.' },
    { id: 'pek_gw_1', city: 'peking', place: 'greatwall', region: 'asien', type: 'mc', difficulty: 1, q: 'Sant eller falskt: Kinesiska muren går lätt att se med blotta ögat från månen.', a: ['Falskt', 'Sant'], explain: 'Falskt! Det är en seglivad myt, muren är lång (över 21 000 km totalt) men bara några meter bred, så den syns inte med blotta ögat från månen.' },
    { id: 'pek_gw_2', city: 'peking', place: 'greatwall', region: 'asien', type: 'num', difficulty: 2, q: 'Ungefär hur många tusen kilometer lång är alla grenar av Kinesiska muren sammantaget?', ans: 21, min: 3, max: 40, step: 1, unit: 'tusen km', explain: 'Enligt Kinas arkeologiska kartläggning 2012 omfattar alla sektioner från olika dynastier totalt 21 196 kilometer!' },
    { id: 'pek_gw_3', city: 'peking', place: 'greatwall', region: 'asien', type: 'mc', difficulty: 2, q: 'Under vilken berömd dynasti (1368–1644) byggdes de mest kända stenmurarna norr om Peking?', a: ['Mingdynastin', 'Handynastin', 'Tangdynastin', 'Songdynastin'], explain: 'Nästan alla berömda stenpartier man besöker idag, som Badaling och Mutianyu, byggdes under Mingdynastin.' },
    { id: 'pek_job_1', city: 'peking', place: 'job', region: 'asien', type: 'mc', difficulty: 1, q: 'Vad heter den gamla handelsvägen som knöt samman Kina med Mellanöstern och Europa?', a: ['Sidenvägen', 'Kryddvägen', 'Bärnstensvägen', 'Tévägen'], explain: 'Längs Sidenvägen färdades inte bara kinesiskt siden utan även kryddor, papper, idéer och konst.' },
    { id: 'pek_job_2', city: 'peking', place: 'job', region: 'asien', type: 'mc', difficulty: 1, q: 'Vad kallas Pekings traditionella, smala bostadsgränder med muromgärdade innergårdar?', a: ['Hutonger', 'Pagoder', 'Medinor', 'Favelor'], explain: 'Många hutonger i centrala Peking har anor från 1200-talets Yuandynasti.' },
    { id: 'pek_job_3', city: 'peking', place: 'job', region: 'asien', type: 'mc', difficulty: 2, q: 'Vilken stor kinesisk hamnstad vid Yangtzeflodens mynning är Kinas folkrikaste stad?', a: ['Shanghai', 'Guangzhou', 'Chengdu', 'Wuhan'], explain: 'Shanghai har över 24 miljoner invånare och är ett av världens största finans- och handelscentra.' },
    { id: 'pek_job_4', city: 'peking', place: 'job', region: 'asien', type: 'text', difficulty: 1, q: 'Vilket känt bergskedjemassiv utgör Kinas sydvästra gräns mot Nepal och Indien?', ans: 'Himalaya', accept: ['himalaya'], explain: 'På gränsen mellan Kina (Tibet) och Nepal reser sig jordens högsta berg, Mount Everest (8 849 m).' },

    // SYDNEY
    { id: 'syd_op_1', city: 'sydney', place: 'sydneyopera', region: 'oceanien', type: 'mc', difficulty: 2, q: 'Från vilket nordiskt land kom arkitekten Jørn Utzon som ritade Operahuset i Sydney?', a: ['Danmark', 'Sverige', 'Norge', 'Finland', 'Island'], explain: 'Dansken Jørn Utzon vann arkitekttävlingen 1957 och klädde de ikoniska snäckskalen med över en miljon glaserade kakelplattor från Höganäs i Sverige!' },
    { id: 'syd_op_2', city: 'sydney', place: 'sydneyopera', region: 'oceanien', type: 'mc', difficulty: 1, q: 'Sant eller falskt: Sydney är Australiens officiella huvudstad.', a: ['Falskt', 'Sant'], explain: 'Falskt! Sydney och Melbourne kunde inte enas om vem som skulle bli huvudstad, så man byggde en helt ny stad mitt emellan: Canberra!' },
    { id: 'syd_hb_1', city: 'sydney', place: 'harbourbridge', region: 'oceanien', type: 'mc', difficulty: 1, q: 'Vilken månad infaller högsommaren i Sydney på södra halvklotet?', a: ['Januari', 'Juli', 'April', 'Oktober'], explain: 'Årstiderna är omvända på södra halvklotet, i Sydney firar man ofta jul på stranden i sommarvärme!' },
    { id: 'syd_hb_2', city: 'sydney', place: 'harbourbridge', region: 'oceanien', type: 'text', difficulty: 1, q: 'Vad heter Australiens officiella huvudstad?', ans: 'Canberra', accept: ['canberra'], explain: 'Canberra invigdes 1913 och rymmer både Australiens parlament och nationalmuseum.' },
    { id: 'syd_bb_1', city: 'sydney', place: 'bondibeach', region: 'oceanien', type: 'mc', difficulty: 1, q: 'Vilket världens största korallrev sträcker sig över 2 300 km längs Australiens nordöstra kust?', a: ['Stora barriärrevet', 'Belizerevet', 'Röda havets rev'], explain: 'Stora barriärrevet syns tydligt från rymden och hyser tusentals arter av fiskar, koraller och sköldpaddor.' },
    { id: 'syd_bb_2', city: 'sydney', place: 'bondibeach', region: 'oceanien', type: 'mc', difficulty: 1, q: 'Vilket pungråttsliknande/pungdjurs-ikoniskt trädlevande djur i Australien äter nästan bara eukalyptusblad?', a: ['Koala', 'Känguru', 'Vombat', 'Näbbdjur'], explain: 'Koalan sover upp till 18–20 timmar per dygn eftersom eukalyptusblad innehåller väldigt lite energi!' },
    { id: 'syd_tr_1', city: 'sydney', place: 'therocks', region: 'oceanien', type: 'mc', difficulty: 2, q: 'Vad heter Australiens urinvånare som har levt på kontinenten i över 50 000 år?', a: ['Aboriginer', 'Maorier', 'Inuiter', 'Samer'], explain: 'Aboriginerna har världens äldsta kontinuerliga kultur och är kända för bland annat drömtidsberättelser och blåsinstrumentet didgeridoo.' },
    { id: 'syd_tr_2', city: 'sydney', place: 'therocks', region: 'oceanien', type: 'globe', difficulty: 2, q: 'Peka på 3D-jordgloben: Var ligger den heliga röda sandstensklippan Uluru (Ayers Rock) i Australiens inland?', targetLat: -25.34, targetLon: 131.03, targetName: 'Uluru', startLat: -25, startLon: 135, explain: 'Uluru reser sig 348 meter över ökenslätten i hjärtat av Australiens "Red Centre" och skiftar dramatiskt i färg vid solnedgången.' },
    { id: 'syd_job_1', city: 'sydney', place: 'job', region: 'oceanien', type: 'mc', difficulty: 1, q: 'Vilken brittisk sjöfarare kartlade Australiens östkust och landsteg vid Botany Bay nära Sydney år 1770?', a: ['James Cook', 'Francis Drake', 'Ferdinand Magellan', 'Abel Tasman'], explain: 'Kapten James Cook seglade med skeppet HMS Endeavour och gjorde tre stora expeditioner i Stilla havet.' },
    { id: 'syd_job_2', city: 'sydney', place: 'job', region: 'oceanien', type: 'mc', difficulty: 1, q: 'Vilket grannland ligger sydost om Australien, känt för maorikultur och "Sagan om ringen"-landskap?', a: ['Nya Zeeland', 'Indonesien', 'Papua Nya Guinea', 'Fiji'], explain: 'Nya Zeeland består av Nordön och Sydön och har Wellington som huvudstad.' },
    { id: 'syd_job_3', city: 'sydney', place: 'job', region: 'oceanien', type: 'mc', difficulty: 2, q: 'Vilken känd ö-delstat ligger strax söder om det australiska fastlandet?', a: ['Tasmanien', 'Queensland', 'Victoria', 'New South Wales'], explain: 'Tasmanien är känd för sin vilda natur och det sällsynta rovpungdjuret tasmansk djävul.' },
    { id: 'syd_job_4', city: 'sydney', place: 'job', region: 'oceanien', type: 'mc', difficulty: 1, q: 'Vad kallas det väldiga, glest befolkade inlandet i Australien?', a: ['The Outback', 'Pampas', 'Savannen', 'Tundran'], explain: 'I The Outback är avstånden mellan gårdar så stora att läkare flyger ut med "Flying Doctors"!' },

    // KAPSTADEN
    { id: 'kap_tm_1', city: 'kapstaden', place: 'tablemountain', region: 'afrika', type: 'mc', difficulty: 2, q: 'Hur många officiella huvudstäder har Sydafrika (där Kapstaden är en av dem)?', a: ['3 (Pretoria, Kapstaden, Bloemfontein)', '1 (Johannesburg)', '2 (Kapstaden, Pretoria)'], explain: 'Sydafrika har tre huvudstäder: Pretoria (regeringen), Kapstaden (parlamentet) och Bloemfontein (högsta domstolen)!' },
    { id: 'kap_tm_2', city: 'kapstaden', place: 'tablemountain', region: 'afrika', type: 'num', difficulty: 2, q: 'Ungefär hur många meter över havet når Taffelbergets högsta punkt (Maclear\'s Beacon)?', ans: 1085, min: 300, max: 2500, step: 15, unit: 'm', explain: 'Taffelberget når 1 085 meter över havet och rymmer fler växtarter än hela Storbritannien!' },
    { id: 'kap_gh_1', city: 'kapstaden', place: 'capegoodhope', region: 'afrika', type: 'mc', difficulty: 2, q: 'Vilken portugisisk sjöfarare rundade Godahoppsudden första gången 1488 och banade väg för sjövägen till Indien?', a: ['Bartolomeu Dias', 'Christofer Columbus', 'Amerigo Vespucci', 'James Cook'], explain: 'Bartolomeu Dias kallade först udden "Stormarnas udde", men den portugisiske kungen döpte om den till Godahoppsudden, hoppet om sjövägen till Indien.' },
    { id: 'kap_gh_2', city: 'kapstaden', place: 'capegoodhope', region: 'afrika', type: 'mc', difficulty: 1, q: 'Vilken oväntad fågelart kan man se vandra fritt på stränderna (t.ex. Boulders Beach) nära Kapstaden?', a: ['Pingviner', 'Lundefåglar', 'Kiwifåglar'], explain: 'En stor koloni afrikanska glasögonpingviner bor året runt på de soliga stränderna vid Boulders Beach utanför Kapstaden!' },
    { id: 'kap_ri_1', city: 'kapstaden', place: 'robbenisland', region: 'afrika', type: 'text', difficulty: 1, q: 'Vilken världsberömd fredspristagare och senare president satt fängslad i 18 år på Robben Island?', ans: 'Nelson Mandela', accept: ['mandela', 'nelson mandela'], explain: 'Nelson Mandela (1918–2013) satt totalt 27 år i fängelse under apartheid och blev 1994 Sydafrikas förste demokratiskt valde president.' },
    { id: 'kap_ri_2', city: 'kapstaden', place: 'robbenisland', region: 'afrika', type: 'mc', difficulty: 1, q: 'Vad heter Sydafrikas officiella valuta?', a: ['Rand', 'Shilling', 'Pund', 'Dollar', 'Kwanza'], explain: 'Sydafrikansk rand (ZAR) är uppkallad efter bergsryggen Witwatersrand där landets rika guldfyndigheter gjordes.' },
    { id: 'kap_va_1', city: 'kapstaden', place: 'vawaterfront', region: 'afrika', type: 'mc', difficulty: 2, q: 'Vilken känd nationalpark i nordöstra Sydafrika är berömd för "The Big Five" (lejon, leopard, elefant, noshörning, buffel)?', a: ['Krugerparken', 'Serengeti', 'Masai Mara', 'Etosha'], explain: 'Kruger nationalpark är nästan lika stor som hela Småland och en av Afrikas mest artrika nationalparker.' },
    { id: 'kap_va_2', city: 'kapstaden', place: 'vawaterfront', region: 'afrika', type: 'mc', difficulty: 1, q: 'Vilka två världshav möts utanför Sydafrikas sydkust?', a: ['Atlanten och Indiska oceanen', 'Atlanten och Stilla havet', 'Indiska oceanen och Medelhavet'], explain: 'Kalla Benguelaströmmen från Atlanten och varma Agulhasströmmen från Indiska oceanen ger Sydafrika ett unikt marint djurliv.' },
    { id: 'kap_job_1', city: 'kapstaden', place: 'job', region: 'afrika', type: 'mc', difficulty: 1, q: 'Vilket år arrangerade Sydafrika fotbolls-VM, det första någonsin på den afrikanska kontinenten?', a: ['2010', '2002', '2006', '2014'], explain: 'Fotbolls-VM 2010 blev ihågkommet för både vuvuzelorna och Spaniens första VM-guld!' },
    { id: 'kap_job_2', city: 'kapstaden', place: 'job', region: 'afrika', type: 'mc', difficulty: 2, q: 'Vilket självständigt bergskungarike ligger helt omslutet inne i Sydafrika?', a: ['Lesotho', 'Namibia', 'Botswana', 'Zimbabwe'], explain: 'Lesotho är en enklav helt omgiven av Sydafrika och kallas "Kungariket i skyn" eftersom hela landet ligger över 1 400 m ö.h.' },
    { id: 'kap_job_3', city: 'kapstaden', place: 'job', region: 'afrika', type: 'mc', difficulty: 1, q: 'Vilket språk i Sydafrika har utvecklats ur 1600-talets nederländska?', a: ['Afrikaans', 'Zulu', 'Xhosa', 'Swahili'], explain: 'Sydafrika har hela 12 officiella språk, däribland zulu, xhosa, afrikaans och engelska.' },
    { id: 'kap_job_4', city: 'kapstaden', place: 'job', region: 'afrika', type: 'mc', difficulty: 2, q: 'Vilken är Afrikas allra sydligaste udde (lite öster om Godahoppsudden)?', a: ['Kap Agulhas', 'Kap Horn', 'Kap Verde'], explain: 'Kap Agulhas ("Nåludden") är den geografiskt exakta gränsen mellan Atlanten och Indiska oceanen.' },

    // RIO DE JANEIRO
    { id: 'rio_cr_1', city: 'rio', place: 'christredeemer', region: 'sydamerika', type: 'mc', difficulty: 1, q: 'Vilket officiellt språk talas i Rio de Janeiro och resten av Brasilien?', a: ['Portugisiska', 'Spanska', 'Franska', 'Italienska'], explain: 'Brasilien är världens största portugisisktalande land och det enda i Sydamerika där portugisiska är officiellt språk.' },
    { id: 'rio_cr_2', city: 'rio', place: 'christredeemer', region: 'sydamerika', type: 'text', difficulty: 1, q: 'Vad heter Brasiliens officiella huvudstad (som invigdes 1960 inne i landet)?', ans: 'Brasília', accept: ['brasilia', 'brasília'], explain: 'Rio de Janeiro var huvudstad fram till 1960, då den nybyggda, flygplansformade staden Brasília tog över!' },
    { id: 'rio_sl_1', city: 'rio', place: 'sugarloaf', region: 'sydamerika', type: 'mc', difficulty: 1, q: 'Vilken gigantisk tropisk regnskog breder ut sig över norra Brasilien?', a: ['Amazonas', 'Kongobäckenet', 'Borneo', 'Daintree'], explain: 'Amazonas är världens största regnskog och rymmer uppemot 10 % av jordens kända växt- och djurarter.' },
    { id: 'rio_sl_2', city: 'rio', place: 'sugarloaf', region: 'sydamerika', type: 'mc', difficulty: 1, q: 'Vad heter Brasiliens valuta?', a: ['Real', 'Peso', 'Bolívar', 'Sol', 'Escudo'], explain: 'Brasiliansk real (BRL) infördes 1994 för att stabilisera landets ekonomi.' },
    { id: 'rio_cp_1', city: 'rio', place: 'copacabana', region: 'sydamerika', type: 'mc', difficulty: 1, q: 'Vilken känd musik- och dansstil är starkast förknippad med den stora karnevalen i Rio?', a: ['Samba', 'Tango', 'Flamenco', 'Salsa', 'Reggae'], explain: 'Under karnevalen tågar stadens stora sambaskolor genom Sambódromo inför tiotusentals jublande åskådare!' },
    { id: 'rio_cp_2', city: 'rio', place: 'copacabana', region: 'sydamerika', type: 'mc', difficulty: 2, q: 'Vilken annan berömd strand ligger precis söder om Copacabana och har gett namn åt bossa nova-klassikern "The Girl from..."?', a: ['Ipanema', 'Leblon', 'Barra', 'Botafogo'], explain: 'Låten "Garota de Ipanema" (1962) av Antônio Carlos Jobim och Vinícius de Moraes blev en av världens mest inspelade låtar.' },
    { id: 'rio_ma_1', city: 'rio', place: 'maracana', region: 'sydamerika', type: 'text', difficulty: 1, q: 'Vad hette Brasiliens störste fotbollslegend genom tiderna, som vann tre VM-guld (1958, 1962, 1970)?', ans: 'Pelé', accept: ['pele', 'pelé'], explain: 'Edson Arantes do Nascimento, Pelé (1940–2022), fick sitt stora världsgenombrott bara 17 år gammal under VM i Sverige 1958!' },
    { id: 'rio_ma_2', city: 'rio', place: 'maracana', region: 'sydamerika', type: 'num', difficulty: 2, q: 'Hur många gånger har Brasiliens herrlandslag vunnit fotbolls-VM (rekord i världen)?', ans: 5, min: 1, max: 10, step: 1, unit: 'guld', explain: 'Brasilien har fem VM-guld (1958, 1962, 1970, 1994 och 2002), flest av alla nationer!' },
    { id: 'rio_job_1', city: 'rio', place: 'job', region: 'sydamerika', type: 'mc', difficulty: 1, q: 'Vilken mäktig bergskedja sträcker sig längs hela Sydamerikas västkust?', a: ['Anderna', 'Klippiga bergen', 'Alperna', 'Himalaya'], explain: 'Anderna är världens längsta bergskedja på land (över 7 000 km) med toppen Aconcagua på 6 961 m.' },
    { id: 'rio_job_2', city: 'rio', place: 'job', region: 'sydamerika', type: 'mc', difficulty: 2, q: 'Vilka berömda jättevattenfall ligger på gränsen mellan Brasilien och Argentina?', a: ['Iguazúfallen', 'Niagarafallen', 'Victoriafallen', 'Änglafallen'], explain: 'Iguazúfallen består av 275 separata fall mitt i subtropisk regnskog.' },
    { id: 'rio_job_3', city: 'rio', place: 'job', region: 'sydamerika', type: 'mc', difficulty: 1, q: 'Vilket år hölls de olympiska sommarspelen i Rio de Janeiro?', a: ['2016', '2012', '2008', '2020'], explain: 'OS i Rio 2016 var de första olympiska spelen som någonsin hölls i Sydamerika!' },
    { id: 'rio_job_4', city: 'rio', place: 'job', region: 'sydamerika', type: 'mc', difficulty: 1, q: 'Vilken dryck är Brasilien världens allra största producent av?', a: ['Kaffe', 'Te', 'Kakao'], explain: 'Brasilien har varit världens största kaffeproducent i över 150 år och står för ungefär en tredjedel av allt kaffe i världen.' },

    // MEXICO CITY
    { id: 'mex_zo_1', city: 'mexicocity', place: 'zocalo', region: 'amerika', type: 'mc', difficulty: 1, q: 'Vilket forntida folk grundade huvudstaden Tenochtitlán på en ö i sjön där Mexico City nu ligger?', a: ['Aztekerna', 'Inkariket', 'Olmekerna', 'Vikings'], explain: 'Aztekerna grundade Tenochtitlán år 1325 på platsen där de enligt myten såg en örn med en orm i näbben på en kaktus, motivet på Mexikos flagga!' },
    { id: 'mex_zo_2', city: 'mexicocity', place: 'zocalo', region: 'amerika', type: 'mc', difficulty: 2, q: 'Vilken spansk conquistador ledde erövringen av aztekernas rike år 1521?', a: ['Hernán Cortés', 'Francisco Pizarro', 'Vasco Núñez de Balboa', 'Juan Ponce de León'], explain: 'Hernán Cortés intog Tenochtitlán 1521 med hjälp av lokala allierade, och spanjorerna byggde Mexico City direkt ovanpå ruinerna.' },
    { id: 'mex_fk_1', city: 'mexicocity', place: 'fridakahlo', region: 'amerika', type: 'mc', difficulty: 2, q: 'Vilken världsberömd mexikansk muralmålare var gift med Frida Kahlo?', a: ['Diego Rivera', 'Pablo Picasso', 'Salvador Dalí', 'Fernando Botero'], explain: 'Diego Rivera och Frida Kahlo utgjorde 1900-talets mest omskrivna konstnärspar i Mexiko.' },
    { id: 'mex_fk_2', city: 'mexicocity', place: 'fridakahlo', region: 'amerika', type: 'mc', difficulty: 1, q: 'Vad kallas den färgsprakande mexikanska högtiden i november då man minns och firar avlidna släktingar?', a: ['Día de los Muertos', 'Cinco de Mayo', 'Las Posadas'], explain: 'Under Día de los Muertos pryder man altaren med orange ringblommor, ljus, sockerskallar och den avlidnes favoritmat.' },
    { id: 'mex_ch_1', city: 'mexicocity', place: 'chapultepec', region: 'amerika', type: 'num', difficulty: 2, q: 'Mexico City ligger högt uppe i bergen! Ungefär hur många meter över havet ligger staden?', ans: 2240, min: 200, max: 4500, step: 40, unit: 'm', explain: 'På 2 240 meters höjd är luften märkbart tunnare i Mexico City, något som märktes tydligt vid OS 1968 då flera världsrekord i friidrott slogs!' },
    { id: 'mex_ch_2', city: 'mexicocity', place: 'chapultepec', region: 'amerika', type: 'text', difficulty: 1, q: 'Vad heter Mexikos officiella valuta?', ans: 'Mexikansk peso', accept: ['peso', 'pesos'], explain: 'Den mexikanska peson (MXN) har rötter ända tillbaka till 1500-talets spanska silvermynt.' },
    { id: 'mex_xo_1', city: 'mexicocity', place: 'xochimilco', region: 'amerika', type: 'mc', difficulty: 2, q: 'Vilket sällsynt, leende vattenlevande groddjur finns vilt nästan enbart i Xochimilcos kanaler?', a: ['Axolotl', 'Kameleon', 'Leguan', 'Piranha'], explain: 'Axolotlen är berömd inom vetenskapen för sin otroliga förmåga att återbilda hela förlorade ben och organ!' },
    { id: 'mex_xo_2', city: 'mexicocity', place: 'xochimilco', region: 'amerika', type: 'mc', difficulty: 1, q: 'Vilken älskad råvara användes av både mayafolket och aztekerna som helig dryck och betalningsmedel långt innan den nådde Europa?', a: ['Kakao', 'Kaffe', 'Socker', 'Vete'], explain: 'Ordet "choklad" härstammar från aztekernas språk nahuatl (xocolātl), en bitter, kryddad kakaodryck!' },
    { id: 'mex_job_1', city: 'mexicocity', place: 'job', region: 'amerika', type: 'mc', difficulty: 1, q: 'Vilken känd mayaruinstad med trappstegspyramiden El Castillo ligger på Yucatánhalvön i Mexiko?', a: ['Chichén Itzá', 'Machu Picchu', 'Tikal', 'Palenque'], explain: 'Chichén Itzá utsågs 2007 till ett av världens sju nya underverk!' },
    { id: 'mex_job_2', city: 'mexicocity', place: 'job', region: 'amerika', type: 'mc', difficulty: 1, q: 'Vilket språk är det huvudsakliga i Mexiko?', a: ['Spanska', 'Portugisiska', 'Engelska', 'Franska'], explain: 'Mexiko är världens folkrikaste spansktalande land med omkring 130 miljoner invånare!' },
    { id: 'mex_job_3', city: 'mexicocity', place: 'job', region: 'amerika', type: 'mc', difficulty: 2, q: 'Vilken berömd mexikansk grön avokadoröra äts över hela världen?', a: ['Guacamole', 'Hummus', 'Tzatziki', 'Pesto'], explain: 'Namnet guacamole kommer från aztekernas ord āhuacamolli ("avokadosås").' },
    { id: 'mex_job_4', city: 'mexicocity', place: 'job', region: 'amerika', type: 'globe', difficulty: 2, q: 'Peka på 3D-jordgloben: Var ligger Panamakanalen (längre söderut i Centralamerika)?', targetLat: 9.08, targetLon: -79.68, targetName: 'Panamakanalen', startLat: 14, startLon: -88, explain: 'Panamakanalen invigdes 1914 och förkortade sjövägen mellan Atlanten och Stilla havet med tusentals kilometer.' }
  ];

  // Slå ihop allt i GT_WORLD och GT_QUESTIONS!
  W.startCity = 'malmo';

  // Startstaden Malmö (hemstad för jorden-runt-resan!)
  W.cities.malmo = {
    name: 'Malmö',
    country: 'Sverige',
    region: 'Europa',
    lat: 55.605,
    lon: 13.004,
    tagline: 'Öresunds port mot kontinenten, där resan börjar!',
    skyline: 'assets/photos/turningtorso.jpg',
    mapBg: 'assets/maps/map_stockholm.jpg',
    hotel: { name: 'Hotel Kramer vid Stortorget', price: 420 },
    highlights: ['turningtorso', 'malmohus', 'lillatorg', 'ribersborg'],
    souvenirs: ['spettkaka', 'kangor'],
    boats: [{ to: 'london', name: 'Nordsjöfärja Malmö-London', days: 4, price: 890 }],
    job: { title: 'Öresundsguide', employer: 'Öresundslinjen', hours: 6, pay: 880 },
    signature: {
      name: 'Falafelrunda på Möllan',
      openFrom: 11,
      openUntil: 22,
      cost: 75,
      kind: 'deal',
      desc: 'Strosa runt Möllevångstorget, ät stadens bästa falafel och snappa upp restips om billiga avgångar ut i Europa!'
    }
  };

  Object.assign(W.places, {
    turningtorso: { name: 'Turning Torso', city: 'malmo', photo: 'assets/photos/turningtorso.jpg', hours: 2, fee: 0, fact: 'Den 190 meter höga skruvade skyskrapan i Västra hamnen ritades av Santiago Calatrava och invigdes 2005.' },
    malmohus:     { name: 'Malmöhus slott', city: 'malmo', photo: 'assets/photos/malmohus.jpg', hours: 2, fee: 90, fact: 'Nordens äldsta bevarade renässansslott, omgiven av vallgrav och slottspark mitt i staden.' },
    lillatorg:    { name: 'Lilla torg', city: 'malmo', photo: 'assets/photos/lillatorg.jpg', hours: 1, fee: 0, fact: 'Ett kullerstensbelagt renässanstorg från 1590-talet kantat av korsvirkeshus och uteserveringar.' },
    ribersborg:   { name: 'Ribersborgs kallbadhus', city: 'malmo', photo: 'assets/photos/ribersborg.jpg', hours: 2, fee: 85, fact: 'Det klassiska kallbadhuset i trä ute på bryggan i Öresund, med utsikt direkt mot Öresundsbron.' }
  });

  W.souvenirs.spettkaka = {
    name: 'Skånsk spettkaka',
    origin: 'malmo',
    price: 160,
    kind: 'samlar',
    desc: 'Sprött, luftigt skånskt högtidsbakverk gräddat över öppen värme på roterande spett.'
  };

  W.shopkeepers.malmo = {
    name: 'Sven & Amina på Möllevångstorget',
    greet: 'Hej och välkommen till Möllan! Behöver du resekängor eller en riktig skånsk spettkaka att ta med ut i världen?'
  };

  W.taverns.malmo = {
    name: 'Möllans Krog & Ölhall',
    drink: 'en runda skånsk äppelmust & smörrebröd',
    drinkCost: 115,
    vibe: 'Lokal värme, skratt och resenärer på väg över Öresund.'
  };

  W.relayQuests.push({
    id: 'relay_mmx_par',
    from: 'malmo',
    to: 'paris',
    giver: 'Bokhandlare Lind på Södra Förstadsgatan',
    itemName: 'En inbunden skånsk konstbok',
    rewardCash: 950,
    freeHotel: true
  });

  const MALMO_QUESTIONS = [
    { id: 'mmx_tt_1', city: 'malmo', place: 'turningtorso', region: 'europa', type: 'mc', difficulty: 1, q: 'Hur många grader vrider sig Turning Torso från markplan ända upp till toppen?', a: ['90 grader', '45 grader', '180 grader', '360 grader'], explain: 'Turning Torso vrider sig exakt 90 grader (ett kvarts varv) fördelat på nio kuber.' },
    { id: 'mmx_tt_2', city: 'malmo', place: 'turningtorso', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilken känd spansk arkitekt ritade Turning Torso?', a: ['Santiago Calatrava', 'Antoni Gaudí', 'Norman Foster', 'Renzo Piano'], explain: 'Santiago Calatrava inspirerades av sin egen skulptur "Twisting Torso" i vit marmor.' },
    { id: 'mmx_mh_1', city: 'malmo', place: 'malmohus', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilket grannland hörde Malmö och hela Skåne till innan freden i Roskilde 1658?', a: ['Danmark', 'Norge', 'Tyskland', 'Polen'], explain: 'Malmö var länge en av Danmarks största och viktigaste handelsstäder innan Skåne blev svenskt 1658.' },
    { id: 'mmx_mh_2', city: 'malmo', place: 'malmohus', region: 'europa', type: 'num', difficulty: 2, q: 'Vilket årtal slöts freden i Roskilde då Skåne, Halland och Blekinge blev svenska?', ans: 1658, min: 1580, max: 1730, step: 1, unit: 'år', explain: 'Freden i Roskilde undertecknades den 26 februari 1658 efter Karl X Gustavs tåg över Bält.' },
    { id: 'mmx_lt_1', city: 'malmo', place: 'lillatorg', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken typ av traditionella trähus med synliga balkar är typiska runt Lilla torg i Malmö?', a: ['Korsvirkeshus', 'Timmerstugor', 'Funkishus', 'Pagoder'], explain: 'Korsvirkeshusen från 1500- och 1600-talen ger Lilla torg dess historiska skånsk-danska charm.' },
    { id: 'mmx_lt_2', city: 'malmo', place: 'lillatorg', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilken plats i storleksordning har Malmö bland Sveriges största städer?', a: ['Tredje största', 'Näst största', 'Fjärde största'], explain: 'Malmö är Sveriges tredje största stad efter Stockholm och Göteborg.' },
    { id: 'mmx_rb_1', city: 'malmo', place: 'ribersborg', region: 'europa', type: 'text', difficulty: 1, q: 'Vad heter sundet mellan Malmö och Köpenhamn?', ans: 'Öresund', accept: ['oresund', 'öresund'], explain: 'Öresund är ett av världens mest trafikerade sund och förbinder Kattegatt med Östersjön.' },
    { id: 'mmx_rb_2', city: 'malmo', place: 'ribersborg', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilket år invigdes Öresundsbron mellan Malmö och Köpenhamn?', a: ['2000', '1994', '2005', '1998'], explain: 'Öresundsbron invigdes den 1 juli år 2000 av kung Carl XVI Gustaf och drottning Margrethe II.' },
    { id: 'mmx_job_1', city: 'malmo', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken konstgjord ö mitt i Öresund kopplar ihop Öresundsbron med tunneln mot Kastrup?', a: ['Pepparholm', 'Ven', 'Saltholm', 'Bornholm'], explain: 'Pepparholm anlades av schaktmassor från tunnelbygget och har blivit ett unikt naturreservat.' },
    { id: 'mmx_job_2', city: 'malmo', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken känd dansk huvudstad når man på knappt 35 minuter med tåg från Malmö C?', a: ['Köpenhamn', 'Aarhus', 'Odense', 'Aalborg'], explain: 'Öresundstågen rullar över bron dygnet runt mellan Malmö Central och Köpenhamns Hovedbanegård.' },
    { id: 'mmx_job_3', city: 'malmo', place: 'job', region: 'europa', type: 'mc', difficulty: 2, q: 'Vilket välkänt skeppsvarv präglade Malmös siluett i över 100 år med sin enorma bockkran?', a: ['Kockums', 'Götaverken', 'Eriksberg', 'Lindholmen'], explain: 'Kockumskranen var länge Malmös symbol innan den monterades ner 2002 och såldes till Sydkorea.' },
    { id: 'mmx_job_4', city: 'malmo', place: 'job', region: 'europa', type: 'mc', difficulty: 1, q: 'Vilken populär gaturätt har gjort Möllevången i Malmö berömt i hela Sverige?', a: ['Falafel', 'Surströmming', 'Palt', 'Kroppkakor'], explain: 'Malmö kallas ofta Sveriges falafelhuvudstad tack vare sina många prisvärda falafelställen.' }
  ];
  NEW_QUESTIONS.push(...MALMO_QUESTIONS);

  Object.assign(W.cities, NEW_CITIES);
  Object.assign(W.places, NEW_PLACES);
  Object.assign(W.wonders, NEW_WONDERS);
  Object.assign(W.souvenirs, NEW_SOUVENIRS);
  Object.assign(W.shopkeepers, NEW_SHOPKEEPERS);
  Object.assign(W.taverns, NEW_TAVERNS);
  W.relayQuests.push(...NEW_RELAYS);
  W.worldEvents.push(...NEW_EVENTS);

  const existingIds = new Set(Q.map(x => x.id));
  NEW_QUESTIONS.forEach(q => {
    if (!existingIds.has(q.id)) {
      if (W.places[q.place]) q.photo = W.places[q.place].photo;
      else if (W.wonders[q.place]) q.photo = W.wonders[q.place].photo;
      else if (W.cities[q.city]) q.photo = W.cities[q.city].skyline;
      Q.push(q);
    }
  });
})();
