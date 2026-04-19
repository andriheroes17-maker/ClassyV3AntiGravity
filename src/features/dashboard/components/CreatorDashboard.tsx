import React from 'react';
import { WidgetCard } from '../../../components/ui/WidgetCard';
import { CheckSquare, ListTodo, Edit3, Clock } from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Creator Dashboard</h1>
          <p className="text-zinc-400 mt-1">My tasks and reviews.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <WidgetCard 
          title="My Tasks Today" 
          value="3" 
          icon={ListTodo} 
        />
        <WidgetCard 
          title="My Tasks This Week" 
          value="12" 
          icon={CheckSquare} 
        />
        <WidgetCard 
          title="Revision Needed" 
          value="2" 
          icon={Edit3} 
          subtitle="Urgent priority"
        />
        <WidgetCard 
          title="Time Logged Today" 
          value="4h 15m" 
          icon={Clock} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 min-h-[320px] flex flex-col border-t border-t-white/5">
           <h3 className="text-sm font-medium text-zinc-400 mb-4">In Review (Awaiting Approval)</h3>
           <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm">
             List Widget Placeholder
           </div>
        </div>
        <div className="glass-panel p-6 min-h-[320px] flex flex-col border-t border-t-white/5">
           <h3 className="text-sm font-medium text-zinc-400 mb-4">Upcoming Schedule</h3>
           <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm">
             Calendar Agenda List Placeholder
           </div>
        </div>
      </div>
    </div>
  );
};
