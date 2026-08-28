/**
 * Data DTO Request Validator Engine
 * OmniCommerce Enterprise
 */

class Validator {
  static isEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  static isString(val, minLength = 1) {
    return typeof val === 'string' && val.trim().length >= minLength;
  }

  static isNumber(val, min = -Infinity, max = Infinity) {
    if (typeof val !== 'number' || isNaN(val)) return false;
    return val >= min && val <= max;
  }

  static validateRegistration(data = {}) {
    const errors = [];
    if (!this.isString(data.name, 2)) errors.push('Name must be at least 2 characters long.');
    if (!this.isEmail(data.email)) errors.push('Valid email address is required.');
    if (!this.isString(data.password, 6)) errors.push('Password must be at least 6 characters long.');
    return { valid: errors.length === 0, errors };
  }

  static validateProduct(data = {}) {
    const errors = [];
    if (!this.isString(data.name, 3)) errors.push('Product name must be at least 3 characters long.');
    if (!this.isNumber(data.price, 0.01)) errors.push('Product price must be a positive number greater than 0.');
    if (!this.isString(data.category, 2)) errors.push('Category is required.');
    if (!this.isNumber(data.stock, 0)) errors.push('Stock must be a non-negative integer.');
    return { valid: errors.length === 0, errors };
  }

  static validateCheckout(data = {}) {
    const errors = [];
    if (!data.shippingAddress || typeof data.shippingAddress !== 'object') {
      errors.push('Shipping address details are required.');
    } else {
      if (!this.isString(data.shippingAddress.street, 3)) errors.push('Street address is required.');
      if (!this.isString(data.shippingAddress.city, 2)) errors.push('City is required.');
      if (!this.isString(data.shippingAddress.state, 2)) errors.push('State/Region is required.');
      if (!this.isString(data.shippingAddress.zip, 3)) errors.push('ZIP/Postal Code is required.');
    }

    if (!this.isString(data.paymentMethod, 2)) errors.push('Payment method selection is required.');
    return { valid: errors.length === 0, errors };
  }
}

module.exports = Validator;
