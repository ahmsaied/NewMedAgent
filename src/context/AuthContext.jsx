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

  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('medagent_user_data');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse saved user data", e);
      }
    }
    return {
      firstName: '',
      lastName: '',
      email: '',
      profileImage: null,
      patientId: '#NEW-882-902',
      bloodType: 'Unknown',
      weight: '',
      height: '',
      gender: 'M',
      nationalId: '',
      allergies: [],
      prescriptions: [],
      chronicConditions: [],
      organDonor: '',
      advanceDirectives: '',
      lastVerified: '-',
      emergencyAccessibility: 'In the event of an emergency, medical professionals can access your vital data using the QR code on your MedAgent physical card or via the secure emergency bypass on your smartphone lock screen. Your data is encrypted and access is logged for your security.',
      insuranceData: {
        providerName: '',
        memberId: '',
        groupNumber: '',
        planType: '',
        cardImage: null
      },
      scanHistory: [],
      isRegistered: false
    };
  });

  // Persist userData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('medagent_user_data', JSON.stringify(userData));
  }, [userData]);

  const updateUser = (newData) => {
    setUserData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('medagent_user_data', JSON.stringify(updated));
      return updated;
    });
  };

  const login = (token) => {
    localStorage.setItem('medagent_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('medagent_token');
    localStorage.removeItem('medagent_user_data');
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
      allergies: [],
      prescriptions: [],
      chronicConditions: [],
      organDonor: '',
      advanceDirectives: '',
      lastVerified: '-',
      emergencyAccessibility: 'In the event of an emergency, medical professionals can access your vital data using the QR code on your MedAgent physical card or via the secure emergency bypass on your smartphone lock screen. Your data is encrypted and access is logged for your security.',
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
