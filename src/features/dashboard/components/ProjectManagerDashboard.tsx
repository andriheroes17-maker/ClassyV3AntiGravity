import React from 'react';
import { WidgetCard } from '../../../components/ui/WidgetCard';
import { Briefcase, AlertOctagon, CheckSquare, Users } from 'lucide-react';

export const ProjectManagerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">PM Dashboard</h1>
          <p className="text-zinc-400 mt-1">My projects and team workload.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <WidgetCard 
          title="My Active Projects" 
          value="6" 
          icon={Briefcase} 
        />
        <WidgetCard 
          title="Overdue Tasks" 
          value="4" 
          icon={AlertOctagon} 
          subtitle="Needs attention"
        />
        <WidgetCard 
          title="Tasks Due This Week" 
          value="18" 
          icon={CheckSquare} 
        />
        <WidgetCard 
          title="Team Workload" 
          value="85%" 
          icon={Users} 
          subtitle="Average capacity"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 min-h-[320px] flex flex-col items-center justify-center border-t border-t-white/5">
          <p className="text-zinc-500">Client Content Status Chart</p>
        </div>
        <div className="glass-panel p-6 min-h-[320px] flex flex-col border-t border-t-white/5">
           <h3 className="text-sm font-medium text-zinc-400 mb-4">Pending Approvals</h3>
           <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm">
             List Widget Placeholder
           </div>
        </div>
      </div>
    </div>
  );
};
