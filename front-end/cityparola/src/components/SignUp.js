import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const SignUp = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthTokens, setUser } = useContext(AuthContext);

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users/', {
        email,
        username,
        password
      });

      if (response.status === 201) {
        const tokenResponse = await axios.post('http://localhost:8000/api/token/', {
          username,
          password
        });

        if (tokenResponse.status === 200 && tokenResponse.data.access) {
          localStorage.setItem('authTokens', JSON.stringify(tokenResponse.data));
          setAuthTokens(tokenResponse.data);
          setUser(jwtDecode(tokenResponse.data.access));
          navigate('/');
        } else {
          setErrorMessage('Registration succeeded, but failed to retrieve token');
        }
      } else {
        setErrorMessage('Registration failed');
      }
    } catch (err) {
      console.error('Error during registration:', err.response || err.message);
      setErrorMessage('This username or email is already in use');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`signup-container ${darkMode ? 'dark' : 'light'}`}>
      <div className={`signup-box ${darkMode ? 'dark' : 'light'}`}>
        <h1 className="signup-title">Sign Up</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        
        <form onSubmit={handleSignUpSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
        
        <div className="signin-link">
          <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
