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
        <Grid container spacing={0} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }} alignItems="flex-start">
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} sx={{ pr: { md: 4, lg: 6 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Park sx={{ color: '#388e3c' }} />
              <Typography variant="h6" sx={{ color: '#388e3c', fontWeight: 'bold' }}>
                EcoRetail
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, textAlign: 'left', maxWidth: 320 }}>
              Making sustainable shopping accessible and transparent. Track carbon emissions, choose eco-friendly products, and make a positive impact on our planet.
            </Typography>
            <Box sx={{ textAlign: 'left', mb: { xs: 3, md: 0 } }}>
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
          
          <Grid size={{ xs: 6, sm: 3, md: 2, lg: 2 }} sx={{ pr: { md: 4, lg: 6 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left' }}>
              Features
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/products" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Products
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/calculator" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Calculator
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/delivery" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Delivery
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/packaging" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Packaging
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 3, md: 2, lg: 2 }} sx={{ pr: { md: 4, lg: 6 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left' }}>
              Company
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/about" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  About
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/contact" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Contact
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/careers" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Careers
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/blog" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Blog
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 3, md: 2, lg: 2 }} sx={{ pr: { md: 4, lg: 6 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left' }}>
              Support
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/help" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Help Center
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/faq" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  FAQ
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/privacy" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Privacy Policy
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/terms" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Terms of Service
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 3, md: 2, lg: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left' }}>
              Sustainability
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/impact" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Our Impact
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/partners" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Partners
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/initiatives" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
                  Initiatives
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/report" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
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