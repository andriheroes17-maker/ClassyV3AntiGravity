import React from 'react';
import { WidgetCard } from '../../../components/ui/WidgetCard';
import { CreditCard, TrendingUp, AlertTriangle, PieChart } from 'lucide-react';

export const CFODashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CFO Dashboard</h1>
          <p className="text-zinc-400 mt-1">Financial overview and tax alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <WidgetCard 
          title="Cash Position" 
          value="Rp 540M" 
          icon={CreditCard} 
          trend={{ value: 8.4, isPositive: true }} 
        />
        <WidgetCard 
          title="P&L (MTD)" 
          value="Rp 82M" 
          icon={TrendingUp} 
          trend={{ value: 1.2, isPositive: true }} 
        />
        <WidgetCard 
          title="Overdue Invoices" 
          value="Rp 35M" 
          icon={AlertTriangle} 
          subtitle="From 3 clients"
        />
        <WidgetCard 
          title="Upcoming Payroll" 
          value="Rp 120M" 
          icon={PieChart} 
          subtitle="Due in 5 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 min-h-[300px] flex flex-col items-center justify-center border-t border-t-white/5">
          <p className="text-zinc-500">Income vs Expense Chart Placeholder</p>
        </div>
        <div className="glass-panel p-6 min-h-[300px] flex flex-col items-center justify-center border-t border-t-white/5">
          <p className="text-zinc-500">Budget Utilization Distribution</p>
        </div>
      </div>
    </div>
  );
};
