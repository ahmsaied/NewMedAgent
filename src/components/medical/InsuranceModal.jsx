import React, { useState } from 'react';
import { X, Shield, Camera, Check, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { UniversalImagePicker } from '../ui/UniversalImagePicker';

export function InsuranceModal({ isOpen, onClose }) {
  const { userData, updateUser } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(false);
  const [formData, setFormData] = useState({
    providerName: userData.insuranceData?.providerName || '',
    memberId: userData.insuranceData?.memberId || '',
    groupNumber: userData.insuranceData?.groupNumber || '',
    planType: userData.insuranceData?.planType || '',
    cardImage: userData.insuranceData?.cardImage || null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (img) => {
    setFormData(prev => ({ ...prev, cardImage: img }));
    setIsScanning(true);
    setScanError(false);
    
    // Simulated AI extraction with conservative failure logic
    setTimeout(() => {
      // 90% failure rate to strictly enforce manual entry requirement as requested
      const isSuccess = Math.random() > 0.9;
      
      if (isSuccess) {
        setFormData(prev => ({
          ...prev,
          providerName: 'United Healthcare Plus',
          memberId: 'UHC-8812003',
          groupNumber: 'GA-992-11',
          planType: 'Elite HMO'
        }));
        setScanError(false);
      } else {
        // STRICTLY leave fields empty on failure
        setFormData(prev => ({
          ...prev,
          providerName: '',
          memberId: '',
          groupNumber: '',
          planType: ''
        }));
        setScanError(true);
      }
      setIsScanning(false);
    }, 3200);
  };

  const handleSave = () => {
    updateUser({ insuranceData: formData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-[110] w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#191c1e] tracking-tight">Insurance Details</h2>
                {userData.isRegistered && (
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5 animate-pulse">Premium Policy Holder</p>
                )}
                {!userData.isRegistered && (
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Coverage Information</p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            {/* Scan Card Feature */}
            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] flex flex-col items-center gap-4 text-center">
              <p className="text-sm font-bold text-slate-600 leading-relaxed">
                Automatically fill details by scanning your physical medical card.
              </p>
              <UniversalImagePicker onImageSelect={handleImageSelect} className="w-full">
                <div className="w-full py-4 rounded-2xl border-2 border-dashed border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 group">
                  <Camera className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-black text-blue-600 uppercase tracking-widest">
                    {formData.cardImage ? "Card Scanned • Change View" : "Scan / Upload Card"}
                  </span>
                </div>
              </UniversalImagePicker>
              {formData.cardImage && (
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-blue-200 shadow-sm mt-2 relative group isolate">
                  <img src={formData.cardImage} alt="Card Preview" className="w-full h-full object-cover" />
                  
                  {isScanning && (
                    <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-md flex flex-col items-center justify-center z-20 overflow-hidden">
                      {/* Scanning Light Bar Animation */}
                      <motion.div 
                        initial={{ top: '-10%' }}
                        animate={{ top: '110%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-4 bg-white/40 blur-md shadow-[0_0_40px_rgba(255,255,255,1)] z-30 pointer-events-none"
                      />
                      
                      <div className="bg-white/90 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 relative z-40">
                        <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">MedAgent AI Digitizing...</span>
                      </div>
                    </div>
                  )}

                  {scanError && (
                    <div className="absolute inset-0 bg-red-600/60 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6 text-center">
                      <div className="bg-white p-3 rounded-2xl shadow-xl mb-3">
                        <X className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="text-white text-xs font-black uppercase tracking-widest mb-1">Extraction Failed</p>
                      <p className="text-white/80 text-[10px] font-bold leading-tight">Could not identify details. Please enter manually below.</p>
                      <button 
                        onClick={() => setIsScanning(false) || setScanError(false)}
                        className="mt-4 text-[9px] font-black uppercase tracking-widest text-white border border-white/40 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {!isScanning && (
                    <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Preview Active</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Manual Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Provider Name</label>
                <input 
                  type="text" 
                  name="providerName"
                  value={formData.providerName}
                  onChange={handleChange}
                  placeholder="e.g. Blue Cross" 
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-300 focus:bg-white outline-none transition-all font-bold text-[#191c1e]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Member ID</label>
                <input 
                  type="text" 
                  name="memberId"
                  value={formData.memberId}
                  onChange={handleChange}
                  placeholder="e.g. MED-12345" 
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-300 focus:bg-white outline-none transition-all font-bold text-[#191c1e]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Group Number</label>
                <input 
                  type="text" 
                  name="groupNumber"
                  value={formData.groupNumber}
                  onChange={handleChange}
                  placeholder="e.g. #99-AX-4" 
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-300 focus:bg-white outline-none transition-all font-bold text-[#191c1e]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Type</label>
                <input 
                  type="text" 
                  name="planType"
                  value={formData.planType}
                  onChange={handleChange}
                  placeholder="e.g. Platinum PPO" 
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-300 focus:bg-white outline-none transition-all font-bold text-[#191c1e]"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 pt-0 flex gap-4 shrink-0">
            <button 
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all border border-slate-200/50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] py-4 px-6 rounded-2xl font-bold bg-blue-600 text-white hover:shadow-xl hover:shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save Insurance Data
            </button>
          </div>
        </motion.div>
      </div>

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
