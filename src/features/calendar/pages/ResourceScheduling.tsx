import React, { useState } from 'react';
import { Camera, Monitor, Truck, Wifi, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

type ResourceStatus = 'available' | 'booked' | 'maintenance';

interface Resource {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  status: ResourceStatus;
  bookedBy?: string;
  bookedUntil?: string;
  notes?: string;
}

const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', name: 'Sony A7IV + Lens Kit', category: 'Camera', icon: Camera, status: 'booked', bookedBy: 'John Developer', bookedUntil: '2026-08-20 18:00' },
  { id: 'r2', name: 'DJI Mavic 3 Pro', category: 'Drone', icon: Wifi, status: 'available' },
  { id: 'r3', name: 'Studio A — Green Screen', category: 'Studio', icon: Monitor, status: 'booked', bookedBy: 'Sarah Designer', bookedUntil: '2026-08-19 21:00' },
  { id: 'r4', name: 'Studio B — Podcast Room', category: 'Studio', icon: Monitor, status: 'available' },
  { id: 'r5', name: 'Canon EOS R5', category: 'Camera', icon: Camera, status: 'maintenance', notes: 'Sensor cleaning — ETA 3 days' },
  { id: 'r6', name: 'Toyota HiAce (Production Van)', category: 'Vehicle', icon: Truck, status: 'available' },
  { id: 'r7', name: 'Lighting Kit — Aputure 600D', category: 'Lighting', icon: Monitor, status: 'booked', bookedBy: 'Mike Marketing', bookedUntil: '2026-08-22 12:00' },
  { id: 'r8', name: 'Teleprompter iPad Pro', category: 'Accessory', icon: Monitor, status: 'available' },
];

const getStatusConfig = (status: ResourceStatus) => {
  switch (status) {
    case 'available':
      return { label: 'Available', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    case 'booked':
      return { label: 'Booked', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
    case 'maintenance':
      return { label: 'Maintenance', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
  }
};

export const ResourceScheduling: React.FC = () => {
  const [filter, setFilter] = useState<'all' | ResourceStatus>('all');

  const filtered = filter === 'all' ? MOCK_RESOURCES : MOCK_RESOURCES.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Resource Scheduling</h1>
          <p className="text-zinc-400 mt-1">Book cameras, studios, vehicles, and equipment for production.</p>
        </div>
        <Button className="flex items-center gap-2">+ Book Resource</Button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'available', 'booked', 'maintenance'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all",
              filter === f
                ? "bg-brand-500 text-black border-brand-500 shadow-[0_0_12px_rgba(202,240,40,0.3)]"
                : "bg-surface text-zinc-400 border-border hover:border-zinc-500 hover:text-white"
            )}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
        {filtered.map(resource => {
          const statusConf = getStatusConfig(resource.status);
          const StatusIcon = statusConf.icon;
          return (
            <div
              key={resource.id}
              className="glass-panel rounded-2xl border border-white/5 p-5 flex flex-col gap-4 group hover:border-brand-500/30 transition-colors relative overflow-hidden"
            >
              {/* Decorative bg icon */}
              <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                <resource.icon className="w-32 h-32" />
              </div>

              <div className="relative z-10 flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-surface-hover border border-white/5 flex items-center justify-center shrink-0">
                  <resource.icon className="w-6 h-6 text-brand-400" />
                </div>
                <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusConf.bg, statusConf.color, statusConf.border)}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConf.label}
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="text-sm font-bold text-zinc-100 group-hover:text-brand-400 transition-colors">{resource.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{resource.category}</p>
              </div>

              {resource.bookedBy && (
                <div className="relative z-10 text-xs text-zinc-400 bg-zinc-900/50 rounded-lg p-3 border border-white/5 space-y-1">
                  <div>Booked by: <span className="text-zinc-200 font-medium">{resource.bookedBy}</span></div>
                  <div>Until: <span className="text-zinc-200">{resource.bookedUntil}</span></div>
                </div>
              )}

              {resource.notes && (
                <div className="relative z-10 text-xs text-red-400/80 bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                  ⚠ {resource.notes}
                </div>
              )}

              <div className="relative z-10 mt-auto pt-3 border-t border-white/5 flex gap-2">
                {resource.status === 'available' ? (
                  <Button className="w-full text-xs h-8">Book Now</Button>
                ) : (
                  <Button variant="ghost" className="w-full text-xs h-8">View Details</Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
