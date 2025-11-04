import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  direction: 'ltr',
  palette: {
    mode: 'dark',
    primary: {
      main: '#7f5af0',
      light: '#a68bff',
      dark: '#5233b9'
    },
    secondary: {
      main: '#2cb67d',
      light: '#3ed69b',
      dark: '#1b8559'
    },
    background: {
      default: '#050714',
      paper: 'rgba(12, 17, 31, 0.92)'
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8'
    },
    divider: 'rgba(148, 163, 184, 0.2)'
  },
  typography: {
    fontFamily: 'Poppins, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.02em'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.04em'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#050714',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(127, 90, 240, 0.22), transparent 45%),\n             radial-gradient(circle at 80% 0%, rgba(44, 182, 125, 0.2), transparent 35%),\n             radial-gradient(circle at 50% 80%, rgba(14, 165, 233, 0.18), transparent 40%)',
          minHeight: '100vh'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(8, 12, 24, 0.85)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(18px)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(12, 17, 31, 0.9)',
          borderRadius: 20,
          border: '1px solid rgba(126, 128, 255, 0.15)',
          boxShadow: '0 20px 60px rgba(12, 17, 31, 0.45)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 15, 28, 0.9)',
          borderRadius: 20,
          border: '1px solid rgba(127, 90, 240, 0.12)',
          boxShadow: '0 18px 50px rgba(7, 10, 22, 0.55)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 12px 30px rgba(127, 90, 240, 0.25)',
          transition: 'all 0.3s ease'
        },
        contained: {
          backgroundImage: 'linear-gradient(135deg, #7f5af0 0%, #5b27d1 100%)',
          color: '#fff',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 18px 40px rgba(127, 90, 240, 0.35)',
            backgroundImage: 'linear-gradient(135deg, #916bff 0%, #6a37e9 100%)'
          }
        },
        outlined: {
          borderColor: 'rgba(127, 90, 240, 0.6)',
          color: '#e2e8f0',
          '&:hover': {
            borderColor: '#a68bff',
            backgroundColor: 'rgba(127, 90, 240, 0.08)',
            boxShadow: '0 14px 32px rgba(80, 60, 180, 0.35)'
          }
        },
        text: {
          color: '#e2e8f0',
          '&:hover': {
            backgroundColor: 'rgba(127, 90, 240, 0.08)'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          background: 'rgba(7, 13, 26, 0.9)',
          border: '1px solid rgba(127, 90, 240, 0.18)',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.55)',
          transition: 'all 0.25s ease',
          '&:hover': {
            borderColor: 'rgba(127, 90, 240, 0.45)'
          },
          '&.Mui-focused': {
            borderColor: '#8b5cf6',
            boxShadow: '0 0 0 3px rgba(127, 90, 240, 0.35)'
          }
        },
        input: {
          color: '#f8fafc'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(226, 232, 240, 0.6)',
          '&.Mui-focused': {
            color: '#a78bfa'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(127, 90, 240, 0.15)',
          color: '#cbd5f5'
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent !important'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)'
        },
        standardError: {
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5'
        },
        standardSuccess: {
          background: 'rgba(44, 182, 125, 0.1)',
          border: '1px solid rgba(44, 182, 125, 0.3)',
          color: '#86efac'
        },
        standardInfo: {
          background: 'rgba(14, 165, 233, 0.1)',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          color: '#7dd3fc'
        },
        standardWarning: {
          background: 'rgba(251, 146, 60, 0.1)',
          border: '1px solid rgba(251, 146, 60, 0.3)',
          color: '#fdba74'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(12, 17, 31, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(127, 90, 240, 0.2)'
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: 'rgba(12, 17, 31, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(127, 90, 240, 0.2)'
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(12, 17, 31, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(127, 90, 240, 0.3)',
          color: '#e2e8f0',
          fontSize: '0.875rem'
        }
      }
    }
  }
});