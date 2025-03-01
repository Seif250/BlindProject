const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/user');

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب البيانات" });
    }
});
// إضافة هذا المسار الجديد
router.get('/profile/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب بيانات المستخدم" });
    }
});

router.put('/profile', auth, upload.single('image'), async (req, res) => {
    try {
        const updates = {
            name: req.body.name,
            specialization: req.body.specialization,
            year: req.body.year,
            whatsapp: req.body.whatsapp,
            gender: req.body.gender
        };

        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تحديث البيانات" });
    }
});

module.exports = router;