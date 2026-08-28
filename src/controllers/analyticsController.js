/**
 * Analytics REST API Controller
 * OmniCommerce Enterprise
 */

const AnalyticsService = require('../services/analyticsService');

class AnalyticsController {
  static getMetrics(req, res, next) {
    try {
      const metrics = AnalyticsService.getDashboardMetrics();
      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AnalyticsController;
