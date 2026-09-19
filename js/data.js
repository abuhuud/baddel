/* ============================================
   BADCOM — DATA.JS
   Player Database & Social Links

   PANDUAN INPUT DATA PLAYER:
   1. Input pemain laki-laki pada array: `menPlayers`
   2. Input pemain perempuan pada array: `womenPlayers`
   * Properti `category` otomatis diset ("men" atau "women").
   ============================================ */

var BadcomData = (function () {

  /* ============================================================
     1. INPUT PLAYER LAKI-LAKI (MEN'S SQUAD)
     Urutan:
     1. Basz
     2. Nio
     3. Glenn
     4. Albert
     5. Damz
     6. Yoga
     7. Gerald
     8. Vq
     9. Huudzm (Ikrom)
     10. Zayn
     11. Rey
     12. Reza
     13. Captain Charisma (Irsan)
     14. Fandhi
     15. Luthfi
     ============================================================ */
  var menPlayers = [
    {
      id: "basz",
      number: "01",
      name: "Om Basz",
      instagram: "@basz76",
      image: "assets/images/players/basz.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "nio",
      number: "02",
      name: "Nio",
      instagram: "@nio",
      image: "assets/images/players/nio.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "glenn",
      number: "03",
      name: "Glenn",
      instagram: "@gsh2206",
      image: "assets/images/players/glenn.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "albert",
      number: "04",
      name: "Albert",
      instagram: "@albertvsimatupang",
      image: "assets/images/players/albert.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "damz",
      number: "05",
      name: "Damz",
      instagram: "@damzskut",
      image: "assets/images/players/damai.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "yoga",
      number: "06",
      name: "Yoga",
      instagram: "@yoga",
      image: "assets/images/players/yoga.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "gerald",
      number: "07",
      name: "Gerald",
      instagram: "@gelskyy",
      image: "assets/images/players/gerald.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "vq",
      number: "08",
      name: "Vq",
      instagram: "@vqpvtra",
      image: "assets/images/players/vq.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "ikrom",
      number: "09",
      name: "Huudzm",
      instagram: "@ikromsalam",
      image: "assets/images/players/ikrom.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "zayn",
      number: "10",
      name: "Zayn",
      instagram: "@zayn",
      image: "assets/images/players/zayn.jpeg",
      hasImage: true,
      gallery: []
    },
    {
      id: "rey",
      number: "11",
      name: "Rey",
      instagram: "@805.hans",
      image: "assets/images/players/rey.jpeg",
      hasImage: true,
      gallery: []
    },
    {
      id: "reza",
      number: "12",
      name: "Reza",
      instagram: "@rezafajriadi",
      image: "assets/images/players/reza.jpeg",
      hasImage: true,
      gallery: []
    },
    {
      id: "irsan",
      number: "13",
      name: "Captain Charisma",
      instagram: "@irsan_sanusi",
      image: "assets/images/players/irsan.jpeg",
      hasImage: true,
      gallery: []
    },
    {
      id: "fandhi",
      number: "14",
      name: "Fandhi",
      instagram: "@fandi.nh",
      image: "assets/images/players/fandhi.jpeg",
      hasImage: true,
      gallery: []
    },
    {
      id: "luthfi",
      number: "15",
      name: "Luthfi",
      instagram: "@luthfi",
      image: "assets/images/players/lutfhi.jpeg",
      hasImage: true,
      gallery: []
    }
  ];


  /* ============================================================
     2. INPUT PLAYER PEREMPUAN (WOMEN'S SQUAD)
     Tambahkan atau edit data pemain perempuan di bawah ini:
     ============================================================ */
  var womenPlayers = [
    {
      id: "ayeq",
      number: "01",
      name: "Ayeq",
      instagram: "@margareth_ayeq",
      image: "assets/images/players/ayeq.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "lia",
      number: "02",
      name: "Tellia",
      instagram: "@tellia.silalahi",
      image: "assets/images/players/lia.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "novi",
      number: "03",
      name: "V",
      instagram: "@nyimas_novianti",
      image: "assets/images/players/novi.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "cita",
      number: "04",
      name: "Cita",
      instagram: "@citaoncourt",
      image: "assets/images/players/cita.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "sanny",
      number: "05",
      name: "Sanny",
      instagram: "@kimmyalodia",
      image: "assets/images/players/sanny.jpg",
      hasImage: true,
      gallery: []
    },
    {
      id: "silvi",
      number: "06",
      name: "Silvi",
      instagram: "@silvi",
      image: "assets/images/players/silvi.jpeg",
      hasImage: true,
      gallery: []
    }
  ];

  /* ============================================================
     3. JADWAL MAIN / SCHEDULES (DEFAULT DATA)
     ============================================================ */
  var defaultSchedules = [
    {
      id: "sch-01",
      title: "BADDEL WEEKEND SMASH #001",
      sport: "badminton",
      day: "SABTU",
      isoDate: "2026-09-20",
      dateFormatted: "Sabtu, 20 Sep 2026",
      date: "20 Sep 2026",
      time: "19:00 - 21:00 WIB",
      venue: "Royal Sports Arena Jakarta",
      court: "Court 2 & 3",
      courtNames: "Court 2, Court 3",
      mapsUrl: "https://maps.google.com/?q=Royal+Sports+Arena+Jakarta",
      locationUrl: "https://maps.google.com/?q=Royal+Sports+Arena+Jakarta",
      status: "open",
      slotsLeft: 4,
      totalSlots: 12,
      slotsTotal: 12,
      slotsFilled: 8,
      fee: "Rp 50.000 / orang",
      notes: "Shuttlecock & Lapangan Karpet disediakan"
    },
    {
      id: "sch-02",
      title: "JAKARTA PADEL NIGHT RALLY",
      sport: "padel",
      day: "SENIN",
      isoDate: "2026-09-22",
      dateFormatted: "Senin, 22 Sep 2026",
      date: "22 Sep 2026",
      time: "19:00 - 21:00 WIB",
      venue: "Padel Pro Jakarta Arena",
      court: "Panoramic Glass Court 1",
      courtNames: "Panoramic Glass Court 1",
      mapsUrl: "https://maps.google.com/?q=Padel+Pro+Jakarta",
      locationUrl: "https://maps.google.com/?q=Padel+Pro+Jakarta",
      status: "full",
      slotsLeft: 0,
      totalSlots: 8,
      slotsTotal: 8,
      slotsFilled: 8,
      fee: "Rp 125.000 / orang",
      notes: "Bola Padel & Raket sewa tersedia"
    },
    {
      id: "sch-03",
      title: "SUNDAY MORNING BULUTANGKIS",
      sport: "badminton",
      day: "MINGGU",
      isoDate: "2026-09-21",
      dateFormatted: "Minggu, 21 Sep 2026",
      date: "21 Sep 2026",
      time: "08:00 - 11:00 WIB",
      venue: "GOR Bulutangkis Gelora",
      court: "Court 1, 2 & 3",
      courtNames: "Court 1, Court 2, Court 3",
      mapsUrl: "https://maps.google.com/?q=GOR+Bulutangkis+Jakarta",
      locationUrl: "https://maps.google.com/?q=GOR+Bulutangkis+Jakarta",
      status: "open",
      slotsLeft: 6,
      totalSlots: 16,
      slotsTotal: 16,
      slotsFilled: 10,
      fee: "Rp 45.000 / orang",
      notes: "Sesi Pagi + Coffee & Breakfast Nongkrong"
    }
  ];

  /* ============================================================
     4. GALERI KOMUNITAS (DEFAULT DATA)
     ============================================================ */
  var defaultCommunityGallery = [
    {
      id: "cg-1",
      image: "assets/images/gallery/1.JPG",
      title: "BADDEL COMMUNITY SESSION #001",
      subtitle: "ROYAL SPORTS — 2026",
      sub: "ROYAL SPORTS — 2026",
      tag: "COMMUNITY"
    },
    {
      id: "cg-2",
      image: "assets/images/gallery/2.JPG",
      title: "THE YOUNGEST PLAYER",
      subtitle: "ROYAL SPORTS — 2026",
      sub: "ROYAL SPORTS — 2026",
      tag: "RALLY"
    },
    {
      id: "cg-3",
      image: "assets/images/gallery/3.JPG",
      title: "THE MEN INTENSE",
      subtitle: "ROYAL SPORTS — 2026",
      sub: "ROYAL SPORTS — 2026",
      tag: "MATCH"
    },
    {
      id: "cg-4",
      image: "assets/images/gallery/4.JPG",
      title: "THE QUEENS",
      subtitle: "ROYAL SPORTS — 2026",
      sub: "ROYAL SPORTS — 2026",
      tag: "SQUAD"
    },
    {
      id: "cg-5",
      image: "assets/images/gallery/5.JPG",
      title: "MATCH WIN FOCUS",
      subtitle: "ROYAL SPORTS — 2026",
      sub: "ROYAL SPORTS — 2026",
      tag: "CHAMPIONSHIP"
    },
    {
      id: "cg-6",
      image: "assets/images/gallery/6.jpeg",
      title: "CRITICAL POINTS",
      subtitle: "ROYAL SPORTS — 2026",
      sub: "ROYAL SPORTS — 2026",
      tag: "TOURNAMENT"
    },
    {
      id: "cg-7",
      image: "assets/images/gallery/7.JPG",
      title: "THE LADIES",
      subtitle: "ROYAL SPORTS — 2026",
      sub: "ROYAL SPORTS — 2026",
      tag: "SQUAD"
    },
    {
      id: "cg-8",
      image: "assets/images/gallery/8.JPG",
      title: "THE COUPLE",
      subtitle: "ROYAL SPORTS — 2026",
      sub: "ROYAL SPORTS — 2026",
      tag: "NIGHT LIGHTS"
    }
  ];

  /* ============================================================
     OTOMATISASI KATEGORI & PENGGABUNGAN DATA
     ============================================================ */
  menPlayers.forEach(function (player) {
    player.category = player.category || "men";
    player.gallery = Array.isArray(player.gallery) ? player.gallery : [];
  });

  womenPlayers.forEach(function (player) {
    player.category = player.category || "women";
    player.gallery = Array.isArray(player.gallery) ? player.gallery : [];
  });

  var initialAllPlayers = menPlayers.concat(womenPlayers);

  /* Placeholder gradient colors per player (when no image) */
  var playerColors = [
    { from: "#0D2B52", to: "#061A33" },
    { from: "#0A1F3D", to: "#031226" },
    { from: "#071e42", to: "#061530" },
    { from: "#0c2549", to: "#041020" },
    { from: "#0a2040", to: "#05182e" },
    { from: "#091d3a", to: "#031226" },
    { from: "#0e2855", to: "#061a33" },
    { from: "#0b2347", to: "#05101e" }
  ];

  var social = {
    instagram: "https://www.instagram.com/baddel_community/",
    whatsapp: "https://wa.me/6281270000739",
    partnership: "https://wa.me/6281270000739"
  };

  var community = {
    name: "BADDEL COMMUNITY",
    shortName: "BADDEL",
    tagline: ["PLAY LOUD.", "SMASH PROUD."],
    sports: ["BADMINTON", "PADEL"],
    location: "JAKARTA, INDONESIA",
    established: "2026",
    activeMembers: "25+",
    playDays: "ALMOST EVERYDAY"
  };

  /* ============================================================
     CMS STORAGE & PERSISTENCE LAYER (LocalStorage + API)
     ============================================================ */
  var STORAGE_KEY = 'baddel_cms_db_v1';

  function normalizePlayer(p, idx) {
    if (!p || typeof p !== 'object') p = {};
    var fallbackNum = idx != null ? (idx + 1 < 10 ? '0' + (idx + 1) : String(idx + 1)) : '00';
    var num = p.number || p.num || fallbackNum;
    var name = p.name || 'PEMAIN';
    var cat = (p.category || 'men').toLowerCase();
    var img = p.image || 'assets/images/players/avatar-placeholder.png';
    var gal = Array.isArray(p.gallery) ? p.gallery.filter(Boolean) : [];

    return {
      id: p.id || 'player_' + (idx != null ? idx : Date.now()),
      number: String(num),
      num: String(num),
      name: String(name),
      category: cat,
      instagram: p.instagram || '',
      image: img,
      hasImage: Boolean(img),
      gallery: gal
    };
  }

  function normalizeSchedule(s, idx) {
    if (!s || typeof s !== 'object') s = {};
    var sport = (s.sport || 'badminton').toLowerCase();
    var defaultTitle = sport === 'padel' ? 'BADDEL PADEL SESSION' : 'BADDEL WEEKEND SMASH';
    var title = s.title || (s.day ? 'BADDEL ' + sport.toUpperCase() + ' — ' + s.day : defaultTitle);
    var dateStr = s.dateFormatted || s.date || 'Sabtu, 26 Sep 2026';
    var totalSlots = parseInt(s.totalSlots || s.slotsTotal) || 12;
    var slotsFilled = parseInt(s.slotsFilled) || 0;
    var slotsLeft = s.slotsLeft != null ? parseInt(s.slotsLeft) : Math.max(0, totalSlots - slotsFilled);

    var venue = s.venue || 'Royal Sports Arena Jakarta';
    var mapsUrl = s.mapsUrl || s.locationUrl || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue));

    return {
      id: s.id || 'sch_' + (idx != null ? idx : Date.now()),
      title: String(title),
      sport: sport,
      dateFormatted: String(dateStr),
      date: String(dateStr),
      isoDate: s.isoDate || '',
      day: s.day || '',
      time: s.time || '19:00 - 21:00 WIB',
      venue: venue,
      court: s.courtNames || s.court || '',
      courtNames: s.courtNames || s.court || '',
      mapsUrl: String(mapsUrl),
      locationUrl: String(mapsUrl),
      fee: s.fee || 'Rp 50.000 / org',
      status: slotsLeft === 0 ? 'full' : (s.status === 'full' ? 'full' : 'open'),
      slotsLeft: slotsLeft,
      totalSlots: totalSlots,
      slotsTotal: totalSlots,
      slotsFilled: slotsFilled,
      notes: s.notes || 'Shuttlecock & Lapangan Karpet disediakan'
    };
  }

  function normalizeCommunity(item, idx) {
    if (!item || typeof item !== 'object') item = {};
    var title = item.title || ('BADDEL MOMENT #' + (idx != null ? (idx + 1 < 10 ? '00' + (idx + 1) : '0' + (idx + 1)) : '001'));
    var sub = item.subtitle || item.sub || 'ROYAL SPORTS — 2026';
    return {
      id: item.id || 'cg_' + (idx != null ? idx : Date.now()),
      image: item.image || 'assets/images/gallery/1.JPG',
      title: String(title),
      subtitle: String(sub),
      sub: String(sub),
      tag: item.tag || 'MOMENT'
    };
  }

  function loadDB() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.players) && parsed.players.length > 0) {
          if (!parsed._v3_empty_gal_init) {
            parsed.players.forEach(function (p) { p.gallery = []; });
            parsed._v3_empty_gal_init = true;
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)); } catch (e) {}
          }
          return {
            players: parsed.players.map(normalizePlayer),
            schedules: (Array.isArray(parsed.schedules) ? parsed.schedules : defaultSchedules).map(normalizeSchedule),
            communityGallery: (Array.isArray(parsed.communityGallery) ? parsed.communityGallery : defaultCommunityGallery).map(normalizeCommunity)
          };
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available, falling back to default data', e);
    }
    return {
      players: initialAllPlayers.map(normalizePlayer),
      schedules: defaultSchedules.map(normalizeSchedule),
      communityGallery: defaultCommunityGallery.map(normalizeCommunity)
    };
  }

  var activeDB = loadDB();

  function saveDB() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        players: activeDB.players,
        schedules: activeDB.schedules,
        communityGallery: activeDB.communityGallery,
        lastUpdated: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    syncProperties();
  }

  function syncProperties() {
    exportObj.players = activeDB.players;
    exportObj.menPlayers = activeDB.players.filter(function (p) { return (p.category || 'men') === 'men'; });
    exportObj.womenPlayers = activeDB.players.filter(function (p) { return p.category === 'women'; });
    exportObj.schedules = activeDB.schedules;
    exportObj.communityGallery = activeDB.communityGallery;
  }

  /* Public CRUD Methods */
  function getPlayers() {
    return activeDB.players.map(normalizePlayer);
  }

  function savePlayers(newPlayers) {
    if (!Array.isArray(newPlayers)) return;
    activeDB.players = newPlayers.map(normalizePlayer);
    saveDB();
  }

  function getSchedules() {
    return activeDB.schedules.map(normalizeSchedule);
  }

  function saveSchedules(newSchedules) {
    if (!Array.isArray(newSchedules)) return;
    activeDB.schedules = newSchedules.map(normalizeSchedule);
    saveDB();
  }

  function getCommunityGallery() {
    return activeDB.communityGallery.map(normalizeCommunity);
  }

  function saveCommunityGallery(newGallery) {
    if (!Array.isArray(newGallery)) return;
    activeDB.communityGallery = newGallery.map(normalizeCommunity);
    saveDB();
  }

  function resetToDefault() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    activeDB = {
      players: initialAllPlayers.slice(),
      schedules: defaultSchedules.slice(),
      communityGallery: defaultCommunityGallery.slice()
    };
    saveDB();
  }

  function exportDataJS() {
    var men = activeDB.players.filter(function (p) { return (p.category || 'men') === 'men'; });
    var women = activeDB.players.filter(function (p) { return p.category === 'women'; });

    return [
      '/* ============================================',
      '   BADDEL — DATA.JS (Exported from Baddel CMS)',
      '   Export Date: ' + new Date().toLocaleString(),
      '   ============================================ */',
      '',
      'var BadcomData = (function () {',
      '',
      '  var menPlayers = ' + JSON.stringify(men, null, 2) + ';',
      '',
      '  var womenPlayers = ' + JSON.stringify(women, null, 2) + ';',
      '',
      '  var defaultSchedules = ' + JSON.stringify(activeDB.schedules, null, 2) + ';',
      '',
      '  var defaultCommunityGallery = ' + JSON.stringify(activeDB.communityGallery, null, 2) + ';',
      '',
      '  /* ... (CMS sync engine) ... */',
      '  // [Paste into js/data.js for permanent repository commit]',
      '',
      '  return { ... };',
      '})();'
    ].join('\n');
  }

  var exportObj = {
    /* Legacy and direct props */
    menPlayers: activeDB.players.filter(function (p) { return (p.category || 'men') === 'men'; }),
    womenPlayers: activeDB.players.filter(function (p) { return p.category === 'women'; }),
    players: activeDB.players,
    playerColors: playerColors,
    social: social,
    community: community,
    schedules: activeDB.schedules,
    communityGallery: activeDB.communityGallery,

    /* Modern CMS API */
    getPlayers: getPlayers,
    savePlayers: savePlayers,
    getSchedules: getSchedules,
    saveSchedules: saveSchedules,
    getCommunityGallery: getCommunityGallery,
    saveCommunityGallery: saveCommunityGallery,
    resetToDefault: resetToDefault,
    exportDataJS: exportDataJS
  };

  return exportObj;

})();

// Alias for BADDEL naming
if (typeof window !== 'undefined') {
  window.BaddelData = BadcomData;
}

