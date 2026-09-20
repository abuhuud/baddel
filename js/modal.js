/* ============================================
   BADCOM — MODAL.JS
   Player Profile Modal
   ============================================ */

var BadcomModal = (function () {

  var overlay = null;
  var modal = null;
  var currentIndex = 0;
  var players = [];

  /* ——— Init ——— */
  function init() {
    overlay = document.getElementById('modal-overlay');
    modal = document.getElementById('player-modal');
    players = (window.BadcomData && typeof window.BadcomData.getPlayers === 'function')
      ? window.BadcomData.getPlayers()
      : (window.BadcomData && window.BadcomData.players) || [];

    if (!overlay || !modal) return;

    /* Close on overlay click */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    /* Close button */
    var closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.addEventListener('click', close);

    /* ESC key */
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    /* Nav buttons */
    var prevBtn = document.getElementById('modal-prev');
    var nextBtn = document.getElementById('modal-next');
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
  }

  /* ——— Open by player id ——— */
  function open(playerId) {
    if (window.BadcomData && typeof window.BadcomData.getPlayers === 'function') {
      players = window.BadcomData.getPlayers();
    } else if (window.BadcomData && window.BadcomData.players) {
      players = window.BadcomData.players;
    }

    if (!overlay || !modal || !players || players.length === 0) {
      init();
    }
    if (!overlay || !modal) return;

    var index = players.findIndex(function (p) { return p.id === playerId; });
    if (index < 0) index = 0;
    currentIndex = index;
    render(players[currentIndex]);
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var closeBtn = document.getElementById('modal-close');
      if (closeBtn) closeBtn.focus();
    }, 200);
  }

  /* ——— Close ——— */
  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ——— Prev / Next ——— */
  function prev() {
    currentIndex = (currentIndex - 1 + players.length) % players.length;
    renderAnimated(players[currentIndex]);
  }

  function next() {
    currentIndex = (currentIndex + 1) % players.length;
    renderAnimated(players[currentIndex]);
  }

  /* ——— Render with slide animation ——— */
  function renderAnimated(player) {
    var content = modal.querySelector('.modal__inner');
    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'translateX(20px)';
      setTimeout(function () {
        render(player);
        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateX(0)';
        setTimeout(function () {
          content.style.transition = '';
        }, 300);
      }, 150);
    } else {
      render(player);
    }
  }

  /* ——— Render player content into modal ——— */
  function render(player) {
    var playerNum = player.number || player.num || '00';
    var playerName = player.name || 'PLAYER';

    /* Image side */
    var imgSide = document.getElementById('modal-image-side');
    if (imgSide) {
      if (player.hasImage && player.image) {
        imgSide.innerHTML = [
          '<img class="modal__image" src="' + player.image + '"',
          '  alt="' + escapeHTML(playerName) + '"',
          '  onerror="this.parentElement.innerHTML=\'<div class=\\\"modal__image-placeholder\\\"><span class=\\\"modal__image-num\\\">' + escapeHTML(playerNum) + '</span></div>\'"',
          '>',
          '<div class="modal__image-overlay"></div>'
        ].join('');
      } else {
        var colors = BadcomData.playerColors;
        var idx = players.indexOf(player);
        var color = colors[idx] || colors[0];
        imgSide.innerHTML = [
          '<div class="modal__image-placeholder" style="background:linear-gradient(160deg,' + color.from + ',' + color.to + ')">',
          '  <span class="modal__image-num">' + escapeHTML(playerNum) + '</span>',
          '</div>',
          '<div class="modal__image-overlay"></div>'
        ].join('');
      }
    }

    /* Number */
    setInner('modal-num', 'PLAYER ' + playerNum);

    /* Name */
    setInner('modal-name', playerName);

    /* Category / Division badge */
    var sportEl = document.getElementById('modal-sport');
    if (sportEl) {
      var cat = (player.category || 'men').toLowerCase();
      var catLabel = cat === 'women' ? "WOMEN'S SQUAD" : "MEN'S SQUAD";
      sportEl.innerHTML = '<span class="sport-badge sport-badge--cat sport-badge--' + cat + '">' + catLabel + '</span>';
    }

    /* Instagram */
    var igEl = document.getElementById('modal-instagram');
    var igStat = igEl ? igEl.closest('.modal__stat') : null;
    if (igEl) {
      if (player.instagram) {
        igEl.textContent = player.instagram + ' ↗';
        igEl.href = 'https://instagram.com/' + player.instagram.replace('@', '');
        if (igStat) igStat.style.display = '';
      } else {
        if (igStat) igStat.style.display = 'none';
      }
    }

    /* Player Gallery */
    var galleryWrap = document.getElementById('modal-gallery-wrap');
    var galleryGrid = document.getElementById('modal-gallery-grid');
    var galleryLabel = document.getElementById('modal-gallery-label');
    var playerGallery = Array.isArray(player.gallery) ? player.gallery.filter(Boolean) : [];

    if (galleryGrid && galleryWrap) {
      galleryWrap.style.display = '';

      if (galleryLabel) {
        if (playerGallery.length > 0) {
          galleryLabel.innerHTML = 'PLAYER GALLERY <span class="modal__gallery-badge">' + playerGallery.length + ' Photos</span>';
        } else {
          galleryLabel.innerHTML = 'PLAYER GALLERY <span class="modal__gallery-badge modal__gallery-badge--empty">0</span>';
        }
      }

      if (playerGallery.length > 0) {
        var displayThumbs = [];
        if (player.hasImage && player.image) {
          displayThumbs.push({ src: player.image, label: 'Main Photo', isMain: true });
        }
        playerGallery.forEach(function (imgSrc, idx) {
          if (imgSrc !== player.image) {
            displayThumbs.push({ src: imgSrc, label: 'Moment ' + (idx + 1), isMain: false });
          }
        });

        galleryGrid.className = 'modal__gallery-grid';
        galleryGrid.innerHTML = displayThumbs.map(function (item, idx) {
          var isActive = (idx === 0) ? ' is-active' : '';
          var tag = item.isMain ? '<span class="modal__gallery-thumb-tag">Main</span>' : '';
          return [
            '<button type="button" class="modal__gallery-thumb' + isActive + '" data-img="' + escapeHTML(item.src) + '" aria-label="' + escapeHTML(item.label) + '">',
            '  <img src="' + escapeHTML(item.src) + '" alt="' + escapeHTML(playerName) + ' ' + escapeHTML(item.label) + '" loading="lazy" decoding="async">',
            tag,
            '</button>'
          ].join('');
        }).join('');

        /* Bind thumbnail click to swap main photo */
        var thumbs = galleryGrid.querySelectorAll('.modal__gallery-thumb');
        thumbs.forEach(function (thumb) {
          thumb.addEventListener('click', function () {
            thumbs.forEach(function (t) { t.classList.remove('is-active'); });
            thumb.classList.add('is-active');
            var targetSrc = thumb.getAttribute('data-img');
            var mainImg = imgSide ? imgSide.querySelector('.modal__image') : null;
            if (mainImg && targetSrc) {
              mainImg.style.transition = 'opacity 0.2s ease';
              mainImg.style.opacity = '0';
              setTimeout(function () {
                mainImg.src = targetSrc;
                mainImg.style.opacity = '1';
              }, 120);
            } else if (imgSide && targetSrc) {
              imgSide.innerHTML = '<img class="modal__image" src="' + escapeHTML(targetSrc) + '" alt="' + escapeHTML(playerName) + '"><div class="modal__image-overlay"></div>';
            }
          });
        });
      } else {
        galleryGrid.className = 'modal__gallery-grid modal__gallery-grid--empty';
        galleryGrid.innerHTML = [
          '<div class="modal__gallery-empty">',
          '  <div class="modal__gallery-empty-icon">',
          '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
          '      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>',
          '      <circle cx="8.5" cy="8.5" r="1.5"></circle>',
          '      <polyline points="21 15 16 10 5 21"></polyline>',
          '    </svg>',
          '  </div>',
          '  <div class="modal__gallery-empty-content">',
          '    <div class="modal__gallery-empty-title">Empty Gallery</div>',
          '    <div class="modal__gallery-empty-desc">No moment photos uploaded for this player yet.</div>',
          '  </div>',
          '</div>'
        ].join('');
      }
    }

    /* Nav labels */
    var prevPlayer = players[(currentIndex - 1 + players.length) % players.length];
    var nextPlayer = players[(currentIndex + 1) % players.length];
    setInner('modal-prev-name', '← ' + prevPlayer.name);
    setInner('modal-next-name', nextPlayer.name + ' →');

    /* Reset scroll */
    modal.scrollTop = 0;
  }

  function setInner(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') str = String(str);
    return str.replace(/[&<>"']/g, function (m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m];
    });
  }


  return { init: init, open: open, close: close };

})();
