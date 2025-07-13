"use client";
import React, { useEffect, useState } from 'react';
import { CircularProgress, Alert, Container, Box, Button } from '@mui/material';
import Link from 'next/link';
import GreenPoints from '../../components/GreenPoints';

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = true; // TODO: Replace with real admin check

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/user-rewards');
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUserData(data);
      } catch (err: any) {
        setError(err.message || 'Error loading dashboard');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {isAdmin && (
        <Box sx={{ mb: 2, textAlign: 'right' }}>
          <Button component={Link} href="/admin/green-points" variant="outlined" color="secondary">
            Admin: Manage Green Points
          </Button>
        </Box>
      )}
      {userData && <GreenPoints userData={userData} />}
    </Container>
  );
} 