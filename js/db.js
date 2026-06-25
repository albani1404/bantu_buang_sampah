/* =====================================================
   BANTU BUANG — Database & API Client Module
   Memproses semua HTTP request (fetch) ke Backend (server.js)
   ===================================================== */

const API_URL = 'http://localhost:3000/api';

// State global untuk menyimpan data sementara agar sinkron dengan file lain yang sebelumnya menggunakan db sinkron
const db = {
  users: [],
  orders: []
};

// ==========================================
// AUTH FETCH WRAPPER
// ==========================================
// Fungsi ini otomatis menyisipkan Token JWT ke header setiap request
async function authFetch(url, options = {}) {
  const token = localStorage.getItem('bb_token') || localStorage.getItem('bb_admin_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  
  // Jika token tidak valid / kedaluwarsa
  if (response.status === 401 || response.status === 403) {
    console.warn("Sesi berakhir atau akses ditolak");
  }
  
  return response;
}

// ==========================================
// UTILITY FETCH WRAPPER
// ==========================================
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      body: data ? JSON.stringify(data) : null
    };

    const response = await authFetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Terjadi kesalahan pada server');
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ==========================================
// USER AUTH API
// ==========================================
async function apiRegister(nama, alamat, umur, password) {
  return await apiCall('/register', 'POST', { nama, alamat, umur, password });
}

async function apiLogin(nama, alamat, password) {
  return await apiCall('/login', 'POST', { nama, alamat, password });
}

// ==========================================
// ORDERS API
// ==========================================
async function apiCreateOrder(orderData) {
  return await apiCall('/orders', 'POST', orderData);
}

async function apiGetUserOrders(userId) {
  return await apiCall(`/orders?user_id=${userId}`, 'GET');
}

// ==========================================
// ADMIN API
// ==========================================
async function apiAdminLogin(email, password) {
  return await apiCall('/admin/login', 'POST', { email, password });
}

async function apiAdminGetUsers() {
  try {
    const res = await authFetch(`${API_URL}/admin/users`);
    if (!res.ok) throw new Error('Gagal mengambil data user');
    const users = await res.json();
    db.users = users;
    return users;
  } catch (error) {
    console.error(error);
  }
}

async function apiAdminGetOrders() {
  try {
    const res = await authFetch(`${API_URL}/admin/orders`);
    if (!res.ok) throw new Error('Gagal mengambil data pesanan');
    const orders = await res.json();
    db.orders = orders;
    return orders;
  } catch (error) {
    console.error(error);
  }
}

async function apiAdminUpdateOrderStatus(orderId, newStatus) {
  try {
    const res = await authFetch(`${API_URL}/admin/orders/${orderId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error('Gagal mengupdate status');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// ==========================================
// MOCK STATE MANAGEMENT (Backward Compatibility)
// File auth.js dkk menggunakan currentUser secara sinkron
// ==========================================

let currentUser = null;

// Coba pulihkan session dari localStorage saat reload
try {
  const savedUser = localStorage.getItem('bb_currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
} catch (e) {
  console.error('Failed to parse current user from localStorage');
}

function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem('bb_currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('bb_currentUser');
  }
}

function updateTopbarAvatar() {
  const avatarEl = document.querySelector('.user-avatar');
  if (!avatarEl) return;
  if (currentUser) {
    const initials = currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    avatarEl.textContent = initials;
  } else {
    avatarEl.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    `;
  }
}
