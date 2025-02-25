// 1. استيراد المكتبات المطلوبة
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 2. إنشاء التطبيق باستخدام Express
const app = express();
app.use(express.json());
app.use(cors());

// 3. الاتصال بقاعدة البيانات MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// 4. استيراد راوتات المستخدمين (التسجيل والدخول)
const authRoutes = require("./routes/authRoutes");
app.use('/auth', authRoutes);

// 5. إعداد المسارات الأساسية
app.get('/', (req, res) => {
    res.send('Welcome to Team Project API');
});

// 6. تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));