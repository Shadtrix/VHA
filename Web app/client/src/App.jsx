import './App.css';
import './components/chatbot.css'; // ✅ Chatbot CSS import

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Container
} from '@mui/material';

import { AccountCircle, ArrowDropDown } from '@mui/icons-material';
import { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Tutorials from './pages/Tutorials';
import Rating from './pages/Rating';
import Register from './pages/Register';
import Login from './pages/Login';
import RegisteredInspectorServices from './pages/RegisteredInspectorServices';
import ReviewAdmin from './pages/ReviewAdmin';
import ReviewForm from './pages/ReviewForm';
import AnnualFireCertification from './pages/AnnualFireCertification';
import FireSafetyEngineering from './pages/FireSafetyEngineering';
import MechanicalElectricalPlumbing from './pages/MechanicalElectricalPlumbing';
import Admin from './pages/Admin';
import AdminLogin from './pages/Adminlog';
import AdminSignUp from './pages/Adminsign';
import AdminInbox from './pages/AdminInbox';
import EmailContent from './pages/EmailContent';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChatbotWidget from './components/ChatbotWidget'; // ✅ Chatbot component
import UserContext from './contexts/UserContext';
import { ChatbotProvider } from './contexts/ChatbotContext.jsx';
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
            <Link to="/reviews" style={{ textDecoration: 'none', color: 'white' }}>
              <Typography>Reviews</Typography>
            </Link>
            <Button color="inherit" onClick={handleOpenMenu}>Services</Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/mechanicalelectricalplumbing">MEP Engineering</MenuItem>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/firesafetyengineering">Fire Safety Engineering</MenuItem>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/annualfirecertification">Annual Fire Certification</MenuItem>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/registeredinspectorservices">Registered Inspector Services</MenuItem>
            </Menu>

            {user?.role === 'admin' && (
              <Link to="/admin" style={{ textDecoration: 'none', color: 'white' }}>
                <Typography>Admin</Typography>
              </Link>
            )}
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
                  <MenuItem onClick={handleAccountMenuClose} component={Link} to="/admin/login">Admin Login</MenuItem>
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
            <Route path="/reviews" element={<Tutorials />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/Inbox" element={<AdminInbox />} />
            <Route path="/email/:id" element={<EmailContent />} />
            <Route path="/admin/register" element={<AdminSignUp />} />
            <Route path="/registeredinspectorservices" element={<RegisteredInspectorServices />} />
            <Route path="/admin/reviews" element={<ReviewAdmin />} />
            <Route path="/submit-review" element={<ReviewForm />} />
            <Route path="/annualfirecertification" element={<AnnualFireCertification />} />
            <Route path="/firesafetyengineering" element={<FireSafetyEngineering />} />
            <Route path="/mechanicalelectricalplumbing" element={<MechanicalElectricalPlumbing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Container>
      </Box>

      <ToastContainer autoClose={3000} hideProgressBar={false} />

      {}
      <ChatbotWidget />
    </>
  );
}


function App() {
  return (
    <ChatbotProvider>
      <Router>
        <AppContent />
      </Router>
    </ChatbotProvider>
  );
}

export default App;
