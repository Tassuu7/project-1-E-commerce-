/**
 * Order Router Definitions
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { requireRole } = require('../middleware/auth');
const { USER_ROLES, AUDIT_EVENT_TYPES } = require('../config/constants');
const { auditLogger } = require('../middleware/auditLogger');

router.post('/checkout', auditLogger(AUDIT_EVENT_TYPES.ORDER_CREATED), OrderController.checkout);
router.get('/user', OrderController.getUserOrders);
router.get('/admin', requireRole(USER_ROLES.ADMIN, USER_ROLES.SUPPORT), OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
router.patch('/:id/status', requireRole(USER_ROLES.ADMIN, USER_ROLES.SUPPORT), auditLogger(AUDIT_EVENT_TYPES.ORDER_STATUS_UPDATED), OrderController.updateStatus);

module.exports = router;
