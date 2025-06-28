import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, TextField, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Visibility, VisibilityOff, Edit } from '@mui/icons-material';
import http from '../http';

function Admin() {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [users, setUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sender, setSender] = useState('');
  const [category, setCategory] = useState([]);

  const [categories, setCategories] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    if (activeSection === 'Users') {
      http.get('/user/all')
        .then((res) => setUsers(res.data))
        .catch((err) => console.error('Failed to load users', err));
    } else if (activeSection === 'Email Filters') {
      fetchCategories();
    }
  }, [activeSection]);

  const fetchCategories = async () => {
    try {
      const res = await http.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const categorize = () => {
    const keywords = {
      Bursary: ["bursary", "financial aid", "gov bursary"],
      Admissions: ["admission", "open house", "apply"],
      Enrolment: ["enrol", "register", "matriculation"],
      Deadline: ["deadline", "reminder", "final date"],
      NYP: ["nyp"],
      Orientation: ["orientation", "welcome"],
      Scholarship: ["scholarship", "merit"],
      Payment: ["payment", "fee", "invoice"]
    };

    const text = `${subject} ${body}`.toLowerCase();
    const matched = [];

    for (const [cat, words] of Object.entries(keywords)) {
      if (words.some(w => text.includes(w))) {
        matched.push(cat);
      }
    }

    setCategory(matched);
  };

  const saveEmail = async () => {
    try {
      const res = await http.post('/emails', { sender, subject, body });
      alert(`Saved! Categories: ${res.data.categories.join(', ')}`);
      setSender('');
      setSubject('');
      setBody('');
      setCategory([]);
    } catch (err) {
      alert('Failed to save email.');
      console.error(err);
    }
  };

  const openEditDialog = (cat) => {
    setSelectedCategory(cat);
    setEditedName(cat.name);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await http.put(`/categories/${selectedCategory.id}`, { name: editedName });
      setEditDialogOpen(false);
      fetchCategories();
    } catch (err) {
      alert('Failed to update category.');
      console.error(err);
    }
  };

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
      case 'Email Filters':
        return (
          <Box>
            <Box>
              <Typography variant="h5" mb={2}>Manage Categories</Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="New Category Name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <Button variant="contained" onClick={async () => {
                  try {
                    await http.post('/categories', { name: editedName });
                    setEditedName('');
                    fetchCategories();
                  } catch {
                    alert('Failed to add category');
                  }
                }}>Add</Button>
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map(cat => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.id}</TableCell>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => openEditDialog(cat)}><Edit /></IconButton>
                        <IconButton onClick={async () => {
                          if (window.confirm('Delete this category?')) {
                            try {
                              await http.delete(`/categories/${cat.id}`);
                              fetchCategories();
                            } catch {
                              alert('Failed to delete');
                            }
                          }
                        }}><VisibilityOff /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogContent>
                <TextField fullWidth value={editedName} onChange={e => setEditedName(e.target.value)} />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleEditSave} variant="contained">Save</Button>
              </DialogActions>
            </Dialog>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {['Dashboard', 'Users', 'Reports', 'Settings', 'Email Filters'].map(section => (
          <Button key={section}
            variant={activeSection === section ? 'contained' : 'outlined'}
            onClick={() => setActiveSection(section)}>
            {section}
          </Button>
        ))}
      </Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        {renderSection()}
      </Paper>
    </Box>
  );
}

export default Admin;
