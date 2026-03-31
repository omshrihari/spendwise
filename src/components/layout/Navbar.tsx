import React from 'react';
import { Wallet, Settings, PlusCircle, Moon, Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const { theme, setTheme, setTransactionModalOpen, setBudgetModalOpen } = useStore();
  const location = useLocation();

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Wallet size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">SpendWise</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setBudgetModalOpen(true)}
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 px-4 py-2 rounded-full flex items-center gap-2 transition-all"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Set Budgets</span>
            </button>
            <button 
              onClick={() => setTransactionModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
