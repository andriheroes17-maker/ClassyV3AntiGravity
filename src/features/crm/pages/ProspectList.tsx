import React, { useState } from 'react';
import { useCrmStore } from '../../../store/crmStore';
import { Search, Plus, Filter, MoreVertical, Building2, Flame, Snowflake, ThermometerSun } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const ProspectList: React.FC = () => {
  const prospects = useCrmStore(s => s.prospects);
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <span className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20"><Flame className="w-3 h-3"/> Hot</span>;
    if (score >= 50) return <span className="flex items-center gap-1 text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20"><ThermometerSun className="w-3 h-3"/> Warm</span>;
    return <span className="flex items-center gap-1 text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20"><Snowflake className="w-3 h-3"/> Cold</span>;
  };

  const filteredProspects = prospects.filter(p => p.company.toLowerCase().includes(searchTerm.toLowerCase()) || p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Prospects</h1>
          <p className="text-zinc-400 mt-1">Manage early-stage leads and potential clients.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Prospect
        </Button>
      </div>

      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-t-white/5">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search prospects..." 
            className="pl-10 mb-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" className="w-full sm:w-auto flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <div className="glass-panel overflow-hidden border-t border-t-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-hover/50 text-zinc-400 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Company / Contact</th>
                <th className="px-6 py-4 font-medium">Est. Value</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Stage</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProspects.map((p) => (
                <tr 
                  key={p.id} 
                  className="hover:bg-surface-hover/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center shrink-0 border border-white/5">
                        <Building2 className="w-5 h-5 text-zinc-400 group-hover:text-brand-400 transition-colors" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-100">{p.company}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{p.name} • {p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-zinc-100">{formatCurrency(p.dealValue)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <span className="text-zinc-300 w-6">{p.score}</span> {getScoreBadge(p.score)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-white/10 shadow-sm">
                      {p.stage.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">
                    {p.source}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-zinc-400 hover:text-white rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredProspects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No prospects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
