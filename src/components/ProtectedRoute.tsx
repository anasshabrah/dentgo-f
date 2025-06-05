// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./ui/Loader";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, initializing } = useAuth();

  // While auth is initializing, show a full-screen spinner
  if (initializing) return <Loader fullscreen />;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
