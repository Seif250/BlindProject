import React from 'react';
import {
    Container,
    Grid,
    Box,
    Stack,
    Typography,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Add,
    Search,
    Group,
    MailOutline,
    EmojiEvents,
    School,
    Insights
} from '@mui/icons-material';
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

const ActionItem = styled(Box)(({ theme }) => ({
    borderRadius: 18,
    padding: theme.spacing(3),
    border: '1px solid rgba(15, 23, 42, 0.08)',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)'
    }
}));

const IconContainer = styled(Box)(({ theme, color }) => ({
    width: 48,
    height: 48,
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color,
    backgroundColor: `${color}1a`,
    marginBottom: theme.spacing(2)
}));

const Teams = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const quickActions = [
        {
            title: 'إنشاء فريق جديد',
            description: 'ابدأ مشروعك وحدد الأدوار التي تحتاج إليها في دقائق معدودة.',
            icon: <Add fontSize="small" />,
            color: '#0A66C2',
            action: () => navigate('/teams/create')
        },
        {
            title: 'استكشف الفرق',
            description: 'تصفح الفرق المفتوحة وانضم للمشروع المناسب لخبراتك.',
            icon: <Search fontSize="small" />,
            color: '#057642',
            action: () => navigate('/teams/search')
        },
        {
            title: 'فريقي الحالي',
            description: 'تابع أداء فريقك، الأعضاء، والأدوار المتبقية المتاحة.',
            icon: <Group fontSize="small" />,
            color: '#1D4ED8',
            action: () => navigate('/teams/my-team')
        },
        {
            title: 'طلبات الانضمام',
            description: 'راجع الطلبات الجديدة وقم بالرد عليها بسرعة وسهولة.',
            icon: <MailOutline fontSize="small" />,
            color: '#9333EA',
            action: () => navigate('/teams/requests')
        }
    ];

    const stats = [
        { label: 'الفرق النشطة', value: '150+', color: '#0A66C2', icon: <Group fontSize="small" /> },
        { label: 'الطلاب المشاركين', value: '500+', color: '#057642', icon: <School fontSize="small" /> },
        { label: 'المشاريع المكتملة', value: '80+', color: '#1D4ED8', icon: <EmojiEvents fontSize="small" /> }
    ];

    const tips = [
        'حدد بوضوح المهارات المطلوبة لكل دور داخل فريقك لضمان اختيار الأعضاء المناسبين.',
        'استخدم صفحة طلبات الانضمام للرد بسرعة على المتقدمين وتحسين تجربة التواصل.',
        'راجع إحصائيات مشاركتك بانتظام لتتأكد من توازن الأدوار وتقدم المشروع.'
    ];

    return (
        <PageWrapper>
            <Container maxWidth="lg">
                <PageHeader>
                    <AccentBadge>مساحة الفرق</AccentBadge>
                    <PageTitle>مرحباً {user?.name || 'بك'} 👋</PageTitle>
                    <PageSubtitle>
                        كل الأدوات التي تحتاجها لإدارة فرقك، متابعة تقدم المشاريع، واكتشاف فرص جديدة في مكان واحد بتصميم هادئ وأنيق.
                    </PageSubtitle>
                </PageHeader>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <SectionCard>
                            <SectionTitle variant="h6">خطوات سريعة</SectionTitle>
                            <Grid container spacing={2.5}>
                                {quickActions.map((action, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <ActionItem onClick={action.action} role="button" tabIndex={0}>
                                            <div>
                                                <IconContainer color={action.color}>
                                                    {action.icon}
                                                </IconContainer>
                                                <Typography variant="h6" sx={{ mb: 1, color: '#0f172a' }}>
                                                    {action.title}
                                                </Typography>
                                                <HelperText>
                                                    {action.description}
                                                </HelperText>
                                            </div>
                                            <HelperText sx={{ fontSize: '0.85rem', color: `${action.color}` }}>
                                                اضغط للانتقال ↗
                                            </HelperText>
                                        </ActionItem>
                                    </Grid>
                                ))}
                            </Grid>
                        </SectionCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <SectionCard>
                            <SectionTitle variant="h6">مؤشرات سريعة</SectionTitle>
                            <Stack spacing={2.5}>
                                {stats.map((stat, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderRadius: 14,
                                            padding: 2,
                                            backgroundColor: 'rgba(15, 23, 42, 0.02)'
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: 700 }}>
                                                {stat.value}
                                            </Typography>
                                            <HelperText>{stat.label}</HelperText>
                                        </Box>
                                        <IconContainer color={stat.color}>
                                            {stat.icon}
                                        </IconContainer>
                                    </Box>
                                ))}
                            </Stack>
                        </SectionCard>
                    </Grid>

                    <Grid item xs={12}>
                        <SectionCard>
                            <SectionTitle variant="h6">نصائح سريعة للنجاح</SectionTitle>
                            <Stack spacing={2.5} divider={<Divider flexItem sx={{ borderColor: 'rgba(15, 23, 42, 0.06)' }} />}> 
                                {tips.map((tip, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <IconContainer color="#0A66C2">
                                            <Insights fontSize="small" />
                                        </IconContainer>
                                        <HelperText sx={{ color: '#1f2937', lineHeight: 1.8 }}>
                                            {tip}
                                        </HelperText>
                                    </Box>
                                ))}
                            </Stack>
                        </SectionCard>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
};

export default Teams;