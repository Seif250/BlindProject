import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    CircularProgress,
    Alert,
    Chip,
    Stack,
    Link
} from '@mui/material';
import { WhatsApp, School, Person, Email, Interests, Language, Link as LinkIcon } from '@mui/icons-material';
import api from '../../services/api';

const normalizeViewerUser = (data) => {
    if (!data || typeof data !== 'object') {
        return null;
    }

    const interests = Array.isArray(data.interests) ? data.interests : [];
    const skills = Array.isArray(data.skills)
        ? data.skills.map((skill) => (typeof skill === 'string' ? { name: skill, level: 'intermediate' } : skill)).filter((skill) => skill && skill.name)
        : [];
    const languages = Array.isArray(data.languages)
        ? data.languages.map((language) => (typeof language === 'string' ? { name: language, proficiency: 'intermediate' } : language)).filter((language) => language && language.name)
        : [];

    const socialLinks = {
        linkedin: data.socialLinks?.linkedin || '',
        github: data.socialLinks?.github || '',
        portfolio: data.socialLinks?.portfolio || '',
        behance: data.socialLinks?.behance || ''
    };

    return {
        ...data,
        interests,
        skills,
        languages,
        socialLinks
    };
};

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError('');

        const fetchUser = async () => {
            try {
                const res = await api.get(`/api/users/${userId}`);
                if (isMounted) {
                    setUser(normalizeViewerUser(res.data));
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load user profile');
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (userId) {
            fetchUser();
        } else {
            setLoading(false);
            setUser(null);
        }

        return () => {
            isMounted = false;
        };
    }, [userId]);

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)' }}>
                <CircularProgress sx={{ color: '#7f5af0' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="md">
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 4, textAlign: 'center' }}>User Profile</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {!user ? (
                    <Typography variant="h6" sx={{ color: 'rgba(226, 232, 240, 0.5)', textAlign: 'center' }}>User not found</Typography>
                ) : (
                    <Card sx={{ background: 'rgba(12, 17, 31, 0.85)', border: '1px solid rgba(127, 90, 240, 0.35)', borderRadius: 4, boxShadow: '0 24px 48px rgba(5, 7, 20, 0.55)' }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                                <Avatar sx={{ width: 120, height: 120, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', fontSize: '3rem', mb: 2 }}>{user.name?.[0]}</Avatar>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#e2e8f0', mb: 1 }}>{user.name}</Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.6)', display: 'flex', alignItems: 'center', gap: 0.5 }}><Email fontSize="small" /> {user.email}</Typography>
                            </Box>

                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                {user.whatsapp && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><WhatsApp fontSize="small" /> WhatsApp</Typography>
                                            <Link href={`https://wa.me/${user.whatsapp}`} target="_blank" rel="noopener" underline="hover" sx={{ color: '#2cb67d', fontWeight: 600 }}>{user.whatsapp}</Link>
                                        </Box>
                                    </Grid>
                                )}
                                {user.department && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><School fontSize="small" /> Department</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.department}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                                {user.year && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Year</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.year}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                                {user.gender && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><Person fontSize="small" /> Gender</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.gender}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                                {user.specialization && (
                                    <Grid item xs={12}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Specialization</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.specialization}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                                {user.gpa && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>GPA</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.gpa}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                                {user.studentId && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, background: 'rgba(127, 90, 240, 0.1)', borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.5)', mb: 0.5 }}>Student ID</Typography>
                                            <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{user.studentId}</Typography>
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
                                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><Language fontSize="small" /> Languages</Typography>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {user.languages.map((language) => (
                                            <Chip key={language.name} label={`${language.name} · ${language.proficiency}`} size="small" sx={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8' }} />
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {(user.socialLinks.linkedin || user.socialLinks.github || user.socialLinks.portfolio || user.socialLinks.behance) && (
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><LinkIcon fontSize="small" /> Social Links</Typography>
                                    <Stack spacing={1}>
                                        {user.socialLinks.linkedin && <Link href={user.socialLinks.linkedin} target="_blank" rel="noopener" underline="hover" sx={{ color: '#94a3b8' }}>LinkedIn</Link>}
                                        {user.socialLinks.github && <Link href={user.socialLinks.github} target="_blank" rel="noopener" underline="hover" sx={{ color: '#94a3b8' }}>GitHub</Link>}
                                        {user.socialLinks.portfolio && <Link href={user.socialLinks.portfolio} target="_blank" rel="noopener" underline="hover" sx={{ color: '#94a3b8' }}>Portfolio</Link>}
                                        {user.socialLinks.behance && <Link href={user.socialLinks.behance} target="_blank" rel="noopener" underline="hover" sx={{ color: '#94a3b8' }}>Behance</Link>}
                                    </Stack>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Box>
    );
};

export default UserProfile;
