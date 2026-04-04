import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEmergencyNumber } from '../utils/emergencyNumbers';

import { MockService } from '../services/api/mockService';

const EmergencyContext = createContext({});

export function EmergencyProvider({ children }) {
  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState(null);
  const [emergencyNumber, setEmergencyNumber] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('medagent_emergency_contacts');
    return saved ? JSON.parse(saved) : [];
  });

  // Trigger on INITIAL APP LOAD (Global)
  useEffect(() => {
    determineLocation();
    
    // Only fetch from MockService if we have NO existing data in storage
    const saved = localStorage.getItem('medagent_emergency_contacts');
    if (!saved || JSON.parse(saved).length === 0) {
      MockService.getEmergencyContacts().then(setContacts);
    }
  }, []);

  // Persist contacts whenever they change
  useEffect(() => {
    localStorage.setItem('medagent_emergency_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (newContact) => {
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = (id, updatedData) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const removeContact = (idToRemove) => {
    setContacts(prev => prev.filter(c => c.id !== idToRemove));
  };

  const determineLocation = async () => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      fallbackToIpLocation();
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lon: longitude });
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&email=medagent_app@example.com`);
            if (!response.ok) throw new Error("Reverse geocoding failed");
            const data = await response.json();
            const countryCode = data.address?.country_code;
            setEmergencyNumber(getEmergencyNumber(countryCode));
          } catch (apiError) {
            console.warn("Geocoding API failed, falling back to IP based location", apiError);
            await fallbackToIpLocation();
          } finally {
            setIsLocating(false);
          }
        },
        async (geoError) => {
          console.warn("GPS Permission Denied. Falling back to IP detection.", geoError);
          await fallbackToIpLocation();
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } catch (e) {
      console.error(e);
      fallbackToIpLocation();
    }
  };

  const fallbackToIpLocation = async () => {
    try {
      const resp = await fetch('https://ipapi.co/json/');
      if (!resp.ok) throw new Error("IP Geolocation failed");
      const data = await resp.json();
      const countryCode = data.country_code?.toLowerCase();
      setEmergencyNumber(getEmergencyNumber(countryCode));
    } catch (error) {
       console.error("All location methods failed. Using 122.");
       setEmergencyNumber('122'); // User requested default
    } finally {
      setIsLocating(false);
    }
  };

  const callAmbulance = () => {
    if (emergencyNumber) {
      window.location.href = `tel:${emergencyNumber}`;
    }
  };

  return (
    <EmergencyContext.Provider value={{ callAmbulance, isLocating, error, emergencyNumber, coordinates, contacts, addContact, updateContact, removeContact }}>
      {children}
    </EmergencyContext.Provider>
  );
}

export const useEmergency = () => useContext(EmergencyContext);
