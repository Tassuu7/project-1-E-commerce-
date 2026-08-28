/**
 * Order Lifecycle & Management Domain Service
 * OmniCommerce Enterprise
 */

const { orderRepository, cartRepository } = require('../repositories');
const CartService = require('./cartService');
const InventoryService = require('./inventoryService');
const PaymentService = require('./paymentService');
const ShippingService = require('./shippingService');
const NotificationService = require('./notificationService');
const Validator = require('../utils/validator');
const logger = require('../utils/logger');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../config/constants');

class OrderService {
  static createOrderFromCart({ cartId, userId, customerName, customerEmail, shippingAddress, paymentMethod }) {
    const checkoutValidation = Validator.validateCheckout({ shippingAddress, paymentMethod });
    if (!checkoutValidation.valid) {
      const err = new Error('Checkout validation failed.');
      err.statusCode = 400;
      err.errors = checkoutValidation.errors;
      throw err;
    }

    const cartSummary = CartService.getCartSummary(cartId, shippingAddress.state);
    if (!cartSummary.items || cartSummary.items.length === 0) {
      const err = new Error('Cannot create an order with an empty cart.');
      err.statusCode = 400;
      throw err;
    }

    // Reserve stock
    InventoryService.reserveStock(cartSummary.items);

    // Create Order Record
    const orderData = {
      userId: userId || 'GUEST',
      customerName,
      customerEmail,
      items: cartSummary.items,
      subtotal: cartSummary.subtotal,
      discountAmount: cartSummary.discountAmount,
      taxAmount: cartSummary.taxAmount,
      shippingAmount: cartSummary.shippingAmount,
      grandTotal: cartSummary.grandTotal,
      shippingAddress,
      paymentMethod,
      orderStatus: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING
    };

    const order = orderRepository.create(orderData);
    logger.info(`Order created: ${order.orderNumber} ($${order.grandTotal})`);

    // Process Payment Simulation
    try {
      const paymentResult = PaymentService.processPayment(order.id, order.grandTotal, paymentMethod);
      if (paymentResult.success) {
        order.transitionTo(ORDER_STATUS.PAID, 'Payment authorized and captured successfully.');
        order.paymentStatus = PAYMENT_STATUS.CAPTURED;
        orderRepository.update(order.id, {
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          statusHistory: order.statusHistory
        });

        // Generate Shipping Label
        const shippingRecord = ShippingService.createLabel(order.id, shippingAddress);
        order.trackingNumber = shippingRecord.trackingNumber;
        orderRepository.update(order.id, { trackingNumber: order.trackingNumber });

        // Dispatch Notification
        NotificationService.sendOrderConfirmation(order);
      }
    } catch (payErr) {
      logger.error(`Payment failed for order ${order.orderNumber}:`, payErr.message);
      // Retain order as PENDING so user can retry payment
    }

    // Clear cart items
    cartRepository.update(cartId, { items: [], appliedCoupon: null });

    return order;
  }

  static getOrderById(orderId) {
    const order = orderRepository.findById(orderId);
    if (!order) {
      const err = new Error('Order not found.');
      err.statusCode = 404;
      throw err;
    }
    return order;
  }

  static getOrdersByUser(userId) {
    return orderRepository.findAll(o => o.userId === userId);
  }

  static getOrdersPaginated({ status, page = 1, limit = 10 } = {}) {
    const predicate = status && status !== 'ALL' ? (o => o.orderStatus === status) : null;
    return orderRepository.findPaginated(predicate, parseInt(page, 10), parseInt(limit, 10));
  }

  static updateOrderStatus(orderId, newStatus, note = '') {
    const order = this.getOrderById(orderId);
    order.transitionTo(newStatus, note);

    if (newStatus === ORDER_STATUS.CANCELLED) {
      InventoryService.restoreStock(order.items);
    }

    orderRepository.update(order.id, {
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory
    });

    logger.info(`Order ${order.orderNumber} status updated to ${newStatus}`);
    NotificationService.sendOrderStatusUpdate(order);
    return order;
  }
}

module.exports = OrderService;
