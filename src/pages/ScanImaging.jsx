import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { CloudUpload, Cpu, ShieldCheck, ArrowRight, Download, CheckCircle, Star, AlertTriangle, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHealthData } from '../controllers/useHealthData';
import { MockService } from '../services/api/mockService';
import { PageHeader } from '../components/ui/PageHeader';
import { DataState } from '../components/ui/DataState';
import { UniversalImagePicker } from '../components/ui/UniversalImagePicker';
import { useState } from 'react';

export default function ScanImaging() {
  const { t } = useTranslation();
  const { data: scanHistory, loading, error } = useHealthData(MockService.getScanHistory);
  const [selectedScan, setSelectedScan] = useState(null);

  const handleScanSelect = (img) => {
    setSelectedScan(img);
    // In a real app, this would trigger an upload/analysis process
    console.log("MedAgent: Medical Scan captured/selected:", img);
  };

  return (
    <DataState loading={loading} error={error} loadingText="Loading scan database...">
      <div className="flex flex-col gap-6 h-full max-w-6xl mx-auto pt-4 relative space-y-4">
        <PageHeader 
          title={t('scans.title')} 
          subtitle={t('scans.subtitle')} 
          className="mb-4"
        />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-glass border-ghost shadow-[0_10px_40px_rgba(0,0,0,0.03)] p-1">
          <div className="h-full w-full rounded-[2.2rem] border-2 border-dashed border-[var(--color-primary)]/20 bg-white/60 flex flex-col items-center justify-center p-12 transition-all duration-500 group-hover:bg-[var(--color-primary)]/5 group-hover:border-[var(--color-primary)]/40 relative z-10">
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-[var(--color-primary)]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <CloudUpload className="w-20 h-20 text-[var(--color-primary)] relative z-20" />
            </div>
            <h3 className="text-2xl font-bold text-[#191c1e] mb-2 pointer-events-none">{t('scans.drop')}</h3>
            <p className="text-[#434656] text-center mb-8 max-w-sm font-medium">{t('scans.support')}</p>
            
            <UniversalImagePicker onImageSelect={handleScanSelect}>
              <button className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                {selectedScan ? "Select Another File" : t('scans.select')}
              </button>
            </UniversalImagePicker>

            {selectedScan && (
              <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl relative group">
                  <img src={selectedScan} alt="Selected Scanning" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>
                <p className="mt-3 text-sm font-bold text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Ready for AI Analysis
                </p>
                <Button variant="primary" className="mt-4 px-8 bg-green-600 hover:bg-green-700">
                  Run Diagnostic Engine <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* AI Metric card */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <div className="p-8 rounded-[2rem] bg-blue-600 text-white relative overflow-hidden shadow-lg flex-1">
            <div className="relative z-10">
              <Cpu className="w-10 h-10 mb-4 opacity-90" />
              <h4 className="text-xl font-bold mb-1">{t('scans.engine')}</h4>
              <p className="text-sm opacity-80 mb-6 font-medium">{t('scans.processing')}</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold tracking-tight">0.8s</span>
                <span className="text-sm font-medium mb-2 opacity-80">{t('scans.avg')}</span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>
          
          <div className="p-8 rounded-[2rem] bg-glass border-ghost shadow-[var(--shadow-liquid)]">
            <div className="flex justify-between items-start mb-6">
              <ShieldCheck className="w-8 h-8 text-[var(--color-tertiary)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#434656] bg-slate-200/50 px-2 py-1 rounded-md">HIPAA Secure</span>
            </div>
            <h4 className="text-lg font-bold text-[#191c1e] mb-2">Privacy Encryption</h4>
            <p className="text-sm text-[#434656] leading-relaxed font-medium">All scans are anonymized and encrypted with AES-256 before analysis. Your data remains your own.</p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="space-y-8 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#191c1e]">{t('scans.recent')}</h2>
          <button className="text-[var(--color-primary)] font-bold text-sm flex items-center gap-2 hover:underline">
            {t('scans.viewAll')} <ArrowRight className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>
        
        <div className="space-y-4">
          {scanHistory.map(scan => (
            <div key={scan.id} className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2rem] bg-glass border-ghost shadow-[var(--shadow-liquid-hover)] hover:bg-white/80 transition-colors duration-300">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200/50">
                <img src={scan.imgUrl} alt={scan.type} className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply" />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-extrabold text-[#191c1e]">{scan.type}</h3>
                  <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-widest ${
                    scan.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    scan.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {scan.status}
                  </span>
                </div>
                <p className="text-sm text-[#434656] mb-3 font-semibold">{scan.details}</p>
                
                {scan.status === 'Processing' ? (
                  <div className="w-full max-w-xs h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-2/3 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {scan.insights.map((insight, idx) => (
                      <div key={idx} className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-2 ${
                        scan.status === 'Anomaly Detected' ? (idx === 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-600') : 'bg-slate-100 text-[#434656]'
                      }`}>
                        {idx === 0 
                          ? (scan.status === 'Anomaly Detected' ? <AlertTriangle className="w-3 h-3"/> : <Star className="w-3 h-3" />)
                          : (scan.status === 'Anomaly Detected' ? <div className="w-3 h-3 bg-red-600 font-bold rounded-full animate-pulse"></div> : <CheckCircle className="w-3 h-3" />)
                        }
                        {insight}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <button className={`p-3 rounded-xl transition-all ${scan.status === 'Processing' ? 'opacity-40 cursor-not-allowed bg-slate-100' : 'hover:bg-slate-100 bg-white border border-slate-200/50 text-[#434656]'}`}>
                  <Download className="w-5 h-5" />
                </button>
                <button className={`px-6 py-3 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2
                  ${scan.status === 'Anomaly Detected' ? 'bg-orange-600 text-white hover:scale-[1.02]' :
                    scan.status === 'Processing' ? 'bg-slate-100 text-slate-500 cursor-wait' :
                    'bg-blue-50 text-[var(--color-primary)] hover:bg-blue-100'}
                `}>
                  {scan.status === 'Anomaly Detected' ? 'Review Urgent' : scan.status === 'Processing' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : 'Full Report'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 mt-12 mb-8 pt-8 text-center px-4">
        <p className="text-xs text-[var(--color-on-surface-variant)] opacity-80 uppercase tracking-[0.2em] font-bold">MedAgent Medical Imaging Protocol v8.0.2</p>
        <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-2 max-w-xl mx-auto opacity-60 font-medium">AI interpretations are intended for clinical support and must be reviewed by a certified medical professional. MedAgent LLC is a certified medical technology provider under ISO 13485.</p>
      </footer>
      </div>
    </DataState>
  );
}
