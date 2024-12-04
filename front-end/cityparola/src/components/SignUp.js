import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import axios from 'axios';

const SignUp = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(2);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post('http://localhost:8000/api/users', { email });
      if (response.data.exists) {
        setErrorMessage('This email is already in use');
      } else {
        setStep(2);
      }
    } catch (err) {
      setErrorMessage('Error checking email');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    setEmail("a1223@gmail.com");

    try {
      const response = await axios.post('http://localhost:8000/api/users/', {
        email,
        username,
        password
      });

      setToken(response.data.token);
      localStorage.setItem('authToken', response.data.token);
      navigate('/');
    } catch (err) {
      setErrorMessage('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`signup-container ${darkMode ? 'dark' : 'light'}`}>
      <div className={`signup-box ${darkMode ? 'dark' : 'light'}`}>
        <h1 className="signup-title">Sign Up</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
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
            <div className="button-container">
              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Checking...' : 'Next'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSignUpSubmit}>
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
        )}
        
        <div className="signin-link">
          <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
