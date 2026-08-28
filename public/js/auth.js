/**
 * Client-side Auth State Manager
 * OmniCommerce Enterprise
 */

class AuthManager {
  static currentUser = null;

  static async init() {
    const token = localStorage.getItem('omni_token');
    if (!token) return null;

    try {
      const res = await APIClient.get('/auth/me');
      if (res.success) {
        this.currentUser = res.data;
        this.updateUI();
        return this.currentUser;
      }
    } catch (err) {
      this.logout();
    }
    return null;
  }

  static async login(email, password) {
    const res = await APIClient.post('/auth/login', { email, password });
    if (res.success && res.data.token) {
      localStorage.setItem('omni_token', res.data.token);
      this.currentUser = res.data.user;
      this.updateUI();
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  }

  static async register(name, email, password) {
    const res = await APIClient.post('/auth/register', { name, email, password });
    if (res.success && res.data.token) {
      localStorage.setItem('omni_token', res.data.token);
      this.currentUser = res.data.user;
      this.updateUI();
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  }

  static logout() {
    localStorage.removeItem('omni_token');
    this.currentUser = null;
    this.updateUI();
    window.location.href = '/index.html';
  }

  static updateUI() {
    const authContainer = document.getElementById('nav-auth-container');
    if (!authContainer) return;

    if (this.currentUser) {
      authContainer.innerHTML = `
        <span>Welcome, <strong>${this.currentUser.name}</strong></span>
        ${this.currentUser.role === 'ADMIN' ? '<a href="/admin.html" style="color: var(--accent-color);">Admin Dashboard</a>' : ''}
        <a href="/orders.html">Orders</a>
        <button class="btn btn-secondary btn-sm" onclick="AuthManager.logout()">Logout</button>
      `;
    } else {
      authContainer.innerHTML = `
        <button class="btn btn-primary btn-sm" onclick="showAuthModal('login')">Login</button>
        <button class="btn btn-secondary btn-sm" onclick="showAuthModal('register')">Register</button>
      `;
    }
  }
}
