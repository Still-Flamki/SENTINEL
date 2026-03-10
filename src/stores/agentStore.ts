import { create } from 'zustand';
import { AgentResult } from '../types';

interface AgentState {
  activeAgent: string | null;
  results: Record<string, AgentResult>; // txId -> result
  isAnalyzing: boolean;
  setAnalyzing: (val: boolean) => void;
  addResult: (txId: string, result: AgentResult) => void;
  clearResults: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  activeAgent: null,
  results: {},
  isAnalyzing: false,
  setAnalyzing: (val) => set({ isAnalyzing: val }),
  addResult: (txId, result) => set((state) => ({
    results: { ...state.results, [txId]: result }
  })),
  clearResults: () => set({ results: {} }),
}));
