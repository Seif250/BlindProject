import React, { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Chip,
    Button,
    Alert,
    CircularProgress,
    Avatar,
    IconButton,
    Stack,
    Divider,
    Tooltip,
    Link
} from '@mui/material';
import { Group, ExitToApp, Delete, OpenInNew, PendingActions } from '@mui/icons-material';
import api from '../../services/api';

const difficultyColor = (value) => {
    switch (value) {
        case 'beginner':
            return '#22c55e';
        case 'advanced':
            return '#f97316';
        default:
            return '#7f5af0';
    }
};

const statusColor = (value) => {
    switch (value) {
        case 'completed':
            return '#38bdf8';
        case 'in-progress':
            return '#eab308';
        default:
            return '#2cb67d';
    }
};

const normalizeTeam = (team) => {
    if (!team || typeof team !== 'object') {
        return null;
    }

    const formatted = {
        ...team,
        _id: team._id || team.id,
        name: team.name || team.projectName || 'Team',
        subject: team.subject || team.category || 'General',
        description: team.description || team.projectDescription || '',
        difficulty: team.difficulty || 'intermediate',
        status: team.status || 'recruiting',
        visibility: team.visibility || 'public',
        tags: Array.isArray(team.tags) ? team.tags : [],
        requiredSkills: Array.isArray(team.requiredSkills) ? team.requiredSkills : [],
        technologies: Array.isArray(team.technologies)
            ? team.technologies.map((tech) => (typeof tech === 'string' ? { name: tech, category: 'other' } : tech))
            : [],
        resources: Array.isArray(team.resources) ? team.resources : [],
        roles: Array.isArray(team.roles) ? team.roles : [],
        milestones: Array.isArray(team.milestones) ? team.milestones : [],
        members: Array.isArray(team.members)
            ? team.members.map((member) => ({
                _id: member._id || member.id,
                name: member.name || member.fullName || 'Member',
                email: member.email || member.contact,
                role: member.role || 'Member',
                avatar: member.avatar || null
            }))
            : [],
        creator: team.creator || null,
        pendingRequestsCount: team.pendingRequestsCount || 0,
        timeline: team.timeline || {
            startDate: team.startDate || null,
            expectedEndDate: team.expectedEndDate || null,
            actualEndDate: team.actualEndDate || null
        },
        meetingLink: team.meetingLink || '',
        whatsapp: team.whatsapp || (team.creator && team.creator.whatsapp) || ''
    };

    if (formatted.timeline && !formatted.timeline.startDate && team.startDate) {
        formatted.timeline.startDate = team.startDate;
    }
    if (formatted.timeline && !formatted.timeline.expectedEndDate && team.expectedEndDate) {
        formatted.timeline.expectedEndDate = team.expectedEndDate;
    }

    return formatted;
};

const MyTeam = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [leaveLoading, setLeaveLoading] = useState(false);
    const [removeLoading, setRemoveLoading] = useState('');

    const currentUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || {};
        } catch (err) {
            return {};
        }
    }, []);

    useEffect(() => {
        fetchTeam();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTeam = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/teams/my-team');
            const payload = res.data?.team || res.data;
            setTeam(normalizeTeam(payload));
        } catch (err) {
            setTeam(null);
            setError(err.response?.data?.message || 'Not in a team yet');
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!team) return;
        if (!window.confirm('Are you sure you want to leave this team?')) return;
        setLeaveLoading(true);
        try {
            await api.delete(`/api/teams/${team._id}/leave`);
            setSuccess('Left team successfully');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to leave team');
        } finally {
            setLeaveLoading(false);
        }
    };

    const handleRemove = async (userId) => {
        if (!team || !userId) return;
        if (!window.confirm('Remove this member?')) return;
        setRemoveLoading(userId);
        try {
            await api.delete(`/api/teams/${team._id}/members/${userId}`);
            setSuccess('Member removed');
            fetchTeam();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove member');
        } finally {
            setRemoveLoading('');
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)' }}>
                <CircularProgress sx={{ color: '#7f5af0' }} />
            </Box>
        );
    }

    const isCreator = Boolean(team?.creator && (team.creator._id === currentUser?._id || team.isCreator));

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 4, textAlign: 'center' }}>My Team</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                {!team ? (
                    <Typography variant="h6" sx={{ color: 'rgba(226, 232, 240, 0.5)', textAlign: 'center' }}>You're not in a team yet</Typography>
                ) : (
                    <Card sx={{ background: 'rgba(12, 17, 31, 0.85)', border: '1px solid rgba(127, 90, 240, 0.35)', borderRadius: 4, boxShadow: '0 24px 48px rgba(5, 7, 20, 0.55)' }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#e2e8f0', mb: 1 }}>{team.name}</Typography>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        <Chip label={team.subject} sx={{ background: 'rgba(127, 90, 240, 0.2)', color: '#7f5af0', fontWeight: 600 }} />
                                        <Chip label={`Difficulty: ${team.difficulty}`} sx={{ background: `${difficultyColor(team.difficulty)}20`, color: difficultyColor(team.difficulty), fontWeight: 600, textTransform: 'capitalize' }} />
                                        <Chip label={`Status: ${team.status}`} sx={{ background: `${statusColor(team.status)}20`, color: statusColor(team.status), fontWeight: 600, textTransform: 'capitalize' }} />
                                        <Chip label={`Visibility: ${team.visibility}`} sx={{ background: 'rgba(148, 163, 184, 0.18)', color: '#cbd5f5' }} />
                                        <Chip icon={<Group />} label={`${team.currentMembers}/${team.maxMembers}`} sx={{ background: 'rgba(44, 198, 125, 0.2)', color: '#2cb67d', fontWeight: 600 }} />
                                    </Stack>
                                </Box>
                                {team.pendingRequestsCount > 0 && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<PendingActions />}
                                        href="/teams/requests"
                                        sx={{ alignSelf: 'flex-start', borderColor: '#7f5af0', color: '#7f5af0', '&:hover': { borderColor: '#6b47d6' } }}
                                    >
                                        {team.pendingRequestsCount} Pending
                                    </Button>
                                )}
                            </Box>

                            <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.72)', mb: 3 }}>{team.description || 'No description yet. Share what you are building with your teammates.'}</Typography>

                            {(team.tags.length > 0 || team.requiredSkills.length > 0 || team.technologies.length > 0) && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 2 }}>Focus & Stack</Typography>
                                    {team.tags.length > 0 && (
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                            {team.tags.map((tag) => (
                                                <Chip key={tag} label={tag} size="small" sx={{ background: 'rgba(44, 198, 125, 0.18)', color: '#2cb67d' }} />
                                            ))}
                                        </Stack>
                                    )}
                                    {team.requiredSkills.length > 0 && (
                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>Skills Needed</Typography>
                                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                {team.requiredSkills.map((skill) => (
                                                    <Chip key={skill} label={skill} size="small" sx={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8' }} />
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                    {team.technologies.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>Tech Stack</Typography>
                                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                {team.technologies.map((tech) => (
                                                    <Chip key={tech.name} label={tech.name} size="small" sx={{ background: 'rgba(226, 232, 240, 0.12)', color: '#e2e8f0' }} />
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {(team.timeline?.startDate || team.timeline?.expectedEndDate || team.timeline?.actualEndDate) && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Timeline</Typography>
                                    <Stack spacing={0.5}>
                                        {team.timeline?.startDate && <Typography sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>Kickoff: {new Date(team.timeline.startDate).toLocaleDateString()}</Typography>}
                                        {team.timeline?.expectedEndDate && <Typography sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>Target Submission: {new Date(team.timeline.expectedEndDate).toLocaleDateString()}</Typography>}
                                        {team.timeline?.actualEndDate && <Typography sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>Actual Delivery: {new Date(team.timeline.actualEndDate).toLocaleDateString()}</Typography>}
                                    </Stack>
                                </Box>
                            )}

                            {(team.meetingLink || team.whatsapp) && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Coordination</Typography>
                                    {team.meetingLink && (
                                        <Typography sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>
                                            Weekly Sync: <Link href={team.meetingLink} target="_blank" rel="noopener" underline="hover" sx={{ color: '#7f5af0' }}>{team.meetingLink}</Link>
                                        </Typography>
                                    )}
                                    {team.whatsapp && (
                                        <Typography sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>
                                            WhatsApp: <Link href={`https://wa.me/${team.whatsapp}`} target="_blank" rel="noopener" underline="hover" sx={{ color: '#2cb67d' }}>{team.whatsapp}</Link>
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            {team.resources.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Resources</Typography>
                                    <Stack spacing={1.2}>
                                        {team.resources.map((resource, idx) => (
                                            <Box key={`${resource.url}-${idx}`} sx={{ p: 1.5, borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.25)', background: 'rgba(127, 90, 240, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ color: '#e2e8f0' }}>{resource.name}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', textTransform: 'capitalize' }}>{resource.type || 'link'}</Typography>
                                                </Box>
                                                <Tooltip title="Open resource">
                                                    <IconButton component={Link} href={resource.url} target="_blank" rel="noopener" sx={{ color: '#7f5af0' }}>
                                                        <OpenInNew fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {team.roles.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Roles</Typography>
                                    <Stack spacing={1.2}>
                                        {team.roles.map((role, idx) => (
                                            <Box key={`${role.title}-${idx}`} sx={{ p: 1.5, borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)', background: 'rgba(8, 11, 28, 0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{role.title}</Typography>
                                                    {role.description && <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>{role.description}</Typography>}
                                                </Box>
                                                <Chip label={role.filled ? 'Filled' : role.required === false ? 'Optional' : 'Open'} size="small" sx={{ background: role.filled ? 'rgba(44, 198, 125, 0.2)' : 'rgba(239, 68, 68, 0.12)', color: role.filled ? '#2cb67d' : '#ef4444' }} />
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            <Divider sx={{ borderColor: 'rgba(127, 90, 240, 0.2)', my: 3 }} />

                            <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 2 }}>Members</Typography>
                            <List sx={{ mb: 3 }}>
                                {team.members.map((member) => {
                                    const isCreatorMember = team.creator?._id === member._id;
                                    const isCurrentUserCreator = isCreator;
                                    const canRemove = isCurrentUserCreator && !isCreatorMember && member._id !== currentUser?._id;
                                    const initials = member.name ? member.name.charAt(0).toUpperCase() : 'M';
                                    return (
                                        <ListItem
                                            key={member._id}
                                            sx={{ background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, mb: 1.2, border: '1px solid rgba(127, 90, 240, 0.2)' }}
                                            secondaryAction={
                                                isCreatorMember ? (
                                                    <Chip label="Leader" size="small" sx={{ background: 'rgba(231, 92, 255, 0.2)', color: '#e75cff', fontWeight: 600 }} />
                                                ) : canRemove ? (
                                                    <IconButton edge="end" onClick={() => handleRemove(member._id)} disabled={removeLoading === member._id}>
                                                        <Delete sx={{ color: removeLoading === member._id ? '#64748b' : '#ef4444' }} />
                                                    </IconButton>
                                                ) : null
                                            }
                                        >
                                            <Avatar src={member.avatar || undefined} sx={{ mr: 2, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)' }}>{initials}</Avatar>
                                            <ListItemText
                                                primary={`${member.name}${member.role ? ` · ${member.role}` : ''}`}
                                                secondary={member.email}
                                                primaryTypographyProps={{ sx: { color: '#e2e8f0', fontWeight: 600 } }}
                                                secondaryTypographyProps={{ sx: { color: 'rgba(226, 232, 240, 0.6)' } }}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>

                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                startIcon={<ExitToApp />}
                                onClick={handleLeave}
                                disabled={leaveLoading}
                                sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { borderColor: '#dc2626', background: 'rgba(239, 68, 68, 0.1)' } }}
                            >
                                {leaveLoading ? 'Leaving...' : 'Leave Team'}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Box>
    );
};

export default MyTeam;
