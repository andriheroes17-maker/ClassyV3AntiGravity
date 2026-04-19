import { create } from 'zustand';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'revision' | 'done' | 'published';

export interface KanbanTask {
  id: string;
  projectId: string;
  title: string;
  contentType: string;
  platform: string;
  assigneeId?: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TaskStatus;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  type: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  startDate: Date;
  endDate: Date;
  pmId: string;
  progressPct: number;
}

interface ProjectState {
  projects: Project[];
  tasks: KanbanTask[];
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  updateTaskOrder: (reorderedTasks: KanbanTask[]) => void;
}

const mockProjects: Project[] = [
  { id: 'p1', clientId: '1', name: 'Q3 Software Launch Tracker', type: 'Product Launch', status: 'active', startDate: new Date('2026-06-01'), endDate: new Date('2026-09-30'), pmId: 'user-123', progressPct: 45 },
  { id: 'p2', clientId: '2', name: 'Lumina Summer Campaign', type: 'Social Media', status: 'active', startDate: new Date('2026-05-15'), endDate: new Date('2026-08-30'), pmId: 'user-123', progressPct: 15 },
];

const mockTasks: KanbanTask[] = [
  { id: 't1', projectId: 'p1', title: 'Draft Press Release', contentType: 'Copywriting', platform: 'PR', deadline: new Date('2026-07-10'), priority: 'high', status: 'done' },
  { id: 't2', projectId: 'p1', title: 'Design Twitter Assets', contentType: 'Graphics', platform: 'Twitter', deadline: new Date('2026-07-15'), priority: 'medium', status: 'in_progress' },
  { id: 't3', projectId: 'p1', title: 'Record Promo Video', contentType: 'Video', platform: 'YouTube', deadline: new Date('2026-07-20'), priority: 'high', status: 'todo' },
  { id: 't4', projectId: 'p2', title: 'Instagram Carousel - Summer Vibes', contentType: 'Graphics', platform: 'Instagram', deadline: new Date('2026-06-25'), priority: 'urgent', status: 'in_review' },
  { id: 't5', projectId: 'p2', title: 'TikTok Trending Audio Idea', contentType: 'Video', platform: 'TikTok', deadline: new Date('2026-06-28'), priority: 'medium', status: 'revision' },
];

export const useProjectStore = create<ProjectState>((set) => ({
  projects: mockProjects,
  tasks: mockTasks,
  updateTaskStatus: (taskId, newStatus) => set((state) => {
    const updatedTasks = state.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    return { tasks: updatedTasks };
  }),
  updateTaskOrder: (reorderedTasks) => set({
    tasks: reorderedTasks
  })
}));
