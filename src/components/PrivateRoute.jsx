// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const PrivateRoute = () => {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return <Loader />;
  }

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/LetsYouIn" replace />;
};

export default PrivateRoute;
