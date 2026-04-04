import React, { useState, useMemo } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Search, Filter, Zap, Send, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { DoctorCard } from '../components/contact/DoctorCard';
import { useTranslation } from 'react-i18next';
import { useHealthData } from '../controllers/useHealthData';
import { MockService } from '../services/api/mockService';
import { PageHeader } from '../components/ui/PageHeader';
import { DataState } from '../components/ui/DataState';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ContactDoctor() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: doctors, loading, error } = useHealthData(MockService.getDoctors);
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Form States
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Derive unique specialties
  const uniqueSpecialties = useMemo(() => {
    if (!doctors) return ['All'];
    const specs = doctors.map(d => d.specialty);
    return ['All', ...new Set(specs)];
  }, [doctors]);

  // Filter Doctors
  const filteredDoctors = useMemo(() => {
    if (!doctors) return [];
    return doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpec = selectedSpecialtyFilter === 'All' || doc.specialty === selectedSpecialtyFilter;
      return matchesSearch && matchesSpec;
    });
  }, [doctors, searchTerm, selectedSpecialtyFilter]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;
    
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSending(false);
    setIsSent(true);
    
    // Reset after some time
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
      setTopic('');
    }, 4000);
  };

  return (
    <DataState loading={loading} error={error} loadingText="Finding available doctors...">
      <div className="flex flex-col gap-6 h-full max-w-6xl mx-auto pt-6 px-4 md:px-6">
        <PageHeader 
          title={t('doctors.title')} 
          subtitle={t('doctors.subtitle')} 
          className="mb-4"
        />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Doctor Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center bg-white border border-slate-200/50 rounded-2xl px-5 py-3 gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.02)] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all group">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                className="bg-transparent border-none focus:ring-0 text-base w-full placeholder:text-slate-500/60 outline-none font-bold text-slate-900" 
                placeholder={t('doctors.search')} 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-8 py-3 bg-white border border-slate-200/50 text-[#191c1e] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap active:scale-[0.98] ${selectedSpecialtyFilter !== 'All' ? 'border-blue-200 bg-blue-50/30' : ''}`}
              >
                <Filter className={`w-5 h-5 ${selectedSpecialtyFilter !== 'All' ? 'text-blue-500' : ''}`} />
                {selectedSpecialtyFilter === 'All' ? t('doctors.filter') : selectedSpecialtyFilter}
              </button>
              
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-30 p-2 overflow-hidden"
                  >
                    {uniqueSpecialties.map(spec => (
                      <button
                        key={spec}
                        onClick={() => { setSelectedSpecialtyFilter(spec); setIsFilterOpen(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedSpecialtyFilter === spec ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-[#191c1e] hover:bg-blue-50'}`}
                      >
                        {spec}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doc => (
                  <motion.div
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DoctorCard doc={doc} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 text-center">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                      <Search className="w-8 h-8 text-slate-300" />
                   </div>
                   <h4 className="text-xl font-bold text-slate-600">No doctors found</h4>
                   <p className="text-slate-400 text-sm mt-2 max-w-xs">We couldn't find any specialist matching "{searchTerm}" or the selected specialty.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Quick Message */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-[2.5rem] p-8 flex flex-col min-h-[600px] lg:sticky lg:top-24 border border-blue-100/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Zap className="w-24 h-24 text-blue-500" />
          </div>

          <AnimatePresence mode="wait">
            {!isSent ? (
               <motion.div 
                 key="form"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col h-full z-10"
               >
                 <div className="mb-8">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[var(--color-primary)] shadow-[0_8px_16px_rgba(0,0,0,0.03)] mb-6 border border-slate-100">
                     <Zap className="w-6 h-6 fill-[var(--color-primary)] opacity-80" />
                   </div>
                   <h3 className="text-2xl font-extrabold tracking-tight text-[#191c1e] mb-2">{t('doctors.quickMessage')}</h3>
                   <p className="text-[#434656] text-sm font-medium leading-relaxed">{t('doctors.quickMessageDesc')}</p>
                 </div>
                 
                 <form onSubmit={handleSendMessage} className="flex-1 flex flex-col">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3 ml-1">{t('doctors.topic')}</label>
                   <select 
                     value={topic}
                     onChange={(e) => setTopic(e.target.value)}
                     className="w-full bg-white border border-slate-200/50 rounded-2xl mb-4 text-sm py-4 px-5 focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none font-bold text-[#191c1e] shadow-sm"
                   >
                     <option value="" disabled>{t('doctors.other')}</option>
                     <option>{t('doctors.symptom')}</option>
                     <option>{t('doctors.prescription')}</option>
                     <option>{t('doctors.testResults')}</option>
                     <option>{t('doctors.other')}</option>
                   </select>

                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3 ml-1">{t('doctors.messageContent')}</label>
                   <textarea 
                     required
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     className="flex-1 w-full min-h-[200px] bg-white border border-slate-200/50 rounded-[2rem] p-5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none mb-6 placeholder-slate-400 font-bold text-slate-900 shadow-sm leading-relaxed" 
                     placeholder="e.g. I have been experiencing dull chest tightness after morning exercise for the past 3 days..."
                   ></textarea>
                   
                   <button 
                     disabled={isSending || !message}
                     className={`w-full py-5 bg-[var(--color-primary)] text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all shadow-[0_12px_24px_-8px_rgba(37,99,235,0.4)] relative ${isSending || !message ? 'opacity-70 grayscale' : 'hover:translate-y-[-2px] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:scale-[0.98]'}`}
                   >
                     {isSending ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                       <>
                         {t('doctors.sendRequest')}
                         <Send className="w-4 h-4 ml-1" />
                       </>
                     )}
                   </button>
                 </form>
               </motion.div>
            ) : (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center justify-center h-full text-center py-20 z-10"
               >
                 <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-500/20">
                    <CheckCircle className="w-12 h-12" />
                 </div>
                 <h3 className="text-3xl font-black text-[#191c1e] mb-4">Request Sent!</h3>
                 <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-[240px]">
                   A physician will review your request and reach out in less than 15 mins.
                 </p>
                 <button 
                   onClick={() => setIsSent(false)}
                   className="mt-12 text-[var(--color-primary)] font-black uppercase tracking-widest text-xs border-b-2 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] transition-all"
                 >
                   Send another message
                 </button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Floating Context Section */}
      <section className="max-w-6xl mx-auto mt-12 mb-12 w-full p-8 lg:p-12 bg-white/60 border border-slate-100/60 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] group">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-100/40 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-200/40 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-orange-100/40 blur-[100px] rounded-full pointer-events-none group-hover:bg-orange-200/40 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-full text-[11px] font-black tracking-widest uppercase mb-8 shadow-lg shadow-blue-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              {t('doctors.smartDispatching')}
            </div>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-[#191c1e] mb-6 leading-[1.1]">{t('doctors.cantDecide')}</h2>
            <p className="text-slate-500 text-lg lg:text-xl leading-relaxed max-w-2xl font-bold">
              {t('doctors.cantDecideDesc')}
            </p>
          </div>
          <div className="flex-shrink-0">
            <button 
              onClick={() => navigate('/')}
              className="group flex items-center gap-6 px-12 py-8 bg-[#191c1e] text-white rounded-full font-black text-xl hover:bg-blue-600 transition-all shadow-2xl shadow-black/10 hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              {t('doctors.startTriage')}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>
      </div>
    </DataState>
  );
}
