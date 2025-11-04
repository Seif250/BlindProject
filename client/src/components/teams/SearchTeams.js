import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, Card, CardContent,
    Button, Box, Grid, TextField, Chip, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions,
    MenuItem, Divider, Grow, Fade
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import api from '../../services/api';
import { keyframes } from '@mui/system';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const SearchTeams = () => {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await api.get('/teams/available');
            setTeams(response.data);
            setFilteredTeams(response.data);
        } catch (error) {
            setError('Failed to load available teams.');
        }
    };

    // Helper to calculate available roles on a team
    const getAvailableRoles = (team) => {
        const takenRoles = team.members
            .filter(m => m.status === 'accepted')
            .map(m => m.role);
        
        return team.roles.filter(role => !takenRoles.includes(role.title));
    };

    // Helper to count current confirmed members
    const getCurrentMembersCount = (team) => {
        return team.members.filter(m => m.status === 'accepted').length;
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = teams.filter(team => 
            team.projectName.toLowerCase().includes(term) ||
            team.description.toLowerCase().includes(term)
        );
        setFilteredTeams(filtered);
    };
    const handleJoinRequest = async (teamId, role) => {
        try {
            await api.post(`/teams/join/${teamId}`, { role });
            setSuccess('Join request sent successfully.');
            setSelectedRole('');
            setOpenDialog(false);
            setTimeout(() => setSuccess(''), 5000);
            await fetchTeams();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit the join request.');
            setTimeout(() => setError(''), 5000);
        }
    };
    return (
        <Container maxWidth="lg">
            <Fade in timeout={600}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 5, 
                        mt: 4,
                        borderRadius: '30px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <RocketLaunchIcon 
                            sx={{ 
                                fontSize: 60, 
                                color: '#667eea',
                                mb: 2,
                                animation: `${float} 3s ease-in-out infinite`
                            }} 
                        />
                        <Typography 
                            variant="h3" 
                            align="center" 
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            🔍 Find a Team
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Discover active teams and jump into the projects that excite you.
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth
                        label="Search for a team..."
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{ 
                            mb: 5,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '15px',
                                '&:hover fieldset': {
                                    borderColor: '#667eea'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#667eea',
                                    borderWidth: '2px'
                                }
                            }
                        }}
                    />

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '15px' }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: '15px' }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}
                
                <Grid container spacing={4}>
                    {filteredTeams.map((team, index) => {
                        const availableRoles = getAvailableRoles(team);
                        const currentMembers = getCurrentMembersCount(team);

                        return (
                            <Grid item xs={12} md={6} key={team._id}>
                                <Grow in timeout={500 + index * 100}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            borderRadius: '20px',
                                            background: 'white',
                                            border: '2px solid transparent',
                                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                opacity: 0,
                                                transition: 'opacity 0.4s ease',
                                                zIndex: 0
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-10px) scale(1.02)',
                                                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                                                borderColor: '#667eea',
                                                '&::before': {
                                                    opacity: 0.05
                                                }
                                            }
                                        }}
                                    >
                                    <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                                        <Typography 
                                            variant="h5"
                                            sx={{
                                                fontWeight: 'bold',
                                                mb: 2,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}
                                        >
                                            {team.projectName}
                                        </Typography>
                                        <Typography color="textSecondary" gutterBottom>
                                            {team.description}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                            <GroupIcon sx={{ mr: 1 }} />
                                            <Typography>
                                                {currentMembers} / {team.maxMembers} members
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Typography variant="subtitle2" gutterBottom>
                                            Available roles:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                            {availableRoles.map((role, index) => (
                                                <Chip 
                                                    key={index}
                                                    label={role.title}
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            ))}
                                            {availableRoles.length === 0 && (
                                                <Typography color="textSecondary" variant="body2">
                                                    No roles currently available
                                                </Typography>
                                            )}
                                        </Box>

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            disabled={availableRoles.length === 0 || currentMembers >= team.maxMembers}
                                            onClick={() => {
                                                setSelectedTeam(team);
                                                setOpenDialog(true);
                                            }}
                                        >
                                            {currentMembers >= team.maxMembers 
                                                ? 'Team is full' 
                                                : 'Request to join'}
                                        </Button>
                                    </CardContent>
                                </Card>
                                </Grow>
                            </Grid>
                        );
                    })}
                </Grid>
                </Paper>
            </Fade>

                <Dialog 
                    open={openDialog} 
                    onClose={() => setOpenDialog(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            p: 2
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        textAlign: 'center',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        🎯 Request to Join
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            select
                            fullWidth
                            label="Choose the role that fits you"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            sx={{ 
                                mt: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px'
                                }
                            }}
                        >
                            {selectedTeam && getAvailableRoles(selectedTeam).map((role, index) => (
                                <MenuItem key={index} value={role.title}>
                                    {role.title}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2 }}>
                        <Button 
                            onClick={() => setOpenDialog(false)}
                            sx={{
                                borderRadius: '12px',
                                px: 3
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => {
                                if (selectedTeam) {
                                    handleJoinRequest(selectedTeam._id, selectedRole);
                                }
                                setOpenDialog(false);
                            }}
                            variant="contained"
                            disabled={!selectedRole}
                            sx={{
                                borderRadius: '12px',
                                px: 4,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                }
                            }}
                        >
                            🚀 Send Request
                        </Button>
                    </DialogActions>
                </Dialog>
        </Container>
    );
};

export default SearchTeams;