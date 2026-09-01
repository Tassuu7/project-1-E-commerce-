/**
 * Customer Wishlist Routes
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const WishlistController = require('../controllers/wishlistController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, WishlistController.getWishlist);
router.post('/items', requireAuth, WishlistController.addItem);
router.delete('/items/:productId', requireAuth, WishlistController.removeItem);

module.exports = router;
