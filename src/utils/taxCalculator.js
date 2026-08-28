/**
 * Multi-Jurisdiction Tax Calculation Engine
 * OmniCommerce Enterprise
 */

const config = require('../config');

class TaxCalculator {
  /**
   * Get the applicable tax rate for a state or region code
   * @param {string} regionCode 2-letter state or country code (e.g., 'CA', 'NY', 'IN')
   * @returns {number} Decimal tax rate (e.g., 0.0925)
   */
  static getTaxRate(regionCode) {
    if (!regionCode) return config.tax.defaultRate;
    const normalizedRegion = regionCode.trim().toUpperCase();
    return config.tax.regionalRates[normalizedRegion] || config.tax.defaultRate;
  }

  /**
   * Calculate subtotal tax amount for cart items
   * @param {Array<{ price: number, quantity: number, taxExempt?: boolean }>} items 
   * @param {string} regionCode 
   * @returns {{ taxRate: number, totalTax: number, taxableSubtotal: number }}
   */
  static calculateCartTax(items = [], regionCode = 'CA') {
    const rate = this.getTaxRate(regionCode);
    let taxableSubtotal = 0;

    for (const item of items) {
      if (!item.taxExempt) {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        taxableSubtotal += itemTotal;
      }
    }

    const rawTax = taxableSubtotal * rate;
    const totalTax = Math.round(rawTax * 100) / 100; // Round to 2 decimal places

    return {
      taxRate: rate,
      totalTax: totalTax,
      taxableSubtotal: Math.round(taxableSubtotal * 100) / 100
    };
  }
}

module.exports = TaxCalculator;
