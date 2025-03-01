import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert, MenuItem } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

    const Register = () => {
        const navigate = useNavigate();
        const { login } = useAuth();
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            password: '',
            specialization: '',
            year: '',
            whatsapp: '',
            gender: ''
        });
        const [error, setError] = useState('');
    
        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const response = await api.post('/auth/signup', formData);
                login(response.data.user, response.data.token);
                navigate('/profile');
            } catch (err) {
                setError(err.response?.data?.message || 'حدث خطأ في التسجيل');
            }
        };
    
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 4,
                    marginBottom: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
                }}
            >
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        color: '#1976d2',
                    }}
                >
                    إنشاء حساب جديد
                </Typography>

                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mt: 2, 
                            width: '100%',
                            mb: 2 
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    sx={{ 
                        mt: 1,
                        width: '100%'
                    }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="الاسم"
                        name="name"
                        autoFocus
                        value={formData.name}
                        onChange={handleChange}
                        dir="rtl"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            mb: 2
                        }}
                    />
                    {/* باقي حقول TextField بنفس التنسيق */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="البريد الإلكتروني"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        dir="rtl"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            mb: 2
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="كلمة المرور"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        dir="rtl"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            mb: 2
                        }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="specialization"
                        label="التخصص"
                        id="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        dir="rtl"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            mb: 2
                        }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="year"
                        label="السنة الدراسية"
                        type="number"
                        id="year"
                        value={formData.year}
                        onChange={handleChange}
                        dir="rtl"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            mb: 2
                        }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="whatsapp"
                        label="رقم الواتساب"
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        dir="rtl"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            mb: 2
                        }}
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            mb: 2
                        }}
                    >
                        <MenuItem value="male">ذكر</MenuItem>
                        <MenuItem value="female">أنثى</MenuItem>
                    </TextField>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                        }}
                    >
                        تسجيل
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/login')}
                        sx={{
                            color: '#1976d2',
                            '&:hover': {
                                backgroundColor: 'rgba(210, 25, 25, 0.04)',
                            },
                        }}
                    >
                        لديك حساب بالفعل؟ سجل دخول
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;