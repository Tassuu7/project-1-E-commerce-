/**
 * Client-side Authentication & Session Manager
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
        return this.currentUser;
      }
    } catch (err) {
      console.warn('Session expired or invalid, logging out.');
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
        return res.data;
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'danger');
      throw err;
    }
  }

  static async register(name, email, password) {
    try {
      const res = await APIClient.post('/auth/register', { name, email, password });
      if (res.success && res.data.token) {
        localStorage.setItem('omni_token', res.data.token);
        this.currentUser = res.data.user;
        this.updateUI();
        this.closeAuthModal();
        showToast(`Account created successfully! Welcome, ${this.currentUser.name}`, 'success');
        return res.data;
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'danger');
      throw err;
    }
  }

  static logout(redirect = true) {
    localStorage.removeItem('omni_token');
    this.currentUser = null;
    this.updateUI();
    showToast('Logged out successfully', 'info');
    if (redirect && window.location.pathname.includes('admin')) {
      window.location.href = '/index.html';
    }
  }

  static updateUI() {
    const authContainer = document.getElementById('nav-auth-container');
    if (!authContainer) return;

    if (this.currentUser) {
      authContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 0.875rem; color: #cbd5e1;">Hi, <strong style="color: #fff;">${this.currentUser.name}</strong></span>
          ${this.currentUser.role === 'ADMIN' ? '<a href="/admin.html" class="btn btn-sm btn-accent" style="color: #fff; text-decoration: none;">Admin Panel</a>' : ''}
          <a href="/orders.html" class="btn btn-sm btn-secondary">My Orders</a>
          <button class="btn btn-dark btn-sm" onclick="AuthManager.logout()">Logout</button>
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
                <input type="email" id="login-email" class="form-control" placeholder="admin@omnicommerce.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">Sign In</button>
              
              <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.825rem; color: var(--text-muted);">
                <strong>Quick Demo Fill:</strong>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                  <button type="button" class="btn btn-secondary btn-sm" style="flex: 1;" onclick="fillDemoCredentials('admin')">Admin Demo</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="flex: 1;" onclick="fillDemoCredentials('customer')">Customer Demo</button>
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
    if (title) title.textContent = isLogin ? 'Sign In' : 'Create Account';
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

function fillDemoCredentials(role) {
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  if (role === 'admin') {
    emailInput.value = 'admin@omnicommerce.com';
    passInput.value = 'AdminPassword2026!';
  } else {
    emailInput.value = 'jane@example.com';
    passInput.value = 'CustomerPassword123!';
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
