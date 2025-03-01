import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static" dir="rtl">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    نظام الفرق
                </Typography>

                {isAuthenticated ? (
                    <>
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/teams"
                            sx={{ mx: 1 }}
                        >
                            الفرق
                        </Button>
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/teams/search"
                            sx={{ mx: 1 }}
                        >
                            البحث عن فريق
                        </Button>
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/teams/requests"
                            sx={{ mx: 1 }}
                        >
                            طلبات الانضمام
                        </Button>
                        <Button 
    color="inherit" 
    component={Link} 
    to="/teams/my-team"
    sx={{ mx: 1 }}
>
    فريقي
</Button>
                        <IconButton
                            size="large"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem 
                                onClick={() => {
                                    handleClose();
                                    navigate('/profile');
                                }}
                            >
                                الملف الشخصي
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>تسجيل خروج</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                    
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/login"
                        >
                            تسجيل دخول
                        </Button>
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/register"
                        >
                            تسجيل جديد
                        </Button>
                        
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;