import React, { useState } from 'react';
import { useHrStore, type AttendanceStatus } from '../../../store/hrStore';
import { Search, MapPin, Fingerprint, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const AttendanceList: React.FC = () => {
  const attendances = useHrStore(s => s.attendances);
  const checkIn = useHrStore(s => s.checkIn);
  const [searchTerm, setSearchTerm] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const getStatusBadge = (status: AttendanceStatus) => {
     switch(status) {
       case 'present': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Present</span>;
       case 'late': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">Late</span>;
       case 'wfh': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">WFH</span>;
       case 'leave': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">On Leave</span>;
       default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">Absent</span>;
     }
  };

  const filtered = attendances.filter(a => a.userName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCheckIn = () => {
    checkIn('u-me', 'Administrator User');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Daily Attendance</h1>
          <p className="text-zinc-400 mt-1">Track check-ins, timesheets, and locations for {today}.</p>
        </div>
        <Button onClick={handleCheckIn} className="flex items-center gap-2 px-6 bg-brand-500 hover:bg-brand-400 text-black shadow-[0_0_20px_rgba(202,240,40,0.3)]">
          <Fingerprint className="w-4 h-4" />
          Quick Check-In
        </Button>
      </div>

      <div className="glass-panel overflow-hidden border-t border-t-white/5 mt-8">
        <div className="p-4 border-b border-white/5">
           <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="Search employee..." 
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
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">In / Out</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Location Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((att) => (
                <tr key={att.id} className="hover:bg-surface-hover/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-100">{att.userName}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    <span className="flex items-center gap-2"><CalendarIcon className="w-3.5 h-3.5" /> {att.date}</span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1 text-xs">
                        {att.checkInTime ? <span className="flex items-center gap-1.5 text-zinc-200"><CheckCircle2 className="w-3.5 h-3.5 text-brand-400"/> {att.checkInTime}</span> : <span className="text-zinc-600">-</span>}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(att.status)}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {att.gpsLoc ? (
                        <div className="flex items-center gap-1.5 text-xs text-blue-400/80 bg-blue-500/10 px-2 py-1 rounded inline-flex border border-blue-500/20">
                            <MapPin className="w-3 h-3" /> {att.gpsLoc}
                        </div>
                    ) : <span className="text-zinc-600">-</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-8 text-center text-zinc-500">No attendance data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
