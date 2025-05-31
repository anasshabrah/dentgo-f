import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const PrivateRoute = () => {
  const { isAuthenticated, initializing } = useAuth();

  // While we’re checking the cookie session, show loading spinner
  if (initializing) {
    return <Loader />;
  }

  // Only render protected content if logged in
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/LetsYouIn" replace />;
};

export default PrivateRoute;
