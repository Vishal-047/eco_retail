"use client";
import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Chip, Stack, Button, CircularProgress, Alert, LinearProgress } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/user-rewards')
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load user data');
        setLoading(false);
      });
  }, []);

  const handleRedeem = async () => {
    setRedeemLoading(true);
    setRedeemMsg(null);
    try {
      const res = await fetch('/api/user-rewards/redeem', { method: 'POST' });
      const data = await res.json();
      setRedeemMsg(data.message || 'Redeemed!');
      setUser((u: any) => ({ ...u, points: data.points, discounts: data.discounts }));
    } catch {
      setRedeemMsg('Failed to redeem.');
    } finally {
      setRedeemLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        My Green Dashboard
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {user && (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Green Points: <b>{user.points}</b></Typography>
          <LinearProgress variant="determinate" value={Math.min(user.points, 100)} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Badges</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            {user.badges.map((badge: any, i: number) => (
              <Chip key={i} icon={<EmojiEventsIcon />} label={badge} color="success" variant="outlined" />
            ))}
          </Stack>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Available Discounts</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            {user.discounts.length > 0 ? user.discounts.map((d: any, i: number) => (
              <Chip key={i} label={d} color="primary" />
            )) : <Typography>No discounts yet. Earn more points!</Typography>}
          </Stack>
          <Button
            variant="contained"
            color="success"
            onClick={handleRedeem}
            disabled={redeemLoading || user.points < 100}
          >
            {redeemLoading ? 'Redeeming...' : 'Redeem 100 Points for Discount'}
          </Button>
          {redeemMsg && <Alert sx={{ mt: 2 }} severity="info">{redeemMsg}</Alert>}
        </Paper>
      )}
    </Container>
  );
} 