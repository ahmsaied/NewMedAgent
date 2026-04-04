import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, ChevronDown } from 'lucide-react';
import { theme } from '../../theme/tokens';

export function TimePicker({ label, value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  // Default to 12:00 if value is missing or improperly formatted
  const initialTime = value && value.includes(':') ? value : '12:00';
  const [tempHour, setTempHour] = useState(() => {
    const h = parseInt(initialTime.split(':')[0]);
    return (h % 12 || 12).toString().padStart(2, '0');
  });
  const [tempMinute, setTempMinute] = useState(initialTime.split(':')[1] || '00');
  const [tempAmPm, setTempAmPm] = useState(parseInt(initialTime.split(':')[0]) >= 12 ? 'PM' : 'AM');

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 280)
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('scroll', updateCoords);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen]);

  const handleDone = () => {
    let hour24 = parseInt(tempHour);
    if (tempAmPm === 'PM' && hour24 < 12) hour24 += 12;
    if (tempAmPm === 'AM' && hour24 === 12) hour24 = 0;
    
    const timeStr = `${hour24.toString().padStart(2, '0')}:${tempMinute}`;
    onChange({ target: { value: timeStr } });
    setIsOpen(false);
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const formattedDisplay = () => {
    const [h, m] = initialTime.split(':');
    const hNum = parseInt(h);
    const displayH = hNum % 12 || 12;
    const ampm = hNum >= 12 ? 'PM' : 'AM';
    return `${displayH}:${m} ${ampm}`;
  };

  return (
    <div className={`flex flex-col gap-2 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-sm font-inter text-[var(--color-on-surface-variant)] ml-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-[1.5rem] px-5 py-3.5 outline-none transition-all duration-300 border border-transparent hover:border-ghost-focus shadow-inner focus:bg-white/50 focus:backdrop-blur-xl group"
      >
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-bold">{formattedDisplay()}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-[var(--color-on-surface-variant)]`} />
      </button>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <React.Fragment>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
              />
              
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={theme.animations.spring}
                  className="w-[90%] max-w-[340px] bg-white/95 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] p-8 pointer-events-auto"
                >
                  <div className="flex gap-4 mb-8">
                    {/* Hours */}
                    <div className="flex-1 flex flex-col gap-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-1">Hour</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {hours.map(h => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setTempHour(h)}
                            className={`py-3 rounded-xl text-xs font-bold transition-all ${tempHour === h ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-100 text-slate-600'}`}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Minutes */}
                    <div className="flex-1 flex flex-col gap-3 border-l border-slate-100 pl-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-1">Min</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {minutes.map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setTempMinute(m)}
                            className={`py-3 rounded-xl text-xs font-bold transition-all ${tempMinute === m ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-100 text-slate-600'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 pt-6 border-t border-slate-100">
                    <div className="flex justify-center bg-slate-100 p-1.5 rounded-full border border-slate-200/50">
                      <button 
                        type="button"
                        onClick={() => setTempAmPm('AM')}
                        className={`flex-1 py-2 rounded-full text-xs font-black transition-all ${tempAmPm === 'AM' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                      >
                        AM
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTempAmPm('PM')}
                        className={`flex-1 py-2 rounded-full text-xs font-black transition-all ${tempAmPm === 'PM' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                      >
                        PM
                      </button>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-6 py-3 rounded-full text-xs font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        onClick={handleDone}
                        className="flex-[1.5] flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-xs font-black hover:shadow-xl transition-all shadow-blue-500/30 uppercase tracking-widest"
                      >
                        <Check className="w-4 h-4" />
                        Confirm
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </React.Fragment>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
