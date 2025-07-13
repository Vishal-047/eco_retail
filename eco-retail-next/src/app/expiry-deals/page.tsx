"use client";
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';

export default function ExpiryDealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = true; // TODO: Replace with real admin check

  useEffect(() => {
    setLoading(true);
    fetch('/api/expiry-deals')
      .then(res => res.json())
      .then(data => {
        setDeals(data.deals || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load expiry deals.');
        setLoading(false);
      });
  }, []);

  // Find soon expiring products for notification
  const soonExpiring = deals.filter(p => {
    const daysLeft = Math.ceil((new Date(p.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 && daysLeft <= 3;
  });

  return (
    <Box sx={{ mt: 8, mb: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Expiry Smart Deals
        </Typography>
        {isAdmin && (
          <Box sx={{ mb: 2, textAlign: 'right' }}>
            <Button component={Link} href="/admin/expiry-deals" variant="outlined" color="secondary">
              Admin: Manage Expiry Deals
            </Button>
          </Box>
        )}
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : deals.length === 0 ? (
          <Typography>No expiry deals available.</Typography>
        ) : (
          <Grid container spacing={3}>
            {deals
              .filter(p => p.expiryDate)
              .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
              .map(product => {
                const daysLeft = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                let badgeColor = 'success';
                let badgeBg = '#43a047';
                if (daysLeft <= 3) { badgeColor = 'error'; badgeBg = '#d32f2f'; }
                else if (daysLeft <= 7) { badgeColor = 'warning'; badgeBg = '#ff9800'; }
                const discountedPrice = product.discountPercent
                  ? (product.originalPrice * (1 - product.discountPercent / 100)).toFixed(2)
                  : product.originalPrice;
                return (
                  <Grid item xs={12} sm={6} md={4} key={product.barcode}>
                    <Card
                      sx={{
                        position: 'relative',
                        border: daysLeft <= 3 ? '2px solid #d32f2f' : '1px solid #e0e0e0',
                        borderRadius: 3,
                        boxShadow: 3,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.03)',
                          boxShadow: 6,
                        },
                        minHeight: 220,
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <CardContent sx={{ pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1, position: 'relative' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            {product.image && (
                              <img src={product.image} alt={product.name} style={{ width: 60, height: 40, objectFit: 'cover', marginRight: 12, borderRadius: 6 }} />
                            )}
                            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>{product.name}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                            <s>₹{product.originalPrice}</s>
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#388e3c', fontWeight: 700 }}>
                            ₹{discountedPrice}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {/* Removed days left/expired text */}
                        </Typography>
                        <Button
                          component={Link}
                          href={`/products/${product.barcode}`}
                          variant="contained"
                          size="medium"
                          sx={{
                            bgcolor: '#388e3c',
                            color: '#fff',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            boxShadow: 2,
                            mt: 1,
                            '&:hover': { bgcolor: '#2e7d32' },
                          }}
                          fullWidth
                        >
                          View Deal
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        )}
      </Container>
    </Box>
  );
} 