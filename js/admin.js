/* =====================================================
   BANTU BUANG — Admin Dashboard Module
   Login: admin@admin.com / admin123
   ===================================================== */

let isAdminLoggedIn = JSON.parse(localStorage.getItem('bb_adminLoggedIn') || 'false');

// ===== ADMIN LOGIN =====
function doAdminLogin() {
  const email = document.getElementById('admin-email')?.value?.trim();
  const pass  = document.getElementById('admin-password')?.value?.trim();
  _processAdminLogin(email, pass);
}

function doAdminLoginFromAkun() {
  const email = document.getElementById('akun-admin-email')?.value?.trim();
  const pass  = document.getElementById('akun-admin-password')?.value?.trim();
  _processAdminLogin(email, pass, true);
}

async function _processAdminLogin(email, pass, redirect = false) {
  if (!email || !pass) {
    showToast('⚠️ Lengkapi email dan password!');
    return;
  }

  try {
    const result = await apiAdminLogin(email, pass);
    
    isAdminLoggedIn = true;
    localStorage.setItem('bb_adminLoggedIn', 'true');
    localStorage.setItem('bb_admin_token', result.token);
    
    showToast('✅ Selamat datang, Admin!');
    
    if (redirect) {
      // Clear forms
      const emailField = document.getElementById('akun-admin-email');
      const passField = document.getElementById('akun-admin-password');
      if (emailField) emailField.value = '';
      if (passField) passField.value = '';
      showPage('admin');
    } else {
      renderAdminDashboard();
    }
  } catch (error) {
    // Error is handled by apiCall, but we can also handle it here if needed
  }
}

// ===== ADMIN LOGOUT =====
function doAdminLogout() {
  isAdminLoggedIn = false;
  localStorage.setItem('bb_adminLoggedIn', 'false');
  localStorage.removeItem('bb_admin_token');
  showToast('👋 Admin telah keluar.');
  renderAdminDashboard();
}

// ===== RENDER ADMIN DASHBOARD =====
async function renderAdminDashboard() {
  const loginSection = document.getElementById('admin-login-section');
  const dashSection  = document.getElementById('admin-dashboard-section');

  if (!loginSection || !dashSection) return;

  if (isAdminLoggedIn) {
    loginSection.classList.add('hidden');
    dashSection.classList.remove('hidden');
    
    // Sembunyikan menu user, tampilkan menu admin
    document.querySelectorAll('.user-only').forEach(el => {
      el.style.display = 'none';
      el.classList.add('hidden');
    });
    // Inject admin nav dynamically if it doesn't exist
    if (!document.querySelector('.admin-only')) {
      const nav = document.querySelector('.sidebar-nav');
      if (nav) {
        nav.insertAdjacentHTML('beforeend', `
          <div class="nav-label admin-only">Menu Administrator</div>
          <a class="nav-item admin-only" data-page="admin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Dashboard Admin
          </a>
        `);
        // Bind event for the newly injected element
        const adminBtn = document.querySelector('.nav-item.admin-only');
        if (adminBtn) {
          adminBtn.addEventListener('click', (e) => {
            const page = e.currentTarget.getAttribute('data-page');
            if (page) showPage(page);
          });
        }
      }
    }

    // Pindahkan topbar
    const topbarAvatar = document.querySelector('.topbar-actions');
    if (topbarAvatar) topbarAvatar.style.display = 'none';
    
    // Fetch latest data from server
    try {
      await apiAdminGetUsers();
      await apiAdminGetOrders();
      
      renderAdminStats();
      renderAdminCustomers();
      renderAdminOrders();
    } catch (e) {
      showToast('Gagal memuat data dashboard admin');
    }

  } else {
    loginSection.classList.remove('hidden');
    dashSection.classList.add('hidden');
    
    // Kembalikan menu user
    document.querySelectorAll('.user-only').forEach(el => {
      el.style.display = ''; // Reset to CSS default
      el.classList.remove('hidden');
    });
    // Remove admin nav dynamically
    document.querySelectorAll('.admin-only').forEach(el => el.remove());

    const topbarAvatar = document.querySelector('.topbar-actions');
    if (topbarAvatar) topbarAvatar.style.display = 'flex';
  }
}

// ===== ADMIN STATS =====
function renderAdminStats() {
  const totalUsers     = db.users.length;
  const totalOrders    = db.orders.length;
  const pendingOrders  = db.orders.filter(o => o.status === 'Menunggu Konfirmasi' || o.status === 'Dalam Review').length;
  const completedOrders = db.orders.filter(o => o.status === 'Selesai').length;
  const totalRevenue   = db.orders.reduce((sum, o) => sum + (o.price || 0), 0);
  const tinjaOrders    = db.orders.filter(o => o.type === 'tinja').length;
  const sampahOrders   = db.orders.filter(o => o.type === 'sampah').length;
  const ipalOrders     = db.orders.filter(o => o.type === 'ipal').length;

  const el = document.getElementById('admin-stats-grid');
  if (!el) return;

  el.innerHTML = `
    <div class="admin-stat-card">
      <div class="admin-stat-icon users-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <div class="admin-stat-value">${totalUsers}</div>
      <div class="admin-stat-label">Total Pelanggan</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon orders-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>
      <div class="admin-stat-value">${totalOrders}</div>
      <div class="admin-stat-label">Total Pesanan</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon pending-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <div class="admin-stat-value">${pendingOrders}</div>
      <div class="admin-stat-label">Menunggu Proses</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon done-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <div class="admin-stat-value">${completedOrders}</div>
      <div class="admin-stat-label">Pesanan Selesai</div>
    </div>
    <div class="admin-stat-card wide">
      <div class="admin-stat-icon revenue-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <div class="admin-stat-value">Rp ${totalRevenue.toLocaleString('id-ID')}</div>
      <div class="admin-stat-label">Total Pendapatan (Estimasi)</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon tinja-stat-icon">🚛</div>
      <div class="admin-stat-value">${tinjaOrders}</div>
      <div class="admin-stat-label">Pesanan Tinja</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon sampah-stat-icon">🗑️</div>
      <div class="admin-stat-value">${sampahOrders}</div>
      <div class="admin-stat-label">Pesanan Sampah</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon ipal-stat-icon">🏗️</div>
      <div class="admin-stat-value">${ipalOrders}</div>
      <div class="admin-stat-label">Konsultasi IPAL</div>
    </div>
  `;
}

// ===== RENDER CUSTOMER LIST =====
function renderAdminCustomers() {
  const el = document.getElementById('admin-customers-body');
  if (!el) return;

  if (!db.users.length) {
    el.innerHTML = '<tr><td colspan="5" class="empty-row">Belum ada pelanggan terdaftar</td></tr>';
    return;
  }

  // Basic sanitization function
  const escapeHTML = (str) => str ? str.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';

  el.innerHTML = db.users.map(u => {
    const userOrders = db.orders.filter(o => o.user_id === u.id);
    const totalSpent = userOrders.reduce((sum, o) => sum + (o.price || 0), 0);
    return `
      <tr>
        <td>
          <div class="admin-user-cell">
            <div class="admin-user-avatar">${u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</div>
            <div>
              <div class="admin-user-name">${escapeHTML(u.name)}</div>
              <div class="admin-user-meta">ID: ${u.id}</div>
            </div>
          </div>
        </td>
        <td>${escapeHTML(u.alamat)}</td>
        <td>${u.umur} thn</td>
        <td>${userOrders.length} pesanan</td>
        <td><strong>Rp ${totalSpent.toLocaleString('id-ID')}</strong></td>
      </tr>
    `;
  }).join('');
}

// ===== RENDER ALL ORDERS =====
function renderAdminOrders() {
  const el = document.getElementById('admin-orders-body');
  if (!el) return;

  if (!db.orders.length) {
    el.innerHTML = '<tr><td colspan="7" class="empty-row">Belum ada pesanan</td></tr>';
    return;
  }

  const getStatusClass = (status) => {
    if (status === 'Selesai') return 'status-done';
    if (status === 'Dalam Proses') return 'status-process';
    if (status === 'Dalam Review') return 'status-process';
    if (status === 'Ditolak') return 'status-rejected';
    return 'status-pending';
  };

  const getTypeIcon = (type) => {
    if (type === 'tinja')  return '🚛';
    if (type === 'sampah') return '🗑️';
    return '🏗️';
  };

  // Safe escape function for basic XSS protection in innerHTML
  const escapeHTML = (str) => str ? str.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';

  el.innerHTML = db.orders.map(o => {
    // API returns user_name thanks to JOIN
    const userName = o.user_name || 'Unknown';
    const detail = escapeHTML(o.detail);
    const date = new Date(o.created_at).toLocaleDateString('id-ID');
    
    return `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>${escapeHTML(userName)}</td>
        <td>${getTypeIcon(o.type)} ${o.type.charAt(0).toUpperCase() + o.type.slice(1)}</td>
        <td class="admin-detail-cell" title="${detail}">${detail}</td>
        <td>${date}</td>
        <td>
          <select class="admin-status-select ${getStatusClass(o.status)}" onchange="updateOrderStatus(${o.id}, this.value)">
            <option value="Menunggu Konfirmasi" ${o.status === 'Menunggu Konfirmasi' ? 'selected' : ''}>⏳ Menunggu</option>
            <option value="Dalam Proses" ${o.status === 'Dalam Proses' ? 'selected' : ''}>🔄 Dalam Proses</option>
            <option value="Dalam Review" ${o.status === 'Dalam Review' ? 'selected' : ''}>📋 Dalam Review</option>
            <option value="Selesai" ${o.status === 'Selesai' ? 'selected' : ''}>✅ Selesai</option>
            <option value="Ditolak" ${o.status === 'Ditolak' ? 'selected' : ''}>❌ Ditolak</option>
          </select>
        </td>
        <td>${o.price ? 'Rp ' + o.price.toLocaleString('id-ID') : 'Gratis'}</td>
      </tr>
    `;
  }).join('');
}

// ===== UPDATE ORDER STATUS =====
async function updateOrderStatus(orderId, newStatus) {
  try {
    await apiAdminUpdateOrderStatus(orderId, newStatus);
    showToast(`✅ Status pesanan #${orderId} diperbarui: ${newStatus}`);
    
    // Refresh admin dashboard silently
    await apiAdminGetOrders();
    renderAdminStats();
    renderAdminOrders();
  } catch (error) {
    showToast(`⚠️ Gagal memperbarui status: ${error.message}`);
  }
}

// ===== ADMIN SEARCH =====
function adminSearchCustomers() {
  const query = document.getElementById('admin-search-input')?.value?.toLowerCase()?.trim();
  const el = document.getElementById('admin-customers-body');
  if (!el) return;

  const filtered = query
    ? db.users.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.alamat.toLowerCase().includes(query) ||
        u.id.toString() === query
      )
    : db.users;

  if (!filtered.length) {
    el.innerHTML = `<tr><td colspan="5" class="empty-row">Tidak ada pelanggan ditemukan untuk "${query}"</td></tr>`;
    return;
  }
  
  const escapeHTML = (str) => str ? str.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';

  el.innerHTML = filtered.map(u => {
    const userOrders = db.orders.filter(o => o.user_id === u.id);
    const totalSpent = userOrders.reduce((sum, o) => sum + (o.price || 0), 0);
    return `
      <tr>
        <td>
          <div class="admin-user-cell">
            <div class="admin-user-avatar">${u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</div>
            <div>
              <div class="admin-user-name">${escapeHTML(u.name)}</div>
              <div class="admin-user-meta">ID: ${u.id}</div>
            </div>
          </div>
        </td>
        <td>${escapeHTML(u.alamat)}</td>
        <td>${u.umur} thn</td>
        <td>${userOrders.length} pesanan</td>
        <td><strong>Rp ${totalSpent.toLocaleString('id-ID')}</strong></td>
      </tr>
    `;
  }).join('');
}

// ===== ADMIN SEARCH ORDERS =====
function adminSearchOrders() {
  const query = document.getElementById('admin-order-search-input')?.value?.toLowerCase()?.trim();
  const el = document.getElementById('admin-orders-body');
  if (!el) return;

  const getStatusClass = (status) => {
    if (status === 'Selesai') return 'status-done';
    if (status === 'Dalam Proses') return 'status-process';
    if (status === 'Dalam Review') return 'status-process';
    if (status === 'Ditolak') return 'status-rejected';
    return 'status-pending';
  };

  const getTypeIcon = (type) => {
    if (type === 'tinja')  return '🚛';
    if (type === 'sampah') return '🗑️';
    return '🏗️';
  };

  let filtered = [...db.orders];

  if (query) {
    filtered = filtered.filter(o => {
      const userName = o.user_name ? o.user_name.toLowerCase() : '';
      return (
        o.id.toString() === query ||
        o.type.toLowerCase().includes(query) ||
        (o.detail && o.detail.toLowerCase().includes(query)) ||
        o.status.toLowerCase().includes(query) ||
        userName.includes(query)
      );
    });
  }

  if (!filtered.length) {
    el.innerHTML = `<tr><td colspan="7" class="empty-row">Tidak ada pesanan ditemukan untuk "${query}"</td></tr>`;
    return;
  }
  
  const escapeHTML = (str) => str ? str.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';

  el.innerHTML = filtered.map(o => {
    const userName = o.user_name || 'Unknown';
    const detail = escapeHTML(o.detail);
    const date = new Date(o.created_at).toLocaleDateString('id-ID');
    
    return `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>${escapeHTML(userName)}</td>
        <td>${getTypeIcon(o.type)} ${o.type.charAt(0).toUpperCase() + o.type.slice(1)}</td>
        <td class="admin-detail-cell" title="${detail}">${detail}</td>
        <td>${date}</td>
        <td>
          <select class="admin-status-select ${getStatusClass(o.status)}" onchange="updateOrderStatus(${o.id}, this.value)">
            <option value="Menunggu Konfirmasi" ${o.status === 'Menunggu Konfirmasi' ? 'selected' : ''}>⏳ Menunggu</option>
            <option value="Dalam Proses" ${o.status === 'Dalam Proses' ? 'selected' : ''}>🔄 Dalam Proses</option>
            <option value="Dalam Review" ${o.status === 'Dalam Review' ? 'selected' : ''}>📋 Dalam Review</option>
            <option value="Selesai" ${o.status === 'Selesai' ? 'selected' : ''}>✅ Selesai</option>
            <option value="Ditolak" ${o.status === 'Ditolak' ? 'selected' : ''}>❌ Ditolak</option>
          </select>
        </td>
        <td>${o.price ? 'Rp ' + o.price.toLocaleString('id-ID') : 'Gratis'}</td>
      </tr>
    `;
  }).join('');
}

// ===== ADMIN TAB SWITCHING =====
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

  const btn = document.querySelector(`.admin-tab-btn[data-tab="${tab}"]`);
  const content = document.getElementById('admin-tab-' + tab);

  if (btn) btn.classList.add('active');
  if (content) content.classList.add('active');
}
