import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/me`, {
          credentials: 'include',
          mode: 'cors',
        });
        if (!response.ok) {
          console.error('AuthContext: Failed to fetch user (status:', response.status, ')');
          setUser(null);
        } else {
          const data = await response.json();
          setUser(data?.user || null);
        }
      } catch (error) {
        console.error('AuthContext: Error fetching user:', error);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

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
