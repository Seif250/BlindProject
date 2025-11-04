import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';
import { Favorite } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box component="footer" sx={{ mt: 'auto', py: 4, background: 'rgba(8, 12, 24, 0.9)', borderTop: '1px solid rgba(127, 90, 240, 0.2)' }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>
                         2025 Campus Teams. Built with <Favorite sx={{ fontSize: 16, color: '#7f5af0', verticalAlign: 'middle', mx: 0.5 }} /> for students
                    </Typography>
                    <Stack direction="row" spacing={3}>
                        <Link href="#" sx={{ color: 'rgba(226, 232, 240, 0.6)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#7f5af0' } }}>About</Link>
                        <Link href="#" sx={{ color: 'rgba(226, 232, 240, 0.6)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#7f5af0' } }}>Privacy</Link>
                        <Link href="#" sx={{ color: 'rgba(226, 232, 240, 0.6)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#7f5af0' } }}>Contact</Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
