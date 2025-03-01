import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    Grid,
    Alert,
    Avatar,
    Chip
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../services/api';

const ManageRequests = () => {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await api.get('/teams/created');
            setTeams(response.data);
        } catch (error) {
            setError('فشل في تحميل الفرق');
        }
    };

    const handleRequest = async (teamId, userId, status) => {
        try {
            await api.patch(`/teams/member-status/${teamId}/${userId}`, { status });
            setSuccess('تم تحديث حالة الطلب بنجاح');
            fetchTeams();
        } catch (error) {
            setError('فشل في تحديث حالة الطلب');
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    إدارة طلبات الانضمام
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                {teams.map((team) => (
                    <Card key={team._id} sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6">
                                {team.projectName}
                            </Typography>
                            
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    طلبات الانضمام:
                                </Typography>
                                {team.members.filter(m => m.status === 'pending').map((member) => (
                                    <Box
                                        key={member.user._id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 2,
                                            p: 2,
                                            border: '1px solid #eee',
                                            borderRadius: 1
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={member.user.image} />
                                            <Box>
                                                <Typography>
                                                    {member.user.name}
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    {member.user.email}
                                                </Typography>
                                                <Chip 
                                                    label={`الدور المطلوب: ${member.role}`}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<CheckIcon />}
                                                onClick={() => handleRequest(team._id, member.user._id, 'accepted')}
                                            >
                                                قبول
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<CloseIcon />}
                                                onClick={() => handleRequest(team._id, member.user._id, 'rejected')}
                                            >
                                                رفض
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                                {team.members.filter(m => m.status === 'pending').length === 0 && (
                                    <Typography color="textSecondary">
                                        لا توجد طلبات انضمام حالياً
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Paper>
        </Container>
    );
};

export default ManageRequests;