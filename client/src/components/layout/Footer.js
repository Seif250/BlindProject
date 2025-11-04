import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Link,
    IconButton,
    Stack,
    Divider
} from '@mui/material';
import {
    Twitter,
    Instagram,
    LinkedIn,
    GitHub,
    MailOutline,
    PhoneInTalk,
    LocationOn
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const socialLinks = [
    { icon: <Twitter fontSize="small" />, label: 'Twitter', href: 'https://twitter.com' },
    { icon: <Instagram fontSize="small" />, label: 'Instagram', href: 'https://instagram.com' },
    { icon: <LinkedIn fontSize="small" />, label: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: <GitHub fontSize="small" />, label: 'GitHub', href: 'https://github.com' }
];

const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Discover Teams', to: '/teams' },
    { label: 'Create Team', to: '/teams/create' },
    { label: 'My Team', to: '/teams/my-team' },
    { label: 'Manage Requests', to: '/teams/requests' }
];

const resourceLinks = [
    { label: 'Help Center', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'System Status', href: '#' }
];

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
                position: 'relative',
                background: 'linear-gradient(180deg, rgba(5, 7, 20, 0.98) 0%, rgba(10, 13, 28, 0.96) 75%, rgba(6, 10, 24, 0.98) 100%)',
                borderTop: '1px solid rgba(127, 90, 240, 0.2)',
                overflow: 'hidden'
            }}
        >
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background: `radial-gradient(circle at 12% 20%, rgba(127, 90, 240, 0.18), transparent 55%),
                                radial-gradient(circle at 88% 15%, rgba(44, 182, 125, 0.12), transparent 60%),
                                radial-gradient(circle at 50% 100%, rgba(14, 165, 233, 0.1), transparent 60%)`,
                            opacity: 0.9,
                            pointerEvents: 'none'
                        }}
                    />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
                <Grid container spacing={{ xs: 5, md: 8 }}>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={2.5}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, rgba(127, 90, 240, 0.55) 0%, rgba(44, 182, 125, 0.45) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 22,
                                        boxShadow: '0 18px 45px rgba(15, 20, 40, 0.45)'
                                    }}
                                >
                                    🚀
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                                        Campus Teams
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.68)' }}>
                                        Build faster with teammates who match your ambition.
                                    </Typography>
                                </Box>
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'rgba(203, 213, 225, 0.78)', lineHeight: 1.7 }}>
                                Campus Teams is the glowing hub for hackathons, capstones, and product sprints.
                                Match skills, manage requests, and showcase wins with a pulse of neon energy.
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" sx={{ color: '#cbd5f5', fontWeight: 600, mb: 2 }}>
                            Quick Links
                        </Typography>
                        <Stack spacing={1.2}>
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    component={RouterLink}
                                    to={link.to}
                                    underline="none"
                                    sx={{
                                        color: 'rgba(226, 232, 240, 0.75)',
                                        fontSize: '0.95rem',
                                        '&:hover': {
                                            color: '#f8fafc'
                                        }
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" sx={{ color: '#cbd5f5', fontWeight: 600, mb: 2 }}>
                            Resources
                        </Typography>
                        <Stack spacing={1.2}>
                            {resourceLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    underline="none"
                                    sx={{
                                        color: 'rgba(226, 232, 240, 0.75)',
                                        fontSize: '0.95rem',
                                        '&:hover': {
                                            color: '#f8fafc'
                                        }
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ color: '#cbd5f5', fontWeight: 600, mb: 2 }}>
                            Contact
                        </Typography>
                        <Stack spacing={1.5}>
                            <Stack direction="row" spacing={1.2} alignItems="center">
                                <MailOutline sx={{ color: '#7f5af0' }} fontSize="small" />
                                <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.78)' }}>
                                    hi@campusteams.dev
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1.2} alignItems="center">
                                <PhoneInTalk sx={{ color: '#2cb67d' }} fontSize="small" />
                                <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.78)' }}>
                                    +20 555 123 4567
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1.2} alignItems="center">
                                <LocationOn sx={{ color: '#e75cff' }} fontSize="small" />
                                <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.78)' }}>
                                    Cairo, Egypt
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: { xs: 4, md: 6 }, borderColor: 'rgba(148, 163, 234, 0.2)' }} />

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={3}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                >
                    <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(148, 163, 234, 0.65)' }}>
                            © {currentYear} Campus Teams. All rights reserved.
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(148, 163, 234, 0.55)' }}>
                            Crafted with intent for students and builders everywhere.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.2}>
                        {socialLinks.map((item) => (
                            <IconButton
                                key={item.label}
                                component="a"
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                                aria-label={item.label}
                                sx={{
                                    color: '#f8fafc',
                                    backgroundColor: 'rgba(148, 163, 234, 0.14)',
                                    border: '1px solid rgba(127, 90, 240, 0.25)',
                                    boxShadow: '0 12px 32px rgba(10, 14, 28, 0.45)',
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        backgroundColor: 'rgba(127, 90, 240, 0.32)'
                                    }
                                }}
                            >
                                {item.icon}
                            </IconButton>
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;