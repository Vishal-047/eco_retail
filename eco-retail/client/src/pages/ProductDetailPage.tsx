import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProductDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Product Details
      </Typography>
      <Typography variant="body1">
        Detailed product information with emission breakdown and sustainability metrics will be displayed here.
      </Typography>
    </Container>
  );
};

export default ProductDetailPage; 