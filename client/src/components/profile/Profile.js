import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
    Avatar,
    Grid,
    IconButton,
    Stack,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
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

const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    borderRadius: 14,
    border: '1px solid rgba(15, 23, 42, 0.06)',
    backgroundColor: 'rgba(15, 23, 42, 0.02)'
}));

const Profile = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: '',
        year: '',
        whatsapp: '',
        gender: '',
        image: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                specialization: user.specialization || '',
                year: user.year || '',
                whatsapp: user.whatsapp || '',
                gender: user.gender || '',
                image: user.image || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const payload = new FormData();
            payload.append('image', file);

            try {
                const response = await api.put('/user/profile', payload, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                setFormData((prev) => ({
                    ...prev,
                    image: response.data.imageUrl
                }));
                setSuccess('Profile photo updated successfully.');
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to upload the photo.');
                setTimeout(() => setError(''), 5000);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/user/profile', formData);
            login(response.data, localStorage.getItem('token'));
            setSuccess('Profile updated successfully.');
            setError('');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong while updating your profile.');
            setSuccess('');
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <PageWrapper>
            <Container maxWidth="lg">
                <PageHeader>
                    <AccentBadge>My Profile</AccentBadge>
                    <PageTitle>Account Management</PageTitle>
                    <PageSubtitle>
                        Keep your details fresh, review your account at a glance, and stay ready to join the brightest teams.
                    </PageSubtitle>
                </PageHeader>

                <Stack spacing={3}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <SectionCard>
                                <Box sx={{ position: 'relative', textAlign: 'center' }}>
                                    <Avatar
                                        src={formData.image || '/default-avatar.png'}
                                        alt={formData.name}
                                        sx={{
                                            width: 140,
                                            height: 140,
                                            margin: '0 auto',
                                            mb: 2,
                                            border: '4px solid rgba(10, 102, 194, 0.15)'
                                        }}
                                    >
                                        {!formData.image && formData.name.charAt(0)}
                                    </Avatar>
                                    {isEditing && (
                                        <>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="image-upload"
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                            />
                                            <label htmlFor="image-upload">
                                                <IconButton
                                                    component="span"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        backgroundColor: 'rgba(15, 23, 42, 0.06)'
                                                    }}
                                                >
                                                    <CameraAltIcon fontSize="small" />
                                                </IconButton>
                                            </label>
                                        </>
                                    )}
                                </Box>

                                <Stack spacing={1.5} sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography variant="h6">{formData.name}</Typography>
                                    <HelperText>{formData.email}</HelperText>
                                </Stack>

                                {!isEditing && (
                                    <Button
                                        startIcon={<EditIcon />}
                                        variant="contained"
                                        fullWidth
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </SectionCard>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            {isEditing ? (
                                <SectionCard component="form" onSubmit={handleSubmit}>
                                    <SectionTitle variant="h6">Edit Details</SectionTitle>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="name"
                                                label="Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                name="email"
                                                label="Email"
                                                value={formData.email}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                name="specialization"
                                                label="Specialization"
                                                value={formData.specialization}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                name="year"
                                                label="Academic Year"
                                                type="number"
                                                value={formData.year}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                name="whatsapp"
                                                label="WhatsApp Number"
                                                value={formData.whatsapp}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                select
                                                name="gender"
                                                label="Gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="male">Male</MenuItem>
                                                <MenuItem value="female">Female</MenuItem>
                                            </TextField>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 3, borderColor: 'rgba(15, 23, 42, 0.05)' }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <Button type="submit" variant="contained">
                                            Save changes
                                        </Button>
                                        <Button variant="outlined" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                    </Box>
                                </SectionCard>
                            ) : (
                                <SectionCard>
                                    <SectionTitle variant="h6">My Core Info</SectionTitle>
                                    <Stack spacing={2}>
                                        <InfoRow>
                                            <HelperText>Specialization</HelperText>
                                            <Typography>{formData.specialization || 'Not set'}</Typography>
                                        </InfoRow>
                                        <InfoRow>
                                            <HelperText>Academic Year</HelperText>
                                            <Typography>{formData.year || 'Not set'}</Typography>
                                        </InfoRow>
                                        <InfoRow>
                                            <HelperText>WhatsApp Number</HelperText>
                                            <Typography>{formData.whatsapp || 'Not provided'}</Typography>
                                        </InfoRow>
                                        <InfoRow>
                                            <HelperText>Gender</HelperText>
                                            <Typography>{formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : 'Not set'}</Typography>
                                        </InfoRow>
                                    </Stack>
                                </SectionCard>
                            )}
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </PageWrapper>
    );
};

export default Profile;