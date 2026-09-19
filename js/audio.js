/* ============================================
   BADDEL COMMUNITY — AUDIO CONTROLLER (AUDIO.JS)
   Theme Song Player with Autoplay & Interaction Fallback
   ============================================ */

(function () {
  'use strict';

  var SONG_SRC = 'assets/songs/Baddel%20Theme%20Song.mpeg';
  var TARGET_VOLUME = 0.38;
  var STORAGE_TIME_KEY = 'baddel_audio_time';
  var STORAGE_PAUSED_KEY = 'baddel_audio_paused';
  var STORAGE_MUTED_KEY = 'baddel_audio_muted';

  var audio = null;
  var widgetEl = null;
  var playBtnEl = null;
  var muteBtnEl = null;
  var eqEl = null;
  var hintEl = null;
  var isFading = false;
  var fadeInterval = null;

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

      // Restore time if previously playing in this session
      try {
        var savedTime = parseFloat(sessionStorage.getItem(STORAGE_TIME_KEY) || '0');
        if (!isNaN(savedTime) && savedTime > 0) {
          audio.currentTime = savedTime;
        }
      } catch (e) {
        // sessionStorage restricted / unavailable
      }

      // Restore mute state
      try {
        var savedMuted = sessionStorage.getItem(STORAGE_MUTED_KEY) === 'true';
        audio.muted = savedMuted;
      } catch (e) {
        // ignore
      }

      // Periodic time sync to sessionStorage (every 2.5s)
      setInterval(function () {
        if (audio && !audio.paused && !isNaN(audio.currentTime)) {
          try {
            sessionStorage.setItem(STORAGE_TIME_KEY, audio.currentTime.toFixed(1));
          } catch (e) {}
        }
      }, 2500);

      window.addEventListener('beforeunload', function () {
        if (audio && !isNaN(audio.currentTime)) {
          try {
            sessionStorage.setItem(STORAGE_TIME_KEY, audio.currentTime.toFixed(1));
          } catch (e) {}
        }
      });

      // 2. Render Widget in DOM
      BaddelAudio.renderWidget();

      // 3. Check User Explicit Preference
      var userWantsPaused = false;
      try {
        userWantsPaused = sessionStorage.getItem(STORAGE_PAUSED_KEY) === 'true';
      } catch (e) {}

      // 4. Try Autoplay
      if (!userWantsPaused) {
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

        widgetEl.innerHTML = [
          '<!-- Hint tooltip when awaiting user interaction -->',
          '<div class="baddel-audio-hint" id="baddel-audio-hint">',
          '  <span>🎵</span>',
          '  <span>Klik untuk dengar Theme Song Baddel</span>',
          '</div>',
          '',
          '<!-- Vinyl disc art -->',
          '<div class="baddel-audio-disc-wrap" id="baddel-audio-disc-wrap" title="Putar / Jeda Lagu" role="button" tabindex="0">',
          '  <div class="baddel-audio-disc">',
          '    <div class="baddel-audio-disc-center"></div>',
          '  </div>',
          '</div>',
          '',
          '<!-- Song info -->',
          '<div class="baddel-audio-info">',
          '  <div class="baddel-audio-title">Baddel Theme Song</div>',
          '  <div class="baddel-audio-sub">',
          '    <span class="baddel-audio-eq" aria-hidden="true">',
          '      <span></span><span></span><span></span>',
          '    </span>',
          '    <span id="baddel-audio-status-text">Official Theme</span>',
          '  </div>',
          '</div>',
          '',
          '<!-- Controls -->',
          '<div class="baddel-audio-controls">',
          '  <button type="button" class="baddel-audio-btn baddel-audio-btn--play" id="baddel-audio-play-btn" aria-label="Play or Pause Song" title="Play / Pause">',
          '    <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>',
          '    <svg class="icon-pause" style="display:none;" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
          '  </button>',
          '  <button type="button" class="baddel-audio-btn" id="baddel-audio-mute-btn" aria-label="Mute or Unmute" title="Mute / Unmute">',
          '    <svg class="icon-vol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
          '      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>',
          '      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>',
          '    </svg>',
          '    <svg class="icon-mute" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
          '      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>',
          '      <line x1="23" y1="9" x2="17" y2="15"></line>',
          '      <line x1="17" y1="9" x2="23" y2="15"></line>',
          '    </svg>',
          '  </button>',
          '</div>'
        ].join('\n');

        document.body.appendChild(widgetEl);
      }

      playBtnEl = document.getElementById('baddel-audio-play-btn');
      muteBtnEl = document.getElementById('baddel-audio-mute-btn');
      eqEl = widgetEl.querySelector('.baddel-audio-eq');
      hintEl = document.getElementById('baddel-audio-hint');

      // Bind events
      var discWrap = document.getElementById('baddel-audio-disc-wrap');
      if (discWrap) {
        discWrap.addEventListener('click', function () {
          BaddelAudio.togglePlay();
        });
        discWrap.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            BaddelAudio.togglePlay();
          }
        });
      }

      if (playBtnEl) {
        playBtnEl.addEventListener('click', function (e) {
          e.stopPropagation();
          BaddelAudio.togglePlay();
        });
      }

      if (muteBtnEl) {
        muteBtnEl.addEventListener('click', function (e) {
          e.stopPropagation();
          BaddelAudio.toggleMute();
        });
      }

      // Audio event listeners
      audio.addEventListener('play', function () {
        BaddelAudio.updateUI(true);
      });

      audio.addEventListener('pause', function () {
        BaddelAudio.updateUI(false);
      });

      audio.addEventListener('ended', function () {
        BaddelAudio.updateUI(false);
      });
    },

    attemptAutoplay: function () {
      audio.volume = 0;
      var playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.then(function () {
          // Autoplay was allowed directly
          BaddelAudio.fadeIn(TARGET_VOLUME, 1500);
          BaddelAudio.updateUI(true);
          BaddelAudio.hideHint();
        }).catch(function (error) {
          // Browser prevented autoplay due to lack of prior user gesture
          console.info('Baddel Audio: Autoplay blocked by browser policy. Ready to play on first interaction.');
          BaddelAudio.updateUI(false);
          BaddelAudio.showHint();
          BaddelAudio.attachInteractionListeners();
        });
      }
    },

    attachInteractionListeners: function () {
      var interactionEvents = ['pointerdown', 'touchstart', 'click', 'scroll', 'keydown'];

      function handleFirstInteraction(evt) {
        // If user clicked the pause button specifically, let that handler deal with it
        var target = evt.target;
        if (target && target.closest && target.closest('#baddel-audio-widget')) {
          // Inside widget, let widget handle
        } else {
          // User interacted with the document
          var userWantsPaused = false;
          try {
            userWantsPaused = sessionStorage.getItem(STORAGE_PAUSED_KEY) === 'true';
          } catch (e) {}

          if (!userWantsPaused && audio && audio.paused) {
            audio.play().then(function () {
              BaddelAudio.fadeIn(TARGET_VOLUME, 1500);
              BaddelAudio.updateUI(true);
              BaddelAudio.hideHint();
            }).catch(function (e) {
              console.warn('Playback on interaction error:', e);
            });
          }
        }

        // Remove one-time listeners
        interactionEvents.forEach(function (eventName) {
          window.removeEventListener(eventName, handleFirstInteraction, { capture: true, passive: true });
        });
      }

      interactionEvents.forEach(function (eventName) {
        window.addEventListener(eventName, handleFirstInteraction, { capture: true, passive: true, once: true });
      });
    },

    fadeIn: function (targetVol, durationMs) {
      if (!audio) return;
      if (fadeInterval) clearInterval(fadeInterval);

      var steps = 30;
      var stepTime = durationMs / steps;
      var stepIncrement = targetVol / steps;
      audio.volume = 0;

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

    togglePlay: function () {
      if (!audio) return;

      if (audio.paused) {
        try {
          sessionStorage.removeItem(STORAGE_PAUSED_KEY);
        } catch (e) {}

        audio.play().then(function () {
          BaddelAudio.fadeIn(TARGET_VOLUME, 800);
          BaddelAudio.updateUI(true);
          BaddelAudio.hideHint();
        }).catch(function (err) {
          console.error('Audio play error:', err);
        });
      } else {
        try {
          sessionStorage.setItem(STORAGE_PAUSED_KEY, 'true');
        } catch (e) {}

        audio.pause();
        BaddelAudio.updateUI(false);
      }
    },

    toggleMute: function () {
      if (!audio) return;
      audio.muted = !audio.muted;
      try {
        sessionStorage.setItem(STORAGE_MUTED_KEY, audio.muted ? 'true' : 'false');
      } catch (e) {}
      BaddelAudio.updateMuteUI();
    },

    showHint: function () {
      if (widgetEl) {
        widgetEl.classList.add('has-hint');
      }
    },

    hideHint: function () {
      if (widgetEl) {
        widgetEl.classList.remove('has-hint');
      }
    },

    updateUI: function (isPlaying) {
      if (!widgetEl) return;

      var statusText = document.getElementById('baddel-audio-status-text');

      if (isPlaying) {
        widgetEl.classList.add('is-playing');
        if (statusText) statusText.textContent = 'Memutar Musik';
        if (playBtnEl) {
          var iconPlay = playBtnEl.querySelector('.icon-play');
          var iconPause = playBtnEl.querySelector('.icon-pause');
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconPause) iconPause.style.display = 'block';
        }
      } else {
        widgetEl.classList.remove('is-playing');
        if (statusText) statusText.textContent = 'Theme Song';
        if (playBtnEl) {
          var iconPlay2 = playBtnEl.querySelector('.icon-play');
          var iconPause2 = playBtnEl.querySelector('.icon-pause');
          if (iconPlay2) iconPlay2.style.display = 'block';
          if (iconPause2) iconPause2.style.display = 'none';
        }
      }

      BaddelAudio.updateMuteUI();
    },

    updateMuteUI: function () {
      if (!muteBtnEl || !audio) return;
      var iconVol = muteBtnEl.querySelector('.icon-vol');
      var iconMute = muteBtnEl.querySelector('.icon-mute');

      if (audio.muted) {
        if (iconVol) iconVol.style.display = 'none';
        if (iconMute) iconMute.style.display = 'block';
        muteBtnEl.setAttribute('title', 'Suara Mati (Klik untuk Bunyikan)');
      } else {
        if (iconVol) iconVol.style.display = 'block';
        if (iconMute) iconMute.style.display = 'none';
        muteBtnEl.setAttribute('title', 'Matikan Suara');
      }
    }
  };

  // Expose to window
  window.BaddelAudio = BaddelAudio;
  BaddelAudio.init();
})();
