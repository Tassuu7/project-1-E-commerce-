/**
 * Discount & Promo Code Engine Unit Tests
 * OmniCommerce Enterprise
 */

const DiscountEngine = require('../src/utils/discountEngine');

function testDiscountEngine() {
  console.log('Testing DiscountEngine...');

  const result1 = DiscountEngine.applyCoupon('WELCOME10', 100, 9.99);
  console.assert(result1.valid === true, 'Expected WELCOME10 coupon to be valid');
  console.assert(result1.discountAmount === 10.00, `Expected $10 discount, got ${result1.discountAmount}`);

  const result2 = DiscountEngine.applyCoupon('SUMMER20', 30, 9.99);
  console.assert(result2.valid === false, 'Expected SUMMER20 coupon to fail minSpend check');

  const result3 = DiscountEngine.applyCoupon('INVALID_CODE', 100, 9.99);
  console.assert(result3.valid === false, 'Expected invalid code to fail');

  console.log('DiscountEngine unit tests PASSED!');
}

module.exports = testDiscountEngine;
