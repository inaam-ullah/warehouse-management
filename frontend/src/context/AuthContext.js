// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Notification from '../components/Notification';
import Spinner from '../components/Spinner';
import { logoutUser } from '../utils/authUtils';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Token decoding error:', error);
        logoutUser();
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      handleSuccess('Successfully logged in!');
    } catch (error) {
      console.error('Token decoding error during login:', error);
      handleError('Invalid token, please log in again.');
    }
  };

  const logout = () => {
    logoutUser();
    handleSuccess('Successfully logged out!');
  };

  const handleError = (error) => {
    setError(error);
    setOpen(true);
  };

  const handleSuccess = (message) => {
    setSuccess(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, handleError, handleSuccess }}>
      {children}
      {error && <Notification message={error} severity="error" open={open} handleClose={handleClose} />}
      {success && <Notification message={success} severity="success" open={open} handleClose={handleClose} />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
