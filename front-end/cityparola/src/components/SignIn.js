import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const SignIn = ({ darkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setAuthTokens, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    if (username === '' || password === '') {
      setErrorMessage('Please enter both username and password');
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password
      });

      if (response.status === 200 && response.data && response.data.access) {
        setAuthTokens(response.data);
        console.log(response.data);
        setUser(jwtDecode(response.data.access));
        navigate('/');
      } else {
        alert('Invalid login credentials or unexpected response');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`signin-container ${darkMode ? 'dark' : 'light'}`}>
      <div className={`signin-box ${darkMode ? 'dark' : 'light'}`}>
        <h1 className="signin-title">Sign In</h1>
        {errorMessage && <p className="error-message">Username or Password is invalid</p>}
        <form onSubmit={handleSignIn}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="button-container">
            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="signup-link">
          <p>Don't have an account? <Link to="/sign-up">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
