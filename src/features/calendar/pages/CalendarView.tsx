import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// Mock event for current month
const MOCK_EVENTS = [
  { id: 1, day: 5, title: 'Drafting Contract', type: 'task', color: 'bg-emerald-500' },
  { id: 2, day: 12, title: 'Invoice INV/2026/08/001 Due', type: 'finance', color: 'bg-red-500' },
  { id: 3, day: 15, title: 'Q3 Review Meeting', type: 'meeting', color: 'bg-blue-500' },
  { id: 4, day: 15, title: 'Send Weekly Report', type: 'task', color: 'bg-emerald-500' },
  { id: 5, day: 22, title: 'Pitch Deck Creation', type: 'task', color: 'bg-emerald-500' },
  { id: 6, day: 28, title: 'Campaign Kickoff', type: 'marketing', color: 'bg-purple-500' },
];

export const CalendarView: React.FC = () => {
  const [currentMonth] = useState(new Date(2026, 7, 1)); // August 2026 for mock data

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-theme(spacing.20))]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-brand-400" />
            Agency Calendar
          </h1>
          <p className="text-zinc-400 mt-1">Unified view for deadlines, meetings, and finance dates.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center glass-panel rounded-lg p-1 border border-white/10">
             <button className="p-1.5 hover:bg-surface-hover rounded transition-colors text-zinc-400 hover:text-white"><ChevronLeft className="w-5 h-5"/></button>
             <span className="px-4 font-semibold text-zinc-200">
               {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
             </span>
             <button className="p-1.5 hover:bg-surface-hover rounded transition-colors text-zinc-400 hover:text-white"><ChevronRight className="w-5 h-5"/></button>
          </div>
          <Button>Add Event</Button>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-2xl border-t border-t-brand-500/30 overflow-hidden flex flex-col font-sans">
        <div className="grid grid-cols-7 border-b border-border bg-surface-hover/30">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest border-r border-border last:border-0">
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-background/50">
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="border-r border-b border-border/50 bg-background/30 p-2 opacity-50" />
          ))}
          
          {days.map((day) => {
            const dayEvents = MOCK_EVENTS.filter(e => e.day === day);
            const isToday = day === 15; // mock today

            return (
              <div 
                key={`day-${day}`} 
                className={`border-r border-b border-border/50 p-1.5 sm:p-2 flex flex-col transition-colors hover:bg-surface-hover/20 cursor-pointer min-h-[100px] ${isToday ? 'bg-brand-500/5' : ''}`}
              >
                <div className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-semibold mb-1 ${isToday ? 'bg-brand-500 text-black' : 'text-zinc-400'}`}>
                  {day}
                </div>
                <div className="flex flex-col gap-1 overflow-y-auto">
                  {dayEvents.map(evt => (
                    <div 
                      key={evt.id} 
                      className={`px-1.5 py-1 rounded text-[10px] font-bold text-white truncate shadow-sm transition-transform hover:scale-[1.02] ${evt.color}`}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
