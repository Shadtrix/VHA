import React, { useEffect, useState } from 'react';
import {
  Container, Typography, List, ListItem, ListItemIcon, Box, Paper, CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminInbox() {
  const [inboxData, setInboxData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/email')  // Your backend API URL
      .then((res) => {
        setInboxData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load emails:', err);
        setLoading(false);
      });
  }, []);

  const handleClick = (id) => {
    navigate(`/email/${id}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            px: 2,
            py: 2,
            fontWeight: 'bold',
            justifyContent: 'space-between',
            borderRadius: 1,
            mb: 0.5,
          }}
        >
          <Box sx={{ flex: 2, textAlign: 'center' }}>Sender</Box>
          <Box sx={{ color: 'white' }}>|</Box>
          <Box sx={{ flex: 5, textAlign: 'center' }}>Subject</Box>
          <Box sx={{ color: 'white' }}>|</Box>
          <Box sx={{ flex: 2, textAlign: 'center' }}>Date</Box>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {inboxData.map((email) => (
              <Paper
                key={email.id}
                elevation={1}
                sx={{
                  mb: 0.5,
                  px: 3,
                  py: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleClick(email.id)}
              >
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <EmailIcon />
                  </ListItemIcon>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ flex: 2, textAlign: 'center' }}>
                      <Typography>{email.sender}</Typography>
                    </Box>
                    <Box sx={{ flex: 5, textAlign: 'center' }}>
                      <Typography>{email.subject}</Typography>
                    </Box>
                    <Box sx={{ flex: 2, textAlign: 'center' }}>
                      <Typography>{email.date}</Typography>
                    </Box>
                  </Box>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
}

export default AdminInbox;
