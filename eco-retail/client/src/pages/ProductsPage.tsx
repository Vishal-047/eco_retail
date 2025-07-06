import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import { Park, ShoppingCart } from '@mui/icons-material';

const ProductsPage: React.FC = () => {
  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: 'Organic Cotton T-Shirt',
      brand: 'EcoWear',
      price: 29.99,
      greenScore: 85,
      emissions: 0.8,
      category: 'clothing',
      image: 'https://via.placeholder.com/300x200/4caf50/ffffff?text=Organic+T-Shirt',
    },
    {
      id: 2,
      name: 'Bamboo Water Bottle',
      brand: 'GreenLife',
      price: 24.99,
      greenScore: 92,
      emissions: 0.3,
      category: 'home',
      image: 'https://via.placeholder.com/300x200/4caf50/ffffff?text=Bamboo+Bottle',
    },
    {
      id: 3,
      name: 'Solar Power Bank',
      brand: 'SunTech',
      price: 49.99,
      greenScore: 78,
      emissions: 1.2,
      category: 'electronics',
      image: 'https://via.placeholder.com/300x200/4caf50/ffffff?text=Solar+Bank',
    },
    {
      id: 4,
      name: 'Recycled Paper Notebook',
      brand: 'EcoPaper',
      price: 12.99,
      greenScore: 95,
      emissions: 0.1,
      category: 'books',
      image: 'https://via.placeholder.com/300x200/4caf50/ffffff?text=Recycled+Notebook',
    },
  ];

  const getGreenScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Sustainable Products
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Discover eco-friendly products with transparent carbon emission data and green scores.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {mockProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.brand}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={<Park />}
                    label={`Green Score: ${product.greenScore}`}
                    color={getGreenScoreColor(product.greenScore) as any}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`${product.emissions} kg CO₂`}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Typography variant="h6" color="primary" gutterBottom>
                  ${product.price}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  sx={{ mt: 'auto' }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductsPage; 