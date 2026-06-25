/* =====================================================
   BANTU BUANG — Halaman Panel Admin (Admin Page HTML)
   ===================================================== */

PAGE_TEMPLATES.admin = `
  <!-- Admin Login -->
  <div id="admin-login-section">
    <div class="page-header">
      <h1>🛡️ Panel Admin</h1>
      <p>Masuk dengan akun admin untuk memantau seluruh operasi</p>
    </div>
    <div class="card form-card narrow-card admin-login-card">
      <div class="admin-lock-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <div class="card-title" style="text-align:center">Login Administrator</div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="admin-email" placeholder="admin@admin.com" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="admin-password" placeholder="••••••••" onkeydown="if(event.key==='Enter')doAdminLogin()" />
      </div>
      <button class="btn-primary w-full" onclick="doAdminLogin()">🔓 Masuk Admin</button>
    </div>
  </div>

  <!-- Admin Dashboard (hidden until login) -->
  <div id="admin-dashboard-section" class="hidden">
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
      <div>
        <h1>📊 Dashboard Admin</h1>
        <p>Pantau pelanggan, pesanan, dan performa layanan</p>
      </div>
      <button class="btn-ghost" onclick="doAdminLogout()" style="flex-shrink:0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:4px">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Keluar Admin
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="admin-stats-grid" id="admin-stats-grid"></div>

    <!-- Tab Navigation -->
    <div class="admin-tabs">
      <button class="admin-tab-btn active" data-tab="customers" onclick="switchAdminTab('customers')">👥 Pelanggan</button>
      <button class="admin-tab-btn" data-tab="orders" onclick="switchAdminTab('orders')">📋 Semua Pesanan</button>
    </div>

    <!-- Tab: Customers -->
    <div class="admin-tab-content active" id="admin-tab-customers">
      <div class="card">
        <div class="admin-table-header">
          <div class="card-title" style="margin-bottom:0">👥 Data Pelanggan</div>
          <div class="admin-search-box">
            <input type="text" id="admin-search-input" placeholder="Cari nama / alamat / ID..." oninput="adminSearchCustomers()" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
        <div class="admin-table-wrap">
          <table class="orders-table admin-table">
            <thead>
              <tr>
                <th>Pelanggan</th>
                <th>Alamat</th>
                <th>Umur</th>
                <th>Pesanan</th>
                <th>Total Belanja</th>
              </tr>
            </thead>
            <tbody id="admin-customers-body">
              <tr><td colspan="5" class="empty-row">Memuat data...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab: Orders -->
    <div class="admin-tab-content" id="admin-tab-orders">
      <div class="card">
        <div class="admin-table-header">
          <div class="card-title" style="margin-bottom:0">📋 Semua Pesanan</div>
          <div class="admin-search-box">
            <input type="text" id="admin-order-search-input" placeholder="Cari pesanan..." oninput="adminSearchOrders()" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
        <div class="admin-table-wrap">
          <table class="orders-table admin-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Detail</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Biaya</th>
              </tr>
            </thead>
            <tbody id="admin-orders-body">
              <tr><td colspan="7" class="empty-row">Memuat data...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
`;
