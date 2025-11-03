import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Box,
    IconButton,
    Grid,
    Alert,
    Stack,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    PageWrapper,
    PageHeader,
    PageTitle,
    PageSubtitle,
    SectionCard,
    SectionTitle,
    HelperText,
    AccentBadge
} from '../styled/StyledComponents';

const RoleCard = styled(Box)(({ theme }) => ({
    borderRadius: 16,
    border: '1px solid rgba(15, 23, 42, 0.08)',
    backgroundColor: 'rgba(15, 23, 42, 0.025)',
    padding: theme.spacing(2),
}));

const CreateTeam = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        const newRoles = formData.roles.map((role, i) => (
            i === index ? { ...role, [field]: value } : role
        ));
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
        setError('');
        setSuccess('');
        try {
            await api.post('/teams/create', formData);
            setSuccess('تم إنشاء الفريق بنجاح! جاري التوجيه...');
            setTimeout(() => {
                navigate('/teams/my-team');
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'حدث خطأ في إنشاء الفريق');
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <PageWrapper>
            <Container maxWidth="lg">
                <PageHeader>
                    <AccentBadge>إدارة الفرق</AccentBadge>
                    <PageTitle>إنشاء فريق جديد</PageTitle>
                    <PageSubtitle>
                        عرّف مشروعك، حدِّد الأدوار المطلوبة، وشارك طريقة التواصل مع الفريق داخل مساحة هادئة ومنظمة.
                    </PageSubtitle>
                </PageHeader>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <SectionCard component="form" onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                {error && <Alert severity="error">{error}</Alert>}
                                {success && <Alert severity="success">{success}</Alert>}

                                <Box>
                                    <SectionTitle variant="h6">تفاصيل المشروع</SectionTitle>
                                    <Stack spacing={2.5}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="projectName"
                                            label="اسم المشروع"
                                            value={formData.projectName}
                                            onChange={handleChange}
                                            dir="rtl"
                                        />
                                        <TextField
                                            required
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            name="description"
                                            label="وصف المشروع"
                                            value={formData.description}
                                            onChange={handleChange}
                                            dir="rtl"
                                        />
                                        <Grid container spacing={2}>
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
                                        </Grid>
                                    </Stack>
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(15, 23, 42, 0.08)' }} />

                                <Box>
                                    <SectionTitle variant="h6">الأدوار المطلوبة</SectionTitle>
                                    <HelperText sx={{ mb: 2 }}>
                                        وضّح المسمى الوظيفي ووصفاً مختصراً لكل دور حتى يعرف المتقدمون ما تحتاجه بالضبط.
                                    </HelperText>
                                    <Stack spacing={2.5}>
                                        {formData.roles.map((role, index) => (
                                            <RoleCard key={index}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} md={4}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            label="المسمى الوظيفي"
                                                            value={role.title}
                                                            onChange={(e) => handleRoleChange(index, 'title', e.target.value)}
                                                            dir="rtl"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={7}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            label="الوصف"
                                                            value={role.description}
                                                            onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                                                            dir="rtl"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeRole(index)}
                                                            disabled={formData.roles.length === 1}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </RoleCard>
                                        ))}
                                        <Button
                                            startIcon={<AddIcon />}
                                            onClick={addRole}
                                            variant="outlined"
                                            sx={{ alignSelf: 'flex-start' }}
                                        >
                                            إضافة دور جديد
                                        </Button>
                                    </Stack>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button type="submit" variant="contained" size="large">
                                        إنشاء الفريق
                                    </Button>
                                    <Button variant="outlined" size="large" onClick={() => navigate('/teams')}>
                                        إلغاء
                                    </Button>
                                </Box>
                            </Stack>
                        </SectionCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <SectionCard>
                            <SectionTitle variant="h6">إرشادات سريعة</SectionTitle>
                            <Stack spacing={2.5}>
                                <HelperText>
                                    • اجمع بين المهارات التقنية والمهارات الشخصية لضمان توازن الفريق.
                                </HelperText>
                                <HelperText>
                                    • تأكد من صحة رقم الواتساب لأن المتقدمين سيستخدمونه للتواصل السريع.
                                </HelperText>
                                <HelperText>
                                    • يمكنك دائماً تعديل بيانات المشروع أو الأدوار لاحقاً من صفحة فريقي.
                                </HelperText>
                            </Stack>
                        </SectionCard>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
};

export default CreateTeam;