import { styled } from '@mui/material/styles';
import { Typography, Button, Card, Paper, Box, Chip } from '@mui/material';

export const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(10, 0, 12),
  background:
    'radial-gradient(circle at 20% 20%, rgba(127, 90, 240, 0.25), transparent 55%),\n    radial-gradient(circle at 80% 0%, rgba(44, 182, 125, 0.2), transparent 45%),\n    linear-gradient(180deg, rgba(5, 7, 20, 0.95) 0%, rgba(7, 10, 24, 0.98) 45%, rgba(3, 5, 15, 1) 100%)'
}));

export const PageHeader = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  marginBottom: theme.spacing(6),
  color: theme.palette.text.primary,
  maxWidth: 720
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.35rem',
  color: '#f8fafc',
  textShadow: '0 12px 40px rgba(127, 90, 240, 0.35)'
}));

export const PageSubtitle = styled(Typography)(({ theme }) => ({
  color: 'rgba(226, 232, 240, 0.72)',
  maxWidth: 640,
  marginTop: theme.spacing(1.8),
  fontSize: '1.05rem',
  lineHeight: 1.75
}));

export const SectionCard = styled(Paper)(({ theme }) => ({
  borderRadius: 26,
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  background: 'rgba(8, 14, 28, 0.92)',
  border: '1px solid rgba(127, 90, 240, 0.18)',
  boxShadow: '0 28px 70px rgba(2, 6, 18, 0.7)',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 20,
    background: 'linear-gradient(135deg, rgba(127, 90, 240, 0.18) 0%, rgba(44, 182, 125, 0.12) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:hover::before': {
    opacity: 0.35
  }
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#f1f5f9',
  marginBottom: theme.spacing(3),
  letterSpacing: '0.02em'
}));

export const HelperText = styled(Typography)(({ theme }) => ({
  color: 'rgba(203, 213, 225, 0.78)',
  fontSize: '0.95rem',
  lineHeight: 1.7
}));

export const InfoChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: 'rgba(127, 90, 240, 0.22)',
  color: '#e9e8ff',
  fontWeight: 600,
  height: 30,
  backdropFilter: 'blur(12px)',
  '& .MuiChip-label': {
    padding: theme.spacing(0, 1.8)
  }
}));

export const AccentBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.75, 1.8),
  borderRadius: 999,
  background: 'linear-gradient(135deg, rgba(127, 90, 240, 0.28) 0%, rgba(44, 182, 125, 0.16) 100%)',
  color: '#c7d2fe',
  fontSize: '0.85rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 700,
  marginBottom: theme.spacing(2)
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 18,
  padding: theme.spacing(1.5, 3.5),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 16px 40px rgba(127, 90, 240, 0.28)',
  '&.MuiButton-contained': {
    backgroundImage: 'linear-gradient(135deg, #7f5af0 0%, #5b27d1 100%)',
    color: '#fff'
  }
}));

export const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, rgba(14, 18, 35, 0.92) 0%, rgba(11, 16, 30, 0.94) 100%)',
  border: '1px solid rgba(148, 163, 234, 0.18)',
  boxShadow: '0 24px 64px rgba(5, 8, 20, 0.65)'
}));

export const NeonButton = styled(Button)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(1.5, 5),
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: '#0b1120',
  background: 'linear-gradient(135deg, #2cb67d 0%, #7f5af0 100%)',
  boxShadow: '0 25px 60px rgba(127, 90, 240, 0.35)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 30px 70px rgba(127, 90, 240, 0.45)'
  }
}));