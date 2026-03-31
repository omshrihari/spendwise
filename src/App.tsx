import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { BudgetModal } from './components/modals/BudgetModal';

export default function App() {
  return (
    <BrowserRouter>
      {/* Modals are placed globally within BrowserRouter so they can use Navigation context if needed */}
      <AddTransactionModal />
      <BudgetModal />
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* Future routes like settings or analytics can easily be added here */}
        </Route>
      </Routes>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
        
        /* Default color scheme for HTML input type="date" in dark mode */
        .color-scheme-dark {
          color-scheme: dark;
        }
      `}</style>
    </BrowserRouter>
  );
}

