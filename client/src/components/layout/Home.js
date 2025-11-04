import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Stack,
  Typography,
  Avatar,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionTitle,
  HelperText,
  AccentBadge,
  NeonButton,
  GlassCard
} from '../styled/StyledComponents';

const featureHighlights = [
  {
    title: 'Match With Talent Instantly',
    description:
      'Smart matchmaking pairs you with teammates that complement your strengths for hackathons, capstones, or startup sprints.',
    icon: <BoltRoundedIcon fontSize="large" sx={{ color: '#7f5af0' }} />
  },
  {
    title: 'Showcase Credibility',
    description: 'Verified profiles, skill tags, and project badges help teams recruit with confidence in under five minutes.',
    icon: <SecurityRoundedIcon fontSize="large" sx={{ color: '#2cb67d' }} />
  },
  {
    title: 'Collaborate In Real Time',
    description: 'Coordinate deliverables, share updates, and manage team requests with one glowing dashboard.',
    icon: <ChatRoundedIcon fontSize="large" sx={{ color: '#e75cff' }} />
  }
];

const experiencePillars = [
  {
    label: 'Team Discovery',
    copy: 'Search by domain, tech stack, or challenge focus to locate the perfect squad.',
    icon: <ExploreRoundedIcon sx={{ color: '#7f5af0' }} />
  },
  {
    label: 'Skill Alignment',
    copy: 'Compare teammate strengths and fill gaps so every sprint stays balanced.',
    icon: <InsightsRoundedIcon sx={{ color: '#2cb67d' }} />
  },
  {
    label: 'Lightning Onboarding',
    copy: 'Accept requests and launch breakout rooms faster than ever before.',
    icon: <AccessTimeRoundedIcon sx={{ color: '#e75cff' }} />
  },
  {
    label: 'Reputation Growth',
    copy: 'Collect peer ratings, earn trophies, and keep your profile glowing.',
    icon: <EmojiEventsRoundedIcon sx={{ color: '#facc15' }} />
  }
];

const socialProof = [
  {
    label: 'Teams Launched',
    value: '4,800+',
    icon: <Groups2RoundedIcon fontSize="small" />
  },
  {
    label: 'Average Matching Time',
    value: '6 min',
    icon: <RocketLaunchRoundedIcon fontSize="small" />
  },
  {
    label: 'Success Score',
    value: '92%',
    icon: <TrendingUpRoundedIcon fontSize="small" />
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Box sx={{ px: { xs: 3, sm: 6, md: 10 } }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid item xs={12} md={7}>
            <PageHeader>
              <AccentBadge>
                <LaunchRoundedIcon sx={{ fontSize: 18, mr: 1 }} />
                Team Up. Build Fast. Shine Bright.
              </AccentBadge>
              <PageTitle component="h1">Build unstoppable teams for every challenge.</PageTitle>
              <PageSubtitle>
                Campus Teams connects ambitious builders, designers, and innovators through a neon-fueled experience. Discover teammates, launch projects, and track your wins in one vibrant command center.
              </PageSubtitle>
              <Stack spacing={3} sx={{ mt: 5 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                  <NeonButton onClick={() => navigate('/register')} data-testid="cta-get-started">
                    Create Your Team
                  </NeonButton>
                  <NeonButton
                    variant="outlined"
                    onClick={() => navigate('/teams')}
                    sx={{
                      background: 'transparent',
                      color: '#f8fafc',
                      boxShadow: '0 0 0 rgba(0,0,0,0)',
                      border: '1px solid rgba(127, 90, 240, 0.5)',
                      '&:hover': {
                        background: 'rgba(127, 90, 240, 0.16)',
                        boxShadow: '0 18px 38px rgba(127, 90, 240, 0.35)'
                      }
                    }}
                    data-testid="cta-discover"
                  >
                    Browse Teams
                  </NeonButton>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {socialProof.map((stat) => (
                    <GlassCard key={stat.label} sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          mr: 2.2,
                          background: 'rgba(127, 90, 240, 0.18)',
                          color: '#e2e8f0',
                          border: '1px solid rgba(127, 90, 240, 0.4)'
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(226,232,240,0.76)' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </GlassCard>
                  ))}
                </Stack>
              </Stack>
            </PageHeader>
          </Grid>

          <Grid item xs={12} md={5}>
            <SectionCard sx={{ p: 0 }}>
              <Box sx={{ p: { xs: 4, md: 5 }, position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 10,
                    borderRadius: '24px',
                    background: 'radial-gradient(circle, rgba(127,90,240,0.28), rgba(12,16,32,0.85))',
                    filter: 'blur(40px)',
                    zIndex: 0
                  }}
                />
                <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                  {featureHighlights.map((feature) => (
                    <Card
                      key={feature.title}
                      sx={{
                        background: 'rgba(10, 14, 28, 0.92)',
                        borderRadius: 20,
                        border: '1px solid rgba(148, 163, 234, 0.24)',
                        boxShadow: '0 26px 65px rgba(11, 16, 32, 0.6)',
                        backdropFilter: 'blur(14px)'
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                        <Avatar
                          variant="rounded"
                          sx={{
                            background: 'rgba(127, 90, 240, 0.18)',
                            border: '1px solid rgba(127, 90, 240, 0.35)',
                            width: 52,
                            height: 52
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9', mb: 1 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(203,213,225,0.82)', lineHeight: 1.7 }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            </SectionCard>
          </Grid>
        </Grid>

        <Box sx={{ mt: { xs: 10, md: 14 } }}>
          <SectionCard>
            <Stack spacing={5}>
              <Box>
                <AccentBadge>
                  <LocalFireDepartmentRoundedIcon sx={{ fontSize: 18, mr: 1 }} />
                  Glow-Up Workflow
                </AccentBadge>
                <SectionTitle variant="h2">Everything you need to run a high-voltage crew.</SectionTitle>
                <HelperText>
                  From onboarding to retrospectives, Campus Teams keeps every milestone illuminated. Organize your roster, manage incoming requests, and broadcast wins without jumping between apps.
                </HelperText>
              </Box>
              <Grid container spacing={4}>
                {experiencePillars.map((pillar) => (
                  <Grid item xs={12} md={3} key={pillar.label}>
                    <GlassCard sx={{ height: '100%' }}>
                      <Stack spacing={2.5}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            background: 'rgba(127, 90, 240, 0.16)',
                            border: '1px solid rgba(127, 90, 240, 0.35)',
                            color: '#e2e8f0'
                          }}
                        >
                          {pillar.icon}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                          {pillar.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(203,213,225,0.78)', lineHeight: 1.7 }}>
                          {pillar.copy}
                        </Typography>
                      </Stack>
                    </GlassCard>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </SectionCard>
        </Box>

        <Box sx={{ mt: { xs: 10, md: 14 } }}>
          <SectionCard>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>
                  <AccentBadge>
                    <StarRoundedIcon sx={{ fontSize: 18, mr: 1 }} />
                    Trusted By Creators
                  </AccentBadge>
                  <SectionTitle variant="h2">Glow-worthy testimonials.</SectionTitle>
                  <HelperText>
                    Hear from student founders, hackathon champions, and open-source maintainers who rely on Campus Teams to stay aligned and launch faster.
                  </HelperText>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarRoundedIcon key={star} sx={{ color: '#facc15', filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.65))' }} />
                    ))}
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'rgba(148, 174, 233, 0.78)', fontStyle: 'italic' }}>
                    "Campus Teams transformed our hackathon workflow. Matched with three specialists in minutes and shipped an award-winning MVP before sunrise."
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src="https://i.pravatar.cc/150?img=11" alt="Lara" sx={{ border: '2px solid rgba(127, 90, 240, 0.45)' }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                        Lara Jennings
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(203,213,225,0.8)' }}>
                        Lead Designer @ Midnight Labs
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <GlassCard sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src="https://i.pravatar.cc/150?img=18" alt="Mateo" sx={{ width: 48, height: 48, border: '2px solid rgba(127, 90, 240, 0.35)' }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: '#f1f5f9', fontWeight: 600 }}>
                          Mateo Diaz
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(203,213,225,0.75)' }}>
                          Hackathon Strategist
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'rgba(203,213,225,0.85)', lineHeight: 1.8 }}>
                      "The glowing dashboard keeps every track on schedule. Rating teammates helps us celebrate wins and stay accountable for future sprints."
                    </Typography>
                    <Divider sx={{ borderColor: 'rgba(127, 90, 240, 0.35)' }} />
                    <Stack direction="row" spacing={1}>
                      <Chip label="Hackathon MVP" variant="outlined" sx={{ borderColor: 'rgba(127, 90, 240, 0.45)', color: '#e0e7ff' }} />
                      <Chip label="Design Lead" variant="outlined" sx={{ borderColor: 'rgba(44, 182, 125, 0.45)', color: '#c7f9cc' }} />
                      <Chip label="Top Rated" variant="outlined" sx={{ borderColor: 'rgba(231, 92, 255, 0.45)', color: '#f5d0fe' }} />
                    </Stack>
                  </Stack>
                </GlassCard>
              </Grid>
            </Grid>
          </SectionCard>
        </Box>

        <Box sx={{ mt: { xs: 12, md: 16 }, mb: { xs: 6, md: 10 } }}>
          <GlassCard
            sx={{
              textAlign: 'center',
              py: { xs: 6, md: 8 },
              background: 'linear-gradient(135deg, rgba(13, 17, 38, 0.96) 0%, rgba(12, 14, 30, 0.94) 100%)',
              border: '1px solid rgba(127, 90, 240, 0.35)'
            }}
          >
            <Stack spacing={3} alignItems="center">
              <AccentBadge>
                <PersonAddAltRoundedIcon sx={{ fontSize: 18, mr: 1 }} />
                Ready To Glow
              </AccentBadge>
              <Typography variant="h4" sx={{ color: '#f8fafc', fontWeight: 700, maxWidth: 640 }}>
                Recruit the dream team, conquer deadlines, and keep the energy electric.
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(203,213,225,0.82)', maxWidth: 560 }}>
                Join Campus Teams to connect with innovators across disciplines. From ideation to launch day, we keep your workflow synchronized and your vibe luminous.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ pt: 1 }}>
                <NeonButton onClick={() => navigate('/register')} data-testid="cta-join">
                  Join The Platform
                </NeonButton>
                <NeonButton
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    background: 'transparent',
                    color: '#f8fafc',
                    boxShadow: 'none',
                    border: '1px solid rgba(44, 182, 125, 0.5)',
                    '&:hover': {
                      background: 'rgba(44, 182, 125, 0.16)',
                      boxShadow: '0 18px 38px rgba(44, 182, 125, 0.35)'
                    }
                  }}
                  data-testid="cta-sign-in"
                >
                  Sign In Securely
                </NeonButton>
              </Stack>
            </Stack>
          </GlassCard>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default Home;
