const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    rater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // التقييمات المختلفة
    ratings: {
        communication: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        technicalSkills: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        teamwork: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        commitment: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        problemSolving: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    },
    overallRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        maxlength: 1000
    },
    strengths: [String],
    areasForImprovement: [String],
    wouldWorkAgain: {
        type: Boolean,
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    // للمشرف
    supervisorVerified: {
        type: Boolean,
        default: false
    },
    isFlagged: {
        type: Boolean,
        default: false
    },
    flagReason: String
}, {
    timestamps: true
});

// منع التقييم المكرر
ratingSchema.index({ team: 1, rater: 1, ratedUser: 1 }, { unique: true });

// حساب التقييم الكلي
ratingSchema.pre('save', function(next) {
    const { communication, technicalSkills, teamwork, commitment, problemSolving } = this.ratings;
    this.overallRating = (communication + technicalSkills + teamwork + commitment + problemSolving) / 5;
    next();
});

module.exports = mongoose.model('Rating', ratingSchema);
