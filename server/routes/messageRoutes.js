const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

// إرسال رسالة
router.post('/', auth, messageController.sendMessage);

// الحصول على رسائل الفريق
router.get('/team/:teamId', auth, messageController.getTeamMessages);

// تعديل رسالة
router.put('/:messageId', auth, messageController.editMessage);

// حذف رسالة
router.delete('/:messageId', auth, messageController.deleteMessage);

// إضافة رد فعل
router.post('/:messageId/reaction', auth, messageController.addReaction);

// تثبيت/إلغاء تثبيت رسالة
router.patch('/:messageId/pin', auth, messageController.togglePin);

module.exports = router;
