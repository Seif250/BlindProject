const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // التحقق من أن المستخدم موجود وغير محظور
        const user = await User.findById(decoded.userId).select('isBanned isActive role');
        
        if (!user) {
            return res.status(401).json({ message: "المستخدم غير موجود" });
        }
        
        if (user.isBanned) {
            return res.status(403).json({ message: "تم حظر حسابك" });
        }
        
        if (!user.isActive) {
            return res.status(403).json({ message: "حسابك غير نشط" });
        }
        
        req.user = {
            userId: decoded.userId,
            role: user.role
        };
        
        next();
    } catch (error) {
        res.status(401).json({ message: "الرجاء تسجيل الدخول" });
    }
};

// Middleware للتحقق من صلاحية الإدارة
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'supervisor') {
        return res.status(403).json({ message: "ليس لديك صلاحية الوصول" });
    }
    next();
};

// Middleware للتحقق من صلاحية المشرف فقط
const isSupervisor = (req, res, next) => {
    if (req.user.role !== 'supervisor') {
        return res.status(403).json({ message: "مخصص للمشرفين فقط" });
    }
    next();
};

module.exports = { auth, isAdmin, isSupervisor };
module.exports = auth; // للتوافق العكسي