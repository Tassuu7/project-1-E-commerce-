/**
 * Delivery Personnel & Courier Logistics Controller
 * OmniCommerce Enterprise
 */

const DeliveryService = require('../services/deliveryService');

class DeliveryController {
  /**
   * GET /api/delivery/orders - View all orders assigned to logged in delivery personnel
   */
  static getAssignedOrders(req, res, next) {
    try {
      const deliveries = DeliveryService.getDeliveriesForPersonnel(req.user.id);
      res.json({
        success: true,
        data: deliveries
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/delivery/orders/:id/accept - Accept an assignment
   */
  static acceptAssignment(req, res, next) {
    try {
      const assignment = DeliveryService.acceptDelivery(req.params.id, req.user.id);
      res.json({
        success: true,
        message: 'Delivery assignment accepted.',
        data: assignment
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/delivery/orders/:id/out-for-delivery - Mark out for delivery
   */
  static markOutForDelivery(req, res, next) {
    try {
      const result = DeliveryService.markOutForDelivery(req.params.id, req.user.id);
      res.json({
        success: true,
        message: 'Order marked as Out for Delivery.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/delivery/orders/:id/confirm - Confirm delivery
   */
  static confirmDelivery(req, res, next) {
    try {
      const { otp, notes } = req.body;
      const result = DeliveryService.confirmDelivery(req.params.id, req.user.id, { otp, notes });
      res.json({
        success: true,
        message: 'Delivery confirmed successfully.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/delivery/personnel - List all available delivery personnel (Admin only)
   */
  static getAllPersonnel(req, res, next) {
    try {
      const personnel = DeliveryService.getAllDeliveryPersonnel();
      res.json({
        success: true,
        data: personnel
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/delivery/assign - Assign delivery to order (Admin only)
   */
  static assignDelivery(req, res, next) {
    try {
      const { orderId, deliveryPersonId, notes } = req.body;
      const result = DeliveryService.assignDelivery({ orderId, deliveryPersonId, notes });
      res.json({
        success: true,
        message: 'Delivery assigned successfully.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DeliveryController;
