// src/context/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  loginWithGoogle as loginWithGoogleAPI,
  fetchCsrfToken,
  logout as apiLogout,
} from "@/api/auth";
import { API_BASE } from "@/config";

interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  login: (userData: User) => void;
  loginWithGoogle: (arg: string | { credential: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  isAuthenticated: boolean;
  initializing: boolean;
  error: string | null;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setInitializing(true);
    try {
      let response = await fetch(`${API_BASE}/api/users/me`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 401) {
        // try refresh
        try {
          const csrfToken = await fetchCsrfToken();
          const refreshResp = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "x-csrf-token": csrfToken,
            },
          });
          if (!refreshResp.ok) {
            setUser(null);
            return;
          }
          // retry fetch-me
          response = await fetch(`${API_BASE}/api/users/me`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          setUser(null);
          return;
        }
      }

      if (response.ok) {
        const { user: fetched } = (await response.json()) as {
          user: User;
        };
        setUser(fetched || null);
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

  const login = (userData: User) => setUser(userData);

  const loginWithGoogle = async (arg: string | { credential: string }) => {
    setError(null);
    const credential = typeof arg === "string" ? arg : arg.credential;
    try {
      const userData = await loginWithGoogleAPI(credential);
      setUser(userData);
    } catch (err: any) {
      console.error("AuthContext: Google login error:", err);
      setError(err.message || "Google login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("AuthContext: Error logging out:", err);
    } finally {
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
        fetchUser,
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

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
