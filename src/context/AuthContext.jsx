import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const API_BASE = process.env.REACT_APP_SERVER_URL || '';

  const fetchUser = async () => {
    try {
      let response = await fetch(`${API_BASE}/api/users/me`, {
        credentials: 'include',
        mode: 'cors',
      });

      if (response.status === 401) {
        const refreshResp = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResp.ok) {
          response = await fetch(`${API_BASE}/api/users/me`, {
            credentials: 'include',
            mode: 'cors',
          });
        }
      }

      if (response.ok) {
        const data = await response.json();
        setUser(data?.user || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('AuthContext: Error fetching user:', error);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      const { logout } = await import('../api/auth');
      await logout();
      setUser(null);
    } catch (error) {
      console.error('AuthContext: Error logging out:', error);
      setUser(null);
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        initializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
