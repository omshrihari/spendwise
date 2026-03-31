import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export function StatCards() {
  const { transactions } = useStore();

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      balance: income - expenses,
      income,
      expenses
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Balance</span>
          <div className="p-2 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <Wallet size={20} />
          </div>
        </div>
        <h2 className={cn(
          "text-3xl font-light",
          stats.balance >= 0 ? "text-slate-900 dark:text-white" : "text-red-600 dark:text-red-400"
        )}>
          ₹{stats.balance.toLocaleString()}
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Income</span>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <TrendingUp size={20} />
          </div>
        </div>
        <h2 className="text-3xl font-light text-emerald-600 dark:text-emerald-400">
          +₹{stats.income.toLocaleString()}
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Expenses</span>
          <div className="p-2 bg-rose-50 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl">
            <TrendingDown size={20} />
          </div>
        </div>
        <h2 className="text-3xl font-light text-rose-600 dark:text-rose-400">
          -₹{stats.expenses.toLocaleString()}
        </h2>
      </motion.div>
    </div>
  );
}
