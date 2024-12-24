import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';
import AuthContext from '../context/AuthContext';

const Navbar = ({ darkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [flag, setFlag] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(() => {
    const getUsername = async () => {
       try {
            const response = await axios.get(`http://localhost:8000/api/users/${user.user_id}/`);
            setUsername(response.data.username);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    getUsername();
  }, []);

  useEffect(() => {
  }, [user]);

  useEffect (() => {
    if (flag) {
      setFlag(false);
    }
  }, [flag])

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
        <Link to="/leaderboard" className={`nav-link ${darkMode ? 'dark' : ''}`} onClick={toggleSidebar}>Leaderboard</Link>
        <Link to="/about" className={`nav-link ${darkMode ? 'dark' : ''}`} onClick={toggleSidebar}>About Us</Link>
        <Link to="/contact" className={`nav-link ${darkMode ? 'dark' : ''}`} onClick={toggleSidebar}>Contact</Link>

        <div className="auth-buttons">
          {user ? (
            <>
              <button className="sign-out-button" onClick={logoutUser}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <button className="sign-in-button" onClick={toggleSidebar}>Sign In</button>
              </Link>
              <Link to="/sign-up">
                <button className="sign-up-button" onClick={toggleSidebar}>Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </nav>
  );
};

export default Navbar;


/*
{user ? (
        <div className="username">
          <p>
            Hello {username}
          </p>
        </div>
      ) : (
        <h2>
          
        </h2>
      )}
*/