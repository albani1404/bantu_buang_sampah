/* =====================================================
   BANTU BUANG — Authentication & Account Module
   Updated to use async API calls to Backend
   ===================================================== */

// ===== LOGIN =====
async function doLogin() {
  const nama   = document.getElementById('login-nama')?.value?.trim();
  const alamat = document.getElementById('login-alamat')?.value?.trim();
  const password = document.getElementById('login-password')?.value?.trim();

  if (!nama || !alamat || !password) {
    showToast('⚠️ Lengkapi semua field untuk masuk!');
    return;
  }

  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Memproses...';
  btn.disabled = true;

  try {
    const result = await apiLogin(nama, alamat, password);
    localStorage.setItem('bb_token', result.token);
    setCurrentUser(result.user);
    updateTopbarAvatar();
    showToast(`✅ Selamat datang kembali, ${result.user.name}!`);
    renderAkun();
  } catch (error) {
    // Error is already logged in apiCall
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ===== REGISTER =====
async function doRegister() {
  const nama   = document.getElementById('daftar-nama')?.value?.trim();
  const alamat = document.getElementById('daftar-alamat')?.value?.trim();
  const umur   = parseInt(document.getElementById('daftar-umur')?.value);
  const password = document.getElementById('daftar-password')?.value?.trim();

  if (!nama || !alamat || !umur || !password) {
    showToast('⚠️ Lengkapi semua field!');
    return;
  }

  if (umur < 17 || umur > 100) {
    showToast('⚠️ Umur tidak valid (17-100 tahun)');
    return;
  }

  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Memproses...';
  btn.disabled = true;

  try {
    const result = await apiRegister(nama, alamat, umur, password);
    localStorage.setItem('bb_token', result.token);
    setCurrentUser(result.user);
    updateTopbarAvatar();
    showToast(`🎉 Akun berhasil dibuat! Selamat datang, ${result.user.name}!`);
    renderAkun();
  } catch (error) {
    // Error is already logged in apiCall
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ===== LOGOUT =====
function doLogout() {
  localStorage.removeItem('bb_token');
  setCurrentUser(null);
  updateTopbarAvatar();
  showToast('👋 Anda telah keluar.');
  renderAkun();
}

// ===== ORDER HISTORY =====
async function renderOrderHistory() {
  const histEl = document.getElementById('order-history-list');
  const certEl = document.getElementById('cert-list');
  if (!histEl) return;

  histEl.innerHTML = '<div class="empty-state">Memuat riwayat...</div>';

  try {
    const myOrders = await apiGetUserOrders(currentUser.id);

    if (!myOrders.length) {
      histEl.innerHTML = '<div class="empty-state">Belum ada riwayat layanan</div>';
      if (certEl) certEl.innerHTML = '<div class="empty-state">Sertifikat muncul setelah layanan selesai</div>';
      return;
    }

    const getStatusClass = (status) => {
      if (status === 'Selesai') return 'status-done';
      if (status === 'Dalam Review' || status === 'Dalam Proses') return 'status-process';
      return 'status-pending';
    };

    histEl.innerHTML = myOrders.map(o => {
      const safeDetail = o.detail ? o.detail.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
      return `
      <div class="order-history-item">
        <div>
          <div style="font-weight:600;font-size:.85rem">
            ${o.type === 'tinja' ? '🚛 Tinja' : o.type === 'sampah' ? '🗑️ Sampah' : '🏗️ IPAL'}
            ${o.price ? ' — Rp ' + o.price.toLocaleString('id-ID') : ' — Gratis'}
          </div>
          <div style="font-size:.75rem;color:var(--gray-400)">
            ${new Date(o.created_at).toLocaleDateString('id-ID')} — ${safeDetail}
          </div>
        </div>
        <span class="status-pill ${getStatusClass(o.status)}">${o.status}</span>
      </div>
      `;
    }).join('');

    if (certEl) {
      const doneOrders = myOrders.filter(o => o.status === 'Selesai');
      if (!doneOrders.length) {
        certEl.innerHTML = '<div class="empty-state">Sertifikat muncul setelah layanan selesai</div>';
      } else {
        certEl.innerHTML = doneOrders.map(o => `
          <div class="order-history-item">
            <div>
              <div style="font-weight:600;font-size:.85rem">📄 Sertifikat #${o.id}</div>
              <div style="font-size:.75rem;color:var(--gray-400)">Tanggal: ${new Date(o.created_at).toLocaleDateString('id-ID')}</div>
            </div>
            <button class="btn-ghost" style="padding:.35rem .75rem;font-size:.75rem" onclick="downloadCert(${o.id})">Unduh</button>
          </div>
        `).join('');
      }
    }

  } catch (error) {
    histEl.innerHTML = '<div class="empty-state" style="color:var(--red)">Gagal memuat riwayat pesanan.</div>';
  }
}

// ===== SWITCH AUTH TABS =====
function switchAuth(type) {
  const loginForm  = document.getElementById('form-login');
  const daftarForm = document.getElementById('form-daftar');
  const adminForm  = document.getElementById('form-admin');
  
  const tabLogin   = document.getElementById('tab-login');
  const tabDaftar  = document.getElementById('tab-daftar');
  const userTabs   = document.getElementById('user-auth-tabs');

  if (loginForm)  loginForm.classList.toggle('hidden', type !== 'login');
  if (daftarForm) daftarForm.classList.toggle('hidden', type !== 'daftar');
  if (adminForm)  adminForm.classList.toggle('hidden', type !== 'admin');
  
  if (tabLogin)   tabLogin.classList.toggle('active', type === 'login');
  if (tabDaftar)  tabDaftar.classList.toggle('active', type === 'daftar');
  
  if (userTabs)   userTabs.classList.toggle('hidden', type === 'admin');
}

// ===== ROLE SELECTION =====
function selectRole(role) {
  const roleSelector = document.getElementById('role-selector');
  const formsContainer = document.getElementById('auth-forms-container');
  
  if (roleSelector) roleSelector.classList.add('hidden');
  if (formsContainer) formsContainer.classList.remove('hidden');
  
  if (role === 'user') {
    switchAuth('login');
  } else if (role === 'admin') {
    switchAuth('admin');
  }
}

function resetRoleSelection() {
  const roleSelector = document.getElementById('role-selector');
  const formsContainer = document.getElementById('auth-forms-container');
  
  if (roleSelector) roleSelector.classList.remove('hidden');
  if (formsContainer) formsContainer.classList.add('hidden');
}

// ===== RENDER AKUN PAGE =====
function renderAkun() {
  const formsContainer = document.getElementById('auth-forms-container');
  const roleSelector   = document.getElementById('role-selector');
  const profileSection = document.getElementById('profile-section');

  if (currentUser) {
    // Show profile, hide auth forms
    if (formsContainer) formsContainer.classList.add('hidden');
    if (roleSelector)   roleSelector.classList.add('hidden');
    if (profileSection) profileSection.classList.remove('hidden');

    // Fill profile info
    const initials = currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const avatarBig  = document.getElementById('profile-avatar-big');
    const nameShow   = document.getElementById('profile-name-show');
    const metaShow   = document.getElementById('profile-meta-show');

    if (avatarBig) avatarBig.textContent = initials;
    if (nameShow)  nameShow.textContent  = currentUser.name;
    if (metaShow)  metaShow.textContent  = `${currentUser.alamat} · ${currentUser.umur} thn`;

    // Render order history
    renderOrderHistory();

  } else {
    // Show auth forms, hide profile
    resetRoleSelection();
    if (profileSection) profileSection.classList.add('hidden');
  }
}

// ===== DOWNLOAD CERT (demo) =====
function downloadCert(orderId) {
  showToast(`📥 Mengunduh sertifikat buang IPLT #${orderId}... (fitur demo)`);
}
