const Message = require('../models/Message');
const Team = require('../models/Team');

// إرسال رسالة
exports.sendMessage = async (req, res) => {
    try {
        const { teamId, content, type = 'text', replyTo } = req.body;
        
        // التحقق من أن المستخدم عضو في الفريق
        const team = await Team.findOne({
            _id: teamId,
            $or: [
                { creator: req.user.userId },
                { 'members.user': req.user.userId, 'members.status': 'accepted' }
            ]
        });
        
        if (!team) {
            return res.status(403).json({ message: "ليس لديك صلاحية الوصول لهذا الفريق" });
        }
        
        const message = new Message({
            team: teamId,
            sender: req.user.userId,
            content,
            type,
            replyTo
        });
        
        await message.save();
        await message.populate('sender', 'name image');
        
        // إرسال الرسالة عبر Socket.io
        // io.to(teamId).emit('new_message', message);
        
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في إرسال الرسالة" });
    }
};

// الحصول على رسائل الفريق
exports.getTeamMessages = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        
        // التحقق من أن المستخدم عضو في الفريق
        const team = await Team.findOne({
            _id: teamId,
            $or: [
                { creator: req.user.userId },
                { 'members.user': req.user.userId, 'members.status': 'accepted' }
            ]
        });
        
        if (!team) {
            return res.status(403).json({ message: "ليس لديك صلاحية الوصول لهذا الفريق" });
        }
        
        const messages = await Message.find({ team: teamId })
            .populate('sender', 'name image')
            .populate('replyTo')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Message.countDocuments({ team: teamId });
        
        // تحديد الرسائل كمقروءة
        await Message.updateMany(
            { 
                team: teamId,
                'readBy.user': { $ne: req.user.userId }
            },
            { 
                $push: { 
                    readBy: { 
                        user: req.user.userId,
                        readAt: new Date()
                    }
                }
            }
        );
        
        res.json({
            messages: messages.reverse(),
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب الرسائل" });
    }
};

// تعديل رسالة
exports.editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        
        const message = await Message.findOne({
            _id: messageId,
            sender: req.user.userId
        });
        
        if (!message) {
            return res.status(404).json({ message: "الرسالة غير موجودة" });
        }
        
        message.content = content;
        message.isEdited = true;
        message.editedAt = new Date();
        
        await message.save();
        await message.populate('sender', 'name image');
        
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تعديل الرسالة" });
    }
};

// حذف رسالة
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        
        const message = await Message.findOneAndDelete({
            _id: messageId,
            sender: req.user.userId
        });
        
        if (!message) {
            return res.status(404).json({ message: "الرسالة غير موجودة" });
        }
        
        res.json({ message: "تم حذف الرسالة بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في حذف الرسالة" });
    }
};

// إضافة رد فعل
exports.addReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        
        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "الرسالة غير موجودة" });
        }
        
        // إزالة الرد الفعل السابق إن وُجد
        message.reactions = message.reactions.filter(
            r => r.user.toString() !== req.user.userId
        );
        
        // إضافة الرد الفعل الجديد
        message.reactions.push({
            user: req.user.userId,
            emoji
        });
        
        await message.save();
        
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في إضافة الرد الفعل" });
    }
};

// تثبيت/إلغاء تثبيت رسالة
exports.togglePin = async (req, res) => {
    try {
        const { messageId } = req.params;
        
        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "الرسالة غير موجودة" });
        }
        
        // التحقق من أن المستخدم هو منشئ الفريق
        const team = await Team.findOne({
            _id: message.team,
            creator: req.user.userId
        });
        
        if (!team) {
            return res.status(403).json({ message: "ليس لديك صلاحية لتثبيت الرسائل" });
        }
        
        message.isPinned = !message.isPinned;
        await message.save();
        
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تثبيت الرسالة" });
    }
};
