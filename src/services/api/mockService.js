import { prescriptions, doctors, scanHistory, emergencyFacilities, chatHistory, emergencyContacts } from '../../data/mockData';

/**
 * Mock Service API Layer
 * This simulates a real backend connection and maps data from the DB to our frontend models.
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const MockService = {
  getPrescriptions: async () => { 
    await delay(600); 
    return prescriptions; 
  },
  getDoctors: async () => { 
    await delay(500); 
    return doctors; 
  },
  getScanHistory: async () => { 
    await delay(700); 
    return scanHistory; 
  },
  getEmergencyFacilities: async () => { 
    await delay(300); 
    return emergencyFacilities; 
  },
  getChatHistory: async () => { 
    await delay(400); 
    return chatHistory; 
  },
  getEmergencyContacts: async () => {
    await delay(200);
    return emergencyContacts;
  }
};
