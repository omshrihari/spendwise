import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget } from '../types';

interface StoreState {
  transactions: Transaction[];
  budgets: Budget[];
  isTransactionModalOpen: boolean;
  isBudgetModalOpen: boolean;
  searchQuery: string;
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  setTransactionModalOpen: (isOpen: boolean) => void;
  setBudgetModalOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      transactions: [],
      budgets: [],
      isTransactionModalOpen: false,
      isBudgetModalOpen: false,
      searchQuery: '',
      theme: 'system',

      addTransaction: (transaction) =>
        set((state) => ({ transactions: [transaction, ...state.transactions] })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      addBudget: (budget) =>
        set((state) => ({ budgets: [...state.budgets, budget] })),
      updateBudget: (budget) =>
        set((state) => ({
          budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
        })),
      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),
      setTransactionModalOpen: (isOpen) =>
        set({ isTransactionModalOpen: isOpen }),
      setBudgetModalOpen: (isOpen) => set({ isBudgetModalOpen: isOpen }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'spendwise-storage', // Key in localStorage
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
        theme: state.theme,
        // We do not persist modal or search query state
      }),
    }
  )
);
