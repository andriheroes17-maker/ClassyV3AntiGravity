import React, { useState } from 'react';
import { useHrStore } from '../../../store/hrStore';
import { Trophy, Target, Award, Download, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

export const PerformanceReviews: React.FC = () => {
  const reviews = useHrStore(s => s.performanceReviews);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = reviews.filter(rev => rev.userName.toLowerCase().includes(searchTerm.toLowerCase()));

  const getScoreColorClass = (score: number) => {
     if (score >= 4.5) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
     if (score >= 3.5) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
     if (score >= 2.5) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
     return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Performance & OKR</h1>
          <p className="text-zinc-400 mt-1">Review employee performance matrix and key results.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="text"
            className="w-full sm:w-64 bg-surface border border-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button variant="ghost" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {filtered.map(rev => (
           <div key={rev.id} className="glass-panel p-6 rounded-2xl border border-white/5 bg-zinc-950/40 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:text-brand-500 transition-colors">
                 <Trophy className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-xl font-bold text-white mb-1">{rev.userName}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                       <Calendar className="w-3.5 h-3.5" />
                       {rev.period}
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">Final Score</span>
                    <span className={cn("text-2xl font-black px-3 py-1 rounded inline-flex border shadow-sm", getScoreColorClass(rev.finalScore))}>
                       {rev.finalScore.toFixed(2)}
                    </span>
                 </div>
              </div>

              <div className="relative z-10 space-y-5 mb-6">
                 <div>
                   <div className="flex justify-between items-center text-sm mb-2">
                      <span className="flex items-center gap-2 text-zinc-400 font-medium"><Target className="w-4 h-4 text-emerald-400"/> OKR Achievement</span>
                      <span className="font-bold text-white">{rev.okrScore.toFixed(1)} / 5.0</span>
                   </div>
                   <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
                      <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${(rev.okrScore / 5) * 100}%` }} />
                   </div>
                 </div>

                 <div>
                   <div className="flex justify-between items-center text-sm mb-2">
                      <span className="flex items-center gap-2 text-zinc-400 font-medium"><Award className="w-4 h-4 text-blue-400"/> Core Competencies</span>
                      <span className="font-bold text-white">{rev.competencyScore.toFixed(1)} / 5.0</span>
                   </div>
                   <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
                      <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${(rev.competencyScore / 5) * 100}%` }} />
                   </div>
                 </div>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/5">
                 <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase">Manager Notes</p>
                 <p className="text-sm text-zinc-300 italic">"{rev.notes}"</p>
              </div>
           </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 glass-panel">
             No performance reviews found.
          </div>
        )}
      </div>
    </div>
  );
};
