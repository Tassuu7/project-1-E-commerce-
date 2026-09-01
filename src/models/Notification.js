/**
 * In-App Notification Entity
 * OmniCommerce Enterprise
 */

const crypto = require('crypto');

class Notification {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.userId = data.userId || null;
    this.role = data.role || 'CUSTOMER'; // 'CUSTOMER', 'ADMIN', 'DELIVERY_PERSON'
    this.type = data.type || 'SYSTEM';   // 'ORDER_PLACED', 'ORDER_PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'ASSIGNED', 'LOW_STOCK', etc.
    this.title = data.title || 'Notification';
    this.message = data.message || '';
    this.orderId = data.orderId || null;
    this.read = data.read || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  markRead() {
    this.read = true;
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      role: this.role,
      type: this.type,
      title: this.title,
      message: this.message,
      orderId: this.orderId,
      read: this.read,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Notification;
