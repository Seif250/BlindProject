import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuClick = (path) => {
        navigate(path);
        handleCloseNavMenu();
    };

    return (
        <AppBar position="static" dir="rtl">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/')}
                    >
                        مشروع التعارف الجامعي
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {!isAuthenticated() ? (
                                [
                                    <MenuItem key="login" onClick={() => handleMenuClick('/login')}>
                                        تسجيل الدخول
                                    </MenuItem>,
                                    <MenuItem key="register" onClick={() => handleMenuClick('/register')}>
                                        إنشاء حساب
                                    </MenuItem>
                                ]
                            ) : (
                                <MenuItem onClick={() => handleMenuClick('/profile')}>
                                    الملف الشخصي
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>

                    {isAuthenticated() ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="الإعدادات">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={user?.name} src={user?.image} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={() => handleMenuClick('/profile')}>
                                    الملف الشخصي
                                </MenuItem>
                                <MenuItem onClick={logout}>
                                    تسجيل الخروج
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                onClick={() => navigate('/login')}
                                sx={{ color: 'white', mx: 1 }}
                            >
                                تسجيل الدخول
                            </Button>
                            <Button
                                onClick={() => navigate('/register')}
                                sx={{ color: 'white', mx: 1 }}
                            >
                                إنشاء حساب
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;