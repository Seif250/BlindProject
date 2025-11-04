import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
    Grid,
    Chip,
    IconButton,
    Tooltip,
    Divider
} from '@mui/material';
import { Add, AddCircle, Cancel } from '@mui/icons-material';
import api from '../../services/api';

const MAX_MEMBERS_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10];
const DIFFICULTY_OPTIONS = [
    { value: 'beginner', label: 'Beginner Friendly' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
];

const VISIBILITY_OPTIONS = [
    { value: 'public', label: 'Public - visible to everyone' },
    { value: 'department', label: 'Department Only' },
    { value: 'private', label: 'Invite Only' }
];

const STATUS_OPTIONS = [
    { value: 'recruiting', label: 'Recruiting' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
];

const inputStyles = {
    mb: 2.5,
    '& .MuiOutlinedInput-root': {
        color: '#e2e8f0',
        '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' },
        '&:hover fieldset': { borderColor: '#7f5af0' },
        '&.Mui-focused fieldset': { borderColor: '#7f5af0' }
    },
    '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' }
};

const CreateTeam = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        maxMembers: '',
        description: '',
        difficulty: 'intermediate',
        visibility: 'public',
        status: 'recruiting',
        tags: [],
        requiredSkills: [],
        technologies: [],
        meetingLink: '',
        startDate: '',
        expectedEndDate: '',
        resources: []
    });
    const [chipDraft, setChipDraft] = useState({ tags: '', skills: '', tech: '' });
    const [resourceDraft, setResourceDraft] = useState({ name: '', url: '', type: 'other' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChipAdd = (field, value) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].includes(trimmed) ? prev[field] : [...prev[field], trimmed]
        }));
        setChipDraft((prev) => ({ ...prev, [field === 'tags' ? 'tags' : field === 'requiredSkills' ? 'skills' : 'tech']: '' }));
    };

    const handleChipRemove = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((item) => item !== value)
        }));
    };

    const handleResourceAdd = () => {
        const { name, url, type } = resourceDraft;
        if (!name.trim() || !url.trim()) return;
        setFormData((prev) => ({
            ...prev,
            resources: [...prev.resources, { name: name.trim(), url: url.trim(), type }]
        }));
        setResourceDraft({ name: '', url: '', type: 'other' });
    };

    const handleResourceRemove = (idx) => {
        setFormData((prev) => ({
            ...prev,
            resources: prev.resources.filter((_, index) => index !== idx)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.maxMembers) {
            setError('Please select max members');
            return;
        }

        try {
            const payload = {
                name: formData.name,
                subject: formData.subject,
                maxMembers: formData.maxMembers,
                description: formData.description,
                difficulty: formData.difficulty,
                visibility: formData.visibility,
                status: formData.status,
                tags: formData.tags,
                requiredSkills: formData.requiredSkills,
                technologies: formData.technologies,
                meetingLink: formData.meetingLink,
                startDate: formData.startDate,
                expectedEndDate: formData.expectedEndDate,
                resources: formData.resources
            };

            await api.post('/api/teams', payload);
            setSuccess('Team created successfully!');
            setTimeout(() => navigate('/teams/my-team'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create team');
        }
    };

    const renderChipField = (label, field, placeholder, helperText) => (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 1 }}>{label}</Typography>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={8}>
                    <TextField
                        fullWidth
                        value={field === 'tags' ? chipDraft.tags : field === 'requiredSkills' ? chipDraft.skills : chipDraft.tech}
                        onChange={(e) => {
                            const value = e.target.value;
                            setChipDraft((prev) => ({
                                ...prev,
                                [field === 'tags' ? 'tags' : field === 'requiredSkills' ? 'skills' : 'tech']: value
                            }));
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleChipAdd(field, e.target.value);
                            }
                        }}
                        placeholder={placeholder}
                        sx={inputStyles}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddCircle />}
                        onClick={() => handleChipAdd(field, field === 'tags' ? chipDraft.tags : field === 'requiredSkills' ? chipDraft.skills : chipDraft.tech)}
                        sx={{
                            borderColor: '#7f5af0',
                            color: '#7f5af0',
                            '&:hover': { borderColor: '#6b47d6', background: 'rgba(127, 90, 240, 0.08)' }
                        }}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>
            {helperText && <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.45)' }}>{helperText}</Typography>}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {formData[field].map((item) => (
                    <Chip
                        key={item}
                        label={item}
                        onDelete={() => handleChipRemove(field, item)}
                        sx={{ background: 'rgba(127, 90, 240, 0.2)', color: '#e2e8f0' }}
                    />
                ))}
            </Box>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="md">
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1, textAlign: 'center' }}>Create New Team</Typography>
                <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.7)', mb: 4, textAlign: 'center' }}>Share what you&apos;re building and the kind of teammates you need.</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ background: 'rgba(12, 17, 31, 0.85)', border: '1px solid rgba(127, 90, 240, 0.35)', borderRadius: 4, p: { xs: 3, md: 5 }, boxShadow: '0 24px 72px rgba(5, 7, 20, 0.6)' }}>
                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 2 }}>Team Basics</Typography>
                    <Grid container spacing={3} sx={{ mb: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Team Name" name="name" value={formData.name} onChange={handleChange} required sx={inputStyles} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Course / Subject" name="subject" value={formData.subject} onChange={handleChange} required sx={inputStyles} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField select fullWidth label="Max Members" name="maxMembers" value={formData.maxMembers} onChange={handleChange} required sx={inputStyles}>
                                {MAX_MEMBERS_OPTIONS.map((n) => (
                                    <MenuItem key={n} value={n}>{n} Members</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField select fullWidth label="Difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} sx={inputStyles}>
                                {DIFFICULTY_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} sx={{ ...inputStyles, mb: 3 }} />
                        </Grid>
                    </Grid>

                    <Divider sx={{ borderColor: 'rgba(127, 90, 240, 0.2)', my: 3 }} />
                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 2 }}>Requirements & Skills</Typography>
                    {renderChipField('Tags', 'tags', 'e.g. Graduation Project, Hackathon, ML', 'Add keywords that help others find your team.')}
                    {renderChipField('Technical / Soft Skills Needed', 'requiredSkills', 'e.g. React, Project Management', 'List each skill and press enter or add.')}
                    {renderChipField('Technologies in Use', 'technologies', 'e.g. NodeJS, MongoDB, Figma', 'Tools or stacks you plan to use.')}

                    <Divider sx={{ borderColor: 'rgba(127, 90, 240, 0.2)', my: 3 }} />
                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 2 }}>Logistics</Typography>
                    <Grid container spacing={3} sx={{ mb: 2 }}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Kickoff Date" type="date" name="startDate" value={formData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={inputStyles} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Target Submission Date" type="date" name="expectedEndDate" value={formData.expectedEndDate} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={inputStyles} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Meeting Link" name="meetingLink" value={formData.meetingLink} onChange={handleChange} placeholder="https://" sx={inputStyles} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField select fullWidth label="Visibility" name="visibility" value={formData.visibility} onChange={handleChange} sx={inputStyles}>
                                {VISIBILITY_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField select fullWidth label="Current Status" name="status" value={formData.status} onChange={handleChange} sx={inputStyles}>
                                {STATUS_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.45)', display: 'block', mb: 3 }}>Your WhatsApp will be attached automatically from your profile so teammates can reach you quickly.</Typography>

                    <Divider sx={{ borderColor: 'rgba(127, 90, 240, 0.2)', my: 3 }} />
                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 1 }}>Resources & Links</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.6)', mb: 2 }}>Share helpful docs, design files, or references that give new members context.</Typography>
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Resource Name" value={resourceDraft.name} onChange={(e) => setResourceDraft((prev) => ({ ...prev, name: e.target.value }))} sx={inputStyles} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField fullWidth label="Link" value={resourceDraft.url} onChange={(e) => setResourceDraft((prev) => ({ ...prev, url: e.target.value }))} placeholder="https://" sx={inputStyles} />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField select fullWidth label="Type" value={resourceDraft.type} onChange={(e) => setResourceDraft((prev) => ({ ...prev, type: e.target.value }))} sx={inputStyles}>
                                <MenuItem value="document">Document</MenuItem>
                                <MenuItem value="link">Link</MenuItem>
                                <MenuItem value="code">Code</MenuItem>
                                <MenuItem value="design">Design</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={1}>
                            <Tooltip title="Add resource">
                                <span>
                                    <IconButton onClick={handleResourceAdd} sx={{ color: '#7f5af0', mt: { xs: 0, md: -1 } }}>
                                        <AddCircle />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                        {formData.resources.map((resource, index) => (
                            <Box key={`${resource.name}-${index}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(127, 90, 240, 0.2)', borderRadius: 2, p: 1.5, background: 'rgba(127, 90, 240, 0.08)' }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: '#e2e8f0' }}>{resource.name}</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>{resource.url}</Typography>
                                </Box>
                                <IconButton onClick={() => handleResourceRemove(index)} sx={{ color: '#ef4444' }}>
                                    <Cancel />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>

                    <Button type="submit" fullWidth variant="contained" size="large" startIcon={<Add />} sx={{ background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', color: '#fff', fontWeight: 600, py: 1.6, borderRadius: 2, boxShadow: '0 20px 40px rgba(127, 90, 240, 0.35)', '&:hover': { background: 'linear-gradient(135deg, #6b47d6 0%, #25a569 100%)', boxShadow: '0 26px 48px rgba(44, 198, 125, 0.35)' } }}>Create Team</Button>
                </Box>
            </Container>
        </Box>
    );
};

export default CreateTeam;
