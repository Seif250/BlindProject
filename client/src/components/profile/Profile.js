import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Avatar, Chip, TextField, Button, Alert } from '@mui/material';
import { Edit, Save, WhatsApp, School, Person } from '@mui/icons-material';
import api from '../../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/users/profile');
            setUser(res.data);
            setFormData(res.data);
        } catch (err) {
            setError('Failed to load profile');
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            await api.put('/api/users/profile', formData);
            setSuccess('Profile updated!');
            setEditing(false);
            fetchProfile();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    if (!user) return null;

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="md">
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 4, textAlign: 'center' }}>My Profile</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                <Card sx={{ background: 'rgba(12, 17, 31, 0.8)', border: '1px solid rgba(127, 90, 240, 0.3)', borderRadius: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <Avatar sx={{ width: 120, height: 120, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', fontSize: '3rem', mb: 2 }}>{user.name?.[0]}</Avatar>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#e2e8f0', mb: 1 }}>{user.name}</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>{user.email}</Typography>
                        </Box>
                        {!editing ? (
                            <>
                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><WhatsApp fontSize="small" /> WhatsApp</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.whatsapp || 'Not set'}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><School fontSize="small" /> Department</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.department || 'Not set'}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Year</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.year || 'Not set'}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Gender</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.gender || 'Not set'}</Typography>
                                        </Box>
                                    </Grid>
                                    {user.specialization && (
                                        <Grid item xs={12}>
                                            <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Specialization</Typography>
                                                <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.specialization}</Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                                <Button fullWidth variant="contained" startIcon={<Edit />} onClick={() => setEditing(true)} sx={{ background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', color: '#fff', fontWeight: 600, '&:hover': { background: 'linear-gradient(135deg, #6b47d6 0%, #25a569 100%)' } }}>Edit Profile</Button>
                            </>
                        ) : (
                            <>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12}><TextField fullWidth label="Name" name="name" value={formData.name || ''} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { color: '#e2e8f0', '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' }, '&:hover fieldset': { borderColor: '#7f5af0' }, '&.Mui-focused fieldset': { borderColor: '#7f5af0' } }, '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' } }} /></Grid>
                                    <Grid item xs={12}><TextField fullWidth label="WhatsApp" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { color: '#e2e8f0', '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' }, '&:hover fieldset': { borderColor: '#7f5af0' }, '&.Mui-focused fieldset': { borderColor: '#7f5af0' } }, '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' } }} /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="Department" name="department" value={formData.department || ''} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { color: '#e2e8f0', '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' }, '&:hover fieldset': { borderColor: '#7f5af0' }, '&.Mui-focused fieldset': { borderColor: '#7f5af0' } }, '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' } }} /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="Year" name="year" value={formData.year || ''} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { color: '#e2e8f0', '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' }, '&:hover fieldset': { borderColor: '#7f5af0' }, '&.Mui-focused fieldset': { borderColor: '#7f5af0' } }, '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' } }} /></Grid>
                                    <Grid item xs={12}><TextField fullWidth label="Specialization" name="specialization" value={formData.specialization || ''} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { color: '#e2e8f0', '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' }, '&:hover fieldset': { borderColor: '#7f5af0' }, '&.Mui-focused fieldset': { borderColor: '#7f5af0' } }, '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' } }} /></Grid>
                                </Grid>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button fullWidth variant="contained" startIcon={<Save />} onClick={handleSave} sx={{ background: 'linear-gradient(135deg, #2cb67d 0%, #16a34a 100%)', color: '#fff', fontWeight: 600, '&:hover': { background: 'linear-gradient(135deg, #25a569 0%, #15803d 100%)' } }}>Save</Button>
                                    <Button fullWidth variant="outlined" onClick={() => { setEditing(false); setFormData(user); }} sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { borderColor: '#dc2626', background: 'rgba(239, 68, 68, 0.1)' } }}>Cancel</Button>
                                </Box>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Profile;
