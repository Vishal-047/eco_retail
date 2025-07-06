import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PackagingPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Smart Packaging Selector
      </Typography>
      <Typography variant="body1">
        Packaging recommendations and emission calculations will be implemented here.
      </Typography>
    </Container>
  );
};

export default PackagingPage; 