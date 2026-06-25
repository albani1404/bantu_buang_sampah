/* =====================================================
   BANTU BUANG — Buang Sampah (Waste) Feature Module
   ===================================================== */

let selectedFreq = '2x seminggu';

const SAMPAH_PRICES = {
  'Rumah Tangga Biasa':          50000,
  'Komersial (Toko/Warung)':    200000,
  'Restoran / Kafe':            400000,
  'Hotel / Penginapan':         800000,
  'Pasar / Pusat Perbelanjaan': 1500000,
};

function selectFreq(el, val) {
  selectedFreq = val;
  document.querySelectorAll('#page-sampah .freq-btn').forEach(b => b.classList.remove('selected'));
  if (el) el.classList.add('selected');
}

function submitSampah() {
  const nama   = document.getElementById('sampah-nama')?.value?.trim();
  const alamat = document.getElementById('sampah-alamat')?.value?.trim();
  const mulai  = document.getElementById('sampah-mulai')?.value;

  if (!nama || !alamat || !mulai) {
    showToast('⚠️ Mohon lengkapi semua field!');
    return null;
  }

  const kat   = document.getElementById('sampah-kategori').value;
  const price = SAMPAH_PRICES[kat] || 150000;
  const detail = `Sampah ${kat} | ${selectedFreq} | mulai ${mulai}`;

  return { type: 'sampah', detail, price };
}
