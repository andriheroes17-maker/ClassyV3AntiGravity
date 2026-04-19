import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type InvoiceStatus, useFinanceStore } from '../../../store/financeStore';
import { useClientStore } from '../../../store/clientStore';
import { Search, Plus, Filter, MoreVertical, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const InvoiceList: React.FC = () => {
  const invoices = useFinanceStore(s => s.invoices);
  const clients = useClientStore(s => s.clients);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown Client';

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'overdue': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'sent': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'draft': return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
      default: return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    }
  };

  const filteredInvoices = invoices.filter(inv => inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Invoices</h1>
          <p className="text-zinc-400 mt-1">Manage billing and track payments.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Invoice
        </Button>
      </div>

      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-t-white/5">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search invoice number..." 
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
                <th className="px-6 py-4 font-medium">Invoice Number</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((inv) => (
                <tr 
                  key={inv.id} 
                  className="hover:bg-surface-hover/30 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-zinc-400 group-hover:text-brand-400 transition-colors" />
                      </div>
                      <span className="font-medium text-zinc-200">{inv.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{getClientName(inv.clientId)}</td>
                  <td className="px-6 py-4 font-semibold text-zinc-100">{formatCurrency(inv.total)}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    <span className={inv.status === 'overdue' ? 'text-red-400 flex items-center gap-1.5' : ''}>
                      {inv.status === 'overdue' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {inv.dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(inv.status)}`}>
                      {inv.status.replace('_', ' ')}
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
              
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
