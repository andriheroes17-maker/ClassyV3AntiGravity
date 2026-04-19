import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientStore } from '../../../store/clientStore';
import { Building2, ArrowLeft, Mail, Phone, Calendar, Briefcase, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const client = useClientStore(s => s.clients.find(c => c.id === id));
  
  const [activeTab, setActiveTab] = useState<'info' | 'projects'>('info');

  if (!client) {
    return <div className="p-8 text-center text-zinc-400">Client not found.</div>;
  }

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/clients')}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-brand-400 hover:bg-brand-500/10 px-3 py-1.5 rounded-lg transition-colors -ml-3"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </button>

      <div className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600/30 to-brand-500/10 border border-brand-500/30 flex items-center justify-center shadow-lg shrink-0">
            <Building2 className="w-8 h-8 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{client.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{client.industry}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600 hidden sm:block"></span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                client.status === 'active' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
              }`}>
                {client.status === 'active' ? 'Active Client' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
          <Button variant="ghost" className="w-full sm:w-auto">Edit Profile</Button>
          <Button className="w-full sm:w-auto">New Project</Button>
        </div>
      </div>

      <div className="flex border-b border-border">
        {['info', 'projects'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-brand-500 text-brand-400' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 border-t border-t-white/5 space-y-6">
            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-zinc-400" />
              Company Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Company Name</p>
                <p className="text-zinc-200">{client.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Industry Sector</p>
                <p className="text-zinc-200">{client.industry}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Contract End Date</p>
                <p className="text-zinc-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  {client.contractEnd.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 border-t border-t-white/5 space-y-6">
            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-zinc-400" />
              Primary Contact (PIC)
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Full Name</p>
                <p className="text-zinc-200">{client.picName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Email Address</p>
                <p className="text-zinc-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <a href={`mailto:${client.picEmail}`} className="hover:text-brand-400 transition-colors">
                    {client.picEmail}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Phone Number</p>
                <p className="text-zinc-200 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-zinc-500" />
                  {client.picPhone}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="glass-panel p-12 flex flex-col items-center justify-center border-t border-t-white/5 text-center min-h-[300px]">
          <Briefcase className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-zinc-200">Projects linked to {client.name}</h3>
          <p className="text-zinc-500 mt-2 max-w-md">The project grid will be listed here, pulling from the project module.</p>
        </div>
      )}
    </div>
  );
};
