"use client";
import { useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Autocomplete, TextField, CircularProgress } from '@mui/material';
import React from 'react'; // Added missing import

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products on mount
  React.useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setAllProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Product Comparison
      </Typography>
      <Typography variant="body1" gutterBottom>
        Select products to compare their emissions, packaging, and delivery options.
      </Typography>
      <Autocomplete
        multiple
        options={allProducts}
        getOptionLabel={(option) => option.name}
        value={selectedProducts}
        onChange={(_, value) => setSelectedProducts(value)}
        renderInput={(params) => <TextField {...params} label="Select Products" variant="outlined" />}
        sx={{ mb: 3, maxWidth: 600 }}
        loading={loading}
      />
      {error && <Typography color="error">{error}</Typography>}
      {selectedProducts.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Feature</TableCell>
                {selectedProducts.map((prod, idx) => (
                  <TableCell key={idx}>{prod.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Manufacturing Emissions</TableCell>
                {selectedProducts.map((prod, idx) => (
                  <TableCell key={idx}>{prod.emissions?.manufacturing ?? '-'}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Packaging Emissions</TableCell>
                {selectedProducts.map((prod, idx) => (
                  <TableCell key={idx}>{prod.emissions?.packaging ?? '-'}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Shipping Emissions</TableCell>
                {selectedProducts.map((prod, idx) => (
                  <TableCell key={idx}>{prod.emissions?.shipping ?? '-'}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Total Emissions</TableCell>
                {selectedProducts.map((prod, idx) => (
                  <TableCell key={idx}>{prod.emissions?.total ?? '-'}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Packaging Type</TableCell>
                {selectedProducts.map((prod, idx) => (
                  <TableCell key={idx}>{prod.packaging ?? '-'}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Delivery Options</TableCell>
                {selectedProducts.map((prod, idx) => (
                  <TableCell key={idx}>{prod.deliveryOptions?.join(', ') ?? '-'}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
} 