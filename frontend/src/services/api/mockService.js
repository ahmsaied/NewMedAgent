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
  },
  getDiagnosisHistory: async () => {
    await delay(400);
    return [
      { id: 'd1', title: 'Acute Gastritis', date: 'Oct 05, 2023', folder: 'General', confidence: 92 },
      { id: 'd2', title: 'Atrial Fibrillation', date: 'Sep 28, 2023', folder: 'Cardiology', confidence: 98 },
      { id: 'd3', title: 'Migraine Tracking', date: 'Sep 12, 2023', folder: 'Neurology', confidence: 85 },
      { id: 'd4', title: 'Post-Op Follow-up', date: 'Aug 30, 2023', folder: 'Cardiology', confidence: 95 }
    ];
  },
  getClinicalRefs: async () => {
    await delay(300);
    return [
      { id: 1, title: 'Management of Acute Coronary Syndromes', source: 'NEJM', link: '#' },
      { id: 2, title: 'Guidelines for Hypertension Treatment', source: 'AHA Journals', link: '#' }
    ];
  },
  sendMessage: async (userId, text) => {
    await delay(1800); // Simulate AI 'Thinking' time
    
    const input = text.toLowerCase();
    let response = {
      id: Date.now() + 1,
      sender: 'ai',
      text: "I've received your inquiry. I'm cross-referencing this with your medical profile and recent data points. Could you tell me more about how long you've been feeling this way?",
      tags: ['AI Analysis Active', 'Consulting Datasets'],
      time: 'Just now'
    };

    if (input.includes('chest') || input.includes('heart')) {
      response.text = "I've detected you're mentioning chest-related symptoms. While I analyze your most recent ECG, please note that if the pain is radiating to your arm or jaw, you should use the Emergency button immediately.";
      response.tags = ['Critical Monitoring', 'Urgent Context'];
    } else if (input.includes('fever') || input.includes('headache')) {
      response.text = "A fever or persistent headache can be due to various factors. Have you experienced any light sensitivity or neck stiffness? I'm checking if there's a seasonal outbreak in your area.";
      response.tags = ['Epidemiological Check', 'Symptomatic Review'];
    } else if (input.includes('prescription') || input.includes('pill')) {
      response.text = "Checking your medication history... I see you have an active prescription for Lisinopril. Are you asking about a potential interaction or a refill?";
      response.tags = ['Medication Safety', 'Interaction Check'];
    }

    return response;
  }
};
