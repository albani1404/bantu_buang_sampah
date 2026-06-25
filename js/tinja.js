/* =====================================================
   BANTU BUANG — Buang Tinja (Sewage) Feature Module
   ===================================================== */

let currentLayanan = 'oncall';

const TINJA_BASE_PRICES = {
  rumah:     250000,
  hotel:     450000,
  sekolah:   350000,
  komersial: 400000,
};

function selectLayanan(type) {
  currentLayanan = type;
  document.querySelectorAll('#page-tinja .radio-option').forEach(el => {
    el.classList.remove('selected');
    const check = el.querySelector('.radio-check');
    if (check) check.textContent = '';
  });

  const el = document.getElementById('opt-' + type);
  if (el) {
    el.classList.add('selected');
    const check = el.querySelector('.radio-check');
    if (check) check.textContent = '✓';
  }

  const frekuensiGroup = document.getElementById('frekuensi-group');
  if (frekuensiGroup) {
    frekuensiGroup.style.display = type === 'langganan' ? 'block' : 'none';
  }

  updateTinjaPrice();
}

function updateTinjaPrice() {
  const jenisEl = document.getElementById('tinja-jenis');
  const volEl   = document.getElementById('tinja-volume');
  if (!jenisEl || !volEl) return;

  const jenis = jenisEl.value || 'rumah';
  const vol   = parseInt(volEl.value) || 1;
  let price   = (TINJA_BASE_PRICES[jenis] || 250000) * vol;

  if (currentLayanan === 'langganan') {
    price = Math.round(price * 0.82); // 18% discount for subscription
  }

  const priceEl = document.getElementById('tinja-price-val');
  if (priceEl) priceEl.textContent = 'Rp ' + price.toLocaleString('id-ID');
}

function submitTinja() {
  const nama   = document.getElementById('tinja-nama')?.value?.trim();
  const alamat = document.getElementById('tinja-alamat')?.value?.trim();
  const tgl    = document.getElementById('tinja-tanggal')?.value;

  if (!nama || !alamat || !tgl) {
    showToast('⚠️ Mohon lengkapi semua field!');
    return null;
  }

  const jenis = document.getElementById('tinja-jenis').value;
  const vol   = parseInt(document.getElementById('tinja-volume').value);
  let price   = (TINJA_BASE_PRICES[jenis] || 250000) * vol;

  if (currentLayanan === 'langganan') {
    price = Math.round(price * 0.82);
  }

  const detail = `Sedot Tinja — ${jenis} | ${currentLayanan === 'langganan' ? 'Berlangganan' : 'On-Call'} | ${vol}m³ | ${tgl}`;

  return { type: 'tinja', detail, price };
}
