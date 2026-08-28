/**
 * Mock Payment Gateway Adapter Domain Service
 * OmniCommerce Enterprise
 */

const { paymentRepository } = require('../repositories');
const { PAYMENT_STATUS, PAYMENT_METHODS } = require('../config/constants');
const logger = require('../utils/logger');

class PaymentService {
  static processPayment(orderId, amount, paymentMethod = PAYMENT_METHODS.STRIPE_CREDIT_CARD) {
    logger.info(`Processing mock payment for Order ${orderId}: $${amount} via ${paymentMethod}`);

    // Mock Gateway authorization check
    const isSuccess = true; // Simulated successful capture

    const status = isSuccess ? PAYMENT_STATUS.CAPTURED : PAYMENT_STATUS.FAILED;

    const paymentRecord = paymentRepository.create({
      orderId,
      amount,
      paymentMethod,
      status,
      rawResponse: {
        gateway: paymentMethod,
        authCode: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
        processedAt: new Date().toISOString()
      }
    });

    return {
      success: isSuccess,
      transactionId: paymentRecord.transactionId,
      status: paymentRecord.status
    };
  }

  static getPaymentByOrderId(orderId) {
    return paymentRepository.findOne(p => p.orderId === orderId);
  }
}

module.exports = PaymentService;
