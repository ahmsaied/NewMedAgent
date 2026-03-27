import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Check, Download, Plus, MapPin, Search, ThermometerSun, Divide as SunDim, Moon, AlertTriangle, Pill, Activity, MoreHorizontal, Bolt } from 'lucide-react';
import { useHealthData } from '../controllers/useHealthData';
import { MockService } from '../services/api/mockService';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/ui/PageHeader';
import { DataState } from '../components/ui/DataState';

export default function Medicines() {
  const { t } = useTranslation();
  const { data: prescriptions, loading, error } = useHealthData(MockService.getPrescriptions);

  return (
    <DataState loading={loading} error={error} loadingText="Loading prescriptions...">
      <div className="flex flex-col gap-6 h-full max-w-6xl mx-auto pt-6">
        <PageHeader 
          title={t('medicines.title')} 
          subtitle={t('medicines.subtitle')}
        >
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200/60 px-5 py-2.5 rounded-full text-sm font-semibold text-on-surface hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-5 h-5 text-slate-500" />
            {t('medicines.export')}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg transition-all shadow-[var(--color-primary)]/20">
            <Plus className="w-5 h-5" />
            {t('medicines.new')}
          </button>
        </PageHeader>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Daily Timeline */}
        <section className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-glass border-ghost rounded-[2rem] p-8 shadow-[var(--shadow-liquid-hover)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-extrabold text-[#191c1e]">{t('medicines.dailyIntake')}</h2>
              <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200/50">
                <button className="px-5 py-1.5 bg-white rounded-full text-xs font-bold shadow-sm whitespace-nowrap">{t('medicines.today')}</button>
                <button className="px-5 py-1.5 text-xs font-bold text-slate-500 whitespace-nowrap hover:text-slate-700 transition-colors">{t('medicines.week')}</button>
              </div>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {prescriptions.map((px, idx) => (
                 <div key={idx} className="relative pl-12 group">
                   <div className={`absolute left-0 top-1 w-11 h-11 rounded-full flex items-center justify-center z-10 border-4 border-white ${
                     px.time.includes('Morning') ? 'bg-blue-100 text-blue-600' : 
                     px.time.includes('Noon') ? 'bg-orange-100 text-orange-600' : 'bg-slate-800 text-slate-200'
                   }`}>
                     {px.time.includes('Morning') ? <ThermometerSun className="w-5 h-5" /> : 
                      px.time.includes('Noon') ? <SunDim className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                   </div>
                   <div className="flex-1">
                     <p className={`text-xs font-black mb-1 uppercase tracking-widest ${
                        px.time.includes('Morning') ? 'text-blue-600' : 
                        px.time.includes('Noon') ? 'text-orange-600' : 'text-slate-600'
                     }`}>{px.time}</p>
                     <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl group-hover:bg-white transition-all shadow-sm border border-ghost">
                       <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 ${
                         px.time.includes('Morning') ? 'text-blue-600' : 
                         px.time.includes('Noon') ? 'text-orange-600' : 'text-slate-600'
                       }`}>
                         <Pill className="w-6 h-6" />
                       </div>
                        <div>
                          <h4 className="font-extrabold text-[#191c1e] text-lg leading-tight">{px.name}</h4>
                          <p className="text-sm font-semibold text-[#434656] mt-0.5">{px.time.includes('Morning') ? t('medicines.takeMorning') : px.time.includes('Noon') ? t('medicines.takeNoon') : t('medicines.takeNight')}</p>
                        </div>
                       <div className="ml-auto">
                         {px.status === 'completed' ? (
                           <button className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                             <Check className="w-5 h-5 stroke-[3px]" />
                           </button>
                         ) : (
                            <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full tracking-wider border border-slate-200/50">
                              {px.status === 'pending' ? t('medicines.pending') : t('medicines.scheduled')}
                            </span>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>
              ))}
            </div>
          </div>

          {/* Refill Alerts */}
          <div className="bg-blue-600 p-8 rounded-[2rem] text-white overflow-hidden relative shadow-lg shadow-blue-600/20">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shrink-0 border border-white/30">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 tracking-tight">{t('medicines.refillAlert')}</h3>
                  <p className="text-blue-50/90 max-w-md font-medium leading-relaxed">{t('medicines.refillDesc')}</p>
                </div>
              </div>
              <div className="flex gap-4 shrink-0 flex-col sm:flex-row w-full sm:w-auto">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-sm">
                  {t('medicines.approveRefill')}
                </button>
                <button className="bg-transparent border border-white/40 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all">
                  {t('medicines.dismiss')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar */}
        <section className="col-span-12 lg:col-span-4 space-y-8 h-full">
          <div className="bg-glass border-ghost rounded-[2.5rem] p-6 shadow-sm">
            <h2 className="text-xl font-extrabold mb-6 text-[#191c1e]">{t('medicines.active')}</h2>
            <div className="space-y-4">
              {prescriptions.map((px) => (
                <div key={px.id} className="bg-white/70 backdrop-blur p-5 rounded-2xl border border-transparent hover:border-blue-600/20 transition-all group shadow-sm hover:shadow-md cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                      px.category === 'primary' ? 'bg-blue-100 text-blue-600' :
                      px.category === 'tertiary' ? 'bg-orange-100 text-orange-600' : 'bg-slate-800 text-white'
                    }`}>
                      {px.type}
                    </span>
                    <button className="text-slate-400 hover:text-slate-900">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="font-extrabold text-[#191c1e] text-lg group-hover:text-blue-600 transition-colors leading-tight">{px.name.split(' ')[0]}</h3>
                  <p className="text-xs font-bold text-slate-500 mb-4 tracking-wide">{px.desc}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{t('medicines.dosage')}</p>
                      <p className="text-sm font-extrabold text-[#191c1e]">{px.name.split(' ')[1]}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{t('medicines.frequency')}</p>
                      <p className="text-sm font-extrabold text-[#191c1e]">{px.freq}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl text-slate-500 text-sm font-bold hover:border-blue-300 hover:text-blue-600 transition-all">
              {t('medicines.viewArchived')}
            </button>
          </div>

          {/* AI Insights Mini-Widget */}
          <div className="bg-slate-100 rounded-[2rem] p-6 border border-slate-200/50 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <Bolt className="w-5 h-5 text-blue-600 fill-blue-600" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#191c1e]">{t('medicines.aiAdherence')}</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                  <circle className="text-white" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
                  <circle className="text-blue-600" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="176" strokeDashoffset="10" strokeWidth="6" strokeLinecap="round"></circle>
                </svg>
                <span className="absolute text-xs font-black text-[#191c1e]">94%</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#191c1e]">{t('medicines.excellent')}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5 leading-snug">{t('medicines.consistency')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    </DataState>
  );
}
