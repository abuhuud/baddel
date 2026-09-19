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
    players = BadcomData.players;

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
    /* Image side */
    var imgSide = document.getElementById('modal-image-side');
    if (imgSide) {
      if (player.hasImage && player.image) {
        imgSide.innerHTML = [
          '<img class="modal__image" src="' + player.image + '"',
          '  alt="' + player.name + '"',
          '  onerror="this.parentElement.innerHTML=\'<div class=\\\"modal__image-placeholder\\\"><span class=\\\"modal__image-num\\\">' + player.number + '</span></div>\'"',
          '>',
          '<div class="modal__image-overlay"></div>'
        ].join('');
      } else {
        var colors = BadcomData.playerColors;
        var idx = players.indexOf(player);
        var color = colors[idx] || colors[0];
        imgSide.innerHTML = [
          '<div class="modal__image-placeholder" style="background:linear-gradient(160deg,' + color.from + ',' + color.to + ')">',
          '  <span class="modal__image-num">' + player.number + '</span>',
          '</div>',
          '<div class="modal__image-overlay"></div>'
        ].join('');
      }
    }

    /* Number */
    setInner('modal-num', 'PLAYER ' + player.number);

    /* Name */
    setInner('modal-name', player.name);

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
    var playerGallery = (player.gallery && player.gallery.length)
      ? player.gallery
      : (player.hasImage && player.image ? [player.image] : []);

    if (galleryGrid) {
      if (playerGallery.length > 0) {
        if (galleryWrap) galleryWrap.style.display = '';
        galleryGrid.innerHTML = playerGallery.map(function (imgSrc, idx) {
          var isActive = (idx === 0) ? ' is-active' : '';
          return [
            '<button type="button" class="modal__gallery-thumb' + isActive + '" data-img="' + escapeHTML(imgSrc) + '" aria-label="Photo ' + (idx + 1) + '">',
            '  <img src="' + escapeHTML(imgSrc) + '" alt="' + escapeHTML(player.name) + ' moment ' + (idx + 1) + '" loading="lazy" decoding="async">',
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
            }
          });
        });
      } else {
        if (galleryWrap) galleryWrap.style.display = 'none';
        galleryGrid.innerHTML = '';
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

  /* Public findIndex polyfill */
  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (fn) {
      for (var i = 0; i < this.length; i++) {
        if (fn(this[i], i, this)) return i;
      }
      return -1;
    };
  }

  return { init: init, open: open, close: close };

})();
