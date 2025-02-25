import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Box, Typography, TextField, Button, Alert, MenuItem } from '@mui/material';
import api from '../../services/api';

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: '',
        year: '',
        whatsapp: '',
        gender: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                specialization: user.specialization || '',
                year: user.year || '',
                whatsapp: user.whatsapp || '',
                gender: user.gender || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/user/profile', formData);
            login(response.data, localStorage.getItem('token'));
            setSuccess('تم تحديث الملف الشخصي بنجاح');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ في تحديث البيانات');
            setSuccess('');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    الملف الشخصي
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="الاسم"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        dir="rtl"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="البريد الإلكتروني"
                        name="email"
                        value={formData.email}
                        disabled
                        dir="rtl"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="specialization"
                        label="التخصص"
                        value={formData.specialization}
                        onChange={handleChange}
                        dir="rtl"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="year"
                        label="السنة الدراسية"
                        type="number"
                        value={formData.year}
                        onChange={handleChange}
                        dir="rtl"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="whatsapp"
                        label="رقم الواتساب"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        dir="rtl"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        select
                        name="gender"
                        label="الجنس"
                        value={formData.gender}
                        onChange={handleChange}
                        dir="rtl"
                    >
                        <MenuItem value="male">ذكر</MenuItem>
                        <MenuItem value="female">أنثى</MenuItem>
                    </TextField>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        حفظ التغييرات
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Profile;