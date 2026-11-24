// Globetrotter - 50 Klassiska BackPacker 1 & 2-städer (Totalt 67 fullt utbyggda städer!)
// Innehåller 50 städer, 150 riktiga sevärdheter, 150+ unika frågor, 100 souvenirer,
// 50 hotell, 50 barer, 150 lokala jobb, pass-stämplar, landsfakta och nya tåglinjer.

(function () {
  'use strict';
  const W = window.GT_WORLD;
  const Q = window.GT_QUESTIONS;
  if (!W || !Q) return;

  window.GT_EXTRA_STAMPS = window.GT_EXTRA_STAMPS || {};
  window.GT_CITY_ISO = window.GT_CITY_ISO || {};
  window.GT_COUNTRY_FACTS = window.GT_COUNTRY_FACTS || {};
  window.GT_COUNTRY_HISTORY = window.GT_COUNTRY_HISTORY || {};

  const EXTRA_CITIES = [
  {
    "key": "oslo",
    "iso": "no",
    "country": "Norge",
    "region": "Europa",
    "name": "Oslo",
    "code": "OSL",
    "stampColor": "#7a2222",
    "stampShape": "round",
    "stampRot": -6,
    "cityObj": {
      "name": "Oslo",
      "country": "Norge",
      "region": "Europa",
      "lat": 59.91,
      "lon": 10.75,
      "tagline": "Fjordhuvudstad bland skog och skulpturer",
      "skyline": "assets/cities/oslo.jpg",
      "hotel": {
        "name": "Grand Hotel Karl Johan",
        "price": 690
      },
      "highlights": [
        "oslo_s1",
        "oslo_s2",
        "oslo_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "osthyvel",
        "lusekofta"
      ],
      "signature": {
        "name": "Fiskebaren Aker Brygge",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Fiskebaren Aker Brygge i Oslo för en skål fisksoppa och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Oslo",
          "employer": "Oslos Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Oslo och svara på frågor om Norge."
        },
        {
          "title": "Receptionist på Grand Hotel Karl Johan",
          "employer": "Grand Hotel Karl Johan",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Grand Hotel Karl Johan — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Oslo",
          "employer": "Oslos Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Oslo."
        }
      ]
    },
    "placesObj": {
      "oslo_s1": {
        "name": "Vigelandsparken",
        "photo": "assets/cities/oslo.jpg",
        "fact": "Världens största skulpturpark skapad av en enda konstnär, Gustav Vigeland, med över 200 granitskulpturer.",
        "hours": 2
      },
      "oslo_s2": {
        "name": "Operahuset i Oslo",
        "photo": "assets/cities/oslo.jpg",
        "fact": "Ikoniskt marmorklätt operahus i Bjørvika där besökare kan promenera ända upp på taket.",
        "hours": 2
      },
      "oslo_s3": {
        "name": "Akershus fästning",
        "photo": "assets/cities/oslo.jpg",
        "fact": "Medeltida borg och slott som vakat över Oslofjorden sedan omkring år 1300.",
        "hours": 2
      }
    },
    "souvDefs": {
      "osthyvel": {
        "name": "Norsk osthyvel",
        "origin": "oslo",
        "basePrice": 190,
        "kind": "souvenir",
        "desc": "Klassisk norsk uppfinning från 1925.",
        "photo": "assets/souvenirs/dalahast.jpg"
      },
      "lusekofta": {
        "name": "Stickad lusekofta",
        "origin": "oslo",
        "basePrice": 520,
        "kind": "souvenir",
        "desc": "Varm ylletröja i traditionellt mönster.",
        "photo": "assets/souvenirs/sjal.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_oslo_s1_1",
        "city": "oslo",
        "place": "oslo_s1",
        "t": "mc",
        "q": "Hur många skulpturer rymmer Vigelandsparken i Oslo?",
        "a": [
          "Över 200 skulpturer",
          "Cirka 25 skulpturer",
          "Exakt 50 skulpturer",
          "12 skulpturer"
        ],
        "explain": "Gustav Vigeland skapade över 200 skulpturer i brons, granit och smidesjärn, med den 17 meter höga Monolitten i centrum."
      },
      {
        "id": "q50_oslo_s2_1",
        "city": "oslo",
        "place": "oslo_s2",
        "t": "mc",
        "q": "Vilket material täcker det lutande taket på Operahuset i Oslo?",
        "a": [
          "Vit italiensk Carrara-marmor",
          "Rött skiffer",
          "Kopparplåt",
          "Norsk björk"
        ],
        "explain": "Operahuset invigdes 2008 och dess sluttande marmortak fungerar som ett offentligt torg med utsikt över Oslofjorden."
      },
      {
        "id": "q50_oslo_s3_1",
        "city": "oslo",
        "place": "oslo_s3",
        "t": "mc",
        "q": "Vilken norsk kung lät påbörja bygget av Akershus fästning omkring 1299?",
        "a": [
          "Håkon V Magnusson",
          "Olav den helige",
          "Harald Hårfager",
          "Magnus Ladulås"
        ],
        "explain": "Kung Håkon V flyttade Norges huvudstad till Oslo och byggde Akershus som skydd mot fientliga angrepp."
      },
      {
        "id": "q50_oslo_job1",
        "city": "oslo",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Oslo?",
        "a": [
          "Norge",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Oslo ligger i Norge (Europa), där man talar norska och använder valutan Norsk krona (NOK)."
      },
      {
        "id": "q50_oslo_job2",
        "city": "oslo",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Norge (Oslo)?",
        "a": [
          "Norsk krona",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Norge betalar man med Norsk krona (NOK). Norge har världens näst längsta kustlinje tack vare sina djupa fjordar."
      },
      {
        "id": "q50_oslo_job_s1",
        "city": "oslo",
        "place": "job",
        "t": "mc",
        "q": "Hur många skulpturer rymmer Vigelandsparken i Oslo?",
        "a": [
          "Över 200 skulpturer",
          "Cirka 25 skulpturer",
          "Exakt 50 skulpturer",
          "12 skulpturer"
        ],
        "explain": "Gustav Vigeland skapade över 200 skulpturer i brons, granit och smidesjärn, med den 17 meter höga Monolitten i centrum."
      },
      {
        "id": "q50_oslo_job_s2",
        "city": "oslo",
        "place": "job",
        "t": "mc",
        "q": "Vilket material täcker det lutande taket på Operahuset i Oslo?",
        "a": [
          "Vit italiensk Carrara-marmor",
          "Rött skiffer",
          "Kopparplåt",
          "Norsk björk"
        ],
        "explain": "Operahuset invigdes 2008 och dess sluttande marmortak fungerar som ett offentligt torg med utsikt över Oslofjorden."
      },
      {
        "id": "q50_oslo_job_s3",
        "city": "oslo",
        "place": "job",
        "t": "mc",
        "q": "Vilken norsk kung lät påbörja bygget av Akershus fästning omkring 1299?",
        "a": [
          "Håkon V Magnusson",
          "Olav den helige",
          "Harald Hårfager",
          "Magnus Ladulås"
        ],
        "explain": "Kung Håkon V flyttade Norges huvudstad till Oslo och byggde Akershus som skydd mot fientliga angrepp."
      }
    ],
    "tavern": {
      "name": "Fiskebaren Aker Brygge",
      "drink": "en skål fisksoppa",
      "drinkCost": 110
    },
    "facts": [
      "Oslo",
      "5,5 miljoner",
      "Norska",
      "Norsk krona (NOK)",
      "Norge har världens näst längsta kustlinje tack vare sina djupa fjordar.",
      "Nobels fredspris delas varje år ut i Oslo rådhus den 10 december."
    ]
  },
  {
    "key": "kopenhamn",
    "iso": "dk",
    "country": "Danmark",
    "region": "Europa",
    "name": "Köpenhamn",
    "code": "CPH",
    "stampColor": "#1d4f7a",
    "stampShape": "oval",
    "stampRot": 1,
    "cityObj": {
      "name": "Köpenhamn",
      "country": "Danmark",
      "region": "Europa",
      "lat": 55.68,
      "lon": 12.57,
      "tagline": "Cykelstad med färgglada kanalhus och gemyt",
      "skyline": "assets/cities/kopenhamn.jpg",
      "hotel": {
        "name": "Hotel Nyhavn",
        "price": 660
      },
      "highlights": [
        "kopenhamn_s1",
        "kopenhamn_s2",
        "kopenhamn_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "porslin_dk",
        "lakrits_dk"
      ],
      "signature": {
        "name": "Bodega vid Strøget",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Bodega vid Strøget i Köpenhamn för ett smørrebrød och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Köpenhamn",
          "employer": "Köpenhamns Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Köpenhamn och svara på frågor om Danmark."
        },
        {
          "title": "Receptionist på Hotel Nyhavn",
          "employer": "Hotel Nyhavn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Nyhavn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Köpenhamn",
          "employer": "Köpenhamns Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Köpenhamn."
        }
      ]
    },
    "placesObj": {
      "kopenhamn_s1": {
        "name": "Nyhavn",
        "photo": "assets/cities/kopenhamn.jpg",
        "fact": "1600-talskanal kantad av färgglada gavelhus och gamla träskepp där en världsberömd sagoförfattare bodde i flera olika hus.",
        "hours": 2
      },
      "kopenhamn_s2": {
        "name": "Tivoli",
        "photo": "assets/cities/kopenhamn.jpg",
        "fact": "En av världens äldsta nöjesparker mitt i centrala Köpenhamn, öppnad medan Kristian VIII var Danmarks kung.",
        "hours": 2
      },
      "kopenhamn_s3": {
        "name": "Den lille havfrue",
        "photo": "assets/cities/kopenhamn.jpg",
        "fact": "Bronsstaty vid Langelinie skapad 1913 av skulptören Edvard Eriksen.",
        "hours": 2
      }
    },
    "souvDefs": {
      "porslin_dk": {
        "name": "Blåvitt danskt porslin",
        "origin": "kopenhamn",
        "basePrice": 460,
        "kind": "souvenir",
        "desc": "Handmålat porslin från Köpenhamn.",
        "photo": "assets/souvenirs/tekanna_kina.jpg"
      },
      "lakrits_dk": {
        "name": "Dansk gourmetlakrits",
        "origin": "kopenhamn",
        "basePrice": 180,
        "kind": "souvenir",
        "desc": "Söt och salt lakrits i plåtburk.",
        "photo": "assets/souvenirs/kryddor.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_kopenhamn_s1_1",
        "city": "kopenhamn",
        "place": "kopenhamn_s1",
        "t": "mc",
        "q": "Vilken världsberömd sagoförfattare bodde i flera hus längs Nyhavn?",
        "a": [
          "H.C. Andersen",
          "Astrid Lindgren",
          "Søren Kierkegaard",
          "Karen Blixen"
        ],
        "explain": "Hans Christian Andersen skrev bland annat \"Prinsessan på ärten\" medan han bodde på Nyhavn 20."
      },
      {
        "id": "q50_kopenhamn_s2_1",
        "city": "kopenhamn",
        "place": "kopenhamn_s2",
        "t": "mc",
        "q": "Vilket år öppnade nöjesparken Tivoli i Köpenhamn?",
        "a": [
          "1843",
          "1905",
          "1789",
          "1955"
        ],
        "explain": "Tivoli öppnade 1843 och inspirerade senare Walt Disney när han skapade Disneyland."
      },
      {
        "id": "q50_kopenhamn_s3_1",
        "city": "kopenhamn",
        "place": "kopenhamn_s3",
        "t": "mc",
        "q": "Vilken berömd saga ligger bakom statyn Den lille havfrue vid Langelinie?",
        "a": [
          "Den lilla sjöjungfrun",
          "Tummelisa",
          "Den fula ankungen",
          "Snödrottningen"
        ],
        "explain": "Statyn skänktes till staden av bryggaren Carl Jacobsen efter att han sett baletten om H.C. Andersens saga."
      },
      {
        "id": "q50_kopenhamn_job1",
        "city": "kopenhamn",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Köpenhamn?",
        "a": [
          "Danmark",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Köpenhamn ligger i Danmark (Europa), där man talar danska och använder valutan Dansk krona (DKK)."
      },
      {
        "id": "q50_kopenhamn_job2",
        "city": "kopenhamn",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Danmark (Köpenhamn)?",
        "a": [
          "Dansk krona",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Danmark betalar man med Dansk krona (DKK). Danmark består av halvön Jylland och över 400 öar."
      },
      {
        "id": "q50_kopenhamn_job_s1",
        "city": "kopenhamn",
        "place": "job",
        "t": "mc",
        "q": "Vilken världsberömd sagoförfattare bodde i flera hus längs Nyhavn?",
        "a": [
          "H.C. Andersen",
          "Astrid Lindgren",
          "Søren Kierkegaard",
          "Karen Blixen"
        ],
        "explain": "Hans Christian Andersen skrev bland annat \"Prinsessan på ärten\" medan han bodde på Nyhavn 20."
      },
      {
        "id": "q50_kopenhamn_job_s2",
        "city": "kopenhamn",
        "place": "job",
        "t": "mc",
        "q": "Vilket år öppnade nöjesparken Tivoli i Köpenhamn?",
        "a": [
          "1843",
          "1905",
          "1789",
          "1955"
        ],
        "explain": "Tivoli öppnade 1843 och inspirerade senare Walt Disney när han skapade Disneyland."
      },
      {
        "id": "q50_kopenhamn_job_s3",
        "city": "kopenhamn",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd saga ligger bakom statyn Den lille havfrue vid Langelinie?",
        "a": [
          "Den lilla sjöjungfrun",
          "Tummelisa",
          "Den fula ankungen",
          "Snödrottningen"
        ],
        "explain": "Statyn skänktes till staden av bryggaren Carl Jacobsen efter att han sett baletten om H.C. Andersens saga."
      }
    ],
    "tavern": {
      "name": "Bodega vid Strøget",
      "drink": "ett smørrebrød",
      "drinkCost": 110
    },
    "facts": [
      "Köpenhamn",
      "5,9 miljoner",
      "Danska",
      "Dansk krona (DKK)",
      "Danmark består av halvön Jylland och över 400 öar.",
      "Öresundsbron förbinder Köpenhamn med Malmö sedan år 2000."
    ]
  },
  {
    "key": "helsingfors",
    "iso": "fi",
    "country": "Finland",
    "region": "Europa",
    "name": "Helsingfors",
    "code": "HEL",
    "stampColor": "#246b36",
    "stampShape": "rect",
    "stampRot": -5,
    "cityObj": {
      "name": "Helsingfors",
      "country": "Finland",
      "region": "Europa",
      "lat": 60.17,
      "lon": 24.94,
      "tagline": "Vit nyklassicism vid Finska viken",
      "skyline": "assets/cities/helsingfors.jpg",
      "hotel": {
        "name": "Hotell Esplanaden",
        "price": 620
      },
      "highlights": [
        "helsingfors_s1",
        "helsingfors_s2",
        "helsingfors_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "muminmugg",
        "bastu_set"
      ],
      "signature": {
        "name": "Kafé vid Salutorget",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kafé vid Salutorget i Helsingfors för en karelsk pirog och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Helsingfors",
          "employer": "Helsingforss Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Helsingfors och svara på frågor om Finland."
        },
        {
          "title": "Receptionist på Hotell Esplanaden",
          "employer": "Hotell Esplanaden",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotell Esplanaden — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Helsingfors",
          "employer": "Helsingforss Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Helsingfors."
        }
      ]
    },
    "placesObj": {
      "helsingfors_s1": {
        "name": "Sveaborg",
        "photo": "assets/cities/helsingfors.jpg",
        "fact": "En av världens största sjöfästningar, byggd på sex öar utanför Helsingfors hamn på 1700-talet.",
        "hours": 2
      },
      "helsingfors_s2": {
        "name": "Helsingfors domkyrka",
        "photo": "assets/cities/helsingfors.jpg",
        "fact": "Kritvit nyklassisk katedral med gröna kupoler som tronar överst på en bred trappa ovanför stadens mest kända torg.",
        "hours": 2
      },
      "helsingfors_s3": {
        "name": "Tempelplatsens kyrka",
        "photo": "assets/cities/helsingfors.jpg",
        "fact": "Unik kyrka sprängd direkt ner i det finska urberget med en stor kopparkupol.",
        "hours": 2
      }
    },
    "souvDefs": {
      "muminmugg": {
        "name": "Finsk designmugg",
        "origin": "helsingfors",
        "basePrice": 240,
        "kind": "souvenir",
        "desc": "Klassisk finsk keramik med sagomotiv.",
        "photo": "assets/souvenirs/kaffekanna.jpg"
      },
      "bastu_set": {
        "name": "Finsk bastuskopa i björk",
        "origin": "helsingfors",
        "basePrice": 290,
        "kind": "souvenir",
        "desc": "Doftande björkskopa för ångbastu.",
        "photo": "assets/souvenirs/dalahast.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_helsingfors_s1_1",
        "city": "helsingfors",
        "place": "helsingfors_s1",
        "t": "mc",
        "q": "Vilket rike byggde sjöfästningen Sveaborg på 1740-talet?",
        "a": [
          "Sverige",
          "Ryssland",
          "Danmark",
          "Preussen"
        ],
        "explain": "Augustin Ehrensvärd ledde det svenska fästningsbygget på Sveaborg (Suomenlinna), idag ett UNESCO-världsarv."
      },
      {
        "id": "q50_helsingfors_s2_1",
        "city": "helsingfors",
        "place": "helsingfors_s2",
        "t": "mc",
        "q": "På vilket berömt torg står Helsingfors vita domkyrka?",
        "a": [
          "Senatstorget",
          "Salutorget",
          "Järnvägstorget",
          "Rådhustorget"
        ],
        "explain": "Domkyrkan ritades av Carl Ludvig Engel och stod klar 1852 som kronan på Senatstorget."
      },
      {
        "id": "q50_helsingfors_s3_1",
        "city": "helsingfors",
        "place": "helsingfors_s3",
        "t": "mc",
        "q": "Hur är Tempelplatsens kyrka i Helsingfors byggd?",
        "a": [
          "Utsprängd rakt i fast granitberg",
          "Helt i furuträ",
          "På pålar i vattnet",
          "Av återvunnet tegel"
        ],
        "explain": "De obehandlade bergväggarna ger kyrkan en enastående akustik för konserter."
      },
      {
        "id": "q50_helsingfors_job1",
        "city": "helsingfors",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Helsingfors?",
        "a": [
          "Finland",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Helsingfors ligger i Finland (Europa), där man talar finska & svenska och använder valutan Euro (EUR)."
      },
      {
        "id": "q50_helsingfors_job2",
        "city": "helsingfors",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Finland (Helsingfors)?",
        "a": [
          "Euro",
          "Brittiskt pund",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Finland betalar man med Euro (EUR). Finland kallas \"De tusen sjöarnas land\" och har över 180 000 sjöar."
      },
      {
        "id": "q50_helsingfors_job_s1",
        "city": "helsingfors",
        "place": "job",
        "t": "mc",
        "q": "Vilket rike byggde sjöfästningen Sveaborg på 1740-talet?",
        "a": [
          "Sverige",
          "Ryssland",
          "Danmark",
          "Preussen"
        ],
        "explain": "Augustin Ehrensvärd ledde det svenska fästningsbygget på Sveaborg (Suomenlinna), idag ett UNESCO-världsarv."
      },
      {
        "id": "q50_helsingfors_job_s2",
        "city": "helsingfors",
        "place": "job",
        "t": "mc",
        "q": "På vilket berömt torg står Helsingfors vita domkyrka?",
        "a": [
          "Senatstorget",
          "Salutorget",
          "Järnvägstorget",
          "Rådhustorget"
        ],
        "explain": "Domkyrkan ritades av Carl Ludvig Engel och stod klar 1852 som kronan på Senatstorget."
      },
      {
        "id": "q50_helsingfors_job_s3",
        "city": "helsingfors",
        "place": "job",
        "t": "mc",
        "q": "Hur är Tempelplatsens kyrka i Helsingfors byggd?",
        "a": [
          "Utsprängd rakt i fast granitberg",
          "Helt i furuträ",
          "På pålar i vattnet",
          "Av återvunnet tegel"
        ],
        "explain": "De obehandlade bergväggarna ger kyrkan en enastående akustik för konserter."
      }
    ],
    "tavern": {
      "name": "Kafé vid Salutorget",
      "drink": "en karelsk pirog",
      "drinkCost": 110
    },
    "facts": [
      "Helsingfors",
      "5,6 miljoner",
      "Finska & svenska",
      "Euro (EUR)",
      "Finland kallas \"De tusen sjöarnas land\" och har över 180 000 sjöar.",
      "Helsingfors grundades 1550 av svenske kungen Gustav Vasa."
    ]
  },
  {
    "key": "reykjavik",
    "iso": "is",
    "country": "Island",
    "region": "Europa",
    "name": "Reykjavik",
    "code": "KEF",
    "stampColor": "#6b3e1b",
    "stampShape": "round",
    "stampRot": 2,
    "cityObj": {
      "name": "Reykjavik",
      "country": "Island",
      "region": "Europa",
      "lat": 64.15,
      "lon": -21.94,
      "tagline": "Världens nordligaste huvudstad bland gejsrar",
      "skyline": "assets/cities/reykjavik.jpg",
      "hotel": {
        "name": "Guesthouse Laugavegur",
        "price": 710
      },
      "highlights": [
        "reykjavik_s1",
        "reykjavik_s2",
        "reykjavik_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "lopapeysa",
        "lavasten"
      ],
      "signature": {
        "name": "Hamnbaren i Reykjavik",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Hamnbaren i Reykjavik i Reykjavik för en varm lammsoppa och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Reykjavik",
          "employer": "Reykjaviks Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Reykjavik och svara på frågor om Island."
        },
        {
          "title": "Receptionist på Guesthouse Laugavegur",
          "employer": "Guesthouse Laugavegur",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Guesthouse Laugavegur — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Reykjavik",
          "employer": "Reykjaviks Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Reykjavik."
        }
      ]
    },
    "placesObj": {
      "reykjavik_s1": {
        "name": "Hallgrímskirkja",
        "photo": "assets/cities/reykjavik.jpg",
        "fact": "74 meter hög kyrka inspirerad av Islands sexkantiga basaltpelare.",
        "hours": 2
      },
      "reykjavik_s2": {
        "name": "Harpa Konserthus",
        "photo": "assets/cities/reykjavik.jpg",
        "fact": "Glittrande konserthus vid hamnen täckt av geometriska glaspaneler.",
        "hours": 2
      },
      "reykjavik_s3": {
        "name": "Sun Voyager (Sólfar)",
        "photo": "assets/cities/reykjavik.jpg",
        "fact": "Blank skulptur i rostfritt stål vid havet som liknar ett drömlikt vikingaskepp.",
        "hours": 2
      }
    },
    "souvDefs": {
      "lopapeysa": {
        "name": "Isländsk ylletröja",
        "origin": "reykjavik",
        "basePrice": 580,
        "kind": "souvenir",
        "desc": "Handstickad tröja av isländsk fårull.",
        "photo": "assets/souvenirs/sjal.jpg"
      },
      "lavasten": {
        "name": "Polerad vulkanisk lavasten",
        "origin": "reykjavik",
        "basePrice": 210,
        "kind": "souvenir",
        "desc": "Svart basalt från Islands vulkaner.",
        "photo": "assets/souvenirs/fossil.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_reykjavik_s1_1",
        "city": "reykjavik",
        "place": "reykjavik_s1",
        "t": "mc",
        "q": "Vilken naturformation inspirerade arkitekturen på Hallgrímskirkja?",
        "a": [
          "Vulkaniska basaltpelare",
          "Glaciärsprickor",
          "Vikingaskepp",
          "Geysrar"
        ],
        "explain": "Arkitekten Guðjón Samúelsson formade fasaden efter de mörka basaltkolonnerna vid Svartifoss."
      },
      {
        "id": "q50_reykjavik_s2_1",
        "city": "reykjavik",
        "place": "reykjavik_s2",
        "t": "mc",
        "q": "Vilken dansk-isländsk konstnär skapade glasfasaden på konserthuset Harpa?",
        "a": [
          "Olafur Eliasson",
          "Björk",
          "Edvard Munch",
          "Asger Jorn"
        ],
        "explain": "Olafur Eliasson designade de bikakeformade glasblocken som skiftar färg i det nordiska ljuset."
      },
      {
        "id": "q50_reykjavik_s3_1",
        "city": "reykjavik",
        "place": "reykjavik_s3",
        "t": "mc",
        "q": "Vad föreställer skulpturen Sun Voyager vid Reykjaviks strandpromenad?",
        "a": [
          "Ett drömskepp mot horisonten",
          "En valfena",
          "En vulkan",
          "En falk"
        ],
        "explain": "Jón Gunnar Árnasons skulptur från 1990 är en hyllning till solen, upptäckarlust och nya horisonter."
      },
      {
        "id": "q50_reykjavik_job1",
        "city": "reykjavik",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Reykjavik?",
        "a": [
          "Island",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Reykjavik ligger i Island (Europa), där man talar isländska och använder valutan Isländsk krona (ISK)."
      },
      {
        "id": "q50_reykjavik_job2",
        "city": "reykjavik",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Island (Reykjavik)?",
        "a": [
          "Isländsk krona",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Island betalar man med Isländsk krona (ISK). Island drivs nästan helt av geotermisk energi och vattenkraft."
      },
      {
        "id": "q50_reykjavik_job_s1",
        "city": "reykjavik",
        "place": "job",
        "t": "mc",
        "q": "Vilken naturformation inspirerade arkitekturen på Hallgrímskirkja?",
        "a": [
          "Vulkaniska basaltpelare",
          "Glaciärsprickor",
          "Vikingaskepp",
          "Geysrar"
        ],
        "explain": "Arkitekten Guðjón Samúelsson formade fasaden efter de mörka basaltkolonnerna vid Svartifoss."
      },
      {
        "id": "q50_reykjavik_job_s2",
        "city": "reykjavik",
        "place": "job",
        "t": "mc",
        "q": "Vilken dansk-isländsk konstnär skapade glasfasaden på konserthuset Harpa?",
        "a": [
          "Olafur Eliasson",
          "Björk",
          "Edvard Munch",
          "Asger Jorn"
        ],
        "explain": "Olafur Eliasson designade de bikakeformade glasblocken som skiftar färg i det nordiska ljuset."
      },
      {
        "id": "q50_reykjavik_job_s3",
        "city": "reykjavik",
        "place": "job",
        "t": "mc",
        "q": "Vad föreställer skulpturen Sun Voyager vid Reykjaviks strandpromenad?",
        "a": [
          "Ett drömskepp mot horisonten",
          "En valfena",
          "En vulkan",
          "En falk"
        ],
        "explain": "Jón Gunnar Árnasons skulptur från 1990 är en hyllning till solen, upptäckarlust och nya horisonter."
      }
    ],
    "tavern": {
      "name": "Hamnbaren i Reykjavik",
      "drink": "en varm lammsoppa",
      "drinkCost": 110
    },
    "facts": [
      "Reykjavik",
      "390 000",
      "Isländska",
      "Isländsk krona (ISK)",
      "Island drivs nästan helt av geotermisk energi och vattenkraft.",
      "Världens äldsta bevarade parlament, Alltinget, grundades på Island år 930."
    ]
  },
  {
    "key": "dublin",
    "iso": "ie",
    "country": "Irland",
    "region": "Europa",
    "name": "Dublin",
    "code": "DUB",
    "stampColor": "#5b2870",
    "stampShape": "oval",
    "stampRot": -4,
    "cityObj": {
      "name": "Dublin",
      "country": "Irland",
      "region": "Europa",
      "lat": 53.35,
      "lon": -6.26,
      "tagline": "Litteraturstad med gröna parker och livemusik",
      "skyline": "assets/cities/dublin.jpg",
      "hotel": {
        "name": "Temple Bar Inn",
        "price": 640
      },
      "highlights": [
        "dublin_s1",
        "dublin_s2",
        "dublin_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "claddagh",
        "tweed_ie"
      ],
      "signature": {
        "name": "Pub vid floden Liffey",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Pub vid floden Liffey i Dublin för en irish stew och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Dublin",
          "employer": "Dublins Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Dublin och svara på frågor om Irland."
        },
        {
          "title": "Receptionist på Temple Bar Inn",
          "employer": "Temple Bar Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Temple Bar Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Dublin",
          "employer": "Dublins Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Dublin."
        }
      ]
    },
    "placesObj": {
      "dublin_s1": {
        "name": "Trinity College & Book of Kells",
        "photo": "assets/cities/dublin.jpg",
        "fact": "Irlands äldsta universitet med den magnifika boksalen Long Room och medeltidshandskriften Book of Kells.",
        "hours": 2
      },
      "dublin_s2": {
        "name": "Dublin Castle",
        "photo": "assets/cities/dublin.jpg",
        "fact": "Historiskt slott mitt i staden som i 700 år var centrum för det brittiska styret på Irland.",
        "hours": 2
      },
      "dublin_s3": {
        "name": "St. Patrick’s Cathedral",
        "photo": "assets/cities/dublin.jpg",
        "fact": "Irlands största katedral, där författaren Jonathan Swift var domprost.",
        "hours": 2
      }
    },
    "souvDefs": {
      "claddagh": {
        "name": "Irländsk Claddagh-ring",
        "origin": "dublin",
        "basePrice": 340,
        "kind": "souvenir",
        "desc": "Klassisk symbol för vänskap och trohet.",
        "photo": "assets/souvenirs/marmorask.jpg"
      },
      "tweed_ie": {
        "name": "Irländsk tweedkeps",
        "origin": "dublin",
        "basePrice": 310,
        "kind": "souvenir",
        "desc": "Handvävd yllekeps från Donegal.",
        "photo": "assets/souvenirs/baskermossa.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_dublin_s1_1",
        "city": "dublin",
        "place": "dublin_s1",
        "t": "mc",
        "q": "Vad är Book of Kells som förvaras på Trinity College i Dublin?",
        "a": [
          "Ett rikt illustrerat evangelium från ca år 800",
          "En lagbok från vikingatiden",
          "Shakespeares samlade verk",
          "En sjökarta över Atlanten"
        ],
        "explain": "Munkar skapade Book of Kells med keltisk ornamentik och naturliga pigment på kalvskinn."
      },
      {
        "id": "q50_dublin_s2_1",
        "city": "dublin",
        "place": "dublin_s2",
        "t": "mc",
        "q": "Vilken flod rinner genom centrala Dublin förbi Ha’penny Bridge?",
        "a": [
          "Liffey",
          "Shannon",
          "Themsen",
          "Clyde"
        ],
        "explain": "Floden Liffey delar Dublin i norra och södra staden och mynnar ut i Irländska sjön."
      },
      {
        "id": "q50_dublin_s3_1",
        "city": "dublin",
        "place": "dublin_s3",
        "t": "mc",
        "q": "Vilken berömd satirisk bok skrev Dublins domprost Jonathan Swift?",
        "a": [
          "Gullivers resor",
          "Skattkammarön",
          "Dracula",
          "Oliver Twist"
        ],
        "explain": "Jonathan Swift var domprost i St. Patrick’s från 1713 till sin död 1745 och ligger begravd i katedralen."
      },
      {
        "id": "q50_dublin_job1",
        "city": "dublin",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Dublin?",
        "a": [
          "Irland",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Dublin ligger i Irland (Europa), där man talar iriska & engelska och använder valutan Euro (EUR)."
      },
      {
        "id": "q50_dublin_job2",
        "city": "dublin",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Irland (Dublin)?",
        "a": [
          "Euro",
          "Brittiskt pund",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Irland betalar man med Euro (EUR). Irland har fostrat fyra Nobelpristagare i litteratur, däribland W.B. Yeats och Samuel Beckett."
      },
      {
        "id": "q50_dublin_job_s1",
        "city": "dublin",
        "place": "job",
        "t": "mc",
        "q": "Vad är Book of Kells som förvaras på Trinity College i Dublin?",
        "a": [
          "Ett rikt illustrerat evangelium från ca år 800",
          "En lagbok från vikingatiden",
          "Shakespeares samlade verk",
          "En sjökarta över Atlanten"
        ],
        "explain": "Munkar skapade Book of Kells med keltisk ornamentik och naturliga pigment på kalvskinn."
      },
      {
        "id": "q50_dublin_job_s2",
        "city": "dublin",
        "place": "job",
        "t": "mc",
        "q": "Vilken flod rinner genom centrala Dublin förbi Ha’penny Bridge?",
        "a": [
          "Liffey",
          "Shannon",
          "Themsen",
          "Clyde"
        ],
        "explain": "Floden Liffey delar Dublin i norra och södra staden och mynnar ut i Irländska sjön."
      },
      {
        "id": "q50_dublin_job_s3",
        "city": "dublin",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd satirisk bok skrev Dublins domprost Jonathan Swift?",
        "a": [
          "Gullivers resor",
          "Skattkammarön",
          "Dracula",
          "Oliver Twist"
        ],
        "explain": "Jonathan Swift var domprost i St. Patrick’s från 1713 till sin död 1745 och ligger begravd i katedralen."
      }
    ],
    "tavern": {
      "name": "Pub vid floden Liffey",
      "drink": "en irish stew",
      "drinkCost": 110
    },
    "facts": [
      "Dublin",
      "5,3 miljoner",
      "Iriska & engelska",
      "Euro (EUR)",
      "Irland har fostrat fyra Nobelpristagare i litteratur, däribland W.B. Yeats och Samuel Beckett.",
      "Dublin grundades ursprungligen av nordiska vikingar på 800-talet."
    ]
  },
  {
    "key": "amsterdam",
    "iso": "nl",
    "country": "Nederländerna",
    "region": "Europa",
    "name": "Amsterdam",
    "code": "AMS",
    "stampColor": "#8c3c14",
    "stampShape": "rect",
    "stampRot": 3,
    "cityObj": {
      "name": "Amsterdam",
      "country": "Nederländerna",
      "region": "Europa",
      "lat": 52.37,
      "lon": 4.9,
      "tagline": "Kanalringar, smala gavelhus och miljoner cyklar",
      "skyline": "assets/cities/amsterdam.jpg",
      "hotel": {
        "name": "Canal House Hotel",
        "price": 680
      },
      "highlights": [
        "amsterdam_s1",
        "amsterdam_s2",
        "amsterdam_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "traslojd_nl",
        "delft_nl"
      ],
      "signature": {
        "name": "Brunt kafé i Jordaan",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Brunt kafé i Jordaan i Amsterdam för stroopwafel & kaffe och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Amsterdam",
          "employer": "Amsterdams Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Amsterdam och svara på frågor om Nederländerna."
        },
        {
          "title": "Receptionist på Canal House Hotel",
          "employer": "Canal House Hotel",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Canal House Hotel — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Amsterdam",
          "employer": "Amsterdams Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Amsterdam."
        }
      ]
    },
    "placesObj": {
      "amsterdam_s1": {
        "name": "Rijksmuseum",
        "photo": "assets/cities/amsterdam.jpg",
        "fact": "Nederländernas nationalmuseum fyllt av 1600-talets holländska guldålderskonst.",
        "hours": 2
      },
      "amsterdam_s2": {
        "name": "Anne Franks hus",
        "photo": "assets/cities/amsterdam.jpg",
        "fact": "Kanalhus på Prinsengracht där Anne Frank och hennes familj gömde sig under andra världskriget.",
        "hours": 2
      },
      "amsterdam_s3": {
        "name": "Amsterdams kanalbälte",
        "photo": "assets/cities/amsterdam.jpg",
        "fact": "Koncentriska 1600-talskanaler kantade av över 1 500 broar och lutande köpmanshus.",
        "hours": 2
      }
    },
    "souvDefs": {
      "traslojd_nl": {
        "name": "Målade träskor (Klompen)",
        "origin": "amsterdam",
        "basePrice": 240,
        "kind": "souvenir",
        "desc": "Klassiska holländska träskor i miniatyr.",
        "photo": "assets/souvenirs/dalahast.jpg"
      },
      "delft_nl": {
        "name": "Delftblå kakelplatta",
        "origin": "amsterdam",
        "basePrice": 320,
        "kind": "souvenir",
        "desc": "Handmålad blåvit keramik i 1600-talsstil.",
        "photo": "assets/souvenirs/tekanna_kina.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_amsterdam_s1_1",
        "city": "amsterdam",
        "place": "amsterdam_s1",
        "t": "mc",
        "q": "Vilken berömd tavla av Rembrandt är Rijksmuseums största dragplåster?",
        "a": [
          "Nattvakten",
          "Stjärnenatt",
          "Flicka med pärlörhänge",
          "Mona Lisa"
        ],
        "explain": "Rembrandts monumentala grupporträtt Nattvakten från 1642 hänger i museets hedersgalleri."
      },
      {
        "id": "q50_amsterdam_s2_1",
        "city": "amsterdam",
        "place": "amsterdam_s2",
        "t": "mc",
        "q": "Vad dolde ingången till gårdshuset där familjen Frank gömde sig?",
        "a": [
          "En svängbar bokhylla",
          "En målning",
          "En källarlucka",
          "Ett piano"
        ],
        "explain": "Den hemliga bokhyllan ledde in till \"Gårdshuset\" där Anne skrev sin världsberömda dagbok."
      },
      {
        "id": "q50_amsterdam_s3_1",
        "city": "amsterdam",
        "place": "amsterdam_s3",
        "t": "mc",
        "q": "Varför har många gamla kanalhus i Amsterdam en krok högst upp på gaveln?",
        "a": [
          "För att hissa upp tunga möbler genom fönstren",
          "För att hänga cyklar",
          "För att fästa flaggor",
          "Som åskledare"
        ],
        "explain": "Trapporna i de smala kanalhusen var för trånga, så varor och möbler hissades upp utifrån!"
      },
      {
        "id": "q50_amsterdam_job1",
        "city": "amsterdam",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Amsterdam?",
        "a": [
          "Nederländerna",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Amsterdam ligger i Nederländerna (Europa), där man talar nederländska och använder valutan Euro (EUR)."
      },
      {
        "id": "q50_amsterdam_job2",
        "city": "amsterdam",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Nederländerna (Amsterdam)?",
        "a": [
          "Euro",
          "Brittiskt pund",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Nederländerna betalar man med Euro (EUR). Ungefär en fjärdedel av Nederländerna ligger under havsnivån, skyddat av vallar."
      },
      {
        "id": "q50_amsterdam_job_s1",
        "city": "amsterdam",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd tavla av Rembrandt är Rijksmuseums största dragplåster?",
        "a": [
          "Nattvakten",
          "Stjärnenatt",
          "Flicka med pärlörhänge",
          "Mona Lisa"
        ],
        "explain": "Rembrandts monumentala grupporträtt Nattvakten från 1642 hänger i museets hedersgalleri."
      },
      {
        "id": "q50_amsterdam_job_s2",
        "city": "amsterdam",
        "place": "job",
        "t": "mc",
        "q": "Vad dolde ingången till gårdshuset där familjen Frank gömde sig?",
        "a": [
          "En svängbar bokhylla",
          "En målning",
          "En källarlucka",
          "Ett piano"
        ],
        "explain": "Den hemliga bokhyllan ledde in till \"Gårdshuset\" där Anne skrev sin världsberömda dagbok."
      },
      {
        "id": "q50_amsterdam_job_s3",
        "city": "amsterdam",
        "place": "job",
        "t": "mc",
        "q": "Varför har många gamla kanalhus i Amsterdam en krok högst upp på gaveln?",
        "a": [
          "För att hissa upp tunga möbler genom fönstren",
          "För att hänga cyklar",
          "För att fästa flaggor",
          "Som åskledare"
        ],
        "explain": "Trapporna i de smala kanalhusen var för trånga, så varor och möbler hissades upp utifrån!"
      }
    ],
    "tavern": {
      "name": "Brunt kafé i Jordaan",
      "drink": "stroopwafel & kaffe",
      "drinkCost": 110
    },
    "facts": [
      "Amsterdam",
      "17,9 miljoner",
      "Nederländska",
      "Euro (EUR)",
      "Ungefär en fjärdedel av Nederländerna ligger under havsnivån, skyddat av vallar.",
      "I Amsterdam finns det fler cyklar än invånare."
    ]
  },
  {
    "key": "bryssel",
    "iso": "be",
    "country": "Belgien",
    "region": "Europa",
    "name": "Bryssel",
    "code": "BRU",
    "stampColor": "#7a2222",
    "stampShape": "round",
    "stampRot": -3,
    "cityObj": {
      "name": "Bryssel",
      "country": "Belgien",
      "region": "Europa",
      "lat": 50.85,
      "lon": 4.35,
      "tagline": "Förgyllda skråhus, serietidningar och EU:s hjärta",
      "skyline": "assets/cities/bryssel.jpg",
      "hotel": {
        "name": "Hotel Grand-Place",
        "price": 610
      },
      "highlights": [
        "bryssel_s1",
        "bryssel_s2",
        "bryssel_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "praliner_be",
        "seriealbum_be"
      ],
      "signature": {
        "name": "Brasserie i Gamla stan",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Brasserie i Gamla stan i Bryssel för belgiska våfflor och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Bryssel",
          "employer": "Bryssels Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Bryssel och svara på frågor om Belgien."
        },
        {
          "title": "Receptionist på Hotel Grand-Place",
          "employer": "Hotel Grand-Place",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Grand-Place — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Bryssel",
          "employer": "Bryssels Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Bryssel."
        }
      ]
    },
    "placesObj": {
      "bryssel_s1": {
        "name": "Grand-Place (Grote Markt)",
        "photo": "assets/cities/bryssel.jpg",
        "fact": "Ett av Europas praktfullaste medeltida torg, inramat av förgyllda skråhus och stadshuset.",
        "hours": 2
      },
      "bryssel_s2": {
        "name": "Atomium",
        "photo": "assets/cities/bryssel.jpg",
        "fact": "102 meter hög stålkonstruktion formad som en järnkristall förstorad 165 miljarder gånger.",
        "hours": 2
      },
      "bryssel_s3": {
        "name": "Manneken Pis",
        "photo": "assets/cities/bryssel.jpg",
        "fact": "Den lilla berömda bronsstatyn från 1619 som har över 1 000 olika kostymer i sin garderob.",
        "hours": 2
      }
    },
    "souvDefs": {
      "praliner_be": {
        "name": "Belgisk pralinask",
        "origin": "bryssel",
        "basePrice": 250,
        "kind": "souvenir",
        "desc": "Handgjorda praliner från Bryssel.",
        "photo": "assets/souvenirs/spettkaka.jpg"
      },
      "seriealbum_be": {
        "name": "Klassiskt seriealbum",
        "origin": "bryssel",
        "basePrice": 220,
        "kind": "souvenir",
        "desc": "Inbundet fransk-belgiskt äventyrsalbum.",
        "photo": "assets/souvenirs/guide_amerika.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_bryssel_s1_1",
        "city": "bryssel",
        "place": "bryssel_s1",
        "t": "mc",
        "q": "Vilket århundrade förstördes stora delar av Grand-Place innan det byggdes upp i barockstil?",
        "a": [
          "1695",
          "1944",
          "1412",
          "1815"
        ],
        "explain": "Efter fransk artilleribeskjutning 1695 återuppbyggde stadens skrån torget på rekordkort tid."
      },
      {
        "id": "q50_bryssel_s2_1",
        "city": "bryssel",
        "place": "bryssel_s2",
        "t": "mc",
        "q": "Till vilket stort evenemang byggdes Atomium i Bryssel år 1958?",
        "a": [
          "Världsutställningen Expo 58",
          "Sommar-OS",
          "EU:s grundande",
          "Belgiens 100-årsjubileum"
        ],
        "explain": "Atomium skulle egentligen rivas efter Expo 58 men blev så älskat att det fick stå kvar."
      },
      {
        "id": "q50_bryssel_s3_1",
        "city": "bryssel",
        "place": "bryssel_s3",
        "t": "mc",
        "q": "Vilken världsberömd seriefigur skapades av belgaren Hergé i Bryssel?",
        "a": [
          "Tintin",
          "Asterix",
          "Bamse",
          "Kalle Anka"
        ],
        "explain": "Belgien är Europas seriehuvudstad och husgavlarna i Bryssel pryds av stora seriemålningar med Tintin och Smurfarna."
      },
      {
        "id": "q50_bryssel_job1",
        "city": "bryssel",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Bryssel?",
        "a": [
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Bryssel ligger i Belgien (Europa), där man talar nederländska, franska & tyska och använder valutan Euro (EUR)."
      },
      {
        "id": "q50_bryssel_job2",
        "city": "bryssel",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Belgien (Bryssel)?",
        "a": [
          "Euro",
          "Brittiskt pund",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Belgien betalar man med Euro (EUR). Bryssel är säte för både EU-kommissionen och NATO."
      },
      {
        "id": "q50_bryssel_job_s1",
        "city": "bryssel",
        "place": "job",
        "t": "mc",
        "q": "Vilket århundrade förstördes stora delar av Grand-Place innan det byggdes upp i barockstil?",
        "a": [
          "1695",
          "1944",
          "1412",
          "1815"
        ],
        "explain": "Efter fransk artilleribeskjutning 1695 återuppbyggde stadens skrån torget på rekordkort tid."
      },
      {
        "id": "q50_bryssel_job_s2",
        "city": "bryssel",
        "place": "job",
        "t": "mc",
        "q": "Till vilket stort evenemang byggdes Atomium i Bryssel år 1958?",
        "a": [
          "Världsutställningen Expo 58",
          "Sommar-OS",
          "EU:s grundande",
          "Belgiens 100-årsjubileum"
        ],
        "explain": "Atomium skulle egentligen rivas efter Expo 58 men blev så älskat att det fick stå kvar."
      },
      {
        "id": "q50_bryssel_job_s3",
        "city": "bryssel",
        "place": "job",
        "t": "mc",
        "q": "Vilken världsberömd seriefigur skapades av belgaren Hergé i Bryssel?",
        "a": [
          "Tintin",
          "Asterix",
          "Bamse",
          "Kalle Anka"
        ],
        "explain": "Belgien är Europas seriehuvudstad och husgavlarna i Bryssel pryds av stora seriemålningar med Tintin och Smurfarna."
      }
    ],
    "tavern": {
      "name": "Brasserie i Gamla stan",
      "drink": "belgiska våfflor",
      "drinkCost": 110
    },
    "facts": [
      "Bryssel",
      "11,8 miljoner",
      "Nederländska, franska & tyska",
      "Euro (EUR)",
      "Bryssel är säte för både EU-kommissionen och NATO.",
      "Belgien har över 1 500 olika lokala ölsorter och berömd chokladtradition."
    ]
  },
  {
    "key": "berlin",
    "iso": "de",
    "country": "Tyskland",
    "region": "Europa",
    "name": "Berlin",
    "code": "BER",
    "stampColor": "#1d4f7a",
    "stampShape": "oval",
    "stampRot": 4,
    "cityObj": {
      "name": "Berlin",
      "country": "Tyskland",
      "region": "Europa",
      "lat": 52.52,
      "lon": 13.4,
      "tagline": "Delad historia som blev Europas kreativa metropol",
      "skyline": "assets/cities/berlin.jpg",
      "hotel": {
        "name": "Pension Mitte",
        "price": 590
      },
      "highlights": [
        "berlin_s1",
        "berlin_s2",
        "berlin_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "ampelmann",
        "murbit_de"
      ],
      "signature": {
        "name": "Eckkneipe i Kreuzberg",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Eckkneipe i Kreuzberg i Berlin för currywurst & läsk och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Berlin",
          "employer": "Berlins Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Berlin och svara på frågor om Tyskland."
        },
        {
          "title": "Receptionist på Pension Mitte",
          "employer": "Pension Mitte",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Pension Mitte — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Berlin",
          "employer": "Berlins Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Berlin."
        }
      ]
    },
    "placesObj": {
      "berlin_s1": {
        "name": "Brandenburger Tor",
        "photo": "assets/cities/berlin.jpg",
        "fact": "Nyklassisk stadsport från 1791 som gick från symbol för det kalla kriget till tysk återförening.",
        "hours": 2
      },
      "berlin_s2": {
        "name": "East Side Gallery",
        "photo": "assets/cities/berlin.jpg",
        "fact": "1,3 kilometer bevarad del av Berlinmuren målad av över hundra konstnärer från hela världen.",
        "hours": 2
      },
      "berlin_s3": {
        "name": "Riksdagshuset (Reichstag)",
        "photo": "assets/cities/berlin.jpg",
        "fact": "Tysklands parlament med en futuristisk glaskupol ritad av Norman Foster.",
        "hours": 2
      }
    },
    "souvDefs": {
      "ampelmann": {
        "name": "Ampelmann-souvenir",
        "origin": "berlin",
        "basePrice": 190,
        "kind": "souvenir",
        "desc": "Den ikoniska östberlinska trafikgubben.",
        "photo": "assets/souvenirs/taxiskylt.jpg"
      },
      "murbit_de": {
        "name": "Inramad bit av Berlinmuren",
        "origin": "berlin",
        "basePrice": 340,
        "kind": "souvenir",
        "desc": "Historisk minnesbit från 1989.",
        "photo": "assets/souvenirs/mursten_kina.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_berlin_s1_1",
        "city": "berlin",
        "place": "berlin_s1",
        "t": "mc",
        "q": "Vilket år föll Berlinmuren och öppnade åter vägen genom Brandenburger Tor?",
        "a": [
          "1989",
          "1961",
          "1945",
          "1999"
        ],
        "explain": "Den 9 november 1989 öppnades gränsövergångarna i Berlinmuren efter 28 år av delning."
      },
      {
        "id": "q50_berlin_s2_1",
        "city": "berlin",
        "place": "berlin_s2",
        "t": "mc",
        "q": "Längs vilken flod i Berlin ligger East Side Gallery?",
        "a": [
          "Spree",
          "Rhen",
          "Elbe",
          "Donau"
        ],
        "explain": "Floden Spree rinner rakt genom centrala Berlin förbi både Riksdagshuset, Museumsinsel och East Side Gallery."
      },
      {
        "id": "q50_berlin_s3_1",
        "city": "berlin",
        "place": "berlin_s3",
        "t": "mc",
        "q": "Vad symboliserar den genomskinliga glaskupolen högst upp på Riksdagshuset?",
        "a": [
          "Öppenhet och demokratisk insyn",
          "Ett växthus för parlamentsmedlemmar",
          "Ett observatorium",
          "Tysklands flygindustri"
        ],
        "explain": "Besökare kan gå högst upp i kupolen och bokstavligen se ner i plenisalen där politikerna arbetar."
      },
      {
        "id": "q50_berlin_job1",
        "city": "berlin",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Berlin?",
        "a": [
          "Tyskland",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Berlin ligger i Tyskland (Europa), där man talar tyska och använder valutan Euro (EUR)."
      },
      {
        "id": "q50_berlin_job2",
        "city": "berlin",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Tyskland (Berlin)?",
        "a": [
          "Euro",
          "Brittiskt pund",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Tyskland betalar man med Euro (EUR). Berlin har fler broar än Venedig (omkring 1 700 stycken)."
      },
      {
        "id": "q50_berlin_job_s1",
        "city": "berlin",
        "place": "job",
        "t": "mc",
        "q": "Vilket år föll Berlinmuren och öppnade åter vägen genom Brandenburger Tor?",
        "a": [
          "1989",
          "1961",
          "1945",
          "1999"
        ],
        "explain": "Den 9 november 1989 öppnades gränsövergångarna i Berlinmuren efter 28 år av delning."
      },
      {
        "id": "q50_berlin_job_s2",
        "city": "berlin",
        "place": "job",
        "t": "mc",
        "q": "Längs vilken flod i Berlin ligger East Side Gallery?",
        "a": [
          "Spree",
          "Rhen",
          "Elbe",
          "Donau"
        ],
        "explain": "Floden Spree rinner rakt genom centrala Berlin förbi både Riksdagshuset, Museumsinsel och East Side Gallery."
      },
      {
        "id": "q50_berlin_job_s3",
        "city": "berlin",
        "place": "job",
        "t": "mc",
        "q": "Vad symboliserar den genomskinliga glaskupolen högst upp på Riksdagshuset?",
        "a": [
          "Öppenhet och demokratisk insyn",
          "Ett växthus för parlamentsmedlemmar",
          "Ett observatorium",
          "Tysklands flygindustri"
        ],
        "explain": "Besökare kan gå högst upp i kupolen och bokstavligen se ner i plenisalen där politikerna arbetar."
      }
    ],
    "tavern": {
      "name": "Eckkneipe i Kreuzberg",
      "drink": "currywurst & läsk",
      "drinkCost": 110
    },
    "facts": [
      "Berlin",
      "84 miljoner",
      "Tyska",
      "Euro (EUR)",
      "Berlin har fler broar än Venedig (omkring 1 700 stycken).",
      "Tyskland är Europas folkrikaste land inom EU."
    ]
  },
  {
    "key": "prag",
    "iso": "cz",
    "country": "Tjeckien",
    "region": "Europa",
    "name": "Prag",
    "code": "PRG",
    "stampColor": "#246b36",
    "stampShape": "rect",
    "stampRot": -2,
    "cityObj": {
      "name": "Prag",
      "country": "Tjeckien",
      "region": "Europa",
      "lat": 50.08,
      "lon": 14.44,
      "tagline": "De hundra spirornas stad vid floden Moldau",
      "skyline": "assets/cities/prag.jpg",
      "hotel": {
        "name": "Hotel Malá Strana",
        "price": 490
      },
      "highlights": [
        "prag_s1",
        "prag_s2",
        "prag_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "bohem_glas",
        "marionett"
      ],
      "signature": {
        "name": "Ölstuga vid Moldau",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Ölstuga vid Moldau i Prag för gulasch & knödel och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Prag",
          "employer": "Prags Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Prag och svara på frågor om Tjeckien."
        },
        {
          "title": "Receptionist på Hotel Malá Strana",
          "employer": "Hotel Malá Strana",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Malá Strana — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Prag",
          "employer": "Prags Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Prag."
        }
      ]
    },
    "placesObj": {
      "prag_s1": {
        "name": "Karlsbron",
        "photo": "assets/cities/prag.jpg",
        "fact": "Medeltida stenbro från 1357 kantad av 30 barockstatyer över floden Moldau.",
        "hours": 2
      },
      "prag_s2": {
        "name": "Astronomiska uret (Orloj)",
        "photo": "assets/cities/prag.jpg",
        "fact": "Världens äldsta ännu fungerande astronomiska ur från 1410 på Gamla stans rådhus.",
        "hours": 2
      },
      "prag_s3": {
        "name": "Pragborgen",
        "photo": "assets/cities/prag.jpg",
        "fact": "Världens största sammanhängande borgområde med den gotiska Vituskatedralen i mitten.",
        "hours": 2
      }
    },
    "souvDefs": {
      "bohem_glas": {
        "name": "Böhmisk kristallskål",
        "origin": "prag",
        "basePrice": 420,
        "kind": "souvenir",
        "desc": "Slipat tjeckiskt kristallglas.",
        "photo": "assets/souvenirs/marmorask.jpg"
      },
      "marionett": {
        "name": "Handmålad pragmarionett",
        "origin": "prag",
        "basePrice": 280,
        "kind": "souvenir",
        "desc": "Traditionell tjeckisk teaterdocka.",
        "photo": "assets/souvenirs/karnevalsmask.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_prag_s1_1",
        "city": "prag",
        "place": "prag_s1",
        "t": "mc",
        "q": "Vilken tysk-romersk kejsare lät lägga grundstenen till Karlsbron år 1357?",
        "a": [
          "Karl IV",
          "Karl den store",
          "Rudolf II",
          "Frans Josef"
        ],
        "explain": "Karl IV lade grundstenen vid ett astrologiskt utvalt klockslag: 1357, 9 juli kl. 05:31 (1-3-5-7-9-7-5-3-1)."
      },
      {
        "id": "q50_prag_s2_1",
        "city": "prag",
        "place": "prag_s2",
        "t": "mc",
        "q": "Vad händer varje hel timme på det astronomiska uret i Prag?",
        "a": [
          "De tolv apostlarna marscherar förbi i luckorna",
          "Ett litet tåg kör ut",
          "En guldklocka sänks ner till torget",
          "Tornets visare snurrar baklänges"
        ],
        "explain": "Orloj visar både solens och månens position, stjärntecknen och apostlarnas parad varje heltimme."
      },
      {
        "id": "q50_prag_s3_1",
        "city": "prag",
        "place": "prag_s3",
        "t": "mc",
        "q": "Vilken berömd författare från Prag bodde ett tag i Gyllene gränden vid Pragborgen?",
        "a": [
          "Franz Kafka",
          "Milan Kundera",
          "Leo Tolstoj",
          "Thomas Mann"
        ],
        "explain": "Franz Kafka arbetade och skrev i hus nummer 22 i den smala Gyllene gränden under 1916–1917."
      },
      {
        "id": "q50_prag_job1",
        "city": "prag",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Prag?",
        "a": [
          "Tjeckien",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Prag ligger i Tjeckien (Europa), där man talar tjeckiska och använder valutan Tjeckisk koruna (CZK)."
      },
      {
        "id": "q50_prag_job2",
        "city": "prag",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Tjeckien (Prag)?",
        "a": [
          "Tjeckisk koruna",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Tjeckien betalar man med Tjeckisk koruna (CZK). Prag undgick större bombningar under andra världskriget och har kvar sin medeltida stadskärna."
      },
      {
        "id": "q50_prag_job_s1",
        "city": "prag",
        "place": "job",
        "t": "mc",
        "q": "Vilken tysk-romersk kejsare lät lägga grundstenen till Karlsbron år 1357?",
        "a": [
          "Karl IV",
          "Karl den store",
          "Rudolf II",
          "Frans Josef"
        ],
        "explain": "Karl IV lade grundstenen vid ett astrologiskt utvalt klockslag: 1357, 9 juli kl. 05:31 (1-3-5-7-9-7-5-3-1)."
      },
      {
        "id": "q50_prag_job_s2",
        "city": "prag",
        "place": "job",
        "t": "mc",
        "q": "Vad händer varje hel timme på det astronomiska uret i Prag?",
        "a": [
          "De tolv apostlarna marscherar förbi i luckorna",
          "Ett litet tåg kör ut",
          "En guldklocka sänks ner till torget",
          "Tornets visare snurrar baklänges"
        ],
        "explain": "Orloj visar både solens och månens position, stjärntecknen och apostlarnas parad varje heltimme."
      },
      {
        "id": "q50_prag_job_s3",
        "city": "prag",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd författare från Prag bodde ett tag i Gyllene gränden vid Pragborgen?",
        "a": [
          "Franz Kafka",
          "Milan Kundera",
          "Leo Tolstoj",
          "Thomas Mann"
        ],
        "explain": "Franz Kafka arbetade och skrev i hus nummer 22 i den smala Gyllene gränden under 1916–1917."
      }
    ],
    "tavern": {
      "name": "Ölstuga vid Moldau",
      "drink": "gulasch & knödel",
      "drinkCost": 110
    },
    "facts": [
      "Prag",
      "10,9 miljoner",
      "Tjeckiska",
      "Tjeckisk koruna (CZK)",
      "Prag undgick större bombningar under andra världskriget och har kvar sin medeltida stadskärna.",
      "Ordet \"robot\" myntades i Tjeckien 1920 av författaren Karel Čapek."
    ]
  },
  {
    "key": "wien",
    "iso": "at",
    "country": "Österrike",
    "region": "Europa",
    "name": "Wien",
    "code": "VIE",
    "stampColor": "#6b3e1b",
    "stampShape": "round",
    "stampRot": 5,
    "cityObj": {
      "name": "Wien",
      "country": "Österrike",
      "region": "Europa",
      "lat": 48.21,
      "lon": 16.37,
      "tagline": "Kejserliga palats, kafékultur och klassisk musik",
      "skyline": "assets/cities/wien.jpg",
      "hotel": {
        "name": "Hotel Ringstrasse",
        "price": 610
      },
      "highlights": [
        "wien_s1",
        "wien_s2",
        "wien_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "snoglob_at",
        "mozartkulor"
      ],
      "signature": {
        "name": "Kafé Central",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kafé Central i Wien för sachertårta & melange och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Wien",
          "employer": "Wiens Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Wien och svara på frågor om Österrike."
        },
        {
          "title": "Receptionist på Hotel Ringstrasse",
          "employer": "Hotel Ringstrasse",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Ringstrasse — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Wien",
          "employer": "Wiens Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Wien."
        }
      ]
    },
    "placesObj": {
      "wien_s1": {
        "name": "Slottet Schönbrunn",
        "photo": "assets/cities/wien.jpg",
        "fact": "Habsburgarnas väldiga sommarpalats med 1 441 rum och barockträdgård.",
        "hours": 2
      },
      "wien_s2": {
        "name": "Stefansdomen",
        "photo": "assets/cities/wien.jpg",
        "fact": "Gotisk katedral mitt i Wien med färgstarkt zickzack-mönstrat taktegel.",
        "hours": 2
      },
      "wien_s3": {
        "name": "Wiener Staatsoper",
        "photo": "assets/cities/wien.jpg",
        "fact": "Ett av världens mest berömda operahus längs praktavenyn Ringstrasse.",
        "hours": 2
      }
    },
    "souvDefs": {
      "snoglob_at": {
        "name": "Wiensk snöglob",
        "origin": "wien",
        "basePrice": 210,
        "kind": "souvenir",
        "desc": "Snögloben uppfanns faktiskt i Wien år 1900!",
        "photo": "assets/souvenirs/snoglob.jpg"
      },
      "mozartkulor": {
        "name": "Ask med Mozartkulor",
        "origin": "wien",
        "basePrice": 180,
        "kind": "souvenir",
        "desc": "Marsipan, pistage och mörk choklad.",
        "photo": "assets/souvenirs/spettkaka.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_wien_s1_1",
        "city": "wien",
        "place": "wien_s1",
        "t": "mc",
        "q": "Vilket berömt 6-årigt underbarn uppträdde för kejsarinnan Maria Teresia på Schönbrunn 1762?",
        "a": [
          "Wolfgang Amadeus Mozart",
          "Ludwig van Beethoven",
          "Johann Strauss",
          "Frédéric Chopin"
        ],
        "explain": "Den sexårige Mozart charmade hela hovet på Schönbrunn och lär ha hoppat upp i kejsarinnans knä."
      },
      {
        "id": "q50_wien_s2_1",
        "city": "wien",
        "place": "wien_s2",
        "t": "mc",
        "q": "Vad kallas det 136 meter höga sydtornet på Stefansdomen i folkmun?",
        "a": [
          "Steffl",
          "Goliath",
          "Kaiserturm",
          "Donauturm"
        ],
        "explain": "Stefansdomens branta tak består av cirka 230 000 glaserade takpannor i ett mönster med Habsburgarnas dubbelörn."
      },
      {
        "id": "q50_wien_s3_1",
        "city": "wien",
        "place": "wien_s3",
        "t": "mc",
        "q": "Vilken berömd nyårstradition sänds varje 1 januari från Musikverein i Wien?",
        "a": [
          "Nyårskonserten med Wiens filharmoniker",
          "Operabalen på skridskor",
          "Sångfestivalen på Donau",
          "Mozart-maraton"
        ],
        "explain": "Nyårskonserten med Johann Strauss valser (som An der schönen blauen Donau) ses av över 50 miljoner tittare."
      },
      {
        "id": "q50_wien_job1",
        "city": "wien",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Wien?",
        "a": [
          "Österrike",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Wien ligger i Österrike (Europa), där man talar tyska och använder valutan Euro (EUR)."
      },
      {
        "id": "q50_wien_job2",
        "city": "wien",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Österrike (Wien)?",
        "a": [
          "Euro",
          "Brittiskt pund",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Österrike betalar man med Euro (EUR). Wien var centrum för den klassiska musiken med Mozart, Beethoven, Haydn, Schubert och Strauss."
      },
      {
        "id": "q50_wien_job_s1",
        "city": "wien",
        "place": "job",
        "t": "mc",
        "q": "Vilket berömt 6-årigt underbarn uppträdde för kejsarinnan Maria Teresia på Schönbrunn 1762?",
        "a": [
          "Wolfgang Amadeus Mozart",
          "Ludwig van Beethoven",
          "Johann Strauss",
          "Frédéric Chopin"
        ],
        "explain": "Den sexårige Mozart charmade hela hovet på Schönbrunn och lär ha hoppat upp i kejsarinnans knä."
      },
      {
        "id": "q50_wien_job_s2",
        "city": "wien",
        "place": "job",
        "t": "mc",
        "q": "Vad kallas det 136 meter höga sydtornet på Stefansdomen i folkmun?",
        "a": [
          "Steffl",
          "Goliath",
          "Kaiserturm",
          "Donauturm"
        ],
        "explain": "Stefansdomens branta tak består av cirka 230 000 glaserade takpannor i ett mönster med Habsburgarnas dubbelörn."
      },
      {
        "id": "q50_wien_job_s3",
        "city": "wien",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd nyårstradition sänds varje 1 januari från Musikverein i Wien?",
        "a": [
          "Nyårskonserten med Wiens filharmoniker",
          "Operabalen på skridskor",
          "Sångfestivalen på Donau",
          "Mozart-maraton"
        ],
        "explain": "Nyårskonserten med Johann Strauss valser (som An der schönen blauen Donau) ses av över 50 miljoner tittare."
      }
    ],
    "tavern": {
      "name": "Kafé Central",
      "drink": "sachertårta & melange",
      "drinkCost": 110
    },
    "facts": [
      "Wien",
      "9,1 miljoner",
      "Tyska",
      "Euro (EUR)",
      "Wien var centrum för den klassiska musiken med Mozart, Beethoven, Haydn, Schubert och Strauss.",
      "Över 60 % av Österrike täcks av Alperna."
    ]
  },
  {
    "key": "zurich",
    "iso": "ch",
    "country": "Schweiz",
    "region": "Europa",
    "name": "Zürich",
    "code": "ZRH",
    "stampColor": "#5b2870",
    "stampShape": "oval",
    "stampRot": -1,
    "cityObj": {
      "name": "Zürich",
      "country": "Schweiz",
      "region": "Europa",
      "lat": 47.37,
      "lon": 8.54,
      "tagline": "Alputsikt, kristallklar sjö och urmakarkonst",
      "skyline": "assets/cities/zurich.jpg",
      "hotel": {
        "name": "Hotel Limmatquai",
        "price": 780
      },
      "highlights": [
        "zurich_s1",
        "zurich_s2",
        "zurich_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "fickkniv",
        "choklad_ch"
      ],
      "signature": {
        "name": "Chokladkafé på Bahnhofstrasse",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Chokladkafé på Bahnhofstrasse i Zürich för varm schweizisk choklad och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Zürich",
          "employer": "Zürichs Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Zürich och svara på frågor om Schweiz."
        },
        {
          "title": "Receptionist på Hotel Limmatquai",
          "employer": "Hotel Limmatquai",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Limmatquai — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Zürich",
          "employer": "Zürichs Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Zürich."
        }
      ]
    },
    "placesObj": {
      "zurich_s1": {
        "name": "Grossmünster",
        "photo": "assets/cities/zurich.jpg",
        "fact": "Tvillingtornad romansk katedral som blev vaggan för den schweiziska reformationen.",
        "hours": 2
      },
      "zurich_s2": {
        "name": "Bahnhofstrasse",
        "photo": "assets/cities/zurich.jpg",
        "fact": "En av världens mest kända affärsgator, anlagd där stadens gamla vallgrav låg.",
        "hours": 2
      },
      "zurich_s3": {
        "name": "Fraumünster",
        "photo": "assets/cities/zurich.jpg",
        "fact": "Historisk kyrka världsberömd för sina lysande moderna glasmålningar.",
        "hours": 2
      }
    },
    "souvDefs": {
      "fickkniv": {
        "name": "Schweizisk fickkniv",
        "origin": "zurich",
        "basePrice": 380,
        "kind": "souvenir",
        "desc": "Röd mångsidig armékniv med 12 verktyg.",
        "photo": "assets/souvenirs/kamera.jpg"
      },
      "choklad_ch": {
        "name": "Schweizisk alpchoklad",
        "origin": "zurich",
        "basePrice": 210,
        "kind": "souvenir",
        "desc": "Len mjölkchoklad från Zürich.",
        "photo": "assets/souvenirs/spettkaka.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_zurich_s1_1",
        "city": "zurich",
        "place": "zurich_s1",
        "t": "mc",
        "q": "Vilken flod rinner ut ur Zürichsjön rakt genom gamla stan?",
        "a": [
          "Limmat",
          "Rhen",
          "Rhône",
          "Inn"
        ],
        "explain": "Floden Limmat rinner ut från Zürichsjön förbi både Grossmünster och Fraumünster."
      },
      {
        "id": "q50_zurich_s2_1",
        "city": "zurich",
        "place": "zurich_s2",
        "t": "mc",
        "q": "Vilken typ av hantverk är Schweiz världsberömt för sedan 1500-talet?",
        "a": [
          "Mekaniska armbandsur och klockor",
          "Sidenmattor",
          "Porslin",
          "Glasblåseri"
        ],
        "explain": "Schweizisk urmakarkonst från Genève, Jura och Zürich sätter än idag världsstandard för precision."
      },
      {
        "id": "q50_zurich_s3_1",
        "city": "zurich",
        "place": "zurich_s3",
        "t": "mc",
        "q": "Vilken berömd konstnär skapade de fem höga glasmålningarna i Fraumünster?",
        "a": [
          "Marc Chagall",
          "Pablo Picasso",
          "Claude Monet",
          "Salvador Dalí"
        ],
        "explain": "Marc Chagall skapade glasmålningarna på 1970-talet när han var över 80 år gammal."
      },
      {
        "id": "q50_zurich_job1",
        "city": "zurich",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Zürich?",
        "a": [
          "Schweiz",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Zürich ligger i Schweiz (Europa), där man talar tyska, franska, italienska & rätoromanska och använder valutan Schweizisk franc (CHF)."
      },
      {
        "id": "q50_zurich_job2",
        "city": "zurich",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Schweiz (Zürich)?",
        "a": [
          "Schweizisk franc",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Schweiz betalar man med Schweizisk franc (CHF). Schweiz har inte varit i krig sedan 1815 och är berömt för sin neutralitet och direktdemokrati."
      },
      {
        "id": "q50_zurich_job_s1",
        "city": "zurich",
        "place": "job",
        "t": "mc",
        "q": "Vilken flod rinner ut ur Zürichsjön rakt genom gamla stan?",
        "a": [
          "Limmat",
          "Rhen",
          "Rhône",
          "Inn"
        ],
        "explain": "Floden Limmat rinner ut från Zürichsjön förbi både Grossmünster och Fraumünster."
      },
      {
        "id": "q50_zurich_job_s2",
        "city": "zurich",
        "place": "job",
        "t": "mc",
        "q": "Vilken typ av hantverk är Schweiz världsberömt för sedan 1500-talet?",
        "a": [
          "Mekaniska armbandsur och klockor",
          "Sidenmattor",
          "Porslin",
          "Glasblåseri"
        ],
        "explain": "Schweizisk urmakarkonst från Genève, Jura och Zürich sätter än idag världsstandard för precision."
      },
      {
        "id": "q50_zurich_job_s3",
        "city": "zurich",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd konstnär skapade de fem höga glasmålningarna i Fraumünster?",
        "a": [
          "Marc Chagall",
          "Pablo Picasso",
          "Claude Monet",
          "Salvador Dalí"
        ],
        "explain": "Marc Chagall skapade glasmålningarna på 1970-talet när han var över 80 år gammal."
      }
    ],
    "tavern": {
      "name": "Chokladkafé på Bahnhofstrasse",
      "drink": "varm schweizisk choklad",
      "drinkCost": 110
    },
    "facts": [
      "Bern (de facto)",
      "8,9 miljoner",
      "Tyska, franska, italienska & rätoromanska",
      "Schweizisk franc (CHF)",
      "Schweiz har inte varit i krig sedan 1815 och är berömt för sin neutralitet och direktdemokrati.",
      "Röda Korset grundades i Schweiz av Henry Dunant 1863."
    ]
  },
  {
    "key": "madrid",
    "iso": "es",
    "country": "Spanien",
    "region": "Europa",
    "name": "Madrid",
    "code": "MAD",
    "stampColor": "#8c3c14",
    "stampShape": "rect",
    "stampRot": 6,
    "cityObj": {
      "name": "Madrid",
      "country": "Spanien",
      "region": "Europa",
      "lat": 40.42,
      "lon": -3.7,
      "tagline": "Soliga torg, konstmuseer och sena kvällar",
      "skyline": "assets/cities/madrid.jpg",
      "hotel": {
        "name": "Hostal Puerta del Sol",
        "price": 560
      },
      "highlights": [
        "madrid_s1",
        "madrid_s2",
        "madrid_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "solfjader_es",
        "olivolja_es"
      ],
      "signature": {
        "name": "Tapasbar vid Plaza Mayor",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Tapasbar vid Plaza Mayor i Madrid för patatas bravas & sangria och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Madrid",
          "employer": "Madrids Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Madrid och svara på frågor om Spanien."
        },
        {
          "title": "Receptionist på Hostal Puerta del Sol",
          "employer": "Hostal Puerta del Sol",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hostal Puerta del Sol — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Madrid",
          "employer": "Madrids Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Madrid."
        }
      ]
    },
    "placesObj": {
      "madrid_s1": {
        "name": "Pradomuseet",
        "photo": "assets/cities/madrid.jpg",
        "fact": "Ett av världens främsta konstmuseer med mästerverk av Velázquez, Goya och Bosch.",
        "hours": 2
      },
      "madrid_s2": {
        "name": "Parque del Retiro",
        "photo": "assets/cities/madrid.jpg",
        "fact": "Stor kunglig park mitt i Madrid med roddbåtar, rosenträdgård och det vackra Kristallpalatset.",
        "hours": 2
      },
      "madrid_s3": {
        "name": "Puerta del Sol",
        "photo": "assets/cities/madrid.jpg",
        "fact": "Madrids pulserande mittpunkt där Spaniens alla riksvägar börjar (Kilometer noll).",
        "hours": 2
      }
    },
    "souvDefs": {
      "solfjader_es": {
        "name": "Handmålad spansk solfjäder",
        "origin": "madrid",
        "basePrice": 220,
        "kind": "souvenir",
        "desc": "Färgstark abanico från Madrid.",
        "photo": "assets/souvenirs/solfjader.jpg"
      },
      "olivolja_es": {
        "name": "Spansk jungfruolivolja",
        "origin": "madrid",
        "basePrice": 240,
        "kind": "souvenir",
        "desc": "Kallpressad olja från Andalusien.",
        "photo": "assets/souvenirs/olivolja.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_madrid_s1_1",
        "city": "madrid",
        "place": "madrid_s1",
        "t": "mc",
        "q": "Vilken världsberömd målning av Diego Velázquez är Pradomuseets främsta skatt?",
        "a": [
          "Las Meninas",
          "Guernica",
          "Nattvakten",
          "Skriet"
        ],
        "explain": "Velázquez målade Las Meninas 1656 med sig själv stående vid staffliet bredvid kungafamiljen."
      },
      {
        "id": "q50_madrid_s2_1",
        "city": "madrid",
        "place": "madrid_s2",
        "t": "mc",
        "q": "Vad heter den stora sjön mitt i Retiroparken där man kan hyra roddbåt?",
        "a": [
          "Estanque Grande",
          "Lago del Sol",
          "Plaza de Agua",
          "Río Retiro"
        ],
        "explain": "Retiro var kunglig jakt- och lustpark fram till 1868 då den öppnades för allmänheten."
      },
      {
        "id": "q50_madrid_s3_1",
        "city": "madrid",
        "place": "madrid_s3",
        "t": "mc",
        "q": "Vilken symbol för Madrid står som bronsstaty på Puerta del Sol?",
        "a": [
          "En björn och ett smultronträd",
          "En tjur och en ros",
          "Ett lejon med krona",
          "En örn"
        ],
        "explain": "Björnen och smultronträdet (El Oso y el Madroño) pryder Madrids stadsvapen sedan medeltiden."
      },
      {
        "id": "q50_madrid_job1",
        "city": "madrid",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Madrid?",
        "a": [
          "Spanien",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Madrid ligger i Spanien (Europa), där man talar spanska och använder valutan Euro (EUR)."
      },
      {
        "id": "q50_madrid_job2",
        "city": "madrid",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Spanien (Madrid)?",
        "a": [
          "Euro",
          "Brittiskt pund",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Spanien betalar man med Euro (EUR). Madrid ligger 667 meter över havet och är en av Europas högst belägna huvudstäder."
      },
      {
        "id": "q50_madrid_job_s1",
        "city": "madrid",
        "place": "job",
        "t": "mc",
        "q": "Vilken världsberömd målning av Diego Velázquez är Pradomuseets främsta skatt?",
        "a": [
          "Las Meninas",
          "Guernica",
          "Nattvakten",
          "Skriet"
        ],
        "explain": "Velázquez målade Las Meninas 1656 med sig själv stående vid staffliet bredvid kungafamiljen."
      },
      {
        "id": "q50_madrid_job_s2",
        "city": "madrid",
        "place": "job",
        "t": "mc",
        "q": "Vad heter den stora sjön mitt i Retiroparken där man kan hyra roddbåt?",
        "a": [
          "Estanque Grande",
          "Lago del Sol",
          "Plaza de Agua",
          "Río Retiro"
        ],
        "explain": "Retiro var kunglig jakt- och lustpark fram till 1868 då den öppnades för allmänheten."
      },
      {
        "id": "q50_madrid_job_s3",
        "city": "madrid",
        "place": "job",
        "t": "mc",
        "q": "Vilken symbol för Madrid står som bronsstaty på Puerta del Sol?",
        "a": [
          "En björn och ett smultronträd",
          "En tjur och en ros",
          "Ett lejon med krona",
          "En örn"
        ],
        "explain": "Björnen och smultronträdet (El Oso y el Madroño) pryder Madrids stadsvapen sedan medeltiden."
      }
    ],
    "tavern": {
      "name": "Tapasbar vid Plaza Mayor",
      "drink": "patatas bravas & sangria",
      "drinkCost": 110
    },
    "facts": [
      "Madrid",
      "48,5 miljoner",
      "Spanska",
      "Euro (EUR)",
      "Madrid ligger 667 meter över havet och är en av Europas högst belägna huvudstäder.",
      "Spanien är världens största producent av olivolja."
    ]
  },
  {
    "key": "lissabon",
    "iso": "pt",
    "country": "Portugal",
    "region": "Europa",
    "name": "Lissabon",
    "code": "LIS",
    "stampColor": "#7a2222",
    "stampShape": "round",
    "stampRot": 0,
    "cityObj": {
      "name": "Lissabon",
      "country": "Portugal",
      "region": "Europa",
      "lat": 38.72,
      "lon": -9.14,
      "tagline": "Gula spårvagnar, kakelfasader och vemodig fado",
      "skyline": "assets/cities/lissabon.jpg",
      "hotel": {
        "name": "Pensão Alfama",
        "price": 520
      },
      "highlights": [
        "lissabon_s1",
        "lissabon_s2",
        "lissabon_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "azulejo",
        "kork_pt"
      ],
      "signature": {
        "name": "Fadokrog i Alfama",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Fadokrog i Alfama i Lissabon för pastéis de nata & kaffe och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Lissabon",
          "employer": "Lissabons Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Lissabon och svara på frågor om Portugal."
        },
        {
          "title": "Receptionist på Pensão Alfama",
          "employer": "Pensão Alfama",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Pensão Alfama — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Lissabon",
          "employer": "Lissabons Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Lissabon."
        }
      ]
    },
    "placesObj": {
      "lissabon_s1": {
        "name": "Belémtornet",
        "photo": "assets/cities/lissabon.jpg",
        "fact": "Befäst kalkstenstorn vid floden Tejos mynning där 1500-talets upptäcktsresande seglade ut.",
        "hours": 2
      },
      "lissabon_s2": {
        "name": "Spårvagn 28 i Alfama",
        "photo": "assets/cities/lissabon.jpg",
        "fact": "Klassiska gula trävagnar från 1930-talet som klättrar uppför Lissabons branta kullerstensgränder.",
        "hours": 2
      },
      "lissabon_s3": {
        "name": "Castelo de São Jorge",
        "photo": "assets/cities/lissabon.jpg",
        "fact": "Morisk borg högst upp på en av Lissabons sju kullar med utsikt över Tejo och 25 april-bron.",
        "hours": 2
      }
    },
    "souvDefs": {
      "azulejo": {
        "name": "Blåvit Azulejo-kakelplatta",
        "origin": "lissabon",
        "basePrice": 240,
        "kind": "souvenir",
        "desc": "Klassiskt portugisiskt fasadkakel.",
        "photo": "assets/souvenirs/marmorask.jpg"
      },
      "kork_pt": {
        "name": "Portugisisk korkväska",
        "origin": "lissabon",
        "basePrice": 310,
        "kind": "souvenir",
        "desc": "Portugal står för över hälften av världens kork!",
        "photo": "assets/souvenirs/baskermossa.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_lissabon_s1_1",
        "city": "lissabon",
        "place": "lissabon_s1",
        "t": "mc",
        "q": "Vilken portugisisk sjöfarare fann sjövägen runt Afrika till Indien år 1498?",
        "a": [
          "Vasco da Gama",
          "Christofer Columbus",
          "James Cook",
          "Marco Polo"
        ],
        "explain": "Vasco da Gama ligger begravd i det närliggande Jerónimosklostret i Belém."
      },
      {
        "id": "q50_lissabon_s2_1",
        "city": "lissabon",
        "place": "lissabon_s2",
        "t": "mc",
        "q": "Vad heter den vemodiga portugisiska sångtraditionen som föddes i Lissabons hamnkvarter?",
        "a": [
          "Fado",
          "Flamenco",
          "Tango",
          "Bossa nova"
        ],
        "explain": "Fado betyder \"öde\" och sjungs ofta till ackompanjemang av 12-strängad portugisisk gitarr."
      },
      {
        "id": "q50_lissabon_s3_1",
        "city": "lissabon",
        "place": "lissabon_s3",
        "t": "mc",
        "q": "Vilket år drabbades Lissabon av en av Europas största jordbävningar någonsin?",
        "a": [
          "1755",
          "1906",
          "1666",
          "1888"
        ],
        "explain": "Jordbävningen på alla helgons dag 1755 förstörde stora delar av staden, som sedan byggdes upp med Europas första jordbävningssäkra kvarter."
      },
      {
        "id": "q50_lissabon_job1",
        "city": "lissabon",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Lissabon?",
        "a": [
          "Portugal",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Lissabon ligger i Portugal (Europa), där man talar portugisiska och använder valutan Euro (EUR)."
      },
      {
        "id": "q50_lissabon_job2",
        "city": "lissabon",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Portugal (Lissabon)?",
        "a": [
          "Euro",
          "Brittiskt pund",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Portugal betalar man med Euro (EUR). Lissabon är en av världens äldsta städer — äldre än både Rom och Paris."
      },
      {
        "id": "q50_lissabon_job_s1",
        "city": "lissabon",
        "place": "job",
        "t": "mc",
        "q": "Vilken portugisisk sjöfarare fann sjövägen runt Afrika till Indien år 1498?",
        "a": [
          "Vasco da Gama",
          "Christofer Columbus",
          "James Cook",
          "Marco Polo"
        ],
        "explain": "Vasco da Gama ligger begravd i det närliggande Jerónimosklostret i Belém."
      },
      {
        "id": "q50_lissabon_job_s2",
        "city": "lissabon",
        "place": "job",
        "t": "mc",
        "q": "Vad heter den vemodiga portugisiska sångtraditionen som föddes i Lissabons hamnkvarter?",
        "a": [
          "Fado",
          "Flamenco",
          "Tango",
          "Bossa nova"
        ],
        "explain": "Fado betyder \"öde\" och sjungs ofta till ackompanjemang av 12-strängad portugisisk gitarr."
      },
      {
        "id": "q50_lissabon_job_s3",
        "city": "lissabon",
        "place": "job",
        "t": "mc",
        "q": "Vilket år drabbades Lissabon av en av Europas största jordbävningar någonsin?",
        "a": [
          "1755",
          "1906",
          "1666",
          "1888"
        ],
        "explain": "Jordbävningen på alla helgons dag 1755 förstörde stora delar av staden, som sedan byggdes upp med Europas första jordbävningssäkra kvarter."
      }
    ],
    "tavern": {
      "name": "Fadokrog i Alfama",
      "drink": "pastéis de nata & kaffe",
      "drinkCost": 110
    },
    "facts": [
      "Lissabon",
      "10,6 miljoner",
      "Portugisiska",
      "Euro (EUR)",
      "Lissabon är en av världens äldsta städer — äldre än både Rom och Paris.",
      "Portugal producerar över hälften av all naturkork i världen."
    ]
  },
  {
    "key": "aten",
    "iso": "gr",
    "country": "Grekland",
    "region": "Europa",
    "name": "Aten",
    "code": "ATH",
    "stampColor": "#1d4f7a",
    "stampShape": "oval",
    "stampRot": -6,
    "cityObj": {
      "name": "Aten",
      "country": "Grekland",
      "region": "Europa",
      "lat": 37.98,
      "lon": 23.73,
      "tagline": "Demokratins vagga under Parthenons marmortempel",
      "skyline": "assets/cities/aten.jpg",
      "hotel": {
        "name": "Hotel Plaka",
        "price": 510
      },
      "highlights": [
        "aten_s1",
        "aten_s2",
        "aten_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "olivolja_gr",
        "vas_gr"
      ],
      "signature": {
        "name": "Taverna under Akropolis",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Taverna under Akropolis i Aten för souvlaki & tzatziki och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Aten",
          "employer": "Atens Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Aten och svara på frågor om Grekland."
        },
        {
          "title": "Receptionist på Hotel Plaka",
          "employer": "Hotel Plaka",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Plaka — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Aten",
          "employer": "Atens Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Aten."
        }
      ]
    },
    "placesObj": {
      "aten_s1": {
        "name": "Akropolis & Parthenon",
        "photo": "assets/cities/aten.jpg",
        "fact": "Marmortemplet från 447 f.Kr. helgat åt stadens beskyddarinna, visdomens och krigskonstens gudinna.",
        "hours": 2
      },
      "aten_s2": {
        "name": "Panathinaikostadion",
        "photo": "assets/cities/aten.jpg",
        "fact": "Världens enda stora idrottsarena byggd helt i vit marmor, där de första moderna OS hölls.",
        "hours": 2
      },
      "aten_s3": {
        "name": "Agoran i Aten",
        "photo": "assets/cities/aten.jpg",
        "fact": "Antikens marknads- och samlingsplats där stadens filosofer, köpmän och politiker möttes och debatterade.",
        "hours": 2
      }
    },
    "souvDefs": {
      "olivolja_gr": {
        "name": "Grekisk olivolja från Peloponnesos",
        "origin": "aten",
        "basePrice": 230,
        "kind": "souvenir",
        "desc": "Gyllene olivolja i keramikflaska.",
        "photo": "assets/souvenirs/olivolja.jpg"
      },
      "vas_gr": {
        "name": "Svartfigurig keramikvas",
        "origin": "aten",
        "basePrice": 360,
        "kind": "souvenir",
        "desc": "Handmålad reproduktion i antik stil.",
        "photo": "assets/souvenirs/tekanna_kina.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_aten_s1_1",
        "city": "aten",
        "place": "aten_s1",
        "t": "mc",
        "q": "Vilken grekisk gudinna vigdes templet Parthenon på Akropolis åt?",
        "a": [
          "Athena",
          "Afrodite",
          "Hera",
          "Artemis"
        ],
        "explain": "Parthenon byggdes under Perikles guldålder och innehöll en 12 meter hög staty av Athena i guld och elfenben."
      },
      {
        "id": "q50_aten_s2_1",
        "city": "aten",
        "place": "aten_s2",
        "t": "mc",
        "q": "Vilket år hölls de första moderna olympiska spelen i Aten?",
        "a": [
          "1896",
          "1912",
          "1850",
          "1924"
        ],
        "explain": "År 1896 samlades idrottare från 14 länder i Panathinaikostadion för att återuppliva de antika spelen."
      },
      {
        "id": "q50_aten_s3_1",
        "city": "aten",
        "place": "aten_s3",
        "t": "mc",
        "q": "Vilken berömd grekisk filosof promenerade på Agoran och ställde frågor till medborgarna?",
        "a": [
          "Sokrates",
          "Konfucius",
          "Descartes",
          "Voltaire"
        ],
        "explain": "Sokrates skrev aldrig ner sina läror själv, utan de bevarades genom hans elev Platons dialoger."
      },
      {
        "id": "q50_aten_job1",
        "city": "aten",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Aten?",
        "a": [
          "Grekland",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Aten ligger i Grekland (Europa), där man talar grekiska och använder valutan Euro (EUR)."
      },
      {
        "id": "q50_aten_job2",
        "city": "aten",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Grekland (Aten)?",
        "a": [
          "Euro",
          "Brittiskt pund",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Grekland betalar man med Euro (EUR). Aten är uppkallat efter gudinnan Athena och var världens första kända demokrati."
      },
      {
        "id": "q50_aten_job_s1",
        "city": "aten",
        "place": "job",
        "t": "mc",
        "q": "Vilken grekisk gudinna vigdes templet Parthenon på Akropolis åt?",
        "a": [
          "Athena",
          "Afrodite",
          "Hera",
          "Artemis"
        ],
        "explain": "Parthenon byggdes under Perikles guldålder och innehöll en 12 meter hög staty av Athena i guld och elfenben."
      },
      {
        "id": "q50_aten_job_s2",
        "city": "aten",
        "place": "job",
        "t": "mc",
        "q": "Vilket år hölls de första moderna olympiska spelen i Aten?",
        "a": [
          "1896",
          "1912",
          "1850",
          "1924"
        ],
        "explain": "År 1896 samlades idrottare från 14 länder i Panathinaikostadion för att återuppliva de antika spelen."
      },
      {
        "id": "q50_aten_job_s3",
        "city": "aten",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd grekisk filosof promenerade på Agoran och ställde frågor till medborgarna?",
        "a": [
          "Sokrates",
          "Konfucius",
          "Descartes",
          "Voltaire"
        ],
        "explain": "Sokrates skrev aldrig ner sina läror själv, utan de bevarades genom hans elev Platons dialoger."
      }
    ],
    "tavern": {
      "name": "Taverna under Akropolis",
      "drink": "souvlaki & tzatziki",
      "drinkCost": 110
    },
    "facts": [
      "Aten",
      "10,4 miljoner",
      "Grekiska",
      "Euro (EUR)",
      "Aten är uppkallat efter gudinnan Athena och var världens första kända demokrati.",
      "Grekland har över 6 000 öar, varav omkring 227 är bebodda."
    ]
  },
  {
    "key": "moskva",
    "iso": "ru",
    "country": "Ryssland",
    "region": "Europa",
    "name": "Moskva",
    "code": "SVO",
    "stampColor": "#246b36",
    "stampShape": "rect",
    "stampRot": 1,
    "cityObj": {
      "name": "Moskva",
      "country": "Ryssland",
      "region": "Europa",
      "lat": 55.76,
      "lon": 37.62,
      "tagline": "Lökkupoler, mäktiga torg och palatslik tunnelbana",
      "skyline": "assets/cities/moskva.jpg",
      "hotel": {
        "name": "Hotell Arbat",
        "price": 540
      },
      "highlights": [
        "moskva_s1",
        "moskva_s2",
        "moskva_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "matrjosjka",
        "samovar_te"
      ],
      "signature": {
        "name": "Tehus vid Röda torget",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Tehus vid Röda torget i Moskva för borsjtj & te ur samovar och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Moskva",
          "employer": "Moskvas Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Moskva och svara på frågor om Ryssland."
        },
        {
          "title": "Receptionist på Hotell Arbat",
          "employer": "Hotell Arbat",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotell Arbat — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Moskva",
          "employer": "Moskvas Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Moskva."
        }
      ]
    },
    "placesObj": {
      "moskva_s1": {
        "name": "Röda torget & Vasilijkatedralen",
        "photo": "assets/cities/moskva.jpg",
        "fact": "Katedralen från 1561 med sina nio färgsprakande lökkupoler mitt på Röda torget.",
        "hours": 2
      },
      "moskva_s2": {
        "name": "Kreml",
        "photo": "assets/cities/moskva.jpg",
        "fact": "Befäst borgkomplex med 20 torn, katedraler och tsarernas skattkammare vid Moskvafloden.",
        "hours": 2
      },
      "moskva_s3": {
        "name": "Moskvas tunnelbana",
        "photo": "assets/cities/moskva.jpg",
        "fact": "Underjordiska stationer byggda som marmorklädda palats med kristallkronor och mosaiker.",
        "hours": 2
      }
    },
    "souvDefs": {
      "matrjosjka": {
        "name": "Handmålad Matrjosjka-docka",
        "origin": "moskva",
        "basePrice": 290,
        "kind": "souvenir",
        "desc": "Klassisk rysk trädocka i fem delar.",
        "photo": "assets/souvenirs/dalahast.jpg"
      },
      "samovar_te": {
        "name": "Ryskt svart te i plåtburk",
        "origin": "moskva",
        "basePrice": 210,
        "kind": "souvenir",
        "desc": "Aromatiskt te för långa tågresor.",
        "photo": "assets/souvenirs/earlgrey.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_moskva_s1_1",
        "city": "moskva",
        "place": "moskva_s1",
        "t": "mc",
        "q": "Vad betyder ordet \"krasnaja\" (som gav Röda torget sitt namn) egentligen på fornrussiska?",
        "a": [
          "Vacker",
          "Blodröd",
          "Stor",
          "Kejserlig"
        ],
        "explain": "Röda torget hette ursprungligen \"Det vackra torget\" långt innan färgen röd förknippades med kommunismen."
      },
      {
        "id": "q50_moskva_s2_1",
        "city": "moskva",
        "place": "moskva_s2",
        "t": "mc",
        "q": "Vad heter den 200 ton tunga jätteklockan i Kreml som aldrig har ringt?",
        "a": [
          "Tsarklockan",
          "Frihetsklockan",
          "Stora Ivan",
          "Vinterklockan"
        ],
        "explain": "En 11 ton tung bit sprack loss från Tsarklockan under en brand 1737 när kallt släckvatten kastades på den."
      },
      {
        "id": "q50_moskva_s3_1",
        "city": "moskva",
        "place": "moskva_s3",
        "t": "mc",
        "q": "Vad är Moskvas tunnelbanestationer från 1930-talet kända för?",
        "a": [
          "Kristallkronor, marmorkolonner och mosaiker",
          "Att tågen kör ovan jord",
          "Att de är byggda helt i trä",
          "Att de går under havet"
        ],
        "explain": "Stationer som Komsomolskaja och Majakovskaja utformades som \"folkets palats\" under jord."
      },
      {
        "id": "q50_moskva_job1",
        "city": "moskva",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Moskva?",
        "a": [
          "Ryssland",
          "Belgien",
          "Japan",
          "Egypten"
        ],
        "explain": "Moskva ligger i Ryssland (Europa), där man talar ryska och använder valutan Rubel (RUB)."
      },
      {
        "id": "q50_moskva_job2",
        "city": "moskva",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Ryssland (Moskva)?",
        "a": [
          "Rubel",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Ryssland betalar man med Rubel (RUB). Ryssland är världens till ytan största land och spänner över hela 11 tidszoner."
      },
      {
        "id": "q50_moskva_job_s1",
        "city": "moskva",
        "place": "job",
        "t": "mc",
        "q": "Vad betyder ordet \"krasnaja\" (som gav Röda torget sitt namn) egentligen på fornrussiska?",
        "a": [
          "Vacker",
          "Blodröd",
          "Stor",
          "Kejserlig"
        ],
        "explain": "Röda torget hette ursprungligen \"Det vackra torget\" långt innan färgen röd förknippades med kommunismen."
      },
      {
        "id": "q50_moskva_job_s2",
        "city": "moskva",
        "place": "job",
        "t": "mc",
        "q": "Vad heter den 200 ton tunga jätteklockan i Kreml som aldrig har ringt?",
        "a": [
          "Tsarklockan",
          "Frihetsklockan",
          "Stora Ivan",
          "Vinterklockan"
        ],
        "explain": "En 11 ton tung bit sprack loss från Tsarklockan under en brand 1737 när kallt släckvatten kastades på den."
      },
      {
        "id": "q50_moskva_job_s3",
        "city": "moskva",
        "place": "job",
        "t": "mc",
        "q": "Vad är Moskvas tunnelbanestationer från 1930-talet kända för?",
        "a": [
          "Kristallkronor, marmorkolonner och mosaiker",
          "Att tågen kör ovan jord",
          "Att de är byggda helt i trä",
          "Att de går under havet"
        ],
        "explain": "Stationer som Komsomolskaja och Majakovskaja utformades som \"folkets palats\" under jord."
      }
    ],
    "tavern": {
      "name": "Tehus vid Röda torget",
      "drink": "borsjtj & te ur samovar",
      "drinkCost": 110
    },
    "facts": [
      "Moskva",
      "144 miljoner",
      "Ryska",
      "Rubel (RUB)",
      "Ryssland är världens till ytan största land och spänner över hela 11 tidszoner.",
      "Transsibiriska järnvägen från Moskva till Vladivostok är 9 289 km lång."
    ]
  },
  {
    "key": "jerusalem",
    "iso": "il",
    "country": "Israel",
    "region": "Asien",
    "name": "Jerusalem",
    "code": "TLV",
    "stampColor": "#6b3e1b",
    "stampShape": "round",
    "stampRot": -5,
    "cityObj": {
      "name": "Jerusalem",
      "country": "Israel",
      "region": "Asien",
      "lat": 31.77,
      "lon": 35.21,
      "tagline": "Tre världsreligioners heliga stenstad",
      "skyline": "assets/cities/jerusalem.jpg",
      "hotel": {
        "name": "Guesthouse Gamla stan",
        "price": 580
      },
      "highlights": [
        "jerusalem_s1",
        "jerusalem_s2",
        "jerusalem_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "olivtra_il",
        "zaatar"
      ],
      "signature": {
        "name": "Kafé i Kryddgränden",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kafé i Kryddgränden i Jerusalem för falafel & myntate och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Jerusalem",
          "employer": "Jerusalems Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Jerusalem och svara på frågor om Israel."
        },
        {
          "title": "Receptionist på Guesthouse Gamla stan",
          "employer": "Guesthouse Gamla stan",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Guesthouse Gamla stan — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Jerusalem",
          "employer": "Jerusalems Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Jerusalem."
        }
      ]
    },
    "placesObj": {
      "jerusalem_s1": {
        "name": "Västra muren (Klagomuren)",
        "photo": "assets/cities/jerusalem.jpg",
        "fact": "Den sista bevarade stödmuren från det andra templet på Tempelberget, över 2 000 år gammal.",
        "hours": 2
      },
      "jerusalem_s2": {
        "name": "Klippdomen",
        "photo": "assets/cities/jerusalem.jpg",
        "fact": "Guldklädd helgedom från år 691 som glänser över Jerusalems gamla stad.",
        "hours": 2
      },
      "jerusalem_s3": {
        "name": "Gamla stans basar (Shuk)",
        "photo": "assets/cities/jerusalem.jpg",
        "fact": "Labyrint av välvda stengator som delas in i fyra historiska kvarter.",
        "hours": 2
      }
    },
    "souvDefs": {
      "olivtra_il": {
        "name": "Snidad skål i olivträ",
        "origin": "jerusalem",
        "basePrice": 290,
        "kind": "souvenir",
        "desc": "Handgjort hantverk från Jerusalems gränder.",
        "photo": "assets/souvenirs/marmorask.jpg"
      },
      "zaatar": {
        "name": "Kryddblandning Za’atar",
        "origin": "jerusalem",
        "basePrice": 170,
        "kind": "souvenir",
        "desc": "Timjan, sesamfrön och syrlig sumak.",
        "photo": "assets/souvenirs/kryddor.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_jerusalem_s1_1",
        "city": "jerusalem",
        "place": "jerusalem_s1",
        "t": "mc",
        "q": "Vilken kung lät bygga ut tempelplattformen vars västra stödmur står kvar idag?",
        "a": [
          "Herodes den store",
          "Alexander den store",
          "Saladin",
          "Konstantin"
        ],
        "explain": "Herodes byggde ut Tempelberget omkring år 20 f.Kr. med enorma kalkstensblock utan murbruk."
      },
      {
        "id": "q50_jerusalem_s2_1",
        "city": "jerusalem",
        "place": "jerusalem_s2",
        "t": "mc",
        "q": "Vilken form har grundplanen på den guldklädda Klippdomen?",
        "a": [
          "Åttkantig",
          "Kvadratisk",
          "Triangulär",
          "Korsformad"
        ],
        "explain": "Klippdomen färdigställdes år 691 och är ett av den islamiska arkitekturens äldsta bevarade mästerverk."
      },
      {
        "id": "q50_jerusalem_s3_1",
        "city": "jerusalem",
        "place": "jerusalem_s3",
        "t": "mc",
        "q": "Hur många historiska kvarter delas Jerusalems muromgärdade Gamla stad in i?",
        "a": [
          "Fyra kvarter",
          "Två kvarter",
          "Tio kvarter",
          "Sju kvarter"
        ],
        "explain": "Gamla stan består av det kristna, judiska, muslimska och armeniska kvarteret innanför 1500-talsmurarna."
      },
      {
        "id": "q50_jerusalem_job1",
        "city": "jerusalem",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Jerusalem?",
        "a": [
          "Israel",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Jerusalem ligger i Israel (Asien), där man talar hebreiska & arabiska och använder valutan Shekel (ILS)."
      },
      {
        "id": "q50_jerusalem_job2",
        "city": "jerusalem",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Israel (Jerusalem)?",
        "a": [
          "Shekel",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Israel betalar man med Shekel (ILS). Döda havet strax öster om Jerusalem ligger 430 meter under havsnivån — jordens lägsta punkt på land."
      },
      {
        "id": "q50_jerusalem_job_s1",
        "city": "jerusalem",
        "place": "job",
        "t": "mc",
        "q": "Vilken kung lät bygga ut tempelplattformen vars västra stödmur står kvar idag?",
        "a": [
          "Herodes den store",
          "Alexander den store",
          "Saladin",
          "Konstantin"
        ],
        "explain": "Herodes byggde ut Tempelberget omkring år 20 f.Kr. med enorma kalkstensblock utan murbruk."
      },
      {
        "id": "q50_jerusalem_job_s2",
        "city": "jerusalem",
        "place": "job",
        "t": "mc",
        "q": "Vilken form har grundplanen på den guldklädda Klippdomen?",
        "a": [
          "Åttkantig",
          "Kvadratisk",
          "Triangulär",
          "Korsformad"
        ],
        "explain": "Klippdomen färdigställdes år 691 och är ett av den islamiska arkitekturens äldsta bevarade mästerverk."
      },
      {
        "id": "q50_jerusalem_job_s3",
        "city": "jerusalem",
        "place": "job",
        "t": "mc",
        "q": "Hur många historiska kvarter delas Jerusalems muromgärdade Gamla stad in i?",
        "a": [
          "Fyra kvarter",
          "Två kvarter",
          "Tio kvarter",
          "Sju kvarter"
        ],
        "explain": "Gamla stan består av det kristna, judiska, muslimska och armeniska kvarteret innanför 1500-talsmurarna."
      }
    ],
    "tavern": {
      "name": "Kafé i Kryddgränden",
      "drink": "falafel & myntate",
      "drinkCost": 110
    },
    "facts": [
      "Jerusalem",
      "9,8 miljoner",
      "Hebreiska & arabiska",
      "Shekel (ILS)",
      "Döda havet strax öster om Jerusalem ligger 430 meter under havsnivån — jordens lägsta punkt på land.",
      "Jerusalem har varit bebott i över 5 000 år."
    ]
  },
  {
    "key": "dubai",
    "iso": "ae",
    "country": "Förenade Arabemiraten",
    "region": "Asien",
    "name": "Dubai",
    "code": "DXB",
    "stampColor": "#5b2870",
    "stampShape": "oval",
    "stampRot": 2,
    "cityObj": {
      "name": "Dubai",
      "country": "Förenade Arabemiraten",
      "region": "Asien",
      "lat": 25.2,
      "lon": 55.27,
      "tagline": "Glittrande skyskrapor och guldmarknader vid öknen",
      "skyline": "assets/cities/dubai.jpg",
      "hotel": {
        "name": "Al Fahidi Heritage Inn",
        "price": 720
      },
      "highlights": [
        "dubai_s1",
        "dubai_s2",
        "dubai_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "dadlar_ae",
        "parfym_ae"
      ],
      "signature": {
        "name": "Tehus vid Dubai Creek",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Tehus vid Dubai Creek i Dubai för arabiskt kaffe & dadlar och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Dubai",
          "employer": "Dubais Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Dubai och svara på frågor om Förenade Arabemiraten."
        },
        {
          "title": "Receptionist på Al Fahidi Heritage Inn",
          "employer": "Al Fahidi Heritage Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Al Fahidi Heritage Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Dubai",
          "employer": "Dubais Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Dubai."
        }
      ]
    },
    "placesObj": {
      "dubai_s1": {
        "name": "Burj Khalifa",
        "photo": "assets/cities/dubai.jpg",
        "fact": "Världens högsta byggnad med 163 våningar mitt i ökenmetropolen, invigd 2010.",
        "hours": 2
      },
      "dubai_s2": {
        "name": "Dubai Creek & Guldsouken",
        "photo": "assets/cities/dubai.jpg",
        "fact": "Historisk saltvattenkanal där små traditionella träfärjor korsar mellan krydd- och guldmarknader.",
        "hours": 2
      },
      "dubai_s3": {
        "name": "Al Fahidi-kvarteret",
        "photo": "assets/cities/dubai.jpg",
        "fact": "Bevarat 1800-talskvarter med sandfärgade vindtorn som svalkade husen före luftkonditioneringen.",
        "hours": 2
      }
    },
    "souvDefs": {
      "dadlar_ae": {
        "name": "Lyxask med ökendadlar",
        "origin": "dubai",
        "basePrice": 240,
        "kind": "souvenir",
        "desc": "Fyllda med mandel och kardemumma.",
        "photo": "assets/souvenirs/spettkaka.jpg"
      },
      "parfym_ae": {
        "name": "Arabisk oud-parfym",
        "origin": "dubai",
        "basePrice": 480,
        "kind": "souvenir",
        "desc": "Klassisk trä- och krydddoft i glasflaska.",
        "photo": "assets/souvenirs/parfym_paris.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_dubai_s1_1",
        "city": "dubai",
        "place": "dubai_s1",
        "t": "mc",
        "q": "Hur hög är Burj Khalifa i Dubai, världens högsta skyskrapa?",
        "a": [
          "828 meter",
          "508 meter",
          "1 050 meter",
          "612 meter"
        ],
        "explain": "Burj Khalifa invigdes 2010 och är nästan tre gånger så hög som Eiffeltornet."
      },
      {
        "id": "q50_dubai_s2_1",
        "city": "dubai",
        "place": "dubai_s2",
        "t": "mc",
        "q": "Vad kallas de traditionella små träfärjorna som trafikerar Dubai Creek?",
        "a": [
          "Abra",
          "Gondol",
          "Djonk",
          "Felucca"
        ],
        "explain": "En överfart med abra över Dubai Creek har i årtionden kostat bara en enda dirham."
      },
      {
        "id": "q50_dubai_s3_1",
        "city": "dubai",
        "place": "dubai_s3",
        "t": "mc",
        "q": "Hur fungerade de traditionella vindtornen (barjeel) i gamla Dubai?",
        "a": [
          "De fångade svala vindar och ledde ner luften i rummen",
          "De fungerade som fyrar",
          "De malde säd",
          "De samlade regnvatten"
        ],
        "explain": "Vindtornen var en genial förindustriell klimatkonstruktion i det heta ökenklimatet."
      },
      {
        "id": "q50_dubai_job1",
        "city": "dubai",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Dubai?",
        "a": [
          "Förenade Arabemiraten",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Dubai ligger i Förenade Arabemiraten (Asien), där man talar arabiska och använder valutan Dirham (AED)."
      },
      {
        "id": "q50_dubai_job2",
        "city": "dubai",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Förenade Arabemiraten (Dubai)?",
        "a": [
          "Dirham",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Förenade Arabemiraten betalar man med Dirham (AED). Dubai växte på bara 50 år från en liten pärlfiskeby till en av världens mest besökta städer."
      },
      {
        "id": "q50_dubai_job_s1",
        "city": "dubai",
        "place": "job",
        "t": "mc",
        "q": "Hur hög är Burj Khalifa i Dubai, världens högsta skyskrapa?",
        "a": [
          "828 meter",
          "508 meter",
          "1 050 meter",
          "612 meter"
        ],
        "explain": "Burj Khalifa invigdes 2010 och är nästan tre gånger så hög som Eiffeltornet."
      },
      {
        "id": "q50_dubai_job_s2",
        "city": "dubai",
        "place": "job",
        "t": "mc",
        "q": "Vad kallas de traditionella små träfärjorna som trafikerar Dubai Creek?",
        "a": [
          "Abra",
          "Gondol",
          "Djonk",
          "Felucca"
        ],
        "explain": "En överfart med abra över Dubai Creek har i årtionden kostat bara en enda dirham."
      },
      {
        "id": "q50_dubai_job_s3",
        "city": "dubai",
        "place": "job",
        "t": "mc",
        "q": "Hur fungerade de traditionella vindtornen (barjeel) i gamla Dubai?",
        "a": [
          "De fångade svala vindar och ledde ner luften i rummen",
          "De fungerade som fyrar",
          "De malde säd",
          "De samlade regnvatten"
        ],
        "explain": "Vindtornen var en genial förindustriell klimatkonstruktion i det heta ökenklimatet."
      }
    ],
    "tavern": {
      "name": "Tehus vid Dubai Creek",
      "drink": "arabiskt kaffe & dadlar",
      "drinkCost": 110
    },
    "facts": [
      "Abu Dhabi",
      "9,5 miljoner",
      "Arabiska",
      "Dirham (AED)",
      "Dubai växte på bara 50 år från en liten pärlfiskeby till en av världens mest besökta städer.",
      "Förenade Arabemiraten består av sju emirat som förenades 1971."
    ]
  },
  {
    "key": "mumbai",
    "iso": "in",
    "country": "Indien",
    "region": "Asien",
    "name": "Mumbai",
    "code": "BOM",
    "stampColor": "#8c3c14",
    "stampShape": "rect",
    "stampRot": -4,
    "cityObj": {
      "name": "Mumbai",
      "country": "Indien",
      "region": "Asien",
      "lat": 19.08,
      "lon": 72.88,
      "tagline": "Bollywood, havspromenader och myllrande basarer",
      "skyline": "assets/cities/mumbai.jpg",
      "hotel": {
        "name": "Colaba Heritage Hotel",
        "price": 310
      },
      "highlights": [
        "mumbai_s1",
        "mumbai_s2",
        "mumbai_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "bollywood_sjal",
        "chai_in"
      ],
      "signature": {
        "name": "Irani Café i Fort",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Irani Café i Fort i Mumbai för masala chai & samosa och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Mumbai",
          "employer": "Mumbais Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Mumbai och svara på frågor om Indien."
        },
        {
          "title": "Receptionist på Colaba Heritage Hotel",
          "employer": "Colaba Heritage Hotel",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Colaba Heritage Hotel — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Mumbai",
          "employer": "Mumbais Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Mumbai."
        }
      ]
    },
    "placesObj": {
      "mumbai_s1": {
        "name": "Gateway of India",
        "photo": "assets/cities/mumbai.jpg",
        "fact": "Monumental 26 meter hög triumfbåge i gul basalt vid hamninloppet i södra Mumbai.",
        "hours": 2
      },
      "mumbai_s2": {
        "name": "Chhatrapati Shivaji Terminus",
        "photo": "assets/cities/mumbai.jpg",
        "fact": "UNESCO-skyddad järnvägsstation i sagolik nygotisk och indisk arkitektur.",
        "hours": 2
      },
      "mumbai_s3": {
        "name": "Bollywood & Marine Drive",
        "photo": "assets/cities/mumbai.jpg",
        "fact": "Indiens enorma filmindustri och den bågformade strandpromenaden kallad \"Drottningens halsband\".",
        "hours": 2
      }
    },
    "souvDefs": {
      "bollywood_sjal": {
        "name": "Broderad indisk sidensjal",
        "origin": "mumbai",
        "basePrice": 320,
        "kind": "souvenir",
        "desc": "Färgsprakande sjal från Colaba.",
        "photo": "assets/souvenirs/sjal.jpg"
      },
      "chai_in": {
        "name": "Masala Chai-kryddburk",
        "origin": "mumbai",
        "basePrice": 170,
        "kind": "souvenir",
        "desc": "Svart Assam-te med kardemumma och ingefära.",
        "photo": "assets/souvenirs/kryddor.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_mumbai_s1_1",
        "city": "mumbai",
        "place": "mumbai_s1",
        "t": "mc",
        "q": "Till vems besök år 1911 uppfördes Gateway of India vid Mumbais hamn?",
        "a": [
          "Kung Georg V och drottning Mary",
          "Mahatma Gandhi",
          "Vasco da Gama",
          "Drottning Victoria"
        ],
        "explain": "Genom samma båge marscherade också de sista brittiska trupperna ut ur Indien 1948."
      },
      {
        "id": "q50_mumbai_s2_1",
        "city": "mumbai",
        "place": "mumbai_s2",
        "t": "mc",
        "q": "Vad hette Mumbai tidigare fram till namnbytet år 1995?",
        "a": [
          "Bombay",
          "Calcutta",
          "Madras",
          "Poona"
        ],
        "explain": "Namnet Mumbai kommer från den lokala gudinnan Mumbadevi, stadens beskyddarinna."
      },
      {
        "id": "q50_mumbai_s3_1",
        "city": "mumbai",
        "place": "mumbai_s3",
        "t": "mc",
        "q": "Varför kallas strandpromenaden Marine Drive för \"Queen’s Necklace\"?",
        "a": [
          "Gatlyktorna lyser som ett pärlhalsband längs bukten på natten",
          "Drottning Victoria tappade ett smycke där",
          "Den är belagd med pärlemor",
          "Den har formen av en krona"
        ],
        "explain": "Mumbai är världens största filmstad sett till antal producerade långfilmer per år."
      },
      {
        "id": "q50_mumbai_job1",
        "city": "mumbai",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Mumbai?",
        "a": [
          "Indien",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Mumbai ligger i Indien (Asien), där man talar hindi & engelska och använder valutan Indisk rupie (INR)."
      },
      {
        "id": "q50_mumbai_job2",
        "city": "mumbai",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Indien (Mumbai)?",
        "a": [
          "Indisk rupie",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Indien betalar man med Indisk rupie (INR). Mumbai ligger på en grupp öar som kopplades ihop under 1700- och 1800-talen."
      },
      {
        "id": "q50_mumbai_job_s1",
        "city": "mumbai",
        "place": "job",
        "t": "mc",
        "q": "Till vems besök år 1911 uppfördes Gateway of India vid Mumbais hamn?",
        "a": [
          "Kung Georg V och drottning Mary",
          "Mahatma Gandhi",
          "Vasco da Gama",
          "Drottning Victoria"
        ],
        "explain": "Genom samma båge marscherade också de sista brittiska trupperna ut ur Indien 1948."
      },
      {
        "id": "q50_mumbai_job_s2",
        "city": "mumbai",
        "place": "job",
        "t": "mc",
        "q": "Vad hette Mumbai tidigare fram till namnbytet år 1995?",
        "a": [
          "Bombay",
          "Calcutta",
          "Madras",
          "Poona"
        ],
        "explain": "Namnet Mumbai kommer från den lokala gudinnan Mumbadevi, stadens beskyddarinna."
      },
      {
        "id": "q50_mumbai_job_s3",
        "city": "mumbai",
        "place": "job",
        "t": "mc",
        "q": "Varför kallas strandpromenaden Marine Drive för \"Queen’s Necklace\"?",
        "a": [
          "Gatlyktorna lyser som ett pärlhalsband längs bukten på natten",
          "Drottning Victoria tappade ett smycke där",
          "Den är belagd med pärlemor",
          "Den har formen av en krona"
        ],
        "explain": "Mumbai är världens största filmstad sett till antal producerade långfilmer per år."
      }
    ],
    "tavern": {
      "name": "Irani Café i Fort",
      "drink": "masala chai & samosa",
      "drinkCost": 110
    },
    "facts": [
      "New Delhi",
      "1,43 miljarder",
      "Hindi & engelska",
      "Indisk rupie (INR)",
      "Mumbai ligger på en grupp öar som kopplades ihop under 1700- och 1800-talen.",
      "Mumbais matbud (dabbawalas) levererar 200 000 hemlagade lunchlådor varje dag med otrolig precision."
    ]
  },
  {
    "key": "katmandu",
    "iso": "np",
    "country": "Nepal",
    "region": "Asien",
    "name": "Katmandu",
    "code": "KTM",
    "stampColor": "#7a2222",
    "stampShape": "round",
    "stampRot": 3,
    "cityObj": {
      "name": "Katmandu",
      "country": "Nepal",
      "region": "Asien",
      "lat": 27.72,
      "lon": 85.32,
      "tagline": "Böneflaggor och snöklädda Himalayatoppar",
      "skyline": "assets/cities/katmandu.jpg",
      "hotel": {
        "name": "Thamel Yak Lodge",
        "price": 240
      },
      "highlights": [
        "katmandu_s1",
        "katmandu_s2",
        "katmandu_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "boneflaggor",
        "pashmina"
      ],
      "signature": {
        "name": "Takbar i Thamel",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Takbar i Thamel i Katmandu för momos & ingefärste och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Katmandu",
          "employer": "Katmandus Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Katmandu och svara på frågor om Nepal."
        },
        {
          "title": "Receptionist på Thamel Yak Lodge",
          "employer": "Thamel Yak Lodge",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Thamel Yak Lodge — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Katmandu",
          "employer": "Katmandus Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Katmandu."
        }
      ]
    },
    "placesObj": {
      "katmandu_s1": {
        "name": "Boudhanath-stupan",
        "photo": "assets/cities/katmandu.jpg",
        "fact": "En av världens största sfäriska buddhistiska stupor, prydd med Buddhas allseende ögon.",
        "hours": 2
      },
      "katmandu_s2": {
        "name": "Swayambhunath (Aptemplet)",
        "photo": "assets/cities/katmandu.jpg",
        "fact": "Uråldrigt tempel på en kulle väster om staden med 365 trappsteg och nyfikna makakapor.",
        "hours": 2
      },
      "katmandu_s3": {
        "name": "Durbar Square",
        "photo": "assets/cities/katmandu.jpg",
        "fact": "Kungligt torg fullt av snidade pagodtempel i trä och tegel i hjärtat av Katmandu.",
        "hours": 2
      }
    },
    "souvDefs": {
      "boneflaggor": {
        "name": "Tibetanska böneflaggor",
        "origin": "katmandu",
        "basePrice": 180,
        "kind": "souvenir",
        "desc": "Fem färger för luft, eld, vatten, jord och rymd.",
        "photo": "assets/souvenirs/thaisiden.jpg"
      },
      "pashmina": {
        "name": "Mjuk kashmirsjal från Nepal",
        "origin": "katmandu",
        "basePrice": 440,
        "kind": "souvenir",
        "desc": "Handvävd varm bergssjal från Thamel.",
        "photo": "assets/souvenirs/sjal.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_katmandu_s1_1",
        "city": "katmandu",
        "place": "katmandu_s1",
        "t": "mc",
        "q": "Vad kallas de färgglada tygflaggorna med mantran som fladdrar över stupan i Katmandu?",
        "a": [
          "Böneflaggor",
          "Sidenbaner",
          "Vindsegel",
          "Krigsvimplar"
        ],
        "explain": "Enligt tibetansk tradition sprider vinden böner och fred ut över dalen när den blåser genom flaggorna."
      },
      {
        "id": "q50_katmandu_s2_1",
        "city": "katmandu",
        "place": "katmandu_s2",
        "t": "mc",
        "q": "Vilket smeknamn har det berömda kulltemplet Swayambhunath fått av resenärer?",
        "a": [
          "Aptemplet",
          "Tigertemplet",
          "Snötemplet",
          "Guldtemplet"
        ],
        "explain": "Heliga apor har bott i skogen kring Swayambhunath i hundratals år."
      },
      {
        "id": "q50_katmandu_s3_1",
        "city": "katmandu",
        "place": "katmandu_s3",
        "t": "mc",
        "q": "Vilket unikt kännetecken har Nepals nationsflagga jämfört med alla andra länder?",
        "a": [
          "Den är den enda flaggan som inte är rektangulär",
          "Den är helt rund",
          "Den har inga färger",
          "Den är alltid vertikal"
        ],
        "explain": "Nepals flagga består av två röda trianglar som symboliserar Himalayas toppar."
      },
      {
        "id": "q50_katmandu_job1",
        "city": "katmandu",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Katmandu?",
        "a": [
          "Nepal",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Katmandu ligger i Nepal (Asien), där man talar nepalesiska och använder valutan Nepalesisk rupie (NPR)."
      },
      {
        "id": "q50_katmandu_job2",
        "city": "katmandu",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Nepal (Katmandu)?",
        "a": [
          "Nepalesisk rupie",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Nepal betalar man med Nepalesisk rupie (NPR). Åtta av världens tio högsta berg ligger helt eller delvis i Nepal."
      },
      {
        "id": "q50_katmandu_job_s1",
        "city": "katmandu",
        "place": "job",
        "t": "mc",
        "q": "Vad kallas de färgglada tygflaggorna med mantran som fladdrar över stupan i Katmandu?",
        "a": [
          "Böneflaggor",
          "Sidenbaner",
          "Vindsegel",
          "Krigsvimplar"
        ],
        "explain": "Enligt tibetansk tradition sprider vinden böner och fred ut över dalen när den blåser genom flaggorna."
      },
      {
        "id": "q50_katmandu_job_s2",
        "city": "katmandu",
        "place": "job",
        "t": "mc",
        "q": "Vilket smeknamn har det berömda kulltemplet Swayambhunath fått av resenärer?",
        "a": [
          "Aptemplet",
          "Tigertemplet",
          "Snötemplet",
          "Guldtemplet"
        ],
        "explain": "Heliga apor har bott i skogen kring Swayambhunath i hundratals år."
      },
      {
        "id": "q50_katmandu_job_s3",
        "city": "katmandu",
        "place": "job",
        "t": "mc",
        "q": "Vilket unikt kännetecken har Nepals nationsflagga jämfört med alla andra länder?",
        "a": [
          "Den är den enda flaggan som inte är rektangulär",
          "Den är helt rund",
          "Den har inga färger",
          "Den är alltid vertikal"
        ],
        "explain": "Nepals flagga består av två röda trianglar som symboliserar Himalayas toppar."
      }
    ],
    "tavern": {
      "name": "Takbar i Thamel",
      "drink": "momos & ingefärste",
      "drinkCost": 110
    },
    "facts": [
      "Katmandu",
      "30 miljoner",
      "Nepalesiska",
      "Nepalesisk rupie (NPR)",
      "Åtta av världens tio högsta berg ligger helt eller delvis i Nepal.",
      "Katmandudalen ligger på omkring 1 400 meters höjd över havet."
    ]
  },
  {
    "key": "colombo",
    "iso": "lk",
    "country": "Sri Lanka",
    "region": "Asien",
    "name": "Colombo",
    "code": "CMB",
    "stampColor": "#1d4f7a",
    "stampShape": "oval",
    "stampRot": -3,
    "cityObj": {
      "name": "Colombo",
      "country": "Sri Lanka",
      "region": "Asien",
      "lat": 6.93,
      "lon": 79.85,
      "tagline": "Kryddhamn och palmkantad kust vid Indiska oceanen",
      "skyline": "assets/cities/colombo.jpg",
      "hotel": {
        "name": "Galle Face Guesthouse",
        "price": 290
      },
      "highlights": [
        "colombo_s1",
        "colombo_s2",
        "colombo_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "ceylonte",
        "kanel_lk"
      ],
      "signature": {
        "name": "Strandkafé vid Galle Face",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Strandkafé vid Galle Face i Colombo för ceylonte & kokosroti och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Colombo",
          "employer": "Colombos Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Colombo och svara på frågor om Sri Lanka."
        },
        {
          "title": "Receptionist på Galle Face Guesthouse",
          "employer": "Galle Face Guesthouse",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Galle Face Guesthouse — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Colombo",
          "employer": "Colombos Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Colombo."
        }
      ]
    },
    "placesObj": {
      "colombo_s1": {
        "name": "Galle Face Green",
        "photo": "assets/cities/colombo.jpg",
        "fact": "Halv kilometer lång havspromenad där familjer flyger drakar i solnedgången.",
        "hours": 2
      },
      "colombo_s2": {
        "name": "Gangaramaya-templet",
        "photo": "assets/cities/colombo.jpg",
        "fact": "Livfullt buddhistiskt tempel som blandar srilankesisk, thailändsk och indisk arkitektur.",
        "hours": 2
      },
      "colombo_s3": {
        "name": "Pettah-basaren",
        "photo": "assets/cities/colombo.jpg",
        "fact": "Färgsprakande marknadskvarter fullt av te, kanel, ädelstenar och den rödvita moskén Jami Ul-Alfar.",
        "hours": 2
      }
    },
    "souvDefs": {
      "ceylonte": {
        "name": "Äkta Ceylonte i trälåda",
        "origin": "colombo",
        "basePrice": 210,
        "kind": "souvenir",
        "desc": "Höglandste från Nuwara Eliya.",
        "photo": "assets/souvenirs/earlgrey.jpg"
      },
      "kanel_lk": {
        "name": "Ceylonkanel & kryddor",
        "origin": "colombo",
        "basePrice": 190,
        "kind": "souvenir",
        "desc": "Doftande äkta kanelstänger.",
        "photo": "assets/souvenirs/kryddor.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_colombo_s1_1",
        "city": "colombo",
        "place": "colombo_s1",
        "t": "mc",
        "q": "Vad hette Sri Lanka tidigare fram till år 1972?",
        "a": [
          "Ceylon",
          "Siam",
          "Burma",
          "Formosa"
        ],
        "explain": "Än idag är landets berömda te världsberömt under namnet Ceylonte."
      },
      {
        "id": "q50_colombo_s2_1",
        "city": "colombo",
        "place": "colombo_s2",
        "t": "mc",
        "q": "Vilken berömd krydda kommer ursprungligen från Sri Lanka (Ceylon)?",
        "a": [
          "Äkta kanel",
          "Saffran",
          "Vanilj",
          "Paprika"
        ],
        "explain": "Ceylonkanel (äkta kanel) har skördats på Sri Lanka i tusentals år och lockade både araber, portugiser och holländare."
      },
      {
        "id": "q50_colombo_s3_1",
        "city": "colombo",
        "place": "colombo_s3",
        "t": "mc",
        "q": "Vilken ädelsten är Sri Lanka historiskt känt för över hela världen?",
        "a": [
          "Blå safir",
          "Smaragd",
          "Opal",
          "Bärnsten"
        ],
        "explain": "Sri Lanka har kallats \"Ratna-Dweepa\" (Ädelstensön) ända sedan antiken."
      },
      {
        "id": "q50_colombo_job1",
        "city": "colombo",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Colombo?",
        "a": [
          "Sri Lanka",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Colombo ligger i Sri Lanka (Asien), där man talar singalesiska & tamil och använder valutan Sri lankesisk rupie (LKR)."
      },
      {
        "id": "q50_colombo_job2",
        "city": "colombo",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Sri Lanka (Colombo)?",
        "a": [
          "Sri lankesisk rupie",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Sri Lanka betalar man med Sri lankesisk rupie (LKR). Sri Lanka är en av världens största exportörer av te och äkta kanel."
      },
      {
        "id": "q50_colombo_job_s1",
        "city": "colombo",
        "place": "job",
        "t": "mc",
        "q": "Vad hette Sri Lanka tidigare fram till år 1972?",
        "a": [
          "Ceylon",
          "Siam",
          "Burma",
          "Formosa"
        ],
        "explain": "Än idag är landets berömda te världsberömt under namnet Ceylonte."
      },
      {
        "id": "q50_colombo_job_s2",
        "city": "colombo",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd krydda kommer ursprungligen från Sri Lanka (Ceylon)?",
        "a": [
          "Äkta kanel",
          "Saffran",
          "Vanilj",
          "Paprika"
        ],
        "explain": "Ceylonkanel (äkta kanel) har skördats på Sri Lanka i tusentals år och lockade både araber, portugiser och holländare."
      },
      {
        "id": "q50_colombo_job_s3",
        "city": "colombo",
        "place": "job",
        "t": "mc",
        "q": "Vilken ädelsten är Sri Lanka historiskt känt för över hela världen?",
        "a": [
          "Blå safir",
          "Smaragd",
          "Opal",
          "Bärnsten"
        ],
        "explain": "Sri Lanka har kallats \"Ratna-Dweepa\" (Ädelstensön) ända sedan antiken."
      }
    ],
    "tavern": {
      "name": "Strandkafé vid Galle Face",
      "drink": "ceylonte & kokosroti",
      "drinkCost": 110
    },
    "facts": [
      "Sri Jayawardenepura Kotte / Colombo",
      "22 miljoner",
      "Singalesiska & tamil",
      "Sri lankesisk rupie (LKR)",
      "Sri Lanka är en av världens största exportörer av te och äkta kanel.",
      "Ön har åtta UNESCO-världsarv, bland annat lejonklippan Sigiriya."
    ]
  },
  {
    "key": "singapore",
    "iso": "sg",
    "country": "Singapore",
    "region": "Asien",
    "name": "Singapore",
    "code": "SIN",
    "stampColor": "#246b36",
    "stampShape": "rect",
    "stampRot": 4,
    "cityObj": {
      "name": "Singapore",
      "country": "Singapore",
      "region": "Asien",
      "lat": 1.35,
      "lon": 103.82,
      "tagline": "Framtidsstad med hängande trädgårdar vid ekvatorn",
      "skyline": "assets/cities/singapore.jpg",
      "hotel": {
        "name": "Raffles Heritage Hostel",
        "price": 640
      },
      "highlights": [
        "singapore_s1",
        "singapore_s2",
        "singapore_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "orkide_sg",
        "siden_sg"
      ],
      "signature": {
        "name": "Hawker Centre i Chinatown",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Hawker Centre i Chinatown i Singapore för kycklingris & limejuice och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Singapore",
          "employer": "Singapores Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Singapore och svara på frågor om Singapore."
        },
        {
          "title": "Receptionist på Raffles Heritage Hostel",
          "employer": "Raffles Heritage Hostel",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Raffles Heritage Hostel — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Singapore",
          "employer": "Singapores Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Singapore."
        }
      ]
    },
    "placesObj": {
      "singapore_s1": {
        "name": "Gardens by the Bay",
        "photo": "assets/cities/singapore.jpg",
        "fact": "Futuristisk park med 50 meter höga \"Supertrees\" klädda i ormbunkar och orkidéer.",
        "hours": 2
      },
      "singapore_s2": {
        "name": "Merlion Park",
        "photo": "assets/cities/singapore.jpg",
        "fact": "Singapores berömda staty med lejonhuvud och fiskkropp som sprutar vatten ut i Marina Bay.",
        "hours": 2
      },
      "singapore_s3": {
        "name": "Chinatown & Hawker Centres",
        "photo": "assets/cities/singapore.jpg",
        "fact": "UNESCO-skyddad gatumatkultur där prisbelönta rätter kostar som en fika.",
        "hours": 2
      }
    },
    "souvDefs": {
      "orkide_sg": {
        "name": "Förgylld singapore-orkidé",
        "origin": "singapore",
        "basePrice": 340,
        "kind": "souvenir",
        "desc": "Singapores nationalblomma Vanda Miss Joaquim.",
        "photo": "assets/souvenirs/parfym_paris.jpg"
      },
      "siden_sg": {
        "name": "Peranakan-sidenask",
        "origin": "singapore",
        "basePrice": 290,
        "kind": "souvenir",
        "desc": "Färgstarkt konsthantverk från Chinatown.",
        "photo": "assets/souvenirs/marmorask.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_singapore_s1_1",
        "city": "singapore",
        "place": "singapore_s1",
        "t": "mc",
        "q": "Vad gör de konstgjorda jätteträden (Supertrees) i Gardens by the Bay?",
        "a": [
          "Samlar regnvatten och solenergi åt växthusen",
          "De är bostadshus",
          "De är radiomaster",
          "De är berg-och-dalbanor"
        ],
        "explain": "Supertrees fungerar som vertikala trädgårdar och miljösmarta energitorn mitt i staden."
      },
      {
        "id": "q50_singapore_s2_1",
        "city": "singapore",
        "place": "singapore_s2",
        "t": "mc",
        "q": "Vad betyder namnet \"Singapura\" på sanskrit?",
        "a": [
          "Lejonstaden",
          "Trädgårdsön",
          "Hamnstaden",
          "Guldkusten"
        ],
        "explain": "Enligt legenden såg prins Sang Nila Utama ett lejon när han steg iland på ön på 1200-talet."
      },
      {
        "id": "q50_singapore_s3_1",
        "city": "singapore",
        "place": "singapore_s3",
        "t": "mc",
        "q": "Vilken unik lag är Singapore världsberömt för sedan 1992 för att hålla gatorna rena?",
        "a": [
          "Förbud mot försäljning av tuggummi",
          "Förbud mot paraplyer",
          "Förbud mot röda bilar",
          "Förbud mot cyklar"
        ],
        "explain": "Tuggummiförbudet infördes bland annat för att hindra att tuggummi fastnade i tunnelbanans dörrsensorer."
      },
      {
        "id": "q50_singapore_job1",
        "city": "singapore",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Singapore?",
        "a": [
          "Singapore",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Singapore ligger i Singapore (Asien), där man talar engelska, malajiska, mandarin & tamil och använder valutan Singaporiansk dollar (SGD)."
      },
      {
        "id": "q50_singapore_job2",
        "city": "singapore",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Singapore (Singapore)?",
        "a": [
          "Singaporiansk dollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I Singapore betalar man med Singaporiansk dollar (SGD). Singapore är en av världens tre kvarvarande självständiga stadsstater."
      },
      {
        "id": "q50_singapore_job_s1",
        "city": "singapore",
        "place": "job",
        "t": "mc",
        "q": "Vad gör de konstgjorda jätteträden (Supertrees) i Gardens by the Bay?",
        "a": [
          "Samlar regnvatten och solenergi åt växthusen",
          "De är bostadshus",
          "De är radiomaster",
          "De är berg-och-dalbanor"
        ],
        "explain": "Supertrees fungerar som vertikala trädgårdar och miljösmarta energitorn mitt i staden."
      },
      {
        "id": "q50_singapore_job_s2",
        "city": "singapore",
        "place": "job",
        "t": "mc",
        "q": "Vad betyder namnet \"Singapura\" på sanskrit?",
        "a": [
          "Lejonstaden",
          "Trädgårdsön",
          "Hamnstaden",
          "Guldkusten"
        ],
        "explain": "Enligt legenden såg prins Sang Nila Utama ett lejon när han steg iland på ön på 1200-talet."
      },
      {
        "id": "q50_singapore_job_s3",
        "city": "singapore",
        "place": "job",
        "t": "mc",
        "q": "Vilken unik lag är Singapore världsberömt för sedan 1992 för att hålla gatorna rena?",
        "a": [
          "Förbud mot försäljning av tuggummi",
          "Förbud mot paraplyer",
          "Förbud mot röda bilar",
          "Förbud mot cyklar"
        ],
        "explain": "Tuggummiförbudet infördes bland annat för att hindra att tuggummi fastnade i tunnelbanans dörrsensorer."
      }
    ],
    "tavern": {
      "name": "Hawker Centre i Chinatown",
      "drink": "kycklingris & limejuice",
      "drinkCost": 110
    },
    "facts": [
      "Singapore",
      "5,9 miljoner",
      "Engelska, malajiska, mandarin & tamil",
      "Singaporiansk dollar (SGD)",
      "Singapore är en av världens tre kvarvarande självständiga stadsstater.",
      "Stadens flygplats Changi har världens högsta inomhusvattenfall."
    ]
  },
  {
    "key": "hanoi",
    "iso": "vn",
    "country": "Vietnam",
    "region": "Asien",
    "name": "Hanoi",
    "code": "HAN",
    "stampColor": "#6b3e1b",
    "stampShape": "round",
    "stampRot": -2,
    "cityObj": {
      "name": "Hanoi",
      "country": "Vietnam",
      "region": "Asien",
      "lat": 21.03,
      "lon": 105.85,
      "tagline": "Tusenårig historia, mopeder och dimmiga sjöar",
      "skyline": "assets/cities/hanoi.jpg",
      "hotel": {
        "name": "Old Quarter Guesthouse",
        "price": 250
      },
      "highlights": [
        "hanoi_s1",
        "hanoi_s2",
        "hanoi_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "konhatt",
        "kaffe_vn"
      ],
      "signature": {
        "name": "Gatuservering vid Hoan Kiem",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Gatuservering vid Hoan Kiem i Hanoi för pho-soppa & äggkaffe och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Hanoi",
          "employer": "Hanois Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Hanoi och svara på frågor om Vietnam."
        },
        {
          "title": "Receptionist på Old Quarter Guesthouse",
          "employer": "Old Quarter Guesthouse",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Old Quarter Guesthouse — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Hanoi",
          "employer": "Hanois Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Hanoi."
        }
      ]
    },
    "placesObj": {
      "hanoi_s1": {
        "name": "Hoan Kiem-sjön",
        "photo": "assets/cities/hanoi.jpg",
        "fact": "Sjö mitt i gamla Hanoi med det röda brospannet och Sköldpaddstornet på en liten ö.",
        "hours": 2
      },
      "hanoi_s2": {
        "name": "Litteraturens tempel",
        "photo": "assets/cities/hanoi.jpg",
        "fact": "Tempel tillägnat Konfucius, grundat år 1070. Sex år senare öppnade här en akademi för landets blivande ämbetsmän.",
        "hours": 2
      },
      "hanoi_s3": {
        "name": "Gamla kvarteret (36 gator)",
        "photo": "assets/cities/hanoi.jpg",
        "fact": "Medeltida handelsgator där varje gata traditionellt sålde en egen vara — siden, silver eller papper.",
        "hours": 2
      }
    },
    "souvDefs": {
      "konhatt": {
        "name": "Vietnamesisk rishatt (Nón lá)",
        "origin": "hanoi",
        "basePrice": 180,
        "kind": "souvenir",
        "desc": "Flätad konformad solhatt av palmblad.",
        "photo": "assets/souvenirs/sombrero.jpg"
      },
      "kaffe_vn": {
        "name": "Vietnamesiskt droppkaffe",
        "origin": "hanoi",
        "basePrice": 210,
        "kind": "souvenir",
        "desc": "Mörkrostat kaffe med litet plåtfilter.",
        "photo": "assets/souvenirs/kaffebonor_rio.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_hanoi_s1_1",
        "city": "hanoi",
        "place": "hanoi_s1",
        "t": "mc",
        "q": "Vilket mytiskt djur vaktar svärdet i legenden om Hoan Kiem-sjön?",
        "a": [
          "En jätteskölpadda",
          "En gyllene karp",
          "En vit tiger",
          "En fenixfågel"
        ],
        "explain": "Hoan Kiem betyder \"Det återlämnade svärdets sjö\", efter kejsar Le Lois magiska svärd."
      },
      {
        "id": "q50_hanoi_s2_1",
        "city": "hanoi",
        "place": "hanoi_s2",
        "t": "mc",
        "q": "Vad var Litteraturens tempel (Van Mieu) i Hanoi känt som från år 1076?",
        "a": [
          "Vietnams första universitet",
          "Kejsarens skattkammare",
          "Ett militärfort",
          "En sidenfabrik"
        ],
        "explain": "De bästa studenternas namn höggs in i stentavlor som vilar på ryggen av stensköldpaddor."
      },
      {
        "id": "q50_hanoi_s3_1",
        "city": "hanoi",
        "place": "hanoi_s3",
        "t": "mc",
        "q": "Vad heter den berömda vietnamesiska nudelsoppan som äts till frukost i Hanoi?",
        "a": [
          "Pho",
          "Ramen",
          "Pad Thai",
          "Laksa"
        ],
        "explain": "Pho föddes i norra Vietnam kring Hanoi i början av 1900-talet."
      },
      {
        "id": "q50_hanoi_job1",
        "city": "hanoi",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Hanoi?",
        "a": [
          "Vietnam",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Hanoi ligger i Vietnam (Asien), där man talar vietnamesiska och använder valutan Dong (VND)."
      },
      {
        "id": "q50_hanoi_job2",
        "city": "hanoi",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Vietnam (Hanoi)?",
        "a": [
          "Dong",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Vietnam betalar man med Dong (VND). Vietnam är världens näst största kaffeexportör efter Brasilien."
      },
      {
        "id": "q50_hanoi_job_s1",
        "city": "hanoi",
        "place": "job",
        "t": "mc",
        "q": "Vilket mytiskt djur vaktar svärdet i legenden om Hoan Kiem-sjön?",
        "a": [
          "En jätteskölpadda",
          "En gyllene karp",
          "En vit tiger",
          "En fenixfågel"
        ],
        "explain": "Hoan Kiem betyder \"Det återlämnade svärdets sjö\", efter kejsar Le Lois magiska svärd."
      },
      {
        "id": "q50_hanoi_job_s2",
        "city": "hanoi",
        "place": "job",
        "t": "mc",
        "q": "Vad var Litteraturens tempel (Van Mieu) i Hanoi känt som från år 1076?",
        "a": [
          "Vietnams första universitet",
          "Kejsarens skattkammare",
          "Ett militärfort",
          "En sidenfabrik"
        ],
        "explain": "De bästa studenternas namn höggs in i stentavlor som vilar på ryggen av stensköldpaddor."
      },
      {
        "id": "q50_hanoi_job_s3",
        "city": "hanoi",
        "place": "job",
        "t": "mc",
        "q": "Vad heter den berömda vietnamesiska nudelsoppan som äts till frukost i Hanoi?",
        "a": [
          "Pho",
          "Ramen",
          "Pad Thai",
          "Laksa"
        ],
        "explain": "Pho föddes i norra Vietnam kring Hanoi i början av 1900-talet."
      }
    ],
    "tavern": {
      "name": "Gatuservering vid Hoan Kiem",
      "drink": "pho-soppa & äggkaffe",
      "drinkCost": 110
    },
    "facts": [
      "Hanoi",
      "100 miljoner",
      "Vietnamesiska",
      "Dong (VND)",
      "Vietnam är världens näst största kaffeexportör efter Brasilien.",
      "Hanoi firade sitt 1 000-årsjubileum som huvudstad år 2010."
    ]
  },
  {
    "key": "hongkong",
    "iso": "hk",
    "country": "Kina (Hongkong)",
    "region": "Asien",
    "name": "Hongkong",
    "code": "HKG",
    "stampColor": "#5b2870",
    "stampShape": "oval",
    "stampRot": 5,
    "cityObj": {
      "name": "Hongkong",
      "country": "Kina (Hongkong)",
      "region": "Asien",
      "lat": 22.32,
      "lon": 114.17,
      "tagline": "Neonskyltar, gröna färjor och branta bergstoppar",
      "skyline": "assets/cities/hongkong.jpg",
      "hotel": {
        "name": "Kowloon Harbour Inn",
        "price": 590
      },
      "highlights": [
        "hongkong_s1",
        "hongkong_s2",
        "hongkong_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "jade_hk",
        "tekanna_hk"
      ],
      "signature": {
        "name": "Dim Sum-tehus i Central",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Dim Sum-tehus i Central i Hongkong för dim sum & jasmin-te och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Hongkong",
          "employer": "Hongkongs Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Hongkong och svara på frågor om Kina (Hongkong)."
        },
        {
          "title": "Receptionist på Kowloon Harbour Inn",
          "employer": "Kowloon Harbour Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Kowloon Harbour Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Hongkong",
          "employer": "Hongkongs Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Hongkong."
        }
      ]
    },
    "placesObj": {
      "hongkong_s1": {
        "name": "Victoria Peak",
        "photo": "assets/cities/hongkong.jpg",
        "fact": "552 meter hög bergstopp med milsvid utsikt över skyskraporna och Victoriahamnen.",
        "hours": 2
      },
      "hongkong_s2": {
        "name": "Star Ferry över Victoria Harbour",
        "photo": "assets/cities/hongkong.jpg",
        "fact": "Klassiska grönvita träfärjor som korsat hamnen mellan Kowloon och Hongkongön i över 130 år.",
        "hours": 2
      },
      "hongkong_s3": {
        "name": "Temple Street Night Market",
        "photo": "assets/cities/hongkong.jpg",
        "fact": "Myllrande nattmarknad i Kowloon med spåmän, gatusång och ångande dim sum.",
        "hours": 2
      }
    },
    "souvDefs": {
      "jade_hk": {
        "name": "Grön jadeamulett",
        "origin": "hongkong",
        "basePrice": 390,
        "kind": "souvenir",
        "desc": "Traditionell lyckosten från Jademarknaden.",
        "photo": "assets/souvenirs/jadestatyett.jpg"
      },
      "tekanna_hk": {
        "name": "Kinesisk te-servis",
        "origin": "hongkong",
        "basePrice": 320,
        "kind": "souvenir",
        "desc": "Liten kanna för jasmin- och oolongte.",
        "photo": "assets/souvenirs/tekanna_kina.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_hongkong_s1_1",
        "city": "hongkong",
        "place": "hongkong_s1",
        "t": "mc",
        "q": "Vilket färdmedel har dragit resenärer uppför den branta backen till Victoria Peak sedan 1888?",
        "a": [
          "Bergbanan Peak Tram",
          "En linbana i trä",
          "Ångbåt",
          "Hästspårvagn"
        ],
        "explain": "Peak Tram var Asiens allra första kabeldrivna bergbana och bjuder på panoramavy över hamnen."
      },
      {
        "id": "q50_hongkong_s2_1",
        "city": "hongkong",
        "place": "hongkong_s2",
        "t": "mc",
        "q": "Vilket år lämnade Storbritannien tillbaka Hongkong till Kina?",
        "a": [
          "1997",
          "1949",
          "1984",
          "2008"
        ],
        "explain": "Den 1 juli 1997 överlämnades Hongkong till Kina under principen \"ett land, två system\"."
      },
      {
        "id": "q50_hongkong_s3_1",
        "city": "hongkong",
        "place": "hongkong_s3",
        "t": "mc",
        "q": "Vad betyder den kantonesiska mattraditionen \"Dim Sum\" ordagrant?",
        "a": [
          "Röra vid hjärtat",
          "Hundra smaker",
          "Liten ångkorg",
          "Morgonte"
        ],
        "explain": "Dim Sum serveras i små bambukorgar tillsammans med te (yum cha)."
      },
      {
        "id": "q50_hongkong_job1",
        "city": "hongkong",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Hongkong?",
        "a": [
          "Kina",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Hongkong ligger i Kina (Hongkong) (Asien), där man talar kantonesiska & engelska och använder valutan Hongkongdollar (HKD)."
      },
      {
        "id": "q50_hongkong_job2",
        "city": "hongkong",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Kina (Hongkong) (Hongkong)?",
        "a": [
          "Hongkongdollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I Kina (Hongkong) betalar man med Hongkongdollar (HKD). Hongkong har flest skyskrapor av alla städer i hela världen."
      },
      {
        "id": "q50_hongkong_job_s1",
        "city": "hongkong",
        "place": "job",
        "t": "mc",
        "q": "Vilket färdmedel har dragit resenärer uppför den branta backen till Victoria Peak sedan 1888?",
        "a": [
          "Bergbanan Peak Tram",
          "En linbana i trä",
          "Ångbåt",
          "Hästspårvagn"
        ],
        "explain": "Peak Tram var Asiens allra första kabeldrivna bergbana och bjuder på panoramavy över hamnen."
      },
      {
        "id": "q50_hongkong_job_s2",
        "city": "hongkong",
        "place": "job",
        "t": "mc",
        "q": "Vilket år lämnade Storbritannien tillbaka Hongkong till Kina?",
        "a": [
          "1997",
          "1949",
          "1984",
          "2008"
        ],
        "explain": "Den 1 juli 1997 överlämnades Hongkong till Kina under principen \"ett land, två system\"."
      },
      {
        "id": "q50_hongkong_job_s3",
        "city": "hongkong",
        "place": "job",
        "t": "mc",
        "q": "Vad betyder den kantonesiska mattraditionen \"Dim Sum\" ordagrant?",
        "a": [
          "Röra vid hjärtat",
          "Hundra smaker",
          "Liten ångkorg",
          "Morgonte"
        ],
        "explain": "Dim Sum serveras i små bambukorgar tillsammans med te (yum cha)."
      }
    ],
    "tavern": {
      "name": "Dim Sum-tehus i Central",
      "drink": "dim sum & jasmin-te",
      "drinkCost": 110
    },
    "facts": [
      "Hongkong (SAR)",
      "7,5 miljoner",
      "Kantonesiska & engelska",
      "Hongkongdollar (HKD)",
      "Hongkong har flest skyskrapor av alla städer i hela världen.",
      "Trots storstadspulsen består över 70 % av Hongkongs yta av gröna berg och öar."
    ]
  },
  {
    "key": "seoul",
    "iso": "kr",
    "country": "Sydkorea",
    "region": "Asien",
    "name": "Seoul",
    "code": "ICN",
    "stampColor": "#8c3c14",
    "stampShape": "rect",
    "stampRot": -1,
    "cityObj": {
      "name": "Seoul",
      "country": "Sydkorea",
      "region": "Asien",
      "lat": 37.57,
      "lon": 126.98,
      "tagline": "Kungapalats från 1300-talet mitt bland framtidsteknik",
      "skyline": "assets/cities/seoul.jpg",
      "hotel": {
        "name": "Hanok Guesthouse Bukchon",
        "price": 540
      },
      "highlights": [
        "seoul_s1",
        "seoul_s2",
        "seoul_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "solfjader_kr",
        "celadon_kr"
      ],
      "signature": {
        "name": "Gatumarknad i Myeongdong",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Gatumarknad i Myeongdong i Seoul för bibimbap & kimchi och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Seoul",
          "employer": "Seouls Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Seoul och svara på frågor om Sydkorea."
        },
        {
          "title": "Receptionist på Hanok Guesthouse Bukchon",
          "employer": "Hanok Guesthouse Bukchon",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hanok Guesthouse Bukchon — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Seoul",
          "employer": "Seouls Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Seoul."
        }
      ]
    },
    "placesObj": {
      "seoul_s1": {
        "name": "Gyeongbokgung-palatset",
        "photo": "assets/cities/seoul.jpg",
        "fact": "Joseondynastins stora huvudpalats från 1395 omgivet av bergen norr om Seoul.",
        "hours": 2
      },
      "seoul_s2": {
        "name": "N Seoul Tower",
        "photo": "assets/cities/seoul.jpg",
        "fact": "Utsiktstorn högst upp på ett grönskande berg mitt i staden, klätt med tusentals kärlekslås.",
        "hours": 2
      },
      "seoul_s3": {
        "name": "Bukchon Hanok Village",
        "photo": "assets/cities/seoul.jpg",
        "fact": "Kvarter med hundratals bevarade traditionella trähus (hanok) med svängda tegeltak.",
        "hours": 2
      }
    },
    "souvDefs": {
      "solfjader_kr": {
        "name": "Koreansk hanji-solfjäder",
        "origin": "seoul",
        "basePrice": 230,
        "kind": "souvenir",
        "desc": "Handgjord papperssolfjäder från Insadong.",
        "photo": "assets/souvenirs/solfjader.jpg"
      },
      "celadon_kr": {
        "name": "Grön celadon-keramik",
        "origin": "seoul",
        "basePrice": 420,
        "kind": "souvenir",
        "desc": "Klassisk koreansk porslinskonst.",
        "photo": "assets/souvenirs/tekanna_kina.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_seoul_s1_1",
        "city": "seoul",
        "place": "seoul_s1",
        "t": "mc",
        "q": "Vad kallas den färgstarka traditionella koreanska dräkten som många bär vid palatset?",
        "a": [
          "Hanbok",
          "Kimono",
          "Ao Dai",
          "Sari"
        ],
        "explain": "Besökare som bär hanbok har ofta fri entré till Seouls gamla kungapalats."
      },
      {
        "id": "q50_seoul_s2_1",
        "city": "seoul",
        "place": "seoul_s2",
        "t": "mc",
        "q": "På vilket grönt berg mitt i centrala Seoul står N Seoul Tower?",
        "a": [
          "Namsan",
          "Fuji",
          "Hallasan",
          "Everest"
        ],
        "explain": "Från Namsan ser man hela Han-floden och Seouls ändlösa hav av ljus."
      },
      {
        "id": "q50_seoul_s3_1",
        "city": "seoul",
        "place": "seoul_s3",
        "t": "mc",
        "q": "Vad heter det koreanska skriftspråket som skapades på 1440-talet av kung Sejong?",
        "a": [
          "Hangul",
          "Kanji",
          "Sanskrit",
          "Kyrilliska"
        ],
        "explain": "Hangul utformades så att alla medborgare lätt skulle kunna lära sig läsa och skriva på bara några dagar."
      },
      {
        "id": "q50_seoul_job1",
        "city": "seoul",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Seoul?",
        "a": [
          "Sydkorea",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Seoul ligger i Sydkorea (Asien), där man talar koreanska och använder valutan Sydkoreansk won (KRW)."
      },
      {
        "id": "q50_seoul_job2",
        "city": "seoul",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Sydkorea (Seoul)?",
        "a": [
          "Sydkoreansk won",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Sydkorea betalar man med Sydkoreansk won (KRW). Sydkorea är världsledande inom både elektronik, film och K-pop."
      },
      {
        "id": "q50_seoul_job_s1",
        "city": "seoul",
        "place": "job",
        "t": "mc",
        "q": "Vad kallas den färgstarka traditionella koreanska dräkten som många bär vid palatset?",
        "a": [
          "Hanbok",
          "Kimono",
          "Ao Dai",
          "Sari"
        ],
        "explain": "Besökare som bär hanbok har ofta fri entré till Seouls gamla kungapalats."
      },
      {
        "id": "q50_seoul_job_s2",
        "city": "seoul",
        "place": "job",
        "t": "mc",
        "q": "På vilket grönt berg mitt i centrala Seoul står N Seoul Tower?",
        "a": [
          "Namsan",
          "Fuji",
          "Hallasan",
          "Everest"
        ],
        "explain": "Från Namsan ser man hela Han-floden och Seouls ändlösa hav av ljus."
      },
      {
        "id": "q50_seoul_job_s3",
        "city": "seoul",
        "place": "job",
        "t": "mc",
        "q": "Vad heter det koreanska skriftspråket som skapades på 1440-talet av kung Sejong?",
        "a": [
          "Hangul",
          "Kanji",
          "Sanskrit",
          "Kyrilliska"
        ],
        "explain": "Hangul utformades så att alla medborgare lätt skulle kunna lära sig läsa och skriva på bara några dagar."
      }
    ],
    "tavern": {
      "name": "Gatumarknad i Myeongdong",
      "drink": "bibimbap & kimchi",
      "drinkCost": 110
    },
    "facts": [
      "Seoul",
      "51,7 miljoner",
      "Koreanska",
      "Sydkoreansk won (KRW)",
      "Sydkorea är världsledande inom både elektronik, film och K-pop.",
      "Kimchi (mjölksyrad kål) har funnits i koreansk matkultur i över tusen år."
    ]
  },
  {
    "key": "kyoto",
    "iso": "jp",
    "country": "Japan",
    "region": "Asien",
    "name": "Kyoto",
    "code": "KIX",
    "stampColor": "#7a2222",
    "stampShape": "round",
    "stampRot": 6,
    "cityObj": {
      "name": "Kyoto",
      "country": "Japan",
      "region": "Asien",
      "lat": 35.01,
      "lon": 135.77,
      "tagline": "Japans gamla kejsarstad med tusen tempel",
      "skyline": "assets/cities/kyoto.jpg",
      "hotel": {
        "name": "Ryokan i Gion",
        "price": 620
      },
      "highlights": [
        "kyoto_s1",
        "kyoto_s2",
        "kyoto_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "solfjader_kyoto",
        "matcha_set"
      ],
      "signature": {
        "name": "Tehus i Pontocho",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Tehus i Pontocho i Kyoto för matcha-te & mochi och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Kyoto",
          "employer": "Kyotos Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Kyoto och svara på frågor om Japan."
        },
        {
          "title": "Receptionist på Ryokan i Gion",
          "employer": "Ryokan i Gion",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Ryokan i Gion — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Kyoto",
          "employer": "Kyotos Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Kyoto."
        }
      ]
    },
    "placesObj": {
      "kyoto_s1": {
        "name": "Fushimi Inari-taisha",
        "photo": "assets/cities/kyoto.jpg",
        "fact": "Shintohelgedom känd för sina tusentals cinnoberröda torii-portar som slingrar sig uppför berget.",
        "hours": 2
      },
      "kyoto_s2": {
        "name": "Kinkaku-ji (Gyllene paviljongen)",
        "photo": "assets/cities/kyoto.jpg",
        "fact": "Zenbuddhistiskt tempel klätt i äkta bladguld som speglar sig i Spegeldammen.",
        "hours": 2
      },
      "kyoto_s3": {
        "name": "Gion & Bambuskogen Arashiyama",
        "photo": "assets/cities/kyoto.jpg",
        "fact": "Historiskt geishakvarter med mörka trähus och skyhöga gröna bambulundar.",
        "hours": 2
      }
    },
    "souvDefs": {
      "solfjader_kyoto": {
        "name": "Handmålad Kyoto-solfjäder",
        "origin": "kyoto",
        "basePrice": 270,
        "kind": "souvenir",
        "desc": "Traditionell sensu-solfjäder från Gion.",
        "photo": "assets/souvenirs/solfjader.jpg"
      },
      "matcha_set": {
        "name": "Matcha-te & bambuvisp",
        "origin": "kyoto",
        "basePrice": 340,
        "kind": "souvenir",
        "desc": "För äkta japansk teceremoni.",
        "photo": "assets/souvenirs/tekanna_kina.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_kyoto_s1_1",
        "city": "kyoto",
        "place": "kyoto_s1",
        "t": "mc",
        "q": "Vilket djur vaktar som budbärare i stenstatyer överallt vid Fushimi Inari?",
        "a": [
          "Räv",
          "Trana",
          "Drake",
          "Karp"
        ],
        "explain": "Rävarna ses som guden Inaris budbärare och bär ofta en nyckel till risförrådet i munnen."
      },
      {
        "id": "q50_kyoto_s2_1",
        "city": "kyoto",
        "place": "kyoto_s2",
        "t": "mc",
        "q": "Hur länge var Kyoto Japans kejserliga huvudstad innan Tokyo tog över 1868?",
        "a": [
          "Över 1 000 år",
          "Cirka 100 år",
          "50 år",
          "300 år"
        ],
        "explain": "Under mer än ett årtusende formades teceremonin, geishakulturen och zenträdgårdarna i Kyoto."
      },
      {
        "id": "q50_kyoto_s3_1",
        "city": "kyoto",
        "place": "kyoto_s3",
        "t": "mc",
        "q": "Vad heter det finmalda gröna teet som vispas vid en traditionell japansk teceremoni?",
        "a": [
          "Matcha",
          "Oolong",
          "Darjeeling",
          "Rooibos"
        ],
        "explain": "Uji strax söder om Kyoto producerar några av världens mest eftertraktade matcha-blad."
      },
      {
        "id": "q50_kyoto_job1",
        "city": "kyoto",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Kyoto?",
        "a": [
          "Japan",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Kyoto ligger i Japan (Asien), där man talar japanska och använder valutan Yen (JPY)."
      },
      {
        "id": "q50_kyoto_job2",
        "city": "kyoto",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Japan (Kyoto)?",
        "a": [
          "Yen",
          "Euro",
          "Svensk krona",
          "Amerikansk dollar"
        ],
        "explain": "I Japan betalar man med Yen (JPY). Kyoto skonades under andra världskriget och har hela 17 UNESCO-världsarv."
      },
      {
        "id": "q50_kyoto_job_s1",
        "city": "kyoto",
        "place": "job",
        "t": "mc",
        "q": "Vilket djur vaktar som budbärare i stenstatyer överallt vid Fushimi Inari?",
        "a": [
          "Räv",
          "Trana",
          "Drake",
          "Karp"
        ],
        "explain": "Rävarna ses som guden Inaris budbärare och bär ofta en nyckel till risförrådet i munnen."
      },
      {
        "id": "q50_kyoto_job_s2",
        "city": "kyoto",
        "place": "job",
        "t": "mc",
        "q": "Hur länge var Kyoto Japans kejserliga huvudstad innan Tokyo tog över 1868?",
        "a": [
          "Över 1 000 år",
          "Cirka 100 år",
          "50 år",
          "300 år"
        ],
        "explain": "Under mer än ett årtusende formades teceremonin, geishakulturen och zenträdgårdarna i Kyoto."
      },
      {
        "id": "q50_kyoto_job_s3",
        "city": "kyoto",
        "place": "job",
        "t": "mc",
        "q": "Vad heter det finmalda gröna teet som vispas vid en traditionell japansk teceremoni?",
        "a": [
          "Matcha",
          "Oolong",
          "Darjeeling",
          "Rooibos"
        ],
        "explain": "Uji strax söder om Kyoto producerar några av världens mest eftertraktade matcha-blad."
      }
    ],
    "tavern": {
      "name": "Tehus i Pontocho",
      "drink": "matcha-te & mochi",
      "drinkCost": 110
    },
    "facts": [
      "Tokyo (Kyoto var huvudstad till 1868)",
      "124 miljoner",
      "Japanska",
      "Yen (JPY)",
      "Kyoto skonades under andra världskriget och har hela 17 UNESCO-världsarv.",
      "Snabbtåget Shinkansen tar dig mellan Tokyo och Kyoto på drygt två timmar."
    ]
  },
  {
    "key": "jakarta",
    "iso": "id",
    "country": "Indonesien",
    "region": "Asien",
    "name": "Jakarta",
    "code": "CGK",
    "stampColor": "#1d4f7a",
    "stampShape": "oval",
    "stampRot": 0,
    "cityObj": {
      "name": "Jakarta",
      "country": "Indonesien",
      "region": "Asien",
      "lat": -6.21,
      "lon": 106.85,
      "tagline": "Örikets pulserande jättestad på ön Java",
      "skyline": "assets/cities/jakarta.jpg",
      "hotel": {
        "name": "Kota Tua Colonial Inn",
        "price": 290
      },
      "highlights": [
        "jakarta_s1",
        "jakarta_s2",
        "jakarta_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "batik_id",
        "kopi_id"
      ],
      "signature": {
        "name": "Warung i Menteng",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Warung i Menteng i Jakarta för nasi goreng & jordnötssås och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Jakarta",
          "employer": "Jakartas Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Jakarta och svara på frågor om Indonesien."
        },
        {
          "title": "Receptionist på Kota Tua Colonial Inn",
          "employer": "Kota Tua Colonial Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Kota Tua Colonial Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Jakarta",
          "employer": "Jakartas Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Jakarta."
        }
      ]
    },
    "placesObj": {
      "jakarta_s1": {
        "name": "Monas (Nationalmonumentet)",
        "photo": "assets/cities/jakarta.jpg",
        "fact": "132 meter högt marmortorn krönt av en gyllene flamma som symboliserar Indonesiens självständighet.",
        "hours": 2
      },
      "jakarta_s2": {
        "name": "Kota Tua (Gamla Batavia)",
        "photo": "assets/cities/jakarta.jpg",
        "fact": "Koloniala torg och kanaler från tiden då holländska Ostindiska kompaniet skeppade kryddor härifrån.",
        "hours": 2
      },
      "jakarta_s3": {
        "name": "Istiqlal-moskén",
        "photo": "assets/cities/jakarta.jpg",
        "fact": "Sydostasiens största moské, byggd rakt över gatan från Jakartas nygotiska katedral.",
        "hours": 2
      }
    },
    "souvDefs": {
      "batik_id": {
        "name": "Handmålat Batik-tyg",
        "origin": "jakarta",
        "basePrice": 260,
        "kind": "souvenir",
        "desc": "UNESCO-skyddad indonesisk vaxfärgning.",
        "photo": "assets/souvenirs/thaisiden.jpg"
      },
      "kopi_id": {
        "name": "Java-kaffebönor",
        "origin": "jakarta",
        "basePrice": 220,
        "kind": "souvenir",
        "desc": "Aromatiskt kaffe från Javas vulkanjord.",
        "photo": "assets/souvenirs/kaffebonor_rio.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_jakarta_s1_1",
        "city": "jakarta",
        "place": "jakarta_s1",
        "t": "mc",
        "q": "På vilken av Indonesiens öar ligger huvudstaden Jakarta?",
        "a": [
          "Java",
          "Bali",
          "Sumatra",
          "Borneo"
        ],
        "explain": "Java är världens mest folkrika ö med över 150 miljoner invånare."
      },
      {
        "id": "q50_jakarta_s2_1",
        "city": "jakarta",
        "place": "jakarta_s2",
        "t": "mc",
        "q": "Vad hette Jakarta under den holländska kolonialtiden fram till 1942?",
        "a": [
          "Batavia",
          "Saigon",
          "Malacca",
          "Rangoon"
        ],
        "explain": "Holländarna grundade Batavia 1619 som högkvarter för handeln med muskot och kryddnejlika."
      },
      {
        "id": "q50_jakarta_s3_1",
        "city": "jakarta",
        "place": "jakarta_s3",
        "t": "mc",
        "q": "Ungefär hur många öar består öriket Indonesien av?",
        "a": [
          "Över 17 000 öar",
          "Cirka 500 öar",
          "70 öar",
          "2 000 öar"
        ],
        "explain": "Indonesien är världens största östat och sträcker sig över 5 000 kilometer längs ekvatorn."
      },
      {
        "id": "q50_jakarta_job1",
        "city": "jakarta",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Jakarta?",
        "a": [
          "Indonesien",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Jakarta ligger i Indonesien (Asien), där man talar indonesiska och använder valutan Rupiah (IDR)."
      },
      {
        "id": "q50_jakarta_job2",
        "city": "jakarta",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Indonesien (Jakarta)?",
        "a": [
          "Rupiah",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Indonesien betalar man med Rupiah (IDR). Indonesien är världens fjärde folkrikaste land och har över 120 aktiva vulkaner."
      },
      {
        "id": "q50_jakarta_job_s1",
        "city": "jakarta",
        "place": "job",
        "t": "mc",
        "q": "På vilken av Indonesiens öar ligger huvudstaden Jakarta?",
        "a": [
          "Java",
          "Bali",
          "Sumatra",
          "Borneo"
        ],
        "explain": "Java är världens mest folkrika ö med över 150 miljoner invånare."
      },
      {
        "id": "q50_jakarta_job_s2",
        "city": "jakarta",
        "place": "job",
        "t": "mc",
        "q": "Vad hette Jakarta under den holländska kolonialtiden fram till 1942?",
        "a": [
          "Batavia",
          "Saigon",
          "Malacca",
          "Rangoon"
        ],
        "explain": "Holländarna grundade Batavia 1619 som högkvarter för handeln med muskot och kryddnejlika."
      },
      {
        "id": "q50_jakarta_job_s3",
        "city": "jakarta",
        "place": "job",
        "t": "mc",
        "q": "Ungefär hur många öar består öriket Indonesien av?",
        "a": [
          "Över 17 000 öar",
          "Cirka 500 öar",
          "70 öar",
          "2 000 öar"
        ],
        "explain": "Indonesien är världens största östat och sträcker sig över 5 000 kilometer längs ekvatorn."
      }
    ],
    "tavern": {
      "name": "Warung i Menteng",
      "drink": "nasi goreng & jordnötssås",
      "drinkCost": 110
    },
    "facts": [
      "Jakarta",
      "278 miljoner",
      "Indonesiska",
      "Rupiah (IDR)",
      "Indonesien är världens fjärde folkrikaste land och har över 120 aktiva vulkaner.",
      "Komodovaranen, världens största ödla, lever vilt på öar i Indonesien."
    ]
  },
  {
    "key": "manila",
    "iso": "ph",
    "country": "Filippinerna",
    "region": "Asien",
    "name": "Manila",
    "code": "MNL",
    "stampColor": "#246b36",
    "stampShape": "rect",
    "stampRot": -6,
    "cityObj": {
      "name": "Manila",
      "country": "Filippinerna",
      "region": "Asien",
      "lat": 14.6,
      "lon": 120.98,
      "tagline": "Spanska fästningsmurar, jeepneys och tropiska solnedgångar",
      "skyline": "assets/cities/manila.jpg",
      "hotel": {
        "name": "Intramuros Heritage Inn",
        "price": 280
      },
      "highlights": [
        "manila_s1",
        "manila_s2",
        "manila_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "parlor_ph",
        "mango_ph"
      ],
      "signature": {
        "name": "Kafé vid Manilabukten",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kafé vid Manilabukten i Manila för adobo & mangoshake och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Manila",
          "employer": "Manilas Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Manila och svara på frågor om Filippinerna."
        },
        {
          "title": "Receptionist på Intramuros Heritage Inn",
          "employer": "Intramuros Heritage Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Intramuros Heritage Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Manila",
          "employer": "Manilas Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Manila."
        }
      ]
    },
    "placesObj": {
      "manila_s1": {
        "name": "Intramuros",
        "photo": "assets/cities/manila.jpg",
        "fact": "Den muromgärdade 1500-talsstaden som spanjorerna byggde vid floden Pasigs mynning.",
        "hours": 2
      },
      "manila_s2": {
        "name": "Rizal Park",
        "photo": "assets/cities/manila.jpg",
        "fact": "Stor grön park uppkallad efter nationalhjälten José Rizal vid den berömda Manilabukten.",
        "hours": 2
      },
      "manila_s3": {
        "name": "San Agustin-kyrkan",
        "photo": "assets/cities/manila.jpg",
        "fact": "Filippinernas äldsta stenkyrka från 1607 som överlevt både jordbävningar och krig.",
        "hours": 2
      }
    },
    "souvDefs": {
      "parlor_ph": {
        "name": "Söderhavspärla i ask",
        "origin": "manila",
        "basePrice": 360,
        "kind": "souvenir",
        "desc": "Filippinerna är känt för sina gyllene pärlor.",
        "photo": "assets/souvenirs/opal_sydney.jpg"
      },
      "mango_ph": {
        "name": "Torkad filippinsk mango",
        "origin": "manila",
        "basePrice": 160,
        "kind": "souvenir",
        "desc": "Solmogen söt mango från Cebu.",
        "photo": "assets/souvenirs/kryddor.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_manila_s1_1",
        "city": "manila",
        "place": "manila_s1",
        "t": "mc",
        "q": "Vad betyder namnet \"Intramuros\" som gamla stadskärnan i Manila kallas?",
        "a": [
          "Innanför murarna",
          "Vid havet",
          "Gyllene porten",
          "Solens stad"
        ],
        "explain": "Intramuros var centrum för det spanska styret i Asien i över 300 år."
      },
      {
        "id": "q50_manila_s2_1",
        "city": "manila",
        "place": "manila_s2",
        "t": "mc",
        "q": "Vad kallas de färgglatt målade, förlängda bussarna som är en symbol för Manilas gator?",
        "a": [
          "Jeepneys",
          "Tuk-tuk",
          "Rickshaws",
          "Matatu"
        ],
        "explain": "De första jeepneyerna byggdes om från överblivna amerikanska militärjeepar efter andra världskriget."
      },
      {
        "id": "q50_manila_s3_1",
        "city": "manila",
        "place": "manila_s3",
        "t": "mc",
        "q": "Efter vilken europeisk kung fick öriket Filippinerna sitt namn år 1543?",
        "a": [
          "Kung Filip II av Spanien",
          "Kung Filip av Frankrike",
          "Filip av Makedonien",
          "Kung Henrik VIII"
        ],
        "explain": "Upptäcktsresanden Ruy López de Villalobos namngav öarna Las Islas Filipinas efter den spanske kronprinsen."
      },
      {
        "id": "q50_manila_job1",
        "city": "manila",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Manila?",
        "a": [
          "Filippinerna",
          "Brasilien",
          "Kanada",
          "Egypten"
        ],
        "explain": "Manila ligger i Filippinerna (Asien), där man talar filippinska (tagalog) & engelska och använder valutan Filippinsk peso (PHP)."
      },
      {
        "id": "q50_manila_job2",
        "city": "manila",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Filippinerna (Manila)?",
        "a": [
          "Filippinsk peso",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Filippinerna betalar man med Filippinsk peso (PHP). Filippinerna består av över 7 600 tropiska öar i västra Stilla havet."
      },
      {
        "id": "q50_manila_job_s1",
        "city": "manila",
        "place": "job",
        "t": "mc",
        "q": "Vad betyder namnet \"Intramuros\" som gamla stadskärnan i Manila kallas?",
        "a": [
          "Innanför murarna",
          "Vid havet",
          "Gyllene porten",
          "Solens stad"
        ],
        "explain": "Intramuros var centrum för det spanska styret i Asien i över 300 år."
      },
      {
        "id": "q50_manila_job_s2",
        "city": "manila",
        "place": "job",
        "t": "mc",
        "q": "Vad kallas de färgglatt målade, förlängda bussarna som är en symbol för Manilas gator?",
        "a": [
          "Jeepneys",
          "Tuk-tuk",
          "Rickshaws",
          "Matatu"
        ],
        "explain": "De första jeepneyerna byggdes om från överblivna amerikanska militärjeepar efter andra världskriget."
      },
      {
        "id": "q50_manila_job_s3",
        "city": "manila",
        "place": "job",
        "t": "mc",
        "q": "Efter vilken europeisk kung fick öriket Filippinerna sitt namn år 1543?",
        "a": [
          "Kung Filip II av Spanien",
          "Kung Filip av Frankrike",
          "Filip av Makedonien",
          "Kung Henrik VIII"
        ],
        "explain": "Upptäcktsresanden Ruy López de Villalobos namngav öarna Las Islas Filipinas efter den spanske kronprinsen."
      }
    ],
    "tavern": {
      "name": "Kafé vid Manilabukten",
      "drink": "adobo & mangoshake",
      "drinkCost": 110
    },
    "facts": [
      "Manila",
      "117 miljoner",
      "Filippinska (tagalog) & engelska",
      "Filippinsk peso (PHP)",
      "Filippinerna består av över 7 600 tropiska öar i västra Stilla havet.",
      "Manila var slutpunkten för de berömda spanska galleonerna som korsade Stilla havet från Mexiko."
    ]
  },
  {
    "key": "marrakech",
    "iso": "ma",
    "country": "Marocko",
    "region": "Afrika",
    "name": "Marrakech",
    "code": "RAK",
    "stampColor": "#6b3e1b",
    "stampShape": "round",
    "stampRot": 1,
    "cityObj": {
      "name": "Marrakech",
      "country": "Marocko",
      "region": "Afrika",
      "lat": 31.63,
      "lon": -7.98,
      "tagline": "Röda lermurar, kryddbasarer och snötäckta Atlasberg",
      "skyline": "assets/cities/marrakech.jpg",
      "hotel": {
        "name": "Riad i Medinan",
        "price": 340
      },
      "highlights": [
        "marrakech_s1",
        "marrakech_s2",
        "marrakech_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "matta_ma",
        "lykta_ma"
      ],
      "signature": {
        "name": "Takbar vid Jemaa el-Fnaa",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Takbar vid Jemaa el-Fnaa i Marrakech för myntate & tagine och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Marrakech",
          "employer": "Marrakechs Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Marrakech och svara på frågor om Marocko."
        },
        {
          "title": "Receptionist på Riad i Medinan",
          "employer": "Riad i Medinan",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Riad i Medinan — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Marrakech",
          "employer": "Marrakechs Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Marrakech."
        }
      ]
    },
    "placesObj": {
      "marrakech_s1": {
        "name": "Jemaa el-Fnaa",
        "photo": "assets/cities/marrakech.jpg",
        "fact": "Sagolikt torg som på kvällen fylls av sagoberättare, musiker och rykande matstånd.",
        "hours": 2
      },
      "marrakech_s2": {
        "name": "Koutoubia-moskén",
        "photo": "assets/cities/marrakech.jpg",
        "fact": "Stadens 77 meter höga minaret från 1100-talet som syns över hela den röda staden.",
        "hours": 2
      },
      "marrakech_s3": {
        "name": "Jardin Majorelle",
        "photo": "assets/cities/marrakech.jpg",
        "fact": "Koboltblå botanisk oas med kaktusar som räddades av modeskaparen Yves Saint Laurent.",
        "hours": 2
      }
    },
    "souvDefs": {
      "matta_ma": {
        "name": "Handvävd berbermatta",
        "origin": "marrakech",
        "basePrice": 460,
        "kind": "souvenir",
        "desc": "Geometrisk ullmatta från Atlasbergen.",
        "photo": "assets/souvenirs/turkisk_matta.jpg"
      },
      "lykta_ma": {
        "name": "Marockansk mässingslykta",
        "origin": "marrakech",
        "basePrice": 280,
        "kind": "souvenir",
        "desc": "Kastar stjärnmönstrade skuggor i mörkret.",
        "photo": "assets/souvenirs/kaffekanna.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_marrakech_s1_1",
        "city": "marrakech",
        "place": "marrakech_s1",
        "t": "mc",
        "q": "Vilken berömd bergskedja reser sig snötäckt i söder från Marrakechs hustak?",
        "a": [
          "Atlasbergen",
          "Drakensbergen",
          "Kilimanjaro",
          "Pyrenéerna"
        ],
        "explain": "Höga Atlas med toppen Toubkal (4 167 m) ligger bara någon timme från Marrakech."
      },
      {
        "id": "q50_marrakech_s2_1",
        "city": "marrakech",
        "place": "marrakech_s2",
        "t": "mc",
        "q": "Varför kallas Marrakech ofta för \"Den röda staden\"?",
        "a": [
          "Stadsmurarna och husen är byggda av röd lera och kalk",
          "Alla tak är rödmålade",
          "Jorden består av röd lava",
          "Den har röda sandstränder"
        ],
        "explain": "Den solbrända ockraröda leran glöder extra starkt i solnedgången."
      },
      {
        "id": "q50_marrakech_s3_1",
        "city": "marrakech",
        "place": "marrakech_s3",
        "t": "mc",
        "q": "Vilken typ av traditionellt marockanskt hus har en sval innergård med apelsinträd och fontän?",
        "a": [
          "Riad",
          "Ryokan",
          "Chalet",
          "Hacienda"
        ],
        "explain": "En riad vänder sig inåt mot en lummig trädgård för att ge svalka och lugn mitt i basaren."
      },
      {
        "id": "q50_marrakech_job1",
        "city": "marrakech",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Marrakech?",
        "a": [
          "Marocko",
          "Brasilien",
          "Japan",
          "Australien"
        ],
        "explain": "Marrakech ligger i Marocko (Afrika), där man talar arabiska & amazigh (berbiska) och använder valutan Marockansk dirham (MAD)."
      },
      {
        "id": "q50_marrakech_job2",
        "city": "marrakech",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Marocko (Marrakech)?",
        "a": [
          "Marockansk dirham",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Marocko betalar man med Marockansk dirham (MAD). Marocko har världens äldsta kontinuerligt verksamma universitet (Al-Qarawiyyin i Fès från 859)."
      },
      {
        "id": "q50_marrakech_job_s1",
        "city": "marrakech",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd bergskedja reser sig snötäckt i söder från Marrakechs hustak?",
        "a": [
          "Atlasbergen",
          "Drakensbergen",
          "Kilimanjaro",
          "Pyrenéerna"
        ],
        "explain": "Höga Atlas med toppen Toubkal (4 167 m) ligger bara någon timme från Marrakech."
      },
      {
        "id": "q50_marrakech_job_s2",
        "city": "marrakech",
        "place": "job",
        "t": "mc",
        "q": "Varför kallas Marrakech ofta för \"Den röda staden\"?",
        "a": [
          "Stadsmurarna och husen är byggda av röd lera och kalk",
          "Alla tak är rödmålade",
          "Jorden består av röd lava",
          "Den har röda sandstränder"
        ],
        "explain": "Den solbrända ockraröda leran glöder extra starkt i solnedgången."
      },
      {
        "id": "q50_marrakech_job_s3",
        "city": "marrakech",
        "place": "job",
        "t": "mc",
        "q": "Vilken typ av traditionellt marockanskt hus har en sval innergård med apelsinträd och fontän?",
        "a": [
          "Riad",
          "Ryokan",
          "Chalet",
          "Hacienda"
        ],
        "explain": "En riad vänder sig inåt mot en lummig trädgård för att ge svalka och lugn mitt i basaren."
      }
    ],
    "tavern": {
      "name": "Takbar vid Jemaa el-Fnaa",
      "drink": "myntate & tagine",
      "drinkCost": 110
    },
    "facts": [
      "Rabat",
      "37,8 miljoner",
      "Arabiska & amazigh (berbiska)",
      "Marockansk dirham (MAD)",
      "Marocko har världens äldsta kontinuerligt verksamma universitet (Al-Qarawiyyin i Fès från 859).",
      "Gibraltarsundet skiljer Marocko från Europa med bara 14 kilometer."
    ]
  },
  {
    "key": "tunis",
    "iso": "tn",
    "country": "Tunisien",
    "region": "Afrika",
    "name": "Tunis",
    "code": "TUN",
    "stampColor": "#5b2870",
    "stampShape": "oval",
    "stampRot": -5,
    "cityObj": {
      "name": "Tunis",
      "country": "Tunisien",
      "region": "Afrika",
      "lat": 36.81,
      "lon": 10.18,
      "tagline": "Medelhavsblått kakel och det antika Karthago",
      "skyline": "assets/cities/tunis.jpg",
      "hotel": {
        "name": "Dar Medina Hotel",
        "price": 320
      },
      "highlights": [
        "tunis_s1",
        "tunis_s2",
        "tunis_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "keramik_tn",
        "harissa"
      ],
      "signature": {
        "name": "Kafé i Sidi Bou Saïd",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kafé i Sidi Bou Saïd i Tunis för pinjenötste & couscous och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Tunis",
          "employer": "Tuniss Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Tunis och svara på frågor om Tunisien."
        },
        {
          "title": "Receptionist på Dar Medina Hotel",
          "employer": "Dar Medina Hotel",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Dar Medina Hotel — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Tunis",
          "employer": "Tuniss Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Tunis."
        }
      ]
    },
    "placesObj": {
      "tunis_s1": {
        "name": "Karthagos ruiner",
        "photo": "assets/cities/tunis.jpg",
        "fact": "Ruinerna efter den feniciska sjömakten som utmanade Rom under generalen Hannibal.",
        "hours": 2
      },
      "tunis_s2": {
        "name": "Sidi Bou Saïd",
        "photo": "assets/cities/tunis.jpg",
        "fact": "Kullby vid havet där varenda hus är kritvitt och varenda dörr och fönsterlucka är klarblå.",
        "hours": 2
      },
      "tunis_s3": {
        "name": "Bardomuseet",
        "photo": "assets/cities/tunis.jpg",
        "fact": "Före detta beypalats med världens rikaste samling av romerska golvmosaiker.",
        "hours": 2
      }
    },
    "souvDefs": {
      "keramik_tn": {
        "name": "Handmålad tunisisk keramikskål",
        "origin": "tunis",
        "basePrice": 250,
        "kind": "souvenir",
        "desc": "Färgstark keramik från Nabeul.",
        "photo": "assets/souvenirs/marmorask.jpg"
      },
      "harissa": {
        "name": "Tunisisk Harissa-krydda",
        "origin": "tunis",
        "basePrice": 160,
        "kind": "souvenir",
        "desc": "Het chilipasta med vitlök och spiskummin.",
        "photo": "assets/souvenirs/kryddor.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_tunis_s1_1",
        "city": "tunis",
        "place": "tunis_s1",
        "t": "mc",
        "q": "Vilka djur tog den karthagiske fältherren Hannibal med sig över Alperna mot Rom?",
        "a": [
          "Stridselefanter",
          "Kameler",
          "Lejon",
          "Noshörningar"
        ],
        "explain": "År 218 f.Kr. ledde Hannibal sin armé och 37 elefanter över Alperna i det andra puniska kriget."
      },
      {
        "id": "q50_tunis_s2_1",
        "city": "tunis",
        "place": "tunis_s2",
        "t": "mc",
        "q": "Vilka två färger präglar hela kustbyn Sidi Bou Saïd utanför Tunis?",
        "a": [
          "Kritvitt och klarblått",
          "Rött och guld",
          "Grönt och gult",
          "Svart och vitt"
        ],
        "explain": "Den blåvita färgskalan skyddar mot medelhavshettan och har blivit Tunisiens vykortssymbol."
      },
      {
        "id": "q50_tunis_s3_1",
        "city": "tunis",
        "place": "tunis_s3",
        "t": "mc",
        "q": "Vilket hav tvättar Tunisiens norra och östra stränder?",
        "a": [
          "Medelhavet",
          "Röda havet",
          "Atlanten",
          "Indiska oceanen"
        ],
        "explain": "Tunisien är Afrikas nordligaste land med Kap Angela som kontinentens nordligaste punkt."
      },
      {
        "id": "q50_tunis_job1",
        "city": "tunis",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Tunis?",
        "a": [
          "Tunisien",
          "Brasilien",
          "Japan",
          "Australien"
        ],
        "explain": "Tunis ligger i Tunisien (Afrika), där man talar arabiska och använder valutan Tunisisk dinar (TND)."
      },
      {
        "id": "q50_tunis_job2",
        "city": "tunis",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Tunisien (Tunis)?",
        "a": [
          "Tunisisk dinar",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Tunisien betalar man med Tunisisk dinar (TND). Tunisien ligger bara 140 kilometer över Medelhavet från Sicilien."
      },
      {
        "id": "q50_tunis_job_s1",
        "city": "tunis",
        "place": "job",
        "t": "mc",
        "q": "Vilka djur tog den karthagiske fältherren Hannibal med sig över Alperna mot Rom?",
        "a": [
          "Stridselefanter",
          "Kameler",
          "Lejon",
          "Noshörningar"
        ],
        "explain": "År 218 f.Kr. ledde Hannibal sin armé och 37 elefanter över Alperna i det andra puniska kriget."
      },
      {
        "id": "q50_tunis_job_s2",
        "city": "tunis",
        "place": "job",
        "t": "mc",
        "q": "Vilka två färger präglar hela kustbyn Sidi Bou Saïd utanför Tunis?",
        "a": [
          "Kritvitt och klarblått",
          "Rött och guld",
          "Grönt och gult",
          "Svart och vitt"
        ],
        "explain": "Den blåvita färgskalan skyddar mot medelhavshettan och har blivit Tunisiens vykortssymbol."
      },
      {
        "id": "q50_tunis_job_s3",
        "city": "tunis",
        "place": "job",
        "t": "mc",
        "q": "Vilket hav tvättar Tunisiens norra och östra stränder?",
        "a": [
          "Medelhavet",
          "Röda havet",
          "Atlanten",
          "Indiska oceanen"
        ],
        "explain": "Tunisien är Afrikas nordligaste land med Kap Angela som kontinentens nordligaste punkt."
      }
    ],
    "tavern": {
      "name": "Kafé i Sidi Bou Saïd",
      "drink": "pinjenötste & couscous",
      "drinkCost": 110
    },
    "facts": [
      "Tunis",
      "12,4 miljoner",
      "Arabiska",
      "Tunisisk dinar (TND)",
      "Tunisien ligger bara 140 kilometer över Medelhavet från Sicilien.",
      "Flera av ökenplaneten Tatooines scener i Star Wars spelades in i södra Tunisien."
    ]
  },
  {
    "key": "nairobi",
    "iso": "ke",
    "country": "Kenya",
    "region": "Afrika",
    "name": "Nairobi",
    "code": "NBO",
    "stampColor": "#8c3c14",
    "stampShape": "rect",
    "stampRot": 2,
    "cityObj": {
      "name": "Nairobi",
      "country": "Kenya",
      "region": "Afrika",
      "lat": -1.29,
      "lon": 36.82,
      "tagline": "Savannens gröna storstad nära ekvatorn",
      "skyline": "assets/cities/nairobi.jpg",
      "hotel": {
        "name": "Safari Park Lodge",
        "price": 350
      },
      "highlights": [
        "nairobi_s1",
        "nairobi_s2",
        "nairobi_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "kaffe_ke",
        "massaj_sjal"
      ],
      "signature": {
        "name": "Kafé i Westlands",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kafé i Westlands i Nairobi för kenyanskt kaffe & nyama choma och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Nairobi",
          "employer": "Nairobis Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Nairobi och svara på frågor om Kenya."
        },
        {
          "title": "Receptionist på Safari Park Lodge",
          "employer": "Safari Park Lodge",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Safari Park Lodge — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Nairobi",
          "employer": "Nairobis Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Nairobi."
        }
      ]
    },
    "placesObj": {
      "nairobi_s1": {
        "name": "Nairobi nationalpark",
        "photo": "assets/cities/nairobi.jpg",
        "fact": "Världens enda riktiga nationalpark med vilda lejon och noshörningar alldeles intill en storstads skyskrapor.",
        "hours": 2
      },
      "nairobi_s2": {
        "name": "Karen Blixen-museet",
        "photo": "assets/cities/nairobi.jpg",
        "fact": "Gården vid foten av Ngong Hills där den danska författaren Karen Blixen bodde och odlade kaffe.",
        "hours": 2
      },
      "nairobi_s3": {
        "name": "Giraffe Centre",
        "photo": "assets/cities/nairobi.jpg",
        "fact": "Naturcenter i Lang’ata där besökare kan mata den utrotningshotade Rothschild-giraffen.",
        "hours": 2
      }
    },
    "souvDefs": {
      "kaffe_ke": {
        "name": "Kenyanskt AA-kaffe",
        "origin": "nairobi",
        "basePrice": 240,
        "kind": "souvenir",
        "desc": "Bärigt höglandskaffe från Mount Kenya.",
        "photo": "assets/souvenirs/kaffebonor_rio.jpg"
      },
      "massaj_sjal": {
        "name": "Rutig massaj-shuka",
        "origin": "nairobi",
        "basePrice": 290,
        "kind": "souvenir",
        "desc": "Klassisk röd- och blåmönstrad filt.",
        "photo": "assets/souvenirs/sjal.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_nairobi_s1_1",
        "city": "nairobi",
        "place": "nairobi_s1",
        "t": "mc",
        "q": "Vad är unikt med Nairobi nationalpark jämfört med andra huvudstäder?",
        "a": [
          "Vilda lejon och giraffer strövar med stadens skyskrapor i bakgrunden",
          "Den ligger under jord",
          "Den har bara pingviner",
          "Den ligger på en ö"
        ],
        "explain": "Parken ligger bara 7 kilometer från Nairobis centrum."
      },
      {
        "id": "q50_nairobi_s2_1",
        "city": "nairobi",
        "place": "nairobi_s2",
        "t": "mc",
        "q": "Vilken berömd bok utspelar sig på kaffefarmen utanför Nairobi?",
        "a": [
          "Den afrikanska farmen",
          "Djungelboken",
          "Mörkrets hjärta",
          "Den gamle och havet"
        ],
        "explain": "Danska Karen Blixen bodde på gården 1917–1931 och gjorde Ngong Hills världsberömda."
      },
      {
        "id": "q50_nairobi_s3_1",
        "city": "nairobi",
        "place": "nairobi_s3",
        "t": "mc",
        "q": "Vilken berömd breddgrad skär rakt igenom Kenya strax norr om Nairobi?",
        "a": [
          "Ekvatorn",
          "Kräftans vändkrets",
          "Norra polcirkeln",
          "Nollmeridianen"
        ],
        "explain": "Trots läget vid ekvatorn har Nairobi svalt och behagligt klimat tack vare höjden på 1 795 meter."
      },
      {
        "id": "q50_nairobi_job1",
        "city": "nairobi",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Nairobi?",
        "a": [
          "Kenya",
          "Brasilien",
          "Japan",
          "Australien"
        ],
        "explain": "Nairobi ligger i Kenya (Afrika), där man talar swahili & engelska och använder valutan Kenyansk shilling (KES)."
      },
      {
        "id": "q50_nairobi_job2",
        "city": "nairobi",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Kenya (Nairobi)?",
        "a": [
          "Kenyansk shilling",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Kenya betalar man med Kenyansk shilling (KES). Kenya är berömt för världens främsta långdistanslöpare från Rift Valley."
      },
      {
        "id": "q50_nairobi_job_s1",
        "city": "nairobi",
        "place": "job",
        "t": "mc",
        "q": "Vad är unikt med Nairobi nationalpark jämfört med andra huvudstäder?",
        "a": [
          "Vilda lejon och giraffer strövar med stadens skyskrapor i bakgrunden",
          "Den ligger under jord",
          "Den har bara pingviner",
          "Den ligger på en ö"
        ],
        "explain": "Parken ligger bara 7 kilometer från Nairobis centrum."
      },
      {
        "id": "q50_nairobi_job_s2",
        "city": "nairobi",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd bok utspelar sig på kaffefarmen utanför Nairobi?",
        "a": [
          "Den afrikanska farmen",
          "Djungelboken",
          "Mörkrets hjärta",
          "Den gamle och havet"
        ],
        "explain": "Danska Karen Blixen bodde på gården 1917–1931 och gjorde Ngong Hills världsberömda."
      },
      {
        "id": "q50_nairobi_job_s3",
        "city": "nairobi",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd breddgrad skär rakt igenom Kenya strax norr om Nairobi?",
        "a": [
          "Ekvatorn",
          "Kräftans vändkrets",
          "Norra polcirkeln",
          "Nollmeridianen"
        ],
        "explain": "Trots läget vid ekvatorn har Nairobi svalt och behagligt klimat tack vare höjden på 1 795 meter."
      }
    ],
    "tavern": {
      "name": "Kafé i Westlands",
      "drink": "kenyanskt kaffe & nyama choma",
      "drinkCost": 110
    },
    "facts": [
      "Nairobi",
      "55 miljoner",
      "Swahili & engelska",
      "Kenyansk shilling (KES)",
      "Kenya är berömt för världens främsta långdistanslöpare från Rift Valley.",
      "Ordet \"safari\" kommer från swahili och betyder helt enkelt \"resa\"."
    ]
  },
  {
    "key": "addisabeba",
    "iso": "et",
    "country": "Etiopien",
    "region": "Afrika",
    "name": "Addis Abeba",
    "code": "ADD",
    "stampColor": "#7a2222",
    "stampShape": "round",
    "stampRot": -4,
    "cityObj": {
      "name": "Addis Abeba",
      "country": "Etiopien",
      "region": "Afrika",
      "lat": 9.03,
      "lon": 38.74,
      "tagline": "Kaffets hemland på Afrikas tak",
      "skyline": "assets/cities/addisabeba.jpg",
      "hotel": {
        "name": "Entoto Highlands Inn",
        "price": 280
      },
      "highlights": [
        "addisabeba_s1",
        "addisabeba_s2",
        "addisabeba_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "kaffe_et",
        "kaffekanna_et"
      ],
      "signature": {
        "name": "Kaffehus i Bole",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kaffehus i Bole i Addis Abeba för etiopisk kaffeceremoni och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Addis Abeba",
          "employer": "Addis Abebas Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Addis Abeba och svara på frågor om Etiopien."
        },
        {
          "title": "Receptionist på Entoto Highlands Inn",
          "employer": "Entoto Highlands Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Entoto Highlands Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Addis Abeba",
          "employer": "Addis Abebas Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Addis Abeba."
        }
      ]
    },
    "placesObj": {
      "addisabeba_s1": {
        "name": "Etiopiens nationalmuseum (Lucy)",
        "photo": "assets/cities/addisabeba.jpg",
        "fact": "Här vilar det 3,2 miljoner år gamla hominidfossilet \"Lucy\" (Dinkinesh).",
        "hours": 2
      },
      "addisabeba_s2": {
        "name": "Merkato",
        "photo": "assets/cities/addisabeba.jpg",
        "fact": "En av Afrikas största utomhusmarknader med kryddor, korgar och handvävda tyger.",
        "hours": 2
      },
      "addisabeba_s3": {
        "name": "Entoto-berget",
        "photo": "assets/cities/addisabeba.jpg",
        "fact": "Eukalyptusklädda höjder på 3 200 meters höjd med utsikt över hela Addis Abeba.",
        "hours": 2
      }
    },
    "souvDefs": {
      "kaffe_et": {
        "name": "Yirgacheffe-kaffebönor",
        "origin": "addisabeba",
        "basePrice": 250,
        "kind": "souvenir",
        "desc": "Blommigt urkaffe från Etiopien.",
        "photo": "assets/souvenirs/kaffebonor_rio.jpg"
      },
      "kaffekanna_et": {
        "name": "Traditionell Jebena-kanna",
        "origin": "addisabeba",
        "basePrice": 310,
        "kind": "souvenir",
        "desc": "Svart lerkanna för etiopisk kaffeceremoni.",
        "photo": "assets/souvenirs/kaffekanna.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_addisabeba_s1_1",
        "city": "addisabeba",
        "place": "addisabeba_s1",
        "t": "mc",
        "q": "Hur gammalt är det världsberömda fossilet \"Lucy\" som hittades i Etiopien 1974?",
        "a": [
          "Cirka 3,2 miljoner år",
          "Cirka 10 000 år",
          "Cirka 200 000 år",
          "65 miljoner år"
        ],
        "explain": "Lucy (Australopithecus afarensis) gav vetenskapen avgörande bevis för att våra tidiga förfäder gick upprätt."
      },
      {
        "id": "q50_addisabeba_s2_1",
        "city": "addisabeba",
        "place": "addisabeba_s2",
        "t": "mc",
        "q": "Vilken världsberömd dryck har sitt vilda ursprung i Etiopiens högländer?",
        "a": [
          "Kaffe",
          "Grönt te",
          "Kakao",
          "Mate"
        ],
        "explain": "Enligt legenden upptäckte getherden Kaldi kaffebusken när hans getter blev ovanligt pigga av de röda bären."
      },
      {
        "id": "q50_addisabeba_s3_1",
        "city": "addisabeba",
        "place": "addisabeba_s3",
        "t": "mc",
        "q": "Vad betyder namnet \"Addis Abeba\" på amhariska?",
        "a": [
          "Ny blomma",
          "Höga berget",
          "Lejonens borg",
          "Solens dal"
        ],
        "explain": "Kejsarinnan Taytu Betul gav staden namnet \"Ny blomma\" när den grundades 1886."
      },
      {
        "id": "q50_addisabeba_job1",
        "city": "addisabeba",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Addis Abeba?",
        "a": [
          "Etiopien",
          "Brasilien",
          "Japan",
          "Australien"
        ],
        "explain": "Addis Abeba ligger i Etiopien (Afrika), där man talar amhariska m.fl. och använder valutan Birr (ETB)."
      },
      {
        "id": "q50_addisabeba_job2",
        "city": "addisabeba",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Etiopien (Addis Abeba)?",
        "a": [
          "Birr",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Etiopien betalar man med Birr (ETB). Etiopien har sin egen kalender med 13 månader som ligger 7–8 år efter vår."
      },
      {
        "id": "q50_addisabeba_job_s1",
        "city": "addisabeba",
        "place": "job",
        "t": "mc",
        "q": "Hur gammalt är det världsberömda fossilet \"Lucy\" som hittades i Etiopien 1974?",
        "a": [
          "Cirka 3,2 miljoner år",
          "Cirka 10 000 år",
          "Cirka 200 000 år",
          "65 miljoner år"
        ],
        "explain": "Lucy (Australopithecus afarensis) gav vetenskapen avgörande bevis för att våra tidiga förfäder gick upprätt."
      },
      {
        "id": "q50_addisabeba_job_s2",
        "city": "addisabeba",
        "place": "job",
        "t": "mc",
        "q": "Vilken världsberömd dryck har sitt vilda ursprung i Etiopiens högländer?",
        "a": [
          "Kaffe",
          "Grönt te",
          "Kakao",
          "Mate"
        ],
        "explain": "Enligt legenden upptäckte getherden Kaldi kaffebusken när hans getter blev ovanligt pigga av de röda bären."
      },
      {
        "id": "q50_addisabeba_job_s3",
        "city": "addisabeba",
        "place": "job",
        "t": "mc",
        "q": "Vad betyder namnet \"Addis Abeba\" på amhariska?",
        "a": [
          "Ny blomma",
          "Höga berget",
          "Lejonens borg",
          "Solens dal"
        ],
        "explain": "Kejsarinnan Taytu Betul gav staden namnet \"Ny blomma\" när den grundades 1886."
      }
    ],
    "tavern": {
      "name": "Kaffehus i Bole",
      "drink": "etiopisk kaffeceremoni",
      "drinkCost": 110
    },
    "facts": [
      "Addis Abeba",
      "126 miljoner",
      "Amhariska m.fl.",
      "Birr (ETB)",
      "Etiopien har sin egen kalender med 13 månader som ligger 7–8 år efter vår.",
      "Addis Abeba är säte för Afrikanska unionen och ligger på 2 355 meters höjd."
    ]
  },
  {
    "key": "lagos",
    "iso": "ng",
    "country": "Nigeria",
    "region": "Afrika",
    "name": "Lagos",
    "code": "LOS",
    "stampColor": "#1d4f7a",
    "stampShape": "oval",
    "stampRot": 3,
    "cityObj": {
      "name": "Lagos",
      "country": "Nigeria",
      "region": "Afrika",
      "lat": 6.52,
      "lon": 3.38,
      "tagline": "Afrobeatens hemstad vid Atlantens laguner",
      "skyline": "assets/cities/lagos.jpg",
      "hotel": {
        "name": "Victoria Island Lodge",
        "price": 340
      },
      "highlights": [
        "lagos_s1",
        "lagos_s2",
        "lagos_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "tyg_ng",
        "trumma_ng"
      ],
      "signature": {
        "name": "Musikbar i Ikeja",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Musikbar i Ikeja i Lagos för jollof rice & grillspett och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Lagos",
          "employer": "Lagoss Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Lagos och svara på frågor om Nigeria."
        },
        {
          "title": "Receptionist på Victoria Island Lodge",
          "employer": "Victoria Island Lodge",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Victoria Island Lodge — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Lagos",
          "employer": "Lagoss Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Lagos."
        }
      ]
    },
    "placesObj": {
      "lagos_s1": {
        "name": "National Museum Lagos",
        "photo": "assets/cities/lagos.jpg",
        "fact": "Hem för 2 000 år gamla terrakottaskulpturer från Nok-kulturen och berömda bronskonstverk.",
        "hours": 2
      },
      "lagos_s2": {
        "name": "Lekki Conservation Centre",
        "photo": "assets/cities/lagos.jpg",
        "fact": "Naturreservat med Afrikas längsta hängbro uppe bland regnskogens trädkronor.",
        "hours": 2
      },
      "lagos_s3": {
        "name": "Victoria Island & Lagunen",
        "photo": "assets/cities/lagos.jpg",
        "fact": "Broar och öar som binder ihop Afrikas största metropol mot Guineabukten.",
        "hours": 2
      }
    },
    "souvDefs": {
      "tyg_ng": {
        "name": "Färgstarkt Ankara-tyg",
        "origin": "lagos",
        "basePrice": 260,
        "kind": "souvenir",
        "desc": "Västafrikanskt mönstrat bomullstyg.",
        "photo": "assets/souvenirs/thaisiden.jpg"
      },
      "trumma_ng": {
        "name": "Miniatyr Talking Drum",
        "origin": "lagos",
        "basePrice": 310,
        "kind": "souvenir",
        "desc": "Traditionell västafrikansk timglastrumma.",
        "photo": "assets/souvenirs/dalahast.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_lagos_s1_1",
        "city": "lagos",
        "place": "lagos_s1",
        "t": "mc",
        "q": "Vilken legendarisk musikgenre föddes i Lagos under 1970-talet med Fela Kuti i spetsen?",
        "a": [
          "Afrobeat",
          "Reggae",
          "Samba",
          "Flamenco"
        ],
        "explain": "Fela Kuti blandade västafrikanska rytmer med jazz och funk och gjorde Lagos till Afrikas musikhuvudstad."
      },
      {
        "id": "q50_lagos_s2_1",
        "city": "lagos",
        "place": "lagos_s2",
        "t": "mc",
        "q": "Vad kallas Nigerias enorma filmindustri, en av världens största i antal filmer?",
        "a": [
          "Nollywood",
          "Bollywood",
          "Lagoswood",
          "Afriwood"
        ],
        "explain": "Nollywood producerar över 2 000 filmer om året och ses över hela Afrika."
      },
      {
        "id": "q50_lagos_s3_1",
        "city": "lagos",
        "place": "lagos_s3",
        "t": "mc",
        "q": "Vilket hav sköljer mot Lagos stränder i söder?",
        "a": [
          "Atlanten",
          "Indiska oceanen",
          "Medelhavet",
          "Röda havet"
        ],
        "explain": "Lagos är ett av Afrikas största ekonomiska och kulturella kraftcentra."
      },
      {
        "id": "q50_lagos_job1",
        "city": "lagos",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Lagos?",
        "a": [
          "Nigeria",
          "Brasilien",
          "Japan",
          "Australien"
        ],
        "explain": "Lagos ligger i Nigeria (Afrika), där man talar engelska, hausa, yoruba & igbo och använder valutan Naira (NGN)."
      },
      {
        "id": "q50_lagos_job2",
        "city": "lagos",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Nigeria (Lagos)?",
        "a": [
          "Naira",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Nigeria betalar man med Naira (NGN). Nigeria är Afrikas folkrikaste land med över 500 talade språk."
      },
      {
        "id": "q50_lagos_job_s1",
        "city": "lagos",
        "place": "job",
        "t": "mc",
        "q": "Vilken legendarisk musikgenre föddes i Lagos under 1970-talet med Fela Kuti i spetsen?",
        "a": [
          "Afrobeat",
          "Reggae",
          "Samba",
          "Flamenco"
        ],
        "explain": "Fela Kuti blandade västafrikanska rytmer med jazz och funk och gjorde Lagos till Afrikas musikhuvudstad."
      },
      {
        "id": "q50_lagos_job_s2",
        "city": "lagos",
        "place": "job",
        "t": "mc",
        "q": "Vad kallas Nigerias enorma filmindustri, en av världens största i antal filmer?",
        "a": [
          "Nollywood",
          "Bollywood",
          "Lagoswood",
          "Afriwood"
        ],
        "explain": "Nollywood producerar över 2 000 filmer om året och ses över hela Afrika."
      },
      {
        "id": "q50_lagos_job_s3",
        "city": "lagos",
        "place": "job",
        "t": "mc",
        "q": "Vilket hav sköljer mot Lagos stränder i söder?",
        "a": [
          "Atlanten",
          "Indiska oceanen",
          "Medelhavet",
          "Röda havet"
        ],
        "explain": "Lagos är ett av Afrikas största ekonomiska och kulturella kraftcentra."
      }
    ],
    "tavern": {
      "name": "Musikbar i Ikeja",
      "drink": "jollof rice & grillspett",
      "drinkCost": 110
    },
    "facts": [
      "Abuja",
      "224 miljoner",
      "Engelska, hausa, yoruba & igbo",
      "Naira (NGN)",
      "Nigeria är Afrikas folkrikaste land med över 500 talade språk.",
      "Lagos är en av världens snabbast växande megastäder."
    ]
  },
  {
    "key": "dakar",
    "iso": "sn",
    "country": "Senegal",
    "region": "Afrika",
    "name": "Dakar",
    "code": "DKR",
    "stampColor": "#246b36",
    "stampShape": "rect",
    "stampRot": -3,
    "cityObj": {
      "name": "Dakar",
      "country": "Senegal",
      "region": "Afrika",
      "lat": 14.72,
      "lon": -17.47,
      "tagline": "Afrikas västligaste udde mot Atlanten",
      "skyline": "assets/cities/dakar.jpg",
      "hotel": {
        "name": "Hotel Plateau",
        "price": 330
      },
      "highlights": [
        "dakar_s1",
        "dakar_s2",
        "dakar_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "korg_sn",
        "hibiskus_sn"
      ],
      "signature": {
        "name": "Kustkafé vid Corniche",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kustkafé vid Corniche i Dakar för thieboudienne & hibiskusjuice och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Dakar",
          "employer": "Dakars Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Dakar och svara på frågor om Senegal."
        },
        {
          "title": "Receptionist på Hotel Plateau",
          "employer": "Hotel Plateau",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Plateau — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Dakar",
          "employer": "Dakars Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Dakar."
        }
      ]
    },
    "placesObj": {
      "dakar_s1": {
        "name": "Île de Gorée",
        "photo": "assets/cities/dakar.jpg",
        "fact": "UNESCO-skyddad ö utanför Dakar med pastellfärgade hus och det historiska Slavarnas hus.",
        "hours": 2
      },
      "dakar_s2": {
        "name": "Afrikas renässansmonument",
        "photo": "assets/cities/dakar.jpg",
        "fact": "49 meter hög bronsstaty på en vulkankulle som blickar ut över Atlanten.",
        "hours": 2
      },
      "dakar_s3": {
        "name": "Lac Rose (Retbasjön)",
        "photo": "assets/cities/dakar.jpg",
        "fact": "Salt sjö strax utanför Dakar vars vatten lyser kraftigt rosa av naturliga alger.",
        "hours": 2
      }
    },
    "souvDefs": {
      "korg_sn": {
        "name": "Flätad senegalesisk korg",
        "origin": "dakar",
        "basePrice": 230,
        "kind": "souvenir",
        "desc": "Färgglatt handarbete från Sandaga-marknaden.",
        "photo": "assets/souvenirs/sombrero.jpg"
      },
      "hibiskus_sn": {
        "name": "Torkad bissap (hibiskuste)",
        "origin": "dakar",
        "basePrice": 160,
        "kind": "souvenir",
        "desc": "Rubinröd, syrlig nationaldryck i Senegal.",
        "photo": "assets/souvenirs/rooiboste.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_dakar_s1_1",
        "city": "dakar",
        "place": "dakar_s1",
        "t": "mc",
        "q": "Vilken berömd ö utanför Dakar är idag ett världsminne mot slaveriet?",
        "a": [
          "Île de Gorée",
          "Robben Island",
          "Zanzibar",
          "Kap Verde"
        ],
        "explain": "Dörren utan återvändo på Île de Gorée påminner om den transatlantiska slavhandelns historia."
      },
      {
        "id": "q50_dakar_s2_1",
        "city": "dakar",
        "place": "dakar_s2",
        "t": "mc",
        "q": "Vilket geografiskt rekord har halvön Kap Verde där Dakar ligger?",
        "a": [
          "Afrikas fastlands västligaste punkt",
          "Afrikas sydligaste punkt",
          "Afrikas högsta stad",
          "Närmast ekvatorn"
        ],
        "explain": "Pointe des Almadies i Dakar är den västligaste punkten på hela den afrikanska kontinenten."
      },
      {
        "id": "q50_dakar_s3_1",
        "city": "dakar",
        "place": "dakar_s3",
        "t": "mc",
        "q": "Varför har sjön Lac Rose utanför Dakar en starkt rosa färg?",
        "a": [
          "Saltälskande mikroalger",
          "Rosa sand på botten",
          "Flamingofjädrar",
          "Kopparmineraler"
        ],
        "explain": "Salthalten i Lac Rose kan vara nästan lika hög som i Döda havet så man flyter lätt."
      },
      {
        "id": "q50_dakar_job1",
        "city": "dakar",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Dakar?",
        "a": [
          "Senegal",
          "Brasilien",
          "Japan",
          "Australien"
        ],
        "explain": "Dakar ligger i Senegal (Afrika), där man talar franska & wolof och använder valutan CFA-franc (XOF)."
      },
      {
        "id": "q50_dakar_job2",
        "city": "dakar",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Senegal (Dakar)?",
        "a": [
          "CFA-franc",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Senegal betalar man med CFA-franc (XOF). Dakar var länge det klassiska slutmålet för ökenrallyt Paris–Dakar."
      },
      {
        "id": "q50_dakar_job_s1",
        "city": "dakar",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd ö utanför Dakar är idag ett världsminne mot slaveriet?",
        "a": [
          "Île de Gorée",
          "Robben Island",
          "Zanzibar",
          "Kap Verde"
        ],
        "explain": "Dörren utan återvändo på Île de Gorée påminner om den transatlantiska slavhandelns historia."
      },
      {
        "id": "q50_dakar_job_s2",
        "city": "dakar",
        "place": "job",
        "t": "mc",
        "q": "Vilket geografiskt rekord har halvön Kap Verde där Dakar ligger?",
        "a": [
          "Afrikas fastlands västligaste punkt",
          "Afrikas sydligaste punkt",
          "Afrikas högsta stad",
          "Närmast ekvatorn"
        ],
        "explain": "Pointe des Almadies i Dakar är den västligaste punkten på hela den afrikanska kontinenten."
      },
      {
        "id": "q50_dakar_job_s3",
        "city": "dakar",
        "place": "job",
        "t": "mc",
        "q": "Varför har sjön Lac Rose utanför Dakar en starkt rosa färg?",
        "a": [
          "Saltälskande mikroalger",
          "Rosa sand på botten",
          "Flamingofjädrar",
          "Kopparmineraler"
        ],
        "explain": "Salthalten i Lac Rose kan vara nästan lika hög som i Döda havet så man flyter lätt."
      }
    ],
    "tavern": {
      "name": "Kustkafé vid Corniche",
      "drink": "thieboudienne & hibiskusjuice",
      "drinkCost": 110
    },
    "facts": [
      "Dakar",
      "18 miljoner",
      "Franska & wolof",
      "CFA-franc (XOF)",
      "Dakar var länge det klassiska slutmålet för ökenrallyt Paris–Dakar.",
      "Senegal är känt för sin gästfrihet, kallad \"Teranga\"."
    ]
  },
  {
    "key": "daressalaam",
    "iso": "tz",
    "country": "Tanzania",
    "region": "Afrika",
    "name": "Dar es-Salaam",
    "code": "DAR",
    "stampColor": "#6b3e1b",
    "stampShape": "round",
    "stampRot": 4,
    "cityObj": {
      "name": "Dar es-Salaam",
      "country": "Tanzania",
      "region": "Afrika",
      "lat": -6.79,
      "lon": 39.21,
      "tagline": "Fredens hamn vid Indiska oceanen mot Zanzibar",
      "skyline": "assets/cities/daressalaam.jpg",
      "hotel": {
        "name": "Oyster Bay Guesthouse",
        "price": 310
      },
      "highlights": [
        "daressalaam_s1",
        "daressalaam_s2",
        "daressalaam_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "nejlika_tz",
        "tingatinga"
      ],
      "signature": {
        "name": "Fiskmarknad vid hamnen",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Fiskmarknad vid hamnen i Dar es-Salaam för grillad fisk & kokosris och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Dar es-Salaam",
          "employer": "Dar es-Salaams Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Dar es-Salaam och svara på frågor om Tanzania."
        },
        {
          "title": "Receptionist på Oyster Bay Guesthouse",
          "employer": "Oyster Bay Guesthouse",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Oyster Bay Guesthouse — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Dar es-Salaam",
          "employer": "Dar es-Salaams Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Dar es-Salaam."
        }
      ]
    },
    "placesObj": {
      "daressalaam_s1": {
        "name": "Kivukoni fiskmarknad",
        "photo": "assets/cities/daressalaam.jpg",
        "fact": "Livlig hamnmarknad där träbåtar (dhows) lägger till med dagens fångst från Indiska oceanen.",
        "hours": 2
      },
      "daressalaam_s2": {
        "name": "Färjan till Kryddön Zanzibar",
        "photo": "assets/cities/daressalaam.jpg",
        "fact": "Kort båttur över sundet till en ögrupp med Stone Town, nejlikor och korallstränder.",
        "hours": 2
      },
      "daressalaam_s3": {
        "name": "Tanzanias nationalmuseum",
        "photo": "assets/cities/daressalaam.jpg",
        "fact": "Rymmer fossila fynd från Olduvai-ravinen och berättelsen om kustens gamla handelskultur.",
        "hours": 2
      }
    },
    "souvDefs": {
      "nejlika_tz": {
        "name": "Zanzibars kryddnejlika",
        "origin": "daressalaam",
        "basePrice": 180,
        "kind": "souvenir",
        "desc": "Väldoftande hel kryddnejlika och muskot.",
        "photo": "assets/souvenirs/kryddor.jpg"
      },
      "tingatinga": {
        "name": "Tingatinga-tavla",
        "origin": "daressalaam",
        "basePrice": 360,
        "kind": "souvenir",
        "desc": "Färgstark tanzanisk djurmålning på duk.",
        "photo": "assets/souvenirs/karnevalsmask.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_daressalaam_s1_1",
        "city": "daressalaam",
        "place": "daressalaam_s1",
        "t": "mc",
        "q": "Vad betyder namnet \"Dar es-Salaam\" på arabiska?",
        "a": [
          "Fredens hamn / Fredens boning",
          "Kryddornas ö",
          "Solens strand",
          "Lejonkusten"
        ],
        "explain": "Sultanen av Zanzibar grundade staden på 1860-talet och gav den namnet \"Fredens boning\"."
      },
      {
        "id": "q50_daressalaam_s2_1",
        "city": "daressalaam",
        "place": "daressalaam_s2",
        "t": "mc",
        "q": "Vilken berömd ögrupp ligger bara två timmars färjeresa från Dar es-Salaam?",
        "a": [
          "Zanzibar",
          "Madagaskar",
          "Seychellerna",
          "Mauritius"
        ],
        "explain": "Zanzibar kallas Kryddön och har i århundraden exporterat kryddnejlika, muskot och kanel."
      },
      {
        "id": "q50_daressalaam_s3_1",
        "city": "daressalaam",
        "place": "daressalaam_s3",
        "t": "mc",
        "q": "Vilket språk talas gemensamt över hela Tanzania och Östafrika?",
        "a": [
          "Swahili",
          "Zulu",
          "Amhariska",
          "Hausa"
        ],
        "explain": "Swahili växte fram i handelshamnarna längs Östafrikas kust i mötet mellan bantuspråk och arabiska."
      },
      {
        "id": "q50_daressalaam_job1",
        "city": "daressalaam",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Dar es-Salaam?",
        "a": [
          "Tanzania",
          "Brasilien",
          "Japan",
          "Australien"
        ],
        "explain": "Dar es-Salaam ligger i Tanzania (Afrika), där man talar swahili & engelska och använder valutan Tanzanisk shilling (TZS)."
      },
      {
        "id": "q50_daressalaam_job2",
        "city": "daressalaam",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Tanzania (Dar es-Salaam)?",
        "a": [
          "Tanzanisk shilling",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Tanzania betalar man med Tanzanisk shilling (TZS). I Tanzania finns både Afrikas högsta berg Kilimanjaro och Serengeti-savannen."
      },
      {
        "id": "q50_daressalaam_job_s1",
        "city": "daressalaam",
        "place": "job",
        "t": "mc",
        "q": "Vad betyder namnet \"Dar es-Salaam\" på arabiska?",
        "a": [
          "Fredens hamn / Fredens boning",
          "Kryddornas ö",
          "Solens strand",
          "Lejonkusten"
        ],
        "explain": "Sultanen av Zanzibar grundade staden på 1860-talet och gav den namnet \"Fredens boning\"."
      },
      {
        "id": "q50_daressalaam_job_s2",
        "city": "daressalaam",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd ögrupp ligger bara två timmars färjeresa från Dar es-Salaam?",
        "a": [
          "Zanzibar",
          "Madagaskar",
          "Seychellerna",
          "Mauritius"
        ],
        "explain": "Zanzibar kallas Kryddön och har i århundraden exporterat kryddnejlika, muskot och kanel."
      },
      {
        "id": "q50_daressalaam_job_s3",
        "city": "daressalaam",
        "place": "job",
        "t": "mc",
        "q": "Vilket språk talas gemensamt över hela Tanzania och Östafrika?",
        "a": [
          "Swahili",
          "Zulu",
          "Amhariska",
          "Hausa"
        ],
        "explain": "Swahili växte fram i handelshamnarna längs Östafrikas kust i mötet mellan bantuspråk och arabiska."
      }
    ],
    "tavern": {
      "name": "Fiskmarknad vid hamnen",
      "drink": "grillad fisk & kokosris",
      "drinkCost": 110
    },
    "facts": [
      "Dodoma (Dar es-Salaam är störst)",
      "67 miljoner",
      "Swahili & engelska",
      "Tanzanisk shilling (TZS)",
      "I Tanzania finns både Afrikas högsta berg Kilimanjaro och Serengeti-savannen.",
      "Tingatinga-konsten föddes i Dar es-Salaam på 1960-talet."
    ]
  },
  {
    "key": "antananarivo",
    "iso": "mg",
    "country": "Madagaskar",
    "region": "Afrika",
    "name": "Antananarivo",
    "code": "TNR",
    "stampColor": "#5b2870",
    "stampShape": "oval",
    "stampRot": -2,
    "cityObj": {
      "name": "Antananarivo",
      "country": "Madagaskar",
      "region": "Afrika",
      "lat": -18.88,
      "lon": 47.51,
      "tagline": "Kullstad i regnskogens och lemurernas örike",
      "skyline": "assets/cities/antananarivo.jpg",
      "hotel": {
        "name": "Haute-Ville Terrace Inn",
        "price": 270
      },
      "highlights": [
        "antananarivo_s1",
        "antananarivo_s2",
        "antananarivo_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "vanilj_mg",
        "fossil_mg"
      ],
      "signature": {
        "name": "Kafé på kullarna",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kafé på kullarna i Antananarivo för vaniljkräm & risgryta och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Antananarivo",
          "employer": "Antananarivos Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Antananarivo och svara på frågor om Madagaskar."
        },
        {
          "title": "Receptionist på Haute-Ville Terrace Inn",
          "employer": "Haute-Ville Terrace Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Haute-Ville Terrace Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Antananarivo",
          "employer": "Antananarivos Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Antananarivo."
        }
      ]
    },
    "placesObj": {
      "antananarivo_s1": {
        "name": "Rova av Antananarivo",
        "photo": "assets/cities/antananarivo.jpg",
        "fact": "Det historiska kungapalatset högst upp på stadens högsta kulle Analamanga.",
        "hours": 2
      },
      "antananarivo_s2": {
        "name": "Analakely-marknaden",
        "photo": "assets/cities/antananarivo.jpg",
        "fact": "Stor terrassmarknad full av äkta bourbonvanilj, kanel och halmhattar.",
        "hours": 2
      },
      "antananarivo_s3": {
        "name": "Avenue of the Baobabs (Utställning)",
        "photo": "assets/cities/antananarivo.jpg",
        "fact": "Madagaskars uråldriga jätteträd, som kan bli över 1 000 år gamla.",
        "hours": 2
      }
    },
    "souvDefs": {
      "vanilj_mg": {
        "name": "Äkta madagaskar-vaniljstänger",
        "origin": "antananarivo",
        "basePrice": 290,
        "kind": "souvenir",
        "desc": "Doftande mörka bourbonvaniljstänger.",
        "photo": "assets/souvenirs/kryddor.jpg"
      },
      "fossil_mg": {
        "name": "Ammonitfossil från Madagaskar",
        "origin": "antananarivo",
        "basePrice": 350,
        "kind": "souvenir",
        "desc": "Polerat urtidsfossil i pärlemor.",
        "photo": "assets/souvenirs/fossil.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_antananarivo_s1_1",
        "city": "antananarivo",
        "place": "antananarivo_s1",
        "t": "mc",
        "q": "Vilket unikt primatdjur lever vilt ENBART på Madagaskar?",
        "a": [
          "Lemurer",
          "Orangutanger",
          "Schimpanser",
          "Gibboner"
        ],
        "explain": "Eftersom Madagaskar skildes från Afrika för över 150 miljoner år sedan finns över 100 unika lemurarter här."
      },
      {
        "id": "q50_antananarivo_s2_1",
        "city": "antananarivo",
        "place": "antananarivo_s2",
        "t": "mc",
        "q": "Vilken dyrbar krydda producerar Madagaskar omkring 80 % av hela världens utbud av?",
        "a": [
          "Äkta vanilj",
          "Saffran",
          "Svartpeppar",
          "Kardemumma"
        ],
        "explain": "Vaniljorkidéns blommor på Madagaskar måste pollineras för hand under bara några timmar på morgonen!"
      },
      {
        "id": "q50_antananarivo_s3_1",
        "city": "antananarivo",
        "place": "antananarivo_s3",
        "t": "mc",
        "q": "Vad kallas Madagaskars mäktiga \"flaskformade\" jätteträd som lagrar vatten i stammen?",
        "a": [
          "Baobabträd",
          "Sekvojaträd",
          "Eukalyptus",
          "Mangrove"
        ],
        "explain": "Sex av världens åtta arter av baobabträd finns bara på Madagaskar."
      },
      {
        "id": "q50_antananarivo_job1",
        "city": "antananarivo",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Antananarivo?",
        "a": [
          "Madagaskar",
          "Brasilien",
          "Japan",
          "Australien"
        ],
        "explain": "Antananarivo ligger i Madagaskar (Afrika), där man talar malagassiska & franska och använder valutan Ariary (MGA)."
      },
      {
        "id": "q50_antananarivo_job2",
        "city": "antananarivo",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Madagaskar (Antananarivo)?",
        "a": [
          "Ariary",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Madagaskar betalar man med Ariary (MGA). Madagaskar är världens fjärde största ö och över 80 % av växt- och djurlivet finns ingen annanstans."
      },
      {
        "id": "q50_antananarivo_job_s1",
        "city": "antananarivo",
        "place": "job",
        "t": "mc",
        "q": "Vilket unikt primatdjur lever vilt ENBART på Madagaskar?",
        "a": [
          "Lemurer",
          "Orangutanger",
          "Schimpanser",
          "Gibboner"
        ],
        "explain": "Eftersom Madagaskar skildes från Afrika för över 150 miljoner år sedan finns över 100 unika lemurarter här."
      },
      {
        "id": "q50_antananarivo_job_s2",
        "city": "antananarivo",
        "place": "job",
        "t": "mc",
        "q": "Vilken dyrbar krydda producerar Madagaskar omkring 80 % av hela världens utbud av?",
        "a": [
          "Äkta vanilj",
          "Saffran",
          "Svartpeppar",
          "Kardemumma"
        ],
        "explain": "Vaniljorkidéns blommor på Madagaskar måste pollineras för hand under bara några timmar på morgonen!"
      },
      {
        "id": "q50_antananarivo_job_s3",
        "city": "antananarivo",
        "place": "job",
        "t": "mc",
        "q": "Vad kallas Madagaskars mäktiga \"flaskformade\" jätteträd som lagrar vatten i stammen?",
        "a": [
          "Baobabträd",
          "Sekvojaträd",
          "Eukalyptus",
          "Mangrove"
        ],
        "explain": "Sex av världens åtta arter av baobabträd finns bara på Madagaskar."
      }
    ],
    "tavern": {
      "name": "Kafé på kullarna",
      "drink": "vaniljkräm & risgryta",
      "drinkCost": 110
    },
    "facts": [
      "Antananarivo",
      "30 miljoner",
      "Malagassiska & franska",
      "Ariary (MGA)",
      "Madagaskar är världens fjärde största ö och över 80 % av växt- och djurlivet finns ingen annanstans.",
      "Antananarivo betyder \"De tusens stad\" efter soldaterna som vaktade kullen på 1600-talet."
    ]
  },
  {
    "key": "toronto",
    "iso": "ca",
    "country": "Kanada",
    "region": "Nordamerika",
    "name": "Toronto",
    "code": "YYZ",
    "stampColor": "#8c3c14",
    "stampShape": "rect",
    "stampRot": 5,
    "cityObj": {
      "name": "Toronto",
      "country": "Kanada",
      "region": "Nordamerika",
      "lat": 43.65,
      "lon": -79.38,
      "tagline": "Mångkulturell sjömetropol vid Lake Ontario",
      "skyline": "assets/cities/toronto.jpg",
      "hotel": {
        "name": "Harbourfront Inn",
        "price": 620
      },
      "highlights": [
        "toronto_s1",
        "toronto_s2",
        "toronto_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "lonnsirap",
        "puck_ca"
      ],
      "signature": {
        "name": "Pub i Distillery District",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Pub i Distillery District i Toronto för poutine & lönnsirap och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Toronto",
          "employer": "Torontos Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Toronto och svara på frågor om Kanada."
        },
        {
          "title": "Receptionist på Harbourfront Inn",
          "employer": "Harbourfront Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Harbourfront Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Toronto",
          "employer": "Torontos Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Toronto."
        }
      ]
    },
    "placesObj": {
      "toronto_s1": {
        "name": "CN Tower",
        "photo": "assets/cities/toronto.jpg",
        "fact": "553 meter högt utsiktstorn med glasgolv som länge var världens högsta fristående konstruktion.",
        "hours": 2
      },
      "toronto_s2": {
        "name": "Hockey Hall of Fame",
        "photo": "assets/cities/toronto.jpg",
        "fact": "Ishockeyns heligaste museum där originalet av Stanley Cup visas upp.",
        "hours": 2
      },
      "toronto_s3": {
        "name": "Distillery District",
        "photo": "assets/cities/toronto.jpg",
        "fact": "Bilfritt 1800-talskvarter med röd tegelarkitektur, gallerier och hantverkskaféer.",
        "hours": 2
      }
    },
    "souvDefs": {
      "lonnsirap": {
        "name": "Kanadensisk lönnsirap",
        "origin": "toronto",
        "basePrice": 230,
        "kind": "souvenir",
        "desc": "Äkta bärnstensfärgad sirap i lönnlövsflaska.",
        "photo": "assets/souvenirs/olivolja.jpg"
      },
      "puck_ca": {
        "name": "Samlarpuck från Toronto",
        "origin": "toronto",
        "basePrice": 190,
        "kind": "souvenir",
        "desc": "Officiell gummipuck från Hockey Hall of Fame.",
        "photo": "assets/souvenirs/snoglob.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_toronto_s1_1",
        "city": "toronto",
        "place": "toronto_s1",
        "t": "mc",
        "q": "Vid vilken av de fem Stora sjöarna ligger staden Toronto?",
        "a": [
          "Lake Ontario",
          "Lake Superior",
          "Lake Michigan",
          "Lake Huron"
        ],
        "explain": "Lake Ontario är den östligaste av de Stora sjöarna och förbinds med Atlanten via Saint Lawrencefloden."
      },
      {
        "id": "q50_toronto_s2_1",
        "city": "toronto",
        "place": "toronto_s2",
        "t": "mc",
        "q": "Vilket trädslag har bladet som pryder Kanadas rödvita flagga?",
        "a": [
          "Lönn",
          "Ek",
          "Björk",
          "Tall"
        ],
        "explain": "Kanada producerar över 70 % av all lönnsirap i hela världen."
      },
      {
        "id": "q50_toronto_s3_1",
        "city": "toronto",
        "place": "toronto_s3",
        "t": "mc",
        "q": "Vilken berömd vattenfallsattraktion ligger bara knappt två timmar söder om Toronto?",
        "a": [
          "Niagarafallen",
          "Victoriafallen",
          "Iguazúfallen",
          "Änglafallen"
        ],
        "explain": "Niagarafallen ligger på gränsen mellan kanadensiska Ontario och delstaten New York."
      },
      {
        "id": "q50_toronto_job1",
        "city": "toronto",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Toronto?",
        "a": [
          "Kanada",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Toronto ligger i Kanada (Nordamerika), där man talar engelska & franska och använder valutan Kanadensisk dollar (CAD)."
      },
      {
        "id": "q50_toronto_job2",
        "city": "toronto",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Kanada (Toronto)?",
        "a": [
          "Kanadensisk dollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I Kanada betalar man med Kanadensisk dollar (CAD). Kanada är världens näst största land till ytan och har världens längsta kustlinje."
      },
      {
        "id": "q50_toronto_job_s1",
        "city": "toronto",
        "place": "job",
        "t": "mc",
        "q": "Vid vilken av de fem Stora sjöarna ligger staden Toronto?",
        "a": [
          "Lake Ontario",
          "Lake Superior",
          "Lake Michigan",
          "Lake Huron"
        ],
        "explain": "Lake Ontario är den östligaste av de Stora sjöarna och förbinds med Atlanten via Saint Lawrencefloden."
      },
      {
        "id": "q50_toronto_job_s2",
        "city": "toronto",
        "place": "job",
        "t": "mc",
        "q": "Vilket trädslag har bladet som pryder Kanadas rödvita flagga?",
        "a": [
          "Lönn",
          "Ek",
          "Björk",
          "Tall"
        ],
        "explain": "Kanada producerar över 70 % av all lönnsirap i hela världen."
      },
      {
        "id": "q50_toronto_job_s3",
        "city": "toronto",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd vattenfallsattraktion ligger bara knappt två timmar söder om Toronto?",
        "a": [
          "Niagarafallen",
          "Victoriafallen",
          "Iguazúfallen",
          "Änglafallen"
        ],
        "explain": "Niagarafallen ligger på gränsen mellan kanadensiska Ontario och delstaten New York."
      }
    ],
    "tavern": {
      "name": "Pub i Distillery District",
      "drink": "poutine & lönnsirap",
      "drinkCost": 110
    },
    "facts": [
      "Ottawa",
      "40 miljoner",
      "Engelska & franska",
      "Kanadensisk dollar (CAD)",
      "Kanada är världens näst största land till ytan och har världens längsta kustlinje.",
      "Toronto är Nordamerikas fjärde folkrikaste stad."
    ]
  },
  {
    "key": "vancouver",
    "iso": "ca",
    "country": "Kanada",
    "region": "Nordamerika",
    "name": "Vancouver",
    "code": "YVR",
    "stampColor": "#7a2222",
    "stampShape": "round",
    "stampRot": -1,
    "cityObj": {
      "name": "Vancouver",
      "country": "Kanada",
      "region": "Nordamerika",
      "lat": 49.28,
      "lon": -123.12,
      "tagline": "Regnskog, snötäckta berg och Stilla havet på samma plats",
      "skyline": "assets/cities/vancouver.jpg",
      "hotel": {
        "name": "Gastown Heritage Hotel",
        "price": 630
      },
      "highlights": [
        "vancouver_s1",
        "vancouver_s2",
        "vancouver_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "ceder_ca",
        "lax_ca"
      ],
      "signature": {
        "name": "Sjöbod på Granville Island",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Sjöbod på Granville Island i Vancouver för rökt stillahavslax och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Vancouver",
          "employer": "Vancouvers Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Vancouver och svara på frågor om Kanada."
        },
        {
          "title": "Receptionist på Gastown Heritage Hotel",
          "employer": "Gastown Heritage Hotel",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Gastown Heritage Hotel — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Vancouver",
          "employer": "Vancouvers Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Vancouver."
        }
      ]
    },
    "placesObj": {
      "vancouver_s1": {
        "name": "Stanley Park",
        "photo": "assets/cities/vancouver.jpg",
        "fact": "En 400 hektar stor regnskogspark på en halvö mitt i Vancouver med historiska totempålar.",
        "hours": 2
      },
      "vancouver_s2": {
        "name": "Gastown Steam Clock",
        "photo": "assets/cities/vancouver.jpg",
        "fact": "Ångdriven gatuklocka i Vancouvers äldsta kvarter som spelar melodier med ångvisslor varje kvart.",
        "hours": 2
      },
      "vancouver_s3": {
        "name": "Capilano Suspension Bridge",
        "photo": "assets/cities/vancouver.jpg",
        "fact": "137 meter lång hängbro 70 meter upp bland jättelika Douglasgranar norr om staden.",
        "hours": 2
      }
    },
    "souvDefs": {
      "ceder_ca": {
        "name": "Snidad cederträsouvenir",
        "origin": "vancouver",
        "basePrice": 340,
        "kind": "souvenir",
        "desc": "Konsthantverk inspirerat av Stillahavskusten.",
        "photo": "assets/souvenirs/dalahast.jpg"
      },
      "lax_ca": {
        "name": "Rökt Stillahavslax i ask",
        "origin": "vancouver",
        "basePrice": 260,
        "kind": "souvenir",
        "desc": "Vancouvers mest klassiska delikatess.",
        "photo": "assets/minigames/fish_salmon.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_vancouver_s1_1",
        "city": "vancouver",
        "place": "vancouver_s1",
        "t": "mc",
        "q": "Vad står de berömda snidade totempålarna i Stanley Park som symboler för?",
        "a": [
          "Nordvästkustens ursprungsfolks släkt- och skapelseberättelser",
          "Vägskyltar för guldgrävare",
          "Fyrar för skepp",
          "Vindmätare"
        ],
        "explain": "Ursprungsfolken längs British Columbias kust (First Nations) har skulpterat cederträ i tusentals år."
      },
      {
        "id": "q50_vancouver_s2_1",
        "city": "vancouver",
        "place": "vancouver_s2",
        "t": "mc",
        "q": "Vilken berömd nordamerikansk bergskedja reser sig öster om Vancouver?",
        "a": [
          "Klippiga bergen",
          "Appalacherna",
          "Anderna",
          "Alperna"
        ],
        "explain": "Coast Mountains och Klippiga bergen ger Vancouver både skidbackar och badstränder samma dag."
      },
      {
        "id": "q50_vancouver_s3_1",
        "city": "vancouver",
        "place": "vancouver_s3",
        "t": "mc",
        "q": "Vilket världshav ligger Vancouver vid?",
        "a": [
          "Stilla havet",
          "Atlanten",
          "Indiska oceanen",
          "Karibiska havet"
        ],
        "explain": "Vancouvers milda kustklimat gör att staden sällan får hård vinter trots det nordliga läget."
      },
      {
        "id": "q50_vancouver_job1",
        "city": "vancouver",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Vancouver?",
        "a": [
          "Kanada",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Vancouver ligger i Kanada (Nordamerika), där man talar engelska & franska och använder valutan Kanadensisk dollar (CAD)."
      },
      {
        "id": "q50_vancouver_job2",
        "city": "vancouver",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Kanada (Vancouver)?",
        "a": [
          "Kanadensisk dollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I Kanada betalar man med Kanadensisk dollar (CAD). Vancouver stod värd för de olympiska vinterspelen år 2010."
      },
      {
        "id": "q50_vancouver_job_s1",
        "city": "vancouver",
        "place": "job",
        "t": "mc",
        "q": "Vad står de berömda snidade totempålarna i Stanley Park som symboler för?",
        "a": [
          "Nordvästkustens ursprungsfolks släkt- och skapelseberättelser",
          "Vägskyltar för guldgrävare",
          "Fyrar för skepp",
          "Vindmätare"
        ],
        "explain": "Ursprungsfolken längs British Columbias kust (First Nations) har skulpterat cederträ i tusentals år."
      },
      {
        "id": "q50_vancouver_job_s2",
        "city": "vancouver",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd nordamerikansk bergskedja reser sig öster om Vancouver?",
        "a": [
          "Klippiga bergen",
          "Appalacherna",
          "Anderna",
          "Alperna"
        ],
        "explain": "Coast Mountains och Klippiga bergen ger Vancouver både skidbackar och badstränder samma dag."
      },
      {
        "id": "q50_vancouver_job_s3",
        "city": "vancouver",
        "place": "job",
        "t": "mc",
        "q": "Vilket världshav ligger Vancouver vid?",
        "a": [
          "Stilla havet",
          "Atlanten",
          "Indiska oceanen",
          "Karibiska havet"
        ],
        "explain": "Vancouvers milda kustklimat gör att staden sällan får hård vinter trots det nordliga läget."
      }
    ],
    "tavern": {
      "name": "Sjöbod på Granville Island",
      "drink": "rökt stillahavslax",
      "drinkCost": 110
    },
    "facts": [
      "Ottawa",
      "40 miljoner",
      "Engelska & franska",
      "Kanadensisk dollar (CAD)",
      "Vancouver stod värd för de olympiska vinterspelen år 2010.",
      "Staden rankas ofta som en av världens mest livsvänliga storstäder."
    ]
  },
  {
    "key": "chicago",
    "iso": "us",
    "country": "USA",
    "region": "Nordamerika",
    "name": "Chicago",
    "code": "ORD",
    "stampColor": "#1d4f7a",
    "stampShape": "oval",
    "stampRot": 6,
    "cityObj": {
      "name": "Chicago",
      "country": "USA",
      "region": "Nordamerika",
      "lat": 41.88,
      "lon": -87.63,
      "tagline": "Skyskrapans födelsestad och bluesens huvudstad",
      "skyline": "assets/cities/chicago.jpg",
      "hotel": {
        "name": "Hotel Michigan Avenue",
        "price": 610
      },
      "highlights": [
        "chicago_s1",
        "chicago_s2",
        "chicago_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "blues_skiva",
        "route66_skylt"
      ],
      "signature": {
        "name": "Bluesklubb vid floden",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Bluesklubb vid floden i Chicago för deep-dish pizza och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Chicago",
          "employer": "Chicagos Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Chicago och svara på frågor om USA."
        },
        {
          "title": "Receptionist på Hotel Michigan Avenue",
          "employer": "Hotel Michigan Avenue",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Michigan Avenue — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Chicago",
          "employer": "Chicagos Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Chicago."
        }
      ]
    },
    "placesObj": {
      "chicago_s1": {
        "name": "Cloud Gate (\"The Bean\")",
        "photo": "assets/cities/chicago.jpg",
        "fact": "Blankpolerad 110 ton tung skulptur i Millennium Park som speglar Chicagos berömda skyline.",
        "hours": 2
      },
      "chicago_s2": {
        "name": "Willis Tower (Sears Tower)",
        "photo": "assets/cities/chicago.jpg",
        "fact": "442 meter hög skyskrapa med utskjutande glasbalkonger på 103:e våningen.",
        "hours": 2
      },
      "chicago_s3": {
        "name": "Art Institute of Chicago",
        "photo": "assets/cities/chicago.jpg",
        "fact": "Världsberömt konstmuseum med Grant Woods \"American Gothic\" och Edward Hoppers \"Nighthawks\".",
        "hours": 2
      }
    },
    "souvDefs": {
      "blues_skiva": {
        "name": "Klassisk Chicago-blues på vinyl",
        "origin": "chicago",
        "basePrice": 280,
        "kind": "souvenir",
        "desc": "Äkta 1950-tals elektrisk blues.",
        "photo": "assets/souvenirs/taxiskylt.jpg"
      },
      "route66_skylt": {
        "name": "Route 66-plåtskylt",
        "origin": "chicago",
        "basePrice": 220,
        "kind": "souvenir",
        "desc": "Klassisk vägskylt från startpunkten i Chicago.",
        "photo": "assets/souvenirs/jeans.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_chicago_s1_1",
        "city": "chicago",
        "place": "chicago_s1",
        "t": "mc",
        "q": "Varför kallas Chicago för \"skyskrapans födelsestad\"?",
        "a": [
          "Världens första stålramsskyskrapa byggdes här 1885",
          "Staden har bara hus över 100 våningar",
          "Hissen uppfanns här 1790",
          "Den ligger högst upp i bergen"
        ],
        "explain": "Efter den stora Chicagobranden 1871 byggdes staden upp på nytt med stålramar och hissar."
      },
      {
        "id": "q50_chicago_s2_1",
        "city": "chicago",
        "place": "chicago_s2",
        "t": "mc",
        "q": "Vilken berömd landsväg genom USA hade sin officiella startpunkt i centrala Chicago?",
        "a": [
          "Route 66",
          "Pan-American Highway",
          "Autobahn 1",
          "Pacific Coast Highway"
        ],
        "explain": "Route 66 sträckte sig 3 940 km från Chicago hela vägen till Santa Monica-piren i Kalifornien."
      },
      {
        "id": "q50_chicago_s3_1",
        "city": "chicago",
        "place": "chicago_s3",
        "t": "mc",
        "q": "Vilket välkänt smeknamn har staden Chicago vid Lake Michigan?",
        "a": [
          "The Windy City",
          "The Big Apple",
          "Sin City",
          "Emerald City"
        ],
        "explain": "Smeknamnet \"The Windy City\" sägs komma både från vindarna över Lake Michigan och 1800-talets pratsamma politiker."
      },
      {
        "id": "q50_chicago_job1",
        "city": "chicago",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Chicago?",
        "a": [
          "USA",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Chicago ligger i USA (Nordamerika), där man talar engelska och använder valutan Amerikansk dollar (USD)."
      },
      {
        "id": "q50_chicago_job2",
        "city": "chicago",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i USA (Chicago)?",
        "a": [
          "Amerikansk dollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I USA betalar man med Amerikansk dollar (USD). Chicago färgar hela Chicagofloden klargrön varje år på St. Patrick’s Day."
      },
      {
        "id": "q50_chicago_job_s1",
        "city": "chicago",
        "place": "job",
        "t": "mc",
        "q": "Varför kallas Chicago för \"skyskrapans födelsestad\"?",
        "a": [
          "Världens första stålramsskyskrapa byggdes här 1885",
          "Staden har bara hus över 100 våningar",
          "Hissen uppfanns här 1790",
          "Den ligger högst upp i bergen"
        ],
        "explain": "Efter den stora Chicagobranden 1871 byggdes staden upp på nytt med stålramar och hissar."
      },
      {
        "id": "q50_chicago_job_s2",
        "city": "chicago",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd landsväg genom USA hade sin officiella startpunkt i centrala Chicago?",
        "a": [
          "Route 66",
          "Pan-American Highway",
          "Autobahn 1",
          "Pacific Coast Highway"
        ],
        "explain": "Route 66 sträckte sig 3 940 km från Chicago hela vägen till Santa Monica-piren i Kalifornien."
      },
      {
        "id": "q50_chicago_job_s3",
        "city": "chicago",
        "place": "job",
        "t": "mc",
        "q": "Vilket välkänt smeknamn har staden Chicago vid Lake Michigan?",
        "a": [
          "The Windy City",
          "The Big Apple",
          "Sin City",
          "Emerald City"
        ],
        "explain": "Smeknamnet \"The Windy City\" sägs komma både från vindarna över Lake Michigan och 1800-talets pratsamma politiker."
      }
    ],
    "tavern": {
      "name": "Bluesklubb vid floden",
      "drink": "deep-dish pizza",
      "drinkCost": 110
    },
    "facts": [
      "Washington, D.C.",
      "335 miljoner",
      "Engelska",
      "Amerikansk dollar (USD)",
      "Chicago färgar hela Chicagofloden klargrön varje år på St. Patrick’s Day.",
      "Staden är USA:s tredje största och ett av världens främsta arkitekturcentra."
    ]
  },
  {
    "key": "losangeles",
    "iso": "us",
    "country": "USA",
    "region": "Nordamerika",
    "name": "Los Angeles",
    "code": "LAX",
    "stampColor": "#246b36",
    "stampShape": "rect",
    "stampRot": 0,
    "cityObj": {
      "name": "Los Angeles",
      "country": "USA",
      "region": "Nordamerika",
      "lat": 34.05,
      "lon": -118.24,
      "tagline": "Drömfabriken Hollywood, palmer och Stilla havet",
      "skyline": "assets/cities/losangeles.jpg",
      "hotel": {
        "name": "Sunset Strip Motel",
        "price": 640
      },
      "highlights": [
        "losangeles_s1",
        "losangeles_s2",
        "losangeles_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "filmklappa",
        "solglasogon_la"
      ],
      "signature": {
        "name": "Diner i Santa Monica",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Diner i Santa Monica i Los Angeles för kalifornisk burgare & milkshake och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Los Angeles",
          "employer": "Los Angeless Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Los Angeles och svara på frågor om USA."
        },
        {
          "title": "Receptionist på Sunset Strip Motel",
          "employer": "Sunset Strip Motel",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Sunset Strip Motel — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Los Angeles",
          "employer": "Los Angeless Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Los Angeles."
        }
      ]
    },
    "placesObj": {
      "losangeles_s1": {
        "name": "Hollywood-skylten",
        "photo": "assets/cities/losangeles.jpg",
        "fact": "De 14 meter höga vita bokstäverna på Mount Lee som sattes upp 1923 som fastighetsreklam.",
        "hours": 2
      },
      "losangeles_s2": {
        "name": "Santa Monica Pier",
        "photo": "assets/cities/losangeles.jpg",
        "fact": "Klassisk träpir från 1909 med pariserhjul och slutskylten för den historiska Route 66.",
        "hours": 2
      },
      "losangeles_s3": {
        "name": "Griffith Observatory",
        "photo": "assets/cities/losangeles.jpg",
        "fact": "Art Deco-observatorium på sluttningen av Mount Hollywood med utsikt över hela staden.",
        "hours": 2
      }
    },
    "souvDefs": {
      "filmklappa": {
        "name": "Hollywood-filmklappa",
        "origin": "losangeles",
        "basePrice": 240,
        "kind": "souvenir",
        "desc": "Klassisk svartvit regissörsklappa.",
        "photo": "assets/souvenirs/kamera.jpg"
      },
      "solglasogon_la": {
        "name": "Retro solglasögon från Venice Beach",
        "origin": "losangeles",
        "basePrice": 210,
        "kind": "souvenir",
        "desc": "90-talsbågar för kalifornisk sol.",
        "photo": "assets/souvenirs/jeans.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_losangeles_s1_1",
        "city": "losangeles",
        "place": "losangeles_s1",
        "t": "mc",
        "q": "Vad stod det ursprungligen på Hollywood-skylten när den restes 1923?",
        "a": [
          "HOLLYWOODLAND",
          "MOVIE TOWN",
          "CALIFORNIA",
          "LOS ANGELES"
        ],
        "explain": "De fyra sista bokstäverna (LAND) togs bort vid en renovering 1949."
      },
      {
        "id": "q50_losangeles_s2_1",
        "city": "losangeles",
        "place": "losangeles_s2",
        "t": "mc",
        "q": "I vilken amerikansk delstat ligger Los Angeles?",
        "a": [
          "Kalifornien",
          "Florida",
          "Texas",
          "Nevada"
        ],
        "explain": "Kalifornien har ensamt en ekonomi som tillhör de fem största i hela världen."
      },
      {
        "id": "q50_losangeles_s3_1",
        "city": "losangeles",
        "place": "losangeles_s3",
        "t": "mc",
        "q": "Vad betyder det spanska namnet \"Los Angeles\"?",
        "a": [
          "Änglarna",
          "Stjärnorna",
          "Palmerna",
          "Solnedgången"
        ],
        "explain": "Spanska nybyggare grundade staden 1781 som \"El Pueblo de Nuestra Señora la Reina de los Ángeles\"."
      },
      {
        "id": "q50_losangeles_job1",
        "city": "losangeles",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Los Angeles?",
        "a": [
          "USA",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Los Angeles ligger i USA (Nordamerika), där man talar engelska och använder valutan Amerikansk dollar (USD)."
      },
      {
        "id": "q50_losangeles_job2",
        "city": "losangeles",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i USA (Los Angeles)?",
        "a": [
          "Amerikansk dollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I USA betalar man med Amerikansk dollar (USD). Oscarsgalan har delats ut i Los Angeles-området sedan 1929."
      },
      {
        "id": "q50_losangeles_job_s1",
        "city": "losangeles",
        "place": "job",
        "t": "mc",
        "q": "Vad stod det ursprungligen på Hollywood-skylten när den restes 1923?",
        "a": [
          "HOLLYWOODLAND",
          "MOVIE TOWN",
          "CALIFORNIA",
          "LOS ANGELES"
        ],
        "explain": "De fyra sista bokstäverna (LAND) togs bort vid en renovering 1949."
      },
      {
        "id": "q50_losangeles_job_s2",
        "city": "losangeles",
        "place": "job",
        "t": "mc",
        "q": "I vilken amerikansk delstat ligger Los Angeles?",
        "a": [
          "Kalifornien",
          "Florida",
          "Texas",
          "Nevada"
        ],
        "explain": "Kalifornien har ensamt en ekonomi som tillhör de fem största i hela världen."
      },
      {
        "id": "q50_losangeles_job_s3",
        "city": "losangeles",
        "place": "job",
        "t": "mc",
        "q": "Vad betyder det spanska namnet \"Los Angeles\"?",
        "a": [
          "Änglarna",
          "Stjärnorna",
          "Palmerna",
          "Solnedgången"
        ],
        "explain": "Spanska nybyggare grundade staden 1781 som \"El Pueblo de Nuestra Señora la Reina de los Ángeles\"."
      }
    ],
    "tavern": {
      "name": "Diner i Santa Monica",
      "drink": "kalifornisk burgare & milkshake",
      "drinkCost": 110
    },
    "facts": [
      "Washington, D.C.",
      "335 miljoner",
      "Engelska",
      "Amerikansk dollar (USD)",
      "Oscarsgalan har delats ut i Los Angeles-området sedan 1929.",
      "Los Angeles har arrangerat sommar-OS 1932 och 1984 (och åter 2028)."
    ]
  },
  {
    "key": "miami",
    "iso": "us",
    "country": "USA",
    "region": "Nordamerika",
    "name": "Miami",
    "code": "MIA",
    "stampColor": "#6b3e1b",
    "stampShape": "round",
    "stampRot": -6,
    "cityObj": {
      "name": "Miami",
      "country": "USA",
      "region": "Nordamerika",
      "lat": 25.76,
      "lon": -80.19,
      "tagline": "Pastellfärgad Art Deco, palmer och Karibiens port",
      "skyline": "assets/cities/miami.jpg",
      "hotel": {
        "name": "Art Deco Hotel Ocean Drive",
        "price": 630
      },
      "highlights": [
        "miami_s1",
        "miami_s2",
        "miami_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "kaffe_mia",
        "snorklar_mia"
      ],
      "signature": {
        "name": "Kubanskt kafé i Little Havana",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kubanskt kafé i Little Havana i Miami för cafecito & kubansk smörgås och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Miami",
          "employer": "Miamis Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Miami och svara på frågor om USA."
        },
        {
          "title": "Receptionist på Art Deco Hotel Ocean Drive",
          "employer": "Art Deco Hotel Ocean Drive",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Art Deco Hotel Ocean Drive — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Miami",
          "employer": "Miamis Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Miami."
        }
      ]
    },
    "placesObj": {
      "miami_s1": {
        "name": "South Beach & Art Deco-kvarteren",
        "photo": "assets/cities/miami.jpg",
        "fact": "Världens största samling pastellfärgade 1930-talsbyggnader med neonskyltar längs Ocean Drive.",
        "hours": 2
      },
      "miami_s2": {
        "name": "Little Havana",
        "photo": "assets/cities/miami.jpg",
        "fact": "Färgstark stadsdel längs Calle Ocho med salsamusik, dominobrickor och kubanskt kaffe.",
        "hours": 2
      },
      "miami_s3": {
        "name": "Biscayne Bay",
        "photo": "assets/cities/miami.jpg",
        "fact": "Turkos bukt mellan Miamis skyskrapor och korallöarna i Florida Keys.",
        "hours": 2
      }
    },
    "souvDefs": {
      "kaffe_mia": {
        "name": "Kubansk espressokanna",
        "origin": "miami",
        "basePrice": 260,
        "kind": "souvenir",
        "desc": "Liten moka-kanna från Calle Ocho.",
        "photo": "assets/souvenirs/kaffekanna.jpg"
      },
      "snorklar_mia": {
        "name": "Art Deco-vykortsset & snäcka",
        "origin": "miami",
        "basePrice": 180,
        "kind": "souvenir",
        "desc": "Pastellminnen från Ocean Drive.",
        "photo": "assets/souvenirs/solfjader.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_miami_s1_1",
        "city": "miami",
        "place": "miami_s1",
        "t": "mc",
        "q": "Vilken arkitekturstil från 1920- och 30-talet är Miami Beach världsberömt för?",
        "a": [
          "Art Deco",
          "Gotik",
          "Barock",
          "Brutalism"
        ],
        "explain": "Över 800 pastellfärgade Art Deco-byggnader med neonljus finns bevarade i South Beach."
      },
      {
        "id": "q50_miami_s2_1",
        "city": "miami",
        "place": "miami_s2",
        "t": "mc",
        "q": "Vilken nationalpark med träskmarker och alligatorer ligger strax väster om Miami?",
        "a": [
          "Everglades",
          "Yellowstone",
          "Yosemite",
          "Grand Canyon"
        ],
        "explain": "Everglades är ett unikt subtropiskt våtmarksområde som kallas \"Gräsfloden\"."
      },
      {
        "id": "q50_miami_s3_1",
        "city": "miami",
        "place": "miami_s3",
        "t": "mc",
        "q": "Vilket öland ligger bara cirka 370 kilometer söder om Miami över Floridasundet?",
        "a": [
          "Kuba",
          "Island",
          "Hawaii",
          "Grönland"
        ],
        "explain": "Miamis närhet till Kuba och Latinamerika har gjort staden till en tvåspråkig kulturbro."
      },
      {
        "id": "q50_miami_job1",
        "city": "miami",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Miami?",
        "a": [
          "USA",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Miami ligger i USA (Nordamerika), där man talar engelska & spanska och använder valutan Amerikansk dollar (USD)."
      },
      {
        "id": "q50_miami_job2",
        "city": "miami",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i USA (Miami)?",
        "a": [
          "Amerikansk dollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I USA betalar man med Amerikansk dollar (USD). Miami är världens största kryssningshamn."
      },
      {
        "id": "q50_miami_job_s1",
        "city": "miami",
        "place": "job",
        "t": "mc",
        "q": "Vilken arkitekturstil från 1920- och 30-talet är Miami Beach världsberömt för?",
        "a": [
          "Art Deco",
          "Gotik",
          "Barock",
          "Brutalism"
        ],
        "explain": "Över 800 pastellfärgade Art Deco-byggnader med neonljus finns bevarade i South Beach."
      },
      {
        "id": "q50_miami_job_s2",
        "city": "miami",
        "place": "job",
        "t": "mc",
        "q": "Vilken nationalpark med träskmarker och alligatorer ligger strax väster om Miami?",
        "a": [
          "Everglades",
          "Yellowstone",
          "Yosemite",
          "Grand Canyon"
        ],
        "explain": "Everglades är ett unikt subtropiskt våtmarksområde som kallas \"Gräsfloden\"."
      },
      {
        "id": "q50_miami_job_s3",
        "city": "miami",
        "place": "job",
        "t": "mc",
        "q": "Vilket öland ligger bara cirka 370 kilometer söder om Miami över Floridasundet?",
        "a": [
          "Kuba",
          "Island",
          "Hawaii",
          "Grönland"
        ],
        "explain": "Miamis närhet till Kuba och Latinamerika har gjort staden till en tvåspråkig kulturbro."
      }
    ],
    "tavern": {
      "name": "Kubanskt kafé i Little Havana",
      "drink": "cafecito & kubansk smörgås",
      "drinkCost": 110
    },
    "facts": [
      "Washington, D.C.",
      "335 miljoner",
      "Engelska & spanska",
      "Amerikansk dollar (USD)",
      "Miami är världens största kryssningshamn.",
      "Staden är den enda amerikanska storstad som grundades av en kvinna (Julia Tuttle, 1896)."
    ]
  },
  {
    "key": "havanna",
    "iso": "cu",
    "country": "Kuba",
    "region": "Nordamerika",
    "name": "Havanna",
    "code": "HAV",
    "stampColor": "#5b2870",
    "stampShape": "oval",
    "stampRot": 1,
    "cityObj": {
      "name": "Havanna",
      "country": "Kuba",
      "region": "Nordamerika",
      "lat": 23.11,
      "lon": -82.37,
      "tagline": "50-talsbilar, koloniala torg och havsvågor mot Malecón",
      "skyline": "assets/cities/havanna.jpg",
      "hotel": {
        "name": "Casa Particular i Habana Vieja",
        "price": 310
      },
      "highlights": [
        "havanna_s1",
        "havanna_s2",
        "havanna_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "maracas_cu",
        "hatt_cu"
      ],
      "signature": {
        "name": "Salsabar vid Malecón",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Salsabar vid Malecón i Havanna för mojito (alkoholfri) & kubansk rytm och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Havanna",
          "employer": "Havannas Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Havanna och svara på frågor om Kuba."
        },
        {
          "title": "Receptionist på Casa Particular i Habana Vieja",
          "employer": "Casa Particular i Habana Vieja",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Casa Particular i Habana Vieja — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Havanna",
          "employer": "Havannas Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Havanna."
        }
      ]
    },
    "placesObj": {
      "havanna_s1": {
        "name": "Malecón",
        "photo": "assets/cities/havanna.jpg",
        "fact": "8 kilometer lång havspromenad där musiker, fiskare och 1950-talsbilar samlas i solnedgången.",
        "hours": 2
      },
      "havanna_s2": {
        "name": "Habana Vieja (Gamla Havanna)",
        "photo": "assets/cities/havanna.jpg",
        "fact": "UNESCO-världsarv med barockkatedraler, stenlagda torg och balkonger i smidesjärn.",
        "hours": 2
      },
      "havanna_s3": {
        "name": "El Capitolio",
        "photo": "assets/cities/havanna.jpg",
        "fact": "Pampig kupolbyggnad från 1929 som påminner starkt om Kapitolium i Washington.",
        "hours": 2
      }
    },
    "souvDefs": {
      "maracas_cu": {
        "name": "Handmålade kubanska maracas",
        "origin": "havanna",
        "basePrice": 190,
        "kind": "souvenir",
        "desc": "För äkta son- och salsarytmer.",
        "photo": "assets/souvenirs/karnevalsmask.jpg"
      },
      "hatt_cu": {
        "name": "Kubansk stråhatt",
        "origin": "havanna",
        "basePrice": 220,
        "kind": "souvenir",
        "desc": "Lätt solhatt från Plaza Vieja.",
        "photo": "assets/souvenirs/sombrero.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_havanna_s1_1",
        "city": "havanna",
        "place": "havanna_s1",
        "t": "mc",
        "q": "Varför rullar så många färgglada amerikanska 1950-talsbilar fortfarande på Havannas gator?",
        "a": [
          "Handelsembargot från 1960 stoppade import av nya amerikanska bilar",
          "Kuba uppfann bilen på 1950-talet",
          "Det är lag på veteranbilar",
          "Moderna bilar tål inte klimatet"
        ],
        "explain": "Kubanska mekaniker har i över 60 år hållit 1950-talets Chevrolet och Cadillac vid liv med otrolig uppfinningsrikedom."
      },
      {
        "id": "q50_havanna_s2_1",
        "city": "havanna",
        "place": "havanna_s2",
        "t": "mc",
        "q": "Vilken berömd amerikansk författare bodde i över 20 år utanför Havanna och skrev \"Den gamle och havet\"?",
        "a": [
          "Ernest Hemingway",
          "Mark Twain",
          "F. Scott Fitzgerald",
          "John Steinbeck"
        ],
        "explain": "Hemingway besökte ofta barerna El Floridita och La Bodeguita del Medio i Gamla Havanna."
      },
      {
        "id": "q50_havanna_s3_1",
        "city": "havanna",
        "place": "havanna_s3",
        "t": "mc",
        "q": "Vilket hav och vilken bukt omger ön Kuba?",
        "a": [
          "Karibiska havet, Mexikanska golfen och Atlanten",
          "Stilla havet",
          "Medelhavet",
          "Indiska oceanen"
        ],
        "explain": "Kuba är Karibiens största ö och har en yta på omkring 110 000 km²."
      },
      {
        "id": "q50_havanna_job1",
        "city": "havanna",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Havanna?",
        "a": [
          "Kuba",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Havanna ligger i Kuba (Nordamerika), där man talar spanska och använder valutan Kubansk peso (CUP)."
      },
      {
        "id": "q50_havanna_job2",
        "city": "havanna",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Kuba (Havanna)?",
        "a": [
          "Kubansk peso",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Kuba betalar man med Kubansk peso (CUP). Kuba har gett världen musikstilar som son, mambo, cha-cha-cha och rumba."
      },
      {
        "id": "q50_havanna_job_s1",
        "city": "havanna",
        "place": "job",
        "t": "mc",
        "q": "Varför rullar så många färgglada amerikanska 1950-talsbilar fortfarande på Havannas gator?",
        "a": [
          "Handelsembargot från 1960 stoppade import av nya amerikanska bilar",
          "Kuba uppfann bilen på 1950-talet",
          "Det är lag på veteranbilar",
          "Moderna bilar tål inte klimatet"
        ],
        "explain": "Kubanska mekaniker har i över 60 år hållit 1950-talets Chevrolet och Cadillac vid liv med otrolig uppfinningsrikedom."
      },
      {
        "id": "q50_havanna_job_s2",
        "city": "havanna",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd amerikansk författare bodde i över 20 år utanför Havanna och skrev \"Den gamle och havet\"?",
        "a": [
          "Ernest Hemingway",
          "Mark Twain",
          "F. Scott Fitzgerald",
          "John Steinbeck"
        ],
        "explain": "Hemingway besökte ofta barerna El Floridita och La Bodeguita del Medio i Gamla Havanna."
      },
      {
        "id": "q50_havanna_job_s3",
        "city": "havanna",
        "place": "job",
        "t": "mc",
        "q": "Vilket hav och vilken bukt omger ön Kuba?",
        "a": [
          "Karibiska havet, Mexikanska golfen och Atlanten",
          "Stilla havet",
          "Medelhavet",
          "Indiska oceanen"
        ],
        "explain": "Kuba är Karibiens största ö och har en yta på omkring 110 000 km²."
      }
    ],
    "tavern": {
      "name": "Salsabar vid Malecón",
      "drink": "mojito (alkoholfri) & kubansk rytm",
      "drinkCost": 110
    },
    "facts": [
      "Havanna",
      "11 miljoner",
      "Spanska",
      "Kubansk peso (CUP)",
      "Kuba har gett världen musikstilar som son, mambo, cha-cha-cha och rumba.",
      "Havanna grundades 1519 och blev Spaniens viktigaste skatteskeppshamn i Nya världen."
    ]
  },
  {
    "key": "panamacity",
    "iso": "pa",
    "country": "Panama",
    "region": "Nordamerika",
    "name": "Panama City",
    "code": "PTY",
    "stampColor": "#8c3c14",
    "stampShape": "rect",
    "stampRot": -5,
    "cityObj": {
      "name": "Panama City",
      "country": "Panama",
      "region": "Nordamerika",
      "lat": 8.98,
      "lon": -79.52,
      "tagline": "Skyskrapor vid Stilla havet och världens berömda kanal",
      "skyline": "assets/cities/panamacity.jpg",
      "hotel": {
        "name": "Hotel Casco Viejo",
        "price": 420
      },
      "highlights": [
        "panamacity_s1",
        "panamacity_s2",
        "panamacity_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "panamahatt",
        "mola_pa"
      ],
      "signature": {
        "name": "Takbar i Casco Viejo",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Takbar i Casco Viejo i Panama City för ceviche & kall ananasjuice och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Panama City",
          "employer": "Panama Citys Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Panama City och svara på frågor om Panama."
        },
        {
          "title": "Receptionist på Hotel Casco Viejo",
          "employer": "Hotel Casco Viejo",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Casco Viejo — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Panama City",
          "employer": "Panama Citys Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Panama City."
        }
      ]
    },
    "placesObj": {
      "panamacity_s1": {
        "name": "Miraflores-slussarna (Panamakanalen)",
        "photo": "assets/cities/panamacity.jpg",
        "fact": "Här höjs och sänks enorma containerfartyg 16 meter på sin väg mellan två världshav.",
        "hours": 2
      },
      "panamacity_s2": {
        "name": "Casco Viejo",
        "photo": "assets/cities/panamacity.jpg",
        "fact": "Färgglad kolonial stadsdel från 1673 med takterrasser, kyrkor och utsikt över kanalinloppet.",
        "hours": 2
      },
      "panamacity_s3": {
        "name": "Biomuseo",
        "photo": "assets/cities/panamacity.jpg",
        "fact": "Färgsprakande naturhistoriskt museum vid kanalen ritat av Frank Gehry.",
        "hours": 2
      }
    },
    "souvDefs": {
      "panamahatt": {
        "name": "Flätad Panamahatt",
        "origin": "panamacity",
        "basePrice": 310,
        "kind": "souvenir",
        "desc": "Lätt handflätad solhatt (ursprungligen från Ecuador, berömd via Panamakanalen!).",
        "photo": "assets/souvenirs/sombrero.jpg"
      },
      "mola_pa": {
        "name": "Handbroderad Mola-textil",
        "origin": "panamacity",
        "basePrice": 290,
        "kind": "souvenir",
        "desc": "Färgstarkt tygkonstverk från Guna-folket.",
        "photo": "assets/souvenirs/thaisiden.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_panamacity_s1_1",
        "city": "panamacity",
        "place": "panamacity_s1",
        "t": "mc",
        "q": "Vilka två världshav förbinds av den 82 kilometer långa Panamakanalen?",
        "a": [
          "Atlanten och Stilla havet",
          "Atlanten och Indiska oceanen",
          "Stilla havet och Norra ishavet",
          "Medelhavet och Röda havet"
        ],
        "explain": "Panamakanalen öppnade 1914 och sparar fartyg över 13 000 kilometer runt Sydamerikas sydspets."
      },
      {
        "id": "q50_panamacity_s2_1",
        "city": "panamacity",
        "place": "panamacity_s2",
        "t": "mc",
        "q": "Hur många gånger om året kan man se solen gå upp över Stilla havet just i Panama City?",
        "a": [
          "Varje dag – på grund av landets S-formade krök!",
          "Aldrig",
          "Bara vid sommarsolståndet",
          "En gång vart fjärde år"
        ],
        "explain": "Eftersom Panamanäset kröker sig i öst-västlig riktning ligger Stilla havets inlopp faktiskt öster om Atlantens!"
      },
      {
        "id": "q50_panamacity_s3_1",
        "city": "panamacity",
        "place": "panamacity_s3",
        "t": "mc",
        "q": "Vilket land bildades när Panamanäset reste sig ur havet för ca 3 miljoner år sedan?",
        "a": [
          "Landbryggan mellan Nord- och Sydamerika",
          "En bro till Europa",
          "En ny kontinent i Atlanten",
          "Karibiska öarna"
        ],
        "explain": "När näset slöts förändrades jordens havsströmmar — bland annat stärktes Golfströmmen som värmer Norden!"
      },
      {
        "id": "q50_panamacity_job1",
        "city": "panamacity",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Panama City?",
        "a": [
          "Panama",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Panama City ligger i Panama (Nordamerika), där man talar spanska och använder valutan Balboa (PAB) & USD."
      },
      {
        "id": "q50_panamacity_job2",
        "city": "panamacity",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Panama (Panama City)?",
        "a": [
          "Balboa & USD",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Panama betalar man med Balboa (PAB) & USD. Omkring 14 000 fartyg passerar genom Panamakanalen varje år."
      },
      {
        "id": "q50_panamacity_job_s1",
        "city": "panamacity",
        "place": "job",
        "t": "mc",
        "q": "Vilka två världshav förbinds av den 82 kilometer långa Panamakanalen?",
        "a": [
          "Atlanten och Stilla havet",
          "Atlanten och Indiska oceanen",
          "Stilla havet och Norra ishavet",
          "Medelhavet och Röda havet"
        ],
        "explain": "Panamakanalen öppnade 1914 och sparar fartyg över 13 000 kilometer runt Sydamerikas sydspets."
      },
      {
        "id": "q50_panamacity_job_s2",
        "city": "panamacity",
        "place": "job",
        "t": "mc",
        "q": "Hur många gånger om året kan man se solen gå upp över Stilla havet just i Panama City?",
        "a": [
          "Varje dag – på grund av landets S-formade krök!",
          "Aldrig",
          "Bara vid sommarsolståndet",
          "En gång vart fjärde år"
        ],
        "explain": "Eftersom Panamanäset kröker sig i öst-västlig riktning ligger Stilla havets inlopp faktiskt öster om Atlantens!"
      },
      {
        "id": "q50_panamacity_job_s3",
        "city": "panamacity",
        "place": "job",
        "t": "mc",
        "q": "Vilket land bildades när Panamanäset reste sig ur havet för ca 3 miljoner år sedan?",
        "a": [
          "Landbryggan mellan Nord- och Sydamerika",
          "En bro till Europa",
          "En ny kontinent i Atlanten",
          "Karibiska öarna"
        ],
        "explain": "När näset slöts förändrades jordens havsströmmar — bland annat stärktes Golfströmmen som värmer Norden!"
      }
    ],
    "tavern": {
      "name": "Takbar i Casco Viejo",
      "drink": "ceviche & kall ananasjuice",
      "drinkCost": 110
    },
    "facts": [
      "Panama City",
      "4,4 miljoner",
      "Spanska",
      "Balboa (PAB) & USD",
      "Omkring 14 000 fartyg passerar genom Panamakanalen varje år.",
      "Panama är det enda stället i världen där man kan se solen gå upp över Stilla havet och ner över Atlanten."
    ]
  },
  {
    "key": "buenosaires",
    "iso": "ar",
    "country": "Argentina",
    "region": "Sydamerika",
    "name": "Buenos Aires",
    "code": "EZE",
    "stampColor": "#7a2222",
    "stampShape": "round",
    "stampRot": 2,
    "cityObj": {
      "name": "Buenos Aires",
      "country": "Argentina",
      "region": "Sydamerika",
      "lat": -34.6,
      "lon": -58.38,
      "tagline": "Tangons födelsestad och \"Sydamerikas Paris\"",
      "skyline": "assets/cities/buenosaires.jpg",
      "hotel": {
        "name": "Hotel San Telmo",
        "price": 440
      },
      "highlights": [
        "buenosaires_s1",
        "buenosaires_s2",
        "buenosaires_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "mate_ar",
        "lader_ar"
      ],
      "signature": {
        "name": "Tangobar i La Boca",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Tangobar i La Boca i Buenos Aires för empanadas & yerba mate och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Buenos Aires",
          "employer": "Buenos Airess Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Buenos Aires och svara på frågor om Argentina."
        },
        {
          "title": "Receptionist på Hotel San Telmo",
          "employer": "Hotel San Telmo",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel San Telmo — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Buenos Aires",
          "employer": "Buenos Airess Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Buenos Aires."
        }
      ]
    },
    "placesObj": {
      "buenosaires_s1": {
        "name": "La Boca & Caminito",
        "photo": "assets/cities/buenosaires.jpg",
        "fact": "Färgstark hamnstadsdel med korrugerade plåthus målade i restfärg från fartygen och gatudansare på kullerstenen.",
        "hours": 2
      },
      "buenosaires_s2": {
        "name": "Teatro Colón",
        "photo": "assets/cities/buenosaires.jpg",
        "fact": "Ett av världens vackraste operahus, berömt för sin nästan perfekta akustik.",
        "hours": 2
      },
      "buenosaires_s3": {
        "name": "Plaza de Mayo & Casa Rosada",
        "photo": "assets/cities/buenosaires.jpg",
        "fact": "Stadens historiska hjärta framför presidentpalatset, platsen för otaliga demonstrationer.",
        "hours": 2
      }
    },
    "souvDefs": {
      "mate_ar": {
        "name": "Mate-kalebass & bombilla",
        "origin": "buenosaires",
        "basePrice": 240,
        "kind": "souvenir",
        "desc": "Traditionellt kärl och sugrör för yerba mate.",
        "photo": "assets/souvenirs/kaffekanna.jpg"
      },
      "lader_ar": {
        "name": "Argentinskt läderbälte",
        "origin": "buenosaires",
        "basePrice": 380,
        "kind": "souvenir",
        "desc": "Handgjort läderhantverk från San Telmo.",
        "photo": "assets/souvenirs/jeans.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_buenosaires_s1_1",
        "city": "buenosaires",
        "place": "buenosaires_s1",
        "t": "mc",
        "q": "Vilken världsberömd pardans föddes i hamnkvarteren i Buenos Aires på 1880-talet?",
        "a": [
          "Tango",
          "Samba",
          "Salsa",
          "Vals"
        ],
        "explain": "Tangon växte fram i mötet mellan europeiska immigranter, afrikanska rytmer och gaucho-musik."
      },
      {
        "id": "q50_buenosaires_s2_1",
        "city": "buenosaires",
        "place": "buenosaires_s2",
        "t": "mc",
        "q": "Vad kallas det berömda fotbollslaget från stadsdelen La Boca där Diego Maradona spelade?",
        "a": [
          "Boca Juniors",
          "Real Madrid",
          "Flamengo",
          "Santos"
        ],
        "explain": "Hemmastadion La Bombonera (\"Chokladasken\") ligger bara ett stenkast från Caminito."
      },
      {
        "id": "q50_buenosaires_s3_1",
        "city": "buenosaires",
        "place": "buenosaires_s3",
        "t": "mc",
        "q": "Vilken färg har presidentpalatset Casa Rosada på Plaza de Mayo?",
        "a": [
          "Rosa",
          "Kritvitt",
          "Guldgult",
          "Himmelsblått"
        ],
        "explain": "Enligt traditionen blandades röd och vit färg för att symbolisera försoning mellan landets politiska läger."
      },
      {
        "id": "q50_buenosaires_job1",
        "city": "buenosaires",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Buenos Aires?",
        "a": [
          "Argentina",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Buenos Aires ligger i Argentina (Sydamerika), där man talar spanska och använder valutan Argentinsk peso (ARS)."
      },
      {
        "id": "q50_buenosaires_job2",
        "city": "buenosaires",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Argentina (Buenos Aires)?",
        "a": [
          "Argentinsk peso",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Argentina betalar man med Argentinsk peso (ARS). Buenos Aires betyder \"Goda vindar\" på spanska."
      },
      {
        "id": "q50_buenosaires_job_s1",
        "city": "buenosaires",
        "place": "job",
        "t": "mc",
        "q": "Vilken världsberömd pardans föddes i hamnkvarteren i Buenos Aires på 1880-talet?",
        "a": [
          "Tango",
          "Samba",
          "Salsa",
          "Vals"
        ],
        "explain": "Tangon växte fram i mötet mellan europeiska immigranter, afrikanska rytmer och gaucho-musik."
      },
      {
        "id": "q50_buenosaires_job_s2",
        "city": "buenosaires",
        "place": "job",
        "t": "mc",
        "q": "Vad kallas det berömda fotbollslaget från stadsdelen La Boca där Diego Maradona spelade?",
        "a": [
          "Boca Juniors",
          "Real Madrid",
          "Flamengo",
          "Santos"
        ],
        "explain": "Hemmastadion La Bombonera (\"Chokladasken\") ligger bara ett stenkast från Caminito."
      },
      {
        "id": "q50_buenosaires_job_s3",
        "city": "buenosaires",
        "place": "job",
        "t": "mc",
        "q": "Vilken färg har presidentpalatset Casa Rosada på Plaza de Mayo?",
        "a": [
          "Rosa",
          "Kritvitt",
          "Guldgult",
          "Himmelsblått"
        ],
        "explain": "Enligt traditionen blandades röd och vit färg för att symbolisera försoning mellan landets politiska läger."
      }
    ],
    "tavern": {
      "name": "Tangobar i La Boca",
      "drink": "empanadas & yerba mate",
      "drinkCost": 110
    },
    "facts": [
      "Buenos Aires",
      "46 miljoner",
      "Spanska",
      "Argentinsk peso (ARS)",
      "Buenos Aires betyder \"Goda vindar\" på spanska.",
      "Avenida 9 de Julio i Buenos Aires är en av världens bredaste avenyer."
    ]
  },
  {
    "key": "lima",
    "iso": "pe",
    "country": "Peru",
    "region": "Sydamerika",
    "name": "Lima",
    "code": "LIM",
    "stampColor": "#1d4f7a",
    "stampShape": "oval",
    "stampRot": -4,
    "cityObj": {
      "name": "Lima",
      "country": "Peru",
      "region": "Sydamerika",
      "lat": -12.05,
      "lon": -77.04,
      "tagline": "Stilla havets klippkust, guldmuseer och världsklassmat",
      "skyline": "assets/cities/lima.jpg",
      "hotel": {
        "name": "Miraflores Cliff Inn",
        "price": 380
      },
      "highlights": [
        "lima_s1",
        "lima_s2",
        "lima_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "alpacka_pe",
        "panflojt_pe"
      ],
      "signature": {
        "name": "Cevichería i Barranco",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Cevichería i Barranco i Lima för färsk ceviche & chicha morada och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Lima",
          "employer": "Limas Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Lima och svara på frågor om Peru."
        },
        {
          "title": "Receptionist på Miraflores Cliff Inn",
          "employer": "Miraflores Cliff Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Miraflores Cliff Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Lima",
          "employer": "Limas Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Lima."
        }
      ]
    },
    "placesObj": {
      "lima_s1": {
        "name": "Plaza Mayor i Lima",
        "photo": "assets/cities/lima.jpg",
        "fact": "Den spanska kolonialstadens hjärta grundat 1535 med snidade mörka träbalkonger.",
        "hours": 2
      },
      "lima_s2": {
        "name": "Larco-museet",
        "photo": "assets/cities/lima.jpg",
        "fact": "Skattkammare av förkolumbiansk keramik, textilier och guld från Inka-, Moche- och Nazcakulturerna.",
        "hours": 2
      },
      "lima_s3": {
        "name": "Miraflores & Barranco",
        "photo": "assets/cities/lima.jpg",
        "fact": "Lummiga klippparker högt ovanför Stilla havets surfvågor och bohemiska konstkvarter.",
        "hours": 2
      }
    },
    "souvDefs": {
      "alpacka_pe": {
        "name": "Mjuk alpackasjal från Anderna",
        "origin": "lima",
        "basePrice": 420,
        "kind": "souvenir",
        "desc": "Färgstark och fjäderlätt alpackaull.",
        "photo": "assets/souvenirs/sjal.jpg"
      },
      "panflojt_pe": {
        "name": "Andinsk panflöjt (Zampoña)",
        "origin": "lima",
        "basePrice": 220,
        "kind": "souvenir",
        "desc": "Handbunden bambuflöjt från Peru.",
        "photo": "assets/souvenirs/dalahast.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_lima_s1_1",
        "city": "lima",
        "place": "lima_s1",
        "t": "mc",
        "q": "Vilken spansk conquistador grundade staden Lima år 1535?",
        "a": [
          "Francisco Pizarro",
          "Hernán Cortés",
          "Simón Bolívar",
          "Vasco da Gama"
        ],
        "explain": "Pizarro grundade Lima som \"Kungarnas stad\" (Ciudad de los Reyes) som huvudstad för vicekungadömet Peru."
      },
      {
        "id": "q50_lima_s2_1",
        "city": "lima",
        "place": "lima_s2",
        "t": "mc",
        "q": "Vad kallas Perus berömda nationalrätt på färsk rå fisk marinerad i lime, chili och rödlök?",
        "a": [
          "Ceviche",
          "Paella",
          "Tacos",
          "Feijoada"
        ],
        "explain": "Limas ceviche har blivit UNESCO-erkänt immateriellt kulturarv."
      },
      {
        "id": "q50_lima_s3_1",
        "city": "lima",
        "place": "lima_s3",
        "t": "mc",
        "q": "Vilken mäktig bergskedja sträcker sig genom hela Peru från norr till söder?",
        "a": [
          "Anderna",
          "Klippiga bergen",
          "Himalaya",
          "Alperna"
        ],
        "explain": "Anderna är världens längsta bergskedja på land (över 7 000 kilometer)."
      },
      {
        "id": "q50_lima_job1",
        "city": "lima",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Lima?",
        "a": [
          "Peru",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Lima ligger i Peru (Sydamerika), där man talar spanska & quechua och använder valutan Sol (PEN)."
      },
      {
        "id": "q50_lima_job2",
        "city": "lima",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Peru (Lima)?",
        "a": [
          "Sol",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Peru betalar man med Sol (PEN). Potatisen odlades första gången i Anderna i Peru för över 7 000 år sedan — landet har över 3 000 sorter!"
      },
      {
        "id": "q50_lima_job_s1",
        "city": "lima",
        "place": "job",
        "t": "mc",
        "q": "Vilken spansk conquistador grundade staden Lima år 1535?",
        "a": [
          "Francisco Pizarro",
          "Hernán Cortés",
          "Simón Bolívar",
          "Vasco da Gama"
        ],
        "explain": "Pizarro grundade Lima som \"Kungarnas stad\" (Ciudad de los Reyes) som huvudstad för vicekungadömet Peru."
      },
      {
        "id": "q50_lima_job_s2",
        "city": "lima",
        "place": "job",
        "t": "mc",
        "q": "Vad kallas Perus berömda nationalrätt på färsk rå fisk marinerad i lime, chili och rödlök?",
        "a": [
          "Ceviche",
          "Paella",
          "Tacos",
          "Feijoada"
        ],
        "explain": "Limas ceviche har blivit UNESCO-erkänt immateriellt kulturarv."
      },
      {
        "id": "q50_lima_job_s3",
        "city": "lima",
        "place": "job",
        "t": "mc",
        "q": "Vilken mäktig bergskedja sträcker sig genom hela Peru från norr till söder?",
        "a": [
          "Anderna",
          "Klippiga bergen",
          "Himalaya",
          "Alperna"
        ],
        "explain": "Anderna är världens längsta bergskedja på land (över 7 000 kilometer)."
      }
    ],
    "tavern": {
      "name": "Cevichería i Barranco",
      "drink": "färsk ceviche & chicha morada",
      "drinkCost": 110
    },
    "facts": [
      "Lima",
      "34 miljoner",
      "Spanska & quechua",
      "Sol (PEN)",
      "Potatisen odlades första gången i Anderna i Peru för över 7 000 år sedan — landet har över 3 000 sorter!",
      "Lima ligger i en kustöken där det nästan aldrig regnar trots dimman från havet."
    ]
  },
  {
    "key": "santiago",
    "iso": "cl",
    "country": "Chile",
    "region": "Sydamerika",
    "name": "Santiago",
    "code": "SCL",
    "stampColor": "#246b36",
    "stampShape": "rect",
    "stampRot": 3,
    "cityObj": {
      "name": "Santiago",
      "country": "Chile",
      "region": "Sydamerika",
      "lat": -33.45,
      "lon": -70.67,
      "tagline": "Snöklädda 6 000-meterstoppar rakt bakom storstaden",
      "skyline": "assets/cities/santiago.jpg",
      "hotel": {
        "name": "Hotel Bellavista",
        "price": 430
      },
      "highlights": [
        "santiago_s1",
        "santiago_s2",
        "santiago_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "lapis_cl",
        "poncho_cl"
      ],
      "signature": {
        "name": "Kafé i Lastarria",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kafé i Lastarria i Santiago för empanada de pino och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Santiago",
          "employer": "Santiagos Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Santiago och svara på frågor om Chile."
        },
        {
          "title": "Receptionist på Hotel Bellavista",
          "employer": "Hotel Bellavista",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Bellavista — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Santiago",
          "employer": "Santiagos Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Santiago."
        }
      ]
    },
    "placesObj": {
      "santiago_s1": {
        "name": "Cerro San Cristóbal",
        "photo": "assets/cities/santiago.jpg",
        "fact": "Grön bergskulle mitt i Santiago med bergbana och en 14 meter hög vit staty på toppen.",
        "hours": 2
      },
      "santiago_s2": {
        "name": "Plaza de Armas & La Moneda",
        "photo": "assets/cities/santiago.jpg",
        "fact": "Historiskt torg från 1541 omgivet av katedralen och det nyklassiska presidentpalatset.",
        "hours": 2
      },
      "santiago_s3": {
        "name": "Mercado Central",
        "photo": "assets/cities/santiago.jpg",
        "fact": "Vacker gjutjärnshall från 1872 full av skaldjur från Stilla havets kalla Humboldtström.",
        "hours": 2
      }
    },
    "souvDefs": {
      "lapis_cl": {
        "name": "Slipat smycke i Lapis Lazuli",
        "origin": "santiago",
        "basePrice": 360,
        "kind": "souvenir",
        "desc": "Djupblå ädelsten från Chiles berg.",
        "photo": "assets/souvenirs/opal_sydney.jpg"
      },
      "poncho_cl": {
        "name": "Chilensk vävd poncho",
        "origin": "santiago",
        "basePrice": 390,
        "kind": "souvenir",
        "desc": "Varm randig ylleponcho från Anderna.",
        "photo": "assets/souvenirs/sjal.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_santiago_s1_1",
        "city": "santiago",
        "place": "santiago_s1",
        "t": "mc",
        "q": "Vilken berömd öknen i norra Chile är världens torraste icke-polära öken?",
        "a": [
          "Atacamaöknen",
          "Sahara",
          "Gobiöknen",
          "Mojaveöknen"
        ],
        "explain": "I delar av Atacamaöknen har det inte fallit mätbart regn på århundraden, och himlen är perfekt för stjärnobservatorier."
      },
      {
        "id": "q50_santiago_s2_1",
        "city": "santiago",
        "place": "santiago_s2",
        "t": "mc",
        "q": "Vilken chilensk poet fick Nobelpriset i litteratur 1971 och hade ett hus i Bellavista?",
        "a": [
          "Pablo Neruda",
          "Gabriel García Márquez",
          "Jorge Luis Borges",
          "Octavio Paz"
        ],
        "explain": "Pablo Nerudas lekfulla hus \"La Chascona\" i Santiago är idag ett populärt museum."
      },
      {
        "id": "q50_santiago_s3_1",
        "city": "santiago",
        "place": "santiago_s3",
        "t": "mc",
        "q": "Vilken berömd stillahavsö med jättelika stenstatyer (moai) tillhör Chile?",
        "a": [
          "Påskön",
          "Galápagos",
          "Tahiti",
          "Fiji"
        ],
        "explain": "Påskön ligger 3 700 kilometer väster om Chiles fastland mitt ute i Stilla havet."
      },
      {
        "id": "q50_santiago_job1",
        "city": "santiago",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Santiago?",
        "a": [
          "Chile",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Santiago ligger i Chile (Sydamerika), där man talar spanska och använder valutan Chilensk peso (CLP)."
      },
      {
        "id": "q50_santiago_job2",
        "city": "santiago",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Chile (Santiago)?",
        "a": [
          "Chilensk peso",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Chile betalar man med Chilensk peso (CLP). Chile är över 4 300 km långt från norr till söder men i snitt bara 177 km brett."
      },
      {
        "id": "q50_santiago_job_s1",
        "city": "santiago",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd öknen i norra Chile är världens torraste icke-polära öken?",
        "a": [
          "Atacamaöknen",
          "Sahara",
          "Gobiöknen",
          "Mojaveöknen"
        ],
        "explain": "I delar av Atacamaöknen har det inte fallit mätbart regn på århundraden, och himlen är perfekt för stjärnobservatorier."
      },
      {
        "id": "q50_santiago_job_s2",
        "city": "santiago",
        "place": "job",
        "t": "mc",
        "q": "Vilken chilensk poet fick Nobelpriset i litteratur 1971 och hade ett hus i Bellavista?",
        "a": [
          "Pablo Neruda",
          "Gabriel García Márquez",
          "Jorge Luis Borges",
          "Octavio Paz"
        ],
        "explain": "Pablo Nerudas lekfulla hus \"La Chascona\" i Santiago är idag ett populärt museum."
      },
      {
        "id": "q50_santiago_job_s3",
        "city": "santiago",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd stillahavsö med jättelika stenstatyer (moai) tillhör Chile?",
        "a": [
          "Påskön",
          "Galápagos",
          "Tahiti",
          "Fiji"
        ],
        "explain": "Påskön ligger 3 700 kilometer väster om Chiles fastland mitt ute i Stilla havet."
      }
    ],
    "tavern": {
      "name": "Kafé i Lastarria",
      "drink": "empanada de pino",
      "drinkCost": 110
    },
    "facts": [
      "Santiago",
      "19,6 miljoner",
      "Spanska",
      "Chilensk peso (CLP)",
      "Chile är över 4 300 km långt från norr till söder men i snitt bara 177 km brett.",
      "Chile är världens största kopparproducent."
    ]
  },
  {
    "key": "bogota",
    "iso": "co",
    "country": "Colombia",
    "region": "Sydamerika",
    "name": "Bogotá",
    "code": "BOG",
    "stampColor": "#6b3e1b",
    "stampShape": "round",
    "stampRot": -3,
    "cityObj": {
      "name": "Bogotá",
      "country": "Colombia",
      "region": "Sydamerika",
      "lat": 4.71,
      "lon": -74.07,
      "tagline": "Höglandsstad bland molnen, guldmuseum och kaffe",
      "skyline": "assets/cities/bogota.jpg",
      "hotel": {
        "name": "Posada La Candelaria",
        "price": 360
      },
      "highlights": [
        "bogota_s1",
        "bogota_s2",
        "bogota_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "kaffe_co",
        "smaragd_co"
      ],
      "signature": {
        "name": "Kaffebar i La Candelaria",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kaffebar i La Candelaria i Bogotá för colombianskt kaffe & arepa och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Bogotá",
          "employer": "Bogotás Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Bogotá och svara på frågor om Colombia."
        },
        {
          "title": "Receptionist på Posada La Candelaria",
          "employer": "Posada La Candelaria",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Posada La Candelaria — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Bogotá",
          "employer": "Bogotás Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Bogotá."
        }
      ]
    },
    "placesObj": {
      "bogota_s1": {
        "name": "Guldmuseet (Museo del Oro)",
        "photo": "assets/cities/bogota.jpg",
        "fact": "Världens största samling av förkolumbianskt guld — över 55 000 gnistrande föremål.",
        "hours": 2
      },
      "bogota_s2": {
        "name": "Monserrate",
        "photo": "assets/cities/bogota.jpg",
        "fact": "3 152 meter hög bergstopp rakt ovanför staden med en vit pilgrimskyrka och linbana.",
        "hours": 2
      },
      "bogota_s3": {
        "name": "La Candelaria",
        "photo": "assets/cities/bogota.jpg",
        "fact": "Färgstark gammal stadsdel med gatukonst, kullersten och Botero-museet.",
        "hours": 2
      }
    },
    "souvDefs": {
      "kaffe_co": {
        "name": "Colombianskt höglandskaffe",
        "origin": "bogota",
        "basePrice": 230,
        "kind": "souvenir",
        "desc": "Världsberömda handplockade arabicabönor.",
        "photo": "assets/souvenirs/kaffebonor_rio.jpg"
      },
      "smaragd_co": {
        "name": "Smaragdgrönt hänge",
        "origin": "bogota",
        "basePrice": 440,
        "kind": "souvenir",
        "desc": "Inspirerat av Colombias berömda gruvor.",
        "photo": "assets/souvenirs/jadestatyett.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_bogota_s1_1",
        "city": "bogota",
        "place": "bogota_s1",
        "t": "mc",
        "q": "Vilken berömd myt om en gyllene stad föddes kring Muisca-folkets guldoffer nära Bogotá?",
        "a": [
          "El Dorado",
          "Atlantis",
          "Shangri-La",
          "Valhall"
        ],
        "explain": "El Dorado syftade ursprungligen på \"Den gyllene mannen\" — hövdingen som pudrades i guldstoft vid sjön Guatavita."
      },
      {
        "id": "q50_bogota_s2_1",
        "city": "bogota",
        "place": "bogota_s2",
        "t": "mc",
        "q": "På ungefär vilken hög höjd över havet ligger Colombias huvudstad Bogotá?",
        "a": [
          "2 640 meter",
          "400 meter",
          "1 100 meter",
          "4 800 meter"
        ],
        "explain": "Bogotá är en av världens högst belägna huvudstäder, med sval vårtemperatur året runt."
      },
      {
        "id": "q50_bogota_s3_1",
        "city": "bogota",
        "place": "bogota_s3",
        "t": "mc",
        "q": "Vilken världsberömd grön ädelsten är Colombia världens främsta producent av?",
        "a": [
          "Smaragd",
          "Rubin",
          "Diamant",
          "Opal"
        ],
        "explain": "Colombia står för en stor del av världens finaste djupgröna smaragder."
      },
      {
        "id": "q50_bogota_job1",
        "city": "bogota",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Bogotá?",
        "a": [
          "Colombia",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Bogotá ligger i Colombia (Sydamerika), där man talar spanska och använder valutan Colombiansk peso (COP)."
      },
      {
        "id": "q50_bogota_job2",
        "city": "bogota",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Colombia (Bogotá)?",
        "a": [
          "Colombiansk peso",
          "Euro",
          "Yen",
          "Amerikansk dollar"
        ],
        "explain": "I Colombia betalar man med Colombiansk peso (COP). Colombia är det enda landet i Sydamerika med kust mot både Stilla havet och Karibiska havet."
      },
      {
        "id": "q50_bogota_job_s1",
        "city": "bogota",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd myt om en gyllene stad föddes kring Muisca-folkets guldoffer nära Bogotá?",
        "a": [
          "El Dorado",
          "Atlantis",
          "Shangri-La",
          "Valhall"
        ],
        "explain": "El Dorado syftade ursprungligen på \"Den gyllene mannen\" — hövdingen som pudrades i guldstoft vid sjön Guatavita."
      },
      {
        "id": "q50_bogota_job_s2",
        "city": "bogota",
        "place": "job",
        "t": "mc",
        "q": "På ungefär vilken hög höjd över havet ligger Colombias huvudstad Bogotá?",
        "a": [
          "2 640 meter",
          "400 meter",
          "1 100 meter",
          "4 800 meter"
        ],
        "explain": "Bogotá är en av världens högst belägna huvudstäder, med sval vårtemperatur året runt."
      },
      {
        "id": "q50_bogota_job_s3",
        "city": "bogota",
        "place": "job",
        "t": "mc",
        "q": "Vilken världsberömd grön ädelsten är Colombia världens främsta producent av?",
        "a": [
          "Smaragd",
          "Rubin",
          "Diamant",
          "Opal"
        ],
        "explain": "Colombia står för en stor del av världens finaste djupgröna smaragder."
      }
    ],
    "tavern": {
      "name": "Kaffebar i La Candelaria",
      "drink": "colombianskt kaffe & arepa",
      "drinkCost": 110
    },
    "facts": [
      "Bogotá",
      "52 miljoner",
      "Spanska",
      "Colombiansk peso (COP)",
      "Colombia är det enda landet i Sydamerika med kust mot både Stilla havet och Karibiska havet.",
      "Författaren Gabriel García Márquez (Hundra år av ensamhet) föddes i Colombia."
    ]
  },
  {
    "key": "quito",
    "iso": "ec",
    "country": "Ecuador",
    "region": "Sydamerika",
    "name": "Quito",
    "code": "UIO",
    "stampColor": "#5b2870",
    "stampShape": "oval",
    "stampRot": 4,
    "cityObj": {
      "name": "Quito",
      "country": "Ecuador",
      "region": "Sydamerika",
      "lat": -0.18,
      "lon": -78.47,
      "tagline": "Ekvatorns vackra bergstad bland vulkaner",
      "skyline": "assets/cities/quito.jpg",
      "hotel": {
        "name": "Hotel Centro Histórico",
        "price": 340
      },
      "highlights": [
        "quito_s1",
        "quito_s2",
        "quito_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "hatt_ec",
        "kakao_ec"
      ],
      "signature": {
        "name": "Kafé på Plaza Grande",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kafé på Plaza Grande i Quito för varm choklad & empanada och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Quito",
          "employer": "Quitos Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Quito och svara på frågor om Ecuador."
        },
        {
          "title": "Receptionist på Hotel Centro Histórico",
          "employer": "Hotel Centro Histórico",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Hotel Centro Histórico — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Quito",
          "employer": "Quitos Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Quito."
        }
      ]
    },
    "placesObj": {
      "quito_s1": {
        "name": "Mitad del Mundo (Ekvatorn)",
        "photo": "assets/cities/quito.jpg",
        "fact": "Monumentet strax norr om Quito där du kan stå med en fot på norra och en på södra halvklotet.",
        "hours": 2
      },
      "quito_s2": {
        "name": "Quitos historiska centrum",
        "photo": "assets/cities/quito.jpg",
        "fact": "En av de två allra första platserna som sattes upp på UNESCO:s världsarvslista år 1978.",
        "hours": 2
      },
      "quito_s3": {
        "name": "El Panecillo & Vulkanen Pichincha",
        "photo": "assets/cities/quito.jpg",
        "fact": "Höjd mitt i staden krönt av en bevingad madonna med utsikt mot aktiva vulkaner.",
        "hours": 2
      }
    },
    "souvDefs": {
      "hatt_ec": {
        "name": "Äkta ecuadoriansk Montecristi-hatt",
        "origin": "quito",
        "basePrice": 330,
        "kind": "souvenir",
        "desc": "Originalet bakom den berömda panamahatten.",
        "photo": "assets/souvenirs/sombrero.jpg"
      },
      "kakao_ec": {
        "name": "Mörk ecuadoriansk choklad",
        "origin": "quito",
        "basePrice": 200,
        "kind": "souvenir",
        "desc": "Gjord på sällsynt Arriba-kakao.",
        "photo": "assets/souvenirs/spettkaka.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_quito_s1_1",
        "city": "quito",
        "place": "quito_s1",
        "t": "mc",
        "q": "Vad betyder landets namn \"Ecuador\" på spanska?",
        "a": [
          "Ekvatorn",
          "Vulkanerna",
          "Höglandet",
          "Smaragden"
        ],
        "explain": "Landet fick sitt namn eftersom jordens ekvator skär rakt igenom det strax norr om Quito."
      },
      {
        "id": "q50_quito_s2_1",
        "city": "quito",
        "place": "quito_s2",
        "t": "mc",
        "q": "Vilken berömd naturvetenskaplig ögrupp 1 000 km västerut tillhör Ecuador?",
        "a": [
          "Galápagosöarna",
          "Påskön",
          "Falklandsöarna",
          "Azorerna"
        ],
        "explain": "Charles Darwins besök på Galápagosöarna 1835 lade grunden för boken \"Om arternas uppkomst\"."
      },
      {
        "id": "q50_quito_s3_1",
        "city": "quito",
        "place": "quito_s3",
        "t": "mc",
        "q": "Vilken känd hatt flätas egentligen i Ecuador, trots sitt namn?",
        "a": [
          "Panamahatten",
          "Sombreron",
          "Baskern",
          "Cylinderhatten"
        ],
        "explain": "Hattarna tillverkades i Ecuador men såldes i stora mängder vid Panamakanalen och fick därför namnet panamahatt!"
      },
      {
        "id": "q50_quito_job1",
        "city": "quito",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Quito?",
        "a": [
          "Ecuador",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Quito ligger i Ecuador (Sydamerika), där man talar spanska & kichwa och använder valutan Amerikansk dollar (USD)."
      },
      {
        "id": "q50_quito_job2",
        "city": "quito",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Ecuador (Quito)?",
        "a": [
          "Amerikansk dollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I Ecuador betalar man med Amerikansk dollar (USD). Quito ligger på 2 850 meters höjd och är världens näst högst belägna huvudstad."
      },
      {
        "id": "q50_quito_job_s1",
        "city": "quito",
        "place": "job",
        "t": "mc",
        "q": "Vad betyder landets namn \"Ecuador\" på spanska?",
        "a": [
          "Ekvatorn",
          "Vulkanerna",
          "Höglandet",
          "Smaragden"
        ],
        "explain": "Landet fick sitt namn eftersom jordens ekvator skär rakt igenom det strax norr om Quito."
      },
      {
        "id": "q50_quito_job_s2",
        "city": "quito",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd naturvetenskaplig ögrupp 1 000 km västerut tillhör Ecuador?",
        "a": [
          "Galápagosöarna",
          "Påskön",
          "Falklandsöarna",
          "Azorerna"
        ],
        "explain": "Charles Darwins besök på Galápagosöarna 1835 lade grunden för boken \"Om arternas uppkomst\"."
      },
      {
        "id": "q50_quito_job_s3",
        "city": "quito",
        "place": "job",
        "t": "mc",
        "q": "Vilken känd hatt flätas egentligen i Ecuador, trots sitt namn?",
        "a": [
          "Panamahatten",
          "Sombreron",
          "Baskern",
          "Cylinderhatten"
        ],
        "explain": "Hattarna tillverkades i Ecuador men såldes i stora mängder vid Panamakanalen och fick därför namnet panamahatt!"
      }
    ],
    "tavern": {
      "name": "Kafé på Plaza Grande",
      "drink": "varm choklad & empanada",
      "drinkCost": 110
    },
    "facts": [
      "Quito",
      "18 miljoner",
      "Spanska & kichwa",
      "Amerikansk dollar (USD)",
      "Quito ligger på 2 850 meters höjd och är världens näst högst belägna huvudstad.",
      "Ecuador har en av världens högsta biologiska mångfalder per kvadratkilometer."
    ]
  },
  {
    "key": "melbourne",
    "iso": "au",
    "country": "Australien",
    "region": "Oceanien",
    "name": "Melbourne",
    "code": "MEL",
    "stampColor": "#8c3c14",
    "stampShape": "rect",
    "stampRot": -2,
    "cityObj": {
      "name": "Melbourne",
      "country": "Australien",
      "region": "Oceanien",
      "lat": -37.81,
      "lon": 144.96,
      "tagline": "Kafégränder, spårvagnar och sportens huvudstad",
      "skyline": "assets/cities/melbourne.jpg",
      "hotel": {
        "name": "Flinders Lane Hotel",
        "price": 590
      },
      "highlights": [
        "melbourne_s1",
        "melbourne_s2",
        "melbourne_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "bumerang_mel",
        "kaffe_mel"
      ],
      "signature": {
        "name": "Grändkafé i Degraves Street",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Grändkafé i Degraves Street i Melbourne för flat white-kaffe och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Melbourne",
          "employer": "Melbournes Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Melbourne och svara på frågor om Australien."
        },
        {
          "title": "Receptionist på Flinders Lane Hotel",
          "employer": "Flinders Lane Hotel",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Flinders Lane Hotel — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Melbourne",
          "employer": "Melbournes Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Melbourne."
        }
      ]
    },
    "placesObj": {
      "melbourne_s1": {
        "name": "Flinders Street Station",
        "photo": "assets/cities/melbourne.jpg",
        "fact": "Ikonisk gul järnvägsstation från 1910 med kopparkupol och berömda klockor vid huvudentrén.",
        "hours": 2
      },
      "melbourne_s2": {
        "name": "Melbourne Cricket Ground (MCG)",
        "photo": "assets/cities/melbourne.jpg",
        "fact": "Enorm sportarena som tar 100 000 åskådare och var huvudarena vid OS 1956.",
        "hours": 2
      },
      "melbourne_s3": {
        "name": "Hosier Lane & Great Ocean Road",
        "photo": "assets/cities/melbourne.jpg",
        "fact": "Kullerstensgränder fyllda av gatukonst och kustvägen mot kalkstenspelarna De tolv apostlarna.",
        "hours": 2
      }
    },
    "souvDefs": {
      "bumerang_mel": {
        "name": "Målad australisk bumerang",
        "origin": "melbourne",
        "basePrice": 270,
        "kind": "souvenir",
        "desc": "Traditionell träbumerang från Victoria.",
        "photo": "assets/souvenirs/bumerang.jpg"
      },
      "kaffe_mel": {
        "name": "Melbourne-rostat kaffe",
        "origin": "melbourne",
        "basePrice": 220,
        "kind": "souvenir",
        "desc": "Kaféhuvudstadens egen flat white-blandning.",
        "photo": "assets/souvenirs/kaffebonor_rio.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_melbourne_s1_1",
        "city": "melbourne",
        "place": "melbourne_s1",
        "t": "mc",
        "q": "Vad är Melbournes spårvagnsnät berömt för i hela världen?",
        "a": [
          "Det är världens största ännu verksamma spårvagnsnät",
          "Det körs helt med ånga",
          "Det går under vattnet",
          "Spårvagnarna har bara ett hjul"
        ],
        "explain": "Melbournes spårvagnar rullar på över 250 kilometer spår genom staden."
      },
      {
        "id": "q50_melbourne_s2_1",
        "city": "melbourne",
        "place": "melbourne_s2",
        "t": "mc",
        "q": "Vilken stor tennisturnering i Grand Slam spelas varje januari i Melbourne?",
        "a": [
          "Australian Open",
          "Wimbledon",
          "Roland-Garros",
          "US Open"
        ],
        "explain": "Australian Open drar varje sommar (januari på södra halvklotet) hundratusentals åskådare."
      },
      {
        "id": "q50_melbourne_s3_1",
        "city": "melbourne",
        "place": "melbourne_s3",
        "t": "mc",
        "q": "Vilken stad är Australiens egentliga huvudstad (inte Sydney och inte Melbourne)?",
        "a": [
          "Canberra",
          "Perth",
          "Brisbane",
          "Adelaide"
        ],
        "explain": "Canberra byggdes som en kompromiss mitt emellan rivalerna Sydney och Melbourne!"
      },
      {
        "id": "q50_melbourne_job1",
        "city": "melbourne",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Melbourne?",
        "a": [
          "Australien",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Melbourne ligger i Australien (Oceanien), där man talar engelska och använder valutan Australisk dollar (AUD)."
      },
      {
        "id": "q50_melbourne_job2",
        "city": "melbourne",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Australien (Melbourne)?",
        "a": [
          "Australisk dollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I Australien betalar man med Australisk dollar (AUD). Melbourne var Australiens tillfälliga huvudstad mellan 1901 och 1927."
      },
      {
        "id": "q50_melbourne_job_s1",
        "city": "melbourne",
        "place": "job",
        "t": "mc",
        "q": "Vad är Melbournes spårvagnsnät berömt för i hela världen?",
        "a": [
          "Det är världens största ännu verksamma spårvagnsnät",
          "Det körs helt med ånga",
          "Det går under vattnet",
          "Spårvagnarna har bara ett hjul"
        ],
        "explain": "Melbournes spårvagnar rullar på över 250 kilometer spår genom staden."
      },
      {
        "id": "q50_melbourne_job_s2",
        "city": "melbourne",
        "place": "job",
        "t": "mc",
        "q": "Vilken stor tennisturnering i Grand Slam spelas varje januari i Melbourne?",
        "a": [
          "Australian Open",
          "Wimbledon",
          "Roland-Garros",
          "US Open"
        ],
        "explain": "Australian Open drar varje sommar (januari på södra halvklotet) hundratusentals åskådare."
      },
      {
        "id": "q50_melbourne_job_s3",
        "city": "melbourne",
        "place": "job",
        "t": "mc",
        "q": "Vilken stad är Australiens egentliga huvudstad (inte Sydney och inte Melbourne)?",
        "a": [
          "Canberra",
          "Perth",
          "Brisbane",
          "Adelaide"
        ],
        "explain": "Canberra byggdes som en kompromiss mitt emellan rivalerna Sydney och Melbourne!"
      }
    ],
    "tavern": {
      "name": "Grändkafé i Degraves Street",
      "drink": "flat white-kaffe",
      "drinkCost": 110
    },
    "facts": [
      "Canberra",
      "26,6 miljoner",
      "Engelska",
      "Australisk dollar (AUD)",
      "Melbourne var Australiens tillfälliga huvudstad mellan 1901 och 1927.",
      "Kaffedrycken Flat White har sina rötter i Australien och Nya Zeeland."
    ]
  },
  {
    "key": "auckland",
    "iso": "nz",
    "country": "Nya Zeeland",
    "region": "Oceanien",
    "name": "Auckland",
    "code": "AKL",
    "stampColor": "#7a2222",
    "stampShape": "round",
    "stampRot": 5,
    "cityObj": {
      "name": "Auckland",
      "country": "Nya Zeeland",
      "region": "Oceanien",
      "lat": -36.85,
      "lon": 174.76,
      "tagline": "Seglens stad byggd på femtio vilande vulkankäglor",
      "skyline": "assets/cities/auckland.jpg",
      "hotel": {
        "name": "Viaduct Harbour Inn",
        "price": 580
      },
      "highlights": [
        "auckland_s1",
        "auckland_s2",
        "auckland_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "pounamu",
        "ull_nz"
      ],
      "signature": {
        "name": "Hamnpub vid Waitemata",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Hamnpub vid Waitemata i Auckland för fish & chips & kiwi-läsk och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Auckland",
          "employer": "Aucklands Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Auckland och svara på frågor om Nya Zeeland."
        },
        {
          "title": "Receptionist på Viaduct Harbour Inn",
          "employer": "Viaduct Harbour Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Viaduct Harbour Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Auckland",
          "employer": "Aucklands Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Auckland."
        }
      ]
    },
    "placesObj": {
      "auckland_s1": {
        "name": "Sky Tower",
        "photo": "assets/cities/auckland.jpg",
        "fact": "328 meter högt utsiktstorn på södra halvklotet där våghalsar kan hoppa SkyJump.",
        "hours": 2
      },
      "auckland_s2": {
        "name": "Mount Eden (Maungawhau)",
        "photo": "assets/cities/auckland.jpg",
        "fact": "Grön vulkankrater mitt i staden med 360-graders utsikt över två världshav.",
        "hours": 2
      },
      "auckland_s3": {
        "name": "Auckland War Memorial Museum",
        "photo": "assets/cities/auckland.jpg",
        "fact": "Visar maorifolkets krigskanoter (waka), sniderier och Nya Zeelands naturhistoria.",
        "hours": 2
      }
    },
    "souvDefs": {
      "pounamu": {
        "name": "Grön Pounamu-jade (Maori)",
        "origin": "auckland",
        "basePrice": 410,
        "kind": "souvenir",
        "desc": "Traditionellt snidat lyckosmycke från Nya Zeeland.",
        "photo": "assets/souvenirs/jadestatyett.jpg"
      },
      "ull_nz": {
        "name": "Merinoull-halsduk",
        "origin": "auckland",
        "basePrice": 340,
        "kind": "souvenir",
        "desc": "Mjuk ull från Nya Zeelands gröna kullar.",
        "photo": "assets/souvenirs/sjal.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_auckland_s1_1",
        "city": "auckland",
        "place": "auckland_s1",
        "t": "mc",
        "q": "Vilket smeknamn har Auckland fått på grund av alla sina småbåtshamnar?",
        "a": [
          "City of Sails",
          "City of Bridges",
          "City of Gold",
          "City of Fog"
        ],
        "explain": "Auckland har fler båtar per capita än nästan någon annan storstad i världen."
      },
      {
        "id": "q50_auckland_s2_1",
        "city": "auckland",
        "place": "auckland_s2",
        "t": "mc",
        "q": "Hur många slocknade eller vilande vulkankäglor ligger under och kring Auckland?",
        "a": [
          "Omkring 50 stycken",
          "En enda",
          "Tre stycken",
          "Inga alls"
        ],
        "explain": "Auckland Volcanic Field består av ett femtiotal små vulkankullar som idag är gröna stadsparker."
      },
      {
        "id": "q50_auckland_s3_1",
        "city": "auckland",
        "place": "auckland_s3",
        "t": "mc",
        "q": "Vad heter den berömda ceremoniella dansen från Nya Zeelands ursprungsfolk maori?",
        "a": [
          "Haka",
          "Tango",
          "Sirtaki",
          "Flamenco"
        ],
        "explain": "Hakan är världskänd genom rugbylandslaget All Blacks men används även vid välkomnande och högtider."
      },
      {
        "id": "q50_auckland_job1",
        "city": "auckland",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Auckland?",
        "a": [
          "Nya Zeeland",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Auckland ligger i Nya Zeeland (Oceanien), där man talar engelska & maori och använder valutan Nyzeeländsk dollar (NZD)."
      },
      {
        "id": "q50_auckland_job2",
        "city": "auckland",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Nya Zeeland (Auckland)?",
        "a": [
          "Nyzeeländsk dollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I Nya Zeeland betalar man med Nyzeeländsk dollar (NZD). Nya Zeeland var det första landet i världen som införde kvinnlig rösträtt (1893)."
      },
      {
        "id": "q50_auckland_job_s1",
        "city": "auckland",
        "place": "job",
        "t": "mc",
        "q": "Vilket smeknamn har Auckland fått på grund av alla sina småbåtshamnar?",
        "a": [
          "City of Sails",
          "City of Bridges",
          "City of Gold",
          "City of Fog"
        ],
        "explain": "Auckland har fler båtar per capita än nästan någon annan storstad i världen."
      },
      {
        "id": "q50_auckland_job_s2",
        "city": "auckland",
        "place": "job",
        "t": "mc",
        "q": "Hur många slocknade eller vilande vulkankäglor ligger under och kring Auckland?",
        "a": [
          "Omkring 50 stycken",
          "En enda",
          "Tre stycken",
          "Inga alls"
        ],
        "explain": "Auckland Volcanic Field består av ett femtiotal små vulkankullar som idag är gröna stadsparker."
      },
      {
        "id": "q50_auckland_job_s3",
        "city": "auckland",
        "place": "job",
        "t": "mc",
        "q": "Vad heter den berömda ceremoniella dansen från Nya Zeelands ursprungsfolk maori?",
        "a": [
          "Haka",
          "Tango",
          "Sirtaki",
          "Flamenco"
        ],
        "explain": "Hakan är världskänd genom rugbylandslaget All Blacks men används även vid välkomnande och högtider."
      }
    ],
    "tavern": {
      "name": "Hamnpub vid Waitemata",
      "drink": "fish & chips & kiwi-läsk",
      "drinkCost": 110
    },
    "facts": [
      "Wellington",
      "5,2 miljoner",
      "Engelska & maori",
      "Nyzeeländsk dollar (NZD)",
      "Nya Zeeland var det första landet i världen som införde kvinnlig rösträtt (1893).",
      "Landets maorinamn är Aotearoa, \"Det långa vita molnets land\"."
    ]
  },
  {
    "key": "wellington",
    "iso": "nz",
    "country": "Nya Zeeland",
    "region": "Oceanien",
    "name": "Wellington",
    "code": "WLG",
    "stampColor": "#1d4f7a",
    "stampShape": "oval",
    "stampRot": -1,
    "cityObj": {
      "name": "Wellington",
      "country": "Nya Zeeland",
      "region": "Oceanien",
      "lat": -41.29,
      "lon": 174.78,
      "tagline": "Världens sydligaste huvudstad vid Cooksundet",
      "skyline": "assets/cities/wellington.jpg",
      "hotel": {
        "name": "Cuba Street Boutique Inn",
        "price": 560
      },
      "highlights": [
        "wellington_s1",
        "wellington_s2",
        "wellington_s3"
      ],
      "extras": [],
      "wonders": [],
      "souvenirs": [
        "kiwi_nz",
        "honung_nz"
      ],
      "signature": {
        "name": "Kafé på Cuba Street",
        "hours": 2,
        "cost": 120,
        "kind": "tip",
        "desc": "Stanna till på Kafé på Cuba Street i Wellington för flat white & paj och heta restips."
      },
      "jobs": [
        {
          "title": "Lokalguide i Wellington",
          "employer": "Wellingtons Turistbyrå",
          "hours": 4,
          "pay": 720,
          "tag": "DAGSPASS",
          "isSignature": true,
          "adText": "Visa nyfikna resenärer runt bland sevärdheterna i Wellington och svara på frågor om Nya Zeeland."
        },
        {
          "title": "Receptionist på Cuba Street Boutique Inn",
          "employer": "Cuba Street Boutique Inn",
          "hours": 6,
          "pay": 980,
          "tag": "HELPass",
          "adText": "Hjälp gäster från hela världen att checka in på Cuba Street Boutique Inn — bra dricks och kontant lön!"
        },
        {
          "title": "Praktikpass i Wellington",
          "employer": "Wellingtons Handelskontor",
          "hours": 4,
          "pay": 840,
          "tag": "PRAKTIKPASS",
          "adText": "Praktiskt uppdrag mitt i Wellington."
        }
      ]
    },
    "placesObj": {
      "wellington_s1": {
        "name": "Te Papa Tongarewa",
        "photo": "assets/cities/wellington.jpg",
        "fact": "Nya Zeelands hyllade nationalmuseum med allt från jättebläckfiskar till jordbävningssimulator.",
        "hours": 2
      },
      "wellington_s2": {
        "name": "Wellington Cable Car",
        "photo": "assets/cities/wellington.jpg",
        "fact": "Röd bergbana från 1902 som klättrar från centrum upp till botaniska trädgården.",
        "hours": 2
      },
      "wellington_s3": {
        "name": "Cooksundet & Oriental Bay",
        "photo": "assets/cities/wellington.jpg",
        "fact": "Blåsigt sund som skiljer Nya Zeelands Nordö från Sydön.",
        "hours": 2
      }
    },
    "souvDefs": {
      "kiwi_nz": {
        "name": "Snidad kiwifågel i trä",
        "origin": "wellington",
        "basePrice": 250,
        "kind": "souvenir",
        "desc": "Nya Zeelands berömda vinglösa nationalfågel.",
        "photo": "assets/souvenirs/dalahast.jpg"
      },
      "honung_nz": {
        "name": "Äkta Manukahonung",
        "origin": "wellington",
        "basePrice": 320,
        "kind": "souvenir",
        "desc": "Berömd guldgul honung från Nya Zeeland.",
        "photo": "assets/souvenirs/olivolja.jpg"
      }
    },
    "qs": [
      {
        "id": "q50_wellington_s1_1",
        "city": "wellington",
        "place": "wellington_s1",
        "t": "mc",
        "q": "Vilket geografiskt världsrekord innehar staden Wellington?",
        "a": [
          "Världens sydligaste självständiga huvudstad",
          "Världens regnigaste stad",
          "Världens kallaste stad",
          "Världens äldsta stad"
        ],
        "explain": "På 41°17’ sydlig bredd ligger Wellington ännu längre söderut än både Buenos Aires och Canberra."
      },
      {
        "id": "q50_wellington_s2_1",
        "city": "wellington",
        "place": "wellington_s2",
        "t": "mc",
        "q": "Vilken berömd filmtrilogi spelades in runt Wellington och i Weta Workshops filmstudior?",
        "a": [
          "Sagan om ringen",
          "Star Wars",
          "Harry Potter",
          "Indiana Jones"
        ],
        "explain": "Regissören Peter Jackson byggde upp en hel filmvärld i förorten Miramar, ofta kallad \"Wellywood\"."
      },
      {
        "id": "q50_wellington_s3_1",
        "city": "wellington",
        "place": "wellington_s3",
        "t": "mc",
        "q": "Vilken brittisk upptäcktsresande har gett namn åt sundet utanför Wellington?",
        "a": [
          "James Cook",
          "Francis Drake",
          "Ernest Shackleton",
          "Robert Scott"
        ],
        "explain": "Kapten James Cook kartlade Nya Zeelands kuster på sin första resa med HMS Endeavour 1769–1770."
      },
      {
        "id": "q50_wellington_job1",
        "city": "wellington",
        "place": "job",
        "t": "mc",
        "q": "I vilket land ligger staden Wellington?",
        "a": [
          "Nya Zeeland",
          "Brasilien",
          "Japan",
          "Egypten"
        ],
        "explain": "Wellington ligger i Nya Zeeland (Oceanien), där man talar engelska & maori och använder valutan Nyzeeländsk dollar (NZD)."
      },
      {
        "id": "q50_wellington_job2",
        "city": "wellington",
        "place": "job",
        "t": "mc",
        "q": "Vilken valuta används i Nya Zeeland (Wellington)?",
        "a": [
          "Nyzeeländsk dollar",
          "Euro",
          "Yen",
          "Schweizisk franc"
        ],
        "explain": "I Nya Zeeland betalar man med Nyzeeländsk dollar (NZD). Wellington kallas ofta \"Windy Wellington\" på grund av vindarna genom Cooksundet."
      },
      {
        "id": "q50_wellington_job_s1",
        "city": "wellington",
        "place": "job",
        "t": "mc",
        "q": "Vilket geografiskt världsrekord innehar staden Wellington?",
        "a": [
          "Världens sydligaste självständiga huvudstad",
          "Världens regnigaste stad",
          "Världens kallaste stad",
          "Världens äldsta stad"
        ],
        "explain": "På 41°17’ sydlig bredd ligger Wellington ännu längre söderut än både Buenos Aires och Canberra."
      },
      {
        "id": "q50_wellington_job_s2",
        "city": "wellington",
        "place": "job",
        "t": "mc",
        "q": "Vilken berömd filmtrilogi spelades in runt Wellington och i Weta Workshops filmstudior?",
        "a": [
          "Sagan om ringen",
          "Star Wars",
          "Harry Potter",
          "Indiana Jones"
        ],
        "explain": "Regissören Peter Jackson byggde upp en hel filmvärld i förorten Miramar, ofta kallad \"Wellywood\"."
      },
      {
        "id": "q50_wellington_job_s3",
        "city": "wellington",
        "place": "job",
        "t": "mc",
        "q": "Vilken brittisk upptäcktsresande har gett namn åt sundet utanför Wellington?",
        "a": [
          "James Cook",
          "Francis Drake",
          "Ernest Shackleton",
          "Robert Scott"
        ],
        "explain": "Kapten James Cook kartlade Nya Zeelands kuster på sin första resa med HMS Endeavour 1769–1770."
      }
    ],
    "tavern": {
      "name": "Kafé på Cuba Street",
      "drink": "flat white & paj",
      "drinkCost": 110
    },
    "facts": [
      "Wellington",
      "5,2 miljoner",
      "Engelska & maori",
      "Nyzeeländsk dollar (NZD)",
      "Wellington kallas ofta \"Windy Wellington\" på grund av vindarna genom Cooksundet.",
      "Nya Zeeland har inga vilda landlevande ormar."
    ]
  }
];

  EXTRA_CITIES.forEach(item => {
    // Säkra öppettider på signaturaktiviteter så inga städer blir permanent STÄNGDA
    if (item.cityObj && item.cityObj.signature) {
      if (item.cityObj.signature.openFrom === undefined) item.cityObj.signature.openFrom = 8;
      if (item.cityObj.signature.openUntil === undefined) item.cityObj.signature.openUntil = 22;
    }
    if (!W.cities[item.key]) {
      W.cities[item.key] = item.cityObj;
    }
    // Säkra city och fee på alla sevärdheter
    Object.entries(item.placesObj || {}).forEach(([pk, pl]) => {
      W.places[pk] = { city: item.key, fee: 0, ...pl };
    });
    // Säkra .price från .basePrice så marknaden aldrig visar NaN kr!
    Object.entries(item.souvDefs || {}).forEach(([sk, sv]) => {
      const safePrice = Number(sv.price !== undefined ? sv.price : sv.basePrice) || 250;
      W.souvenirs[sk] = { ...sv, price: safePrice };
    });
    if (!W.taverns) W.taverns = {};
    W.taverns[item.key] = item.tavern;
    window.GT_EXTRA_STAMPS[item.key] = {
      code: item.code,
      color: item.stampColor,
      shape: item.stampShape,
      rot: item.stampRot
    };
    window.GT_CITY_ISO[item.key] = item.iso;

    item.qs.forEach(q => Q.push(q));

    // Registrera landsfakta & historietidslinje under stadsnyckeln (item.key) i exakt samma format som game.js läser!
    if (!window.GT_COUNTRY_FACTS[item.key]) {
      window.GT_COUNTRY_FACTS[item.key] = {
        country: item.country,
        iso: item.iso,
        flag: 'assets/flags/' + item.iso + '.png',
        libraryName: `${item.name}s stadsbibliotek`,
        libraryPhoto: 'assets/photos/libraries/lib_stockholm.jpg',
        capital: item.facts[0] || item.name,
        population: item.facts[1] || 'Uppgift saknas',
        area: 'Se världsatlasen',
        language: item.facts[2] || 'Lokalt språk',
        currency: item.facts[3] || 'Lokal valuta',
        government: 'Självständig stat',
        timezone: 'Lokal tid',
        dish: (item.tavern && item.tavern.drink) ? item.tavern.drink : 'Lokal husmanskost',
        trivia: [item.facts[4], item.facts[5]].filter(Boolean)
      };
    }
    if (!window.GT_COUNTRY_HISTORY[item.key]) {
      const h0 = item.cityObj.highlights[0] && W.places[item.cityObj.highlights[0]];
      const h1 = item.cityObj.highlights[1] && W.places[item.cityObj.highlights[1]];
      window.GT_COUNTRY_HISTORY[item.key] = {
        map: '',
        timeline: [
          { id: `${item.key}_t1`, year: 'Historia', name: `${item.country}s bakgrund`, role: item.region, text: item.facts[4] || item.cityObj.tagline },
          { id: `${item.key}_t2`, year: 'Landmärke', name: h0 ? h0.name : item.name, role: item.name, text: h0 ? h0.fact : item.cityObj.tagline },
          { id: `${item.key}_t3`, year: 'Kulturarv', name: h1 ? h1.name : item.name, role: item.name, text: h1 ? h1.fact : item.cityObj.tagline },
          { id: `${item.key}_t4`, year: 'Idag', name: `${item.name} i nutid`, role: item.country, text: item.facts[5] || item.cityObj.tagline }
        ]
      };
    }
  });

  // Extra europeiska, asiatiska & amerikanska tåglinjer mellan de 50 nya städerna
  window.GT_EXTRA_TRAINS = {
    oslo: [{ to: 'stockholm', name: 'SJ Snabbtåg Oslo–Stockholm', hours: 5, price: 390 }, { to: 'kopenhamn', name: 'Skandinavien-expressen', hours: 7, price: 460 }],
    kopenhamn: [{ to: 'malmo', name: 'Öresundståget över bron', hours: 1, price: 140 }, { to: 'berlin', name: 'EuroCity mot Berlin Hbf', hours: 7, price: 450 }],
    berlin: [{ to: 'kopenhamn', name: 'EuroCity mot Köpenhamn', hours: 7, price: 450 }, { to: 'prag', name: 'Elbe-Expressen till Prag', hours: 4, price: 320 }, { to: 'amsterdam', name: 'InterCity Berlin–Amsterdam', hours: 6, price: 440 }],
    prag: [{ to: 'berlin', name: 'Elbe-Expressen mot Berlin', hours: 4, price: 320 }, { to: 'wien', name: 'Railjet Prag–Wien', hours: 4, price: 310 }],
    wien: [{ to: 'prag', name: 'Railjet Wien–Prag', hours: 4, price: 310 }, { to: 'zurich', name: 'Alpexressen till Zürich', hours: 8, price: 490 }],
    zurich: [{ to: 'wien', name: 'Alpexressen till Wien', hours: 8, price: 490 }, { to: 'paris', name: 'TGV Lyria till Paris', hours: 4, price: 460 }, { to: 'rom', name: 'Gotthard-expressen söderut', hours: 7, price: 480 }],
    amsterdam: [{ to: 'bryssel', name: 'Thalys till Bryssel', hours: 2, price: 290 }, { to: 'berlin', name: 'InterCity mot Berlin', hours: 6, price: 440 }],
    bryssel: [{ to: 'amsterdam', name: 'Thalys till Amsterdam', hours: 2, price: 290 }, { to: 'paris', name: 'Thalys till Paris Nord', hours: 2, price: 320 }, { to: 'london', name: 'Eurostar till London', hours: 2, price: 440 }],
    madrid: [{ to: 'lissabon', name: 'Lusitania-nattåget till Lissabon', hours: 9, price: 430 }, { to: 'paris', name: 'AVE & TGV norrut till Paris', hours: 10, price: 590 }],
    lissabon: [{ to: 'madrid', name: 'Lusitania-nattåget till Madrid', hours: 9, price: 430 }],
    kyoto: [{ to: 'tokyo', name: 'Shinkansen Nozomi till Tokyo', hours: 2, price: 390 }],
    toronto: [{ to: 'newyork', name: 'Maple Leaf Express till New York', hours: 11, price: 540 }, { to: 'chicago', name: 'Great Lakes Express till Chicago', hours: 9, price: 490 }],
    chicago: [{ to: 'toronto', name: 'Great Lakes Express till Toronto', hours: 9, price: 490 }, { to: 'newyork', name: 'Lake Shore Limited till New York', hours: 16, price: 680 }],
    losangeles: [{ to: 'sanfrancisco', name: 'Coast Starlight längs Stilla havet', hours: 10, price: 460 }],
    melbourne: [{ to: 'sydney', name: 'XPT Express Melbourne–Sydney', hours: 10, price: 490 }]
  };
})();
