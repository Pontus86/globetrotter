// Globetrotter: Scotland Yard — 18 Europeiska knutpunkter med riktiga 3D-koordinater,
// sevärdheter, stöldgods, transitnav, polisstationer och frågor.

window.GT_SCOTLAND_DATA = (function () {
  'use strict';

  const CITIES = {
    stockholm: {
      id: 'stockholm',
      name: 'Stockholm',
      country: 'Sverige',
      center: [18.0632, 59.3293],
      landmark: {
        name: 'Stadshuset',
        coords: [18.0549, 59.3275],
        artifact: 'Nobelmedaljen i guld',
        icon: '🏅'
      },
      hub: { name: 'Centralstationen', coords: [18.0583, 59.3301] },
      precinct: { name: 'Kungsträdgården', coords: [18.0715, 59.3310] },
      trains: ['oslo', 'copenhagen'],
      flights: ['london', 'berlin', 'amsterdam'],
      questions: [
        {
          q: 'Vilken sal i Stockholms stadshus är känd för den årliga Nobelbanketten?',
          options: ['Blå hallen', 'Gyllene tornet', 'Rikssalen', 'Spegelsalen'],
          correct: 0
        },
        {
          q: 'Vilken arkitekt ritade Stockholms stadshus som invigdes 1923?',
          options: ['Ragnar Östberg', 'Gunnar Asplund', 'Nicodemus Tessin', 'Ivar Tengbom'],
          correct: 0
        }
      ]
    },
    oslo: {
      id: 'oslo',
      name: 'Oslo',
      country: 'Norge',
      center: [10.7420, 59.9130],
      landmark: {
        name: 'Kungliga slottet',
        coords: [10.7275, 59.9170],
        artifact: 'Munchs skissbok',
        icon: '🎨'
      },
      hub: { name: 'Oslo Sentralstasjon', coords: [10.7522, 59.9111] },
      precinct: { name: 'Stortinget', coords: [10.7399, 59.9130] },
      trains: ['stockholm', 'copenhagen'],
      flights: ['london', 'amsterdam'],
      questions: [
        {
          q: 'Vilken berömd norsk konstnär målade "Skriet", som ställs ut i Oslo?',
          options: ['Edvard Munch', 'Henrik Ibsen', 'Gustav Vigeland', 'Harald Sohlberg'],
          correct: 0
        },
        {
          q: 'Vilket Nobelpris delas ut i Oslo rådhus varje år den 10 december?',
          options: ['Nobels fredspris', 'Litteraturpriset', 'Fysikpriset', 'Ekonomipriset'],
          correct: 0
        }
      ]
    },
    copenhagen: {
      id: 'copenhagen',
      name: 'Köpenhamn',
      country: 'Danmark',
      center: [12.5780, 55.6761],
      landmark: {
        name: 'Nyhavn',
        coords: [12.5906, 55.6798],
        artifact: 'Sjöjungfruns krona',
        icon: '👑'
      },
      hub: { name: 'Hovedbanegården', coords: [12.5648, 55.6728] },
      precinct: { name: 'Kongens Nytorv', coords: [12.5858, 55.6805] },
      trains: ['stockholm', 'oslo', 'berlin', 'amsterdam'],
      flights: ['london', 'paris', 'prague'],
      questions: [
        {
          q: 'Vilken berömd sagoförfattare bodde under flera år i ett av de färgglada husen vid Nyhavn?',
          options: ['H.C. Andersen', 'Søren Kierkegaard', 'Karen Blixen', 'Astrid Lindgren'],
          correct: 0
        },
        {
          q: 'Vilken bro förbinder Köpenhamn med Malmö över sundet?',
          options: ['Öresundsbron', 'Stora Bältbron', 'Lilla Bältbron', 'Kattegatbron'],
          correct: 0
        }
      ]
    },
    london: {
      id: 'london',
      name: 'London',
      country: 'Storbritannien',
      center: [-0.1220, 51.5030],
      landmark: {
        name: 'Big Ben & Westminster',
        coords: [-0.1246, 51.5007],
        artifact: 'Kronjuvelens safir',
        icon: '💎'
      },
      hub: { name: 'Waterloo Station', coords: [-0.1133, 51.5031] },
      precinct: { name: 'Trafalgar Square', coords: [-0.1281, 51.5080] },
      trains: ['paris', 'brussels', 'amsterdam'],
      flights: ['stockholm', 'oslo', 'madrid', 'lisbon', 'rome'],
      questions: [
        {
          q: 'Vad heter klocktornet som i dagligt tal kallas Big Ben officiellt sedan 2012?',
          options: ['Elizabeth Tower', 'Victoria Tower', 'St. Stephen Tower', 'Thames Tower'],
          correct: 0
        },
        {
          q: 'Vilken flod rinner precis förbi Westminsterpalatset och Big Ben?',
          options: ['Themsen', 'Severn', 'Mersey', 'Avon'],
          correct: 0
        }
      ]
    },
    amsterdam: {
      id: 'amsterdam',
      name: 'Amsterdam',
      country: 'Nederländerna',
      center: [4.8920, 52.3680],
      landmark: {
        name: 'Rijksmuseum',
        coords: [4.8852, 52.3600],
        artifact: 'Nattvaktens nyckel',
        icon: '🗝️'
      },
      hub: { name: 'Centraal Station', coords: [4.9003, 52.3791] },
      precinct: { name: 'Dam Square', coords: [4.8936, 52.3730] },
      trains: ['brussels', 'berlin', 'copenhagen', 'london'],
      flights: ['stockholm', 'barcelona', 'milan'],
      questions: [
        {
          q: 'Vilken mästare målade "Nattvakten", huvudnumret på Rijksmuseum i Amsterdam?',
          options: ['Rembrandt van Rijn', 'Johannes Vermeer', 'Vincent van Gogh', 'Frans Hals'],
          correct: 0
        },
        {
          q: 'Vilken flod har gett namn åt staden Amsterdam?',
          options: ['Amstel', 'Rhen', 'Maas', 'Schelde'],
          correct: 0
        }
      ]
    },
    brussels: {
      id: 'brussels',
      name: 'Bryssel',
      country: 'Belgien',
      center: [4.3560, 50.8450],
      landmark: {
        name: 'Grand-Place',
        coords: [4.3524, 50.8467],
        artifact: 'Atomium-kristallen',
        icon: '🔮'
      },
      hub: { name: 'Bruxelles-Central', coords: [4.3570, 50.8455] },
      precinct: { name: 'Place Royale', coords: [4.3592, 50.8422] },
      trains: ['london', 'paris', 'amsterdam', 'zurich'],
      flights: ['berlin', 'madrid', 'vienna'],
      questions: [
        {
          q: 'Vilken känd liten bronsstaty står bara några kvarter från Grand-Place i Bryssel?',
          options: ['Manneken Pis', 'Den lille prinsen', 'Tintin', 'Sankt Mikael'],
          correct: 0
        },
        {
          q: 'Till vilket evenemang 1958 byggdes Bryssels landmärke Atomium?',
          options: ['Världsutställningen Expo 58', 'Sommar-OS', 'EU:s grundande', 'Belgiens 100-årsjubileum'],
          correct: 0
        }
      ]
    },
    paris: {
      id: 'paris',
      name: 'Paris',
      country: 'Frankrike',
      center: [2.3020, 48.8580],
      landmark: {
        name: 'Eiffeltornet',
        coords: [2.2945, 48.8584],
        artifact: 'Mona Lisas skissbok',
        icon: '📜'
      },
      hub: { name: 'Invalides Transit', coords: [2.3130, 48.8566] },
      precinct: { name: 'Trocadéro', coords: [2.2876, 48.8616] },
      trains: ['london', 'brussels', 'zurich', 'barcelona'],
      flights: ['copenhagen', 'rome', 'madrid', 'istanbul'],
      questions: [
        {
          q: 'Vilket år invigdes Eiffeltornet inför världsutställningen i Paris?',
          options: ['1889', '1865', '1900', '1912'],
          correct: 0
        },
        {
          q: 'Vilket känt konstmuseum i Paris rymmer Leonardo da Vincis Mona Lisa?',
          options: ['Louvren', 'Musée d\'Orsay', 'Centre Pompidou', 'Petit Palais'],
          correct: 0
        }
      ]
    },
    berlin: {
      id: 'berlin',
      name: 'Berlin',
      country: 'Tyskland',
      center: [13.3750, 52.5170],
      landmark: {
        name: 'Brandenburger Tor',
        coords: [13.3777, 52.5163],
        artifact: 'Gyllene kvadrigan',
        icon: '🏛️'
      },
      hub: { name: 'Berlin Hauptbahnhof', coords: [13.3695, 52.5251] },
      precinct: { name: 'Potsdamer Platz', coords: [13.3761, 52.5096] },
      trains: ['copenhagen', 'amsterdam', 'prague', 'zurich'],
      flights: ['stockholm', 'rome', 'athens', 'brussels'],
      questions: [
        {
          q: 'Vilket år föll Berlinmuren som stod precis väster om Brandenburger Tor?',
          options: ['1989', '1985', '1991', '1979'],
          correct: 0
        },
        {
          q: 'Vad föreställer bronsskulpturen högst upp på Brandenburger Tor?',
          options: ['En fyrspannsvagn (kvadriga)', 'En preussisk örn', 'En global sfär', 'En fredsduva'],
          correct: 0
        }
      ]
    },
    prague: {
      id: 'prague',
      name: 'Prag',
      country: 'Tjeckien',
      center: [14.4220, 50.0860],
      landmark: {
        name: 'Karlsbron',
        coords: [14.4114, 50.0865],
        artifact: 'Astronomiska urets kugghjul',
        icon: '⚙️'
      },
      hub: { name: 'Hlavní nádraží', coords: [14.4351, 50.0831] },
      precinct: { name: 'Gamla stans torg', coords: [14.4211, 50.0875] },
      trains: ['berlin', 'vienna', 'zurich'],
      flights: ['copenhagen', 'istanbul', 'barcelona'],
      questions: [
        {
          q: 'Vilken flod rinner under Karlsbron i Prag?',
          options: ['Vltava (Moldau)', 'Donau', 'Elbe', 'Oder'],
          correct: 0
        },
        {
          q: 'Vad kallas det medeltida astronomiska uret på rådhuset i Prags gamla stad?',
          options: ['Orloj', 'Horologium', 'Bohemia', 'Klementinum'],
          correct: 0
        }
      ]
    },
    vienna: {
      id: 'vienna',
      name: 'Wien',
      country: 'Österrike',
      center: [16.3700, 48.2065],
      landmark: {
        name: 'Stephansdom',
        coords: [16.3738, 48.2082],
        artifact: 'Mozarts originalpartitur',
        icon: '🎻'
      },
      hub: { name: 'Karlsplatz Station', coords: [16.3691, 48.2030] },
      precinct: { name: 'Hofburg', coords: [16.3659, 48.2065] },
      trains: ['prague', 'zurich', 'milan'],
      flights: ['brussels', 'athens', 'istanbul'],
      questions: [
        {
          q: 'Vilken stor europeisk flod flyter genom Wien?',
          options: ['Donau', 'Rhen', 'Po', 'Elbe'],
          correct: 0
        },
        {
          q: 'Vilken känd chokladtårta med aprikosmarmelad kommer från Wien?',
          options: ['Sachertårta', 'Schwarzwaldtårta', 'Linzertårta', 'Prinsesstårta'],
          correct: 0
        }
      ]
    },
    zurich: {
      id: 'zurich',
      name: 'Zürich',
      country: 'Schweiz',
      center: [8.5415, 47.3730],
      landmark: {
        name: 'Grossmünster',
        coords: [8.5441, 47.3701],
        artifact: 'Schweiziska guldtackan',
        icon: '🪙'
      },
      hub: { name: 'Zürich HB', coords: [8.5402, 47.3779] },
      precinct: { name: 'Paradeplatz', coords: [8.5389, 47.3697] },
      trains: ['paris', 'brussels', 'berlin', 'prague', 'vienna', 'milan'],
      flights: ['madrid', 'athens'],
      questions: [
        {
          q: 'Vilken flod rinner ut ur Zürichsjön rätt genom Zürichs stadskärna?',
          options: ['Limmat', 'Rhône', 'Aare', 'Inn'],
          correct: 0
        },
        {
          q: 'Vad heter Schweiz officiella valuta?',
          options: ['Schweizisk franc (CHF)', 'Euro (EUR)', 'Schweizisk krona', 'Alpmark'],
          correct: 0
        }
      ]
    },
    milan: {
      id: 'milan',
      name: 'Milano',
      country: 'Italien',
      center: [9.1870, 45.4670],
      landmark: {
        name: 'Duomo di Milano',
        coords: [9.1919, 45.4642],
        artifact: 'Da Vincis kompass',
        icon: '🧭'
      },
      hub: { name: 'Cadorna Station', coords: [9.1795, 45.4705] },
      precinct: { name: 'Piazza della Scala', coords: [9.1897, 45.4676] },
      trains: ['zurich', 'vienna', 'rome', 'barcelona'],
      flights: ['amsterdam', 'athens', 'lisbon'],
      questions: [
        {
          q: 'Vilket världsberömt operahus ligger bara ett stenkast från Duomo di Milano?',
          options: ['Teatro alla Scala', 'La Fenice', 'San Carlo', 'Arena di Verona'],
          correct: 0
        },
        {
          q: 'Vilken känd väggmålning av Leonardo da Vinci finns i klostret Santa Maria delle Grazie i Milano?',
          options: ['Nattvarden', 'Skapelsen', 'Skolan i Aten', 'Venus födelse'],
          correct: 0
        }
      ]
    },
    rome: {
      id: 'rome',
      name: 'Rom',
      country: 'Italien',
      center: [12.4920, 41.8950],
      landmark: {
        name: 'Colosseum',
        coords: [12.4922, 41.8902],
        artifact: 'Caesars sigillring',
        icon: '💍'
      },
      hub: { name: 'Roma Termini', coords: [12.5020, 41.9009] },
      precinct: { name: 'Piazza Venezia', coords: [12.4823, 41.8958] },
      trains: ['milan', 'athens'],
      flights: ['london', 'paris', 'berlin', 'barcelona', 'istanbul'],
      questions: [
        {
          q: 'Vad användes Colosseum i Rom främst till under antiken?',
          options: ['Gladiatorspel och skådespel', 'Senatens möten', 'Kejsarens bostad', 'Kappsegling'],
          correct: 0
        },
        {
          q: 'Vilken självständig mikrostat ligger helt inuti Rom?',
          options: ['Vatikanstaten', 'San Marino', 'Monaco', 'Malta'],
          correct: 0
        }
      ]
    },
    barcelona: {
      id: 'barcelona',
      name: 'Barcelona',
      country: 'Spanien',
      center: [2.1700, 41.3950],
      landmark: {
        name: 'Sagrada Família',
        coords: [2.1744, 41.4036],
        artifact: 'Gaudís mosaiksten',
        icon: '🧩'
      },
      hub: { name: 'Plaça de Catalunya', coords: [2.1700, 41.3870] },
      precinct: { name: 'Passeig de Gràcia', coords: [2.1649, 41.3917] },
      trains: ['paris', 'madrid', 'milan'],
      flights: ['amsterdam', 'prague', 'rome'],
      questions: [
        {
          q: 'Vilken katalansk arkitekt ägnade sitt liv åt att rita Sagrada Família?',
          options: ['Antoni Gaudí', 'Santiago Calatrava', 'Salvador Dalí', 'Pablo Picasso'],
          correct: 0
        },
        {
          q: 'Vilken region i Spanien är Barcelona huvudstad för?',
          options: ['Katalonien', 'Andalusien', 'Baskien', 'Galicien'],
          correct: 0
        }
      ]
    },
    madrid: {
      id: 'madrid',
      name: 'Madrid',
      country: 'Spanien',
      center: [-3.6950, 40.4120],
      landmark: {
        name: 'Museo del Prado',
        coords: [-3.6921, 40.4138],
        artifact: 'Don Quijotes förstautgåva',
        icon: '📖'
      },
      hub: { name: 'Estación de Atocha', coords: [-3.6908, 40.4065] },
      precinct: { name: 'Puerta del Sol', coords: [-3.7038, 40.4168] },
      trains: ['barcelona', 'lisbon'],
      flights: ['london', 'paris', 'brussels', 'zurich'],
      questions: [
        {
          q: 'Vilken spansk konstnär målade mästerverket "Las Meninas" som hänger på Pradomuseet?',
          options: ['Diego Velázquez', 'Francisco Goya', 'El Greco', 'Joan Miró'],
          correct: 0
        },
        {
          q: 'Vilken känd spansk författare skrev romanen Don Quijote?',
          options: ['Miguel de Cervantes', 'Federico García Lorca', 'Gabriel García Márquez', 'Lope de Vega'],
          correct: 0
        }
      ]
    },
    lisbon: {
      id: 'lisbon',
      name: 'Lissabon',
      country: 'Portugal',
      center: [-9.1390, 38.7110],
      landmark: {
        name: 'Praça do Comércio',
        coords: [-9.1367, 38.7078],
        artifact: 'Vasco da Gamas astrolabium',
        icon: '🔭'
      },
      hub: { name: 'Rossio Station', coords: [-9.1407, 38.7145] },
      precinct: { name: 'Chiado', coords: [-9.1422, 38.7107] },
      trains: ['madrid'],
      flights: ['london', 'milan', 'athens'],
      questions: [
        {
          q: 'Vilken flod mynnar ut i Atlanten precis vid Lissabons Praça do Comércio?',
          options: ['Tejo (Tagus)', 'Douro', 'Guadalquivir', 'Ebro'],
          correct: 0
        },
        {
          q: 'Vilken klassisk portugisisk musikstil är känd för sitt vemod och hörs ofta i Lissabon?',
          options: ['Fado', 'Flamenco', 'Bossa nova', 'Tango'],
          correct: 0
        }
      ]
    },
    athens: {
      id: 'athens',
      name: 'Aten',
      country: 'Grekland',
      center: [23.7300, 37.9740],
      landmark: {
        name: 'Akropolis',
        coords: [23.7257, 37.9715],
        artifact: 'Athenas gyllene uggla',
        icon: '🦉'
      },
      hub: { name: 'Syntagmatorget', coords: [23.7348, 37.9755] },
      precinct: { name: 'Monastiraki', coords: [23.7256, 37.9763] },
      trains: ['rome', 'istanbul'],
      flights: ['berlin', 'vienna', 'zurich', 'milan', 'lisbon'],
      questions: [
        {
          q: 'Vad heter det berömda templet högst upp på Akropolis i Aten?',
          options: ['Parthenon', 'Pantheon', 'Erechtheion', 'Olympieion'],
          correct: 0
        },
        {
          q: 'Vilken grekisk gudinna är Aten uppkallat efter?',
          options: ['Athena', 'Hera', 'Afrodite', 'Artemis'],
          correct: 0
        }
      ]
    },
    istanbul: {
      id: 'istanbul',
      name: 'Istanbul',
      country: 'Turkiet',
      center: [28.9755, 41.0110],
      landmark: {
        name: 'Hagia Sofia',
        coords: [28.9802, 41.0086],
        artifact: 'Sultanens smaragd',
        icon: '💚'
      },
      hub: { name: 'Sirkeci Station', coords: [28.9769, 41.0151] },
      precinct: { name: 'Stora basaren', coords: [28.9681, 41.0107] },
      trains: ['athens'],
      flights: ['paris', 'prague', 'vienna', 'rome'],
      questions: [
        {
          q: 'Vilket sund skiljer den europeiska och den asiatiska delen av Istanbul åt?',
          options: ['Bosporen', 'Dardanellerna', 'Gibraltarsundet', 'Messinasundet'],
          correct: 0
        },
        {
          q: 'Vad hette Istanbul innan det nuvarande namnet blev officiellt 1930?',
          options: ['Konstantinopel', 'Alexandria', 'Smyrna', 'Antiochia'],
          correct: 0
        }
      ]
    }
  };

  // Säkerställ att alla tåg- och flygrutter är symmetriska (dubbelriktade)
  Object.keys(CITIES).forEach(id => {
    const c = CITIES[id];
    c.trains.forEach(t => {
      if (CITIES[t] && !CITIES[t].trains.includes(id)) CITIES[t].trains.push(id);
    });
    c.flights.forEach(f => {
      if (CITIES[f] && !CITIES[f].flights.includes(id)) CITIES[f].flights.push(id);
    });
  });

  function haversineKm(a, b) {
    const R = 6371;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(b[1] - a[1]);
    const dLon = toRad(b[0] - a[0]);
    const lat1 = toRad(a[1]);
    const lat2 = toRad(b[1]);
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }

  function distanceMeters(a, b) {
    return haversineKm(a, b) * 1000;
  }

  // Räkna ut realtids-restid i sekunder baserat på distans och färdsätt
  function getTravelSeconds(fromId, toId, mode) {
    const c1 = CITIES[fromId];
    const c2 = CITIES[toId];
    if (!c1 || !c2) return 15;
    const km = haversineKm(c1.center, c2.center);
    if (mode === 'flight') {
      // Snabbt: ~7–16 sek
      return Math.max(7, Math.min(16, Math.round(6 + km / 260)));
    }
    // Tåg/båt (smyg): ~12–24 sek
    return Math.max(12, Math.min(24, Math.round(10 + km / 140)));
  }

  const POLICE_ROSTER = [
    { id: 'p1', name: 'Kommissarie Holm', short: 'Holm', color: '#38bdf8', startCity: 'london' },
    { id: 'p2', name: 'Inspektör Vega', short: 'Vega', color: '#60a5fa', startCity: 'berlin' },
    { id: 'p3', name: 'Agent Lind', short: 'Lind', color: '#818cf8', startCity: 'rome' }
  ];

  return {
    CITIES,
    POLICE_ROSTER,
    haversineKm,
    distanceMeters,
    getTravelSeconds
  };
})();
