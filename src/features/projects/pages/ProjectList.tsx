import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../../store/projectStore';
import { Search, Plus, Filter, Briefcase, Calendar, MoreVertical } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { cn } from '../../../lib/utils';
import { useClientStore } from '../../../store/clientStore';

export const ProjectList: React.FC = () => {
  const { projects, isLoading, fetchProjects, addProject } = useProjectStore();
  const { clients, fetchClients } = useClientStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    type: '',
    clientId: '',
    status: 'active' as const,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    pmId: '',
  });

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, [fetchProjects, fetchClients]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProject(newProject);
    setIsModalOpen(false);
    setNewProject({
      name: '', type: '', clientId: '', status: 'active', 
      startDate: new Date(), endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), pmId: ''
    });
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'No Client';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-zinc-400 mt-1">Manage active projects and monitor progress.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Project
        </Button>
      </div>

      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-t-white/5">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search projects..." 
            className="pl-10 mb-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="ghost" className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Active
          </Button>
        </div>
      </div>

      {filteredProjects.length === 0 && !isLoading && (
        <div className="glass-panel p-12 text-center border-t border-t-white/5">
          <Briefcase className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-300">No projects yet</h3>
          <p className="text-zinc-500 mt-2 text-sm">Click "Create Project" to start your first project.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div 
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="glass-panel p-6 border-t border-t-brand-500/30 hover:border-brand-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.05)] transition-all cursor-pointer group flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
              </div>
              <button 
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-zinc-500 hover:text-white rounded-md transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-brand-400 transition-colors leading-tight truncate">
              {project.name}
            </h3>
            <p className="text-sm text-zinc-400 mt-1.5">{getClientName(project.clientId)}</p>

            <div className="flex items-center gap-4 mt-6 text-xs text-zinc-500 mb-6">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{project.type}</span>
              </div>
              <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                <Calendar className="w-4 h-4" />
                <span>{project.endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Progress</span>
                 <span className="text-xs font-bold text-zinc-200">{project.progressPct}%</span>
              </div>
              <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
                <div 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-1000",
                    project.progressPct < 30 ? "bg-red-500" : project.progressPct < 70 ? "bg-brand-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${project.progressPct}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
            </div>
            <form onSubmit={handleAddProject} className="p-6 space-y-4">
              <Input 
                label="Project Name" 
                required 
                value={newProject.name} 
                onChange={e => setNewProject({...newProject, name: e.target.value})} 
              />
              <Input 
                label="Project Type" 
                value={newProject.type} 
                onChange={e => setNewProject({...newProject, type: e.target.value})}
                placeholder="e.g. Social Media, Product Launch" 
              />
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Client</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-zinc-100 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30"
                  value={newProject.clientId}
                  onChange={e => setNewProject({...newProject, clientId: e.target.value})}
                >
                  <option value="">No Client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Start Date</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-zinc-100 text-sm focus:outline-none focus:border-brand-500/50"
                    value={newProject.startDate.toISOString().split('T')[0]}
                    onChange={e => setNewProject({...newProject, startDate: new Date(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">End Date</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-zinc-100 text-sm focus:outline-none focus:border-brand-500/50"
                    value={newProject.endDate.toISOString().split('T')[0]}
                    onChange={e => setNewProject({...newProject, endDate: new Date(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-white/5">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Create Project</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
