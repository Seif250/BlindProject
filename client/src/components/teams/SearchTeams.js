import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Alert,
    CircularProgress,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Tooltip,
    Link,
    Divider
} from '@mui/material';
import { Group, Person, Close } from '@mui/icons-material';
import api from '../../services/api';

const normalizeTeam = (team) => {
    if (!team || typeof team !== 'object') {
        return null;
    }

    const membersArray = Array.isArray(team.members) ? team.members : [];
    const acceptedMembers = membersArray.filter(member => (member.status || 'accepted') === 'accepted');

    const maxMembers = team.maxMembers ?? team.memberLimit ?? acceptedMembers.length ?? membersArray.length ?? 0;
    const currentMembers = team.currentMembers ?? team.currentMembersCount ?? acceptedMembers.length ?? membersArray.length ?? 0;

    const timeline = team.timeline || {};

    return {
        ...team,
        _id: team._id || team.id,
        name: team.name || team.projectName || team.title || 'Untitled Team',
        subject: team.subject || team.category || 'General',
        description: team.description || team.projectDescription || '',
        maxMembers,
        currentMembers,
        isFull: team.isFull ?? currentMembers >= maxMembers,
        creator: team.creator || team.owner || null,
        members: acceptedMembers.length ? acceptedMembers : membersArray,
        difficulty: team.difficulty || 'intermediate',
        visibility: team.visibility || 'public',
        status: team.status || 'recruiting',
        tags: Array.isArray(team.tags) ? team.tags : [],
        requiredSkills: Array.isArray(team.requiredSkills) ? team.requiredSkills : [],
        technologies: Array.isArray(team.technologies) ? team.technologies : [],
        resources: Array.isArray(team.resources) ? team.resources : [],
        milestones: Array.isArray(team.milestones) ? team.milestones : [],
        roles: Array.isArray(team.roles) ? team.roles : [],
        meetingLink: team.meetingLink || team.meeting_url || '',
        startDate: team.startDate || timeline.startDate || team.kickoffDate || '',
        expectedEndDate: team.expectedEndDate || timeline.expectedEndDate || team.deadline || '',
        actualEndDate: timeline.actualEndDate || '',
        timeline,
        whatsapp: team.whatsapp || team.contactWhatsapp || ''
    };
};

const SearchTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchTeams = async () => {
            try {
                const res = await api.get('/api/search/teams');
                const rawTeams = Array.isArray(res.data)
                    ? res.data
                    : res.data?.teams
                        ? res.data.teams
                        : [];

                const normalizedTeams = rawTeams
                    .map(normalizeTeam)
                    .filter(Boolean)
                    .filter(team => !team.isFull);

                if (isMounted) {
                    setTeams(normalizedTeams);
                }
            } catch (err) {
                console.error('Search teams error:', err);
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to load teams');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTeams();

        return () => {
            isMounted = false;
        };
    }, []);

    const fetchTeamDetails = async (teamId) => {
        setSelectedTeam((prev) => (prev?._id === teamId ? prev : { _id: teamId }));
        setDetailsLoading(true);
        setDetailsError('');
        try {
            const res = await api.get(`/api/teams/${teamId}`);
            const formatted = normalizeTeam(res.data?.team || res.data);
            setSelectedTeam(formatted);
        } catch (err) {
            setDetailsError(err.response?.data?.message || 'Failed to load team details');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleJoin = async (teamId) => {
        try {
            await api.post(`/api/teams/${teamId}/request`);
            setSuccess('Join request sent!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send request');
        }
    };

    const difficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return '#22c55e';
            case 'advanced':
                return '#f97316';
            default:
                return '#7f5af0';
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#38bdf8';
            case 'in-progress':
                return '#eab308';
            default:
                return '#2cb67d';
        }
    };

    if (loading) return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)' }}><CircularProgress sx={{ color: '#7f5af0' }} /></Box>;

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1, textAlign: 'center' }}>Find Teams</Typography>
                <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 4, textAlign: 'center' }}>Join a team that matches your interests</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                {teams.length === 0 ? (
                    <Typography variant="h6" sx={{ color: 'rgba(226, 232, 240, 0.5)', textAlign: 'center' }}>No available teams found</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {teams.map(team => (
                            <Grid item xs={12} sm={6} md={4} key={team._id}>
                                <Card sx={{ height: '100%', background: 'rgba(12, 17, 31, 0.8)', border: '1px solid rgba(127, 90, 240, 0.2)', borderRadius: 4, transition: 'all 0.3s', '&:hover': { borderColor: '#7f5af0', transform: 'translateY(-4px)', boxShadow: '0 12px 36px rgba(127, 90, 240, 0.3)' } }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#e2e8f0', mb: 1 }}>{team.name}</Typography>
                                        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                            <Chip icon={<Person />} label={team.subject} size="small" sx={{ background: 'rgba(127, 90, 240, 0.2)', color: '#7f5af0', fontWeight: 600 }} />
                                            <Chip label={team.difficulty} size="small" sx={{ background: `${difficultyColor(team.difficulty)}20`, color: difficultyColor(team.difficulty), textTransform: 'capitalize', fontWeight: 600 }} />
                                            <Chip label={team.status.replace('-', ' ')} size="small" sx={{ background: `${statusColor(team.status)}20`, color: statusColor(team.status), textTransform: 'capitalize', fontWeight: 600 }} />
                                        </Stack>
                                        <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 2, minHeight: 60 }}>{team.description || 'No description provided yet.'}</Typography>
                                        {((team.tags?.length || 0) > 0 || (team.requiredSkills?.length || 0) > 0) && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'block', mb: 1 }}>Focus</Typography>
                                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                    {team.tags?.slice(0, 3).map((tag) => (
                                                        <Chip key={tag} label={tag} size="small" sx={{ background: 'rgba(44, 198, 125, 0.15)', color: '#2cb67d' }} />
                                                    ))}
                                                    {team.requiredSkills?.slice(0, 3).map((skill) => (
                                                        <Chip key={skill} label={skill} size="small" sx={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8' }} />
                                                    ))}
                                                    {Math.max(0, (team.tags?.length || 0) + (team.requiredSkills?.length || 0) - 6) > 0 && (
                                                        <Chip
                                                            label={`+${Math.max(0, (team.tags?.length || 0) + (team.requiredSkills?.length || 0) - 6)}`}
                                                            size="small"
                                                            sx={{ background: 'rgba(226, 232, 240, 0.12)', color: '#e2e8f0' }}
                                                        />
                                                    )}
                                                </Stack>
                                            </Box>
                                        )}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Chip icon={<Group />} label={`${team.currentMembers}/${team.maxMembers}`} size="small" sx={{ background: 'rgba(44, 198, 125, 0.2)', color: '#2cb67d', fontWeight: 600 }} />
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)' }}>by {team.creator?.name || team.creator?.email || 'Unknown'}</Typography>
                                        </Box>
                                        <Stack spacing={1.5}>
                                            <Button fullWidth variant="contained" onClick={() => handleJoin(team._id)} sx={{ background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', color: '#fff', fontWeight: 600, '&:hover': { background: 'linear-gradient(135deg, #6b47d6 0%, #25a569 100%)' } }}>Request to Join</Button>
                                            <Button fullWidth variant="outlined" onClick={() => fetchTeamDetails(team._id)} sx={{ borderColor: 'rgba(226, 232, 240, 0.2)', color: '#e2e8f0', '&:hover': { borderColor: '#7f5af0', color: '#7f5af0' } }}>View Details</Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
            <Dialog
                open={Boolean(selectedTeam)}
                onClose={() => {
                    setSelectedTeam(null);
                    setDetailsError('');
                    setDetailsLoading(false);
                }}
                fullWidth
                maxWidth="md"
                PaperProps={{ sx: { background: 'linear-gradient(180deg, #080b1c 0%, #090e21 100%)', border: '1px solid rgba(127, 90, 240, 0.3)', color: '#e2e8f0' } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{selectedTeam?.name || 'Team Details'}</Typography>
                    <IconButton onClick={() => setSelectedTeam(null)} sx={{ color: '#94a3b8' }}><Close /></IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ borderColor: 'rgba(127, 90, 240, 0.15)' }}>
                    {detailsLoading && <CircularProgress size={32} sx={{ color: '#7f5af0', display: 'block', mx: 'auto', my: 4 }} />}
                    {detailsError && <Alert severity="error" sx={{ mb: 3 }}>{detailsError}</Alert>}
                    {!detailsLoading && selectedTeam?.name && (
                        <Box>
                            <Typography variant="subtitle1" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 2 }}>{selectedTeam.description || 'No description provided yet.'}</Typography>
                            <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                                <Chip label={`Subject: ${selectedTeam.subject}`} size="small" sx={{ background: 'rgba(127, 90, 240, 0.18)', color: '#7f5af0' }} />
                                <Chip label={`Difficulty: ${selectedTeam.difficulty}`} size="small" sx={{ background: `${difficultyColor(selectedTeam.difficulty)}20`, color: difficultyColor(selectedTeam.difficulty) }} />
                                <Chip label={`Status: ${selectedTeam.status}`} size="small" sx={{ background: `${statusColor(selectedTeam.status)}20`, color: statusColor(selectedTeam.status) }} />
                                <Chip label={`Visibility: ${selectedTeam.visibility}`} size="small" sx={{ background: 'rgba(226, 232, 240, 0.12)', color: '#e2e8f0' }} />
                            </Stack>

                            {(selectedTeam.startDate || selectedTeam.expectedEndDate) && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>Timeline</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>
                                        {selectedTeam.startDate && `Kickoff: ${new Date(selectedTeam.startDate).toLocaleDateString()}`}
                                        {selectedTeam.startDate && selectedTeam.expectedEndDate && ' · '}
                                        {selectedTeam.expectedEndDate && `Target Submission: ${new Date(selectedTeam.expectedEndDate).toLocaleDateString()}`}
                                    </Typography>
                                </Box>
                            )}

                            {(selectedTeam.tags?.length || selectedTeam.requiredSkills?.length || selectedTeam.technologies?.length) && (
                                <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
                                    {selectedTeam.tags?.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)', mb: 1 }}>Tags</Typography>
                                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                {selectedTeam.tags.map((tag) => (
                                                    <Chip key={tag} label={tag} size="small" sx={{ background: 'rgba(44, 198, 125, 0.18)', color: '#2cb67d' }} />
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                    {selectedTeam.requiredSkills?.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)', mb: 1 }}>Skills Needed</Typography>
                                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                {selectedTeam.requiredSkills.map((skill) => (
                                                    <Chip key={skill} label={skill} size="small" sx={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8' }} />
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                    {selectedTeam.technologies?.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)', mb: 1 }}>Tech Stack</Typography>
                                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                {selectedTeam.technologies.map((tech) => (
                                                    <Chip key={tech} label={tech} size="small" sx={{ background: 'rgba(226, 232, 240, 0.1)', color: '#e2e8f0' }} />
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {selectedTeam.whatsapp && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>Contact</Typography>
                                    <Tooltip title="Open WhatsApp chat">
                                        <Link href={`https://wa.me/${selectedTeam.whatsapp}`} target="_blank" rel="noopener" underline="hover" sx={{ color: '#2cb67d', fontWeight: 600 }}>
                                            WhatsApp: {selectedTeam.whatsapp}
                                        </Link>
                                    </Tooltip>
                                </Box>
                            )}

                            {selectedTeam.meetingLink && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>Weekly Sync</Typography>
                                    <Link href={selectedTeam.meetingLink} target="_blank" rel="noopener" underline="hover" sx={{ color: '#7f5af0' }}>{selectedTeam.meetingLink}</Link>
                                </Box>
                            )}

                            {selectedTeam.resources?.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)', mb: 1 }}>Resources</Typography>
                                    <Stack spacing={1}>
                                        {selectedTeam.resources.map((resource, idx) => (
                                            <Box key={`${resource.url}-${idx}`} sx={{ p: 1.5, borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)', background: 'rgba(127, 90, 240, 0.05)' }}>
                                                <Typography variant="subtitle2" sx={{ color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                                                    {resource.name}
                                                    <Typography component="span" variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.45)', ml: 1 }}>
                                                        {resource.type}
                                                    </Typography>
                                                </Typography>
                                                <Link href={resource.url} target="_blank" rel="noopener" underline="hover" sx={{ color: '#94a3b8', wordBreak: 'break-word' }}>{resource.url}</Link>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {selectedTeam.roles?.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)', mb: 1 }}>Open Roles</Typography>
                                    <Stack spacing={1.2}>
                                        {selectedTeam.roles.map((role, idx) => (
                                            <Box key={`${role.title}-${idx}`} sx={{ p: 1.5, borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)', background: 'rgba(8, 11, 28, 0.84)' }}>
                                                <Typography variant="subtitle2" sx={{ color: '#e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    {role.title}
                                                    <Chip
                                                        size="small"
                                                        label={role.filled ? 'Filled' : role.required === false ? 'Optional' : 'Open'}
                                                        sx={{ background: role.filled ? 'rgba(44, 198, 125, 0.2)' : 'rgba(239, 68, 68, 0.12)', color: role.filled ? '#2cb67d' : '#ef4444' }}
                                                    />
                                                </Typography>
                                                {role.description && <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>{role.description}</Typography>}
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {selectedTeam.milestones?.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.6)', mb: 1 }}>Milestones</Typography>
                                    <Stack spacing={1.2}>
                                        {selectedTeam.milestones.map((milestone, idx) => (
                                            <Box key={`${milestone.title}-${idx}`} sx={{ p: 1.5, borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)', background: 'rgba(127, 90, 240, 0.05)' }}>
                                                <Typography variant="subtitle2" sx={{ color: '#e2e8f0', mb: 0.5 }}>{milestone.title}</Typography>
                                                {milestone.description && <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>{milestone.description}</Typography>}
                                                {(milestone.deadline || milestone.completedDate) && (
                                                    <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)' }}>
                                                        {milestone.deadline && `Due: ${new Date(milestone.deadline).toLocaleDateString()}`}
                                                        {milestone.deadline && milestone.completedDate && ' · '}
                                                        {milestone.completedDate && `Done: ${new Date(milestone.completedDate).toLocaleDateString()}`}
                                                    </Typography>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            <Divider sx={{ borderColor: 'rgba(127, 90, 240, 0.15)', my: 2 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Chip icon={<Group />} label={`${selectedTeam.currentMembers}/${selectedTeam.maxMembers} members`} size="small" sx={{ background: 'rgba(44, 198, 125, 0.2)', color: '#2cb67d', fontWeight: 600 }} />
                                <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)' }}>Leader: {selectedTeam.creator?.name || selectedTeam.creator?.email || 'Unknown'}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SearchTeams;
