/**
 * Real-Time Notification Domain Service
 * OmniCommerce Enterprise
 */

const { notificationRepository } = require('../repositories');

class NotificationService {
  static createNotification({ userId, role = 'CUSTOMER', type = 'SYSTEM', title, message, orderId = null }) {
    const notif = notificationRepository.create({
      userId,
      role,
      type,
      title,
      message,
      orderId,
      read: false
    });
    return notif;
  }

  static getNotificationsForUser(user) {
    if (!user) return [];
    
    // Fetch notifications directly addressed to user ID or addressed to user's role
    const all = notificationRepository.findAll();
    return all.filter(n => {
      if (n.userId && n.userId === user.id) return true;
      if (!n.userId && n.role === user.role) return true;
      return false;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static markAsRead(notificationId, user) {
    const notif = notificationRepository.findById(notificationId);
    if (!notif) {
      const err = new Error('Notification not found.');
      err.statusCode = 404;
      throw err;
    }

    if (notif.userId && notif.userId !== user.id && user.role !== 'ADMIN') {
      const err = new Error('Forbidden. You do not own this notification.');
      err.statusCode = 403;
      throw err;
    }

    notif.read = true;
    notif.updatedAt = new Date().toISOString();
    return notificationRepository.update(notif.id, notif);
  }

  static markAllAsRead(user) {
    const notifs = this.getNotificationsForUser(user);
    notifs.forEach(n => {
      n.read = true;
      n.updatedAt = new Date().toISOString();
      notificationRepository.update(n.id, n);
    });
    return { success: true, count: notifs.length };
  }

  static getUnreadCount(user) {
    const list = this.getNotificationsForUser(user);
    return list.filter(n => !n.read).length;
  }
}

module.exports = NotificationService;
