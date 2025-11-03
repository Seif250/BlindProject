import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Avatar,
    Button,
    Alert,
    Stack,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../../services/api';
import {
    PageWrapper,
    PageHeader,
    PageTitle,
    PageSubtitle,
    SectionCard,
    SectionTitle,
    HelperText,
    AccentBadge,
    InfoChip
} from '../styled/StyledComponents';

const MemberCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: 18,
    border: '1px solid rgba(15, 23, 42, 0.08)',
    backgroundColor: 'rgba(15, 23, 42, 0.02)'
}));

const MyTeam = () => {
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchMyTeam();
    }, []);

    const fetchMyTeam = async () => {
        try {
            const response = await api.get('/teams/myteam');
            setTeam(response.data);
        } catch (error) {
            setError('فشل في تحميل بيانات الفريق');
        }
    };

    const handleStatusChange = async (memberId, newStatus) => {
        try {
            await api.patch(`/teams/member-status/${team._id}/${memberId}`, {
                status: newStatus
            });
            setSuccess('تم تحديث حالة العضو بنجاح');
            fetchMyTeam();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('فشل في تحديث حالة العضو');
            setTimeout(() => setError(''), 3000);
        }
    };

    if (!team) {
        return (
            <PageWrapper>
                <Container maxWidth="md">
                    <SectionCard sx={{ textAlign: 'center' }}>
                        <SectionTitle variant="h6">لا يوجد فريق مسجل</SectionTitle>
                        <HelperText>
                            قم بإنشاء فريق جديد أو انضم لأحد الفرق من صفحة الاستكشاف لتظهر تفاصيل فريقك هنا.
                        </HelperText>
                    </SectionCard>
                </Container>
            </PageWrapper>
        );
    }

    const acceptedMembers = (team.members || []).filter((member) => member.status === 'accepted');
    const pendingMembers = (team.members || []).filter((member) => member.status === 'pending');

    return (
        <PageWrapper>
            <Container maxWidth="lg">
                <PageHeader>
                    <AccentBadge>لوحة الفريق</AccentBadge>
                    <PageTitle>فريقي: {team.projectName}</PageTitle>
                    <PageSubtitle>
                        راجع تفاصيل مشروعك، تعرف على أعضاء فريقك، وتابع الطلبات المعلّقة في تجربة موحدة ومريحة.
                    </PageSubtitle>
                </PageHeader>

                <Stack spacing={3}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={3}>
                                <SectionCard>
                                    <SectionTitle variant="h6">تفاصيل المشروع</SectionTitle>
                                    <HelperText sx={{ mb: 2 }}>
                                        {team.description || 'لم يتم إضافة وصف للمشروع بعد.'}
                                    </HelperText>
                                    <InfoChip label={`عدد الأعضاء: ${acceptedMembers.length} / ${team.maxMembers}`} sx={{ mb: 2 }} />
                                    <Button
                                        startIcon={<WhatsAppIcon />}
                                        variant="outlined"
                                        color="primary"
                                        href={`https://wa.me/${team.whatsapp}`}
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        تواصل عبر الواتساب
                                    </Button>
                                </SectionCard>

                                <SectionCard>
                                    <SectionTitle variant="h6">الأدوار المطلوبة</SectionTitle>
                                    <Stack spacing={1.5}>
                                        {team.roles.map((role, index) => {
                                            const filled = acceptedMembers.some((member) => member.role === role.title);
                                            return (
                                                <MemberCard key={index} sx={{ backgroundColor: 'transparent' }}>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
                                                            {role.title}
                                                        </Typography>
                                                        <HelperText>{role.description}</HelperText>
                                                    </Box>
                                                    <InfoChip
                                                        label={filled ? 'تم شغل الدور' : 'ما زال متاحاً'}
                                                        sx={{ backgroundColor: filled ? 'rgba(5, 118, 66, 0.12)' : 'rgba(15, 23, 42, 0.06)', color: filled ? '#057642' : '#0f172a' }}
                                                    />
                                                </MemberCard>
                                            );
                                        })}
                                    </Stack>
                                </SectionCard>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <SectionCard>
                                <SectionTitle variant="h6">أعضاء الفريق</SectionTitle>
                                {acceptedMembers.length === 0 ? (
                                    <HelperText>لم يتم قبول أي أعضاء بعد.</HelperText>
                                ) : (
                                    <Stack spacing={2}>
                                        {acceptedMembers.map((member) => (
                                            <MemberCard key={member.user._id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        src={member.user.image}
                                                        onClick={() => navigate(`/profile/${member.user._id}`)}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
                                                            {member.user.name}
                                                        </Typography>
                                                        <HelperText>{member.user.email}</HelperText>
                                                        {member.user.whatsapp && (
                                                            <Button
                                                                startIcon={<WhatsAppIcon />}
                                                                variant="text"
                                                                color="primary"
                                                                href={`https://wa.me/${member.user.whatsapp}`}
                                                                target="_blank"
                                                                rel="noopener"
                                                                onClick={(e) => e.stopPropagation()}
                                                                sx={{ mt: 1 }}
                                                            >
                                                                {member.user.whatsapp}
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Box>
                                                <InfoChip label={member.role} />
                                            </MemberCard>
                                        ))}
                                    </Stack>
                                )}
                            </SectionCard>

                            {pendingMembers.length > 0 && (
                                <SectionCard sx={{ mt: 3 }}>
                                    <SectionTitle variant="h6">طلبات الانضمام</SectionTitle>
                                    <Stack spacing={2}
                                        divider={<Divider flexItem sx={{ borderColor: 'rgba(15, 23, 42, 0.06)' }} />}
                                    >
                                        {pendingMembers.map((member) => (
                                            <MemberCard key={member.user._id} sx={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar src={member.user.image}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
                                                            {member.user.name}
                                                        </Typography>
                                                        <HelperText>{member.user.email}</HelperText>
                                                        <InfoChip label={`الدور المطلوب: ${member.role}`} sx={{ mt: 1 }} />
                                                    </Box>
                                                </Box>
                                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<CheckCircleIcon />}
                                                        onClick={() => handleStatusChange(member.user._id, 'accepted')}
                                                    >
                                                        قبول
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<CancelIcon />}
                                                        onClick={() => handleStatusChange(member.user._id, 'rejected')}
                                                    >
                                                        رفض
                                                    </Button>
                                                </Stack>
                                            </MemberCard>
                                        ))}
                                    </Stack>
                                </SectionCard>
                            )}
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </PageWrapper>
    );
};

export default MyTeam;