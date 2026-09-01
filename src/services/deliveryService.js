/**
 * Delivery Assignment & Courier Fulfillment Service
 * OmniCommerce Enterprise
 */

const { deliveryAssignmentRepository, orderRepository, userRepository } = require('../repositories');
const NotificationService = require('./notificationService');
const { ORDER_STATUS, NOTIFICATION_TYPES } = require('../config/constants');

class DeliveryService {
  /**
   * Admin assigns an order to a delivery person
   */
  static assignDelivery({ orderId, deliveryPersonId, notes = '' }) {
    const order = orderRepository.findById(orderId);
    if (!order) {
      const err = new Error('Order not found.');
      err.statusCode = 404;
      throw err;
    }

    const deliveryPerson = userRepository.findById(deliveryPersonId);
    if (!deliveryPerson || deliveryPerson.role !== 'DELIVERY_PERSON') {
      const err = new Error('Invalid delivery personnel specified.');
      err.statusCode = 400;
      throw err;
    }

    // Check existing assignment
    let assignment = deliveryAssignmentRepository.findOne(a => a.orderId === orderId);
    if (assignment) {
      assignment.deliveryPersonId = deliveryPerson.id;
      assignment.deliveryPersonName = deliveryPerson.name;
      assignment.notes = notes;
      assignment.status = 'ASSIGNED';
      assignment.assignedAt = new Date().toISOString();
      deliveryAssignmentRepository.update(assignment.id, assignment);
    } else {
      assignment = deliveryAssignmentRepository.create({
        orderId: order.id,
        deliveryPersonId: deliveryPerson.id,
        deliveryPersonName: deliveryPerson.name,
        status: 'ASSIGNED',
        notes,
        assignedAt: new Date().toISOString()
      });
    }

    // Update order status
    order.orderStatus = ORDER_STATUS.ASSIGNED_TO_DELIVERY;
    order.deliveryPersonId = deliveryPerson.id;
    order.deliveryPersonName = deliveryPerson.name;
    order.updatedAt = new Date().toISOString();
    orderRepository.update(order.id, order);

    // Notify delivery personnel
    NotificationService.createNotification({
      userId: deliveryPerson.id,
      role: 'DELIVERY_PERSON',
      type: NOTIFICATION_TYPES.DELIVERY_ASSIGNED,
      title: 'New Delivery Assigned',
      message: `You have been assigned to deliver order ${order.orderNumber} to ${order.shippingAddress?.city || 'customer'}.`,
      orderId: order.id
    });

    // Notify customer
    NotificationService.createNotification({
      userId: order.userId,
      role: 'CUSTOMER',
      type: NOTIFICATION_TYPES.ORDER_DISPATCHED,
      title: 'Order Assigned for Dispatch',
      message: `Your order ${order.orderNumber} has been assigned to courier ${deliveryPerson.name} for dispatch.`,
      orderId: order.id
    });

    return { success: true, assignment, order };
  }

  /**
   * Get deliveries assigned to a specific delivery person
   */
  static getDeliveriesForPersonnel(deliveryPersonId) {
    const assignments = deliveryAssignmentRepository.findAll().filter(a => a.deliveryPersonId === deliveryPersonId);
    return assignments.map(a => {
      const order = orderRepository.findById(a.orderId);
      return {
        ...a,
        order: order ? {
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          grandTotal: order.grandTotal,
          items: order.items,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt
        } : null
      };
    }).sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));
  }

  /**
   * Delivery person accepts assignment
   */
  static acceptDelivery(assignmentId, deliveryPersonId) {
    const assignment = deliveryAssignmentRepository.findById(assignmentId);
    if (!assignment || assignment.deliveryPersonId !== deliveryPersonId) {
      const err = new Error('Forbidden. You are not assigned to this delivery.');
      err.statusCode = 403;
      throw err;
    }

    assignment.status = 'ACCEPTED';
    assignment.acceptedAt = new Date().toISOString();
    assignment.updatedAt = new Date().toISOString();
    deliveryAssignmentRepository.update(assignment.id, assignment);

    return assignment;
  }

  /**
   * Delivery person marks order Out for Delivery
   */
  static markOutForDelivery(assignmentId, deliveryPersonId) {
    const assignment = deliveryAssignmentRepository.findById(assignmentId);
    if (!assignment || assignment.deliveryPersonId !== deliveryPersonId) {
      const err = new Error('Forbidden. You are not assigned to this delivery.');
      err.statusCode = 403;
      throw err;
    }

    assignment.status = 'OUT_FOR_DELIVERY';
    assignment.outForDeliveryAt = new Date().toISOString();
    assignment.updatedAt = new Date().toISOString();
    deliveryAssignmentRepository.update(assignment.id, assignment);

    const order = orderRepository.findById(assignment.orderId);
    if (order) {
      order.orderStatus = ORDER_STATUS.OUT_FOR_DELIVERY;
      order.updatedAt = new Date().toISOString();
      orderRepository.update(order.id, order);

      // Notify customer that courier is en route
      NotificationService.createNotification({
        userId: order.userId,
        role: 'CUSTOMER',
        type: NOTIFICATION_TYPES.OUT_FOR_DELIVERY,
        title: 'Out for Delivery!',
        message: `Your package ${order.orderNumber} is out for delivery today with courier ${assignment.deliveryPersonName}.`,
        orderId: order.id
      });
    }

    return { assignment, order };
  }

  /**
   * Delivery person confirms successful delivery
   */
  static confirmDelivery(assignmentId, deliveryPersonId, { otp = null, notes = 'Delivered to customer' } = {}) {
    const assignment = deliveryAssignmentRepository.findById(assignmentId);
    if (!assignment || assignment.deliveryPersonId !== deliveryPersonId) {
      const err = new Error('Forbidden. You are not assigned to this delivery.');
      err.statusCode = 403;
      throw err;
    }

    assignment.status = 'DELIVERED';
    assignment.deliveredAt = new Date().toISOString();
    assignment.notes = notes;
    assignment.updatedAt = new Date().toISOString();
    deliveryAssignmentRepository.update(assignment.id, assignment);

    const order = orderRepository.findById(assignment.orderId);
    if (order) {
      order.orderStatus = ORDER_STATUS.DELIVERED;
      order.deliveredAt = new Date().toISOString();
      if (order.paymentMethod === 'CASH_ON_DELIVERY') {
        order.paymentStatus = 'CAPTURED';
      }
      order.updatedAt = new Date().toISOString();
      orderRepository.update(order.id, order);

      // Notify customer that package was delivered
      NotificationService.createNotification({
        userId: order.userId,
        role: 'CUSTOMER',
        type: NOTIFICATION_TYPES.DELIVERED,
        title: 'Package Delivered Successfully',
        message: `Your order ${order.orderNumber} has been delivered. Thank you for shopping with EverydayStore!`,
        orderId: order.id
      });
    }

    return { assignment, order };
  }

  /**
   * Get all registered delivery personnel (for admin assignment dropdown)
   */
  static getAllDeliveryPersonnel() {
    return userRepository.findAll().filter(u => u.role === 'DELIVERY_PERSON').map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || 'N/A'
    }));
  }
}

module.exports = DeliveryService;
