/**
 * Order Data Model Definition with State Machine Capabilities
 * OmniCommerce Enterprise
 */

const { generateUUID, generateOrderNumber } = require('../utils/helpers');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../config/constants');

class Order {
  constructor({
    id = generateUUID(),
    orderNumber = generateOrderNumber(),
    userId,
    customerName,
    customerEmail,
    items = [],
    subtotal = 0,
    discountAmount = 0,
    taxAmount = 0,
    shippingAmount = 0,
    grandTotal = 0,
    shippingAddress = {},
    paymentMethod = 'STRIPE_CREDIT_CARD',
    paymentStatus = PAYMENT_STATUS.PENDING,
    orderStatus = ORDER_STATUS.PENDING,
    trackingNumber = null,
    deliveryPersonId = null,
    deliveryPersonName = null,
    deliveredAt = null,
    statusHistory = [],
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.orderNumber = orderNumber;
    this.userId = userId;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.items = items;
    this.subtotal = parseFloat(subtotal || 0);
    this.discountAmount = parseFloat(discountAmount || 0);
    this.taxAmount = parseFloat(taxAmount || 0);
    this.shippingAmount = parseFloat(shippingAmount || 0);
    this.grandTotal = parseFloat(grandTotal || 0);
    this.shippingAddress = shippingAddress;
    this.paymentMethod = paymentMethod;
    this.paymentStatus = paymentStatus;
    this.orderStatus = orderStatus || ORDER_STATUS.PENDING;
    this.trackingNumber = trackingNumber;
    this.deliveryPersonId = deliveryPersonId;
    this.deliveryPersonName = deliveryPersonName;
    this.deliveredAt = deliveredAt;
    this.statusHistory = statusHistory.length ? statusHistory : [
      { status: this.orderStatus, timestamp: createdAt, note: 'Order created.' }
    ];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static getValidTransitions(currentStatus) {
    const transitions = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PENDING_PAYMENT]: [ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PAID]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING, ORDER_STATUS.PACKED, ORDER_STATUS.ASSIGNED_TO_DELIVERY, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED],
      [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.PACKED, ORDER_STATUS.READY_FOR_DISPATCH, ORDER_STATUS.ASSIGNED_TO_DELIVERY, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.PACKED, ORDER_STATUS.READY_FOR_DISPATCH, ORDER_STATUS.ASSIGNED_TO_DELIVERY, ORDER_STATUS.SHIPPED, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PACKED]: [ORDER_STATUS.READY_FOR_DISPATCH, ORDER_STATUS.ASSIGNED_TO_DELIVERY, ORDER_STATUS.SHIPPED, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.READY_FOR_DISPATCH]: [ORDER_STATUS.ASSIGNED_TO_DELIVERY, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.ASSIGNED_TO_DELIVERY]: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED, ORDER_STATUS.REFUNDED],
      [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.RETURN_REQUESTED, ORDER_STATUS.REFUNDED],
      [ORDER_STATUS.CANCELLED]: [],
      [ORDER_STATUS.REFUNDED]: [],
      [ORDER_STATUS.RETURN_REQUESTED]: [ORDER_STATUS.RETURNED, ORDER_STATUS.REFUNDED],
      [ORDER_STATUS.RETURNED]: [ORDER_STATUS.REFUNDED]
    };
    return transitions[currentStatus] || [];
  }

  canTransitionTo(newStatus) {
    const allowed = Order.getValidTransitions(this.orderStatus);
    return allowed.includes(newStatus);
  }

  transitionTo(newStatus, note = '') {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(`Invalid order status transition from ${this.orderStatus} to ${newStatus}.`);
    }
    this.orderStatus = newStatus;
    this.updatedAt = new Date().toISOString();
    this.statusHistory.push({
      status: newStatus,
      timestamp: this.updatedAt,
      note: note || `Order status updated to ${newStatus}`
    });
  }
}

module.exports = Order;
