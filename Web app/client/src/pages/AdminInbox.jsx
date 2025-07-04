import React, { useEffect, useState } from 'react';
import {
  Container, Typography, List, ListItem, ListItemIcon, Box, Paper, CircularProgress,
  TextField, Button, Alert
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import TranslateIcon from '@mui/icons-material/Translate';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminInbox() {
  const [inboxData, setInboxData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    sender: '',
    email: '',
    subject: '',
    body: '',
    date: ''
  });
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this email?")) {
      try {
        await axios.delete(`http://localhost:3001/api/email/${id}`);
        setInboxData(prev => prev.filter(email => email.id !== id));
      } catch (err) {
        console.error("Failed to delete email:", err);
        alert("Error deleting email");
      }
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:3001/api/email/${id}`, updatedData);
      setInboxData((prev) =>
        prev.map((email) =>
          email.id === id ? { ...email, ...updatedData } : email
        )
      );
      alert("Email updated!");
    } catch (err) {
      console.error("Failed to update email:", err);
      alert("Error updating email");
    }
  };


  useEffect(() => {
    axios.get('http://localhost:3001/api/email')
      .then(res => {
        setInboxData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load emails:', err);
        setLoading(false);
      });
  }, []);

  const handleClick = (id) => {
    navigate(`/email/${id}`);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateEmail(formData.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/email/create', formData);
      setInboxData(prev => [...prev, res.data]);
      setFormData({ sender: '', email: '', subject: '', body: '', date: '' });
    } catch (err) {
      console.error("Error creating email:", err);
      setFormError('Failed to create email.');
    }
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

        {/* 📧 Create Email Form */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Create New Email</Typography>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Sender" name="sender" fullWidth required
              value={formData.sender} onChange={handleInputChange}
            />
            <TextField
              label="Email" name="email" fullWidth required
              value={formData.email} onChange={handleInputChange}
            />
            <TextField
              label="Subject" name="subject" fullWidth required
              value={formData.subject} onChange={handleInputChange}
            />
            <TextField
              label="Body" name="body" fullWidth required multiline rows={3}
              value={formData.body} onChange={handleInputChange}
            />
            <TextField
              label="Date" name="date" type="date" fullWidth required
              InputLabelProps={{ shrink: true }}
              value={formData.date} onChange={handleInputChange}
            />
            <Button variant="contained" type="submit">Create Email</Button>
          </Box>
        </Paper>

        {/* 📬 Email List Header */}
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

        {/* 📩 Emails */}
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {inboxData.map(email => (
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
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                      {/* Delete Button */}
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => { e.stopPropagation(); handleDelete(email.id); }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>

                      {/* Update Button (Only for matching user and base emails) */}
                      {(!email.translated && !email.summarised && !email.autoResponse) && (
                        <IconButton
                          edge="end"
                          aria-label="update"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newSubject = prompt("Enter new subject:", email.subject);
                            const newBody = prompt("Enter new body:", email.body);
                            if (newSubject && newBody) {
                              handleUpdate(email.id, {
                                subject: newSubject,
                                body: newBody,
                                date: new Date().toISOString(),
                              });
                            }
                          }}
                          color="primary"
                        >
                          <Typography variant="button">✏️</Typography>
                        </IconButton>
                      )}
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
