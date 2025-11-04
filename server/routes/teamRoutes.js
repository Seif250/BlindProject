const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Team = require('../models/Team');
const User = require('../models/User');

const populateTeamQuery = (query) => query
    .populate('creator', 'name email image whatsapp')
    .populate('members.user', 'name email image department year whatsapp');

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

const recalcTeamState = (team) => {
    const acceptedCount = team.members.filter((member) => member.status === 'accepted').length;
    team.currentMembersCount = acceptedCount;
    team.isOpen = acceptedCount < team.maxMembers;
    return acceptedCount;
};

const formatTeam = (team, currentUserId) => {
    const acceptedMembers = team.members.filter((member) => member.status === 'accepted');
    const pendingMembers = team.members.filter((member) => member.status === 'pending');
    const creatorId = team.creator ? team.creator._id.toString() : null;

    return {
        _id: team._id,
        name: team.projectName,
        subject: team.category || '',
        description: team.description,
        maxMembers: team.maxMembers,
        currentMembers: acceptedMembers.length,
        isFull: acceptedMembers.length >= team.maxMembers,
        isCreator: creatorId === (currentUserId ? currentUserId.toString() : null),
        creator: team.creator ? {
            _id: team.creator._id,
            name: team.creator.name,
            email: team.creator.email
        } : null,
        members: acceptedMembers.map((member) => ({
            _id: member.user && member.user._id ? member.user._id.toString() : member._id.toString(),
            name: member.user && member.user.name ? member.user.name : 'Unknown',
            email: member.user && member.user.email ? member.user.email : '',
            role: member.role || 'Member',
            avatar: member.user && member.user.image ? member.user.image : null
        })),
        pendingRequests: pendingMembers.map((member) => ({
            _id: member._id,
            user: member.user ? {
                _id: member.user._id,
                name: member.user.name,
                email: member.user.email,
                department: member.user.department,
                year: member.user.year
            } : null,
            role: member.role || 'Member'
        }))
    };
};

router.post('/', auth, async (req, res) => {
    try {
        const { name, subject, maxMembers, description } = req.body;

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
            tags: subject ? [subject.trim()] : [],
            maxMembers: parsedMax,
            currentMembersCount: 1,
            whatsapp: creator.whatsapp,
            creator: creator._id,
            members: [{
                user: creator._id,
                role: 'Owner',
                status: 'accepted',
                joinedAt: new Date()
            }],
            status: 'recruiting',
            visibility: 'public',
            isOpen: true
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
                { members: { $elemMatch: { user: req.user.userId, status: 'accepted' } } }
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

        const pending = team.members
            .filter((member) => member.status === 'pending')
            .map((member) => ({
                _id: member._id,
                user: member.user ? {
                    _id: member.user._id,
                    name: member.user.name,
                    email: member.user.email,
                    department: member.user.department,
                    year: member.user.year
                } : null,
                role: member.role || 'Member'
            }));

        res.json(pending);
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

        const acceptedCount = team.members.filter((item) => item.status === 'accepted').length;
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
            if (existing.status === 'accepted') {
                return res.status(400).json({ message: 'You are already a team member' });
            }
        }

        const acceptedCount = team.members.filter((member) => member.status === 'accepted').length;
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
            const nextOwner = team.members.find((member) => member.status === 'accepted' && getMemberUserId(member) !== userId);
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

module.exports = router;