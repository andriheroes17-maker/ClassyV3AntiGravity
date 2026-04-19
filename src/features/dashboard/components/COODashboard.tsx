import React from 'react';
import { WidgetCard } from '../../../components/ui/WidgetCard';
import { Users, Clock, CheckCircle, Package } from 'lucide-react';

export const COODashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">COO Dashboard</h1>
          <p className="text-zinc-400 mt-1">Operational OKRs and HR metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <WidgetCard 
          title="Attendance Today" 
          value="98%" 
          icon={Users} 
          subtitle="2 on leave"
        />
        <WidgetCard 
          title="Average Overtime" 
          value="4h 30m" 
          icon={Clock} 
          trend={{ value: 12.5, isPositive: false }} 
        />
        <WidgetCard 
          title="OKR Achievement" 
          value="68%" 
          icon={CheckCircle} 
          trend={{ value: 5.0, isPositive: true }} 
        />
        <WidgetCard 
          title="Procurement Pending" 
          value="3" 
          icon={Package} 
          subtitle="Total Rp 12M"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 min-h-[300px] flex flex-col items-center justify-center border-t border-t-white/5">
          <p className="text-zinc-500">Attendance Bar Chart</p>
        </div>
        <div className="glass-panel p-6 min-h-[300px] flex flex-col border-t border-t-white/5">
           <h3 className="text-sm font-medium text-zinc-400 mb-4">Leave Approvals Pending</h3>
           <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm">
             List Widget Placeholder
           </div>
        </div>
      </div>
    </div>
  );
};
