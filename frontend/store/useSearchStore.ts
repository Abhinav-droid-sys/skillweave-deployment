import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  history: string[];
  addHistory: (query: string) => void;
  clearHistory: () => void;
  currentQuery: string;
  setCurrentQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      history: [],
      addHistory: (query: string) => 
        set((state) => {
          const trimmed = query.trim();
          if (!trimmed) return state;
          const filtered = state.history.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
          return { history: [trimmed, ...filtered].slice(0, 15) };
        }),
      clearHistory: () => set({ history: [] }),
      currentQuery: "",
      setCurrentQuery: (query: string) => set({ currentQuery: query }),
    }),
    {
      name: 'sw_recent_searches',
      partialize: (state) => ({ history: state.history }), // Only persist history
    }
  )
);
