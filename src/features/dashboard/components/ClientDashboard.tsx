import React from 'react';
import { WidgetCard } from '../../../components/ui/WidgetCard';
import { Briefcase, BarChart2, CheckCircle, CreditCard } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ClientDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Client Portal</h1>
          <p className="text-zinc-400 mt-1">Welcome! Here is the status of your projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <WidgetCard 
          title="My Active Projects" 
          value="2" 
          icon={Briefcase} 
        />
        <WidgetCard 
          title="Content Published" 
          value="18" 
          icon={BarChart2} 
          trend={{ value: 12.5, isPositive: true }} 
        />
        <WidgetCard 
          title="Pending My Review" 
          value="4" 
          icon={CheckCircle} 
          subtitle="Needs your approval"
        />
        <WidgetCard 
          title="Unpaid Invoices" 
          value="1" 
          icon={CreditCard} 
          subtitle="Total Rp 15M"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 flex flex-col border-t border-t-white/5 min-h-[320px]">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-medium text-zinc-300">Content Review Gallery</h3>
             <Button variant="ghost" size="sm">View All</Button>
           </div>
           <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm">
             Gallery Grid Placeholder
           </div>
        </div>
        <div className="glass-panel p-6 flex flex-col border-t border-t-white/5 min-h-[320px]">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-medium text-zinc-300">Project Progress Tracker</h3>
           </div>
           <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm">
             Timeline & Milestones Mock
           </div>
        </div>
      </div>
    </div>
  );
};
