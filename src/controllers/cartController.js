/**
 * Cart REST API Controller
 * OmniCommerce Enterprise
 */

const CartService = require('../services/cartService');

class CartController {
  static getCart(req, res, next) {
    try {
      const cartId = req.query.cartId || (req.user ? req.user.id : null);
      const region = req.query.region || 'CA';
      const summary = CartService.getCartSummary(cartId, region);
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (err) {
      next(err);
    }
  }

  static addItem(req, res, next) {
    try {
      const { cartId, productId, quantity } = req.body;
      const effectiveCartId = cartId || (req.user ? req.user.id : null);
      const summary = CartService.addItem(effectiveCartId, { productId, quantity: parseInt(quantity, 10) || 1 });
      res.status(200).json({
        success: true,
        message: 'Item added to cart.',
        data: summary
      });
    } catch (err) {
      next(err);
    }
  }

  static updateQuantity(req, res, next) {
    try {
      const { cartId, productId, quantity } = req.body;
      const effectiveCartId = cartId || (req.user ? req.user.id : null);
      const summary = CartService.updateQuantity(effectiveCartId, productId, quantity);
      res.status(200).json({
        success: true,
        message: 'Cart item updated.',
        data: summary
      });
    } catch (err) {
      next(err);
    }
  }

  static removeItem(req, res, next) {
    try {
      const { cartId, productId } = req.body;
      const effectiveCartId = cartId || (req.user ? req.user.id : null);
      const summary = CartService.removeItem(effectiveCartId, productId);
      res.status(200).json({
        success: true,
        message: 'Item removed from cart.',
        data: summary
      });
    } catch (err) {
      next(err);
    }
  }

  static applyCoupon(req, res, next) {
    try {
      const { cartId, promoCode } = req.body;
      const effectiveCartId = cartId || (req.user ? req.user.id : null);
      const summary = CartService.applyCoupon(effectiveCartId, promoCode);
      res.status(200).json({
        success: true,
        message: 'Promo coupon applied.',
        data: summary
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CartController;
