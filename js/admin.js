// ============================================
// Baddel - Admin CMS Controller (js/admin.js)
// ============================================

(function () {
  'use strict';

  // Secure Auth Configuration
  // Uses one-way cryptographic SHA-256 hash with salt
  // The plain-text password is NEVER stored in code or inspectable anywhere
  const AUTH_CONFIG = {
    SALT: 'baddel_salt_2026_x9k!',
    EXPECTED_HASH: 'a1646d0d116b7d0d2e19d3db84bd07104e3473937cca719c6fe62b4888117b3c',
    SESSION_KEY: 'baddel_cms_session_v1'
  };

  // State
  let currentSelectedPlayerId = null;
  let isDashboardInitialized = false;

  // DOM Elements
  const tabs = document.querySelectorAll('.admin-tab-btn');
  const panels = document.querySelectorAll('.admin-panel');
  const toast = document.getElementById('admin-toast');
  const toastMsg = document.getElementById('admin-toast-msg');

  // Auth Gate Elements
  const loginGate = document.getElementById('admin-login-gate');
  const loginForm = document.getElementById('form-admin-login');
  const loginUser = document.getElementById('login-username');
  const loginPass = document.getElementById('login-password');
  const loginError = document.getElementById('login-error-msg');
  const btnTogglePw = document.getElementById('btn-toggle-pw');
  const pwEyeIcon = document.getElementById('pw-eye-icon');
  const btnLogout = document.getElementById('btn-admin-logout');
  const headerBar = document.getElementById('admin-header-bar');
  const mainLayout = document.getElementById('admin-main-layout');

  // Modals
  const modalSchedule = document.getElementById('modal-schedule');
  const modalPlayer = document.getElementById('modal-player');
  const modalPlayerGallery = document.getElementById('modal-player-gallery');
  const modalCommunity = document.getElementById('modal-community');

  // ——— Cryptographic Hash Helper (Web Crypto API SHA-256) ———
  async function computeHash(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ——— Check Session Authentication ———
  function isSessionAuthenticated() {
    try {
      const raw = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY);
      if (!raw) return false;
      const sess = JSON.parse(raw);
      return sess && sess.auth === true && sess.hash === AUTH_CONFIG.EXPECTED_HASH;
    } catch (e) {
      return false;
    }
  }

  function unlockDashboard() {
    if (loginGate) loginGate.classList.add('hidden');
    if (headerBar) headerBar.classList.remove('admin-locked-content');
    if (mainLayout) mainLayout.classList.remove('admin-locked-content');

    if (!isDashboardInitialized) {
      initDashboard();
      isDashboardInitialized = true;
    }
  }

  function lockDashboard() {
    sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    if (loginGate) loginGate.classList.remove('hidden');
    if (headerBar) headerBar.classList.add('admin-locked-content');
    if (mainLayout) mainLayout.classList.add('admin-locked-content');
    if (loginPass) loginPass.value = '';
  }

  // ——— Auth Gate Initialization ———
  function initAuthGate() {
    // Password visibility toggle
    if (btnTogglePw && loginPass && pwEyeIcon) {
      btnTogglePw.addEventListener('click', () => {
        const isPassword = loginPass.type === 'password';
        loginPass.type = isPassword ? 'text' : 'password';
        pwEyeIcon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye';
      });
    }

    // Login Form Submit
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const u = (loginUser.value || '').trim().toLowerCase();
        const p = loginPass.value || '';

        // Generate cryptographic hash
        const inputString = u + ':' + p + ':' + AUTH_CONFIG.SALT;
        const generatedHash = await computeHash(inputString);

        if (generatedHash === AUTH_CONFIG.EXPECTED_HASH) {
          // Login Success
          loginError.classList.remove('show');
          sessionStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify({
            auth: true,
            hash: AUTH_CONFIG.EXPECTED_HASH,
            timestamp: Date.now()
          }));

          unlockDashboard();
          showToast('Login berhasil! Selamat datang Admin.', 'success');
        } else {
          // Login Failed
          loginError.classList.remove('show');
          void loginError.offsetWidth; // Trigger reflow for shake animation
          loginError.classList.add('show');
          loginPass.value = '';
          loginPass.focus();
        }
      });
    }

    // Logout
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin logout dari CMS Baddel?')) {
          lockDashboard();
          showToast('Anda telah berhasil logout.', 'success');
        }
      });
    }

    // Check existing session
    if (isSessionAuthenticated()) {
      unlockDashboard();
    } else {
      lockDashboard();
    }
  }

  function initDashboard() {
    initTabs();
    initModals();
    renderSchedulesTable();
    renderPlayersTable();
    initPlayerGalleryManager();
    renderCommunityTable();
    initBackupSection();

    // Reset button
    const btnReset = document.getElementById('btn-reset-db');
    if (btnReset) {
      btnReset.onclick = () => {
        if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh database Baddel ke data default bawaan? Data baru yang belum diekspor akan hilang.')) {
          window.BadcomData.resetToDefault();
          showToast('Database berhasil direset ke pengaturan default.', 'success');
          refreshAll();
        }
      };
    }

    // Schedule Buttons
    document.getElementById('btn-add-schedule').addEventListener('click', () => openScheduleModal());
    document.getElementById('btn-save-schedule').addEventListener('click', saveSchedule);

    // Player Buttons
    document.getElementById('btn-add-player').addEventListener('click', () => openPlayerModal());
    document.getElementById('btn-save-player').addEventListener('click', savePlayer);
    setupImageFileInput('file-player-photo', 'player-photo-url', 'player-preview-img');

    // Player Gallery Buttons
    document.getElementById('btn-add-player-photo').addEventListener('click', openPlayerGalleryModal);
    document.getElementById('btn-save-player-moment').addEventListener('click', savePlayerMoment);
    setupImageFileInput('file-player-moment', 'player-moment-url', 'player-moment-preview');

    // Community Gallery Buttons
    document.getElementById('btn-add-community-photo').addEventListener('click', () => openCommunityModal());
    document.getElementById('btn-save-community').addEventListener('click', saveCommunityMoment);
    setupImageFileInput('file-comm-image', 'comm-image-url', 'comm-preview-img');
  }

  function refreshAll() {
    renderSchedulesTable();
    renderPlayersTable();
    initPlayerGalleryManager();
    renderCommunityTable();
    initBackupSection();
  }

  // ——— Tabs Navigation ———
  function initTabs() {
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabs.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) targetPanel.classList.add('active');

        if (targetTab === 'tab-backup') {
          initBackupSection();
        }
      });
    });
  }

  // ——— Modal Helpers ———
  function initModals() {
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('open');
      });
    });

    // Close on backdrop
    [modalSchedule, modalPlayer, modalPlayerGallery, modalCommunity].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    });
  }

  function showToast(msg, type = 'success') {
    if (!toast) return;
    toastMsg.textContent = msg;
    toast.className = `admin-toast toast-${type} show`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ——— Image File & Base64 Converter ———
  function setupImageFileInput(fileInputId, urlInputId, previewImgId) {
    const fileInput = document.getElementById(fileInputId);
    const urlInput = document.getElementById(urlInputId);
    const previewImg = document.getElementById(previewImgId);

    if (!fileInput) return;

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        showToast('Foto agak besar (>2MB). Sedang dikompresi agar muat di penyimpanan...', 'success');
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        compressImage(e.target.result, 900, 0.85, function (compressedBase64) {
          if (urlInput) urlInput.value = compressedBase64;
          if (previewImg) {
            previewImg.src = compressedBase64;
            previewImg.style.display = 'inline-block';
          }
        });
      };
      reader.readAsDataURL(file);
    });

    if (urlInput) {
      urlInput.addEventListener('input', function () {
        if (previewImg) {
          if (this.value.trim()) {
            previewImg.src = this.value.trim();
            previewImg.style.display = 'inline-block';
          } else {
            previewImg.style.display = 'none';
          }
        }
      });
    }
  }

  function compressImage(base64Src, maxWidth, quality, callback) {
    const img = new Image();
    img.src = base64Src;
    img.onload = function () {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const result = canvas.toDataURL('image/jpeg', quality);
      callback(result);
    };
    img.onerror = function () {
      callback(base64Src);
    };
  }


  // ============================================
  // TAB 1: SCHEDULES MANAGEMENT
  // ============================================

  function renderSchedulesTable() {
    const tbody = document.getElementById('table-schedules-body');
    if (!tbody) return;

    const schedules = window.BadcomData.getSchedules();
    if (schedules.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 2.5rem; color:var(--color-muted);">
            Belum ada jadwal main yang tersimpan. Klik "Tambah Jadwal Baru" di atas.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = schedules.map(item => {
      const sportBadge = item.sport === 'padel'
        ? `<span class="schedule-sport-badge badge-padel"><i class="fas fa-table-tennis-paddle-ball"></i> Padel</span>`
        : `<span class="schedule-sport-badge badge-badminton"><i class="fas fa-feather"></i> Badminton</span>`;

      const statusBadge = item.status === 'full'
        ? `<span class="schedule-status-badge status-full">Full Booked</span>`
        : `<span class="schedule-status-badge status-open">${item.slotsLeft || 0} Tersedia</span>`;

      return `
        <tr>
          <td style="font-weight:600; color:var(--color-white);">${escapeHTML(item.title)}</td>
          <td>${sportBadge}</td>
          <td>
            <div>${escapeHTML(item.dateFormatted || item.date)}</div>
            <div style="font-size:0.75rem; color:var(--color-muted);">${escapeHTML(item.time)}</div>
          </td>
          <td>${escapeHTML(item.venue)}</td>
          <td><span style="color:var(--color-gold); font-weight:600;">${escapeHTML(item.fee || '-')}</span></td>
          <td>${statusBadge}</td>
          <td style="text-align:right; white-space:nowrap;">
            <button class="admin-btn-action btn-edit-schedule" data-id="${item.id}">
              <i class="fas fa-pen"></i> Edit
            </button>
            <button class="admin-btn-action btn-danger btn-del-schedule" data-id="${item.id}">
              <i class="fas fa-trash"></i> Hapus
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row events
    tbody.querySelectorAll('.btn-edit-schedule').forEach(b => {
      b.addEventListener('click', () => openScheduleModal(b.getAttribute('data-id')));
    });

    tbody.querySelectorAll('.btn-del-schedule').forEach(b => {
      b.addEventListener('click', () => deleteSchedule(b.getAttribute('data-id')));
    });
  }

  function openScheduleModal(id = null) {
    const isEdit = Boolean(id);
    document.getElementById('modal-schedule-title').textContent = isEdit ? 'Edit Jadwal Main' : 'Tambah Jadwal Main Baru';
    document.getElementById('sched-id').value = id || '';

    if (isEdit) {
      const schedules = window.BadcomData.getSchedules();
      const sched = schedules.find(s => s.id === id);
      if (sched) {
        document.getElementById('sched-title').value = sched.title || '';
        document.getElementById('sched-sport').value = sched.sport || 'badminton';
        document.getElementById('sched-status').value = sched.status || 'open';
        document.getElementById('sched-date').value = sched.dateFormatted || sched.date || '';
        document.getElementById('sched-time').value = sched.time || '';
        document.getElementById('sched-venue').value = sched.venue || '';
        document.getElementById('sched-fee').value = sched.fee || '';
        document.getElementById('sched-slots').value = sched.slotsLeft != null ? sched.slotsLeft : 4;
        document.getElementById('sched-total-slots').value = sched.totalSlots || 12;
        document.getElementById('sched-notes').value = sched.notes || '';
      }
    } else {
      document.getElementById('sched-title').value = '';
      document.getElementById('sched-sport').value = 'badminton';
      document.getElementById('sched-status').value = 'open';
      document.getElementById('sched-date').value = '';
      document.getElementById('sched-time').value = '19:00 - 22:00 WIB';
      document.getElementById('sched-venue').value = 'Royal Sports Arena, Jakarta';
      document.getElementById('sched-fee').value = 'Rp 65.000 / orang';
      document.getElementById('sched-slots').value = '6';
      document.getElementById('sched-total-slots').value = '12';
      document.getElementById('sched-notes').value = 'Wajib sepatu non-marking. Kok disediakan panitia.';
    }

    modalSchedule.classList.add('open');
  }

  function saveSchedule() {
    const id = document.getElementById('sched-id').value || 'sched_' + Date.now();
    const title = document.getElementById('sched-title').value.trim();
    const sport = document.getElementById('sched-sport').value;
    const status = document.getElementById('sched-status').value;
    const date = document.getElementById('sched-date').value.trim();
    const time = document.getElementById('sched-time').value.trim();
    const venue = document.getElementById('sched-venue').value.trim();
    const fee = document.getElementById('sched-fee').value.trim();
    const slotsLeft = parseInt(document.getElementById('sched-slots').value) || 0;
    const totalSlots = parseInt(document.getElementById('sched-total-slots').value) || 12;
    const notes = document.getElementById('sched-notes').value.trim();

    if (!title || !date || !time || !venue) {
      alert('Mohon lengkapi judul, tanggal, waktu, dan lokasi sesi.');
      return;
    }

    const schedules = window.BadcomData.getSchedules();
    const existingIndex = schedules.findIndex(s => s.id === id);

    const scheduleData = {
      id,
      title,
      sport,
      status: slotsLeft === 0 ? 'full' : status,
      dateFormatted: date,
      date,
      time,
      venue,
      fee,
      slotsLeft,
      totalSlots,
      notes
    };

    if (existingIndex >= 0) {
      schedules[existingIndex] = scheduleData;
    } else {
      schedules.unshift(scheduleData);
    }

    window.BadcomData.saveSchedules(schedules);
    modalSchedule.classList.remove('open');
    renderSchedulesTable();
    showToast('Jadwal main berhasil disimpan!', 'success');
  }

  function deleteSchedule(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;
    const schedules = window.BadcomData.getSchedules().filter(s => s.id !== id);
    window.BadcomData.saveSchedules(schedules);
    renderSchedulesTable();
    showToast('Jadwal berhasil dihapus.', 'success');
  }


  // ============================================
  // TAB 2: PLAYERS MANAGEMENT
  // ============================================

  function renderPlayersTable() {
    const tbody = document.getElementById('table-players-body');
    if (!tbody) return;

    const players = window.BadcomData.getPlayers();
    tbody.innerHTML = players.map(player => {
      const momentsCount = (player.gallery && player.gallery.length) || 0;
      const categoryBadge = player.category === 'women'
        ? `<span class="schedule-sport-badge badge-padel">Women</span>`
        : `<span class="schedule-sport-badge badge-badminton">Men</span>`;

      return `
        <tr>
          <td>
            <img src="${player.image}" alt="${escapeHTML(player.name)}" class="admin-thumb" onerror="this.src='assets/images/players/1.png'">
          </td>
          <td><strong style="color:var(--color-gold); font-family:var(--font-heading); font-size:1.1rem;">#${escapeHTML(player.num)}</strong></td>
          <td><strong style="color:var(--color-white);">${escapeHTML(player.name)}</strong></td>
          <td>${categoryBadge}</td>
          <td>
            ${player.instagram ? `<a href="https://instagram.com/${player.instagram}" target="_blank" style="color:var(--color-blue-light); text-decoration:none;"><i class="fab fa-instagram"></i> @${escapeHTML(player.instagram)}</a>` : '<span style="color:var(--color-muted);">-</span>'}
          </td>
          <td>
            <span class="schedule-status-badge status-open"><i class="fas fa-image"></i> ${momentsCount} Foto</span>
          </td>
          <td style="text-align:right; white-space:nowrap;">
            <button class="admin-btn-action btn-edit-player" data-id="${player.id}">
              <i class="fas fa-pen"></i> Edit
            </button>
            <button class="admin-btn-action btn-danger btn-del-player" data-id="${player.id}">
              <i class="fas fa-trash"></i> Hapus
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-edit-player').forEach(b => {
      b.addEventListener('click', () => openPlayerModal(b.getAttribute('data-id')));
    });

    tbody.querySelectorAll('.btn-del-player').forEach(b => {
      b.addEventListener('click', () => deletePlayer(b.getAttribute('data-id')));
    });
  }

  function openPlayerModal(id = null) {
    const isEdit = Boolean(id);
    document.getElementById('modal-player-title').textContent = isEdit ? 'Edit Data Pemain' : 'Tambah Pemain Baru';
    document.getElementById('player-id').value = id || '';

    const preview = document.getElementById('player-preview-img');
    document.getElementById('file-player-photo').value = '';

    if (isEdit) {
      const players = window.BadcomData.getPlayers();
      const p = players.find(item => item.id === id);
      if (p) {
        document.getElementById('player-name').value = p.name || '';
        document.getElementById('player-num').value = p.num || '';
        document.getElementById('player-category').value = p.category || 'men';
        document.getElementById('player-ig').value = p.instagram || '';
        document.getElementById('player-photo-url').value = p.image || '';
        if (p.image) {
          preview.src = p.image;
          preview.style.display = 'inline-block';
        } else {
          preview.style.display = 'none';
        }
      }
    } else {
      document.getElementById('player-name').value = '';
      document.getElementById('player-num').value = '';
      document.getElementById('player-category').value = 'men';
      document.getElementById('player-ig').value = '';
      document.getElementById('player-photo-url').value = 'assets/images/players/1.png';
      preview.src = 'assets/images/players/1.png';
      preview.style.display = 'inline-block';
    }

    modalPlayer.classList.add('open');
  }

  function savePlayer() {
    const id = document.getElementById('player-id').value || 'player_' + Date.now();
    const name = document.getElementById('player-name').value.trim();
    const num = document.getElementById('player-num').value.trim();
    const category = document.getElementById('player-category').value;
    const instagram = document.getElementById('player-ig').value.trim().replace(/^@/, '');
    const image = document.getElementById('player-photo-url').value.trim() || 'assets/images/players/1.png';

    if (!name || !num) {
      alert('Nama dan nomor pemain tidak boleh kosong.');
      return;
    }

    const players = window.BadcomData.getPlayers();
    const existingIndex = players.findIndex(p => p.id === id);

    let gallery = [];
    if (existingIndex >= 0 && players[existingIndex].gallery) {
      gallery = players[existingIndex].gallery;
    }

    const playerData = {
      id,
      num: String(num).padStart(2, '0'),
      name: name.toUpperCase(),
      category,
      instagram,
      image,
      gallery
    };

    if (existingIndex >= 0) {
      players[existingIndex] = playerData;
    } else {
      players.push(playerData);
    }

    window.BadcomData.savePlayers(players);
    modalPlayer.classList.remove('open');
    renderPlayersTable();
    initPlayerGalleryManager();
    showToast('Data pemain berhasil disimpan!', 'success');
  }

  function deletePlayer(id) {
    const players = window.BadcomData.getPlayers();
    const p = players.find(item => item.id === id);
    if (!p) return;

    if (!confirm(`Apakah Anda yakin ingin menghapus pemain "${p.name}"?`)) return;

    const filtered = players.filter(item => item.id !== id);
    window.BadcomData.savePlayers(filtered);
    renderPlayersTable();
    initPlayerGalleryManager();
    showToast(`Pemain ${p.name} berhasil dihapus.`, 'success');
  }


  // ============================================
  // TAB 3: PLAYER PERSONAL GALLERY
  // ============================================

  function initPlayerGalleryManager() {
    const select = document.getElementById('select-gallery-player');
    if (!select) return;

    const players = window.BadcomData.getPlayers();
    select.innerHTML = players.map(p => `
      <option value="${p.id}">#${p.num} ${escapeHTML(p.name)} (${p.category.toUpperCase()}) - ${p.gallery ? p.gallery.length : 0} Foto</option>
    `).join('');

    if (!currentSelectedPlayerId && players.length > 0) {
      currentSelectedPlayerId = players[0].id;
    } else if (players.length > 0 && !players.find(p => p.id === currentSelectedPlayerId)) {
      currentSelectedPlayerId = players[0].id;
    }

    if (currentSelectedPlayerId) {
      select.value = currentSelectedPlayerId;
      renderPlayerGalleryGrid(currentSelectedPlayerId);
    }

    select.onchange = function () {
      currentSelectedPlayerId = this.value;
      renderPlayerGalleryGrid(currentSelectedPlayerId);
    };
  }

  function renderPlayerGalleryGrid(playerId) {
    const grid = document.getElementById('player-gallery-grid');
    const headerName = document.getElementById('gallery-player-name');
    if (!grid) return;

    const players = window.BadcomData.getPlayers();
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    headerName.textContent = `Foto Momen Aksi: #${player.num} ${player.name}`;

    const gallery = player.gallery || [];
    if (gallery.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--color-muted); border: 1px dashed rgba(74, 145, 226, 0.2); border-radius: 6px;">
          Belum ada foto momen aksi untuk pemain ini. Klik tombol "Upload Foto Momen" di atas.
        </div>
      `;
      return;
    }

    grid.innerHTML = gallery.map((imgSrc, idx) => `
      <div class="admin-gallery-card">
        <img src="${imgSrc}" alt="Momen ${player.name}" onerror="this.src='assets/images/gallery/1.JPG'">
        <button class="admin-gallery-card-del" title="Hapus foto ini" data-idx="${idx}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');

    grid.querySelectorAll('.admin-gallery-card-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        deletePlayerMoment(playerId, idx);
      });
    });
  }

  function openPlayerGalleryModal() {
    const players = window.BadcomData.getPlayers();
    const player = players.find(p => p.id === currentSelectedPlayerId);
    if (!player) {
      alert('Pilih pemain terlebih dahulu.');
      return;
    }

    document.getElementById('modal-gallery-player-name').textContent = `Target: #${player.num} ${player.name}`;
    document.getElementById('player-moment-url').value = '';
    document.getElementById('file-player-moment').value = '';
    const preview = document.getElementById('player-moment-preview');
    preview.src = '';
    preview.style.display = 'none';

    modalPlayerGallery.classList.add('open');
  }

  function savePlayerMoment() {
    const url = document.getElementById('player-moment-url').value.trim();
    if (!url) {
      alert('Silakan pilih file foto atau isi URL gambar.');
      return;
    }

    const players = window.BadcomData.getPlayers();
    const player = players.find(p => p.id === currentSelectedPlayerId);
    if (!player) return;

    if (!player.gallery) player.gallery = [];
    player.gallery.push(url);

    window.BadcomData.savePlayers(players);
    modalPlayerGallery.classList.remove('open');
    renderPlayerGalleryGrid(currentSelectedPlayerId);
    initPlayerGalleryManager();
    renderPlayersTable();
    showToast(`Foto momen berhasil ditambahkan ke profil ${player.name}!`, 'success');
  }

  function deletePlayerMoment(playerId, index) {
    if (!confirm('Hapus foto momen ini dari galeri pemain?')) return;

    const players = window.BadcomData.getPlayers();
    const player = players.find(p => p.id === playerId);
    if (!player || !player.gallery) return;

    player.gallery.splice(index, 1);
    window.BadcomData.savePlayers(players);
    renderPlayerGalleryGrid(playerId);
    initPlayerGalleryManager();
    renderPlayersTable();
    showToast('Foto momen berhasil dihapus.', 'success');
  }


  // ============================================
  // TAB 4: COMMUNITY GALLERY MOMENTS
  // ============================================

  function renderCommunityTable() {
    const tbody = document.getElementById('table-community-body');
    if (!tbody) return;

    const items = window.BadcomData.getCommunityGallery();
    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center; padding: 2.5rem; color:var(--color-muted);">
            Belum ada momen galeri komunitas. Klik "Tambah Foto Sesi" di atas.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(item => `
      <tr>
        <td>
          <img src="${item.image}" alt="${escapeHTML(item.title)}" class="admin-thumb" onerror="this.src='assets/images/gallery/1.JPG'">
        </td>
        <td><strong style="color:var(--color-white);">${escapeHTML(item.title)}</strong></td>
        <td><span style="color:var(--color-gold);">${escapeHTML(item.subtitle)}</span></td>
        <td style="text-align:right; white-space:nowrap;">
          <button class="admin-btn-action btn-edit-comm" data-id="${item.id}">
            <i class="fas fa-pen"></i> Edit
          </button>
          <button class="admin-btn-action btn-danger btn-del-comm" data-id="${item.id}">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-edit-comm').forEach(b => {
      b.addEventListener('click', () => openCommunityModal(b.getAttribute('data-id')));
    });

    tbody.querySelectorAll('.btn-del-comm').forEach(b => {
      b.addEventListener('click', () => deleteCommunityMoment(b.getAttribute('data-id')));
    });
  }

  function openCommunityModal(id = null) {
    const isEdit = Boolean(id);
    document.getElementById('modal-community-title').textContent = isEdit ? 'Edit Momen Komunitas' : 'Tambah Foto Sesi Komunitas';
    document.getElementById('comm-id').value = id || '';

    const preview = document.getElementById('comm-preview-img');
    document.getElementById('file-comm-image').value = '';

    if (isEdit) {
      const list = window.BadcomData.getCommunityGallery();
      const item = list.find(x => x.id === id);
      if (item) {
        document.getElementById('comm-title').value = item.title || '';
        document.getElementById('comm-subtitle').value = item.subtitle || '';
        document.getElementById('comm-image-url').value = item.image || '';
        if (item.image) {
          preview.src = item.image;
          preview.style.display = 'inline-block';
        } else {
          preview.style.display = 'none';
        }
      }
    } else {
      document.getElementById('comm-title').value = '';
      document.getElementById('comm-subtitle').value = 'ROYAL SPORTS — 2026';
      document.getElementById('comm-image-url').value = 'assets/images/gallery/1.JPG';
      preview.src = 'assets/images/gallery/1.JPG';
      preview.style.display = 'inline-block';
    }

    modalCommunity.classList.add('open');
  }

  function saveCommunityMoment() {
    const id = document.getElementById('comm-id').value || 'comm_' + Date.now();
    const title = document.getElementById('comm-title').value.trim();
    const subtitle = document.getElementById('comm-subtitle').value.trim();
    const image = document.getElementById('comm-image-url').value.trim();

    if (!title || !image) {
      alert('Judul dan foto momen tidak boleh kosong.');
      return;
    }

    const list = window.BadcomData.getCommunityGallery();
    const existingIndex = list.findIndex(x => x.id === id);

    const data = {
      id,
      title: title.toUpperCase(),
      subtitle: subtitle.toUpperCase(),
      image
    };

    if (existingIndex >= 0) {
      list[existingIndex] = data;
    } else {
      list.push(data);
    }

    window.BadcomData.saveCommunityGallery(list);
    modalCommunity.classList.remove('open');
    renderCommunityTable();
    showToast('Momen komunitas berhasil disimpan!', 'success');
  }

  function deleteCommunityMoment(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus foto momen ini dari galeri komunitas?')) return;
    const list = window.BadcomData.getCommunityGallery().filter(x => x.id !== id);
    window.BadcomData.saveCommunityGallery(list);
    renderCommunityTable();
    showToast('Momen komunitas berhasil dihapus.', 'success');
  }


  // ============================================
  // TAB 5: BACKUP & DATA.JS EXPORT
  // ============================================

  function initBackupSection() {
    const rawJsonArea = document.getElementById('raw-json-data');
    if (!rawJsonArea) return;

    const fullDB = {
      schedules: window.BadcomData.getSchedules(),
      players: window.BadcomData.getPlayers(),
      communityGallery: window.BadcomData.getCommunityGallery()
    };

    rawJsonArea.value = JSON.stringify(fullDB, null, 2);

    // Download data.js
    const btnDownload = document.getElementById('btn-download-data-js');
    btnDownload.onclick = function () {
      const code = window.BadcomData.exportDataJS();
      const blob = new Blob([code], { type: 'application/javascript;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('File data.js berhasil didownload! Simpan di folder js/data.js.', 'success');
    };

    // Copy JSON
    document.getElementById('btn-copy-json').onclick = function () {
      rawJsonArea.select();
      navigator.clipboard.writeText(rawJsonArea.value).then(() => {
        showToast('JSON disalin ke clipboard!', 'success');
      });
    };

    // Restore JSON
    document.getElementById('btn-restore-json').onclick = function () {
      try {
        const parsed = JSON.parse(rawJsonArea.value);
        if (parsed.schedules) window.BadcomData.saveSchedules(parsed.schedules);
        if (parsed.players) window.BadcomData.savePlayers(parsed.players);
        if (parsed.communityGallery) window.BadcomData.saveCommunityGallery(parsed.communityGallery);
        showToast('Database berhasil dipulihkan dari JSON!', 'success');
        refreshAll();
      } catch (err) {
        alert('Gagal memulihkan: Format JSON tidak valid (' + err.message + ')');
      }
    };
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

  // Init Auth Gate when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthGate);
  } else {
    initAuthGate();
  }
})();
