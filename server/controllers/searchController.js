const Team = require('../models/Team');
const User = require('../models/User');

// البحث المتقدم في الفرق
exports.advancedTeamSearch = async (req, res) => {
    try {
        const {
            query,
            category,
            status,
            difficulty,
            minRating,
            requiredSkills,
            technologies,
            department,
            hasOpenings,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 20
        } = req.query;

        const filter = {};

        // البحث النصي
        if (query) {
            filter.$text = { $search: query };
        }

        // التصفية حسب التصنيف
        if (category) {
            filter.category = category;
        }

        // التصفية حسب الحالة
        if (status) {
            filter.status = status;
        } else {
            // افتراضياً، عرض الفرق المفتوحة فقط
            filter.isOpen = true;
        }

        // التصفية حسب مستوى الصعوبة
        if (difficulty) {
            filter.difficulty = difficulty;
        }

        // التصفية حسب التقييم الأدنى
        if (minRating) {
            filter.averageRating = { $gte: parseFloat(minRating) };
        }

        // التصفية حسب المهارات المطلوبة
        if (requiredSkills) {
            const skillsArray = requiredSkills.split(',');
            filter.requiredSkills = { $in: skillsArray };
        }

        // التصفية حسب التقنيات
        if (technologies) {
            const techArray = technologies.split(',');
            filter['technologies.name'] = { $in: techArray };
        }

        // التصفية حسب القسم (من خلال منشئ الفريق)
        if (department) {
            const departmentUsers = await User.find({ department }).select('_id');
            const userIds = departmentUsers.map(u => u._id);
            filter.creator = { $in: userIds };
        }

        // التصفية للفرق التي لديها أماكن متاحة
        if (hasOpenings === 'true') {
            filter.$expr = { $lt: ['$currentMembersCount', '$maxMembers'] };
        }

        // الترتيب
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const teams = await Team.find(filter)
            .populate('creator', 'name image department rating')
            .populate('members.user', 'name image')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Team.countDocuments(filter);

        // إحصائيات النتائج
        const stats = {
            byCategory: await Team.aggregate([
                { $match: filter },
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]),
            byDifficulty: await Team.aggregate([
                { $match: filter },
                { $group: { _id: '$difficulty', count: { $sum: 1 } } }
            ]),
            avgRating: await Team.aggregate([
                { $match: filter },
                { $group: { _id: null, avg: { $avg: '$averageRating' } } }
            ])
        };

        res.json({
            teams,
            total,
            stats,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Advanced team search error:', error);
        res.status(500).json({ message: "حدث خطأ في البحث" });
    }
};

// البحث المتقدم في المستخدمين
exports.advancedUserSearch = async (req, res) => {
    try {
        const {
            query,
            department,
            specialization,
            year,
            skills,
            minRating,
            languages,
            availability = 'available', // available, in-team, all
            sortBy = 'rating.average',
            sortOrder = 'desc',
            page = 1,
            limit = 20
        } = req.query;

        const filter = { isActive: true };

        // البحث النصي
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { bio: { $regex: query, $options: 'i' } },
                { studentId: { $regex: query, $options: 'i' } }
            ];
        }

        // التصفية حسب القسم
        if (department) {
            filter.department = department;
        }

        // التصفية حسب التخصص
        if (specialization) {
            filter.specialization = specialization;
        }

        // التصفية حسب السنة الدراسية
        if (year) {
            filter.year = parseInt(year);
        }

        // التصفية حسب المهارات
        if (skills) {
            const skillsArray = skills.split(',');
            filter['skills.name'] = { $in: skillsArray };
        }

        // التصفية حسب التقييم الأدنى
        if (minRating) {
            filter['rating.average'] = { $gte: parseFloat(minRating) };
        }

        // التصفية حسب اللغات
        if (languages) {
            const langsArray = languages.split(',');
            filter['languages.name'] = { $in: langsArray };
        }

        // التصفية حسب التوفر
        if (availability === 'available') {
            // البحث عن المستخدمين الذين ليسوا في فريق نشط
            const Team = require('../models/Team');
            const usersInTeams = await Team.find({
                status: { $in: ['recruiting', 'in-progress'] }
            }).distinct('members.user');
            
            filter._id = { $nin: usersInTeams };
        } else if (availability === 'in-team') {
            const Team = require('../models/Team');
            const usersInTeams = await Team.find({
                status: { $in: ['recruiting', 'in-progress'] }
            }).distinct('members.user');
            
            filter._id = { $in: usersInTeams };
        }

        // الترتيب
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const users = await User.find(filter)
            .select('-password -verificationToken -resetPasswordToken')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(filter);

        // إحصائيات النتائج
        const stats = {
            byDepartment: await User.aggregate([
                { $match: filter },
                { $group: { _id: '$department', count: { $sum: 1 } } }
            ]),
            byYear: await User.aggregate([
                { $match: filter },
                { $group: { _id: '$year', count: { $sum: 1 } } }
            ]),
            avgRating: await User.aggregate([
                { $match: filter },
                { $group: { _id: null, avg: { $avg: '$rating.average' } } }
            ])
        };

        res.json({
            users,
            total,
            stats,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Advanced user search error:', error);
        res.status(500).json({ message: "حدث خطأ في البحث" });
    }
};

// الحصول على اقتراحات البحث
exports.getSearchSuggestions = async (req, res) => {
    try {
        const { type, query } = req.query; // type: 'teams' or 'users'

        if (!query || query.length < 2) {
            return res.json({ suggestions: [] });
        }

        let suggestions = [];

        if (type === 'teams') {
            suggestions = await Team.find({
                $or: [
                    { projectName: { $regex: query, $options: 'i' } },
                    { tags: { $regex: query, $options: 'i' } }
                ],
                isOpen: true
            })
            .select('projectName category')
            .limit(10);
        } else if (type === 'users') {
            suggestions = await User.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { 'skills.name': { $regex: query, $options: 'i' } }
                ],
                isActive: true
            })
            .select('name department image')
            .limit(10);
        }

        res.json({ suggestions });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب الاقتراحات" });
    }
};

// الحصول على خيارات الفلترة المتاحة
exports.getFilterOptions = async (req, res) => {
    try {
        const [
            categories,
            departments,
            specializations,
            skills,
            technologies
        ] = await Promise.all([
            Team.distinct('category'),
            User.distinct('department'),
            User.distinct('specialization'),
            User.distinct('skills.name'),
            Team.distinct('technologies.name')
        ]);

        res.json({
            categories,
            departments,
            specializations,
            skills: skills.slice(0, 50), // أول 50 مهارة
            technologies: technologies.slice(0, 50),
            difficulties: ['beginner', 'intermediate', 'advanced'],
            years: [1, 2, 3, 4, 5, 6],
            statuses: ['recruiting', 'in-progress', 'completed']
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب خيارات الفلترة" });
    }
};

module.exports = exports;
