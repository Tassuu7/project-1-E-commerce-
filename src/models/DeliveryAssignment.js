/**
 * Delivery Assignment Entity
 * OmniCommerce Enterprise
 */

const crypto = require('crypto');

class DeliveryAssignment {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.orderId = data.orderId || null;
    this.deliveryPersonId = data.deliveryPersonId || null;
    this.deliveryPersonName = data.deliveryPersonName || 'Courier';
    this.status = data.status || 'ASSIGNED'; // 'ASSIGNED', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED'
    this.assignedAt = data.assignedAt || new Date().toISOString();
    this.acceptedAt = data.acceptedAt || null;
    this.outForDeliveryAt = data.outForDeliveryAt || null;
    this.deliveredAt = data.deliveredAt || null;
    this.notes = data.notes || '';
    this.deliveryOtp = data.deliveryOtp || Math.floor(1000 + Math.random() * 9000).toString();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      orderId: this.orderId,
      deliveryPersonId: this.deliveryPersonId,
      deliveryPersonName: this.deliveryPersonName,
      status: this.status,
      assignedAt: this.assignedAt,
      acceptedAt: this.acceptedAt,
      outForDeliveryAt: this.outForDeliveryAt,
      deliveredAt: this.deliveredAt,
      notes: this.notes,
      deliveryOtp: this.deliveryOtp,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = DeliveryAssignment;
