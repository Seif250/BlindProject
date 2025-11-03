const Rating = require('../models/Rating');
const User = require('../models/User');
const Team = require('../models/Team');

// إضافة تقييم
exports.createRating = async (req, res) => {
    try {
        const { teamId, ratedUserId, ratings, review, strengths, areasForImprovement, wouldWorkAgain, isAnonymous } = req.body;
        
        // التحقق من أن المستخدم كان عضواً في الفريق
        const team = await Team.findOne({
            _id: teamId,
            status: 'completed',
            $or: [
                { creator: req.user.userId },
                { 'members.user': req.user.userId, 'members.status': 'accepted' }
            ]
        });
        
        if (!team) {
            return res.status(403).json({ message: "يمكنك فقط تقييم أعضاء الفرق المكتملة" });
        }
        
        // التحقق من أن المستخدم المراد تقييمه كان في الفريق
        const wasInTeam = team.creator.toString() === ratedUserId ||
                         team.members.some(m => m.user.toString() === ratedUserId && m.status === 'accepted');
        
        if (!wasInTeam) {
            return res.status(400).json({ message: "المستخدم لم يكن عضواً في هذا الفريق" });
        }
        
        // لا يمكن تقييم النفس
        if (req.user.userId === ratedUserId) {
            return res.status(400).json({ message: "لا يمكنك تقييم نفسك" });
        }
        
        // التحقق من عدم وجود تقييم سابق
        const existingRating = await Rating.findOne({
            team: teamId,
            rater: req.user.userId,
            ratedUser: ratedUserId
        });
        
        if (existingRating) {
            return res.status(400).json({ message: "لقد قمت بتقييم هذا المستخدم من قبل" });
        }
        
        const rating = new Rating({
            team: teamId,
            rater: req.user.userId,
            ratedUser: ratedUserId,
            ratings,
            review,
            strengths,
            areasForImprovement,
            wouldWorkAgain,
            isAnonymous
        });
        
        await rating.save();
        
        // تحديث تقييم المستخدم
        await updateUserRating(ratedUserId);
        
        res.status(201).json({ message: "تم إضافة التقييم بنجاح", rating });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "لقد قمت بتقييم هذا المستخدم من قبل" });
        }
        res.status(500).json({ message: "حدث خطأ في إضافة التقييم" });
    }
};

// الحصول على تقييمات المستخدم
exports.getUserRatings = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const ratings = await Rating.find({ ratedUser: userId })
            .populate('rater', 'name image')
            .populate('team', 'projectName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        // إخفاء معلومات المقيّم للتقييمات المجهولة
        const processedRatings = ratings.map(rating => {
            if (rating.isAnonymous && rating.rater._id.toString() !== req.user.userId) {
                rating.rater = { name: 'مجهول', image: null };
            }
            return rating;
        });
        
        const total = await Rating.countDocuments({ ratedUser: userId });
        
        // حساب الإحصائيات
        const stats = await Rating.aggregate([
            { $match: { ratedUser: userId } },
            {
                $group: {
                    _id: null,
                    avgCommunication: { $avg: '$ratings.communication' },
                    avgTechnicalSkills: { $avg: '$ratings.technicalSkills' },
                    avgTeamwork: { $avg: '$ratings.teamwork' },
                    avgCommitment: { $avg: '$ratings.commitment' },
                    avgProblemSolving: { $avg: '$ratings.problemSolving' },
                    avgOverall: { $avg: '$overallRating' },
                    wouldWorkAgainCount: {
                        $sum: { $cond: ['$wouldWorkAgain', 1, 0] }
                    }
                }
            }
        ]);
        
        res.json({
            ratings: processedRatings,
            total,
            stats: stats[0] || {},
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب التقييمات" });
    }
};

// الحصول على التقييمات التي أعطاها المستخدم
exports.getGivenRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ rater: req.user.userId })
            .populate('ratedUser', 'name image')
            .populate('team', 'projectName')
            .sort({ createdAt: -1 });
            
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب التقييمات" });
    }
};

// تحديث تقييم
exports.updateRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const updates = req.body;
        
        const rating = await Rating.findOne({
            _id: ratingId,
            rater: req.user.userId
        });
        
        if (!rating) {
            return res.status(404).json({ message: "التقييم غير موجود" });
        }
        
        Object.assign(rating, updates);
        await rating.save();
        
        // تحديث تقييم المستخدم
        await updateUserRating(rating.ratedUser);
        
        res.json({ message: "تم تحديث التقييم بنجاح", rating });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تحديث التقييم" });
    }
};

// حذف تقييم
exports.deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        
        const rating = await Rating.findOneAndDelete({
            _id: ratingId,
            rater: req.user.userId
        });
        
        if (!rating) {
            return res.status(404).json({ message: "التقييم غير موجود" });
        }
        
        // تحديث تقييم المستخدم
        await updateUserRating(rating.ratedUser);
        
        res.json({ message: "تم حذف التقييم بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في حذف التقييم" });
    }
};

// الإبلاغ عن تقييم
exports.flagRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { reason } = req.body;
        
        const rating = await Rating.findByIdAndUpdate(
            ratingId,
            { isFlagged: true, flagReason: reason },
            { new: true }
        );
        
        if (!rating) {
            return res.status(404).json({ message: "التقييم غير موجود" });
        }
        
        res.json({ message: "تم الإبلاغ عن التقييم" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في الإبلاغ عن التقييم" });
    }
};

// دالة مساعدة لتحديث تقييم المستخدم
async function updateUserRating(userId) {
    const ratings = await Rating.find({ ratedUser: userId });
    
    if (ratings.length === 0) {
        await User.findByIdAndUpdate(userId, {
            'rating.average': 0,
            'rating.count': 0
        });
        return;
    }
    
    const sum = ratings.reduce((acc, curr) => acc + curr.overallRating, 0);
    const average = sum / ratings.length;
    
    await User.findByIdAndUpdate(userId, {
        'rating.average': average,
        'rating.count': ratings.length
    });
}

module.exports = exports;
