import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const response = await api.post('/auth/login', formData);
            login(response.data.user, response.data.token);
            navigate('/teams');
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ في تسجيل الدخول');
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
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    borderRadius: 2,
                    p: 4,
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    تسجيل الدخول
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mt: 2, mb: 2, width: '100%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="البريد الإلكتروني"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                        dir="rtl"
                        sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'primary.main' }, '&:hover fieldset': { borderColor: 'primary.dark' }, '&.Mui-focused fieldset': { borderColor: 'primary.dark' } } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="كلمة المرور"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        dir="rtl"
                        sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'primary.main' }, '&:hover fieldset': { borderColor: 'primary.dark' }, '&.Mui-focused fieldset': { borderColor: 'primary.dark' } } }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                    >
                        تسجيل الدخول
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/register')}
                        sx={{ color: '#1976d2', '&:hover': { bgcolor: 'transparent', color: '#1565c0' } }}
                    >
                        ليس لديك حساب؟ سجل الآن
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;