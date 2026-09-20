// ============================================
// Baddel - Schedule Module (Jadwal Main)
// ============================================

(function () {
  'use strict';

  function initSchedule() {
    const container = document.getElementById('schedule-grid');
    const filterBtns = document.querySelectorAll('.schedule-filter-btn');
    if (!container) return;

    let activeFilter = 'all';

    // --- Helpers ---
    const MONTH_MAP = {
      jan:0, feb:1, mar:2, apr:3, mei:4, may:4,
      jun:5, jul:6, agu:7, aug:7, sep:8, okt:9, oct:9,
      nov:10, des:11, dec:11
    };

    function parseScheduleDate(item) {
      if (!item) return null;
      // 1. Try isoDate first (YYYY-MM-DD)
      if (item.isoDate && /^\d{4}-\d{2}-\d{2}$/.test(item.isoDate)) {
        return new Date(item.isoDate + 'T00:00:00');
      }
      // 2. Try parsing date string e.g. "24 Sep 2026" or "Rabu, 24 Sep 2026"
      const raw = (item.dateFormatted || item.date || '').replace(/^[^,]+,\s*/, '').trim();
      if (!raw) return null;

      // Check YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        return new Date(raw + 'T00:00:00');
      }

      // Check DD/MM/YYYY or DD-MM-YYYY
      const dmy = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmy) {
        return new Date(parseInt(dmy[3], 10), parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10));
      }

      // Check e.g. "20 September 2026"
      const parts = raw.split(/\s+/);
      if (parts.length >= 3) {
        const day   = parseInt(parts[0], 10);
        const mon   = MONTH_MAP[(parts[1] || '').toLowerCase().slice(0, 3)];
        const year  = parseInt(parts[2], 10);
        if (!isNaN(day) && mon !== undefined && !isNaN(year)) {
          return new Date(year, mon, day);
        }
      }

      const parsed = Date.parse(raw);
      if (!isNaN(parsed)) return new Date(parsed);

      return null;
    }

    function getItemEventStatus(item, d, today) {
      if (item && (item.eventStatus === 'completed' || item.eventStatus === 'upcoming')) {
        return item.eventStatus;
      }
      if (d) {
        return d < today ? 'completed' : 'upcoming';
      }
      return 'upcoming';
    }

    function formatDateID(date) {
      const DAYS_ID  = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
      const MONTHS_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
      return DAYS_ID[date.getDay()] + ', ' + date.getDate() + ' ' + MONTHS_ID[date.getMonth()] + ' ' + date.getFullYear();
    }

    const rangeInfoEl = document.getElementById('schedule-range-info');

    function renderSchedules() {
      const all = window.BadcomData ? window.BadcomData.getSchedules() : [];

      // --- 14-day rolling window from today ---
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 13); // today + 13 = 14 days total

      // Apply sport filter (SEMUA, BADMINTON, PADEL) — semua jadwal tampil
      const filtered = all.filter(item => {
        const itemSport = (item.sport || '').toLowerCase();
        if ((activeFilter === 'badminton' || activeFilter === 'padel') && itemSport !== activeFilter) {
          return false;
        }
        return true;
      });

      // --- Sort: UPCOMING first (closest date to furthest), then COMPLETED (most recent past first) ---
      filtered.sort((a, b) => {
        const da = parseScheduleDate(a);
        const db = parseScheduleDate(b);
        if (da) da.setHours(0, 0, 0, 0);
        if (db) db.setHours(0, 0, 0, 0);

        const evA = getItemEventStatus(a, da, today);
        const evB = getItemEventStatus(b, db, today);

        const isCompA = evA === 'completed' ? 1 : 0;
        const isCompB = evB === 'completed' ? 1 : 0;

        // Group 1: Upcoming (0), Group 2: Completed (1)
        if (isCompA !== isCompB) {
          return isCompA - isCompB;
        }

        // If both upcoming: closest date first
        if (isCompA === 0) {
          if (da && db) {
            if (da.getTime() !== db.getTime()) return da - db;
          }
          const aFull = a.status === 'full' || (a.slotsLeft != null && a.slotsLeft === 0);
          const bFull = b.status === 'full' || (b.slotsLeft != null && b.slotsLeft === 0);
          if (aFull !== bFull) return aFull ? 1 : -1;
          if (da) return -1;
          if (db) return 1;
          return 0;
        }

        // If both completed: most recent completed session first (descending date)
        if (da && db) return db - da;
        if (da) return -1;
        if (db) return 1;
        return 0;
      });

      // --- Update range info badge with Upcoming & Completed counts ---
      const upcomingCount = filtered.filter(item => {
        const d = parseScheduleDate(item);
        if (d) d.setHours(0, 0, 0, 0);
        return getItemEventStatus(item, d, today) !== 'completed';
      }).length;
      const completedCount = filtered.length - upcomingCount;

      if (rangeInfoEl) {
        const sportLabel = activeFilter === 'badminton' ? 'Badminton'
                         : activeFilter === 'padel'     ? 'Padel'
                         : 'Semua Olahraga';
        rangeInfoEl.innerHTML = `
          <div class="schedule-range-badge">
            <span class="schedule-range-icon"><i class="fas fa-calendar-check"></i></span>
            <span class="schedule-range-text">
              <span class="schedule-range-label">Daftar Jadwal Sesi Main</span>
              <strong class="schedule-range-dates">${upcomingCount} Sesi Akan Datang &bull; ${completedCount} Selesai</strong>
            </span>
            <span class="schedule-range-sport">${sportLabel}</span>
          </div>
        `;
      }

      if (filtered.length === 0) {
        const sportText = activeFilter === 'badminton' ? 'Badminton'
                        : activeFilter === 'padel'     ? 'Padel'
                        : '';
        container.innerHTML = `
          <div class="schedule-empty">
            <div class="schedule-empty-icon">🏸</div>
            <h3>Tidak Ada Jadwal Ditemukan</h3>
            <p>Belum ada jadwal sesi main${sportText ? ' ' + sportText : ''} yang tersedia saat ini.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map((item, idx) => {
        const sport = (item.sport || 'badminton').toLowerCase();
        const title = item.title || (sport === 'padel' ? 'BADDEL PADEL SESSION' : 'BADDEL BADMINTON SESSION');
        const dateStr = item.dateFormatted || item.date || 'TBA';
        const timeStr = item.time || '19:00 - 21:00 WIB';
        const venueStr = item.venue || 'Royal Sports Arena Jakarta';
        const courtNamesRaw = item.courtNames || item.court || '';
        const courtList = courtNamesRaw
          ? courtNamesRaw.split(/\s*,\s*/).map(s => s.trim()).filter(Boolean)
          : [];
        const feeStr = item.fee || 'Rp 50.000 / org';
        const slotsCount = item.slotsLeft != null ? item.slotsLeft : 4;

        const d = parseScheduleDate(item);
        if (d) d.setHours(0, 0, 0, 0);
        const evStatus = getItemEventStatus(item, d, today);
        const isCompleted = evStatus === 'completed';
        const isFull = isCompleted || item.status === 'full' || slotsCount === 0;

        // Lifecycle Badge (Upcoming vs Completed in English)
        const eventStatusBadge = isCompleted
          ? `<span class="schedule-status-badge status-completed"><i class="fas fa-circle-check"></i> Completed</span>`
          : `<span class="schedule-status-badge status-upcoming"><i class="fas fa-calendar-check"></i> Upcoming</span>`;

        // Capacity / State Badge
        const slotBadge = isCompleted
          ? `<span class="schedule-status-badge status-ended"><i class="fas fa-flag-checkered"></i> Selesai</span>`
          : (isFull 
            ? `<span class="schedule-status-badge status-full"><i class="fas fa-lock"></i> Full Booked</span>`
            : `<span class="schedule-status-badge status-open"><i class="fas fa-circle-check"></i> ${slotsCount} Slot Tersedia</span>`
          );

        const sportBadge = sport === 'padel'
          ? `<span class="schedule-sport-badge badge-padel"><i class="fas fa-table-tennis-paddle-ball"></i> Padel</span>`
          : `<span class="schedule-sport-badge badge-badminton"><i class="fas fa-feather"></i> Badminton</span>`;

        const mapsUrl = item.mapsUrl || item.locationUrl || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venueStr));

        const waText = encodeURIComponent(
          `Halo Admin Baddel, saya mau join main:\n\n\u2022 Sesi: ${title}\n\u2022 Olahraga: ${sport.toUpperCase()}\n\u2022 Tanggal: ${dateStr}\n\u2022 Waktu: ${timeStr}\n\u2022 Lokasi: ${venueStr}${courtList.length > 0 ? '\n\u2022 Court: ' + courtList.join(', ') : ''}\n\u2022 Maps: ${mapsUrl}\n\nApakah masih ada slot kosong?`
        );
        const waLink = `https://wa.me/6281270000739?text=${waText}`;

        // Unique DOM ID & specific URL for this schedule
        const rawId = item.id || ('sch_' + idx);
        const scheduleCardId = 'schedule-' + String(rawId).replace(/[^a-zA-Z0-9_-]/g, '_');
        const scheduleSpecificUrl = window.location.origin + window.location.pathname + '#' + scheduleCardId;

        const sportEmoji = sport === 'padel' ? '🎾' : '🏸';
        const courtLine = courtList.length > 0 ? `\n🏟 Court: ${courtList.join(', ')}` : '';
        const mapsLine = `\n🗺 Maps: ${mapsUrl}`;
        const feeLine = feeStr ? `\n💰 HTM: ${feeStr}` : '';

        // Share text: metadata, gmaps link, CTA, enter, specific schedule URL
        const shareText = `${sportEmoji} ${title}\n📅 ${dateStr} — ${timeStr}\n📍 ${venueStr}${courtLine}${mapsLine}${feeLine}\n\nJoin sesi main bersama Baddel Community! 🔥\n${scheduleSpecificUrl}`;

        return `
          <div id="${scheduleCardId}" class="schedule-card ${isCompleted ? 'is-completed' : 'is-upcoming'} ${isFull ? 'is-full' : ''}" data-sport="${sport}">
            <div class="schedule-card-header">
              <div class="schedule-badges-left">
                ${sportBadge}
                ${eventStatusBadge}
              </div>
              <div class="schedule-badges-right">
                ${slotBadge}
              </div>
            </div>

            <div class="schedule-card-body">
              <h3 class="schedule-card-title">${escapeHTML(title)}</h3>
              
              <div class="schedule-card-details">
                <div class="schedule-detail-item">
                  <div class="schedule-detail-icon"><i class="far fa-calendar-alt"></i></div>
                  <div>
                    <span class="schedule-detail-label">Tanggal</span>
                    <strong class="schedule-detail-value">${escapeHTML(dateStr)}</strong>
                  </div>
                </div>

                <div class="schedule-detail-item">
                  <div class="schedule-detail-icon"><i class="far fa-clock"></i></div>
                  <div>
                    <span class="schedule-detail-label">Waktu</span>
                    <strong class="schedule-detail-value">${escapeHTML(timeStr)}</strong>
                  </div>
                </div>

                ${courtList.length > 0 ? `
                <div class="schedule-detail-item schedule-detail-court">
                  <div class="schedule-detail-icon schedule-detail-icon--court">
                    <i class="fas fa-square-check"></i>
                  </div>
                  <div style="min-width:0; flex:1;">
                    <span class="schedule-detail-label">Court</span>
                    <div class="schedule-court-display">
                      ${courtList.map(c => `<span class="schedule-court-chip">${escapeHTML(c)}</span>`).join('')}
                    </div>
                  </div>
                </div>
                ` : ''}

                <div class="schedule-detail-item">
                  <div class="schedule-detail-icon"><i class="fas fa-location-dot"></i></div>
                  <div style="min-width:0; flex:1;">
                    <span class="schedule-detail-label">Lokasi</span>
                    <strong class="schedule-detail-value">${escapeHTML(venueStr)}</strong>
                    <a href="${escapeHTML(mapsUrl)}" target="_blank" rel="noopener noreferrer"
                       class="schedule-maps-inline-btn" title="Buka petunjuk arah di Google Maps">
                      <i class="fas fa-location-arrow"></i>
                      <span>Petunjuk Arah</span>
                      <span class="schedule-btn-arrow">↗</span>
                    </a>
                  </div>
                </div>

                ${feeStr ? `
                <div class="schedule-detail-item">
                  <div class="schedule-detail-icon"><i class="fas fa-ticket"></i></div>
                  <div>
                    <span class="schedule-detail-label">HTM / Biaya</span>
                    <strong class="schedule-detail-value text-accent">${escapeHTML(feeStr)}</strong>
                  </div>
                </div>
                ` : ''}
              </div>

              ${item.notes ? `
                <div class="schedule-card-notes">
                  <i class="fas fa-info-circle"></i> ${escapeHTML(item.notes)}
                </div>
              ` : ''}
            </div>

            <div class="schedule-card-footer">
              <div class="schedule-actions-grid">
                <button type="button" class="schedule-btn-share"
                  data-share-title="${escapeHTML(title)}"
                  data-share-text="${escapeHTML(shareText)}"
                  data-share-url="${escapeHTML(scheduleSpecificUrl)}"
                  title="Bagikan jadwal ini ke sosial media">
                  <i class="fas fa-share-nodes"></i>
                  <span>Share</span>
                </button>
                ${isCompleted ? `
                  <button type="button" class="schedule-btn-rsvp is-disabled is-completed" disabled title="Sesi Main Telah Selesai (Completed)">
                    <i class="fas fa-circle-check"></i>
                    <span>Completed</span>
                  </button>
                ` : (isFull ? `
                  <button type="button" class="schedule-btn-rsvp is-disabled" disabled title="Slot Sesi Telah Penuh">
                    <i class="fas fa-ban"></i>
                    <span>Slot Penuh</span>
                  </button>
                ` : `
                  <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="schedule-btn-rsvp" title="Daftar & Booking Slot via WhatsApp">
                    <span>Daftar / Join</span>
                    <i class="fab fa-whatsapp"></i>
                  </a>
                `)}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function escapeHTML(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Filter clicks
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        activeFilter = this.getAttribute('data-filter') || 'all';
        renderSchedules();
      });
    });

    renderSchedules();

    // Helper: copy to clipboard with feedback
    async function copyToClipboard(text, btnEl) {
      let ok = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        } else {
          throw new Error('Clipboard API unavailable');
        }
      } catch {
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;left:-9999px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          ok = document.execCommand('copy');
          document.body.removeChild(ta);
        } catch {
          ok = false;
        }
      }

      if (btnEl) {
        const icon = btnEl.querySelector('i');
        const label = btnEl.querySelector('span');
        const origIcon = icon ? icon.className : '';
        const origLabel = label ? label.textContent : '';
        if (icon) icon.className = ok ? 'fas fa-check' : 'fas fa-copy';
        if (label) label.textContent = ok ? 'Disalin!' : 'Salin';
        btnEl.classList.add('share-copied');
        setTimeout(() => {
          if (icon) icon.className = origIcon;
          if (label) label.textContent = origLabel;
          btnEl.classList.remove('share-copied');
        }, 2000);
      }
    }

    // Share button — event delegation on container
    container.addEventListener('click', async (e) => {
      const shareBtn = e.target.closest('.schedule-btn-share');
      if (!shareBtn) return;

      const shareTitle = shareBtn.getAttribute('data-share-title') || 'Baddel Community — Jadwal Main';
      const shareText  = shareBtn.getAttribute('data-share-text')  || '';

      if (navigator.share) {
        try {
          // Native share sheet (mobile & modern desktop)
          await navigator.share({
            title: shareTitle,
            text: shareText
          });
        } catch (err) {
          if (err.name === 'AbortError') return;
          await copyToClipboard(shareText, shareBtn);
        }
      } else {
        await copyToClipboard(shareText, shareBtn);
      }
    });

    // Deep-link to specific schedule card when URL contains hash e.g. #schedule-sch-01
    function handleScheduleHash() {
      const hash = window.location.hash;
      if (!hash || !hash.startsWith('#schedule-')) return;
      const targetId = hash.slice(1);
      let targetEl = document.getElementById(targetId);

      // If card not in DOM (e.g. user filter is set to sport that excludes it), switch to 'all'
      if (!targetEl && activeFilter !== 'all') {
        activeFilter = 'all';
        filterBtns.forEach(b => {
          b.classList.toggle('active', (b.getAttribute('data-filter') || 'all') === 'all');
        });
        renderSchedules();
        targetEl = document.getElementById(targetId);
      }

      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.classList.remove('schedule-card--highlight');
          void targetEl.offsetWidth; // trigger reflow
          targetEl.classList.add('schedule-card--highlight');
          setTimeout(() => {
            targetEl.classList.remove('schedule-card--highlight');
          }, 3500);
        }, 300);
      }
    }

    handleScheduleHash();
    window.addEventListener('hashchange', handleScheduleHash);

    // Listen for storage events in case admin updates schedule in another tab
    window.addEventListener('storage', (e) => {
      if (e.key === 'baddel_cms_db_v1') {
        renderSchedules();
        handleScheduleHash();
      }
    });

    // Listen for remote server database sync events
    window.addEventListener('baddel:data-synced', () => {
      renderSchedules();
      handleScheduleHash();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSchedule);
  } else {
    initSchedule();
  }
})();
