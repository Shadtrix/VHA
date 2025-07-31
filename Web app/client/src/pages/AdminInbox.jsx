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
    date: new Date().toISOString().split('T')[0], 
  });
  const [formError, setFormError] = useState('');
  const [editingEmailId, setEditingEmailId] = useState(null);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
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
              label="Date"
              name="date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleInputChange}
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

                {(!email.translated && !email.summarised) && (
                  <IconButton
                    edge="end"
                    aria-label="update"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingEmailId(email.id);
                      setEditedSubject(email.subject);
                      setEditedBody(email.body);
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
        {editingEmailId === email.id && (
          <Box
            sx={{
              mt: 1,
              mb: 2,
              mx: 2,
              border: '1px solid #ccc',
              borderRadius: 2,
              padding: 2,
              backgroundColor: '#f5faff',
            }}
          >
            <TextField
              fullWidth
              label="Subject"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Body"
              multiline
              rows={3}
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              margin="normal"
            />

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  handleUpdate(email.id, {
                    subject: editedSubject,
                    body: editedBody,
                    date: new Date().toISOString(),
                  });
                  setEditingEmailId(null);
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setEditingEmailId(null)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </React.Fragment>
    ))}
  </List>
)}
      </Container>
    </Box>
  );
}

export default AdminInbox;
