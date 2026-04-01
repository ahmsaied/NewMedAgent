import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { theme } from '../../theme/tokens';

export function Select({ label, options, value, onChange, placeholder = 'Select option', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formattedOptions = options.map(opt => 
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = formattedOptions.find(opt => opt.value === value) || formattedOptions.find(opt => opt.label === value);

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
        <span className={`text-sm font-bold ${!selectedOption ? 'opacity-40' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-[var(--color-on-surface-variant)]`} />
      </button>

      {/* Floating Menu via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={theme.animations.spring}
              style={{
                position: 'absolute',
                top: coords.top + 8,
                left: coords.left,
                width: coords.width,
                zIndex: 9999,
              }}
              className="bg-white/90 backdrop-blur-3xl border border-white/60 rounded-[2rem] shadow-liquid-glass overflow-hidden p-2"
            >
              <div className="max-h-60 overflow-y-auto scrollbar-hide py-1">
                {formattedOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange({ target: { value: option.value } });
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group
                      ${(value === option.value || value === option.label) ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'hover:bg-white/50 text-slate-700'}`}
                  >
                    <span className="text-sm font-bold tracking-tight">{option.label}</span>
                    {(value === option.value || value === option.label) && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
