import { Container, Typography } from '@mui/material';

export default function RegisterPage() {
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
} 