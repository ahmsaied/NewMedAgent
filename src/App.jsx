import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TopNavLayout } from './components/TopNavLayout';
import ChatDashboard from './pages/ChatDashboard';
import Medicines from './pages/Medicines';
import MedicalID from './pages/MedicalID';
import ScanImaging from './pages/ScanImaging';
import Emergency from './pages/Emergency';
import ContactDoctor from './pages/ContactDoctor';

import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TopNavLayout />}>
        {/* Diagnose / Home Page (Public) */}
        <Route index element={<ChatDashboard />} />
        
        {/* Secure Pages */}
        <Route path="contact" element={<ProtectedRoute><ContactDoctor /></ProtectedRoute>} />
        <Route path="medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
        <Route path="scans" element={<ProtectedRoute><ScanImaging /></ProtectedRoute>} />
        <Route path="scan-imaging" element={<ProtectedRoute><ScanImaging /></ProtectedRoute>} />
        <Route path="id" element={<ProtectedRoute><MedicalID /></ProtectedRoute>} />
        <Route path="emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
