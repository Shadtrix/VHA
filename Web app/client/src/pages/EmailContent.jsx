import { useParams } from 'react-router-dom';
import { Typography, Container } from '@mui/material';

function EmailContent() {
  const { id } = useParams();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Email Content - ID: {id}
      </Typography>
      <Typography variant="body1">
        This is where you'd show the full email content for message #{id}.
      </Typography>
    </Container>
  );
}

export default EmailContent;
