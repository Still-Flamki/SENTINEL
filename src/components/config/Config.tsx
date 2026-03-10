import React from 'react';
import { 
  Shield, 
  Zap, 
  Lock, 
  Bell, 
  Database, 
  Cpu, 
  Globe, 
  Key,
  Smartphone,
  Server,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { cn } from '../../utils';

const ConfigItem: React.FC<{ icon: any; title: string; desc: string; children: React.ReactNode }> = ({ icon: Icon, title, desc, children }) => (
  <div className="card p-6 flex items-center justify-between gap-6 bg-white/[0.01]">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
        <Icon className="text-primary" size={24} />
      </div>
      <div>
        <h3 className="font-black tracking-tight text-base">{title}</h3>
        <p className="text-[11px] font-black uppercase tracking-widest text-foreground/20 mt-1">{desc}</p>
      </div>
    </div>
    {children}
  </div>
);

export const Config: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-gradient">SETTINGS</h1>
        <p className="text-foreground/30 text-base font-medium mt-2">Fine-tune Sentinel's autonomous intelligence and security parameters.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 mb-6">Appearance</h2>
        <ConfigItem 
          icon={theme === 'light' ? Sun : Moon} 
          title="Theme Mode" 
          desc={theme === 'light' ? "Currently in Light Mode" : "Currently in Dark Mode"}
        >
          <div 
            onClick={toggleTheme}
            className="w-16 h-8 bg-white/[0.05] border border-white/10 rounded-full relative cursor-pointer transition-all hover:bg-white/10 shadow-inner"
          >
            <div className={cn(
              "absolute top-1 w-6 h-6 rounded-full shadow-lg transition-all duration-500 flex items-center justify-center",
              theme === 'light' ? "left-1 bg-warning" : "left-9 bg-primary"
            )}>
              {theme === 'light' ? <Sun size={14} className="text-white" /> : <Moon size={14} className="text-white" />}
            </div>
          </div>
        </ConfigItem>
      </div>

      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 mb-6">AI & Automation</h2>
        <ConfigItem 
          icon={Zap} 
          title="Autonomous Blocking" 
          desc="Automatically block transactions with risk scores above 90."
        >
          <div className="w-14 h-7 bg-primary rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(0,122,255,0.4)]">
            <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
          </div>
        </ConfigItem>
        <ConfigItem 
          icon={Cpu} 
          title="Neural Learning" 
          desc="Allow Sentinel to learn from your manual overrides."
        >
          <div className="w-14 h-7 bg-primary rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(0,122,255,0.4)]">
            <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
          </div>
        </ConfigItem>
        <ConfigItem 
          icon={Shield} 
          title="Risk Sensitivity" 
          desc="Adjust the threshold for 'Review' status alerts."
        >
          <input type="range" className="accent-primary w-32 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" defaultValue={40} />
        </ConfigItem>
      </div>

      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 mb-6">Integrations</h2>
        <ConfigItem 
          icon={Key} 
          title="Plaid API Key" 
          desc="Connect real-time bank feeds (Enterprise only)."
        >
          <button className="glass-button text-[10px] font-black uppercase tracking-widest py-2 px-6">Configure</button>
        </ConfigItem>
        <ConfigItem 
          icon={Smartphone} 
          title="Push Notifications" 
          desc="Receive instant fraud alerts on your device."
        >
          <button className="btn-primary text-[10px] font-black uppercase tracking-widest py-2 px-6">Enabled</button>
        </ConfigItem>
      </div>

      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 mb-6">System Diagnostics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card p-6 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-4">
              <Server size={16} className="text-success" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Server Status</span>
            </div>
            <p className="text-2xl font-black tracking-tight">Operational</p>
          </div>
          <div className="card p-6 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-4">
              <Activity size={16} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Latency</span>
            </div>
            <p className="text-2xl font-black tracking-tight">42ms</p>
          </div>
          <div className="card p-6 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={16} className="text-success" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Encryption</span>
            </div>
            <p className="text-2xl font-black tracking-tight">AES-256</p>
          </div>
        </div>
      </div>
    </div>
  );
};
