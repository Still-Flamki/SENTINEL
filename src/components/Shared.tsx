import React from 'react';
import { cn } from '@/src/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, subtitle }) => {
  return (
    <div className={cn("liquid-glass rounded-2xl p-6 liquid-glass-hover relative overflow-hidden group", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      {(title || subtitle) && (
        <div className="mb-6 relative z-10">
          {title && <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-[0.2em] glow-text">{title}</h3>}
          {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border backdrop-blur-md", className)}>
    {children}
  </span>
);
