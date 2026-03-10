import React from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Key, 
  Activity,
  MoreVertical,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Search,
  Fingerprint,
  Lock,
  Globe,
  Cpu,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../utils';

export const Team: React.FC = () => {
  const members = [
    { id: '1', name: 'John Doe', email: 'john@sentinel.ai', role: 'Super Admin', status: 'ACTIVE', lastActive: 'Now', avatar: 'JD', clearance: 'LEVEL 5' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@sentinel.ai', role: 'Senior Analyst', status: 'ACTIVE', lastActive: '12m ago', avatar: 'SC', clearance: 'LEVEL 4' },
    { id: '3', name: 'Mike Ross', email: 'mike@sentinel.ai', role: 'Investigator', status: 'AWAY', lastActive: '2h ago', avatar: 'MR', clearance: 'LEVEL 3' },
    { id: '4', name: 'Elena Vance', email: 'elena@sentinel.ai', role: 'Compliance Officer', status: 'ACTIVE', lastActive: '1h ago', avatar: 'EV', clearance: 'LEVEL 4' },
    { id: '5', name: 'Alex Rivera', email: 'alex@sentinel.ai', role: 'Junior Analyst', status: 'OFFLINE', lastActive: '2d ago', avatar: 'AR', clearance: 'LEVEL 2' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-10 space-y-12 max-w-[1600px] mx-auto"
    >
      {/* Editorial Header */}
      <motion.div variants={item} className="relative">
        <div className="absolute -left-10 top-0 bottom-0 w-1 bg-primary/20" />
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Personnel Management</span>
              <div className="h-px w-12 bg-primary/30" />
            </div>
            <h1 className="text-8xl font-black tracking-tighter leading-[0.8] mb-4">
              TEAM <span className="text-foreground/10">&</span> <br />
              <span className="text-primary">ACCESS</span>
            </h1>
            <p className="text-foreground/40 text-lg font-medium max-w-xl leading-relaxed">
              Manage intelligence personnel, clearance levels, and biometric system permissions for the Sentinel network.
            </p>
          </div>
          <button className="group relative px-8 py-4 bg-primary text-white font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,122,255,0.3)]">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative flex items-center gap-3">
              <UserPlus size={20} />
              <span className="uppercase tracking-widest text-sm">Authorize New Personnel</span>
            </div>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-8">
        {/* Roles Distribution - Hardware Style */}
        <motion.div variants={item} className="card p-8 col-span-2 bg-surface/40 backdrop-blur-xl border border-border rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">CLEARANCE DISTRIBUTION</h3>
                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Global Personnel Allocation</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-background border border-border rounded-xl text-[10px] font-black text-primary uppercase tracking-widest hover:bg-surface transition-colors">Manage Hierarchy</button>
          </div>
          
          <div className="grid grid-cols-4 gap-6">
            {[
              { role: 'Administrators', count: 2, color: 'bg-primary', icon: ShieldCheck },
              { role: 'Intelligence Analysts', count: 8, color: 'bg-success', icon: Activity },
              { role: 'Field Investigators', count: 12, color: 'bg-warning', icon: Search },
              { role: 'Compliance Officers', count: 4, color: 'bg-info', icon: Lock },
            ].map((item, i) => (
              <div key={i} className="group p-6 bg-background/50 border border-border rounded-3xl hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <item.icon size={18} className="text-foreground/20 group-hover:text-primary transition-colors" />
                  <div className={cn("w-1.5 h-1.5 rounded-full", item.color)} />
                </div>
                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">{item.role}</p>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-black tracking-tighter">{item.count.toString().padStart(2, '0')}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} className={cn("w-1 h-4 rounded-full", j <= (item.count / 3) ? item.color : 'bg-border')} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Security - Specialist Tool Style */}
        <motion.div variants={item} className="card p-8 bg-surface/40 backdrop-blur-xl border border-border rounded-[2.5rem]">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Fingerprint size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">SECURITY PROTOCOLS</h3>
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Active System Guards</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Biometric 2FA', status: 'ENFORCED', icon: ShieldCheck, color: 'text-success', bg: 'bg-success/5', border: 'border-success/20' },
              { label: 'Session Timeout', status: '15 MIN', icon: Clock, color: 'text-warning', bg: 'bg-warning/5', border: 'border-warning/20' },
              { label: 'Geo-Fencing', status: 'ACTIVE', icon: Globe, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' },
              { label: 'Neural Monitoring', status: 'STABLE', icon: Cpu, color: 'text-info', bg: 'bg-info/5', border: 'border-info/20' },
            ].map((protocol, i) => (
              <div key={i} className={cn("flex items-center justify-between p-4 border rounded-2xl transition-all hover:scale-[1.02]", protocol.bg, protocol.border)}>
                <div className="flex items-center gap-4">
                  <protocol.icon className={protocol.color} size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">{protocol.label}</span>
                </div>
                <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-background border border-border", protocol.color)}>
                  {protocol.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Members Table - Technical Grid Style */}
      <motion.div variants={item} className="bg-surface/40 backdrop-blur-xl border border-border rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-border flex items-center justify-between bg-surface/20">
          <div className="flex items-center gap-6">
            <h3 className="text-xl font-black tracking-tight">PERSONNEL DIRECTORY</h3>
            <div className="h-8 w-px bg-border" />
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, role, or clearance..." 
                className="bg-background/50 border border-border rounded-2xl pl-12 pr-6 py-3 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-background border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface transition-colors">All Personnel</button>
            <button className="px-5 py-3 bg-background border border-border rounded-2xl text-[10px] font-black text-foreground/30 uppercase tracking-widest hover:text-foreground transition-colors">Admins Only</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/30 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">
                <th className="px-8 py-6 border-b border-border">Personnel</th>
                <th className="px-8 py-6 border-b border-border">Clearance</th>
                <th className="px-8 py-6 border-b border-border">Role Designation</th>
                <th className="px-8 py-6 border-b border-border">System Status</th>
                <th className="px-8 py-6 border-b border-border">Last Access</th>
                <th className="px-8 py-6 border-b border-border">Network Load</th>
                <th className="px-8 py-6 border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-primary/[0.02] transition-colors group cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shadow-inner">
                          {member.avatar}
                        </div>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                          member.status === 'ACTIVE' ? 'bg-success' : 
                          member.status === 'AWAY' ? 'bg-warning' : 'bg-zinc-500'
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{member.name}</p>
                        <p className="text-[10px] font-medium text-foreground/30">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black font-mono px-3 py-1 rounded-lg bg-background border border-border text-primary">
                      {member.clearance}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      member.role === 'Super Admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-background border border-border text-foreground/40'
                    )}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        member.status === 'ACTIVE' ? 'text-success' : 
                        member.status === 'AWAY' ? 'text-warning' : 'text-foreground/20'
                      )}>
                        {member.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-medium text-foreground/40">{member.lastActive}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className={cn(
                          "h-4 w-1 rounded-full transition-all",
                          i < 6 ? 'bg-primary/30 group-hover:bg-primary/60' : 'bg-border'
                        )} />
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button className="p-2.5 bg-background border border-border rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                        <Mail size={18} />
                      </button>
                      <button className="p-2.5 bg-background border border-border rounded-xl text-foreground/40 hover:text-foreground transition-all shadow-sm">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
