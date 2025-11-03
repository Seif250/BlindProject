import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
    TextField, 
    Button, 
    Container, 
    Typography, 
    Box, 
    Alert, 
    MenuItem,
    InputAdornment,
    IconButton,
    Grid,
    Paper,
    Link,
    Divider
} from '@mui/material';
import {
    Person,
    Email,
    Lock,
    School,
    Phone,
    Wc,
    Visibility,
    VisibilityOff,
    HowToReg
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        specialization: '',
        year: '',
        whatsapp: '',
        gender: ''
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
            const response = await api.post('/auth/signup', formData);
            login(response.data.user, response.data.token);
            setSuccess('تم إنشاء الحساب بنجاح! جاري التوجيه...');
            setTimeout(() => {
                navigate('/teams');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ في التسجيل');
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
            <Container component="main" maxWidth="sm">
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
                            إنشاء حساب جديد
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            انضم إلينا الآن وابدأ رحلتك في عالم الفرق
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* Name */}
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    label="الاسم الكامل"
                                    name="name"
                                    autoFocus
                                    value={formData.name}
                                    onChange={handleChange}
                                    dir="rtl"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px'
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="البريد الإلكتروني الجامعي"
                                    name="email"
                                    type="email"
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
                                            borderRadius: '12px'
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Password */}
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="كلمة المرور"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
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
                                            borderRadius: '12px'
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Department */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="department"
                                    label="القسم الأكاديمي"
                                    id="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    dir="rtl"
                                    placeholder="مثال: علوم الحاسب"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px'
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Specialization */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="specialization"
                                    label="التخصص"
                                    id="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    dir="rtl"
                                    placeholder="مثال: هندسة البرمجيات"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px'
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Year */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    select
                                    name="year"
                                    label="السنة الدراسية"
                                    value={formData.year}
                                    onChange={handleChange}
                                    dir="rtl"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <School color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px'
                                        }
                                    }}
                                >
                                    <MenuItem value={1}>السنة الأولى</MenuItem>
                                    <MenuItem value={2}>السنة الثانية</MenuItem>
                                    <MenuItem value={3}>السنة الثالثة</MenuItem>
                                    <MenuItem value={4}>السنة الرابعة</MenuItem>
                                    <MenuItem value={5}>السنة الخامسة</MenuItem>
                                    <MenuItem value={6}>السنة السادسة</MenuItem>
                                </TextField>
                            </Grid>

                            {/* WhatsApp */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="whatsapp"
                                    label="رقم الواتساب"
                                    id="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    dir="rtl"
                                    placeholder="+20 123 456 7890"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px'
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Gender */}
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    select
                                    name="gender"
                                    label="الجنس"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    dir="rtl"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Wc color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px'
                                        }
                                    }}
                                >
                                    <MenuItem value="male">ذكر</MenuItem>
                                    <MenuItem value="female">أنثى</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            startIcon={<HowToReg />}
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
                            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                        </Button>

                        <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                أو
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                لديك حساب بالفعل؟{' '}
                                <Link
                                    component={RouterLink}
                                    to="/login"
                                    sx={{
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    سجل دخول
                                </Link>
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
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

export default Register;
