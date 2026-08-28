/**
 * Admin Management Router Definitions
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { requireRole } = require('../middleware/auth');
const { USER_ROLES } = require('../config/constants');

router.use(requireRole(USER_ROLES.ADMIN));

router.get('/alerts/low-stock', AdminController.getLowStockAlerts);
router.get('/audit-logs', AdminController.getAuditLogs);
router.get('/users', AdminController.getUsers);

module.exports = router;
