import { Container, Typography, Box } from '@mui/material';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Product Details for ID: {params.id}
      </Typography>
      <Typography variant="body1">
        Detailed product information with emission breakdown and sustainability metrics will be displayed here.
      </Typography>
    </Container>
  );
} 