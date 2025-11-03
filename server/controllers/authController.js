const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// دالة مساعدة لإرسال البريد الإلكتروني (يمكن استخدام Nodemailer)
const sendEmail = async (email, subject, html) => {
    // TODO: إضافة Nodemailer للإرسال الفعلي
    console.log(`Email to ${email}: ${subject}`);
    // في الوقت الحالي سنطبع فقط في console
    return true;
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, department, specialization, year, whatsapp, gender, studentId } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "البريد الإلكتروني مسجل بالفعل" });
        }

        if (studentId) {
            const existingStudentId = await User.findOne({ studentId });
            if (existingStudentId) {
                return res.status(400).json({ message: "رقم الطالب مسجل بالفعل" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // توليد رمز التحقق
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            department,
            specialization,
            year,
            whatsapp,
            gender,
            studentId,
            verificationToken,
            isVerified: false
        });

        // إرسال بريد التحقق
        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
        await sendEmail(
            email,
            'تأكيد البريد الإلكتروني - نظام الفرق الجامعية',
            `
                <h2>مرحباً ${name}</h2>
                <p>شكراً للتسجيل في نظام الفرق الجامعية</p>
                <p>الرجاء الضغط على الرابط أدناه لتأكيد بريدك الإلكتروني:</p>
                <a href="${verificationLink}">${verificationLink}</a>
                <p>هذا الرابط صالح لمدة 24 ساعة</p>
            `
        );

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                specialization: user.specialization,
                year: user.year,
                whatsapp: user.whatsapp,
                gender: user.gender,
                image: user.image,
                isVerified: user.isVerified,
                role: user.role
            },
            message: "تم التسجيل بنجاح. الرجاء تأكيد بريدك الإلكتروني"
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "حدث خطأ في التسجيل" });
    }
};

// التحقق من البريد الإلكتروني
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });
        
        if (!user) {
            return res.status(400).json({ message: "رمز التحقق غير صحيح أو منتهي الصلاحية" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: "تم تأكيد البريد الإلكتروني بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في التحقق" });
    }
};

// إعادة إرسال رابط التحقق
const resendVerification = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "البريد الإلكتروني مؤكد بالفعل" });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();

        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
        await sendEmail(
            user.email,
            'تأكيد البريد الإلكتروني - نظام الفرق الجامعية',
            `
                <h2>مرحباً ${user.name}</h2>
                <p>الرجاء الضغط على الرابط أدناه لتأكيد بريدك الإلكتروني:</p>
                <a href="${verificationLink}">${verificationLink}</a>
            `
        );

        res.json({ message: "تم إرسال رابط التحقق بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في إرسال رابط التحقق" });
    }
};

// طلب إعادة تعيين كلمة المرور
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "البريد الإلكتروني غير مسجل" });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // ساعة واحدة
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await sendEmail(
            email,
            'إعادة تعيين كلمة المرور - نظام الفرق الجامعية',
            `
                <h2>مرحباً ${user.name}</h2>
                <p>تلقينا طلب لإعادة تعيين كلمة المرور الخاصة بك</p>
                <p>الرجاء الضغط على الرابط أدناه لإعادة تعيين كلمة المرور:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>هذا الرابط صالح لمدة ساعة واحدة</p>
                <p>إذا لم تطلب ذلك، الرجاء تجاهل هذه الرسالة</p>
            `
        );

        res.json({ message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في معالجة الطلب" });
    }
};

// إعادة تعيين كلمة المرور
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "رمز إعادة التعيين غير صحيح أو منتهي الصلاحية" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: "تم إعادة تعيين كلمة المرور بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في إعادة تعيين كلمة المرور" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "البريد الإلكتروني غير صحيح" });
        }

        // التحقق من أن الحساب غير محظور
        if (user.isBanned) {
            return res.status(403).json({ 
                message: `تم حظر حسابك. السبب: ${user.banReason || 'انتهاك سياسات الاستخدام'}` 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "كلمة المرور غير صحيحة" });
        }

        // تحديث آخر ظهور
        user.lastSeen = new Date();
        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                specialization: user.specialization,
                year: user.year,
                whatsapp: user.whatsapp,
                gender: user.gender,
                image: user.image,
                isVerified: user.isVerified,
                role: user.role,
                rating: user.rating,
                completedProjects: user.completedProjects
            }
        });
    } catch (error) {
        console.error('Login error:', error);
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
        // تحديث آخر ظهور
        await User.findByIdAndUpdate(req.user.userId, { lastSeen: new Date() });
        res.json({ message: "تم تسجيل الخروج بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تسجيل الخروج" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword
};