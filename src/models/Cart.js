/**
 * Cart Data Model Definition
 * OmniCommerce Enterprise
 */

const { generateUUID } = require('../utils/helpers');

class Cart {
  constructor({
    id = generateUUID(),
    userId = null,
    items = [], // Array of { productId, variantId, name, price, quantity, sku, image }
    appliedCoupon = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.appliedCoupon = appliedCoupon;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get subtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get itemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

module.exports = Cart;
