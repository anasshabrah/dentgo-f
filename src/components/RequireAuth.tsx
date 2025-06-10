// src/components/RequireAuth.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/Loader";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, initializing, fetchUser } = useAuth();
  const [triedFetch, setTriedFetch] = useState(false);
  const location = useLocation();

  // Trigger session check once
  useEffect(() => {
    if (!triedFetch) {
      fetchUser().finally(() => setTriedFetch(true));
    }
  }, [triedFetch, fetchUser]);

  if (!triedFetch || initializing) {
    return <Loader fullscreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
