import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmailContent() {
  const { id } = useParams();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
const [editedSubject, setEditedSubject] = useState(email.subject);
const [editedBody, setEditedBody] = useState(email.body);


  useEffect(() => {
    axios.get(`http://localhost:3001/api/email/${id}`)
      .then(res => {
        setEmail(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

const handleTranslate = async () => {
  try {
    await axios.post(`http://localhost:3001/api/email/translate/${email.id}`);
    alert("Translated email added to inbox!");
  } catch (err) {
    console.error("Failed to translate:", err);
    alert("Error translating email.");
  }
};

const handleSummarise = async () => {
  try {
    await axios.post(`http://localhost:3001/api/email/summarise/${email.id}`);
    alert("Summarised email added to inbox!");
  } catch (err) {
    console.error("Failed to summarise:", err);
    alert("Error summarising email.");
  }
};

const handleGenerateResponse = async () => {
  try {
    await axios.post(`http://localhost:3001/api/email/respond/${email.id}`);
    alert("Response email added to inbox!");
  } catch (err) {
    console.error("Failed to generate response:", err);
    alert("Error generating response.");
  }
};


  if (loading) return <Typography align="center">Loading email...</Typography>;
  if (!email) return <Typography align="center">Email not found.</Typography>;

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
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/admin')}
          sx={{
            backgroundColor: '#ff6b6b', // unique coral/red color
            color: '#fff',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ff5252',
            },
          }}
        >
          ← Back to Admin
        </Button>
      </Box>
        {/* Sender Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
            <MailIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {email.sender}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email.email}
            </Typography>
          </Box>
        </Box>

        {/* Email Body */}
        <Box sx={{ mb: 6 }}>
          {email.body.split('\n').map((line, index) => (
            <Typography key={index} paragraph>{line}</Typography>
          ))}
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
            onClick={handleTranslate}
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
            onClick={handleGenerateResponse}
          >
            Generate a response for me!
          </Button>

          <Button
            variant="outlined"
            sx={{
              borderColor: '#3498db',
              color: '#3498db',
              px: 3,
              '&:hover': {
                backgroundColor: '#3498db',
                color: 'white',
                borderColor: '#3498db',
              },
            }}
            onClick={handleSummarise}
          >
            Summarise this email for me!
          </Button>
        </Box>
      </Container>
    </Box>
  );
}


export default EmailContent;
