import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
  from 'react-router-dom';
import Tutorials from './pages/Tutorials';
import Rating from './pages/Rating';
function App() {
  return (
    <Router>
      <AppBar position="static" className='AppBar'>
        <Container>
          <Toolbar disableGutters={true}>
            <Link to="/">
              <Typography variant="h6" component="div">
                VHA
              </Typography>
            </Link>
            <Link to="/tutorials" ><Typography>Tutorials</Typography></Link>
            <Link to="/rating"><Typography>Rating</Typography></Link>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Routes>
          <Route path={"/"} element={<Tutorials />} />
          <Route path={"/tutorials"} element={<Tutorials />} />
          <Route path="/rating" element={<Rating />} />
        </Routes>
      </Container>
    </Router>
  );
}
export default App;