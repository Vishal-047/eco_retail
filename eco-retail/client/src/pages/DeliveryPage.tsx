import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const DeliveryPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Green Delivery Optimizer
      </Typography>
      <Typography variant="body1">
        Delivery mode selection with emission calculations and recommendations will be implemented here.
      </Typography>
    </Container>
  );
};

export default DeliveryPage; 