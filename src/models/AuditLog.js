/**
 * Audit Log Model Definition
 * OmniCommerce Enterprise
 */

const { generateUUID } = require('../utils/helpers');

class AuditLog {
  constructor({
    id = generateUUID(),
    eventType,
    userId,
    userEmail,
    details = {},
    ipAddress = '127.0.0.1',
    createdAt = new Date().toISOString()
  }) {
    this.id = id;
    this.eventType = eventType;
    this.userId = userId;
    this.userEmail = userEmail;
    this.details = details;
    this.ipAddress = ipAddress;
    this.createdAt = createdAt;
  }
}

module.exports = AuditLog;
