import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Box,
    IconButton,
    Grid,
    Alert,
    Stack,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
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

const RoleCard = styled(Box)(({ theme }) => ({
    borderRadius: 16,
    border: '1px solid rgba(15, 23, 42, 0.08)',
    backgroundColor: 'rgba(15, 23, 42, 0.025)',
    padding: theme.spacing(2),
}));

const CreateTeam = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        maxMembers: '',
        whatsapp: '',
        roles: [{ title: '', description: '' }]
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleChange = (index, field, value) => {
        const newRoles = formData.roles.map((role, i) => (
            i === index ? { ...role, [field]: value } : role
        ));
        setFormData({ ...formData, roles: newRoles });
    };

    const addRole = () => {
        setFormData({
            ...formData,
            roles: [...formData.roles, { title: '', description: '' }]
        });
    };

    const removeRole = (index) => {
        setFormData({
            ...formData,
            roles: formData.roles.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/teams/create', formData);
            setSuccess('Team created successfully! Redirecting...');
            setTimeout(() => {
                navigate('/teams/my-team');
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong while creating the team.');
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <PageWrapper>
            <Container maxWidth="lg">
                <PageHeader>
                    <AccentBadge>Team Management</AccentBadge>
                    <PageTitle>Create a New Team</PageTitle>
                    <PageSubtitle>
                        Describe your project, highlight the roles you need, and share your contact channel inside a calm, organized space.
                    </PageSubtitle>
                </PageHeader>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <SectionCard component="form" onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                {error && <Alert severity="error">{error}</Alert>}
                                {success && <Alert severity="success">{success}</Alert>}

                                <Box>
                                    <SectionTitle variant="h6">Project Details</SectionTitle>
                                    <Stack spacing={2.5}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="projectName"
                                            label="Project Name"
                                            value={formData.projectName}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            required
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            name="description"
                                            label="Project Description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    type="number"
                                                    name="maxMembers"
                                                    label="Maximum Members"
                                                    value={formData.maxMembers}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    name="whatsapp"
                                                    label="WhatsApp Number"
                                                    value={formData.whatsapp}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(15, 23, 42, 0.08)' }} />

                                <Box>
                                    <SectionTitle variant="h6">Required Roles</SectionTitle>
                                    <HelperText sx={{ mb: 2 }}>
                                        Spell out the role title and a quick summary so applicants know exactly what you need.
                                    </HelperText>
                                    <Stack spacing={2.5}>
                                        {formData.roles.map((role, index) => (
                                            <RoleCard key={index}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} md={4}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            label="Role Title"
                                                            value={role.title}
                                                            onChange={(e) => handleRoleChange(index, 'title', e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={7}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            label="Role Description"
                                                            value={role.description}
                                                            onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeRole(index)}
                                                            disabled={formData.roles.length === 1}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </RoleCard>
                                        ))}
                                        <Button
                                            startIcon={<AddIcon />}
                                            onClick={addRole}
                                            variant="outlined"
                                            sx={{ alignSelf: 'flex-start' }}
                                        >
                                            Add Another Role
                                        </Button>
                                    </Stack>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button type="submit" variant="contained" size="large">
                                        Create Team
                                    </Button>
                                    <Button variant="outlined" size="large" onClick={() => navigate('/teams')}>
                                        Cancel
                                    </Button>
                                </Box>
                            </Stack>
                        </SectionCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <SectionCard>
                            <SectionTitle variant="h6">Quick Guidance</SectionTitle>
                            <Stack spacing={2.5}>
                                <HelperText>
                                    - Blend technical skills and soft skills to keep the team balanced.
                                </HelperText>
                                <HelperText>
                                    - Double-check your WhatsApp number so applicants can reach you instantly.
                                </HelperText>
                                <HelperText>
                                    - You can always update project data or roles later from the My Team page.
                                </HelperText>
                            </Stack>
                        </SectionCard>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
};

export default CreateTeam;