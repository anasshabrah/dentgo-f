import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/me`, {
      credentials: 'include',
      mode: 'cors',
    })
      .then(r => (r.ok ? r.json() : null))
      .then(data => setUser(data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setInitializing(false));
  }, []);

  const login = userData => setUser(userData);

  const logout = async () => {
    await import('../api/auth').then(m => m.logout());
    setUser(null);
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
