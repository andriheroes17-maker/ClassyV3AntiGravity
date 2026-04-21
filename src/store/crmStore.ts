import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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
  isLoading: boolean;
  error: string | null;
  fetchProspects: () => Promise<void>;
  addProspect: (prospect: Omit<Prospect, 'id' | 'stage' | 'score'>) => Promise<void>;
  updateProspectStage: (id: string, stage: LeadStage) => Promise<void>;
  updateProspectOrder: (reordered: Prospect[]) => void;
  // TODO: add fetchCampaigns etc later
}

export const useCrmStore = create<CrmState>((set, get) => ({
  prospects: [],
  campaigns: [],
  isLoading: false,
  error: null,

  fetchProspects: async () => {
    set({ isLoading: true, error: null });
    // Fetch prospects and join with pipeline_stages to get the stage name
    const { data, error } = await supabase
      .from('prospects')
      .select('*, pipeline_stages(name)')
      .order('created_at', { ascending: false });

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    const mappedProspects: Prospect[] = data.map((p: any) => ({
      id: p.id.toString(),
      name: p.contact_name,
      company: p.company_name || '-',
      industry: p.industry || '-',
      email: p.email || '-',
      phone: p.phone || '-',
      source: p.lead_source || '-',
      dealValue: Number(p.deal_value || 0),
      stage: (p.pipeline_stages?.name || 'new_lead') as LeadStage,
      score: p.lead_score || 0
    }));

    set({ prospects: mappedProspects, isLoading: false });
  },

  addProspect: async (prospect) => {
    set({ isLoading: true, error: null });
    
    try {
      // Default stage is 'new_lead' = 1
      const { data: stageData } = await supabase
        .from('pipeline_stages')
        .select('id')
        .eq('name', 'new_lead')
        .single();

      const stageId = stageData?.id || 1;

      const newRow = {
        contact_name: prospect.name,
        company_name: prospect.company,
        industry: prospect.industry,
        email: prospect.email,
        phone: prospect.phone,
        lead_source: prospect.source,
        deal_value: prospect.dealValue,
        stage_id: stageId,
        lead_score: 30 // default initial score
      };

      const { data, error } = await supabase
        .from('prospects')
        .insert([newRow])
        .select('*, pipeline_stages(name)')
        .single();

      if (error) {
        console.error("Supabase Error:", error);
        alert('Supabase Error: ' + error.message);
        set({ error: error.message, isLoading: false });
        return;
      }

      const newProspect: Prospect = {
        id: data.id.toString(),
        name: data.contact_name,
        company: data.company_name || '-',
        industry: data.industry || '-',
        email: data.email || '-',
        phone: data.phone || '-',
        source: data.lead_source || '-',
        dealValue: Number(data.deal_value || 0),
        stage: (data.pipeline_stages?.name || 'new_lead') as LeadStage,
        score: data.lead_score || 0
      };

      set(state => ({
        prospects: [newProspect, ...state.prospects],
        isLoading: false
      }));
    } catch (err: any) {
      console.error("Unhandled Error:", err);
      alert('Application Error: ' + err.message);
      set({ error: err.message, isLoading: false });
    }
  },

  updateProspectStage: async (id, stage) => {
    const originalProspects = get().prospects;
    
    // Optimistic UI Update
    set(state => ({
      prospects: state.prospects.map(p => p.id === id ? { ...p, stage } : p)
    }));

    // First, find the stage_id for the given stage name
    const { data: stageData, error: stageError } = await supabase
      .from('pipeline_stages')
      .select('id')
      .eq('name', stage)
      .single();

    if (stageError) {
      set({ error: stageError.message, prospects: originalProspects });
      return;
    }

    // Now update the prospect
    const { error: updateError } = await supabase
      .from('prospects')
      .update({ stage_id: stageData.id })
      .eq('id', parseInt(id));

    if (updateError) {
      set({ error: updateError.message, prospects: originalProspects });
    }
  },

  updateProspectOrder: (reordered) => set({
    prospects: reordered
  })
}));
