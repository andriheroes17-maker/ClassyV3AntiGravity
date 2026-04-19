import React, { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Prospect, LeadStage } from '../../../store/crmStore';
import { LeadCard } from './LeadCard';
import { cn } from '../../../lib/utils';

interface PipelineColumnProps {
  stage: LeadStage;
  title: string;
  leads: Prospect[];
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({ stage, title, leads }) => {
  const leadIds = useMemo(() => leads.map((l) => l.id), [leads]);

  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { type: 'Column', stage },
  });

  const columnValue = leads.reduce((sum, lead) => sum + lead.dealValue, 0);
  const formatCurrencyCompact = (amt: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'IDR' }).format(amt);
  };

  return (
    <div className="flex flex-col flex-shrink-0 w-[280px] h-full max-h-full mr-6 select-none bg-surface-hover/20 rounded-2xl border border-white/5">
      <div className="flex flex-col px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold tracking-wide text-zinc-200 uppercase truncate">{title}</h3>
          <span className="bg-surface text-zinc-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-border">
            {leads.length}
          </span>
        </div>
        <div className="text-xs font-medium text-emerald-400/80">
           Est. {formatCurrencyCompact(columnValue)}
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 min-h-[150px] transition-colors rounded-b-2xl",
          isOver ? "bg-brand-500/10" : "bg-transparent"
        )}
      >
        <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
        
        {leads.length === 0 && !isOver && (
          <div className="h-24 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-xs text-zinc-500">
            No leads here
          </div>
        )}
      </div>
    </div>
  );
};
