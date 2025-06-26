import React, { useState } from 'react';
import { Box, Typography, Slider, Button } from '@mui/material';

function Admin() {
  const [admin, setRa] = useState(3);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin</Typography>
      <Typography>How would you rate your experience?</Typography>
    </Box>
  );
}

export default Admin;
