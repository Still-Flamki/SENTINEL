import { create } from 'zustand';
import { Transaction, RiskLevel, TransactionStatus } from '../types';

interface TransactionState {
  transactions: Transaction[];
  liveFeed: Transaction[];
  blockedCount: number;
  fraudRate: number;
  addTransaction: (tx: Transaction) => void;
  setTransactions: (txs: Transaction[]) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  liveFeed: [],
  blockedCount: 0,
  fraudRate: 0,

  addTransaction: (tx) => set((state) => {
    const newTransactions = [tx, ...state.transactions];
    const newLiveFeed = [tx, ...state.liveFeed].slice(0, 40);
    const isBlocked = tx.status === 'BLOCKED';
    const newBlockedCount = state.blockedCount + (isBlocked ? 1 : 0);
    const rate = newTransactions.length > 0 ? (newBlockedCount / newTransactions.length) * 100 : 0;

    return {
      transactions: newTransactions,
      liveFeed: newLiveFeed,
      blockedCount: newBlockedCount,
      fraudRate: rate,
    };
  }),

  setTransactions: (txs) => set(() => {
    const blocked = txs.reduce((acc, t) => acc + (t.status === 'BLOCKED' ? 1 : 0), 0);
    const rate = txs.length > 0 ? (blocked / txs.length) * 100 : 0;
    return {
      transactions: txs,
      liveFeed: txs.slice(0, 40),
      blockedCount: blocked,
      fraudRate: rate,
    };
  }),

  updateTransaction: (id, updates) => set((state) => {
    let blockedDelta = 0;
    const newTransactions = state.transactions.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        if (t.status !== 'BLOCKED' && updated.status === 'BLOCKED') blockedDelta = 1;
        if (t.status === 'BLOCKED' && updated.status !== 'BLOCKED') blockedDelta = -1;
        return updated;
      }
      return t;
    });
    
    const newLiveFeed = state.liveFeed.map(t => t.id === id ? { ...t, ...updates } : t);
    const newBlockedCount = state.blockedCount + blockedDelta;
    const rate = newTransactions.length > 0 ? (newBlockedCount / newTransactions.length) * 100 : 0;

    return {
      transactions: newTransactions,
      liveFeed: newLiveFeed,
      blockedCount: newBlockedCount,
      fraudRate: rate,
    };
  }),
}));
