"use client";
import React from "react";
import { Container, Typography, Grid, Card, CardContent, Chip, Button, Box, Stack, TextField, Autocomplete } from "@mui/material";
import { useState } from "react";

const suppliers = [
  {
    name: "GreenPack Solutions",
    description: "Sustainable packaging materials for e-commerce and retail.",
    tags: ["Packaging", "Recyclable", "Compostable"],
    website: "https://greenpack.com"
  },
  {
    name: "EcoTextiles Co.",
    description: "Organic and recycled fabrics for clothing brands.",
    tags: ["Textiles", "Organic", "Recycled"],
    website: "https://ecotextiles.com"
  },
  {
    name: "SolarMove Logistics",
    description: "Low-emission delivery and logistics services.",
    tags: ["Logistics", "Low Emission", "Solar Powered"],
    website: "https://solarmove.com"
  },
  {
    name: "BioWare Disposables",
    description: "Biodegradable and compostable foodware for restaurants.",
    tags: ["Foodware", "Biodegradable", "Compostable"],
    website: "https://bioware.com"
  },
  {
    name: "GreenPrint Labels",
    description: "Eco-friendly printing and labeling solutions.",
    tags: ["Printing", "Recycled Paper", "Soy Ink"],
    website: "https://greenprint.com"
  }
];

const allTags = Array.from(new Set(suppliers.flatMap(s => s.tags)));

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesName = supplier.name.toLowerCase().includes(search.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => supplier.tags.includes(tag));
    return matchesName && matchesTags;
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Eco-Friendly Supplier Directory
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Browse trusted suppliers offering sustainable products and services for your business. All listings are for demo purposes.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Search by name"
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 220 }}
        />
        <Autocomplete
          multiple
          options={allTags}
          value={selectedTags}
          onChange={(_, value) => setSelectedTags(value)}
          renderInput={params => <TextField {...params} label="Filter by tags" variant="outlined" />}
          sx={{ minWidth: 220 }}
        />
      </Box>
      <Grid container spacing={3}>
        {filteredSuppliers.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">No suppliers found.</Typography>
          </Grid>
        ) : (
          filteredSuppliers.map((supplier, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {supplier.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {supplier.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                    {supplier.tags.map((tag, i) => (
                      <Chip key={i} label={tag} color="success" size="small" />
                    ))}
                  </Stack>
                  <Button
                    variant="outlined"
                    color="primary"
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1 }}
                    fullWidth
                  >
                    Visit Website
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
} 