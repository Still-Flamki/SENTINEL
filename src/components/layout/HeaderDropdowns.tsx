import React from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '../../utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'High Risk Transaction',
    message: 'A $4,200 transaction at "Apple Store" was flagged for review.',
    time: '2 mins ago',
    type: 'alert',
    read: false
  },
  {
    id: '2',
    title: 'System Update',
    message: 'Sentinel AI models have been updated to v4.2.1.',
    time: '1 hour ago',
    type: 'info',
    read: true
  },
  {
    id: '3',
    title: 'New Fraud Ring Detected',
    message: 'Pattern matching identified a potential new fraud cluster in London.',
    time: '3 hours ago',
    type: 'warning',
    read: false
  },
  {
    id: '4',
    title: 'Case Resolved',
    message: 'Case #FRAUD-882 has been successfully resolved and closed.',
    time: '5 hours ago',
    type: 'success',
    read: true
  }
];

export const NotificationDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full right-0 mt-4 w-96 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-3xl"
    >
      <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50">
        <h3 className="font-black tracking-tight text-lg font-mono">NOTIFICATIONS</h3>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity font-mono">
          [ MARK ALL ]
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div 
            key={notif.id}
            className={cn(
              "p-5 border-b border-border hover:bg-foreground/5 transition-colors cursor-pointer relative group",
              !notif.read && "bg-primary/5"
            )}
          >
            {!notif.read && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            )}
            <div className="flex gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                notif.type === 'alert' && "bg-danger/10 text-danger",
                notif.type === 'warning' && "bg-warning/10 text-warning",
                notif.type === 'success' && "bg-success/10 text-success",
                notif.type === 'info' && "bg-primary/10 text-primary"
              )}>
                {notif.type === 'alert' && <AlertTriangle size={18} />}
                {notif.type === 'warning' && <AlertTriangle size={18} />}
                {notif.type === 'success' && <CheckCircle2 size={18} />}
                {notif.type === 'info' && <Info size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold truncate pr-4">{notif.title}</h4>
                  <span className="text-[10px] font-mono text-foreground/30 whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-xs text-foreground/50 leading-relaxed line-clamp-2">{notif.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-foreground/5 text-center">
        <button className="text-xs font-bold text-foreground/40 hover:text-foreground transition-colors">
          View all notifications
        </button>
      </div>
    </motion.div>
  );
};

export const ProfileDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full right-0 mt-4 w-72 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-3xl"
    >
      <div className="p-6 border-b border-border bg-foreground/5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl border border-primary/20 shadow-[0_0_20px_rgba(0,255,148,0.1)]">
            JD
          </div>
          <div className="min-w-0">
            <h3 className="font-black tracking-tight text-lg truncate font-mono">JOHN DOE</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 font-mono">CHIEF SECURITY OFFICER</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-lg w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary)]" />
          <span className="text-[10px] font-black text-primary uppercase tracking-widest font-mono">NODE ACTIVE</span>
        </div>
      </div>
      
      <div className="p-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all group">
          <User size={18} className="group-hover:text-primary transition-colors" />
          <span className="text-sm font-bold">My Profile</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all group">
          <Shield size={18} className="group-hover:text-primary transition-colors" />
          <span className="text-sm font-bold">Security Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all group">
          <CreditCard size={18} className="group-hover:text-primary transition-colors" />
          <span className="text-sm font-bold">Billing & Plan</span>
        </button>
        <div className="my-2 border-t border-border mx-2" />
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-danger/10 text-foreground/60 hover:text-danger transition-all group">
          <LogOut size={18} className="group-hover:text-danger transition-colors" />
          <span className="text-sm font-bold">Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
};
