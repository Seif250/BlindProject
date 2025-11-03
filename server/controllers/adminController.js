const User = require('../models/User');
const Team = require('../models/Team');
const Rating = require('../models/Rating');
const Notification = require('../models/Notification');
const Message = require('../models/Message');

// الحصول على إحصائيات شاملة
exports.getStatistics = async (req, res) => {
    try {
        // إحصائيات المستخدمين
        const totalUsers = await User.countDocuments();
        const verifiedUsers = await User.countDocuments({ isVerified: true });
        const activeUsers = await User.countDocuments({ 
            lastSeen: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });
        
        // إحصائيات الفرق
        const totalTeams = await Team.countDocuments();
        const recruitingTeams = await Team.countDocuments({ status: 'recruiting' });
        const inProgressTeams = await Team.countDocuments({ status: 'in-progress' });
        const completedTeams = await Team.countDocuments({ status: 'completed' });
        
        // إحصائيات التقييمات
        const totalRatings = await Rating.countDocuments();
        const avgRating = await Rating.aggregate([
            { $group: { _id: null, avg: { $avg: '$overallRating' } } }
        ]);
        
        // إحصائيات الأقسام
        const usersByDepartment = await User.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        // إحصائيات السنوات الدراسية
        const usersByYear = await User.aggregate([
            { $group: { _id: '$year', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        
        // الفرق الأكثر تقييماً
        const topRatedTeams = await Team.find({ averageRating: { $gt: 0 } })
            .sort({ averageRating: -1 })
            .limit(10)
            .select('projectName averageRating creator')
            .populate('creator', 'name');
        
        // أنشط المستخدمين
        const topUsers = await User.find()
            .sort({ 'rating.average': -1 })
            .limit(10)
            .select('name email department rating completedProjects');
        
        // معدل النمو الشهري
        const monthlyGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);
        
        res.json({
            users: {
                total: totalUsers,
                verified: verifiedUsers,
                active: activeUsers,
                byDepartment: usersByDepartment,
                byYear: usersByYear
            },
            teams: {
                total: totalTeams,
                recruiting: recruitingTeams,
                inProgress: inProgressTeams,
                completed: completedTeams,
                topRated: topRatedTeams
            },
            ratings: {
                total: totalRatings,
                average: avgRating[0]?.avg || 0
            },
            topUsers,
            monthlyGrowth
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب الإحصائيات" });
    }
};

// الحصول على جميع المستخدمين مع الفلترة
exports.getAllUsers = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            department, 
            year, 
            isVerified,
            role,
            search 
        } = req.query;
        
        const filter = {};
        if (department) filter.department = department;
        if (year) filter.year = Number(year);
        if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
        if (role) filter.role = role;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } }
            ];
        }
        
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await User.countDocuments(filter);
        
        res.json({
            users,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب المستخدمين" });
    }
};

// الحصول على جميع الفرق مع الفلترة
exports.getAllTeams = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status, 
            category,
            needsApproval,
            search 
        } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (needsApproval === 'true') {
            filter['supervisorApproval.status'] = 'pending';
        }
        if (search) {
            filter.$or = [
                { projectName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        const teams = await Team.find(filter)
            .populate('creator', 'name email department')
            .populate('members.user', 'name email')
            .populate('supervisorApproval.supervisor', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Team.countDocuments(filter);
        
        res.json({
            teams,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب الفرق" });
    }
};

// تحديث حالة المستخدم
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isVerified, isActive, isBanned, banReason, role } = req.body;
        
        const updates = {};
        if (isVerified !== undefined) updates.isVerified = isVerified;
        if (isActive !== undefined) updates.isActive = isActive;
        if (isBanned !== undefined) {
            updates.isBanned = isBanned;
            if (isBanned && banReason) {
                updates.banReason = banReason;
            }
        }
        if (role) updates.role = role;
        
        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تحديث حالة المستخدم" });
    }
};

// الموافقة على فريق
exports.approveTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { status, feedback, academicValue } = req.body;
        
        const team = await Team.findByIdAndUpdate(
            teamId,
            {
                'supervisorApproval.status': status,
                'supervisorApproval.supervisor': req.user.userId,
                'supervisorApproval.feedback': feedback,
                'supervisorApproval.date': new Date(),
                academicValue
            },
            { new: true }
        ).populate('creator', 'name email');
        
        if (!team) {
            return res.status(404).json({ message: "الفريق غير موجود" });
        }
        
        // إرسال إشعار لمنشئ الفريق
        const notificationController = require('./notificationController');
        await notificationController.createNotification(team.creator._id, {
            type: 'supervisor_feedback',
            title: `تحديث على مشروعك: ${team.projectName}`,
            message: `تم ${status === 'approved' ? 'الموافقة على' : 'رفض'} مشروعك من قبل المشرف`,
            relatedTeam: teamId,
            priority: 'high'
        });
        
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في الموافقة على الفريق" });
    }
};

// حذف مستخدم
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        
        // حذف جميع البيانات المرتبطة
        await Team.deleteMany({ creator: userId });
        await Rating.deleteMany({ $or: [{ rater: userId }, { ratedUser: userId }] });
        await Notification.deleteMany({ $or: [{ recipient: userId }, { sender: userId }] });
        await Message.deleteMany({ sender: userId });
        
        res.json({ message: "تم حذف المستخدم وجميع بياناته" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في حذف المستخدم" });
    }
};

// حذف فريق
exports.deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        
        const team = await Team.findByIdAndDelete(teamId);
        
        if (!team) {
            return res.status(404).json({ message: "الفريق غير موجود" });
        }
        
        // حذف جميع البيانات المرتبطة
        await Rating.deleteMany({ team: teamId });
        await Message.deleteMany({ team: teamId });
        await Notification.deleteMany({ relatedTeam: teamId });
        
        res.json({ message: "تم حذف الفريق وجميع بياناته" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في حذف الفريق" });
    }
};

// إرسال إشعار جماعي
exports.sendBroadcastNotification = async (req, res) => {
    try {
        const { title, message, priority = 'normal', targetUsers } = req.body;
        
        let recipients;
        if (targetUsers && targetUsers.length > 0) {
            recipients = targetUsers;
        } else {
            // إرسال لجميع المستخدمين
            const users = await User.find({ isActive: true }).select('_id');
            recipients = users.map(u => u._id);
        }
        
        const notificationController = require('./notificationController');
        const notifications = recipients.map(recipientId =>
            notificationController.createNotification(recipientId, {
                type: 'system_announcement',
                title,
                message,
                priority,
                sender: req.user.userId
            })
        );
        
        await Promise.all(notifications);
        
        res.json({ 
            message: "تم إرسال الإشعار بنجاح",
            recipientsCount: recipients.length
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في إرسال الإشعار" });
    }
};

// تصدير البيانات
exports.exportData = async (req, res) => {
    try {
        const { type } = req.params; // users, teams, ratings
        
        let data;
        switch (type) {
            case 'users':
                data = await User.find().select('-password').lean();
                break;
            case 'teams':
                data = await Team.find()
                    .populate('creator', 'name email')
                    .populate('members.user', 'name email')
                    .lean();
                break;
            case 'ratings':
                data = await Rating.find()
                    .populate('rater', 'name email')
                    .populate('ratedUser', 'name email')
                    .populate('team', 'projectName')
                    .lean();
                break;
            default:
                return res.status(400).json({ message: "نوع البيانات غير صحيح" });
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تصدير البيانات" });
    }
};

// الحصول على التقييمات المبلغ عنها
exports.getFlaggedRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ isFlagged: true })
            .populate('rater', 'name email')
            .populate('ratedUser', 'name email')
            .populate('team', 'projectName')
            .sort({ createdAt: -1 });
            
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب التقييمات المبلغ عنها" });
    }
};

// التحقق من تقييم
exports.verifyRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { action } = req.body; // 'approve' or 'delete'
        
        if (action === 'approve') {
            await Rating.findByIdAndUpdate(ratingId, {
                supervisorVerified: true,
                isFlagged: false
            });
            res.json({ message: "تم التحقق من التقييم" });
        } else if (action === 'delete') {
            await Rating.findByIdAndDelete(ratingId);
            res.json({ message: "تم حذف التقييم" });
        } else {
            res.status(400).json({ message: "إجراء غير صحيح" });
        }
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في معالجة التقييم" });
    }
};

module.exports = exports;
