import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, CardContent, List, ListItem, ListItemText, Chip, Button, Alert, CircularProgress, Avatar, IconButton } from '@mui/material';
import { Group, ExitToApp, Delete } from '@mui/icons-material';
import api from '../../services/api';

const MyTeam = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchTeam(); }, []);

    const fetchTeam = async () => {
        try {
            const res = await api.get('/api/teams/my-team');
            setTeam(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Not in a team yet');
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!window.confirm('Are you sure you want to leave this team?')) return;
        try {
            await api.delete(`/api/teams/${team._id}/leave`);
            setSuccess('Left team successfully');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to leave team');
        }
    };

    const handleRemove = async (userId) => {
        if (!window.confirm('Remove this member?')) return;
        try {
            await api.delete(`/api/teams/${team._id}/members/${userId}`);
            setSuccess('Member removed');
            fetchTeam();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove member');
        }
    };

    if (loading) return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)' }}><CircularProgress sx={{ color: '#7f5af0' }} /></Box>;

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="md">
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 4, textAlign: 'center' }}>My Team</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                {!team ? (
                    <Typography variant="h6" sx={{ color: 'rgba(226, 232, 240, 0.5)', textAlign: 'center' }}>You're not in a team yet</Typography>
                ) : (
                    <Card sx={{ background: 'rgba(12, 17, 31, 0.8)', border: '1px solid rgba(127, 90, 240, 0.3)', borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#e2e8f0' }}>{team.name}</Typography>
                                <Chip icon={<Group />} label={`${team.currentMembers}/${team.maxMembers}`} sx={{ background: 'rgba(44, 198, 125, 0.2)', color: '#2cb67d', fontWeight: 600 }} />
                            </Box>
                            <Chip label={team.subject} sx={{ mb: 2, background: 'rgba(127, 90, 240, 0.2)', color: '#7f5af0', fontWeight: 600 }} />
                            <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 3 }}>{team.description || 'No description'}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e8f0', mb: 2 }}>Members</Typography>
                            <List sx={{ mb: 3 }}>
                                {team.members.map(member => (
                                    <ListItem key={member._id} sx={{ background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, mb: 1, border: '1px solid rgba(127, 90, 240, 0.2)' }} secondaryAction={team.creator._id === member._id ? <Chip label="Creator" size="small" sx={{ background: 'rgba(231, 92, 255, 0.2)', color: '#e75cff', fontWeight: 600 }} /> : team.creator._id === JSON.parse(localStorage.getItem('user'))?._id && <IconButton edge="end" onClick={() => handleRemove(member._id)}><Delete sx={{ color: '#ef4444' }} /></IconButton>}>
                                        <Avatar sx={{ mr: 2, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)' }}>{member.name[0]}</Avatar>
                                        <ListItemText primary={member.name} secondary={member.email} primaryTypographyProps={{ sx: { color: '#e2e8f0', fontWeight: 600 } }} secondaryTypographyProps={{ sx: { color: 'rgba(226, 232, 240, 0.6)' } }} />
                                    </ListItem>
                                ))}
                            </List>
                            <Button fullWidth variant="outlined" color="error" startIcon={<ExitToApp />} onClick={handleLeave} sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { borderColor: '#dc2626', background: 'rgba(239, 68, 68, 0.1)' } }}>Leave Team</Button>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Box>
    );
};

export default MyTeam;
