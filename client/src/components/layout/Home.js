import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  alpha
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GroupsIcon from '@mui/icons-material/Groups';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';


const features = [
  {
    icon: <FlashOnIcon sx={{ fontSize: 40 }} />,
    title: 'Instant Matching',
    description: 'Find your perfect teammates in seconds with our smart AI-powered matching system.'
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
    title: 'Verified Profiles',
    description: 'Trust in verified student profiles with skill badges and project portfolios.'
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    title: 'Track Progress',
    description: 'Monitor team performance and celebrate achievements with built-in analytics.'
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
    title: 'Earn Rewards',
    description: 'Gain reputation points and unlock exclusive features as you collaborate.'
  }
];

const stats = [
  { number: '10K+', label: 'Active Students' },
  { number: '5K+', label: 'Teams Formed' },
  { number: '98%', label: 'Success Rate' }
];


const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)',
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 }
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 8, md: 12 }
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              textShadow: '0 0 60px rgba(127, 90, 240, 0.4)'
            }}
          >
            Build Your Dream Team
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(226, 232, 240, 0.85)',
              maxWidth: 700,
              mx: 'auto',
              mb: 5,
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Connect with talented students, form powerful teams, and bring your projects to life. The ultimate platform for student collaboration.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button
              size="large"
              variant="contained"
              startIcon={<RocketLaunchIcon />}
              onClick={() => navigate('/register')}
              sx={{
                py: 1.8,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #7f5af0 0%, #5b27d1 100%)',
                boxShadow: '0 8px 32px rgba(127, 90, 240, 0.4)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #916bff 0%, #6a37e9 100%)',
                  boxShadow: '0 12px 40px rgba(127, 90, 240, 0.6)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Free
            </Button>

            <Button
              size="large"
              variant="outlined"
              startIcon={<GroupsIcon />}
              onClick={() => navigate('/teams')}
              sx={{
                py: 1.8,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                borderColor: 'rgba(127, 90, 240, 0.5)',
                color: '#e2e8f0',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#7f5af0',
                  background: 'rgba(127, 90, 240, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Explore Teams
            </Button>
          </Stack>

          {/* Stats */}
          <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 800, mx: 'auto' }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(12, 17, 31, 0.6)',
                    border: '1px solid rgba(127, 90, 240, 0.2)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(127, 90, 240, 0.5)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(127, 90, 240, 0.3)'
                    }
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: '#7f5af0',
                      mb: 0.5
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              textAlign: 'center',
              color: '#e2e8f0',
              mb: 2
            }}
          >
            Why Choose Campus Teams?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'rgba(226, 232, 240, 0.7)',
              maxWidth: 600,
              mx: 'auto',
              mb: 6
            }}
          >
            Everything you need to build, collaborate, and succeed with your team
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(12, 17, 31, 0.8)',
                    borderRadius: 4,
                    border: '1px solid rgba(127, 90, 240, 0.2)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(127, 90, 240, 0.5)',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(127, 90, 240, 0.3)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: 3,
                        background: 'rgba(127, 90, 240, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        color: '#7f5af0',
                        border: '1px solid rgba(127, 90, 240, 0.3)'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#e2e8f0',
                        mb: 1.5
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(226, 232, 240, 0.7)',
                        lineHeight: 1.7
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            p: { xs: 6, md: 8 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(127, 90, 240, 0.15) 0%, rgba(44, 182, 125, 0.15) 100%)',
            border: '1px solid rgba(127, 90, 240, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#e2e8f0',
              mb: 2
            }}
          >
            Ready to Start Building?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(226, 232, 240, 0.8)',
              maxWidth: 600,
              mx: 'auto',
              mb: 4
            }}
          >
            Join thousands of students already collaborating on Campus Teams. Create your profile and find your perfect team today.
          </Typography>
          <Button
            size="large"
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{
              py: 1.8,
              px: 5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #7f5af0 0%, #5b27d1 100%)',
              boxShadow: '0 8px 32px rgba(127, 90, 240, 0.4)',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #916bff 0%, #6a37e9 100%)',
                boxShadow: '0 12px 40px rgba(127, 90, 240, 0.6)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Create Free Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
