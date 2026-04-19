import { create } from 'zustand';

export type LeadStage = 'new_lead' | 'contacted' | 'meeting' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';

export interface Prospect {
  id: string;
  name: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  source: string;
  dealValue: number;
  stage: LeadStage;
  score: number; // 0-100
}

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  budget: number;
  spend: number;
  startDate: Date;
  endDate: Date;
  leadsGenerated: number;
  dealsWon: number;
}

interface CrmState {
  prospects: Prospect[];
  campaigns: Campaign[];
  updateProspectStage: (id: string, stage: LeadStage) => void;
  updateProspectOrder: (reordered: Prospect[]) => void;
}

const mockProspects: Prospect[] = [
  { id: 'lead-1', name: 'Jonathan Doe', company: 'Prime Solutions', industry: 'Logistics', email: 'jon@prime.co', phone: '0812345678', source: 'LinkedIn Ads', dealValue: 85000000, stage: 'negotiation', score: 85 },
  { id: 'lead-2', name: 'Alisa Wang', company: 'Bright Interiors', industry: 'Real Estate', email: 'alisa@bright.id', phone: '0819999888', source: 'Organic Search', dealValue: 40000000, stage: 'proposal_sent', score: 65 },
  { id: 'lead-3', name: 'Bimo Arya', company: 'F&B Corp', industry: 'Food & Beverage', email: 'bimo@fbcorp.co', phone: '0812300001', source: 'Referral', dealValue: 120000000, stage: 'meeting', score: 92 },
  { id: 'lead-4', name: 'Sarah Ken', company: 'TechNova', industry: 'SaaS', email: 's.ken@technova.io', phone: '0811111222', source: 'Instagram Ads', dealValue: 15000000, stage: 'new_lead', score: 30 },
  { id: 'lead-5', name: 'Dani Pratama', company: 'EduCenter', industry: 'Education', email: 'dani@educenter.id', phone: '0813333444', source: 'Event Marketing', dealValue: 55000000, stage: 'won', score: 100 },
];

const mockCampaigns: Campaign[] = [
  { id: 'camp-1', name: 'Q3 B2B LinkedIn Lead Gen', platform: 'LinkedIn', budget: 15000000, spend: 12500000, startDate: new Date('2026-07-01'), endDate: new Date('2026-09-30'), leadsGenerated: 45, dealsWon: 5 },
  { id: 'camp-2', name: 'Instagram Retargeting Summer', platform: 'Instagram', budget: 8000000, spend: 8000000, startDate: new Date('2026-06-01'), endDate: new Date('2026-08-31'), leadsGenerated: 120, dealsWon: 12 },
];

export const useCrmStore = create<CrmState>((set) => ({
  prospects: mockProspects,
  campaigns: mockCampaigns,
  updateProspectStage: (id, stage) => set(state => ({
    prospects: state.prospects.map(p => p.id === id ? { ...p, stage } : p)
  })),
  updateProspectOrder: (reordered) => set({
    prospects: reordered
  })
}));
