import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { motion } from 'motion/react';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#71717a'];

export function ChartsGroup() {
  const { transactions, budgets, theme } = useStore();

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const tooltipStyle = {
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    color: isDarkMode ? '#f8fafc' : '#0f172a'
  };

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        data[t.category] = (data[t.category] || 0) + t.amount;
      });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const d = subMonths(now, i);
      return format(d, 'MMM');
    }).reverse();

    return last6Months.map(month => {
      const monthTransactions = transactions.filter(t => format(parseISO(t.date), 'MMM') === month);
      const inc = monthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const exp = monthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      return { name: month, income: inc, expense: exp };
    });
  }, [transactions]);

  const budgetProgress = useMemo(() => {
    const currentMonth = startOfMonth(new Date());
    const endOfCurrentMonth = endOfMonth(new Date());

    return budgets.map(budget => {
      const spent = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.category === budget.category &&
          isWithinInterval(parseISO(t.date), { start: currentMonth, end: endOfCurrentMonth })
        )
        .reduce((acc, t) => acc + t.amount, 0);
      
      return {
        ...budget,
        spent,
        percentage: Math.min((spent / budget.limit) * 100, 100)
      };
    });
  }, [transactions, budgets]);

  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Budget Progress */}
      {budgetProgress.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 dark:text-white">
            <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
            Monthly Budgets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgetProgress.map(budget => (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{budget.category}</span>
                  <span className="text-slate-500 dark:text-slate-400">₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${budget.percentage}%` }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      budget.percentage > 90 ? "bg-rose-500" : budget.percentage > 70 ? "bg-amber-500" : "bg-blue-500"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Overview */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 dark:text-white">
          <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
          Monthly Overview
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#94a3b8' : '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} hide />
              <Tooltip 
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              />
              <Legend iconType="circle" wrapperStyle={{color: isDarkMode ? '#f8fafc' : '#0f172a'}} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 dark:text-white">
          <PieChartIcon size={20} className="text-blue-600 dark:text-blue-400" />
          Expenses by Category
        </h3>
        <div className="h-[300px] w-full">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                />
                <Legend wrapperStyle={{color: isDarkMode ? '#f8fafc' : '#0f172a'}} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 italic">
              No expense data to visualize
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
