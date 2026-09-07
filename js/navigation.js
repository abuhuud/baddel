/* ============================================
   BADCOM — NAVIGATION.JS
   Sticky Navbar, Mobile Menu, Smooth Scroll
   ============================================ */

var BadcomNav = (function () {

  var navbar = null;
  var hamburger = null;
  var mobileMenu = null;
  var scrollThreshold = 60;
  var isMenuOpen = false;

  /* ——— Init ——— */
  function init() {
    navbar      = document.getElementById('navbar');
    hamburger   = document.getElementById('hamburger');
    mobileMenu  = document.getElementById('mobile-menu');

    if (!navbar) return;

    bindScrollHandler();
    bindHamburger();
    bindMobileLinks();
    bindNavLinks();
    setInitialState();
  }

  /* ——— Scroll handler ——— */
  function setInitialState() {
    updateNavbar();
  }

  function updateNavbar() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function bindScrollHandler() {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ——— Mobile hamburger ——— */
  function bindHamburger() {
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      toggleMenu();
    });

    /* Close on overlay click */
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });

    /* Close on ESC */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    });
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    isMenuOpen = true;
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isMenuOpen = false;
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ——— Mobile link close on click ——— */
  function bindMobileLinks() {
    if (!mobileMenu) return;
    var links = mobileMenu.querySelectorAll('.mobile-menu__link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });
  }

  /* ——— Active link on scroll ——— */
  function bindNavLinks() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.navbar__link');

    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            var href = link.getAttribute('href');
            if (href === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  return { init: init };

})();
