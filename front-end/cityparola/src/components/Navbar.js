import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = ({ darkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <Link to="/" className="logo-link">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <div className="flex-spacer"></div>
      
      <button 
        className={`hamburger ${darkMode ? 'dark' : ''}`} 
        onClick={toggleSidebar}
      >
        &#9776;
      </button>
      
      <div className={`nav-links ${isSidebarOpen ? 'sidebar-open' : ''} ${darkMode ? 'dark' : ''}`}>
        <span className="menu-title">Menu</span>
        <Link to="/" className={`nav-link nav1 ${darkMode ? 'dark' : ''}`} onClick={toggleSidebar}>Leaderboard</Link>
        <Link to="/about" className={`nav-link ${darkMode ? 'dark' : ''}`} onClick={toggleSidebar}>About Us</Link>
        <Link to="/contact" className={`nav-link ${darkMode ? 'dark' : ''}`} onClick={toggleSidebar}>Contact</Link>
        
        <div className="auth-buttons">
          <Link to="/sign-in">
            <button className="sign-in-button" onClick={toggleSidebar}>Sign In</button>
          </Link>
          <Link to="/register">
            <button className="register-button" onClick={toggleSidebar}>Register</button>
          </Link>
        </div>
      </div>
      
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </nav>
  );
};

export default Navbar;
