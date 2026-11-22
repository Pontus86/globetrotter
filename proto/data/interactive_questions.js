// Globetrotter - Interaktiva BackPacker-frågor:
// Peka på 3D-kartan med landsgränser ('globe'), Para ihop ('match'),
// Ordna i rätt ordning ('order') och Bild-/Flaggfrågor ('image').

(function () {
  'use strict';

  const INTERACTIVE_POOL = [
    // =========================================================================
    // 1. PEKA UT PÅ KARTAN / 3D-JORDGLOBEN MED LANDSGRÄNSER (24 st)
    // =========================================================================
    {
      id: 'iq_globe_iceland', t: 'globe', region: 'Europa',
      q: 'Peka ut på kartan: Var ligger ölandet Island i Nordatlanten?',
      targetLat: 64.96, targetLon: -19.02, targetName: 'Island', startLat: 58, startLon: -5,
      explain: 'Island ligger precis söder om norra polcirkeln på den Mittatlantiska ryggen och har över 130 vulkaner och varma källor.'
    },
    {
      id: 'iq_globe_greece', t: 'globe', region: 'Europa',
      q: 'Peka ut på kartan: Var ligger Grekland och dess huvudstad Aten?',
      targetLat: 37.98, targetLon: 23.73, targetName: 'Aten, Grekland', startLat: 42, startLon: 16,
      explain: 'Grekland ligger längst söderut på Balkanhalvön vid Egeiska och Joniska havet, med över 6 000 öar och skär.'
    },
    {
      id: 'iq_globe_switzerland', t: 'globe', region: 'Europa',
      q: 'Peka ut på kartan: Var ligger alplandet Schweiz mitt i Europa?',
      targetLat: 46.82, targetLon: 8.23, targetName: 'Schweiz', startLat: 48, startLon: 10,
      explain: 'Schweiz omges av Frankrike, Tyskland, Österrike, Liechtenstein och Italien och har fyra officiella språk.'
    },
    {
      id: 'iq_globe_portugal', t: 'globe', region: 'Europa',
      q: 'Peka ut på kartan: Var ligger Portugal och huvudstaden Lissabon?',
      targetLat: 38.72, targetLon: -9.14, targetName: 'Lissabon, Portugal', startLat: 42, startLon: -2,
      explain: 'Lissabon är Västeuropas västligaste huvudstad på fastlandet och ligger där floden Tejo mynnar ut i Atlanten.'
    },
    {
      id: 'iq_globe_norway', t: 'globe', region: 'Europa',
      q: 'Peka ut på kartan: Var ligger Norges huvudstad Oslo?',
      targetLat: 59.91, targetLon: 10.75, targetName: 'Oslo, Norge', startLat: 60, startLon: 14,
      explain: 'Oslo ligger innerst i Oslofjorden i södra Norge, omgiven av skogsklädda åsar och fjäll.'
    },
    {
      id: 'iq_globe_ireland', t: 'globe', region: 'Europa',
      q: 'Peka ut på kartan: Var ligger "Den gröna ön" Irland?',
      targetLat: 53.35, targetLon: -6.26, targetName: 'Dublin, Irland', startLat: 54, startLon: -2,
      explain: 'Irland ligger väster om Storbritannien i Atlanten och får sin frodiga grönska av det milda, regnrika golfströmsklimatet.'
    },
    {
      id: 'iq_globe_madagascar', t: 'globe', region: 'Afrika',
      q: 'Peka ut på kartan: Var ligger världens fjärde största ö, Madagaskar?',
      targetLat: -18.88, targetLon: 47.51, targetName: 'Madagaskar', startLat: -15, startLon: 38,
      explain: 'Madagaskar ligger i Indiska oceanen utanför Moçambiques kust och har varit isolerad i miljontals år, vilket skapat unika djur som lemurer.'
    },
    {
      id: 'iq_globe_morocco', t: 'globe', region: 'Afrika',
      q: 'Peka ut på kartan: Var ligger Marocko vid nordvästra Afrikas kust?',
      targetLat: 33.97, targetLon: -6.85, targetName: 'Marocko', startLat: 28, startLon: 0,
      explain: 'Marocko skiljs från Spanien av det bara 14 kilometer smala Gibraltarsundet och rymmer både Atlasbergen och Saharaöknen.'
    },
    {
      id: 'iq_globe_kenya', t: 'globe', region: 'Afrika',
      q: 'Peka ut på kartan: Var ligger Kenya och huvudstaden Nairobi i Östafrika?',
      targetLat: -1.29, targetLon: 36.82, targetName: 'Nairobi, Kenya', startLat: 0, startLon: 32,
      explain: 'Ekvatorn skär rakt igenom Kenya, och Nairobi ligger på nästan 1 800 meters höjd med en egen nationalpark precis utanför stadskärnan.'
    },
    {
      id: 'iq_globe_egypt_suez', t: 'globe', region: 'Afrika',
      q: 'Peka ut på kartan: Var förbinder Suezkanalen Medelhavet med Röda havet?',
      targetLat: 30.58, targetLon: 32.27, targetName: 'Suezkanalen', startLat: 28, startLon: 30,
      explain: 'Suezkanalen öppnades 1869 i Egypten och kortade sjövägen mellan Europa och Asien med omkring 7 000 kilometer.'
    },
    {
      id: 'iq_globe_srilanka', t: 'globe', region: 'Asien',
      q: 'Peka ut på kartan: Var ligger te-ön Sri Lanka söder om Indien?',
      targetLat: 7.87, targetLon: 80.77, targetName: 'Sri Lanka', startLat: 15, startLon: 78,
      explain: 'Sri Lanka, tidigare känt som Ceylon, ligger som en droppe strax sydost om Indiens sydspets i Indiska oceanen.'
    },
    {
      id: 'iq_globe_korea', t: 'globe', region: 'Asien',
      q: 'Peka ut på kartan: Var ligger Sydkorea och huvudstaden Seoul?',
      targetLat: 37.57, targetLon: 126.98, targetName: 'Seoul, Sydkorea', startLat: 35, startLon: 124,
      explain: 'Sydkorea utgör den södra halvan av Koreahalvön mellan Gula havet och Japanska havet.'
    },
    {
      id: 'iq_globe_singapore', t: 'globe', region: 'Asien',
      q: 'Peka ut på kartan: Var ligger stadsstaten Singapore på Malackahalvöns sydspets?',
      targetLat: 1.35, targetLon: 103.82, targetName: 'Singapore', startLat: 6, startLon: 102,
      explain: 'Singapore ligger bara 137 kilometer norr om ekvatorn vid Malackasundet, en av världens mest trafikerade sjöfartsleder.'
    },
    {
      id: 'iq_globe_nepal', t: 'globe', region: 'Asien',
      q: 'Peka ut på kartan: Var ligger bergslandet Nepal i Himalaya?',
      targetLat: 28.39, targetLon: 84.12, targetName: 'Nepal', startLat: 28, startLon: 82,
      explain: 'Nepal kläms in mellan Indien och Kina (Tibet) och rymmer åtta av världens tio högsta berg, inklusive Mount Everest.'
    },
    {
      id: 'iq_globe_turkey', t: 'globe', region: 'Asien',
      q: 'Peka ut på kartan: Var ligger Bosporen där Europa och Asien möts i Turkiet?',
      targetLat: 41.01, targetLon: 28.98, targetName: 'Istanbul / Bosporen', startLat: 39, startLon: 32,
      explain: 'Det 30 kilometer långa Bosporensundet förbinder Svarta havet med Marmarasjön och delar Istanbul i en europeisk och en asiatisk del.'
    },
    {
      id: 'iq_globe_nz', t: 'globe', region: 'Oceanien',
      q: 'Peka ut på kartan: Var ligger Nya Zeeland i sydvästra Stilla havet?',
      targetLat: -41.29, targetLon: 174.78, targetName: 'Nya Zeeland', startLat: -34, startLon: 162,
      explain: 'Nya Zeeland består av Nordön och Sydön cirka 2 000 kilometer sydost om Australien, med Wellington som världens sydligaste huvudstad.'
    },
    {
      id: 'iq_globe_tasmania', t: 'globe', region: 'Oceanien',
      q: 'Peka ut på kartan: Var ligger ön Tasmanien söder om Australiens fastland?',
      targetLat: -42.04, targetLon: 146.81, targetName: 'Tasmanien', startLat: -34, startLon: 144,
      explain: 'Tasmanien skiljs från Australiens fastland av Bass-sundet och är känt för sin vilda natur och den tasmanska djävulen.'
    },
    {
      id: 'iq_globe_cuba', t: 'globe', region: 'Nordamerika',
      q: 'Peka ut på kartan: Var ligger Kuba, den största ön i Karibien?',
      targetLat: 21.52, targetLon: -77.78, targetName: 'Kuba', startLat: 22, startLon: -82,
      explain: 'Kuba ligger vid inloppet till Mexikanska golfen, bara omkring 150 kilometer söder om Florida.'
    },
    {
      id: 'iq_globe_alaska', t: 'globe', region: 'Nordamerika',
      q: 'Peka ut på kartan: Var ligger USA:s största delstat Alaska?',
      targetLat: 64.20, targetLon: -149.49, targetName: 'Alaska', startLat: 58, startLon: -135,
      explain: 'USA köpte Alaska av Ryssland år 1867 för 7,2 miljoner dollar; delstaten är mer än dubbelt så stor som Texas.'
    },
    {
      id: 'iq_globe_panama', t: 'globe', region: 'Nordamerika',
      q: 'Peka ut på kartan: Var förbinder Panamakanalen Atlanten och Stilla havet?',
      targetLat: 9.08, targetLon: -79.68, targetName: 'Panamakanalen', startLat: 12, startLon: -82,
      explain: 'Panamakanalen öppnades 1914 och låter fartyg passera rakt över Centralamerika genom slussar istället för att runda Sydamerikas sydspets.'
    },
    {
      id: 'iq_globe_greenland', t: 'globe', region: 'Nordamerika',
      q: 'Peka ut på kartan: Var ligger världens största ö, Grönland?',
      targetLat: 71.71, targetLon: -42.60, targetName: 'Grönland', startLat: 64, startLon: -40,
      explain: 'Omkring 80 procent av Grönland täcks av en upp till 3 kilometer tjock inlandsis.'
    },
    {
      id: 'iq_globe_peru', t: 'globe', region: 'Sydamerika',
      q: 'Peka ut på kartan: Var ligger Peru och Inkarikets hjärta i Anderna?',
      targetLat: -12.05, targetLon: -77.04, targetName: 'Lima, Peru', startLat: -14, startLon: -68,
      explain: 'Peru sträcker sig från Stilla havets ökenkust över höga Anderna ner i Amazonas regnskog.'
    },
    {
      id: 'iq_globe_argentina', t: 'globe', region: 'Sydamerika',
      q: 'Peka ut på kartan: Var ligger Argentinas huvudstad Buenos Aires vid Río de la Plata?',
      targetLat: -34.60, targetLon: -58.38, targetName: 'Buenos Aires, Argentina', startLat: -30, startLon: -62,
      explain: 'Buenos Aires grundades vid den breda flodmynningen Río de la Plata och är tangons födelsestad.'
    },
    {
      id: 'iq_globe_galapagos', t: 'globe', region: 'Sydamerika',
      q: 'Peka ut på kartan: Var ligger Galápagosöarna i Stilla havet väster om Ecuador?',
      targetLat: -0.95, targetLon: -90.97, targetName: 'Galápagosöarna', startLat: -2, startLon: -82,
      explain: 'Galápagosöarna ligger rakt på ekvatorn cirka 1 000 kilometer väster om Ecuador och inspirerade Charles Darwins evolutionslära.'
    },

    // =========================================================================
    // 2. PARA IHOP / MATCHA 4 PAR (14 st)
    // =========================================================================
    {
      id: 'iq_match_capitals_eu', t: 'match', region: 'Europa',
      q: 'Para ihop varje europeiskt land med rätt huvudstad:',
      pairs: [['Italien', 'Rom'], ['Frankrike', 'Paris'], ['Storbritannien', 'London'], ['Sverige', 'Stockholm']],
      explain: 'Rom, Paris, London och Stockholm hör till Europas mest kända historiska huvudstäder.'
    },
    {
      id: 'iq_match_capitals_world', t: 'match', region: 'Asien',
      q: 'Para ihop varje land med rätt huvudstad:',
      pairs: [['Japan', 'Tokyo'], ['Thailand', 'Bangkok'], ['Kina', 'Peking'], ['Indien', 'New Delhi']],
      explain: 'Tokyo, Bangkok, Peking och New Delhi är politiska och kulturella nav för fyra av Asiens största nationer.'
    },
    {
      id: 'iq_match_capitals_americas', t: 'match', region: 'Sydamerika',
      q: 'Para ihop varje land i Amerika med rätt huvudstad:',
      pairs: [['Mexiko', 'Mexico City'], ['Brasilien', 'Brasília'], ['Peru', 'Lima'], ['Argentina', 'Buenos Aires']],
      explain: 'Observera att Brasiliens huvudstad sedan 1960 är den planerade staden Brasília, inte Rio de Janeiro.'
    },
    {
      id: 'iq_match_rivers', t: 'match', region: 'Europa',
      q: 'Para ihop varje storstad med floden som rinner genom staden:',
      pairs: [['London', 'Themsen'], ['Paris', 'Seine'], ['Kairo', 'Nilen'], ['Rom', 'Tibern']],
      explain: 'Floderna var livsnerven som gjorde att alla fyra städerna växte fram som handels- och maktcentra.'
    },
    {
      id: 'iq_match_currencies', t: 'match', region: 'Asien',
      q: 'Para ihop varje land med dess klassiska valuta:',
      pairs: [['Japan', 'Yen'], ['Indien', 'Rupie'], ['Thailand', 'Baht'], ['Storbritannien', 'Pund']],
      explain: 'Yen, rupie, baht och pund sterling är bland världens mest välkända nationella valutor.'
    },
    {
      id: 'iq_match_currencies_2', t: 'match', region: 'Sydamerika',
      q: 'Para ihop varje land med rätt valuta:',
      pairs: [['Mexiko', 'Peso'], ['Brasilien', 'Real'], ['Sydafrika', 'Rand'], ['Turkiet', 'Lira']],
      explain: 'Sydafrikas rand har fått sitt namn efter guldåsen Witwatersrand vid Johannesburg.'
    },
    {
      id: 'iq_match_food', t: 'match', region: 'Europa',
      q: 'Para ihop varje berömd maträtt med sitt ursprungsland:',
      pairs: [['Pad Thai', 'Thailand'], ['Sushi', 'Japan'], ['Tacos al Pastor', 'Mexiko'], ['Feijoada', 'Brasilien']],
      explain: 'Feijoada är Brasiliens svarta böngryta och räknas som landets nationalrätt.'
    },
    {
      id: 'iq_match_wonders', t: 'match', region: 'Asien',
      q: 'Para ihop varje världsarv med rätt land:',
      pairs: [['Petra', 'Jordanien'], ['Angkor Wat', 'Kambodja'], ['Machu Picchu', 'Peru'], ['Uluru', 'Australien']],
      explain: 'Alla fyra är upptagna på UNESCO:s världsarvslista och kan besökas som egna expeditioner på jordgloben.'
    },
    {
      id: 'iq_match_landmarks', t: 'match', region: 'Nordamerika',
      q: 'Para ihop varje berömt landmärke med rätt stad:',
      pairs: [['Golden Gate-bron', 'San Francisco'], ['Operahuset', 'Sydney'], ['Hagia Sofia', 'Istanbul'], ['Turning Torso', 'Malmö']],
      explain: 'Varje landmärke har blivit en omedelbart igenkännlig symbol för sin stad.'
    },
    {
      id: 'iq_match_languages', t: 'match', region: 'Sydamerika',
      q: 'Para ihop varje land med det vanligaste officiella språket:',
      pairs: [['Brasilien', 'Portugisiska'], ['Egypten', 'Arabiska'], ['Mexiko', 'Spanska'], ['Kina', 'Mandarin']],
      explain: 'Brasilien är det enda portugisisktalande landet i Sydamerika och har flest portugisisktalande i hela världen.'
    },
    {
      id: 'iq_match_islands', t: 'match', region: 'Oceanien',
      q: 'Para ihop varje berömd ö med rätt hav eller land:',
      pairs: [['Robben Island', 'Sydafrika'], ['Alcatraz', 'San Francisco'], ['Gotland', 'Sverige'], ['Tasmanien', 'Australien']],
      explain: 'Både Robben Island och Alcatraz var ökända ö-fängelser som idag är historiska museer.'
    },
    {
      id: 'iq_match_animals', t: 'match', region: 'Afrika',
      q: 'Para ihop varje ikoniskt djur med regionen där det lever vilt:',
      pairs: [['Jättepanda', 'Kina'], ['Känguru', 'Australien'], ['Lemur', 'Madagaskar'], ['Lama', 'Anderna']],
      explain: 'Geografisk isolering och unika klimat har format djurarter som bara förekommer på en enda plats på jorden.'
    },
    {
      id: 'iq_match_people', t: 'match', region: 'Europa',
      q: 'Para ihop varje historisk person med rätt land:',
      pairs: [['Nelson Mandela', 'Sydafrika'], ['Frida Kahlo', 'Mexiko'], ['Alfred Nobel', 'Sverige'], ['Mahatma Gandhi', 'Indien']],
      explain: 'Alla fyra satte djupa avtryck i 1900-talets historia och kultur och finns att läsa om i städernas bibliotek.'
    },
    {
      id: 'iq_match_seas', t: 'match', region: 'Afrika',
      q: 'Para ihop varje sund eller kanal med vattnen de förbinder:',
      pairs: [['Öresund', 'Sverige & Danmark'], ['Bosporen', 'Europa & Asien'], ['Suezkanalen', 'Medelhavet & Röda havet'], ['Panamakanalen', 'Atlanten & Stilla havet']],
      explain: 'Smala sund och kanaler har i århundraden varit världshandelns viktigaste flaskhalsar.'
    },

    // =========================================================================
    // 3. ORDNA I RÄTT ORDNING (12 st)
    // =========================================================================
    {
      id: 'iq_order_north_south_eu', t: 'order', region: 'Europa',
      q: 'Ordna dessa städer från NORR (1) till SÖDER (4):',
      items: ['Stockholm', 'Malmö', 'Paris', 'Rom'],
      explain: 'Stockholm ligger på 59°N, Malmö på 55°N, Paris på 48°N och Rom på 41°N.'
    },
    {
      id: 'iq_order_north_south_world', t: 'order', region: 'Afrika',
      q: 'Ordna dessa städer från NORR (1) till SÖDER (4):',
      items: ['London', 'Kairo', 'Bangkok', 'Kapstaden'],
      explain: 'London (51°N), Kairo (30°N), Bangkok (13°N) och Kapstaden på södra halvklotet (33°S).'
    },
    {
      id: 'iq_order_west_east', t: 'order', region: 'Nordamerika',
      q: 'Ordna dessa städer från VÄSTER (1) till ÖSTER (4):',
      items: ['San Francisco', 'New York', 'London', 'Tokyo'],
      explain: 'San Francisco (122°W), New York (74°W), London (0°) och Tokyo långt i öster (139°E).'
    },
    {
      id: 'iq_order_mountains', t: 'order', region: 'Asien',
      q: 'Ordna dessa berömda berg från HÖGST (1) till LÄGST (4):',
      items: ['Mount Everest (8 849 m)', 'Kilimanjaro (5 895 m)', 'Berget Fuji (3 776 m)', 'Kebnekaise (2 096 m)'],
      explain: 'Mount Everest i Himalaya är mer än fyra gånger så högt som Sveriges högsta berg Kebnekaise.'
    },
    {
      id: 'iq_order_buildings', t: 'order', region: 'Europa',
      q: 'Ordna dessa berömda byggnadsverk från ÄLDST (1) till YNGST (4):',
      items: ['Pyramiderna i Giza (~2560 f.Kr.)', 'Colosseum (80 e.Kr.)', 'Taj Mahal (1648)', 'Eiffeltornet (1889)'],
      explain: 'Pyramiderna i Giza var redan över 2 600 år gamla när romarna invigde Colosseum!'
    },
    {
      id: 'iq_order_countries_area', t: 'order', region: 'Nordamerika',
      q: 'Ordna dessa länder från STÖRST YTA (1) till MINST YTA (4):',
      items: ['Kina', 'Australien', 'Indien', 'Japan'],
      explain: 'Kina (9,6 milj. km²), Australien (7,7 milj. km²), Indien (3,3 milj. km²) och Japan (0,38 milj. km²).'
    },
    {
      id: 'iq_order_oceans', t: 'order', region: 'Oceanien',
      q: 'Ordna dessa världshav från STÖRST (1) till MINST (4):',
      items: ['Stilla havet', 'Atlanten', 'Indiska oceanen', 'Norra ishavet'],
      explain: 'Stilla havet täcker nästan en tredjedel av hela jordytan och är större än alla kontinenter tillsammans.'
    },
    {
      id: 'iq_order_continents', t: 'order', region: 'Asien',
      q: 'Ordna dessa världsdelar från FLEST INVÅNARE (1) till FÄRST (4):',
      items: ['Asien', 'Afrika', 'Europa', 'Oceanien'],
      explain: 'Över hälften av jordens befolkning bor i Asien, medan Oceanien har drygt 45 miljoner invånare.'
    },
    {
      id: 'iq_order_rivers', t: 'order', region: 'Sydamerika',
      q: 'Ordna dessa floder från LÄNGST (1) till KORTAST (4):',
      items: ['Nilen (~6 650 km)', 'Yangtze (~6 300 km)', 'Donau (~2 850 km)', 'Themsen (~346 km)'],
      explain: 'Nilen och Amazonas tävlar om titeln världens längsta flod, medan Themsen bara är 346 km lång.'
    },
    {
      id: 'iq_order_history', t: 'order', region: 'Europa',
      q: 'Ordna dessa världshistoriska händelser från ÄLDST (1) till SENAST (4):',
      items: ['Pompeji begravs av Vesuvius (79)', 'Regalskeppet Vasa sjunker (1628)', 'Franska revolutionen (1789)', 'Månlandningen (1969)'],
      explain: 'Från antiken över stormaktstiden och upplysningen till rymdåldern.'
    },
    {
      id: 'iq_order_south_americas', t: 'order', region: 'Sydamerika',
      q: 'Ordna dessa platser i Amerika från NORR (1) till SÖDER (4):',
      items: ['New York', 'Mexico City', 'Machu Picchu', 'Rio de Janeiro'],
      explain: 'New York (40°N), Mexico City (19°N), Machu Picchu (13°S) och Rio de Janeiro (22°S).'
    },
    {
      id: 'iq_order_towers', t: 'order', region: 'Nordamerika',
      q: 'Ordna dessa kända torn från HÖGST (1) till LÄGST (4):',
      items: ['Empire State Building (443 m)', 'Tokyo Tower (333 m)', 'Eiffeltornet (330 m)', 'Turning Torso (190 m)'],
      explain: 'Tokyo Tower byggdes 1958 inspirerat av Eiffeltornet och gjordes medvetet några meter högre.'
    },

    // =========================================================================
    // 4. BILD- & FLAGGFRÅGOR (10 st - 100 % lokala verifierade bilder)
    // =========================================================================
    {
      id: 'iq_img_flag_jp', t: 'image', region: 'Asien',
      img: 'assets/flags/jp.png',
      q: 'Vilket lands flagga visas på bilden?',
      a: ['Japan', 'Sydkorea', 'Bangladesh', 'Kina'],
      explain: 'Japans flagga kallas Hinomaru ("solskivan") och symboliserar solgudinnan Amaterasu och "Soluppgångens land".'
    },
    {
      id: 'iq_img_flag_za', t: 'image', region: 'Afrika',
      img: 'assets/flags/za.png',
      q: 'Vilket land representeras av denna sexfärgade flagga?',
      a: ['Sydafrika', 'Kenya', 'Jamaica', 'Zimbabwe'],
      explain: 'Sydafrikas flagga antogs 1994 efter apartheids fall; Y-formen symboliserar olika vägar som förenas till en.'
    },
    {
      id: 'iq_img_flag_mx', t: 'image', region: 'Nordamerika',
      img: 'assets/flags/mx.png',
      q: 'Vilket lands flagga har denna örn med en orm på en kaktus i mitten?',
      a: ['Mexiko', 'Italien', 'Peru', 'Spanien'],
      explain: 'Emblemet bygger på aztekernas legend om var de skulle grunda sin huvudstad Tenochtitlán (dagens Mexico City).'
    },
    {
      id: 'iq_img_flag_tr', t: 'image', region: 'Europa',
      img: 'assets/flags/tr.png',
      q: 'Vilket lands flagga med halvmåne och stjärna syns här?',
      a: ['Turkiet', 'Tunisien', 'Pakistan', 'Marocko'],
      explain: 'Turkiets röda flagga med vit halvmåne och femuddig stjärna härstammar från det Osmanska rikets 1800-talsflagga.'
    },
    {
      id: 'iq_img_flag_br', t: 'image', region: 'Sydamerika',
      img: 'assets/flags/br.png',
      q: 'Vilket lands flagga bär valspråket "Ordem e Progresso"?',
      a: ['Brasilien', 'Argentina', 'Portugal', 'Colombia'],
      explain: 'Den blå stjärnhimlen i Brasiliens flagga visar himlen över Rio de Janeiro den dag republiken utropades 1889.'
    },
    {
      id: 'iq_img_flag_au', t: 'image', region: 'Oceanien',
      img: 'assets/flags/au.png',
      q: 'Vilket lands flagga visar Södra korset tillsammans med Samväldesstjärnan?',
      a: ['Australien', 'Nya Zeeland', 'Storbritannien', 'Fiji'],
      explain: 'Australiens flagga skiljer sig från Nya Zeelands genom den stora sjuuddiga Samväldesstjärnan under Union Jack och vita stjärnor.'
    },
    {
      id: 'iq_img_flag_th', t: 'image', region: 'Asien',
      img: 'assets/flags/th.png',
      q: 'Vilket sydostasiatiskt lands flagga visas på bilden?',
      a: ['Thailand', 'Costa Rica', 'Vietnam', 'Kambodja'],
      explain: 'I Thailands flagga (Thong Trairong) står rött för folket, vitt för religionen och blått för monarkin.'
    },
    {
      id: 'iq_img_wonder_petra', t: 'image', region: 'Asien',
      img: 'assets/wonders/petra.jpg',
      q: 'Vilket berömt världsarv uthugget i rosaröd sandsten visas på fotot?',
      a: ['Klippstaden Petra (Jordanien)', 'Angkor Wat (Kambodja)', 'Kappadokien (Turkiet)', 'Abu Simbel (Egypten)'],
      explain: 'Al-Khazneh i Petra höggs ut direkt i klippväggen av nabatéerna för omkring 2 000 år sedan.'
    },
    {
      id: 'iq_img_wonder_machu', t: 'image', region: 'Sydamerika',
      img: 'assets/wonders/machupicchu.jpg',
      q: 'Vilken legendarisk bergstad i Anderna syns på fotot?',
      a: ['Machu Picchu (Peru)', 'Chichén Itzá (Mexiko)', 'Tikal (Guatemala)', 'Cuzco (Peru)'],
      explain: 'Machu Picchu ligger 2 430 meter över havet och övergavs under 1500-talet, men hittades aldrig av spanjorerna.'
    },
    {
      id: 'iq_img_wonder_angkor', t: 'image', region: 'Asien',
      img: 'assets/wonders/angkorwat.jpg',
      q: 'Vilket monumentalt tempelkomplex i Sydostasien syns på fotot?',
      a: ['Angkor Wat (Kambodja)', 'Wat Arun (Thailand)', 'Borobudur (Indonesien)', 'Taj Mahal (Indien)'],
      explain: 'Angkor Wat byggdes på 1100-talet av Khmerriket och är världens största religiösa monument till ytan.'
    }
  ];

  window.GT_INTERACTIVE_POOL = INTERACTIVE_POOL;
})();
