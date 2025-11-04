const Conversation = require('../models/Conversation');
const ConversationMessage = require('../models/ConversationMessage');
const User = require('../models/User');

const createAlias = (prefix, seed) => {
    const normalizedSeed = typeof seed === 'string' ? seed : String(seed || '') || Math.random().toString(36).slice(2);
    const suffix = normalizedSeed.length >= 4 ? normalizedSeed.slice(-4) : normalizedSeed;
    return `${prefix}-${suffix || Math.random().toString(36).slice(-4)}`;
};

const buildSkillSnapshot = (skills) => {
    if (!Array.isArray(skills)) {
        return [];
    }
    return skills
        .map((skill) => {
            if (typeof skill === 'string') {
                return { name: skill, level: 'intermediate' };
            }
            if (skill && skill.name) {
                return { name: skill.name, level: skill.level || 'intermediate' };
            }
            return null;
        })
        .filter(Boolean);
};

const buildParticipantSnapshot = (user) => ({
    alias: createAlias('User', user._id.toString()),
    skills: buildSkillSnapshot(user.skills)
});

const buildParticipantView = ({ user, snapshot, viewerId, status }) => {
    if (!user) {
        return null;
    }

    const userId = user._id.toString();
    const isViewer = viewerId && viewerId === userId;
    const revealIdentity = status === 'active' || isViewer;

    return {
        _id: userId,
        name: revealIdentity ? user.name : snapshot?.alias || createAlias('User', userId),
        alias: snapshot?.alias || createAlias('User', userId),
        isViewer,
        skills: snapshot?.skills?.length ? snapshot.skills : buildSkillSnapshot(user.skills),
        email: revealIdentity ? user.email : undefined,
        whatsapp: revealIdentity ? user.whatsapp : undefined,
        image: revealIdentity ? user.image : undefined
    };
};

const buildConversationResponse = async (conversation, viewerId) => {
    const viewer = viewerId ? viewerId.toString() : null;
    const participantIds = [conversation.initiator, conversation.recipient]
        .map((id) => id && id.toString())
        .filter(Boolean);

    const users = await User.find({ _id: { $in: participantIds } }).select('name email image whatsapp skills');
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    const initiatorUser = userMap.get(conversation.initiator.toString());
    const recipientUser = userMap.get(conversation.recipient.toString());

    const initiatorView = buildParticipantView({
        user: initiatorUser,
        snapshot: conversation.initiatorSnapshot,
        viewerId: viewer,
        status: conversation.status
    });

    const recipientView = buildParticipantView({
        user: recipientUser,
        snapshot: conversation.recipientSnapshot,
        viewerId: viewer,
        status: conversation.status
    });

    const otherParticipant = conversation.participants
        .map((participant) => participant.toString())
        .find((participantId) => participantId !== viewer);

    return {
        _id: conversation._id,
        status: conversation.status,
        requestMessage: conversation.requestMessage || '',
        participants: [initiatorView, recipientView].filter(Boolean),
        lastMessageAt: conversation.lastMessageAt,
        lastMessageSnippet: conversation.lastMessageSnippet || '',
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        isInitiator: viewer ? conversation.initiator.toString() === viewer : false,
        counterpartId: otherParticipant || null
    };
};

exports.requestConversation = async (req, res) => {
    try {
        const { recipientId, message } = req.body;

        if (!recipientId) {
            return res.status(400).json({ message: 'Recipient is required' });
        }

        if (recipientId === req.user.userId.toString()) {
            return res.status(400).json({ message: 'You cannot start a conversation with yourself' });
        }

        const recipient = await User.findById(recipientId).select('name email image whatsapp skills');
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const initiator = await User.findById(req.user.userId).select('name email image whatsapp skills');
        if (!initiator) {
            return res.status(404).json({ message: 'User not found' });
        }

        let conversation = await Conversation.findOne({
            participants: {
                $all: [req.user.userId, recipientId]
            }
        });

        if (conversation) {
            if (conversation.status === 'active') {
                return res.status(400).json({ message: 'Conversation already active' });
            }
            if (conversation.status === 'pending') {
                if (conversation.initiator.toString() === req.user.userId.toString()) {
                    return res.status(400).json({ message: 'You already sent a request. Await response.' });
                }
                // Recipient had previously initiated. Promote to active automatically.
                conversation.status = 'active';
                conversation.lastMessageAt = new Date();
                conversation.lastMessageSnippet = 'Conversation request auto-approved';
                await conversation.save();
                const payload = await buildConversationResponse(conversation, req.user.userId);
                return res.status(200).json({ message: 'Conversation already pending. Auto-approved.', conversation: payload });
            }
            // Reset rejected/cancelled conversation to new pending state
            conversation.status = 'pending';
            conversation.initiator = req.user.userId;
            conversation.recipient = recipientId;
            conversation.requestMessage = message || '';
            conversation.initiatorSnapshot = buildParticipantSnapshot(initiator);
            conversation.recipientSnapshot = buildParticipantSnapshot(recipient);
            conversation.lastMessageAt = null;
            conversation.lastMessageSnippet = '';
            await conversation.save();
            const payload = await buildConversationResponse(conversation, req.user.userId);
            return res.status(200).json({ message: 'Conversation request re-sent', conversation: payload });
        }

        conversation = new Conversation({
            participants: [req.user.userId, recipientId],
            initiator: req.user.userId,
            recipient: recipientId,
            status: 'pending',
            requestMessage: message || '',
            initiatorSnapshot: buildParticipantSnapshot(initiator),
            recipientSnapshot: buildParticipantSnapshot(recipient)
        });

        await conversation.save();
        const payload = await buildConversationResponse(conversation, req.user.userId);
        return res.status(201).json({ message: 'Conversation request sent', conversation: payload });
    } catch (error) {
        console.error('Request conversation error:', error);
        return res.status(500).json({ message: 'Failed to start conversation' });
    }
};

exports.getPendingRequests = async (req, res) => {
    try {
        const userId = req.user.userId;

        const incoming = await Conversation.find({
            recipient: userId,
            status: 'pending'
        }).sort({ createdAt: -1 });

        const outgoing = await Conversation.find({
            initiator: userId,
            status: 'pending'
        }).sort({ createdAt: -1 });

        const incomingPayload = await Promise.all(incoming.map((conversation) => buildConversationResponse(conversation, userId)));
        const outgoingPayload = await Promise.all(outgoing.map((conversation) => buildConversationResponse(conversation, userId)));

        return res.json({ incoming: incomingPayload, outgoing: outgoingPayload });
    } catch (error) {
        console.error('Get pending conversations error:', error);
        return res.status(500).json({ message: 'Failed to load conversation requests' });
    }
};

exports.respondToRequest = async (req, res) => {
    try {
        const { action } = req.body;
        const { conversationId } = req.params;

        if (!['accept', 'reject'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action' });
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || conversation.status !== 'pending') {
            return res.status(404).json({ message: 'Conversation request not found' });
        }

        if (conversation.recipient.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'You are not allowed to respond to this request' });
        }

        if (action === 'accept') {
            conversation.status = 'active';
            conversation.lastMessageAt = new Date();
            conversation.lastMessageSnippet = 'Conversation started';
        } else {
            conversation.status = 'rejected';
            conversation.lastMessageAt = new Date();
            conversation.lastMessageSnippet = 'Conversation request rejected';
        }

        await conversation.save();
        const payload = await buildConversationResponse(conversation, req.user.userId);
        return res.json({ message: `Conversation ${action === 'accept' ? 'accepted' : 'rejected'}`, conversation: payload });
    } catch (error) {
        console.error('Respond conversation error:', error);
        return res.status(500).json({ message: 'Failed to update conversation request' });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const conversations = await Conversation.find({
            participants: userId,
            status: 'active'
        }).sort({ updatedAt: -1 });

        const payload = await Promise.all(conversations.map((conversation) => buildConversationResponse(conversation, userId)));
        return res.json(payload);
    } catch (error) {
        console.error('Get conversations error:', error);
        return res.status(500).json({ message: 'Failed to load conversations' });
    }
};

exports.getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.userId.toString();

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.some((participant) => participant.toString() === userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (conversation.status !== 'active') {
            return res.status(400).json({ message: 'Conversation is not active yet' });
        }

        const messages = await ConversationMessage.find({ conversation: conversationId })
            .sort({ createdAt: 1 });

        const users = await User.find({ _id: { $in: conversation.participants } }).select('name email image whatsapp skills');
        const userMap = new Map(users.map((user) => [user._id.toString(), user]));

        const serialized = messages.map((message) => {
            const sender = userMap.get(message.sender.toString());
            return {
                _id: message._id,
                content: message.content,
                createdAt: message.createdAt,
                sender: sender ? {
                    _id: sender._id,
                    name: sender.name,
                    image: sender.image
                } : { _id: message.sender },
                isMine: message.sender.toString() === userId
            };
        });

        return res.json(serialized);
    } catch (error) {
        console.error('Get conversation messages error:', error);
        return res.status(500).json({ message: 'Failed to load messages' });
    }
};

exports.sendConversationMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (conversation.status !== 'active') {
            return res.status(400).json({ message: 'Conversation is not active' });
        }

        if (!conversation.participants.some((participant) => participant.toString() === userId.toString())) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const message = await ConversationMessage.create({
            conversation: conversationId,
            sender: userId,
            content: content.trim()
        });

        conversation.lastMessageAt = message.createdAt;
        conversation.lastMessageSnippet = message.content.slice(0, 140);
        await conversation.save();

        const sender = await User.findById(userId).select('name image');

        return res.status(201).json({
            _id: message._id,
            content: message.content,
            createdAt: message.createdAt,
            sender: {
                _id: userId,
                name: sender?.name || 'You',
                image: sender?.image
            },
            isMine: true
        });
    } catch (error) {
        console.error('Send conversation message error:', error);
        return res.status(500).json({ message: 'Failed to send message' });
    }
};
