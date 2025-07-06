import { Container, Typography } from '@mui/material';

export default function PackagingPage() {
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
} 