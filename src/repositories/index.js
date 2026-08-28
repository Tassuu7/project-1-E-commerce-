/**
 * Repositories Registry Initialization
 * OmniCommerce Enterprise
 */

const BaseRepository = require('./baseRepository');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Shipping = require('../models/Shipping');
const Review = require('../models/Review');
const AnalyticsSnapshot = require('../models/Analytics');
const AuditLog = require('../models/AuditLog');

const userRepository = new BaseRepository('users', User);
const productRepository = new BaseRepository('products', Product);
const categoryRepository = new BaseRepository('categories', Category);
const cartRepository = new BaseRepository('carts', Cart);
const orderRepository = new BaseRepository('orders', Order);
const paymentRepository = new BaseRepository('payments', Payment);
const shippingRepository = new BaseRepository('shipping', Shipping);
const reviewRepository = new BaseRepository('reviews', Review);
const analyticsRepository = new BaseRepository('analytics', AnalyticsSnapshot);
const auditLogRepository = new BaseRepository('audit_logs', AuditLog);

module.exports = {
  userRepository,
  productRepository,
  categoryRepository,
  cartRepository,
  orderRepository,
  paymentRepository,
  shippingRepository,
  reviewRepository,
  analyticsRepository,
  auditLogRepository
};
