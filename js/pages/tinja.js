/* =====================================================
   BANTU BUANG — Halaman Buang Tinja (Tinja Page HTML)
   ===================================================== */

PAGE_TEMPLATES.tinja = `
  <div class="page-header">
    <h1>Buang Lumpur Tinja</h1>
    <p>Sedot &amp; kuras tangki septik oleh armada resmi bersertifikat IPLT</p>
  </div>

  <div class="two-col">
    <!-- Booking Form -->
    <div class="card form-card">
      <div class="card-title">📋 Buat Pesanan Baru</div>
      <div class="form-group">
        <label>Jenis Pelanggan</label>
        <select id="tinja-jenis" onchange="updateTinjaPrice()">
          <option value="rumah">Rumah Tangga</option>
          <option value="hotel">Hotel / Penginapan</option>
          <option value="sekolah">Sekolah / Pesantren</option>
          <option value="komersial">Komersial Lainnya</option>
        </select>
      </div>
      <div class="form-group">
        <label>Nama Lengkap</label>
        <input type="text" id="tinja-nama" placeholder="Nama pemesan..." />
      </div>
      <div class="form-group">
        <label>Alamat Lengkap</label>
        <textarea id="tinja-alamat" rows="3" placeholder="Alamat lokasi tangki septik..."></textarea>
      </div>
      <div class="form-group">
        <label>Jenis Layanan</label>
        <div class="radio-group">
          <label class="radio-option selected" id="opt-oncall" onclick="selectLayanan('oncall')">
            <div class="radio-check">✓</div>
            <div>
              <div class="radio-title">On-Call (Sekali Sedot)</div>
              <div class="radio-desc">Layanan satu kali, bayar per kunjungan</div>
            </div>
          </label>
          <label class="radio-option" id="opt-langganan" onclick="selectLayanan('langganan')">
            <div class="radio-check"></div>
            <div>
              <div class="radio-title">Berlangganan Bulanan</div>
              <div class="radio-desc">Terjadwal otomatis, diskon s/d 20%</div>
            </div>
          </label>
        </div>
      </div>
      <div class="form-group" id="frekuensi-group" style="display:none">
        <label>Frekuensi Penyedotan</label>
        <select id="tinja-frekuensi">
          <option value="1">1x per bulan</option>
          <option value="2">2x per bulan</option>
          <option value="4">4x per bulan (mingguan)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Estimasi Volume Tangki</label>
        <select id="tinja-volume" onchange="updateTinjaPrice()">
          <option value="1">≤ 1 m³</option>
          <option value="2">1 – 2 m³</option>
          <option value="3">2 – 4 m³</option>
          <option value="4">≥ 4 m³ (2 ritase)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Tanggal Kunjungan</label>
        <input type="date" id="tinja-tanggal" />
      </div>
      <div class="price-preview" id="tinja-price-preview">
        <div class="price-label">Estimasi Biaya</div>
        <div class="price-value" id="tinja-price-val">Rp 250.000</div>
        <div class="price-note">*Harga final berdasarkan survei lapangan</div>
      </div>
      <button class="btn-primary w-full" onclick="submitOrder('tinja')">🚛 Pesan Sekarang</button>
    </div>

    <!-- Info Panel -->
    <div class="info-panel">
      <div class="card info-card">
        <div class="card-title">⚡ Cara Kerja</div>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div><strong>Pesan</strong><br />Isi form &amp; pilih jadwal</div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div><strong>Konfirmasi</strong><br />Tim kami hubungi dalam 1 jam</div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div><strong>Kunjungan</strong><br />Armada 4m³ tiba tepat waktu</div>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <div><strong>Sertifikat</strong><br />Terima bukti buang IPLT legal</div>
          </div>
        </div>
      </div>
      <div class="card info-card highlight-card">
        <div class="card-title">📦 Paket Berlangganan</div>
        <div class="package-list">
          <div class="package-item">
            <div class="pkg-name">Paket Rumah</div>
            <div class="pkg-price">Rp 200.000/bln</div>
            <div class="pkg-note">1x sedot/bulan</div>
          </div>
          <div class="package-item">
            <div class="pkg-name">Paket Bisnis</div>
            <div class="pkg-price">Rp 800.000/bln</div>
            <div class="pkg-note">4x sedot/bulan</div>
          </div>
          <div class="package-item">
            <div class="pkg-name">Paket Institusi</div>
            <div class="pkg-price">Rp 1.500.000/bln</div>
            <div class="pkg-note">8x sedot/bulan + laporan</div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
