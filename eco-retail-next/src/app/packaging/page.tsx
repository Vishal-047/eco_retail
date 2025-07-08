"use client";
import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, CircularProgress, Paper, Alert, Chip, Stack, Checkbox, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableHead, TableRow, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function PackagingPage() {
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compare, setCompare] = useState<number[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const handleCompareToggle = (idx: number) => {
    setCompare((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : prev.length < 3 ? [...prev, idx] : prev
    );
  };

  const handleCompareOpen = () => setCompareOpen(true);
  const handleCompareClose = () => setCompareOpen(false);

  const handleLanguage = (_: any, newLang: 'en' | 'hi' | null) => {
    if (newLang) setLanguage(newLang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    setCompare([]);
    try {
      const res = await fetch('/api/packaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productName, language })
      });
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      const data = await res.json();
      setResults(data.suggestions);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Mock cost/weight for demo
  const getCost = (idx: number) => [1.2, 1.5, 1.1][idx] || 1.0;
  const getWeight = (idx: number) => [50, 30, 20][idx] || 25;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Smart Packaging Selector
      </Typography>
      <Typography variant="body1" gutterBottom>
        Get AI-powered recommendations for eco-friendly packaging materials based on your product.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ToggleButtonGroup
          value={language}
          exclusive
          onChange={handleLanguage}
          size="small"
          color="primary"
        >
          <ToggleButton value="en">English</ToggleButton>
          <ToggleButton value="hi">हिन्दी</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 4 }}>
        <TextField
          label="Product Name or Description"
          variant="outlined"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          disabled={loading || !productName.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Get Packaging Suggestions'}
        </Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {/* Results Section */}
      {results && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Packaging Suggestions</Typography>
          <Stack spacing={3}>
            {results.map((option, idx) => (
              <Paper key={idx} elevation={3} sx={{ p: 3, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <Checkbox
                    checked={compare.includes(idx)}
                    onChange={() => handleCompareToggle(idx)}
                    color="primary"
                    inputProps={{ 'aria-label': 'Compare option' }}
                  />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">{option.material}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>{option.reason}</Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 1, flexWrap: 'wrap' }}>
                  <Chip label={`CO₂: ${option.co2}`} color="default" />
                  <Chip label={`Recyclability: ${option.recyclability}/5`} color="success" />
                  {Array.isArray(option.ecoLabels)
                    ? option.ecoLabels.map((label: string, i: number) => (
                        <Chip key={i} label={label} color="primary" variant="outlined" />
                      ))
                    : typeof option.ecoLabels === 'string'
                      ? option.ecoLabels.split(',').map((label: string, i: number) => (
                          <Chip key={i} label={label.trim()} color="primary" variant="outlined" />
                        ))
                      : null
                  }
                </Stack>
                <Typography variant="caption" color="text.secondary">Tip: {option.tips}</Typography>
              </Paper>
            ))}
          </Stack>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={compare.length < 2}
            onClick={handleCompareOpen}
          >
            Compare Selected
          </Button>
          <Dialog open={compareOpen} onClose={handleCompareClose} maxWidth="md" fullWidth>
            <DialogTitle>
              Compare Packaging Options
              <IconButton
                aria-label="close"
                onClick={handleCompareClose}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Feature</TableCell>
                    {compare.map((idx) => (
                      <TableCell key={idx}>{results[idx].material}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>CO₂ Footprint</TableCell>
                    {compare.map((idx) => (
                      <TableCell key={idx}>{results[idx].co2}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Recyclability</TableCell>
                    {compare.map((idx) => (
                      <TableCell key={idx}>{results[idx].recyclability}/5</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Eco-labels</TableCell>
                    {compare.map((idx) => (
                      <TableCell key={idx}>
                        {Array.isArray(results[idx].ecoLabels)
                          ? results[idx].ecoLabels.join(', ')
                          : typeof results[idx].ecoLabels === 'string'
                            ? results[idx].ecoLabels
                            : ''
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Cost (USD/unit)</TableCell>
                    {compare.map((idx) => (
                      <TableCell key={idx}>${getCost(idx).toFixed(2)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Weight (g/unit)</TableCell>
                    {compare.map((idx) => (
                      <TableCell key={idx}>{getWeight(idx)}g</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Green Tip</TableCell>
                    {compare.map((idx) => (
                      <TableCell key={idx}>{results[idx].tips}</TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        </Box>
      )}
    </Container>
  );
} 