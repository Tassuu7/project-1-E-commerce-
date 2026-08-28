/**
 * Admin Management & Audit REST API Controller
 * OmniCommerce Enterprise
 */

const InventoryService = require('../services/inventoryService');
const { getAuditLogs } = require('../middleware/auditLogger');
const { userRepository } = require('../repositories');

class AdminController {
  static getLowStockAlerts(req, res, next) {
    try {
      const alerts = InventoryService.getLowStockAlerts();
      res.status(200).json({
        success: true,
        data: alerts
      });
    } catch (err) {
      next(err);
    }
  }

  static getAuditLogs(req, res, next) {
    try {
      const logs = getAuditLogs();
      res.status(200).json({
        success: true,
        data: logs
      });
    } catch (err) {
      next(err);
    }
  }

  static getUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const result = userRepository.findPaginated(null, page, limit);
      res.status(200).json({
        success: true,
        data: result.data.map(u => u.toJSON()),
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdminController;
