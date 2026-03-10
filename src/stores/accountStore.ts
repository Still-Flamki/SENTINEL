import { create } from 'zustand';
import { Account } from '../types';

interface AccountState {
  accounts: Account[];
  addAccount: (account: Account) => void;
  removeAccount: (id: string) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  addAccount: (account) => set((state) => ({ accounts: [...state.accounts, account] })),
  removeAccount: (id) => set((state) => ({ accounts: state.accounts.filter(a => a.id !== id) })),
  updateAccount: (id, updates) => set((state) => ({
    accounts: state.accounts.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
}));
