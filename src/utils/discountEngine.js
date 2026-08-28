/**
 * Coupon & Dynamic Discount Engine
 * OmniCommerce Enterprise
 */

const PROMO_CODES = {
  'WELCOME10': { type: 'PERCENTAGE', value: 10, minSpend: 20, maxDiscount: 50 },
  'SUMMER20': { type: 'PERCENTAGE', value: 20, minSpend: 50, maxDiscount: 100 },
  'FLAT50': { type: 'FIXED', value: 50, minSpend: 200, maxDiscount: 50 },
  'VIPFREESHIP': { type: 'FREESHIP', value: 0, minSpend: 0, maxDiscount: 0 }
};

class DiscountEngine {
  /**
   * Validate coupon code and calculate discount amount
   * @param {string} code Promo code string
   * @param {number} subtotal Cart subtotal before tax and shipping
   * @param {number} shippingCost Original shipping cost
   * @returns {{ valid: boolean, discountAmount: number, freeShipping: boolean, message: string, promo: object|null }}
   */
  static applyCoupon(code, subtotal = 0, shippingCost = 0) {
    if (!code || typeof code !== 'string') {
      return { valid: false, discountAmount: 0, freeShipping: false, message: 'Invalid promo code format.', promo: null };
    }

    const normalizedCode = code.trim().toUpperCase();
    const promo = PROMO_CODES[normalizedCode];

    if (!promo) {
      return { valid: false, discountAmount: 0, freeShipping: false, message: 'Promo code does not exist.', promo: null };
    }

    if (subtotal < promo.minSpend) {
      return {
        valid: false,
        discountAmount: 0,
        freeShipping: false,
        message: `Promo code requires a minimum spend of $${promo.minSpend.toFixed(2)}.`,
        promo: null
      };
    }

    let discountAmount = 0;
    let freeShipping = false;

    if (promo.type === 'PERCENTAGE') {
      discountAmount = (subtotal * promo.value) / 100;
      if (promo.maxDiscount > 0 && discountAmount > promo.maxDiscount) {
        discountAmount = promo.maxDiscount;
      }
    } else if (promo.type === 'FIXED') {
      discountAmount = Math.min(promo.value, subtotal);
    } else if (promo.type === 'FREESHIP') {
      freeShipping = true;
      discountAmount = shippingCost;
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    return {
      valid: true,
      discountAmount: discountAmount,
      freeShipping: freeShipping,
      message: `Promo code ${normalizedCode} applied successfully!`,
      promo: {
        code: normalizedCode,
        type: promo.type,
        value: promo.value
      }
    };
  }

  /**
   * Get all active public promo offers
   * @returns {Array<object>}
   */
  static getActiveOffers() {
    return Object.keys(PROMO_CODES).map(code => ({
      code,
      description: PROMO_CODES[code].type === 'PERCENTAGE' 
        ? `${PROMO_CODES[code].value}% OFF on orders over $${PROMO_CODES[code].minSpend}`
        : PROMO_CODES[code].type === 'FIXED'
        ? `$${PROMO_CODES[code].value} OFF on orders over $${PROMO_CODES[code].minSpend}`
        : `Free Express Shipping on all orders`,
      minSpend: PROMO_CODES[code].minSpend
    }));
  }
}

module.exports = DiscountEngine;
