/**
 * Cart Router Definitions
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

router.get('/', CartController.getCart);
router.post('/items', CartController.addItem);
router.put('/items', CartController.updateQuantity);
router.delete('/items', CartController.removeItem);
router.post('/coupon', CartController.applyCoupon);

module.exports = router;
