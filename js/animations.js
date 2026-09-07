/* ============================================
   BADCOM — ANIMATIONS.JS
   IntersectionObserver Reveals, Counter, Marquee
   ============================================ */

var BadcomAnimations = (function () {

  /* ——— Init all animation systems ——— */
  function init() {
    initReveal();
    initCounters();
    initMarquee();
    initProgressBar();
  }

  /* ——————————————————————————————————————
     SCROLL REVEAL
     Uses IntersectionObserver to add .is-visible
     to elements with .reveal, .reveal-left,
     .reveal-right, .reveal-scale classes
  —————————————————————————————————————— */
  function initReveal() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      /* Skip animations, just show everything */
      var all = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      all.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var options = {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    var targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ——————————————————————————————————————
     ANIMATED COUNTERS
     Elements with data-count="NUMBER"
     and data-suffix="+"
  —————————————————————————————————————— */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target, prefersReduced);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el, instant) {
    var target  = parseInt(el.getAttribute('data-count'), 10);
    var suffix  = el.getAttribute('data-suffix') || '';
    var duration = 1800;

    if (instant || isNaN(target)) {
      el.textContent = target + suffix;
      return;
    }

    var start     = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* Ease out cubic */
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ——————————————————————————————————————
     MARQUEE DUPLICATION
     Ensure seamless loop by duplicating items
  —————————————————————————————————————— */
  function initMarquee() {
    var tracks = document.querySelectorAll('.marquee-track');
    tracks.forEach(function (track) {
      /* Duplicate content for seamless loop */
      var clone = track.innerHTML;
      track.innerHTML = clone + clone;
    });
  }

  /* ——————————————————————————————————————
     SCROLL PROGRESS BAR (optional)
  —————————————————————————————————————— */
  function initProgressBar() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          var progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          bar.style.width = progress + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  return { init: init };

})();
