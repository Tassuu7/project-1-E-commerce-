/**
 * Tax Engine Unit Tests
 * OmniCommerce Enterprise
 */

const TaxCalculator = require('../src/utils/taxCalculator');

function testTaxEngine() {
  console.log('Testing TaxCalculator engine...');

  const rateCA = TaxCalculator.getTaxRate('CA');
  console.assert(rateCA === 0.0925, `Expected CA tax rate 0.0925, got ${rateCA}`);

  const rateNY = TaxCalculator.getTaxRate('NY');
  console.assert(rateNY === 0.08875, `Expected NY tax rate 0.08875, got ${rateNY}`);

  const cartItems = [
    { price: 100.00, quantity: 2 },
    { price: 50.00, quantity: 1 }
  ];

  const result = TaxCalculator.calculateCartTax(cartItems, 'CA');
  console.assert(result.taxableSubtotal === 250.00, `Expected subtotal 250.00, got ${result.taxableSubtotal}`);
  console.assert(result.totalTax === 23.13, `Expected tax 23.13, got ${result.totalTax}`);

  console.log('TaxCalculator unit tests PASSED!');
}

module.exports = testTaxEngine;
