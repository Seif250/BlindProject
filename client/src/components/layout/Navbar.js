import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Logout, Person, Home, Group, Search, Chat } from '@mui/icons-material';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout = () => { logout(); navigate('/'); handleClose(); };

    return (
        <AppBar position="sticky" sx={{ background: 'rgba(8, 12, 24, 0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(127, 90, 240, 0.2)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)' }}>
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" component={Link} to="/" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
                         Campus Teams
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isAuthenticated() ? (
                            <>
                                <Button component={Link} to="/" startIcon={<Home />} sx={{ color: '#e2e8f0', '&:hover': { color: '#7f5af0' } }}>Home</Button>
                                <Button component={Link} to="/teams" startIcon={<Group />} sx={{ color: '#e2e8f0', '&:hover': { color: '#7f5af0' } }}>Teams</Button>
                                <Button component={Link} to="/teams/search" startIcon={<Search />} sx={{ color: '#e2e8f0', '&:hover': { color: '#7f5af0' } }}>Search</Button>
                                <Button component={Link} to="/conversations" startIcon={<Chat />} sx={{ color: '#e2e8f0', '&:hover': { color: '#7f5af0' } }}>Conversations</Button>
                                <IconButton onClick={handleMenu} size="small"><Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', fontSize: '0.9rem' }}>{user?.name?.charAt(0)}</Avatar></IconButton>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} PaperProps={{ sx: { background: 'rgba(12, 17, 31, 0.95)', border: '1px solid rgba(127, 90, 240, 0.3)', backdropFilter: 'blur(10px)', mt: 1 } }}>
                                    <MenuItem onClick={() => { navigate('/profile'); handleClose(); }} sx={{ color: '#e2e8f0', '&:hover': { background: 'rgba(127, 90, 240, 0.1)' } }}><Person fontSize="small" sx={{ mr: 1.5 }} />Profile</MenuItem>
                                    <MenuItem onClick={handleLogout} sx={{ color: '#ef4444', '&:hover': { background: 'rgba(239, 68, 68, 0.1)' } }}><Logout fontSize="small" sx={{ mr: 1.5 }} />Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button component={Link} to="/" sx={{ color: '#e2e8f0', '&:hover': { color: '#7f5af0' } }}>Home</Button>
                                <Button component={Link} to="/login" sx={{ color: '#e2e8f0', '&:hover': { color: '#7f5af0' } }}>Sign In</Button>
                                <Button component={Link} to="/register" variant="contained" sx={{ background: 'linear-gradient(135deg, #7f5af0 0%, #5b27d1 100%)', boxShadow: '0 4px 20px rgba(127, 90, 240, 0.3)', '&:hover': { boxShadow: '0 6px 25px rgba(127, 90, 240, 0.5)' } }}>Join Now</Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
