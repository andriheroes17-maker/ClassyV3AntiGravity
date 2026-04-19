import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { KanbanTask } from '../../../store/projectStore';
import { Clock, MessageSquare, Paperclip } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface TaskCardProps {
  task: KanbanTask;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-brand-500/20 text-brand-400 border-brand-500/30';
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="glass-panel border-2 border-brand-500/50 opacity-40 rounded-xl h-[120px] w-full shadow-2xl"
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
        "glass-panel p-4 rounded-xl border border-border cursor-grab active:cursor-grabbing hover:border-brand-500/30 transition-[border-color] group shadow-sm bg-surface/80",
        "flex flex-col gap-3"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider", getPriorityColor(task.priority))}>
          {task.priority}
        </span>
        <span className="text-[10px] text-zinc-500 font-medium">#{task.id}</span>
      </div>
      
      <h4 className="text-sm font-semibold text-zinc-200 leading-snug group-hover:text-brand-400 transition-colors">
        {task.title}
      </h4>

      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-zinc-600" />
          <span>{task.deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-1 hover:text-zinc-300 transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">2</span>
          </div>
          <div className="flex items-center gap-1 hover:text-zinc-300 transition-colors">
            <Paperclip className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
