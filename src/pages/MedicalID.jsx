import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Verified, PhoneCall, Droplet, Weight, Ruler, Fingerprint, Shield, Heart, FileText, Lock, Plus } from 'lucide-react';
import femaleAvatar from '../assets/female-avatar.svg';
import maleAvatar from '../assets/male-avatar.svg';
import { useTranslation } from 'react-i18next';
import { EmergencyContactsList } from '../components/contact/EmergencyContactsList';
import { AddContactModal } from '../components/contact/AddContactModal';

export default function MedicalID() {
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const userAvatarUrl = null; // Simulated DB response
  const userGender = 'F';
  const displayAvatar = userAvatarUrl || (userGender === 'F' ? femaleAvatar : maleAvatar);

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto pt-6 h-full pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Column */}
        <div className="lg:col-span-4 space-y-8 h-full flex flex-col">
          {/* Patient Profile Card */}
          <div className="bg-glass border-ghost rounded-[2rem] p-8 shadow-[0_20px_40px_rgba(25,28,30,0.04)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 z-10">
              <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase shadow-sm border border-blue-200/50">Premium Member</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-6 relative z-10 mt-2">
              <div className="relative">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-indigo-400 shadow-xl">
                  <img alt="Eleanor Fitzwilliam" className="w-full h-full rounded-full object-cover border-4 border-white isolate" src={displayAvatar} />
                </div>
                <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-sm border border-slate-100">
                  <Verified className="w-6 h-6 text-blue-600 fill-blue-600/20" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#191c1e]">Eleanor Fitzwilliam</h1>
                <p className="text-slate-500 font-bold tracking-wide">Patient ID: <span className="text-blue-600">#CE-772-902</span></p>
              </div>
              <button className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold tracking-tight hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-[0.98]">
                Update Health Data
              </button>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-100 blur-3xl opacity-50 rounded-full pointer-events-none"></div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-slate-50/80 backdrop-blur-sm rounded-[2.5rem] p-8 space-y-6 border border-slate-200/60 shadow-inner flex-1">
            <h3 className="text-xl font-extrabold text-[#191c1e] flex items-center justify-between w-full">
              <span className="flex items-center gap-2">
                <span className="text-red-500">
                  <Heart className="w-6 h-6 fill-red-500" />
                </span>
                {t('medicalId.emergencyContact')}
              </span>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </h3>
            <EmergencyContactsList variant="detailed" allowDelete={true} />
          </div>
        </div>

        {/* Dashboard Content Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Vital Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-glass border-ghost p-6 rounded-[2rem] shadow-sm hover:translate-y-[-4px] transition-transform">
              <Droplet className="w-8 h-8 text-red-500 mb-4 fill-red-100" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('medicalId.bloodType')}</p>
              <p className="text-2xl font-black text-[#191c1e] tracking-tighter w-full">O Positive</p>
            </div>
            <div className="bg-glass border-ghost p-6 rounded-[2rem] shadow-sm hover:translate-y-[-4px] transition-transform">
              <Weight className="w-8 h-8 text-blue-600 mb-4 fill-blue-100" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('medicalId.weight')}</p>
              <p className="text-2xl font-black text-[#191c1e] tracking-tighter">64.5 <span className="text-base font-bold text-slate-500 tracking-normal">kg</span></p>
            </div>
            <div className="bg-glass border-ghost p-6 rounded-[2rem] shadow-sm hover:translate-y-[-4px] transition-transform">
              <Ruler className="w-8 h-8 text-blue-600 mb-4 fill-blue-100" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('medicalId.height')}</p>
              <p className="text-2xl font-black text-[#191c1e] tracking-tighter">172 <span className="text-base font-bold text-slate-500 tracking-normal">cm</span></p>
            </div>
            <div className="bg-glass border-ghost p-6 rounded-[2rem] shadow-sm hover:translate-y-[-4px] transition-transform">
              <Fingerprint className="w-8 h-8 text-orange-500 mb-4 fill-orange-100" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('medicalId.nationalId')}</p>
              <p className="text-2xl font-black text-[#191c1e] tracking-tighter">882-KY-4</p>
            </div>
          </div>

          {/* Medical Insurance Card */}
          <div className="bg-glass border-ghost rounded-[2.5rem] p-10 shadow-[var(--shadow-liquid-hover)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-600 fill-blue-600/20" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e]">{t('medicalId.medicalInsurance')}</h2>
                  <p className="text-slate-500 font-bold mt-0.5">{t('medicalId.activeCoverage')}</p>
                </div>
              </div>
              <button className="flex items-center gap-3 bg-[#191c1e] text-white px-7 py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-black/20 transition-all active:scale-[0.98]">
                <span>{t('medicalId.viewDigitalCard')}</span>
                <span className="opacity-60 text-lg">→</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 pt-10 border-t border-slate-200/60">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('medicalId.providerName')}</p>
                <p className="text-lg font-extrabold text-[#191c1e] tracking-tight">Blue Shield Elite</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('medicalId.memberId')}</p>
                <p className="text-lg font-extrabold text-[#191c1e] tracking-tight">BS-88210049</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('medicalId.groupNumber')}</p>
                <p className="text-lg font-extrabold text-[#191c1e] tracking-tight">#GH-9210-X</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('medicalId.planType')}</p>
                <p className="text-lg font-extrabold text-[#191c1e] tracking-tight">PPO Plus Gold</p>
              </div>
            </div>
          </div>

          {/* Allergies & Conditions */}
          <div className="bg-glass border-ghost rounded-[2.5rem] p-10 space-y-10 shadow-[var(--shadow-liquid)]">
            {/* Allergies */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e]">{t('medicalId.knownAllergies')}</h2>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-3 py-1 rounded-md border border-slate-200">{t('medicalId.lastVerified')}</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 px-6 py-4 rounded-2xl shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse border border-red-600"></div>
                  <span className="font-exrabold text-red-900 tracking-tight text-lg font-bold">Penicillin</span>
                  <span className="bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-lg uppercase font-black tracking-widest">Severe</span>
                </div>
                
                <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 px-6 py-4 rounded-2xl shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-orange-500 border border-orange-600"></div>
                  <span className="font-extrabold text-orange-900 tracking-tight text-lg">Peanuts</span>
                  <span className="bg-orange-500 text-white text-[10px] px-2.5 py-1 rounded-lg uppercase font-black tracking-widest">Moderate</span>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 px-6 py-4 rounded-2xl shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-slate-400 border border-slate-500"></div>
                  <span className="font-extrabold text-slate-700 tracking-tight text-lg">Latex</span>
                  <span className="bg-slate-400 text-white text-[10px] px-2.5 py-1 rounded-lg uppercase font-black tracking-widest">Mild</span>
                </div>
              </div>
            </div>

            {/* Chronic */}
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e]">Chronic Conditions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50/80 rounded-[2rem] border border-slate-200/60 shadow-inner">
                  <h4 className="font-extrabold text-lg text-[#191c1e] mb-2 tracking-tight">Type 1 Diabetes</h4>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">Insulin dependent. Carries Dexcom G6 sensor. High hypoglycemia risk during intensive exercise.</p>
                </div>
                <div className="p-6 bg-slate-50/80 rounded-[2rem] border border-slate-200/60 shadow-inner">
                  <h4 className="font-extrabold text-lg text-[#191c1e] mb-2 tracking-tight">Asthma</h4>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">Exercise-induced. Uses Albuterol inhaler as needed. Occasional seasonal flare-ups.</p>
                </div>
              </div>
            </div>

            {/* Legal */}
            <div className="pt-10 border-t border-slate-200/60">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-2">
                  <h4 className="font-extrabold text-[#191c1e] tracking-tight text-lg">Organ Donor Status</h4>
                  <div className="flex items-center gap-2 text-red-500 font-bold">
                    <Heart className="w-5 h-5 fill-red-500" />
                    Registered Organ Donor
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-extrabold text-[#191c1e] tracking-tight text-lg">Advance Directives</h4>
                  <div className="flex items-center gap-2 text-slate-400 font-bold">
                    <FileText className="w-5 h-5" />
                    DNR: Not on file
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Card */}
          <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100 flex items-start gap-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-extrabold text-blue-600 tracking-tight">Emergency Accessibility</h4>
              <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">In the event of an emergency, medical professionals can access your vital data using the QR code on your MedAgent physical card or via the secure emergency bypass on your smartphone lock screen. Your data is encrypted and access is logged for your security.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <AddContactModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
