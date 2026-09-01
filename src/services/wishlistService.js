/**
 * Customer Wishlist Domain Service
 * OmniCommerce Enterprise
 */

const { wishlistRepository, productRepository } = require('../repositories');

class WishlistService {
  static getOrCreateWishlist(userId) {
    let list = wishlistRepository.findOne(w => w.userId === userId);
    if (!list) {
      list = wishlistRepository.create({
        userId,
        items: []
      });
    }
    return list;
  }

  static addItem(userId, productId) {
    const list = this.getOrCreateWishlist(userId);
    const product = productRepository.findById(productId);
    if (!product) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    const exists = list.items.find(i => i.productId === productId);
    if (!exists) {
      const priceVal = typeof product.effectivePrice === 'number' ? product.effectivePrice : (typeof product.salePrice === 'number' ? product.salePrice : (product.price || 0));
      list.items.push({
        productId: product.id,
        name: product.name,
        category: product.category,
        price: priceVal,
        image: (product.images && product.images[0]) || '/images/placeholder.svg',
        stock: product.stock,
        rating: product.rating,
        addedAt: new Date().toISOString()
      });
      list.updatedAt = new Date().toISOString();
      wishlistRepository.update(list.id, list);
    }
    return list;
  }

  static removeItem(userId, productId) {
    const list = this.getOrCreateWishlist(userId);
    list.items = list.items.filter(i => i.productId !== productId);
    list.updatedAt = new Date().toISOString();
    return wishlistRepository.update(list.id, list);
  }
}

module.exports = WishlistService;
