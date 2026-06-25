/* =====================================================
   BANTU BUANG — Jasa IPAL Feature Module
   ===================================================== */

function submitIpal() {
  const nama = document.getElementById('ipal-nama')?.value?.trim();
  const lok  = document.getElementById('ipal-lokasi')?.value?.trim();

  if (!nama || !lok) {
    showToast('⚠️ Mohon lengkapi nama dan lokasi!');
    return null;
  }

  const jenis     = document.getElementById('ipal-jenis').value;
  const kapasitas = document.getElementById('ipal-kapasitas')?.value || '-';
  const detail    = `Konsultasi IPAL — ${jenis} | ${lok} | ${kapasitas} org`;

  return { type: 'ipal', detail, price: 0 };
}
