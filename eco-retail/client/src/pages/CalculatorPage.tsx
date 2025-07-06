import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const CalculatorPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Carbon Calculator
      </Typography>
      <Typography variant="body1">
        Interactive carbon emission calculator for products and delivery will be implemented here.
      </Typography>
    </Container>
  );
};

export default CalculatorPage; 