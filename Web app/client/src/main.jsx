import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useState, useEffect } from 'react';
import UserContext from './contexts/UserContext';

function Root() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <App />
    </UserContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
