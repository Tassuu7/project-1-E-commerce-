/**
 * Notifications Controller
 * OmniCommerce Enterprise
 */

const NotificationService = require('../services/notificationService');

class NotificationController {
  /**
   * GET /api/notifications - Get all notifications for current user
   */
  static getNotifications(req, res, next) {
    try {
      const notifications = NotificationService.getNotificationsForUser(req.user);
      const unreadCount = notifications.filter(n => !n.read).length;
      res.json({
        success: true,
        data: notifications,
        unreadCount
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/notifications/:id/read - Mark single notification as read
   */
  static markAsRead(req, res, next) {
    try {
      const notification = NotificationService.markAsRead(req.params.id, req.user);
      res.json({
        success: true,
        data: notification
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/notifications/read-all - Mark all notifications as read
   */
  static markAllAsRead(req, res, next) {
    try {
      const result = NotificationService.markAllAsRead(req.user);
      res.json({
        success: true,
        message: 'All notifications marked as read.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NotificationController;
