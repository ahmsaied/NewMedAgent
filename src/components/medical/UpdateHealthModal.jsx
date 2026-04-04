import React, { useState } from 'react';
import { Activity, X, Info, Save, Plus, Trash2, Heart, FileText, Pill, Bolt, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { theme } from '../../theme/tokens';

export function UpdateHealthModal({ isOpen, onClose }) {
  const { userData, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    weight: userData.weight || '',
    height: userData.height || '',
    bloodType: userData.bloodType || '',
    nationalId: userData.nationalId || '',
    organDonor: userData.organDonor || '',
    advanceDirectives: userData.advanceDirectives || '',
    allergies: userData.allergies || [],
    prescriptions: userData.prescriptions || [],
    chronicConditions: userData.chronicConditions || [],
    emergencyAccessibility: userData.emergencyAccessibility || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAllergy = () => {
    setFormData(prev => ({
      ...prev,
      allergies: [
        ...prev.allergies,
        { id: Date.now().toString(), name: '', severity: 'Mild' }
      ]
    }));
  };

  const handleRemoveAllergy = (id) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a.id !== id)
    }));
  };

  const handleAddCondition = () => {
    setFormData(prev => ({
      ...prev,
      chronicConditions: [...prev.chronicConditions, { id: Date.now(), name: '', description: '' }]
    }));
  };

  const handleConditionChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const handleRemoveCondition = (id) => {
    setFormData(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter(c => c.id !== id)
    }));
  };

  const handleAllergyChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const handleSave = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });
    
    updateUser({
      ...formData,
      lastVerified: formattedDate
    });
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
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight text-left text-[var(--color-on-surface)]">Update Health Data</h3>
                    {userData.isRegistered && (
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-0.5 animate-pulse text-left">Premium Health Account</p>
                    )}
                    {!userData.isRegistered && (
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5 text-left">Vitals & Identification</p>
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
              <div className="p-8 md:p-10 pt-4 overflow-y-auto flex-1 custom-scrollbar space-y-10">
                {/* Basic Vitals Grid */}
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
                  <Select 
                    label="Blood Type" 
                    value={formData.bloodType} 
                    options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                    onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                  />
                  <Input 
                    label="National ID" 
                    value={formData.nationalId} 
                    name="nationalId"
                    onChange={handleChange}
                    placeholder="e.g. 29901011234567" 
                  />
                </div>
                
                {/* Structured Allergies Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-inter text-[var(--color-on-surface-variant)] ml-2">Known Allergies</label>
                    <button 
                      onClick={handleAddAllergy}
                      className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-700 transition-all active:scale-95 shadow-sm"
                    >
                      <Plus className="w-3 h-3" /> ADD ALLERGY
                    </button>
                  </div>
                  
                  {formData.allergies.length === 0 ? (
                    <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                      <p className="text-xs font-bold text-slate-400 italic opacity-60">No allergies listed. Secure medical ID requires documentation.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.allergies.map((allergy) => (
                        <div key={allergy.id} className="flex flex-col sm:flex-row items-center gap-4 transition-all">
                          <div className="flex-1 w-full relative group">
                            <input 
                              type="text" 
                              value={allergy.name}
                              onChange={(e) => handleAllergyChange(allergy.id, 'name', e.target.value)}
                              placeholder="e.g. Eleanor Fitzwilliam"
                              className="w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_8px_16px_rgba(0,0,0,0.03)] p-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-bold text-[#191c1e] placeholder:text-slate-400/60"
                            />
                          </div>
                          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                            <div className="w-32">
                              <Select
                                value={allergy.severity}
                                options={['Mild', 'Moderate', 'Severe']}
                                onChange={(e) => handleAllergyChange(allergy.id, 'severity', e.target.value)}
                                className="!gap-0"
                              />
                            </div>
                            <button 
                              onClick={() => handleRemoveAllergy(allergy.id)}
                              className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm hover:shadow-red-500/20"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Chronic Conditions</label>
                      <button 
                        onClick={handleAddCondition}
                        className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all border border-blue-100 uppercase tracking-widest shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Condition
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.chronicConditions.map((condition) => (
                        <div key={condition.id} className="relative bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-[2rem] shadow-sm group">
                          <div className="absolute top-4 right-4 z-10">
                            <button 
                              onClick={() => handleRemoveCondition(condition.id)}
                              className="w-10 h-10 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm hover:shadow-red-500/20"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                                <Activity className="w-3.5 h-3.5" /> Condition Name
                              </label>
                              <input 
                                type="text" 
                                value={condition.name}
                                onChange={(e) => handleConditionChange(condition.id, 'name', e.target.value)}
                                placeholder="e.g. Type 1 Diabetes"
                                className="w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-sm p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-bold text-[#191c1e] placeholder:text-slate-400/40"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                                <FileText className="w-3.5 h-3.5" /> Medical Description
                              </label>
                              <textarea 
                                value={condition.description}
                                onChange={(e) => handleConditionChange(condition.id, 'description', e.target.value)}
                                rows={2}
                                placeholder="e.g. Stable on insulin pump. Diagnosed 2015."
                                className="w-full bg-white/30 backdrop-blur-md border border-white/40 shadow-inner p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all font-medium text-[#191c1e] placeholder:text-slate-400/40 text-sm resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.chronicConditions.length === 0 && (
                        <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center gap-3 bg-slate-50/30">
                          <Activity className="w-10 h-10 text-slate-300" />
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No chronic conditions listed</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Organ Donor Status Row */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Organ Donor Status</label>
                    <div className="bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_8px_16_rgba(0,0,0,0.03)] p-4 rounded-[1.5rem] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          formData.organDonor === 'Registered Donor' ? 'bg-emerald-50' : 'bg-red-50'
                        }`}>
                          <Heart className={`w-5 h-5 ${
                            formData.organDonor === 'Registered Donor' ? 'text-emerald-500 fill-emerald-500/20' : 'text-red-500 fill-red-500/20'
                          }`} />
                        </div>
                        <span className={`font-bold ${
                          formData.organDonor === 'Registered Donor' ? 'text-emerald-600' : 'text-red-600'
                        }`}>{formData.organDonor || 'Not Registered'}</span>
                      </div>
                      <div className="w-48">
                        <Select
                          value={formData.organDonor}
                          options={['Registered Donor', 'Not Registered', 'Unknown']}
                          onChange={(e) => setFormData({...formData, organDonor: e.target.value})}
                          className="!gap-0"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.organDonor === 'Registered Donor' && (
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Advance Directives</label>
                      <div className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-[1.5rem] shadow-inner flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-80 px-1">
                          <FileText className="w-3.5 h-3.5" /> Documentation for first responders
                        </div>
                        <textarea 
                          value={formData.advanceDirectives}
                          onChange={(e) => setFormData({...formData, advanceDirectives: e.target.value})}
                          rows={3}
                          placeholder="e.g. DNR (Do Not Resuscitate) Authorized, Medical Power of Attorney: Elena Grace (+1 234 567 890)"
                          className="w-full bg-transparent border-none outline-none font-medium text-[#191c1e] placeholder:text-slate-400/50 text-sm resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* Medications Summary Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Medications</label>
                      <a 
                        href="/medicines" 
                        onClick={(e) => { e.preventDefault(); window.location.href='/medicines'; }}
                        className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm uppercase tracking-widest"
                      >
                        <Bolt className="w-3 h-3" /> Manage Portal
                      </a>
                    </div>
                    <div className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-[1.5rem] shadow-sm flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100/50">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {formData.prescriptions.length} Active {formData.prescriptions.length === 1 ? 'Medication' : 'Medications'}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Clinical Tracking Enabled</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>



                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3 text-left">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-blue-700 leading-relaxed">
                      This data is used by emergency services to provide you with faster care. Keep it accurate.
                    </p>
                    <p className="text-[10px] text-blue-600 mt-1 font-bold italic opacity-80 uppercase tracking-widest">
                      Updating will refresh your "Last Verified" date to today.
                    </p>
                  </div>
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
