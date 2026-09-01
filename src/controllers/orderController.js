/**
 * Order REST API Controller
 * OmniCommerce Enterprise
 */

const OrderService = require('../services/orderService');
const { orderRepository } = require('../repositories');

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
      const order = OrderService.getOrderById(req.params.id, req.user);
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
      const user = req.user;
      let orders = [];
      
      if (user && user.id && user.id !== 'GUEST') {
        orders = orderRepository.findAll(o => 
          o.userId === user.id || 
          (o.customerEmail && user.email && o.customerEmail.toLowerCase() === user.email.toLowerCase())
        );
      } else if (req.query.email) {
        orders = orderRepository.findAll(o => 
          o.customerEmail && o.customerEmail.toLowerCase() === req.query.email.toLowerCase()
        );
      } else {
        orders = orderRepository.findAll();
      }

      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
      const order = OrderService.updateOrderStatus(req.params.id, status, note, req.user);
      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}.`,
        data: order
      });
    } catch (err) {
      next(err);
    }
  }

  static cancelOrder(req, res, next) {
    try {
      const { reason } = req.body;
      const order = OrderService.cancelOrder(req.params.id, req.user, reason);
      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully.',
        data: order
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderController;
