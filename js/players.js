/* ============================================
   BADCOM — PLAYERS.JS
   Unified & Optimized Squad Rendering (Carousels & Grids)
   + Hardware-accelerated hover, ripple, and smooth transitions
   ============================================ */

var BadcomPlayers = (function () {

  'use strict';

  var isPointerDown = false;
  var isDragging = false;
  var hasMoved = false;
  var startX = 0;
  var startScrollLeft = 0;
  var dragThreshold = 8;
  var activeCarousel = null;
  var currentFilter = 'all';

  /* ——— Init ——— */
  function init() {
    renderGroupedSquads();
    initTabs();
    initDragCarousels();

    /* Initial cascade stagger on page load */
    requestAnimationFrame(function () {
      staggerCardsInGroup(document.getElementById('squad-group-men'));
      staggerCardsInGroup(document.getElementById('squad-group-women'));
    });
  }

  /* ——— Render Grouped Squads (Supports Carousels & Grids) ——— */
  function renderGroupedSquads() {
    var allPlayers = BadcomData.players || [];
    var colors     = BadcomData.playerColors || [];

    var menPlayers = BadcomData.menPlayers || allPlayers.filter(function (p) {
      return (p.category || 'men').toLowerCase() === 'men';
    });

    var womenPlayers = BadcomData.womenPlayers || allPlayers.filter(function (p) {
      return (p.category || '').toLowerCase() === 'women';
    });

    /* Men's Recruitment Card */
    var menJoinCard = [
      '<article class="player-card player-card--join player-card--join-king no-select" role="link" tabindex="0" onclick="window.location.href=\'index.html#connect\'">',
      '  <div class="join-icon">👑</div>',
      '  <div class="join-title">BE OUR NEXT KING</div>',
      '  <p class="join-desc">Badcom Men\'s Squad is actively welcoming new badminton & padel players.</p>',
      '  <span class="btn btn--primary btn--sm" style="pointer-events:auto;">JOIN MEN\'S SQUAD ↗</span>',
      '</article>'
    ].join('\n');

    /* Women's Recruitment Card */
    var womenJoinCard = [
      '<article class="player-card player-card--join player-card--join-queen no-select" role="link" tabindex="0" onclick="window.location.href=\'index.html#connect\'">',
      '  <div class="join-icon">👑</div>',
      '  <div class="join-title">BE OUR NEXT QUEEN</div>',
      '  <p class="join-desc">Badcom Women\'s Squad is actively welcoming new badminton & padel players.</p>',
      '  <span class="btn btn--gold btn--sm" style="pointer-events:auto;">JOIN WOMEN\'S SQUAD ↗</span>',
      '</article>'
    ].join('\n');

    /* Pre-compile cards HTML */
    var menHTML = menPlayers.map(function (player) {
      var origIndex = allPlayers.indexOf(player);
      var color = colors[origIndex % colors.length] || colors[0];
      return buildCard(player, color);
    }).join('\n') + '\n' + menJoinCard;

    var womenHTML = womenPlayers.map(function (player) {
      var origIndex = allPlayers.indexOf(player);
      var color = colors[origIndex % colors.length] || colors[1];
      return buildCard(player, color);
    }).join('\n') + '\n' + womenJoinCard;

    /* Populate Carousels (index.html) */
    var menCarousel = document.getElementById('carousel-men');
    if (menCarousel) {
      menCarousel.innerHTML = menHTML;
      attachCardListeners(menCarousel);
    }

    var womenCarousel = document.getElementById('carousel-women');
    if (womenCarousel) {
      womenCarousel.innerHTML = womenHTML;
      attachCardListeners(womenCarousel);
    }

    /* Populate Grids (players.html) */
    var menGrid = document.getElementById('grid-men');
    if (menGrid) {
      menGrid.innerHTML = menHTML;
      attachCardListeners(menGrid);
    }

    var womenGrid = document.getElementById('grid-women');
    if (womenGrid) {
      womenGrid.innerHTML = womenHTML;
      attachCardListeners(womenGrid);
    }

    /* Fallback if legacy #players-carousel exists */
    var singleContainer = document.getElementById('players-carousel');
    if (singleContainer && !menCarousel) {
      singleContainer.innerHTML = allPlayers.map(function (player, index) {
        var color = colors[index % colors.length] || colors[0];
        return buildCard(player, color);
      }).join('\n');
      attachCardListeners(singleContainer);
    }
  }

  /* ——— Trigger Card Click Animation & Ripple ——— */
  function triggerCardClick(card, event, callback) {
    if (!card) return;

    /* Calculate relative ripple position */
    var rect = card.getBoundingClientRect();
    var x = event && typeof event.clientX === 'number' ? (event.clientX - rect.left) : (rect.width / 2);
    var y = event && typeof event.clientY === 'number' ? (event.clientY - rect.top) : (rect.height / 2);

    var ripple = document.createElement('span');
    ripple.className = 'card-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    card.appendChild(ripple);

    /* Shockwave pulse class */
    card.classList.remove('is-clicked');
    void card.offsetWidth; /* Reflow once for restart */
    card.classList.add('is-clicked');

    /* Open profile after responsive tactile delay */
    setTimeout(function () {
      if (typeof callback === 'function') {
        callback();
      }
    }, 180);

    /* Garbage collection for ripple */
    setTimeout(function () {
      card.classList.remove('is-clicked');
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 550);
  }

  /* ——— Attach Card Click / Key Listeners with Event Delegation ——— */
  function attachCardListeners(container) {
    if (!container) return;
    var cards = container.querySelectorAll('.player-card:not(.player-card--join)');
    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (hasMoved) {
          e.preventDefault();
          return;
        }
        var id = card.getAttribute('data-player-id');
        triggerCardClick(card, e, function () {
          openPlayerProfile(id);
        });
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var id = card.getAttribute('data-player-id');
          triggerCardClick(card, e, function () {
            openPlayerProfile(id);
          });
        }
      });
    });
  }

  /* Helper to open player profile safely */
  function openPlayerProfile(id) {
    if (!id) return;
    if (window.BadcomModal && typeof window.BadcomModal.open === 'function') {
      window.BadcomModal.open(id);
    }
  }

  /* ——— Build single card HTML (Optimized with decoding="async") ——— */
  function buildCard(player, color) {
    var sportsStr = player.sports.join(' / ');
    var hasImage = player.hasImage && player.image;
    var cat = (player.category || 'men').toLowerCase();
    var catLabel = cat === 'women' ? 'WOMEN' : 'MEN';

    var imageHTML = hasImage
      ? '<img class="player-card__img" src="' + player.image + '" alt="' + player.name + '" loading="lazy" decoding="async" onerror="this.parentElement.innerHTML=\'<div class=\\\'player-card__placeholder\\\'><span class=\\\'player-card__placeholder-num\\\'>' + player.number + '</span></div>\'">'
      : '<div class="player-card__placeholder" style="background:linear-gradient(160deg,' + color.from + ',' + color.to + ')"><span class="player-card__placeholder-num">' + player.number + '</span></div>';

    return [
      '<article',
      '  class="player-card no-select"',
      '  data-player-id="' + player.id + '"',
      '  data-category="' + cat + '"',
      '  role="button"',
      '  tabindex="0"',
      '  aria-label="View ' + player.name + ' profile"',
      '>',
      '  <div class="player-card__image">',
      '    ' + imageHTML,
      '  </div>',
      '  <div class="player-card__overlay"></div>',
      '  <div class="player-card__gold-border"></div>',
      '  <div class="player-card__badge-cat player-card__badge-cat--' + cat + '">' + catLabel + '</div>',
      '  <div class="player-card__content">',
      '    <div class="player-card__number">' + player.number + '</div>',
      '    <div class="player-card__name">' + player.name + '</div>',
      '    <div class="player-card__nickname">' + player.nickname + '</div>',
      '    <div class="player-card__sport">' + sportsStr + '</div>',
      '  </div>',
      '  <div class="player-card__arrow" aria-hidden="true">↗</div>',
      '</article>'
    ].join('\n');
  }

  /* ——— Stagger cards in group (Optimized: Zero layout thrashing) ——— */
  function staggerCardsInGroup(group) {
    if (!group) return;
    var cards = group.querySelectorAll('.player-card');
    if (!cards.length) return;

    /* 1. Batch writes */
    cards.forEach(function (card, idx) {
      card.style.setProperty('--stagger-index', idx);
      card.classList.remove('is-staggering');
    });

    /* 2. Single container reflow instead of 15x per-card thrashing */
    void group.offsetWidth;

    /* 3. Batch class additions */
    cards.forEach(function (card) {
      card.classList.add('is-staggering');
    });

    setTimeout(function () {
      cards.forEach(function (card) {
        card.classList.remove('is-staggering');
      });
    }, 750);
  }

  /* ——— Transition Squad Group Visibility ——— */
  function transitionGroup(group, show) {
    if (!group) return;
    if (show) {
      group.classList.remove('is-hidden', 'is-animating-out');
      group.classList.add('is-animating-in');
      staggerCardsInGroup(group);
      setTimeout(function () {
        group.classList.remove('is-animating-in');
      }, 450);
    } else {
      group.classList.remove('is-animating-in');
      group.classList.add('is-animating-out');
      setTimeout(function () {
        group.classList.add('is-hidden');
        group.classList.remove('is-animating-out');
      }, 200);
    }
  }

  /* ——— Filter Tabs ——— */
  function initTabs() {
    var tabsContainer = document.getElementById('squad-filter-tabs');
    if (!tabsContainer) return;

    var allPlayers = BadcomData.players || [];
    var totalAll = allPlayers.length;
    var totalMen = (BadcomData.menPlayers || []).length;
    var totalWomen = (BadcomData.womenPlayers || []).length;

    var countAll = tabsContainer.querySelector('[data-filter="all"] .squad-tab__count');
    var countMen = tabsContainer.querySelector('[data-filter="men"] .squad-tab__count');
    var countWomen = tabsContainer.querySelector('[data-filter="women"] .squad-tab__count');

    if (countAll) countAll.textContent = totalAll;
    if (countMen) countMen.textContent = totalMen;
    if (countWomen) countWomen.textContent = totalWomen;

    var menCountEl = document.querySelector('#squad-group-men .squad-group__count');
    if (menCountEl) menCountEl.textContent = totalMen + ' PLAYERS ACTIVE';
    var womenCountEl = document.querySelector('#squad-group-women .squad-group__count');
    if (womenCountEl) womenCountEl.textContent = totalWomen + ' PLAYERS ACTIVE';

    var tabs = tabsContainer.querySelectorAll('.squad-tab');
    var menGroup = document.getElementById('squad-group-men');
    var womenGroup = document.getElementById('squad-group-women');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var filter = tab.getAttribute('data-filter') || 'all';
        if (filter === currentFilter) return;

        currentFilter = filter;

        tabs.forEach(function (t) {
          var isActive = t === tab;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        if (menGroup && womenGroup) {
          if (filter === 'all') {
            transitionGroup(menGroup, true);
            transitionGroup(womenGroup, true);
          } else if (filter === 'men') {
            transitionGroup(menGroup, true);
            transitionGroup(womenGroup, false);
          } else if (filter === 'women') {
            transitionGroup(menGroup, false);
            transitionGroup(womenGroup, true);
          }
        }
      });
    });
  }

  /* ——— Drag on Carousels (Optimized: Event listeners only active during drag) ——— */
  function initDragCarousels() {
    var carouselsList = document.querySelectorAll('.players__carousel');
    if (!carouselsList.length) return;

    function onPointerMove(e) {
      if (!isPointerDown || !activeCarousel) return;
      var diff = e.clientX - startX;
      if (!isDragging && Math.abs(diff) > dragThreshold) {
        isDragging = true;
        hasMoved = true;
        activeCarousel.classList.add('dragging');
      }
      if (isDragging) {
        activeCarousel.scrollLeft = startScrollLeft - diff;
      }
    }

    function onPointerUp() {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (isDragging && activeCarousel) {
        isDragging = false;
        activeCarousel.classList.remove('dragging');
      }
      activeCarousel = null;

      /* Detach window listeners to save idle CPU */
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (hasMoved) {
        setTimeout(function () {
          hasMoved = false;
        }, 120);
      }
    }

    carouselsList.forEach(function (c) {
      c.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        activeCarousel = c;
        isPointerDown = true;
        isDragging = false;
        hasMoved = false;
        startX = e.clientX;
        startScrollLeft = c.scrollLeft;

        /* Attach window listeners only during active pointer gesture */
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        window.addEventListener('pointercancel', onPointerUp, { passive: true });
      }, { passive: true });

      /* Click delegation */
      c.addEventListener('click', function (e) {
        if (hasMoved) return;
        var card = e.target.closest('.player-card:not(.player-card--join)');
        if (card) {
          var id = card.getAttribute('data-player-id');
          triggerCardClick(card, e, function () {
            openPlayerProfile(id);
          });
        }
      });
    });
  }

  return {
    init: init,
    renderGroupedSquads: renderGroupedSquads,
    triggerCardClick: triggerCardClick
  };

})();
