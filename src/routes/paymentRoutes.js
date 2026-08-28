/**
 * Payment Router Definitions
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { auditLogger } = require('../middleware/auditLogger');
const { AUDIT_EVENT_TYPES } = require('../config/constants');

router.post('/process', auditLogger(AUDIT_EVENT_TYPES.PAYMENT_PROCESSED), PaymentController.processPayment);
router.get('/:orderId', PaymentController.getPaymentDetails);

module.exports = router;
