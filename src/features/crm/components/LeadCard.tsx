import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Prospect } from '../../../store/crmStore';
import { Building2, Phone, Mail } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const LeadCard: React.FC<{ lead: Prospect }> = ({ lead }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: { type: 'Lead', lead },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amt);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="glass-panel border-2 border-brand-500/50 opacity-40 rounded-xl h-[130px] w-[254px] shadow-2xl"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "glass-panel p-4 rounded-xl border border-border cursor-grab active:cursor-grabbing hover:border-brand-500/30 transition-[border-color] group shadow-sm bg-surface/80 w-full",
        "flex flex-col gap-3"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-brand-400 transition-colors truncate">
          {lead.company}
        </h4>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0",
          lead.score >= 80 ? "text-red-400 bg-red-400/10 border-red-400/20" :
          lead.score >= 50 ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
          "text-blue-400 bg-blue-400/10 border-blue-400/20"
        )}>
          {lead.score}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Building2 className="w-3.5 h-3.5" />
        <span className="truncate">{lead.name}</span>
      </div>

      <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="font-semibold text-emerald-400">{formatCurrency(lead.dealValue)}</span>
        <div className="flex items-center gap-2 text-zinc-500">
           <Phone className="w-3.5 h-3.5 hover:text-zinc-300 transition-colors" />
           <Mail className="w-3.5 h-3.5 hover:text-zinc-300 transition-colors" />
        </div>
      </div>
    </div>
  );
};
