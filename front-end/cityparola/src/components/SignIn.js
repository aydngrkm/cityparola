import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SignIn.css';
import axios from 'axios';

const SignIn = ({ darkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleSignIn = (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      setErrorMessage('Please enter both username and password');
    } else {
      console.log('Signing in:', username);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/users', {
        username,
        password
      });
      console.log(response.data);
    } catch (err) {
      setError(err.message || 'An Error Occured');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`signin-container ${darkMode ? 'dark' : 'light'}`}>
      <div className={`signin-box ${darkMode ? 'dark' : 'light'}`}>
        <h1 className="signin-title">Sign In</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
            <button type="submit" className="signin-button">
              Sign In
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
