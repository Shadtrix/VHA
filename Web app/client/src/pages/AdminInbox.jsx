import React, { useEffect, useState } from 'react';
import {
  Container, Typography, List, ListItem, ListItemIcon, Box, Paper, CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import TranslateIcon from '@mui/icons-material/Translate';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

function AdminInbox() {
  const [inboxData, setInboxData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this email?")) {
      try {
        await axios.delete(`http://localhost:3001/api/email/${id}`);
        setInboxData((prev) => prev.filter(email => email.id !== id));
      } catch (err) {
        console.error("Failed to delete email:", err);
        alert("Error deleting email");
      }
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/email')
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
                    {email.translated ? (
                      <TranslateIcon sx={{ color: 'green' }} />
                    ) : email.summarised ? (
                      <SummarizeIcon sx={{ color: 'blue' }} />
                    ) : email.autoResponse ? (
                      <AutoAwesomeIcon sx={{ color: 'purple' }} />
                    ) : (
                      <EmailIcon />
                    )}
                  </ListItemIcon>

                  <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <Box sx={{ flex: 2, textAlign: 'center' }}>
                      <Typography>{email.sender}</Typography>
                    </Box>
                    <Box sx={{ flex: 5, textAlign: 'center' }}>
                      <Typography>{email.subject}</Typography>
                    </Box>
                    <Box sx={{ flex: 2, textAlign: 'center' }}>
                      <Typography>{new Date(email.date).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "long", year: "numeric"
                      })}</Typography>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => { e.stopPropagation(); handleDelete(email.id); }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
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
