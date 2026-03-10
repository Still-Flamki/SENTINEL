import React, { useState, useRef } from 'react';
import { Shield, Upload, Plus, CheckCircle2, AlertCircle, Trash2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { useAccountStore } from '../../stores/accountStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { Transaction, RiskLevel, TransactionStatus, Account } from '../../types';
import { cn } from '../../utils';

const BANK_LOGOS = [
  { name: 'Chase', color: '#00447C' },
  { name: 'Amex', color: '#006FCF' },
  { name: 'Wells Fargo', color: '#D71E28' },
  { name: 'Citi', color: '#003B70' },
  { name: 'Bank of America', color: '#E31837' },
];

export const AccountVault: React.FC = () => {
  const { accounts, addAccount, removeAccount } = useAccountStore();
  const { setTransactions } = useTransactionStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as any[];
        const normalizedTransactions: Transaction[] = rawData.map((row) => {
          const amount = parseFloat(row.amount || row.Amount || row.Value || '0');
          const isSuspicious = Math.random() > 0.95;
          
          return {
            id: `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
            accountId: `ACC-${uuidv4().slice(0, 4)}`,
            date: row.date || row.Date || new Date().toISOString(),
            amount: Math.abs(amount),
            currency: row.currency || row.Currency || 'USD',
            merchant: row.merchant || row.Merchant || row.Description || 'Unknown Merchant',
            category: row.category || row.Category || 'General',
            location: { city: 'New York', country: 'US', lat: 40.7128, lng: -74.0060 },
            deviceId: uuidv4(),
            ipAddress: '192.168.1.1',
            riskScore: isSuspicious ? Math.floor(Math.random() * 60) + 40 : Math.floor(Math.random() * 20),
            riskLevel: (isSuspicious ? 'HIGH' : 'LOW') as RiskLevel,
            status: (isSuspicious ? 'REVIEW' : 'SAFE') as TransactionStatus,
            attackType: null,
            flagReasons: isSuspicious ? ['Unusual Amount', 'New Location'] : [],
            agentResults: null,
            caseId: null,
            crossAccountFlags: [],
          };
        });

        const newAccount: Account = {
          id: `ACC-${uuidv4().slice(0, 8).toUpperCase()}`,
          bankName: file.name.split('.')[0],
          accountNickname: 'Primary Account',
          lastFourDigits: Math.floor(1000 + Math.random() * 9000).toString(),
          color: BANK_LOGOS[Math.floor(Math.random() * BANK_LOGOS.length)].color,
          currency: 'USD',
          transactions: normalizedTransactions,
          profile: {
            avgTransactionAmount: 45.50,
            avgDailyTransactions: 2.4,
            knownMerchants: ['Amazon', 'Uber', 'Starbucks'],
            typicalActiveHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
            homeCountry: 'US',
            knownDevices: ['iPhone 15 Pro', 'MacBook Pro'],
          },
          riskStatus: 'PROTECTED',
          addedAt: new Date().toISOString(),
        };

        addAccount(newAccount);
        setTransactions(normalizedTransactions);
        setIsUploading(false);
      },
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      handleFileUpload(file);
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto p-4 lg:p-10 space-y-10 w-full">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-gradient">ACCOUNT VAULT</h1>
        <p className="text-foreground/30 text-base font-medium mt-2">Which of your financial accounts do you want to protect?</p>
      </div>

      {accounts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-10 lg:py-20"
        >
          <div className="card w-full max-w-3xl p-8 lg:p-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,122,255,0.3)]">
              <Shield className="text-primary w-10 h-10 drop-shadow-[0_0_8px_rgba(0,122,255,0.5)]" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black mb-6 tracking-tight">Protect your entire financial life — not just one card.</h2>
            
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-full border-2 border-dashed rounded-[2rem] p-10 lg:p-20 transition-all cursor-pointer flex flex-col items-center gap-6",
                isDragging ? "border-primary bg-primary/5" : "border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
              )}
            >
              <Upload className={cn("w-12 h-12 transition-all duration-500", isDragging ? "text-primary scale-110" : "text-foreground/20")} />
              <div className="text-xl font-black tracking-tight">
                {isUploading ? "Normalizing data..." : "Drop any bank CSV here, or click to browse."}
              </div>
              <p className="text-sm text-foreground/30 font-medium">Works with any bank. If your bank offers CSV export, Sentinel works with it.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv" 
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
            </div>

            <div className="mt-16 w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 mb-8">Supported Institutions</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 opacity-20 grayscale">
                {BANK_LOGOS.slice(0, 10).map((bank) => (
                  <div key={bank.name} className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{bank.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {accounts.map((account) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card p-8 relative group overflow-hidden"
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 w-2" 
                  style={{ backgroundColor: account.color }}
                />
                
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-black text-xl shadow-inner">
                      {account.bankName[0]}
                    </div>
                    <div>
                      <h3 className="font-black text-lg leading-tight tracking-tight">{account.accountNickname}</h3>
                      <p className="text-[10px] text-foreground/30 font-black uppercase tracking-widest">{account.bankName} •••• {account.lastFourDigits}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeAccount(account.id)}
                    className="p-2.5 text-foreground/20 hover:text-danger transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-2">Transactions</p>
                    <p className="text-2xl font-black tracking-tighter">{account.transactions.length}</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-2">Risk Status</p>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                        account.riskStatus === 'PROTECTED' ? "bg-success" : "bg-warning animate-pulse"
                      )} />
                      <span className="text-xs font-black uppercase tracking-widest">{account.riskStatus}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-white/[0.03] hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95">
                  View Details
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="card p-8 border-dashed border-2 border-white/10 flex flex-col items-center justify-center gap-4 hover:bg-white/[0.02] hover:border-primary/50 transition-all group min-h-[250px]"
          >
            <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/50 transition-all duration-500 shadow-xl">
              <Plus className="text-foreground/20 group-hover:text-primary transition-all duration-500 scale-125" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-foreground/20 group-hover:text-primary transition-all duration-500">Add Another Account</span>
          </button>
        </div>
      )}
    </div>
  );
};
