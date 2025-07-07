"use client";
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Park, ShoppingCart, Verified, Category, CheckCircle, InfoOutlined } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { products as sharedProducts } from '../../data/products';

export default function ProductsPage() {
  // Remove local mockProducts and use sharedProducts
  const mockProducts = sharedProducts;

  const [compareSelection, setCompareSelection] = useState<any[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [emissionFilter, setEmissionFilter] = useState('All');
  const [sortOption, setSortOption] = useState('emissions-asc');

  const categories = ['All', ...Array.from(new Set(mockProducts.map(p => p.category)))];
  const emissionLevels = ['All', 'Low', 'Moderate', 'High'];

  let filteredProducts = mockProducts.filter((p) =>
    (categoryFilter === 'All' || p.category === categoryFilter) &&
    (emissionFilter === 'All' || p.emissionLevel === emissionFilter)
  );

  if (sortOption === 'emissions-asc') {
    filteredProducts = filteredProducts.sort((a, b) => a.emissions - b.emissions);
  } else if (sortOption === 'emissions-desc') {
    filteredProducts = filteredProducts.sort((a, b) => b.emissions - a.emissions);
  } else if (sortOption === 'green-desc') {
    filteredProducts = filteredProducts.sort((a, b) => b.greenScore - a.greenScore);
  } else if (sortOption === 'green-asc') {
    filteredProducts = filteredProducts.sort((a, b) => a.greenScore - b.greenScore);
  }

  const handleCompareClick = (product: any) => {
    if (compareSelection.length === 2) return;
    if (!compareSelection.find((p) => p.id === product.id)) {
      setCompareSelection((prev) => [...prev, product]);
    }
  };

  const handleRemoveCompare = (id: number) => {
    setCompareSelection((prev) => prev.filter((p) => p.id !== id));
  };

  const handleShowCompare = () => {
    if (compareSelection.length === 2) setShowCompare(true);
  };

  const handleCloseCompare = () => {
    setShowCompare(false);
    setCompareSelection([]);
  };

  const getGreenScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getEmissionLevelColor = (level: string) => {
    if (level === 'Low') return 'info'; // blue
    if (level === 'Moderate') return 'warning'; // yellow
    return 'error'; // red
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Sustainable Products
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Discover eco-friendly products with transparent carbon emission data and green scores.
        </Typography>
        {/* Filter and Sort Controls */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Category</InputLabel>
            <Select value={categoryFilter} label="Category" onChange={e => setCategoryFilter(e.target.value)}>
              {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Emission Level</InputLabel>
            <Select value={emissionFilter} label="Emission Level" onChange={e => setEmissionFilter(e.target.value)}>
              {emissionLevels.map(level => <MenuItem key={level} value={level}>{level}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortOption} label="Sort By" onChange={e => setSortOption(e.target.value)}>
              <MenuItem value="emissions-asc">Lowest Emissions</MenuItem>
              <MenuItem value="emissions-desc">Highest Emissions</MenuItem>
              <MenuItem value="green-desc">Most Eco-Friendly</MenuItem>
              <MenuItem value="green-asc">Least Eco-Friendly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.brand}
                </Typography>
                
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    icon={<Park />}
                    label={`Green Score: ${product.greenScore}`}
                    color={getGreenScoreColor(product.greenScore) as any}
                    size="small"
                  />
                  <Chip
                    icon={product.emissionLevel === 'Low' ? <Park color="success" /> : <Park />}
                    label={`${product.emissions} kg CO₂`}
                    color={getEmissionLevelColor(product.emissionLevel) as any}
                    size="small"
                  />
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Emission Breakdown</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span role="img" aria-label="factory">🏭</span>
                          <Typography variant="body2">Manufacturing: {product.breakdown?.manufacturing ?? '-'} kg</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span role="img" aria-label="truck">🚛</span>
                          <Typography variant="body2">Transport: {product.breakdown?.transport ?? '-'} kg</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span role="img" aria-label="box">📦</span>
                          <Typography variant="body2">Packaging: {product.breakdown?.packaging ?? '-'} kg</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <b>Total: {product.emissions} kg CO₂</b>
                        </Box>
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <InfoOutlined sx={{ color: 'success.main', fontSize: 20, cursor: 'pointer', ml: 0.5, verticalAlign: 'middle' }} />
                  </Tooltip>
                  <Chip
                    icon={<Category />}
                    label={product.category}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={product.emissionLevel}
                    color={getEmissionLevelColor(product.emissionLevel) as any}
                    size="small"
                  />
                  {product.ecoCertified && (
                    <Chip
                      icon={<Verified sx={{ color: 'success.main' }} />}
                      label="Eco-Certified"
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
                {/* Emission Score Progress Bar */}
                <Box sx={{ width: '100%', mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.max(0, Math.min(100, 100 - product.emissions * 20))}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor:
                          product.emissionLevel === 'Low'
                            ? '#2196f3'
                            : product.emissionLevel === 'Moderate'
                            ? '#ffb300'
                            : '#e53935',
                      },
                    }}
                  />
                </Box>
                {/* Radar chart placeholder for future advanced visualization */}

                <Typography variant="h6" color="primary" gutterBottom>
                  ${product.price}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  sx={{ mt: 'auto', mb: 1 }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant={compareSelection.find((p) => p.id === product.id) ? 'outlined' : 'text'}
                  color="info"
                  sx={{ mb: 1 }}
                  disabled={compareSelection.length === 2 && !compareSelection.find((p) => p.id === product.id)}
                  onClick={() => handleCompareClick(product)}
                >
                  {compareSelection.find((p) => p.id === product.id) ? 'Selected' : 'Compare'}
                </Button>
                {/* Suggest Greener Alternative */}
                {product.emissionLevel === 'High' && (() => {
                  const alternatives = mockProducts.filter(
                    (alt) => alt.category === product.category && alt.emissionLevel !== 'High' && alt.id !== product.id
                  );
                  if (alternatives.length === 0) return null;
                  const bestAlt = alternatives.reduce((prev, curr) => (curr.emissions < prev.emissions ? curr : prev), alternatives[0]);
                  const savings = Math.round(100 * (1 - bestAlt.emissions / product.emissions));
                  const handleCompareAlternative = () => {
                    let newSelection = [];
                    if (!compareSelection.find((p) => p.id === product.id)) newSelection.push(product);
                    if (!compareSelection.find((p) => p.id === bestAlt.id)) newSelection.push(bestAlt);
                    if (compareSelection.find((p) => p.id === product.id) && compareSelection.find((p) => p.id === bestAlt.id)) {
                      setShowCompare(true);
                      return;
                    }
                    setCompareSelection(newSelection);
                    setTimeout(() => setShowCompare(true), 0);
                  };
                  return (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'success.lighter', borderRadius: 2, border: '1.5px solid', borderColor: 'success.light', display: 'flex', alignItems: 'center', gap: 2, minHeight: 72 }}>
                      <Avatar src={bestAlt.image} alt={bestAlt.name} sx={{ width: 48, height: 48, bgcolor: 'success.main' }}>
                        <Park sx={{ color: 'white' }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.dark' }}>
                            Want a greener choice? Try <b>{bestAlt.name}</b> with <b>{savings}% fewer emissions!</b>
                          </Typography>
                        </Box>
                        <Button size="small" color="success" variant="contained" sx={{ fontWeight: 600, textTransform: 'none', borderRadius: 2 }} onClick={handleCompareAlternative}>
                          Compare Alternative
                        </Button>
                      </Box>
                    </Box>
                  );
                })()}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Comparison Modal */}
      {showCompare && compareSelection.length === 2 && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 4, minWidth: 600, boxShadow: 8 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Product Comparison</Typography>
            <Box sx={{ display: 'flex', gap: 4 }}>
              {compareSelection.map((product) => (
                <Card key={product.id} sx={{ flex: 1, p: 2 }}>
                  <Box sx={{ height: 120, backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 2, mb: 2 }} />
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{product.brand}</Typography>
                  <Chip label={product.category} size="small" sx={{ mt: 1, mb: 1 }} />
                  <Typography variant="body2">Emission per unit: <b>{product.emissions} kg CO₂</b></Typography>
                  <Typography variant="body2">Emission Level: <b>{product.emissionLevel}</b></Typography>
                  <Typography variant="body2">Green Score: <b>{product.greenScore}</b></Typography>
                  {product.ecoCertified && <Chip label="Eco-Certified" color="success" size="small" sx={{ mt: 1 }} />}
                  <Button color="error" size="small" sx={{ mt: 2 }} onClick={() => handleRemoveCompare(product.id)}>Remove</Button>
                </Card>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handleCloseCompare}>Close</Button>
            </Box>
          </Box>
        </Box>
      )}
      {/* Show Compare Button */}
      {compareSelection.length === 2 && !showCompare && (
        <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1500 }}>
          <Button variant="contained" color="info" size="large" onClick={handleShowCompare}>
            Compare Selected Products
          </Button>
        </Box>
      )}
    </Container>
  );
} 