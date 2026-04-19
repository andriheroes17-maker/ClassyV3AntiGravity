import { create } from 'zustand';

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  items: LineItem[];
  subtotal: number;
  taxRate: number; // e.g. 0.11 for 11%
  taxAmount: number;
  total: number;
  notes?: string;
}

export type OfferingStatus = 'draft' | 'sent' | 'viewed' | 'negotiating' | 'accepted' | 'declined';

export interface Offering {
  id: string;
  offeringNumber: string;
  clientId: string;
  title: string;
  status: OfferingStatus;
  dateSent?: Date;
  totalAmount: number;
}

interface FinanceState {
  invoices: Invoice[];
  offerings: Offering[];
  markInvoicePaid: (id: string) => void;
}

const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV/2026/08/001',
    clientId: '1',
    projectId: 'p1',
    status: 'draft',
    issueDate: new Date('2026-08-01'),
    dueDate: new Date('2026-08-15'),
    items: [
      { id: 'li-1', description: 'Software UI/UX Design Phase 1', quantity: 1, unitPrice: 25000000 },
      { id: 'li-2', description: 'Frontend Development (React)', quantity: 1, unitPrice: 40000000 }
    ],
    subtotal: 65000000,
    taxRate: 0.11,
    taxAmount: 7150000,
    total: 72150000,
    notes: 'Please transfer to BCA 123456789 a.n PT Classy Visual'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV/2026/07/045',
    clientId: '2',
    status: 'overdue',
    issueDate: new Date('2026-07-01'),
    dueDate: new Date('2026-07-15'),
    items: [
      { id: 'li-3', description: 'Social Media Management (July)', quantity: 1, unitPrice: 15000000 }
    ],
    subtotal: 15000000,
    taxRate: 0.11,
    taxAmount: 1650000,
    total: 16650000,
  }
];

const mockOfferings: Offering[] = [
  { id: 'off-1', offeringNumber: 'OFF/2026/08/099', clientId: '3', title: 'Real Estate 3D Rendering Project', status: 'negotiating', dateSent: new Date('2026-08-01'), totalAmount: 120000000 },
  { id: 'off-2', offeringNumber: 'OFF/2026/08/102', clientId: '1', title: 'Q4 Retainer Extension', status: 'accepted', dateSent: new Date('2026-08-10'), totalAmount: 250000000 }
];

export const useFinanceStore = create<FinanceState>((set) => ({
  invoices: mockInvoices,
  offerings: mockOfferings,
  markInvoicePaid: (id) => set(state => ({
    invoices: state.invoices.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv)
  }))
}));
