import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../../store/useStore';
import { CATEGORIES, TransactionType } from '../../types';
import { cn } from '../../lib/utils';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0.01, { message: "Amount must be greater than 0" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Date is required" }),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function AddTransactionModal() {
  const { isTransactionModalOpen, setTransactionModalOpen, addTransaction } = useStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: undefined,
      category: CATEGORIES.expense[0],
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const type = watch('type');

  useEffect(() => {
    // Reset category when type changes
    if (type === 'expense') {
      setValue('category', CATEGORIES.expense[0]);
    } else {
      setValue('category', CATEGORIES.income[0]);
    }
  }, [type, setValue]);

  const onSubmit = (data: TransactionFormValues) => {
    addTransaction({
      id: crypto.randomUUID(),
      amount: data.amount,
      category: data.category,
      description: data.description || '',
      date: data.date,
      type: data.type,
    });
    reset();
    setTransactionModalOpen(false);
  };

  if (!isTransactionModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setTransactionModalOpen(false)}
          className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-100 dark:border-slate-800"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="text-xl font-bold dark:text-white">Add Transaction</h3>
            <button onClick={() => setTransactionModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setValue('type', 'expense')}
                className={cn(
                  "flex-1 py-2 rounded-xl text-sm font-medium transition-all",
                  type === 'expense' 
                    ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'income')}
                className={cn(
                  "flex-1 py-2 rounded-xl text-sm font-medium transition-all",
                  type === 'income' 
                    ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                Income
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input
                    autoFocus
                    type="number"
                    step="0.01"
                    {...register('amount', { valueAsNumber: true })}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-lg font-medium dark:text-white dark:placeholder-slate-500"
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-xs mt-1 ml-1">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                >
                  {CATEGORIES[type].map((cat: string) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1 ml-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Description (Optional)</label>
                <input
                  type="text"
                  {...register('description')}
                  placeholder="What was this for?"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Date</label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white dark:color-scheme-dark"
                />
                {errors.date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.date.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              className={cn(
                "w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all active:scale-[0.98]",
                type === 'expense' 
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200 dark:shadow-rose-900/20" 
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-emerald-900/20"
              )}
            >
              Add {type === 'expense' ? 'Expense' : 'Income'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
