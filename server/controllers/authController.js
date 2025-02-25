const User = require("../models/User");
const bcrypt = require("bcryptjs");

// تسجيل مستخدم جديد
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // تأكد إن المستخدم مش موجود بالفعل
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // تشفير الباسورد
        const hashedPassword = await bcrypt.hash(password, 10);

        // إنشاء المستخدم الجديد
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// تسجيل الدخول
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // التحقق من وجود المستخدم
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // مقارنة الباسورد
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser };
