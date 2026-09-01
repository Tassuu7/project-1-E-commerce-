/**
 * Promotional Coupons Controller
 * OmniCommerce Enterprise
 */

const { couponRepository } = require('../repositories');

class CouponController {
  /**
   * GET /api/coupons - List all active coupons (or all for admin)
   */
  static listCoupons(req, res, next) {
    try {
      const all = couponRepository.findAll();
      if (!req.user || req.user.role !== 'ADMIN') {
        const active = all.filter(c => c.isActive && new Date(c.expiresAt) > new Date());
        return res.json({ success: true, data: active });
      }
      res.json({ success: true, data: all });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/coupons - Create coupon (Admin only)
   */
  static createCoupon(req, res, next) {
    try {
      const coupon = couponRepository.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Coupon created successfully.',
        data: coupon
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/coupons/:id/toggle - Toggle coupon status (Admin only)
   */
  static toggleCoupon(req, res, next) {
    try {
      const coupon = couponRepository.findById(req.params.id);
      if (!coupon) {
        return res.status(404).json({ success: false, message: 'Coupon not found.' });
      }
      coupon.isActive = !coupon.isActive;
      coupon.updatedAt = new Date().toISOString();
      couponRepository.update(coupon.id, coupon);
      res.json({ success: true, data: coupon });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CouponController;
