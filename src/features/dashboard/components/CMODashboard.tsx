import React from 'react';
import { WidgetCard } from '../../../components/ui/WidgetCard';
import { Target, Users, TrendingUp, Mail } from 'lucide-react';

export const CMODashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CMO Dashboard</h1>
          <p className="text-zinc-400 mt-1">Marketing performance and lead funnel analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <WidgetCard 
          title="New Leads (MTD)" 
          value="142" 
          icon={Users} 
          trend={{ value: 18.2, isPositive: true }} 
        />
        <WidgetCard 
          title="Win Rate" 
          value="24%" 
          icon={Target} 
          trend={{ value: 2.1, isPositive: true }} 
        />
        <WidgetCard 
          title="Attributed Revenue" 
          value="Rp 124M" 
          icon={TrendingUp} 
          trend={{ value: 5.4, isPositive: true }}
        />
        <WidgetCard 
          title="Email Campaign Open Rate" 
          value="42%" 
          icon={Mail} 
        />
      </div>

      <div className="glass-panel p-6 min-h-[300px] flex flex-col items-center justify-center border-t border-t-white/5">
        <p className="text-zinc-500">Lead Funnel Visual Chart</p>
      </div>
    </div>
  );
};
