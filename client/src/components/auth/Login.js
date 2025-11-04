import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert, Link, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, ArrowForward } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/api/auth/login', formData);
            login(response.data.user, response.data.token);
            navigate('/teams');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', py: 4 }}>
            <Container maxWidth="sm">
                <Box sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, background: 'rgba(12, 17, 31, 0.8)', border: '1px solid rgba(127, 90, 240, 0.3)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1, textAlign: 'center' }}>Welcome Back</Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 4, textAlign: 'center' }}>Sign in to continue</Typography>
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField 
                            fullWidth 
                            label="Email" 
                            name="email" 
                            type="email" 
                            required 
                            value={formData.email} 
                            onChange={handleChange} 
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: 'rgba(127, 90, 240, 0.7)' }} /></InputAdornment> }} 
                            sx={{ mb: 3 }} 
                        />
                        <TextField 
                            fullWidth 
                            label="Password" 
                            name="password" 
                            type={showPassword ? 'text' : 'password'} 
                            required 
                            value={formData.password} 
                            onChange={handleChange} 
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ 
                                startAdornment: <InputAdornment position="start"><Lock sx={{ color: 'rgba(127, 90, 240, 0.7)' }} /></InputAdornment>, 
                                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(226, 232, 240, 0.5)' }}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> 
                            }} 
                            sx={{ mb: 4 }} 
                        />
                        <Button type="submit" fullWidth variant="contained" disabled={loading} endIcon={<ArrowForward />} sx={{ py: 1.8, fontSize: '1.1rem', fontWeight: 600, borderRadius: 3, background: 'linear-gradient(135deg, #7f5af0 0%, #5b27d1 100%)', boxShadow: '0 8px 32px rgba(127, 90, 240, 0.4)', textTransform: 'none', mb: 3, '&:hover': { background: 'linear-gradient(135deg, #916bff 0%, #6a37e9 100%)', boxShadow: '0 12px 40px rgba(127, 90, 240, 0.6)', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>{loading ? 'Signing in...' : 'Sign In'}</Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>Don't have an account? <Link component={RouterLink} to="/register" sx={{ color: '#7f5af0', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>Create Account</Link></Typography>
                            <Link component={RouterLink} to="/" sx={{ display: 'inline-block', mt: 2, color: 'rgba(226, 232, 240, 0.5)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#7f5af0' } }}> Back to Home</Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
