import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, Typography, Box, Grid, 
    Avatar, Chip, Divider, Button, Alert,
    List, ListItem, ListItemAvatar, ListItemText,
    IconButton, Tooltip
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import api from '../../services/api';

const MyTeam = () => {
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchMyTeam();
    }, []);

    const fetchMyTeam = async () => {
        try {
            const response = await api.get('/teams/myteam');
            setTeam(response.data);
        } catch (error) {
            setError('فشل في تحميل بيانات الفريق');
        }
    };

    const handleStatusChange = async (memberId, newStatus) => {
        try {
            await api.patch(`/teams/member-status/${team._id}/${memberId}`, {
                status: newStatus
            });
            setSuccess('تم تحديث حالة العضو بنجاح');
            fetchMyTeam();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('فشل في تحديث حالة العضو');
            setTimeout(() => setError(''), 3000);
        }
    };

    if (!team) {
        return (
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
                    <Typography>لم يتم العثور على فريق خاص بك</Typography>
                </Paper>
            </Container>
        );
    }

    const acceptedMembers = team.members.filter(m => m.status === 'accepted');
    const pendingMembers = team.members.filter(m => m.status === 'pending');

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    فريقي: {team.projectName}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Grid container spacing={4}>
                    {/* تفاصيل المشروع */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                تفاصيل المشروع
                            </Typography>
                            <Typography color="text.secondary" paragraph>
                                {team.description}
                            </Typography>
                            
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <GroupIcon />
                                <Typography>
                                    {acceptedMembers.length} / {team.maxMembers} عضو
                                </Typography>
                            </Box>

                            <Button
                                startIcon={<WhatsAppIcon />}
                                variant="outlined"
                                color="success"
                                sx={{ mt: 2 }}
                                href={`https://wa.me/${team.whatsapp}`}
                                target="_blank"
                            >
                                تواصل عبر الواتساب
                            </Button>
                        </Paper>
                    </Grid>

                    {/* الأدوار المطلوبة */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                الأدوار المطلوبة
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {team.roles.map((role, index) => (
                                    <Tooltip key={index} title={role.description}>
                                        <Chip
                                            label={role.title}
                                            variant="outlined"
                                            color={acceptedMembers.some(m => m.role === role.title) ? "success" : "primary"}
                                        />
                                    </Tooltip>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* الأعضاء المقبولين */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                أعضاء الفريق
                            </Typography>
                            <List>
    {acceptedMembers.map((member) => (
        <ListItem
            key={member.user._id}
            sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
            }}
        >
            <ListItemAvatar>
                <Avatar 
                    src={member.user.image}
                    onClick={() => navigate(`/profile/${member.user._id}`)}
                    sx={{ cursor: 'pointer' }}
                >
                    <PersonIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={member.user.name}
                secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">{member.user.email}</Typography>
                        <Button
                            startIcon={<WhatsAppIcon />}
                            variant="outlined"
                            size="small"
                            color="success"
                            href={`https://wa.me/${member.user.whatsapp}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            sx={{ width: 'fit-content' }}
                        >
                            {member.user.whatsapp}
                        </Button>
                    </Box>
                }
            />
            <Chip 
                label={member.role} 
                color="success" 
                sx={{ ml: 2 }}
            />
        </ListItem>
    ))}
</List>
                        </Paper>
                    </Grid>

                    {/* طلبات الانضمام */}
                    {pendingMembers.length > 0 && (
                        <Grid item xs={12}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    طلبات الانضمام
                                </Typography>
                                <List>
                                    {pendingMembers.map((member) => (
                                        <ListItem
                                            key={member.user._id}
                                            secondaryAction={
                                                <Box>
                                                    <IconButton
                                                        color="success"
                                                        onClick={() => handleStatusChange(member.user._id, 'accepted')}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleStatusChange(member.user._id, 'rejected')}
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={member.user.image}>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={member.user.name}
                                                secondary={
                                                    <>
                                                        {member.user.email}
                                                        <Chip
                                                            size="small"
                                                            label={`الدور المطلوب: ${member.role}`}
                                                            sx={{ ml: 1 }}
                                                        />
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
};

export default MyTeam;