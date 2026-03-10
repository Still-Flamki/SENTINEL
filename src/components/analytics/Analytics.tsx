import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Globe, TrendingUp, ShieldAlert, Target, Activity, Map as MapIcon } from 'lucide-react';

const ATTACK_DATA = [
  { name: 'Velocity', value: 45, full: 100 },
  { name: 'Geo', value: 80, full: 100 },
  { name: 'Identity', value: 30, full: 100 },
  { name: 'Behavioral', value: 65, full: 100 },
  { name: 'Merchant', value: 90, full: 100 },
  { name: 'Device', value: 40, full: 100 },
];

const PIE_DATA = [
  { name: 'Multi-Card Sweep', value: 400 },
  { name: 'Slow Bleed', value: 300 },
  { name: 'Identity Theft', value: 200 },
  { name: 'Card Testing', value: 100 },
];

const COLORS = ['#7C3AED', '#EF4444', '#F59E0B', '#16A34A'];

export const Analytics: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Intelligence</h1>
          <p className="text-sm text-muted-foreground">Deep retrospective view of all fraud patterns detected.</p>
        </div>
        <div className="flex gap-2">
          {['Today', '7 Days', '30 Days', '1 Year'].map(range => (
            <button key={range} className="px-4 py-2 bg-surface border border-border rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-background transition-colors">
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Heatmap Placeholder */}
        <div className="col-span-12 lg:col-span-8 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Fraud Heatmap Calendar
            </h3>
          </div>
          <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-xl bg-surface/30">
            <div className="text-center">
              <div className="grid grid-cols-52 gap-1 mb-2">
                {Array.from({ length: 364 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: Math.random() > 0.8 ? '#EF4444' : '#E4E4E7' }}
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Retrospective 12-Month Fraud Density</p>
            </div>
          </div>
        </div>

        {/* Attack Vector Radar */}
        <div className="col-span-12 lg:col-span-4 card p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
            <Target size={16} className="text-primary" />
            Attack Vector Radar
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ATTACK_DATA}>
                <PolarGrid stroke="#E4E4E7" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#71717A' }} />
                <PolarRadiusAxis hide />
                <Radar
                  name="Threat"
                  dataKey="value"
                  stroke="#7C3AED"
                  fill="#7C3AED"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Merchant Leaderboard */}
        <div className="col-span-12 lg:col-span-4 card p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
            <ShieldAlert size={16} className="text-danger" />
            High-Risk Merchants
          </h3>
          <div className="space-y-4">
            {[
              { name: 'GHOST_PAY_XK', score: 98, volume: '$4.2k' },
              { name: 'VAL_SHELL_99', score: 94, volume: '$1.8k' },
              { name: 'AMZ_TEST_VALID', score: 88, volume: '$0.4k' },
              { name: 'LUX_CONCIERGE', score: 82, volume: '$12.1k' },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface/50 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground">0{i+1}</span>
                  <span className="text-sm font-bold">{m.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-danger font-bold">{m.score}</span>
                  <span className="text-xs font-bold">{m.volume}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Pie */}
        <div className="col-span-12 lg:col-span-4 card p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
            <Activity size={16} className="text-primary" />
            Fraud Type Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Map Placeholder */}
        <div className="col-span-12 lg:col-span-4 card p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
            <MapIcon size={16} className="text-primary" />
            Geographic Risk Map
          </h3>
          <div className="h-64 bg-surface/30 rounded-xl border border-dashed border-border flex items-center justify-center">
            <div className="text-center">
              <Globe size={40} className="text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Risk Intelligence Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
