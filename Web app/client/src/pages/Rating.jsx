import React, { useState } from 'react';
import { Box, Typography, Slider, Button } from '@mui/material';

function Rating() {
  const [rating, setRating] = useState(3);

  const handleSubmit = () => {
    alert(`Thank you for rating the route ${rating} out of 5!`);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Rate This Route</Typography>
      <Typography>How would you rate your experience?</Typography>
      <Slider
        value={rating}
        onChange={(e, newValue) => setRating(newValue)}
        aria-labelledby="route-rating-slider"
        step={1}
        marks
        min={1}
        max={5}
        valueLabelDisplay="auto"
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit Rating
      </Button>
    </Box>
  );
}

export default Rating;
