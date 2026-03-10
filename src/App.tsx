import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from './components/layout/Layout';
import { useWebSocket } from './hooks/useWebSocket';
import { motion, AnimatePresence } from 'motion/react';

import { AccountVault } from './components/vault/AccountVault';
import { WarRoom } from './components/warroom/WarRoom';
import { Transactions } from './components/transactions/Transactions';
import { InvestigationDesk } from './components/investigation/InvestigationDesk';
import { FraudRingMap } from './components/ringmap/FraudRingMap';
import { Analytics } from './components/analytics/Analytics';
import { CaseFiles } from './components/casefiles/CaseFiles';
import { Config } from './components/config/Config';
import { Reports } from './components/reports/Reports';
import { Team } from './components/team/Team';
import { IntelligenceHub } from './components/intelligence/IntelligenceHub';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState('warroom');
  
  // Initialize WebSocket connection
  useWebSocket();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'vault': return <AccountVault />;
      case 'warroom': return <WarRoom />;
      case 'transactions': return <Transactions />;
      case 'investigation': return <InvestigationDesk />;
      case 'ringmap': return <FraudRingMap />;
      case 'intelligence': return <IntelligenceHub />;
      case 'analytics': return <Analytics />;
      case 'casefiles': return <CaseFiles />;
      case 'reports': return <Reports />;
      case 'team': return <Team />;
      case 'config': return <Config />;
      default: return <WarRoom />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Liquid Mesh Background Layer */}
      <div className="liquid-mesh" />
      
      {/* Floating Decorative Blobs */}
      <div className="floating-blob w-[500px] h-[500px] bg-primary/20 top-[-10%] left-[-10%]" />
      <div className="floating-blob w-[400px] h-[400px] bg-accent/20 bottom-[-5%] right-[-5%] [animation-delay:-5s]" />
      <div className="floating-blob w-[300px] h-[300px] bg-warning/10 top-[20%] right-[10%] [animation-delay:-10s]" />
      
      {/* Sidebar Layer */}
      <Sidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header title={activeScreen} />
        
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
