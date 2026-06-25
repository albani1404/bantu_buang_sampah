/* =====================================================
   BANTU BUANG — Halaman Buang Sampah (Sampah Page HTML)
   ===================================================== */

PAGE_TEMPLATES.sampah = `
  <div class="page-header">
    <h1>Buang Sampah</h1>
    <p>Pengambilan sampah domestik &amp; komersial — terjadwal, andal, ramah lingkungan</p>
  </div>
  <div class="two-col">
    <div class="card form-card">
      <div class="card-title">📋 Jadwalkan Pengambilan</div>
      <div class="form-group">
        <label>Kategori Sampah</label>
        <select id="sampah-kategori">
          <option>Rumah Tangga Biasa</option>
          <option>Komersial (Toko/Warung)</option>
          <option>Restoran / Kafe</option>
          <option>Hotel / Penginapan</option>
          <option>Pasar / Pusat Perbelanjaan</option>
        </select>
      </div>
      <div class="form-group">
        <label>Nama / Instansi</label>
        <input type="text" id="sampah-nama" placeholder="Nama atau nama usaha..." />
      </div>
      <div class="form-group">
        <label>Alamat</label>
        <textarea id="sampah-alamat" rows="3" placeholder="Alamat pengambilan..."></textarea>
      </div>
      <div class="form-group">
        <label>Frekuensi Pengambilan</label>
        <div class="freq-grid">
          <div class="freq-btn selected" onclick="selectFreq(this,'2x seminggu')">2x/minggu</div>
          <div class="freq-btn" onclick="selectFreq(this,'3x seminggu')">3x/minggu</div>
          <div class="freq-btn" onclick="selectFreq(this,'harian')">Harian</div>
          <div class="freq-btn" onclick="selectFreq(this,'custom')">Custom</div>
        </div>
      </div>
      <div class="form-group">
        <label>Volume Estimasi / Pengambilan</label>
        <select id="sampah-volume">
          <option>≤ 50 Liter</option>
          <option>50 – 200 Liter</option>
          <option>200 – 500 Liter</option>
          <option>> 500 Liter (kontainer)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Mulai Berlangganan</label>
        <input type="date" id="sampah-mulai" />
      </div>
      <button class="btn-primary w-full" onclick="submitOrder('sampah')">🗑️ Daftar Layanan</button>
    </div>

    <div class="info-panel">
      <div class="card info-card">
        <div class="card-title">🌱 Komitmen Kami</div>
        <ul class="commitment-list">
          <li>✅ Armada tertutup, bebas bau</li>
          <li>✅ Pemilahan organik &amp; anorganik</li>
          <li>✅ Laporan bulanan untuk instansi</li>
          <li>✅ Terintegrasi dengan OPD Lingkungan Hidup</li>
          <li>✅ Coverage radius 5 km dari IPLT</li>
        </ul>
      </div>
      <div class="card info-card">
        <div class="card-title">💰 Tarif Sampah</div>
        <table class="tarif-table">
          <tr><th>Kategori</th><th>Tarif</th></tr>
          <tr><td>Rumah Tangga</td><td>Rp 50.000/bln</td></tr>
          <tr><td>Komersial Kecil</td><td>Rp 200.000/bln</td></tr>
          <tr><td>Restoran</td><td>Rp 400.000/bln</td></tr>
          <tr><td>Hotel</td><td>Rp 800.000/bln</td></tr>
          <tr><td>Pasar</td><td>Nego</td></tr>
        </table>
      </div>
    </div>
  </div>
`;
