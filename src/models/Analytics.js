/**
 * Analytics Metric Snapshot Model Definition
 * OmniCommerce Enterprise
 */

const { generateUUID } = require('../utils/helpers');

class AnalyticsSnapshot {
  constructor({
    id = generateUUID(),
    date = new Date().toISOString().slice(0, 10),
    totalRevenue = 0,
    totalOrders = 0,
    totalCustomers = 0,
    averageOrderValue = 0,
    topCategories = [],
    createdAt = new Date().toISOString()
  }) {
    this.id = id;
    this.date = date;
    this.totalRevenue = parseFloat(totalRevenue);
    this.totalOrders = parseInt(totalOrders, 10);
    this.totalCustomers = parseInt(totalCustomers, 10);
    this.averageOrderValue = parseFloat(averageOrderValue);
    this.topCategories = topCategories;
    this.createdAt = createdAt;
  }
}

module.exports = AnalyticsSnapshot;
