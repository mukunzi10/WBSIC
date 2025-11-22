import React, { createContext, useState, useEffect } from 'react';
import { verifyToken } from '../authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // Verify stored token on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await verifyToken(token);
          setUser(response.user);
        } catch (error) {
          console.warn('Token invalid or expired:', error);
          localStorage.removeItem('authToken');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  // Login and store token
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('authToken', jwtToken);
  };

  // Logout and clear storage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
