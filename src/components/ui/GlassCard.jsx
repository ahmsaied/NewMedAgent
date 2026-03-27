import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hoverEffect = false, ...props }) => {
  const baseClasses = "relative overflow-hidden rounded-[2rem] bg-glass border-ghost shadow-liquid-glass";
  
  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ y: -8, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {/* Subtle Shine Effect entirely contained within the card */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
