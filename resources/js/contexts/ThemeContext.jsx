import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Prefer saved theme; else system preference; default to 'dark'
    const savedMode = typeof window !== 'undefined' ? localStorage.getItem('themeMode') : null;
    if (savedMode === 'light' || savedMode === 'dark') return savedMode;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  // Apply Tailwind dark mode class to <html>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: '#10b981', // emerald-500
          light: '#34d399', // emerald-400
          dark: '#059669', // emerald-600
        },
        secondary: {
          main: '#14b8a6', // teal-500
          light: '#5eead4', // teal-300
          dark: '#0f766e', // teal-700
        },
        background: {
          default: mode === 'dark' ? '#1C252E' : '#ffffff',
          paper: mode === 'dark' ? '#1C252E' : '#ffffff',
        },
        text: {
          primary: mode === 'dark' ? '#ffffff' : '#1f2937',
          secondary: mode === 'dark' ? '#9ca3af' : '#6b7280',
        },
        divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '1.5rem',
          fontWeight: 700,
          background: mode === 'dark'
            ? 'linear-gradient(90deg, #ffffff 0%, #f3f4f6 50%, #d1d5db 100%)'
            : 'linear-gradient(90deg, #1f2937 0%, #374151 50%, #4b5563 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                '& fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#10b981',
                },
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#1C252E' : '#ffffff',
              border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                transform: 'scale(1.1)',
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark'
                ? 'rgba(28, 37, 46, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderBottom: mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: mode === 'dark'
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
            },
          },
        },
      },
    });
  }, [mode]);

  const value = {
    mode,
    toggleColorMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
