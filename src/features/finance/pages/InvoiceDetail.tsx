import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFinanceStore } from '../../../store/financeStore';
import { useClientStore } from '../../../store/clientStore';
import { ArrowLeft, Download, Send, CheckCircle, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const invoice = useFinanceStore(s => s.invoices.find(i => i.id === id));
  const markInvoicePaid = useFinanceStore(s => s.markInvoicePaid);
  const client = useClientStore(s => s.clients.find(c => c.id === invoice?.clientId));

  if (!invoice || !client) {
    return <div className="p-8 text-center text-zinc-400">Invoice not found.</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/invoices')}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {invoice.status !== 'paid' && (
            <Button variant="ghost" className="w-full sm:w-auto hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30" onClick={() => markInvoicePaid(invoice.id)}>
              <CheckCircle className="w-4 h-4 mr-2" /> Mark as Paid
            </Button>
          )}
          <Button variant="ghost" className="w-full sm:w-auto hidden sm:flex">
            <Send className="w-4 h-4 mr-2" /> Send
          </Button>
          <Button className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="glass-panel p-8 sm:p-12 relative overflow-hidden bg-zinc-950/80 shadow-2xl">
        {/* Decorative background watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
          <FileText className="w-[400px] h-[400px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8 border-b border-white/10 pb-8 mb-8">
          <div>
             <h2 className="text-3xl font-bold text-white tracking-wider">INVOICE</h2>
             <p className="text-zinc-500 mt-1 font-medium">{invoice.invoiceNumber}</p>
             <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-brand-400 border border-brand-500/20">
               {invoice.status.replace('_', ' ')}
             </div>
          </div>
          <div className="text-left md:text-right">
             <h3 className="text-xl font-bold text-brand-400">Classy Visual</h3>
             <p className="text-zinc-400 mt-2 text-sm leading-relaxed">123 Agency Avenue<br/>Jakarta Selatan, 12345<br/>hello@classyvisual.com</p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Billed To</p>
            <h4 className="text-lg font-bold text-zinc-100">{client.name}</h4>
            <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{client.picName}<br/>{client.picEmail}<br/>{client.picPhone}</p>
          </div>
          <div className="text-left md:text-right flex flex-col items-start md:items-end justify-end space-y-4">
             <div>
               <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Issue Date</p>
               <p className="text-zinc-200 font-medium mt-0.5">{invoice.issueDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
             </div>
             <div>
               <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Due Date</p>
               <p className="text-red-400 font-medium mt-0.5">{invoice.dueDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
             </div>
          </div>
        </div>

        <div className="relative z-10 overflow-x-auto mb-8">
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-white/10 text-zinc-400">
              <tr>
                <th className="py-3 font-semibold w-full">Description</th>
                <th className="py-3 font-semibold text-center px-4">Qty</th>
                <th className="py-3 font-semibold text-right px-4">Unit Price</th>
                <th className="py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {invoice.items.map(item => (
                <tr key={item.id}>
                  <td className="py-4 font-medium text-white">{item.description}</td>
                  <td className="py-4 text-center px-4">{item.quantity}</td>
                  <td className="py-4 text-right px-4">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="w-full md:w-1/2">
            {invoice.notes && (
              <>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Notes / Payment Terms</p>
                <p className="text-sm text-zinc-400 p-4 rounded-xl bg-surface-hover/30 border border-white/5 leading-relaxed">
                  {invoice.notes}
                </p>
              </>
            )}
          </div>
          
          <div className="w-full md:w-1/3 min-w-[250px] space-y-3">
            <div className="flex justify-between items-center text-sm text-zinc-400">
              <span>Subtotal</span>
              <span className="font-medium text-white">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-zinc-400">
              <span>Tax ({invoice.taxRate * 100}%)</span>
              <span className="font-medium text-white">{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-3">
              <span className="text-lg font-bold text-zinc-100">Total Due</span>
              <span className="text-xl font-bold text-brand-400">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
