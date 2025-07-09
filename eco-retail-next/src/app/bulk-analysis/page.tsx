"use client";
import React, { useRef, useState } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, Stack, Snackbar, Tooltip, Menu, MenuItem, IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const demoProducts = [
  {
    name: "Organic Cotton T-Shirt",
    manufacturing: 0.4,
    packaging: 0.2,
    shipping: 0.2,
    total: 0.8,
  },
  {
    name: "Bamboo Water Bottle",
    manufacturing: 0.1,
    packaging: 0.1,
    shipping: 0.1,
    total: 0.3,
  },
  {
    name: "Solar Power Bank",
    manufacturing: 0.7,
    packaging: 0.2,
    shipping: 0.3,
    total: 1.2,
  },
  {
    name: "Recycled Paper Notebook",
    manufacturing: 0.05,
    packaging: 0.02,
    shipping: 0.03,
    total: 0.1,
  },
  {
    name: "Plastic Chair",
    manufacturing: 2.0,
    packaging: 0.5,
    shipping: 1.0,
    total: 3.5,
  },
];

function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const cols = line.split(",");
    return {
      name: cols[0]?.trim() || "",
      manufacturing: parseFloat(cols[1]) || 0,
      packaging: parseFloat(cols[2]) || 0,
      shipping: parseFloat(cols[3]) || 0,
      total: parseFloat(cols[4]) || 0,
    };
  });
}

function toCSV(rows: any[]) {
  const header = "Product Name,Manufacturing,Packaging,Shipping,Total";
  const body = rows.map(r => `${r.name},${r.manufacturing},${r.packaging},${r.shipping},${r.total}`).join("\n");
  return `${header}\n${body}`;
}

export default function BulkAnalysisPage() {
  const [rows, setRows] = useState(demoProducts);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      try {
        const parsed = parseCSV(text);
        if (parsed.length > 0) setRows(parsed);
      } catch {
        alert("Failed to parse CSV. Please check your file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-emission-analysis.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getShareableUrl = () => {
    const csv = toCSV(rows);
    if (csv.length < 1500) {
      const encoded = encodeURIComponent(csv);
      return `${window.location.origin}/bulk-analysis?data=${encoded}`;
    } else {
      return null;
    }
  };

  const handleSocialShare = (platform: string) => {
    const url = getShareableUrl();
    if (!url) {
      setSnackbarMsg("Table too large to share as a link. Please download and send the CSV file.");
      setSnackbarOpen(true);
      return;
    }
    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank');
    } else if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${encodeURIComponent('Check out this bulk emission analysis: ' + url)}`;
      window.open(shareUrl, '_blank');
    } else if (platform === 'email') {
      shareUrl = `mailto:?subject=Bulk Emission Analysis&body=Check out this bulk emission analysis: ${url}`;
      window.open(shareUrl, '_self');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setSnackbarMsg("Shareable link copied!");
      setSnackbarOpen(true);
    }
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleShareClose = () => {
    setAnchorEl(null);
  };

  const handleMenuShare = (platform: string) => {
    handleSocialShare(platform);
    handleShareClose();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Bulk/Batch Emission Analysis
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Analyze emissions for multiple products at once. Upload a CSV, download the results, or share with someone.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant="contained" color="primary" onClick={() => fileInputRef.current?.click()}>
          Upload CSV
        </Button>
        <Button variant="outlined" color="success" onClick={handleDownload}>
          Download CSV
        </Button>
        <Tooltip title="Share">
          <IconButton color="info" onClick={handleShareClick} size="large">
            <ShareIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleShareClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MenuItem onClick={() => handleMenuShare('copy')}><ContentCopyIcon sx={{ mr: 1 }} />Copy Link</MenuItem>
          <MenuItem onClick={() => handleMenuShare('facebook')}><FacebookIcon sx={{ mr: 1 }} />Facebook</MenuItem>
          <MenuItem onClick={() => handleMenuShare('whatsapp')}><WhatsAppIcon sx={{ mr: 1 }} />WhatsApp</MenuItem>
          <MenuItem onClick={() => handleMenuShare('email')}><EmailIcon sx={{ mr: 1 }} />Email</MenuItem>
        </Menu>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleUpload}
        />
      </Stack>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Product Name</b></TableCell>
              <TableCell align="right">Manufacturing (kg CO₂/kg)</TableCell>
              <TableCell align="right">Packaging (kg CO₂/kg)</TableCell>
              <TableCell align="right">Shipping (kg CO₂/kg)</TableCell>
              <TableCell align="right"><b>Total (kg CO₂/kg)</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.manufacturing}</TableCell>
                <TableCell align="right">{row.packaging}</TableCell>
                <TableCell align="right">{row.shipping}</TableCell>
                <TableCell align="right"><b>{row.total}</b></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, color: 'text.secondary', fontSize: 14 }}>
        <b>CSV Format:</b> Product Name,Manufacturing,Packaging,Shipping,Total
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
} 