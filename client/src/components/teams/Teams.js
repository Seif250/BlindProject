import React, { useState } from 'react';
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
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    مرحباً بك في صفحة الفرق
                </Typography>
                
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/teams/create')}
                            sx={{ height: '150px' }}
                        >
                            إنشاء فريق جديد
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            startIcon={<SearchIcon />}
                            onClick={() => navigate('/teams/search')}
                            sx={{ height: '150px' }}
                        >
                            البحث عن فريق
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Teams;