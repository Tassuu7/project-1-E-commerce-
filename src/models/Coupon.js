/**
 * Promotional Coupon Entity
 * OmniCommerce Enterprise
 */

const crypto = require('crypto');

class Coupon {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.code = (data.code || '').toUpperCase().trim();
    this.discountType = data.discountType || 'PERCENTAGE'; // 'PERCENTAGE' or 'FIXED'
    this.discountValue = Number(data.discountValue) || 10;
    this.minOrderValue = Number(data.minOrderValue) || 0;
    this.maxDiscountAmount = data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null;
    this.usageLimit = Number(data.usageLimit) || 1000;
    this.usedCount = Number(data.usedCount) || 0;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.expiresAt = data.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  isValid(orderSubtotal = 0) {
    if (!this.isActive) return { valid: false, reason: 'Coupon is inactive' };
    if (new Date() > new Date(this.expiresAt)) return { valid: false, reason: 'Coupon has expired' };
    if (this.usedCount >= this.usageLimit) return { valid: false, reason: 'Coupon usage limit exceeded' };
    if (orderSubtotal < this.minOrderValue) return { valid: false, reason: `Minimum order value of $${this.minOrderValue} required` };
    return { valid: true };
  }

  calculateDiscount(orderSubtotal = 0) {
    const check = this.isValid(orderSubtotal);
    if (!check.valid) return 0;

    let discount = 0;
    if (this.discountType === 'PERCENTAGE') {
      discount = (orderSubtotal * this.discountValue) / 100;
      if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
        discount = this.maxDiscountAmount;
      }
    } else if (this.discountType === 'FIXED') {
      discount = Math.min(this.discountValue, orderSubtotal);
    }
    return Math.round(discount * 100) / 100;
  }

  toJSON() {
    return {
      id: this.id,
      code: this.code,
      discountType: this.discountType,
      discountValue: this.discountValue,
      minOrderValue: this.minOrderValue,
      maxDiscountAmount: this.maxDiscountAmount,
      usageLimit: this.usageLimit,
      usedCount: this.usedCount,
      isActive: this.isActive,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Coupon;
