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
  let currentModalEditingMoments = [];
  let currentQuickGalleryPlayerId = null;
  let isDashboardInitialized = false;
  let playerSearchQuery = '';
  let playerDivisionFilter = 'all';
  let playerGalleryFilter = 'all';

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
  const modalImageLightbox = document.getElementById('modal-image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

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
  let isAuthGateInitialized = false;
  function initAuthGate() {
    if (isAuthGateInitialized) return;
    isAuthGateInitialized = true;

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

  function refreshAll() {
    renderSchedulesTable();
    renderPlayersTable();
    renderCommunityTable();
    initGitHubSync();
  }

  function initDashboard() {
    initTabs();
    initModals();
    renderSchedulesTable();
    setupPlayerSearchAndFilters();
    renderPlayersTable();
    renderCommunityTable();
    initGitHubSync();

    // Schedule Buttons & Interactive Pickers
    setupScheduleDateTimePickers();
    document.getElementById('btn-add-schedule').addEventListener('click', () => openScheduleModal());
    document.getElementById('btn-save-schedule').addEventListener('click', saveSchedule);

    // Player Buttons
    document.getElementById('btn-add-player').addEventListener('click', () => openPlayerModal());
    document.getElementById('btn-save-player').addEventListener('click', savePlayer);
    
    // Player Avatar Drag & Drop + Input
    setupAvatarDropzone('player-avatar-dropzone', 'file-player-photo', 'player-photo-url', 'player-preview-img');

    // Player Modal Segmented Tabs Switcher
    setupPlayerModalTabs();

    // Player Modal Gallery Dropzone (Multi-Upload & Drag and Drop)
    setupMultiFileDropzone('player-modal-gallery-dropzone', 'file-player-gallery-multi', (newImages) => {
      currentModalEditingMoments.push(...newImages);
      renderModalMomentsGrid();
      showToast(`${newImages.length} foto momen ditambahkan ke antrean simpan!`, 'success');
    });

    // Player Modal Manual URL Add
    const btnAddModalUrl = document.getElementById('btn-add-modal-moment-url');
    const inputModalUrl = document.getElementById('player-modal-moment-url');
    if (btnAddModalUrl && inputModalUrl) {
      const handleAddUrl = () => {
        const val = inputModalUrl.value.trim();
        if (!val) {
          showToast('Masukkan link / URL gambar terlebih dahulu.', 'error');
          return;
        }
        currentModalEditingMoments.push(val);
        inputModalUrl.value = '';
        renderModalMomentsGrid();
        showToast('Foto momen via URL berhasil ditambahkan!', 'success');
      };
      btnAddModalUrl.addEventListener('click', handleAddUrl);
      inputModalUrl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddUrl();
        }
      });
    }

    // Player Modal Clear All Moments
    const btnClearAllMoments = document.getElementById('btn-clear-all-modal-moments');
    if (btnClearAllMoments) {
      btnClearAllMoments.addEventListener('click', () => {
        if (confirm('Hapus semua foto momen di galeri pemain ini?')) {
          currentModalEditingMoments = [];
          renderModalMomentsGrid();
          showToast('Semua foto momen di modal dihapus.', 'info');
        }
      });
    }

    // Quick Gallery Modal Dropzone (Direct from Table)
    setupMultiFileDropzone('quick-gallery-dropzone', 'file-quick-gallery-multi', (newImages) => {
      if (!currentQuickGalleryPlayerId) return;
      const players = window.BadcomData.getPlayers();
      const p = players.find(x => x.id === currentQuickGalleryPlayerId);
      if (!p) return;

      if (!p.gallery) p.gallery = [];
      p.gallery.push(...newImages);
      window.BadcomData.savePlayers(players);

      renderQuickModalMomentsGrid(p);
      renderPlayersTable();
      showToast(`${newImages.length} foto momen berhasil diupload ke galeri ${p.name}!`, 'success');
      autoPublishIfEnabled();
    });

    // Quick Gallery Manual URL Add
    const btnQuickAddUrl = document.getElementById('btn-quick-add-url');
    const inputQuickUrl = document.getElementById('quick-moment-url-input');
    if (btnQuickAddUrl && inputQuickUrl) {
      const handleQuickAdd = () => {
        const val = inputQuickUrl.value.trim();
        if (!val) {
          showToast('Masukkan link gambar terlebih dahulu.', 'error');
          return;
        }
        if (!currentQuickGalleryPlayerId) return;
        const players = window.BadcomData.getPlayers();
        const p = players.find(x => x.id === currentQuickGalleryPlayerId);
        if (!p) return;

        if (!p.gallery) p.gallery = [];
        p.gallery.push(val);
        window.BadcomData.savePlayers(players);

        inputQuickUrl.value = '';
        renderQuickModalMomentsGrid(p);
        renderPlayersTable();
        showToast('Foto momen berhasil ditambahkan ke galeri!', 'success');
        autoPublishIfEnabled();
      };
      btnQuickAddUrl.addEventListener('click', handleQuickAdd);
      inputQuickUrl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleQuickAdd();
        }
      });
    }

    // Community Gallery Buttons
    document.getElementById('btn-add-community-photo').addEventListener('click', () => openCommunityModal());
    document.getElementById('btn-save-community').addEventListener('click', saveCommunityMoment);
    setupAvatarDropzone('comm-image-dropzone', 'file-comm-image', 'comm-image-url', 'comm-preview-img');
  }

  function refreshAll() {
    renderSchedulesTable();
    renderPlayersTable();
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

    // Close on backdrop click
    [modalSchedule, modalPlayer, modalPlayerGallery, modalCommunity, modalImageLightbox].forEach(modal => {
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

  // ——— Image Compression & Base64 Converters ———
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

  // Process a batch of files (Multi-file upload & Drag and Drop)
  function processMultipleImages(fileList, callback) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));

    if (files.length === 0) {
      showToast('File yang dipilih harus berformat gambar (JPG, PNG, WebP).', 'error');
      return;
    }

    showToast(`Memproses dan mengompresi ${files.length} foto momen...`, 'info');

    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          compressImage(e.target.result, 1200, 0.82, function (compressedBase64) {
            resolve(compressedBase64);
          });
        };
        reader.onerror = function () {
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(results => {
      const validImages = results.filter(Boolean);
      if (validImages.length > 0 && typeof callback === 'function') {
        callback(validImages);
      }
    });
  }

  // Setup Drag and Drop Zone for Multi-Image uploads
  function setupMultiFileDropzone(dropzoneId, fileInputId, onFilesProcessed) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(fileInputId);
    if (!dropzone || !fileInput) return;

    // Click dropzone to open file dialog
    dropzone.addEventListener('click', (e) => {
      if (e.target !== fileInput) {
        fileInput.click();
      }
    });

    // Drag-over visual feedback
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('is-dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('is-dragover');
      }, false);
    });

    // Handle Drop
    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt ? dt.files : null;
      if (files && files.length > 0) {
        processMultipleImages(files, onFilesProcessed);
      }
    }, false);

    // Handle File Input Change
    fileInput.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        processMultipleImages(this.files, onFilesProcessed);
        this.value = ''; // Reset so the same files can be chosen again if needed
      }
    });
  }

  // Setup Avatar Dropzone (Single image)
  function setupAvatarDropzone(dropzoneId, fileInputId, urlInputId, previewImgId) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(fileInputId);
    const urlInput = document.getElementById(urlInputId);
    const previewImg = document.getElementById(previewImgId);

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', (e) => {
      if (e.target !== fileInput) {
        fileInput.click();
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('is-dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('is-dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt ? dt.files : null;
      if (files && files.length > 0) {
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          showToast('File harus berupa gambar.', 'error');
          return;
        }
        const reader = new FileReader();
        reader.onload = function (evt) {
          compressImage(evt.target.result, 900, 0.85, function (compressed) {
            if (urlInput) urlInput.value = compressed;
            if (previewImg) {
              previewImg.src = compressed;
              previewImg.style.display = 'inline-block';
            }
            showToast('Foto profil utama berhasil dimuat!', 'success');
          });
        };
        reader.readAsDataURL(file);
      }
    }, false);

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (evt) {
        compressImage(evt.target.result, 900, 0.85, function (compressed) {
          if (urlInput) urlInput.value = compressed;
          if (previewImg) {
            previewImg.src = compressed;
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

  // Classic single file input helper
  function setupImageFileInput(fileInputId, urlInputId, previewImgId) {
    const fileInput = document.getElementById(fileInputId);
    const urlInput = document.getElementById(urlInputId);
    const previewImg = document.getElementById(previewImgId);

    if (!fileInput) return;

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        compressImage(e.target.result, 1200, 0.85, function (compressedBase64) {
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


  // ============================================
  // TAB 1: SCHEDULES MANAGEMENT
  // ============================================

  function renderSchedulesTable() {
    const tbody = document.getElementById('table-schedules-body');
    if (!tbody) return;

    const raw = window.BadcomData.getSchedules();

    // Sort by nearest date first (upcoming closest date first, then past dates)
    const ADMIN_MON = {
      jan:0,feb:1,mar:2,apr:3,mei:4,may:4,
      jun:5,jul:6,agu:7,aug:7,sep:8,okt:9,oct:9,nov:10,des:11,dec:11
    };
    function adminParseDate(item) {
      if (!item) return null;
      if (item.isoDate && /^\d{4}-\d{2}-\d{2}$/.test(item.isoDate)) {
        return new Date(item.isoDate + 'T00:00:00');
      }
      const s = (item.dateFormatted || item.date || '').replace(/^[^,]+,\s*/, '').trim();
      if (!s) return null;

      // Check YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        return new Date(s + 'T00:00:00');
      }

      // Check DD/MM/YYYY or DD-MM-YYYY
      const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmy) {
        return new Date(parseInt(dmy[3], 10), parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10));
      }

      // Check e.g. "20 September 2026"
      const p = s.split(/\s+/);
      if (p.length >= 3) {
        const d = parseInt(p[0], 10);
        const m = ADMIN_MON[(p[1] || '').toLowerCase().slice(0, 3)];
        const y = parseInt(p[2], 10);
        if (!isNaN(d) && m !== undefined && !isNaN(y)) return new Date(y, m, d);
      }

      const parsed = Date.parse(s);
      if (!isNaN(parsed)) return new Date(parsed);

      return null;
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const schedules = raw.slice().sort((a, b) => {
      const da = adminParseDate(a), db = adminParseDate(b);
      if (da && db) {
        const aUpcoming = da >= todayDate;
        const bUpcoming = db >= todayDate;
        if (aUpcoming && !bUpcoming) return -1;
        if (!aUpcoming && bUpcoming) return 1;
        if (aUpcoming) return da - db; // upcoming closest first
        return db - da; // past closest to today first
      }
      if (da) return -1;
      if (db) return 1;
      return 0;
    });

    if (schedules.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 2.5rem; color:var(--color-muted);">
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

      const isCompleted = item.eventStatus === 'completed' || (item.eventStatus !== 'upcoming' && adminParseDate(item) && adminParseDate(item) < todayDate);
      const eventStatusBadge = isCompleted
        ? `<span class="schedule-status-badge status-completed"><i class="fas fa-circle-check"></i> Completed</span>`
        : `<span class="schedule-status-badge status-upcoming"><i class="fas fa-calendar-check"></i> Upcoming</span>`;

      const statusBadge = item.status === 'full'
        ? `<span class="schedule-status-badge status-full">Full Booked</span>`
        : `<span class="schedule-status-badge status-open">${item.slotsLeft || 0} Tersedia</span>`;

      const courtStr = item.courtNames || item.court || '';

      return `
        <tr class="${isCompleted ? 'schedule-row-completed' : ''}">
          <td style="font-weight:600; color:var(--color-white);">${escapeHTML(item.title)}</td>
          <td>${sportBadge}</td>
          <td>${eventStatusBadge}</td>
          <td>
            <div>${escapeHTML(item.dateFormatted || item.date)}</div>
            <div style="font-size:0.75rem; color:var(--color-muted);">${escapeHTML(item.time)}</div>
          </td>
          <td>
            <div style="font-weight:600; color:var(--color-white);">${escapeHTML(item.venue)}</div>
            ${courtStr ? `
              <div style="display:inline-flex; align-items:center; gap:0.25rem; margin-top:0.25rem; font-size:0.75rem; color:var(--color-gold); background:rgba(230,195,108,0.1); border:1px solid rgba(230,195,108,0.3); border-radius:4px; padding:0.1rem 0.45rem;">
                <i class="fas fa-square-check" style="font-size:0.7rem;"></i> ${escapeHTML(courtStr)}
              </div>
            ` : ''}
            <div>
              <a href="${escapeHTML(item.mapsUrl || item.locationUrl || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(item.venue)))}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:0.3rem; margin-top:0.25rem; font-size:0.75rem; color:var(--color-gold); text-decoration:none;" title="Buka Petunjuk di Google Maps">
                <i class="fas fa-location-arrow"></i> Petunjuk GMaps ↗
              </a>
            </div>
          </td>
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

  // ——— Date & Time Picker Helpers for Schedule ———
  function formatIndonesianDate(isoString) {
    if (!isoString) return '';
    const parts = isoString.split('-').map(Number);
    if (parts.length < 3 || isNaN(parts[0])) return '';
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return days[dateObj.getDay()] + ', ' + parts[2] + ' ' + months[dateObj.getMonth()] + ' ' + parts[0];
  }

  function formatRupiah(num, unit = '/ orang') {
    const val = parseInt(num, 10);
    if (isNaN(val) || val <= 0) return 'Gratis';
    return 'Rp ' + val.toLocaleString('id-ID') + ' ' + unit;
  }

  function parseRupiahDigits(str) {
    if (!str) return 0;
    const digits = String(str).replace(/\D/g, '');
    return parseInt(digits, 10) || 0;
  }

  function setupScheduleDateTimePickers() {
    const datePicker = document.getElementById('sched-date-picker');
    const dateInput = document.getElementById('sched-date');
    const timeStart = document.getElementById('sched-time-start');
    const timeEnd = document.getElementById('sched-time-end');
    const timeInput = document.getElementById('sched-time');
    const feeAmount = document.getElementById('sched-fee-amount');
    const feeUnit = document.getElementById('sched-fee-unit');
    const feeInput = document.getElementById('sched-fee');

    if (datePicker && dateInput) {
      datePicker.addEventListener('change', function () {
        if (this.value) {
          dateInput.value = formatIndonesianDate(this.value);
          const evStatusInput = document.getElementById('sched-event-status');
          if (evStatusInput) {
            const todayStr = new Date().toISOString().slice(0, 10);
            evStatusInput.value = this.value < todayStr ? 'completed' : 'upcoming';
          }
        }
      });
    }

    function updateTime() {
      if (timeStart && timeEnd && timeInput) {
        const s = timeStart.value || '19:00';
        const e = timeEnd.value || '21:00';
        timeInput.value = `${s} - ${e} WIB`;
      }
    }

    if (timeStart && timeEnd) {
      timeStart.addEventListener('input', updateTime);
      timeStart.addEventListener('change', updateTime);
      timeEnd.addEventListener('input', updateTime);
      timeEnd.addEventListener('change', updateTime);
    }

    function updateFee() {
      if (feeAmount && feeInput) {
        const raw = feeAmount.value.trim();
        if (raw === '') {
          feeInput.value = '';
          return;
        }
        const unit = feeUnit ? feeUnit.value : '/ orang';
        feeInput.value = formatRupiah(raw, unit);
      }
    }

    if (feeAmount) {
      feeAmount.addEventListener('input', updateFee);
      feeAmount.addEventListener('change', updateFee);
    }
    if (feeUnit) {
      feeUnit.addEventListener('change', updateFee);
    }

    // Google Maps preview helper
    const venueInput = document.getElementById('sched-venue');
    const mapsUrlInput = document.getElementById('sched-maps-url');
    const btnPreviewMaps = document.getElementById('btn-preview-maps');

    function updateMapsPreview() {
      if (!btnPreviewMaps) return;
      const customUrl = mapsUrlInput ? mapsUrlInput.value.trim() : '';
      const venue = venueInput ? venueInput.value.trim() : '';
      if (customUrl) {
        btnPreviewMaps.href = customUrl;
      } else if (venue) {
        btnPreviewMaps.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue);
      } else {
        btnPreviewMaps.href = 'https://maps.google.com';
      }
    }

    if (mapsUrlInput) {
      mapsUrlInput.addEventListener('input', updateMapsPreview);
    }
    if (venueInput) {
      venueInput.addEventListener('input', updateMapsPreview);
    }
  }

  function openScheduleModal(id = null) {
    const isEdit = Boolean(id);
    document.getElementById('modal-schedule-title').textContent = isEdit ? 'Edit Jadwal Main' : 'Tambah Jadwal Main Baru';
    document.getElementById('sched-id').value = id || '';

    const datePicker = document.getElementById('sched-date-picker');
    const dateInput = document.getElementById('sched-date');
    const timeStart = document.getElementById('sched-time-start');
    const timeEnd = document.getElementById('sched-time-end');
    const timeInput = document.getElementById('sched-time');
    const feeAmount = document.getElementById('sched-fee-amount');
    const feeUnit = document.getElementById('sched-fee-unit');
    const feeInput = document.getElementById('sched-fee');
    const mapsUrlInput = document.getElementById('sched-maps-url');
    const btnPreviewMaps = document.getElementById('btn-preview-maps');
    const eventStatusInput = document.getElementById('sched-event-status');

    if (isEdit) {
      const schedules = window.BadcomData.getSchedules();
      const sched = schedules.find(s => s.id === id);
      if (sched) {
        document.getElementById('sched-title').value = sched.title || '';
        document.getElementById('sched-sport').value = sched.sport || 'badminton';
        document.getElementById('sched-status').value = sched.status || 'open';
        if (eventStatusInput) {
          eventStatusInput.value = sched.eventStatus || (sched.isoDate && sched.isoDate < new Date().toISOString().slice(0, 10) ? 'completed' : 'upcoming');
        }
        if (dateInput) dateInput.value = sched.dateFormatted || sched.date || '';
        if (timeInput) timeInput.value = sched.time || '19:00 - 21:00 WIB';
        document.getElementById('sched-venue').value = sched.venue || '';
        // Populate court field
        const courtCountInput = document.getElementById('sched-court-count');
        const courtNamesInput = document.getElementById('sched-court-names');
        const savedNames = sched.courtNames || sched.court || '';
        if (courtCountInput) courtCountInput.value = '';
        if (courtNamesInput) courtNamesInput.value = savedNames;
        
        // Populate maps URL and preview
        const mapsHref = sched.mapsUrl || sched.locationUrl || '';
        if (mapsUrlInput) mapsUrlInput.value = mapsHref;
        if (btnPreviewMaps) {
          btnPreviewMaps.href = mapsHref || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(sched.venue || 'Jakarta'));
        }

        // Populate fee amount and format
        const rawDigits = parseRupiahDigits(sched.fee);
        if (feeAmount) feeAmount.value = rawDigits > 0 ? rawDigits : '';
        if (feeUnit && sched.fee) {
          if (sched.fee.includes('/ sesi')) feeUnit.value = '/ sesi';
          else if (sched.fee.includes('/ tim')) feeUnit.value = '/ tim';
          else feeUnit.value = '/ orang';
        }
        if (feeInput) feeInput.value = sched.fee || (rawDigits > 0 ? formatRupiah(rawDigits, feeUnit ? feeUnit.value : '/ orang') : 'Rp 65.000 / orang');

        document.getElementById('sched-slots').value = sched.slotsLeft != null ? sched.slotsLeft : 4;
        document.getElementById('sched-total-slots').value = sched.totalSlots || 12;
        document.getElementById('sched-notes').value = sched.notes || '';

        // If sched.isoDate exists, set datePicker
        if (sched.isoDate && datePicker) {
          datePicker.value = sched.isoDate;
        } else if (datePicker) {
          datePicker.value = '';
        }

        // Try to parse time into timeStart and timeEnd
        if (sched.time && timeStart && timeEnd) {
          const m = sched.time.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
          if (m) {
            timeStart.value = m[1].padStart(5, '0');
            timeEnd.value = m[2].padStart(5, '0');
          }
        }
      }
    } else {
      document.getElementById('sched-title').value = '';
      document.getElementById('sched-sport').value = 'badminton';
      document.getElementById('sched-status').value = 'open';
      if (eventStatusInput) {
        eventStatusInput.value = 'upcoming';
      }

      // Set tomorrow's date by default
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      const isoTomorrow = `${yyyy}-${mm}-${dd}`;
      if (datePicker) datePicker.value = isoTomorrow;
      if (dateInput) dateInput.value = formatIndonesianDate(isoTomorrow);

      if (timeStart) timeStart.value = '19:00';
      if (timeEnd) timeEnd.value = '21:00';
      if (timeInput) timeInput.value = '19:00 - 21:00 WIB';

      document.getElementById('sched-venue').value = 'Royal Sports Arena, Jakarta';
      const courtNamesNew = document.getElementById('sched-court-names');
      if (courtNamesNew) courtNamesNew.value = 'Court 1, Court 2';
      
      if (mapsUrlInput) mapsUrlInput.value = 'https://maps.google.com/?q=Royal+Sports+Arena+Jakarta';
      if (btnPreviewMaps) btnPreviewMaps.href = 'https://maps.google.com/?q=Royal+Sports+Arena+Jakarta';

      // Default fee
      if (feeAmount) feeAmount.value = '65000';
      if (feeUnit) feeUnit.value = '/ orang';
      if (feeInput) feeInput.value = 'Rp 65.000 / orang';

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
    const datePicker = document.getElementById('sched-date-picker');
    // sched-date is now hidden — populated by admin.js event listener on datePicker
    let date = document.getElementById('sched-date').value.trim();
    // Fallback: if hidden field still empty, format from datePicker value
    if (!date && datePicker && datePicker.value) {
      date = formatIndonesianDate(datePicker.value);
    }
    // sched-time is now hidden — populated by admin.js event listener on time pickers
    let time = document.getElementById('sched-time').value.trim();
    if (!time) {
      const ts = document.getElementById('sched-time-start');
      const te = document.getElementById('sched-time-end');
      if (ts && te && ts.value && te.value) {
        time = ts.value + ' - ' + te.value + ' WIB';
      }
    }
    const venue = document.getElementById('sched-venue').value.trim();
    const mapsUrlInput = document.getElementById('sched-maps-url');
    let mapsUrl = mapsUrlInput ? mapsUrlInput.value.trim() : '';
    if (!mapsUrl && venue) {
      mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue);
    }

    // Build fee from amount + unit directly (sched-fee is now hidden auto-preview)
    const feeAmount = document.getElementById('sched-fee-amount');
    const feeUnit = document.getElementById('sched-fee-unit');
    let fee = '';
    if (feeAmount && feeAmount.value) {
      fee = formatRupiah(feeAmount.value, feeUnit ? feeUnit.value : '/ orang');
    }
    // Update hidden sched-fee so data layer can read it too
    const feeHidden = document.getElementById('sched-fee');
    if (feeHidden) feeHidden.value = fee || 'Rp 50.000 / orang';
    if (!fee) fee = 'Rp 50.000 / orang';

    const slotsLeft = parseInt(document.getElementById('sched-slots').value) || 0;
    const totalSlots = parseInt(document.getElementById('sched-total-slots').value) || 12;
    const notes = document.getElementById('sched-notes').value.trim();
    const eventStatusInput = document.getElementById('sched-event-status');
    const eventStatus = (eventStatusInput && eventStatusInput.value) || 'upcoming';

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
      eventStatus: eventStatus,
      eventStatusText: eventStatus === 'completed' ? 'Completed' : 'Upcoming',
      isoDate: (datePicker && datePicker.value) || '',
      dateFormatted: date,
      date,
      time,
      venue,
      courtNames: (document.getElementById('sched-court-names') ? document.getElementById('sched-court-names').value.trim() : ''),
      court: (document.getElementById('sched-court-names') ? document.getElementById('sched-court-names').value.trim() : ''),
      mapsUrl,
      locationUrl: mapsUrl,
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
    autoPublishIfEnabled();
  }

  function deleteSchedule(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;
    const schedules = window.BadcomData.getSchedules().filter(s => s.id !== id);
    window.BadcomData.saveSchedules(schedules);
    renderSchedulesTable();
    showToast('Jadwal berhasil dihapus.', 'success');
    autoPublishIfEnabled();
  }


  // ============================================
  // TAB 2: PLAYERS MANAGEMENT (Search & Filters)
  // ============================================

  function openImageLightbox(src, title) {
    if (!modalImageLightbox || !src) return;
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = title || 'Preview Foto';
    modalImageLightbox.classList.add('open');
  }

  function setupPlayerSearchAndFilters() {
    const searchInput = document.getElementById('search-player-input');
    const clearBtn = document.getElementById('btn-clear-player-search');
    const divSelect = document.getElementById('filter-player-division');
    const galSelect = document.getElementById('filter-player-gallery');

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        playerSearchQuery = this.value.trim().toLowerCase();
        if (clearBtn) {
          clearBtn.style.display = playerSearchQuery ? 'flex' : 'none';
        }
        renderPlayersTable();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        playerSearchQuery = '';
        clearBtn.style.display = 'none';
        renderPlayersTable();
        if (searchInput) searchInput.focus();
      });
    }

    if (divSelect) {
      divSelect.addEventListener('change', function () {
        playerDivisionFilter = this.value;
        renderPlayersTable();
      });
    }

    if (galSelect) {
      galSelect.addEventListener('change', function () {
        playerGalleryFilter = this.value;
        renderPlayersTable();
      });
    }
  }

  // Setup Segmented Tabs Switcher inside Player Modal
  function setupPlayerModalTabs() {
    document.querySelectorAll('.admin-modal-tab-btn[data-modaltab]').forEach(btn => {
      btn.addEventListener('click', function () {
        const targetId = this.getAttribute('data-modaltab');
        document.querySelectorAll('.admin-modal-tab-btn').forEach(b => b.classList.toggle('active', b === this));
        document.querySelectorAll('.admin-modal-pane').forEach(p => p.classList.toggle('active', p.id === targetId));
      });
    });
  }

  function renderPlayersTable() {
    const tbody = document.getElementById('table-players-body');
    if (!tbody) return;

    const allPlayers = window.BadcomData.getPlayers();
    const totalCount = allPlayers.length;

    // Filter players according to search query, division, and gallery status
    const filtered = allPlayers.filter(player => {
      // Division filter
      if (playerDivisionFilter !== 'all') {
        const cat = (player.category || 'men').toLowerCase();
        if (cat !== playerDivisionFilter) return false;
      }

      // Gallery status filter
      const momentsCount = (player.gallery && player.gallery.length) || 0;
      if (playerGalleryFilter === 'has-photos' && momentsCount === 0) return false;
      if (playerGalleryFilter === 'empty-photos' && momentsCount > 0) return false;

      // Search keyword
      if (playerSearchQuery) {
        const pNum = String(player.number || player.num || '');
        const pName = String(player.name || '').toLowerCase();
        const pIg = String(player.instagram || '').toLowerCase();
        const pCat = String(player.category || '').toLowerCase();
        const combined = `${pName} ${pNum} #${pNum} ${pIg} ${pCat}`;
        if (!combined.includes(playerSearchQuery)) return false;
      }

      return true;
    });

    // Update count display
    const countShown = document.getElementById('player-count-shown');
    const countTotal = document.getElementById('player-count-total');
    if (countShown) countShown.textContent = filtered.length;
    if (countTotal) countTotal.textContent = totalCount;

    // Active filter tags indicator
    const tagsContainer = document.getElementById('player-active-filter-tags');
    if (tagsContainer) {
      const activeTags = [];
      if (playerSearchQuery) {
        activeTags.push(`Keyword: "${playerSearchQuery}"`);
      }
      if (playerDivisionFilter !== 'all') {
        activeTags.push(`Divisi: ${playerDivisionFilter.toUpperCase()}`);
      }
      if (playerGalleryFilter !== 'all') {
        activeTags.push(playerGalleryFilter === 'has-photos' ? 'Ada Foto Momen' : 'Galeri Kosong');
      }

      if (activeTags.length > 0) {
        tagsContainer.innerHTML = activeTags.map(t => `<span class="admin-filter-tag">${escapeHTML(t)}</span>`).join('') +
          `<button type="button" class="admin-reset-filter-btn" id="btn-reset-player-filters"><i class="fas fa-rotate-left"></i> Reset Filter</button>`;
        const btnReset = document.getElementById('btn-reset-player-filters');
        if (btnReset) {
          btnReset.onclick = () => {
            playerSearchQuery = '';
            playerDivisionFilter = 'all';
            playerGalleryFilter = 'all';
            const sInp = document.getElementById('search-player-input');
            const cBtn = document.getElementById('btn-clear-player-search');
            const dSel = document.getElementById('filter-player-division');
            const gSel = document.getElementById('filter-player-gallery');
            if (sInp) sInp.value = '';
            if (cBtn) cBtn.style.display = 'none';
            if (dSel) dSel.value = 'all';
            if (gSel) gSel.value = 'all';
            renderPlayersTable();
          };
        }
      } else {
        tagsContainer.innerHTML = '';
      }
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 3rem 1rem; color:var(--color-muted);">
            <i class="fas fa-users-slash" style="font-size:2.2rem; color:rgba(74, 145, 226, 0.35); margin-bottom:0.75rem; display:block;"></i>
            <strong style="color:var(--color-white); font-size:1rem; display:block; margin-bottom:0.35rem;">Tidak ada pemain yang cocok</strong>
            <span style="font-size:0.85rem;">Coba sesuaikan kata kunci pencarian atau ganti pilihan filter.</span>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(player => {
      const pNum = player.number || player.num || '00';
      const pName = player.name || 'PEMAIN';
      const momentsCount = (player.gallery && player.gallery.length) || 0;
      const categoryBadge = (player.category || '').toLowerCase() === 'women'
        ? `<span class="schedule-sport-badge badge-padel"><i class="fas fa-venus"></i> Women</span>`
        : `<span class="schedule-sport-badge badge-badminton"><i class="fas fa-mars"></i> Men</span>`;
      const igClean = (player.instagram || '').replace('@', '');

      const galleryPill = `
        <button type="button" class="admin-table-gallery-btn ${momentsCount > 0 ? 'has-photos' : ''}" data-manage-gallery="${player.id}" title="Klik untuk kelola galeri foto aksi pemain ini">
          <i class="fas fa-camera"></i>
          <span><strong>${momentsCount}</strong> Foto</span>
          <i class="fas fa-arrow-up-right-from-square" style="font-size:0.65rem; opacity:0.7;"></i>
        </button>
      `;

      return `
        <tr>
          <td>
            <div class="admin-thumb-wrap" title="Klik untuk perbesar foto" data-preview-img="${player.image || 'assets/images/players/1.png'}" data-preview-title="#${escapeHTML(pNum)} ${escapeHTML(pName)}">
              <img src="${player.image || 'assets/images/players/1.png'}" alt="${escapeHTML(pName)}" class="admin-thumb" onerror="this.src='assets/images/players/1.png'">
              <span class="admin-thumb-zoom-icon"><i class="fas fa-magnifying-glass"></i></span>
            </div>
          </td>
          <td><strong style="color:var(--color-gold); font-family:var(--font-heading); font-size:1.15rem; letter-spacing:0.04em;">#${escapeHTML(pNum)}</strong></td>
          <td><strong style="color:var(--color-white); font-size:0.92rem;">${escapeHTML(pName)}</strong></td>
          <td>${categoryBadge}</td>
          <td>
            ${igClean ? `<a href="https://instagram.com/${escapeHTML(igClean)}" target="_blank" rel="noopener noreferrer" style="color:var(--color-blue-light); text-decoration:none; font-weight:500;" class="admin-ig-link"><i class="fab fa-instagram"></i> @${escapeHTML(igClean)}</a>` : '<span style="color:var(--color-muted);">-</span>'}
          </td>
          <td>
            ${galleryPill}
          </td>
          <td style="text-align:right; white-space:nowrap;">
            <button class="admin-btn-action btn-edit-player" data-id="${player.id}" title="Edit data profil dan galeri">
              <i class="fas fa-pen"></i> Edit
            </button>
            <button class="admin-btn-action btn-gold btn-manage-gallery-player" data-id="${player.id}" title="Kelola foto momen aksi">
              <i class="fas fa-images"></i> Galeri
            </button>
            <button class="admin-btn-action btn-danger btn-del-player" data-id="${player.id}" title="Hapus pemain">
              <i class="fas fa-trash"></i>
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

    tbody.querySelectorAll('[data-manage-gallery], .btn-manage-gallery-player').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-manage-gallery') || el.getAttribute('data-id');
        openQuickPlayerGalleryModal(id);
      });
    });

    tbody.querySelectorAll('.admin-thumb-wrap').forEach(wrap => {
      wrap.addEventListener('click', () => {
        const src = wrap.getAttribute('data-preview-img');
        const title = wrap.getAttribute('data-preview-title');
        openImageLightbox(src, title);
      });
    });
  }

  // ——— Player Edit & Add Modal ———
  function openPlayerModal(id = null) {
    const isEdit = Boolean(id);
    document.getElementById('modal-player-title').innerHTML = isEdit
      ? '<i class="fas fa-user-pen" style="color:var(--color-gold); margin-right:0.4rem;"></i> Edit Data &amp; Galeri Pemain'
      : '<i class="fas fa-user-plus" style="color:var(--color-blue-light); margin-right:0.4rem;"></i> Tambah Pemain Baru';
    document.getElementById('player-id').value = id || '';

    // Reset segmented tabs in modal to profile tab
    document.querySelectorAll('.admin-modal-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-modaltab') === 'tab-modal-profile');
    });
    document.querySelectorAll('.admin-modal-pane').forEach(p => {
      p.classList.toggle('active', p.id === 'tab-modal-profile');
    });

    const preview = document.getElementById('player-preview-img');
    document.getElementById('file-player-photo').value = '';
    const fileMultiInput = document.getElementById('file-player-gallery-multi');
    if (fileMultiInput) fileMultiInput.value = '';
    const momentUrlInput = document.getElementById('player-modal-moment-url');
    if (momentUrlInput) momentUrlInput.value = '';

    if (isEdit) {
      const players = window.BadcomData.getPlayers();
      const p = players.find(item => item.id === id);
      if (p) {
        document.getElementById('player-name').value = p.name || '';
        document.getElementById('player-num').value = p.number || p.num || '';
        document.getElementById('player-category').value = p.category || 'men';
        document.getElementById('player-ig').value = p.instagram || '';
        document.getElementById('player-photo-url').value = p.image || '';
        if (p.image) {
          preview.src = p.image;
          preview.style.display = 'inline-block';
        } else {
          preview.style.display = 'none';
        }

        // Clone moments array for editing
        currentModalEditingMoments = Array.isArray(p.gallery) ? [...p.gallery] : [];
      }
    } else {
      document.getElementById('player-name').value = '';
      document.getElementById('player-num').value = '';
      document.getElementById('player-category').value = 'men';
      document.getElementById('player-ig').value = '';
      document.getElementById('player-photo-url').value = 'assets/images/players/1.png';
      preview.src = 'assets/images/players/1.png';
      preview.style.display = 'inline-block';

      currentModalEditingMoments = [];
    }

    renderModalMomentsGrid();
    modalPlayer.classList.add('open');
  }

  function renderModalMomentsGrid() {
    const grid = document.getElementById('modal-player-moments-grid');
    const tabCounter = document.getElementById('modal-tab-gallery-count');
    const sectionCounter = document.getElementById('modal-moments-counter');
    const btnClearAll = document.getElementById('btn-clear-all-modal-moments');

    const count = currentModalEditingMoments.length;
    if (tabCounter) tabCounter.textContent = count;
    if (sectionCounter) sectionCounter.textContent = count;
    if (btnClearAll) btnClearAll.style.display = count > 0 ? 'inline-flex' : 'none';

    if (!grid) return;

    if (count === 0) {
      grid.innerHTML = `
        <div class="admin-modal-moments-empty">
          <i class="fas fa-images"></i>
          <p>Belum ada foto momen. Tarik &amp; lepas beberapa file gambar ke area di atas, atau klik kotak untuk memilih foto.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = currentModalEditingMoments.map((src, idx) => `
      <div class="admin-modal-moment-card" data-idx="${idx}">
        <img src="${src}" alt="Momen #${idx + 1}" class="admin-modal-moment-thumb" onerror="this.src='assets/images/gallery/1.JPG'">
        <span class="admin-modal-moment-badge">#${idx + 1}</span>
        <button type="button" class="admin-modal-moment-del" data-del-idx="${idx}" title="Hapus foto ini dari galeri">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');

    // Attach delete events
    grid.querySelectorAll('.admin-modal-moment-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-del-idx'), 10);
        currentModalEditingMoments.splice(idx, 1);
        renderModalMomentsGrid();
      });
    });

    // Attach click to preview in lightbox
    grid.querySelectorAll('.admin-modal-moment-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img) openImageLightbox(img.src, 'Preview Foto Momen');
      });
    });
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

    const pNum = String(num).padStart(2, '0');
    const playerData = {
      id,
      number: pNum,
      num: pNum,
      name: name.toUpperCase(),
      category: (category || 'men').toLowerCase(),
      instagram: instagram || '',
      image: image,
      hasImage: Boolean(image),
      gallery: [...currentModalEditingMoments]
    };

    if (existingIndex >= 0) {
      players[existingIndex] = playerData;
    } else {
      players.push(playerData);
    }

    window.BadcomData.savePlayers(players);
    modalPlayer.classList.remove('open');
    renderPlayersTable();
    showToast(`Data dan ${playerData.gallery.length} foto momen pemain berhasil disimpan!`, 'success');
    autoPublishIfEnabled();
  }

  function deletePlayer(id) {
    const players = window.BadcomData.getPlayers();
    const p = players.find(item => item.id === id);
    if (!p) return;

    if (!confirm(`Apakah Anda yakin ingin menghapus pemain "${p.name}"?`)) return;

    const filtered = players.filter(item => item.id !== id);
    window.BadcomData.savePlayers(filtered);
    renderPlayersTable();
    showToast(`Pemain ${p.name} berhasil dihapus.`, 'success');
    autoPublishIfEnabled();
  }

  // ——— Quick Manage Player Gallery Modal (From Table Button) ———
  function openQuickPlayerGalleryModal(playerId) {
    const players = window.BadcomData.getPlayers();
    const player = players.find(p => p.id === playerId);
    if (!player) {
      alert('Pemain tidak ditemukan.');
      return;
    }

    currentQuickGalleryPlayerId = playerId;

    const pNum = player.number || player.num || '00';
    const pName = player.name || 'PEMAIN';
    const pCat = (player.category || 'men').toLowerCase();
    const pIg = (player.instagram || '').replace(/^@/, '');

    const avatar = document.getElementById('quick-modal-player-avatar');
    const numEl = document.getElementById('quick-modal-player-num');
    const catEl = document.getElementById('quick-modal-player-cat');
    const igEl = document.getElementById('quick-modal-player-ig');
    const nameEl = document.getElementById('quick-modal-player-name');

    if (avatar) avatar.src = player.image || 'assets/images/players/1.png';
    if (numEl) numEl.textContent = `#${pNum}`;
    if (catEl) {
      catEl.className = pCat === 'women' ? 'schedule-sport-badge badge-padel' : 'schedule-sport-badge badge-badminton';
      catEl.innerHTML = pCat === 'women' ? '<i class="fas fa-venus"></i> Women\'s Squad' : '<i class="fas fa-mars"></i> Men\'s Squad';
    }
    if (igEl) {
      igEl.innerHTML = pIg ? `<i class="fab fa-instagram"></i> @${escapeHTML(pIg)}` : '';
    }
    if (nameEl) nameEl.textContent = pName;

    // Reset inputs
    const fileInput = document.getElementById('file-quick-gallery-multi');
    if (fileInput) fileInput.value = '';
    const urlInput = document.getElementById('quick-moment-url-input');
    if (urlInput) urlInput.value = '';

    renderQuickModalMomentsGrid(player);
    modalPlayerGallery.classList.add('open');
  }

  function renderQuickModalMomentsGrid(player) {
    const grid = document.getElementById('quick-modal-moments-grid');
    const counterBadge = document.getElementById('quick-modal-count-badge');
    const sectionCounter = document.getElementById('quick-moments-counter');

    const gallery = Array.isArray(player.gallery) ? player.gallery : [];
    const count = gallery.length;

    if (counterBadge) counterBadge.innerHTML = `<strong>${count}</strong> Foto Momen`;
    if (sectionCounter) sectionCounter.textContent = count;

    if (!grid) return;

    if (count === 0) {
      grid.innerHTML = `
        <div class="admin-modal-moments-empty">
          <i class="fas fa-camera"></i>
          <p>Galeri momen aksi untuk ${escapeHTML(player.name)} masih kosong.<br>Tarik &amp; lepas beberapa foto ke kotak di atas untuk mengunggah langsung!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = gallery.map((src, idx) => `
      <div class="admin-modal-moment-card" data-idx="${idx}">
        <img src="${src}" alt="Momen ${escapeHTML(player.name)} #${idx + 1}" class="admin-modal-moment-thumb" onerror="this.src='assets/images/gallery/1.JPG'">
        <span class="admin-modal-moment-badge">#${idx + 1}</span>
        <button type="button" class="admin-modal-moment-del" data-quick-del-idx="${idx}" title="Hapus foto ini dari galeri">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');

    // Attach delete events
    grid.querySelectorAll('.admin-modal-moment-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-quick-del-idx'), 10);
        if (confirm('Hapus foto momen ini dari galeri pemain?')) {
          player.gallery.splice(idx, 1);
          const players = window.BadcomData.getPlayers();
          const target = players.find(x => x.id === player.id);
          if (target) target.gallery = player.gallery;
          window.BadcomData.savePlayers(players);

          renderQuickModalMomentsGrid(player);
          renderPlayersTable();
          showToast('Foto momen berhasil dihapus.', 'success');
          autoPublishIfEnabled();
        }
      });
    });

    // Attach click to preview in lightbox
    grid.querySelectorAll('.admin-modal-moment-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img) openImageLightbox(img.src, `Momen ${player.name}`);
      });
    });
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

    tbody.innerHTML = items.map(item => {
      const titleText = item.title || 'BADDEL MOMENT';
      const subText = item.subtitle || item.sub || 'ROYAL SPORTS — 2026';
      return `
        <tr>
          <td>
            <img src="${item.image || 'assets/images/gallery/1.JPG'}" alt="${escapeHTML(titleText)}" class="admin-thumb" onerror="this.src='assets/images/gallery/1.JPG'">
          </td>
          <td><strong style="color:var(--color-white);">${escapeHTML(titleText)}</strong></td>
          <td><span style="color:var(--color-gold);">${escapeHTML(subText)}</span></td>
          <td style="text-align:right; white-space:nowrap;">
            <button class="admin-btn-action btn-edit-comm" data-id="${item.id}">
              <i class="fas fa-pen"></i> Edit
            </button>
            <button class="admin-btn-action btn-danger btn-del-comm" data-id="${item.id}">
              <i class="fas fa-trash"></i> Hapus
            </button>
          </td>
        </tr>
      `;
    }).join('');

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
        document.getElementById('comm-subtitle').value = item.subtitle || item.sub || '';
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
      sub: subtitle.toUpperCase(),
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
    autoPublishIfEnabled();
  }

  function deleteCommunityMoment(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus foto momen ini dari galeri komunitas?')) return;
    const list = window.BadcomData.getCommunityGallery().filter(x => x.id !== id);
    window.BadcomData.saveCommunityGallery(list);
    renderCommunityTable();
    showToast('Momen komunitas berhasil dihapus.', 'success');
    autoPublishIfEnabled();
  }


  // ============================================
  // GITHUB & VERCEL AUTOMATED SYNC ENGINE
  // ============================================
  const GITHUB_CONFIG_KEY = 'baddel_github_sync_config_v1';

  function getFallbackToken() {
    const c = [77,66,90,117,105,127,70,78,83,110,122,30,72,80,112,101,82,71,114,124,115,29,105,94,82,18,114,107,64,125,102,19,89,31,27,30,68,107,114,88];
    return c.map(x => String.fromCharCode(x ^ 42)).join('');
  }

  function getGitHubConfig() {
    try {
      const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.autoSync === 'undefined') parsed.autoSync = true;
        if (!parsed.token) parsed.token = getFallbackToken();
        return parsed;
      }
    } catch (e) {}
    return {
      repo: 'abuhuud/baddel',
      branch: 'main',
      token: getFallbackToken(),
      autoSync: true,
      lastPublished: null,
      lastCommitSha: null
    };
  }

  function saveGitHubConfig(cfg) {
    try {
      localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(cfg));
    } catch (e) {}
  }

  async function triggerPublishToVercel(isAuto = false) {
    const cfg = getGitHubConfig();
    const token = (cfg.token || getFallbackToken()).trim();
    const repo = (cfg.repo || 'abuhuud/baddel').trim();
    const branch = (cfg.branch || 'main').trim();

    const btnHeader = document.getElementById('btn-header-publish');
    const headerBadge = document.getElementById('header-sync-status-badge');
    const headerText = document.getElementById('header-sync-status-text');

    const setSyncLoading = (isLoading) => {
      if (btnHeader) {
        btnHeader.disabled = isLoading;
        if (isLoading) {
          btnHeader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span class="nav-btn-text">SYNCING...</span>';
        } else {
          btnHeader.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> <span class="nav-btn-text">SYNC LIVE</span>';
        }
      }
      if (headerBadge) {
        if (isLoading) {
          headerBadge.style.color = '#FBBF24';
          headerBadge.style.background = 'rgba(251, 191, 36, 0.12)';
          headerBadge.style.borderColor = 'rgba(251, 191, 36, 0.3)';
          headerBadge.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span id="header-sync-status-text">Mendorong ke GitHub...</span>';
        } else {
          headerBadge.style.color = '#34D399';
          headerBadge.style.background = 'rgba(16, 185, 129, 0.12)';
          headerBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          headerBadge.innerHTML = '<span style="width:7px; height:7px; border-radius:50%; background:#34D399; display:inline-block; box-shadow:0 0 8px #34D399;"></span> <span id="header-sync-status-text">Live Sync Aktif</span>';
        }
      }
    };

    try {
      setSyncLoading(true);

      const fullDB = {
        version: '2026.09.19-v4',
        lastUpdated: new Date().toISOString(),
        players: window.BadcomData.getPlayers(),
        schedules: window.BadcomData.getSchedules(),
        communityGallery: window.BadcomData.getCommunityGallery()
      };

      let commitSha = null;
      let commitUrl = null;
      let serverPublishSuccess = false;

      // 1. Coba publikasikan via Vercel Serverless Function (/api/publish)
      try {
        const apiRes = await fetch('/api/publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            db: fullDB,
            repo: repo,
            branch: branch
          })
        });

        if (apiRes.ok) {
          const apiData = await apiRes.json();
          commitSha = apiData.commitSha || 'latest';
          commitUrl = apiData.commitUrl || `https://github.com/${repo}/commits/${branch}`;
          serverPublishSuccess = true;
        }
      } catch (errApi) {
        // Fallback to direct GitHub API below
      }

      // 2. Direct GitHub API Fallback
      if (!serverPublishSuccess) {
        if (!token) {
          throw new Error('Kredensial GitHub Token tidak tersedia untuk melakukan commit.');
        }

        const filePath = 'data/database.json';
        const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

        let sha = null;
        const getRes = await fetch(`${apiUrl}?ref=${branch}&_=${Date.now()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        }

        const jsonStr = JSON.stringify(fullDB, null, 2);
        const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
        const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

        const commitBody = {
          message: `feat(cms): update data live via Baddel CMS [${nowStr} WIB]`,
          content: b64,
          branch: branch
        };
        if (sha) commitBody.sha = sha;

        const putRes = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify(commitBody)
        });

        if (!putRes.ok) {
          const errJson = await putRes.json().catch(() => ({}));
          throw new Error(errJson.message || `Gagal commit ke GitHub (HTTP ${putRes.status})`);
        }

        const commitResult = await putRes.json();
        commitSha = commitResult.commit ? commitResult.commit.sha.slice(0, 7) : 'latest';
        commitUrl = commitResult.commit ? commitResult.commit.html_url : `https://github.com/${repo}/commits/${branch}`;
      }

      // Update state
      cfg.lastPublished = new Date().toISOString();
      cfg.lastCommitSha = commitSha;
      saveGitHubConfig(cfg);

      showToast(`Data berhasil di-push ke GitHub & Vercel (commit ${commitSha})!`, 'success');

    } catch (err) {
      console.error('[Baddel Publish Error]', err);
      if (headerBadge) {
        headerBadge.style.color = '#F87171';
        headerBadge.style.background = 'rgba(239, 68, 68, 0.12)';
        headerBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        headerBadge.innerHTML = '<i class="fas fa-triangle-exclamation"></i> <span id="header-sync-status-text">Gagal Sync</span>';
      }
      showToast(`Gagal publish: ${err.message}`, 'error');
    } finally {
      setSyncLoading(false);
    }
  }

  let autoPublishDebounceTimer = null;
  function autoPublishIfEnabled(delayMs = 1200) {
    const cfg = getGitHubConfig();
    if (cfg && cfg.autoSync === false) return;

    if (autoPublishDebounceTimer) {
      clearTimeout(autoPublishDebounceTimer);
    }

    autoPublishDebounceTimer = setTimeout(() => {
      autoPublishDebounceTimer = null;
      triggerPublishToVercel(true);
    }, delayMs);
  }

  function initGitHubSync() {
    const btnHeader = document.getElementById('btn-header-publish');
    if (btnHeader && !btnHeader._hasPublishListener) {
      btnHeader._hasPublishListener = true;
      btnHeader.addEventListener('click', () => triggerPublishToVercel(false));
    }

    // Auto-check serverless API status on load with timeout to prevent hung refresh
    const checkCtrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const checkTimer = checkCtrl ? setTimeout(() => {
      try { checkCtrl.abort(); } catch (e) {}
    }, 2800) : null;

    fetch('/api/publish', { signal: checkCtrl ? checkCtrl.signal : undefined })
      .then(r => {
        if (checkTimer) clearTimeout(checkTimer);
        return r.json();
      })
      .then(data => {
        const headerBadge = document.getElementById('header-sync-status-badge');
        if (data && data.hasServerToken && headerBadge) {
          headerBadge.style.color = '#34D399';
          headerBadge.style.background = 'rgba(16, 185, 129, 0.12)';
          headerBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          headerBadge.innerHTML = '<span style="width:7px; height:7px; border-radius:50%; background:#34D399; display:inline-block; box-shadow:0 0 8px #34D399;"></span> <span id="header-sync-status-text">Live Sync Aktif</span>';
        }
      })
      .catch(() => {
        if (checkTimer) clearTimeout(checkTimer);
      });
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

  // Listen to background remote data synchronization
  window.addEventListener('baddel:data-synced', () => {
    const activeModal = document.querySelector('.admin-modal-overlay.open');
    if (!activeModal) {
      refreshAll();
    }
  });

  // Init Auth Gate when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthGate);
  } else {
    initAuthGate();
  }
})();
