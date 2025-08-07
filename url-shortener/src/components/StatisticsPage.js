import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, Table, TableBody, TableCell,
  TableHead, TableRow
} from '@mui/material';
import { getLogs } from './Logger';

const fakeClickData = (shortcode) => {
  const sources = ['google.com', 'facebook.com', 'twitter.com', 'linkedin.com'];
  const ips = ['192.168.1.10', '203.0.113.42', '172.16.5.3', '10.0.0.88'];
  const locations = ['India', 'US', 'Germany', 'Brazil'];

  const clicks = [];
  const count = Math.floor(Math.random() * 5) + 1;

  for (let i = 0; i < count; i++) {
    clicks.push({
      time: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      ip: ips[Math.floor(Math.random() * ips.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
    });
  }

  return clicks;
};

const StatisticsPage = () => {
  const [shortenedURLs, setShortenedURLs] = useState([]);

  useEffect(() => {
    const logs = getLogs();
    const data = [];

    logs.forEach((log) => {
      const match = log.message.match(/Shortened URL: (.*?) → (.*?) \(expires in (\d+) mins\)/);
      if (match) {
        const [, original, shortURL, validity] = match;
        const shortcode = shortURL.split('/').pop();
        data.push({
          original,
          shortURL,
          shortcode,
          createdAt: new Date(log.timestamp).toLocaleString(),
          expiresIn: `${validity} mins`,
          clicks: fakeClickData(shortcode),
        });
      }
    });

    setShortenedURLs(data);
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
        URL Statistics
      </Typography>

      {shortenedURLs.length === 0 ? (
        <Typography>No shortened URLs to show.</Typography>
      ) : (
        shortenedURLs.map((url, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 3 }} elevation={3}>
            <Typography><strong>Original URL:</strong> {url.original}</Typography>
            <Typography><strong>Short URL:</strong> <a href={url.shortURL} target="_blank" rel="noreferrer">{url.shortURL}</a></Typography>
            <Typography><strong>Created At:</strong> {url.createdAt}</Typography>
            <Typography><strong>Expires In:</strong> {url.expiresIn}</Typography>
            <Typography><strong>Total Clicks:</strong> {url.clicks.length}</Typography>

            <Box mt={2}>
              <Typography variant="subtitle1">Click Details:</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>IP</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {url.clicks.map((click, i) => (
                    <TableRow key={i}>
                      <TableCell>{click.time}</TableCell>
                      <TableCell>{click.source}</TableCell>
                      <TableCell>{click.ip}</TableCell>
                      <TableCell>{click.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default StatisticsPage;