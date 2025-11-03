const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Middleware للتحقق من صلاحية الإدارة
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'supervisor') {
        return res.status(403).json({ message: "ليس لديك صلاحية الوصول" });
    }
    next();
};

// الإحصائيات
router.get('/statistics', auth, isAdmin, adminController.getStatistics);

// إدارة المستخدمين
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.patch('/users/:userId/status', auth, isAdmin, adminController.updateUserStatus);
router.delete('/users/:userId', auth, isAdmin, adminController.deleteUser);

// إدارة الفرق
router.get('/teams', auth, isAdmin, adminController.getAllTeams);
router.patch('/teams/:teamId/approve', auth, isAdmin, adminController.approveTeam);
router.delete('/teams/:teamId', auth, isAdmin, adminController.deleteTeam);

// إدارة التقييمات
router.get('/ratings/flagged', auth, isAdmin, adminController.getFlaggedRatings);
router.post('/ratings/:ratingId/verify', auth, isAdmin, adminController.verifyRating);

// الإشعارات الجماعية
router.post('/broadcast', auth, isAdmin, adminController.sendBroadcastNotification);

// تصدير البيانات
router.get('/export/:type', auth, isAdmin, adminController.exportData);

module.exports = router;
