import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Grid,
    Button,
    Alert
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonIcon from '@mui/icons-material/Person';
import api from '../../services/api';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get(`/user/profile/${userId}`);
                setUser(response.data);
            } catch (error) {
                setError('فشل في تحميل بيانات المستخدم');
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (error) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
                    <Typography>جاري تحميل البيانات...</Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                        src={user.image}
                        sx={{
                            width: 150,
                            height: 150,
                            mb: 2,
                            mx: 'auto',
                            border: '4px solid #1976d2'
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Typography variant="h4" gutterBottom>
                        {user.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        {user.email}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>التخصص:</strong> {user.specialization}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>السنة الدراسية:</strong> {user.year}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            startIcon={<WhatsAppIcon />}
                            variant="contained"
                            color="success"
                            href={`https://wa.me/${user.whatsapp}`}
                            target="_blank"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            تواصل عبر الواتساب: {user.whatsapp}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default UserProfile;