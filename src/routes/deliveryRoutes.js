/**
 * Delivery Personnel & Courier Logistics Routes
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const DeliveryController = require('../controllers/deliveryController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Delivery personnel operations
router.get('/orders', requireAuth, requireRole('DELIVERY_PERSON', 'ADMIN'), DeliveryController.getAssignedOrders);
router.post('/orders/:id/accept', requireAuth, requireRole('DELIVERY_PERSON', 'ADMIN'), DeliveryController.acceptAssignment);
router.patch('/orders/:id/out-for-delivery', requireAuth, requireRole('DELIVERY_PERSON', 'ADMIN'), DeliveryController.markOutForDelivery);
router.post('/orders/:id/confirm', requireAuth, requireRole('DELIVERY_PERSON', 'ADMIN'), DeliveryController.confirmDelivery);

// Admin-only assignment operations
router.get('/personnel', requireAuth, requireRole('ADMIN'), DeliveryController.getAllPersonnel);
router.post('/assign', requireAuth, requireRole('ADMIN'), DeliveryController.assignDelivery);

module.exports = router;
