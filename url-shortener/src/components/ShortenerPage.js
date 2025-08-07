import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Grid, Paper
} from '@mui/material';
import { logEvent } from './Logger';

const ShortenerPage = () => {
  const [urls, setUrls] = useState([
    { original: '', validity: '', shortcode: '', error: '' }
  ]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addUrlField = () => {
    if (urls.length >= 5) return;
    setUrls([...urls, { original: '', validity: '', shortcode: '', error: '' }]);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleShorten = () => {
    const updated = urls.map((entry) => {
      if (!entry.original || !validateUrl(entry.original)) {
        return { ...entry, error: 'Enter a valid URL' };
      }
      if (entry.validity && isNaN(entry.validity)) {
        return { ...entry, error: 'Validity must be a number' };
      }
      return { ...entry, error: '' };
    });

    setUrls(updated);

    const valid = updated.every(u => u.error === '');
    if (!valid) return;

    const newResults = updated.map((entry) => {
      const shortcode = entry.shortcode || generateShortCode();
      const validityMins = parseInt(entry.validity || '30', 10);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + validityMins * 60000);

      const shortURL = `http://localhost:3000/${shortcode}`;

      logEvent(`Shortened URL: ${entry.original} → ${shortURL} (expires in ${validityMins} mins)`);

      return {
        shortcode,
        original: entry.original,
        shortURL,
        createdAt: now.toLocaleString(),
        expiresAt: expiresAt.toLocaleString(),
      };
    });

    setResults(newResults);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
        URL Shortener
      </Typography>

      {urls.map((url, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }} elevation={3}>
          <Typography variant="h6">URL #{index + 1}</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Original Long URL"
                value={url.original}
                onChange={(e) => handleChange(index, 'original', e.target.value)}
                error={!!url.error}
                helperText={url.error}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Validity (mins)"
                value={url.validity}
                onChange={(e) => handleChange(index, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                value={url.shortcode}
                onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box display="flex" justifyContent="space-between" mb={4}>
        <Button
          variant="outlined"
          onClick={addUrlField}
          disabled={urls.length >= 5}
        >
          Add Another URL
        </Button>

        <Button
          variant="contained"
          onClick={handleShorten}
        >
          Shorten URLs
        </Button>
      </Box>

      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Shortened URLs</Typography>
          {results.map((res, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2 }} elevation={2}>
              <Typography><strong>Original:</strong> {res.original}</Typography>
              <Typography><strong>Short URL:</strong> <a href={res.shortURL} target="_blank" rel="noopener noreferrer">{res.shortURL}</a></Typography>
              <Typography><strong>Created At:</strong> {res.createdAt}</Typography>
              <Typography><strong>Expires At:</strong> {res.expiresAt}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ShortenerPage;