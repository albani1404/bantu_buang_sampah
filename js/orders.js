/* =====================================================
   BANTU BUANG — Orders Module
   Menangani pemesanan (Tinja, Sampah, IPAL) ke Backend
   ===================================================== */

async function submitOrder(type) {
  if (!currentUser) {
    showToast('⚠️ Anda harus login terlebih dahulu!');
    showPage('akun');
    return;
  }

  let detail = '';
  let price = 0;
  let tanggal = '';

  if (type === 'tinja') {
    const nama = document.getElementById('tinja-nama')?.value;
    const alamat = document.getElementById('tinja-alamat')?.value;
    tanggal = document.getElementById('tinja-tanggal')?.value;
    if (!nama || !alamat || !tanggal) {
      showToast('⚠️ Lengkapi form pesanan!');
      return;
    }
    
    // Parse price from string to int
    const priceText = document.getElementById('tinja-price-val').innerText;
    price = parseInt(priceText.replace(/[^0-9]/g, ''));

    const isLangganan = document.getElementById('opt-langganan').classList.contains('selected');
    const freq = document.getElementById('tinja-frekuensi').value;
    const vol = document.getElementById('tinja-volume').options[document.getElementById('tinja-volume').selectedIndex].text;
    const jenis = document.getElementById('tinja-jenis').options[document.getElementById('tinja-jenis').selectedIndex].text;

    detail = `Tinja - ${jenis} | Vol: ${vol} | ${isLangganan ? 'Langganan ' + freq + 'x/bln' : 'On-Call'} | P. ${nama} (${alamat})`;
  }

  else if (type === 'sampah') {
    const nama = document.getElementById('sampah-nama')?.value;
    const alamat = document.getElementById('sampah-alamat')?.value;
    tanggal = document.getElementById('sampah-mulai')?.value;
    if (!nama || !alamat || !tanggal) {
      showToast('⚠️ Lengkapi form pendaftaran sampah!');
      return;
    }

    const freqEl = document.querySelector('.freq-btn.selected');
    const freq = freqEl ? freqEl.innerText : '2x seminggu';
    const vol = document.getElementById('sampah-volume').options[document.getElementById('sampah-volume').selectedIndex].text;
    const kat = document.getElementById('sampah-kategori').options[document.getElementById('sampah-kategori').selectedIndex].text;

    // Hardcode price for prototype
    if (kat.includes('Rumah')) price = 50000;
    else if (kat.includes('Komersial')) price = 200000;
    else if (kat.includes('Restoran')) price = 400000;
    else if (kat.includes('Hotel')) price = 800000;
    else price = 0; // Nego

    detail = `Sampah - ${kat} | Frekuensi: ${freq} | Est. Vol: ${vol} | P. ${nama} (${alamat})`;
  }

  else if (type === 'ipal') {
    const nama = document.getElementById('ipal-nama')?.value;
    const lokasi = document.getElementById('ipal-lokasi')?.value;
    const desc = document.getElementById('ipal-deskripsi')?.value;
    const kap = document.getElementById('ipal-kapasitas')?.value;
    tanggal = new Date().toISOString().split('T')[0]; // Default to today for consultation request

    if (!nama || !lokasi || !desc || !kap) {
      showToast('⚠️ Lengkapi form konsultasi IPAL!');
      return;
    }

    const jenis = document.getElementById('ipal-jenis').options[document.getElementById('ipal-jenis').selectedIndex].text;
    detail = `IPAL - ${jenis} | Kapasitas: ${kap} org | Lokasi: ${lokasi} | Keterangan: ${desc}`;
    price = 0; // Konsultasi gratis
  }

  const orderData = {
    user_id: currentUser.id,
    type: type,
    detail: detail,
    tanggal: tanggal,
    price: price
  };

  try {
    showToast('⏳ Sedang memproses pesanan...');
    await apiCreateOrder(orderData);
    
    showToast('🎉 Pesanan berhasil dikirim! Tim kami akan segera menghubungi Anda.');
    
    // Clear forms
    document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => el.value = '');
    
    // Refresh user's orders implicitly by rendering history when they visit accounts
    setTimeout(() => {
      showPage('akun');
    }, 1500);

  } catch (error) {
    // error handled in apiCall
  }
}

// Function that was required in home page (not implemented thoroughly before)
async function renderRecentOrders() {
  const tbody = document.getElementById('recentOrdersBody');
  if (!tbody) return;

  if (!currentUser) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-row">Anda belum login. Silakan <a onclick="showPage('akun')" style="cursor:pointer;color:var(--primary);text-decoration:underline">login</a> untuk melihat pesanan.</td></tr>`;
    return;
  }

  tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Memuat data...</td></tr>';

  try {
    const myOrders = await apiGetUserOrders(currentUser.id);
    
    if (!myOrders.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Belum ada pesanan. Mulai pesan sekarang!</td></tr>';
      return;
    }

    const getStatusClass = (status) => {
      if (status === 'Selesai') return 'status-done';
      if (status === 'Dalam Proses' || status === 'Dalam Review') return 'status-process';
      return 'status-pending';
    };

    // Show top 5 recent orders
    tbody.innerHTML = myOrders.slice(0, 5).map(o => `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="service-icon ${o.type}-icon" style="width:24px;height:24px;padding:4px">
              ${o.type === 'tinja' ? '🚛' : o.type === 'sampah' ? '🗑️' : '🏗️'}
            </div>
            <span style="text-transform:capitalize">${o.type}</span>
          </div>
        </td>
        <td>${new Date(o.created_at).toLocaleDateString('id-ID')}</td>
        <td><span class="status-pill ${getStatusClass(o.status)}">${o.status}</span></td>
        <td>${o.price ? 'Rp ' + o.price.toLocaleString('id-ID') : 'Gratis'}</td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row" style="color:red">Gagal memuat pesanan.</td></tr>';
  }
}
