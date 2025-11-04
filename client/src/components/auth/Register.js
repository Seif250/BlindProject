import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert, Link, MenuItem, InputAdornment, IconButton, Grid } from '@mui/material';
import { Person, Email, Lock, School, Phone, Wc, Visibility, VisibilityOff, ArrowForward } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '', specialization: '', year: '', whatsapp: '', gender: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/signup', formData);
            login(response.data.user, response.data.token);
            navigate('/teams');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', py: 6 }}>
            <Container maxWidth="md">
                <Box sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, background: 'rgba(12, 17, 31, 0.8)', border: '1px solid rgba(127, 90, 240, 0.3)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1, textAlign: 'center' }}>Create Account</Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 4, textAlign: 'center' }}>Join the community</Typography>
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label="Name" 
                                    name="name" 
                                    required 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: 'rgba(127, 90, 240, 0.7)' }} /></InputAdornment> }} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label="WhatsApp" 
                                    name="whatsapp" 
                                    required 
                                    value={formData.whatsapp} 
                                    onChange={handleChange} 
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ color: 'rgba(127, 90, 240, 0.7)' }} /></InputAdornment> }} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    select 
                                    fullWidth 
                                    label="Department" 
                                    name="department" 
                                    required 
                                    value={formData.department} 
                                    onChange={handleChange} 
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><School sx={{ color: 'rgba(127, 90, 240, 0.7)' }} /></InputAdornment> }}
                                >
                                    {['CS', 'IS', 'IT', 'AI', 'DS', 'Multimedia', 'Software', 'Bioinformatics'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label="Specialization" 
                                    name="specialization" 
                                    value={formData.specialization} 
                                    onChange={handleChange} 
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    select 
                                    fullWidth 
                                    label="Year" 
                                    name="year" 
                                    required 
                                    value={formData.year} 
                                    onChange={handleChange} 
                                    InputLabelProps={{ shrink: true }}
                                >
                                    {['1', '2', '3', '4'].map(y => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    select 
                                    fullWidth 
                                    label="Gender" 
                                    name="gender" 
                                    required 
                                    value={formData.gender} 
                                    onChange={handleChange} 
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Wc sx={{ color: 'rgba(127, 90, 240, 0.7)' }} /></InputAdornment> }}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" disabled={loading} endIcon={<ArrowForward />} sx={{ mt: 4, py: 1.8, fontSize: '1.1rem', fontWeight: 600, borderRadius: 3, background: 'linear-gradient(135deg, #7f5af0 0%, #5b27d1 100%)', boxShadow: '0 8px 32px rgba(127, 90, 240, 0.4)', textTransform: 'none', '&:hover': { background: 'linear-gradient(135deg, #916bff 0%, #6a37e9 100%)', boxShadow: '0 12px 40px rgba(127, 90, 240, 0.6)', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>{loading ? 'Creating...' : 'Create Account'}</Button>
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>Already have an account? <Link component={RouterLink} to="/login" sx={{ color: '#7f5af0', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>Sign In</Link></Typography>
                            <Link component={RouterLink} to="/" sx={{ display: 'inline-block', mt: 2, color: 'rgba(226, 232, 240, 0.5)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#7f5af0' } }}> Back to Home</Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Register;
