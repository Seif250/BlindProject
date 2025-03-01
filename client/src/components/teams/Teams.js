import React, { useState } from 'react';
import { StyledPaper, AnimatedButton, GradientTypography } from '../styled/StyledComponents';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const Teams = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
          <StyledPaper>
            <GradientTypography variant="h4" align="center" gutterBottom>
              مرحباً بك في صفحة الفرق
            </GradientTypography>
            
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <AnimatedButton
                  fullWidth
                  onClick={() => navigate('/teams/create')}
                >
                  <AddIcon sx={{ fontSize: 40 }} />
                  <Typography variant="h6">إنشاء فريق جديد</Typography>
                </AnimatedButton>
              </Grid>
              <Grid item xs={12} md={6}>
                <AnimatedButton
                  fullWidth
                  onClick={() => navigate('/teams/search')}
                  sx={{
                    background: 'linear-gradient(45deg, #ff4081 30%, #ff79b0 90%)',
                  }}
                >
                  <SearchIcon sx={{ fontSize: 40 }} />
                  <Typography variant="h6">البحث عن فريق</Typography>
                </AnimatedButton>
              </Grid>
            </Grid>
          </StyledPaper>
        </Container>
      );
};

export default Teams;