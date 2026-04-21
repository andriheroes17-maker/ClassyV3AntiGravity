import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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

// Map kanban_column name to our TaskStatus
const columnNameToStatus: Record<string, TaskStatus> = {
  'To Do': 'todo',
  'In Progress': 'in_progress',
  'Review': 'in_review',
  'Revision': 'revision',
  'Done': 'done',
  'Published': 'published',
};

const statusToColumnName: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'Review',
  revision: 'Revision',
  done: 'Done',
  published: 'Published',
};

interface ProjectState {
  projects: Project[];
  tasks: KanbanTask[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchTasks: (projectId: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'progressPct'>) => Promise<void>;
  addTask: (task: { projectId: string; title: string; priority: string; contentType?: string; platform?: string }) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  updateTaskOrder: (reorderedTasks: KanbanTask[]) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  tasks: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }

      const mapped: Project[] = data.map((p: any) => ({
        id: p.id.toString(),
        clientId: p.client_id ? p.client_id.toString() : '',
        name: p.name,
        type: p.project_type || '-',
        status: (p.status || 'active') as Project['status'],
        startDate: p.start_date ? new Date(p.start_date) : new Date(),
        endDate: p.end_date ? new Date(p.end_date) : new Date(),
        pmId: p.pm_id ? p.pm_id.toString() : '',
        progressPct: Number(p.progress_percent || 0),
      }));

      set({ projects: mapped, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchTasks: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, kanban_columns(name), content_types(name), platforms(name)')
        .eq('project_id', parseInt(projectId))
        .order('created_at', { ascending: true });

      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }

      const mapped: KanbanTask[] = data.map((t: any) => {
        const colName = t.kanban_columns?.name || 'To Do';
        return {
          id: t.id.toString(),
          projectId: t.project_id.toString(),
          title: t.title,
          contentType: t.content_types?.name || '-',
          platform: t.platforms?.name || '-',
          assigneeId: undefined,
          deadline: t.due_date ? new Date(t.due_date) : new Date(),
          priority: (t.priority || 'medium') as KanbanTask['priority'],
          status: columnNameToStatus[colName] || 'todo',
        };
      });

      set({ tasks: mapped, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addProject: async (project) => {
    set({ isLoading: true, error: null });
    try {
      const newRow: any = {
        name: project.name,
        project_type: project.type,
        status: project.status,
        start_date: project.startDate.toISOString().split('T')[0],
        end_date: project.endDate.toISOString().split('T')[0],
        progress_percent: 0,
      };

      // Only set client_id if it's a valid number
      if (project.clientId && !isNaN(parseInt(project.clientId))) {
        newRow.client_id = parseInt(project.clientId);
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([newRow])
        .select()
        .single();

      if (error) {
        console.error('Supabase Error:', error);
        alert('Supabase Error: ' + error.message);
        set({ error: error.message, isLoading: false });
        return;
      }

      // Create default kanban columns for the project
      const defaultColumns = [
        { project_id: data.id, name: 'To Do', order_index: 0 },
        { project_id: data.id, name: 'In Progress', order_index: 1 },
        { project_id: data.id, name: 'Review', order_index: 2 },
        { project_id: data.id, name: 'Revision', order_index: 3 },
        { project_id: data.id, name: 'Done', order_index: 4, is_done_col: true },
        { project_id: data.id, name: 'Published', order_index: 5, is_published_col: true },
      ];

      await supabase.from('kanban_columns').insert(defaultColumns);

      const newProject: Project = {
        id: data.id.toString(),
        clientId: data.client_id ? data.client_id.toString() : '',
        name: data.name,
        type: data.project_type || '-',
        status: data.status as Project['status'],
        startDate: data.start_date ? new Date(data.start_date) : new Date(),
        endDate: data.end_date ? new Date(data.end_date) : new Date(),
        pmId: data.pm_id ? data.pm_id.toString() : '',
        progressPct: Number(data.progress_percent || 0),
      };

      set(state => ({
        projects: [newProject, ...state.projects],
        isLoading: false,
      }));
    } catch (err: any) {
      console.error('Unhandled Error:', err);
      alert('Application Error: ' + err.message);
      set({ error: err.message, isLoading: false });
    }
  },

  addTask: async ({ projectId, title, priority, contentType, platform }) => {
    set({ isLoading: true, error: null });
    try {
      // Get the "To Do" kanban column for this project
      const { data: colData } = await supabase
        .from('kanban_columns')
        .select('id')
        .eq('project_id', parseInt(projectId))
        .eq('name', 'To Do')
        .single();

      const newRow: any = {
        project_id: parseInt(projectId),
        title,
        priority,
        kanban_column_id: colData?.id || null,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // default 1 week
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newRow])
        .select('*, kanban_columns(name)')
        .single();

      if (error) {
        console.error('Supabase Error:', error);
        alert('Supabase Error: ' + error.message);
        set({ error: error.message, isLoading: false });
        return;
      }

      const newTask: KanbanTask = {
        id: data.id.toString(),
        projectId: data.project_id.toString(),
        title: data.title,
        contentType: contentType || '-',
        platform: platform || '-',
        deadline: data.due_date ? new Date(data.due_date) : new Date(),
        priority: data.priority as KanbanTask['priority'],
        status: 'todo',
      };

      set(state => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (err: any) {
      console.error('Unhandled Error:', err);
      alert('Application Error: ' + err.message);
      set({ error: err.message, isLoading: false });
    }
  },

  updateTaskStatus: async (taskId, newStatus) => {
    const originalTasks = get().tasks;

    // Optimistic UI update
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t),
    }));

    try {
      const task = originalTasks.find(t => t.id === taskId);
      if (!task) return;

      // Find the kanban_column for this status in this project
      const colName = statusToColumnName[newStatus];
      const { data: colData, error: colError } = await supabase
        .from('kanban_columns')
        .select('id')
        .eq('project_id', parseInt(task.projectId))
        .eq('name', colName)
        .single();

      if (colError || !colData) {
        console.error('Column lookup error:', colError);
        set({ tasks: originalTasks });
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .update({ kanban_column_id: colData.id })
        .eq('id', parseInt(taskId));

      if (error) {
        console.error('Task update error:', error);
        set({ tasks: originalTasks });
      }
    } catch (err) {
      console.error('Unhandled error updating task:', err);
      set({ tasks: originalTasks });
    }
  },

  updateTaskOrder: (reorderedTasks) => set({
    tasks: reorderedTasks,
  }),
}));
