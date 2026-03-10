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

const SparkCard = React.memo(({ title, value, trend, data }: { title: string; value: string; trend: string; data: any[] }) => (
  <div className="card p-6 flex flex-col gap-4 group hover:scale-[1.02] transition-all duration-500">
    <div className="flex justify-between items-start">
      <span className="text-[11px] font-black text-foreground/30 uppercase tracking-[0.2em]">{title}</span>
      <span className={cn(
        "text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-3xl border shadow-lg",
        trend.startsWith('-') ? "bg-danger/20 text-danger border-danger/30" : "bg-success/20 text-success border-success/30"
      )}>
        {trend}
      </span>
    </div>
    <div className="flex items-end justify-between gap-6">
      <span className="text-4xl font-black tracking-tighter text-gradient">{value}</span>
      <div className="h-12 w-28 opacity-40 group-hover:opacity-100 transition-all duration-700 filter drop-shadow-[0_0_10px_rgba(0,122,255,0.3)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="val" stroke="#007AFF" fill="url(#colorVal)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
));

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
    // Mock timeline data
    const data = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      val: Math.floor(Math.random() * 100)
    }));
    setTimelineData(data);
  }, []);

  const kpiData = [
    { title: 'Transactions Analyzed', value: liveFeed.length.toString(), trend: '+12%', data: timelineData },
    { title: 'Fraud Blocked', value: blockedCount.toString(), trend: '+5', data: timelineData },
    { title: 'Money Protected', value: `$${(blockedCount * 1240).toLocaleString()}`, trend: '+$4.2k', data: timelineData },
    { title: 'Fraud Rate', value: `${fraudRate.toFixed(1)}%`, trend: '-0.4%', data: timelineData },
    { title: 'Avg Detection Time', value: '420ms', trend: '-15ms', data: timelineData },
    { title: 'Agent Accuracy', value: '99.4%', trend: '+0.2%', data: timelineData },
  ];

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1800px] mx-auto w-full">
      {/* KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiData.map((kpi, i) => (
          <SparkCard key={i} {...kpi} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-10">
        {/* Live Feed */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 text-foreground/40">
              <Activity size={18} className="text-primary" />
              Live Feed
            </h3>
            <span className="text-[10px] font-black text-success flex items-center gap-2 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(52,199,89,0.6)]" />
              LIVE
            </span>
          </div>
          <div className="card flex-1 overflow-hidden flex flex-col max-h-[700px] bg-surface">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <AnimatePresence initial={false}>
                {liveFeed.map((tx) => (
                  <LiveFeedItem key={tx.id} tx={tx} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Agent Council */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 text-foreground/40">
            <ShieldCheck size={18} className="text-primary" />
            Agent Council
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AgentCard agent="Velocity" icon={Clock} isAnalyzing={isAnalyzing} result={Object.values(results)[0]} />
            <AgentCard agent="Geographic" icon={Globe} isAnalyzing={isAnalyzing} result={Object.values(results)[1]} />
            <AgentCard agent="Behavioral" icon={Activity} isAnalyzing={isAnalyzing} result={Object.values(results)[2]} />
            <AgentCard agent="Pattern" icon={Target} isAnalyzing={isAnalyzing} result={Object.values(results)[3]} />
          </div>
          
          {/* Orchestrator Panel */}
          <div className="card p-10 bg-surface border-primary/30 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Orchestrator Verdict</span>
              <div className="flex gap-4">
                <button className="btn-primary text-[10px] font-black py-3 px-8 uppercase tracking-widest shadow-[0_10px_20px_rgba(0,122,255,0.3)]">Confirm Decision</button>
                <button className="glass-button text-[10px] font-black uppercase tracking-widest py-3 px-8">Override</button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-7xl font-black tracking-tighter text-success drop-shadow-[0_0_30px_rgba(52,199,89,0.4)]">SAFE</span>
                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] mt-2">Final Decision</span>
              </div>
              <div className="hidden md:block h-20 w-px bg-border" />
              <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-8">
                {['VEL', 'GEO', 'BEH', 'PAT'].map((label, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">{label}</span>
                    <div className="h-3 bg-surface rounded-full overflow-hidden border border-border shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
                        className="h-full bg-primary shadow-[0_0_15px_rgba(0,122,255,0.6)]" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* World Map */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-8">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 text-foreground/40">
            <Globe size={18} className="text-primary drop-shadow-[0_0_8px_rgba(0,122,255,0.5)]" />
            World Risk Map
          </h3>
          <div className="card flex-1 bg-surface p-6 min-h-[400px] relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="w-full h-full flex items-center justify-center">
              <ComposableMap projectionConfig={{ scale: 180 }}>
                <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="var(--surface)"
                        stroke="var(--border)"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "var(--primary)", fillOpacity: 0.1, outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
                {liveFeed.slice(0, 15).map((tx, i) => (
                  <Marker key={i} coordinates={[tx.location?.lng || 0, tx.location?.lat || 0]}>
                    <motion.circle 
                      initial={{ r: 0, opacity: 0 }}
                      animate={{ r: 5, opacity: 1 }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      fill={tx.status === 'BLOCKED' ? '#FF3B30' : '#34C759'} 
                      className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                    <motion.circle 
                      initial={{ r: 0, opacity: 0 }}
                      animate={{ r: 15, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                      stroke={tx.status === 'BLOCKED' ? '#FF3B30' : '#34C759'} 
                      strokeWidth={1}
                      fill="none"
                    />
                  </Marker>
                ))}
              </ComposableMap>
            </div>
          </div>
          
          {/* Alerts */}
          <div className="space-y-4">
            <div className="card p-5 bg-danger/5 border-danger/20 flex items-center gap-4 shadow-lg">
              <div className="p-2 bg-danger/10 rounded-xl">
                <AlertTriangle className="text-danger" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black tracking-tight">High Risk Alert</p>
                <p className="text-[11px] font-medium text-foreground/30 mt-1">Multi-card sweep detected in Lagos, NG</p>
              </div>
              <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">2m ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="card p-8 h-64 bg-surface shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Risk Timeline (24h)</span>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,122,255,0.5)]" />
              <span className="text-foreground/40">VOLUME</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-danger shadow-[0_0_10px_rgba(255,59,48,0.5)]" />
              <span className="text-foreground/40">RISK SCORE</span>
            </div>
          </div>
        </div>
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}
                itemStyle={{ color: 'var(--fg)', fontSize: '10px', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="val" stroke="#007AFF" strokeWidth={4} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

