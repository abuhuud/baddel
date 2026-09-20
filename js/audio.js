/* ============================================
   BADDEL COMMUNITY — AUDIO CONTROLLER (AUDIO.JS)
   Compact Theme Song Player with Autoplay & User Controls
   ============================================ */

(function () {
  'use strict';

  var SONG_SRC = 'assets/songs/Baddel%20Theme%20Song.mpeg';
  var TARGET_VOLUME = 0.32;
  var STORAGE_TIME_KEY = 'baddel_audio_time';
  var STORAGE_PAUSED_KEY = 'baddel_audio_paused';

  var audio = null;
  var widgetEl = null;
  var playBtnEl = null;
  var statusTextEl = null;

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

      // 3. Autoplay if user hasn't explicitly chosen to turn it off
      var userPaused = false;
      try {
        userPaused = sessionStorage.getItem(STORAGE_PAUSED_KEY) === 'true';
      } catch (e) {}

      if (!userPaused) {
        BaddelAudio.attemptAutoplay();
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
          '    <span id="baddel-audio-status-text">Playing</span>',
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

    attemptAutoplay: function () {
      if (!audio) return;
      audio.volume = TARGET_VOLUME;

      var playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(function () {
          // Autoplay allowed directly
          BaddelAudio.updateUI(true);
        }).catch(function () {
          // Blocked by browser until user gesture: start on first interaction
          BaddelAudio.updateUI(false);
          BaddelAudio.attachInteractionListeners();
        });
      }
    },

    attachInteractionListeners: function () {
      var interactionEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];

      function handleFirstInteraction(evt) {
        var userPaused = false;
        try {
          userPaused = sessionStorage.getItem(STORAGE_PAUSED_KEY) === 'true';
        } catch (e) {}

        if (!userPaused && audio && audio.paused) {
          audio.volume = TARGET_VOLUME;
          audio.play().then(function () {
            BaddelAudio.updateUI(true);
          }).catch(function (err) {
            console.warn('Audio interaction play notice:', err);
          });
        }

        // Clean up listeners
        interactionEvents.forEach(function (evName) {
          window.removeEventListener(evName, handleFirstInteraction, true);
        });
      }

      interactionEvents.forEach(function (evName) {
        window.addEventListener(evName, handleFirstInteraction, { capture: true, once: true });
      });
    },

    togglePlay: function () {
      if (!audio) return;

      if (audio.paused) {
        // Visitor wants to play
        try {
          sessionStorage.removeItem(STORAGE_PAUSED_KEY);
        } catch (e) {}

        audio.volume = TARGET_VOLUME;
        audio.play().then(function () {
          BaddelAudio.updateUI(true);
        }).catch(function (err) {
          console.error('Audio play error:', err);
        });
      } else {
        // Visitor wants to pause / turn off
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
        widgetEl.setAttribute('title', 'Theme Song Baddel (Mati - Klik untuk Bunyikan)');
        if (statusTextEl) statusTextEl.textContent = 'Muted';
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
