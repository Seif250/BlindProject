const mongoose = require('mongoose');

const participantSnapshotSchema = new mongoose.Schema({
    alias: String,
    skills: [
        {
            name: String,
            level: String
        }
    ]
}, { _id: false });

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'rejected', 'cancelled'],
        default: 'pending'
    },
    requestMessage: {
        type: String,
        maxlength: 500
    },
    lastMessageAt: Date,
    lastMessageSnippet: String,
    initiatorSnapshot: participantSnapshotSchema,
    recipientSnapshot: participantSnapshotSchema
}, {
    timestamps: true
});

conversationSchema.pre('save', function(next) {
    if (Array.isArray(this.participants) && this.participants.length === 2) {
        this.participants = this.participants
            .map((id) => id.toString())
            .sort()
            .map((id) => new mongoose.Types.ObjectId(id));
    }
    next();
});

conversationSchema.index({ participants: 1 }, { unique: false });
conversationSchema.index({ initiator: 1, recipient: 1, status: 1 });
conversationSchema.index({ status: 1, updatedAt: -1 });

module.exports = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
