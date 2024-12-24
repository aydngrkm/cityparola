import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const savedTokens = localStorage.getItem('authTokens');
    return savedTokens ? JSON.parse(savedTokens) : null;
  });

  const [user, setUser] = useState(() => {
    return authTokens && typeof authTokens.access === 'string'
      ? jwtDecode(authTokens.access)
      : null;
  });

  useEffect(() => {
    if (authTokens) {
      localStorage.setItem('authTokens', JSON.stringify(authTokens));
      const decodedUser = jwtDecode(authTokens.access);
      setUser(decodedUser);
    } else {
      localStorage.removeItem('authTokens');
      setUser(null);
    }
  }, [authTokens]);

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: e.target.username.value,
        password: e.target.password.value
      });

      if (response.status === 200 && response.data && response.data.access) {
        setAuthTokens(response.data);
        const decodedUser = jwtDecode(response.data.access);
        setUser(decodedUser);
      } else {
        alert('Invalid login credentials or unexpected response');
        setAuthTokens(null);
        setUser(null);
      }
    } catch (err) {
      alert('An error occurred while logging in');
      setAuthTokens(null);
      setUser(null);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
  };

  const contextData = {
    authTokens,
    setAuthTokens,
    user,
    setUser,
    loginUser,
    logoutUser
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
