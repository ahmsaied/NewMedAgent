import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Activity, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { UniversalImagePicker } from './ui/UniversalImagePicker';

export function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState('login'); // 'login' or 'register'
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState(null);

  const switchView = (v) => {
    setView(v);
    setStep(1);
    setProfileImage(null);
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <GlassCard className="p-8 md:p-10 flex flex-col min-h-[500px] bg-glass-heavy border-ghost shadow-[0_40px_80px_rgba(0,91,192,0.2)]">
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/40 transition-colors text-[var(--color-on-surface-variant)]"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary-gradient p-2 rounded-2xl shadow-liquid-glass">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-manrope font-bold text-[var(--color-primary)]">MedAgent</h1>
                </div>

                <div className="flex-1 relative">
                  <AnimatePresence mode="wait">
                    {/* LOGIN VIEW */}
                    {view === 'login' && (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-6"
                      >
                        <div>
                          <h2 className="text-2xl font-manrope font-bold text-[var(--color-on-surface)]">Welcome Back</h2>
                          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Authenticate to access the clinical sanctuary.</p>
                        </div>
                        <Input id="email" type="email" label="Email Address" placeholder="dr.smith@medagent.ai" />
                        <Input id="password" type="password" label="Password" placeholder="••••••••" />
                        <Button variant="primary" className="w-full mt-2" onClick={onClose}>Authenticate</Button>
                        <p className="text-center text-sm text-[var(--color-on-surface-variant)] mt-4">
                          Don't have an account?{' '}
                          <button onClick={() => switchView('register')} className="text-[var(--color-primary)] font-semibold hover:underline">
                            Register securely
                          </button>
                        </p>
                      </motion.div>
                    )}

                    {/* REGISTER VIEW - STEP 1 */}
                    {view === 'register' && step === 1 && (
                      <motion.div
                        key="reg1"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-6"
                      >
                        <div className="flex justify-between items-end">
                          <div>
                            <h2 className="text-2xl font-manrope font-bold text-[var(--color-on-surface)]">Create Account</h2>
                            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Personal Details</p>
                          </div>
                          <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">1 / 2</span>
                        </div>
                        
                        {/* Profile Photo Slot */}
                        <div className="flex flex-col items-center gap-2 py-2">
                          <UniversalImagePicker 
                            onImageSelect={setProfileImage}
                            currentImage={profileImage}
                            shape="circle"
                            label="Photo"
                          />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Avatar</span>
                        </div>

                        <Input id="firstName" label="First Name" placeholder="Sarah" />
                        <Input id="lastName" label="Last Name" placeholder="Connor" />
                        <Button variant="primary" onClick={nextStep} className="w-full mt-2">
                          Continue <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <p className="text-center text-sm text-[var(--color-on-surface-variant)] mt-4">
                          Already registered?{' '}
                          <button onClick={() => switchView('login')} className="text-[var(--color-primary)] font-semibold hover:underline">
                            Return to Login
                          </button>
                        </p>
                      </motion.div>
                    )}

                    {/* REGISTER VIEW - STEP 2 */}
                    {view === 'register' && step === 2 && (
                      <motion.div
                        key="reg2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-6"
                      >
                         <div className="flex justify-between items-end">
                          <div>
                            <h2 className="text-2xl font-manrope font-bold text-[var(--color-on-surface)]">Account Access</h2>
                            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Secure Credentials</p>
                          </div>
                          <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">2 / 2</span>
                        </div>
                        <Input id="email" type="email" label="Professional Email" placeholder="sarah@clinic.com" />
                        <Input id="password" type="password" label="Password" placeholder="••••••••" />
                        <div className="flex gap-4 mt-2">
                          <Button variant="secondary" onClick={prevStep} className="flex-1 py-3"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                          <Button variant="primary" onClick={onClose} className="flex-1 py-3 bg-green-600 hover:bg-green-700">Complete</Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
