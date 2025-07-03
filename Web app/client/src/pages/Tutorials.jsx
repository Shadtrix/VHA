import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Rating } from '@mui/material';
import http from '../http';
import { AccessTime } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';

function PublicReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    http.get('/api/reviews').then((res) => {
      // Filter reviews with rating >= 4
      const filtered = res.data.filter((review) => review.rating >= 4);
      setReviews(filtered);
    });
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ my: 3 }}>
        Customer Reviews (4 & 5 Star)
      </Typography>

      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={review.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 3,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  {review.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {review.company || '—'} • {review.service}
                </Typography>

                <Rating
                  value={review.rating}
                  readOnly
                  precision={1}
                  size="small"
                  sx={{ mb: 1 }}
                />

                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {review.description.split(" ").slice(0, 50).join(" ")}{review.description.split(" ").length > 50 ? '...' : ''}
                </Typography>

                <Box
                  mt={2}
                  sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}
                >
                  <AccessTime sx={{ mr: 1 }} fontSize="small" />
                  <Typography variant="caption">
                    {dayjs(review.createdAt).format(global.datetimeFormat)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PublicReviews;
