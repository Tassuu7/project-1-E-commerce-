/**
 * Customer Wishlist Controller
 * OmniCommerce Enterprise
 */

const WishlistService = require('../services/wishlistService');

class WishlistController {
  static getWishlist(req, res, next) {
    try {
      const wishlist = WishlistService.getOrCreateWishlist(req.user.id);
      res.json({
        success: true,
        data: wishlist
      });
    } catch (err) {
      next(err);
    }
  }

  static addItem(req, res, next) {
    try {
      const { productId } = req.body;
      const wishlist = WishlistService.addItem(req.user.id, productId);
      res.json({
        success: true,
        message: 'Product added to wishlist.',
        data: wishlist
      });
    } catch (err) {
      next(err);
    }
  }

  static removeItem(req, res, next) {
    try {
      const { productId } = req.params;
      const wishlist = WishlistService.removeItem(req.user.id, productId);
      res.json({
        success: true,
        message: 'Product removed from wishlist.',
        data: wishlist
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WishlistController;
