import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton, Divider } from '@mui/material';
import { 
    Facebook, 
    Twitter, 
    Instagram, 
    LinkedIn, 
    Email,
    Phone,
    LocationOn 
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                pt: 6,
                pb: 3,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* About Section */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 2
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    🎓
                                </Box>
                                <Typography variant="h6" fontWeight={700}>
                                    نظام الفرق الجامعية
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                                منصة متكاملة لربط الطلاب وتشكيل فرق المشاريع الأكاديمية.
                                نساعدك في إيجاد الشركاء المناسبين لتحقيق أهدافك الدراسية.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            روابط سريعة
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link 
                                component={RouterLink} 
                                to="/" 
                                color="inherit" 
                                underline="hover"
                                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
                            >
                                الرئيسية
                            </Link>
                            <Link 
                                component={RouterLink} 
                                to="/teams/search" 
                                color="inherit" 
                                underline="hover"
                                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
                            >
                                البحث عن فريق
                            </Link>
                            <Link 
                                component={RouterLink} 
                                to="/teams/create" 
                                color="inherit" 
                                underline="hover"
                                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
                            >
                                إنشاء فريق
                            </Link>
                            <Link 
                                component={RouterLink} 
                                to="/profile" 
                                color="inherit" 
                                underline="hover"
                                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
                            >
                                الملف الشخصي
                            </Link>
                        </Box>
                    </Grid>

                    {/* Support */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            الدعم
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link 
                                href="#" 
                                color="inherit" 
                                underline="hover"
                                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
                            >
                                الأسئلة الشائعة
                            </Link>
                            <Link 
                                href="#" 
                                color="inherit" 
                                underline="hover"
                                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
                            >
                                سياسة الخصوصية
                            </Link>
                            <Link 
                                href="#" 
                                color="inherit" 
                                underline="hover"
                                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
                            >
                                الشروط والأحكام
                            </Link>
                            <Link 
                                href="#" 
                                color="inherit" 
                                underline="hover"
                                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
                            >
                                تواصل معنا
                            </Link>
                        </Box>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            تواصل معنا
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email fontSize="small" />
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    info@university.edu
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone fontSize="small" />
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    +20 123 456 7890
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn fontSize="small" />
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    القاهرة، مصر
                                </Typography>
                            </Box>
                        </Box>

                        {/* Social Media */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                تابعنا
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton 
                                    size="small" 
                                    sx={{ 
                                        color: 'white',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        '&:hover': { 
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Facebook fontSize="small" />
                                </IconButton>
                                <IconButton 
                                    size="small"
                                    sx={{ 
                                        color: 'white',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        '&:hover': { 
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Twitter fontSize="small" />
                                </IconButton>
                                <IconButton 
                                    size="small"
                                    sx={{ 
                                        color: 'white',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        '&:hover': { 
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Instagram fontSize="small" />
                                </IconButton>
                                <IconButton 
                                    size="small"
                                    sx={{ 
                                        color: 'white',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        '&:hover': { 
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <LinkedIn fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                {/* Copyright */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        © {new Date().getFullYear()} نظام الفرق الجامعية. جميع الحقوق محفوظة
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 0.5 }}>
                        صُنع بـ ❤️ لخدمة الطلاب
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;