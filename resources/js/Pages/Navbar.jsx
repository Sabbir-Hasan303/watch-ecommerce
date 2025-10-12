import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  useMediaQuery
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { Search, Notifications, AccountCircle, Settings, LightMode, DarkMode, KeyboardArrowDown, Menu as MenuIcon } from '@mui/icons-material'
import { useThemeContext } from '@/contexts/ThemeContext'
import CustomTextField from '@/Components/CustomTextField'
import { Link, useForm } from '@inertiajs/react'
// import { HamburgerButton } from "@/Components/hamburger-button"

export default function Navbar({ title, subtitle, collapsed, onToggleSidebar }) {
  const { mode, toggleColorMode, theme } = useThemeContext()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [notificationsAnchor, setNotificationsAnchor] = useState(null)
  const [profileAnchor, setProfileAnchor] = useState(null)
  const { post } = useForm()

  const handleNotificationsClick = event => {
    setNotificationsAnchor(event.currentTarget)
  }

  const handleProfileClick = event => {
    setProfileAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setNotificationsAnchor(null)
    setProfileAnchor(null)
  }

  const handleLogout = () => {
    post(route('logout'))
    handleClose()
  }

  return (
    <AppBar position='sticky' sx={{ backgroundImage: 'none', border: 'none', zIndex: 10 }} className='!rounded-none py-1.5 !bg-background'>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, lg: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton onClick={onToggleSidebar} sx={{ color: 'text.secondary' }}>
              <MenuIcon />
            </IconButton>
          )}
          {title && (
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant='h1' component='h1'>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div className='hidden md:block'>
            <CustomTextField
              placeholder='Search...'
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search color='action' className='!text-text-secondary dark:text-dark-text-primary' />
                  </InputAdornment>
                ),
                endAdornment: true && (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => {
                        // setSearchTerm('');
                      }}
                      edge='end'
                      size='small'>
                      <ClearIcon className='!text-text-secondary dark:text-dark-text-primary' />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>

          <IconButton sx={{ color: 'text.secondary' }}>
            <Settings />
          </IconButton>

          <IconButton onClick={toggleColorMode} sx={{ color: 'text.secondary' }}>
            {mode === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>

          <IconButton onClick={handleNotificationsClick} sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={4} color='primary'>
              <Notifications />
            </Badge>
          </IconButton>

          <Menu anchorEl={notificationsAnchor} open={Boolean(notificationsAnchor)} onClose={handleClose}>
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              <Typography variant='subtitle2' color='text.primary'>
                Notifications
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                You have 4 unread messages
              </Typography>
            </Box>
            <Box sx={{ maxHeight: 384, overflow: 'auto' }}>
              {[1, 2, 3, 4].map(item => (
                <MenuItem key={item} sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      width: '100%'
                    }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: 'background.primary',
                        borderRadius: '50%',
                        mt: 0.5,
                        flexShrink: 0
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body2' color='text.primary'>
                        New order received
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Order #100{item} has been placed
                      </Typography>
                      <Typography variant='caption' color='text.secondary' display='block'>
                        {item} hours ago
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Box>
            <Box
              sx={{
                p: 1.5,
                textAlign: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              <Typography
                variant='body2'
                color='primary.main'
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.light' }
                }}>
                View all notifications
              </Typography>
            </Box>
          </Menu>

          <IconButton
            onClick={handleProfileClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1,
              py: 0.5
            }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
              }}>
              <AccountCircle />
            </Avatar>
            <KeyboardArrowDown
              sx={{
                display: { xs: 'none', md: 'block' },
                color: 'text.secondary'
              }}
            />
          </IconButton>

          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: 256,
                mt: 1,
                // backgroundColor: 'background.paper',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }
            }}>
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'primary.main',
                    background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
                  }}>
                  <AccountCircle />
                </Avatar>
                <Box>
                  <Typography variant='subtitle2' color='text.primary'>
                    John Doe
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    john.doe@example.com
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <Link href='/settings/profile'>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <AccountCircle fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary='Profile Settings' />
                </MenuItem>
              </Link>
              {/* <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize='small' />
                </ListItemIcon>
                <ListItemText primary='Account Settings' />
              </MenuItem> */}
            </Box>
            <Box
              sx={{
                p: 1,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              <MenuItem onClick={handleLogout}>
                <ListItemText
                  primary='Sign Out'
                  primaryTypographyProps={{
                    color: 'error.main'
                  }}
                />
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
