import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../services/api';

const CreateTeam = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', subject: '', maxMembers: '', description: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await api.post('/api/teams', formData);
            setSuccess('Team created successfully!');
            setTimeout(() => navigate('/teams/my-team'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create team');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="sm">
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1, textAlign: 'center' }}>Create New Team</Typography>
                <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 4, textAlign: 'center' }}>Start building your dream team</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ background: 'rgba(12, 17, 31, 0.8)', border: '1px solid rgba(127, 90, 240, 0.3)', borderRadius: 4, p: 4 }}>
                    <TextField fullWidth label="Team Name" name="name" value={formData.name} onChange={handleChange} required sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { color: '#e2e8f0', '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' }, '&:hover fieldset': { borderColor: '#7f5af0' }, '&.Mui-focused fieldset': { borderColor: '#7f5af0' } }, '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' } }} />
                    <TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleChange} required sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { color: '#e2e8f0', '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' }, '&:hover fieldset': { borderColor: '#7f5af0' }, '&.Mui-focused fieldset': { borderColor: '#7f5af0' } }, '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' } }} />
                    <TextField fullWidth select label="Max Members" name="maxMembers" value={formData.maxMembers} onChange={handleChange} required sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { color: '#e2e8f0', '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' }, '&:hover fieldset': { borderColor: '#7f5af0' }, '&.Mui-focused fieldset': { borderColor: '#7f5af0' } }, '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' } }}>
                        {[3, 4, 5, 6, 7, 8, 9, 10].map(n => <MenuItem key={n} value={n}>{n} Members</MenuItem>)}
                    </TextField>
                    <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} sx={{ mb: 3, '& .MuiOutlinedInput-root': { color: '#e2e8f0', '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' }, '&:hover fieldset': { borderColor: '#7f5af0' }, '&.Mui-focused fieldset': { borderColor: '#7f5af0' } }, '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' } }} />
                    <Button type="submit" fullWidth variant="contained" size="large" startIcon={<Add />} sx={{ background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', color: '#fff', fontWeight: 600, py: 1.5, borderRadius: 2, '&:hover': { background: 'linear-gradient(135deg, #6b47d6 0%, #25a569 100%)', boxShadow: '0 8px 24px rgba(127, 90, 240, 0.4)' } }}>Create Team</Button>
                </Box>
            </Container>
        </Box>
    );
};

export default CreateTeam;
