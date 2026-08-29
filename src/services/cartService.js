/**
 * Shopping Cart Session Domain Service
 * OmniCommerce Enterprise
 */

const { cartRepository, productRepository } = require('../repositories');
const TaxCalculator = require('../utils/taxCalculator');
const DiscountEngine = require('../utils/discountEngine');
const config = require('../config');

class CartService {
  static getOrCreateCart(cartId = null, userId = null) {
    if (cartId) {
      const existing = cartRepository.findById(cartId);
      if (existing) return existing;
    }

    if (userId) {
      const userCart = cartRepository.findOne(c => c.userId === userId);
      if (userCart) return userCart;
    }

    return cartRepository.create({
      ...(cartId && { id: cartId }),
      userId,
      items: []
    });
  }

  static addItem(cartId, { productId, quantity = 1 }) {
    const cart = this.getOrCreateCart(cartId);
    const product = productRepository.findById(productId);

    if (!product) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    if (product.stock < quantity) {
      const err = new Error(`Only ${product.stock} units available in stock.`);
      err.statusCode = 400;
      throw err;
    }

    const priceVal = typeof product.effectivePrice === 'number' ? product.effectivePrice : (typeof product.salePrice === 'number' ? product.salePrice : (product.price || 0));

    const existingIndex = cart.items.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (product.stock < newQty) {
        const err = new Error(`Cannot add more than ${product.stock} units.`);
        err.statusCode = 400;
        throw err;
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: priceVal,
        quantity: quantity,
        sku: product.sku,
        image: (product.images && product.images[0]) || '/images/placeholder.svg'
      });
    }

    cartRepository.update(cart.id, { items: cart.items });
    return this.getCartSummary(cart.id);
  }

  static updateQuantity(cartId, productId, quantity) {
    const cart = this.getOrCreateCart(cartId);
    const targetQty = parseInt(quantity, 10);

    if (targetQty <= 0) {
      return this.removeItem(cartId, productId);
    }

    const product = productRepository.findById(productId);
    if (product && product.stock < targetQty) {
      const err = new Error(`Only ${product.stock} units available.`);
      err.statusCode = 400;
      throw err;
    }

    const itemIndex = cart.items.findIndex(i => i.productId === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = targetQty;
      cartRepository.update(cart.id, { items: cart.items });
    }

    return this.getCartSummary(cart.id);
  }

  static removeItem(cartId, productId) {
    const cart = this.getOrCreateCart(cartId);
    cart.items = cart.items.filter(i => i.productId !== productId);
    cartRepository.update(cart.id, { items: cart.items });
    return this.getCartSummary(cart.id);
  }

  static applyCoupon(cartId, promoCode) {
    const cart = this.getOrCreateCart(cartId);
    const result = DiscountEngine.applyCoupon(promoCode, cart.subtotal, config.shipping.standardFee);

    if (!result.valid) {
      const err = new Error(result.message);
      err.statusCode = 400;
      throw err;
    }

    cartRepository.update(cart.id, { appliedCoupon: result.promo });
    return this.getCartSummary(cart.id);
  }

  static getCartSummary(cartId, regionCode = 'CA') {
    const cart = this.getOrCreateCart(cartId);
    const items = cart.items || [];
    const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    let shippingCost = subtotal >= config.shipping.flatRateThreshold || subtotal === 0 ? 0 : config.shipping.standardFee;
    let discountAmount = 0;

    if (cart.appliedCoupon) {
      const discountResult = DiscountEngine.applyCoupon(cart.appliedCoupon.code, subtotal, shippingCost);
      if (discountResult.valid) {
        discountAmount = discountResult.discountAmount;
        if (discountResult.freeShipping) shippingCost = 0;
      }
    }

    const taxableBase = Math.max(0, subtotal - discountAmount);
    const taxCalculation = TaxCalculator.calculateCartTax(
      items.map(item => ({ price: item.price, quantity: item.quantity })),
      regionCode
    );

    const grandTotal = Math.round((taxableBase + taxCalculation.totalTax + shippingCost) * 100) / 100;

    return {
      id: cart.id,
      userId: cart.userId,
      items: items,
      itemCount: itemCount,
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: discountAmount,
      taxAmount: taxCalculation.totalTax,
      taxRate: taxCalculation.taxRate,
      shippingAmount: shippingCost,
      grandTotal: grandTotal,
      appliedCoupon: cart.appliedCoupon
    };
  }
}

module.exports = CartService;
