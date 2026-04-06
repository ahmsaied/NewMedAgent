import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getEmergencyNumber } from '../utils/emergencyNumbers';
import { useAuth } from './AuthContext';

import { MockService } from '../services/api/mockService';

const EmergencyContext = createContext({});

export function EmergencyProvider({ children }) {
  const { userData } = useAuth();
  const userEmail = userData?.email || 'guest';
  const storageKey = `medagent_emergency_contacts_${userEmail}`;

  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState(null);
  const [emergencyNumber, setEmergencyNumber] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [contacts, setContacts] = useState([]);
  const loadedFor = useRef(null);

  // Load contacts when user changes
  useEffect(() => {
    // 1. Mark as loading (reset loadedFor)
    loadedFor.current = null;
    
    // 2. Fetch the correct data
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setContacts(JSON.parse(saved));
    } else {
      // Start with empty list for new users to prevent "cached demo data" confusion
      setContacts([]);
    }
    
    // 3. Update the owner ref ONLY AFTER the fetch has been initiated
    // (Actual state update will happen in the next render)
    loadedFor.current = userEmail;
  }, [storageKey, userEmail]);

  useEffect(() => {
    determineLocation();
  }, []);

  // Persist contacts whenever they change
  useEffect(() => {
    // CRITICAL: ONLY save if:
    // 1. We have a valid user (not guest)
    // 2. The CURRENT contacts state definitely belongs to the CURRENT user
    if (userEmail && userEmail !== 'guest' && loadedFor.current === userEmail) {
      localStorage.setItem(storageKey, JSON.stringify(contacts));
    }
    // We EXCLUDE storageKey and userEmail from dependencies here 
    // so this effect ONLY fires when the contacts state is updated.
    // This prevents "stale" contacts from being saved into "new" storage keys during transitions.
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
