const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ratingController = require('../controllers/ratingController');

// إضافة تقييم
router.post('/', auth, ratingController.createRating);

// الحصول على تقييمات مستخدم
router.get('/user/:userId', auth, ratingController.getUserRatings);

// الحصول على التقييمات التي أعطاها المستخدم
router.get('/given', auth, ratingController.getGivenRatings);

// تحديث تقييم
router.put('/:ratingId', auth, ratingController.updateRating);

// حذف تقييم
router.delete('/:ratingId', auth, ratingController.deleteRating);

// الإبلاغ عن تقييم
router.post('/:ratingId/flag', auth, ratingController.flagRating);

module.exports = router;
