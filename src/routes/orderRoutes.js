/**
 * Order REST API Routes
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { requireAuth, requireRole, forbidRole } = require('../middleware/auth');

// Public / Customer Checkout (Delivery personnel forbidden)
router.post('/checkout', forbidRole('DELIVERY_PERSON'), OrderController.checkout);

// Get Customer Orders (isolated to owner)
router.get('/user', OrderController.getUserOrders);

// Admin-only listing of all orders
router.get('/', requireAuth, requireRole('ADMIN'), OrderController.getAllOrders);

// Get Order Details (Object-Level Authorization)
router.get('/:id', OrderController.getOrderById);

// Admin/Delivery Person Status Update
router.patch('/:id/status', requireAuth, requireRole('ADMIN', 'DELIVERY_PERSON'), OrderController.updateStatus);

// Cancel Order
router.post('/:id/cancel', requireAuth, OrderController.cancelOrder);

module.exports = router;
