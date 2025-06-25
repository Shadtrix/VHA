import './App.css';
import { Container, AppBar, Toolbar, Typography,   Button, Menu, MenuItem,} from '@mui/material';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link }
  from 'react-router-dom';
import Tutorials from './pages/Tutorials';
import Rating from './pages/Rating';
function App() {
const [anchorEl, setAnchorEl] = useState(null);
const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
const handleCloseMenu = () => setAnchorEl(null);
  return (
<Router>
  <AppBar position="static" className="AppBar">
    <Container>
      <Toolbar disableGutters>
        <Link to="/home" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/src/public/VHA.png" alt="VHA Logo"
            style={{ height: '40px', marginLeft: '-100%',}}/>
        </Link>
            <Link to="/tutorials" ><Typography>Reviews</Typography></Link>
            <Link to="/rating"><Typography>Rating</Typography></Link>
            <Button color="inherit" onClick={handleOpenMenu}> Services </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/service1">
                MEP Engineering
              </MenuItem>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/service2">
                Fire Safety Engineering
              </MenuItem>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/service2">
                Annual Fire Certification
              </MenuItem>
              <MenuItem onClick={handleCloseMenu} component={Link} to="/service2">
                Registered Inspector Services
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Routes>
          <Route path={"/home"} element={<Tutorials />} />
          <Route path={"/tutorials"} element={<Tutorials />} />
          <Route path={"/rating"} element={<Rating />} />
        </Routes>
      </Container>
    </Router>
  );
}
export default App;