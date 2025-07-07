"use client";
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Stack,
  Fab,
  Drawer,
  Tooltip,
} from '@mui/material';
import {
  Park,
  LocalShipping,
  Recycling,
  TrendingUp,
  Visibility,
  Star,
  Park as EcoIcon,
} from '@mui/icons-material';
import ChatbotWidget from '../components/ChatbotWidget';
import Link from 'next/link';

// Removed: import { useRouter } from 'next/navigation'; - This was causing the error.

export default function App() {
  // This environment doesn't support Next.js routing, so we'll use placeholder actions.
  // const router = useRouter(); // Removed this line.
  const [chatOpen, setChatOpen] = useState(false);

  const features = [
    {
      icon: <Park sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Carbon Emission Tracking',
      description: 'Track CO₂ emissions for every product and make informed sustainable choices.',
      action: undefined,
      actionText: 'View Products',
      color: '#2e7d32',
      href: '/products',
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Green Delivery Options',
      description: 'Choose from bike, electric vehicle, or petrol delivery with emission preview.',
      action: () => console.log('Navigate to /delivery'),
      actionText: 'Calculate Delivery',
      color: '#1976d2',
    },
    {
      icon: <Recycling sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Packaging',
      description: 'Get recommendations for eco-friendly packaging materials.',
      action: () => console.log('Navigate to /packaging'),
      actionText: 'Explore Packaging',
      color: '#388e3c',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Green Score System',
      description: 'Rate products based on sustainability factors and environmental impact.',
      action: () => console.log('Navigate to /products'),
      actionText: 'See Scores',
      color: '#4caf50',
    },
    {
      icon: <Visibility sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Transparent Analytics',
      description: 'Real-time dashboards showing your carbon footprint and sustainability metrics.',
      action: () => console.log('Navigate to /dashboard'),
      actionText: 'View Dashboard',
      color: '#ff9800',
    },
    {
      icon: <Star sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Green Points Rewards',
      description: 'Earn points for sustainable choices and unlock eco-friendly badges.',
      action: () => console.log('Navigate to /dashboard'),
      actionText: 'Earn Points',
      color: '#f57c00',
    },
  ];

  const stats = [
    { label: 'CO₂ Saved', value: '2,450 kg', color: 'success.main' },
    { label: 'Green Products', value: '1,200+', color: 'primary.main' },
    { label: 'Happy Customers', value: '5,000+', color: 'secondary.main' },
    { label: 'Trees Planted', value: '150', color: 'success.main' },
  ];

  // Placeholder function for navigation buttons outside the features array
  const handleNavigation = (path) => {
    console.log(`Would navigate to: ${path}`);
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          background: 'linear-gradient(90deg, #388e3c 0%, #43a047 100%)',
          py: { xs: 6, md: 10 },
          px: { xs: 2, md: 0 },
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', minHeight: 400 }}>
            {/* Left: Headline, subheadline, buttons */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'white', mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
                Shop Smart, Save the Planet
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', mb: 4, maxWidth: 600 }}>
                Track carbon emissions, choose sustainable products, and make eco-friendly shopping decisions with our comprehensive platform.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ bgcolor: 'white', color: '#388e3c', fontWeight: 'bold', boxShadow: 2, '&:hover': { bgcolor: '#e0f2f1' } }}
                  onClick={() => handleNavigation('/products')}
                >
                  Explore Products
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#e0f2f1', color: '#388e3c', borderColor: '#388e3c' } }}
                  onClick={() => handleNavigation('/calculator')}
                >
                  Calculate Emissions
                </Button>
              </Box>
            </Box>
            {/* Right: EcoRetail Card */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, mt: { xs: 6, md: 0 } }}>
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.10)',
                p: { xs: 4, md: 8 },
                borderRadius: 3,
                minWidth: { xs: 250, md: 400 },
                minHeight: { xs: 180, md: 280 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 2,
              }}>
                <Box sx={{ fontSize: 56, mb: 2 }}>🌱</Box>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  EcoRetail
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={3} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', py: 2, borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h4" component="div" sx={{ color: stat.color, fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#f7f7f7', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ color: '#388e3c', fontWeight: 'bold', mb: 2 }}>
            Why Choose EcoRetail?
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Comprehensive sustainability tracking and eco-friendly shopping solutions
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <Box key={index} sx={{ height: '100%' }}>
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    boxShadow: 2,
                    borderRadius: 3,
                    py: 4,
                    px: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {feature.description}
                  </Typography>
                  {feature.href ? (
                    <Button
                      component={Link}
                      href={feature.href}
                      variant="outlined"
                      size="medium"
                      sx={{
                        borderColor: feature.color,
                        color: feature.color,
                        fontWeight: 'bold',
                        '&:hover': {
                          borderColor: feature.color,
                          backgroundColor: `${feature.color}10`,
                        },
                      }}
                    >
                      {feature.actionText}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={feature.action}
                      sx={{
                        borderColor: feature.color,
                        color: feature.color,
                        fontWeight: 'bold',
                        '&:hover': {
                          borderColor: feature.color,
                          backgroundColor: `${feature.color}10`,
                        },
                      }}
                    >
                      {feature.actionText}
                    </Button>
                  )}
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Paper sx={{ py: 6, mb: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', color: '#388e3c' }}>
            How It Works
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
              gap: 4,
              alignItems: 'start',
              mt: 2,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                1
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Browse Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore our catalog of products with detailed emission data and green scores.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                2
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Choose Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select eco-friendly delivery options and see real-time emission calculations.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                3
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Track Impact
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor your carbon footprint and earn green points for sustainable choices.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ my: 6 }}>
        <Card sx={{ textAlign: 'center', py: 4, borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ready to Shop Sustainably?
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Join thousands of eco-conscious shoppers making a difference.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => handleNavigation('/register')}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => handleNavigation('/products')}
              >
                Browse Products
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      {/* Floating Chatbot FAB */}
      <Tooltip title="Chat with EcoBot!" arrow>
        <Fab
          color="success"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 2000,
            boxShadow: 6,
            width: 64,
            height: 64
          }}
          onClick={() => setChatOpen(true)}
        >
          <EcoIcon sx={{ fontSize: 36 }} />
        </Fab>
      </Tooltip>

      {/* Chatbot Drawer */}
      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 520 },
            maxWidth: '100vw',
            boxShadow: 8,
            borderTopLeftRadius: 3,
            borderBottomLeftRadius: 3,
            overflow: 'visible',
            background: 'transparent'
          }
        }}
      >
        <Box sx={{ position: 'relative', height: '100%', bgcolor: 'transparent' }}>
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
            <Fab size="small" color="error" onClick={() => setChatOpen(false)}>
              ×
            </Fab>
          </Box>
          <Box sx={{ pt: 6, px: 0, height: '100%' }}>
            <ChatbotWidget minimal={true} />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
