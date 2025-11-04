const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');

const normalizeString = (value) => typeof value === 'string' ? value.trim() : '';

const parseStringArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value.map((item) => normalizeString(item)).filter(Boolean);
    }
    if (typeof value === 'string') {
        return value.split(',').map((item) => normalizeString(item)).filter(Boolean);
    }
    return [];
};

const parseSkillArray = (value) => {
    if (!value) return [];
    const input = Array.isArray(value) ? value : (() => {
        if (typeof value === 'string') {
            return value.split(',').map((item) => item.trim()).filter(Boolean);
        }
        return [];
    })();

    return input
        .map((item) => {
            if (typeof item === 'string') {
                const [name, level] = item.split(':').map((str) => str.trim());
                return {
                    name,
                    level: level || 'intermediate'
                };
            }
            if (item && item.name) {
                return {
                    name: item.name.trim(),
                    level: item.level || 'intermediate'
                };
            }
            return null;
        })
        .filter((item) => item && item.name);
};

const parseLanguageArray = (value) => {
    if (!value) return [];
    const input = Array.isArray(value) ? value : (() => {
        if (typeof value === 'string') {
            return value.split(',').map((item) => item.trim()).filter(Boolean);
        }
        return [];
    })();

    return input
        .map((item) => {
            if (typeof item === 'string') {
                const [name, proficiency] = item.split(':').map((str) => str.trim());
                return {
                    name,
                    proficiency: proficiency || 'intermediate'
                };
            }
            if (item && item.name) {
                return {
                    name: item.name.trim(),
                    proficiency: item.proficiency || 'intermediate'
                };
            }
            return null;
        })
        .filter((item) => item && item.name);
};

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب البيانات" });
    }
});
// إضافة هذا المسار الجديد
router.get('/profile/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في جلب بيانات المستخدم" });
    }
});

router.get('/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في جلب بيانات المستخدم' });
    }
});

router.put('/profile', auth, upload.single('image'), async (req, res) => {
    try {
        const updates = {
            name: req.body.name ? req.body.name.trim() : undefined,
            specialization: req.body.specialization ? req.body.specialization.trim() : undefined,
            year: req.body.year !== undefined && req.body.year !== null ? Number(req.body.year) : undefined,
            whatsapp: req.body.whatsapp ? req.body.whatsapp.trim() : undefined,
            gender: req.body.gender,
            department: req.body.department ? req.body.department.trim() : undefined,
            bio: req.body.bio ? req.body.bio.trim() : undefined,
            studentId: req.body.studentId ? req.body.studentId.trim() : undefined,
            gpa: req.body.gpa !== undefined && req.body.gpa !== null ? Number(req.body.gpa) : undefined,
            interests: parseStringArray(req.body.interests),
            skills: parseSkillArray(req.body.skills),
            languages: parseLanguageArray(req.body.languages)
        };

        if (req.body.preferences) {
            try {
                const preferences = typeof req.body.preferences === 'string'
                    ? JSON.parse(req.body.preferences)
                    : req.body.preferences;
                if (preferences && typeof preferences === 'object') {
                    updates.preferences = {
                        emailNotifications: preferences.emailNotifications !== undefined ? Boolean(preferences.emailNotifications) : undefined,
                        teamInvitations: preferences.teamInvitations !== undefined ? Boolean(preferences.teamInvitations) : undefined,
                        newsletter: preferences.newsletter !== undefined ? Boolean(preferences.newsletter) : undefined,
                        language: preferences.language || undefined
                    };
                }
            } catch (error) {
                console.error('Preferences parse error:', error);
            }
        }

        updates.socialLinks = {
            linkedin: req.body.linkedin ? req.body.linkedin.trim() : undefined,
            github: req.body.github ? req.body.github.trim() : undefined,
            portfolio: req.body.portfolio ? req.body.portfolio.trim() : undefined,
            behance: req.body.behance ? req.body.behance.trim() : undefined
        };

        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
        }

        if (updates.year !== undefined && Number.isNaN(updates.year)) {
            delete updates.year;
        }
        if (updates.gpa !== undefined && Number.isNaN(updates.gpa)) {
            delete updates.gpa;
        }

        Object.keys(updates).forEach((key) => {
            if (updates[key] === undefined) {
                delete updates[key];
            }
        });

        if (updates.socialLinks) {
            Object.keys(updates.socialLinks).forEach((key) => {
                if (!updates.socialLinks[key]) {
                    delete updates.socialLinks[key];
                }
            });
            if (!Object.keys(updates.socialLinks).length) {
                delete updates.socialLinks;
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ في تحديث البيانات" });
    }
});

module.exports = router;