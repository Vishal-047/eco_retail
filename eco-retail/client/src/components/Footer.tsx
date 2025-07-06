import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
} from '@mui/material';
import { Park, GitHub, Twitter, LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Park sx={{ color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main">
                EcoRetail
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Making sustainable shopping accessible and transparent. Track carbon emissions, 
              choose eco-friendly products, and make a positive impact on our planet.
            </Typography>
            <Box>
              <IconButton color="inherit" size="small">
                <GitHub />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/products" color="inherit" underline="hover">
                  Products
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/calculator" color="inherit" underline="hover">
                  Calculator
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/delivery" color="inherit" underline="hover">
                  Delivery
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/packaging" color="inherit" underline="hover">
                  Packaging
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/about" color="inherit" underline="hover">
                  About
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/contact" color="inherit" underline="hover">
                  Contact
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/careers" color="inherit" underline="hover">
                  Careers
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/blog" color="inherit" underline="hover">
                  Blog
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/help" color="inherit" underline="hover">
                  Help Center
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/faq" color="inherit" underline="hover">
                  FAQ
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/privacy" color="inherit" underline="hover">
                  Privacy Policy
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/terms" color="inherit" underline="hover">
                  Terms of Service
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Sustainability
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/impact" color="inherit" underline="hover">
                  Our Impact
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/partners" color="inherit" underline="hover">
                  Partners
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/initiatives" color="inherit" underline="hover">
                  Initiatives
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/report" color="inherit" underline="hover">
                  Sustainability Report
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ borderTop: 1, borderColor: 'grey.800', pt: 3, mt: 4 }}>
          <Typography variant="body2" textAlign="center" color="grey.400">
            © 2024 EcoRetail. All rights reserved. Made with ❤️ for a sustainable future.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 