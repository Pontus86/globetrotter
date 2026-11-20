// Globetrotter — Världsdata och innehåll för prototyp och vertikal slice.
// Fritt från BackPacker 2-koordinater och skyddat material.
// Bilder och fakta baserade på öppna källor (Wikimedia Commons / Wikipedia).
// Frågorna testar allmänbildning – svaret finns INTE direkt i faktatexten!

const root = typeof window !== 'undefined' ? window : global;

root.GT_WORLD = {
  startCity: 'stockholm',
  startCash: 10000,
  dayLimit: 30,
  backpackSlots: 5,

  // Städer i jorden-runt-rutten med koordinater och positioner för kartikoner
  cities: {
    stockholm: {
      name: 'Stockholm',
      country: 'Sverige',
      region: 'europa',
      lat: 59.33,
      lon: 18.07,
      skyline: 'assets/photos/gamlastan.jpg',
      map: 'assets/maps/map_stockholm.jpg',
      hotel: { name: 'Hotell Skeppsholmen', price: 600 },
      highlights: ['vasa', 'gamlastan', 'skansen', 'stadshuset'],
      wonders: [],
      souvenirs: ['dalahast', 'kangor'],
      spots: {
        hotel: [18, 76],
        job: [38, 80],
        shop: [58, 78],
        airport: [82, 76],
        signature: [12, 60],
        vasa: [20, 44],
        gamlastan: [42, 36],
        skansen: [64, 46],
        stadshuset: [84, 38]
      },
      signature: {
        name: 'Konditori Vetekatten',
        openFrom: 8,
        openUntil: 17,
        cost: 45,
        hours: 1,
        desc: 'Ta en klassisk svensk fika med kaffe och kardemummabulle bland stockholmarna och snappa upp restips!',
        kind: 'deal'
      },
      job: {
        title: 'Skärgårdsguide',
        employer: 'Waxholmsbolaget',
        pay: 900,
        hours: 6,
        questions: [
          { t: 'num', q: 'Ungefär hur många öar, kobbar och skär räknar man med finns i Stockholms skärgård?', ans: 30000, min: 5000, max: 60000, step: 1000, unit: 'st' },
          { t: 'mc', q: 'Vilken sjö möter Östersjön vid Slussen i Stockholm?', a: ['Mälaren', 'Vänern', 'Hjälmaren', 'Vättern'] },
          { t: 'mc', q: 'Vem brukar enligt Erikskrönikan räknas som Stockholms grundare på 1200-talet?', a: ['Birger jarl', 'Gustav Vasa', 'Olof Skötkonung', 'Magnus Ladulås'] },
          { t: 'mc', q: 'Vilket år invigdes Stockholms stadshus vid Riddarfjärden, ritat av Ragnar Östberg?', a: ['1923', '1897', '1952', '1912'] }
        ]
      }
    },
    kairo: {
      name: 'Kairo',
      country: 'Egypten',
      region: 'afrika',
      lat: 30.04,
      lon: 31.24,
      skyline: 'assets/skylines/skyline.jpg',
      map: 'assets/maps/map1914a.jpg',
      hotel: { name: 'Pension vid Nilen', price: 250 },
      highlights: ['museum', 'khan', 'citadel', 'alazhar'],
      wonders: ['giza'],
      souvenirs: ['papyrus', 'guide_asien'],
      spots: {
        hotel: [20, 78],
        job: [42, 82],
        shop: [62, 80],
        airport: [84, 76],
        signature: [10, 60],
        giza: [14, 36],
        museum: [34, 44],
        khan: [54, 36],
        citadel: [72, 46],
        alazhar: [88, 36]
      },
      signature: {
        name: 'Felucca-segling på Nilen',
        openFrom: 14,
        openUntil: 22,
        cost: 90,
        hours: 2,
        desc: 'Glid fram på Nilen i solnedgången med lokala skeppare (öppet 14:00–22:00) och få ett hett basar- och flygtips!',
        kind: 'deal'
      },
      job: {
        title: 'Guide på nilbåt',
        employer: 'Nile Felucca Tours',
        pay: 450,
        hours: 6,
        questions: [
          { t: 'mc', q: 'Vilket hav ligger norr om Egypten och tar emot Nilens vattenmassor?', a: ['Medelhavet', 'Röda havet', 'Svarta havet', 'Arabiska havet'] },
          { t: 'mc', q: 'Vilken kanal invigdes 1869 och förbinder Medelhavet med Röda havet?', a: ['Suezkanalen', 'Panamakanalen', 'Kielkanalen', 'Korintkanalen'] },
          { t: 'num', q: 'Hur lång är Nilen, mätt i kilometer från sina källor i Östafrika?', ans: 6650, min: 3000, max: 10000, step: 50, unit: 'km' },
          { t: 'mc', q: 'Vilken stor dammbyggnad stod klar 1970 och dämde upp Nassersjön i södra Egypten?', a: ['Assuandammen', 'Karibadammen', 'Atatürkdammmen', 'Akosombodammen'] }
        ]
      }
    },
    delhi: {
      name: 'Delhi',
      country: 'Indien',
      region: 'asien',
      lat: 28.61,
      lon: 77.21,
      skyline: 'assets/photos/redfort.jpg',
      map: 'assets/maps/map_delhi.jpg',
      hotel: { name: 'Paharganj Gästhus', price: 200 },
      highlights: ['redfort', 'qutb', 'indiagate', 'humayun'],
      wonders: ['taj'],
      souvenirs: ['kryddor', 'sjal'],
      spots: {
        hotel: [18, 78],
        job: [38, 82],
        shop: [58, 80],
        airport: [82, 78],
        signature: [10, 60],
        taj: [88, 35],
        redfort: [16, 42],
        qutb: [36, 36],
        indiagate: [54, 46],
        humayun: [72, 38]
      },
      signature: {
        name: 'Kryddauktion (Chandni Chowk)',
        openFrom: 8,
        openUntil: 15,
        cost: 50,
        hours: 1,
        desc: 'Morgonauktion i Gamla Delhi (öppet 08:00–15:00): ropa in en billig kryddpåse eller tjäna en snabb hacka!',
        kind: 'spice'
      },
      job: {
        title: 'Kockbiträde',
        employer: 'Restaurang Karim\'s',
        pay: 400,
        hours: 6,
        questions: [
          { t: 'mc', q: 'Vilken malen rot ger curryblandningar och gyllene dal-grytor dess färg?', a: ['Gurkmeja', 'Saffran', 'Kardemumma', 'Ingefära'] },
          { t: 'mc', q: 'Vad heter Indiens officiella valuta?', a: ['Rupie', 'Rupiah', 'Taka', 'Baht'] },
          { t: 'mc', q: 'I vilken mäktig bergskedja norr om Indien reser sig jordens högsta bergstoppar?', a: ['Himalaya', 'Karakoram', 'Hindukush', 'Altai'] },
          { t: 'mc', q: 'Vilken stad vid Bengaliska viken var huvudstad i Brittiska Indien fram till 1911?', a: ['Calcutta (Kolkata)', 'Bombay (Mumbai)', 'Madras (Chennai)', 'Agra'] }
        ]
      }
    },
    tokyo: {
      name: 'Tokyo',
      country: 'Japan',
      region: 'asien',
      lat: 35.68,
      lon: 139.69,
      skyline: 'assets/photos/tokyotower.jpg',
      map: 'assets/maps/map_tokyo.jpg',
      hotel: { name: 'Kapselhotell i Ueno', price: 650 },
      highlights: ['sensoji', 'tokyotower', 'shibuya', 'meiji'],
      wonders: [],
      souvenirs: ['solfjader', 'kamera'],
      boats: [
        { to: 'sanfrancisco', name: 'Stilla Havs-ångare till San Francisco', days: 8, price: 1500 }
      ],
      spots: {
        hotel: [16, 78],
        job: [34, 82],
        shop: [52, 78],
        airport: [70, 82],
        harbor: [88, 76],
        signature: [10, 60],
        tokyotower: [18, 40],
        sensoji: [40, 46],
        shibuya: [62, 36],
        meiji: [84, 44]
      },
      signature: {
        name: 'Tsukiji Gryningsauktion',
        openFrom: 8,
        openUntil: 11,
        cost: 120,
        hours: 1,
        desc: 'Endast öppen i gryningen (08:00–11:00)! Hjälp en sushimästare välja tonfisk för snabb bonuslön!',
        kind: 'cash'
      },
      job: {
        title: 'Engelsklärare',
        employer: 'Språkskolan Sakura',
        pay: 1000,
        hours: 6,
        questions: [
          { t: 'mc', q: 'Vad hette Tokyo under samurajernas shogunstyre fram till Meijirestaurationen 1868?', a: ['Edo', 'Kyoto', 'Nara', 'Kamakura'] },
          { t: 'mc', q: 'På vilken av Japans fyra stora huvudöar ligger mångmiljonstaden Tokyo?', a: ['Honshu', 'Hokkaido', 'Kyushu', 'Shikoku'] },
          { t: 'mc', q: 'Vad heter Japans valuta?', a: ['Yen', 'Won', 'Yuan', 'Ringgit'] },
          { t: 'mc', q: 'Vilket är Tokyos anrika kejsarpalats som omges av vallgravar mitt i staden?', a: ['Kōkyo', 'Himeji', 'Nijo', 'Osaka-jo'] }
        ]
      }
    },
    sanfrancisco: {
      name: 'San Francisco',
      country: 'USA',
      region: 'amerika',
      lat: 37.77,
      lon: -122.42,
      skyline: 'assets/photos/goldengate.jpg',
      map: 'assets/maps/map_sanfrancisco.jpg',
      hotel: { name: 'Hotel Union Square', price: 650 },
      highlights: ['goldengate', 'alcatraz', 'fishermans', 'chinatown_sf'],
      wonders: ['grandcanyon'],
      souvenirs: ['guide_amerika', 'jeans'],
      spots: {
        hotel: [20, 80],
        job: [40, 82],
        shop: [60, 78],
        airport: [82, 80],
        signature: [10, 60],
        grandcanyon: [14, 36],
        goldengate: [34, 44],
        alcatraz: [54, 36],
        fishermans: [72, 46],
        chinatown_sf: [88, 36]
      },
      signature: {
        name: 'Antikvariatet i North Beach',
        openFrom: 10,
        openUntil: 19,
        cost: 100,
        hours: 1,
        desc: 'Bläddra bland gamla sjökort och reseskildringar (10:00–19:00) för att hitta en hemlig flygrabatt!',
        kind: 'deal'
      },
      job: {
        title: 'Fotograf på turistbåt',
        employer: 'Bay Cruises',
        pay: 950,
        hours: 6,
        questions: [
          { t: 'mc', q: 'Vilket årtal startade guldruschen i Kalifornien som fick tusentals lycksökare att strömma hit?', a: ['1849', '1776', '1812', '1906'] },
          { t: 'mc', q: 'Vilken stor naturkatastrof ödelade stora delar av San Francisco i april 1906?', a: ['En stor jordbävning och efterföljande brand', 'En massiv orkan', 'En tsunami', 'Ett vulkanutbrott'] },
          { t: 'mc', q: 'Vad kallas det globala teknik- och mjukvaruklustret strax söder om staden kring Palo Alto?', a: ['Silicon Valley', 'Napa Valley', 'Death Valley', 'Central Valley'] },
          { t: 'mc', q: 'Vilken delstat i USA tillhör San Francisco?', a: ['Kalifornien', 'Oregon', 'Washington', 'Nevada'] }
        ]
      }
    },
    newyork: {
      name: 'New York',
      country: 'USA',
      region: 'amerika',
      lat: 40.71,
      lon: -74.01,
      skyline: 'assets/photos/empirestate.jpg',
      map: 'assets/maps/map_newyork.jpg',
      hotel: { name: 'Hotel Chelsea', price: 750 },
      highlights: ['liberty', 'empirestate', 'centralpark', 'brooklynbridge'],
      wonders: [],
      souvenirs: ['snoglob', 'taxiskylt'],
      boats: [
        { to: 'stockholm', name: 'Atlantångare mot Göteborg och Stockholm', days: 7, price: 1700 }
      ],
      spots: {
        hotel: [18, 80],
        job: [36, 82],
        shop: [54, 78],
        airport: [72, 82],
        harbor: [88, 76],
        signature: [10, 60],
        liberty: [18, 44],
        empirestate: [40, 36],
        centralpark: [62, 46],
        brooklynbridge: [84, 38]
      },
      signature: {
        name: 'Jazzklubb i Greenwich Village',
        openFrom: 18,
        openUntil: 24,
        cost: 140,
        hours: 2,
        desc: 'Öppnar först på kvällen (18:00–24:00)! Lyssna på livejazz, träffa världsvana gäster och tjäna extra kontakter.',
        kind: 'cash'
      },
      job: {
        title: 'Taxichaufför',
        employer: 'Yellow Cab Co.',
        pay: 1000,
        hours: 6,
        questions: [
          { t: 'mc', q: 'Vilken långsmal ö mellan Hudsonfloden och East River utgör New Yorks historiska hjärta?', a: ['Manhattan', 'Brooklyn', 'Queens', 'Staten Island'] },
          { t: 'mc', q: 'Vad heter den berömda parken som ritades av Frederick Law Olmsted och sträcker sig mitt igenom Manhattan?', a: ['Central Park', 'Prospect Park', 'Hyde Park', 'Battery Park'] },
          { t: 'mc', q: 'Vilken filmklassiker från 1933 gjorde Empire State Building världsberömd genom en klättrande jättegorilla?', a: ['King Kong', 'Godzilla', 'Tarantula', 'Apornas planet'] },
          { t: 'mc', q: 'Hur många stadsdelar (boroughs) består New York City officiellt av?', a: ['5', '4', '7', '12'] }
        ]
      }
    }
  },

  // Höjdpunkter (fakta introducerar platsen – frågorna testar allmänbildning och förståelse runt omkring!)
  places: {
    vasa: {
      name: 'Vasamuseet',
      city: 'stockholm',
      photo: 'assets/photos/vasa.jpg',
      hours: 3,
      fee: 170,
      fact: 'Vasamuseet på Djurgården i Stockholm är ett av Skandinaviens mest besökta museer. Här står 1600-talets mäktigaste krigsskepp bevarat till över 95 procent av originalträet, komplett med hundratals utskurna skulpturer och kanoner.',
      questions: [
        { t: 'mc', q: 'Vilken marinarkeolog och ingenjör lokaliserade Vasas vrak på 32 meters djup år 1956?', a: ['Anders Franzén', 'Carl Gustaf Wrangel', 'Sven Hedin', 'Thor Heyerdahl'] },
        { t: 'mc', q: 'Vilket hårt träslag byggdes skeppet främst av, som motstod skeppsmask i Östersjöns bräckta vatten?', a: ['Ek', 'Furu', 'Gran', 'Bok'] },
        { t: 'num', q: 'Vilket årtal under stormaktstiden kantrade och sjönk Vasa på sin jungfrufärd?', ans: 1628, min: 1550, max: 1750, step: 1, unit: 'år' },
        { t: 'globe', q: 'Peka på 3D-jordgloben: Var ligger Östersjöns grannhuvudstad Helsingfors?', targetLat: 60.17, targetLon: 24.94, targetName: 'Helsingfors', startLat: 56, startLon: 16, explain: 'Helsingfors ligger tvärs över Östersjön från Stockholm och grundades år 1550 av kung Gustav Vasa — farfar till kungen som lät bygga regalskeppet Vasa!' }
      ]
    },
    gamlastan: {
      name: 'Gamla stan',
      city: 'stockholm',
      photo: 'assets/photos/gamlastan.jpg',
      hours: 2,
      fee: 0,
      fact: 'Gamla stan på Stadsholmen har anor från medeltiden och rymmer Kungliga slottet, Storkyrkan och Riddarholmskyrkan. Bland de trånga kullerstensgränderna finns källarvalv och gavelhus från 1500- och 1600-talen.',
      questions: [
        { t: 'mc', q: 'Vad heter Stockholms allra smalaste gränd i Gamla stan, med en bredd på bara 90 cm?', a: ['Mårten Trotzigs gränd', 'Prästgatan', 'Svartmangatan', 'Västerlånggatan'] },
        { t: 'mc', q: 'Vilken dansk unionskung lät avrätta ett 80-tal personer på Stortorget under Stockholms blodbad 1520?', a: ['Kristian II', 'Valdemar Atterdag', 'Kristian IV', 'Hans'] },
        { t: 'mc', q: 'Vilket museum finns i dag inrymt i Börshuset vid Stortorget i Gamla stan?', a: ['Nobelprismuseet', 'Historiska museet', 'Medeltidsmuseet', 'Nationalmuseum'] }
      ]
    },
    museum: {
      name: 'Egyptiska museet',
      city: 'kairo',
      photo: 'assets/photos/museum.jpg',
      hours: 3,
      fee: 150,
      fact: 'Egyptiska museet vid Tahrirtorget i Kairo har i över ett sekel varit världens främsta portal till faraonernas Egypten. Museets salar rymmer sarkofager, mumier, smycken och fynd från tusentals år av nilkultur.',
      questions: [
        { t: 'mc', q: 'Vilken ung faraos nästan intakta guldskatter och grav upptäcktes av Howard Carter 1922?', a: ['Tutankhamon', 'Ramses II', 'Akhenaton', 'Seti I'] },
        { t: 'mc', q: 'Vad heter den berömda svarta stenplatta med grekisk och egyptisk text som gav nyckeln till hieroglyferna?', a: ['Rosettastenen', 'Palermostenen', 'Narmerpaletten', 'Hammurabis stele'] },
        { t: 'mc', q: 'Vilken egyptisk forntida solgud avbildades traditionellt med falkhuvud och en lysande solskiva?', a: ['Ra (Re)', 'Anubis', 'Osiris', 'Sobek'] },
        { t: 'globe', q: 'Peka på 3D-jordgloben: Var mynnar Nilen ut i Medelhavet (Nildeltat)?', targetLat: 31.20, targetLon: 30.80, targetName: 'Nildeltat', startLat: 26, startLon: 25, explain: 'Nildeltat norr om Kairo är ett av världens bördigaste och mest tätbefolkade floddeltan, format under tiotusentals år av bördigt slam från Östafrika.' }
      ]
    },
    khan: {
      name: 'Khan el-Khalili',
      city: 'kairo',
      photo: 'assets/photos/khan.jpg',
      hours: 2,
      fee: 0,
      fact: 'I det medeltida islamiska Kairo breder basaren Khan el-Khalili ut sig som en labyrint av gränder. Här säljs mässingslyktor, doftande kryddor och parfymer, och vid torgen samlas kaffedrickare på sekulära kaféer.',
      questions: [
        { t: 'mc', q: 'Vilken egyptisk författare och nobelpristagare i litteratur (1988) skildrade basarens kvarter i Kairotrilogin?', a: ['Naguib Mahfouz', 'Taha Hussein', 'Alaa al-Aswany', 'Tawfiq al-Hakim'] },
        { t: 'mc', q: 'Vilken syrlig mörkröd tedryck bryggd på torkade hibiskusblommor är en omtyckt egyptisk specialitet?', a: ['Karkadeh', 'Chai', 'Sahlab', 'Mate'] },
        { t: 'mc', q: 'Vilken valuta betalar man med i basarens bodar i Kairo?', a: ['Egyptiskt pund', 'Dinar', 'Dirham', 'Rial'] }
      ]
    },
    citadel: {
      name: 'Citadellet i Kairo',
      city: 'kairo',
      photo: 'assets/photos/mosque.jpg',
      hours: 2,
      fee: 120,
      extra: true,
      fact: 'Från höjden Mokattam blickar den mäktiga medeltida fästningen ut över staden. Innanför vallarna reser sig Muhammad Ali-moskén med sina höga, slanka minareter och en storslagen kupol av alabaster.',
      questions: [
        { t: 'mc', q: 'Vilken berömd muslimsk fältherre och sultan påbörjade bygget av Citadellet under korstågstiden på 1100-talet?', a: ['Saladin', 'Harun al-Rashid', 'Baibars', 'Suleyman den store'] },
        { t: 'mc', q: 'Vad kallas de höga tornen vid en moské varifrån böneutropet traditionellt kungörs?', a: ['Minareter', 'Obelisker', 'Pagoder', 'Stupor'] }
      ]
    },
    redfort: {
      name: 'Röda fortet',
      city: 'delhi',
      photo: 'assets/photos/redfort.jpg',
      hours: 3,
      fee: 80,
      fact: 'Röda fortet (Lal Qila) vid Yamunaflodens kant i Delhi var maktens boning under stormogulernas glansdagar. Bakom de röda sandstensmurarna höll kejsaren audiens i Diwan-i-Am och Diwan-i-Khas.',
      questions: [
        { t: 'mc', q: 'Vilken känd 105-karatig diamant satt en gång i mogulernas Påfågelstron i Delhi innan den togs till England?', a: ['Koh-i-Noor', 'Cullinan', 'Hope-diamanten', 'Daria-i-Noor'] },
        { t: 'mc', q: 'Vad heter den berömda medeltida marknadsgatan strax utanför fortets Lahori-port?', a: ['Chandni Chowk', 'Connaught Place', 'Janpath', 'Rajpath'] },
        { t: 'mc', q: 'Vilken stormogul lät bygga både Röda fortet i Delhi och Taj Mahal i Agra?', a: ['Shah Jahan', 'Akbar den store', 'Babur', 'Aurangzeb'] }
      ]
    },
    qutb: {
      name: 'Qutb Minar',
      city: 'delhi',
      photo: 'assets/photos/qutb.jpg',
      hours: 2,
      fee: 80,
      fact: 'Det arkeologiska området vid Qutb Minar i södra Delhi rymmer Indiens tidigaste islamiska monument. Bredvid den höga räfflade minareten står en järnpelare från 400-talet som har motstått korrosion i sekel efter sekel.',
      questions: [
        { t: 'num', q: 'Hur högt reser sig Qutb Minar-tornet i meter, ungefär?', ans: 73, min: 20, max: 150, step: 1, unit: 'm' },
        { t: 'mc', q: 'Vilken helig flod rinner förbi Delhi och förenar sig senare med Ganges vid Allahabad?', a: ['Yamuna', 'Indus', 'Brahmaputra', 'Narmada'] },
        { t: 'mc', q: 'Vilket årtal förklarade sig Indien självständigt från det brittiska imperiet?', a: ['1947', '1914', '1930', '1962'] }
      ]
    },
    sensoji: {
      name: 'Senso-ji',
      city: 'tokyo',
      photo: 'assets/photos/sensoji.jpg',
      hours: 2,
      fee: 0,
      fact: 'I Tokyos gamla hantverkarkvarter i Asakusa flockas besökare vid Senso-ji. Framför templet står ett rökelsekar där pilgrimer viftar väldoftande rök över huvudet och kroppen för god lycka och hälsa.',
      questions: [
        { t: 'mc', q: 'Vad kallas Japans traditionella inhemska naturreligion med heliga kami (andar) som ofta samspelar med buddhismen?', a: ['Shinto', 'Konfucianism', 'Daoism', 'Brahmanism'] },
        { t: 'mc', q: 'Vad kallas den japanska krigarklass och adel som styrde landet under feodaltiden?', a: ['Samurajer', 'Shoguner', 'Ronin', 'Ninjor'] },
        { t: 'mc', q: 'Vad kallas vårens traditionella körsbärsblomningspicknick i Japan?', a: ['Hanami', 'Matsuri', 'Obon', 'Tanabata'] }
      ]
    },
    tokyotower: {
      name: 'Tokyo Tower',
      city: 'tokyo',
      photo: 'assets/photos/tokyotower.jpg',
      hours: 2,
      fee: 140,
      fact: 'Tokyo Tower är ett av Japans mest ikoniska moderna landmärken. Målat i slående orange och vitt reser det sig över Minato och fungerar både som sändarmast och utsiktsplats med milsvid vy över metropolen.',
      questions: [
        { t: 'mc', q: 'Vilket snötäckt vulkanberg sydväst om Tokyo kan man skymta från tornet klara vinterdagar?', a: ['Fuji', 'Aso', 'Tateyama', 'Ontake'] },
        { t: 'mc', q: 'Vad heter Japans berömda snabbtåg som binder samman Tokyo med Kyoto och Osaka?', a: ['Shinkansen', 'Maglev', 'TGV', 'Nozomi Express'] },
        { t: 'num', q: 'Hur många meter högt är Tokyo Tower?', ans: 333, min: 100, max: 600, step: 1, unit: 'm' },
        { t: 'globe', q: 'Peka på 3D-jordgloben: Var ligger vulkanen Fuji i Japan?', targetLat: 35.36, targetLon: 138.73, targetName: 'Berget Fuji', startLat: 35, startLon: 132, explain: 'Berget Fuji (3 776 m) ligger cirka 100 kilometer sydväst om Tokyo på ön Honshu och har varit en helig pilgrimsdestination i över tusen år.' }
      ]
    },
    goldengate: {
      name: 'Golden Gate-bron',
      city: 'sanfrancisco',
      photo: 'assets/photos/goldengate.jpg',
      hours: 2,
      fee: 0,
      fact: 'Golden Gate-bron spänner över det djupa sundet där Stilla havet möter San Franciscobukten. Brons ståltrådskablar och art déco-torn har blivit en av den amerikanska västkustens mest fotograferade silhuetter.',
      questions: [
        { t: 'mc', q: 'Vilket personnamn har lokalbefolkningen och meteorologerna gett den återkommande sommar-dimman i bukten?', a: ['Karl the Fog', 'Foggy Jack', 'Pacific Pete', 'Misty Sam'] },
        { t: 'mc', q: 'Vilken kabeldragen klassisk spårvagnstyp klättrar upp och ner för San Franciscos branta gator?', a: ['Cable Car', 'Trolleybus', 'MUNI Tram', 'Metro Liner'] },
        { t: 'mc', q: 'Vilken färg har brons skyddslack officiellt?', a: ['International Orange', 'California Rust', 'Pacific Red', 'Golden Sun'] }
      ]
    },
    alcatraz: {
      name: 'Alcatraz',
      city: 'sanfrancisco',
      photo: 'assets/photos/alcatraz.jpg',
      hours: 3,
      fee: 350,
      fact: 'Klippön "The Rock" mitt i San Franciscobukten har en dramatisk historia som militärfästning och ökänt federalt högsäkerhetsfängelse. De kalla vattendragen och oberäkneliga havsströmmarna omöjliggjorde flyktförsök.',
      questions: [
        { t: 'mc', q: 'Vilken Chicagogangster känd under smeknamnet "Scarface" avtjänade straff på Alcatraz på 1930-talet?', a: ['Al Capone', 'Lucky Luciano', 'Bugsy Siegel', 'John Dillinger'] },
        { t: 'mc', q: 'Vilken fånge och morddömd man blev känd över hela världen som "The Birdman of Alcatraz"?', a: ['Robert Stroud', 'Frank Morris', 'George Kelly', 'Alvin Karpis'] },
        { t: 'num', q: 'Vilket årtal under 1960-talet stängdes fängelset för gott?', ans: 1963, min: 1940, max: 1980, step: 1, unit: 'år' }
      ]
    },
    liberty: {
      name: 'Frihetsgudinnan',
      city: 'newyork',
      photo: 'assets/photos/liberty.jpg',
      hours: 3,
      fee: 280,
      fact: 'På Liberty Island vid inloppet till New Yorks hamn står statyn "Friheten upplyser världen". Statyn var en gåva från Frankrike och restes som ett monument över frihet och det amerikanska självständighetsarbetet.',
      questions: [
        { t: 'mc', q: 'Vilken närliggande ö tog emot över tolv miljoner immigranter vid sin mottagningsstation 1892–1954?', a: ['Ellis Island', 'Governors Island', 'Roosevelt Island', 'Staten Island'] },
        { t: 'mc', q: 'Vad symboliserar de sju strålarna på Frihetsgudinnans krona?', a: ['De sju världshaven och kontinenterna', 'De sju dygderna', 'De sju ursprungliga kolonierna', 'De sju grundlagsfäderna'] },
        { t: 'mc', q: 'Vilken fransk ingenjör konstruerade statyns inre bärande stålram innan han ritade sitt kända torn i Paris?', a: ['Gustave Eiffel', 'Ferdinand de Lesseps', 'Le Corbusier', 'Eugène Viollet-le-Duc'] },
        { t: 'globe', q: 'Peka på 3D-jordgloben: Var ligger Paris, staden där Frihetsgudinnan byggdes och skeppades ifrån?', targetLat: 48.86, targetLon: 2.35, targetName: 'Paris', startLat: 45, startLon: 5, explain: 'Frihetsgudinnan byggdes först i full skala i Paris 1884, plockades sedan isär i 350 koppar- och järndelar och skeppades i 214 trälådor över Atlanten!' }
      ]
    },
    empirestate: {
      name: 'Empire State Building',
      city: 'newyork',
      photo: 'assets/photos/empirestate.jpg',
      hours: 2,
      fee: 380,
      fact: 'Empire State Building på Manhattan byggdes i rekordfart under den stora depressionens inledning 1930–1931. Den ståtliga art déco-byggnaden reser sig med spiran mot skyn och är en symbol för New Yorks ambitioner.',
      questions: [
        { t: 'mc', q: 'Vad kallas New Yorks legendariska teater- och nöjeskvarter strax norr om skyskrapan vid Broadway?', a: ['Times Square / Theater District', 'Wall Street', 'SoHo', 'Greenwich Village'] },
        { t: 'mc', q: 'Vad var skyskrapans högsta metallspira ursprungligen tänkt att användas som, innan idén övergavs?', a: ['Förtöjningsmast för luftskepp (zeppelinare)', 'Radioteleskop', 'Blixtfångare för kraftverk', 'Utsiktsbalkong för fallskärmshoppare'] },
        { t: 'mc', q: 'Vad heter den finansiella gatan på södra Manhattan där New York-börsen (NYSE) är belägen?', a: ['Wall Street', 'Broadway', 'Fifth Avenue', 'Madison Avenue'] }
      ]
    },
    // --- NYA SEVÄRDHETER (4 per stad, alla med egna unika Wikimedia Commons-foton!) ---
    skansen: {
      name: 'Skansen',
      city: 'stockholm',
      photo: 'assets/photos/skansen.jpg',
      hours: 3,
      fee: 195,
      fact: 'På Djurgårdens höjd ligger världens äldsta friluftsmuseum, där historiska gårdar, verkstäder och nordiska djur samlats för att visa livet i Sverige före industrialismen.',
      questions: [
        { t: 'mc', q: 'Vem grundade Skansen och Nordiska museet i slutet av 1800-talet?', a: ['Artur Hazelius', 'Anders Zorn', 'Carl Larsson', 'Alfred Nobel'] },
        { t: 'mc', q: 'Vilken sommartradition direktsänds varje tisdag från Sollidenscenen på Skansen?', a: ['Allsång på Skansen', 'Melodifestivalen', 'Sommar i P1', 'Midnattssolsrallyt'] },
        { t: 'num', q: 'Vilket årtal öppnade Skansen sina portar för första gången?', ans: 1891, min: 1850, max: 1930, step: 1, unit: 'år' }
      ]
    },
    stadshuset: {
      name: 'Stockholms stadshus',
      city: 'stockholm',
      photo: 'assets/photos/stadshuset.jpg',
      hours: 2,
      fee: 140,
      fact: 'Vid Riddarfjärdens strand reser sig den mäktiga tegelbyggnaden i nationalromantisk stil, krönt av ett högt torn med de tre förgyllda kronorna som speglar sig i vattnet.',
      questions: [
        { t: 'mc', q: 'Vad heter den stora röda tegelsalen i Stadshuset där Nobelbanketten hålls varje år den 10 december?', a: ['Blå hallen', 'Gyllene salen', 'Rikssalen', 'Prinsens galleri'] },
        { t: 'mc', q: 'Hur många miljoner handslagna tegelstenar gick det ungefär åt för att bygga Stadshuset?', a: ['Cirka 8 miljoner', 'Cirka 500 000', 'Cirka 2 miljoner', 'Cirka 40 miljoner'] },
        { t: 'num', q: 'Hur högt är Stadshustornet i meter, upp till spetsen av Tre Kronor?', ans: 106, min: 50, max: 180, step: 1, unit: 'm' }
      ]
    },
    alazhar: {
      name: 'Al-Azhar-moskén',
      city: 'kairo',
      photo: 'assets/photos/alazhar.jpg',
      hours: 2,
      fee: 60,
      fact: 'Mitt i det historiska Kairo ligger en av världens äldsta fortfarande verksamma högre lärosäten och moskéer, känd för sin ljusa marmorgård och sina sekelgamla koranskolor.',
      questions: [
        { t: 'mc', q: 'Under vilken shiamuslimsk dynasti grundades Kairo och Al-Azhar på 970-talet?', a: ['Fatimiderna', 'Umayyaderna', 'Abbasiderna', 'Osmanska riket'] },
        { t: 'mc', q: 'Vilket skriftspråk skrivs från höger till vänster och är Egyptens officiella språk?', a: ['Arabiska', 'Koptiska', 'Farsi', 'Arameiska'] }
      ]
    },
    indiagate: {
      name: 'India Gate',
      city: 'delhi',
      photo: 'assets/photos/indiagate.jpg',
      hours: 2,
      fee: 0,
      fact: 'I hjärtat av New Delhi reser sig den monumentala triumfbågen i gul sandsten längs paradgatan Kartavya Path. På kvällarna samlas tusentals familjer i parkerna runt monumentet.',
      questions: [
        { t: 'mc', q: 'Vilken brittisk arkitekt ritade stora delar av New Delhi och själva India Gate?', a: ['Edwin Lutyens', 'Christopher Wren', 'Norman Foster', 'John Nash'] },
        { t: 'mc', q: 'Till minne av vilka soldater restes India Gate ursprungligen på 1920-talet?', a: ['Indiska soldater som stupade i första världskriget', 'Mogulrikets kavalleri', 'Självständighetsrörelsen 1947', 'Handelsflottans sjömän'] }
      ]
    },
    humayun: {
      name: 'Humayuns grav',
      city: 'delhi',
      photo: 'assets/photos/humayun.jpg',
      hours: 2,
      fee: 90,
      fact: 'Detta praktfulla trädgårdsmausoleum i röd sandsten och vit marmor var den första stora gravbyggnaden av sitt slag på den indiska subkontinenten och satte mönstret för senare mogularkitektur.',
      questions: [
        { t: 'mc', q: 'Vilken ännu mer berömd byggnad i Agra inspirerades direkt av Humayuns grav hundra år senare?', a: ['Taj Mahal', 'Röda fortet', 'Hawa Mahal', 'Lotus-templet'] },
        { t: 'mc', q: 'Vilken världsorganisation har utsett Humayuns grav till världsarv?', a: ['UNESCO', 'WHO', 'UNICEF', 'WTO'] }
      ]
    },
    shibuya: {
      name: 'Shibuya Crossing',
      city: 'tokyo',
      photo: 'assets/photos/shibuya.jpg',
      hours: 2,
      fee: 0,
      fact: 'Utanför Shibuya-stationen i Tokyo strömmar hundratals fotgängare över gatan från alla håll samtidigt så fort trafikljusen slår om, omgivna av jättelika reklamskärmar och neonskyltar.',
      questions: [
        { t: 'mc', q: 'Vilken berömd trogen hund står staty utanför Shibuya-stationen som en populär mötesplats?', a: ['Hachiko', 'Shiba', 'Kuro', 'Taro'] },
        { t: 'mc', q: 'Vad heter den kända lokala järnvägslinjen i ringform som förbinder Shibuya, Shinjuku och Tokyo Station?', a: ['Yamanote-linjen', 'Ginza-linjen', 'Tokaido-linjen', 'Chuo-linjen'] }
      ]
    },
    meiji: {
      name: 'Meiji-helgedomen',
      city: 'tokyo',
      photo: 'assets/photos/meiji.jpg',
      hours: 2,
      fee: 0,
      fact: 'Bara ett stenkast från Harajukus myller leder en bred grusgång genom en tät, stillsam skog av över 100 000 planterade träd in till en av Tokyos viktigaste shintohelgedomar.',
      questions: [
        { t: 'mc', q: 'Vad kallas de stora traditionella träportarna som markerar ingången till en shintohelgedom?', a: ['Torii', 'Pagod', 'Tatami', 'Origami'] },
        { t: 'mc', q: 'Under vilken epok (1868–1912) öppnades Japan mot omvärlden och moderniserades i rasande takt?', a: ['Meijiperioden', 'Edoperioden', 'Heianperioden', 'Showaperioden'] }
      ]
    },
    fishermans: {
      name: 'Fisherman\'s Wharf',
      city: 'sanfrancisco',
      photo: 'assets/photos/fishermans.jpg',
      hours: 2,
      fee: 0,
      fact: 'Längs San Franciscos norra hamnkaj ligger pirer fulla av fiskrestauranger, historiska fartyg och högljudda sjölejon som solar sig på flytbryggorna vid Pier 39.',
      questions: [
        { t: 'mc', q: 'Vilken syrlig brödsort är San Francisco världsberömt för, ofta serverad urgröpt med musselsoppa?', a: ['Surdegsbröd (Sourdough)', 'Brioche', 'Pumpernickel', 'Ciabatta'] },
        { t: 'mc', q: 'Vilket stort världshav ligger precis väster om San Francisco?', a: ['Stilla havet', 'Atlanten', 'Indiska oceanen', 'Karibiska havet'] }
      ]
    },
    chinatown_sf: {
      name: 'Chinatown & Lombard St',
      city: 'sanfrancisco',
      photo: 'assets/photos/lombard.jpg',
      hours: 2,
      fee: 0,
      fact: 'San Franciscos Chinatown är Nordamerikas äldsta kinesiska stadsdel, med drakportar, tebutiker och lyktor. Strax intill slingrar sig den branta, blomsterkantade serpentingatan Lombard Street.',
      questions: [
        { t: 'mc', q: 'Vilken känd lyckokaka som ofta serveras på kinesiska restauranger i väst har sitt ursprung i Kalifornien?', a: ['Fortune cookie (lyckokaka)', 'Månkaka', 'Macaron', 'Mochi'] },
        { t: 'num', q: 'Hur många skarpa hårnålskurvor har den berömda branta delen av Lombard Street?', ans: 8, min: 2, max: 20, step: 1, unit: 'kurvor' }
      ]
    },
    centralpark: {
      name: 'Central Park',
      city: 'newyork',
      photo: 'assets/photos/centralpark.jpg',
      hours: 2,
      fee: 0,
      fact: 'Mitt bland Manhattans skyskrapor breder en enorm grön oas ut sig med sjöar, broar, löparspår och utomhusscener som fungerar som New York-bornas gemensamma bakgård.',
      questions: [
        { t: 'mc', q: 'Vilken tidigare Beatles-medlem hedras i minneslunden "Strawberry Fields" i Central Park?', a: ['John Lennon', 'George Harrison', 'Paul McCartney', 'Ringo Starr'] },
        { t: 'mc', q: 'Vilket världsberömt konstmuseum ligger direkt längs Central Parks östra sida på Fifth Avenue?', a: ['Metropolitan Museum of Art (The Met)', 'Tate Modern', 'Louvren', 'Pradomuseet'] }
      ]
    },
    brooklynbridge: {
      name: 'Brooklyn Bridge',
      city: 'newyork',
      photo: 'assets/photos/brooklynbridge.jpg',
      hours: 2,
      fee: 0,
      fact: 'Den ikoniska hängbron i nygotisk stil med sina väldiga stenvalv och stålkablar binder samman Manhattan med Brooklyn över East River och har en upphöjd gångbana för fotgängare.',
      questions: [
        { t: 'mc', q: 'Vilket vattendrag spänner Brooklyn Bridge över?', a: ['East River', 'Hudsonfloden', 'Harlem River', 'Potomac'] },
        { t: 'num', q: 'Vilket årtal på 1800-talet invigdes Brooklyn Bridge som världens då längsta hängbro?', ans: 1883, min: 1840, max: 1920, step: 1, unit: 'år' }
      ]
    }
  },

  // Underverk (exkursioner utanför staden)
  wonders: {
    giza: {
      name: 'Pyramiderna i Giza',
      from: 'kairo',
      region: 'afrika',
      lat: 29.98,
      lon: 31.13,
      photo: 'assets/photos/pyramids.jpg',
      hoursEach: 1,
      transport: 70,
      fee: 220,
      visitHours: 4,
      souvenir: 'skarabe',
      lodge: 320,
      fact: 'Gizaplatån i ökenbrynet väster om Nilen domineras av faraonernas monumentala gravar från det gamla riket. Området vittnar om enastående arkitektonisk och astronomisk precision för över 4 500 år sedan.',
      questions: [
        { t: 'mc', q: 'Vilket mytologiskt lejonväsen med faraonskt mansansikte vaktar östra infarten till Gizas gravar?', a: ['Stora sfinxen', 'Griffen', 'Anubis-statyn', 'Horusfalken'] },
        { t: 'mc', q: 'Vilken grekisk antik historiker reste i Egypten på 400-talet f.Kr. och skildrade pyramidbyggena?', a: ['Herodotos', 'Homeros', 'Platon', 'Thukydides'] },
        { t: 'num', q: 'Hur många av antikens ursprungliga sju underverk finns kvar i bevarat skick i dag?', ans: 1, min: 0, max: 7, step: 1, unit: 'st' }
      ]
    },
    taj: {
      name: 'Taj Mahal',
      from: 'delhi',
      region: 'asien',
      lat: 27.17,
      lon: 78.04,
      photo: 'assets/photos/taj.jpg',
      hoursEach: 4,
      transport: 320,
      fee: 280,
      visitHours: 3,
      souvenir: 'marmorask',
      lodge: 260,
      fact: 'Taj Mahal vid floden Yamuna i Agra är känt över hela jorden för sina reflekterande spegeldammar, minareter och fasader i vit Makrana-marmor med ädelstensornament i form av blommor och arabesker.',
      questions: [
        { t: 'mc', q: 'I vilken indisk stad strax söder om Delhi ligger Taj Mahal?', a: ['Agra', 'Jaipur', 'Varanasi', 'Lucknow'] },
        { t: 'mc', q: 'Vad kallas den persiskt inspirerade symmetriska trädgårdsformen i fyra kvadranter som omger mausoleet?', a: ['Charbagh (fyrdelad paradisträdgård)', 'Mandala-park', 'Zen-trädgård', 'Engelsk park'] },
        { t: 'mc', q: 'Vilken brittisk kunglighet fotograferades ensam och melankolisk framför Taj Mahal 1992 i en världsberömd bild?', a: ['Prinsessan Diana', 'Drottning Elizabeth II', 'Drottning Victoria', 'Prinsessan Margaret'] }
      ]
    },
    grandcanyon: {
      name: 'Grand Canyon',
      from: 'sanfrancisco',
      region: 'amerika',
      lat: 36.06,
      lon: -112.14,
      photo: 'assets/photos/grandcanyon.jpg',
      hoursEach: 8,
      transport: 850,
      fee: 320,
      visitHours: 8,
      gearVisitHours: 3,
      gear: 'kangor',
      souvenir: 'fossil',
      lodge: 450,
      fact: 'Grand Canyon skär som ett gigantiskt ärr genom Coloradoplatån och visar upp flera miljarder år av geologiska tidsåldrar. Från South Rim till kanjonens botten är höjdskillnaden över 1 500 meter med extrema temperaturskillnader.',
      questions: [
        { t: 'mc', q: 'Vilket ursprungsamerikanskt folk har sin avskilda by Supai i botten av kanjonen vid Havasu-fallen?', a: ['Havasupai', 'Navajo', 'Cherokee', 'Sioux'] },
        { t: 'mc', q: 'Vilken amerikansk president och ivrig naturvårdare bidrog avgörande till att skydda kanjonen 1908?', a: ['Theodore Roosevelt', 'Abraham Lincoln', 'George Washington', 'Thomas Jefferson'] },
        { t: 'mc', q: 'Vilken mäktig flod har under årmiljonerna mejslat ut Grand Canyons branta klyftor?', a: ['Coloradofloden', 'Mississippi', 'Rio Grande', 'Columbiafloden'] }
      ]
    }
  },

  // Souvenirer
  souvenirs: {
    dalahast: {
      name: 'Dalahäst',
      origin: 'stockholm',
      price: 150,
      kind: 'samlar',
      desc: 'Klassisk röd trähäst från Dalarna. Högt samlarvärde på hemmamuseet.'
    },
    kangor: {
      name: 'Vandringskängor',
      origin: 'stockholm',
      price: 550,
      kind: 'utrustning',
      effect: 'Grand Canyon tar bara 3 timmar istället för 8!',
      desc: 'Robusta läderkängor som skyddar fötterna i oländig terräng.'
    },
    papyrus: {
      name: 'Papyrusrulle',
      origin: 'kairo',
      price: 90,
      kind: 'samlar',
      desc: 'Äkta handmålad papyrus med hieroglyfer från Nildeltat.'
    },
    guide_asien: {
      name: 'Guidebok Asien',
      origin: 'kairo',
      price: 220,
      kind: 'kunskap',
      region: 'asien',
      uses: 3,
      effect: 'Stryker ett felaktigt svarsalternativ på frågor i Asien (3 ggr).',
      desc: 'Fylld med kartor och historisk kuriosa över Asiens resmål.'
    },
    kryddor: {
      name: 'Påse kryddor',
      origin: 'delhi',
      price: 70,
      kind: 'handel',
      desc: 'Doftande kryddblandning. Mycket billig här, hett eftertraktad i västvärlden!'
    },
    sjal: {
      name: 'Sidensjal',
      origin: 'delhi',
      price: 240,
      kind: 'samlar',
      desc: 'Handvävd mjuk sjal i skimrande orientaliskt mönster.'
    },
    solfjader: {
      name: 'Solfjäder',
      origin: 'tokyo',
      price: 110,
      kind: 'samlar',
      desc: 'Traditionell japansk bambusolfjäder med körsbärsblommor.'
    },
    kamera: {
      name: 'Kamera',
      origin: 'tokyo',
      price: 850,
      kind: 'yrke',
      effect: 'Yrkesverktyg: ger +50 % bonuslön på alla jobbpass!',
      desc: 'En japansk kvalitetskamera som gör dig mer eftertraktad på arbetsmarknaden.'
    },
    guide_amerika: {
      name: 'Guidebok Amerika',
      origin: 'sanfrancisco',
      price: 220,
      kind: 'kunskap',
      region: 'amerika',
      uses: 3,
      effect: 'Stryker ett felaktigt svarsalternativ på frågor i Amerika (3 ggr).',
      desc: 'Detaljerad guidebok över Nordamerikas sevärdheter och historia.'
    },
    jeans: {
      name: 'Jeans',
      origin: 'sanfrancisco',
      price: 160,
      kind: 'samlar',
      desc: 'Slitstarka blåjeans med nitar, skapade i guldruschens spår.'
    },
    snoglob: {
      name: 'Snöglob Manhattan',
      origin: 'newyork',
      price: 70,
      kind: 'samlar',
      desc: 'Klassisk souvenir med New Yorks silhuett i virvlande snö.'
    },
    taxiskylt: {
      name: 'Taxiskylt NYC',
      origin: 'newyork',
      price: 130,
      kind: 'samlar',
      desc: 'En ikonisk gul taxiskylt från en Yellow Cab på Broadway.'
    },
    skarabe: {
      name: 'Skarabé i sten',
      origin: 'giza',
      price: 140,
      kind: 'samlar',
      desc: 'Utskuren helig skalbagge funnen vid Gizas monumentala gravar.'
    },
    marmorask: {
      name: 'Marmorask',
      origin: 'taj',
      price: 250,
      kind: 'samlar',
      desc: 'Utsökt ask i vit marmor med halvädelstenar från mästarna i Agra.'
    },
    fossil: {
      name: 'Kanjonfossil',
      origin: 'grandcanyon',
      price: 180,
      kind: 'samlar',
      desc: 'Ett urgammalt förstenat avtryck från Coloradoflodens djupaste lager.'
    }
  },

  // Aktiva världshändelser som syns på 3D-jordgloben och påverkar ekonomi/resor
  worldEvents: [
    {
      id: 'cherry_blossom',
      city: 'tokyo',
      title: 'Körsbärsblomning',
      startDay: 1,
      endDay: 10,
      effectText: '+40 % lön på jobb och +25 % på souvenirer i Tokyo!',
      jobBonus: 0.40,
      sellBonus: 0.25,
      color: '#ff8fb1'
    },
    {
      id: 'cairo_bazaar',
      city: 'kairo',
      title: 'Stor Basarvecka',
      startDay: 2,
      endDay: 12,
      effectText: '20 % lägre inköpspriser på alla varor i Kairos basar!',
      buyDiscount: 0.20,
      color: '#f5b041'
    },
    {
      id: 'ny_strike',
      city: 'newyork',
      title: 'Flygstrejk i NYC',
      startDay: 5,
      endDay: 15,
      effectText: '+25 % dyrare flyg till New York, men +35 % extra jobblön!',
      flightMult: 1.25,
      jobBonus: 0.35,
      color: '#e74c3c'
    },
    {
      id: 'delhi_monsoon',
      city: 'delhi',
      title: 'Monsun över Delhi',
      startDay: 8,
      endDay: 22,
      effectText: '20 % billigare flyg till Delhi under monsunsäsongen!',
      flightMult: 0.80,
      color: '#5dade2'
    },
    {
      id: 'sf_jazz',
      city: 'sanfrancisco',
      title: 'Jazzfestival i SF',
      startDay: 10,
      endDay: 28,
      effectText: 'Besökare betalar +35 % extra för souvenirer i San Francisco!',
      sellBonus: 0.35,
      color: '#af7ac5'
    }
  ],

  // Lokala basarhandlare för prutning och 90-talscharm
  shopkeepers: {
    stockholm: { name: 'Antik-Bengt på Västerlånggatan', greet: 'Välkommen in från blåsten! Här finns bara äkta svenskt hantverk — men visst går det att diskutera priset.' },
    kairo: { name: 'Farid i Khan el-Khalili', greet: 'Ahlan wa sahlan, min vän! Sätt dig ner på ett glas myntate. Mitt första pris är bara början på samtalet!' },
    delhi: { name: 'Ramesh på Chandni Chowk', greet: 'Namaste! Kryddor, siden och historier. Visa att du kan konsten att pruta så blir vi vänner!' },
    tokyo: { name: 'Mästare Kenji i Asakusa', greet: 'Irasshaimase. Kvalitet har sitt pris, men en artig resenär kan ibland få en liten rabatt.' },
    sanfrancisco: { name: 'Babs vid Fisherman\'s Wharf', greet: 'Hej där, globetrotter! Ska du ut i vildmarken eller bara handla minnen? Ge mig ett schysst bud!' },
    newyork: { name: 'Sal på Canal Street', greet: 'Ey! Snabba ryck här på Manhattan. Vill du pruta? Kom med ett bud innan taxin tutar!' }
  },

  // Vandrarhemmets gästbok (tips & skvaller från andra resenärer)
  guestbook: {
    stockholm: [
      { author: 'Maja, Uppsala', note: 'Tips: Köp vandringskängor här innan du siktar på Grand Canyon — sparar massor av timmar!' },
      { author: 'Lasse-89', note: 'Dalahästen sålde för nästan tredubbla priset borta i Tokyo. Ta med en!' }
    ],
    kairo: [
      { author: 'Sven & Karin', note: 'Glöm inte att pruta med Farid i basaren! Han älskar ett bud runt 15–20 % under utgångspriset.' },
      { author: 'Amina, Tunis', note: 'Kolla 3D-jordgloben! Det ryktas om festivaler och blomning österut just nu.' }
    ],
    delhi: [
      { author: 'Pelle på vift', note: 'Kryddpåsarna här kostar nästan ingenting men ger grym vinst i New York eller Stockholm.' },
      { author: 'Hanna', note: 'Spara lite tid till Taj Mahal — utflykten tar nästan en hel dag men är värd varenda krona!' }
    ],
    tokyo: [
      { author: 'Kalle-Foto', note: 'Kameran i basaren är dyr, men +50 % på alla jobbpass betalar igen sig blixtsnabbt.' },
      { author: 'Yuki', note: 'Ont om pengar mot USA? Ta Stilla Havs-ångaren från hamnen istället för dyrt flyg!' }
    ],
    sanfrancisco: [
      { author: 'Tove, Göteborg', note: 'Om du inte har kängor till Grand Canyon går det ändå, men det äter upp två extra timmar.' },
      { author: 'Mike', note: 'Guideboken för Amerika räddade mig på en svår fråga på Alcatraz!' }
    ],
    newyork: [
      { author: 'Astrid', note: 'Kolla alltid efter sista-minuten-lappen på flygplatsen. Sparade 600 kr hem till Stockholm!' },
      { author: 'Diego', note: 'Sälj asiatiska souvenirer här — Manhattan betalar toppris för långväga saker.' }
    ]
  },

  // Hotellets lokala pub / kafé / tehus (Realms of Arkania-känsla!)
  taverns: {
    stockholm: { name: 'Skeppsholmens Ölstuga', drink: 'en runda kall öl & kanelbullar', drinkCost: 140, vibe: 'Träbänkar, skärgårdskartor på väggarna och sorl från sjömän och backpackers.' },
    kairo: { name: 'Nilens Tehus & Terrass', drink: 'en kanna myntate & baklava', drinkCost: 80, vibe: 'Mässingslyktor, backgammonbräden och doft av kardemumma ut mot Nilen.' },
    delhi: { name: 'Paharganj Chai-Bar', drink: 'ryckande het masala chai till bordet', drinkCost: 60, vibe: 'Taktfast musik, färgglada affischer och resenärer som byter tågtips.' },
    tokyo: { name: 'Ueno Izakaya', drink: 'en runda kall sake & yakitori-spett', drinkCost: 160, vibe: 'Röda papperslyktor, fräsande grill och vänliga stamgäster vid bardisken.' },
    sanfrancisco: { name: 'Union Square Saloon', drink: 'en runda lokal craft beer', drinkCost: 150, vibe: 'Dämpad jazz från jukeboxen, mörkt mahognyträ och äventyrare på väg västerut.' },
    newyork: { name: 'Chelsea Bar & Jazzlounge', drink: 'en runda vid bardisken', drinkCost: 170, vibe: 'Neonsken genom fönstret, klirrande glas och snabba historier från hela världen.' }
  },

  // Stafettuppdrag (Kurirpaket mellan städer som hittas i hotellbaren!)
  relayQuests: [
    {
      id: 'relay_sthlm_kairo',
      from: 'stockholm',
      to: 'kairo',
      giver: 'Sjökapten Holm',
      itemName: 'Förseglad sjökortsrulle',
      desc: 'Ta med min gamla sjökortsrulle till min vän i Kairo. Den tar 1 plats i ryggsäcken!',
      rewardCash: 950,
      freeHotel: true
    },
    {
      id: 'relay_kairo_delhi',
      from: 'kairo',
      to: 'delhi',
      giver: 'Kryddhandlaren Hassan',
      itemName: 'Saffransburk i mässing',
      desc: 'Min svåger i Delhi väntar på en sällsynt saffransburk. Kan du leverera den dit?',
      rewardCash: 1050,
      freeHotel: true
    },
    {
      id: 'relay_delhi_tokyo',
      from: 'delhi',
      to: 'tokyo',
      giver: 'Antikvariatsägaren Priya',
      itemName: 'Handskrivet pergamentbrev',
      desc: 'En samlare i Tokyo betalar bra om du tar med detta brev hela vägen till Ueno.',
      rewardCash: 1250,
      freeHotel: true
    },
    {
      id: 'relay_tokyo_sf',
      from: 'tokyo',
      to: 'sanfrancisco',
      giver: 'Fotografen Kenji',
      itemName: 'Oframkallad filmrulle',
      desc: 'Ta denna unika filmrulle över Stilla havet till min kollega i San Francisco!',
      rewardCash: 1400,
      freeHotel: true
    },
    {
      id: 'relay_sf_ny',
      from: 'sanfrancisco',
      to: 'newyork',
      giver: 'Jazzmusikern Miles',
      itemName: 'Sällsynt vinylskiva',
      desc: 'En klubbägare i Chelsea, New York, letar efter denna pressning. Leverera den hel!',
      rewardCash: 1150,
      freeHotel: true
    },
    {
      id: 'relay_ny_sthlm',
      from: 'newyork',
      to: 'stockholm',
      giver: 'Journalisten Clara',
      itemName: 'Gul kuvertportfölj',
      desc: 'Ska du hem mot Stockholm? Lämna denna portfölj på Skeppsholmen mot fin hittelön!',
      rewardCash: 1300,
      freeHotel: true
    }
  ],

  // Fördjupade "Visste du att?"-beskrivningar som visas efter svar (nyckel = exakt rätt svar)
  answerExplanations: {
    'Anders Franzén': 'Marinarkeologen Anders Franzén (1918–1993) letade efter Vasa i flera år genom att dra ett egenkonstruerat lod över Stockholms ström. År 1956 fick han upp en bit svartnad ek — och 1961 bärgades hela skeppet efter 333 år på botten.',
    'Ek': 'Skeppet Vasa byggdes av över 1 000 utvalda ekar. Eftersom Östersjöns vatten är bräckt trivs inte skeppsmasken (Teredo navalis) här, vilket är huvudorsaken till att skrovet är så otroligt välbevarat.',
    'Mårten Trotzigs gränd': 'Mårten Trotzigs gränd i Gamla stan är uppkallad efter en tysk köpman från 1500-talet. Gränden har 36 trappsteg och smalnar av till endast 90 centimeter på sitt trängsta ställe.',
    'Kristian II': 'Under Stockholms blodbad i november 1520 lät unionskungen Kristian II (i Sverige kallad Kristian Tyrann) avrätta över 80 adelsmän och borgare på Stortorget — en händelse som utlöste Gustav Vasas uppror.',
    'Nobelprismuseet': 'I det praktfulla Börshuset från 1776 vid Stortorget huserar både Svenska Akademien och Nobelprismuseet, där pristagarnas egna föremål och signaturer under kaféstolarna visas upp.',
    'Artur Hazelius': 'Filologen och folklivsforskaren Artur Hazelius (1833–1901) skapade både Nordiska museet och Skansen för att rädda det gamla svenska allmogearvet innan industrialiseringen suddade ut det.',
    'Blå hallen': 'Trots namnet är Blå hallen i Stockholms stadshus helt i varmt rött tegel! Arkitekten Ragnar Östberg hade ursprungligen tänkt putsa väggarna blå, men föll så handlöst för teglets lyster att han lät det vara omålat.',
    'Tutankhamon': 'Den unge faraon Tutankhamon dog bara omkring 19 år gammal cirka 1323 f.Kr. När arkeologen Howard Carter öppnade hans orörda grav i Konungarnas dal 1922 hittades över 5 000 föremål, däribland den 11 kilo tunga dödsmasken i massivt guld.',
    'Rosettastenen': 'Rosettastenen hittades av franska soldater 1799 och bär samma dekret på tre skriftspråk: hieroglyfer, demotisk skrift och forngrekiska. Det gjorde att språkforskaren Jean-François Champollion kunde knäcka hieroglyfernas gåta 1822.',
    'Ra (Re)': 'Solguden Ra färdades enligt egyptisk mytologi över himlen i sin solbåt varje dag och genom underjorden varje natt. Faraonerna kallade sig själva "Ras son" för att visa sin gudomliga rätt att härska.',
    'Naguib Mahfouz': 'Naguib Mahfouz (1911–2006) blev 1988 den första arabiskspråkiga författaren som tilldelades Nobelpriset i litteratur. Han skrev ofta på sitt stamkafé El-Fishawy mitt inne i basaren Khan el-Khalili.',
    'Saladin': 'Salah al-Din (Saladin, 1137–1193) enade Egypten och Syrien, byggde Kairos mäktiga citadell mot korsfararna och blev även i Europa legendarisk för sin ridderlighet och diplomati.',
    'Koh-i-Noor': 'Diamanten Koh-i-Noor ("Ljusets berg") vägde ursprungligen 186 karat och har bytt ägare mellan indiska, persiska och afghanska härskare innan den 1849 överlämnades till drottning Viktoria och idag sitter i de brittiska kronjuvelerna.',
    'Shah Jahan': 'Stormogulen Shah Jahan regerade 1628–1658 under mogulrikets arkitektoniska guldålder. Förutom Röda fortet i Delhi lät han uppföra Taj Mahal som ett evigt gravmonument åt sin älskade hustru Mumtaz Mahal.',
    'Shinto': 'Shinto ("gudarnas väg") är Japans uråldriga naturreligion utan helig skrift eller grundare. Den betonar renhet och vördnad för naturens andar (kami) som bor i berg, träd, vattenfall och stenar.',
    'Fuji': 'Vulkanen Fuji (3 776 m ö.h.) är Japans högsta berg och ett av landets tre heliga berg. Dess perfekta, snötäckta kon har avbildats i tusentals träsnitt — mest berömt av konstnären Hokusai.',
    'Hachiko': 'Akita-hunden Hachiko väntade troget på sin husse, professor Ueno, vid Shibuya-stationen varje dag — och fortsatte komma dit i nästan tio år efter att professorn plötsligt gått bort 1925.',
    'Al Capone': 'Maffiabossen Alphonse "Al" Capone styrde Chicagos undre värld under förbudstiden men fälldes till slut för skattebrott 1931. På Alcatraz var han fånge nr 85 och fick arbeta i tvätteriet och spela banjo i fängelsebandet.',
    'Gustave Eiffel': 'Innan Gustave Eiffel byggde Eiffeltornet 1889 konstruerade han det geniala, flexibla fackverksskelettet inuti Frihetsgudinnan så att den tunna kopparhuden skulle tåla Atlantens hårda stormvindar.',
    'Ellis Island': 'Mellan 1892 och 1954 passerade över 12 miljoner emigranter — däribland hundratusentals svenskar — genom mottagningshallen på Ellis Island. Idag uppskattas omkring 40 % av USA:s befolkning ha minst en förfader som steg iland här.',
    'John Lennon': 'Minnesplatsen Strawberry Fields i Central Park ligger mitt emot Dakota Building där John Lennon bodde. Mosaiken "Imagine" skänktes av staden Neapel och pryds dagligen av färska blommor från besökare världen över.',
    'Stora sfinxen': 'Stora sfinxen i Giza är uthuggen direkt ur ett enda massivt kalkstensblock för cirka 4 500 år sedan. Den är 73 meter lång och tros bära farao Chefrens anletsdrag.',
    'Herodotos': 'Den grekiske resenären Herodotos (ca 484–425 f.Kr.) kallas ofta "historiens fader". Han besökte Egypten runt 450 f.Kr. och skrev den första kända europeiska skildringen av hur pyramiderna uppfördes.'
  },

  // Resehändelser under flyg och båtresa (80 Days / BackPacker-känsla med val!)
  travelEvents: {
    boat: [
      {
        id: 'boat_deckhand',
        title: 'Stiltje på öppet hav',
        text: 'Ångaren glider sakta fram över ett spegelblankt hav. Överstyrman ropar att han behöver en extra hand med att surra last och polera mässingsdetaljer under överfarten.',
        choices: [
          { label: 'Hoppa in som däcksgast (+450 kr)', cash: 450, log: 'Arbetade extra som däcksgast ombord på oceanångaren och tjänade 450 kr.' },
          { label: 'Sätt dig i solstolen & läs resekartor (Gratis flygrabatt vid ankomst)', deal: 20, log: 'Studerade tidtabeller på däck och hittade en hemlig flygrabatt.' }
        ]
      },
      {
        id: 'boat_salon',
        title: 'Kvällsspel i matsalongen',
        text: 'En förmögen världsomseglare i kaptensmatsalen bjuder in dig till en runda geografi-vadslagning över en kopp kaffe.',
        choices: [
          { label: 'Anta utmaningen (Chans på +500 kr / risk -200 kr)', gamble: { win: 500, lose: -200, chance: 0.65 }, log: 'Antog en geografiutmaning i ångarens salong.' },
          { label: 'Tacka nej men bjud på en trevlig pratstund (+150 kr i dricks/tips)', cash: 150, log: 'Fick ett generöst resetips av en världsomseglare ombord.' }
        ]
      }
    ],
    flight: [
      {
        id: 'flight_archaeologist',
        title: 'Pratglad arkeolog på rad 14',
        text: 'Under inflygningen hamnar du bredvid en pensionerad museiintendent som älskar att diskutera antikviteter och världens marknader.',
        choices: [
          { label: 'Bjud på en kaffe från serveringsvagnen (-40 kr, ger 20 % sista-minuten-tips)', cash: -40, deal: 20, log: 'Bjöd en arkeolog på flygkaffe och fick ett supertips om billiga avgångar.' },
          { label: 'Sov hela flygningen för att spara kraft (Inga kostnader)', cash: 0, log: 'Fick en välbehövlig tupplur ovan molnen.' }
        ]
      },
      {
        id: 'flight_customs',
        title: 'Snabbfil i tullen',
        text: 'Kön till passkontrollen vid ankomsthallen ringlar sig lång! En lokal flygplatsvärd erbjuder sig att guida dig genom snabbkön mot en liten avgift.',
        choices: [
          { label: 'Betala för snabbspår (-90 kr, sparar 2 timmar)', cash: -90, hours: -2, log: 'Tog snabbspåret genom tullen och vann två värdefulla timmar.' },
          { label: 'Stå kvar i den vanliga kön (Gratis, tar 1 extra timme)', cash: 0, hours: 1, log: 'Köade tålmodigt i passkontrollen och sparade reskassan.' }
        ]
      },
      {
        id: 'flight_exchange',
        title: 'Gynnsam växlingskurs i terminalen',
        text: 'På växlingskontoret i ankomsthallen har kursen precis slagit om till din fördel — och en gammal svensk resenär vill byta överblivna sedlar.',
        choices: [
          { label: 'Växla smart (+220 kr extra i reskassan!)', cash: 220, log: 'Gjorde ett klipp vid växlingskontoret direkt efter landning (+220 kr).' },
          { label: 'Byt kontaktuppgifter istället (Ger 25 % rabatt på nästa avgång)', deal: 25, log: 'Fick en rabattkupong på flyg av en resenär i ankomsthallen.' }
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = root.GT_WORLD;
}
