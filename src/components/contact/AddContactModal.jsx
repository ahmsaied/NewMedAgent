import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UniversalImagePicker } from '../ui/UniversalImagePicker';
import { useEmergency } from '../../context/EmergencyContext';

const IOS_RELATIONSHIPS = [
  'Mother', 'Father', 'Parent', 'Brother', 'Sister', 'Child', 
  'Friend', 'Spouse', 'Partner', 'Assistant', 'Manager', 'Primary Physician', 'Specialist'
];

export function AddContactModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { addContact } = useEmergency();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relation: 'Friend',
    image: null
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleImageSelect = (base64) => {
    setFormData({ ...formData, image: base64 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addContact({
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      relation: formData.relation,
      translatedRelationKey: formData.relation,
      avatar: formData.image,
      type: ['Primary Physician', 'Specialist'].includes(formData.relation) ? 'medical' : 'family'
    });

    setFormData({ name: '', phone: '', relation: 'Friend', image: null });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-3xl border border-white/40 shadow-2xl w-full max-w-md rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
          <h2 className="text-xl font-bold text-[#191c1e] tracking-tight">Add Emergency Contact</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center gap-3">
            <UniversalImagePicker 
              onImageSelect={handleImageSelect}
              currentImage={formData.image}
              shape="circle"
              label="Add Photo"
              showAvatars={true}
            />
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Emergency Contact Avatar</span>
              <p className="text-[10px] text-slate-400">Capture or upload photo</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                minLength={2}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Eleanor Fitzwilliam"
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_8px_16px_rgba(0,0,0,0.03)] p-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-bold text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
              <input 
                type="tel" 
                required
                pattern="[0-9]+"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                placeholder="e.g. 01000000000"
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_8px_16px_rgba(0,0,0,0.03)] p-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-bold text-[#191c1e]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Relationship</label>
              <div 
                onClick={() => setIsDropdownOpen(true)}
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_8px_16px_rgba(0,0,0,0.03)] p-4 rounded-[1.5rem] outline-none hover:shadow-[0_12px_24px_rgba(0,0,0,0.05)] transition-all font-bold text-[#191c1e] cursor-pointer flex justify-between items-center"
              >
                <span>{formData.relation}</span>
                <svg className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold tracking-tight p-4 rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-5 h-5" />
            Save Emergency Contact
          </button>
        </form>
      </div>

      {/* Relation Selection Modal */}
      {isDropdownOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-md transition-opacity"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="relative bg-white/90 backdrop-blur-3xl border border-white/40 shadow-2xl w-full max-w-sm rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
              <h3 className="text-lg font-extrabold text-[#191c1e] tracking-tight">Select Relationship</h3>
              <button 
                type="button"
                onClick={() => setIsDropdownOpen(false)} 
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2">
              {IOS_RELATIONSHIPS.map(rel => (
                <div 
                  key={rel} 
                  onClick={() => { setFormData({...formData, relation: rel}); setIsDropdownOpen(false); }}
                  className={`px-4 py-4 rounded-2xl cursor-pointer font-bold text-sm transition-all flex items-center justify-between ${formData.relation === rel ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-[#191c1e] hover:bg-blue-50/80 active:bg-blue-100'}`}
                >
                  {rel}
                  {formData.relation === rel && (
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
