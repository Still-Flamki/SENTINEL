import React from 'react';
import { motion } from 'motion/react';

export const Logo: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        {/* B&G Monogram - Sophisticated & Technical */}
        <div className="relative w-10 h-10 border-2 border-primary/40 rounded-xl flex items-center justify-center overflow-hidden bg-surface/50 backdrop-blur-sm group-hover:border-primary transition-colors duration-500">
          <motion.div 
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-10"
          >
            <div className="absolute inset-0 border-[0.5px] border-primary/50 scale-150 rotate-45" />
            <div className="absolute inset-0 border-[0.5px] border-primary/50 scale-150 -rotate-45" />
          </motion.div>
          
          <span className="text-xl font-black text-primary relative z-10 tracking-tighter">B&G</span>
          
          {/* Scanning Line */}
          <motion.div 
            animate={{ 
              top: ['-10%', '110%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-primary/50 shadow-[0_0_8px_var(--color-primary)] z-20"
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
            <span className="text-xl font-black tracking-[-0.02em] leading-none text-foreground">BETTER & GOOD</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
            <span className="text-[8px] font-black tracking-[0.4em] text-foreground/30 uppercase">Intelligence Vault</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
