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
const { ORDER_STATUS, PAYMENT_STATUS, NOTIFICATION_TYPES } = require('../config/constants');

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
      orderStatus: ORDER_STATUS.PAID,
      paymentStatus: PAYMENT_STATUS.CAPTURED
    };

    const order = orderRepository.create(orderData);
    logger.info(`Order created: ${order.orderNumber} ($${order.grandTotal})`);

    // Generate Shipping Tracking Label
    const shippingRecord = ShippingService.createLabel(order.id, shippingAddress);
    order.trackingNumber = shippingRecord.trackingNumber;
    orderRepository.update(order.id, { trackingNumber: order.trackingNumber });

    // Send In-App Notifications
    NotificationService.createNotification({
      userId: order.userId,
      role: 'CUSTOMER',
      type: NOTIFICATION_TYPES.ORDER_PLACED,
      title: 'Order Confirmed',
      message: `Your order ${order.orderNumber} ($${order.grandTotal.toFixed(2)}) has been placed and confirmed.`,
      orderId: order.id
    });

    NotificationService.createNotification({
      userId: null,
      role: 'ADMIN',
      type: NOTIFICATION_TYPES.ORDER_PLACED,
      title: 'New Customer Order Placed',
      message: `Order ${order.orderNumber} received from ${customerName} ($${order.grandTotal.toFixed(2)}).`,
      orderId: order.id
    });

    // Clear cart items
    cartRepository.update(cartId, { items: [], appliedCoupon: null });

    return order;
  }

  static getOrderById(orderId, user = null) {
    const order = orderRepository.findById(orderId);
    if (!order) {
      const err = new Error('Order not found.');
      err.statusCode = 404;
      throw err;
    }

    // Object-level authorization checks
    if (user) {
      if (user.role === 'CUSTOMER') {
        const isOwner = (order.userId && order.userId === user.id) || (order.customerEmail && order.customerEmail.toLowerCase() === user.email.toLowerCase());
        if (!isOwner) {
          const err = new Error('Forbidden. You are not authorized to view this order.');
          err.statusCode = 403;
          throw err;
        }
      } else if (user.role === 'DELIVERY_PERSON') {
        if (order.deliveryPersonId && order.deliveryPersonId !== user.id) {
          const err = new Error('Forbidden. You are not assigned to this order.');
          err.statusCode = 403;
          throw err;
        }
      }
    }

    return order;
  }

  static getOrdersByUser(user) {
    if (!user) return [];
    return orderRepository.findAll(o => {
      return (o.userId && o.userId === user.id) || (o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase());
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static getOrdersPaginated({ status, page = 1, limit = 20 } = {}) {
    const predicate = status && status !== 'ALL' ? (o => o.orderStatus === status) : null;
    return orderRepository.findPaginated(predicate, parseInt(page, 10), parseInt(limit, 10));
  }

  static updateOrderStatus(orderId, newStatus, note = '', user = null) {
    const order = this.getOrderById(orderId);
    order.transitionTo(newStatus, note);

    if (newStatus === ORDER_STATUS.CANCELLED) {
      InventoryService.restoreStock(order.items);
    }

    orderRepository.update(order.id, {
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      updatedAt: new Date().toISOString()
    });

    logger.info(`Order ${order.orderNumber} status updated to ${newStatus}`);

    // Create notifications based on new status
    if (newStatus === ORDER_STATUS.PROCESSING) {
      NotificationService.createNotification({
        userId: order.userId,
        role: 'CUSTOMER',
        type: NOTIFICATION_TYPES.ORDER_PACKED,
        title: 'Order Processing & Packing',
        message: `Your order ${order.orderNumber} is being processed and packaged at the warehouse.`,
        orderId: order.id
      });
    } else if (newStatus === ORDER_STATUS.DELIVERED) {
      NotificationService.createNotification({
        userId: order.userId,
        role: 'CUSTOMER',
        type: NOTIFICATION_TYPES.DELIVERED,
        title: 'Order Delivered',
        message: `Your order ${order.orderNumber} has been delivered. Thank you!`,
        orderId: order.id
      });
    }

    return order;
  }

  static cancelOrder(orderId, user, reason = 'Customer requested cancellation') {
    const order = this.getOrderById(orderId, user);
    
    if (order.orderStatus === ORDER_STATUS.DELIVERED || order.orderStatus === ORDER_STATUS.OUT_FOR_DELIVERY) {
      const err = new Error('Cannot cancel an order that is already out for delivery or delivered.');
      err.statusCode = 400;
      throw err;
    }

    return this.updateOrderStatus(order.id, ORDER_STATUS.CANCELLED, reason, user);
  }
}

module.exports = OrderService;
