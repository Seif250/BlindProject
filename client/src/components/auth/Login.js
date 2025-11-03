import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
    TextField, 
    Button, 
    Container, 
    Typography, 
    Box, 
    Alert,
    Link,
    InputAdornment,
    IconButton,
    Divider,
    Paper
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff, 
    Email, 
    Lock,
    Login as LoginIcon 
} from '@mui/icons-material';
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
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        
        try {
            const response = await api.post('/auth/login', formData);
            login(response.data.user, response.data.token);
            setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...');
            setTimeout(() => {
                navigate('/teams');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ في تسجيل الدخول');
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={10}
                    sx={{
                        p: 4,
                        borderRadius: '25px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '40px',
                                margin: '0 auto',
                                mb: 2,
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
                            }}
                        >
                            🎓
                        </Box>
                        <Typography 
                            component="h1" 
                            variant="h4" 
                            fontWeight={700}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1
                            }}
                        >
                            تسجيل الدخول
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            مرحباً بك مجدداً! سجل دخولك للمتابعة
                        </Typography>
                    </Box>

                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 2,
                                borderRadius: '12px',
                                '& .MuiAlert-icon': {
                                    fontSize: 24
                                }
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert 
                            severity="success" 
                            sx={{ 
                                mb: 2,
                                borderRadius: '12px',
                                '& .MuiAlert-icon': {
                                    fontSize: 24
                                }
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                }
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="كلمة المرور"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            dir="rtl"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                }
                            }}
                        />

                        <Box sx={{ textAlign: 'left', mt: 1 }}>
                            <Link
                                component={RouterLink}
                                to="/forgot-password"
                                variant="body2"
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                نسيت كلمة المرور؟
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            startIcon={<LoginIcon />}
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.5)',
                                    transform: 'translateY(-2px)'
                                },
                                '&:disabled': {
                                    background: 'rgba(0, 0, 0, 0.12)'
                                }
                            }}
                        >
                            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                        </Button>

                        <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                أو
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                ليس لديك حساب؟{' '}
                                <Link
                                    component={RouterLink}
                                    to="/register"
                                    sx={{
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    سجل الآن
                                </Link>
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Link
                                component={RouterLink}
                                to="/"
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                ← العودة للرئيسية
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;