/* =====================================================
   BANTU BUANG — Halaman Beranda (Home Page HTML)
   ===================================================== */

PAGE_TEMPLATES.home = `
  <div class="hero-section">
    <div class="hero-wave">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
          fill="rgba(77,217,172,0.15)" />
        <path d="M0,80 C240,40 480,100 720,80 C960,60 1200,100 1440,80 L1440,120 L0,120 Z"
          fill="rgba(13,124,124,0.1)" />
      </svg>
    </div>
    <div class="hero-content">
      <div class="hero-badge">🌿 Sanitasi Terpadu Kabupaten Lombok Barat</div>
      <h1 class="hero-title">Solusi Bersih<br /><span class="accent">Untuk Semua</span></h1>
      <p class="hero-desc">Dari sedot tinja, angkut sampah, hingga konstruksi IPAL — kami hadir untuk menjaga
        lingkungan Anda tetap sehat dan terstandar.</p>
      <div class="hero-cta">
        <button class="btn-primary" onclick="showPage('tinja')">Pesan Sekarang</button>
        <button class="btn-ghost" onclick="showPage('ipal')">Konsultasi IPAL</button>
      </div>
    </div>
  </div>

  <!-- ===== QUOTE SECTION ===== -->
  <section class="quote-section">
    <div class="quote-container">
      <div class="quote-image-wrapper">
        <div class="quote-image-backdrop"></div>
        <img src="assets/leader.png" alt="Tokoh Kebersihan" class="quote-image" />
      </div>
      <div class="quote-content">
        <div class="quote-mark">“</div>
        <blockquote class="quote-text">
          Bumi ini bukan warisan nenek moyang, melainkan titipan anak cucu. Jaga kebersihannya.
        </blockquote>
        <div class="quote-author">
          <div class="quote-author-name">Irmawan</div>
          <div class="quote-author-role">Ketua Bantu Buang</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Bar -->
  <div class="stats-bar">
    <div class="stat-item">
      <div class="stat-num">4 m³</div>
      <div class="stat-lbl">Kapasitas per Ritase</div>
    </div>
    <div class="stat-div"></div>
    <div class="stat-item">
      <div class="stat-num">4x</div>
      <div class="stat-lbl">Ritase per Hari</div>
    </div>
    <div class="stat-div"></div>
    <div class="stat-item">
      <div class="stat-num">5 KM</div>
      <div class="stat-lbl">Radius Layanan</div>
    </div>
    <div class="stat-div"></div>
    <div class="stat-item">
      <div class="stat-num">IPLT</div>
      <div class="stat-lbl">Terakreditasi</div>
    </div>
  </div>

  <!-- Service Cards -->
  <div class="section-header">
    <h2>Pilih Layanan Anda</h2>
    <p>Semua dalam satu platform terintegrasi</p>
  </div>
  <div class="service-grid">
    <div class="service-card featured" onclick="showPage('tinja')">
      <div class="service-badge">Unggulan</div>
      <div class="service-icon tinja-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      </div>
      <h3>Buang Tinja</h3>
      <p>Sedot &amp; kuras tangki septik oleh armada 4m³ bersertifikat. Sekali sedot atau berlangganan bulanan.</p>
      <div class="service-price">Mulai <strong>Rp 250.000</strong></div>
      <div class="service-arrow">→</div>
    </div>

    <div class="service-card" onclick="showPage('sampah')">
      <div class="service-icon sampah-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </div>
      <h3>Buang Sampah</h3>
      <p>Pengambilan sampah domestik &amp; komersial rutin. Jadwal fleksibel, coverage seluruh Lombok Barat.</p>
      <div class="service-price">Mulai <strong>Rp 150.000</strong>/bulan</div>
      <div class="service-arrow">→</div>
    </div>

    <div class="service-card" onclick="showPage('ipal')">
      <div class="service-icon ipal-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M2 22V12C2 6.477 6.477 2 12 2s10 4.477 10 10v10" />
          <path d="M7 22v-5c0-2.761 2.239-5 5-5s5 2.239 5 5v5" />
          <line x1="12" y1="12" x2="12" y2="17" />
        </svg>
      </div>
      <h3>Jasa IPAL</h3>
      <p>Desain &amp; konstruksi Instalasi Pengolahan Air Limbah untuk hotel, sekolah, pesantren, dan industri.</p>
      <div class="service-price">Konsultasi <strong>Gratis</strong></div>
      <div class="service-arrow">→</div>
    </div>
  </div>

  <!-- Recent Orders -->
  <div class="section-header" style="margin-top:2.5rem">
    <h2>Pesanan Terakhir</h2>
    <a class="see-all" onclick="showPage('akun')">Lihat semua →</a>
  </div>
  <div class="orders-table-wrap">
    <table class="orders-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Layanan</th>
          <th>Tanggal</th>
          <th>Status</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody id="recentOrdersBody">
        <tr>
          <td colspan="5" class="empty-row">Belum ada pesanan. Mulai pesan sekarang!</td>
        </tr>
      </tbody>
    </table>
  </div>
`;
