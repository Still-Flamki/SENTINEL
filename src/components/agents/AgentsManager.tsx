import React, { useState } from 'react';
import { 
  Bot, 
  Plus, 
  Settings2, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  MoreVertical, 
  Play, 
  Pause, 
  RefreshCw,
  TrendingUp,
  Zap,
  Target,
  Clock,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Heart,
  Loader2,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  YAxis, 
  XAxis, 
  Tooltip 
} from 'recharts';
import { AIAgent } from '../../types';

const MOCK_HISTORY = [
  { date: '03-01', accuracy: 0.94, latency: 55 },
  { date: '03-02', accuracy: 0.95, latency: 52 },
  { date: '03-03', accuracy: 0.94, latency: 58 },
  { date: '03-04', accuracy: 0.96, latency: 50 },
  { date: '03-05', accuracy: 0.97, latency: 48 },
  { date: '03-06', accuracy: 0.96, latency: 49 },
  { date: '03-07', accuracy: 0.98, latency: 46 },
];

const MOCK_AGENTS: AIAgent[] = [
  {
    id: '1',
    name: 'Velocity Sentinel',
    type: 'velocity',
    status: 'ACTIVE',
    performance: { accuracy: 0.98, precision: 0.96, recall: 0.97, latency: 12 },
    config: { threshold: 0.85, learningRate: 0.01, dataSources: ['Transactions', 'User History'], lastTrained: '2026-03-09T10:00:00Z' },
    history: MOCK_HISTORY,
    description: 'Monitors transaction frequency and volume anomalies across all accounts.'
  },
  {
    id: '2',
    name: 'Geo-Fence Guardian',
    type: 'geo',
    status: 'ACTIVE',
    performance: { accuracy: 0.99, precision: 0.98, recall: 0.99, latency: 8 },
    config: { threshold: 0.90, learningRate: 0.005, dataSources: ['IP Geolocation', 'Device GPS'], lastTrained: '2026-03-08T15:30:00Z' },
    history: MOCK_HISTORY.map(h => ({ ...h, accuracy: h.accuracy + 0.01, latency: h.latency - 30 })),
    description: 'Detects impossible travel and location-based fraud patterns.'
  },
  {
    id: '3',
    name: 'Behavioral Analyst',
    type: 'behavior',
    status: 'TRAINING',
    performance: { accuracy: 0.92, precision: 0.89, recall: 0.91, latency: 45 },
    config: { threshold: 0.75, learningRate: 0.02, dataSources: ['Clickstream', 'Keystroke Dynamics'], lastTrained: '2026-03-10T01:00:00Z' },
    history: MOCK_HISTORY.map(h => ({ ...h, accuracy: h.accuracy - 0.03, latency: h.latency + 20 })),
    description: 'Analyzes user interaction patterns to identify non-human or hijacked sessions.'
  },
  {
    id: '4',
    name: 'Fraud Ring Detector',
    type: 'pattern',
    status: 'ACTIVE',
    performance: { accuracy: 0.95, precision: 0.94, recall: 0.93, latency: 120 },
    config: { threshold: 0.80, learningRate: 0.01, dataSources: ['Graph Database', 'Social Links'], lastTrained: '2026-03-05T09:00:00Z' },
    history: MOCK_HISTORY.map(h => ({ ...h, accuracy: h.accuracy - 0.01, latency: h.latency + 80 })),
    description: 'Identifies clusters of related accounts participating in organized fraud rings.'
  }
];

const MetricSparkline: React.FC<{ data: any[], dataKey: string, color: string }> = ({ data, dataKey, color }) => (
  <div className="h-10 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          fillOpacity={1} 
          fill={`url(#gradient-${dataKey})`} 
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const AgentsManager: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>(MOCK_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newSource, setNewSource] = useState('');
  const [checkingHealthId, setCheckingHealthId] = useState<string | null>(null);
  const [healthResults, setHealthResults] = useState<Record<string, {
    status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
    cpu: number;
    memory: number;
    network: number;
    timestamp: string;
  }>>({});
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: 'velocity' as AIAgent['type'],
    description: '',
    threshold: 0.8,
    learningRate: 0.01,
  });

  const runHealthCheck = async (agentId: string) => {
    setCheckingHealthId(agentId);
    
    // Simulate diagnostic process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statuses: ('HEALTHY' | 'DEGRADED' | 'CRITICAL')[] = ['HEALTHY', 'HEALTHY', 'DEGRADED'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    setHealthResults(prev => ({
      ...prev,
      [agentId]: {
        status: randomStatus,
        cpu: Math.floor(Math.random() * 40) + 10,
        memory: Math.floor(Math.random() * 30) + 20,
        network: Math.floor(Math.random() * 50) + 5,
        timestamp: new Date().toISOString()
      }
    }));
    
    setCheckingHealthId(null);
  };

  const handleAddSource = () => {
    if (!newSource.trim() || !selectedAgent) return;
    const updatedAgent = {
      ...selectedAgent,
      config: {
        ...selectedAgent.config,
        dataSources: [...selectedAgent.config.dataSources, newSource.trim()]
      }
    };
    setSelectedAgent(updatedAgent);
    setNewSource('');
  };

  const handleRemoveSource = (sourceToRemove: string) => {
    if (!selectedAgent) return;
    const updatedAgent = {
      ...selectedAgent,
      config: {
        ...selectedAgent.config,
        dataSources: selectedAgent.config.dataSources.filter(s => s !== sourceToRemove)
      }
    };
    setSelectedAgent(updatedAgent);
  };

  const handleSaveConfig = () => {
    if (!selectedAgent) return;
    setAgents(prev => prev.map(a => a.id === selectedAgent.id ? selectedAgent : a));
    setSelectedAgent(null);
  };

  const handleDeployAgent = () => {
    if (!newAgent.name.trim()) return;
    
    const deployedAgent: AIAgent = {
      id: Math.random().toString(36).substr(2, 9),
      name: newAgent.name,
      type: newAgent.type,
      status: 'TRAINING',
      performance: { accuracy: 0, precision: 0, recall: 0, latency: 0 },
      config: {
        threshold: newAgent.threshold,
        learningRate: newAgent.learningRate,
        dataSources: ['Initial Sync'],
        lastTrained: new Date().toISOString(),
      },
      history: [],
      description: newAgent.description,
    };
    
    setAgents(prev => [deployedAgent, ...prev]);
    setIsCreating(false);
    setNewAgent({
      name: '',
      type: 'velocity',
      description: '',
      threshold: 0.8,
      learningRate: 0.01,
    });
  };

  const getStatusColor = (status: AIAgent['status']) => {
    switch (status) {
      case 'ACTIVE': return 'text-success bg-success/10 border-success/20';
      case 'INACTIVE': return 'text-foreground/40 bg-foreground/5 border-foreground/10';
      case 'TRAINING': return 'text-primary bg-primary/10 border-primary/20';
      case 'ERROR': return 'text-danger bg-danger/10 border-danger/20';
      default: return 'text-foreground/40 bg-foreground/5 border-foreground/10';
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">AI Agents</h1>
            <p className="text-foreground/40 mt-2 font-medium">Deploy and manage specialized neural sentinels for real-time fraud detection.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <Plus size={20} />
            <span>Deploy New Agent</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Active Agents', value: agents.filter(a => a.status === 'ACTIVE').length, icon: Bot, color: 'text-primary' },
            { label: 'Avg. Accuracy', value: '96.4%', icon: Target, color: 'text-success' },
            { label: 'Avg. Latency', value: '46ms', icon: Zap, color: 'text-warning' },
            { label: 'Total Scans (24h)', value: '1.2M', icon: Activity, color: 'text-accent' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border p-6 rounded-[2.5rem] shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-foreground/5 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <TrendingUp size={16} className="text-success" />
              </div>
              <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
              <div className="text-xs font-black text-foreground/20 uppercase tracking-widest mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-2 gap-8">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-surface border border-border rounded-[3rem] p-8 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedAgent(agent)}
            >
              {/* Background Glow */}
              <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
                agent.status === 'ACTIVE' ? 'bg-success' : 'bg-primary'
              }`} />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${
                    agent.status === 'ACTIVE' ? 'bg-success/10 border-success/20 text-success' : 'bg-primary/10 border-primary/20 text-primary'
                  }`}>
                    <Bot size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black tracking-tighter">{agent.name}</h3>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        agent.status === 'ACTIVE' ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                        agent.status === 'TRAINING' ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
                        agent.status === 'ERROR' ? 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                        'bg-foreground/20'
                      }`} />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                      <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">
                        Type: {agent.type}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-foreground/5 rounded-xl transition-colors text-foreground/20 hover:text-foreground">
                  <MoreVertical size={20} />
                </button>
              </div>

              <p className="mt-6 text-foreground/60 text-sm leading-relaxed font-medium">
                {agent.description}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-8">
                <div className="flex items-center justify-between bg-foreground/5 p-4 rounded-2xl border border-border/50">
                  <div>
                    <div className="text-lg font-black tracking-tighter">{(agent.performance.accuracy * 100).toFixed(1)}%</div>
                    <div className="text-[9px] font-black text-foreground/20 uppercase tracking-widest flex items-center gap-1">
                      Accuracy <ArrowUpRight size={10} className="text-success" />
                    </div>
                  </div>
                  <MetricSparkline data={agent.history} dataKey="accuracy" color="#10b981" />
                </div>
                <div className="flex items-center justify-between bg-foreground/5 p-4 rounded-2xl border border-border/50">
                  <div>
                    <div className="text-lg font-black tracking-tighter">{agent.performance.latency}ms</div>
                    <div className="text-[9px] font-black text-foreground/20 uppercase tracking-widest flex items-center gap-1">
                      Latency <ArrowDownRight size={10} className="text-success" />
                    </div>
                  </div>
                  <MetricSparkline data={agent.history} dataKey="latency" color="#f59e0b" />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground/40">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Last Trained: {new Date(agent.config.lastTrained).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      runHealthCheck(agent.id);
                    }}
                    disabled={checkingHealthId === agent.id}
                    className={`p-2 rounded-xl transition-all ${
                      checkingHealthId === agent.id ? 'bg-primary/10 text-primary animate-spin' : 'hover:bg-danger/10 hover:text-danger'
                    }`}
                    title="Run Health Check"
                  >
                    {checkingHealthId === agent.id ? <Loader2 size={18} /> : <Heart size={18} />}
                  </button>
                  <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                    <Settings2 size={18} />
                  </button>
                  <button className="p-2 hover:bg-success/10 hover:text-success rounded-xl transition-all">
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgent(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface border border-border w-full max-w-4xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-10 border-b border-border flex items-center justify-between bg-surface/50 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border shadow-2xl ${
                    selectedAgent.status === 'ACTIVE' ? 'bg-success/10 border-success/20 text-success' : 'bg-primary/10 border-primary/20 text-primary'
                  }`}>
                    <Bot size={40} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-black tracking-tighter">{selectedAgent.name}</h2>
                      <div className={`w-3 h-3 rounded-full animate-pulse ${
                        selectedAgent.status === 'ACTIVE' ? 'bg-success shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 
                        selectedAgent.status === 'TRAINING' ? 'bg-primary shadow-[0_0_12px_rgba(59,130,246,0.5)]' : 
                        selectedAgent.status === 'ERROR' ? 'bg-danger shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 
                        'bg-foreground/20'
                      }`} />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs font-black px-3 py-1 rounded-full border uppercase tracking-widest ${getStatusColor(selectedAgent.status)}`}>
                        {selectedAgent.status}
                      </span>
                      <span className="text-xs font-black text-foreground/20 uppercase tracking-widest">
                        Agent ID: {selectedAgent.id}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => runHealthCheck(selectedAgent.id)}
                    disabled={checkingHealthId === selectedAgent.id}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                      checkingHealthId === selectedAgent.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-danger/10 text-danger hover:bg-danger/20'
                    }`}
                  >
                    {checkingHealthId === selectedAgent.id ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Heart size={20} />
                    )}
                    <span>{checkingHealthId === selectedAgent.id ? 'Diagnosing...' : 'Health Check'}</span>
                  </button>
                  <button className="flex items-center gap-2 bg-foreground/5 hover:bg-foreground/10 px-6 py-3 rounded-2xl font-bold transition-all">
                    {selectedAgent.status === 'ACTIVE' ? <Pause size={20} /> : <Play size={20} />}
                    <span>{selectedAgent.status === 'ACTIVE' ? 'Pause Agent' : 'Resume Agent'}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedAgent(null)}
                    className="p-3 hover:bg-foreground/5 rounded-2xl transition-colors text-foreground/40 hover:text-foreground"
                  >
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                {/* Health Check Results */}
                {healthResults[selectedAgent.id] && (
                  <section className="bg-foreground/5 border border-border/50 rounded-[3rem] p-10 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                      healthResults[selectedAgent.id].status === 'HEALTHY' ? 'bg-success' : 
                      healthResults[selectedAgent.id].status === 'DEGRADED' ? 'bg-warning' : 'bg-danger'
                    }`} />
                    
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${
                          healthResults[selectedAgent.id].status === 'HEALTHY' ? 'bg-success/10 text-success' : 
                          healthResults[selectedAgent.id].status === 'DEGRADED' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                        }`}>
                          <ShieldCheck size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black tracking-tighter">Diagnostic Report</h3>
                          <p className="text-sm font-medium text-foreground/40">Last verified: {new Date(healthResults[selectedAgent.id].timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className={`px-6 py-2 rounded-full border font-black text-xs uppercase tracking-widest ${
                        healthResults[selectedAgent.id].status === 'HEALTHY' ? 'bg-success/10 text-success border-success/20' : 
                        healthResults[selectedAgent.id].status === 'DEGRADED' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-danger/10 text-danger border-danger/20'
                      }`}>
                        {healthResults[selectedAgent.id].status}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                      {[
                        { label: 'CPU Load', value: healthResults[selectedAgent.id].cpu + '%', icon: Cpu, color: 'text-primary' },
                        { label: 'Memory', value: healthResults[selectedAgent.id].memory + '%', icon: HardDrive, color: 'text-accent' },
                        { label: 'Network', value: healthResults[selectedAgent.id].network + 'ms', icon: Network, color: 'text-warning' },
                      ].map((res, i) => (
                        <div key={i} className="bg-surface border border-border p-6 rounded-3xl">
                          <div className="flex items-center gap-3 mb-3">
                            <res.icon size={16} className={res.color} />
                            <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">{res.label}</span>
                          </div>
                          <div className="text-2xl font-black tracking-tighter">{res.value}</div>
                          <div className="mt-3 h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: res.value }}
                              className={`h-full ${res.color.replace('text-', 'bg-')}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Performance Metrics */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Activity size={20} className="text-primary" />
                    <h3 className="text-lg font-black tracking-tighter uppercase tracking-widest text-foreground/40">Performance Metrics</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                    {[
                      { label: 'Accuracy', value: (selectedAgent.performance.accuracy * 100).toFixed(1) + '%', icon: Target, key: 'accuracy', color: '#10b981' },
                      { label: 'Precision', value: (selectedAgent.performance.precision * 100).toFixed(1) + '%', icon: ShieldCheck, key: 'accuracy', color: '#3b82f6' },
                      { label: 'Recall', value: (selectedAgent.performance.recall * 100).toFixed(1) + '%', icon: AlertCircle, key: 'accuracy', color: '#8b5cf6' },
                      { label: 'Latency', value: selectedAgent.performance.latency + 'ms', icon: Zap, key: 'latency', color: '#f59e0b' },
                    ].map((metric, i) => (
                      <div key={i} className="bg-foreground/5 border border-border/50 p-6 rounded-[2rem] flex flex-col justify-between">
                        <div>
                          <metric.icon size={20} className="text-foreground/20 mb-3" />
                          <div className="text-2xl font-black tracking-tighter">{metric.value}</div>
                          <div className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mt-1">{metric.label}</div>
                        </div>
                        <div className="mt-4">
                          <MetricSparkline data={selectedAgent.history} dataKey={metric.key} color={metric.color} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Configuration */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Settings2 size={20} className="text-primary" />
                    <h3 className="text-lg font-black tracking-tighter uppercase tracking-widest text-foreground/40">Configuration</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Agent Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                            value={selectedAgent.name}
                            onChange={(e) => setSelectedAgent({ ...selectedAgent, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Sentinel Type</label>
                          <select 
                            className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none"
                            value={selectedAgent.type}
                            onChange={(e) => setSelectedAgent({ ...selectedAgent, type: e.target.value as any })}
                          >
                            <option value="velocity">Velocity</option>
                            <option value="geo">Geolocation</option>
                            <option value="behavior">Behavioral</option>
                            <option value="pattern">Pattern Matching</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Description</label>
                        <textarea 
                          className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all min-h-[80px] resize-none"
                          value={selectedAgent.description}
                          onChange={(e) => setSelectedAgent({ ...selectedAgent, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Risk Threshold</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            className="flex-1 accent-primary cursor-pointer" 
                            value={selectedAgent.config.threshold * 100} 
                            onChange={(e) => setSelectedAgent({
                              ...selectedAgent,
                              config: { ...selectedAgent.config, threshold: parseInt(e.target.value) / 100 }
                            })}
                          />
                          <span className="text-lg font-black w-12">{(selectedAgent.config.threshold * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Learning Rate</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            className="flex-1 accent-primary cursor-pointer" 
                            min="1"
                            max="50"
                            value={selectedAgent.config.learningRate * 1000} 
                            onChange={(e) => setSelectedAgent({
                              ...selectedAgent,
                              config: { ...selectedAgent.config, learningRate: parseInt(e.target.value) / 1000 }
                            })}
                          />
                          <span className="text-lg font-black w-12">{selectedAgent.config.learningRate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-foreground/5 border border-border/50 p-8 rounded-[2.5rem]">
                      <div className="flex items-center gap-2 mb-4">
                        <Database size={16} className="text-foreground/40" />
                        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Data Sources</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.config.dataSources.map((source, i) => (
                          <span key={i} className="bg-surface border border-border px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
                            {source}
                            <button 
                              onClick={() => handleRemoveSource(source)}
                              className="text-foreground/20 hover:text-danger transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <input 
                          type="text" 
                          value={newSource}
                          onChange={(e) => setNewSource(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSource()}
                          placeholder="Add new data source..."
                          className="flex-1 bg-surface border border-border px-4 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <button 
                          onClick={handleAddSource}
                          className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Training Logs */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={20} className="text-primary" />
                      <h3 className="text-lg font-black tracking-tighter uppercase tracking-widest text-foreground/40">Training History</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          const now = new Date().toISOString();
                          setSelectedAgent({
                            ...selectedAgent,
                            status: 'TRAINING',
                            config: { ...selectedAgent.config, lastTrained: now }
                          });
                          // Simulate training finish
                          setTimeout(() => {
                            setAgents(prev => prev.map(a => a.id === selectedAgent.id ? { ...selectedAgent, status: 'ACTIVE', config: { ...selectedAgent.config, lastTrained: now } } : a));
                          }, 3000);
                        }}
                        className="text-xs font-black bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/20 transition-all"
                      >
                        Retrain Sentinel
                      </button>
                      <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View Full Logs</button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { date: '2026-03-09 10:00', event: 'Full Retraining Complete', status: 'SUCCESS', accuracy: '+0.2%' },
                      { date: '2026-03-08 14:20', event: 'Incremental Update', status: 'SUCCESS', accuracy: '+0.05%' },
                      { date: '2026-03-07 09:15', event: 'Data Source Validation', status: 'SUCCESS', accuracy: 'N/A' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl border border-border/30">
                        <div className="flex items-center gap-4">
                          <div className="text-[10px] font-black text-foreground/20 font-mono">{log.date}</div>
                          <div className="text-sm font-bold">{log.event}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-success">{log.accuracy}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/20 uppercase tracking-widest">{log.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Modal Footer */}
              <div className="p-10 border-t border-border bg-surface/50 backdrop-blur-md flex items-center justify-end gap-4">
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="px-8 py-4 rounded-2xl font-bold text-foreground/40 hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveConfig}
                  className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/20"
                >
                  Save Configuration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deployment Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface border border-border w-full max-w-2xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-border">
                <h2 className="text-3xl font-black tracking-tighter">Deploy New Sentinel</h2>
                <p className="text-foreground/40 mt-2 font-medium">Configure a new AI agent to protect your ecosystem.</p>
              </div>
              <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Agent Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Behavioral Guardian v2" 
                    className="w-full bg-foreground/5 border border-border rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" 
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Description</label>
                  <textarea 
                    placeholder="Describe the agent's purpose..." 
                    className="w-full bg-foreground/5 border border-border rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all min-h-[100px] resize-none" 
                    value={newAgent.description}
                    onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Sentinel Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Velocity', value: 'velocity' },
                      { label: 'Geolocation', value: 'geo' },
                      { label: 'Behavioral', value: 'behavior' },
                      { label: 'Pattern Matching', value: 'pattern' }
                    ].map((type) => (
                      <button 
                        key={type.value} 
                        onClick={() => setNewAgent({ ...newAgent, type: type.value as any })}
                        className={`p-6 border rounded-[2rem] text-left transition-all group ${
                          newAgent.type === type.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        <div className={`text-sm font-black tracking-tight ${newAgent.type === type.value ? 'text-primary' : 'group-hover:text-primary'}`}>{type.label}</div>
                        <div className="text-[10px] text-foreground/40 mt-1 font-medium">Specialized neural detection</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Initial Threshold ({(newAgent.threshold * 100).toFixed(0)}%)</label>
                    <input 
                      type="range" 
                      className="w-full accent-primary cursor-pointer" 
                      value={newAgent.threshold * 100}
                      onChange={(e) => setNewAgent({ ...newAgent, threshold: parseInt(e.target.value) / 100 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Learning Rate ({newAgent.learningRate})</label>
                    <input 
                      type="range" 
                      min="1"
                      max="50"
                      className="w-full accent-primary cursor-pointer" 
                      value={newAgent.learningRate * 1000}
                      onChange={(e) => setNewAgent({ ...newAgent, learningRate: parseInt(e.target.value) / 1000 })}
                    />
                  </div>
                </div>
              </div>
              <div className="p-10 border-t border-border flex items-center justify-end gap-4">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="px-8 py-4 rounded-2xl font-bold text-foreground/40 hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeployAgent}
                  disabled={!newAgent.name.trim()}
                  className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Deploy Agent
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
