import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Grid,
    Button,
    Alert,
    Chip,
    CircularProgress
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import api from '../../services/api';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/user/profile/${userId}`);
                setUser(response.data);
                setError('');
            } catch (error) {
                setError('فشل في تحميل بيانات المستخدم');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                    variant="outlined"
                >
                    رجوع
                </Button>
            </Container>
        );
    }

    if (!user) return null;

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3 }}
                    variant="text"
                >
                    رجوع
                </Button>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                        src={user.image ? `http://localhost:5000${user.image}` : undefined}
                        sx={{
                            width: 150,
                            height: 150,
                            mb: 2,
                            mx: 'auto',
                            border: '4px solid #1976d2',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 80 }} />
                    </Avatar>
                    <Typography variant="h4" gutterBottom>
                        {user.name}
                    </Typography>
                    <Chip
                        label={user.gender === 'male' ? 'ذكر' : 'أنثى'}
                        color="primary"
                        sx={{ mt: 1 }}
                    />
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <EmailIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                                <Box>
                                    <Typography variant="caption" color="textSecondary">
                                        البريد الإلكتروني
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <WorkIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                                <Box>
                                    <Typography variant="caption" color="textSecondary">
                                        التخصص
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.specialization || 'غير محدد'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <SchoolIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                                <Box>
                                    <Typography variant="caption" color="textSecondary">
                                        السنة الدراسية
                                    </Typography>
                                    <Typography variant="body1">
                                        السنة {user.year || 'غير محددة'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <WhatsAppIcon sx={{ color: 'success.main', fontSize: 30 }} />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="caption" color="textSecondary">
                                        رقم الواتساب
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.whatsapp}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            startIcon={<WhatsAppIcon />}
                            variant="contained"
                            color="success"
                            href={`https://wa.me/${user.whatsapp}`}
                            target="_blank"
                            fullWidth
                            size="large"
                            sx={{ mt: 2, py: 1.5 }}
                        >
                            تواصل عبر الواتساب
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default UserProfile;