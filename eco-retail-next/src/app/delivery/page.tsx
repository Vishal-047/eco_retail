"use client";
import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Stack,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  LocalShipping,
  DirectionsCar,
  DirectionsBike,
  ElectricCar,
  Park,
  Route,
  AccessTime,
  Straighten,
  TrendingDown,
  Lightbulb,
  ExpandMore,
  LocationOn,
  LocationOff,
  SwapHoriz
} from '@mui/icons-material';
import RouteMap from '@/components/RouteMap';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import GoogleMapsLoader from '@/components/GoogleMapsLoader';

interface RouteData {
  from: string;
  to: string;
  distance: string;
  duration: string;
  distanceValue: number;
  routePolyline?: string;
}

interface EmissionData {
  co2_kg: number;
  emission_breakdown: {
    fuel_consumption_l_per_100km: number;
    co2_per_liter: number;
    total_fuel_used_l: number;
  };
  eco_alternatives: Array<{
    vehicle: string;
    co2_kg: number;
    savings_percent: number;
  }>;
  sustainability_tips: string[];
}

interface DeliveryResult {
  route: RouteData;
  emissions: EmissionData;
  message: string;
}

function DeliveryPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeliveryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) {
      setError('Please enter both source and destination locations');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/delivery-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: from.trim(), to: to.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate route');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle.toLowerCase()) {
      case 'electric van':
      case 'ev van':
        return <ElectricCar />;
      case 'bicycle':
      case 'bike':
        return <DirectionsBike />;
      case 'electric car':
        return <ElectricCar />;
      default:
        return <LocalShipping />;
    }
  };

  const getEcoColor = (savings: number) => {
    if (savings >= 80) return 'success';
    if (savings >= 50) return 'warning';
    return 'info';
  };

  return (
    <Container maxWidth="lg" sx={{
      py: 4,
      minHeight: '100vh',
      backgroundImage: `url('https://www.transparenttextures.com/patterns/leaf.png')`,
      backgroundRepeat: 'repeat',
      backgroundSize: '300px 300px',
      backgroundColor: '#f5fbe7',
    }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        🌱 Green Delivery Optimizer
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Find the most efficient delivery route and reduce your carbon footprint
      </Typography>

      {/* Input Form */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center" justifyContent="center" wrap="wrap">
            <Grid item xs={12} md={4} lg={3}>
              <AddressAutocomplete
                label="From (Warehouse/Store)"
                value={from}
                onChange={setFrom}
                placeholder="e.g., Mumbai Central, Mumbai"
                color="primary"
                disabled={loading}
              />
            </Grid>
            <Grid item xs="auto">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  const temp = from;
                  setFrom(to);
                  setTo(temp);
                }}
                sx={{ minWidth: 0, p: 1.5, borderRadius: '50%' }}
                aria-label="Swap addresses"
                disabled={loading}
              >
                <SwapHoriz fontSize="medium" />
              </Button>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <AddressAutocomplete
                label="To (Customer Address)"
                value={to}
                onChange={setTo}
                placeholder="e.g., Bandra West, Mumbai"
                color="secondary"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={2}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ height: 56, whiteSpace: 'nowrap' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Calculate Route'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Results Display */}
      {result && (
        <Grid container spacing={3} alignItems="stretch" justifyContent="center" sx={{ mt: 2 }}>
          {/* Route Details */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Route sx={{ mr: 1 }} />
                  Route Details
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      From
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {result.route.from}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      To
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {result.route.to}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Straighten sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      Distance: <strong>{result.route.distance}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      Duration: <strong>{result.route.duration}</strong>
                    </Typography>
                  </Box>
                </Stack>
                <Alert severity="success" sx={{ mt: 2 }}>
                  {result.message}
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          {/* Carbon Footprint */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Park sx={{ mr: 1 }} />
                  Carbon Footprint
                </Typography>
                <Box sx={{ textAlign: 'center', my: 3 }}>
                  <Typography variant="h3" color="error.main" sx={{ fontWeight: 'bold' }}>
                    {result.emissions.co2_kg.toFixed(1)} kg CO₂
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Route (Petrol Van)
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Eco-Friendly Alternatives
                </Typography>
                <Stack spacing={2}>
                  {result.emissions.eco_alternatives.map((alternative, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getVehicleIcon(alternative.vehicle)}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {alternative.vehicle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {alternative.co2_kg.toFixed(1)} kg CO₂
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={`${alternative.savings_percent}% savings`}
                        color={getEcoColor(alternative.savings_percent) as any}
                        size="small"
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Route Visualization (Map) */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'stretch', p: 2 }}>
              <RouteMap
                from={result.route.from}
                to={result.route.to}
                routePolyline={result.route.routePolyline}
                distance={result.route.distance}
                duration={result.route.duration}
              />
            </Card>
          </Grid>

          {/* Sustainability Tips (full width below) */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lightbulb sx={{ mr: 1 }} />
                  Sustainability Tips
                </Typography>
                <Grid container spacing={2}>
                  {result.emissions.sustainability_tips.map((tip, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          border: 1,
                          borderColor: 'success.light',
                          borderRadius: 1,
                          backgroundColor: 'success.50'
                        }}
                      >
                        <Typography variant="body1">
                          {tip}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Emission Breakdown (full width below) */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingDown sx={{ mr: 1 }} />
                  Detailed Emission Breakdown
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          Fuel Consumption
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {result.emissions.emission_breakdown.fuel_consumption_l_per_100km} L/100km
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Average consumption rate
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          CO₂ per Liter
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {result.emissions.emission_breakdown.co2_per_liter} kg/L
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Emission factor
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          Total Fuel Used
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {result.emissions.emission_breakdown.total_fuel_used_l.toFixed(2)} L
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          For this route
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      )}

      {/* Instructions */}
      {!result && !loading && (
        <Paper elevation={1} sx={{ p: 3, mt: 4, backgroundColor: 'info.50' }}>
          <Typography variant="h6" gutterBottom>
            How to use the Green Delivery Optimizer:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <LocationOn color="primary" />
              </ListItemIcon>
              <ListItemText primary="Enter your warehouse or store location in the 'From' field" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationOff color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Enter your customer's delivery address in the 'To' field" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Route color="primary" />
              </ListItemIcon>
              <ListItemText primary="Click 'Calculate Route' to get the optimal delivery path" />
            </ListItem>
            <ListItem>
                          <ListItemIcon>
              <Park color="success" />
            </ListItemIcon>
              <ListItemText primary="View CO₂ emissions and eco-friendly alternatives" />
            </ListItem>
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default function DeliveryPageWrapper() {
  return (
    <GoogleMapsLoader>
      <DeliveryPage />
    </GoogleMapsLoader>
  );
} 