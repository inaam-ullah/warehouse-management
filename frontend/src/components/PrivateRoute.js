// src/components/PrivateRoute.js
import React, { useContext } from 'react';

import { Navigate } from 'react-router-dom';

import Spinner from './Spinner';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Spinner />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
