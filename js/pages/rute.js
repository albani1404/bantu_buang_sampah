/* =====================================================
   BANTU BUANG — Halaman Rute & Armada (Rute Page HTML)
   ===================================================== */

PAGE_TEMPLATES.rute = `
  <div class="page-header">
    <h1>Rute &amp; Tracking Armada</h1>
    <p>Pemantauan real-time dan optimasi rute dalam radius 5 km</p>
  </div>

  <div class="fleet-stats">
    <div class="fleet-stat">
      <div class="fleet-num green">3</div>
      <div class="fleet-lbl">Armada Aktif</div>
    </div>
    <div class="fleet-stat">
      <div class="fleet-num yellow">1</div>
      <div class="fleet-lbl">Dalam Perjalanan</div>
    </div>
    <div class="fleet-stat">
      <div class="fleet-num blue">8</div>
      <div class="fleet-lbl">Ritase Hari Ini</div>
    </div>
    <div class="fleet-stat">
      <div class="fleet-num">32 m³</div>
      <div class="fleet-lbl">Volume Terangkut</div>
    </div>
  </div>

  <div class="two-col">
    <!-- Map Placeholder -->
    <div class="card map-card">
      <div class="map-placeholder">
        <div class="map-visual">
          <svg viewBox="0 0 400 300" width="100%" height="100%">
            <rect width="400" height="300" fill="#e8f4e8" />
            <line x1="0" y1="150" x2="400" y2="150" stroke="#ccc" stroke-width="8" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="#ccc" stroke-width="8" />
            <line x1="0" y1="80" x2="400" y2="200" stroke="#ddd" stroke-width="4" />
            <circle cx="200" cy="150" r="100" fill="rgba(13,124,124,0.08)" stroke="#0D7C7C" stroke-width="2" stroke-dasharray="8 4" />
            <circle cx="200" cy="150" r="14" fill="#0D7C7C" />
            <text x="200" y="175" text-anchor="middle" font-size="11" fill="#0D7C7C" font-weight="bold">IPLT</text>
            <circle cx="270" cy="110" r="10" fill="#4DD9AC" class="truck-dot" />
            <text x="270" y="100" text-anchor="middle" font-size="10" fill="#333">T-01</text>
            <circle cx="140" cy="200" r="10" fill="#4DD9AC" />
            <text x="140" y="220" text-anchor="middle" font-size="10" fill="#333">T-02</text>
            <circle cx="300" cy="200" r="10" fill="#FFB347" />
            <text x="300" y="220" text-anchor="middle" font-size="10" fill="#333">T-03</text>
            <path d="M200,150 L270,110" stroke="#4DD9AC" stroke-width="2" stroke-dasharray="4 2" />
            <path d="M200,150 L140,200" stroke="#4DD9AC" stroke-width="2" stroke-dasharray="4 2" />
            <path d="M200,150 L300,200" stroke="#FFB347" stroke-width="2" stroke-dasharray="4 2" />
            <polygon points="160,90 154,104 166,104" fill="#e74c3c" />
            <polygon points="250,220 244,234 256,234" fill="#e74c3c" />
            <polygon points="320,120 314,134 326,134" fill="#e74c3c" />
            <text x="10" y="20" font-size="12" fill="#666">🗺️ Lombok Barat — Real-time (Demo)</text>
            <text x="10" y="285" font-size="10" fill="#999">• Radius 5 km dari IPLT Gerung</text>
          </svg>
        </div>
        <div class="map-legend">
          <div class="legend-item"><span class="legend-dot teal"></span> Armada Aktif</div>
          <div class="legend-item"><span class="legend-dot yellow"></span> Dalam Transit</div>
          <div class="legend-item"><span class="legend-dot red"></span> Lokasi Pelanggan</div>
        </div>
      </div>
    </div>

    <!-- Fleet List -->
    <div class="fleet-panel">
      <div class="card fleet-card">
        <div class="card-title">🚛 Status Armada</div>
        <div class="fleet-list">
          <div class="fleet-item">
            <div class="fleet-avatar green">T-01</div>
            <div class="fleet-info">
              <div class="fleet-name">Truk Tinja #01 — Polimer 4m³</div>
              <div class="fleet-status">✅ Aktif — Menuju Pelanggan</div>
              <div class="fleet-sub">Ritase: 2/4 | Volume: 8m³ terangkut</div>
            </div>
          </div>
          <div class="fleet-item">
            <div class="fleet-avatar green">T-02</div>
            <div class="fleet-info">
              <div class="fleet-name">Truk Tinja #02 — Hino 4m³</div>
              <div class="fleet-status">✅ Aktif — Kembali ke IPLT</div>
              <div class="fleet-sub">Ritase: 3/4 | Volume: 12m³ terangkut</div>
            </div>
          </div>
          <div class="fleet-item">
            <div class="fleet-avatar yellow">T-03</div>
            <div class="fleet-info">
              <div class="fleet-name">Truk Sampah #01 — L300</div>
              <div class="fleet-status">🟡 Dalam Pengambilan — Pelabuhan Lembar</div>
              <div class="fleet-sub">Ritase: 1/4 | Kapasitas: 60%</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card fleet-card">
        <div class="card-title">📅 Jadwal Hari Ini</div>
        <div class="schedule-list" id="scheduleList">
          <div class="schedule-item done">
            <div class="sch-time">07:00</div>
            <div class="sch-info">
              <div>Jl. Raya Gerung No.12</div>
              <div class="sch-type">Sedot Tinja — Selesai ✓</div>
            </div>
          </div>
          <div class="schedule-item done">
            <div class="sch-time">09:30</div>
            <div class="sch-info">
              <div>SDN 5 Kediri</div>
              <div class="sch-type">Sedot Tinja — Selesai ✓</div>
            </div>
          </div>
          <div class="schedule-item active">
            <div class="sch-time">11:00</div>
            <div class="sch-info">
              <div>Hotel Sunset Senggigi</div>
              <div class="sch-type">Sedot Tinja — Dalam Perjalanan 🚛</div>
            </div>
          </div>
          <div class="schedule-item">
            <div class="sch-time">14:00</div>
            <div class="sch-info">
              <div>Pesantren Al-Amin Labuapi</div>
              <div class="sch-type">Sedot Tinja — Menunggu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
