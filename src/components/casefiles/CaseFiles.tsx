import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Download, 
  ChevronRight, 
  ExternalLink,
  Clock,
  ShieldAlert,
  ShieldCheck,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CaseFile, CaseVerdict, CaseStatus } from '../../types';

const MOCK_CASES: CaseFile[] = [
  {
    id: 'CASE-F-992',
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    status: 'OPEN',
    verdict: 'FRAUD',
    confidence: 0.98,
    title: 'Coordinated Multi-Card Sweep Attack',
    narrative: 'A sophisticated attack involving micro-charges across multiple accounts within a tight time window.',
    subject: { type: 'Merchant', identifier: 'GHOST_PAY_XK_992' },
    affectedTransactions: ['TXN-1', 'TXN-2'],
    affectedAccounts: ['ACC-001', 'ACC-002'],
    evidence: [],
    recommendedActions: [],
    investigationSteps: [],
    bankLetterDraft: null
  },
  {
    id: 'CASE-F-441',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    resolvedAt: new Date().toISOString(),
    status: 'RESOLVED',
    verdict: 'CLEAR',
    confidence: 0.92,
    title: 'False Positive: Apple Store Purchase',
    narrative: 'Investigation confirmed the transaction was a legitimate hardware purchase by the account holder.',
    subject: { type: 'Transaction', identifier: 'TXN-8821' },
    affectedTransactions: ['TXN-8821'],
    affectedAccounts: ['ACC-001'],
    evidence: [],
    recommendedActions: [],
    investigationSteps: [],
    bankLetterDraft: null
  }
];

export const CaseFiles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);

  const filteredCases = MOCK_CASES.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Case Files</h1>
          <p className="text-sm text-muted-foreground">Database of all AI-driven investigations and legal-grade reports.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={16} />
          Export All Cases
        </button>
      </div>

      <div className="card p-4 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search cases by ID, title, or subject..." 
            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface transition-colors">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((c) => (
          <motion.div
            key={c.id}
            layoutId={c.id}
            onClick={() => setSelectedCase(c)}
            className="card p-6 cursor-pointer hover:border-primary/50 transition-all group relative overflow-hidden"
          >
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1.5",
              c.verdict === 'FRAUD' ? "bg-danger" : c.verdict === 'CLEAR' ? "bg-success" : "bg-warning"
            )} />
            
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest">{c.id}</span>
              <div className={cn(
                "badge",
                c.status === 'OPEN' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {c.status}
              </div>
            </div>

            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{c.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-6">{c.narrative}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface/50 p-2 rounded-lg border border-border/50">
                <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Verdict</p>
                <div className="flex items-center gap-1.5">
                  {c.verdict === 'FRAUD' ? <ShieldAlert size={12} className="text-danger" /> : <ShieldCheck size={12} className="text-success" />}
                  <span className={cn("text-xs font-bold", c.verdict === 'FRAUD' ? "text-danger" : "text-success")}>{c.verdict}</span>
                </div>
              </div>
              <div className="bg-surface/50 p-2 rounded-lg border border-border/50">
                <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Confidence</p>
                <span className="text-xs font-bold">{Math.round(c.confidence * 100)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
                <Calendar size={12} />
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Case Detail Overlay (Simplified) */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2">{selectedCase.title}</h2>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-muted-foreground">{selectedCase.id}</span>
                      <div className="badge bg-danger/10 text-danger">{selectedCase.verdict}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-surface rounded-lg">
                    <MoreVertical size={24} />
                  </button>
                </div>
                
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Executive Summary</h3>
                    <p className="text-lg leading-relaxed">{selectedCase.narrative}</p>
                  </section>

                  <div className="grid grid-cols-2 gap-8">
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Subject Information</h3>
                      <div className="card p-4 bg-surface/50">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Type</span>
                          <span className="text-sm font-bold">{selectedCase.subject.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Identifier</span>
                          <span className="text-sm font-mono font-bold">{selectedCase.subject.identifier}</span>
                        </div>
                      </div>
                    </section>
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-xs font-bold">Created: {new Date(selectedCase.createdAt).toLocaleString()}</span>
                        </div>
                        {selectedCase.resolvedAt && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <span className="text-xs font-bold">Resolved: {new Date(selectedCase.resolvedAt).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex gap-4">
                  <button className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                    <Download size={20} />
                    Download Legal PDF
                  </button>
                  <button className="flex-1 py-4 bg-surface border border-border rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-background transition-colors">
                    <ExternalLink size={20} />
                    Share with Bank
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
