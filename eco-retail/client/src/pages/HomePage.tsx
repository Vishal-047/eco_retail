import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import {
  Park,
  LocalShipping,
  Recycling,
  TrendingUp,
  Visibility,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Park sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Carbon Emission Tracking',
      description: 'Track CO₂ emissions for every product and make informed sustainable choices.',
      action: () => navigate('/products'),
      actionText: 'View Products',
      color: '#2e7d32',
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Green Delivery Options',
      description: 'Choose from bike, electric vehicle, or petrol delivery with emission preview.',
      action: () => navigate('/delivery'),
      actionText: 'Calculate Delivery',
      color: '#1976d2',
    },
    {
      icon: <Recycling sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Packaging',
      description: 'Get recommendations for eco-friendly packaging materials.',
      action: () => navigate('/packaging'),
      actionText: 'Explore Packaging',
      color: '#388e3c',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Green Score System',
      description: 'Rate products based on sustainability factors and environmental impact.',
      action: () => navigate('/products'),
      actionText: 'See Scores',
      color: '#4caf50',
    },
    {
      icon: <Visibility sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Transparent Analytics',
      description: 'Real-time dashboards showing your carbon footprint and sustainability metrics.',
      action: () => navigate('/dashboard'),
      actionText: 'View Dashboard',
      color: '#ff9800',
    },
    {
      icon: <Star sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Green Points Rewards',
      description: 'Earn points for sustainable choices and unlock eco-friendly badges.',
      action: () => navigate('/dashboard'),
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

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'white' }}>
                Shop Smart, Save the Planet
              </Typography>
              <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
                Track carbon emissions, choose sustainable products, and make eco-friendly shopping decisions with our comprehensive platform.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  Explore Products
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/calculator')}
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Calculate Emissions
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 300,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" sx={{ textAlign: 'center' }}>
                  🌱 EcoRetail
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', py: 2 }}>
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
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose EcoRetail?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" paragraph>
          Comprehensive sustainability tracking and eco-friendly shopping solutions
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4,
                    borderLeft: `4px solid ${feature.color}`,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {feature.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={feature.action}
                    sx={{
                      borderColor: feature.color,
                      color: feature.color,
                      '&:hover': {
                        borderColor: feature.color,
                        backgroundColor: `${feature.color}10`,
                      }
                    }}
                  >
                    {feature.actionText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Paper sx={{ py: 6, mb: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            How It Works
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
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
                <Typography variant="h6" gutterBottom>
                  Browse Products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore our catalog of products with detailed emission data and green scores.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
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
                <Typography variant="h6" gutterBottom>
                  Choose Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select eco-friendly delivery options and see real-time emission calculations.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
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
                <Typography variant="h6" gutterBottom>
                  Track Impact
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor your carbon footprint and earn green points for sustainable choices.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* CO₂ Calculator Section */}
      <Paper sx={{ py: 6, mb: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                Calculate Your Carbon Footprint
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Use our advanced CO₂ calculator to understand the environmental impact of your shopping choices and delivery preferences.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/calculator')}
                  startIcon={<TrendingUp />}
                >
                  Try Calculator
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/delivery')}
                >
                  Delivery Impact
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, bgcolor: 'white' }}>
                <Typography variant="h6" gutterBottom>
                  Quick Emission Preview
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Average CO₂ emissions per delivery method:
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">🚴 Bike Delivery</Typography>
                    <Chip label="0 kg CO₂" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">⚡ Electric Vehicle</Typography>
                    <Chip label="0.5 kg CO₂" color="primary" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">🚗 Petrol Vehicle</Typography>
                    <Chip label="2.1 kg CO₂" color="warning" size="small" />
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: 6 }}>
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Shop Sustainably?
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Join thousands of eco-conscious shoppers making a difference.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/products')}
              >
                Browse Products
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default HomePage; 