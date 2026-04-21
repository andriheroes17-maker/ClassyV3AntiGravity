import React, { useState, useEffect } from 'react';
import { useClientStore } from '../../../store/clientStore';
import { Search, Plus, Filter, MoreVertical, Building2, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

export const ClientList: React.FC = () => {
  const { clients, isLoading, fetchClients, addClient } = useClientStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '', industry: '', picName: '', picEmail: '', picPhone: '', status: 'active' as const, contractEnd: new Date()
  });

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClient(newClient);
    setIsModalOpen(false);
    setNewClient({ name: '', industry: '', picName: '', picEmail: '', picPhone: '', status: 'active', contractEnd: new Date() });
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Clients</h1>
          <p className="text-zinc-400 mt-1">Manage your agency's clients and relationships.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-t-white/5">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search clients..." 
            className="pl-10 mb-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" className="w-full sm:w-auto flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <div className="glass-panel overflow-hidden border-t border-t-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-hover/50 text-zinc-400 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Client Name</th>
                <th className="px-6 py-4 font-medium">Industry</th>
                <th className="px-6 py-4 font-medium">Contact Person</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClients.map((client) => (
                <tr 
                  key={client.id} 
                  className="hover:bg-surface-hover/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/20 to-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-brand-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-100">{client.name}</p>
                        <p className="text-xs text-zinc-500">Joined {client.joinedAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{client.industry}</td>
                  <td className="px-6 py-4">
                    <p className="text-zinc-200">{client.picName}</p>
                    <p className="text-xs text-zinc-500">{client.picEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                    }`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 text-zinc-400 hover:text-white rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No clients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Add New Client</h2>
            </div>
            <form onSubmit={handleAddClient} className="p-6 space-y-4">
              <Input 
                label="Company Name" 
                required 
                value={newClient.name} 
                onChange={e => setNewClient({...newClient, name: e.target.value})} 
              />
              <Input 
                label="Industry" 
                value={newClient.industry} 
                onChange={e => setNewClient({...newClient, industry: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="PIC Name" 
                  required 
                  value={newClient.picName} 
                  onChange={e => setNewClient({...newClient, picName: e.target.value})} 
                />
                <Input 
                  label="PIC Phone" 
                  value={newClient.picPhone} 
                  onChange={e => setNewClient({...newClient, picPhone: e.target.value})} 
                />
              </div>
              <Input 
                label="PIC Email" 
                type="email" 
                required 
                value={newClient.picEmail} 
                onChange={e => setNewClient({...newClient, picEmail: e.target.value})} 
              />
              
              <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-white/5">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Save Client</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
