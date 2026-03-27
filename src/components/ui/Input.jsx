import React from 'react';
import { motion } from 'framer-motion';

export const Input = React.forwardRef(({ label, id, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-inter text-[var(--color-on-surface-variant)] ml-2">
          {label}
        </label>
      )}
      <motion.div
        whileTap={{ scale: 0.995 }}
        className="relative"
      >
        <input
          id={id}
          ref={ref}
          className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-[1.5rem] px-5 py-3.5 outline-none transition-all duration-300 focus:border-ghost-focus border border-transparent shadow-inner focus:bg-white/50 focus:backdrop-blur-xl"
          {...props}
        />
      </motion.div>
    </div>
  );
});

Input.displayName = 'Input';
