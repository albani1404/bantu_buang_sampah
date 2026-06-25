/* =====================================================
   BANTU BUANG — Halaman Akun Saya (Account Page HTML)
   ===================================================== */

PAGE_TEMPLATES.akun = `
  <div class="page-header">
    <h1>Akun Saya</h1>
    <p>Kelola profil, riwayat layanan, dan sertifikat buang Anda</p>
  </div>

  <!-- Role Selector -->
  <div id="role-selector" style="display:flex; gap:1rem; justify-content:center; max-width:600px; margin:0 auto 2rem;">
    <div class="card role-card" onclick="selectRole('user')" style="flex:1; text-align:center; cursor:pointer; transition:transform 0.2s;">
      <div style="font-size:2.5rem; margin-bottom:0.5rem">👤</div>
      <h3 style="margin:0 0 0.5rem 0">Pelanggan</h3>
      <p style="font-size:0.85rem; color:var(--gray-500); margin:0">Pesan layanan sanitasi</p>
    </div>
    <div class="card role-card" onclick="selectRole('admin')" style="flex:1; text-align:center; cursor:pointer; transition:transform 0.2s;">
      <div style="font-size:2.5rem; margin-bottom:0.5rem">🛡️</div>
      <h3 style="margin:0 0 0.5rem 0">Administrator</h3>
      <p style="font-size:0.85rem; color:var(--gray-500); margin:0">Masuk panel kontrol</p>
    </div>
  </div>

  <div id="auth-forms-container" class="hidden">
    <!-- Tombol Kembali ke Pilih Peran -->
    <button class="btn-ghost" onclick="resetRoleSelection()" style="margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
      Kembali
    </button>

    <!-- Daftar / Login Toggle (Hanya untuk User) -->
    <div class="auth-tabs" id="user-auth-tabs">
      <button class="auth-tab active" id="tab-login" onclick="switchAuth('login')">Masuk</button>
      <button class="auth-tab" id="tab-daftar" onclick="switchAuth('daftar')">Daftar Akun</button>
    </div>

    <!-- Login Form (User) -->
    <div class="auth-form" id="form-login">
      <div class="card form-card narrow-card">
        <div class="card-title">🔐 Masuk Pelanggan</div>
        <div class="form-group">
          <label>Nama</label>
          <input type="text" id="login-nama" placeholder="Nama Anda..." />
        </div>
        <div class="form-group">
          <label>Alamat</label>
          <input type="text" id="login-alamat" placeholder="Alamat Anda..." />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="login-password" placeholder="••••••••" onkeydown="if(event.key==='Enter')doLogin()" />
        </div>
        <button class="btn-primary w-full" onclick="doLogin()">Masuk →</button>
      </div>
    </div>

    <!-- Daftar Form (User) -->
    <div class="auth-form hidden" id="form-daftar">
      <div class="card form-card narrow-card">
        <div class="card-title">📝 Buat Akun Pelanggan</div>
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input type="text" id="daftar-nama" placeholder="Nama lengkap..." />
        </div>
        <div class="form-group">
          <label>Alamat</label>
          <textarea id="daftar-alamat" rows="2" placeholder="Alamat lengkap..."></textarea>
        </div>
        <div class="form-group">
          <label>Umur</label>
          <input type="number" id="daftar-umur" placeholder="Umur..." />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="daftar-password" placeholder="••••••••" onkeydown="if(event.key==='Enter')doRegister()" />
        </div>
        <button class="btn-primary w-full" onclick="doRegister()">Daftar Sekarang →</button>
      </div>
    </div>

    <!-- Login Form (Admin) -->
    <div class="auth-form hidden" id="form-admin">
      <div class="card form-card narrow-card">
        <div class="card-title" style="text-align:center">🛡️ Login Administrator</div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="akun-admin-email" placeholder="admin@admin.com" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="akun-admin-password" placeholder="••••••••" onkeydown="if(event.key==='Enter')doAdminLoginFromAkun()" />
        </div>
        <button class="btn-primary w-full" onclick="doAdminLoginFromAkun()">🔓 Masuk Admin</button>
      </div>
    </div>
  </div>

  <!-- Profile (hidden until login) -->
  <div class="profile-section hidden" id="profile-section">
    <div class="two-col">
      <div class="card profile-card">
        <div class="profile-avatar-big" id="profile-avatar-big">--</div>
        <div class="profile-name" id="profile-name-show">-</div>
        <div class="profile-meta" id="profile-meta-show">-</div>
        <div class="profile-badges">
          <span class="badge-pill">Pelanggan Aktif</span>
          <span class="badge-pill green">Verified</span>
        </div>
        <button class="btn-ghost w-full" style="margin-top:1rem" onclick="doLogout()">Keluar</button>
      </div>

      <div>
        <div class="card">
          <div class="card-title">📜 Riwayat Layanan</div>
          <div id="order-history-list">
            <div class="empty-state">Belum ada riwayat. Mulai pesan layanan!</div>
          </div>
        </div>

        <div class="card" style="margin-top:1rem">
          <div class="card-title">📄 Sertifikat Buang IPLT</div>
          <div id="cert-list">
            <div class="empty-state">Sertifikat akan muncul setelah layanan selesai</div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
