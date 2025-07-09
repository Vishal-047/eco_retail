"use client";
import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, CircularProgress, Stack, Alert } from '@mui/material';
import { Nature, LocalShipping, Inventory, Store } from '@mui/icons-material';

export default function CalculatorPage() {
  const [product, setProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product })
      });
      if (!res.ok) throw new Error('Failed to fetch emissions');
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!results) return;
    setTipsLoading(true);
    setTipsError(null);
    fetch(`/api/sustainability-tips?product=${encodeURIComponent(product)}`)
      .then(res => res.json())
      .then(data => {
        setTips(data.tips || []);
        setRoadmap(data.roadmap || []);
        setTipsLoading(false);
      })
      .catch(err => {
        setTipsError('Failed to load tips');
        setTipsLoading(false);
      });
  }, [results]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Product Emission Calculator
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter a product to estimate its CO₂ emissions for manufacturing, packaging, and shipping.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 4 }}>
        <TextField
          label="Product Name"
          variant="outlined"
          fullWidth
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          disabled={loading || !product.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Calculate Emissions'}
        </Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {results && (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6">Emission Breakdown</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            All values are per kg of product
          </Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography>Manufacturing: <b>{results.manufacturing} kg CO₂</b></Typography>
            <Typography>Packaging: <b>{results.packaging} kg CO₂</b></Typography>
            <Typography>Shipping: <b>{results.shipping} kg CO₂</b></Typography>
            <Typography>Total: <b>{results.total} kg CO₂</b></Typography>
          </Stack>
        </Paper>
      )}
      {results && (
        <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>AI Sustainability Tips</Typography>
          {tipsLoading && <Typography>Loading tips...</Typography>}
          {tipsError && <Typography color="error">{tipsError}</Typography>}
          {!tipsLoading && !tipsError && tips.length > 0 && (
            <ul style={{ fontSize: '1.1rem', color: '#333', paddingLeft: 24 }}>
              {tips.map((tip, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  {i === 0 && <Nature sx={{ color: '#388e3c', mr: 1 }} />}
                  {i === 1 && <Inventory sx={{ color: '#388e3c', mr: 1 }} />}
                  {i === 2 && <LocalShipping sx={{ color: '#388e3c', mr: 1 }} />}
                  {i === 3 && <Store sx={{ color: '#388e3c', mr: 1 }} />}
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}
          <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>Sustainability Roadmap</Typography>
          {!tipsLoading && !tipsError && roadmap.length > 0 && (
            <ol style={{ fontSize: '1rem', color: '#333', paddingLeft: 24 }}>
              {roadmap.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          )}
        </Paper>
      )}
    </Container>
  );
} 