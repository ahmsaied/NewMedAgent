import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking a token from localStorage or parsing a cookie
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('medagent_token');
        // TEMP BYPASS: Forcing true so you can preview the UI without logging in
        setIsAuthenticated(true); 
      } catch (error) {
        console.error("Auth status verification failed", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (token) => {
    localStorage.setItem('medagent_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('medagent_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
