import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const ThemeContext = createContext()

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider')
  }
  return context
}

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Prefer saved theme; else system preference; default to 'dark'
    const savedMode = typeof window !== 'undefined' ? localStorage.getItem('themeMode') : null
    if (savedMode === 'light' || savedMode === 'dark') return savedMode

    // If no saved preference, default to dark mode and save it
    const defaultMode = 'dark'
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', defaultMode)
    }
    return defaultMode
  })

  const toggleColorMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'light' ? 'dark' : 'light'
      localStorage.setItem('themeMode', newMode)
      return newMode
    })
  }

  // Apply Tailwind dark mode class to <html>
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
  }, [mode])

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        // primary: {
        //   main: mode === 'dark' ? '#f59e0b' : '#6366f1', // orange-500 : indigo-500
        //   light: mode === 'dark' ? '#fbbf24' : '#818cf8', // amber-400 : indigo-400
        //   dark: mode === 'dark' ? '#d97706' : '#4f46e5' // amber-600 : indigo-600
        // },
        // secondary: {
        //   main: mode === 'dark' ? '#10b981' : '#06b6d4', // emerald-500 : cyan-500
        //   light: mode === 'dark' ? '#34d399' : '#22d3ee', // emerald-400 : cyan-400
        //   dark: mode === 'dark' ? '#059669' : '#0891b2' // emerald-600 : cyan-600
        // },
        // background: {
        //   default: mode === 'dark' ? '#1c252e' : '#fafafa',
        //   paper: mode === 'dark' ? '#1c252e' : '#ffffff'
        // },
        text: {
          primary: mode === 'dark' ? '#ffffff' : '#1c252e',
          secondary: mode === 'dark' ? '#9ca3af' : '#6b7280'
        },
        divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        success: {
          main: mode === 'dark' ? '#10b981' : '#f59e0b', // emerald-500 : amber-500
          light: mode === 'dark' ? '#34d399' : '#fbbf24', // emerald-400 : amber-400
          dark: mode === 'dark' ? '#059669' : '#d97706' // emerald-600 : amber-600
        },
        warning: {
          main: mode === 'dark' ? '#f59e0b' : '#f59e0b', // amber-500 : amber-500
          light: mode === 'dark' ? '#fbbf24' : '#fbbf24', // amber-400 : amber-400
          dark: mode === 'dark' ? '#d97706' : '#d97706' // amber-600 : amber-600
        },
        info: {
          main: mode === 'dark' ? '#06b6d4' : '#06b6d4', // cyan-500 : cyan-500
          light: mode === 'dark' ? '#22d3ee' : '#22d3ee', // cyan-400 : cyan-400
          dark: mode === 'dark' ? '#0891b2' : '#0891b2' // cyan-600 : cyan-600
        },
        error: {
          main: mode === 'dark' ? '#ef4444' : '#ef4444', // red-500 : red-500
          light: mode === 'dark' ? '#f87171' : '#f87171', // red-400 : red-400
          dark: mode === 'dark' ? '#dc2626' : '#dc2626' // red-600 : red-600
        }
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '1.5rem',
          fontWeight: 700,
          background:
            mode === 'dark'
              ? 'linear-gradient(90deg, #ffffff 0%, #f3f4f6 50%, #d1d5db 100%)'
              : 'linear-gradient(90deg, #1f2937 0%, #374151 50%, #4b5563 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                transform: 'scale(1.05)',
                boxShadow: mode === 'dark' ? '0 8px 25px -8px rgba(245, 158, 11, 0.3)' : '0 8px 25px -8px rgba(99, 102, 241, 0.2)'
              }
            },
            sizeLarge: {
              padding: '12px 24px'
            }
          }
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px'
              }
            }
          }
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#141a21' : '#ffffff',
            //   border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              backgroundImage: 'none',
              boxShadow:
                mode === 'dark'
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }
          }
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                transform: 'scale(1.1)',
                boxShadow: mode === 'dark' ? '0 4px 12px -4px rgba(245, 158, 11, 0.2)' : '0 4px 12px -4px rgba(99, 102, 241, 0.1)'
              }
            }
          }
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
            //   backgroundColor: mode === 'dark' ? '#1c252e' : '#ffffff',
              backdropFilter: 'blur(20px)',
              borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow:
                mode === 'dark'
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }
          }
        },
        MuiCard: {
          styleOverrides: {
            root: {
            //   backgroundColor: mode === 'dark' ? '#1c252e' : '#ffffff',
              border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow:
                  mode === 'dark'
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }
            }
          }
        },
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#1c252e' : '#ffffff'
            }
          }
        },
        MuiDialogContent: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#1c252e' : '#ffffff'
            }
          }
        },
        MuiDialogActions: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#1c252e' : '#ffffff'
            }
          }
        }
      }
    })
  }, [mode])

  const value = {
    mode,
    toggleColorMode,
    theme,
    isDark: mode === 'dark' // Add isDark for backward compatibility
  }

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
