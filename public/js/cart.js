/**
 * Client-side Shopping Cart Manager
 * OmniCommerce Enterprise
 */

class CartManager {
  static getCartId() {
    let cartId = localStorage.getItem('omni_cart_id');
    if (!cartId) {
      cartId = 'cart_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('omni_cart_id', cartId);
    }
    return cartId;
  }

  static async fetchCart() {
    try {
      const res = await APIClient.get('/cart', { cartId: this.getCartId() });
      if (res.success && res.data) {
        this.updateBadge(res.data.itemCount);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
    return null;
  }

  static async addItem(productId, quantity = 1) {
    try {
      const res = await APIClient.post('/cart/items', {
        cartId: this.getCartId(),
        productId,
        quantity: parseInt(quantity, 10) || 1
      });
      if (res.success && res.data) {
        this.updateBadge(res.data.itemCount);
        showToast('✓ Added to shopping cart!', 'success');
        return res.data;
      }
    } catch (err) {
      showToast(err.message || 'Failed to add item to cart', 'danger');
    }
  }

  static async updateQuantity(productId, quantity) {
    try {
      const res = await APIClient.put('/cart/items', {
        cartId: this.getCartId(),
        productId,
        quantity: parseInt(quantity, 10)
      });
      if (res.success && res.data) {
        this.updateBadge(res.data.itemCount);
        return res.data;
      }
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'danger');
    }
  }

  static async applyCoupon(promoCode) {
    try {
      const res = await APIClient.post('/cart/coupon', {
        cartId: this.getCartId(),
        promoCode
      });
      if (res.success && res.data) {
        showToast(`Promo code "${promoCode}" applied!`, 'success');
        return res.data;
      }
    } catch (err) {
      showToast(err.message || 'Invalid promo code', 'danger');
      throw err;
    }
  }

  static updateBadge(count) {
    const badge = document.getElementById('cart-badge-count');
    if (badge) {
      badge.textContent = count || 0;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }
}
