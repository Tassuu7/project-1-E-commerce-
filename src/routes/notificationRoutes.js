/**
 * Notifications API Routes
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, NotificationController.getNotifications);
router.patch('/read-all', requireAuth, NotificationController.markAllAsRead);
router.patch('/:id/read', requireAuth, NotificationController.markAsRead);

module.exports = router;
