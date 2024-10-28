import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './components/Home';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import About from './components/About';
import Contact from './components/Contact'
import logo from './assets/logo.png';
import backgroundImage from './assets/background.jpeg';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
    <Router>
      <div style={{ position: 'relative', minHeight: '120vh' }}>
        <div 
          style={{ 
            backgroundImage: `url(${backgroundImage})`, 
            backgroundSize: '74%',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            opacity: 0.5,
            position: 'absolute', 
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1 
          }}
        />
        <Navbar darkMode={darkMode} />
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
          }}>
          ⚙️
        </button>
        <Routes>
          <Route path="/" element={<Home toggleSettings={toggleSettings} darkMode={darkMode} />} />
          <Route path="/about" element={<About darkMode={darkMode} />} />
          <Route path="/contact" element={<Contact darkMode={darkMode} />} />
        </Routes>
        <Settings 
          show={showSettings} 
          toggleDarkMode={toggleDarkMode} 
          darkMode={darkMode} 
          toggleSettings={toggleSettings}
        />
      </div>
    </Router>
  );
}

export default App;
