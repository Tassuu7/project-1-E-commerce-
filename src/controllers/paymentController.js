/**
 * Payment Gateway REST API Controller
 * OmniCommerce Enterprise
 */

const PaymentService = require('../services/paymentService');

class PaymentController {
  static processPayment(req, res, next) {
    try {
      const { orderId, amount, paymentMethod } = req.body;
      const result = PaymentService.processPayment(orderId, amount, paymentMethod);
      res.status(200).json({
        success: true,
        message: 'Payment processed successfully.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  static getPaymentDetails(req, res, next) {
    try {
      const payment = PaymentService.getPaymentByOrderId(req.params.orderId);
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment record not found.' });
      }
      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
