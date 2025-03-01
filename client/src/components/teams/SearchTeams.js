import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, Card, CardContent,
    Button, Box, Grid, TextField, Chip, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions,
    MenuItem, Divider
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import api from '../../services/api';

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
            setError('فشل في تحميل الفرق المتاحة');
        }
    };

    // دالة لحساب الأدوار المتاحة
    const getAvailableRoles = (team) => {
        const takenRoles = team.members
            .filter(m => m.status === 'accepted')
            .map(m => m.role);
        
        return team.roles.filter(role => !takenRoles.includes(role.title));
    };

    // دالة لحساب عدد الأعضاء الحاليين
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
            setSuccess('تم إرسال طلب الانضمام بنجاح');
            setSelectedRole('');
            setOpenDialog(false);
            // إضافة تأخير قبل إخفاء رسالة النجاح
            setTimeout(() => setSuccess(''), 3000);
            await fetchTeams(); // تحديث قائمة الفرق
        } catch (error) {
            setError(error.response?.data?.message || 'فشل في إرسال طلب الانضمام');
            // إضافة تأخير قبل إخفاء رسالة الخطأ
            setTimeout(() => setError(''), 3000);
        }
    };
    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    البحث عن الفرق
                </Typography>

                <TextField
                    fullWidth
                    label="ابحث عن فريق"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{ mb: 4 }}
                    dir="rtl"
                />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
        </Alert>
    )}
                <Grid container spacing={3}>
                    {filteredTeams.map((team) => {
                        const availableRoles = getAvailableRoles(team);
                        const currentMembers = getCurrentMembersCount(team);

                        return (
                            <Grid item xs={12} md={6} key={team._id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {team.projectName}
                                        </Typography>
                                        <Typography color="textSecondary" gutterBottom>
                                            {team.description}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                            <GroupIcon sx={{ mr: 1 }} />
                                            <Typography>
                                                {currentMembers} / {team.maxMembers} عضو
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Typography variant="subtitle2" gutterBottom>
                                            الأدوار المتاحة:
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
                                                    لا توجد أدوار متاحة حالياً
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
                                                ? 'الفريق مكتمل' 
                                                : 'طلب انضمام'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>طلب انضمام للفريق</DialogTitle>
                    <DialogContent>
                        <TextField
                            select
                            fullWidth
                            label="اختر الدور"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            sx={{ mt: 2 }}
                            dir="rtl"
                        >
                            {selectedTeam && getAvailableRoles(selectedTeam).map((role, index) => (
                                <MenuItem key={index} value={role.title}>
                                    {role.title}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>
                            إلغاء
                        </Button>
                        <Button 
                            onClick={() => {
                                handleJoinRequest(selectedTeam._id, selectedRole);
                                setOpenDialog(false);
                            }}
                            variant="contained"
                            disabled={!selectedRole}
                        >
                            إرسال الطلب
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
};

export default SearchTeams;