import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Network, 
  Filter, 
  Maximize2, 
  RefreshCcw, 
  ShieldAlert,
  User,
  ShoppingBag,
  Globe,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  type: 'account' | 'merchant' | 'ip' | 'device';
  label: string;
  risk: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

export const FraudRingMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Mock data for fraud ring
    const nodes: Node[] = [
      { id: 'A1', type: 'account', label: 'ACC-001', risk: 85 },
      { id: 'A2', type: 'account', label: 'ACC-002', risk: 85 },
      { id: 'A3', type: 'account', label: 'ACC-003', risk: 85 },
      { id: 'M1', type: 'merchant', label: 'GHOST_PAY', risk: 95 },
      { id: 'M2', type: 'merchant', label: 'VAL_SHELL', risk: 95 },
      { id: 'IP1', type: 'ip', label: '192.168.1.42', risk: 90 },
      { id: 'D1', type: 'device', label: 'iPhone 15 Pro', risk: 80 },
    ];

    const links: any[] = [
      { source: 'A1', target: 'M1', value: 1 },
      { source: 'A2', target: 'M1', value: 1 },
      { source: 'A3', target: 'M1', value: 1 },
      { source: 'A1', target: 'IP1', value: 1 },
      { source: 'A2', target: 'IP1', value: 1 },
      { source: 'A3', target: 'IP1', value: 1 },
      { source: 'M1', target: 'M2', value: 1 },
      { source: 'A1', target: 'D1', value: 1 },
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#E4E4E7")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => setSelectedNode(d));

    node.append("circle")
      .attr("r", 20)
      .attr("fill", d => d.risk > 80 ? "#FEE2E2" : "#DCFCE7")
      .attr("stroke", d => d.risk > 80 ? "#EF4444" : "#22C55E")
      .attr("stroke-width", 2);

    node.append("text")
      .attr("dy", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "#71717A")
      .text(d => d.label);

    // Add icons (simplified as text for now, could use SVG paths)
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("font-family", "lucide-react")
      .attr("font-size", "14px")
      .attr("fill", d => d.risk > 80 ? "#EF4444" : "#22C55E")
      .text(d => {
        if (d.type === 'account') return '👤';
        if (d.type === 'merchant') return '🛍️';
        if (d.type === 'ip') return '🌐';
        return '📱';
      });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, []);

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 lg:p-6 border-b border-white/5 bg-white/[0.01] backdrop-blur-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8 w-full sm:w-auto">
          <h1 className="text-xl lg:text-2xl font-black tracking-tighter flex items-center gap-3 text-gradient">
            <Network className="text-primary" size={24} />
            FRAUD RING MAP
          </h1>
          <div className="hidden sm:block h-8 w-px bg-white/10" />
          <div className="flex flex-wrap justify-center gap-2">
            {['All Nodes', 'Fraud Rings', 'Shared IPs'].map(filter => (
              <button key={filter} className="px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-primary hover:border-primary/30 transition-all shadow-lg active:scale-95">
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <button className="p-3 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/10 transition-all shadow-xl active:scale-90"><RefreshCcw size={20} className="text-white/40" /></button>
          <button className="p-3 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/10 transition-all shadow-xl active:scale-90"><Maximize2 size={20} className="text-white/40" /></button>
          <button className="btn-primary text-[10px] font-black uppercase tracking-[0.2em] py-3 px-6 shadow-[0_10px_20px_rgba(0,122,255,0.3)] active:scale-95">Run Detection</button>
        </div>
      </div>

      <div className="flex-1 relative">
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        
        {/* Node Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="absolute top-0 right-0 bottom-0 w-full sm:w-96 bg-white/[0.01] backdrop-blur-[60px] border-l border-white/10 p-8 lg:p-10 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className={cn(
                    "badge mb-4 font-black tracking-widest uppercase",
                    selectedNode.risk > 80 ? "bg-danger/20 text-danger border-danger/30" : "bg-success/20 text-success border-success/30"
                  )}>
                    Risk: {selectedNode.risk}%
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter mb-2">{selectedNode.label}</h2>
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">{selectedNode.type}</p>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-3 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/10 transition-all active:scale-90 shadow-xl">
                  <RefreshCcw size={18} className="rotate-45 text-white/40" />
                </button>
              </div>

              <div className="space-y-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">Entity Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-white/30">First Seen</span>
                      <span className="text-white/80">Jan 12, 2024</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-white/30">Total Volume</span>
                      <span className="text-white/80 font-black tracking-tight">$12,450.00</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-white/30">Connections</span>
                      <span className="text-white/80">4 Active</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">Risk Assessment</h3>
                  <div className="p-6 bg-danger/10 border border-danger/20 rounded-[2rem] shadow-inner">
                    <div className="flex items-center gap-3 mb-3">
                      <ShieldAlert size={18} className="text-danger" />
                      <span className="text-xs font-black text-danger uppercase tracking-widest">High Risk Detected</span>
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium italic">
                      "This entity is part of a confirmed fraud ring involving 5 other nodes and shared IP addresses."
                    </p>
                  </div>
                </div>

                <button className="w-full btn-primary py-5 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,122,255,0.3)] active:scale-95">
                  Investigate Entity
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 card p-6 bg-white/[0.01] backdrop-blur-3xl border-white/10 hidden lg:block">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-white/20">Legend</h4>
          <div className="space-y-4">
            {[
              { label: 'Account', icon: User, color: '#007AFF' },
              { label: 'Merchant', icon: ShoppingBag, color: '#AF52DE' },
              { label: 'IP Address', icon: Globe, color: '#8E8E93' },
              { label: 'Device', icon: Smartphone, color: '#FF9500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <item.icon size={16} style={{ color: item.color }} />
                </div>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

