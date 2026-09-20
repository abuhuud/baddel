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
      id: "sch-00",
      title: "BADDEL FRIDAY NIGHT SMASH",
      sport: "badminton",
      day: "JUMAT",
      isoDate: "2026-09-18",
      dateFormatted: "Jumat, 18 Sep 2026",
      date: "18 Sep 2026",
      time: "19:00 - 21:00 WIB",
      venue: "Royal Sports Arena Jakarta",
      court: "Court 1 & 2",
      courtNames: "Court 1, Court 2",
      mapsUrl: "https://maps.google.com/?q=Royal+Sports+Arena+Jakarta",
      locationUrl: "https://maps.google.com/?q=Royal+Sports+Arena+Jakarta",
      eventStatus: "completed",
      status: "full",
      slotsLeft: 0,
      totalSlots: 12,
      slotsTotal: 12,
      slotsFilled: 12,
      fee: "Rp 50.000 / orang",
      notes: "Sesi main telah sukses diselenggarakan"
    },
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
      eventStatus: "upcoming",
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
      eventStatus: "upcoming",
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
      eventStatus: "upcoming",
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
     CMS STORAGE & GITHUB AUTO-SYNC PERSISTENCE LAYER
     ============================================================ */
  var STORAGE_KEY = 'baddel_cms_db_v1';
  var REPO_DATA_VERSION = '2026.09.19-v5';

  /**
   * Menghitung fingerprint unik dari data default di repository GitHub.
   * Setiap kali file data.js diperbarui dan di-push ke GitHub, fingerprint
   * ini otomatis berubah, sehingga browser pengunjung langsung memuat data
   * terupdate dari GitHub tanpa terblokir data lama di localStorage.
   */
  function computeDefaultDataHash() {
    try {
      var rawStr = JSON.stringify({
        v: REPO_DATA_VERSION,
        p: initialAllPlayers.map(function (p) {
          return [p.id, p.number, p.name, p.category, p.instagram, p.image, (p.gallery || []).length];
        }),
        s: defaultSchedules.map(function (s) {
          return [s.id, s.title, s.sport, s.date, s.isoDate, s.time, s.venue, s.courtNames || s.court, s.fee, s.status, s.eventStatus, s.slotsLeft, s.totalSlots, s.notes];
        }),
        c: defaultCommunityGallery.map(function (c) {
          return [c.id, c.title, c.subtitle, c.image, c.tag];
        })
      });

      var hash = 5381;
      for (var i = 0; i < rawStr.length; i++) {
        hash = ((hash << 5) + hash) + rawStr.charCodeAt(i);
        hash = hash & hash;
      }
      return 'baddel_' + Math.abs(hash).toString(36);
    } catch (e) {
      return 'baddel_fb_' + Date.now();
    }
  }

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

    // Determine eventStatus (upcoming or completed)
    var eventStatus = s.eventStatus || s.scheduleStatus || '';
    if (!eventStatus) {
      if (s.isoDate && /^\d{4}-\d{2}-\d{2}$/.test(s.isoDate)) {
        var todayStr = new Date().toISOString().slice(0, 10);
        eventStatus = s.isoDate < todayStr ? 'completed' : 'upcoming';
      } else {
        eventStatus = 'upcoming';
      }
    } else {
      eventStatus = eventStatus.toLowerCase().trim();
      if (eventStatus !== 'completed' && eventStatus !== 'upcoming') {
        eventStatus = 'upcoming';
      }
    }

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
      eventStatus: eventStatus,
      eventStatusText: eventStatus === 'completed' ? 'Completed' : 'Upcoming',
      slotsLeft: slotsLeft,
      totalSlots: totalSlots,
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
      sub: String(sub), // kept for backward compat with legacy data
      tag: item.tag || 'MOMENT'
    };
  }

  function loadDB() {
    var currentHash = computeDefaultDataHash();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        // Jika hash cocok, data repository GitHub belum berubah -> gunakan localStorage
        if (parsed && parsed._dataHash === currentHash && Array.isArray(parsed.players) && parsed.players.length > 0) {
          return {
            players: parsed.players.map(normalizePlayer),
            schedules: (Array.isArray(parsed.schedules) ? parsed.schedules : defaultSchedules).map(normalizeSchedule),
            communityGallery: (Array.isArray(parsed.communityGallery) ? parsed.communityGallery : defaultCommunityGallery).map(normalizeCommunity),
            _dataHash: currentHash,
            lastUpdated: parsed.lastUpdated || ''
          };
        } else {
          console.info('[Baddel] Perubahan data dari GitHub terdeteksi (' + currentHash + '). Menyinkronkan data...');
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available, falling back to repository data', e);
    }

    // Default / Auto-sync: muat data langsung dari file GitHub repository
    var freshDB = {
      players: initialAllPlayers.map(normalizePlayer),
      schedules: defaultSchedules.map(normalizeSchedule),
      communityGallery: defaultCommunityGallery.map(normalizeCommunity),
      _dataHash: currentHash,
      lastUpdated: ''
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        players: freshDB.players,
        schedules: freshDB.schedules,
        communityGallery: freshDB.communityGallery,
        _dataHash: currentHash,
        lastUpdated: ''
      }));
    } catch (e) {}

    return freshDB;
  }

  var activeDB = loadDB();

  function saveDB() {
    var currentHash = activeDB._dataHash || computeDefaultDataHash();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        players: activeDB.players,
        schedules: activeDB.schedules,
        communityGallery: activeDB.communityGallery,
        _dataHash: currentHash,
        lastUpdated: activeDB.lastUpdated || new Date().toISOString()
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
    activeDB.lastUpdated = new Date().toISOString();
    saveDB();
  }

  function getSchedules() {
    return activeDB.schedules.map(normalizeSchedule);
  }

  function saveSchedules(newSchedules) {
    if (!Array.isArray(newSchedules)) return;
    activeDB.schedules = newSchedules.map(normalizeSchedule);
    activeDB.lastUpdated = new Date().toISOString();
    saveDB();
  }

  function getCommunityGallery() {
    return activeDB.communityGallery.map(normalizeCommunity);
  }

  function saveCommunityGallery(newGallery) {
    if (!Array.isArray(newGallery)) return;
    activeDB.communityGallery = newGallery.map(normalizeCommunity);
    activeDB.lastUpdated = new Date().toISOString();
    saveDB();
  }

  function resetToDefault() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    var currentHash = computeDefaultDataHash();
    activeDB = {
      players: initialAllPlayers.map(normalizePlayer),
      schedules: defaultSchedules.map(normalizeSchedule),
      communityGallery: defaultCommunityGallery.map(normalizeCommunity),
      _dataHash: currentHash
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        players: activeDB.players,
        schedules: activeDB.schedules,
        communityGallery: activeDB.communityGallery,
        _dataHash: currentHash,
        lastUpdated: new Date().toISOString()
      }));
    } catch (e) {}
    syncProperties();
  }

  function exportDataJS() {
    var men = activeDB.players.filter(function (p) { return (p.category || 'men') === 'men'; });
    var women = activeDB.players.filter(function (p) { return p.category === 'women'; });

    return JSON.stringify({
      version: REPO_DATA_VERSION,
      exportedAt: new Date().toISOString(),
      menPlayers: men,
      womenPlayers: women,
      schedules: activeDB.schedules,
      communityGallery: activeDB.communityGallery
    }, null, 2);
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
    exportDataJS: exportDataJS,
    getDataHash: computeDefaultDataHash,
    initRemoteSync: initRemoteSync
  };

  function initRemoteSync() {
    if (typeof fetch === 'undefined') return;

    var PRIMARY_TIMEOUT = 3500;
    var FALLBACK_TIMEOUT = 4000;

    function fetchWithTimeout(url, options, timeoutMs) {
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timerId = ctrl ? setTimeout(function () {
        try { ctrl.abort(); } catch (e) {}
      }, timeoutMs) : null;

      var req = fetch(url, Object.assign({}, options, { signal: ctrl ? ctrl.signal : undefined }));

      return req.then(function (res) {
        if (timerId) clearTimeout(timerId);
        return res;
      }, function (err) {
        if (timerId) clearTimeout(timerId);
        throw err;
      });
    }

    fetchWithTimeout('data/database.json?t=' + Date.now(), { cache: 'no-cache' }, PRIMARY_TIMEOUT)
      .then(function (res) {
        if (!res.ok) throw new Error('Local database.json status: ' + res.status);
        return res.json();
      })
      .catch(function () {
        // Fallback to GitHub raw with its own independent timeout
        return fetchWithTimeout(
          'https://raw.githubusercontent.com/abuhuud/baddel/main/data/database.json?t=' + Date.now(),
          { cache: 'no-cache' },
          FALLBACK_TIMEOUT
        )
          .then(function (res) {
            if (!res.ok) return null;
            return res.json();
          })
          .catch(function () { return null; });
      })
      .then(function (remoteData) {
        if (remoteData && Array.isArray(remoteData.players) && remoteData.players.length > 0) {
          var remoteUpdated = remoteData.lastUpdated || '';
          var localUpdated = (activeDB && activeDB.lastUpdated) || '';

          // Sync if remote data timestamp is different or local data is uninitialized
          if (remoteUpdated && (remoteUpdated !== localUpdated || !localUpdated)) {
            console.info('[Baddel Remote Sync] Data terbaru disinkronkan dari server (' + remoteUpdated + ').');
            activeDB.players = remoteData.players.map(normalizePlayer);
            activeDB.schedules = (remoteData.schedules || defaultSchedules).map(normalizeSchedule);
            activeDB.communityGallery = (remoteData.communityGallery || defaultCommunityGallery).map(normalizeCommunity);
            activeDB.lastUpdated = remoteUpdated;
            activeDB._dataHash = computeDefaultDataHash();
            saveDB();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('baddel:data-synced', { detail: activeDB }));
            }
          }
        }
      })
      .catch(function () {
        // Silently continue with local/embedded data
      });
  }

  // Trigger remote sync AFTER the page is fully loaded.
  // Using 'load' event (not 'DOMContentLoaded') ensures fetch requests don't
  // start while the browser is still parsing/rendering the page, which would
  // keep the browser tab refresh-button spinning indefinitely.
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete') {
      // Already loaded (e.g. script is deferred or async)
      setTimeout(initRemoteSync, 0);
    } else {
      window.addEventListener('load', function () {
        setTimeout(initRemoteSync, 0);
      });
    }
  }

  return exportObj;

})();

// Alias for BADDEL naming
if (typeof window !== 'undefined') {
  window.BaddelData = BadcomData;
}

