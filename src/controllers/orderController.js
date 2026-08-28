/**
 * Order REST API Controller
 * OmniCommerce Enterprise
 */

const OrderService = require('../services/orderService');

class OrderController {
  static checkout(req, res, next) {
    try {
      const { cartId, customerName, customerEmail, shippingAddress, paymentMethod } = req.body;
      const userId = req.user ? req.user.id : 'GUEST';
      const order = OrderService.createOrderFromCart({
        cartId,
        userId,
        customerName: customerName || (req.user ? req.user.name : 'Guest Customer'),
        customerEmail: customerEmail || (req.user ? req.user.email : 'guest@example.com'),
        shippingAddress,
        paymentMethod
      });

      res.status(201).json({
        success: true,
        message: 'Order placed successfully.',
        data: order
      });
    } catch (err) {
      next(err);
    }
  }

  static getOrderById(req, res, next) {
    try {
      const order = OrderService.getOrderById(req.params.id);
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (err) {
      next(err);
    }
  }

  static getUserOrders(req, res, next) {
    try {
      const userId = req.user ? req.user.id : req.query.userId;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required.' });
      }
      const orders = OrderService.getOrdersByUser(userId);
      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (err) {
      next(err);
    }
  }

  static getAllOrders(req, res, next) {
    try {
      const result = OrderService.getOrdersPaginated(req.query);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  }

  static updateStatus(req, res, next) {
    try {
      const { status, note } = req.body;
      const order = OrderService.updateOrderStatus(req.params.id, status, note);
      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}.`,
        data: order
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderController;
