import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Register
      </Typography>
      <Typography variant="body1">
        User registration form will be implemented here.
      </Typography>
    </Container>
  );
};

export default RegisterPage; 