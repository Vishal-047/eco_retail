"use client";
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Park,
  ShoppingCart,
  Dashboard,
  Person,
  Logout,
  Login,
  HowToReg,
  Calculate,
  LocalShipping,
  Recycling,
  SmartToy,
  TrendingUp,
} from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Remove import { useColorMode } from './ThemeProvider';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Remove: const { toggleColorMode, mode } = useColorMode();

  // Mock user state - in real app, this would come from context/state management
  const [user, setUser] = useState<null | { name?: string; phone?: string; email?: string; greenPoints?: number }>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // Load user from localStorage on mount and fetch latest info from backend
  useEffect(() => {
    async function syncUser() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('ecoUser');
        if (stored) {
          const localUser = JSON.parse(stored);
          // Fetch latest user info from backend
          try {
            const res = await fetch('/api/auth/me', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone: localUser.phone, email: localUser.email })
            });
            const data = await res.json();
            console.log('Fetched user from /api/auth/me:', data);
            if (data && !data.error) {
              setUser(data);
              localStorage.setItem('ecoUser', JSON.stringify(data));
            } else {
              setUser(localUser);
            }
          } catch (err) {
            console.log('Error fetching user from /api/auth/me:', err);
            setUser(localUser);
          }
        } else {
          setUser(null);
        }
      }
    }
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  useEffect(() => {
    console.log('Navbar user state:', user);
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }
  }, [darkMode]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    setUser(null);
    handleMenuClose();
    router.push('/');
  };

  const navigationItems = [
    { text: 'Home', path: '/', icon: <Park /> },
    { text: 'CO2 Track', path: '/calculator', icon: <Calculate /> },
    { text: 'Green Delivery', path: '/delivery', icon: <LocalShipping /> },
    { text: 'Suppliers', path: '/suppliers', icon: <Recycling /> },
    { text: 'Bulk Analysis', path: '/bulk-analysis', icon: <TrendingUp /> },
    { text: 'Eco Advisor', path: '/chatbot', icon: <SmartToy /> },
  ];
  

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Park sx={{ color: 'primary.main' }} />
        <Typography variant="h6" color="primary.main">
          EcoRetail
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {user ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { router.push('/dashboard'); setMobileOpen(false); }}>
              <ListItemIcon><Dashboard /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><Logout /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { router.push('/login'); setMobileOpen(false); }}>
              <ListItemIcon><Login /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { router.push('/register'); setMobileOpen(false); }}>
              <ListItemIcon><HowToReg /></ListItemIcon>
              <ListItemText primary="Register" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
            }}
            onClick={() => router.push('/')}
          >
            <Park sx={{ color: 'primary.main' }} />
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
              EcoRetail
            </Typography>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation - centered */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={Link}
                href={item.path}
                sx={{
                  fontWeight: 'medium',
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Redeem Points Button */}
          <Tooltip title="Redeem Points">
            <Button
              color="primary"
              variant="contained"
              sx={{
                borderRadius: '50%',
                minWidth: 48,
                width: 48,
                height: 48,
                p: 0,
                mr: 1,
                boxShadow: 3,
                fontSize: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #2196f3 60%, #00e5ff 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1976d2 60%, #00b8d4 100%)' }
              }}
              onClick={() => router.push('/dashboard')}
              aria-label="Redeem Points"
            >
              <span role="img" aria-label="diamond">💎</span>
            </Button>
          </Tooltip>
          {/* Remove Theme Toggle Button */}
          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                {user.name && (
                  <Typography sx={{ fontWeight: 600, mr: 1 }}>
                    {user.name}
                  </Typography>
                )}
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{ p: 0 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/register')}
                  sx={{ bgcolor: '#2e7d32' }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile menu button - moved to the end */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ ml: 1, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Spacer to offset fixed navbar height */}
      <Toolbar />

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => { router.push('/dashboard'); handleMenuClose(); }}>
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <MenuItem onClick={() => { router.push('/profile'); handleMenuClose(); }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;