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

    function renderSchedules() {
      const schedules = window.BadcomData ? window.BadcomData.getSchedules() : [];
      const filtered = schedules.filter(item => {
        if (activeFilter === 'all') return true;
        return (item.sport || '').toLowerCase() === activeFilter.toLowerCase();
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="schedule-empty">
            <div class="schedule-empty-icon">🏸</div>
            <h3>Belum Ada Jadwal</h3>
            <p>Jadwal main untuk kategori ini akan segera diperbarui. Stay tuned!</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(item => {
        const isFull = item.status === 'full' || item.slotsLeft === 0;
        const statusBadge = isFull 
          ? `<span class="schedule-status-badge status-full"><i class="fas fa-lock"></i> Full Booked</span>`
          : `<span class="schedule-status-badge status-open"><i class="fas fa-circle-check"></i> ${item.slotsLeft || 'Tersedia'} Slot Tersedia</span>`;

        const sportBadge = item.sport === 'padel'
          ? `<span class="schedule-sport-badge badge-padel"><i class="fas fa-table-tennis-paddle-ball"></i> Padel</span>`
          : `<span class="schedule-sport-badge badge-badminton"><i class="fas fa-feather"></i> Badminton</span>`;

        const waText = encodeURIComponent(
          `Halo Admin Baddel, saya mau join main:\n\n• Sesi: ${item.title}\n• Olahraga: ${item.sport.toUpperCase()}\n• Tanggal: ${item.dateFormatted || item.date}\n• Waktu: ${item.time}\n• Lokasi: ${item.venue}\n\nApakah masih ada slot kosong?`
        );
        const waLink = `https://wa.me/6281270000739?text=${waText}`;

        return `
          <div class="schedule-card ${isFull ? 'is-full' : ''}" data-sport="${item.sport}">
            <div class="schedule-card-header">
              ${sportBadge}
              ${statusBadge}
            </div>

            <div class="schedule-card-body">
              <h3 class="schedule-card-title">${escapeHTML(item.title)}</h3>
              
              <div class="schedule-card-details">
                <div class="schedule-detail-item">
                  <div class="schedule-detail-icon"><i class="far fa-calendar-alt"></i></div>
                  <div>
                    <span class="schedule-detail-label">Tanggal</span>
                    <strong class="schedule-detail-value">${escapeHTML(item.dateFormatted || item.date)}</strong>
                  </div>
                </div>

                <div class="schedule-detail-item">
                  <div class="schedule-detail-icon"><i class="far fa-clock"></i></div>
                  <div>
                    <span class="schedule-detail-label">Waktu</span>
                    <strong class="schedule-detail-value">${escapeHTML(item.time)}</strong>
                  </div>
                </div>

                <div class="schedule-detail-item">
                  <div class="schedule-detail-icon"><i class="fas fa-location-dot"></i></div>
                  <div>
                    <span class="schedule-detail-label">Lokasi</span>
                    <strong class="schedule-detail-value">${escapeHTML(item.venue)}</strong>
                  </div>
                </div>

                ${item.fee ? `
                <div class="schedule-detail-item">
                  <div class="schedule-detail-icon"><i class="fas fa-ticket"></i></div>
                  <div>
                    <span class="schedule-detail-label">HTM / Biaya</span>
                    <strong class="schedule-detail-value text-accent">${escapeHTML(item.fee)}</strong>
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
              ${isFull ? `
                <button class="btn btn-secondary btn-block disabled" disabled>
                  <i class="fas fa-ban"></i> Slot Penuh
                </button>
              ` : `
                <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block schedule-rsvp-btn">
                  <span>Daftar / Join Sesi</span>
                  <i class="fab fa-whatsapp"></i>
                </a>
              `}
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSchedule);
  } else {
    initSchedule();
  }
})();
