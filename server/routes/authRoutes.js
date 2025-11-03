const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// التسجيل وتسجيل الدخول
router.post('/signup', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', auth, authController.logoutUser);

// التحقق من البريد الإلكتروني
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', auth, authController.resendVerification);

// إعادة تعيين كلمة المرور
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// الحصول على المستخدم الحالي
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;