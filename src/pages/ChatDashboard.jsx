import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Share, MoreVertical, BrainCircuit, Activity, Pill, Microscope, History, FolderOpen, Image as ImageIcon, Mic, Languages, ClipboardList, PlusCircle, Send, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { chatHistory } from '../data/mockData';
import femaleAvatar from '../assets/female-avatar.svg';
import maleAvatar from '../assets/male-avatar.svg';

export default function ChatDashboard() {
  const { t } = useTranslation();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  
  const userAvatarUrl = null; // Simulated DB response
  const userGender = 'F';
  const displayAvatar = userAvatarUrl || (userGender === 'F' ? femaleAvatar : maleAvatar);

  return (
    <div className="flex h-[calc(100vh-80px)] w-[calc(100%+2rem)] -mx-4 md:w-[calc(100%+4rem)] md:-mx-8 -mt-5 -mb-8 relative overflow-hidden bg-transparent">
      
      {/* Sidebar - Hidden on mobile (lg:flex) */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 h-full bg-glass backdrop-blur-2xl border-r border-ghost flex-col p-4 gap-2 z-30 overflow-y-auto">
        <div className="mb-6 px-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#434656] opacity-60 mb-4">{t('chat.history')}</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-[10px] font-bold text-[#434656] opacity-40 px-2 mb-2 uppercase tracking-tighter">{t('chat.today')}</h3>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 bg-white/60 backdrop-blur text-blue-600 rounded-xl shadow-[var(--shadow-liquid)] text-sm font-extrabold flex items-center gap-3 border border-white/80">
                  <Activity className="w-4 h-4 stroke-[3px]" />
                  <span className="truncate tracking-tight">Chest Pain Analysis</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-slate-500 hover:bg-glass hover:shadow-[var(--shadow-liquid)] rounded-xl text-sm font-semibold flex items-center gap-3 transition-all hover:translate-x-1">
                  <Pill className="w-4 h-4" />
                  <span className="truncate">Medication Review</span>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-[10px] font-bold text-[#434656] opacity-40 px-2 mb-2 uppercase tracking-tighter">{t('chat.yesterday')}</h3>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 text-slate-500 hover:bg-glass hover:shadow-[var(--shadow-liquid)] rounded-xl text-sm font-semibold flex items-center gap-3 transition-all hover:translate-x-1">
                  <Microscope className="w-4 h-4" />
                  <span className="truncate">Blood Test Results</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-slate-500 hover:bg-glass hover:shadow-[var(--shadow-liquid)] rounded-xl text-sm font-semibold flex items-center gap-3 transition-all hover:translate-x-1">
                  <History className="w-4 h-4" />
                  <span className="truncate">Annual Checkup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto p-4 rounded-2xl bg-glass-heavy border border-ghost shadow-inner">
          <p className="text-xs font-black tracking-tight text-blue-600 mb-2">{t('chat.healthReport')}</p>
          <p className="text-[11px] font-medium text-[#434656] mb-3 leading-tight">{t('chat.reportDesc')}</p>
          <button className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-extrabold hover:bg-opacity-90 transition-colors shadow-sm">
            {t('chat.viewReport')}
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative z-20">
        <header className="px-4 md:px-8 py-4 md:py-6 flex justify-between items-center bg-glass border-b border-ghost shadow-sm relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-on-primary-container)] shadow-[0_8px_16px_rgba(45,91,255,0.2)]">
                <BrainCircuit className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-[var(--color-on-surface)]">
                {t('chat.medagent')}
              </h1>
              <p className="text-[10px] md:text-xs text-[var(--color-on-surface-variant)] font-bold tracking-wide hidden sm:block">{t('chat.specialized')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 md:p-2.5 rounded-xl border border-ghost hover:bg-white/50 transition-colors bg-glass shadow-sm">
              <Share className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-on-surface-variant)]" />
            </button>
            <button className="p-2 md:p-2.5 rounded-xl border border-ghost hover:bg-white/50 transition-colors bg-glass shadow-sm">
              <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-on-surface-variant)]" />
            </button>
          </div>
        </header>

        <section className="flex-1 flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-8 scrollbar-hide pb-40 relative z-0">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex gap-3 md:gap-4 max-w-3xl w-full ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden shadow-sm border border-white/60 ${msg.sender === 'ai' ? 'bg-indigo-100 flex items-center justify-center' : 'bg-slate-200'}`}>
                {msg.sender === 'ai' 
                  ? <BrainCircuit className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" /> 
                  : <img src={displayAvatar} alt="User" className="w-full h-full object-cover" />
                }
              </div>
              <div className={`space-y-2 md:space-y-4 max-w-[85%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`${
                    msg.sender === 'ai' 
                    ? 'bg-glass-heavy p-4 md:p-6 rounded-2xl rounded-tl-none shadow-[var(--shadow-liquid)] border border-white/60'
                    : 'bg-primary-gradient text-white p-4 md:p-6 rounded-2xl rounded-tr-none shadow-[0_10px_25px_rgba(0,91,192,0.15)] border border-white/20'
                  }`}
                >
                  <p className={`text-sm leading-relaxed font-medium ${msg.sender === 'ai' ? 'text-[var(--color-on-surface)]' : ''} ${msg.file ? 'mb-4' : ''}`}>
                    {msg.text}
                  </p>
                  
                  {/* File Attachment */}
                  {msg.file && (
                    <div className="flex items-center gap-3 p-3 bg-white/70 backdrop-blur border border-white rounded-xl hover:bg-white transition-colors cursor-pointer group shadow-[var(--shadow-liquid)]">
                      <div className="w-10 h-10 rounded-lg bg-red-100/80 flex items-center justify-center text-red-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--color-on-surface)] truncate">{msg.file.name}</p>
                        <p className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">{msg.file.desc}</p>
                      </div>
                      <Download className="w-5 h-5 text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors" />
                    </div>
                  )}
                </div>
                
                {/* Meta details below message */}
                {msg.tags && (
                  <div className="flex flex-wrap gap-2">
                    {msg.tags.map((tag, idx) => (
                      <span key={idx} className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider border backdrop-blur ${
                        idx === 0 ? 'bg-white/50 border-white/80 text-slate-600 shadow-sm' : 'bg-blue-50/50 border-blue-100 text-[var(--color-primary)] shadow-sm'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {msg.time && (
                  <p className="text-[10px] font-bold tracking-wide text-[var(--color-on-surface-variant)] mr-1">{msg.time}</p>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Input Bar & Actions (Sticky Bottom) */}
        <footer className="absolute bottom-0 w-full p-4 md:p-8 pt-20 space-y-4 bg-gradient-to-t from-white/80 md:from-white/60 via-white/40 to-transparent pointer-events-none z-20 backdrop-blur-[2px]">
          <div className="pointer-events-auto">
            <AnimatePresence>
              {isActionsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex flex-wrap xl:flex-nowrap gap-2 md:gap-3 w-[95%] lg:w-max mx-auto mb-6 justify-center bg-slate-800/80 backdrop-blur-3xl p-4 md:p-5 rounded-3xl lg:rounded-full shadow-2xl border border-slate-700/50"
                >
                  <button className="group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl shadow-sm border border-white text-xs font-bold text-[#191c1e] hover:bg-[var(--color-primary)]/80 hover:text-white transition-all hover:shadow-md">
                    <FolderOpen className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 group-hover:text-white transition-colors" /> {t('chat.files')}
                  </button>
                  <button className="group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl shadow-sm border border-white text-xs font-bold text-[#191c1e] hover:bg-[var(--color-primary)]/80 hover:text-white transition-all hover:shadow-md">
                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 group-hover:text-white transition-colors" /> {t('chat.images')}
                  </button>
                  <button className="group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl shadow-sm border border-white text-xs font-bold text-[#191c1e] hover:bg-[var(--color-primary)]/80 hover:text-white transition-all hover:shadow-md">
                    <Mic className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 group-hover:text-white transition-colors" /> {t('chat.audio')}
                  </button>
                  <button className="group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl shadow-sm border border-white text-xs font-bold text-[#191c1e] hover:bg-[var(--color-primary)]/80 hover:text-white transition-all hover:shadow-md">
                    <Languages className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 group-hover:text-white transition-colors" /> {t('chat.translate')}
                  </button>
                  <button className="group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl bg-orange-50/90 backdrop-blur-xl border border-orange-200 text-xs font-bold text-orange-700 hover:bg-orange-600/80 hover:text-white transition-all shadow-sm shadow-orange-600/5">
                    <Microscope className="w-4 h-4 md:w-5 md:h-5 group-hover:text-white transition-colors" /> {t('chat.analyze')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative bg-glass-heavy backdrop-blur-3xl rounded-[2rem] border-ghost shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-2 flex items-center gap-2">
                <button 
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  className={`p-2 md:p-3 rounded-full transition-all duration-300 shrink-0 ${isActionsOpen ? 'bg-red-500 text-white rotate-45 shadow-md' : 'text-slate-500 hover:bg-white/50 hover:text-[var(--color-primary)]'}`}
                >
                  <PlusCircle className="w-6 h-6 stroke-[2px]" />
                </button>
                <input 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-xs md:text-sm font-semibold py-2 md:py-3 px-1 md:px-2 placeholder:text-slate-400 outline-none w-full" 
                  placeholder={t('chat.placeholder')} 
                  type="text"
                />
                <button className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-primary-gradient text-white flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.05] active:scale-[0.95] transition-transform">
                  <Send className="w-4 h-4 md:w-5 md:h-5 stroke-[2px]" />
                </button>
              </div>
            </div>
            
            <p className="text-center text-[9px] md:text-[10px] text-slate-500 font-bold mt-4 tracking-wide bg-white/40 inline-block px-4 py-1 rounded-full backdrop-blur-sm mx-auto flex w-max max-w-full truncate">
              {t('chat.disclaimerInfo')} <span className="text-red-600 font-black mx-1">{t('chat.emergencyCall')}</span> {t('chat.button')}
            </p>
          </div>
        </footer>
      </main>
      
      {/* Floating AI Pulse */}
      <div className="fixed bottom-[120px] md:bottom-32 right-4 md:right-8 pointer-events-none z-50 transform scale-75 md:scale-100">
        <div className="w-16 h-16 rounded-full bg-blue-600/5 flex items-center justify-center relative backdrop-blur-sm">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)]/20 animate-ping"></div>
          <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/30 border border-white/20">
            <Activity className="w-4 h-4 animate-pulse stroke-[3px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
