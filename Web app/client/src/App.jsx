import './App.css';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, Container } from '@mui/material';
import { AccountCircle, ArrowDropDown } from '@mui/icons-material';
import { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Tutorials from './pages/Tutorials';
import Rating from './pages/Rating';
import Register from './pages/Register';
import Login from './pages/Login';
import UserContext from './contexts/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const { user, setUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountMenuEl, setAccountMenuEl] = useState(null);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleAccountMenuOpen = (event) => setAccountMenuEl(event.currentTarget);
  const handleAccountMenuClose = () => setAccountMenuEl(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  return (
    <>
      <AppBar position="fixed" className="AppBar">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/home" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/src/public/VHA.png" alt="VHA Logo" style={{ height: '40px' }} />
            </Link>
            <Link to="/tutorials" style={{ textDecoration: 'none', color: 'white' }}>
              <Typography>Reviews</Typography>
            </Link>
            <Link to="/rating" style={{ textDecoration: 'none', color: 'white' }}>
              <Typography>Rating</Typography>
            </Link>
            <Button color="inherit" onClick={handleOpenMenu}>Services</Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/service1">MEP Engineering</MenuItem>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/service2">Fire Safety Engineering</MenuItem>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/service3">Annual Fire Certification</MenuItem>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/service4">Registered Inspector Services</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button
              color="inherit"
              onClick={handleAccountMenuOpen}
              endIcon={<ArrowDropDown />}
              startIcon={<AccountCircle />}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              {user ? user.name : 'Account'}
            </Button>
            <Menu anchorEl={accountMenuEl} open={Boolean(accountMenuEl)} onClose={handleAccountMenuClose}>
              {!user ? (
                <>
                  <MenuItem onClick={handleAccountMenuClose} component={Link} to="/register">Register</MenuItem>
                  <MenuItem onClick={handleAccountMenuClose} component={Link} to="/login">Login</MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: '64px' }}>
        <Container>
          <Routes>
            <Route path="/home" element={<Tutorials />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/rating" element={<Rating />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
      </Box>

      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
