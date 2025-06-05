import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { loginWithGoogle as loginWithGoogleAPI } from "../api/auth";
import { API_BASE } from "../config";

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
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  initializing: boolean;
  error: string | null;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1) Try to fetch the current user; if 401, attempt refresh
  const fetchUser = async () => {
    try {
      // Call /api/users/me directly (no short‐circuit).
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
          // if refresh succeeded, try /api/users/me again
          response = await fetch(`${API_BASE}/api/users/me`, {
            credentials: "include",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      if (response.ok) {
        // — Instead of calling response.json() directly, first read response as text
        const text = await response.text();
        try {
          const parsed = JSON.parse(text) as { user: User };
          setUser(parsed.user || null);
        } catch {
          // If parsing fails, assume no valid JSON user object → not authenticated
          setUser(null);
        }
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

  const login = (userData: User) => {
    setUser(userData);
  };

  const loginWithGoogle = async (credential: string) => {
    setError(null);
    try {
      const userData = await loginWithGoogleAPI(credential);
      setUser(userData);
    } catch (err: any) {
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
      const { logout: apiLogout } = await import("../api/auth");
      await apiLogout();
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

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
