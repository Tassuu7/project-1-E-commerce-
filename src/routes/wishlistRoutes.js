/**
 * Customer Wishlist Routes
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const WishlistController = require('../controllers/wishlistController');
const { requireAuth, forbidRole } = require('../middleware/auth');

// Delivery personnel forbidden
router.use(requireAuth, forbidRole('DELIVERY_PERSON'));

router.get('/', WishlistController.getWishlist);
router.post('/items', WishlistController.addItem);
router.delete('/items/:productId', WishlistController.removeItem);

module.exports = router;
