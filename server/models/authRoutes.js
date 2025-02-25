const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User");
const router = express.Router();

// تسجيل حساب جديد
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, image, specialization, year, whatsapp, gender } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });

        user = new User({ name, email, password, image, specialization, year, whatsapp, gender });
        await user.save();

        res.status(201).json({ message: "تم إنشاء الحساب بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "خطأ في السيرفر", error: error.message });
    }
});

// تسجيل الدخول
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "المستخدم غير موجود" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "كلمة المرور غير صحيحة" });

        const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "7d" });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "خطأ في السيرفر", error: error.message });
    }
});

module.exports = router;
