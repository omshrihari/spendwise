import React from 'react';
import { StatCards } from '../components/dashboard/StatCards';
import { ChartsGroup } from '../components/dashboard/ChartsGroup';
import { TransactionHistory } from '../components/dashboard/TransactionHistory';

export function Dashboard() {
  return (
    <>
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartsGroup />
        <TransactionHistory />
      </div>
    </>
  );
}
