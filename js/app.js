/* =====================================================
   BANTU BUANG — Main Application Entry Point
   Loads after all modules and page templates.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Bind navigation events dynamically
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const page = e.currentTarget.getAttribute('data-page');
      if (page) showPage(page);
    });
  });

  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', toggleSidebar);
  }

  const btnUserAvatar = document.getElementById('btn-user-avatar');
  if (btnUserAvatar) {
    btnUserAvatar.addEventListener('click', () => showPage('akun'));
  }

  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Show home page (this will inject the template into DOM)
  showPage('home');

  // Update topbar avatar if user is logged in
  updateTopbarAvatar();
});
