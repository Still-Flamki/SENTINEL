import React from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../utils';

export const Reports: React.FC = () => {
  const reports = [
    { id: 'REP-001', name: 'Monthly Fraud Summary - Feb 2024', type: 'Executive', date: '2024-03-01', status: 'COMPLETED', size: '2.4 MB' },
    { id: 'REP-002', name: 'High-Risk Merchant Audit', type: 'Technical', date: '2024-02-28', status: 'COMPLETED', size: '1.8 MB' },
    { id: 'REP-003', name: 'Cross-Border Transaction Analysis', type: 'Intelligence', date: '2024-02-25', status: 'PENDING', size: '-' },
    { id: 'REP-004', name: 'Agent Performance Metrics Q1', type: 'System', date: '2024-02-20', status: 'COMPLETED', size: '4.2 MB' },
    { id: 'REP-005', name: 'SAR Filing Batch #42', type: 'Legal', date: '2024-02-15', status: 'FAILED', size: '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">REPORTS & AUDITS</h1>
          <p className="text-muted-foreground text-sm">Legal-grade documentation and system transparency.</p>
        </div>
        <button className="btn-primary py-2.5 px-6 flex items-center gap-2">
          <FileText size={18} />
          Generate New Report
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: '124', icon: FileText, color: 'text-primary' },
          { label: 'Completed', value: '118', icon: CheckCircle2, color: 'text-success' },
          { label: 'Pending', value: '4', icon: Clock, color: 'text-warning' },
          { label: 'Failed', value: '2', icon: AlertCircle, color: 'text-danger' },
        ].map((stat, i) => (
          <div key={i} className="card p-4 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-surface border border-border ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="bg-background border border-border rounded-lg pl-10 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-bold uppercase tracking-wider">
              <Filter size={14} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-bold uppercase tracking-wider">
              <Calendar size={14} />
              Date Range
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface/30 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <th className="px-6 py-4">Report ID</th>
              <th className="px-6 py-4">Report Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Generated Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-surface/50 transition-colors group">
                <td className="px-6 py-4 text-xs font-mono font-bold text-primary">{report.id}</td>
                <td className="px-6 py-4 text-sm font-bold">{report.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-bold uppercase tracking-wider">
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{report.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      report.status === 'COMPLETED' ? 'bg-success' : 
                      report.status === 'PENDING' ? 'bg-warning animate-pulse' : 'bg-danger'
                    }`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      report.status === 'COMPLETED' ? 'text-success' : 
                      report.status === 'PENDING' ? 'text-warning' : 'text-danger'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{report.size}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-background rounded-lg text-primary transition-colors">
                      <Download size={16} />
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
