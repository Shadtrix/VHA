import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import http from '../http';

function Admin() {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [users, setUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    if (activeSection === 'Users') {
      http.get('/user/all')
        .then((res) => setUsers(res.data))
        .catch((err) => console.error('Failed to load users', err));
    }
  }, [activeSection]);

  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Typography variant="h5">Welcome to the Dashboard</Typography>;
      case 'Users':
        return (
          <>
            <Typography variant="h5" mb={2}>User List</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Password</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell style={{
                      fontWeight: 'bold',
                      color: user.role === 'admin' ? 'red' : 'black'
                    }}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '150px'
                      }}>
                        {visiblePasswords[user.id]
                          ? user.password
                          : '•'.repeat(user.password.length)}
                      </Box>
                      <IconButton onClick={() => togglePassword(user.id)}>
                        {visiblePasswords[user.id] ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        );
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
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant={activeSection === 'Dashboard' ? 'contained' : 'outlined'}
          onClick={() => setActiveSection('Dashboard')}>
          Dashboard
        </Button>
        <Button variant={activeSection === 'Users' ? 'contained' : 'outlined'}
          onClick={() => setActiveSection('Users')}>
          Users
        </Button>
        <Button variant={activeSection === 'Reports' ? 'contained' : 'outlined'}
          onClick={() => setActiveSection('Reports')}>
          Reports
        </Button>
        <Button variant={activeSection === 'Settings' ? 'contained' : 'outlined'}
          onClick={() => setActiveSection('Settings')}>
          Settings
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        {renderSection()}
      </Paper>
    </Box>
  );
}

export default Admin;
