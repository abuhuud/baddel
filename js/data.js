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
      gallery: [
        "assets/images/players/basz.jpg",
        "assets/images/gallery/1.JPG",
        "assets/images/gallery/3.JPG"
      ]
    },
    {
      id: "nio",
      number: "02",
      name: "Nio",
      instagram: "@nio",
      image: "assets/images/players/nio.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/nio.jpg",
        "assets/images/gallery/2.JPG",
        "assets/images/gallery/5.JPG"
      ]
    },
    {
      id: "glenn",
      number: "03",
      name: "Glenn",
      instagram: "@gsh2206",
      image: "assets/images/players/glenn.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/glenn.jpg",
        "assets/images/gallery/1.JPG",
        "assets/images/gallery/3.JPG"
      ]
    },
    {
      id: "albert",
      number: "04",
      name: "Albert",
      instagram: "@albertvsimatupang",
      image: "assets/images/players/albert.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/albert.jpg",
        "assets/images/gallery/3.JPG",
        "assets/images/gallery/6.jpeg"
      ]
    },
    {
      id: "damz",
      number: "05",
      name: "Damz",
      instagram: "@damzskut",
      image: "assets/images/players/damai.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/damai.jpg",
        "assets/images/gallery/1.JPG",
        "assets/images/gallery/5.JPG"
      ]
    },
    {
      id: "yoga",
      number: "06",
      name: "Yoga",
      instagram: "@yoga",
      image: "assets/images/players/yoga.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/yoga.jpg",
        "assets/images/gallery/culture-padel.jpg",
        "assets/images/gallery/5.JPG"
      ]
    },
    {
      id: "gerald",
      number: "07",
      name: "Gerald",
      instagram: "@gelskyy",
      image: "assets/images/players/gerald.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/gerald.jpg",
        "assets/images/gallery/3.JPG",
        "assets/images/gallery/6.jpeg"
      ]
    },
    {
      id: "vq",
      number: "08",
      name: "Vq",
      instagram: "@vqpvtra",
      image: "assets/images/players/vq.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/vq.jpg",
        "assets/images/gallery/2.JPG",
        "assets/images/gallery/5.JPG"
      ]
    },
    {
      id: "ikrom",
      number: "09",
      name: "Huudzm",
      instagram: "@ikromsalam",
      image: "assets/images/players/ikrom.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/ikrom.jpg",
        "assets/images/gallery/culture-smash.jpeg",
        "assets/images/gallery/1.JPG"
      ]
    },
    {
      id: "zayn",
      number: "10",
      name: "Zayn",
      instagram: "@zayn",
      image: "assets/images/players/zayn.jpeg",
      hasImage: true,
      gallery: [
        "assets/images/players/zayn.jpeg",
        "assets/images/gallery/3.JPG",
        "assets/images/gallery/6.jpeg"
      ]
    },
    {
      id: "rey",
      number: "11",
      name: "Rey",
      instagram: "@805.hans",
      image: "assets/images/players/rey.jpeg",
      hasImage: true,
      gallery: [
        "assets/images/players/rey.jpeg",
        "assets/images/gallery/culture-padel.jpg",
        "assets/images/gallery/5.JPG"
      ]
    },
    {
      id: "reza",
      number: "12",
      name: "Reza",
      instagram: "@rezafajriadi",
      image: "assets/images/players/reza.jpeg",
      hasImage: true,
      gallery: [
        "assets/images/players/reza.jpeg",
        "assets/images/gallery/1.JPG",
        "assets/images/gallery/5.JPG"
      ]
    },
    {
      id: "irsan",
      number: "13",
      name: "Captain Charisma",
      instagram: "@irsan_sanusi",
      image: "assets/images/players/irsan.jpeg",
      hasImage: true,
      gallery: [
        "assets/images/players/irsan.jpeg",
        "assets/images/gallery/1.JPG",
        "assets/images/gallery/3.JPG"
      ]
    },
    {
      id: "fandhi",
      number: "14",
      name: "Fandhi",
      instagram: "@fandi.nh",
      image: "assets/images/players/fandhi.jpeg",
      hasImage: true,
      gallery: [
        "assets/images/players/fandhi.jpeg",
        "assets/images/gallery/culture-smash.jpeg",
        "assets/images/gallery/2.JPG"
      ]
    },
    {
      id: "luthfi",
      number: "15",
      name: "Luthfi",
      instagram: "@luthfi",
      image: "assets/images/players/lutfhi.jpeg",
      hasImage: true,
      gallery: [
        "assets/images/players/lutfhi.jpeg",
        "assets/images/gallery/1.JPG",
        "assets/images/gallery/3.JPG"
      ]
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
      gallery: [
        "assets/images/players/ayeq.jpg",
        "assets/images/gallery/4.JPG",
        "assets/images/gallery/7.JPG"
      ]
    },
    {
      id: "lia",
      number: "02",
      name: "Tellia",
      instagram: "@tellia.silalahi",
      image: "assets/images/players/lia.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/lia.jpg",
        "assets/images/gallery/4.JPG",
        "assets/images/gallery/8.JPG"
      ]
    },
    {
      id: "novi",
      number: "03",
      name: "V",
      instagram: "@nyimas_novianti",
      image: "assets/images/players/novi.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/novi.jpg",
        "assets/images/gallery/4.JPG",
        "assets/images/gallery/7.JPG"
      ]
    },
    {
      id: "cita",
      number: "04",
      name: "Cita",
      instagram: "@citaoncourt",
      image: "assets/images/players/cita.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/cita.jpg",
        "assets/images/gallery/4.JPG",
        "assets/images/gallery/culture-padel.jpg"
      ]
    },
    {
      id: "sanny",
      number: "05",
      name: "Sanny",
      instagram: "@kimmyalodia",
      image: "assets/images/players/sanny.jpg",
      hasImage: true,
      gallery: [
        "assets/images/players/sanny.jpg",
        "assets/images/gallery/4.JPG",
        "assets/images/gallery/7.JPG"
      ]
    },
    {
      id: "silvi",
      number: "06",
      name: "Silvi",
      instagram: "@silvi",
      image: "assets/images/players/silvi.jpeg",
      hasImage: true,
      gallery: [
        "assets/images/players/silvi.jpeg",
        "assets/images/gallery/4.JPG",
        "assets/images/gallery/7.JPG"
      ]
    }
  ];

  /* ============================================================
     OTOMATISASI KATEGORI & PENGGABUNGAN DATA
     (Jangan ubah bagian di bawah ini)
     ============================================================ */
  menPlayers.forEach(function (player) {
    player.category = player.category || "men";
    player.gallery = player.gallery && player.gallery.length ? player.gallery : (player.image ? [player.image] : []);
  });

  womenPlayers.forEach(function (player) {
    player.category = player.category || "women";
    player.gallery = player.gallery && player.gallery.length ? player.gallery : (player.image ? [player.image] : []);
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
    shortName: "BADDEL",
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
