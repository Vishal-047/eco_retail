import { Container, Typography } from '@mui/material';

export default function DashboardPage() {
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
} 