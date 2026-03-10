import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Share2, 
  History,
  ShieldAlert,
  Globe,
  Database,
  Search as SearchIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InvestigationStep, CaseFile } from '../../types';
import { cn } from '../../utils';

export const InvestigationDesk: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [steps, setSteps] = useState<InvestigationStep[]>([]);
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startInvestigation = async () => {
    if (!query) return;
    setIsInvestigating(true);
    setSteps([]);
    setCaseFile(null);

    // Mocking the ReAct loop streaming
    const mockSteps: InvestigationStep[] = [
      { step: 1, type: 'thinking', title: 'Analyzing Request', content: 'I need to investigate the merchant GHOST_PAY_XK_992 and cross-reference with session data.' },
      { step: 2, type: 'tool_call', title: 'Web Intelligence', content: 'Searching public databases for merchant reputation...', tool: 'web_search' },
      { step: 3, type: 'tool_result', title: 'Search Results', content: 'Found 12 reports of "Card Testing" associated with this merchant name on Reddit and scam-watch forums.', findings: ['Merchant registered 48h ago', 'Server located in Moldova', 'High volume of $0.01 charges reported'] },
      { step: 4, type: 'tool_call', title: 'Internal Query', content: 'Checking other accounts for similar activity...', tool: 'query_session_data' },
      { step: 5, type: 'tool_result', title: 'Cross-Account Match', content: 'Detected 3 other accounts with identical micro-charges within the last 15 minutes.', findings: ['Account ACC-9928: $0.01 at 02:14', 'Account ACC-4412: $0.01 at 02:17'] },
      { step: 6, type: 'thinking', title: 'Synthesizing Evidence', content: 'The pattern confirms a coordinated Multi-Card Sweep attack. Merchant is a ghost entity designed for card validation.' },
    ];

    for (const step of mockSteps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSteps(prev => [...prev, step]);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setCaseFile({
      id: 'CASE-F-992',
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      status: 'OPEN',
      verdict: 'FRAUD',
      confidence: 0.98,
      title: 'Coordinated Multi-Card Sweep Attack',
      narrative: 'A sophisticated attack involving micro-charges across multiple accounts within a tight time window. The merchant "GHOST_PAY_XK_992" shows all hallmarks of a validation shell used by organized fraud rings.',
      subject: { type: 'Merchant', identifier: 'GHOST_PAY_XK_992' },
      affectedTransactions: ['TXN-1', 'TXN-2', 'TXN-3'],
      affectedAccounts: ['ACC-001', 'ACC-002'],
      evidence: [
        { id: 1, title: 'Micro-charge Pattern', description: 'Three $0.01 charges across 3 cards in 8 minutes.', source: 'Internal Data', confidence: 1.0 },
        { id: 2, title: 'Merchant Age', description: 'Domain registered less than 48 hours ago.', source: 'WHOIS API', confidence: 0.95 },
      ],
      recommendedActions: [
        { type: 'BLOCK', label: 'Block all cards', priority: 'URGENT' },
        { type: 'DISPUTE', label: 'Draft bank letter', priority: 'RECOMMENDED' },
      ],
      investigationSteps: mockSteps,
      bankLetterDraft: 'Dear Bank, I am writing to dispute the following unauthorized transactions...'
    });
    setIsInvestigating(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps]);

  return (
    <div className="h-full flex flex-col bg-transparent relative overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar" ref={scrollRef}>
        <div className="max-w-[1200px] mx-auto space-y-10">
          {/* Header */}
          {!isInvestigating && steps.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 lg:py-20"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(0,122,255,0.3)]">
                <SearchIcon size={48} className="text-primary drop-shadow-[0_0_10px_rgba(0,122,255,0.5)]" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6 text-gradient">INVESTIGATION DESK</h1>
              <p className="text-lg lg:text-xl text-foreground/30 max-w-2xl mx-auto font-medium leading-relaxed">
                Let the AI investigate any transaction, merchant, or pattern with complete transparency and real-time intelligence.
              </p>
            </motion.div>
          )}

          {/* Steps */}
          <div className="space-y-6">
            <AnimatePresence>
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-6 lg:p-8 bg-white/[0.01] border-white/5 relative overflow-hidden group"
                >
                  <div className="flex gap-6">
                    <div className="mt-1.5">
                      {step.type === 'thinking' && <Loader2 className="text-primary animate-spin" size={24} />}
                      {step.type === 'tool_call' && <Globe className="text-warning" size={24} />}
                      {step.type === 'tool_result' && <CheckCircle2 className="text-success" size={24} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-black text-xs lg:text-sm uppercase tracking-[0.2em] text-foreground/60">{step.title}</h3>
                        <span className="text-[10px] font-black font-mono text-foreground/20 tracking-widest">STEP 0{step.step}</span>
                      </div>
                      <p className="text-sm lg:text-base leading-relaxed text-foreground/80 font-medium">{step.content}</p>
                      
                      {step.findings && (
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {step.findings.map((f, j) => (
                            <div key={j} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest bg-white/[0.03] p-4 rounded-2xl border border-white/5 shadow-inner">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,122,255,0.6)]" />
                              {f}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Final Case File */}
          {caseFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card overflow-hidden border-danger/30 shadow-2xl shadow-danger/20 p-0"
            >
              <div className="bg-danger h-2.5 w-full shadow-[0_0_20px_rgba(255,59,48,0.4)]" />
              <div className="p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl lg:text-6xl font-black tracking-tighter text-danger uppercase drop-shadow-[0_0_15px_rgba(255,59,48,0.4)]">{caseFile.verdict}</span>
                      <div className="badge bg-danger/20 text-danger border border-danger/30 font-black tracking-widest">
                        {Math.round(caseFile.confidence * 100)}% Confidence
                      </div>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black tracking-tight">{caseFile.title}</h2>
                    <p className="text-[10px] text-foreground/20 font-black uppercase tracking-[0.3em] mt-3">{caseFile.id} • {new Date(caseFile.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/10 transition-all shadow-xl active:scale-90">
                      <Share2 size={20} className="text-foreground/40" />
                    </button>
                    <button className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/10 transition-all shadow-xl active:scale-90">
                      <Download size={20} className="text-foreground/40" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">AI Narrative</h3>
                    <p className="text-base lg:text-lg leading-relaxed text-foreground/80 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 italic font-medium shadow-inner">
                      "{caseFile.narrative}"
                    </p>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Evidence Chain</h3>
                    <div className="space-y-3">
                      {caseFile.evidence.map(e => (
                        <div key={e.id} className="flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl border border-white/5 shadow-inner group hover:bg-white/[0.05] transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-danger/20 flex items-center justify-center text-[10px] font-black text-danger border border-danger/20">
                              {e.id}
                            </div>
                            <span className="text-sm font-black tracking-tight">{e.title}</span>
                          </div>
                          <span className="text-[10px] font-black font-mono text-foreground/20 uppercase tracking-widest">{e.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-10 border-t border-white/5">
                  <button className="btn-primary bg-danger hover:bg-danger/90 flex-1 py-5 flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,59,48,0.3)] active:scale-95">
                    <ShieldAlert size={20} />
                    Confirm Fraud & Block
                  </button>
                  <button className="glass-button flex-1 py-5 flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.2em] shadow-xl active:scale-95">
                    <FileText size={20} className="text-primary" />
                    Draft Bank Letter
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-6 lg:p-10 border-t border-white/5 bg-white/[0.01] backdrop-blur-3xl relative z-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Investigate TXN-9848, Merchant, or Account..." 
              className="w-full bg-white/[0.03] border-2 border-white/10 rounded-[2.5rem] pl-8 lg:pl-10 pr-20 py-5 lg:py-7 text-lg lg:text-xl font-black tracking-tight focus:outline-none focus:border-primary/50 transition-all shadow-2xl placeholder:text-foreground/10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startInvestigation()}
            />
            <button 
              onClick={startInvestigation}
              disabled={isInvestigating || !query}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 bg-primary text-white rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center hover:scale-105 transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(0,122,255,0.4)] active:scale-90"
            >
              {isInvestigating ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
            {['Investigate TXN-9848', 'Who is GHOST_PAY?', 'Build case for ACC-0047'].map(hint => (
              <button 
                key={hint}
                onClick={() => setQuery(hint)}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 hover:text-primary hover:border-primary/30 transition-all px-5 py-2.5 bg-white/[0.03] rounded-full border border-white/10 shadow-lg"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
