const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register new user
const registerUser = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { name, email, password, specialization, year, whatsapp, gender, image } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            specialization,
            year,
            whatsapp,
            gender,
            image
        });

        // Save user
        await user.save();
        console.log('User saved:', user._id);

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send response
        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
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
        console.error('Registration error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            message: "حدث خطأ في السيرفر",
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                type: error.name
            } : undefined
        });
    }
};
// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "البريد الإلكتروني غير موجود" });
        }

        // Validate password
        const validPassword = await user.comparePassword(password);
        if (!validPassword) {
            return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "حدث خطأ في السيرفر" });
    }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: "حدث خطأ في السيرفر" });
    }
};

// Logout user (optional - frontend typically handles this)
const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: "حدث خطأ في السيرفر" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
};