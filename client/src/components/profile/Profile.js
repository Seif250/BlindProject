import React, { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    TextField,
    Button,
    Alert,
    Chip,
    Stack,
    Divider,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Switch,
    FormControlLabel,
    Link
} from '@mui/material';
import { Edit, Save, WhatsApp, School, Interests, Language, Link as LinkIcon } from '@mui/icons-material';
import api from '../../services/api';

const outlinedInputStyles = {
    '& .MuiOutlinedInput-root': {
        color: '#e2e8f0',
        '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.3)' },
        '&:hover fieldset': { borderColor: '#7f5af0' },
        '&.Mui-focused fieldset': { borderColor: '#7f5af0' }
    },
    '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' }
};

const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
];

const proficiencyLevels = [
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'fluent', label: 'Fluent' }
];

const cloneUserData = (data) => JSON.parse(JSON.stringify(data || {}));

const normalizeUserData = (rawUser) => {
    if (!rawUser) {
        return null;
    }

    const skills = Array.isArray(rawUser.skills)
        ? rawUser.skills
            .map((skill) => (typeof skill === 'string' ? { name: skill, level: 'intermediate' } : skill))
            .filter((skill) => skill && skill.name)
        : [];

    const languages = Array.isArray(rawUser.languages)
        ? rawUser.languages
            .map((language) => (typeof language === 'string' ? { name: language, proficiency: 'intermediate' } : language))
            .filter((language) => language && language.name)
        : [];

    const socialLinks = {
        linkedin: rawUser.socialLinks?.linkedin || '',
        github: rawUser.socialLinks?.github || '',
        portfolio: rawUser.socialLinks?.portfolio || '',
        behance: rawUser.socialLinks?.behance || ''
    };

    const preferences = {
        emailNotifications: rawUser.preferences?.emailNotifications ?? true,
        teamInvitations: rawUser.preferences?.teamInvitations ?? true,
        newsletter: rawUser.preferences?.newsletter ?? false,
        language: rawUser.preferences?.language || 'en'
    };

    return {
        ...rawUser,
        bio: rawUser.bio || '',
        interests: Array.isArray(rawUser.interests) ? rawUser.interests : [],
        skills,
        languages,
        socialLinks,
        preferences,
        whatsapp: rawUser.whatsapp || '',
        department: rawUser.department || '',
        specialization: rawUser.specialization || '',
        gender: rawUser.gender || '',
        year: rawUser.year ?? '',
        gpa: rawUser.gpa ?? '',
        studentId: rawUser.studentId || ''
    };
};

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [interestInput, setInterestInput] = useState('');
    const [skillDraft, setSkillDraft] = useState({ name: '', level: 'intermediate' });
    const [languageDraft, setLanguageDraft] = useState({ name: '', proficiency: 'intermediate' });
    const [saving, setSaving] = useState(false);

    const profileLoaded = useMemo(() => Boolean(user), [user]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setError('');
        try {
            const res = await api.get('/api/users/profile');
            const normalized = normalizeUserData(res.data);
            setUser(normalized);
            setFormData(cloneUserData(normalized));
        } catch (err) {
            setError('Failed to load profile');
        }
    };

    const handleBasicChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handlePreferenceToggle = (name) => (event) => {
        const { checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [name]: checked
            }
        }));
    };

    const handleInterestAdd = () => {
        const trimmed = interestInput.trim();
        if (!trimmed) return;
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.includes(trimmed) ? prev.interests : [...prev.interests, trimmed]
        }));
        setInterestInput('');
    };

    const handleInterestRemove = (interest) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.filter((item) => item !== interest)
        }));
    };

    const handleSkillAdd = () => {
        const name = skillDraft.name.trim();
        if (!name) return;
        setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, { name, level: skillDraft.level }]
        }));
        setSkillDraft({ name: '', level: 'intermediate' });
    };

    const handleSkillRemove = (name) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill.name !== name)
        }));
    };

    const handleLanguageAdd = () => {
        const name = languageDraft.name.trim();
        if (!name) return;
        setFormData((prev) => ({
            ...prev,
            languages: [...prev.languages, { name, proficiency: languageDraft.proficiency }]
        }));
        setLanguageDraft({ name: '', proficiency: 'intermediate' });
    };

    const handleLanguageRemove = (name) => {
        setFormData((prev) => ({
            ...prev,
            languages: prev.languages.filter((language) => language.name !== name)
        }));
    };

    const handleSave = async () => {
        if (!formData) return;
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const payload = {
                name: formData.name,
                whatsapp: formData.whatsapp,
                department: formData.department,
                year: formData.year,
                specialization: formData.specialization,
                gender: formData.gender,
                bio: formData.bio,
                interests: formData.interests,
                skills: formData.skills,
                languages: formData.languages,
                socialLinks: formData.socialLinks,
                preferences: formData.preferences,
                gpa: formData.gpa,
                studentId: formData.studentId
            };

            await api.put('/api/users/profile', payload);
            setSuccess('Profile updated!');
            setEditing(false);
            await fetchProfile();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (!profileLoaded || !formData) {
        return null;
    }

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 4, textAlign: 'center' }}>My Profile</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                <Card sx={{ background: 'rgba(12, 17, 31, 0.85)', border: '1px solid rgba(127, 90, 240, 0.35)', borderRadius: 4, boxShadow: '0 24px 48px rgba(5, 7, 20, 0.55)' }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <Avatar sx={{ width: 120, height: 120, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', fontSize: '3rem', mb: 2 }}>{user.name?.[0]}</Avatar>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#e2e8f0', mb: 1 }}>{user.name}</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>{user.email}</Typography>
                        </Box>
                        {!editing ? (
                            <>
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><WhatsApp fontSize="small" /> WhatsApp</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.whatsapp || 'Not set yet'}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><School fontSize="small" /> Department</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.department || 'Not set yet'}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Year</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.year || 'Not set yet'}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Gender</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.gender || 'Not set yet'}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Student ID</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.studentId || 'Not set'}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>GPA</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.gpa || 'Not set'}</Typography>
                                        </Box>
                                    </Grid>
                                    {user.specialization && (
                                        <Grid item xs={12}>
                                            <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Specialization</Typography>
                                                <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.specialization}</Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>

                                {user.bio && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Bio</Typography>
                                        <Typography sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>{user.bio}</Typography>
                                    </Box>
                                )}

                                {user.interests.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><Interests fontSize="small" /> Interests</Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                            {user.interests.map((interest) => (
                                                <Chip key={interest} label={interest} size="small" sx={{ background: 'rgba(44, 198, 125, 0.18)', color: '#2cb67d' }} />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}

                                {user.skills.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Skills</Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                            {user.skills.map((skill) => (
                                                <Chip key={skill.name} label={`${skill.name} · ${skill.level}`} size="small" sx={{ background: 'rgba(127, 90, 240, 0.2)', color: '#7f5af0' }} />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}

                                {user.languages.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><Languages fontSize="small" /> Languages</Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                            {user.languages.map((language) => (
                                                <Chip key={language.name} label={`${language.name} · ${language.proficiency}`} size="small" sx={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8' }} />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}

                                {(user.socialLinks.linkedin || user.socialLinks.github || user.socialLinks.portfolio || user.socialLinks.behance) && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><LinkIcon fontSize="small" /> Social Links</Typography>
                                        <Stack spacing={1}>
                                            {user.socialLinks.linkedin && <Link href={user.socialLinks.linkedin} target="_blank" rel="noopener" underline="hover" sx={{ color: '#94a3b8' }}>LinkedIn</Link>}
                                            {user.socialLinks.github && <Link href={user.socialLinks.github} target="_blank" rel="noopener" underline="hover" sx={{ color: '#94a3b8' }}>GitHub</Link>}
                                            {user.socialLinks.portfolio && <Link href={user.socialLinks.portfolio} target="_blank" rel="noopener" underline="hover" sx={{ color: '#94a3b8' }}>Portfolio</Link>}
                                            {user.socialLinks.behance && <Link href={user.socialLinks.behance} target="_blank" rel="noopener" underline="hover" sx={{ color: '#94a3b8' }}>Behance</Link>}
                                        </Stack>
                                    </Box>
                                )}

                                <Button fullWidth variant="contained" startIcon={<Edit />} onClick={() => setEditing(true)} sx={{ background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', color: '#fff', fontWeight: 600, '&:hover': { background: 'linear-gradient(135deg, #6b47d6 0%, #25a569 100%)' } }}>Edit Profile</Button>
                            </>
                        ) : (
                            <>
                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="Name" name="name" value={formData.name || ''} onChange={handleBasicChange} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="WhatsApp" name="whatsapp" value={formData.whatsapp || ''} onChange={handleBasicChange} sx={outlinedInputStyles} helperText="Required for teammates to reach you" /></Grid>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="Department" name="department" value={formData.department || ''} onChange={handleBasicChange} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={3}><TextField fullWidth label="Year" name="year" value={formData.year || ''} onChange={handleBasicChange} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={3}><TextField fullWidth label="GPA" name="gpa" value={formData.gpa || ''} onChange={handleBasicChange} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="Student ID" name="studentId" value={formData.studentId || ''} onChange={handleBasicChange} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="Specialization" name="specialization" value={formData.specialization || ''} onChange={handleBasicChange} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={outlinedInputStyles}>
                                            <InputLabel sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>Gender</InputLabel>
                                            <Select name="gender" label="Gender" value={formData.gender || ''} onChange={handleBasicChange} sx={{ color: '#e2e8f0' }}>
                                                <MenuItem value="">Prefer not to say</MenuItem>
                                                <MenuItem value="male">Male</MenuItem>
                                                <MenuItem value="female">Female</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Bio" name="bio" value={formData.bio || ''} onChange={handleBasicChange} multiline rows={3} sx={outlinedInputStyles} placeholder="Share what motivates you, your experience, and how you like to collaborate." />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ borderColor: 'rgba(127, 90, 240, 0.2)', my: 3 }} />

                                <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Interests</Typography>
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
                                    <TextField fullWidth label="Add interest" value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleInterestAdd(); } }} sx={outlinedInputStyles} />
                                    <Button variant="outlined" onClick={handleInterestAdd} sx={{ borderColor: '#7f5af0', color: '#7f5af0', '&:hover': { borderColor: '#6b47d6' } }}>Add</Button>
                                </Stack>
                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                    {formData.interests.map((interest) => (
                                        <Chip key={interest} label={interest} onDelete={() => handleInterestRemove(interest)} sx={{ background: 'rgba(44, 198, 125, 0.18)', color: '#2cb67d' }} />
                                    ))}
                                </Stack>

                                <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Skills</Typography>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="Skill name" value={skillDraft.name} onChange={(e) => setSkillDraft((prev) => ({ ...prev, name: e.target.value }))} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth sx={outlinedInputStyles}>
                                            <InputLabel sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>Level</InputLabel>
                                            <Select value={skillDraft.level} label="Level" onChange={(e) => setSkillDraft((prev) => ({ ...prev, level: e.target.value }))} sx={{ color: '#e2e8f0' }}>
                                                {skillLevels.map((level) => (
                                                    <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Button fullWidth variant="outlined" onClick={handleSkillAdd} sx={{ height: '100%', borderColor: '#7f5af0', color: '#7f5af0', '&:hover': { borderColor: '#6b47d6' } }}>Add</Button>
                                    </Grid>
                                </Grid>
                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                    {formData.skills.map((skill) => (
                                        <Chip key={skill.name} label={`${skill.name} · ${skill.level}`} onDelete={() => handleSkillRemove(skill.name)} sx={{ background: 'rgba(127, 90, 240, 0.2)', color: '#7f5af0' }} />
                                    ))}
                                </Stack>

                                <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><Language fontSize="small" /> Languages</Typography>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="Language" value={languageDraft.name} onChange={(e) => setLanguageDraft((prev) => ({ ...prev, name: e.target.value }))} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth sx={outlinedInputStyles}>
                                            <InputLabel sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>Proficiency</InputLabel>
                                            <Select value={languageDraft.proficiency} label="Proficiency" onChange={(e) => setLanguageDraft((prev) => ({ ...prev, proficiency: e.target.value }))} sx={{ color: '#e2e8f0' }}>
                                                {proficiencyLevels.map((level) => (
                                                    <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Button fullWidth variant="outlined" onClick={handleLanguageAdd} sx={{ height: '100%', borderColor: '#7f5af0', color: '#7f5af0', '&:hover': { borderColor: '#6b47d6' } }}>Add</Button>
                                    </Grid>
                                </Grid>
                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                    {formData.languages.map((language) => (
                                        <Chip key={language.name} label={`${language.name} · ${language.proficiency}`} onDelete={() => handleLanguageRemove(language.name)} sx={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8' }} />
                                    ))}
                                </Stack>

                                <Divider sx={{ borderColor: 'rgba(127, 90, 240, 0.2)', my: 3 }} />

                                <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Social Links</Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="LinkedIn" name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialChange} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="GitHub" name="github" value={formData.socialLinks.github} onChange={handleSocialChange} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="Portfolio" name="portfolio" value={formData.socialLinks.portfolio} onChange={handleSocialChange} sx={outlinedInputStyles} /></Grid>
                                    <Grid item xs={12} md={6}><TextField fullWidth label="Behance" name="behance" value={formData.socialLinks.behance} onChange={handleSocialChange} sx={outlinedInputStyles} /></Grid>
                                </Grid>

                                <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Notifications</Typography>
                                <Stack spacing={1.5} sx={{ mb: 4 }}>
                                    <FormControlLabel control={<Switch checked={formData.preferences.emailNotifications} onChange={handlePreferenceToggle('emailNotifications')} color="primary" />} label="Email notifications" sx={{ color: 'rgba(226, 232, 240, 0.7)' }} />
                                    <FormControlLabel control={<Switch checked={formData.preferences.teamInvitations} onChange={handlePreferenceToggle('teamInvitations')} color="primary" />} label="Team invitations" sx={{ color: 'rgba(226, 232, 240, 0.7)' }} />
                                    <FormControlLabel control={<Switch checked={formData.preferences.newsletter} onChange={handlePreferenceToggle('newsletter')} color="primary" />} label="Monthly newsletter" sx={{ color: 'rgba(226, 232, 240, 0.7)' }} />
                                </Stack>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button fullWidth variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving} sx={{ background: 'linear-gradient(135deg, #2cb67d 0%, #16a34a 100%)', color: '#fff', fontWeight: 600, '&:hover': { background: 'linear-gradient(135deg, #25a569 0%, #15803d 100%)' } }}>{saving ? 'Saving...' : 'Save'}</Button>
                                    <Button fullWidth variant="outlined" onClick={() => { setEditing(false); setFormData(cloneUserData(user)); setInterestInput(''); setSkillDraft({ name: '', level: 'intermediate' }); setLanguageDraft({ name: '', proficiency: 'intermediate' }); }} sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { borderColor: '#dc2626', background: 'rgba(239, 68, 68, 0.1)' } }}>Cancel</Button>
                                </Box>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Profile;
