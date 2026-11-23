// Globetrotter - 20 Världsarv & Naturunder som egna resmål på 3D-jordgloben
// Varje världsarv nås som en expedition från sin närmaste spelbara stad.

(function () {
  'use strict';
  const W = window.GT_WORLD;
  if (!W) return;

  // Rensa bort gamla underverksknappar inne i stadskartorna så världsarven blir egna resmål
  Object.values(W.cities || {}).forEach(city => {
    city.wonders = [];
  });

  W.wonders = {
    // --- EUROPA & ARKTIS ---
    ilulissat: {
      id: 'ilulissat',
      spots: ["Glaciärfronten Sermeq Kujalleq","Isbergsfjorden","Diskobuktens historia"],
      name: 'Ilulissat isfjord',
      country: 'Grönland',
      region: 'Europa & Arktis',
      lat: 69.22,
      lon: -51.10,
      from: 'stockholm',
      transportMode: 'Arktiskt expeditionsflyg',
      transport: 1350,
      fee: 250,
      hoursEach: 6,
      visitHours: 6,
      gearVisitHours: 4,
      gear: null,
      photo: 'assets/wonders/ilulissat.jpg',
      fact: 'Vid Diskobukten på Grönlands västkust mynnar Sermeq Kujalleq, en av jordens snabbaste och mest produktiva glaciärer, ut i en 60 km lång fjord fylld av kolossala isberg.',
      questions: [
        {
          q: 'Vad heter den berömda glaciären som kalvar enorma isberg ut i Ilulissat isfjord?',
          t: 'mc',
          a: ['Sermeq Kujalleq', 'Vatnajökull', 'Jostedalsbreen', 'Perito Moreno'],
          explain: 'Sermeq Kujalleq (även kallad Jakobshavn Isbræ) rör sig upp till 40 meter per dygn och producerar omkring 10 % av alla isberg på Grönland.'
        },
        {
          q: 'Vad betyder namnet "Ilulissat" på grönländska (kalaallisut)?',
          t: 'mc',
          a: ['Isberg', 'Norra ljuset', 'Vit björn', 'Kall vind'],
          explain: 'Ilulissat betyder ordagrant "isberg" på grönländska, efter de enorma ismassorna som ständigt fyller mynningen av fjorden.'
        },
        {
          q: 'Vilket känt fartyg tros ha sänkts år 1912 av ett isberg som ursprungligen kom från just Ilulissat-glaciären?',
          t: 'mc',
          a: ['RMS Titanic', 'RMS Lusitania', 'HMS Endurance', 'SS Andrea Doria'],
          explain: 'Oceanografer har spårat havsströmmarna i Baffinbukten och menar att isberget som sänkte RMS Titanic sannolikt kalvade från Sermeq Kujalleq.'
        }
      ]
    },

    stonehenge: {
      id: 'stonehenge',
      spots: ["Sommarsolståndets axel","Wales blåstenar","Sarsen-blocken"],
      name: 'Stonehenge',
      country: 'Storbritannien',
      region: 'Europa',
      lat: 51.18,
      lon: -1.83,
      from: 'london',
      transportMode: 'Tåg & landsvägsbuss',
      transport: 320,
      fee: 180,
      hoursEach: 2,
      visitHours: 4,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/stonehenge.jpg',
      fact: 'På Salisbury-slätten i södra England reser sig denna förhistoriska stenkrets från omkring 2500 f.Kr., linjerad efter soluppgången vid sommarsolståndet.',
      questions: [
        {
          q: 'Vilken himlafenomen är huvudaxeln i Stonehenge exakt riktad mot?',
          t: 'mc',
          a: ['Soluppgången vid sommarsolståndet', 'Polstjärnan', 'Månens lägsta punkt', 'Vårdagjämningen i väster'],
          explain: 'När man står i mitten av Stonehenge på sommarsolståndets morgon går solen upp rakt över den fristående Heel Stone i nordost.'
        },
        {
          q: 'Varifrån transporterades de mindre "blåstenarna" (bluestones) till Stonehenge för över 4 500 år sedan?',
          t: 'mc',
          a: ['Preseli-bergen i Wales', 'Skotska högländerna', 'Klippkusten i Dover', 'Irland'],
          explain: 'Geologiska analyser har visat att blåstenarna bröts i Preseli Hills i västra Wales och fraktades över 240 kilometer till Wiltshire.'
        },
        {
          q: 'Ungefär hur mycket väger de största sarsen-stenblocken i Stonehenge?',
          t: 'mc',
          a: ['25 till 30 ton', '2 till 3 ton', '100 ton', '500 kilo'],
          explain: 'De största upprätta sarsen-stenarna väger omkring 25 till 30 ton styck och restes utan hjul eller metallverktyg.'
        }
      ]
    },

    pompeji: {
      id: 'pompeji',
      spots: ["Vesuvius utbrott år 79","Plinius brev & forum","Fiorellis avgjutningar"],
      name: 'Pompeji & Vesuvius',
      country: 'Italien',
      region: 'Europa',
      lat: 40.75,
      lon: 14.49,
      from: 'rom',
      transportMode: 'Tåg mot Neapelbukten',
      transport: 360,
      fee: 170,
      hoursEach: 2,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/pompeji.jpg',
      fact: 'År 79 e.Kr. begravdes den romerska staden Pompeji under metervis av pimpsten och vulkanaska från Vesuvius, vilket frös det antika vardagslivet i tiden.',
      questions: [
        {
          q: 'Vilket år fick vulkanen Vesuvius sitt ödesdigra utbrott som begravde Pompeji och Herculaneum?',
          t: 'mc',
          a: ['79 e.Kr.', '44 f.Kr.', '476 e.Kr.', '120 e.Kr.'],
          explain: 'Utbrottet år 79 e.Kr. begravde både Pompeji och grannstaden Herculaneum på mindre än två dygn.'
        },
        {
          q: 'Vem skrev de berömda ögonvittnesbreven om Vesuvius utbrott som gav namn åt "plinianska utbrott"?',
          t: 'mc',
          a: ['Plinius den yngre', 'Julius Caesar', 'Cicero', 'Tacitus'],
          explain: 'Plinius den yngre beskrev askmolnet som en jättelik pinje i två brev till historikern Tacitus; hans morbror Plinius den äldre omkom under räddningsförsöket.'
        },
        {
          q: 'Hur skapade arkeologen Giuseppe Fiorelli på 1860-talet de berömda avgjutningarna av Pompejis invånare?',
          t: 'mc',
          a: ['Genom att hälla gips i hålrum i den hårdnade askan', 'Genom att gjuta brons över skelett', 'Genom att röntga murarna', 'Genom att skära ut marmorstatyer'],
          explain: 'När organiskt material förmultnade lämnade det exakta hålrum i den stelnade vulkanaskan, som fylldes med flytande gips.'
        }
      ]
    },

    kappadokien: {
      id: 'kappadokien',
      spots: ["Älvskorstenarna i Göreme","Underjordiska staden Derinkuyu","Gryningsballongerna"],
      name: 'Kappadokien',
      country: 'Turkiet',
      region: 'Asien',
      lat: 38.64,
      lon: 34.83,
      from: 'istanbul',
      transportMode: 'Anatoliskt nattåg & flyg',
      transport: 580,
      fee: 180,
      hoursEach: 4,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/kappadokien.jpg',
      fact: 'I hjärtat av Anatolien har vind och regn format vulkanisk tuffsten till sagolika "älvskorstenar", klippkyrkor och hela underjordiska städer.',
      questions: [
        {
          q: 'Vilken bergart har gjort det möjligt för människor i Kappadokien att hugga ut hem, kyrkor och underjordiska städer?',
          t: 'mc',
          a: ['Mjuk vulkanisk tuffsten', 'Svart granit', 'Vit marmor', 'Skiffer'],
          explain: 'Kappadokiens landskap bildades av vulkanaska som stelnade till mjuk tuffsten, lätt att gräva ut men som hårdnar i kontakt med luft.'
        },
        {
          q: 'Vad heter den mest berömda underjordiska staden i Kappadokien som sträcker sig 8 våningar ner under marken?',
          t: 'mc',
          a: ['Derinkuyu', 'Troja', 'Efesos', 'Hattusa'],
          explain: 'Derinkuyu kunde rymma upp till 20 000 människor med stall, skolor, ventilationsschakt och tunga rullstenar som spärrade tunnlarna vid anfall.'
        },
        {
          q: 'Vad är Kappadokien idag världsberömt för i gryningen över Göreme-dalen?',
          t: 'mc',
          a: ['Hundratals luftballonger på himlen', 'Kamelkapplöpning', 'Gondoler på floden', 'Norrsken'],
          explain: 'De stabila morgonvindarna över Göreme gör Kappadokien till en av världens mest ikoniska platser för luftballongsfärder.'
        }
      ]
    },

    // --- AFRIKA & MELLANÖSTERN ---
    giza: {
      id: 'giza',
      spots: ["Cheopspyramiden","Stora sfinxen","Den vita kalkstensmanteln"],
      name: 'Pyramiderna i Giza',
      country: 'Egypten',
      region: 'Afrika',
      lat: 29.98,
      lon: 31.13,
      from: 'kairo',
      transportMode: 'Ökenjeep ut på Gizaplatån',
      transport: 180,
      fee: 160,
      hoursEach: 1,
      visitHours: 5,
      gearVisitHours: 3,
      gear: 'guide_kairo',
      souvenir: 'papyrus',
      photo: 'assets/photos/pyramids.jpg',
      fact: 'Det enda bevarade av antikens sju underverk! Cheopspyramiden restes för över 4 500 år sedan av över två miljoner kalkstensblock.',
      questions: [
        {
          q: 'Vilken farao lät bygga den allra största pyramiden på Gizaplatån?',
          t: 'mc',
          a: ['Cheops', 'Tutankhamon', 'Ramses II', 'Kleopatra'],
          explain: 'Cheopspyramiden byggdes omkring 2560 f.Kr. åt farao Khufu (Cheops) och var världens högsta byggnad i över 3 800 år.'
        },
        {
          q: 'Vilket djur har den Stora sfinxen i Giza som kropp?',
          t: 'mc',
          a: ['Lejon', 'Falk', 'Krokodil', 'Sjakal'],
          explain: 'Sfinxen är uthuggen direkt ur berggrunden och föreställer ett vilande lejon med mänskligt faraohuvud, troligen farao Chefren.'
        },
        {
          q: 'Hur var pyramiderna i Giza ursprungligen täckta när de stod nybyggda?',
          t: 'mc',
          a: ['Av bländande vit, polerad kalksten', 'Av rött tegel', 'Av massivt guld', 'Av mörk basalt'],
          explain: 'Pyramiderna kläddes i släta, vita kalkstensblock från Tura så att de blänkte som solstrålar i öknen; idag finns rester kvar i toppen av Chefrenpyramiden.'
        }
      ]
    },

    petra: {
      id: 'petra',
      spots: ["Klyftan Siq & Nabatéerna","Skattkammaren Al-Khazneh","Återupptäckten 1812"],
      name: 'Klippstaden Petra',
      country: 'Jordanien',
      region: 'Asien',
      lat: 30.33,
      lon: 35.44,
      from: 'kairo',
      transportMode: 'Ökenbuss & färja över Akaba',
      transport: 640,
      fee: 260,
      hoursEach: 5,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/petra.jpg',
      fact: 'Genom den smala bergsklyftan Siq öppnar sig "Den rosaröda staden" Petra, där nabatéerna högg ut monumentala tempelfasader direkt i sandstensklipporna.',
      questions: [
        {
          q: 'Vilket forntida handelsfolk byggde klippstaden Petra som sin huvudstad?',
          t: 'mc',
          a: ['Nabatéerna', 'Fenicierna', 'Sumererna', 'Assyrierna'],
          explain: 'Nabatéerna kontrollerade rökelse- och kryddkaravanerna mellan Arabien, Egypten och Medelhavet och byggde geniala vattensystem i öknen.'
        },
        {
          q: 'Vad heter den mest kända tempelfasaden som dyker upp vid slutet av klyftan Siq i Petra?',
          t: 'mc',
          a: ['Al-Khazneh', 'Hagia Sofia', 'Parthenon', 'Abu Simbel'],
          explain: 'Al-Khazneh ("Skattkammaren") är 40 meter hög och uthuggen direkt i den rosaröda sandstensväggen under det första århundradet e.Kr.'
        },
        {
          q: 'Vilken schweizisk upptäcktsresande återupptäckte Petra för västvärlden år 1812?',
          t: 'mc',
          a: ['Johann Ludwig Burckhardt', 'Howard Carter', 'David Livingstone', 'Sven Hedin'],
          explain: 'Burckhardt reste förklädd som lokal pilgrim och hörde rykten om en gömd stenstad i bergen, vilket ledde honom rakt in i Petra.'
        }
      ]
    },

    serengeti: {
      id: 'serengeti',
      spots: ["Uhuru Peak på Kilimanjaro","Massajernas ändlösa slätter","Den stora vandringen"],
      name: 'Serengeti & Kilimanjaro',
      country: 'Tanzania',
      region: 'Afrika',
      lat: -3.07,
      lon: 37.35,
      from: 'kapstaden',
      transportMode: 'Safariflyg & Land Rover',
      transport: 1180,
      fee: 280,
      hoursEach: 5,
      visitHours: 6,
      gearVisitHours: 4,
      gear: null,
      photo: 'assets/wonders/serengeti.jpg',
      fact: 'Över Östafrikas ändlösa savanner reser sig Afrikas högsta berg Kilimanjaro (5 895 m), medan miljoner gnuer och zebror vandrar över Serengetis slätter.',
      questions: [
        {
          q: 'Hur högt är Kilimanjaro, Afrikas högsta berg och världens högsta fristående vulkan?',
          t: 'mc',
          a: ['5 895 meter', '4 120 meter', '7 250 meter', '3 480 meter'],
          explain: 'Kilimanjaros högsta topp Uhuru Peak når 5 895 meter över havet och reser sig fritt direkt från den omgivande savannen.'
        },
        {
          q: 'Vad betyder namnet "Serengeti" på massajernas språk (maa)?',
          t: 'mc',
          a: ['Ändlösa slätter', 'Lejonens dal', 'Regnets hem', 'Höga berget'],
          explain: 'Ordet kommer från massajernas "siringet", som betyder "platsen där landet löper i oändlighet".'
        },
        {
          q: 'Vilket djur utgör huvuddelen av den berömda "Stora vandringen" genom Serengeti varje år?',
          t: 'mc',
          a: ['Över 1,5 miljoner gnuer', 'Afrikanska elefanter', 'Flodhästar', 'Giraffer'],
          explain: 'Varje år vandrar omkring 1,5 miljoner gnuer tillsammans med hundratusentals zebror och gaseller i en cirkel på jakt efter regn och färskt gräs.'
        }
      ]
    },

    victoriafallen: {
      id: 'victoriafallen',
      spots: ["Röken som dånar","Zambeziflodens stup","Livingstones utsiktsplats"],
      name: 'Victoriafallen',
      country: 'Zambia / Zimbabwe',
      region: 'Afrika',
      lat: -17.92,
      lon: 25.86,
      from: 'kapstaden',
      transportMode: 'Tåg norrut & regionalflyg',
      transport: 860,
      fee: 220,
      hoursEach: 4,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/victoriafallen.jpg',
      fact: 'Där Zambezifloden störtar över 100 meter rakt ner i en smal basaltklyfta stiger en dimpelare som syns på flera mils avstånd.',
      questions: [
        {
          q: 'Vad kallas Victoriafallen på det lokala språket lozi ("Mosi-oa-Tunya")?',
          t: 'mc',
          a: ['Röken som dånar', 'Silverslöjan', 'Himmelens tårar', 'Flodens vrede'],
          explain: 'Mosi-oa-Tunya betyder "Röken som dånar" och syftar på vattendimman och dånet som hörs och syns långt innan man når själva stupet.'
        },
        {
          q: 'Vilken stor afrikansk flod bildar Victoriafallen?',
          t: 'mc',
          a: ['Zambezifloden', 'Kongofloden', 'Nilen', 'Nigerfloden'],
          explain: 'Zambezifloden är Afrikas fjärde längsta flod och faller här över en 1,7 kilometer bred bergskant.'
        },
        {
          q: 'Vilken skotsk upptäcktsresande nådde fallen år 1855 och namngav dem efter drottning Victoria?',
          t: 'mc',
          a: ['David Livingstone', 'Henry Morton Stanley', 'Richard Burton', 'Mungo Park'],
          explain: 'David Livingstone blev den förste europén att se fallen 1855 och skrev att scener så ljuvliga måste ha skådats av änglar i sin flykt.'
        }
      ]
    },

    // --- ASIEN ---
    everest: {
      id: 'everest',
      spots: ["Bestigningen 1953","Chomolungma & Sagarmatha","Khumbu-glaciärens basläger"],
      name: 'Mount Everest (Base Camp)',
      country: 'Nepal',
      region: 'Asien',
      lat: 27.99,
      lon: 86.93,
      from: 'delhi',
      transportMode: 'Bergsflyg till Lukla & trekking',
      transport: 1150,
      fee: 320,
      hoursEach: 6,
      visitHours: 7,
      gearVisitHours: 5,
      gear: null,
      photo: 'assets/wonders/everest.jpg',
      fact: 'Högt uppe i Himalayas tunnare luft breder Khumbu-glaciären ut sig nedanför världens högsta berg, 8 849 meter över havet.',
      questions: [
        {
          q: 'Vilka två klättrare nådde som de första bekräftade människorna toppen av Mount Everest år 1953?',
          t: 'mc',
          a: ['Edmund Hillary och Tenzing Norgay', 'Reinhold Messner och Peter Habeler', 'George Mallory och Andrew Irvine', 'Roald Amundsen och Robert Scott'],
          explain: 'Den 29 maj 1953 nådde nyzeeländaren Edmund Hillary och sherpan Tenzing Norgay toppen klockan 11:30 på förmiddagen.'
        },
        {
          q: 'Vad heter Mount Everest på tibetanska respektive nepalesiska?',
          t: 'mc',
          a: ['Chomolungma och Sagarmatha', 'Kanchenjunga och Annapurna', 'K2 och Nanga Parbat', 'Lhotse och Makalu'],
          explain: 'Chomolungma betyder "Världens gudinna och moder" på tibetanska, medan Sagarmatha betyder "Himmelens panna" på nepalesiska.'
        },
        {
          q: 'Ungefär på vilken höjd över havet ligger Everest Base Camp på den nepalesiska sidan?',
          t: 'mc',
          a: ['5 364 meter', '2 800 meter', '7 500 meter', '8 200 meter'],
          explain: 'Baslägret ligger på 5 364 meters höjd på Khumbu-glaciären, där lufttrycket och syrehalten bara är ungefär hälften så hög som vid havsnivån.'
        }
      ]
    },

    taj: {
      id: 'taj',
      spots: ["Shah Jahans marmorkupol","De fyra lutande minareterna","Yamunaflodens strand"],
      name: 'Taj Mahal',
      country: 'Indien',
      region: 'Asien',
      lat: 27.17,
      lon: 78.04,
      from: 'delhi',
      transportMode: 'Snabbtåg till Agra',
      transport: 260,
      fee: 180,
      hoursEach: 2,
      visitHours: 4,
      gearVisitHours: 3,
      gear: null,
      souvenir: 'siden',
      photo: 'assets/photos/taj.jpg',
      fact: 'Vid Yamunafloden i Agra reser sig mogulkejsaren Shah Jahans mausoleum i gnistrande vit makranamarmor, smyckat med inlagda ädelstenar.',
      questions: [
        {
          q: 'Varför lät mogulkejsaren Shah Jahan uppföra Taj Mahal på 1630-talet?',
          t: 'mc',
          a: ['Som gravmonument åt sin älskade hustru Mumtaz Mahal', 'Som vinterpalats', 'Som observatorium', 'Som fästning vid floden'],
          explain: 'Bygget påbörjades 1632 efter att Mumtaz Mahal dött i barnsäng och tog omkring 20 år och över 20 000 hantverkare att färdigställa.'
        },
        {
          q: 'Varför lutar de fyra minareterna runt Taj Mahal svagt utåt från huvudbyggnaden?',
          t: 'mc',
          a: ['Så att de vid en jordbävning faller bort från mausoleet', 'För att fånga mer solljus', 'På grund av sättningar i marken', 'Som en optisk synvilla'],
          explain: 'Arkitekterna lutade minareterna något utåt som en genial säkerhetsåtgärd för att skydda själva marmorkupolen vid skalv.'
        },
        {
          q: 'Vid vilken flods strand står Taj Mahal i staden Agra?',
          t: 'mc',
          a: ['Yamunafloden', 'Indusfloden', 'Brahmaputra', 'Mekong'],
          explain: 'Taj Mahal ligger på södra stranden av Yamunafloden, som är den största bifloden till Ganges.'
        }
      ]
    },

    angkorwat: {
      id: 'angkorwat',
      spots: ["Khmerrikets statstempel","Vishnus helgedom","Tornen på flaggan"],
      name: 'Angkor Wat',
      country: 'Kambodja',
      region: 'Asien',
      lat: 13.41,
      lon: 103.87,
      from: 'bangkok',
      transportMode: 'Djungelbuss & regionalflyg',
      transport: 520,
      fee: 240,
      hoursEach: 3,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/angkorwat.jpg',
      fact: 'Omgivet av en bred vallgrav och djungelträd reser sig Angkor Wat, världens största religiösa monument, byggt under Khmerrikets guldålder.',
      questions: [
        {
          q: 'Vilket forntida sydostasiatiskt rike byggde Angkor Wat på 1100-talet?',
          t: 'mc',
          a: ['Khmerriket', 'Mingdynastin', 'Siamriket', 'Majapahit'],
          explain: 'Kung Suryavarman II lät uppföra Angkor Wat i början av 1100-talet som statstempel i Khmerrikets väldiga huvudstad Angkor.'
        },
        {
          q: 'Vilken religion vigdes Angkor Wat ursprungligen åt, innan det senare blev ett buddhistiskt tempel?',
          t: 'mc',
          a: ['Hinduism', 'Shintoism', 'Zoroastrism', 'Sikhism'],
          explain: 'Angkor Wat byggdes som ett hinduiskt tempel helgat åt guden Vishnu och symboliserar det mytiska berget Meru, gudarnas hemvist.'
        },
        {
          q: 'Var återfinns silhuetten av Angkor Wats karaktäristiska torn idag?',
          t: 'mc',
          a: ['Mitt på Kambodjas nationsflagga', 'På Thailands sedlar', 'På Vietnams statsvapen', 'På ASEANs logotyp'],
          explain: 'Angkor Wat är en så stark nationalsymbol att tempeltornen har prytt Kambodjas flagga sedan 1860-talet.'
        }
      ]
    },

    halong: {
      id: 'halong',
      spots: ["Legenden om draken","Karstklippor & grottor","Tonkinbuktens flytande byar"],
      name: 'Ha Long-bukten',
      country: 'Vietnam',
      region: 'Asien',
      lat: 20.91,
      lon: 107.18,
      from: 'bangkok',
      transportMode: 'Regionalflyg & traditionell djonk',
      transport: 640,
      fee: 200,
      hoursEach: 4,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/halong.jpg',
      fact: 'Över 1 600 klippöar och pelare av kalksten reser sig dramatiskt ur det smaragdgröna vattnet i Tonkinbukten, med dolda grottor och flytande fiskebyar.',
      questions: [
        {
          q: 'Vad betyder namnet "Hạ Long" på vietnamesiska?',
          t: 'mc',
          a: ['Den nedstigande draken', 'Tusen öar', 'Smaragdhavet', 'Dimhöljda berg'],
          explain: 'Enligt legenden sände gudarna en familj drakar som spottade ut juveler och jade för att skydda Vietnam, och dessa förvandlades till buktens öar.'
        },
        {
          q: 'Vilken typ av berggrund har vattnet under miljontals år format till Ha Long-buktens branta torn och grottor?',
          t: 'mc',
          a: ['Kalksten', 'Vulkanisk basalt', 'Röd sandsten', 'Gnejs'],
          explain: 'Ha Long-bukten är ett av världens mest spektakulära marina karstlandskap, där regn och hav långsamt har löst upp kalkstenen.'
        },
        {
          q: 'I vilket havsområde ligger Ha Long-bukten i norra Vietnam?',
          t: 'mc',
          a: ['Tonkinbukten', 'Bengaliska viken', 'Andamansjön', 'Gula havet'],
          explain: 'Ha Long-bukten ligger i provinsen Quang Ninh vid Tonkinbukten, omkring 160 kilometer öster om huvudstaden Hanoi.'
        }
      ]
    },

    kinesiskamuren: {
      id: 'kinesiskamuren',
      spots: ["Mingdynastins vakttorn","Murens fulla längd","Myten från rymden"],
      name: 'Kinesiska muren',
      country: 'Kina',
      region: 'Asien',
      lat: 40.43,
      lon: 116.57,
      from: 'peking',
      transportMode: 'Bergståg till Mutianyu',
      transport: 240,
      fee: 170,
      hoursEach: 2,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/photos/greatwall.jpg',
      fact: 'Som en väldig stenrygg slingrar sig muren över norra Kinas bergskammar, med vakttorn som förr skickade röksignaler längs hela imperiets nordgräns.',
      questions: [
        {
          q: 'Under vilken kinesisk dynasti byggdes de mest välbevarade sten- och tegelavsnitten av muren kring Peking?',
          t: 'mc',
          a: ['Mingdynastin', 'Handynastin', 'Tangdynastin', 'Qingdynastin'],
          explain: 'Även om de första murarna förenades redan under kejsar Qin Shi Huang år 221 f.Kr., byggdes de berömda stenmurarna vid Badaling och Mutianyu under Mingdynastin.'
        },
        {
          q: 'Hur lång är Kinesiska muren sammanlagt om man räknar alla muravsnitt, förgreningar och diken?',
          t: 'mc',
          a: ['Över 21 000 kilometer', 'Omkring 2 500 kilometer', 'Cirka 6 000 kilometer', '40 000 kilometer'],
          explain: 'En omfattande arkeologisk mätning 2012 visade att samtliga mursektioner från olika dynastier totalt mäter 21 196 kilometer.'
        },
        {
          q: 'Stämmer den kända myten att Kinesiska muren syns med blotta ögat från månen?',
          t: 'mc',
          a: ['Nej, muren är alldeles för smal för att ses från månen', 'Ja, den syns tydligt som ett grått streck', 'Ja, men bara på vintern', 'Ja, genom sina tända eldar'],
          explain: 'Muren är bara omkring 5 till 8 meter bred, så att se den från månen vore som att försöka se ett mänskligt hårstrå på tre kilometers avstånd.'
        }
      ]
    },

    fuji: {
      id: 'fuji',
      spots: ["Toppen 3 776 m ö.h.","Hokusais träsnitt","Hoei-utbrottet 1707"],
      name: 'Berget Fuji',
      country: 'Japan',
      region: 'Asien',
      lat: 35.36,
      lon: 138.73,
      from: 'tokyo',
      transportMode: 'Shinkansen & bergsbuss',
      transport: 340,
      fee: 140,
      hoursEach: 2,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/fuji.jpg',
      fact: 'Japans heliga, nästintill perfekt symmetriska vulkan reser sig 3 776 meter över havet och har inspirerat konstnärer och pilgrimer i över tusen år.',
      questions: [
        {
          q: 'Hur högt är Berget Fuji, Japans högsta topp?',
          t: 'mc',
          a: ['3 776 meter', '2 450 meter', '4 810 meter', '5 120 meter'],
          explain: 'Fuji-san är 3 776 meter högt och syns klara dagar ända från Tokyo, cirka 100 kilometer bort.'
        },
        {
          q: 'Vilken berömd japansk konstnär skapade träsnittsserien "Trettiosex vyer av berget Fuji" med Den stora vågen?',
          t: 'mc',
          a: ['Katsushika Hokusai', 'Utagawa Hiroshige', 'Hayao Miyazaki', 'Yayoi Kusama'],
          explain: 'Katsushika Hokusai publicerade serien på 1830-talet och gjorde Fuji till ett av konsthistoriens mest igenkända motiv.'
        },
        {
          q: 'När hade vulkanen Fuji sitt senaste stora utbrott (Hoei-utbrottet)?',
          t: 'mc',
          a: ['År 1707', 'År 1923', 'År 1450', 'År 1986'],
          explain: 'Hoei-utbrottet i december 1707 lade ett tjockt asklager över hela Edo (dagens Tokyo), och geologer klassar fortfarande Fuji som en aktiv vulkan.'
        }
      ]
    },

    // --- OCEANIEN ---
    barriarrevet: {
      id: 'barriarrevet',
      spots: ["Det 2 300 km långa revet","Korallpolypernas värld","HMS Endeavours grundstötning"],
      name: 'Stora Barriärrevet',
      country: 'Australien',
      region: 'Oceanien',
      lat: -18.29,
      lon: 147.70,
      from: 'sydney',
      transportMode: 'Kustflyg till Cairns & katamaran',
      transport: 890,
      fee: 240,
      hoursEach: 4,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/barriarrevet.jpg',
      fact: 'Utanför Queenslands kust sträcker sig jordens största korallrevssystem över 2 300 kilometer och rymmer tusentals färgsprakande rev, laguner och marina arter.',
      questions: [
        {
          q: 'Ungefär hur långt är Stora Barriärrevet längs Australiens nordöstra kust?',
          t: 'mc',
          a: ['Cirka 2 300 kilometer', 'Cirka 350 kilometer', 'Cirka 800 kilometer', 'Cirka 6 000 kilometer'],
          explain: 'Stora Barriärrevet består av över 2 900 enskilda rev och 900 öar och är världens största struktur skapad av levande organismer.'
        },
        {
          q: 'Vad är det egentligen som bygger upp kalkskelettet i ett korallrev?',
          t: 'mc',
          a: ['Miljarder små nässeldjur kallade korallpolyper', 'Förstenade sjögräs', 'Vulkanisk pimpsten', 'Snäckskal som spolats ihop'],
          explain: 'Koraller är kolonier av små djur (polyper) som utsöndrar kalciumkarbonat och lever i symbios med mikroskopiska alger som ger revet dess färger.'
        },
        {
          q: 'Vilken känd sjöfarare gick på grund på Stora Barriärrevet med skeppet HMS Endeavour år 1770?',
          t: 'mc',
          a: ['James Cook', 'Abel Tasman', 'Ferdinand Magellan', 'Francis Drake'],
          explain: 'Kapten James Cook skadade skrovet svårt på revet men lyckades laga fartyget på land vid nuvarande Cooktown i Queensland.'
        }
      ]
    },

    uluru: {
      id: 'uluru',
      spots: ["Den roströda sandstenen","Anangu-folkets helgedom","Klippan under jordytan"],
      name: 'Uluru (Ayers Rock)',
      country: 'Australien',
      region: 'Oceanien',
      lat: -25.34,
      lon: 131.04,
      from: 'sydney',
      transportMode: 'Ökenflyg till Röda centrum',
      transport: 960,
      fee: 210,
      hoursEach: 4,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/uluru.jpg',
      fact: 'Mitt i den australiska vildmarken glöder den 348 meter höga sandstensmonoliten Uluru i skiftande toner av ockra, eldrött och violett i solnedgången.',
      questions: [
        {
          q: 'Varför har klippan Uluru sin karaktäristiska roströda färg?',
          t: 'mc',
          a: ['Järnmineraler i sandstenen har oxiderat på ytan', 'Den består av röd lava', 'Den täcks av röd ökenmossa', 'Den målades i forntiden'],
          explain: 'Under ytan är arkos-sandstenen faktiskt grå, men järnet i stenen har rostat av regn och syre under miljontals år.'
        },
        {
          q: 'Vilket ursprungsfolk är de traditionella väktarna av Uluru och har bett besökare att inte bestiga den heliga klippan?',
          t: 'mc',
          a: ['Anangu-folket', 'Maori-folket', 'Inuiterna', 'Quechua-folket'],
          explain: 'För Anangu-folket är Uluru en djupt helig plats kopplad till skapelseberättelserna (Tjukurpa), och klättring förbjöds permanent år 2019.'
        },
        {
          q: 'Hur stor del av Ulurus klippformation tros egentligen ligga synlig ovanför markytan?',
          t: 'mc',
          a: ['Bara en liten del – den sträcker sig flera kilometer ner i marken', 'Hela stenen vilar löst på ökensanden', 'Exakt hälften', 'Den är ihålig undertill'],
          explain: 'Likt toppen av ett isberg är Uluru bara den synliga spetsen av ett enormt, vinklat sandstenslager som fortsätter kilometerdjupt ner i jordskorpan.'
        }
      ]
    },

    // --- NORD- & CENTRALAMERIKA ---
    grandcanyon: {
      id: 'grandcanyon',
      spots: ["Coloradoflodens ravin","1 800 meter ner till botten","Två miljarder år av berglager"],
      name: 'Grand Canyon',
      country: 'USA',
      region: 'Nordamerika',
      lat: 36.10,
      lon: -112.11,
      from: 'sanfrancisco',
      transportMode: 'Ökenflyg över Mojave',
      transport: 680,
      fee: 200,
      hoursEach: 3,
      visitHours: 5,
      gearVisitHours: 3,
      gear: 'boots',
      souvenir: 'turkos',
      photo: 'assets/photos/grandcanyon.jpg',
      fact: 'I Arizona har Coloradofloden under miljontals år skurit ut en 446 kilometer lång och upp till 1,8 kilometer djup ravin genom två miljarder år av jordens historia.',
      questions: [
        {
          q: 'Vilken flod har karvat ut Grand Canyon genom Coloradoplatån?',
          t: 'mc',
          a: ['Coloradofloden', 'Mississippifloden', 'Rio Grande', 'Columbiafloden'],
          explain: 'Coloradofloden började skära ner genom bergslagren för omkring 5 till 6 miljoner år sedan och flödar fortfarande i botten av ravinen.'
        },
        {
          q: 'Ungefär hur djupt är det ner till flodbädden på Grand Canyons djupaste ställen?',
          t: 'mc',
          a: ['Cirka 1 800 meter', 'Cirka 300 meter', 'Cirka 650 meter', 'Cirka 4 500 meter'],
          explain: 'Ravinens djup når över 1,8 kilometer och bredden varierar mellan 6 och 29 kilometer från kant till kant.'
        },
        {
          q: 'Vad kan geologer avläsa i de färgstarka horisontella bergslagren på ravinens väggar?',
          t: 'mc',
          a: ['Närmare två miljarder år av jordens geologiska historia', 'Spår av meteoritnedslag från månen', 'Endast istidens smältvatten', 'Antika guldfyndigheter'],
          explain: 'Från de yngsta kalkstenslagren vid kanten till det urgamla urberget i botten utgör Grand Canyon en öppen geologisk lärobok.'
        }
      ]
    },

    chichenitza: {
      id: 'chichenitza',
      spots: ["Ormguden Kukulcáns skugga","El Castillos 365 trappsteg","Yucatáns heliga cenoter"],
      name: 'Chichén Itzá',
      country: 'Mexiko',
      region: 'Nordamerika',
      lat: 20.68,
      lon: -88.57,
      from: 'mexicocity',
      transportMode: 'Flyg till Yucatán',
      transport: 590,
      fee: 210,
      hoursEach: 3,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/chichenitza.jpg',
      fact: 'Mitt i Yucatáns djungel reser sig mayafolkets berömda trappstegspyramid El Castillo, ett astronomiskt mästerverk i sten.',
      questions: [
        {
          q: 'Vilket dramatiskt skuggspel uppstår på pyramiden El Castillo vid vår- och höstdagjämningen?',
          t: 'mc',
          a: ['En slingrande skugga av ormguden Kukulcán tycks krypa nerför trappan', 'Pyramiden kastar ingen skugga alls', 'Solen lyser rakt igenom en tunnel i toppen', 'Skuggan bildar en perfekt cirkel'],
          explain: 'Solens vinkel får sju triangulära ljusskuggor att vandra längs räcket tills de förenas med de huggna ormhuvudena vid trappans fot.'
        },
        {
          q: 'Hur många trappsteg har de fyra sidorna på El Castillo tillsammans med topp-plattformen, och vad symboliserar talet?',
          t: 'mc',
          a: ['365 trappsteg – ett för varje dag på solåret', '100 trappsteg – ett för varje århundrade', '52 trappsteg – en för varje vecka', '1 000 trappsteg – för evigheten'],
          explain: 'Varje av pyramidens fyra trappor har 91 steg (4 × 91 = 364), och tillsammans med den översta tempelplattformen blir summan exakt 365.'
        },
        {
          q: 'Vad är de vattenfyllda naturliga kalkstensslukhålen runt Chichén Itzá kända som?',
          t: 'mc',
          a: ['Cenoter', 'Gejsrar', 'Fjordar', 'Laguner'],
          explain: 'Cenoterna gav både färskvatten i Yucatáns regnskog och fungerade som heliga offerplatser för mayafolket.'
        }
      ]
    },

    // --- SYDAMERIKA ---
    machupicchu: {
      id: 'machupicchu',
      spots: ["Hiram Binghams upptäckt 1911","Inkas jordbävningssäkra murar","Kejsar Pachacutis bergstad"],
      name: 'Machu Picchu',
      country: 'Peru',
      region: 'Sydamerika',
      lat: -13.16,
      lon: -72.55,
      from: 'rio',
      transportMode: 'Andesflyg till Cusco & bergståg',
      transport: 1120,
      fee: 290,
      hoursEach: 5,
      visitHours: 6,
      gearVisitHours: 4,
      gear: null,
      photo: 'assets/wonders/machupicchu.jpg',
      fact: 'På en smal bergskam 2 430 meter upp i de peruanska Anderna gömmer sig inkarikets legendariska stenstad, omgiven av molnskog och branta toppar.',
      questions: [
        {
          q: 'Vilken amerikansk historiker gjorde Machu Picchu världskänt när han leddes dit av lokala bönder år 1911?',
          t: 'mc',
          a: ['Hiram Bingham', 'Alexander von Humboldt', 'Charles Darwin', 'Thor Heyerdahl'],
          explain: 'Yale-historikern Hiram Bingham letade egentligen efter inkarikets sista tillflyktsort Vilcabamba när 11-årige Pablito Alvarez visade honom ruinerna.'
        },
        {
          q: 'Hur kunde inkafolkets stenmurar i Machu Picchu överleva kraftiga jordbävningar helt utan murbruk?',
          t: 'mc',
          a: ['Stenblocken höggs så exakt att de låser i varandra och "dansar" tillbaka på plats', 'De hölls ihop med järnklamrar', 'De limmades med trädkåda', 'De vilade på gummikuddar'],
          explain: 'Inkas torrmurarteknik (ashlar) är så exakt att man inte ens får in ett knivblad mellan stenarna, och vid jordskalv skakar blocken utan att rasa.'
        },
        {
          q: 'Under vilken berömd inkahärskare byggdes Machu Picchu omkring år 1450?',
          t: 'mc',
          a: ['Pachacuti', 'Atahualpa', 'Montezuma', 'Simón Bolívar'],
          explain: 'Kejsar Pachacuti omvandlade kungariket Cusco till det väldiga Inkariket och lät uppföra Machu Picchu som kungligt residens och helgedom.'
        }
      ]
    },

    iguazu: {
      id: 'iguazu',
      spots: ["Djävulsgapet (Garganta del Diablo)","Guaraní-folkets stora vatten","Regnskogens 275 fall"],
      name: 'Iguazúfallen',
      country: 'Brasilien / Argentina',
      region: 'Sydamerika',
      lat: -25.69,
      lon: -54.44,
      from: 'rio',
      transportMode: 'Regnskogsflyg till Foz do Iguaçu',
      transport: 620,
      fee: 210,
      hoursEach: 3,
      visitHours: 5,
      gearVisitHours: 3,
      gear: null,
      photo: 'assets/wonders/iguazu.jpg',
      fact: 'Mitt i den subtropiska regnskogen på gränsen mellan Brasilien och Argentina kastar sig 275 vattenfall utför en hästskoformad avgrund med öronbedövande dån.',
      questions: [
        {
          q: 'Vad heter den mest dramatiska, U-formade och 80 meter höga huvudklyftan i Iguazúfallen?',
          t: 'mc',
          a: ['Djävulsgapet', 'Änglafallet', 'Silverporten', 'Smaragdavgrunden'],
          explain: 'Garganta del Diablo samlar nästan hälften av flodens vattenmassor i en hästskoformad klyfta där vattendimman ständigt skapar regnbågar.'
        },
        {
          q: 'Vad betyder "Iguazú" på ursprungsfolket guaranís språk?',
          t: 'mc',
          a: ['Stort vatten', 'Dånande skog', 'Regnbågens hem', 'Vilda floden'],
          explain: 'Namnet kommer från guaraní-orden "y" (vatten) och "ûasú" (stort), och syftar på världens bredaste vattenfallssystem.'
        },
        {
          q: 'Vad ska USA:s tidigare första dam Eleanor Roosevelt ha utbrustit när hon såg Iguazúfallen för första gången?',
          t: 'mc',
          a: ['"Stackars Niagara!"', '"Vackrare än Grand Canyon!"', '"Här bor tystnaden!"', '"Detta överträffar Alperna!"'],
          explain: 'Eftersom Iguazúfallen är betydligt högre och nästan dubbelt så breda som Niagarafallen blev Eleanor Roosevelts kommentar "Poor Niagara!" berömd.'
        }
      ]
    }
  };
})();
