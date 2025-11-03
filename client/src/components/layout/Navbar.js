import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Badge,
    Tooltip,
    Divider,
    ListItemIcon,
    Container,
    useTheme
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Notifications,
    Logout,
    Person,
    Dashboard,
    Search,
    Group,
    Home,
    Mail
} from '@mui/icons-material';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationsAnchor, setNotificationsAnchor] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotifications = (event) => {
        setNotificationsAnchor(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setNotificationsAnchor(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navButtonStyle = (path) => ({
        mx: 0.5,
        px: 2,
        py: 1,
        borderRadius: '8px',
        position: 'relative',
        fontWeight: isActive(path) ? 600 : 400,
        color: isActive(path) ? theme.palette.primary.main : 'inherit',
        backgroundColor: isActive(path) 
            ? 'rgba(255, 255, 255, 0.15)' 
            : 'transparent',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)'
        },
        '&::after': isActive(path) ? {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '3px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '3px 3px 0 0'
        } : {}
    });

    return (
        <AppBar 
            position="sticky" 
            dir="rtl"
            elevation={2}
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backdropFilter: 'blur(10px)'
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    {/* Logo */}
                    <Box
                        component={Link}
                        to={isAuthenticated() ? "/teams" : "/"}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'white',
                            gap: 1,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        <Box
                            sx={{
                                width: 45,
                                height: 45,
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                        >
                            🎓
                        </Box>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700,
                                fontSize: '1.3rem',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            نظام الفرق الجامعية
                        </Typography>
                    </Box>

                    {/* Navigation Links */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isAuthenticated() ? (
                            <>
                                <Button 
                                    color="inherit" 
                                    component={Link} 
                                    to="/teams"
                                    startIcon={<Dashboard />}
                                    sx={navButtonStyle('/teams')}
                                >
                                    لوحة التحكم
                                </Button>
                                <Button 
                                    color="inherit" 
                                    component={Link} 
                                    to="/teams/search"
                                    startIcon={<Search />}
                                    sx={navButtonStyle('/teams/search')}
                                >
                                    البحث عن فريق
                                </Button>
                                <Button 
                                    color="inherit" 
                                    component={Link} 
                                    to="/teams/my-team"
                                    startIcon={<Group />}
                                    sx={navButtonStyle('/teams/my-team')}
                                >
                                    فريقي
                                </Button>

                                {/* Notifications */}
                                <Tooltip title="الإشعارات">
                                    <IconButton
                                        color="inherit"
                                        onClick={handleNotifications}
                                        sx={{
                                            mx: 1,
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        <Badge badgeContent={3} color="error">
                                            <Notifications />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>

                                {/* User Menu */}
                                <Tooltip title="الحساب">
                                    <IconButton
                                        size="large"
                                        onClick={handleMenu}
                                        sx={{
                                            ml: 1,
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        <Avatar 
                                            sx={{ 
                                                width: 38, 
                                                height: 38,
                                                border: '2px solid white',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {user?.name?.charAt(0) || 'U'}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>

                                {/* Notifications Menu */}
                                <Menu
                                    anchorEl={notificationsAnchor}
                                    open={Boolean(notificationsAnchor)}
                                    onClose={handleCloseNotifications}
                                    PaperProps={{
                                        sx: {
                                            mt: 1.5,
                                            minWidth: 320,
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                                        }
                                    }}
                                >
                                    <Box sx={{ p: 2, pb: 1 }}>
                                        <Typography variant="h6" fontWeight={600}>
                                            الإشعارات
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <MenuItem onClick={handleCloseNotifications}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                طلب انضمام جديد
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                منذ 5 دقائق
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseNotifications}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                تم قبولك في فريق
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                منذ ساعة
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem 
                                        onClick={handleCloseNotifications}
                                        sx={{ justifyContent: 'center', color: 'primary.main' }}
                                    >
                                        عرض جميع الإشعارات
                                    </MenuItem>
                                </Menu>

                                {/* User Menu */}
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    PaperProps={{
                                        sx: {
                                            mt: 1.5,
                                            minWidth: 220,
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                                        }
                                    }}
                                >
                                    <Box sx={{ p: 2, pb: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {user?.name || 'المستخدم'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {user?.email || ''}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <MenuItem 
                                        onClick={() => {
                                            handleClose();
                                            navigate('/profile');
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Person fontSize="small" />
                                        </ListItemIcon>
                                        الملف الشخصي
                                    </MenuItem>
                                    <MenuItem 
                                        onClick={() => {
                                            handleClose();
                                            navigate('/teams/requests');
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Mail fontSize="small" />
                                        </ListItemIcon>
                                        الطلبات
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem 
                                        onClick={handleLogout}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <ListItemIcon>
                                            <Logout fontSize="small" color="error" />
                                        </ListItemIcon>
                                        تسجيل خروج
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button 
                                    color="inherit" 
                                    component={Link} 
                                    to="/"
                                    startIcon={<Home />}
                                    sx={navButtonStyle('/')}
                                >
                                    الرئيسية
                                </Button>
                                <Button 
                                    variant="outlined"
                                    component={Link} 
                                    to="/login"
                                    sx={{
                                        mx: 1,
                                        color: 'white',
                                        borderColor: 'white',
                                        borderRadius: '8px',
                                        px: 3,
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    تسجيل دخول
                                </Button>
                                <Button 
                                    variant="contained"
                                    component={Link} 
                                    to="/register"
                                    sx={{
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        px: 3,
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        '&:hover': {
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    تسجيل جديد
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;