const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    image: {
        type: String,
        default: 'default-avatar.png'
    },
    // البيانات الأكاديمية
    studentId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    academicLevel: {
        type: String,
        enum: ['freshman', 'sophomore', 'junior', 'senior', 'graduate'],
        default: 'freshman'
    },
    gpa: {
        type: Number,
        min: 0,
        max: 4
    },
    // البيانات الشخصية
    whatsapp: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say'],
        default: 'prefer_not_to_say'
    },
    bio: {
        type: String,
        maxlength: 500
    },
    // المهارات والخبرات
    skills: [{
        name: String,
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            default: 'beginner'
        }
    }],
    interests: [String],
    languages: [{
        name: String,
        proficiency: {
            type: String,
            enum: ['basic', 'intermediate', 'fluent', 'native']
        }
    }],
    // الإنجازات والمشاريع السابقة
    achievements: [{
        title: String,
        description: String,
        date: Date,
        certificate: String
    }],
    previousProjects: [{
        name: String,
        description: String,
        role: String,
        technologies: [String],
        link: String,
        completionDate: Date
    }],
    // الروابط الاجتماعية
    socialLinks: {
        linkedin: String,
        github: String,
        portfolio: String,
        behance: String
    },
    // التقييمات والإحصائيات
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    completedProjects: {
        type: Number,
        default: 0
    },
    // حالة الحساب
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    // الإعدادات والتفضيلات
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        teamInvitations: {
            type: Boolean,
            default: true
        },
        newsletter: {
            type: Boolean,
            default: false
        },
        language: {
            type: String,
            enum: ['ar', 'en'],
            default: 'ar'
        }
    },
    // للكلية - حقول إدارية
    role: {
        type: String,
        enum: ['student', 'admin', 'supervisor'],
        default: 'student'
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    banReason: String
}, {
    timestamps: true
});

// Index للبحث السريع
userSchema.index({ name: 'text', email: 'text', department: 'text', specialization: 'text' });
userSchema.index({ department: 1, year: 1 });
userSchema.index({ 'rating.average': -1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;