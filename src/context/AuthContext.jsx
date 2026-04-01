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
        setIsAuthenticated(!!token); 
      } catch (error) {
        console.error("Auth status verification failed", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: null,
    patientId: '#NEW-882-902',
    bloodType: '',
    weight: '',
    height: '',
    gender: 'M',
    nationalId: '',
    insuranceData: {
      providerName: '',
      memberId: '',
      groupNumber: '',
      planType: '',
      cardImage: null
    },
    isRegistered: false
  });

  const updateUser = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const login = (token) => {
    localStorage.setItem('medagent_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('medagent_token');
    setIsAuthenticated(false);
    setUserData({
      firstName: '',
      lastName: '',
      email: '',
      profileImage: null,
      patientId: '#NEW-882-902',
      bloodType: '',
      weight: '',
      height: '',
      gender: 'M',
      nationalId: '',
      insuranceData: {
        providerName: '',
        memberId: '',
        groupNumber: '',
        planType: '',
        cardImage: null
      },
      isRegistered: false
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, userData, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
