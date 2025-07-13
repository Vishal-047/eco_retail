"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardContent, Chip, Button, CircularProgress } from "@mui/material";
import Link from "next/link";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/expiry-deals")
      .then(res => res.json())
      .then(data => {
        const found = (data.deals || []).find((p: any) => String(p.barcode) === String(id));
        setProduct(found || null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Product not found</Typography>
      </Container>
    );
  }

  const daysLeft = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  let badgeColor: 'success' | 'warning' | 'error' = 'success';
  if (daysLeft <= 3) badgeColor = 'error';
  else if (daysLeft <= 7) badgeColor = 'warning';
  const discountedPrice = product.discountPercent
    ? (product.originalPrice * (1 - product.discountPercent / 100)).toFixed(2)
    : product.originalPrice;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ p: 2, border: daysLeft <= 3 ? '2px solid #d32f2f' : undefined }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {product.image && (
              <img src={product.image} alt={product.name} style={{ width: 100, height: 70, objectFit: 'cover', marginRight: 24, borderRadius: 8 }} />
            )}
            <Box>
              <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">Barcode: {product.barcode}</Typography>
            </Box>
            <Chip
              label={daysLeft > 0 ? `${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left!` : 'Expired'}
              color={badgeColor}
              sx={{ ml: 'auto', fontWeight: 'bold', fontSize: 16 }}
            />
          </Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <s>₹{product.originalPrice}</s> <b style={{ color: '#388e3c', fontSize: 22 }}>₹{discountedPrice}</b>
            {product.discountPercent ? (
              <span style={{ marginLeft: 12, color: '#d32f2f', fontWeight: 'bold' }}>-{product.discountPercent}%</span>
            ) : null}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Expiry Date: {new Date(product.expiryDate).toLocaleDateString()} ({daysLeft > 0 ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left` : 'Expired'})
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <b>Why discounted?</b> To reduce waste, this product is nearing its expiry date. Buying soon helps sustainability!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={daysLeft <= 0}
            sx={{ mt: 2 }}
            // onClick={...} // Add to cart logic placeholder
          >
            {daysLeft > 0 ? 'Add Discounted to Cart' : 'Expired'}
          </Button>
          <Button
            component={Link}
            href="/expiry-deals"
            variant="text"
            sx={{ ml: 2 }}
          >
            Back to Deals
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
} 