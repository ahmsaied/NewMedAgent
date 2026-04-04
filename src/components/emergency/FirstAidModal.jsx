import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Heart, Droplet, AlertTriangle, Info, CheckCircle2, ChevronRight, ActivitySquare } from 'lucide-react';
import { Button } from '../ui/Button';

const FIRST_AID_DATA = [
  {
    id: 'cpr',
    title: 'Cardiac Arrest (CPR)',
    icon: <Heart className="w-6 h-6 text-red-500" />,
    color: 'red',
    steps: [
      'Check surroundings for safety.',
      'Tap shoulder and shout to check responsiveness.',
      'Call emergency services immediately (911/112/999).',
      'Start chest compressions: Push hard and fast in the center of the chest (100-120 per minute).',
      'Allow the chest to recoil fully between compressions.',
      'Continue until professional help arrives or an AED is available.'
    ]
  },
  {
    id: 'choking',
    title: 'Severe Choking',
    icon: <Activity className="w-6 h-6 text-orange-500" />,
    color: 'orange',
    steps: [
      'If the person is coughing forcefully, encourage them to continue.',
      'If they cannot breathe, cough, or speak, stand behind them.',
      'Perform the Heimlich Maneuver: Give 5 quick abdominal thrusts just above the navel.',
      'Repeat until the object is forced out or the person becomes unconscious.',
      'If unconscious, start CPR and look for the object during breaths.'
    ]
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    icon: <Droplet className="w-6 h-6 text-red-600" />,
    color: 'red',
    steps: [
      'Apply direct pressure to the wound with a clean cloth or sterile bandage.',
      'Maintain pressure until the bleeding stops.',
      'If bleeding is life-threatening and on a limb, apply a tourniquet 2-3 inches above the wound.',
      'Tighten until bleeding stops completely.',
      'Do not remove the tourniquet; wait for medical professionals.'
    ]
  },
  {
    id: 'stroke',
    title: 'Stroke (FAST)',
    icon: <ActivitySquare className="w-6 h-6 text-blue-500" />,
    color: 'blue',
    steps: [
      'Face: Ask them to smile. Does one side of the face droop?',
      'Arms: Ask them to raise both arms. Does one drift downward?',
      'Speech: Ask them to repeat a simple phrase. Is their speech slurred?',
      'Time: If any of these are present, call emergency services immediately.',
      'Keep the person calm and do not give them food or water.'
    ]
  },
  {
    id: 'anaphylaxis',
    title: 'Allergic Reaction',
    icon: <AlertTriangle className="w-6 h-6 text-purple-500" />,
    color: 'purple',
    steps: [
      'Identify signs of anaphylaxis: Swelling, difficulty breathing, or rapid pulse.',
      'Ask if they have an EpiPen or auto-injector.',
      'Inject into the outer mid-thigh and hold for 3-10 seconds.',
      'Call emergency services even if symptoms improve.',
      'Record the time of the injection for the medical team.'
    ]
  }
];

export function FirstAidModal({ isOpen, onClose }) {
  const [selectedId, setSelectedId] = useState(null);

  const selectedGuide = FIRST_AID_DATA.find(g => g.id === selectedId);

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
            className="fixed inset-0 bg-[#0c0d0e]/60 backdrop-blur-md z-[99998]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 shadow-[0_40px_80px_rgba(0,0,0,0.15)] flex flex-col max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100/50">
                    <ActivitySquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Full First Aid Guide</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">MedAgent Emergency Protocols</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {!selectedId ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FIRST_AID_DATA.map((guide) => (
                      <button
                        key={guide.id}
                        onClick={() => setSelectedId(guide.id)}
                        className="p-6 bg-slate-50/50 rounded-3xl border border-slate-200/60 hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform`}>
                            {guide.icon}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-800">{guide.title}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Protocol Step-by-Step</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <button 
                      onClick={() => setSelectedId(null)}
                      className="inline-flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
                    >
                      ← Back to All Guides
                    </button>
                    
                    <div className="flex items-center gap-4 p-6 bg-slate-50/80 rounded-3xl border border-slate-200/60">
                      <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                        {selectedGuide.icon}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-800 tracking-tight">{selectedGuide.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">AHA Verified Protocol</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedGuide.steps.map((step, index) => (
                        <div key={index} className="flex gap-4 items-start p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 shrink-0 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-black text-sm">
                            {index + 1}
                          </div>
                          <p className="text-sm font-bold text-slate-700 leading-relaxed pt-1.5">{step}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl flex gap-4">
                      <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-orange-800 leading-relaxed">
                        Immediately call emergency services if the victim is unresponsive or has trouble breathing. Data here is for instruction only.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-slate-100 shrink-0 flex justify-end">
                <Button variant="secondary" onClick={onClose} className="px-10 font-bold">Close</Button>
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
