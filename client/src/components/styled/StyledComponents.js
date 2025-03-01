import { styled } from '@mui/material/styles';
import { Typography, Button, Card, Avatar, AppBar, Paper } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: '#FFFFFF',
  border: '1px solid #E0E0E0',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

export const RedButton = styled(Button)(({ theme }) => ({
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  background: theme.palette.primary.main,
  color: 'white',
  borderRadius: 16,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    background: theme.palette.primary.dark,
    boxShadow: '0 10px 20px rgba(211, 47, 47, 0.2)',
  }
}));

export const GreenButton = styled(Button)(({ theme }) => ({
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  background: theme.palette.secondary.main,
  color: 'white',
  borderRadius: 16,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    background: theme.palette.secondary.dark,
    boxShadow: '0 10px 20px rgba(46, 125, 50, 0.2)',
  }
}));

export const GradientTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  textAlign: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 60,
    height: 3,
    background: theme.palette.primary.main,
    borderRadius: 2
  }
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: '4px solid #FFFFFF',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 25px rgba(0, 0, 0, 0.2)',
  }
}));

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.main,
  boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
}));