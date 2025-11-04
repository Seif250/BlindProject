import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button, Chip, Alert, CircularProgress } from '@mui/material';
import { Group, Person } from '@mui/icons-material';
import api from '../../services/api';

const SearchTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchTeams(); }, []);

    const fetchTeams = async () => {
        try {
            const res = await api.get('/api/search/teams');
            setTeams(res.data.filter(t => !t.isFull));
        } catch (err) {
            setError('Failed to load teams');
        } finally {
            setLoading(false);
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
                                        <Chip icon={<Person />} label={team.subject} size="small" sx={{ mb: 2, background: 'rgba(127, 90, 240, 0.2)', color: '#7f5af0', fontWeight: 600 }} />
                                        <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 2, minHeight: 60 }}>{team.description || 'No description'}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Chip icon={<Group />} label={`${team.currentMembers}/${team.maxMembers}`} size="small" sx={{ background: 'rgba(44, 198, 125, 0.2)', color: '#2cb67d', fontWeight: 600 }} />
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)' }}>by {team.creator?.name || 'Unknown'}</Typography>
                                        </Box>
                                        <Button fullWidth variant="contained" onClick={() => handleJoin(team._id)} sx={{ background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', color: '#fff', fontWeight: 600, '&:hover': { background: 'linear-gradient(135deg, #6b47d6 0%, #25a569 100%)' } }}>Request to Join</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default SearchTeams;
