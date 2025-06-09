// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { loginWithGoogle as loginWithGoogleAPI } from "../api/auth";
import { API_BASE } from "../config";

export interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1) Try to load current user; if 401, try refresh
  const fetchUser = async () => {
    try {
      let res = await fetch(`${API_BASE}/api/users/me`, {
        credentials: "include",
      });

      if (res.status === 401) {
        // Access token missing/expired → try refresh
        const refresh = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (refresh.ok) {
          // Retry fetching user
          res = await fetch(`${API_BASE}/api/users/me`, {
            credentials: "include",
          });
        }
      }

      if (res.ok) {
        const body = await res.json().catch(() => ({}));
        // some endpoints return { user } vs. just user
        setUser((body as any).user ?? (body as any));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("AuthContext.fetchUser error:", err);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithGoogle = async (credential: string) => {
    setError(null);
    try {
      const userData = await loginWithGoogleAPI(credential);
      setUser(userData);
    } catch (err: any) {
      console.error("AuthContext.loginWithGoogle error:", err);
      if (
        err.message.includes("AbortError") ||
        err.message.includes("NetworkError")
      ) {
        setError(
          "Google login failed due to browser settings (e.g. Private Browsing). Please try again in a normal window or enable third-party cookies."
        );
      } else {
        setError(err.message || "Google login failed");
      }
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("AuthContext.logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        error,
        setError,
        loginWithGoogle,
        logout,
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
