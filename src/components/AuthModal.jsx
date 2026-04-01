import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Activity, X, ArrowRight, ArrowLeft, Heart, Check } from 'lucide-react';
import { UniversalImagePicker } from './ui/UniversalImagePicker';
import { useAuth } from '../context/AuthContext';
import { Select } from './ui/Select';
import { DatePicker } from './ui/DatePicker';

export function AuthModal({ isOpen, onClose }) {
  const { updateUser, login } = useAuth();
  const [view, setView] = useState('login'); // 'login' or 'register'
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  
  // Registration State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bloodType: 'O Positive',
    gender: 'M',
    dob: ''
  });

  const switchView = (v) => {
    setView(v);
    setStep(1);
    setProfileImage(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      bloodType: 'O Positive',
      gender: 'M',
      dob: ''
    });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleComplete = () => {
    updateUser({
      firstName: formData.firstName || 'User',
      lastName: formData.lastName || '',
      email: formData.email,
      profileImage: profileImage,
      bloodType: formData.bloodType,
      gender: formData.gender,
      isRegistered: true
    });
    login('mock-session-token');
    onClose();
  };

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
          />
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[150] pointer-events-none p-4"
          >
            <div className="pointer-events-auto">
              <GlassCard className="p-8 md:p-10 flex flex-col min-h-[500px] bg-glass-heavy border-ghost shadow-[0_40px_80px_rgba(0,91,192,0.2)] pb-12">
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
                        <Button 
                          variant="primary" 
                          className="w-full mt-2" 
                          onClick={() => {
                            updateUser({ isRegistered: true });
                            login('mock-session-token');
                            onClose();
                          }}
                        >
                          Authenticate
                        </Button>
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
                          <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">1 / 3</span>
                        </div>
                        
                        {/* Profile Photo Slot */}
                        <div className="flex flex-col items-center gap-2 py-2">
                          <UniversalImagePicker 
                            onImageSelect={setProfileImage}
                            currentImage={profileImage}
                            shape="circle"
                            label="Photo"
                            showAvatars={true}
                          />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Avatar</span>
                        </div>

                        <Input 
                          id="firstName" 
                          label="First Name" 
                          placeholder="Sarah" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                        <Input 
                          id="lastName" 
                          label="Last Name" 
                          placeholder="Connor" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
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
                          <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">2 / 3</span>
                        </div>
                        <Input 
                          id="email" 
                          type="email" 
                          label="Professional Email" 
                          placeholder="sarah@clinic.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <Input 
                          id="password" 
                          type="password" 
                          label="Password" 
                          placeholder="••••••••" 
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <div className="flex gap-4 mt-2">
                          <Button variant="secondary" onClick={prevStep} className="flex-1 py-3"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                          <Button variant="primary" onClick={nextStep} className="flex-1 py-3 group">
                            Next Step <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* REGISTER VIEW - STEP 3 (Optional Health Data) */}
                    {view === 'register' && step === 3 && (
                      <motion.div
                        key="reg3"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-6"
                      >
                         <div className="flex justify-between items-end">
                          <div>
                            <h2 className="text-2xl font-manrope font-bold text-[var(--color-on-surface)]">Health Profile</h2>
                            <p className="text-sm text-blue-600 font-bold mt-1 uppercase tracking-tighter">Optional Information</p>
                          </div>
                          <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">3 / 3</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Select 
                            label="Blood Type"
                            value={formData.bloodType}
                            onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                            options={["O Positive", "O Negative", "A Positive", "A Negative", "B Positive", "B Negative"]}
                          />
                          <Select 
                            label="Biological Gender"
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            options={[
                              { label: 'Female', value: 'F' },
                              { label: 'Male', value: 'M' }
                            ]}
                          />
                        </div>

                        <DatePicker 
                          label="Date of Birth" 
                          value={formData.dob}
                          onChange={(e) => setFormData({...formData, dob: e.target.value})}
                          placeholder="YYYY-MM-DD"
                        />

                        <div className="flex gap-4 mt-2">
                          <Button variant="secondary" onClick={prevStep} className="flex-1 py-3">Back</Button>
                          <Button 
                            variant="primary" 
                            onClick={handleComplete} 
                            className="flex-1 py-3 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                          >
                            <Check className="w-5 h-5" /> Complete
                          </Button>
                        </div>
                        <button 
                          onClick={handleComplete}
                          className="text-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                        >
                          Skip for now
                        </button>
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
