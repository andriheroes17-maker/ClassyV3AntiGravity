import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../../store/projectStore';
import { ArrowLeft, Clock, Layout, List, Calendar, Settings, Plus } from 'lucide-react';
import { KanbanBoard } from '../components/KanbanBoard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, isLoading, fetchProjects, fetchTasks, addTask } = useProjectStore();
  const project = projects.find(p => p.id === id);
  
  const [activeTab, setActiveTab] = useState<'board' | 'list' | 'timeline' | 'files'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' });

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, [projects.length, fetchProjects]);

  useEffect(() => {
    if (id) fetchTasks(id);
  }, [id, fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    await addTask({ projectId: id, title: newTask.title, priority: newTask.priority });
    setIsModalOpen(false);
    setNewTask({ title: '', priority: 'medium' });
  };

  if (!project) return <div className="p-8 text-center text-zinc-400">Project not found.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-2rem)] -m-4 md:-m-8 p-4 md:p-8 bg-background">
      <div className="shrink-0 mb-6 space-y-4">
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-brand-400 transition-colors px-2 py-1.5 -ml-2 rounded hover:bg-brand-500/10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-400 border border-brand-500/20 mt-1">
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-zinc-500 mt-1 text-sm flex items-center gap-2 font-medium">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              Due on {project.endDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm font-medium text-zinc-400 mr-2 shrink-0">Progress: {project.progressPct}%</span>
            <Button variant="ghost" size="sm" className="hidden sm:flex">Share</Button>
            <Button size="sm" className="w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Create Task
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 border-b border-white/5 pb-2">
          <button onClick={() => setActiveTab('board')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'board' ? 'bg-surface-hover text-white' : 'text-zinc-400 hover:text-zinc-200'}`}><Layout className="w-4 h-4" /> Board</button>
          <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'list' ? 'bg-surface-hover text-white' : 'text-zinc-400 hover:text-zinc-200'}`}><List className="w-4 h-4" /> List</button>
          <button onClick={() => setActiveTab('timeline')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'timeline' ? 'bg-surface-hover text-white' : 'text-zinc-400 hover:text-zinc-200'}`}><Calendar className="w-4 h-4" /> Timeline</button>
          <div className="ml-auto">
            <button className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"><Settings className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {activeTab === 'board' && (
        <React.Suspense fallback={<div className="flex-1 animate-pulse bg-surface/50 rounded-2xl border border-white/5" />}>
          <KanbanBoard projectId={project.id} />
        </React.Suspense>
      )}

      {activeTab !== 'board' && (
        <div className="flex-1 glass-panel flex flex-col items-center justify-center border-t border-white/5 opacity-80 rounded-2xl">
           <h3 className="text-lg font-bold text-zinc-300">Under Construction</h3>
           <p className="text-zinc-500 mt-2 text-sm italic">The {activeTab} view will be implemented along with Phase 4 timeline.</p>
        </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Create Task</h2>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <Input 
                label="Task Title" 
                required 
                value={newTask.title} 
                onChange={e => setNewTask({...newTask, title: e.target.value})} 
                placeholder="e.g. Design Instagram Carousel"
              />
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Priority</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-zinc-100 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30"
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-white/5">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Create Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
