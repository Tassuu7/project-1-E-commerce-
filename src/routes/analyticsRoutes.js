/**
 * Analytics Router Definitions
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const { requireRole } = require('../middleware/auth');
const { USER_ROLES } = require('../config/constants');

router.get('/metrics', requireRole(USER_ROLES.ADMIN, USER_ROLES.SELLER), AnalyticsController.getMetrics);

module.exports = router;
