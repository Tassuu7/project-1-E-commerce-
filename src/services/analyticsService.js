/**
 * Business Analytics & Reporting Domain Service
 * OmniCommerce Enterprise
 */

const { orderRepository, userRepository, productRepository } = require('../repositories');

class AnalyticsService {
  static getDashboardMetrics() {
    const orders = orderRepository.findAll();
    const users = userRepository.findAll();
    const products = productRepository.findAll();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = users.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Recent 5 orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Sales by Category
    const categorySales = {};
    for (const order of orders) {
      for (const item of order.items || []) {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod ? prod.category : 'General';
        categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
      }
    }

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalCustomers,
      totalProducts: products.length,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      recentOrders,
      categorySales
    };
  }
}

module.exports = AnalyticsService;
