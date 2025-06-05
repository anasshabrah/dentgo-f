// src/components/RequireAuth.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./ui/Loader";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  // While auth is initializing, show a full-screen spinner
  if (initializing) return <Loader fullscreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
