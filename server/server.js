// 1. استيراد المكتبات المطلوبة
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 2. إنشاء التطبيق باستخدام Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 3. الاتصال بقاعدة البيانات MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// 4. استيراد جميع الراوتات
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// 5. استخدام الراوتات
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// 6. إعداد المسارات الأساسية
app.get('/', (req, res) => {
    res.send('Welcome to Team Project API');
});

// 7. معالجة الأخطاء العامة
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "حدث خطأ في السيرفر",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 8. معالجة المسارات غير الموجودة
app.use((req, res) => {
    res.status(404).json({ message: "المسار غير موجود" });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 9. تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));