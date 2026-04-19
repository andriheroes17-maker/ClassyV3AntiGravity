import React, { useState } from 'react';
import { Search, Shield, Eye, Edit, Trash2, LogIn, Download, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { cn } from '../../../lib/utils';

type ActionType = 'LOGIN' | 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'APPROVE';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: ActionType;
  module: string;
  detail: string;
  ip: string;
}

const MOCK_LOGS: AuditEntry[] = [
  { id: 'a1', timestamp: '2026-08-19 19:45:12', user: 'Admin Director', role: 'director', action: 'APPROVE', module: 'Finance', detail: 'Approved Invoice INV/2026/08/003 — Rp 45,000,000', ip: '103.28.12.45' },
  { id: 'a2', timestamp: '2026-08-19 19:30:05', user: 'Sarah Designer', role: 'creator', action: 'UPDATE', module: 'Project', detail: 'Moved task "Hero Banner V3" to In Review', ip: '182.1.44.200' },
  { id: 'a3', timestamp: '2026-08-19 18:15:33', user: 'Mike Marketing', role: 'cmo', action: 'CREATE', module: 'CRM', detail: 'Added new prospect: PT Harmoni Digital', ip: '36.80.211.10' },
  { id: 'a4', timestamp: '2026-08-19 17:02:18', user: 'Admin Director', role: 'director', action: 'DELETE', module: 'HR', detail: 'Deleted leave request LV-089 (duplicate)', ip: '103.28.12.45' },
  { id: 'a5', timestamp: '2026-08-19 16:45:00', user: 'Finance Staff', role: 'cfo', action: 'EXPORT', module: 'Finance', detail: 'Exported P&L Report Q2 2026 as PDF', ip: '114.10.33.90' },
  { id: 'a6', timestamp: '2026-08-19 14:20:44', user: 'John Developer', role: 'creator', action: 'VIEW', module: 'Library', detail: 'Viewed SOP_Client_Onboarding.pdf', ip: '182.1.44.201' },
  { id: 'a7', timestamp: '2026-08-19 09:01:12', user: 'Admin Director', role: 'director', action: 'LOGIN', module: 'Auth', detail: 'Successful login via email/password', ip: '103.28.12.45' },
  { id: 'a8', timestamp: '2026-08-19 08:55:30', user: 'Unknown', role: '-', action: 'LOGIN', module: 'Auth', detail: '⚠ Failed login attempt — wrong password (3rd attempt)', ip: '45.77.121.88' },
];

const getActionBadge = (action: ActionType) => {
  const configs: Record<ActionType, { bg: string; text: string; icon: React.ElementType }> = {
    LOGIN: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', icon: LogIn },
    VIEW: { bg: 'bg-zinc-500/10 border-zinc-500/20', text: 'text-zinc-400', icon: Eye },
    CREATE: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', icon: Edit },
    UPDATE: { bg: 'bg-orange-500/10 border-orange-500/20', text: 'text-orange-400', icon: Edit },
    DELETE: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', icon: Trash2 },
    EXPORT: { bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-400', icon: Download },
    APPROVE: { bg: 'bg-brand-500/10 border-brand-500/20', text: 'text-brand-400', icon: Shield },
  };
  const c = configs[action];
  const Icon = c.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", c.bg, c.text)}>
      <Icon className="w-3 h-3" /> {action}
    </span>
  );
};

export const AuditLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = MOCK_LOGS.filter(log =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-400" />
            Audit Log
          </h1>
          <p className="text-zinc-400 mt-1">Enterprise security trail — all system actions are recorded.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4" /> Filters
          </Button>
          <Button variant="glass" className="flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-t border-t-red-500/20">
        <div className="p-4 border-b border-white/5">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search user, module, or action..."
              className="pl-10 mb-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-hover/50 text-zinc-400 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Module</th>
                <th className="px-6 py-4 font-medium">Detail</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(log => (
                <tr key={log.id} className={cn("hover:bg-surface-hover/30 transition-colors", log.detail.includes('⚠') && "bg-red-950/20")}>
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-100 font-medium">{log.user}</span>
                      <span className="text-zinc-500 text-[10px] uppercase">{log.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                  <td className="px-6 py-4 text-zinc-300">{log.module}</td>
                  <td className="px-6 py-4 text-zinc-400 max-w-[300px] truncate" title={log.detail}>{log.detail}</td>
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
