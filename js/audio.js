/* ============================================
   BADDEL COMMUNITY — AUDIO CONTROLLER (AUDIO.JS)
   Compact Theme Song Player with 2s Autoplay & User Controls
   ============================================ */

(function () {
  'use strict';

  var SONG_SRC = 'assets/songs/Baddel%20Theme%20Song.mpeg';
  var TARGET_VOLUME = 0.32;
  var AUTOPLAY_DELAY_MS = 2000; // Tepat 2 detik setelah pengunjung masuk ke website
  var STORAGE_TIME_KEY = 'baddel_audio_time';
  var STORAGE_PAUSED_KEY = 'baddel_audio_paused';

  var audio = null;
  var widgetEl = null;
  var playBtnEl = null;
  var statusTextEl = null;
  var autoplayTimer = null;
  var fadeInterval = null;
  var interactionBound = false;

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
      // 1. Create Audio Element
      audio = new Audio();
      audio.src = SONG_SRC;
      audio.loop = true;
      audio.preload = 'auto';

      // Restore playback position in session
      try {
        var savedTime = parseFloat(sessionStorage.getItem(STORAGE_TIME_KEY) || '0');
        if (!isNaN(savedTime) && savedTime > 0) {
          audio.currentTime = savedTime;
        }
      } catch (e) {}

      // Periodic time sync
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

      // 2. Render Compact Widget in DOM
      BaddelAudio.renderWidget();

      // 3. Check if user previously paused
      var userPaused = false;
      try {
        userPaused = sessionStorage.getItem(STORAGE_PAUSED_KEY) === 'true';
      } catch (e) {}

      if (!userPaused) {
        // Pasang interaction listener langsung agar jika pengunjung klik/tap sebelum 2 detik, langsung siap
        BaddelAudio.attachInteractionListeners();
        // Jadwalkan autoplay setelah tepat 2 detik
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
          '    <span id="baddel-audio-status-text">Baddel</span>',
          '  </div>',
          '</div>',
          '',
          '<!-- Control toggle button -->',
          '<button type="button" class="baddel-audio-btn baddel-audio-btn--play" id="baddel-audio-play-btn" aria-label="Putar / Matikan Musik" title="Matikan Musik">',
          '  <svg class="icon-play" style="display:none;" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>',
          '  <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
          '</button>'
        ].join('\n');

        document.body.appendChild(widgetEl);
      }

      playBtnEl = document.getElementById('baddel-audio-play-btn');
      statusTextEl = document.getElementById('baddel-audio-status-text');

      // Click anywhere on widget toggles music
      widgetEl.addEventListener('click', function () {
        BaddelAudio.togglePlay();
      });

      // Audio state events
      audio.addEventListener('play', function () {
        BaddelAudio.updateUI(true);
      });

      audio.addEventListener('pause', function () {
        BaddelAudio.updateUI(false);
      });
    },

    fadeIn: function (targetVol, durationMs) {
      if (!audio) return;
      if (fadeInterval) clearInterval(fadeInterval);

      var steps = 20;
      var stepTime = (durationMs || 1000) / steps;
      var stepIncrement = targetVol / steps;
      audio.volume = 0;
      audio.muted = false;

      fadeInterval = setInterval(function () {
        if (!audio || audio.paused) {
          clearInterval(fadeInterval);
          return;
        }
        if (audio.volume + stepIncrement < targetVol) {
          audio.volume = Math.min(audio.volume + stepIncrement, 1);
        } else {
          audio.volume = targetVol;
          clearInterval(fadeInterval);
        }
      }, stepTime);
    },

    scheduleAutoplay: function () {
      if (!audio) return;
      if (autoplayTimer) clearTimeout(autoplayTimer);

      // Mulai autoplay setelah 2 detik
      autoplayTimer = setTimeout(function () {
        var userPaused = false;
        try {
          userPaused = sessionStorage.getItem(STORAGE_PAUSED_KEY) === 'true';
        } catch (e) {}

        if (userPaused || !audio || !audio.paused) return;

        // Coba putar bersuara langsung
        audio.muted = false;
        audio.volume = 0;
        var playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(function () {
            BaddelAudio.fadeIn(TARGET_VOLUME, 1200);
            BaddelAudio.updateUI(true);
          }).catch(function () {
            // Jika browser memblokir unmuted autoplay tanpa gestur:
            // Putar dalam mode muted agar piringan berputar & audio jalan,
            // lalu otomatis bersuara pada sentuhan/klik pertama pengguna!
            audio.muted = true;
            audio.play().then(function () {
              BaddelAudio.updateUI(true);
            }).catch(function () {});
          });
        }
      }, AUTOPLAY_DELAY_MS);
    },

    attachInteractionListeners: function () {
      if (interactionBound) return;
      interactionBound = true;

      var interactionEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];

      function handleFirstInteraction(evt) {
        var userPaused = false;
        try {
          userPaused = sessionStorage.getItem(STORAGE_PAUSED_KEY) === 'true';
        } catch (e) {}

        if (!userPaused && audio) {
          audio.muted = false;
          if (audio.paused) {
            audio.volume = 0;
            audio.play().then(function () {
              BaddelAudio.fadeIn(TARGET_VOLUME, 1000);
              BaddelAudio.updateUI(true);
            }).catch(function () {});
          } else if (audio.volume === 0 || audio.muted) {
            BaddelAudio.fadeIn(TARGET_VOLUME, 1000);
            BaddelAudio.updateUI(true);
          }
        }

        // Lepas listener setelah gestur pertama
        interactionEvents.forEach(function (evName) {
          window.removeEventListener(evName, handleFirstInteraction, true);
        });
        interactionBound = false;
      }

      interactionEvents.forEach(function (evName) {
        window.addEventListener(evName, handleFirstInteraction, { capture: true, once: true });
      });
    },

    togglePlay: function () {
      if (!audio) return;

      // Batalkan timer autoplay jika pengguna klik manual
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
      }

      if (audio.paused || audio.muted) {
        // Pengunjung ingin menyalakan lagu
        try {
          sessionStorage.removeItem(STORAGE_PAUSED_KEY);
        } catch (e) {}

        audio.muted = false;
        audio.volume = 0;
        audio.play().then(function () {
          BaddelAudio.fadeIn(TARGET_VOLUME, 800);
          BaddelAudio.updateUI(true);
        }).catch(function (err) {
          console.error('Audio play error:', err);
        });
      } else {
        // Pengunjung ingin mematikan lagu
        try {
          sessionStorage.setItem(STORAGE_PAUSED_KEY, 'true');
        } catch (e) {}

        if (fadeInterval) clearInterval(fadeInterval);
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
        widgetEl.setAttribute('title', 'Theme Song Baddel (Mati - Klik untuk Bunyikan)');
        if (statusTextEl) statusTextEl.textContent = 'Paused';
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
