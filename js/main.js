/* ============================================
   BADCOM — MAIN.JS
   Entry Point — Initialize All Modules
   ============================================ */

(function () {

  'use strict';

  /* ——— DOMContentLoaded ——— */
  document.addEventListener('DOMContentLoaded', function () {
    BadcomNav.init();
    BadcomModal.init();
    BadcomPlayers.init();
    BadcomAnimations.init();
    initCommunityGallery();
    initMisc();
  });

  /* ——— Dynamic Kinetic Community Gallery & Cinematic Lightbox ——— */
  function initCommunityGallery() {
    var track1 = document.getElementById('gallery-track-1');
    var track2 = document.getElementById('gallery-track-2');
    var streamContainer = document.getElementById('gallery-stream-container');
    var toggleBtn = document.getElementById('gallery-ctrl-toggle');
    var countBadge = document.getElementById('gallery-items-count');

    if (!window.BadcomData || typeof window.BadcomData.getCommunityGallery !== 'function') return;

    var galleryItems = [];
    var activeIndex = 0;

    // Lightbox elements
    var lightbox = document.getElementById('community-lightbox');
    var lbBackdrop = document.getElementById('lightbox-backdrop');
    var lbClose = document.getElementById('lightbox-close');
    var lbPrev = document.getElementById('lightbox-prev');
    var lbNext = document.getElementById('lightbox-next');
    var lbImg = document.getElementById('lightbox-img');
    var lbTitle = document.getElementById('lightbox-title');
    var lbSub = document.getElementById('lightbox-sub');
    var lbTag = document.getElementById('lightbox-tag');
    var lbCount = document.getElementById('lightbox-count');
    var lbThumbs = document.getElementById('lightbox-thumbs');

    function escapeHTML(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    }

    function renderGallery() {
      galleryItems = window.BadcomData.getCommunityGallery() || [];
      if (galleryItems.length === 0) return;

      if (countBadge) {
        countBadge.textContent = galleryItems.length + ' MOMENTS';
      }

      // Split items alternating into two tracks
      var row1Items = [];
      var row2Items = [];

      galleryItems.forEach(function (item, idx) {
        if (idx % 2 === 0) {
          row1Items.push(item);
        } else {
          row2Items.push(item);
        }
      });

      if (row2Items.length === 0) row2Items = row1Items.slice();

      // Duplicate each row 4 times for continuous, seamless infinite loop
      function createCardsHTML(itemsList) {
        var quadList = itemsList.concat(itemsList, itemsList, itemsList);
        return quadList.map(function (item) {
          var origIdx = galleryItems.indexOf(item);
          if (origIdx === -1) origIdx = 0;
          var tag = item.tag || 'COMMUNITY';
          var title = item.title || 'Baddel Moment';
          var sub = item.subtitle || item.sub || 'Royal Sports — 2026';

          return [
            '<div class="gallery-card" data-idx="' + origIdx + '" role="button" tabindex="0" aria-label="' + escapeHTML(title) + '">',
            '  <img class="gallery-card__img" src="' + escapeHTML(item.image) + '" alt="' + escapeHTML(title) + '" loading="lazy" decoding="async">',
            '  <span class="gallery-card__tag">' + escapeHTML(tag) + '</span>',
            '  <div class="gallery-card__action">',
            '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
            '      <path d="M15 3h6v6"></path><path d="M10 14L21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>',
            '    </svg>',
            '    <span>View Details</span>',
            '  </div>',
            '  <div class="gallery-card__overlay">',
            '    <div class="gallery-card__caption">',
            '      <div class="gallery-card__title">' + escapeHTML(title) + '</div>',
            '      <div class="gallery-card__sub">' + escapeHTML(sub) + '</div>',
            '    </div>',
            '  </div>',
            '</div>'
          ].join('');
        }).join('');
      }

      if (track1) track1.innerHTML = createCardsHTML(row1Items);
      if (track2) track2.innerHTML = createCardsHTML(row2Items);

      bindCardInteractions();
    }

    function bindCardInteractions() {
      var allCards = document.querySelectorAll('.gallery-card');
      allCards.forEach(function (card) {
        card.addEventListener('click', function () {
          var idx = parseInt(card.getAttribute('data-idx'), 10);
          if (!isNaN(idx) && galleryItems[idx]) {
            openLightbox(idx);
          }
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            var idx = parseInt(card.getAttribute('data-idx'), 10);
            if (!isNaN(idx) && galleryItems[idx]) {
              openLightbox(idx);
            }
          }
        });
      });
    }

    // Listen for remote data synchronization
    window.addEventListener('baddel:data-synced', function () {
      renderGallery();
    });

    // Play / Pause Stream Controller
    var isPaused = false;
    if (toggleBtn && streamContainer) {
      toggleBtn.addEventListener('click', function () {
        isPaused = !isPaused;
        if (isPaused) {
          streamContainer.classList.add('is-paused');
          toggleBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> <span>RESUME</span>';
        } else {
          streamContainer.classList.remove('is-paused');
          toggleBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> <span>PAUSE</span>';
        }
      });
    }

    // Cinematic Lightbox Functions
    function openLightbox(index) {
      if (!lightbox || !galleryItems[index]) return;
      activeIndex = index;
      renderLightboxCurrent();
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function renderLightboxCurrent() {
      var item = galleryItems[activeIndex];
      if (!item) return;

      if (lbImg) {
        lbImg.style.opacity = '0';
        lbImg.style.transform = 'scale(0.97)';
        setTimeout(function () {
          lbImg.src = item.image;
          lbImg.alt = item.title || 'Baddel Moment';
          lbImg.style.opacity = '1';
          lbImg.style.transform = 'scale(1)';
        }, 80);
      }

      if (lbTitle) lbTitle.textContent = item.title || 'Baddel Moment';
      if (lbSub) lbSub.textContent = item.subtitle || item.sub || 'Royal Sports — 2026';
      if (lbTag) lbTag.textContent = item.tag || 'MOMENT';
      if (lbCount) lbCount.textContent = (activeIndex + 1) + ' / ' + galleryItems.length;

      // Render thumbnail strip
      if (lbThumbs) {
        lbThumbs.innerHTML = galleryItems.map(function (it, i) {
          var activeClass = (i === activeIndex) ? ' is-active' : '';
          return '<button type="button" class="community-lightbox__thumb' + activeClass + '" data-i="' + i + '" aria-label="Moment ' + (i + 1) + '"><img src="' + escapeHTML(it.image) + '" alt="thumb"></button>';
        }).join('');

        lbThumbs.querySelectorAll('.community-lightbox__thumb').forEach(function (tb) {
          tb.addEventListener('click', function () {
            var targetIdx = parseInt(tb.getAttribute('data-i'), 10);
            if (!isNaN(targetIdx)) {
              activeIndex = targetIdx;
              renderLightboxCurrent();
            }
          });
        });
      }
    }

    function prevLightbox() {
      if (galleryItems.length === 0) return;
      activeIndex = (activeIndex - 1 + galleryItems.length) % galleryItems.length;
      renderLightboxCurrent();
    }

    function nextLightbox() {
      if (galleryItems.length === 0) return;
      activeIndex = (activeIndex + 1) % galleryItems.length;
      renderLightboxCurrent();
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', prevLightbox);
    if (lbNext) lbNext.addEventListener('click', nextLightbox);

    document.addEventListener('keydown', function (e) {
      if (!lightbox || !lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    });

    renderGallery();

    window.addEventListener('storage', function (e) {
      if (e.key === 'baddel_cms_db_v1') {
        renderGallery();
      }
    });
  }

  /* ——— Misc interactions ——— */
  function initMisc() {
    initButtonMagnetic();
    initImageReveal();
    initLogoFallback();
  }

  /* ——— Subtle magnetic button effect (desktop only) ——— */
  function initButtonMagnetic() {
    if (window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var btns = document.querySelectorAll('.btn--primary, .btn--gold');
    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * 0.18;
        var dy = (e.clientY - cy) * 0.18;
        btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ——— Image reveal: track loaded state ——— */
  function initImageReveal() {
    var images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(function (img) {
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';
        img.addEventListener('load', function () {
          img.style.opacity = '1';
        });
      }
    });
  }

  /* ——— Logo fallback: show text if image missing ——— */
  function initLogoFallback() {
    var logoImgs = document.querySelectorAll('.navbar__logo img, .footer__brand-logo');
    logoImgs.forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.display = 'none';
        var fallback = img.nextElementSibling;
        if (fallback) fallback.style.display = 'block';
      });
    });
  }

})();
