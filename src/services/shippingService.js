/**
 * Shipping Label & Courier Dispatch Domain Service
 * OmniCommerce Enterprise
 */

const { shippingRepository } = require('../repositories');
const { SHIPPING_CARRIERS } = require('../config/constants');
const logger = require('../utils/logger');

class ShippingService {
  static createLabel(orderId, destination = {}) {
    const carrier = SHIPPING_CARRIERS.FEDEX;
    const shippingRecord = shippingRepository.create({
      orderId,
      carrier,
      destination,
      status: 'LABEL_CREATED'
    });

    logger.info(`Shipping label created for Order ${orderId}: ${shippingRecord.trackingNumber} (${carrier})`);
    return shippingRecord;
  }

  static getShippingByOrderId(orderId) {
    return shippingRepository.findOne(s => s.orderId === orderId);
  }

  static trackShipment(trackingNumber) {
    const shipping = shippingRepository.findOne(s => s.trackingNumber === trackingNumber);
    if (!shipping) {
      const err = new Error('Tracking number not found.');
      err.statusCode = 404;
      throw err;
    }

    return {
      trackingNumber: shipping.trackingNumber,
      carrier: shipping.carrier,
      status: shipping.status,
      estimatedDelivery: shipping.estimatedDelivery,
      events: [
        { status: 'LABEL_CREATED', location: 'Warehouse Facility', timestamp: shipping.createdAt },
        { status: 'IN_TRANSIT', location: 'Regional Sorting Hub', timestamp: new Date().toISOString() }
      ]
    };
  }
}

module.exports = ShippingService;
