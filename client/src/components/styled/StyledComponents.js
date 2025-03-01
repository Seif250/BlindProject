import { styled } from '@mui/material/styles';
import { Typography, Button, Card, Avatar, AppBar, Paper } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 8,
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)',
  }
}));

export const RedButton = styled(Button)(({ theme }) => ({
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  background: '#0A66C2',
  color: 'white',
  borderRadius: 8,
  boxShadow: 'none',
  '&:hover': {
    background: '#004182',
    boxShadow: 'none',
  }
}));

export const GreenButton = styled(Button)(({ theme }) => ({
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  background: '#057642',
  color: 'white',
  borderRadius: 8,
  boxShadow: 'none',
  '&:hover': {
    background: '#046236',
    boxShadow: 'none',
  }
}));

export const GradientTypography = styled(Typography)(({ theme }) => ({
  color: '#000000',
  fontWeight: 600,
  textAlign: 'center',
  position: 'relative',
  padding: '0 0 16px 0',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 50,
    height: 1,
    background: 'rgba(0, 0, 0, 0.08)',
    transition: 'width 0.3s ease',
  }
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: '2px solid #FFFFFF',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)',
}));

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#000000',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)',
  '& .MuiToolbar-root': {
    minHeight: '52px',
    padding: theme.spacing(0, 3),
  },
  '& .MuiButton-root': {
    color: 'rgba(0, 0, 0, 0.6)',
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.9)',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    }
  }
}));

export const ContentCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(2),
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)',
  }
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  '&.MuiButton-contained': {
    backgroundColor: '#0A66C2',
    color: 'white',
    '&:hover': {
      backgroundColor: '#004182',
    }
  },
  '&.MuiButton-outlined': {
    borderColor: 'rgba(0, 0, 0, 0.6)',
    color: 'rgba(0, 0, 0, 0.6)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      borderColor: 'rgba(0, 0, 0, 0.9)',
    }
  },
  '&.MuiButton-text': {
    color: 'rgba(0, 0, 0, 0.6)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      color: 'rgba(0, 0, 0, 0.9)',
    }
  }
}));

// Additional Styles
export const PostCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(2),
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: 'none',
  marginBottom: theme.spacing(2),
}));

export const IconButton = styled(Button)(({ theme }) => ({
  color: 'rgba(0, 0, 0, 0.6)',
  textTransform: 'none',
  padding: theme.spacing(1),
  borderRadius: 4,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    color: 'rgba(0, 0, 0, 0.9)',
  }
}));