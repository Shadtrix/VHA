import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';

function Admin() {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Typography variant="h5">Welcome to the Dashboard</Typography>;
      case 'Users':
        return <Typography variant="h5">Users</Typography>;
      case 'Reports':
        return <Typography variant="h5">Reports</Typography>;
      case 'Settings':
        return <Typography variant="h5">Settings</Typography>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Nav Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant={activeSection === 'Dashboard' ? 'contained' : 'outlined'} onClick={() => setActiveSection('Dashboard')}>Dashboard</Button>
        <Button variant={activeSection === 'Users' ? 'contained' : 'outlined'} onClick={() => setActiveSection('Users')}>Users</Button>
        <Button variant={activeSection === 'Reports' ? 'contained' : 'outlined'} onClick={() => setActiveSection('Reports')}>Reports</Button>
        <Button variant={activeSection === 'Settings' ? 'contained' : 'outlined'} onClick={() => setActiveSection('Settings')}>Settings</Button>
      </Box>

      {/* Content Area */}
      <Paper elevation={3} sx={{ p: 3 }}>
        {renderSection()}
      </Paper>
    </Box>
  );
}

export default Admin;
