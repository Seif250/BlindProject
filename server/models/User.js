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
    specialization: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);