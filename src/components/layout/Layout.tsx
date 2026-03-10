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
  Cpu,
  Lock,
  Zap,
  Share2,
  ClipboardCheck,
  Users,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useThemeStore } from '../../stores/themeStore';
import { Sun, Moon } from 'lucide-react';

import { NotificationDropdown, ProfileDropdown } from './HeaderDropdowns';
import { Logo } from '../common/Logo';

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
    { id: 'vault', label: 'Account Vault', icon: Lock },
    { id: 'warroom', label: 'War Room', icon: Zap },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'intelligence', label: 'AI Council', icon: Cpu },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'investigation', label: 'Investigation', icon: Search },
    { id: 'ringmap', label: 'Fraud Ring Map', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'casefiles', label: 'Case Files', icon: FileText },
    { id: 'reports', label: 'Reports & Audits', icon: ClipboardCheck },
    { id: 'team', label: 'Team & Access', icon: Users },
  ];

  return (
    <motion.aside
      layout
      initial={false}
      animate={{ width: isCollapsed ? 100 : 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
      className="h-screen bg-surface/80 backdrop-blur-3xl border-r border-border flex flex-col sticky left-0 top-0 bottom-0 z-50 transition-colors duration-500 overflow-hidden"
    >
      <div className={cn(
        "p-6 flex items-center border-b border-border h-24 shrink-0 transition-all duration-300",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <Logo collapsed={isCollapsed} />
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-foreground/5 rounded-xl transition-colors text-foreground/40 hover:text-foreground"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center py-4 border-b border-border/50">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onScreenChange(item.id)}
            whileHover={{ x: isCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center rounded-2xl transition-all duration-300 group relative overflow-hidden h-12",
              isCollapsed ? "justify-center px-0" : "px-4 gap-4",
              activeScreen === item.id 
                ? "text-foreground font-bold" 
                : "text-foreground/40 hover:bg-foreground/5 hover:text-foreground/70"
            )}
          >
            {activeScreen === item.id && (
              <>
                <motion.div 
                  layoutId="nav-active-bg"
                  className="absolute inset-0 bg-primary/10 pointer-events-none border border-primary/20 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
                {!isCollapsed && (
                  <motion.div 
                    layoutId="nav-active-bar"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(0,122,255,0.5)] z-20"
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                )}
              </>
            )}
            <item.icon size={20} className={cn("transition-all duration-300 relative z-10 shrink-0", activeScreen === item.id ? "text-primary" : "group-hover:text-foreground/60")} />
            
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm relative z-10 whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {isCollapsed && (
              <div className="absolute left-24 bg-foreground text-background px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl border border-white/10">
                {item.label}
              </div>
            )}
          </motion.button>
        ))}
      </nav>

      <div className="p-4 border-t border-border shrink-0 bg-surface/40">
        <button 
          onClick={() => onScreenChange('config')}
          className={cn(
            "w-full flex items-center rounded-2xl transition-all group relative overflow-hidden h-12",
            isCollapsed ? "justify-center px-0" : "px-4 gap-4",
            activeScreen === 'config' ? "text-foreground font-bold" : "text-foreground/40 hover:bg-foreground/5 hover:text-foreground"
          )}
        >
          {activeScreen === 'config' && (
            <motion.div 
              layoutId="nav-active-bg"
              className="absolute inset-0 bg-primary/10 pointer-events-none border border-primary/20 rounded-2xl"
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            />
          )}
          <Settings size={18} className={cn("transition-transform duration-500 relative z-10 shrink-0", activeScreen === 'config' ? "text-primary" : "group-hover:rotate-45")} />
          {!isCollapsed && <span className="text-sm font-medium relative z-10">Settings</span>}
        </button>
        
        <div className={cn(
          "mt-4 flex items-center transition-all duration-300",
          isCollapsed ? "justify-center" : "gap-3 px-2"
        )}>
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shrink-0 shadow-inner">
            JD
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col min-w-0"
            >
              <span className="text-sm font-bold truncate">John Doe</span>
              <span className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">Pro Plan</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export const Header: React.FC<{ title: string }> = ({ title }) => {
  const { theme, toggleTheme } = useThemeStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navItems = [
    { id: 'vault', label: 'Account Vault', icon: Lock },
    { id: 'warroom', label: 'War Room', icon: Zap },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'intelligence', label: 'AI Council', icon: Cpu },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'investigation', label: 'Investigation', icon: Search },
    { id: 'ringmap', label: 'Fraud Ring Map', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'casefiles', label: 'Case Files', icon: FileText },
    { id: 'reports', label: 'Reports & Audits', icon: ClipboardCheck },
    { id: 'team', label: 'Team & Access', icon: Users },
    { id: 'config', label: 'Settings', icon: Settings },
  ];

  const activeItem = navItems.find(item => item.id === title) || navItems[1];
  const Icon = activeItem.icon;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    if (showNotifications || showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfile]);

  return (
    <header className="h-24 border-b border-border bg-surface backdrop-blur-[60px] sticky top-0 z-40 px-10 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
      <motion.div layout className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
            <Icon size={20} />
          </div>
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              <motion.h2 
                key={activeItem.label}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="text-xl font-black tracking-tighter text-foreground leading-none"
              >
                {activeItem.label}
              </motion.h2>
            </AnimatePresence>
            <span className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.3em] mt-1">Sentinel Platform</span>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-8">
        <button 
          onClick={toggleTheme}
          className="p-3.5 hover:bg-white/10 rounded-[1.5rem] transition-all active:scale-90 group border border-transparent hover:border-white/10 text-foreground/50 hover:text-foreground"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </button>
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-all duration-500" size={20} />
          <input 
            type="text" 
            placeholder="Search intelligence..." 
            className="bg-surface border border-border rounded-[2rem] pl-14 pr-8 py-3.5 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface transition-all duration-500 placeholder:text-foreground/20 shadow-inner"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className={cn(
              "p-3.5 rounded-[1.5rem] relative transition-all active:scale-90 group border border-transparent",
              showNotifications ? "bg-primary/10 text-primary border-primary/20" : "hover:bg-surface hover:border-border text-foreground/50 hover:text-foreground"
            )}
          >
            <Bell size={24} className="transition-all duration-500" />
            <span className="absolute top-3.5 right-3.5 w-3 h-3 bg-danger rounded-full border-2 border-background shadow-[0_0_15px_rgba(255,59,48,0.6)]"></span>
          </button>
          <AnimatePresence>
            {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
          </AnimatePresence>
        </div>

        <div className="relative">
          <div 
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className={cn(
              "w-12 h-12 rounded-[1.5rem] border flex items-center justify-center transition-all duration-500 cursor-pointer group hover:scale-105 active:scale-95 shadow-xl",
              showProfile ? "bg-primary/10 border-primary/20 text-primary" : "bg-surface border-border text-foreground/50 hover:text-foreground"
            )}
          >
            <User size={22} className="transition-all duration-500" />
          </div>
          <AnimatePresence>
            {showProfile && <ProfileDropdown onClose={() => setShowProfile(false)} />}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
