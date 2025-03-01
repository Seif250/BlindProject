const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, specialization, year, whatsapp, gender } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "البريد الإلكتروني مسجل بالفعل" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            specialization,
            year,
            whatsapp,
            gender
        });

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
};

const loginUser = async (req, res) => {
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
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في السيرفر" });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.json({ message: "تم تسجيل الخروج بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تسجيل الخروج" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
};