import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import ShortenerPage from './components/ShortenerPage';
import StatisticsPage from './components/StatisticsPage';

function App() {
  return (
    <Router>
      <Box sx={{ m: 2 }}>
        <Button variant="outlined" href="/">Shortener</Button>
        <Button variant="outlined" href="/stats" sx={{ ml: 2 }}>Statistics</Button>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;