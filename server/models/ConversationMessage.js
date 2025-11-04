const mongoose = require('mongoose');

const conversationMessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    attachments: [
        {
            name: String,
            url: String,
            size: Number,
            mimeType: String
        }
    ],
    readBy: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            readAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

conversationMessageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.models.ConversationMessage || mongoose.model('ConversationMessage', conversationMessageSchema);
