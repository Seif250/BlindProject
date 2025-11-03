import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    Card,
    CardContent,
    Fade,
    Grow,
    Zoom
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../../contexts/AuthContext';
import { keyframes } from '@mui/system';

// تأثيرات الحركة
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // تتبع حركة الماوس لتأثير 3D
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            icon: <GroupIcon sx={{ fontSize: 70 }} />,
            title: 'كوّن فريقك',
            description: 'أنشئ فريق مشروعك بسهولة وابحث عن الأعضاء المناسبين',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            delay: 0
        },
        {
            icon: <SearchIcon sx={{ fontSize: 70 }} />,
            title: 'ابحث عن فرص',
            description: 'تصفح الفرق المتاحة وانضم للمشاريع التي تناسب مهاراتك',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            delay: 200
        },
        {
            icon: <PersonAddIcon sx={{ fontSize: 70 }} />,
            title: 'تواصل مباشر',
            description: 'تواصل مع أعضاء الفريق عبر الواتساب بضغطة زر واحدة',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            delay: 400
        },
        {
            icon: <RocketLaunchIcon sx={{ fontSize: 70 }} />,
            title: 'ابدأ مشروعك',
            description: 'حوّل أفكارك إلى واقع مع فريق متكامل ومنظم',
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            delay: 600
        }
    ];

    return (
        <Box sx={{ overflow: 'hidden' }}>
            {/* Floating Particles Background */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '200%',
                        height: '200%',
                        background: `
                            radial-gradient(circle, rgba(102, 126, 234, 0.1) 1px, transparent 1px),
                            radial-gradient(circle, rgba(118, 75, 162, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px, 80px 80px',
                        backgroundPosition: '0 0, 40px 60px',
                        animation: `${float} 20s infinite linear`
                    }
                }}
            />

            {/* Hero Section مع تأثيرات 3D */}
            <Fade in timeout={1000}>
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        py: 12,
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: `
                                radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px',
                            animation: `${rotate} 60s linear infinite`,
                            opacity: 0.3
                        }
                    }}
                >
                    <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Animated Icons */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '20%',
                                left: '10%',
                                animation: `${float} 3s ease-in-out infinite`,
                                opacity: 0.3
                            }}
                        >
                            <AutoAwesomeIcon sx={{ fontSize: 60, color: 'white' }} />
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '30%',
                                right: '15%',
                                animation: `${float} 4s ease-in-out infinite`,
                                animationDelay: '1s',
                                opacity: 0.3
                            }}
                        >
                            <AutoAwesomeIcon sx={{ fontSize: 40, color: 'white' }} />
                        </Box>

                        <Zoom in timeout={1500}>
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 3,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                    transform: `perspective(1000px) rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`,
                                    transition: 'transform 0.1s ease-out',
                                    animation: `${pulse} 3s ease-in-out infinite`
                                }}
                            >
                                🎓 منصة الفرق الجامعية
                            </Typography>
                        </Zoom>
                        
                        
                        <Fade in timeout={2000}>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 5,
                                    opacity: 0.95,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                    background: 'linear-gradient(to right, #fff 0%, #f0f0f0 50%, #fff 100%)',
                                    backgroundSize: '200% auto',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    animation: `${shimmer} 3s linear infinite`
                                }}
                            >
                                ابحث عن زملائك، كوّن فريقك، وابدأ مشروعك الآن!
                            </Typography>
                        </Fade>

                    {!isAuthenticated() ? (
                        <Zoom in timeout={2500}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/register')}
                                sx={{
                                    bgcolor: 'white',
                                    color: '#667eea',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    borderRadius: '50px',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                                    transform: 'translateZ(0)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: '#f5f5f5',
                                        transform: 'translateY(-5px) scale(1.05)',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.4)'
                                    }
                                }}
                            >
                                🚀 ابدأ الآن - مجاناً
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/login')}
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    borderRadius: '50px',
                                    borderWidth: '2px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        transform: 'translateY(-5px)',
                                        borderWidth: '2px'
                                    }
                                }}
                            >
                                تسجيل الدخول
                            </Button>
                        </Box>
                        </Zoom>
                    ) : (
                        <Zoom in timeout={2500}>
                            <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/teams')}
                            sx={{
                                bgcolor: 'white',
                                color: '#667eea',
                                px: 5,
                                py: 2,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                borderRadius: '50px',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: '#f5f5f5',
                                    transform: 'translateY(-5px) scale(1.05)',
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.4)'
                                }
                            }}
                        >
                            ⚡ انتقل إلى الفرق
                        </Button>
                        </Zoom>
                    )}
                </Container>
                </Box>
            </Fade>

            {/* Features Section مع تأثيرات 3D خرافية */}
            <Container maxWidth="lg" sx={{ py: 10, position: 'relative' }}>
                <Fade in timeout={1000}>
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{ 
                            mb: 8, 
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -10,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '100px',
                                height: '4px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '2px'
                            }
                        }}
                    >
                        ✨ لماذا منصتنا؟
                    </Typography>
                </Fade>
                
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Grow in timeout={1000 + feature.delay}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        textAlign: 'center',
                                        background: 'white',
                                        borderRadius: '20px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        border: '2px solid transparent',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: feature.color,
                                            opacity: 0,
                                            transition: 'opacity 0.4s ease',
                                            zIndex: 0
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-15px) scale(1.05) rotateZ(2deg)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                            '&::before': {
                                                opacity: 1
                                            },
                                            '& .icon-box': {
                                                transform: 'scale(1.2) rotate(10deg)',
                                                animation: `${bounce} 0.6s ease infinite`
                                            },
                                            '& .MuiTypography-root': {
                                                color: 'white'
                                            }
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                                        <Box 
                                            className="icon-box"
                                            sx={{ 
                                                mb: 3,
                                                display: 'inline-block',
                                                p: 2,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.9)',
                                                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                                transition: 'all 0.4s ease',
                                                color: '#667eea'
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography 
                                            variant="h5" 
                                            gutterBottom 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                transition: 'color 0.4s ease',
                                                mb: 2
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography 
                                            color="text.secondary"
                                            sx={{ 
                                                transition: 'color 0.4s ease',
                                                lineHeight: 1.8
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grow>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* How It Works Section مع تأثيرات حركية */}
            <Box sx={{ 
                bgcolor: 'transparent',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                py: 10,
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background Circles */}
                <Box sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)',
                    animation: `${float} 8s ease-in-out infinite`,
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
                    width: '250px',
                    height: '250px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(118,75,162,0.1) 0%, transparent 70%)',
                    animation: `${float} 10s ease-in-out infinite`,
                    animationDelay: '2s',
                    zIndex: 0
                }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Fade in timeout={1000}>
                        <Typography
                            variant="h3"
                            align="center"
                            gutterBottom
                            sx={{ 
                                mb: 8, 
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            🚀 كيف تبدأ؟
                        </Typography>
                    </Fade>
                    
                    <Grid container spacing={4}>
                        {[
                            {
                                num: 1,
                                title: 'سجّل حساب',
                                desc: 'أنشئ ملفك الشخصي وأضف تخصصك ومهاراتك',
                                color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                delay: 0
                            },
                            {
                                num: 2,
                                title: 'ابحث أو أنشئ',
                                desc: 'ابحث عن فريق مناسب أو أنشئ فريقك الخاص',
                                color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                delay: 300
                            },
                            {
                                num: 3,
                                title: 'ابدأ العمل',
                                desc: 'تواصل مع فريقك وابدأوا مشروعكم معاً',
                                color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                delay: 600
                            }
                        ].map((step, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Grow in timeout={1000 + step.delay}>
                                    <Paper 
                                        elevation={0}
                                        sx={{ 
                                            p: 4, 
                                            textAlign: 'center', 
                                            height: '100%',
                                            borderRadius: '20px',
                                            background: 'white',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.4s ease',
                                            border: '2px solid transparent',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '5px',
                                                background: step.color,
                                                transform: 'scaleX(0)',
                                                transition: 'transform 0.4s ease'
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-10px) scale(1.03)',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                                '&::before': {
                                                    transform: 'scaleX(1)'
                                                },
                                                '& .step-number': {
                                                    transform: 'scale(1.2) rotate(360deg)',
                                                    background: step.color
                                                }
                                            }
                                        }}
                                    >
                                        <Box
                                            className="step-number"
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                background: step.color,
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '2.5rem',
                                                fontWeight: 'bold',
                                                mx: 'auto',
                                                mb: 3,
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                                transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                animation: `${pulse} 2s ease-in-out infinite`,
                                                animationDelay: `${step.delay}ms`
                                            }}
                                        >
                                            {step.num}
                                        </Box>
                                        <Typography 
                                            variant="h5" 
                                            gutterBottom
                                            sx={{ 
                                                fontWeight: 'bold',
                                                mb: 2,
                                                background: step.color,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography 
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.8 }}
                                        >
                                            {step.desc}
                                        </Typography>
                                    </Paper>
                                </Grow>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section مع تأثيرات 3D مذهلة */}
            {!isAuthenticated() && (
                <Container maxWidth="md" sx={{ py: 10, position: 'relative' }}>
                    <Zoom in timeout={1000}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 6,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                borderRadius: '30px',
                                position: 'relative',
                                overflow: 'hidden',
                                transform: 'perspective(1000px)',
                                transition: 'all 0.4s ease',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-50%',
                                    left: '-50%',
                                    width: '200%',
                                    height: '200%',
                                    background: `
                                        linear-gradient(
                                            45deg,
                                            transparent 30%,
                                            rgba(255, 255, 255, 0.1) 50%,
                                            transparent 70%
                                        )
                                    `,
                                    animation: `${rotate} 4s linear infinite`
                                },
                                '&:hover': {
                                    transform: 'perspective(1000px) translateY(-10px) scale(1.02)',
                                    boxShadow: '0 30px 60px rgba(102, 126, 234, 0.4)'
                                }
                            }}
                        >
                            {/* Floating Stars */}
                            <Box sx={{
                                position: 'absolute',
                                top: '20%',
                                left: '10%',
                                animation: `${float} 3s ease-in-out infinite`,
                                zIndex: 1
                            }}>
                                <AutoAwesomeIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                            </Box>
                            <Box sx={{
                                position: 'absolute',
                                top: '60%',
                                right: '15%',
                                animation: `${float} 4s ease-in-out infinite`,
                                animationDelay: '1s',
                                zIndex: 1
                            }}>
                                <AutoAwesomeIcon sx={{ fontSize: 30, opacity: 0.3 }} />
                            </Box>

                            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                                <Typography 
                                    variant="h3" 
                                    gutterBottom 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        mb: 2,
                                        textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        animation: `${pulse} 2s ease-in-out infinite`
                                    }}
                                >
                                    🎯 جاهز لبدء مشروعك؟
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        mb: 5, 
                                        opacity: 0.95,
                                        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    انضم إلى مئات الطلاب الذين يعملون على مشاريعهم الآن
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#667eea',
                                        px: 6,
                                        py: 2.5,
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        borderRadius: '50px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        animation: `${bounce} 2s ease-in-out infinite`,
                                        '&:hover': {
                                            bgcolor: '#f5f5f5',
                                            transform: 'scale(1.15) translateY(-5px)',
                                            boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                                            animation: 'none'
                                        }
                                    }}
                                >
                                    🚀 ابدأ مجاناً الآن
                                </Button>
                            </Box>
                        </Paper>
                    </Zoom>
                </Container>
            )}
        </Box>
    );
};

export default Home;
