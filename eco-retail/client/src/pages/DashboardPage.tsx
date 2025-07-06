import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        User dashboard with carbon footprint tracking, green points, and sustainability metrics will be displayed here.
      </Typography>
    </Container>
  );
};

export default DashboardPage; 