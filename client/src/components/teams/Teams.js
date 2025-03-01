import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { GradientTypography, RedButton, GreenButton, StyledPaper } from '../styled/StyledComponents';

const Teams = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <StyledPaper sx={{ p: 4, mt: 4 }}>
                <GradientTypography variant="h4" gutterBottom>
                    مرحباً بك في نظام الفرق
                </GradientTypography>

                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={6}>
                        <RedButton
                            fullWidth
                            onClick={() => navigate('/teams/create')}
                        >
                            <AddIcon sx={{ fontSize: 40 }} />
                            <Typography variant="h6">إنشاء فريق جديد</Typography>
                            <Typography variant="body2" align="center">
                                أنشئ فريقك الخاص وابدأ مشروعك
                            </Typography>
                        </RedButton>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GreenButton
                            fullWidth
                            onClick={() => navigate('/teams/search')}
                        >
                            <SearchIcon sx={{ fontSize: 40 }} />
                            <Typography variant="h6">البحث عن فريق</Typography>
                            <Typography variant="body2" align="center">
                                انضم إلى الفرق المتاحة وشارك في المشاريع
                            </Typography>
                        </GreenButton>
                    </Grid>
                </Grid>
            </StyledPaper>
        </Container>
    );
};

export default Teams;