/* ============================================
   BADDEL COMMUNITY — AUDIO CONTROLLER (AUDIO.JS)
   Compact Theme Song Player with Guaranteed Audible Playback
   ============================================ */

(function () {
  'use strict';

  var SONG_SRC = 'assets/songs/Baddel%20Theme%20Song.mp3';
  var SONG_SRC_FALLBACK = 'assets/songs/Baddel%20Theme%20Song.mpeg';
  var TARGET_VOLUME = 0.45; // Suara jelas dan nyaman didengar
  var AUTOPLAY_DELAY_MS = 2000; // Tepat 2 detik setelah website dibuka
  var STORAGE_TIME_KEY = 'baddel_audio_time';
  var STORAGE_PAUSED_KEY = 'baddel_audio_paused';

  var audio = null;
  var widgetEl = null;
  var playBtnEl = null;
  var statusTextEl = null;
  var autoplayTimer = null;

  var BaddelAudio = {
    init: function () {
      if (typeof window === 'undefined') return;
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          BaddelAudio.setup();
        });
      } else {
        BaddelAudio.setup();
      }
    },

    setup: function () {
      // 1. Inisialisasi Objek Audio
      audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';
      audio.muted = false;
      audio.volume = TARGET_VOLUME;

      // Cek dukungan format mp3 atau mpeg
      var canPlayMp3 = audio.canPlayType('audio/mpeg');
      audio.src = canPlayMp3 ? SONG_SRC : SONG_SRC_FALLBACK;

      // Error handling: jika .mp3 gagal dimuat, alihkan ke .mpeg
      audio.addEventListener('error', function () {
        if (audio.src.indexOf('.mp3') !== -1) {
          audio.src = SONG_SRC_FALLBACK;
          audio.load();
        }
      });

      // Kembalikan posisi waktu lagu di sesi ini jika ada
      try {
        var savedTime = parseFloat(sessionStorage.getItem(STORAGE_TIME_KEY) || '0');
        if (!isNaN(savedTime) && savedTime > 0) {
          audio.currentTime = savedTime;
        }
      } catch (e) {}

      // Sinkronisasi posisi waktu secara berkala
      setInterval(function () {
        if (audio && !audio.paused && !isNaN(audio.currentTime)) {
          try {
            sessionStorage.setItem(STORAGE_TIME_KEY, audio.currentTime.toFixed(1));
          } catch (e) {}
        }
      }, 3000);

      window.addEventListener('beforeunload', function () {
        if (audio && !isNaN(audio.currentTime)) {
          try {
            sessionStorage.setItem(STORAGE_TIME_KEY, audio.currentTime.toFixed(1));
          } catch (e) {}
        }
      });

      // 2. Render Widget Mini di DOM
      BaddelAudio.renderWidget();

      // 3. Cek preferensi pengunjung sebelumnya
      var userPaused = false;
      try {
        userPaused = sessionStorage.getItem(STORAGE_PAUSED_KEY) === 'true';
      } catch (e) {}

      if (!userPaused) {
        // Pasang interaction listener di seluruh halaman:
        // Jika pengunjung mengetuk/klik di mana saja sebelum atau sesudah 2 detik, suara langsung keluar!
        BaddelAudio.attachInteractionListeners();
        // Jadwalkan pemutaran bersuara setelah 2 detik
        BaddelAudio.scheduleAutoplay();
      } else {
        BaddelAudio.updateUI(false);
      }
    },

    renderWidget: function () {
      if (document.getElementById('baddel-audio-widget')) {
        widgetEl = document.getElementById('baddel-audio-widget');
      } else {
        widgetEl = document.createElement('div');
        widgetEl.id = 'baddel-audio-widget';
        widgetEl.className = 'baddel-audio-widget';
        widgetEl.setAttribute('role', 'region');
        widgetEl.setAttribute('aria-label', 'Baddel Theme Song Player');
        widgetEl.setAttribute('title', 'Klik untuk Hidupkan / Matikan Musik');

        widgetEl.innerHTML = [
          '<!-- Mini vinyl disc -->',
          '<div class="baddel-audio-disc-wrap" id="baddel-audio-disc-wrap">',
          '  <div class="baddel-audio-disc">',
          '    <div class="baddel-audio-disc-center"></div>',
          '  </div>',
          '</div>',
          '',
          '<!-- Mini track info -->',
          '<div class="baddel-audio-info">',
          '  <div class="baddel-audio-title">Theme Song</div>',
          '  <div class="baddel-audio-sub">',
          '    <span class="baddel-audio-eq" aria-hidden="true">',
          '      <span></span><span></span><span></span>',
          '    </span>',
          '    <span id="baddel-audio-status-text">Play</span>',
          '  </div>',
          '</div>',
          '',
          '<!-- Control toggle button -->',
          '<button type="button" class="baddel-audio-btn baddel-audio-btn--play" id="baddel-audio-play-btn" aria-label="Putar / Matikan Musik" title="Putar Musik">',
          '  <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>',
          '  <svg class="icon-pause" style="display:none;" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
          '</button>'
        ].join('\n');

        document.body.appendChild(widgetEl);
      }

      playBtnEl = document.getElementById('baddel-audio-play-btn');
      statusTextEl = document.getElementById('baddel-audio-status-text');

      // Klik di area widget mana saja akan memutar/menjeda lagu
      widgetEl.addEventListener('click', function () {
        BaddelAudio.togglePlay();
      });

      // Event status audio
      audio.addEventListener('play', function () {
        BaddelAudio.updateUI(true);
      });

      audio.addEventListener('pause', function () {
        BaddelAudio.updateUI(false);
      });
    },

    scheduleAutoplay: function () {
      if (!audio) return;
      if (autoplayTimer) clearTimeout(autoplayTimer);

      // Coba mulai autoplay bersuara setelah 2 detik
      autoplayTimer = setTimeout(function () {
        var userPaused = false;
        try {
          userPaused = sessionStorage.getItem(STORAGE_PAUSED_KEY) === 'true';
        } catch (e) {}

        if (userPaused || !audio || !audio.paused) return;

        // Pastikan suara tidak di-mute dan volume penuh
        audio.muted = false;
        audio.volume = TARGET_VOLUME;

        var playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(function () {
            // Berhasil autoplay bersuara langsung!
            BaddelAudio.updateUI(true);
          }).catch(function () {
            // Browser membatasi audio bersuara sebelum interaksi klik:
            // JANGAN putar secara bisu (muted). Biarkan tombol bersiap,
            // dan langsung bunyi dengan suara penuh saat pengunjung pertama kali klik di mana pun!
            BaddelAudio.updateUI(false);
          });
        }
      }, AUTOPLAY_DELAY_MS);
    },

    attachInteractionListeners: function () {
      var interactionEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];

      function handleFirstInteraction(evt) {
        var userPaused = false;
        try {
          userPaused = sessionStorage.getItem(STORAGE_PAUSED_KEY) === 'true';
        } catch (e) {}

        if (!userPaused && audio && audio.paused) {
          audio.muted = false;
          audio.volume = TARGET_VOLUME;
          audio.play().then(function () {
            BaddelAudio.updateUI(true);
          }).catch(function (err) {
            console.warn('Playback on interaction:', err);
          });
        }

        // Lepas listener setelah interaksi pertama
        interactionEvents.forEach(function (evName) {
          window.removeEventListener(evName, handleFirstInteraction, true);
        });
      }

      interactionEvents.forEach(function (evName) {
        window.addEventListener(evName, handleFirstInteraction, { capture: true, passive: true });
      });
    },

    togglePlay: function () {
      if (!audio) return;

      // Batalkan timer autoplay jika ada interaksi manual
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
      }

      if (audio.paused) {
        // Pengunjung ingin menyalakan musik
        try {
          sessionStorage.removeItem(STORAGE_PAUSED_KEY);
        } catch (e) {}

        audio.muted = false;
        audio.volume = TARGET_VOLUME;
        audio.play().then(function () {
          BaddelAudio.updateUI(true);
        }).catch(function (err) {
          console.error('Audio play error:', err);
        });
      } else {
        // Pengunjung ingin mematikan musik
        try {
          sessionStorage.setItem(STORAGE_PAUSED_KEY, 'true');
        } catch (e) {}

        audio.pause();
        BaddelAudio.updateUI(false);
      }
    },

    updateUI: function (isPlaying) {
      if (!widgetEl) return;

      if (isPlaying) {
        widgetEl.classList.add('is-playing');
        widgetEl.setAttribute('title', 'Theme Song Baddel (Aktif - Klik untuk Matikan)');
        if (statusTextEl) statusTextEl.textContent = 'Playing';
        if (playBtnEl) {
          playBtnEl.setAttribute('title', 'Matikan Musik');
          var iconPlay = playBtnEl.querySelector('.icon-play');
          var iconPause = playBtnEl.querySelector('.icon-pause');
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconPause) iconPause.style.display = 'block';
        }
      } else {
        widgetEl.classList.remove('is-playing');
        widgetEl.setAttribute('title', 'Theme Song Baddel (Klik untuk Putar)');
        if (statusTextEl) statusTextEl.textContent = 'Play';
        if (playBtnEl) {
          playBtnEl.setAttribute('title', 'Putar Musik');
          var iconPlay2 = playBtnEl.querySelector('.icon-play');
          var iconPause2 = playBtnEl.querySelector('.icon-pause');
          if (iconPlay2) iconPlay2.style.display = 'block';
          if (iconPause2) iconPause2.style.display = 'none';
        }
      }
    }
  };

  // Expose to window
  window.BaddelAudio = BaddelAudio;
  BaddelAudio.init();
})();
