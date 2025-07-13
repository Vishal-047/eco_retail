"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert, Chip, Link as MuiLink } from '@mui/material';

export default function GreenPointsAdminPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Move fetchActivities here
  const fetchActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user-rewards');
      if (!res.ok) throw new Error('Failed to fetch activities');
      const data = await res.json();
      setActivities(data.activities || []);
    } catch (err) {
      setError(err.message || 'Error loading activities');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Mock approve/reject logic
  const handleApprove = async (id: string) => {
    await fetch('/api/user-rewards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'approve' }),
    });
    // Refresh activities
    fetchActivities();
  };
  const handleReject = async (id: string) => {
    await fetch('/api/user-rewards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'reject' }),
    });
    // Refresh activities
    fetchActivities();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Green Points Admin Dashboard</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Proof</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((a, idx) => (
                <TableRow key={idx}>
                  <TableCell>{a.userId}</TableCell>
                  <TableCell>{a.type}</TableCell>
                  <TableCell>{a.description}</TableCell>
                  <TableCell>{a.date ? new Date(a.date).toLocaleString() : ''}</TableCell>
                  <TableCell>
                    {a.proofUrl ? (
                      <MuiLink href={a.proofUrl} target="_blank" rel="noopener">View</MuiLink>
                    ) : '—'}
                  </TableCell>
                  <TableCell>
                    {a.verified ? <Chip label="Verified" color="success" /> : <Chip label="Pending" color="warning" />}
                  </TableCell>
                  <TableCell>
                    {!a.verified && (
                      <>
                        <Button size="small" color="success" variant="contained" sx={{ mr: 1 }} onClick={() => handleApprove(a.id)}>Approve</Button>
                        <Button size="small" color="error" variant="outlined" onClick={() => handleReject(a.id)}>Reject</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
} 