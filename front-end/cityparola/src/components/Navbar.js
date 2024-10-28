import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css'; // Import the CSS file

const Navbar = ({ darkMode }) => {
  return (
    <nav className={darkMode ? 'navbar dark' : 'navbar'}>
      <Link to="/" className="logo-link">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <div className="flex-spacer"></div>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${darkMode ? 'dark' : ''}`}>Leaderboard</Link>
        <Link to="/about" className={`nav-link ${darkMode ? 'dark' : ''}`}>About Us</Link>
        <Link to="/contact" className={`nav-link ${darkMode ? 'dark' : ''}`}>Contact</Link>
        <Link to="/sign-in">
          <button className="sign-in-button">Sign In</button>
        </Link>
        <Link to="/register">
          <button className="register-button">Register</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
