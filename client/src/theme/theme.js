import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#D32F2F',      // أحمر
      light: '#EF5350',     // أحمر فاتح
      dark: '#B71C1C',      // أحمر غامق
    },
    secondary: {
      main: '#2E7D32',      // أخضر
      light: '#4CAF50',     // أخضر فاتح
      dark: '#1B5E20',      // أخضر غامق
    },
    background: {
      default: '#FFFFFF',   // أبيض للخلفية
      paper: '#FFFFFF',     // أبيض للبطاقات
    },
    text: {
      primary: '#1A1A1A',   // أسود للنصوص
      secondary: '#666666', // رمادي للنصوص الثانوية
    }
  },
  typography: {
    fontFamily: 'Tajawal, sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#D32F2F',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          color: 'white',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
          border: '1px solid #E0E0E0',
          '&:hover': {
            transform: 'translateY(-5px)',
          }
        }
      }
    }
  }
});