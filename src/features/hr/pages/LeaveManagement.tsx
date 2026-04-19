import React, { useState } from 'react';
import { useHrStore, type LeaveStatus } from '../../../store/hrStore';
import { Search, Plus, Filter, Umbrella, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const LeaveManagement: React.FC = () => {
  const leaves = useHrStore(s => s.leaveRequests);
  const approveLeaveRequest = useHrStore(s => s.approveLeaveRequest);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = leaves.filter(lv => lv.userName.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusBadge = (status: LeaveStatus) => {
     switch(status) {
       case 'approved': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Approved</span>;
       case 'rejected': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">Rejected</span>;
       default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">Pending</span>;
     }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leave Requests</h1>
          <p className="text-zinc-400 mt-1">Review and manage employee time-off applications.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Request Leave
        </Button>
      </div>

      <div className="glass-panel overflow-hidden border-t border-t-white/5 mt-8">
         <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                placeholder="Search employee..." 
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
         <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-hover/50 text-zinc-400 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date Range</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((lv) => (
                <tr key={lv.id} className="hover:bg-surface-hover/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-100 flex items-center gap-3">
                     <div className="w-8 h-8 rounded bg-surface-hover border border-white/5 flex items-center justify-center shrink-0">
                        <Umbrella className="w-4 h-4 text-zinc-400" />
                     </div>
                     {lv.userName}
                  </td>
                  <td className="px-6 py-4 text-zinc-200">{lv.type}</td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">
                     <div className="flex flex-col gap-0.5">
                       <span>From: {lv.startDate}</span>
                       <span>To: {lv.endDate}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 max-w-[200px] truncate">{lv.reason}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lv.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {lv.status === 'pending' ? (
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => approveLeaveRequest(lv.id, 'approved')} className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded transition-colors shadow-sm">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => approveLeaveRequest(lv.id, 'rejected')} className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors shadow-sm">
                            <XCircle className="w-4 h-4" />
                          </button>
                       </div>
                    ) : (
                       <span className="text-zinc-600 text-xs italic">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-8 text-center text-zinc-500">No leave requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
         </div>
      </div>
    </div>
  );
};
