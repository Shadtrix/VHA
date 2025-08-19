// App.jsx
import './App.css';
import './components/chatbot.css';

import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, Container, IconButton, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Avatar, CssBaseline, Breadcrumbs, Link } from '@mui/material';
import { AccountCircle, ArrowDropDown, Menu as MenuIcon } from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, NavLink as RouterNavLink, Link as RouterLink, useLocation } from 'react-router-dom';

import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import Home from './pages/Home';
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
import Profile from './pages/Profile';

import ChatbotWidget from './components/ChatbotWidget';
import UserContext from './contexts/UserContext';
import { ChatbotProvider } from './contexts/ChatbotContext.jsx';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* -------------------------- THEME (brand look) -------------------------- */
const theme = createTheme({
  shape: { borderRadius: 14 },
  palette: {
    mode: 'light',
    primary: { main: '#0D63F3' },      // brand blue
    secondary: { main: '#00C2A8' },    // teal accent
    background: { default: '#f7f9fc' }
  },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'Noto Sans',
      'Apple Color Emoji',
      'Segoe UI Emoji'
    ].join(','),
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0.2 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 16
        }
      }
    },
    MuiContainer: { defaultProps: { maxWidth: 'lg' } }
  }
});

/* ----------- Elevation + glass blur when the page is scrolled ----------- */
function ElevateAppBar({ children }) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 8 });
  return React.cloneElement(children, {
    elevation: trigger ? 8 : 0,
    sx: {
      ...children.props.sx,
      background: trigger
        ? `linear-gradient(90deg, ${alpha('#0D63F3', 0.9)} 0%, ${alpha('#00C2A8', 0.9)} 100%)`
        : `linear-gradient(90deg, ${alpha('#0D63F3', 0.75)} 0%, ${alpha('#00C2A8', 0.75)} 100%)`,
      backdropFilter: 'saturate(160%) blur(10px)',
      transition: 'all .25s ease'
    }
  });
}


/* ----------------------- Reusable styled NavLink btn -------------------- */
const NavBtn = ({ to, children }) => (
  <Button
    component={RouterNavLink}
    to={to}
    sx={{
      color: 'common.white',
      opacity: 0.95,
      px: 1.25,
      '&:hover': { opacity: 1, transform: 'translateY(-1px)' },
      transition: 'all .2s ease',
      position: 'relative',
      '&.active::after': {
        content: '""',
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 4,
        height: 3,
        borderRadius: 3,
        backgroundColor: 'secondary.main'
      }
    }}
  >
    {children}
  </Button>
);

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function AppContent() {
  const { user, setUser } = React.useContext(UserContext);
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/home';

  const [servicesEl, setServicesEl] = React.useState(null);
  const [accountEl, setAccountEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const openServices = (e) => setServicesEl(e.currentTarget);
  const closeServices = () => setServicesEl(null);

  const openAccount = (e) => setAccountEl(e.currentTarget);
  const closeAccount = () => setAccountEl(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  const initials =
    user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'AC';

  const resolveAvatar = (url) => {
    if (!url) return null;
    return /^https?:\/\//i.test(url) ? url : API_BASE + url; // turn /uploads/... into absolute URL
  };
  const avatarSrc = user?.avatarUrl ? resolveAvatar(user.avatarUrl) : null;

    function getBreadcrumbs(pathname) {
    if (pathname === "/annualfirecertification") {
      return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, color: "black" }}>
          <Link underline="hover" color="inherit" component={RouterLink} to="/services">
            Services
          </Link>
          <Typography sx={{ color: "primary.main", fontWeight: 700 }}>Annual Fire Certification</Typography>
        </Breadcrumbs>
      );
    }
    if (pathname === "/registeredinspectorservices") {
      return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, color: "black" }}>
          <Link underline="hover" color="inherit" component={RouterLink} to="/services">
            Services
          </Link>
          <Typography sx={{ color: "primary.main", fontWeight: 700 }}>Registered Inspector Services</Typography>
        </Breadcrumbs>
      );
    }
    if (pathname === "/mechanicalelectricalplumbing") {
      return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, color: "black" }}>
          <Link underline="hover" color="inherit" component={RouterLink} to="/services">
            Services
          </Link>
          <Typography sx={{ color: "primary.main", fontWeight: 700 }}>MEP Engineering</Typography>
        </Breadcrumbs>
      );
    }
    if (pathname === "/firesafetyengineering") {
      return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, color: "black" }}>
          <Link underline="hover" color="inherit" component={RouterLink} to="/services">
            Services
          </Link>
          <Typography sx={{ color: "primary.main", fontWeight: 700 }}>Fire Safety Engineering</Typography>
        </Breadcrumbs>
      );
    }
    return null;
  }

  return (
    <>
      <Box sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
        <ElevateAppBar>
          <AppBar position="fixed" color="transparent" sx={{ borderBottom: '1px solid', borderColor: alpha('#fff', 0.15) }}>
            <Toolbar disableGutters sx={{ px: { xs: 2, md: 3 }, justifyContent: 'space-between', gap: 2 }}>
              {/* Left : Logo + Desktop Nav */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <RouterLink to="/home" style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Put VHA.png in /public (root) */}
                  <img src="/VHA.png" alt="VHA Logo" style={{ height: 40 }} />
                </RouterLink>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                  <NavBtn to="/home">Home</NavBtn>
                  <NavBtn to="/reviews">Reviews</NavBtn>

                  <Button
                    color="inherit"
                    endIcon={<ArrowDropDown />}
                    onClick={openServices}
                    sx={{
                      color: 'common.white',
                      fontWeight: 700,
                      '&:hover': { transform: 'translateY(-1px)' },
                      transition: 'transform .2s ease'
                    }}
                  >
                    Services
                  </Button>
                  <Menu anchorEl={servicesEl} open={Boolean(servicesEl)} onClose={closeServices} slotProps={{ paper: { sx: { mt: 1, borderRadius: 2 } } }}>
                    <MenuItem onClick={closeServices} component={RouterLink} to="/mechanicalelectricalplumbing">
                      Mechanical, Electrical & Plumbing
                    </MenuItem>
                    <MenuItem onClick={closeServices} component={RouterLink} to="/firesafetyengineering">
                      Fire Safety Engineering
                    </MenuItem>
                    <MenuItem onClick={closeServices} component={RouterLink} to="/annualfirecertification">
                      Annual Fire Certification
                    </MenuItem>
                    <MenuItem onClick={closeServices} component={RouterLink} to="/registeredinspectorservices">
                      Registered Inspector Services
                    </MenuItem>
                  </Menu>

                  {user?.role === 'admin' && <NavBtn to="/admin">Admin</NavBtn>}
                </Box>
              </Box>

              {/* Right : Account + Mobile Menu */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {/* Desktop account */}
                <Button
                  color="inherit"
                  onClick={openAccount}
                  startIcon={
                    user ? (
                      <Avatar
                        src={avatarSrc || undefined}
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: alpha('#fff', 0.2),
                          color: 'common.white',
                          fontSize: 12,
                          border: '1px solid rgba(255,255,255,.35)'
                        }}
                      >
                        {!avatarSrc ? initials : null}
                      </Avatar>
                    ) : (
                      <AccountCircle />
                    )
                  }
                  endIcon={<ArrowDropDown />}
                  sx={{
                    color: 'common.white',
                    display: { xs: 'none', md: 'inline-flex' },
                    fontWeight: 800,
                    '&:hover': { transform: 'translateY(-1px)' },
                    transition: 'transform .2s ease'
                  }}
                >
                  {user ? user.name : 'Account'}
                </Button>
                <Menu anchorEl={accountEl} open={Boolean(accountEl)} onClose={closeAccount} slotProps={{ paper: { sx: { mt: 1, borderRadius: 2 } } }}>
                  {!user ? (
                    <>
                      <MenuItem onClick={closeAccount} component={RouterLink} to="/register">
                        Register
                      </MenuItem>
                      <MenuItem onClick={closeAccount} component={RouterLink} to="/login">
                        Login
                      </MenuItem>
                      <MenuItem onClick={closeAccount} component={RouterLink} to="/admin/login">
                        Admin Login
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={closeAccount} component={RouterLink} to="/profile">
                        Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </>
                  )}
                </Menu>

                {/* Mobile hamburger */}
                <IconButton color="inherit" onClick={() => setDrawerOpen(true)} sx={{ display: { xs: 'inline-flex', md: 'none' } }} aria-label="Open menu">
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
        </ElevateAppBar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { width: 300, p: 1.5, pb: 3, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 1 }}>
            <Avatar src={avatarSrc || undefined} sx={{ bgcolor: 'primary.main' }}>
              {!avatarSrc ? initials : null}
            </Avatar>
            <Typography fontWeight={700}>{user ? user.name : 'Guest'}</Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <List>
            {[
              { to: '/home', label: 'Home' },
              { to: '/reviews', label: 'Reviews' }
            ].map((item) => (
              <ListItem key={item.to} disablePadding onClick={() => setDrawerOpen(false)}>
                <ListItemButton component={RouterLink} to={item.to}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDrawerOpen(false)} component={RouterLink} to="/mechanicalelectricalplumbing">
                <ListItemText primary="MEP Engineering" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDrawerOpen(false)} component={RouterLink} to="/firesafetyengineering">
                <ListItemText primary="Fire Safety Engineering" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDrawerOpen(false)} component={RouterLink} to="/annualfirecertification">
                <ListItemText primary="Annual Fire Certification" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDrawerOpen(false)} component={RouterLink} to="/registeredinspectorservices">
                <ListItemText primary="Registered Inspector Services" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            {user?.role === 'admin' && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => setDrawerOpen(false)} component={RouterLink} to="/admin">
                  <ListItemText primary="Admin" />
                </ListItemButton>
              </ListItem>
            )}
            <Divider sx={{ my: 1 }} />
            {user && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => setDrawerOpen(false)} component={RouterLink} to="/profile">
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
            )}
            {!user ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setDrawerOpen(false)} component={RouterLink} to="/register">
                    <ListItemText primary="Register" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setDrawerOpen(false)} component={RouterLink} to="/login">
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setDrawerOpen(false)} component={RouterLink} to="/admin/login">
                    <ListItemText primary="Admin Login" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                    handleLogout();
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Drawer>


        <Box component="main" sx={{ flex: 1, pt: '84px', pb: 5 }}>
          <Container sx={{ pt: 2 }}>
            {getBreadcrumbs(location.pathname)}
          </Container>
          <Box
            sx={{
              background: `radial-gradient(1000px 500px at 10% -10%, ${alpha(theme.palette.secondary.main, 0.25)}, transparent 60%),
                 radial-gradient(1000px 500px at 90% -10%, ${alpha(theme.palette.primary.main, 0.25)}, transparent 60%)`,
              py: { xs: 4, md: 6 },
              mb: 2
            }}
          >
            <Container>
              <Typography variant="h4" fontWeight={800} color="text.primary">
                Build safely. Certify confidently.
              </Typography>
              <Typography mt={1} color="text.secondary">
                Engineering & fire safety services for modern facilities.
              </Typography>


              {isHome && (
                <Carousel autoPlay infiniteLoop>
                  <div>
                    <img src="/backgroundimg.png" />
                    <p className="legend">First slide</p>
                  </div>
                  <div>
                    <img src="/VHA.png" />
                    <p className="legend">Second slide</p>
                  </div>
                </Carousel>
              )}
            </Container>
          </Box>

          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
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
              <Route path="/rating" element={<Rating />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Container>
        </Box>


        <Box
          component="footer"
          sx={{
            py: 3,
            background: `linear-gradient(90deg, ${alpha('#0D63F3', 0.08)} 0%, ${alpha('#00C2A8', 0.08)} 100%)`,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} VHA Pte. Ltd. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button component={RouterLink} to="/home" size="small" variant="outlined">
                Home
              </Button>
              <Button component={RouterLink} to="/reviews" size="small" variant="outlined">
                Reviews
              </Button>
              <Button component={RouterLink} to="/annualfirecertification" size="small" variant="outlined">
                AFC
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <ChatbotWidget />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatbotProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <AppContent />
        </Router>
      </ChatbotProvider>
    </ThemeProvider>
  );
}

export default App;
