/**
 * Promotional Coupons Routes
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const CouponController = require('../controllers/couponController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', CouponController.listCoupons);
router.post('/', requireAuth, requireRole('ADMIN'), CouponController.createCoupon);
router.patch('/:id/toggle', requireAuth, requireRole('ADMIN'), CouponController.toggleCoupon);

module.exports = router;
