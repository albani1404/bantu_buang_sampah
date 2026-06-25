/* =====================================================
   BANTU BUANG — Navigation Module (Dynamic Page Loader)
   Pages are loaded from PAGE_TEMPLATES registry.
   Each page template is defined in js/pages/*.js
   ===================================================== */

// Global page template registry — filled by js/pages/*.js files
const PAGE_TEMPLATES = {};

const pageTitles = {
  home:   'Beranda',
  tinja:  'Buang Lumpur Tinja',
  sampah: 'Buang Sampah',
  ipal:   'Jasa IPAL',
  rute:   'Rute & Armada',
  akun:   'Masuk / Akun',
  admin:  'Panel Admin',
};

// Track the currently active page
let currentPageId = null;

function showPage(id) {
  const main = document.getElementById('main');
  if (!main) return;

  // Get the page container — create it if it doesn't exist yet
  let pageEl = document.getElementById('page-' + id);

  if (!pageEl && PAGE_TEMPLATES[id]) {
    // First visit: inject the page HTML from the template
    pageEl = document.createElement('div');
    pageEl.className = 'page';
    pageEl.id = 'page-' + id;
    pageEl.innerHTML = PAGE_TEMPLATES[id];
    main.appendChild(pageEl);
  }

  if (!pageEl) return; // Page template not found

  // Switch active page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  pageEl.classList.add('active');
  currentPageId = id;

  const navEl = document.querySelector(`[data-page="${id}"]`);
  if (navEl) navEl.classList.add('active');

  // Update topbar title
  const topbarTitle = document.getElementById('topbarTitle');
  if (topbarTitle) topbarTitle.textContent = pageTitles[id] || id;

  // Render page-specific data
  if (id === 'home')  renderRecentOrders();
  if (id === 'akun')  renderAkun();
  if (id === 'admin') renderAdminDashboard();

  // Close sidebar on mobile
  closeSidebar();

  // Set minimum date for date inputs to today
  const today = new Date().toISOString().split('T')[0];
  pageEl.querySelectorAll('input[type="date"]').forEach(d => {
    d.min = today;
    if (!d.value) d.value = today;
  });

  // Re-bind Enter key for auth forms if on akun page
  if (id === 'akun') {
    document.getElementById('login-umur')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doLogin();
    });
    document.getElementById('daftar-umur')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doRegister();
    });
  }

  // Init tinja price if visiting tinja page
  if (id === 'tinja') {
    updateTinjaPrice();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== SIDEBAR =====
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('hidden');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.add('hidden');
}
