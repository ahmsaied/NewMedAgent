import React, { useState } from 'react';
import { Activity, X, Info, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function UpdateHealthModal({ isOpen, onClose }) {
  const { userData, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    weight: userData.weight || '',
    height: userData.height || '',
    bloodType: userData.bloodType || '',
    organDonor: userData.organDonor || 'No',
    allergies: userData.allergies || '',
    medications: userData.medications || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg overflow-hidden pointer-events-auto bg-white/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 shadow-[0_40px_80px_rgba(0,0,0,0.15)] flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 md:p-10 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm border border-blue-200/50">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Update Health Data</h3>
                    {userData.isRegistered && (
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-0.5 animate-pulse">Premium Health Account</p>
                    )}
                    {!userData.isRegistered && (
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Vitals & Identification</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-8 md:p-10 pt-4 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Weight (kg)" 
                    value={formData.weight} 
                    name="weight"
                    onChange={handleChange}
                    placeholder="e.g. 75" 
                  />
                  <Input 
                    label="Height (cm)" 
                    value={formData.height} 
                    name="height"
                    onChange={handleChange}
                    placeholder="e.g. 180" 
                  />
                  <Input 
                    label="Blood Type" 
                    value={formData.bloodType} 
                    name="bloodType"
                    onChange={handleChange}
                    placeholder="e.g. A+" 
                  />
                  <Input 
                    label="Organ Donor" 
                    value={formData.organDonor} 
                    name="organDonor"
                    onChange={handleChange}
                    placeholder="Yes/No" 
                  />
                </div>
                
                <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-blue-700 leading-relaxed">
                    This data is used by emergency services to provide you with faster care. Keep it accurate.
                  </p>
                </div>
              </div>

              {/* Pinned Footer */}
              <div className="p-8 md:p-10 pt-0 flex gap-4 shrink-0 mt-4">
                <Button variant="secondary" className="flex-1 py-4 text-sm font-bold" onClick={onClose}>Cancel</Button>
                <Button variant="primary" className="flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2" onClick={handleSave}>
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </motion.div>
          </div>
        </React.Fragment>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </AnimatePresence>
  );
}
