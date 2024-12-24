import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import About from './components/About';
import Contact from './components/Contact';
import Classic from './components/Classic';
import Survival from './components/Survival';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Leaderboard from './components/Leaderboard';
import PrivateRouter from './utils/PrivateRouter';
import logo from './assets/logo.png';
import backgroundImage from './assets/background.jpeg';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const ConditionalNavbar = () => {
    const location = useLocation();
    const hideNavbarPaths = ['/Classic', '/Survival'];
    return !hideNavbarPaths.includes(location.pathname) ? <Navbar darkMode={darkMode} /> : null;
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  useEffect(() => {
    document.title = "City Parolla";
    const favicon = document.querySelector("link[rel*=icon]");
    if (favicon) {
      favicon.href = logo;
    }

    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <div style={{ position: 'relative', minHeight: '120vh' }}>
          <div 
            style={{ 
              backgroundImage: `url(${backgroundImage})`, 
              backgroundSize: '74%',
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center',
              opacity: 0.2,
              position: 'absolute', 
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1 
            }}
          />
          <ConditionalNavbar darkMode={darkMode} />
          <button 
            onClick={toggleSettings} 
            style={{ 
              position: 'fixed', 
              bottom: '2%', 
              right: '2%', 
              background: 'none', 
              border: '#eee', 
              cursor: 'pointer', 
              fontSize: '40px' 
            }} 
          >
            ⚙️
          </button>
          <Routes>
            <Route path="/" element={<Home toggleSettings={toggleSettings} darkMode={darkMode} />} />
            <Route path="/about" element={<About darkMode={darkMode} />} />
            <Route path="/contact" element={<Contact darkMode={darkMode} />} />
            <Route path="/classic" element={<Classic darkMode={darkMode} />} />
            <Route path="/leaderboard" element={<Leaderboard darkMode={darkMode} />} />
            <Route path="/survival" element={
              <PrivateRouter>
                <Survival darkMode={darkMode} />
              </PrivateRouter>
            } />
            <Route path="/sign-in" element={<SignIn darkMode={darkMode} />} />
            <Route path="/sign-up" element={<SignUp darkMode={darkMode} />} />
          </Routes>
          <Settings 
            show={showSettings} 
            toggleDarkMode={toggleDarkMode} 
            darkMode={darkMode} 
            toggleSettings={toggleSettings}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
