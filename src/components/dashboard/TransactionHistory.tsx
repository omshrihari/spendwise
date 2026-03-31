import React, { useMemo } from 'react';
import { History, ArrowUpCircle, ArrowDownCircle, Trash2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export function TransactionHistory() {
  const { transactions, deleteTransaction, searchQuery, setSearchQuery } = useStore();

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    const lowerQuery = searchQuery.toLowerCase();
    
    return transactions.filter(t => 
      t.description.toLowerCase().includes(lowerQuery) || 
      t.category.toLowerCase().includes(lowerQuery) ||
      t.amount.toString().includes(lowerQuery)
    );
  }, [transactions, searchQuery]);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 h-fit transition-colors">
      <div className="mb-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center justify-between dark:text-white">
          <div className="flex items-center gap-2">
            <History size={20} className="text-blue-600 dark:text-blue-400" />
            Recent History
          </div>
        </h3>
        
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm dark:text-white dark:placeholder-slate-400"
          />
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <p>{searchQuery ? "No matching transactions found." : "No transactions yet."}</p>
              {!searchQuery && <p className="text-sm mt-1">Start by adding one!</p>}
            </div>
          ) : (
            filteredTransactions.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 group hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl",
                    t.type === 'income' 
                      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400" 
                      : "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400"
                  )}>
                    {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{t.description || t.category}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{format(parseISO(t.date), 'dd/MM/yyyy')} • {t.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "font-semibold",
                    t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  )}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
