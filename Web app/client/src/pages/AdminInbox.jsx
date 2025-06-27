import React from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  Box,
  Paper,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';

const inboxData = [
  {
    id: 1,
    sender: "NYP_Bursary",
    subject: "Final Reminder AY2025 Gov Bursary App",
    date: "April 15",
  },
  {
    id: 2,
    sender: "NYP_Admissions_me",
    subject: "Final Reminder AY2025 Gov Bursary App",
    date: "April 15",
  },
  {
    id: 3,
    sender: "NYP_Admissions",
    subject: "AY2025 Admissions Bursary Application is Open",
    date: "April 4",
  },
  {
    id: 4,
    sender: "NYP Bursary",
    subject: "Singapore Bursary Scheme – Now Open",
    date: "March 22",
  },
];

function AdminInbox() {
  const navigate = useNavigate();

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
        {/* Header row */}
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

        {/* Inbox List */}
        <List>
          {inboxData.map((email) => (
            <React.Fragment key={email.id}>
              <Paper
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
            </React.Fragment>
          ))}
        </List>
      </Container>
    </Box>
  );
}

export default AdminInbox;
