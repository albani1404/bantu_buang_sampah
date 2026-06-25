/* =====================================================
   BANTU BUANG — Halaman Jasa IPAL (IPAL Page HTML)
   ===================================================== */

PAGE_TEMPLATES.ipal = `
  <div class="page-header">
    <h1>Jasa Konstruksi IPAL</h1>
    <p>Desain &amp; bangun Instalasi Pengolahan Air Limbah sesuai standar lingkungan nasional</p>
  </div>

  <div class="ipal-hero">
    <div class="ipal-badge-row">
      <span class="ipal-badge">🏨 Hotel</span>
      <span class="ipal-badge">🏫 Sekolah</span>
      <span class="ipal-badge">🕌 Pesantren</span>
      <span class="ipal-badge">🏭 Industri</span>
    </div>
    <p class="ipal-tagline">Pastikan limbah cair Anda terproses sebelum diangkut ke IPLT — memenuhi regulasi Permen
      LHK No. P.68/2016</p>
  </div>

  <div class="ipal-process">
    <div class="ipal-step">
      <div class="ipal-step-icon">🔍</div>
      <div class="ipal-step-title">Survei &amp; Analisis</div>
      <div class="ipal-step-desc">Tim teknis kami survei lokasi, ukur debit air limbah, dan analisis karakteristik limbah Anda secara gratis.</div>
    </div>
    <div class="ipal-step">
      <div class="ipal-step-icon">📐</div>
      <div class="ipal-step-title">Desain Engineering</div>
      <div class="ipal-step-desc">Perancangan IPAL dengan teknologi biofilter / ABR sesuai kapasitas dan kondisi lahan Anda.</div>
    </div>
    <div class="ipal-step">
      <div class="ipal-step-icon">🏗️</div>
      <div class="ipal-step-title">Konstruksi</div>
      <div class="ipal-step-desc">Pembangunan oleh tim berpengalaman dengan material berkualitas dan garansi 2 tahun.</div>
    </div>
    <div class="ipal-step">
      <div class="ipal-step-icon">📋</div>
      <div class="ipal-step-title">Sertifikasi &amp; Pemeliharaan</div>
      <div class="ipal-step-desc">Pengurusan dokumen lingkungan dan paket maintenance berkala terintegrasi layanan sedot tinja.</div>
    </div>
  </div>

  <div class="two-col" style="margin-top:2rem">
    <div class="card form-card">
      <div class="card-title">📩 Formulir Konsultasi Gratis</div>
      <div class="form-group">
        <label>Jenis Institusi</label>
        <select id="ipal-jenis">
          <option>Hotel / Penginapan</option>
          <option>Sekolah / Madrasah</option>
          <option>Pesantren</option>
          <option>Rumah Sakit / Klinik</option>
          <option>Industri / Pabrik</option>
          <option>Perumahan</option>
        </select>
      </div>
      <div class="form-group">
        <label>Nama Institusi / Kontak</label>
        <input type="text" id="ipal-nama" placeholder="Nama institusi..." />
      </div>
      <div class="form-group">
        <label>Lokasi</label>
        <input type="text" id="ipal-lokasi" placeholder="Desa / Kecamatan..." />
      </div>
      <div class="form-group">
        <label>Kapasitas Pengguna (orang)</label>
        <input type="number" id="ipal-kapasitas" placeholder="Contoh: 200" />
      </div>
      <div class="form-group">
        <label>Deskripsikan Kebutuhan</label>
        <textarea id="ipal-deskripsi" rows="3" placeholder="Ceritakan kondisi instalasi saat ini..."></textarea>
      </div>
      <button class="btn-primary w-full" onclick="submitOrder('ipal')">📞 Minta Konsultasi</button>
    </div>

    <div class="info-panel">
      <div class="card info-card highlight-card">
        <div class="card-title">📊 Estimasi Biaya IPAL</div>
        <table class="tarif-table">
          <tr><th>Skala</th><th>Kapasitas</th><th>Estimasi</th></tr>
          <tr><td>Kecil</td><td>≤ 50 org</td><td>Rp 50–100 jt</td></tr>
          <tr><td>Menengah</td><td>50–200 org</td><td>Rp 100–250 jt</td></tr>
          <tr><td>Besar</td><td>> 200 org</td><td>Rp 250–600 jt</td></tr>
        </table>
        <p class="note-text">*Harga bervariasi sesuai kondisi lapangan, teknologi yang dipilih, dan material lokal.</p>
      </div>
      <div class="card info-card">
        <div class="card-title">🏆 Mengapa Penting?</div>
        <ul class="commitment-list">
          <li>✅ Wajib untuk perizinan hotel bintang</li>
          <li>✅ Syarat akreditasi sekolah/pesantren</li>
          <li>✅ Hindari sanksi Dinas LHK</li>
          <li>✅ Efluent bersih siap ke drainase</li>
          <li>✅ Bundled dengan layanan sedot tinja berkala</li>
        </ul>
      </div>
    </div>
  </div>
`;
