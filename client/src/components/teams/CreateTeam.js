import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    IconButton,
    Grid,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateTeam = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        maxMembers: '',
        whatsapp: '',
        roles: [{ title: '', description: '' }]
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleChange = (index, field, value) => {
        const newRoles = formData.roles.map((role, i) => {
            if (i === index) {
                return { ...role, [field]: value };
            }
            return role;
        });
        setFormData({ ...formData, roles: newRoles });
    };

    const addRole = () => {
        setFormData({
            ...formData,
            roles: [...formData.roles, { title: '', description: '' }]
        });
    };

    const removeRole = (index) => {
        setFormData({
            ...formData,
            roles: formData.roles.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/teams/create', formData);
            navigate('/teams');
        } catch (error) {
            setError(error.response?.data?.message || 'حدث خطأ في إنشاء الفريق');
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    إنشاء فريق جديد
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="projectName"
                                label="اسم المشروع"
                                value={formData.projectName}
                                onChange={handleChange}
                                dir="rtl"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                name="description"
                                label="وصف المشروع"
                                value={formData.description}
                                onChange={handleChange}
                                dir="rtl"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                name="maxMembers"
                                label="العدد الأقصى للأعضاء"
                                value={formData.maxMembers}
                                onChange={handleChange}
                                dir="rtl"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="whatsapp"
                                label="رقم الواتساب"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                dir="rtl"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                الأدوار المطلوبة
                            </Typography>
                            {formData.roles.map((role, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={5}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="المسمى الوظيفي"
                                                value={role.title}
                                                onChange={(e) => handleRoleChange(index, 'title', e.target.value)}
                                                dir="rtl"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="الوصف"
                                                value={role.description}
                                                onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                                                dir="rtl"
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeRole(index)}
                                                disabled={formData.roles.length === 1}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addRole}
                                sx={{ mt: 1 }}
                            >
                                إضافة دور جديد
                            </Button>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                        >
                            إنشاء الفريق
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/teams')}
                        >
                            إلغاء
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateTeam;