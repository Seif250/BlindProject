import { createTheme, styled } from '@mui/material/styles';
import {
  Paper,
  Button,
  AppBar,
  Card,
  Avatar,
  Typography
} from '@mui/material';
export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#0A66C2',      // أزرق LinkedIn الرئيسي
      light: '#057642',     // أزرق فاتح
      dark: '#004182',      // أزرق غامق
    },
    secondary: {
      main: '#057642',      // أخضر LinkedIn
      light: '#057642',     // أخضر فاتح
      dark: '#046236',      // أخضر غامق
    },
    background: {
      default: '#F3F2EF',   // رمادي فاتح للخلفية
      paper: '#FFFFFF',     // أبيض للبطاقات
    },
    text: {
      primary: '#000000',   // أسود للنصوص الرئيسية
      secondary: '#666666', // رمادي للنصوص الثانوية
    },
    grey: {
      100: '#F3F2EF',
      200: '#E0E0E0',
      300: '#CCCCCC',
    }
  },
  typography: {
    fontFamily: 'Tajawal, -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
    h4: {
      fontWeight: 600,
      color: '#000000',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          backgroundColor: '#0A66C2',
          color: 'white',
          '&:hover': {
            backgroundColor: '#004182',
          }
        },
        outlined: {
          borderColor: '#0A66C2',
          color: '#0A66C2',
          '&:hover': {
            backgroundColor: 'rgba(10, 102, 194, 0.04)',
            borderColor: '#004182',
          }
        }
      }
    }
  }
});

// Styled Components

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
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
  '&:hover': {
    backgroundColor: '#004182',
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
  '&:hover': {
    backgroundColor: '#046236',
  }
}));

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#000000',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)',
  '& .MuiToolbar-root': {
    minHeight: '52px',
  }
}));

export const ContentCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: 'none',
  backgroundColor: '#FFFFFF',
  '&:hover': {
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)',
  }
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
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
  }
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  border: '2px solid #FFFFFF',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)',
}));

export const GradientTypography = styled(Typography)(({ theme }) => ({
  color: '#000000',
  fontWeight: 600,
  '&::after': {
    content: '""',
    display: 'block',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginTop: theme.spacing(1),
  }
}));