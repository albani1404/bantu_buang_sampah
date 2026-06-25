/* =====================================================
   BANTU BUANG — App Logic
   Database: id (int), name (varchar), alamat (varchar), umur (int)
   ===================================================== */

// ===== SIMPLE LOCAL DATABASE (mirrors MySQL schema) =====
// Table: users (id, name, alamat, umur)
let db = {
  users: JSON.parse(localStorage.getItem('bb_users') || '[]'),
  orders: JSON.parse(localStorage.getItem('bb_orders') || '[]'),
  nextUserId: parseInt(localStorage.getItem('bb_nextUserId') || '1'),
  nextOrderId: parseInt(localStorage.getItem('bb_nextOrderId') || '1'),
};

let currentUser = JSON.parse(localStorage.getItem('bb_currentUser') || 'null');

function saveDB() {
  localStorage.setItem('bb_users', JSON.stringify(db.users));
  localStorage.setItem('bb_orders', JSON.stringify(db.orders));
  localStorage.setItem('bb_nextUserId', db.nextUserId);
  localStorage.setItem('bb_nextOrderId', db.nextOrderId);
}

// ===== NAVIGATION =====
const pageTitles = {
  home:   'Beranda',
  tinja:  'Buang Lumpur Tinja',
  sampah: 'Buang Sampah',
  ipal:   'Jasa IPAL',
  rute:   'Rute & Armada',
  akun:   'Akun Saya',
};

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelector(`[data-page="${id}"]`)?.classList.add('active');
  document.getElementById('topbarTitle').textContent = pageTitles[id] || id;

  if (id === 'home') renderRecentOrders();
  if (id === 'akun') renderAkun();
  closeSidebar();

  // Set minimum date for date inputs
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(d => { d.min = today; d.value = d.value || today; });
}

// ===== SIDEBAR =====
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('hidden');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.add('hidden');
}

// ===== TOAST =====
function showToast(msg, duration = 3200) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.add('hidden'), duration);
}

// ===== TINJA PAGE LOGIC =====
let currentLayanan = 'oncall';
let selectedFreq = '2x seminggu';

function selectLayanan(type) {
  currentLayanan = type;
  document.querySelectorAll('.radio-option').forEach(el => {
    el.classList.remove('selected');
    el.querySelector('.radio-check').textContent = '';
  });
  const el = document.getElementById('opt-' + type);
  el.classList.add('selected');
  el.querySelector('.radio-check').textContent = '✓';
  document.getElementById('frekuensi-group').style.display = type === 'langganan' ? 'block' : 'none';
  updateTinjaPrice();
}

function updateTinjaPrice() {
  const jenis = document.getElementById('tinja-jenis')?.value || 'rumah';
  const vol   = parseInt(document.getElementById('tinja-volume')?.value || '1');
  let base = { rumah: 250000, hotel: 450000, sekolah: 350000, komersial: 400000 }[jenis];
  base *= vol;
  if (currentLayanan === 'langganan') base = Math.round(base * 0.82);
  const el = document.getElementById('tinja-price-val');
  if (el) el.textContent = 'Rp ' + base.toLocaleString('id-ID');
}

function selectFreq(el, val) {
  selectedFreq = val;
  document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

// ===== SUBMIT ORDER =====
function submitOrder(type) {
  if (!currentUser) {
    showToast('⚠️ Silakan masuk atau daftar akun terlebih dahulu!');
    showPage('akun');
    return;
  }

  let detail = '';
  let price  = 0;

  if (type === 'tinja') {
    const nama   = document.getElementById('tinja-nama')?.value?.trim();
    const alamat = document.getElementById('tinja-alamat')?.value?.trim();
    const tgl    = document.getElementById('tinja-tanggal')?.value;
    if (!nama || !alamat || !tgl) { showToast('⚠️ Mohon lengkapi semua field!'); return; }
    const jenis  = document.getElementById('tinja-jenis').value;
    const vol    = parseInt(document.getElementById('tinja-volume').value);
    const base   = { rumah: 250000, hotel: 450000, sekolah: 350000, komersial: 400000 }[jenis];
    price = base * vol;
    if (currentLayanan === 'langganan') price = Math.round(price * 0.82);
    detail = `Sedot Tinja — ${jenis} | ${currentLayanan} | ${vol}m³ | ${tgl}`;
  }

  if (type === 'sampah') {
    const nama   = document.getElementById('sampah-nama')?.value?.trim();
    const alamat = document.getElementById('sampah-alamat')?.value?.trim();
    const mulai  = document.getElementById('sampah-mulai')?.value;
    if (!nama || !alamat || !mulai) { showToast('⚠️ Mohon lengkapi semua field!'); return; }
    const kat    = document.getElementById('sampah-kategori').value;
    price = { 'Rumah Tangga Biasa': 50000, 'Komersial (Toko/Warung)': 200000, 'Restoran / Kafe': 400000, 'Hotel / Penginapan': 800000, 'Pasar / Pusat Perbelanjaan': 1500000 }[kat] || 150000;
    detail = `Sampah ${kat} | ${selectedFreq} | mulai ${mulai}`;
  }

  if (type === 'ipal') {
    const nama = document.getElementById('ipal-nama')?.value?.trim();
    const lok  = document.getElementById('ipal-lokasi')?.value?.trim();
    if (!nama || !lok) { showToast('⚠️ Mohon lengkapi nama dan lokasi!'); return; }
    const jenis = document.getElementById('ipal-jenis').value;
    detail = `Konsultasi IPAL — ${jenis} | ${lok}`;
    price  = 0;
  }

  // INSERT INTO orders (user_id, type, detail, price, status, tanggal)
  const order = {
    id: db.nextOrderId++,
    user_id: currentUser.id,
    type,
    detail,
    price,
    status: type === 'ipal' ? 'Dalam Review' : 'Menunggu Konfirmasi',
    tanggal: new Date().toLocaleDateString('id-ID'),
  };

  db.orders.push(order);
  saveDB();

  showToast(`✅ Pesanan ${type === 'ipal' ? 'konsultasi' : 'layanan'} berhasil dikirim! Tim kami akan menghubungi Anda segera.`);

  // Reset form
  document.querySelectorAll(`#page-${type} input, #page-${type} textarea`).forEach(el => el.value = '');
}

// ===== RENDER RECENT ORDERS (Home) =====
function renderRecentOrders() {
  const tbody = document.getElementById('recentOrdersBody');
  if (!tbody) return;

  const myOrders = currentUser
    ? db.orders.filter(o => o.user_id === currentUser.id).slice(-5).reverse()
    : [];

  if (!myOrders.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Belum ada pesanan. Mulai pesan sekarang!</td></tr>';
    return;
  }

  const statusClass = { 'Selesai': 'status-done', 'Menunggu Konfirmasi': 'status-pending', 'Dalam Proses': 'status-process', 'Dalam Review': 'status-process' };
  tbody.innerHTML = myOrders.map(o => `
    <tr>
      <td>#${o.id}</td>
      <td>${o.type === 'tinja' ? '🚛 Tinja' : o.type === 'sampah' ? '🗑️ Sampah' : '🏗️ IPAL'}</td>
      <td>${o.tanggal}</td>
      <td><span class="status-pill ${statusClass[o.status] || 'status-pending'}">${o.status}</span></td>
      <td>${o.price ? 'Rp ' + o.price.toLocaleString('id-ID') : 'Gratis'}</td>
    </tr>
  `).join('');
}

// ===== AUTH: LOGIN =====
function doLogin() {
  const nama   = document.getElementById('login-nama')?.value?.trim();
  const alamat = document.getElementById('login-alamat')?.value?.trim();
  const umur   = parseInt(document.getElementById('login-umur')?.value);

  if (!nama || !alamat || !umur) { showToast('⚠️ Lengkapi semua field untuk masuk!'); return; }

  // SELECT * FROM users WHERE name = ? AND alamat = ?
  let user = db.users.find(u => u.name.toLowerCase() === nama.toLowerCase() && u.alamat.toLowerCase() === alamat.toLowerCase());

  if (!user) {
    showToast('⚠️ Akun tidak ditemukan. Silakan daftar terlebih dahulu.');
    return;
  }

  currentUser = user;
  localStorage.setItem('bb_currentUser', JSON.stringify(user));
  showToast(`✅ Selamat datang kembali, ${user.name}!`);
  renderAkun();
}

// ===== AUTH: REGISTER =====
function doRegister() {
  const nama   = document.getElementById('daftar-nama')?.value?.trim();
  const alamat = document.getElementById('daftar-alamat')?.value?.trim();
  const umur   = parseInt(document.getElementById('daftar-umur')?.value);

  if (!nama || !alamat || !umur) { showToast('⚠️ Lengkapi semua field!'); return; }
  if (umur < 17 || umur > 100)   { showToast('⚠️ Umur tidak valid (17-100 tahun)'); return; }

  // Check duplicate: SELECT * FROM users WHERE name = ? AND alamat = ?
  const exists = db.users.find(u => u.name.toLowerCase() === nama.toLowerCase() && u.alamat.toLowerCase() === alamat.toLowerCase());
  if (exists) { showToast('⚠️ Akun dengan nama dan alamat ini sudah terdaftar!'); return; }

  // INSERT INTO users (id, name, alamat, umur)
  const newUser = {
    id: db.nextUserId++,
    name: nama,
    alamat: alamat,
    umur: umur,
  };

  db.users.push(newUser);
  saveDB();

  currentUser = newUser;
  localStorage.setItem('bb_currentUser', JSON.stringify(newUser));

  showToast(`🎉 Akun berhasil dibuat! Selamat datang, ${nama}!`);
  renderAkun();
}

// ===== AUTH: LOGOUT =====
function doLogout() {
  currentUser = null;
  localStorage.removeItem('bb_currentUser');
  showToast('👋 Anda telah keluar.');
  renderAkun();
}

// ===== RENDER AKUN PAGE =====
function renderAkun() {
  const loginSection   = document.getElementById('form-login');
  const daftarSection  = document.getElementById('form-daftar');
  const profileSection = document.getElementById('profile-section');
  const authTabs       = document.querySelector('.auth-tabs');

  if (currentUser) {
    loginSection?.classList.add('hidden');
    daftarSection?.classList.add('hidden');
    authTabs?.classList.add('hidden');
    profileSection?.classList.remove('hidden');

    // Fill profile
    const initials = currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    document.getElementById('profile-avatar-big').textContent = initials;
    document.getElementById('profile-name-show').textContent  = currentUser.name;
    document.getElementById('profile-meta-show').textContent  = `${currentUser.alamat} · ${currentUser.umur} thn`;

    // Order history
    const myOrders = db.orders.filter(o => o.user_id === currentUser.id).reverse();
    const histEl   = document.getElementById('order-history-list');
    if (!myOrders.length) {
      histEl.innerHTML = '<div class="empty-state">Belum ada riwayat layanan</div>';
    } else {
      histEl.innerHTML = myOrders.map(o => `
        <div class="order-history-item">
          <div>
            <div style="font-weight:600;font-size:.85rem">${o.type === 'tinja' ? '🚛 Tinja' : o.type === 'sampah' ? '🗑️ Sampah' : '🏗️ IPAL'}</div>
            <div style="font-size:.75rem;color:var(--gray-400)">${o.tanggal} — ${o.detail}</div>
          </div>
          <span class="status-pill ${o.status === 'Selesai' ? 'status-done' : o.status === 'Dalam Review' ? 'status-process' : 'status-pending'}">${o.status}</span>
        </div>
      `).join('');
    }

    // Certificates (for completed orders)
    const doneOrders = myOrders.filter(o => o.status === 'Selesai');
    const certEl     = document.getElementById('cert-list');
    if (!doneOrders.length) {
      certEl.innerHTML = '<div class="empty-state">Sertifikat muncul setelah layanan selesai</div>';
    } else {
      certEl.innerHTML = doneOrders.map(o => `
        <div class="order-history-item">
          <div>
            <div style="font-weight:600;font-size:.85rem">📄 Sertifikat #${o.id}</div>
            <div style="font-size:.75rem;color:var(--gray-400)">Tanggal: ${o.tanggal}</div>
          </div>
          <button class="btn-ghost" style="padding:.35rem .75rem;font-size:.75rem" onclick="downloadCert(${o.id})">Unduh</button>
        </div>
      `).join('');
    }
  } else {
    loginSection?.classList.remove('hidden');
    daftarSection?.classList.add('hidden');
    authTabs?.classList.remove('hidden');
    profileSection?.classList.add('hidden');
    switchAuth('login');
  }
}

// ===== SWITCH AUTH TABS =====
function switchAuth(type) {
  document.getElementById('form-login').classList.toggle('hidden', type !== 'login');
  document.getElementById('form-daftar').classList.toggle('hidden', type !== 'daftar');
  document.getElementById('tab-login').classList.toggle('active', type === 'login');
  document.getElementById('tab-daftar').classList.toggle('active', type === 'daftar');
}

// ===== DOWNLOAD CERT (demo) =====
function downloadCert(orderId) {
  showToast('📥 Mengunduh sertifikat buang IPLT... (fitur demo)');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Set today's date for date inputs
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(d => { d.min = today; d.value = today; });

  // Init price
  updateTinjaPrice();

  // Show home
  showPage('home');

  // Update topbar avatar if logged in
  if (currentUser) {
    const initials = currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    document.querySelector('.user-avatar').textContent = initials;
  }
});
