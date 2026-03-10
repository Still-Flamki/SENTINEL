import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  MoreVertical, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTransactionStore } from '../../stores/transactionStore';
import { Transaction, RiskLevel, TransactionStatus } from '../../types';
import { cn } from '../../utils';

export const Transactions: React.FC = () => {
  const { transactions } = useTransactionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tx.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1800px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-gradient">TRANSACTIONS</h1>
          <p className="text-foreground/30 text-base font-medium mt-2">Monitor and manage every transaction across all accounts.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="glass-button flex items-center gap-3">
            <Download size={18} className="text-primary" />
            Export CSV
          </button>
          <button className="btn-primary flex items-center gap-3">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card p-6 flex flex-col md:flex-row gap-6 items-center bg-white/[0.01]">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
          <input 
            type="text" 
            placeholder="Search by merchant, ID, or amount..." 
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all placeholder:text-foreground/20 shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none cursor-pointer min-w-[150px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">All Statuses</option>
            <option value="SAFE">Safe</option>
            <option value="REVIEW">Review</option>
            <option value="BLOCKED">Blocked</option>
            <option value="INVESTIGATING">Investigating</option>
          </select>
          <button className="p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/10 transition-all shadow-lg active:scale-95">
            <ArrowUpDown size={20} className="text-foreground/40" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden bg-white/[0.01] p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Time</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Transaction ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Merchant</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Risk Score</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-all group cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight">{new Date(tx.date).toLocaleTimeString([], { hour12: false })}</span>
                      <span className="text-[10px] text-foreground/20 font-black uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono text-foreground/30 tracking-widest">{tx.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-black text-xs shadow-inner">
                        {tx.merchant[0]}
                      </div>
                      <span className="text-sm font-black tracking-tight">{tx.merchant}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn("text-base font-black tracking-tighter", tx.status === 'BLOCKED' ? "text-danger" : "text-white")}>
                      ${tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 w-20 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                            tx.riskScore > 70 ? "bg-danger" : tx.riskScore > 40 ? "bg-warning" : "bg-success"
                          )} 
                          style={{ width: `${tx.riskScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-black tracking-widest">{tx.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "badge inline-flex items-center gap-2",
                      tx.status === 'SAFE' && "bg-success/20 text-success border-success/30",
                      tx.status === 'REVIEW' && "bg-warning/20 text-warning border-warning/30",
                      tx.status === 'BLOCKED' && "bg-danger/20 text-danger border-danger/30",
                      tx.status === 'INVESTIGATING' && "bg-primary/20 text-primary border-primary/30"
                    )}>
                      {tx.status === 'SAFE' && <ShieldCheck size={12} />}
                      {tx.status === 'REVIEW' && <Clock size={12} />}
                      {tx.status === 'BLOCKED' && <ShieldAlert size={12} />}
                      {tx.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 hover:bg-white/10 rounded-xl transition-all active:scale-90">
                      <MoreVertical size={18} className="text-foreground/20 group-hover:text-foreground/60" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
            Showing {Math.min(filteredTransactions.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredTransactions.length, currentPage * itemsPerPage)} of {filteredTransactions.length} results
          </span>
          <div className="flex items-center gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all shadow-lg active:scale-90"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-10 h-10 text-[10px] font-black rounded-xl transition-all shadow-lg active:scale-90",
                    currentPage === i + 1 ? "bg-primary text-white shadow-[0_0_15px_rgba(0,122,255,0.4)]" : "bg-white/[0.03] border border-white/10 hover:bg-white/10"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all shadow-lg active:scale-90"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

