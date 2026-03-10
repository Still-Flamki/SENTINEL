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
    const blocked = newTransactions.filter(t => t.status === 'BLOCKED').length;
    const rate = newTransactions.length > 0 ? (blocked / newTransactions.length) * 100 : 0;

    return {
      transactions: newTransactions,
      liveFeed: newLiveFeed,
      blockedCount: blocked,
      fraudRate: rate,
    };
  }),

  setTransactions: (txs) => set(() => {
    const blocked = txs.filter(t => t.status === 'BLOCKED').length;
    const rate = txs.length > 0 ? (blocked / txs.length) * 100 : 0;
    return {
      transactions: txs,
      liveFeed: txs.slice(0, 40),
      blockedCount: blocked,
      fraudRate: rate,
    };
  }),

  updateTransaction: (id, updates) => set((state) => {
    const newTransactions = state.transactions.map(t => t.id === id ? { ...t, ...updates } : t);
    const newLiveFeed = state.liveFeed.map(t => t.id === id ? { ...t, ...updates } : t);
    const blocked = newTransactions.filter(t => t.status === 'BLOCKED').length;
    const rate = newTransactions.length > 0 ? (blocked / newTransactions.length) * 100 : 0;

    return {
      transactions: newTransactions,
      liveFeed: newLiveFeed,
      blockedCount: blocked,
      fraudRate: rate,
    };
  }),
}));
