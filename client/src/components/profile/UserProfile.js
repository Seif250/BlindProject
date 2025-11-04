import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid, Card, CardContent, Avatar, CircularProgress, Alert } from '@mui/material';
import { WhatsApp, School, Person, Email } from '@mui/icons-material';
import api from '../../services/api';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/api/users/${userId}`);
                setUser(res.data);
            } catch (err) {
                setError('Failed to load user profile');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    if (loading) return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)' }}><CircularProgress sx={{ color: '#7f5af0' }} /></Box>;

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="md">
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 4, textAlign: 'center' }}>User Profile</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {!user ? (
                    <Typography variant="h6" sx={{ color: 'rgba(226, 232, 240, 0.5)', textAlign: 'center' }}>User not found</Typography>
                ) : (
                    <Card sx={{ background: 'rgba(12, 17, 31, 0.8)', border: '1px solid rgba(127, 90, 240, 0.3)', borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                                <Avatar sx={{ width: 120, height: 120, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', fontSize: '3rem', mb: 2 }}>{user.name?.[0]}</Avatar>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#e2e8f0', mb: 1 }}>{user.name}</Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.6)', display: 'flex', alignItems: 'center', gap: 0.5 }}><Email fontSize="small" /> {user.email}</Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {user.whatsapp && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><WhatsApp fontSize="small" /> WhatsApp</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.whatsapp}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                                {user.department && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><School fontSize="small" /> Department</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.department}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                                {user.year && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Year</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.year}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                                {user.gender && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><Person fontSize="small" /> Gender</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.gender}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                                {user.specialization && (
                                    <Grid item xs={12}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Specialization</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.specialization}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Box>
    );
};

export default UserProfile;
