import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function ThemeToggleExample() {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Theme Toggle Example
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="body1">
          Current theme: <strong>{mode}</strong>
        </Typography>
        <Button
          variant="contained"
          startIcon={mode === 'light' ? <DarkMode /> : <LightMode />}
          onClick={toggleColorMode}
        >
          Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary">
        This component demonstrates how to use the theme context in any component.
        The theme preference is automatically saved to localStorage.
      </Typography>
    </Paper>
  );
}
