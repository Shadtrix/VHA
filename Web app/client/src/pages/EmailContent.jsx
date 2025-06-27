import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

function EmailContent() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Sender Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
            <MailIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              NYP Bursary (NYP)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              bursary@nyp.edu.sg
            </Typography>
          </Box>
        </Box>

        {/* Email Body */}
        <Box sx={{ mb: 6 }}>
          <Typography paragraph>Lorem Ipsum,</Typography>

          <Typography paragraph>
            Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
          </Typography>

          <Typography paragraph>
            Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
          </Typography>

          <Typography paragraph>
            Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
          </Typography>

          <Typography align="right">Lorem Ipsum</Typography>
        </Box>

        {/* Action Buttons */}
        <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    gap: 3,
    flexWrap: 'wrap',
  }}
>
  <Button
    variant="outlined"
    sx={{
      borderColor: '#2ecc71',
      color: '#2ecc71',
      px: 3,
      '&:hover': {
        backgroundColor: '#2ecc71',
        color: 'white',
        borderColor: '#2ecc71',
      },
    }}
  >
    Translate this email for me!
  </Button>

  <Button
    variant="outlined"
    sx={{
      borderColor: '#9b59b6',
      color: '#9b59b6',
      px: 3,
      '&:hover': {
        backgroundColor: '#9b59b6',
        color: 'white',
        borderColor: '#9b59b6',
      },
    }}
  >
    Generate a response for me!
  </Button>

  <Button
    variant="outlined"
    sx={{ 
      borderColor: '#3498db', color: '#3498db', px: 3,
      '&:hover': { backgroundColor: '#3498db', color: 'white', borderColor: '#3498db',},
    }}
  >
    Summarise this email for me!
  </Button>
</Box>
      </Container>
    </Box>
  );
} 

export default EmailContent;
