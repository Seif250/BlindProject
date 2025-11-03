const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    // تصنيف المشروع
    category: {
        type: String,
        enum: ['web', 'mobile', 'desktop', 'ai', 'data', 'iot', 'game', 'other'],
        default: 'other'
    },
    tags: [String],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    // معلومات الفريق
    maxMembers: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    currentMembersCount: {
        type: Number,
        default: 1
    },
    roles: [{
        title: String,
        description: String,
        required: Boolean,
        filled: {
            type: Boolean,
            default: false
        }
    }],
    // التقنيات المستخدمة
    technologies: [{
        name: String,
        category: {
            type: String,
            enum: ['frontend', 'backend', 'database', 'design', 'other']
        }
    }],
    requiredSkills: [String],
    // معلومات الاتصال
    whatsapp: {
        type: String,
        required: true
    },
    meetingLink: String,
    // المخطط الزمني
    timeline: {
        startDate: Date,
        expectedEndDate: Date,
        actualEndDate: Date
    },
    milestones: [{
        title: String,
        description: String,
        deadline: Date,
        completed: {
            type: Boolean,
            default: false
        },
        completedDate: Date
    }],
    // الأعضاء
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: String,
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        joinedAt: Date,
        contribution: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    }],
    // حالة المشروع
    status: {
        type: String,
        enum: ['recruiting', 'in-progress', 'completed', 'archived', 'cancelled'],
        default: 'recruiting'
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    visibility: {
        type: String,
        enum: ['public', 'department', 'private'],
        default: 'public'
    },
    // التقييمات
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    // الموارد والملفات
    resources: [{
        name: String,
        url: String,
        type: {
            type: String,
            enum: ['document', 'link', 'code', 'design', 'other']
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    githubRepo: String,
    demoLink: String,
    // للكلية - موافقة المشرف
    supervisorApproval: {
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        supervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        feedback: String,
        date: Date
    },
    academicValue: {
        type: Number,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

// Index للبحث والأداء
teamSchema.index({ projectName: 'text', description: 'text', tags: 'text' });
teamSchema.index({ category: 1, status: 1 });
teamSchema.index({ averageRating: -1 });
teamSchema.index({ createdAt: -1 });

// حساب المتوسط عند إضافة تقييم
teamSchema.methods.calculateAverageRating = function() {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
    } else {
        const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        this.averageRating = sum / this.ratings.length;
    }
};

module.exports = mongoose.model('Team', teamSchema);