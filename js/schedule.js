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

    function renderSchedules() {
      const all = window.BadcomData ? window.BadcomData.getSchedules() : [];

      // --- Current date reference ---
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const cutoff = new Date(today);
      cutoff.setDate(today.getDate() + 7);
      const pastLimit = new Date(today);
      pastLimit.setDate(today.getDate() - 7);

      // Apply sport & status filter
      const inRange = all.filter(item => {
        const d = parseScheduleDate(item);
        if (d) d.setHours(0, 0, 0, 0);

        const evStatus = getItemEventStatus(item, d, today);
        const itemSport = (item.sport || '').toLowerCase();

        // 1. Filter tabs logic
        if (activeFilter === 'upcoming') {
          if (evStatus !== 'upcoming') return false;
          if (d && (d < today || d > cutoff)) return false;
          return true;
        }

        if (activeFilter === 'completed') {
          return evStatus === 'completed';
        }

        if (activeFilter === 'badminton' || activeFilter === 'padel') {
          if (itemSport !== activeFilter) return false;
        }

        // 2. Default ('all' or sport): Upcoming H+7 window + Recent Completed
        if (evStatus === 'upcoming') {
          if (!d) return true;
          return d >= today && d <= cutoff;
        } else {
          // Completed session
          if (!d) return true;
          return d >= pastLimit && d <= today;
        }
      });

      // --- Sort: Upcoming Open (closest) -> Upcoming Full (closest) -> Completed (newest past first) ---
      inRange.sort((a, b) => {
        const da = parseScheduleDate(a);
        const db = parseScheduleDate(b);
        if (da) da.setHours(0, 0, 0, 0);
        if (db) db.setHours(0, 0, 0, 0);

        const evA = getItemEventStatus(a, da, today);
        const evB = getItemEventStatus(b, db, today);

        const aFull = a.status === 'full' || (a.slotsLeft != null && a.slotsLeft === 0);
        const bFull = b.status === 'full' || (b.slotsLeft != null && b.slotsLeft === 0);

        // Group 1: Upcoming Open (rank 0)
        // Group 2: Upcoming Full (rank 1)
        // Group 3: Completed (rank 2)
        const rankA = evA === 'completed' ? 2 : (aFull ? 1 : 0);
        const rankB = evB === 'completed' ? 2 : (bFull ? 1 : 0);

        if (rankA !== rankB) return rankA - rankB;

        if (evA === 'completed' && evB === 'completed') {
          if (da && db) return db - da; // most recent completed first
          if (da) return -1;
          if (db) return 1;
          return 0;
        }

        // Both upcoming
        if (da && db) return da - db; // closest date first
        if (da) return -1;
        if (db) return 1;
        return 0;
      });

      if (inRange.length === 0) {
        const emptyMsg = activeFilter === 'completed'
          ? 'Belum ada sesi main yang ditandai Selesai (Completed).'
          : 'Jadwal main untuk periode ini akan segera diperbarui. Stay tuned!';

        container.innerHTML = `
          <div class="schedule-empty">
            <div class="schedule-empty-icon">🏸</div>
            <h3>Tidak Ada Jadwal Ditemukan</h3>
            <p>${emptyMsg}</p>
          </div>
        `;
        return;
      }

      container.innerHTML = inRange.map(item => {
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

        return `
          <div class="schedule-card ${isFull ? 'is-full' : ''} ${isCompleted ? 'is-completed' : ''}" data-sport="${sport}">
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
                  <div>
                    <span class="schedule-detail-label">Lokasi</span>
                    <strong class="schedule-detail-value">${escapeHTML(venueStr)}</strong>
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
                <a href="${escapeHTML(mapsUrl)}" target="_blank" rel="noopener noreferrer" class="schedule-btn-location" title="Buka Petunjuk Arah di Google Maps">
                  <i class="fas fa-location-arrow"></i>
                  <span>Lokasi</span>
                  <span class="schedule-btn-arrow">↗</span>
                </a>
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

    // Listen for storage events in case admin updates schedule in another tab
    window.addEventListener('storage', (e) => {
      if (e.key === 'baddel_cms_db_v1') {
        renderSchedules();
      }
    });

    // Listen for remote server database sync events
    window.addEventListener('baddel:data-synced', () => {
      renderSchedules();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSchedule);
  } else {
    initSchedule();
  }
})();
