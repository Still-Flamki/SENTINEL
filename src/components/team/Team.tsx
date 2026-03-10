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
  Search
} from 'lucide-react';
import { cn } from '../../utils';

export const Team: React.FC = () => {
  const members = [
    { id: '1', name: 'John Doe', email: 'john@sentinel.ai', role: 'Super Admin', status: 'ACTIVE', lastActive: 'Now', avatar: 'JD' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@sentinel.ai', role: 'Senior Analyst', status: 'ACTIVE', lastActive: '12m ago', avatar: 'SC' },
    { id: '3', name: 'Mike Ross', email: 'mike@sentinel.ai', role: 'Investigator', status: 'AWAY', lastActive: '2h ago', avatar: 'MR' },
    { id: '4', name: 'Elena Vance', email: 'elena@sentinel.ai', role: 'Compliance Officer', status: 'ACTIVE', lastActive: '1h ago', avatar: 'EV' },
    { id: '5', name: 'Alex Rivera', email: 'alex@sentinel.ai', role: 'Junior Analyst', status: 'OFFLINE', lastActive: '2d ago', avatar: 'AR' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">TEAM & ACCESS</h1>
          <p className="text-muted-foreground text-sm">Manage intelligence personnel and system permissions.</p>
        </div>
        <button className="btn-primary py-2.5 px-6 flex items-center gap-2">
          <UserPlus size={18} />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Roles Distribution */}
        <div className="card p-6 col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              Role Distribution
            </h3>
            <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Manage Roles</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { role: 'Admins', count: 2, color: 'bg-primary' },
              { role: 'Analysts', count: 8, color: 'bg-success' },
              { role: 'Investigators', count: 12, color: 'bg-warning' },
              { role: 'Compliance', count: 4, color: 'bg-info' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-surface border border-border rounded-xl">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.role}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-black tracking-tight">{item.count}</p>
                  <div className={`w-1.5 h-8 rounded-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Security */}
        <div className="card p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
            <Key size={16} className="text-primary" />
            Security Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-success" size={18} />
                <span className="text-xs font-bold">2FA Enforcement</span>
              </div>
              <span className="text-[10px] font-bold text-success uppercase">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-xl">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-warning" size={18} />
                <span className="text-xs font-bold">Session Timeout</span>
              </div>
              <span className="text-[10px] font-bold text-warning uppercase">30 Min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search members..." 
                className="bg-background border border-border rounded-lg pl-10 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-bold uppercase tracking-wider">All Members</button>
            <button className="px-3 py-1.5 hover:bg-surface rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground">Admins</button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface/30 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4">Activity</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-surface/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    member.role === 'Super Admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface border border-border text-muted-foreground'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      member.status === 'ACTIVE' ? 'bg-success' : 
                      member.status === 'AWAY' ? 'bg-warning' : 'bg-zinc-500'
                    }`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{member.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{member.lastActive}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-3 w-1 rounded-full ${i < 4 ? 'bg-primary/40' : 'bg-border'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-background rounded-lg text-muted-foreground transition-colors">
                      <Mail size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-background rounded-lg text-muted-foreground transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
