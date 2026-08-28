/**
 * General Helper Utilities
 * OmniCommerce Enterprise
 */

const crypto = require('crypto');

function generateUUID() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateSKU(category = 'GEN', name = 'ITEM') {
  const catPrefix = category.slice(0, 3).toUpperCase();
  const namePrefix = name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${catPrefix}-${namePrefix}-${randomDigits}`;
}

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function formatCurrency(amount, currency = 'USD') {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(num);
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'omnicommerce_salt_2026').digest('hex');
}

function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ORD-${dateStr}-${randomHex}`;
}

function generateTrackingNumber(carrier = 'FedEx') {
  const prefix = carrier.slice(0, 2).toUpperCase();
  const digits = Math.floor(100000000000 + Math.random() * 900000000000);
  return `${prefix}${digits}`;
}

module.exports = {
  generateUUID,
  generateSKU,
  slugify,
  formatCurrency,
  hashPassword,
  generateOrderNumber,
  generateTrackingNumber
};
