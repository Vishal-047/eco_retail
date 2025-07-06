import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Login
      </Typography>
      <Typography variant="body1">
        User authentication form will be implemented here.
      </Typography>
    </Container>
  );
};

export default LoginPage; 