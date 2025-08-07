import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, TextField, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Visibility, VisibilityOff, Edit } from '@mui/icons-material';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReviewAdmin from './ReviewAdmin';
import AdminInbox from './AdminInbox';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Chip, InputAdornment } from '@mui/material';
import { TableContainer } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [users, setUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [categories, setCategories] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editedName, setEditedName] = useState('');

  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserData, setEditUserData] = useState({ name: '', email: '', password: '', role: '' });
  const [showDeletedOnly, setShowDeletedOnly] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedChips, setSelectedChips] = useState([]);
  const [constructiveReviews, setConstructiveReviews] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeSection === 'Users') {
      const endpoint = showDeletedOnly ? '/user/deleted' : '/user';
      http.get(endpoint)
        .then((res) => setUsers(res.data))
        .catch((err) => console.error('Failed to load users', err));
    } else if (activeSection === 'Email Filters') {
      fetchCategories();
    } else if (activeSection === 'Constructive Reviews') {
      Promise.all([
        http.get('/api/reviews/moderation-log'),
        http.get('/api/reviews')
      ])
        .then(([logsRes, reviewsRes]) => {
          const logs = logsRes.data.filter(r => r.constructive);
          const reviews = reviewsRes.data;
          const merged = logs.map(log => {
            const review = reviews.find(r => r.id === log.reviewId);
            return {
              ...log,
              ...review,
              reason: log.reason || review?.reason || "No reason provided"
            };
          });
          setConstructiveReviews(merged);
        })
        .catch(err => console.error('Failed to load constructive reviews', err));
    }
  }, [activeSection, showDeletedOnly]);

  const fetchCategories = async () => {
    try {
      const res = await http.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
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
      if (err.response?.status === 409) {
        toast.error("Category name already exists");
      } else {
        toast.error("Failed to update category");
      }
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
        return <ReviewAdmin />;
      case 'Users':
        return (
          <>
            <Typography variant="h5" mb={2}>User List</Typography>
            <Button
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={() => setShowDeletedOnly(prev => !prev)}
            >
              {showDeletedOnly ? "Show All Users" : "Show Only Deleted Users"}
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .filter(user => showDeletedOnly ? user.deletedAt !== null : true)
                  .map((user) => (
                    <TableRow
                      key={user.id}
                      sx={user.deletedAt ? {
                        '& td:not(:last-child)': {
                          color: 'gray',
                          textDecoration: 'line-through',
                          opacity: 0.6
                        }
                      } : {}}

                    >
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
                      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {user.deletedAt ? (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={async () => {
                              try {
                                await http.post(`/user/restore/${user.id}`);
                                toast.success("User restored");
                                setUsers(users.map(u => u.id === user.id ? { ...u, deletedAt: null } : u));
                              } catch (err) {
                                toast.error("Failed to restore user");
                                console.error(err);
                              }
                            }}
                          >
                            Restore
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelectedUser(user);
                                setEditUserData({
                                  name: user.name,
                                  email: user.email,
                                  role: user.role
                                });
                                setEditUserDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={async () => {
                                if (window.confirm(`Soft delete ${user.email}?`)) {
                                  try {
                                    await http.delete(`/user/${user.id}`);
                                    setUsers(users.map(u =>
                                      u.id === user.id
                                        ? { ...u, deletedAt: new Date().toISOString() }
                                        : u
                                    ));
                                    toast.success("User soft-deleted", { autoClose: 3000 });
                                  } catch (err) {
                                    toast.error("Failed to soft delete user");
                                    console.error(err);
                                  }
                                }
                              }}
                            >
                              Soft Delete
                            </Button>
                            <Button
                              size="small"
                              color="warning"
                              variant="outlined"
                              onClick={async () => {
                                if (window.confirm(`PERMANENTLY delete ${user.email}? This cannot be undone.`)) {
                                  try {
                                    await http.delete(`/user/hard/${user.id}`);
                                    setUsers(users.filter(u => u.id !== user.id));
                                    toast.success("User hard-deleted", { autoClose: 3000 });
                                  } catch (err) {
                                    toast.error("Failed to hard delete user");
                                    console.error(err);
                                  }
                                }
                              }}
                            >
                              Hard Delete
                            </Button>
                          </>
                        )}
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
      case 'Inbox':
        return <AdminInbox />;
      case 'Constructive Reviews':
        return (
          <Box>
            <Typography variant="h5" mb={2}>Constructive Criticism Reviews</Typography>
            <Button
              variant="contained"
              sx={{ mb: 2 }}
              onClick={async () => {
                const response = await fetch('http://localhost:3001/api/reviews/export-constructive', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reviews: constructiveReviews }),
                });
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'constructive_reviews.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              }}
            >
              Export to Excel
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Review ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {constructiveReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No constructive reviews yet.</TableCell>
                    </TableRow>
                  ) : (
                    constructiveReviews.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.reviewId}</TableCell>
                        <TableCell>{log.name}</TableCell>
                        <TableCell>{log.company}</TableCell>
                        <TableCell>{log.description}</TableCell>
                        <TableCell>{log.reason}</TableCell>
                        <TableCell>{log.rating}</TableCell>
                        <TableCell>{log.createdAt ? new Date(log.createdAt).toLocaleString() : ''}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
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
                  if (!editedName.trim()) {
                    toast.error("Category name cannot be empty");
                    return;
                  }
                  try {
                    await http.post('/categories', { name: editedName });
                    setEditedName('');
                    fetchCategories();
                  } catch (err) {
                    if (err.response?.status === 409) {
                      toast.error("Category already exists");
                    } else {
                      toast.error("Failed to add category");
                    }
                  }
                }}>Add</Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={async () => {
                    try {
                      toast.info("Classifying emails...", { autoClose: 2000 });
                      const res = await http.post('/categories/classify');
                      toast.success(res.data.message || "Classification complete.", { autoClose: 4000 });
                    } catch (err) {
                      toast.error("Failed to classify emails");
                    }
                  }}
                >
                  Classify Emails
                </Button>
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
                              toast.success("Category deleted successfully", { autoClose: 3000 });
                            } catch {
                              toast.error("Failed to delete category");
                            }
                          }
                        }}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredEmails.length > 0 && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>Filtered Emails</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sender</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Categories</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredEmails.map(email => (
                        <TableRow key={email.id}>
                          <TableCell>{email.sender} ({email.email})</TableCell>
                          <TableCell
                            sx={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                            onClick={() => window.open(`/email/${email.id}`, '_blank')}
                          >
                            {email.subject}
                          </TableCell>

                          <TableCell>{new Date(email.date).toLocaleString()}</TableCell>
                          <TableCell>
                            {email.category_ids
                              ? email.category_ids.map(id => {
                                const match = categories.find(cat => cat.id === id);
                                return match ? match.name : id;
                              }).join(', ')
                              : (
                                categories.find(cat => cat.id === email.category_id)?.name || email.category_id
                              )
                            }
                          </TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
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

            <Dialog open={filterModalOpen} onClose={() => setFilterModalOpen(false)} fullWidth maxWidth="sm">
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SearchIcon />
                  <Typography variant="h6">Smart Email Filter</Typography>
                </Box>
                <IconButton onClick={() => setFilterModalOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <Typography variant="body2" mb={2}>
                  Your emails have been organized by AI using the categories set by the admin. You can filter emails by selecting categories below.
                  Click on a category to toggle its selection. Use the "Select all" and "Clear" buttons to manage your selections.
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {categories.map((cat) => (
                    <Chip
                      key={cat.id}
                      label={cat.name}
                      clickable
                      onClick={() => {
                        setSelectedChips((prev) =>
                          prev.includes(cat.name) ? prev.filter(c => c !== cat.name) : [...prev, cat.name]
                        );
                      }}
                      color={selectedChips.includes(cat.name) ? 'primary' : 'default'}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button onClick={() => setSelectedChips(categories.map(c => c.name))}>Select all</Button>
                  <Button onClick={() => setSelectedChips([])}>Clear</Button>
                  <Button
                    variant="contained"
                    onClick={async () => {
                      const chipNames = selectedChips;
                      const selected = categories.filter(c => chipNames.includes(c.name));
                      const categoryIds = selected.map(c => c.id);

                      if (categoryIds.length === 0) {
                        setFilteredEmails([]); // No filters → clear results
                        toast.info("No filters selected. Showing 0 emails.");
                        setFilterModalOpen(false);
                        return;
                      }

                      try {
                        const query = categoryIds.join(',');
                        const res = await http.get(`/categories/by-category?ids=${query}`);

                        setFilteredEmails(res.data);
                        toast.success(`Applied filters: ${chipNames.join(', ')}`);
                        setFilterModalOpen(false);
                      } catch (err) {
                        toast.error("Failed to fetch filtered emails");
                        console.error(err);
                      }
                    }}
                  >
                    Apply filters
                  </Button>
                </Box>
              </DialogContent>
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
        {['Dashboard', 'Users', 'Reports', 'Settings', 'Inbox', 'Email Filters', 'Constructive Reviews'].map(section => (
          <Button key={section}
            variant={activeSection === section ? 'contained' : 'outlined'}
            onClick={() => setActiveSection(section)}>
            {section}
          </Button>
        ))}
      </Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        {renderSection()}
        {activeSection === 'Email Filters' && (
          <IconButton
            onClick={() => setFilterModalOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: 'white',
              boxShadow: 3,
              '&:hover': { backgroundColor: 'primary.dark' }
            }}
          >
            <FilterListIcon />
          </IconButton>
        )}

      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onClose={() => setEditUserDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={editUserData.name}
            onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })} />
          <TextField label="Email" value={editUserData.email}
            onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })} />
          <TextField label="Password" value={editUserData.password}
            onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })} />
          <TextField label="Role" value={editUserData.role}
            onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            try {
              await http.put(`/user/${selectedUser.id}`, editUserData);
              const updated = users.map(u => u.id === selectedUser.id ? { ...u, ...editUserData } : u);
              setUsers(updated);
              setEditUserDialogOpen(false);
            } catch (err) {
              alert("Failed to update user");
              console.error(err);
            }
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Admin;
