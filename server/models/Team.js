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
    maxMembers: {
        type: Number,
        required: true
    },
    roles: [{
        title: String,
        description: String
    }],
    whatsapp: {
        type: String,
        required: true
    },
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
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);