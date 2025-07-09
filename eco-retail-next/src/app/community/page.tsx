"use client";
import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Stack, Button, CircularProgress, Alert, Avatar, IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

export default function CommunityPage() {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/community-feed')
      .then(res => res.json())
      .then(data => {
        setFeed(data.feed || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load community feed');
        setLoading(false);
      });
  }, []);

  const handleShare = (post: any) => {
    const shareText = `${post.user} just achieved: ${post.achievement || post.tip}! #EcoRetail`;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Community Feed
      </Typography>
      <Typography variant="body1" gutterBottom>
        See what other eco-conscious users are achieving and sharing!
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Stack spacing={3} sx={{ mt: 3 }}>
        {feed.map((post, i) => (
          <Paper key={i} elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2 }}>{post.user[0]}</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">{post.user}</Typography>
              {post.achievement && <Typography color="success.main">🏅 {post.achievement}</Typography>}
              {post.tip && <Typography color="info.main">💡 {post.tip}</Typography>}
              <Typography variant="caption" color="text.secondary">{post.time}</Typography>
            </Box>
            <IconButton onClick={() => handleShare(post)} color="primary">
              <ShareIcon />
            </IconButton>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
} 