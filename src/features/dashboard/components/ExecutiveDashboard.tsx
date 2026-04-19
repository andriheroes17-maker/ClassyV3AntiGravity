import React from 'react';
import { WidgetCard } from '../../../components/ui/WidgetCard';
import { DollarSign, Briefcase, FileText, CheckCircle2 } from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-zinc-400 mt-1">Company-wide overview and key metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <WidgetCard 
          title="Revenue (MTD)" 
          value="Rp 128.5M" 
          icon={DollarSign} 
          trend={{ value: 12.5, isPositive: true }} 
        />
        <WidgetCard 
          title="Net Profit (MTD)" 
          value="Rp 45.2M" 
          icon={CheckCircle2} 
          trend={{ value: 4.2, isPositive: true }} 
        />
        <WidgetCard 
          title="Active Projects" 
          value="24" 
          icon={Briefcase} 
          trend={{ value: 2.1, isPositive: false }} 
        />
        <WidgetCard 
          title="Pending Approvals" 
          value="12" 
          icon={FileText} 
          subtitle="3 urgent proposals"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 min-h-[320px] flex flex-col items-center justify-center border-t border-t-white/5">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium text-zinc-300">P&L 6 Months Trend</h3>
            <p className="text-zinc-500 text-sm mt-2">Chart widget will be mounted here in Fase 4</p>
          </div>
        </div>
        <div className="glass-panel p-6 min-h-[320px] flex flex-col border-t border-t-white/5">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">Pipeline Value</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
             <p className="text-zinc-500 text-sm">CRM Data Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};
