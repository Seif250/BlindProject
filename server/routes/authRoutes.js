const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, specialization, year, whatsapp, gender } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "البريد الإلكتروني مسجل بالفعل" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            specialization,
            year,
            whatsapp,
            gender
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                specialization: user.specialization,
                year: user.year,
                whatsapp: user.whatsapp,
                gender: user.gender,
                image: user.image
            }
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في التسجيل" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "البريد الإلكتروني غير صحيح" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "كلمة المرور غير صحيحة" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                specialization: user.specialization,
                year: user.year,
                whatsapp: user.whatsapp,
                gender: user.gender,
                image: user.image
            }
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تسجيل الدخول" });
    }
});

module.exports = router;