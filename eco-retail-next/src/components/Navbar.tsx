"use client";
import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Mock user state - in real app, this would come from context/state management
  const [user, setUser] = useState<null | { username: string; greenPoints: number }>(null);

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
    { text: 'Products', path: '/products', icon: <ShoppingCart /> },
    { text: 'Calculator', path: '/calculator', icon: <Calculate /> },
    { text: 'Delivery', path: '/delivery', icon: <LocalShipping /> },
    { text: 'Packaging', path: '/packaging', icon: <Recycling /> },
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

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                <Chip
                  label={`${user.greenPoints} pts`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
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