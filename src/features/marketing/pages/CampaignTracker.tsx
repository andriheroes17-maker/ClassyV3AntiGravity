import React from 'react';
import { useCrmStore } from '../../../store/crmStore';
import { Rocket, Target, Users, TrendingUp } from 'lucide-react';
import { WidgetCard } from '../../../components/ui/WidgetCard';
import { cn } from '../../../lib/utils';

export const CampaignTracker: React.FC = () => {
  const campaigns = useCrmStore(s => s.campaigns);
  
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amt);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Campaign Tracker</h1>
          <p className="text-zinc-400 mt-1">Monitor marketing ROI, ad spend, and lead generation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WidgetCard title="Total Ad Spend" value="Rp 20.5M" trend={{ value: 12.5, isPositive: true }} icon={TrendingUp} />
        <WidgetCard title="Total Leads Gen" value="165" trend={{ value: 15.2, isPositive: true }} icon={Users} />
        <WidgetCard title="Avg. Cost Per Lead" value="Rp 124K" trend={{ value: 5.4, isPositive: false }} icon={Target} />
        <WidgetCard title="Deals Won from Ads" value="17" trend={{ value: 8.1, isPositive: true }} icon={Rocket} />
      </div>

      <div className="glass-panel overflow-hidden border-t border-t-white/5 mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-hover/50 text-zinc-400 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Campaign Name</th>
                <th className="px-6 py-4 font-medium">Platform</th>
                <th className="px-6 py-4 font-medium">Spend / Budget</th>
                <th className="px-6 py-4 font-medium">Leads Generated</th>
                <th className="px-6 py-4 font-medium">CPL (Cost/Lead)</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map((camp) => {
                const cpl = camp.leadsGenerated > 0 ? camp.spend / camp.leadsGenerated : 0;
                const spendPct = Math.min((camp.spend / camp.budget) * 100, 100);
                
                return (
                  <tr key={camp.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-100">{camp.name}</td>
                    <td className="px-6 py-4 text-zinc-300">{camp.platform}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 w-40">
                         <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-100 font-medium">{formatCurrency(camp.spend)}</span>
                            <span className="text-zinc-500">{formatCurrency(camp.budget)}</span>
                         </div>
                         <div className="w-full bg-surface rounded-full h-1 overflow-hidden">
                           <div className={cn("h-1 bg-brand-500 rounded-full", spendPct > 90 ? "bg-red-500" : "")} style={{ width: `${spendPct}%` }} />
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-200">
                      {camp.leadsGenerated} <span className="text-zinc-500 text-xs ml-1">leads</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-400">
                      {formatCurrency(cpl)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
