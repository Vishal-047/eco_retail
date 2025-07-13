"use client";
import { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Card, CardContent, Grid, Chip, Stack, InputAdornment } from '@mui/material';
import { products } from '../../../data/products';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useRef } from 'react';
import mockProductsData from '../../../data/mock-products.json';
import { useEffect } from 'react';

export default function AdminExpiryDeals() {
  const [barcode, setBarcode] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [expiry, setExpiry] = useState('');
  const [discount, setDiscount] = useState('');
  const [msg, setMsg] = useState('');
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<any>(null);
  const [mockProducts] = useState(mockProductsData.products);
  const [validationError, setValidationError] = useState('');
  const [imageUrl, setImageUrl] = useState(selected?.image || '');

  useEffect(() => {
    setImageUrl(selected?.image || '');
  }, [selected]);

  const handleScan = () => {
    const found = mockProducts.find(
      p => String(p.barcode).trim() === String(barcode).trim()
    );
    setSelected(found || null);
    setExpiry(found?.expiryDate || '');
    setDiscount('');
    setMsg(found ? '' : 'Product not found');
  };

  const handleSave = async () => {
    setValidationError('');
    // Validation
    const today = new Date();
    const selectedDate = new Date(expiry);
    if (!expiry || selectedDate < today.setHours(0,0,0,0)) {
      setValidationError('Expiry date must be today or in the future.');
      return;
    }
    const discountNum = Number(discount);
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      setValidationError('Discount must be between 0 and 100%.');
      return;
    }
    // POST to backend
    try {
      const res = await fetch('/api/expiry-deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: selected.barcode,
          name: selected.name,
          expiryDate: expiry,
          discountPercent: discountNum,
          originalPrice: selected.originalPrice,
          image: imageUrl
        })
      });
      if (res.ok) {
        setMsg('Product updated and listed!');
      } else {
        setMsg('Failed to update product.');
      }
    } catch (err) {
      setMsg('Failed to update product.');
    }
  };

  const handleStartScan = () => {
    setScanning(true);
    setMsg('Align the barcode within the frame. Move closer or farther for better focus.');
    setTimeout(() => {
      if (!videoRef.current) return;
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;
      codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
        if (result) {
          setBarcode(result.getText());
          setScanning(false);
          setMsg('Barcode scanned!');
          codeReader.reset();
        }
        // Ignore err for normal operation
      });
    }, 500);
  };

  const handleStopScan = () => {
    setScanning(false);
    setMsg('');
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
  };

  const handleExpiryChange = (val: string) => {
    // Auto-convert DD-MM-YYYY to YYYY-MM-DD if needed
    if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
      const [dd, mm, yyyy] = val.split('-');
      setExpiry(`${yyyy}-${mm}-${dd}`);
    } else {
      setExpiry(val);
    }
  };

  // Soon expiring products (<=7 days)
  const soonExpiring = products.filter(p => {
    const days = Math.ceil((new Date(p.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 7;
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin: Expiry Smart Deals
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Scan or Enter Barcode</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <TextField
            label="Barcode"
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
            sx={{ width: 300 }}
          />
          <Button variant="contained" onClick={handleScan}>Fetch Product</Button>
          <Button variant="outlined" startIcon={<CameraAltIcon />} onClick={handleStartScan} disabled={scanning}>
            Scan Barcode
          </Button>
        </Stack>
        {scanning && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <video ref={videoRef} style={{ width: 320, height: 240, border: '2px solid #388e3c' }} autoPlay />
            <Typography sx={{ mt: 1, mb: 1 }} color="text.secondary">
              Align the barcode within the frame. Move closer or farther for better focus.
            </Typography>
            <Button variant="contained" color="error" onClick={handleStopScan} sx={{ mt: 1 }}>
              Stop Scan
            </Button>
          </Box>
        )}
        {msg && <Typography color="error" sx={{ mt: 1 }}>{msg}</Typography>}
      </Box>
      {selected && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6">{selected.name}</Typography>
            <Typography variant="body2">Barcode: {selected.barcode}</Typography>
            <Typography variant="body2">Original Price: ₹{selected.originalPrice}</Typography>
            <Typography variant="body2">Current Expiry: {selected.expiryDate}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
              <TextField
                label="Expiry Date"
                type="date"
                value={expiry.slice(0, 10)}
                onChange={e => handleExpiryChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={!!validationError && validationError.includes('Expiry')}
                helperText={(validationError && validationError.includes('Expiry') ? validationError + ' ' : '') + 'Format: YYYY-MM-DD'}
              />
              <TextField
                label="Discount %"
                type="number"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                error={!!validationError && validationError.includes('Discount')}
                helperText={validationError && validationError.includes('Discount') ? validationError : ''}
              />
              <TextField
                label="Image URL"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <Button variant="contained" onClick={handleSave} disabled={!!validationError}>
                Save
              </Button>
            </Stack>
            {imageUrl && (
              <img src={imageUrl} alt="Product" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, marginTop: 8 }} />
            )}
          </CardContent>
        </Card>
      )}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Soon Expiring Products</Typography>
        <Grid container spacing={2}>
          {soonExpiring.map(product => {
            const daysLeft = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            let badgeColor: 'success' | 'warning' | 'error' = 'success';
            if (daysLeft <= 3) badgeColor = 'error';
            else if (daysLeft <= 7) badgeColor = 'warning';
            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ border: daysLeft <= 3 ? '2px solid #d32f2f' : undefined }}>
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2">Expiry: {new Date(product.expiryDate).toLocaleDateString()}</Typography>
                    <Typography variant="body2">Discount: {product.discountPercent}%</Typography>
                    <Chip
                      label={daysLeft > 0 ? `${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left!` : 'Expired'}
                      color={badgeColor}
                      sx={{ mt: 1, fontWeight: 'bold' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
} 