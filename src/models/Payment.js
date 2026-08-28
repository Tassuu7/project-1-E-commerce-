/**
 * Payment Transaction Model Definition
 * OmniCommerce Enterprise
 */

const { generateUUID } = require('../utils/helpers');
const { PAYMENT_STATUS } = require('../config/constants');

class Payment {
  constructor({
    id = generateUUID(),
    orderId,
    amount,
    currency = 'USD',
    paymentMethod,
    status = PAYMENT_STATUS.PENDING,
    transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    rawResponse = {},
    createdAt = new Date().toISOString()
  }) {
    this.id = id;
    this.orderId = orderId;
    this.amount = parseFloat(amount);
    this.currency = currency;
    this.paymentMethod = paymentMethod;
    this.status = status;
    this.transactionId = transactionId;
    this.rawResponse = rawResponse;
    this.createdAt = createdAt;
  }
}

module.exports = Payment;
