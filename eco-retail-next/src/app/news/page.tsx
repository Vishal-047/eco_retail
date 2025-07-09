"use client";
import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, Alert, Box, Chip, Stack } from "@mui/material";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err: any) {
        setError(err.message || "Failed to load news");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Sustainability News & Education
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Stay updated with the latest sustainability and environmental news from around the world.
      </Typography>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={3}>
        {articles.map((article, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {article.urlToImage && (
                <Box
                  component="img"
                  src={article.urlToImage}
                  alt={article.title}
                  sx={{ width: '100%', height: 180, objectFit: 'cover', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {article.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label={article.source.name} size="small" color="primary" />
                  <Chip label={new Date(article.publishedAt).toLocaleDateString()} size="small" />
                </Stack>
              </CardContent>
              <CardActions>
                <Button size="small" color="success" href={article.url} target="_blank" rel="noopener noreferrer">
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {!loading && articles.length === 0 && !error && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          No news articles found.
        </Typography>
      )}
    </Container>
  );
} 