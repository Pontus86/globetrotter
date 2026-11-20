// Globetrotter — Utökad Jobbkatalog (3 distinkta jobb per destination, BackPacker 1 & 2-stil!)
// Varje stad får:
//   [0] Stadens signaturjobb (6 tim, 100 % grundlön, lokala stadsfrågor)
//   [1] Snabbpass / Servicejobb (4 tim, ~70 % grundlön, yrkesfrågor)
//   [2] Specialistpass / Heldag (8 tim, ~138 % grundlön, fördjupade yrkesfrågor)

(function () {
  const W = window.GT_WORLD;
  if (!W || !W.cities) return;

  const ROLE_QUESTIONS = {
    barista: [
      { id: 'jq_bar_1', t: 'mc', q: 'Vilket land är världens största producent av kaffebönor?', a: ['Brasilien', 'Colombia', 'Etiopien', 'Vietnam'] },
      { id: 'jq_bar_2', t: 'mc', q: 'Vad består en klassisk italiensk cappuccino av utöver espresso?', a: ['Varm mjölk och mjölkskum', 'Vispad grädde och kakao', 'Varmt vatten och socker', 'Kondenserad mjölk och is'] },
      { id: 'jq_bar_3', t: 'mc', q: 'Från vilket afrikanskt land anses kaffeplantan Coffea arabica ursprungligen komma?', a: ['Etiopien', 'Kenya', 'Marocko', 'Tanzania'] },
      { id: 'jq_bar_4', t: 'mc', q: 'Vilket av följande teer är helt oxiderat?', a: ['Svart te', 'Grönt te', 'Vitt te', 'Matcha'] },
      { id: 'jq_bar_5', t: 'num', q: 'Ungefär hur många grader Celsius bör bryggvattnet hålla för en perfekt kopp filterkaffe?', min: 70, max: 100, step: 1, ans: 94, unit: '°C' }
    ],
    kock: [
      { id: 'jq_kock_1', t: 'mc', q: 'Vilken krydda är världens dyraste räknat per gram och skördas från krokusblommor?', a: ['Saffran', 'Kardemumma', 'Vanilj', 'Muskotblomma'] },
      { id: 'jq_kock_2', t: 'mc', q: 'Vad heter den japanska grundsmaken som betyder "välsmakande" eller "mustig"?', a: ['Umami', 'Dashi', 'Miso', 'Wasabi'] },
      { id: 'jq_kock_3', t: 'mc', q: 'Vilken ingrediens är basen i både hummus och falafel?', a: ['Kikärtor', 'Röda linser', 'Svarta bönor', 'Couscous'] },
      { id: 'jq_kock_4', t: 'mc', q: 'I vilket land har rätten ceviche (rå fisk marinerad i citrus) sitt mest kända ursprung?', a: ['Peru', 'Spanien', 'Thailand', 'Grekland'] },
      { id: 'jq_kock_5', t: 'text', q: 'Vilket italienskt ord används när pasta är kokt med lätt tuggmotstånd? (två ord)', ans: 'al dente' }
    ],
    bud: [
      { id: 'jq_bud_1', t: 'mc', q: 'I vilket av dessa länder kör man på vänster sida av vägen?', a: ['Japan', 'Frankrike', 'Brasilien', 'Egypten'] },
      { id: 'jq_bud_2', t: 'mc', q: 'Vad kallas den imaginära linje vid 0 grader longitud som passerar genom London?', a: ['Nollmeridianen', 'Ekvatorn', 'Kräftans vändkrets', 'Datumlinjen'] },
      { id: 'jq_bud_3', t: 'mc', q: 'Vilken väderstrecksriktning ligger alltid 90 grader medsols från norr?', a: ['Öster', 'Väster', 'Söder', 'Nordväst'] },
      { id: 'jq_bud_4', t: 'num', q: 'Hur många tidszoner är jorden i grunden indelad i?', min: 12, max: 36, step: 1, ans: 24, unit: 'st' },
      { id: 'jq_bud_5', t: 'mc', q: 'Vilken stad är känd för att dess tunnelbana heter "The Tube"?', a: ['London', 'New York', 'Paris', 'Tokyo'] }
    ],
    musik: [
      { id: 'jq_mus_1', t: 'mc', q: 'Från vilket land kommer musikstilen bossa nova?', a: ['Brasilien', 'Argentina', 'Kuba', 'Portugal'] },
      { id: 'jq_mus_2', t: 'mc', q: 'Vilket stränginstrument är centralt i klassisk indisk musik och gjordes världskänt av Ravi Shankar?', a: ['Sitar', 'Balalajka', 'Koto', 'Oud'] },
      { id: 'jq_mus_3', t: 'mc', q: 'Hur många strängar har en vanlig akustisk gitarr?', a: ['6', '4', '8', '12'] },
      { id: 'jq_mus_4', t: 'mc', q: 'Vilken stad kallas ofta "jazzens födelsestad"?', a: ['New Orleans', 'Chicago', 'London', 'Memphis'] },
      { id: 'jq_mus_5', t: 'mc', q: 'Vad kallas den traditionella australiska blåsinstrumenttypen gjord av urholkat trä?', a: ['Didgeridoo', 'Säckpipa', 'Panflöjt', 'Vuvuzela'] }
    ],
    bokhandel: [
      { id: 'jq_bok_1', t: 'mc', q: 'Vem skrev äventyrsromanen "Jorden runt på 80 dagar"?', a: ['Jules Verne', 'Mark Twain', 'Charles Dickens', 'Alexandre Dumas'] },
      { id: 'jq_bok_2', t: 'mc', q: 'I vilken stad utspelar sig större delen av Astrid Lindgrens "Karlsson på taket"?', a: ['Stockholm', 'Göteborg', 'Oslo', 'Köpenhamn'] },
      { id: 'jq_bok_3', t: 'mc', q: 'Vilken spansk författare skrev klassikern "Don Quijote"?', a: ['Miguel de Cervantes', 'Gabriel García Márquez', 'Federico García Lorca', 'Isabel Allende'] },
      { id: 'jq_bok_4', t: 'mc', q: 'Vad heter den berömda sagosamlingen från Mellanöstern där Scheherazade berättar historier?', a: ['Tusen och en natt', 'Gilgamesheposet', 'Odysséen', 'Kalevala'] },
      { id: 'jq_bok_5', t: 'text', q: 'Vad heter den japanska diktformen med tre rader (5-7-5 stavelser)?', ans: 'haiku' }
    ],
    reception: [
      { id: 'jq_rec_1', t: 'mc', q: 'Vilken valuta används i Japan?', a: ['Yen', 'Won', 'Yuan', 'Baht'] },
      { id: 'jq_rec_2', t: 'mc', q: 'Vilket språk talas av flest modersmålstalare i Brasilien?', a: ['Portugisiska', 'Spanska', 'Engelska', 'Franska'] },
      { id: 'jq_rec_3', t: 'mc', q: 'Vad betyder förkortningen "GMT" när man ställer om klockan på resa?', a: ['Greenwich Mean Time', 'Global Morning Time', 'General Map Time', 'Great Meridian Time'] },
      { id: 'jq_rec_4', t: 'mc', q: 'Vilken valuta används i Thailand?', a: ['Baht', 'Rupie', 'Ringgit', 'Peso'] },
      { id: 'jq_rec_5', t: 'mc', q: 'Vad heter det internationella nödnumret som fungerar i hela EU?', a: ['112', '911', '999', '110'] }
    ],
    journalist: [
      { id: 'jq_jou_1', t: 'mc', q: 'Vilken kanal förbinder Medelhavet direkt med Röda havet?', a: ['Suezkanalen', 'Panamakanalen', 'Kielkanalen', 'Korintkanalen'] },
      { id: 'jq_jou_2', t: 'mc', q: 'I vilken stad har FN sitt huvudkontor?', a: ['New York', 'Genève', 'Bryssel', 'Wien'] },
      { id: 'jq_jou_3', t: 'num', q: 'Vilket år föll Berlinmuren?', min: 1975, max: 2000, step: 1, ans: 1989, unit: '' },
      { id: 'jq_jou_4', t: 'mc', q: 'Vilket land var det första i världen att införa allmän rösträtt för kvinnor 1893?', a: ['Nya Zeeland', 'Sverige', 'Storbritannien', 'USA'] },
      { id: 'jq_jou_5', t: 'mc', q: 'Vilken stad var huvudstad i det Osmanska riket fram till 1923?', a: ['Istanbul (Konstantinopel)', 'Ankara', 'Kairo', 'Aten'] }
    ],
    arkitekt: [
      { id: 'jq_ark_1', t: 'mc', q: 'Vem ritade det berömda operahuset i Sydney?', a: ['Jørn Utzon', 'Gustave Eiffel', 'Antoni Gaudí', 'Frank Lloyd Wright'] },
      { id: 'jq_ark_2', t: 'mc', q: 'Vilken arkitektonisk epok kännetecknas av spetsbågar, strävbågar och höga glasmålningar?', a: ['Gotik', 'Barock', 'Funktionalism', 'Nyklassicism'] },
      { id: 'jq_ark_3', t: 'mc', q: 'Vilket byggnadsmaterial gjorde det möjligt för romarna att bygga den enorma kupolen på Pantheon?', a: ['Romersk betong', 'Gjutjärn', 'Armerat stål', 'Cederträ'] },
      { id: 'jq_ark_4', t: 'mc', q: 'I vilken stad står den ännu ofullbordade basilikan Sagrada Família?', a: ['Barcelona', 'Rom', 'Madrid', 'Lissabon'] },
      { id: 'jq_ark_5', t: 'num', q: 'Hur högt är Eiffeltornet ungefär (inklusive antenn)?', min: 150, max: 500, step: 10, ans: 330, unit: 'm' }
    ],
    biolog: [
      { id: 'jq_bio_1', t: 'mc', q: 'Vilken är världens största regnskog?', a: ['Amazonas', 'Kongobäckenet', 'Daintree', 'Borneos regnskog'] },
      { id: 'jq_bio_2', t: 'mc', q: 'Vilket djur är endemiskt (finns bara vilt) på Australien?', a: ['Koala', 'Snöleopard', 'Tapir', 'Lemur'] },
      { id: 'jq_bio_3', t: 'mc', q: 'Vilken världens största korallrevsstruktur ligger utanför Australiens nordostkust?', a: ['Stora barriärrevet', 'Belize barriärrev', 'Röda havets rev', 'Maldivernas atoller'] },
      { id: 'jq_bio_4', t: 'mc', q: 'Vilken ögrupp i Stilla havet inspirerade Charles Darwin till evolutionsteorin?', a: ['Galápagosöarna', 'Hawaii', 'Azorerna', 'Seychellerna'] },
      { id: 'jq_bio_5', t: 'mc', q: 'Vad kallas den torra, trädlösa tundran och savannen som täcker stora delar av södra Afrika?', a: ['Veld / Savann', 'Taiga', 'Pampas', 'Mangrove'] }
    ],
    fotograf: [
      { id: 'jq_fot_1', t: 'mc', q: 'Vad kallas timmen precis efter soluppgång och före solnedgång då ljuset är varmt och mjukt?', a: ['Gyllene timmen', 'Blå timmen', 'Zenit', 'Motljus'] },
      { id: 'jq_fot_2', t: 'mc', q: 'Vilken regeln inom bildkomposition delar in bilden i nio lika stora rutor?', a: ['Tredjedelsregeln', 'Pythagoras regel', 'Spegelregeln', 'Horisontregeln'] },
      { id: 'jq_fot_3', t: 'mc', q: 'Vad styr bländartalet (f-talet) på ett kameraobjektiv framför allt?', a: ['Ljusinsläpp och skärpedjup', 'Färgmättnad', 'Batteritid', 'Bildens upplösning'] },
      { id: 'jq_fot_4', t: 'mc', q: 'Vem målade "Mona Lisa" som hänger på Louvren i Paris?', a: ['Leonardo da Vinci', 'Michelangelo', 'Rembrandt', 'Vincent van Gogh'] },
      { id: 'jq_fot_5', t: 'mc', q: 'Vilken ljusfenomen kan fotograferas på natthimlen nära polcirkeln?', a: ['Norrsken (Aurora borealis)', 'Fata morgana', 'Passadvind', 'Monsun'] }
    ],
    ekonom: [
      { id: 'jq_eko_1', t: 'mc', q: 'Vilken gata på Manhattan i New York är synonym med USA:s finansmarknad?', a: ['Wall Street', 'Broadway', 'Fifth Avenue', 'Abbey Road'] },
      { id: 'jq_eko_2', t: 'mc', q: 'Vad kallas den historiska handelsväg som band samman Kina med Medelhavet?', a: ['Sidenvägen', 'Kryddleden', 'Bärnstensvägen', 'Inkalinjen'] },
      { id: 'jq_eko_3', t: 'mc', q: 'Vilken organisation samordnar många av världens största oljeexporterande länder?', a: ['OPEC', 'UNESCO', 'WHO', 'FIFA'] },
      { id: 'jq_eko_4', t: 'mc', q: 'Vilken valuta används i de flesta euroländer?', a: ['Euro', 'Franc', 'D-mark', 'Lira'] },
      { id: 'jq_eko_5', t: 'mc', q: 'Vad innebär ordet "inflation" inom ekonomi?', a: ['Att den allmänna prisnivån stiger och pengars värde sjunker', 'Att alla priser sänks med hälften', 'Att en bank går i konkurs', 'Att exporten blir tullfri'] }
    ],
    astronom: [
      { id: 'jq_ast_1', t: 'mc', q: 'Vilken är den största oceanen på jorden?', a: ['Stilla havet', 'Atlanten', 'Indiska oceanen', 'Norra ishavet'] },
      { id: 'jq_ast_2', t: 'mc', q: 'Vilken planet i vårt solsystem är känd som "den röda planeten"?', a: ['Mars', 'Venus', 'Jupiter', 'Merkurius'] },
      { id: 'jq_ast_3', t: 'mc', q: 'Vilket väderfenomen orsakar sommarens kraftiga regnperiod i Indien och Sydostasien?', a: ['Monsunen', 'Golfströmmen', 'Mistralen', 'El Niño'] },
      { id: 'jq_ast_4', t: 'num', q: 'Ungefär hur många kilometer är jordens omkrets vid ekvatorn?', min: 25000, max: 55000, step: 500, ans: 40000, unit: 'km' },
      { id: 'jq_ast_5', t: 'mc', q: 'Vilken stjärnbild används på södra halvklotet (t.ex. i Sydney och Kapstaden) för att hitta söder?', a: ['Södra korset', 'Karlavagnen', 'Cassiopeja', 'Polstjärnan'] }
    ]
  };

  // Personliga annonstexter för varje stads signaturjobb
  const CITY_SIGNATURE_ADS = {
    stockholm: 'Kapten Holm på M/S Västan har tappat rösten! Han behöver en pigg skärgårdsguide som hittar bland kobbarna och kan dra en bra historia för passagerarna.',
    kairo: 'Kapten Tariq sätter segel på sin gamla felucca vid solnedgången och söker en pratglad ciceron med koll på både Nilen och faraonerna.',
    delhi: 'Gamle mästerkocken Rashid i Old Delhi behöver ett par snabba händer bland grytorna — doften av kardemumma och varm naan ingår i lönen!',
    tokyo: 'Rektor Tanaka på Sakura-skolan söker en glad gästlärare som kan hålla en livlig konversationslektion för nyfikna kvällsstudenter.',
    sanfrancisco: 'Skeppare Lou på Pier 39 vill ha skarpa vykortsklipp av Golden Gate och sjölejonen — låna en regnjacka och hoppa ombord!',
    newyork: 'Dispatchern Sal på 42:a gatan har tre bilar som står stilla! Kan du hitta mellan Manhattan och Brooklyn får du behålla både lön och dricks.',
    paris: 'Madame Delacroix öppnar vernissage i Marais ikväll och söker någon med blick för färg, form och fransk konsthistoria som kan guida besökarna.',
    rom: 'Farbror Marco har eldat upp stenugnen sedan gryningen — hjälp honom knåda deg och hålla koll på beställningarna i kvällsrusningen!',
    london: 'Chaufför Bernard på linje 15 saknar sin konduktör! Klipp biljetter, ropa ut hållplatserna och charma Londons pendlare.',
    istanbul: 'Farbror Kemal bjuder på äppelte och söker en kvicktänkt medhjälpare som kan berätta om knutar, mönster och sidenvägen i basaren.',
    bangkok: 'Somchai har just putsat kromet på sin tuk-tuk och behöver en kartläsare som hittar snabbaste genvägen genom Bangkoks trafik.',
    peking: 'Mästare Lin på antikgatan Liulichang söker en stadig hand som kan riva tusch, ordna rispapper och hälsa nyfikna samlare välkomna.',
    sydney: 'Livräddaren Bruce på Bondi Beach behöver extra ögon ut mot vågorna — solkräm, visselpipa och fin utsikt över Tasmanhavet utlovas!',
    kapstaden: 'Guiden Sipho kör tidig morgontur runt Kaphalvön och söker en nyfiken medguide som kan peka ut pingviner, fynbos och bergstoppar.',
    rio: 'Redaktör Silva på Jornal do Brasil behöver en snabb reporter på Maracanã som kan skriva ihop kvällens matchreferat före pressläggning.',
    mexicocity: 'Doktor Elena katalogiserar nya fynd på antropologiska museet och söker en noggrann assistent med känsla för azteker och mayakultur.'
  };

  // 2 extra lokala jobb per stad: [snabbpass (4 tim), specialistpass (8 tim)] med personliga platsannonser
  const CITY_EXTRA_JOBS = {
    stockholm: [
      { title: 'Barista på Söder', employer: 'Kafé Mariatorget', hours: 4, payFactor: 0.68, role: 'barista', tag: 'Kafé · 4 tim', adText: 'Klaus och Gittan på Mariatorget bjuder på bullfika och en bra slant till den som vill jobba extra och skumma mjölk i rusningen!' },
      { title: 'Utrikesreporter', employer: 'Svenska Resebladet', hours: 8, payFactor: 1.38, role: 'journalist', tag: 'Redaktion · 8 tim', adText: 'Chefredaktör Lindqvist har skrivit fast sig och behöver en beläst reseskribent hela dagen — eget skrivbord och presskort ingår.' }
    ],
    kairo: [
      { title: 'Kökshjälp i basaren', employer: 'Khan el-Khalili Kök', hours: 4, payFactor: 0.72, role: 'kock', tag: 'Kök · 4 tim', adText: 'Moster Fatima friterar falafel så kryddorna ryker! Hjälp henne hacka persilja och servera myntate — varm mat och kontanter direkt.' },
      { title: 'Byggnadsassistent', employer: 'Kairo Arkitekturbyrå', hours: 8, payFactor: 1.42, role: 'arkitekt', tag: 'Arkitektur · 8 tim', adText: 'Arkitekt Mansour ritar om ett gammalt palats vid Nilen och söker någon med öga för valv, kupoler och stora byggnadsverk.' }
    ],
    delhi: [
      { title: 'Nattportier', employer: 'Connaught Palace Inn', hours: 4, payFactor: 0.72, role: 'reception', tag: 'Hotell · 4 tim', adText: 'Herr Verma vill gå på sin brorsons bröllop och söker en vänlig själ som kan ta hand om nycklar, valutor och nyanlända gäster.' },
      { title: 'Handelsassistent', employer: 'Old Delhi Export', hours: 8, payFactor: 1.45, role: 'ekonom', tag: 'Handel · 8 tim', adText: 'Fru Kapoor skickar te- och kryddlådor till halva jordklotet och behöver en klipsk assistent som kan hålla ordning på fraktsedlarna.' }
    ],
    tokyo: [
      { title: 'Cykelbud i Shibuya', employer: 'Kanto Express', hours: 4, payFactor: 0.68, role: 'bud', tag: 'Bud · 4 tim', adText: 'Kenji har punktering på sin budcykel! Låna extracykeln, kryssa genom gränderna och leverera paket med knivskarpt lokalsinne.' },
      { title: 'Stadsfotograf', employer: 'Tokyo Lens Magazine', hours: 8, payFactor: 1.38, role: 'fotograf', tag: 'Foto · 8 tim', adText: 'Bildredaktören Yuki jagar det perfekta ljuset över neonskyltar och tempel — en heldag med kameran ger rejält med yen i fickan.' }
    ],
    sanfrancisco: [
      { title: 'Kafferostare', employer: 'Mission Roasters', hours: 4, payFactor: 0.68, role: 'barista', tag: 'Kafé · 4 tim', adText: 'Milo och Tessa i Mission District bjuder på nyrostad espresso och surdegsbröd till dig som rycker in bakom disken i eftermiddag.' },
      { title: 'Marinbiolog-praktikant', employer: 'Pacific Bay Institute', hours: 8, payFactor: 1.38, role: 'biolog', tag: 'Natur · 8 tim', adText: 'Doktor Morales studerar Stilla havets djurliv och behöver en nyfiken fältassistent ute vid kusten hela dagen.' }
    ],
    newyork: [
      { title: 'Bokhandelsbiträde', employer: 'Greenwich Books', hours: 4, payFactor: 0.68, role: 'bokhandel', tag: 'Bokhandel · 4 tim', adText: 'Gamle Arthur i Greenwich Village hinner inte packa upp alla kartonger med reseskildringar — hjälp honom sortera hyllorna över en kopp kaffe!' },
      { title: 'Börsassistent', employer: 'Manhattan Trading Co.', hours: 8, payFactor: 1.40, role: 'ekonom', tag: 'Finans · 8 tim', adText: 'Mäklaren Diane på Wall Street behöver en skarp hjärna som har koll på världsmarknaden — stressigt pass men stadens bästa dagslön!' }
    ],
    paris: [
      { title: 'Kaféservitör', employer: 'Bistro Saint-Germain', hours: 4, payFactor: 0.68, role: 'barista', tag: 'Kafé · 4 tim', adText: 'Jean-Luc behöver en stadig brickbärare på uteserveringen! Croissanter i pausen och fina drickspengar utlovas.' },
      { title: 'Arkitekturguide', employer: 'Atelier Haussmann', hours: 8, payFactor: 1.38, role: 'arkitekt', tag: 'Arkitektur · 8 tim', adText: 'Arkitekten Claire tar med en grupp gäster bland Paris broar och boulevarder och söker en kunnig medguide för hela dagen.' }
    ],
    rom: [
      { title: 'Antikvariatsbiträde', employer: 'Libreria Navona', hours: 4, payFactor: 0.70, role: 'bokhandel', tag: 'Böcker · 4 tim', adText: 'Signora Lucia i gränden vid Piazza Navona bjuder på gelato och söker någon som älskar gamla böcker och kan hjälpa kunderna.' },
      { title: 'Kulturfotograf', employer: 'Roma Immagine', hours: 8, payFactor: 1.38, role: 'fotograf', tag: 'Foto · 8 tim', adText: 'Fotografen Matteo gör ett stort bildreportage om Rom i gyllene timmen — häng med som assistent och tjäna en redig dagspeng.' }
    ],
    london: [
      { title: 'Gatumusikant på Covent Garden', employer: 'West End Buskers', hours: 4, payFactor: 0.68, role: 'musik', tag: 'Musik · 4 tim', adText: 'Alfie och hans band saknar en medspelare på torget! Har du koll på musik och gillar publik så delar ni på hatten efteråt.' },
      { title: 'Korrespondent', employer: 'Thames Chronicle', hours: 8, payFactor: 1.38, role: 'journalist', tag: 'Nyheter · 8 tim', adText: 'Redaktionen på Fleet Street har bråda dagar inför kvällsupplagan och söker en skarp skribent med koll på världshistorien.' }
    ],
    istanbul: [
      { title: 'Kryddkock', employer: 'Galata Lokantası', hours: 4, payFactor: 0.72, role: 'kock', tag: 'Kök · 4 tim', adText: 'Ayla vid Galatatornet bjuder på nygräddat bröd och söker en pigg hjälpreda som kan skilja på spiskummin, sumak och saffran!' },
      { title: 'Skeppsmäklare', employer: 'Bosphorus Shipping', hours: 8, payFactor: 1.40, role: 'ekonom', tag: 'Handel · 8 tim', adText: 'Fartyg köar genom Bosporen! Hamnkontoret behöver en kvicktänkt medarbetare hela dagen för att sköta lastlistor och handelsrutter.' }
    ],
    bangkok: [
      { title: 'Hostel-värd', employer: 'Chao Phraya Hostel', hours: 4, payFactor: 0.72, role: 'reception', tag: 'Service · 4 tim', adText: 'Ploy vill ta eftermiddagen ledig och söker en trevlig backpacker som kan checka in resenärer och bjuda på mangosmoothie.' },
      { title: 'Tropikbiolog-assistent', employer: 'Siam Nature Lab', hours: 8, payFactor: 1.42, role: 'biolog', tag: 'Natur · 8 tim', adText: 'Forskaren Niran inventerar orkidéer och regnskogsarter och behöver en pålitlig medhjälpare för ett heldagspass.' }
    ],
    peking: [
      { title: 'Expressbud', employer: 'Beijing Cycle Post', hours: 4, payFactor: 0.70, role: 'bud', tag: 'Bud · 4 tim', adText: 'Mästare Zhang i hutongerna behöver snabba ben som kan leverera brev och paket mellan gårdarna innan skymningen.' },
      { title: 'Observatorieguide', employer: 'Antika Observatoriet', hours: 8, payFactor: 1.40, role: 'astronom', tag: 'Vetenskap · 8 tim', adText: 'Professor Mei visar besökare de gamla bronsinstrumenten på muren och söker en vetgirig guide med koll på himmel och jord.' }
    ],
    sydney: [
      { title: 'Trubadur i hamnen', employer: 'Circular Quay Stage', hours: 4, payFactor: 0.68, role: 'musik', tag: 'Musik · 4 tim', adText: 'Kylie på kajkaféet bjuder på kall ingefärsöl och hyr in en glad musikälskare som kan underhålla kvällsflanörerna vid vattnet.' },
      { title: 'Havs- & stjärnguide', employer: 'Southern Cross Observatory', hours: 8, payFactor: 1.38, role: 'astronom', tag: 'Vetenskap · 8 tim', adText: 'Astronomen Liam tar emot nyfikna gäster under södra halvklotets stjärnhimmel — ett långt men riktigt välbetalt pass!' }
    ],
    kapstaden: [
      { title: 'Receptionist vid vattnet', employer: 'Waterfront Lodge', hours: 4, payFactor: 0.70, role: 'reception', tag: 'Hotell · 4 tim', adText: 'Tant Miriam bjuder på nybryggt rooibos-te och en skön slant om du kan passa receptionen medan hon handlar på marknaden.' },
      { title: 'Naturfotograf', employer: 'Cape Wildlife Press', hours: 8, payFactor: 1.40, role: 'fotograf', tag: 'Foto · 8 tim', adText: 'Tidningen Cape Wildlife ska skicka ut ett naturteam mot Taffelberget och söker en skarp fotografassistent för hela dagen.' }
    ],
    rio: [
      { title: 'Samba-slagverkare', employer: 'Lapa Music Club', hours: 4, payFactor: 0.70, role: 'musik', tag: 'Musik · 4 tim', adText: 'Tiago och sambagänget i Lapa behöver en extra rytmspelare till kvällens spelning — färsk limejuice och kontant gage väntar!' },
      { title: 'Regnskogsforskare', employer: 'Instituto Atlântico', hours: 8, payFactor: 1.40, role: 'biolog', tag: 'Natur · 8 tim', adText: 'Biologen Beatriz samlar in prover i Tijuca-skogen ovanför Rio och betalar bra till en naturkunnig fältassistent.' }
    ],
    mexicocity: [
      { title: 'Taqueria-kock', employer: 'Taquería El Zócalo', hours: 4, payFactor: 0.72, role: 'kock', tag: 'Kök · 4 tim', adText: 'Doña Rosa lovar hur många färska tacos du orkar äta plus fin timpeng om du hjälper till vid stekbordet i lunchrusningen!' },
      { title: 'Utrikeskrönikör', employer: 'El Diario Mundial', hours: 8, payFactor: 1.40, role: 'journalist', tag: 'Redaktion · 8 tim', adText: 'Redaktör Carlos söker en världsvan resenär som kan skriva dagens stora utrikeskrönika — bra betalt och gott kaffe hela passet.' }
    ]
  };

  Object.entries(W.cities).forEach(([cityKey, city]) => {
    const primary = city.job
      ? { ...city.job, isSignature: true, tag: 'Lokalt yrke · 6 tim', adText: CITY_SIGNATURE_ADS[cityKey] || '' }
      : null;
    const basePay = primary ? primary.pay : 700;
    const extras = (CITY_EXTRA_JOBS[cityKey] || []).map(ex => ({
      title: ex.title,
      employer: ex.employer,
      hours: ex.hours,
      pay: Math.round((basePay * ex.payFactor) / 10) * 10,
      role: ex.role,
      tag: ex.tag,
      adText: ex.adText,
      isSignature: false,
      questions: ROLE_QUESTIONS[ex.role] || []
    }));
    city.jobs = primary ? [primary, ...extras] : extras;
  });

  window.GT_JOB_ROLE_QUESTIONS = ROLE_QUESTIONS;
})();
