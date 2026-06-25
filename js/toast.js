/* =====================================================
   BANTU BUANG — Toast Notification Module
   ===================================================== */

function showToast(msg, duration = 3200) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    t.classList.remove('show');
    t.classList.add('hidden');
  }, duration);
}
