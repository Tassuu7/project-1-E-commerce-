/**
 * Shipping Label & Carrier Model Definition
 * OmniCommerce Enterprise
 */

const { generateUUID, generateTrackingNumber } = require('../utils/helpers');
const { SHIPPING_CARRIERS } = require('../config/constants');

class Shipping {
  constructor({
    id = generateUUID(),
    orderId,
    carrier = SHIPPING_CARRIERS.FEDEX,
    trackingNumber = generateTrackingNumber('FedEx'),
    shippingFee = 9.99,
    destination = {},
    status = 'LABEL_CREATED',
    estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt = new Date().toISOString()
  }) {
    this.id = id;
    this.orderId = orderId;
    this.carrier = carrier;
    this.trackingNumber = trackingNumber;
    this.shippingFee = parseFloat(shippingFee);
    this.destination = destination;
    this.status = status;
    this.estimatedDelivery = estimatedDelivery;
    this.createdAt = createdAt;
  }
}

module.exports = Shipping;
