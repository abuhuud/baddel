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
    initMisc();
  });

  /* ——— Misc interactions ——— */
  function initMisc() {
    initPlaygroundHover();
    initButtonMagnetic();
    initImageReveal();
    initLogoFallback();
  }

  /* ——— Playground panel: block text for mobile ——— */
  function initPlaygroundHover() {
    var panels = document.querySelectorAll('.playground__panel');
    panels.forEach(function (panel) {
      /* Already handled by CSS :hover, no extra JS needed */
    });
  }

  /* ——— Subtle magnetic button effect (desktop only) ——— */
  function initButtonMagnetic() {
    if (window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var btns = document.querySelectorAll('.btn--primary, .btn--gold');
    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect  = btn.getBoundingClientRect();
        var cx    = rect.left + rect.width  / 2;
        var cy    = rect.top  + rect.height / 2;
        var dx    = (e.clientX - cx) * 0.18;
        var dy    = (e.clientY - cy) * 0.18;
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
