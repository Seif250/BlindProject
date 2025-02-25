const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require('../models/user');

// Get user profile
router.get("/profile", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في السيرفر" });
    }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
    try {
        const updates = {
            name: req.body.name,
            specialization: req.body.specialization,
            year: req.body.year,
            whatsapp: req.body.whatsapp,
            image: req.body.image,
            gender: req.body.gender
        };

        // Remove undefined fields
        Object.keys(updates).forEach(key => 
            updates[key] === undefined && delete updates[key]
        );

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        res.json(user);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: "حدث خطأ في السيرفر" });
    }
});

module.exports = router;