import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Search, Filter, Zap, Send } from 'lucide-react';
import { DoctorCard } from '../components/contact/DoctorCard';
import { useTranslation } from 'react-i18next';
import { useHealthData } from '../controllers/useHealthData';
import { MockService } from '../services/api/mockService';
import { PageHeader } from '../components/ui/PageHeader';
import { DataState } from '../components/ui/DataState';

export default function ContactDoctor() {
  const { t } = useTranslation();
  const { data: doctors, loading, error } = useHealthData(MockService.getDoctors);

  return (
    <DataState loading={loading} error={error} loadingText="Finding available doctors...">
      <div className="flex flex-col gap-6 h-full max-w-6xl mx-auto pt-6">
        <PageHeader 
          title={t('doctors.title')} 
          subtitle={t('doctors.subtitle')} 
          className="mb-4"
        />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center bg-white border border-slate-200/50 rounded-2xl px-5 py-3 gap-3 shadow-sm">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                className="bg-transparent border-none focus:ring-0 text-base w-full placeholder:text-slate-400/80 outline-none" 
                placeholder={t('doctors.search')} 
                type="text"
              />
            </div>
            <button className="px-8 py-3 bg-white border border-slate-200/50 text-[#191c1e] font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
              <Filter className="w-5 h-5" />
              {t('doctors.filter')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {doctors.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
          </div>
        </div>

        {/* Right Column: Quick Message */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-[2rem] p-8 flex flex-col h-full sticky top-24 border border-blue-100/50 shadow-sm">
          <div className="mb-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[var(--color-primary)] shadow-sm mb-6 border border-slate-100">
              <Zap className="w-6 h-6 fill-[var(--color-primary)] opacity-80" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-[#191c1e] mb-2">{t('doctors.quickMessage')}</h3>
            <p className="text-[#434656] text-sm">{t('doctors.quickMessageDesc')}</p>
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">{t('doctors.topic')}</label>
            <select className="w-full bg-white/50 border border-slate-200/50 rounded-xl mb-4 text-sm py-3 px-4 focus:ring-2 outline-none appearance-none font-semibold">
              <option>{t('doctors.symptom')}</option>
              <option>{t('doctors.prescription')}</option>
              <option>{t('doctors.testResults')}</option>
              <option>{t('doctors.other')}</option>
            </select>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">{t('doctors.messageContent')}</label>
            <textarea className="flex-1 w-full min-h-[160px] bg-white/50 border border-slate-200/50 rounded-2xl p-4 text-sm focus:ring-2 outline-none resize-none mb-6 placeholder-slate-400 font-medium" placeholder={t('doctors.describeFeeling')}></textarea>
            <button className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[var(--color-primary)]/20 active:scale-[0.98] transition-all">
              {t('doctors.sendRequest')}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Floating Context */}
      <section className="max-w-6xl mx-auto mt-8 w-full p-8 bg-white/60 border border-slate-100/60 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-100/50 blur-[80px] rounded-full point-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-orange-100/50 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)] text-white rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm">
              {t('doctors.smartDispatching')}
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#191c1e] mb-4 leading-tight">{t('doctors.cantDecide')}</h2>
            <p className="text-[#434656] text-lg leading-relaxed max-w-xl font-medium">
              {t('doctors.cantDecideDesc')}
            </p>
          </div>
          <div className="flex-shrink-0">
            <button className="group flex items-center gap-4 px-10 py-6 bg-[#191c1e] text-white rounded-full font-bold text-lg hover:bg-[var(--color-primary)] transition-all shadow-xl shadow-black/10">
              {t('doctors.startTriage')}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>
      </div>
    </DataState>
  );
}
