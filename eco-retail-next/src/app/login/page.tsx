import { Container, Typography } from '@mui/material';

export default function LoginPage() {
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
} 