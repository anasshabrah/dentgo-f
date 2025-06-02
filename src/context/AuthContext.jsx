// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginWithGoogle as loginWithGoogleAPI } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_SERVER_URL || "";

  // 1) Try to fetch the current user; if 401, attempt refresh
  const fetchUser = async () => {
    try {
      // SHORT‐CIRCUIT if no refreshToken cookie – no need to hit backend at all
      if (!document.cookie.includes("refreshToken=")) {
        setUser(null);
        setInitializing(false);
        return;
      }

      let response = await fetch(`${API_BASE}/api/users/me`, {
        credentials: "include",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 401) {
        // accessToken missing/expired → try refresh
        const refreshResp = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
        });

        if (refreshResp.ok) {
          response = await fetch(`${API_BASE}/api/users/me`, {
            credentials: "include",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      if (response.ok) {
        const data = await response.json();
        setUser(data?.user || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("AuthContext: Error fetching user:", err);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const loginWithGoogle = async (credential) => {
    setError(null);
    try {
      const user = await loginWithGoogleAPI(credential);
      setUser(user);
    } catch (err) {
      console.error("AuthContext: Google login error:", err);
      if (
        err.message.includes("AbortError") ||
        err.message.includes("NetworkError")
      ) {
        setError(
          "Google login may be blocked in Private Browsing Mode or due to browser settings. Please try using a standard browser window or allow third-party cookies."
        );
      } else {
        setError(err.message || "Google login failed. Please try again.");
      }
    }
  };

  const logout = async () => {
    try {
      const { logout } = await import("../api/auth");
      await logout();
      setUser(null);
    } catch (err) {
      console.error("AuthContext: Error logging out:", err);
      setUser(null);
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated,
        initializing,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
