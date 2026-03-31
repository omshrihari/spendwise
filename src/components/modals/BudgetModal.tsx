import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../types';

const budgetSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }),
  limit: z.number().min(0.01, { message: "Limit must be greater than 0" }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

export function BudgetModal() {
  const { isBudgetModalOpen, setBudgetModalOpen, budgets, addBudget, updateBudget, deleteBudget } = useStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: CATEGORIES.expense[0],
      limit: undefined,
    },
  });

  const onSubmit = (data: BudgetFormValues) => {
    const existingBudget = budgets.find(b => b.category === data.category);
    if (existingBudget) {
      updateBudget({ ...existingBudget, limit: data.limit });
    } else {
      addBudget({
        id: crypto.randomUUID(),
        category: data.category,
        limit: data.limit,
      });
    }
    reset();
    setBudgetModalOpen(false);
  };

  if (!isBudgetModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setBudgetModalOpen(false)}
          className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-100 dark:border-slate-800"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="text-xl font-bold dark:text-white">Set Category Budget</h3>
            <button onClick={() => setBudgetModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                >
                  {CATEGORIES.expense.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1 ml-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Monthly Limit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input
                    autoFocus
                    type="number"
                    step="0.01"
                    {...register('limit', { valueAsNumber: true })}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-lg font-medium dark:text-white dark:placeholder-slate-500"
                  />
                </div>
                {errors.limit && <p className="text-red-500 text-xs mt-1 ml-1">{errors.limit.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              Save Budget
            </button>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Existing Budgets</h4>
              {budgets.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic">No budgets set yet.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {budgets.map(b => (
                    <div key={b.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm transition-colors">
                      <span className="font-medium dark:text-slate-200">{b.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 dark:text-slate-400">₹{b.limit.toLocaleString()}</span>
                        <button 
                          type="button"
                          onClick={() => deleteBudget(b.id)}
                          className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
