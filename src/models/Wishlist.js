/**
 * Customer Wishlist Entity
 * OmniCommerce Enterprise
 */

const crypto = require('crypto');

class Wishlist {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.userId = data.userId || null;
    this.items = Array.isArray(data.items) ? data.items : []; // array of { productId, name, price, image, addedAt }
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  addItem(product) {
    const exists = this.items.find(i => i.productId === product.id);
    if (!exists) {
      this.items.push({
        productId: product.id,
        name: product.name,
        price: typeof product.effectivePrice === 'number' ? product.effectivePrice : product.price,
        image: (product.images && product.images[0]) || '/images/placeholder.svg',
        addedAt: new Date().toISOString()
      });
      this.updatedAt = new Date().toISOString();
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.productId !== productId);
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Wishlist;
