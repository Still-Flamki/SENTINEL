import React from 'react';
import { motion } from 'motion/react';

export const Logo: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Aegis Core - Interlocking Geometric Shapes */}
        <div className="relative w-8 h-8">
          {/* Left Wing */}
          <motion.div 
            animate={{ 
              x: [0, -2, 0],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-primary to-primary/40 rounded-l-sm"
            style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 85%)' }}
          />
          {/* Right Wing */}
          <motion.div 
            animate={{ 
              x: [0, 2, 0],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-primary to-primary/40 rounded-r-sm"
            style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)' }}
          />
          {/* Central Data Pillar */}
          <motion.div 
            animate={{ 
              scaleY: [0.4, 1, 0.4],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-20"
          />
          {/* Orbiting Bits */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-4px] border border-dashed border-primary/30 rounded-full"
          />
        </div>
      </div>
      
      {!collapsed && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-[-0.05em] leading-none text-foreground">SENTINEL</span>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </div>
          <span className="text-[9px] font-bold tracking-[0.5em] text-foreground/40 uppercase mt-1">Advanced Security</span>
        </motion.div>
      )}
    </div>
  );
};
