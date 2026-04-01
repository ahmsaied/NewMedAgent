import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { theme } from '../../theme/tokens';

export function DatePicker({ label, value, onChange, placeholder = 'Select date', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date('1990-01-01'));
  const yearListRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
  };

  const handleSelectDate = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = newDate.toISOString().split('T')[0];
    onChange({ target: { value: dateStr } });
    setIsOpen(false);
  };

  const handleYearSelect = (year) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setShowYearPicker(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1930 + 1 }, (_, i) => 1930 + i);

  const scrollToYear = () => {
    if (yearListRef.current) {
      const container = yearListRef.current;
      const focusYear = value ? new Date(value).getFullYear() : 1990;
      const targetEl = container.querySelector(`[data-year="${focusYear}"]`);
      
      if (targetEl) {
        const containerHeight = container.offsetHeight;
        const targetTop = targetEl.offsetTop;
        const targetHeight = targetEl.offsetHeight;
        container.scrollTop = targetTop - (containerHeight / 2) + (targetHeight / 2);
      }
    }
  };

  useEffect(() => {
    // Also keep the useEffect for when 'value' changes while already open
    if (showYearPicker && yearListRef.current) {
        scrollToYear();
    }
  }, [value]);

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysCount = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    const today = new Date();
    const selected = value ? new Date(value) : null;

    for (let d = 1; d <= daysCount; d++) {
        const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
        const isSelected = selected && selected.getDate() === d && selected.getMonth() === month && selected.getFullYear() === year;

        days.push(
            <button
                key={d}
                type="button"
                onClick={() => handleSelectDate(d)}
                className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200
                    ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 
                    isToday ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-slate-100 text-slate-700'}`}
            >
                {d}
            </button>
        );
    }
    return days;
  };

  return (
    <div className={`flex flex-col gap-2 relative ${className}`}>
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
        <span className={`text-sm font-bold ${!value ? 'opacity-40' : ''}`}>
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarIcon className={`w-4 h-4 text-[var(--color-on-surface-variant)] group-hover:scale-110 transition-transform`} />
      </button>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <React.Fragment>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                    setIsOpen(false);
                    setShowYearPicker(false);
                }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
              />
              
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={theme.animations.spring}
                  className="w-[90%] max-w-[400px] bg-white/95 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] p-8 overflow-y-auto relative max-h-[85vh] custom-scrollbar"
                >
                <div className="flex items-center justify-between mb-8">
                  <button 
                      onClick={handlePrevMonth}
                      type="button"
                      className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                      <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => setShowYearPicker(!showYearPicker)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl hover:bg-slate-100 transition-all duration-200 group"
                  >
                    <span className="text-lg font-black text-slate-800 tracking-tight">
                        {new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(viewDate)}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-transform duration-300 ${showYearPicker ? 'rotate-180' : ''}`} />
                  </button>

                  <button 
                      onClick={handleNextMonth}
                      type="button"
                      className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                      <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {showYearPicker ? (
                            <motion.div
                                key="year-picker"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onAnimationComplete={scrollToYear}
                                className="h-[280px] overflow-y-auto pr-2 custom-scrollbar"
                                ref={yearListRef}
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    {years.map(year => (
                                        <button
                                            key={year}
                                            data-year={year}
                                            onClick={() => handleYearSelect(year)}
                                            className={`py-3 rounded-2xl text-base font-bold transition-all
                                                ${year === viewDate.getFullYear() 
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                                                    : 'hover:bg-slate-100 text-slate-600'}`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="calendar-grid"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                            >
                                <div className="grid grid-cols-7 gap-1 mb-4">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                        <div key={day} className="h-10 flex items-center justify-center text-[11px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {renderDays()}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                      onClick={() => {
                        setIsOpen(false);
                        setShowYearPicker(false);
                      }}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                      onClick={() => {
                        setIsOpen(false);
                        setShowYearPicker(false);
                      }}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                      Done
                  </button>
                </div>
                </motion.div>
              </div>
            </React.Fragment>
          )}
        </AnimatePresence>,
        document.body
      )}

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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
