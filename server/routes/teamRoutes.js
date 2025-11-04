const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Team = require('../models/Team');
const User = require('../models/User');

const populateTeamQuery = (query) => query
    .populate('creator', 'name email image whatsapp skills')
    .populate('members.user', 'name email image department year whatsapp skills');

const getMemberUserId = (member) => {
    if (!member) {
        return null;
    }
    if (member.user && member.user._id) {
        return member.user._id.toString();
    }
    if (member.user) {
        return member.user.toString();
    }
    return null;
};

const createAlias = (prefix, seed) => {
    const suffix = typeof seed === 'string' && seed.length >= 4
        ? seed.slice(-4)
        : Math.random().toString(36).slice(-4);
    return `${prefix}-${suffix}`;
};

const normalizeString = (value) => typeof value === 'string' ? value.trim() : '';

const toStringArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value
            .map((item) => normalizeString(item && item.name ? item.name : item))
            .filter(Boolean);
    }
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((item) => normalizeString(item))
            .filter(Boolean);
    }
    return [];
};

const toSkillArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === 'string') {
                    return { name: normalizeString(item), level: 'intermediate' };
                }
                if (item && item.name) {
                    return {
                        name: normalizeString(item.name),
                        level: item.level || 'intermediate'
                    };
                }
                return null;
            })
            .filter((item) => item && item.name);
    }
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((item) => normalizeString(item))
            .filter(Boolean)
            .map((name) => ({ name, level: 'intermediate' }));
    }
    return [];
};

const toTechnologyArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === 'string') {
                    return { name: normalizeString(item), category: 'other' };
                }
                if (item && item.name) {
                    return {
                        name: normalizeString(item.name),
                        category: item.category || 'other'
                    };
                }
                return null;
            })
            .filter((item) => item && item.name);
    }
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((item) => normalizeString(item))
            .filter(Boolean)
            .map((name) => ({ name, category: 'other' }));
    }
    return [];
};

const toMilestoneArray = (value) => {
    if (!value) return [];
    const input = Array.isArray(value) ? value : (() => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        }
        return [];
    })();

    return input
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return null;
            }
            const title = normalizeString(item.title);
            if (!title) {
                return null;
            }
            return {
                title,
                description: normalizeString(item.description || ''),
                deadline: item.deadline ? new Date(item.deadline) : undefined,
                completed: Boolean(item.completed),
                completedDate: item.completedDate ? new Date(item.completedDate) : undefined
            };
        })
        .filter(Boolean);
};

const toResourceArray = (value) => {
    if (!value) return [];
    const input = Array.isArray(value) ? value : (() => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        }
        return [];
    })();

    return input
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return null;
            }
            const name = normalizeString(item.name || item.title);
            const url = normalizeString(item.url || item.link);
            if (!name || !url) {
                return null;
            }
            return {
                name,
                url,
                type: item.type || 'other'
            };
        })
        .filter(Boolean);
};

const toRoleArray = (value) => {
    if (!value) return [];
    const input = Array.isArray(value) ? value : (() => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        }
        return [];
    })();

    return input
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return null;
            }
            const title = normalizeString(item.title);
            if (!title) {
                return null;
            }
            return {
                title,
                description: normalizeString(item.description || ''),
                required: item.required !== undefined ? Boolean(item.required) : true,
                filled: Boolean(item.filled)
            };
        })
        .filter(Boolean);
};

const isAcceptedStatus = (member) => {
    const status = member && member.status ? member.status : 'accepted';
    return status === 'accepted';
};

const recalcTeamState = (team) => {
    const acceptedCount = team.members.filter(isAcceptedStatus).length;
    team.currentMembersCount = acceptedCount || team.members.length;
    team.isOpen = acceptedCount < team.maxMembers;
    return acceptedCount;
};

const formatTeam = (team, currentUserId) => {
    const acceptedMembers = team.members.filter(isAcceptedStatus);
    const pendingMembers = team.members.filter((member) => member.status === 'pending');
    const creatorId = team.creator ? team.creator._id.toString() : null;
    const viewerId = currentUserId ? currentUserId.toString() : null;
    const isViewerCreator = creatorId && viewerId ? creatorId === viewerId : false;
    const isViewerAcceptedMember = viewerId ? acceptedMembers.some((member) => getMemberUserId(member) === viewerId) : false;
    const canViewSensitive = isViewerCreator || isViewerAcceptedMember;

    const creatorSkills = Array.isArray(team.creator?.skills)
        ? team.creator.skills
            .map((skill) => {
                if (typeof skill === 'string') {
                    return { name: skill, level: 'intermediate' };
                }
                if (skill && skill.name) {
                    return { name: skill.name, level: skill.level || 'intermediate' };
                }
                return null;
            })
            .filter(Boolean)
        : [];

    const safeCreator = team.creator ? (canViewSensitive ? {
        _id: team.creator._id,
        name: team.creator.name,
        email: team.creator.email,
        whatsapp: team.creator.whatsapp || team.whatsapp || null,
        department: team.creator.department || null,
        year: team.creator.year || null,
        skills: creatorSkills
    } : {
        _id: team.creator._id,
        alias: createAlias('TeamOwner', team.creator._id.toString()),
        skills: creatorSkills.length ? creatorSkills : (Array.isArray(team.requiredSkills)
            ? team.requiredSkills.map((skill) => ({ name: skill, level: 'intermediate' }))
            : [])
    }) : null;

    const safeTeamWhatsapp = canViewSensitive ? (team.whatsapp || (team.creator ? team.creator.whatsapp : null) || null) : null;
    const safeMeetingLink = canViewSensitive ? (team.meetingLink || '') : '';

    return {
        _id: team._id,
        name: team.projectName || team.name || team.title || 'Team',
        subject: team.category || team.subject || '',
        description: team.description || team.projectDescription || '',
        maxMembers: team.maxMembers || team.memberLimit || acceptedMembers.length || (team.members ? team.members.length : 0),
        currentMembers: acceptedMembers.length || team.currentMembersCount || (team.members ? team.members.length : 0),
        isFull: (acceptedMembers.length || team.currentMembersCount || 0) >= (team.maxMembers || team.memberLimit || acceptedMembers.length),
        isCreator: isViewerCreator,
        creator: safeCreator,
        whatsapp: safeTeamWhatsapp,
        difficulty: team.difficulty || 'intermediate',
        tags: Array.isArray(team.tags) ? team.tags : [],
        requiredSkills: Array.isArray(team.requiredSkills) ? team.requiredSkills : [],
        technologies: Array.isArray(team.technologies)
            ? team.technologies.map((tech) => ({
                name: tech.name,
                category: tech.category || 'other'
            }))
            : [],
        meetingLink: safeMeetingLink,
        timeline: team.timeline ? {
            startDate: team.timeline.startDate || null,
            expectedEndDate: team.timeline.expectedEndDate || null,
            actualEndDate: team.timeline.actualEndDate || null
        } : { startDate: null, expectedEndDate: null, actualEndDate: null },
        milestones: Array.isArray(team.milestones) ? team.milestones : [],
        roles: Array.isArray(team.roles) ? team.roles : [],
        status: team.status || 'recruiting',
        visibility: team.visibility || 'public',
        isOpen: team.isOpen,
        resources: Array.isArray(team.resources) ? team.resources : [],
        ratings: {
            average: team.averageRating || 0,
            count: Array.isArray(team.ratings) ? team.ratings.length : 0
        },
        pendingRequestsCount: pendingMembers.length,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        members: acceptedMembers.map((member) => {
            const memberId = member.user && member.user._id ? member.user._id.toString() : member._id.toString();
            const revealMember = canViewSensitive || (viewerId && memberId === viewerId);
            const memberSkills = Array.isArray(member.user?.skills)
                ? member.user.skills
                    .map((skill) => {
                        if (typeof skill === 'string') {
                            return { name: skill, level: 'intermediate' };
                        }
                        if (skill && skill.name) {
                            return { name: skill.name, level: skill.level || 'intermediate' };
                        }
                        return null;
                    })
                    .filter(Boolean)
                : [];

            return {
                _id: memberId,
                name: revealMember && member.user && member.user.name ? member.user.name : createAlias('Teammate', memberId),
                email: revealMember && member.user && member.user.email ? member.user.email : '',
                whatsapp: revealMember && member.user && member.user.whatsapp ? member.user.whatsapp : null,
                role: member.role || 'Member',
                avatar: revealMember && member.user && member.user.image ? member.user.image : null,
                skills: memberSkills
            };
        }),
        pendingRequests: pendingMembers.map((member) => {
            const applicantSkills = Array.isArray(member.user?.skills)
                ? member.user.skills
                    .map((skill) => {
                        if (typeof skill === 'string') {
                            return { name: skill, level: 'intermediate' };
                        }
                        if (skill && skill.name) {
                            return { name: skill.name, level: skill.level || 'intermediate' };
                        }
                        return null;
                    })
                    .filter(Boolean)
                : [];

            return {
                _id: member._id,
                alias: createAlias('Applicant', member._id.toString()),
                role: member.role || 'Member',
                skills: applicantSkills,
                submittedAt: member.createdAt || member.requestedAt || member.joinedAt || member.updatedAt
            };
        })
    };
};

router.post('/', auth, async (req, res) => {
    try {
        const {
            name,
            subject,
            maxMembers,
            description,
            difficulty,
            tags,
            requiredSkills,
            technologies,
            meetingLink,
            startDate,
            expectedEndDate,
            visibility,
            status,
            resources,
            milestones,
            roles
        } = req.body;

        if (!name || !maxMembers || !description) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const parsedMax = parseInt(maxMembers, 10);
        if (Number.isNaN(parsedMax) || parsedMax < 1) {
            return res.status(400).json({ message: 'Invalid max members value' });
        }

        const creator = await User.findById(req.user.userId).select('name email whatsapp image department year');
        if (!creator) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!creator.whatsapp) {
            return res.status(400).json({ message: 'Please add your WhatsApp number before creating a team' });
        }

        const team = new Team({
            projectName: name.trim(),
            description: description.trim(),
            category: subject ? subject.trim() : 'other',
            tags: (() => {
                const subjectTags = subject ? [subject.trim()] : [];
                const customTags = toStringArray(tags);
                return Array.from(new Set([...subjectTags, ...customTags]));
            })(),
            difficulty: difficulty || 'intermediate',
            requiredSkills: toStringArray(requiredSkills),
            technologies: toTechnologyArray(technologies),
            meetingLink: normalizeString(meetingLink) || undefined,
            maxMembers: parsedMax,
            currentMembersCount: 1,
            whatsapp: creator.whatsapp,
            creator: creator._id,
            roles: toRoleArray(roles),
            members: [{
                user: creator._id,
                role: 'Owner',
                status: 'accepted',
                joinedAt: new Date()
            }],
            status: status || 'recruiting',
            visibility: visibility || 'public',
            isOpen: true,
            timeline: (startDate || expectedEndDate) ? {
                startDate: startDate ? new Date(startDate) : undefined,
                expectedEndDate: expectedEndDate ? new Date(expectedEndDate) : undefined
            } : undefined,
            milestones: toMilestoneArray(milestones),
            resources: toResourceArray(resources)
        });

        await team.save();
        await team.populate([
            { path: 'creator', select: 'name email image whatsapp' },
            { path: 'members.user', select: 'name email image department year whatsapp' }
        ]);

        res.status(201).json(formatTeam(team, req.user.userId));
    } catch (error) {
        console.error('Create team error:', error);
        res.status(500).json({ message: error.message || 'Failed to create team' });
    }
});

router.get('/my-team', auth, async (req, res) => {
    try {
        const team = await populateTeamQuery(Team.findOne({
            $or: [
                { creator: req.user.userId },
                {
                    members: {
                        $elemMatch: {
                            user: req.user.userId,
                            $or: [
                                { status: 'accepted' },
                                { status: { $exists: false } },
                                { status: null }
                            ]
                        }
                    }
                }
            ]
        }));

        if (!team) {
            return res.status(404).json({ message: 'Not in a team yet' });
        }

        recalcTeamState(team);
        res.json(formatTeam(team, req.user.userId));
    } catch (error) {
        console.error('Get my team error:', error);
        res.status(500).json({ message: 'Failed to fetch team details' });
    }
});

router.get('/requests', auth, async (req, res) => {
    try {
        const team = await populateTeamQuery(Team.findOne({ creator: req.user.userId }));

        if (!team) {
            return res.json([]);
        }

        recalcTeamState(team);
        const formatted = formatTeam(team, req.user.userId);

        res.json(formatted.pendingRequests);
    } catch (error) {
        console.error('Get team requests error:', error);
        res.status(500).json({ message: 'Failed to load requests' });
    }
});

router.post('/requests/:requestId/accept', auth, async (req, res) => {
    try {
        const { requestId } = req.params;

        const team = await populateTeamQuery(Team.findOne({
            creator: req.user.userId,
            'members._id': requestId
        }));

        if (!team) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const member = team.members.id(requestId);
        if (!member) {
            return res.status(404).json({ message: 'Request not found' });
        }

    const acceptedCount = team.members.filter(isAcceptedStatus).length;
        if (acceptedCount >= team.maxMembers) {
            return res.status(400).json({ message: 'Team is already full' });
        }

        member.status = 'accepted';
        member.joinedAt = new Date();
        recalcTeamState(team);

        await team.save();
        await team.populate({ path: 'members.user', select: 'name email image department year whatsapp' });

        res.json({ message: 'Request accepted', team: formatTeam(team, req.user.userId) });
    } catch (error) {
        console.error('Accept request error:', error);
        res.status(500).json({ message: 'Failed to accept request' });
    }
});

router.post('/requests/:requestId/reject', auth, async (req, res) => {
    try {
        const { requestId } = req.params;

        const team = await populateTeamQuery(Team.findOne({
            creator: req.user.userId,
            'members._id': requestId
        }));

        if (!team) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const member = team.members.id(requestId);
        if (!member) {
            return res.status(404).json({ message: 'Request not found' });
        }

        member.remove();
        recalcTeamState(team);

        await team.save();
        await team.populate({ path: 'members.user', select: 'name email image department year whatsapp' });

        res.json({ message: 'Request rejected', team: formatTeam(team, req.user.userId) });
    } catch (error) {
        console.error('Reject request error:', error);
        res.status(500).json({ message: 'Failed to reject request' });
    }
});

router.post('/:teamId/request', auth, async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await populateTeamQuery(Team.findById(teamId));

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const userId = req.user.userId.toString();
        const creatorId = team.creator ? team.creator._id.toString() : null;

        if (creatorId === userId) {
            return res.status(400).json({ message: 'You are already the team owner' });
        }

        const existing = team.members.find((member) => getMemberUserId(member) === userId);
        if (existing) {
            if (existing.status === 'pending') {
                return res.status(400).json({ message: 'You already requested to join this team' });
            }
            if (isAcceptedStatus(existing)) {
                return res.status(400).json({ message: 'You are already a team member' });
            }
        }

        const acceptedCount = team.members.filter(isAcceptedStatus).length;
        if (acceptedCount >= team.maxMembers) {
            return res.status(400).json({ message: 'Team is already full' });
        }

        team.members.push({
            user: req.user.userId,
            role: req.body.role || 'Member',
            status: 'pending'
        });

        recalcTeamState(team);
        await team.save();

        res.json({ message: 'Request sent successfully' });
    } catch (error) {
        console.error('Join team request error:', error);
        res.status(500).json({ message: 'Failed to send join request' });
    }
});

router.delete('/:teamId/leave', auth, async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.userId.toString();

        const team = await populateTeamQuery(Team.findById(teamId));

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const creatorId = team.creator ? team.creator._id.toString() : null;
        const memberIndex = team.members.findIndex((member) => getMemberUserId(member) === userId);
        const isCreator = creatorId === userId;

        if (!isCreator && memberIndex === -1) {
            return res.status(404).json({ message: 'You are not part of this team' });
        }

        if (isCreator) {
            const nextOwner = team.members.find((member) => isAcceptedStatus(member) && getMemberUserId(member) !== userId);
            if (nextOwner) {
                team.creator = nextOwner.user && nextOwner.user._id ? nextOwner.user._id : nextOwner.user;
                nextOwner.role = 'Owner';
            } else {
                await Team.deleteOne({ _id: team._id });
                return res.json({ message: 'Team deleted because no members were left' });
            }
        }

        if (memberIndex > -1) {
            team.members.splice(memberIndex, 1);
        }

        recalcTeamState(team);
        await team.save();
        await team.populate('members.user', 'name email image department year whatsapp');

        res.json({ message: 'Left team successfully', team: formatTeam(team, req.user.userId) });
    } catch (error) {
        console.error('Leave team error:', error);
        res.status(500).json({ message: 'Failed to leave team' });
    }
});

router.delete('/:teamId/members/:userId', auth, async (req, res) => {
    try {
        const { teamId, userId } = req.params;

        const team = await populateTeamQuery(Team.findOne({
            _id: teamId,
            creator: req.user.userId
        }));

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.creator && team.creator._id.toString() === userId) {
            return res.status(400).json({ message: 'Team owner cannot be removed' });
        }

        const memberIndex = team.members.findIndex((member) => getMemberUserId(member) === userId);
        if (memberIndex === -1) {
            return res.status(404).json({ message: 'Member not found' });
        }

        team.members.splice(memberIndex, 1);
        recalcTeamState(team);

        await team.save();
        await team.populate('members.user', 'name email image department year whatsapp');

        res.json({ message: 'Member removed', team: formatTeam(team, req.user.userId) });
    } catch (error) {
        console.error('Remove team member error:', error);
        res.status(500).json({ message: 'Failed to remove member' });
    }
});

router.get('/:teamId', auth, async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await populateTeamQuery(Team.findById(teamId));

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        recalcTeamState(team);
        res.json(formatTeam(team, req.user.userId));
    } catch (error) {
        console.error('Get team details error:', error);
        res.status(500).json({ message: 'Failed to fetch team details' });
    }
});

module.exports = router;