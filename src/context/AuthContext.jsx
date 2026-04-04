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
      scanHistory: [
        { id: 1, type: 'Chest X-Ray / Post-Op', status: 'Completed', details: 'Analyzed Oct 24, 2023 • 14.2 MB DICOM', insights: ['AI Insight: Normal Lung Expansion', 'Verified by Dr. Aris'], imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABc1Llg7jPsb0VMTv5PcCEqJmFmRkk0PE3JkXCmgrL0kmvIRAyA7tf-_oH38Fxu7PF-u3sPzYEkqudeYDB0iUuZJhnpPU8yeX8S5cEmNvAdb7ec98TCJJ5dknn6UmTN_dVnuwrZZViMWMuGkuoDx9GN85E_0Ncx2zJZSE2M1JeSPV78lcOtGgG0fTon9AKulQQo4I-EFl3DKYH5akxsuXTZktv5K2hFK0KOXYngYVsrGkruX4tIH66WZAW8SsBP2MhYUHt-A_vFI2-' },
        { id: 2, type: 'Head MRI / Routine', status: 'Processing', details: 'Analyzed Oct 21, 2023 • 88.5 MB DICOM', insights: [], imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCtEmAekhz5gLd9HthE6VcfB2cLl2rfOZsxvaVFJv3eMwycF1DfsLOMR9evGq6vxKcy4zro44Ig_U60pC0zuF71ZRJO1hGxK8ETLsUaxGFQGCU5ACOHcWQhQzGV612O_GS4TwbqfUzOwI_4j2cnkW-fSIuokiFk5AC-SC6moWcw7NGScGTdnuF1ikVh08JQ0opJ-Y5teMEq2YbW4QO4nGk8SsYlUIiaXQeJ1be0weIupKSjPWEEYxRzcVJmUzE-hrUQ9RbXbrmgE9g' },
        { id: 3, type: 'Lumbar Spine / L4-L5', status: 'Anomaly Detected', details: 'Analyzed Oct 15, 2023 • 22.1 MB DICOM', insights: ['AI Insight: L4-L5 Compression Noted', 'Urgent Review Requested'], imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV6NJnoTMWnq3Qo5-nFZ6KGyO7U85apjZqj6ds7IDVn1To00b4eCl2c0IqqPpUofFVr_5Xa42ol1x4cpJhUFDTgHLTMkdj4VdcWpSRJJ2euPzBQBUnVhmPrI0DerRxhyJrKLWzltBc_6Wavqx5Y66UW-aErxVktLyNBl8ujVqOGtUBe0RyMY_MxTjwpaqIuippk4GtTkNs9gw1XFH9qt3R5JztGH4UIdIEoB7Z5uAsjTYkt_VYmp2OeoWJ5aNK_sC0lHSPWB5yk9GH' }
      ],
      isRegistered: false
    };
  });

  // Persist userData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('medagent_user_data', JSON.stringify(userData));
  }, [userData]);

  const updateUser = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
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
