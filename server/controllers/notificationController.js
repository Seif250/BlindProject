const Notification = require('../models/Notification');
const User = require('../models/User');

// إنشاء إشعار جديد
exports.createNotification = async (recipientId, data) => {
    try {
        const notification = new Notification({
            recipient: recipientId,
            ...data
        });
        await notification.save();
        
        // هنا يمكن إضافة Socket.io لإرسال الإشعار فوراً
        // io.to(recipientId).emit('new_notification', notification);
        
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// الحصول على جميع الإشعارات للمستخدم
exports.getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly = false } = req.query;
        
        const filter = { recipient: req.user.userId };
        if (unreadOnly === 'true') {
            filter.isRead = false;
        }
        
        const notifications = await Notification.find(filter)
            .populate('sender', 'name image')
            .populate('relatedTeam', 'projectName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.countDocuments({ 
            recipient: req.user.userId, 
            isRead: false 
        });
        
        res.json({
            notifications,
            total,
            unreadCount,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب الإشعارات" });
    }
};

// تحديد إشعار كمقروء
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.userId },
            { isRead: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ message: "الإشعار غير موجود" });
        }
        
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تحديث الإشعار" });
    }
};

// تحديد جميع الإشعارات كمقروءة
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.userId, isRead: false },
            { isRead: true }
        );
        
        res.json({ message: "تم تحديد جميع الإشعارات كمقروءة" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تحديث الإشعارات" });
    }
};

// حذف إشعار
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.userId
        });
        
        if (!notification) {
            return res.status(404).json({ message: "الإشعار غير موجود" });
        }
        
        res.json({ message: "تم حذف الإشعار بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في حذف الإشعار" });
    }
};

// حذف جميع الإشعارات المقروءة
exports.clearReadNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({
            recipient: req.user.userId,
            isRead: true
        });
        
        res.json({ message: "تم حذف جميع الإشعارات المقروءة" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في حذف الإشعارات" });
    }
};
