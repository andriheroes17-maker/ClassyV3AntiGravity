import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../../store/projectStore';
import { Search, Plus, Filter, Briefcase, Calendar, MoreVertical } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { cn } from '../../../lib/utils';
import { useClientStore } from '../../../store/clientStore';

export const ProjectList: React.FC = () => {
  const projects = useProjectStore(s => s.projects);
  const clients = useClientStore(s => s.clients);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown Client';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-zinc-400 mt-1">Manage active projects and monitor progress.</p>
        </div>
        <Button className="flex items-center gap-2">
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
    </div>
  );
};
