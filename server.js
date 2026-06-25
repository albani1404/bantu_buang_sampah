const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'BANTU_BUANG_SECRET_KEY_123'; // In production, use environment variables

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the current directory (frontend)
app.use(express.static(__dirname));

// MySQL Configuration
// Asumsi: Anda menggunakan XAMPP/WAMP/Laragon dengan user default 'root' tanpa password
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    // Kita tidak spesifikasikan database di awal karena kita akan membuatnya jika belum ada
};

let pool;

// Inisiasi Database & Tabel
async function initDatabase() {
    try {
        // 1. Konek ke server MySQL tanpa menspesifikasikan database
        const connection = await mysql.createConnection(dbConfig);
        
        // 2. Buat database jika belum ada
        await connection.query(`CREATE DATABASE IF NOT EXISTS bantu_buang`);
        console.log("Database 'bantu_buang' siap.");
        
        // Tutup koneksi awal
        await connection.end();

        // 3. Buat Connection Pool ke database bantu_buang
        pool = mysql.createPool({
            ...dbConfig,
            database: 'bantu_buang',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // 4. Buat Tabel Users
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                alamat TEXT NOT NULL,
                umur INT NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. Buat Tabel Orders
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type ENUM('tinja', 'sampah', 'ipal') NOT NULL,
                detail TEXT,
                tanggal DATE NOT NULL,
                status VARCHAR(50) DEFAULT 'Menunggu Konfirmasi',
                price INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log("Tabel MySQL siap digunakan.");

    } catch (error) {
        console.error("Gagal koneksi ke MySQL. Pastikan MySQL Server (XAMPP dsb) sedang berjalan.");
        console.error("Error:", error.message);
    }
}

// Panggil fungsi inisiasi saat server mulai
initDatabase();

// ==========================================
// MIDDLEWARE: JWT Authentication
// ==========================================
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) return res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token tidak valid atau kedaluwarsa.' });
        req.user = user; // attach user info to request
        next();
    });
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Akses ditolak. Anda bukan admin.' });
    }
    next();
}

// ==========================================
// API ENDPOINTS (BACKEND LOGIC)
// ==========================================

// 1. REGISTER
app.post('/api/register', async (req, res) => {
    const { nama, alamat, umur, password } = req.body;
    
    if (!nama || !alamat || !umur || !password) {
        return res.status(400).json({ error: 'Semua kolom wajib diisi!' });
    }

    try {
        // Cek apakah user sudah ada
        const [existing] = await pool.query('SELECT * FROM users WHERE name = ? AND alamat = ?', [nama, alamat]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Akun dengan nama dan alamat ini sudah terdaftar!' });
        }

        // Hash password menggunakan bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke database
        const [result] = await pool.query(
            'INSERT INTO users (name, alamat, umur, password) VALUES (?, ?, ?, ?)',
            [nama, alamat, umur, hashedPassword]
        );

        // Ambil user yang baru dibuat
        const [newUser] = await pool.query('SELECT id, name, alamat, umur FROM users WHERE id = ?', [result.insertId]);
        const user = newUser[0];

        // Buat JWT Token
        const token = jwt.sign({ id: user.id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ message: 'Pendaftaran berhasil', user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
    const { nama, alamat, password } = req.body;
    
    try {
        const [users] = await pool.query(
            'SELECT * FROM users WHERE name = ? AND alamat = ?',
            [nama, alamat]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Nama, alamat, atau password salah!' });
        }

        const user = users[0];

        // Verifikasi password dengan bcrypt
        let validPassword = await bcrypt.compare(password, user.password);
        
        // BACKWARD COMPATIBILITY: Cek apakah password di DB masih berupa teks biasa (belum di-hash)
        if (!validPassword) {
            if (password === user.password) {
                // Password cocok dengan versi teks biasa. Mari kita hash dan update ke database agar aman!
                validPassword = true;
                const salt = await bcrypt.genSalt(10);
                const newHashedPassword = await bcrypt.hash(password, salt);
                await pool.query('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, user.id]);
                console.log(`Password untuk user ${user.name} berhasil di-upgrade ke Bcrypt.`);
            }
        }

        if (!validPassword) {
            return res.status(401).json({ error: 'Nama, alamat, atau password salah!' });
        }

        // Jangan kirim password kembali ke client
        delete user.password;
        
        // Buat JWT Token
        const token = jwt.sign({ id: user.id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: 'Login berhasil', user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
});

// 3. CREATE ORDER (Protected)
app.post('/api/orders', authenticateToken, async (req, res) => {
    const { user_id, type, detail, tanggal, price } = req.body;
    
    // Validasi Keamanan (IDOR Protection): Pastikan user hanya bisa membuat pesanan untuk ID mereka sendiri
    if (req.user.role !== 'admin' && parseInt(req.user.id) !== parseInt(user_id)) {
        return res.status(403).json({ error: 'Akses ditolak. Anda tidak dapat membuat pesanan untuk pengguna lain.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO orders (user_id, type, detail, tanggal, price) VALUES (?, ?, ?, ?, ?)',
            [user_id, type, detail, tanggal, price]
        );
        res.status(201).json({ message: 'Pesanan berhasil dibuat', orderId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal membuat pesanan' });
    }
});

// 4. GET USER ORDERS (History) (Protected)
app.get('/api/orders', authenticateToken, async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ error: 'user_id diperlukan' });

    // Validasi Keamanan (IDOR Protection): Pastikan user hanya bisa melihat pesanan mereka sendiri
    if (req.user.role !== 'admin' && parseInt(req.user.id) !== parseInt(userId)) {
        return res.status(403).json({ error: 'Akses ditolak. Anda hanya dapat melihat pesanan Anda sendiri.' });
    }

    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengambil data pesanan' });
    }
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// ADMIN LOGIN
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    // Hardcode admin credentials untuk prototype (Sebaiknya gunakan tabel DB)
    if (email === 'admin@admin.com' && password === 'admin123') {
        const token = jwt.sign({ id: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: 'Login Admin berhasil', token });
    } else {
        res.status(401).json({ error: 'Email atau password admin salah!' });
    }
});

// GET ALL USERS (Admin Only)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, alamat, umur, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengambil data pengguna' });
    }
});

// GET ALL ORDERS (Admin Only)
app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [orders] = await pool.query(`
            SELECT o.*, u.name as user_name 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengambil data pesanan' });
    }
});

// UPDATE ORDER STATUS (Admin Only)
app.post('/api/admin/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
        res.json({ message: 'Status berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal memperbarui status' });
    }
});

// START SERVER
app.listen(port, () => {
    console.log(`Server Bantu Buang berjalan di http://localhost:${port}`);
});
