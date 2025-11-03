const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// الحصول على الإشعارات
router.get('/', auth, notificationController.getNotifications);

// تحديد إشعار كمقروء
router.patch('/:id/read', auth, notificationController.markAsRead);

// تحديد جميع الإشعارات كمقروءة
router.patch('/read-all', auth, notificationController.markAllAsRead);

// حذف إشعار
router.delete('/:id', auth, notificationController.deleteNotification);

// حذف جميع الإشعارات المقروءة
router.delete('/clear/read', auth, notificationController.clearReadNotifications);

module.exports = router;
