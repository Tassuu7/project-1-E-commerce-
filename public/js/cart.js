/**
 * Client-side Cart State Manager
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
      if (res.success) {
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
        quantity
      });
      if (res.success) {
        this.updateBadge(res.data.itemCount);
        alert('Product added to shopping cart!');
        return res.data;
      }
    } catch (err) {
      alert(err.message || 'Failed to add item to cart');
    }
  }

  static async updateQuantity(productId, quantity) {
    const res = await APIClient.put('/cart/items', {
      cartId: this.getCartId(),
      productId,
      quantity
    });
    if (res.success) {
      this.updateBadge(res.data.itemCount);
      return res.data;
    }
  }

  static async applyCoupon(promoCode) {
    const res = await APIClient.post('/cart/coupon', {
      cartId: this.getCartId(),
      promoCode
    });
    if (res.success) {
      return res.data;
    }
  }

  static updateBadge(count) {
    const badge = document.getElementById('cart-badge-count');
    if (badge) {
      badge.textContent = count || 0;
    }
  }
}
