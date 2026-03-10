import React from 'react';
import { Shield, Activity, Search, Map, BarChart3, FileText, Settings, LogOut, Bell } from 'lucide-react';
import { cn } from '../utils';
import { motion } from 'motion/react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all duration-500 relative group",
      active ? "text-white" : "text-zinc-500 hover:text-zinc-200"
    )}
  >
    {active && (
      <motion.div
        layoutId="sidebar-active"
        className="absolute inset-0 bg-white/[0.05] border border-white/[0.1] rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.02)]"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <Icon size={18} className={cn("relative z-10 transition-transform duration-500 group-hover:scale-110", active && "text-primary")} />
    {!collapsed && <span className="font-bold text-[11px] uppercase tracking-[0.2em] relative z-10">{label}</span>}
    {active && (
      <div className="absolute right-2 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]" />
    )}
  </button>
);

export const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'vault', label: 'Vault', icon: Shield },
    { id: 'warroom', label: 'War Room', icon: Activity },
    { id: 'transactions', label: 'Ledger', icon: Search },
    { id: 'investigation', label: 'Forensics', icon: Search },
    { id: 'ringmap', label: 'Network', icon: Map },
    { id: 'analytics', label: 'Intelligence', icon: BarChart3 },
    { id: 'cases', label: 'Archives', icon: FileText },
  ];

  return (
    <div className="w-64 h-screen flex flex-col p-6 bg-transparent relative z-20">
      <div className="flex items-center gap-3 px-2 mb-12 group cursor-pointer">
        <div className="w-10 h-10 bg-white/[0.03] border border-white/[0.1] rounded-2xl flex items-center justify-center text-primary shadow-[0_0_30px_rgba(139,92,246,0.2)] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all duration-700">
          <Shield size={22} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-[0.3em] text-white leading-none">SENTINEL</span>
          <span className="text-[8px] font-bold tracking-[0.4em] text-zinc-600 mt-1">FRAUD INTEL</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      <div className="pt-6 border-t border-white/[0.05] space-y-1">
        <SidebarItem 
          icon={Settings} 
          label="Config" 
          active={activeTab === 'config'}
          onClick={() => setActiveTab('config')} 
        />
        <SidebarItem icon={LogOut} label="Exit" onClick={() => {}} />
      </div>
    </div>
  );
};

export const Header: React.FC<{ title: string }> = ({ title }) => (
  <header className="h-20 flex items-center justify-between px-10 bg-transparent relative z-10">
    <div className="flex items-center gap-4">
      <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]" />
      <h1 className="text-xs font-black text-zinc-100 uppercase tracking-[0.4em] glow-text">{title}</h1>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.05] rounded-full">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">System Online</span>
      </div>
      <button className="p-2.5 text-zinc-500 hover:text-zinc-100 transition-all duration-500 relative group">
        <Bell size={18} className="group-hover:rotate-12" />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-background shadow-[0_0_10px_#f43f5e]"></span>
      </button>
      <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.1] p-0.5 group cursor-pointer overflow-hidden transition-all duration-500 hover:border-primary/50">
        <img src="https://picsum.photos/seed/sentinel/40/40" alt="User" referrerPolicy="no-referrer" className="rounded-[14px] grayscale hover:grayscale-0 transition-all duration-700" />
      </div>
    </div>
  </header>
);
