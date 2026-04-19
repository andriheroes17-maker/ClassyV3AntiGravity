import React, { useMemo, useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragOverEvent, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { type KanbanTask, type TaskStatus, useProjectStore } from '../../../store/projectStore';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  projectId: string;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'in_review', title: 'Review' },
  { id: 'revision', title: 'Revision' },
  { id: 'done', title: 'Done' },
  { id: 'published', title: 'Published' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const tasks = useProjectStore(s => s.tasks);
  const updateTaskStatus = useProjectStore(s => s.updateTaskStatus);
  const updateTaskOrder = useProjectStore(s => s.updateTaskOrder);
  
  const projectTasks = useMemo(() => tasks.filter(t => t.projectId === projectId), [tasks, projectId]);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getFilteredTasks = (status: TaskStatus) => {
    return projectTasks.filter(t => t.status === status);
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Dropping over another task
    if (isOverTask) {
       const activeIndex = tasks.findIndex(t => t.id === activeId);
       const overIndex = tasks.findIndex(t => t.id === overId);
       
       if (tasks[activeIndex].status !== tasks[overIndex].status) {
         updateTaskStatus(activeId as string, tasks[overIndex].status);
       }
    }

    // Dropping over empty column
    if (isOverColumn) {
       const activeIndex = tasks.findIndex(t => t.id === activeId);
       if (tasks[activeIndex].status !== overId) {
         updateTaskStatus(activeId as string, overId as TaskStatus);
       }
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (isActiveTask && isOverTask) {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const overIndex = tasks.findIndex(t => t.id === overId);

        if (tasks[activeIndex].status === tasks[overIndex].status) {
            updateTaskOrder(arrayMove(tasks, activeIndex, overIndex));
        }
    }
  };

  return (
    <div className="flex-1 flex overflow-x-auto overflow-y-hidden pt-2 h-[calc(100vh-280px)]">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={onDragStart} 
        onDragOver={onDragOver} 
        onDragEnd={onDragEnd}
      >
        <div className="flex h-full items-start pb-4">
          {COLUMNS.map(col => (
            <KanbanColumn 
              key={col.id} 
              status={col.id} 
              title={col.title} 
              tasks={getFilteredTasks(col.id)} 
            />
          ))}
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
