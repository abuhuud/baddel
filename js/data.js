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
     ============================================================ */
  var menPlayers = [
    {
      id: "basz",
      number: "01",
      name: "Om Basz",
      nickname: "Bastian Tobing",
      sports: ["BADMINTON", "PADEL"],
      racket: "Yonex Astrox 88D Pro",
      instagram: "@basz76",
      image: "assets/images/players/basz.jpg",
      hasImage: true
    },
    {
      id: "nio",
      number: "02",
      name: "Nio",
      nickname: "Nio",
      sports: ["BADMINTON", "PADEL"],
      racket: "Victor Thruster Ryuga II",
      instagram: "@nio",
      image: "assets/images/players/nio.jpg",
      hasImage: true
    },
    {
      id: "glenn",
      number: "03",
      name: "Glenn",
      nickname: "Surya Halim",
      sports: ["BADMINTON", "PADEL"],
      racket: "Fly Power Tornado 800",
      instagram: "@gsh2206",
      image: "assets/images/players/glenn.jpg",
      hasImage: true
    },
    {
      id: "albert",
      number: "04",
      name: "Albert",
      nickname: "Valentino",
      sports: ["BADMINTON"],
      racket: "Yonex Astrox 88D Pro",
      instagram: "@albertvsimatupang",
      image: "assets/images/players/albert.jpg",
      hasImage: true
    },
    {
      id: "damz",
      number: "05",
      name: "Damz",
      nickname: "Damai",
      sports: ["BADMINTON"],
      racket: "Victor Thruster Ryuga II",
      instagram: "@damzskut",
      image: "assets/images/players/damai.jpg",
      hasImage: true
    },
    {
      id: "yoga",
      number: "06",
      name: "Yoga",
      nickname: "Yoga",
      sports: ["BADMINTON", "PADEL"],
      racket: "Li-Ning Axforce 90 Max",
      instagram: "@yoga",
      image: "assets/images/players/yoga.jpg",
      hasImage: true
    },
    {
      id: "gerald",
      number: "07",
      name: "Gerald",
      nickname: "Valensky Simatupang",
      sports: ["BADMINTON", "PADEL"],
      racket: "Li-Ning Axforce 90 Max / Head Speed Pro",
      instagram: "@gelskyy",
      image: "assets/images/players/gerald.jpg",
      hasImage: true
    },
    {
      id: "vq",
      number: "08",
      name: "Vq",
      nickname: "Putra",
      sports: ["BADMINTON", "PADEL"],
      racket: "Yonex Nanoflare 1000Z ",
      instagram: "@vqpvtra",
      image: "assets/images/players/vq.jpg",
      hasImage: true
    },
    {
      id: "ikrom",
      number: "09",
      name: "Huudzm",
      nickname: "Ikrom Mauludin Salam",
      sports: ["BADMINTON"],
      racket: "Hundred Rock R8",
      instagram: "@ikromsalam",
      image: "assets/images/players/ikrom.jpg",
      hasImage: true
    },
    {
      id: "zayn",
      number: "10",
      name: "Zayn",
      nickname: "Zayn",
      sports: ["BADMINTON"],
      racket: "Victor Auraspeed 100X",
      instagram: "@zayn",
      image: "assets/images/players/zayn.jpeg",
      hasImage: true
    },
    {
      id: "rey",
      number: "11",
      name: "Rey",
      nickname: "Hans",
      sports: ["BADMINTON", "PADEL"],
      racket: "Li-Ning Halbertec 8000",
      instagram: "@805.hans",
      image: "assets/images/players/rey.jpeg",
      hasImage: true
    },
    {
      id: "reza",
      number: "12",
      name: "Reza",
      nickname: "Fajriadi",
      sports: ["BADMINTON", "PADEL"],
      racket: "Yonex Astrox 100ZZ ",
      instagram: "@rezafajriadi",
      image: "assets/images/players/reza.jpeg",
      hasImage: true
    },
    {
      id: "irsan",
      number: "13",
      name: "Captain Charisma",
      nickname: "Irsan Sanusi",
      sports: ["BADMINTON"],
      racket: "Mizuno Fortius 11 Quick",
      instagram: "@irsan_sanusi",
      image: "assets/images/players/irsan.jpeg",
      hasImage: true
    },
    {
      id: "fandhi",
      number: "14",
      name: "Fandhi",
      nickname: "Nur Hidayat",
      sports: ["BADMINTON"],
      racket: "Yonex Astrox 77 Pro",
      instagram: "@fandi.nh",
      image: "assets/images/players/fandhi.jpeg",
      hasImage: true
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
      nickname: "Margareth Sitepu",
      sports: ["BADMINTON"],
      racket: "Yonex Nanoflare 700",
      instagram: "@margareth_ayeq",
      image: "assets/images/players/ayeq.jpg",
      hasImage: true
    },
    {
      id: "lia",
      number: "02",
      name: "Tellia",
      nickname: "Silalahi",
      sports: ["BADMINTON"],
      racket: "Victor DriveX 9X",
      instagram: "@tellia.silalahi",
      image: "assets/images/players/lia.jpg",
      hasImage: true
    },
    {
      id: "novi",
      number: "03",
      name: "V",
      nickname: "Novianti",
      sports: ["BADMINTON"],
      racket: "Li-Ning Windstorm 72",
      instagram: "@nyimas_novianti",
      image: "assets/images/players/novi.jpg",
      hasImage: true
    },
    {
      id: "cita",
      number: "04",
      name: "Cita",
      nickname: "Cita",
      sports: ["BADMINTON", "PADEL"],
      racket: "Yonex Astrox 66 / Nox MJ10 Luxury",
      instagram: "@citaoncourt",
      image: "assets/images/players/cita.jpg",
      hasImage: true
    },
    {
      id: "sanny",
      number: "05",
      name: "Sanny",
      nickname: "Ana Yusran",
      sports: ["BADMINTON"],
      racket: "Victor Thruster K BXR",
      instagram: "@kimmyalodia",
      image: "assets/images/players/sanny.jpg",
      hasImage: true
    }
  ];


  /* ============================================================
     OTOMATISASI KATEGORI & PENGGABUNGAN DATA
     (Jangan ubah bagian di bawah ini)
     ============================================================ */
  menPlayers.forEach(function (player) {
    player.category = player.category || "men";
  });

  womenPlayers.forEach(function (player) {
    player.category = player.category || "women";
  });

  // Gabungan semua pemain untuk modal profil, navigasi prev/next & pencarian
  var players = menPlayers.concat(womenPlayers);

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
    shortName: "BADCOM",
    tagline: ["PLAY LOUD.", "SMASH PROUD."],
    sports: ["BADMINTON", "PADEL"],
    location: "JAKARTA, INDONESIA",
    established: "2026",
    activeMembers: "25+",
    playDays: "ALMOST EVERYDAY"
  };

  return {
    menPlayers: menPlayers,
    womenPlayers: womenPlayers,
    players: players,
    playerColors: playerColors,
    social: social,
    community: community
  };

})();
