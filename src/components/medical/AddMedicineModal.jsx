import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Pill, Activity, Info, Save, Clock, Calendar, ThermometerSun, Divide as SunDim, Moon, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TimePicker } from '../ui/TimePicker';

export function AddMedicineModal({ isOpen, onClose, onAdd, editingPx }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    type: 'Chronic Care',
    desc: '',
    supply: '30',
    freq: 'Daily',
    time: 'Morning • 08:00 AM',
    category: 'primary'
  });
  const [customTime, setCustomTime] = useState('12:00');
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (editingPx) {
      setFormData({
        name: editingPx.name.split(' ')[0], // Base name
        dosage: editingPx.dosage || editingPx.name.split(' ').slice(1).join(' ') || '',
        type: editingPx.type || 'Chronic Care',
        desc: editingPx.desc || '',
        supply: editingPx.supply || '30',
        freq: editingPx.freq || 'Daily',
        time: editingPx.time,
        category: editingPx.category || 'primary'
      });
      
      const isCustomTime = editingPx.time.startsWith('Custom •');
      setIsCustom(isCustomTime);
      if (isCustomTime) {
        // Extract time (e.g., "10:30 PM") and convert back to 24h for the picker
        const timeStr = editingPx.time.split('• ')[1];
        const [time, ampm] = timeStr.split(' ');
        let [h, m] = time.split(':');
        let hour = parseInt(h);
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        setCustomTime(`${hour.toString().padStart(2, '0')}:${m}`);
      }
    } else {
      setFormData({
        name: '',
        dosage: '',
        type: 'Chronic Care',
        desc: '',
        supply: '30',
        freq: 'Daily',
        time: 'Morning • 08:00 AM',
        category: 'primary'
      });
      setIsCustom(false);
    }
  }, [editingPx, isOpen]);

  const handleSave = () => {
    if (!formData.name) return;
    
    let finalTime = formData.time;
    let finalCategory = formData.category;

    if (isCustom) {
      // Format 24h to 12h for display
      const [hours, minutes] = customTime.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      const formattedTime = `${h12}:${minutes} ${ampm}`;
      
      // Assign category based on hour
      let category = 'secondary';
      if (h >= 5 && h < 12) category = 'primary'; // Morning
      else if (h >= 12 && h < 17) category = 'tertiary'; // Afternoon/Noon
      
      finalTime = `Custom • ${formattedTime}`;
      finalCategory = category;
    }

    onAdd({
      ...(editingPx || {}),
      ...formData,
      time: finalTime,
      category: finalCategory,
      id: editingPx?.id || Date.now(),
      status: editingPx?.status || 'scheduled'
    });
    
    setFormData({
      name: '',
      dosage: '',
      type: 'Chronic Care',
      desc: '',
      supply: '30',
      freq: 'Daily',
      time: 'Morning • 08:00 AM',
      category: 'primary'
    });
    setIsCustom(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0c0d0e]/60 backdrop-blur-md z-[99998]"
          />
          
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-white/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 shadow-[0_40px_80px_rgba(0,0,0,0.15)] flex flex-col pointer-events-auto"
            >
              <div className="flex items-center justify-between p-8 border-b border-slate-100">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <Pill className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#191c1e] tracking-tight">
                      {editingPx ? 'Edit Prescription' : t('medicines.new')}
                    </h2>
                    <p className="text-sm font-bold text-slate-400">Clinical Data Integration Mode</p>
                  </div>
                  <button onClick={onClose} className="ml-auto p-3 hover:bg-slate-50 rounded-2xl transition-all">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2 md:col-span-1">
                     <Input 
                       label="Medicine Name" 
                       placeholder="e.g. Lisinopril"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                     />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                     <Input 
                       label="Dosage / Strength" 
                       placeholder="e.g. 10mg"
                       value={formData.dosage}
                       onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                     />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                     <Input 
                       label="Clinical Description" 
                       placeholder="e.g. Hypertension Support"
                       value={formData.desc}
                       onChange={(e) => setFormData({...formData, desc: e.target.value})}
                     />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                     <Input 
                       label="Current Supply (Days)" 
                       type="number"
                       placeholder="e.g. 30"
                       value={formData.supply}
                       onChange={(e) => setFormData({...formData, supply: e.target.value})}
                     />
                   </div>
                   <Select 
                     label="Medication Type"
                     value={formData.type}
                     options={['Chronic Care', 'Metabolic', 'Statins', 'Vitamins', 'Antibiotics']}
                     onChange={(e) => setFormData({...formData, type: e.target.value})}
                   />
                   <Select 
                     label="Frequency"
                     value={formData.freq}
                     options={['Daily', '2x Day', '3x Day', 'Weekly', 'As Needed']}
                     onChange={(e) => setFormData({...formData, freq: e.target.value})}
                   />
                   <Select 
                     label="Time of Day"
                     value={isCustom ? 'Custom Time...' : formData.time}
                     options={[
                       'Morning • 08:00 AM', 
                       'Noon • 01:00 PM', 
                       'Evening • 06:00 PM', 
                       'Nightly • 09:00 PM',
                       'Custom Time...'
                     ]}
                     onChange={(e) => {
                       if (e.target.value === 'Custom Time...') {
                         setIsCustom(true);
                       } else {
                         setIsCustom(false);
                         setFormData({
                           ...formData, 
                           time: e.target.value, 
                           category: e.target.value.includes('Morning') ? 'primary' : e.target.value.includes('Noon') ? 'tertiary' : 'secondary'
                         });
                       }
                     }}
                   />
                   
                   {isCustom && (
                     <motion.div 
                       initial={{ opacity: 0, x: -10 }} 
                       animate={{ opacity: 1, x: 0 }}
                       className="col-span-2 md:col-span-1"
                     >
                       <TimePicker 
                         label="Set Precise Time"
                         value={customTime}
                         onChange={(e) => setCustomTime(e.target.value)}
                       />
                     </motion.div>
                   )}
                </div>

                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-blue-700 leading-relaxed">
                    This medication will be added to your global clinical profile and scheduled in your daily timeline.
                  </p>
                </div>
              </div>

                <div className="p-8 border-t border-slate-100 flex gap-4">
                  <Button 
                    variant="ghost" 
                    className="flex-1" 
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-[2]" 
                    onClick={handleSave}
                  >
                    {editingPx ? 'Update Clinical Record' : 'Save Prescription'}
                  </Button>
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
          `}</style>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
