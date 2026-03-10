import React, { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  CreditCard, 
  Search, 
  Network, 
  BarChart3, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onScreenChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'vault', label: 'Account Vault', icon: Shield },
    { id: 'warroom', label: 'War Room', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'intelligence', label: 'AI Council', icon: Cpu },
    { id: 'investigation', label: 'Investigation', icon: Search },
    { id: 'ringmap', label: 'Fraud Ring Map', icon: Network },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'casefiles', label: 'Case Files', icon: FileText },
    { id: 'reports', label: 'Reports & Audits', icon: FileText },
    { id: 'team', label: 'Team & Access', icon: User },
    { id: 'config', label: 'Config', icon: Settings },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 90 : 300 }}
      className="h-screen bg-white/[0.01] backdrop-blur-[60px] border-r border-white/10 flex flex-col sticky top-0 z-50 shadow-[40px_0_100px_rgba(0,0,0,0.5)]"
    >
      <div className="p-8 flex items-center justify-between border-b border-white/5 h-24">
        {!isCollapsed && (
          <div className="flex items-center gap-4 font-black text-3xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/20">
            <Shield className="text-primary w-8 h-8 drop-shadow-[0_0_15px_rgba(0,122,255,0.6)]" />
            <span>SENTINEL</span>
          </div>
        )}
        {isCollapsed && <Shield className="text-primary w-8 h-8 mx-auto drop-shadow-[0_0_15px_rgba(0,122,255,0.6)]" />}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-6 space-y-3">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onScreenChange(item.id)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-5 px-5 py-4 rounded-[2rem] transition-all duration-500 group relative overflow-hidden",
              activeScreen === item.id 
                ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_20px_rgba(0,0,0,0.2)]" 
                : "text-white/30 hover:bg-white/5 hover:text-white/70"
            )}
          >
            {activeScreen === item.id && (
              <>
                <motion.div 
                  layoutId="nav-active-bg"
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <motion.div 
                  layoutId="nav-active-bar"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-[0_0_15px_rgba(0,122,255,0.8)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </>
            )}
            <item.icon size={24} className={cn("transition-all duration-500 group-hover:scale-110 relative z-10", activeScreen === item.id ? "text-primary drop-shadow-[0_0_8px_rgba(0,122,255,0.5)]" : "group-hover:text-white/60")} />
            {!isCollapsed && <span className="font-bold tracking-tight text-sm relative z-10">{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-24 bg-black/90 backdrop-blur-2xl text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-15px] group-hover:translate-x-0 whitespace-nowrap z-50 border border-white/10 shadow-2xl">
                {item.label}
              </div>
            )}
          </motion.button>
        ))}
      </nav>

      <div className="p-2 border-t border-border">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-background transition-colors">
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <div className="mt-2 px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            JD
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-[10px] text-muted-foreground">Pro Plan</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="h-24 border-b border-white/5 bg-white/[0.01] backdrop-blur-[60px] sticky top-0 z-40 px-10 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-4 text-sm font-bold text-white/30">
        <span className="hover:text-white/60 cursor-pointer transition-all hover:scale-105">Sentinel</span>
        <ChevronRight size={16} className="text-white/10" />
        <span className="text-white font-black tracking-tighter text-lg capitalize">{title.replace(/([A-Z])/g, ' $1')}</span>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-all duration-500" size={20} />
          <input 
            type="text" 
            placeholder="Search intelligence..." 
            className="bg-white/[0.03] border border-white/10 rounded-[2rem] pl-14 pr-8 py-3.5 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all duration-500 placeholder:text-white/20 shadow-inner"
          />
        </div>
        <button className="p-3.5 hover:bg-white/10 rounded-[1.5rem] relative transition-all active:scale-90 group border border-transparent hover:border-white/10">
          <Bell size={24} className="text-white/50 group-hover:text-white transition-all duration-500" />
          <span className="absolute top-3.5 right-3.5 w-3 h-3 bg-danger rounded-full border-2 border-[#000] shadow-[0_0_15px_rgba(255,59,48,0.6)]"></span>
        </button>
        <div className="w-12 h-12 rounded-[1.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-500 cursor-pointer group hover:scale-105 active:scale-95 shadow-xl">
          <User size={22} className="text-white/50 group-hover:text-white transition-all duration-500" />
        </div>
      </div>
    </header>
  );
};
