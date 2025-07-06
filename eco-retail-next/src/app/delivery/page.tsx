import { Container, Typography } from '@mui/material';

export default function DeliveryPage() {
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
} 