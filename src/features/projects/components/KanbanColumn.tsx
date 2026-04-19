import React, { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { KanbanTask, TaskStatus } from '../../../store/projectStore';
import { TaskCard } from './TaskCard';
import { cn } from '../../../lib/utils';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: KanbanTask[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, title, tasks }) => {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  });

  return (
    <div className="flex flex-col flex-shrink-0 w-[280px] h-full max-h-full mr-6 select-none bg-surface-hover/20 rounded-2xl border border-white/5">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold tracking-wide text-zinc-300 uppercase">{title}</h3>
          <span className="bg-surface text-zinc-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-border">
            {tasks.length}
          </span>
        </div>
        <button className="p-1 hover:bg-surface-hover rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 min-h-[150px] transition-colors rounded-b-2xl",
          isOver ? "bg-brand-500/10" : "bg-transparent"
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && !isOver && (
          <div className="h-24 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-xs text-zinc-500">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};
