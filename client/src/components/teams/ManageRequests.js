import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    List,
    ListItem,
    Button,
    Alert,
    CircularProgress,
    Avatar,
    Chip,
    Stack,
    Tooltip
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import api from '../../services/api';

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [actionLoading, setActionLoading] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/teams/requests');
            const pending = Array.isArray(res.data) ? res.data : res.data?.requests || [];
            setRequests(pending);
        } catch (err) {
            setRequests([]);
            setError(err.response?.data?.message || 'Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const resetAlerts = () => {
        setError('');
        setSuccess('');
    };

    const handleAccept = async (requestId) => {
        resetAlerts();
        setActionLoading(requestId);
        try {
            await api.post(`/api/teams/requests/${requestId}/accept`);
            setSuccess('Request accepted!');
            await fetchRequests();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to accept request');
        } finally {
            setActionLoading('');
        }
    };

    const handleReject = async (requestId) => {
        resetAlerts();
        setActionLoading(requestId);
        try {
            await api.post(`/api/teams/requests/${requestId}/reject`);
            setSuccess('Request rejected');
            await fetchRequests();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject request');
        } finally {
            setActionLoading('');
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)' }}>
                <CircularProgress sx={{ color: '#7f5af0' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="md">
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 4, textAlign: 'center' }}>Join Requests</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                {requests.length === 0 ? (
                    <Typography variant="h6" sx={{ color: 'rgba(226, 232, 240, 0.5)', textAlign: 'center' }}>No pending requests</Typography>
                ) : (
                    <List>
                        {requests.map((req) => {
                            const initials = req.alias ? req.alias.charAt(0).toUpperCase() : 'A';
                            return (
                                <ListItem key={req._id} sx={{ background: 'rgba(12, 17, 31, 0.82)', border: '1px solid rgba(127, 90, 240, 0.3)', borderRadius: 4, mb: 2.5, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ width: 56, height: 56, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', fontSize: '1.5rem' }}>{initials}</Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#e2e8f0', mb: 0.5 }}>{req.alias || 'Applicant'}</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.6)', mb: 1 }}>Identity hidden until approval</Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                            {req.role && <Chip label={`Requested Role: ${req.role}`} size="small" sx={{ background: 'rgba(231, 92, 255, 0.18)', color: '#e75cff' }} />}
                                            {req.skills?.length ? req.skills.map((skill) => (
                                                <Tooltip key={`${req._id}-${skill.name}`} title={`Level: ${skill.level || 'intermediate'}`} placement="top" arrow>
                                                    <Chip label={skill.name} size="small" sx={{ background: 'rgba(44, 198, 125, 0.18)', color: '#2cb67d' }} />
                                                </Tooltip>
                                            )) : <Chip label="Skills not provided" size="small" sx={{ background: 'rgba(148, 163, 184, 0.18)', color: '#cbd5f5' }} />}
                                        </Stack>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<Check />}
                                            onClick={() => handleAccept(req._id)}
                                            disabled={actionLoading === req._id}
                                            sx={{ background: 'linear-gradient(135deg, #2cb67d 0%, #16a34a 100%)', color: '#fff', fontWeight: 600, '&:hover': { background: 'linear-gradient(135deg, #25a569 0%, #15803d 100%)' } }}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Close />}
                                            onClick={() => handleReject(req._id)}
                                            disabled={actionLoading === req._id}
                                            sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { borderColor: '#dc2626', background: 'rgba(239, 68, 68, 0.1)' } }}
                                        >
                                            Reject
                                        </Button>
                                    </Box>
                            </ListItem>
                            );
                        })}
                    </List>
                )}
            </Container>
        </Box>
    );
};

export default ManageRequests;
