const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Team = require('../models/Team');

// إنشاء فريق جديد
router.post('/create', auth, async (req, res) => {
    try {
        const team = new Team({
            ...req.body,
            creator: req.user.userId
        });
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        console.error('Team creation error:', error);
        res.status(500).json({ message: error.message || "حدث خطأ في إنشاء الفريق" });
    }
});

// الحصول على جميع الفرق المتاحة
router.get('/available', auth, async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('creator', 'name email whatsapp image')
            .populate('members.user', 'name email whatsapp image specialization year');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب الفرق" });
    }
});

// الحصول على الفرق التي أنشأها المستخدم
router.get('/created', auth, async (req, res) => {
    try {
        const teams = await Team.find({ creator: req.user.userId })
            .populate('creator', 'name email whatsapp image')
            .populate('members.user', 'name email whatsapp image specialization year');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب الفرق" });
    }
});

// التقدم للانضمام لفريق
router.post('/join/:teamId', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);
        if (!team) {
            return res.status(404).json({ message: "الفريق غير موجود" });
        }

        const alreadyApplied = team.members.some(member => 
            member.user.toString() === req.user.userId
        );

        if (alreadyApplied) {
            return res.status(400).json({ message: "لقد تقدمت بالفعل لهذا الفريق" });
        }

        team.members.push({
            user: req.user.userId,
            role: req.body.role,
            status: 'pending'
        });

        await team.save();
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في الانضمام للفريق" });
    }
});

// تحديث حالة عضو
router.patch('/member-status/:teamId/:userId', auth, async (req, res) => {
    try {
        const team = await Team.findOne({
            _id: req.params.teamId,
            creator: req.user.userId
        });

        if (!team) {
            return res.status(404).json({ message: "الفريق غير موجود" });
        }

        const memberIndex = team.members.findIndex(
            member => member.user.toString() === req.params.userId
        );

        if (memberIndex === -1) {
            return res.status(404).json({ message: "العضو غير موجود" });
        }

        team.members[memberIndex].status = req.body.status;
        await team.save();
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تحديث حالة العضو" });
    }
});
router.get('/myteam', auth, async (req, res) => {
    try {
        const team = await Team.findOne({
            $or: [
                { creator: req.user.userId },
                { 'members.user': req.user.userId, 'members.status': 'accepted' }
            ]
        })
        .populate('creator', 'name email whatsapp image')
        .populate('members.user', 'name email whatsapp image specialization year');

        if (!team) {
            return res.status(404).json({ message: "لم يتم العثور على فريق" });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب بيانات الفريق" });
    }
});

module.exports = router;