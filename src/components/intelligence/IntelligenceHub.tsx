import React from 'react';
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Clock, 
  Target,
  BrainCircuit,
  Terminal,
  Database,
  Network
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAgentStore } from '../../stores/agentStore';
import { AgentResult } from '../../types';
import { cn } from '../../utils';

const AgentDetailCard: React.FC<{ agent: string; icon: any; result?: AgentResult; isAnalyzing: boolean }> = ({ agent, icon: Icon, result, isAnalyzing }) => (
  <div className="card p-8 flex flex-col gap-6 relative overflow-hidden group">
    {isAnalyzing && (
      <motion.div 
        className="absolute bottom-0 left-0 h-1.5 bg-primary shadow-[0_0_20px_rgba(0,122,255,0.8)]"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    )}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl group-hover:bg-white/10 transition-all duration-500 shadow-inner">
          <Icon size={24} className="text-primary drop-shadow-[0_0_8px_rgba(0,122,255,0.4)]" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/60">{agent} AGENT</h3>
          <p className="text-[10px] text-foreground/20 font-black uppercase tracking-[0.2em]">Active Intelligence</p>
        </div>
      </div>
      <div className={cn(
        "w-4 h-4 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]",
        isAnalyzing ? "bg-primary animate-pulse" : (result ? (result.verdict === 'HIGH' ? "bg-danger" : "bg-success") : "bg-white/5")
      )} />
    </div>

    <div className="flex-1 space-y-6">
      {isAnalyzing ? (
        <div className="space-y-4">
          <div className="h-5 bg-white/5 rounded-xl w-full animate-pulse" />
          <div className="h-5 bg-white/5 rounded-xl w-5/6 animate-pulse" />
          <div className="h-5 bg-white/5 rounded-xl w-2/3 animate-pulse" />
        </div>
      ) : result ? (
        <div className="space-y-4">
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] shadow-inner">
            <p className="text-base font-black leading-tight mb-3 tracking-tight">{result.headline}</p>
            <p className="text-xs text-foreground/40 leading-relaxed font-medium">{result.reasoning}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-2">Confidence</p>
              <p className="text-xl font-black tracking-tighter">{(result.confidence * 100).toFixed(0)}%</p>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-2">Verdict</p>
              <p className={cn("text-xl font-black tracking-tighter", result.verdict === 'HIGH' ? "text-danger" : "text-success")}>
                {result.verdict}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
          <Terminal size={32} className="text-foreground/10 mb-4" />
          <p className="text-[10px] text-foreground/20 font-black uppercase tracking-[0.3em]">Awaiting Signal...</p>
        </div>
      )}
    </div>

    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i < 4 ? 'bg-primary/40 shadow-[0_0_8px_rgba(0,122,255,0.3)]' : 'bg-white/5'}`} />
        ))}
      </div>
      <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-foreground transition-colors">View Logs</button>
    </div>
  </div>
);

export const IntelligenceHub: React.FC = () => {
  const { results, isAnalyzing } = useAgentStore();

  return (
    <div className="space-y-10 p-4 lg:p-10 max-w-[1800px] mx-auto w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-gradient">AI COUNCIL COMMAND</h1>
          <p className="text-foreground/30 text-base font-medium mt-2">Autonomous multi-agent intelligence orchestration.</p>
        </div>
        <div className="flex gap-4">
          <button className="glass-button flex items-center gap-3">
            <Database size={18} className="text-primary" />
            Training Data
          </button>
          <button className="btn-primary flex items-center gap-3">
            <BrainCircuit size={20} />
            Retrain Agents
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-10">
        {/* Orchestrator Status */}
        <div className="col-span-12 lg:col-span-4 card p-6 lg:p-10 bg-white/[0.01] border-primary/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 lg:w-80 h-60 lg:h-80 bg-primary/10 blur-[100px] lg:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 lg:gap-5 mb-8 lg:mb-12">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(0,122,255,0.5)]">
                <Zap className="text-white lg:size-8" size={24} />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-black tracking-tighter">ORCHESTRATOR V.4</h2>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">System Core Active</p>
              </div>
            </div>
            
            <div className="space-y-8 lg:space-y-10">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-foreground/40">
                  <span>Processing Load</span>
                  <span className="text-primary">42%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '42%' }}
                    className="h-full bg-primary shadow-[0_0_15px_rgba(0,122,255,0.6)]"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-foreground/40">
                  <span>Agent Consensus</span>
                  <span className="text-success">98.2%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '98.2%' }}
                    className="h-full bg-success shadow-[0_0_15px_rgba(52,199,89,0.6)]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-16 p-4 lg:p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] lg:rounded-[2rem] relative z-10 shadow-inner">
            <div className="flex items-center gap-4 mb-4 lg:mb-6">
              <Activity size={18} className="lg:size-20 text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">Real-time Pulse</span>
            </div>
            <div className="flex items-end gap-1 lg:gap-1.5 h-12 lg:h-16">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                  className="flex-1 bg-primary/30 rounded-full shadow-[0_0_10px_rgba(0,122,255,0.2)]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
          <AgentDetailCard agent="Velocity" icon={Clock} isAnalyzing={isAnalyzing} result={Object.values(results)[0]} />
          <AgentDetailCard agent="Geographic" icon={Globe} isAnalyzing={isAnalyzing} result={Object.values(results)[1]} />
          <AgentDetailCard agent="Behavioral" icon={Activity} isAnalyzing={isAnalyzing} result={Object.values(results)[2]} />
          <AgentDetailCard agent="Pattern" icon={Target} isAnalyzing={isAnalyzing} result={Object.values(results)[3]} />
        </div>
      </div>

      {/* System Logs */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Terminal size={16} className="text-primary" />
            Intelligence Stream
          </h3>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-surface border border-border rounded text-[9px] font-bold uppercase text-muted-foreground">DEBUG</span>
            <span className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[9px] font-bold uppercase text-primary">INFO</span>
          </div>
        </div>
        <div className="space-y-3 font-mono text-[11px]">
          {[
            { time: '14:22:01', msg: 'Velocity Agent: Outlier detected in user-429 session frequency.', type: 'info' },
            { time: '14:21:58', msg: 'Geographic Agent: Cross-referencing IP 192.168.1.42 with known proxy exit nodes.', type: 'info' },
            { time: '14:21:55', msg: 'Orchestrator: Consensus reached for TX-9928. Verdict: SAFE.', type: 'success' },
            { time: '14:21:50', msg: 'Pattern Agent: Matching behavioral signature against "Card Sweep" template.', type: 'info' },
          ].map((log, i) => (
            <div key={i} className="flex gap-4 p-2 hover:bg-surface rounded transition-colors">
              <span className="text-muted-foreground">[{log.time}]</span>
              <span className={log.type === 'success' ? 'text-success' : 'text-zinc-300'}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

