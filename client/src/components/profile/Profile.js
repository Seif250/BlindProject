import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
    Avatar,
    Paper,
    Grid,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import api from '../../services/api';

const Profile = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: '',
        year: '',
        whatsapp: '',
        gender: '',
        image: ''
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
                gender: user.gender || '',
                image: user.image || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            
            try {
                const response = await api.put('/user/profile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                setFormData(prev => ({
                    ...prev,
                    image: response.data.imageUrl
                }));
                setSuccess('تم تحديث الصورة بنجاح');
            } catch (error) {
                setError('فشل في تحميل الصورة');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/user/profile', formData);
            login(response.data, localStorage.getItem('token'));
            setSuccess('تم تحديث الملف الشخصي بنجاح');
            setError('');
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ في تحديث البيانات');
            setSuccess('');
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
                        الملف الشخصي
                    </Typography>

                    {/* Avatar and Image Upload */}
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                        <Avatar
                            src={formData.image || '/default-avatar.png'}
                            alt={formData.name}
                            sx={{ 
                                width: 150, 
                                height: 150, 
                                mb: 2,
                                border: '4px solid #1976d2',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="image-upload"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="image-upload">
                                    <IconButton
                                        component="span"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                            '&:active': { bgcolor: 'primary.light' }
                                        }}
                                    >
                                        <CameraAltIcon />
                                    </IconButton>
                                </label>
                            </>
                        )}
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2, mb: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mt: 2, mb: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            {success}
                        </Alert>
                    )}

                    {!isEditing ? (
                        // View Mode
                        <Box>
                            <Grid container spacing={2} sx={{ textAlign: 'right' }}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">{formData.name}</Typography>
                                    <Typography color="textSecondary">{formData.email}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>التخصص:</strong> {formData.specialization}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>السنة الدراسية:</strong> {formData.year}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>رقم الواتساب:</strong> {formData.whatsapp}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>الجنس:</strong> {formData.gender === 'male' ? 'ذكر' : 'أنثى'}</Typography>
                                </Grid>
                            </Grid>
                            <Button
                                startIcon={<EditIcon />}
                                variant="contained"
                                onClick={() => setIsEditing(true)}
                                sx={{ mt: 3, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                            >
                                تعديل الملف الشخصي
                            </Button>
                        </Box>
                    ) : (
                        // Edit Mode
                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="name"
                                        label="الاسم"
                                        value={formData.name}
                                        onChange={handleChange}
                                        dir="rtl"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        label="البريد الإلكتروني"
                                        value={formData.email}
                                        disabled
                                        dir="rtl"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="specialization"
                                        label="التخصص"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        dir="rtl"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="year"
                                        label="السنة الدراسية"
                                        type="number"
                                        value={formData.year}
                                        onChange={handleChange}
                                        dir="rtl"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="whatsapp"
                                        label="رقم الواتساب"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        dir="rtl"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
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
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ '&:hover': { bgcolor: '#1565c0' } }}
                                >
                                    حفظ التغييرات
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                    sx={{ borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#1565c0', bgcolor: 'transparent' } }}
                                >
                                    إلغاء
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;