/**
 * Email & SMS Notification Dispatcher Mock Service
 * OmniCommerce Enterprise
 */

const logger = require('../utils/logger');

class NotificationService {
  static sendOrderConfirmation(order) {
    logger.info(`EMAIL SENT to ${order.customerEmail}: Order Confirmation ${order.orderNumber}`);
  }

  static sendOrderStatusUpdate(order) {
    logger.info(`EMAIL SENT to ${order.customerEmail}: Order Status Updated to ${order.orderStatus}`);
  }
}

module.exports = NotificationService;
