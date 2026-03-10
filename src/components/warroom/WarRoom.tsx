import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Target,
  Globe,
  MoreHorizontal,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useTransactionStore } from '../../stores/transactionStore';
import { useAgentStore } from '../../stores/agentStore';
import { Transaction, AgentResult } from '../../types';

// --- Sub-components ---

const LiveFeedItem = React.memo(({ tx }: { tx: Transaction }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: -20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
    transition={{ 
      type: "spring", 
      stiffness: 500, 
      damping: 30, 
      mass: 0.8 
    }}
    className={cn(
      "p-4 border-b border-border flex items-center gap-4 hover:bg-surface transition-colors duration-200 cursor-pointer group",
      tx.status === 'BLOCKED' && "bg-danger/5 border-l-2 border-l-danger"
    )}
  >
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-mono text-foreground/40">{new Date(tx.date).toLocaleTimeString([], { hour12: false })}</span>
      <div className="w-2 h-2 rounded-full mt-2 shadow-[0_0_8px_rgba(0,122,255,0.5)]" style={{ backgroundColor: '#007AFF' }} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-bold truncate tracking-tight">{tx.merchant}</h4>
        <span className={cn("text-sm font-black", tx.status === 'BLOCKED' ? "text-danger" : "text-success")}>
          ${tx.amount.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] font-mono text-foreground/20 uppercase">{tx.id.slice(0, 8)}</span>
        <div className={cn(
          "badge",
          tx.riskLevel === 'HIGH' ? "bg-danger/10 text-danger border-danger/20" : "bg-success/10 text-success border-success/20"
        )}>
          Score: {tx.riskScore}
        </div>
      </div>
    </div>
    <ChevronRight size={14} className="text-foreground/20 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
  </motion.div>
));

const AgentCard = React.memo(({ agent, icon: Icon, result, isAnalyzing }: { agent: string; icon: any; result?: AgentResult; isAnalyzing: boolean }) => (
  <div className="card p-5 flex flex-col gap-4 relative overflow-hidden group transition-transform duration-300 hover:scale-[1.02]">
    {isAnalyzing && (
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-primary shadow-[0_0_15px_rgba(0,122,255,0.8)]"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    )}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-surface border border-border rounded-xl group-hover:bg-primary/10 transition-colors">
          <Icon size={18} className="text-primary" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-foreground/60">{agent}</span>
      </div>
      <div className={cn(
        "w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]",
        isAnalyzing ? "bg-primary animate-pulse" : (result ? (result.verdict === 'HIGH' ? "bg-danger" : "bg-success") : "bg-surface")
      )} />
    </div>
    
    <div className="flex-1">
      {isAnalyzing ? (
        <div className="space-y-3">
          <div className="h-4 bg-surface rounded-lg w-full animate-pulse" />
          <div className="h-4 bg-surface rounded-lg w-2/3 animate-pulse" />
        </div>
      ) : result ? (
        <div className="space-y-2">
          <p className="text-sm font-bold leading-tight tracking-tight">{result.headline}</p>
          <p className="text-[11px] text-foreground/40 leading-relaxed line-clamp-2">{result.reasoning}</p>
        </div>
      ) : (
        <p className="text-[11px] text-foreground/20 italic font-medium">Awaiting signal...</p>
      )}
    </div>

    {result && (
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-border">
        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Confidence: {(result.confidence * 100).toFixed(0)}%</span>
        <div className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
          result.verdict === 'HIGH' ? "bg-danger/10 text-danger border-danger/20" : "bg-success/10 text-success border-success/20"
        )}>
          {result.verdict}
        </div>
      </div>
    )}
  </div>
));

// --- Main Screen ---

export const WarRoom: React.FC = () => {
  const { liveFeed, blockedCount, fraudRate } = useTransactionStore();
  const { results, isAnalyzing } = useAgentStore();
  const [timelineData, setTimelineData] = useState<any[]>([]);

  useEffect(() => {
    const data = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      val: 40 + Math.floor(Math.random() * 40),
      risk: 10 + Math.floor(Math.random() * 20)
    }));
    setTimelineData(data);
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">WAR ROOM</h1>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Real-time Threat Intelligence</p>
        </div>
        <div className="flex items-center gap-3 bg-surface/50 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-xl">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-border mx-2" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Active Analysts</span>
            <span className="text-xs font-bold">12 Online</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Live Feed (Tall) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-foreground/40">
              <Activity size={14} className="text-primary" />
              Live Signal Feed
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[9px] font-black text-success uppercase tracking-widest">Active</span>
            </div>
          </div>
          
          <div className="card flex-1 overflow-hidden flex flex-col h-[calc(100vh-300px)] min-h-[600px] bg-surface/30 border-white/5">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <AnimatePresence initial={false}>
                {liveFeed.map((tx) => (
                  <LiveFeedItem key={tx.id} tx={tx} />
                ))}
              </AnimatePresence>
            </div>
            <div className="p-4 bg-surface/50 border-t border-border flex justify-center">
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All Signals</button>
            </div>
          </div>
        </div>

        {/* Center/Right Area */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* Top Row: Map & Key Stats */}
          <div className="grid grid-cols-12 gap-6">
            {/* Map Card */}
            <div className="col-span-12 xl:col-span-8 card bg-surface/30 border-white/5 p-0 overflow-hidden relative group min-h-[400px] shadow-2xl">
              <div className="absolute top-6 left-6 z-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-1">Global Risk Distribution</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-[10px] font-bold text-foreground/60">Safe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-danger" />
                    <span className="text-[10px] font-bold text-foreground/60">High Risk</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]/50">
                <ComposableMap projectionConfig={{ scale: 160 }}>
                  <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="rgba(255,255,255,0.03)"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "rgba(0,122,255,0.1)", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>
                  {liveFeed.slice(0, 20).map((tx, i) => (
                    <Marker key={i} coordinates={[tx.location?.lng || 0, tx.location?.lat || 0]}>
                      <motion.circle 
                        initial={{ r: 0, opacity: 0 }}
                        animate={{ r: 4, opacity: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        fill={tx.status === 'BLOCKED' ? '#FF3B30' : '#34C759'} 
                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                      />
                      {tx.status === 'BLOCKED' && (
                        <motion.circle 
                          initial={{ r: 0, opacity: 0 }}
                          animate={{ r: 12, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                          stroke="#FF3B30" 
                          strokeWidth={1}
                          fill="none"
                        />
                      )}
                    </Marker>
                  ))}
                </ComposableMap>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="col-span-12 xl:col-span-4 grid grid-cols-2 gap-4">
              <div className="card bg-primary/5 border-primary/20 p-5 flex flex-col justify-between group hover:bg-primary/10 transition-all">
                <ShieldAlert className="text-primary mb-2" size={20} />
                <div>
                  <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Blocked Today</span>
                  <div className="text-3xl font-black tracking-tighter mt-1">{blockedCount}</div>
                </div>
              </div>
              <div className="card bg-success/5 border-success/20 p-5 flex flex-col justify-between group hover:bg-success/10 transition-all">
                <TrendingUp className="text-success mb-2" size={20} />
                <div>
                  <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Fraud Rate</span>
                  <div className="text-3xl font-black tracking-tighter mt-1">{fraudRate.toFixed(2)}%</div>
                </div>
              </div>
              <div className="col-span-2 card bg-surface/30 border-white/5 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Protection Volume</span>
                  <span className="text-[10px] font-black text-success">+18.4%</span>
                </div>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData}>
                      <defs>
                        <linearGradient id="colorProt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="val" stroke="#007AFF" fill="url(#colorProt)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-2xl font-black tracking-tighter mt-2">${(blockedCount * 1240).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Middle Row: Agent Council */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-foreground/40">
                <ShieldCheck size={14} className="text-primary" />
                Neural Agent Council
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">Processing</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <AgentCard agent="Velocity" icon={Clock} isAnalyzing={isAnalyzing} result={Object.values(results)[0]} />
              <AgentCard agent="Geographic" icon={Globe} isAnalyzing={isAnalyzing} result={Object.values(results)[1]} />
              <AgentCard agent="Behavioral" icon={Activity} isAnalyzing={isAnalyzing} result={Object.values(results)[2]} />
              <AgentCard agent="Pattern" icon={Target} isAnalyzing={isAnalyzing} result={Object.values(results)[3]} />
            </div>
          </div>

          {/* Bottom Row: Orchestrator & Alerts */}
          <div className="grid grid-cols-12 gap-6">
            {/* Orchestrator */}
            <div className="col-span-12 xl:col-span-8 card bg-surface/50 border-primary/20 p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="flex flex-col items-center md:items-start shrink-0">
                  <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] mb-2">Final Verdict</span>
                  <div className="flex items-center gap-4">
                    <span className="text-6xl font-black tracking-tighter text-success drop-shadow-[0_0_20px_rgba(52,199,89,0.3)]">SAFE</span>
                    <div className="p-3 bg-success/10 rounded-2xl border border-success/20">
                      <ShieldCheck className="text-success" size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block h-16 w-px bg-border/50" />
                
                <div className="flex-1 w-full space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Consensus Confidence</span>
                    <span className="text-xs font-black text-primary">98.4%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {['VEL', 'GEO', 'BEH', 'PAT'].map((label, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${80 + Math.random() * 20}%` }}
                            className="h-full bg-primary/60 shadow-[0_0_10px_rgba(0,122,255,0.4)]" 
                          />
                        </div>
                        <span className="text-[8px] font-black text-foreground/20 uppercase tracking-widest block text-center">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button className="btn-primary text-[9px] font-black py-2.5 px-6 uppercase tracking-widest">Approve</button>
                  <button className="glass-button text-[9px] font-black py-2.5 px-6 uppercase tracking-widest">Override</button>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="col-span-12 xl:col-span-4 space-y-4">
              <div className="card p-4 bg-danger/5 border-danger/20 flex items-center gap-4 group hover:bg-danger/10 transition-all cursor-pointer">
                <div className="p-2 bg-danger/10 rounded-xl group-hover:scale-110 transition-transform">
                  <AlertTriangle className="text-danger" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black tracking-tight truncate">High Risk: Card Sweep</p>
                  <p className="text-[10px] font-medium text-foreground/30 mt-0.5 truncate">Lagos, NG • 14 attempts</p>
                </div>
                <span className="text-[9px] font-black text-foreground/20 uppercase">2m</span>
              </div>
              <div className="card p-4 bg-warning/5 border-warning/20 flex items-center gap-4 group hover:bg-warning/10 transition-all cursor-pointer">
                <div className="p-2 bg-warning/10 rounded-xl group-hover:scale-110 transition-transform">
                  <AlertTriangle className="text-warning" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black tracking-tight truncate">Velocity Spike</p>
                  <p className="text-[10px] font-medium text-foreground/30 mt-0.5 truncate">User: @jdoe_99 • 200% inc.</p>
                </div>
                <span className="text-[9px] font-black text-foreground/20 uppercase">8m</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

