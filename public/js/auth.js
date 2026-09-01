/**
 * Unified Authentication & Role-Based Session Manager
 * OmniCommerce Enterprise
 */

class AuthManager {
  static currentUser = null;

  static async init() {
    this.injectAuthModal();
    const token = localStorage.getItem('omni_token');
    if (!token) {
      this.updateUI();
      return null;
    }

    try {
      const res = await APIClient.get('/auth/me');
      if (res.success && res.data) {
        this.currentUser = res.data;
        this.updateUI();
        this.fetchNotificationCount();

        // Enforce route isolation: Delivery personnel are restricted to delivery.html
        if (this.currentUser.role === 'DELIVERY_PERSON' && !window.location.pathname.includes('delivery.html')) {
          window.location.href = '/delivery.html';
          return this.currentUser;
        }

        return this.currentUser;
      }
    } catch (err) {
      console.warn('Session expired, please sign in again.');
      this.logout(false);
    }
    return null;
  }

  static async login(email, password) {
    try {
      const res = await APIClient.post('/auth/login', { email, password });
      if (res.success && res.data.token) {
        localStorage.setItem('omni_token', res.data.token);
        this.currentUser = res.data.user;
        this.updateUI();
        this.closeAuthModal();
        showToast(`Welcome back, ${this.currentUser.name}!`, 'success');

        // Role-based smart redirection
        if (this.currentUser.role === 'ADMIN' && !window.location.pathname.includes('admin.html')) {
          setTimeout(() => { window.location.href = '/admin.html'; }, 500);
        } else if (this.currentUser.role === 'DELIVERY_PERSON' && !window.location.pathname.includes('delivery.html')) {
          setTimeout(() => { window.location.href = '/delivery.html'; }, 500);
        }
        return res.data;
      }
    } catch (err) {
      showToast(err.message || 'Incorrect email or password', 'danger');
      throw err;
    }
  }

  static async register(name, email, password, role = 'CUSTOMER') {
    try {
      const res = await APIClient.post('/auth/register', { name, email, password, role });
      if (res.success && res.data.token) {
        localStorage.setItem('omni_token', res.data.token);
        this.currentUser = res.data.user;
        this.updateUI();
        this.closeAuthModal();
        showToast(`Welcome to EverydayStore, ${this.currentUser.name}!`, 'success');
        return res.data;
      }
    } catch (err) {
      showToast(err.message || 'Could not create account', 'danger');
      throw err;
    }
  }

  static logout(redirect = false) {
    localStorage.removeItem('omni_token');
    this.currentUser = null;
    this.updateUI();
    showToast('Signed out successfully', 'info');
    if (redirect) {
      window.location.href = '/index.html';
    }
  }

  static async fetchNotificationCount() {
    if (!this.currentUser) return;
    try {
      const res = await APIClient.get('/notifications');
      if (res.success) {
        const unreadCount = res.unreadCount || 0;
        const badge = document.getElementById('notif-badge-count');
        if (badge) {
          badge.textContent = unreadCount;
          badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
        }
      }
    } catch (err) {
      // Ignored for guest
    }
  }

  static updateUI() {
    const authContainer = document.getElementById('nav-auth-container');
    if (!authContainer) return;

    if (this.currentUser) {
      const isAdmin = this.currentUser.role === 'ADMIN';
      const isDelivery = this.currentUser.role === 'DELIVERY_PERSON';

      authContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
          <span style="font-size: 0.95rem; color: var(--text-main); font-weight: 600;">Hi, <strong>${this.currentUser.name}</strong></span>
          ${isAdmin ? `<a href="/admin.html" class="btn btn-secondary btn-sm" style="font-weight: 700;">Admin Dashboard</a>` : ''}
          ${isDelivery ? `<a href="/delivery.html" class="btn btn-secondary btn-sm" style="font-weight: 700;">Courier Portal</a>` : ''}
          ${!isDelivery ? `<a href="/orders.html" class="btn btn-secondary btn-sm">My Orders</a>` : ''}
          <button class="btn btn-secondary btn-sm" onclick="showNotificationModal()" title="View Notifications" style="position: relative;">
            Notifications <span id="notif-badge-count" class="cart-count" style="display: none; margin-left: 4px;">0</span>
          </button>
          <button class="btn btn-dark btn-sm" onclick="AuthManager.logout(true)">Sign Out</button>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="showAuthModal('login')">Sign In</button>
        <button class="btn btn-primary btn-sm" onclick="showAuthModal('register')">Register</button>
      `;
    }
  }

  static injectAuthModal() {
    if (document.getElementById('auth-modal-overlay')) return;

    const modalHtml = `
      <div id="auth-modal-overlay" class="modal-overlay" onclick="if(event.target === this) AuthManager.closeAuthModal()">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 id="auth-modal-title" class="modal-title">Sign In</h3>
            <button class="modal-close" onclick="AuthManager.closeAuthModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="tabs-nav">
              <button id="tab-btn-login" class="tab-btn active" onclick="switchAuthTab('login')">Sign In</button>
              <button id="tab-btn-register" class="tab-btn" onclick="switchAuthTab('register')">Create Account</button>
            </div>

            <!-- Login Form -->
            <form id="auth-form-login" onsubmit="handleAuthSubmit(event, 'login')">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" id="login-email" class="form-control" placeholder="customer@example.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">Sign In</button>
              
              <!-- Quick Role Select for Demo Testing -->
              <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; text-align: center;">Quick Demo Credentials:</div>
                <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="fillDemo('customer')">Customer</button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="fillDemo('admin')">Store Admin</button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="fillDemo('delivery')">Courier</button>
                </div>
              </div>
            </form>

            <!-- Register Form -->
            <form id="auth-form-register" style="display: none;" onsubmit="handleAuthSubmit(event, 'register')">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" id="reg-name" class="form-control" placeholder="Jane Doe" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" id="reg-email" class="form-control" placeholder="jane@example.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Create Password</label>
                <input type="password" id="reg-password" class="form-control" placeholder="At least 6 characters" minlength="6" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">Create Account</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Notifications Modal -->
      <div id="notif-modal-overlay" class="modal-overlay" onclick="if(event.target === this) closeNotificationModal()">
        <div class="modal-dialog" style="max-width: 550px;">
          <div class="modal-header">
            <h3 class="modal-title">In-App Notifications</h3>
            <button class="modal-close" onclick="closeNotificationModal()">&times;</button>
          </div>
          <div class="modal-body" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 0.9rem; color: var(--text-muted);">Real-time dispatch & status alerts</span>
              <button class="btn btn-secondary btn-sm" onclick="markAllNotificationsRead()">Mark All Read</button>
            </div>
            <div id="notifications-list" style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 380px; overflow-y: auto;">
              <p style="color: var(--text-muted); text-align: center; padding: 2rem;">Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  static closeAuthModal() {
    const overlay = document.getElementById('auth-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  }
}

function showAuthModal(tab = 'login') {
  AuthManager.injectAuthModal();
  switchAuthTab(tab);
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) overlay.classList.add('active');
}

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  const loginForm = document.getElementById('auth-form-login');
  const regForm = document.getElementById('auth-form-register');
  const loginTab = document.getElementById('tab-btn-login');
  const regTab = document.getElementById('tab-btn-register');
  const title = document.getElementById('auth-modal-title');

  if (loginForm && regForm) {
    loginForm.style.display = isLogin ? 'block' : 'none';
    regForm.style.display = isLogin ? 'none' : 'block';
    if (loginTab && regTab) {
      loginTab.className = `tab-btn ${isLogin ? 'active' : ''}`;
      regTab.className = `tab-btn ${!isLogin ? 'active' : ''}`;
    }
    if (title) title.textContent = isLogin ? 'Sign In to Your Account' : 'Create Customer Account';
  }
}

async function handleAuthSubmit(event, type) {
  event.preventDefault();
  if (type === 'login') {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await AuthManager.login(email, password);
  } else {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    await AuthManager.register(name, email, password);
  }
}

function fillDemo(role) {
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  if (role === 'customer') {
    emailInput.value = 'customer@example.com';
    passInput.value = 'CustomerPass2026!';
  } else if (role === 'admin') {
    emailInput.value = 'admin@omnicommerce.com';
    passInput.value = 'AdminPassword2026!';
  } else if (role === 'delivery') {
    emailInput.value = 'delivery@omnicommerce.com';
    passInput.value = 'DeliveryPass2026!';
  }
}

async function showNotificationModal() {
  const overlay = document.getElementById('notif-modal-overlay');
  if (overlay) overlay.classList.add('active');

  const listEl = document.getElementById('notifications-list');
  try {
    const res = await APIClient.get('/notifications');
    if (res.success && res.data && res.data.length > 0) {
      listEl.innerHTML = res.data.map(n => `
        <div style="padding: 1rem; border-radius: var(--radius); border: 1px solid var(--border); background: ${n.read ? 'var(--bg-muted)' : 'var(--bg-card)'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
            <strong style="color: var(--text-main); font-size: 0.95rem;">${n.title}</strong>
            <small style="color: var(--text-light); font-size: 0.75rem;">${new Date(n.createdAt).toLocaleTimeString()}</small>
          </div>
          <p style="color: var(--text-muted); font-size: 0.875rem; line-height: 1.4; margin: 0;">${n.message}</p>
        </div>
      `).join('');
    } else {
      listEl.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No new notifications.</p>';
    }
  } catch (err) {
    listEl.innerHTML = `<p style="color: var(--sale-red); text-align: center; padding: 1rem;">Failed to load notifications: ${err.message}</p>`;
  }
}

function closeNotificationModal() {
  const overlay = document.getElementById('notif-modal-overlay');
  if (overlay) overlay.classList.remove('active');
}

async function markAllNotificationsRead() {
  try {
    await APIClient.patch('/notifications/read-all');
    showToast('All notifications marked as read', 'info');
    AuthManager.fetchNotificationCount();
    showNotificationModal();
  } catch (err) {
    // Handled
  }
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
