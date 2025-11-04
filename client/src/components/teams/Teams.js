import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Add, Search, Group, ManageAccounts } from '@mui/icons-material';

const Teams = () => {
    const navigate = useNavigate();
    const actions = [
        { title: 'Create Team', desc: 'Start a new team', icon: <Add sx={{ fontSize: 40 }} />, path: '/teams/create', color: '#7f5af0' },
        { title: 'Search Teams', desc: 'Find teammates', icon: <Search sx={{ fontSize: 40 }} />, path: '/teams/search', color: '#2cb67d' },
        { title: 'My Team', desc: 'Manage your team', icon: <Group sx={{ fontSize: 40 }} />, path: '/teams/my-team', color: '#e75cff' },
        { title: 'Requests', desc: 'Handle join requests', icon: <ManageAccounts sx={{ fontSize: 40 }} />, path: '/teams/requests', color: '#0ea5e9' }
    ];

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2, textAlign: 'center' }}>Teams Dashboard</Typography>
                <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 6, textAlign: 'center' }}>Manage your teams and collaborations</Typography>
                <Grid container spacing={4}>
                    {actions.map((action, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Card onClick={() => navigate(action.path)} sx={{ height: '100%', cursor: 'pointer', background: 'rgba(12, 17, 31, 0.8)', border: '1px solid rgba(127, 90, 240, 0.2)', borderRadius: 4, transition: 'all 0.3s', '&:hover': { borderColor: action.color, transform: 'translateY(-8px)', boxShadow: `0 16px 48px ${action.color}30` } }}>
                                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                    <Box sx={{ width: 80, height: 80, borderRadius: 3, background: `${action.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, color: action.color }}>{action.icon}</Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#e2e8f0', mb: 1 }}>{action.title}</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>{action.desc}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Teams;
