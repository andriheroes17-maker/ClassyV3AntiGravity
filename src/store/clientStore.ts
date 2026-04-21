import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Client {
  id: string;
  name: string;
  industry: string;
  picName: string;
  picEmail: string;
  picPhone: string;
  status: 'active' | 'inactive';
  contractEnd: Date;
  joinedAt: Date;
}

interface ClientState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'joinedAt'>) => Promise<void>;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    const mappedClients: Client[] = data.map((c: any) => ({
      id: c.id.toString(),
      name: c.company_name,
      industry: c.industry || '-',
      picName: c.pic_name || '-',
      picEmail: c.pic_email || '-',
      picPhone: c.pic_phone || '-',
      status: c.status as 'active' | 'inactive',
      contractEnd: c.contract_end_date ? new Date(c.contract_end_date) : new Date(),
      joinedAt: new Date(c.created_at)
    }));

    set({ clients: mappedClients, isLoading: false });
  },

  addClient: async (client) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: userData } = await supabase.auth.getUser();

      const newRow = {
        company_name: client.name,
        industry: client.industry,
        pic_name: client.picName,
        pic_email: client.picEmail,
        pic_phone: client.picPhone,
        status: client.status,
        contract_end_date: client.contractEnd.toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([newRow])
        .select()
        .single();

      if (error) {
        console.error("Supabase Error:", error);
        alert('Supabase Error: ' + error.message);
        set({ error: error.message, isLoading: false });
        return;
      }

      const newClient: Client = {
        id: data.id.toString(),
        name: data.company_name,
        industry: data.industry || '-',
        picName: data.pic_name || '-',
        picEmail: data.pic_email || '-',
        picPhone: data.pic_phone || '-',
        status: data.status as 'active' | 'inactive',
        contractEnd: data.contract_end_date ? new Date(data.contract_end_date) : new Date(),
        joinedAt: new Date(data.created_at)
      };

      set((state) => ({
        clients: [newClient, ...state.clients],
        isLoading: false
      }));
    } catch (err: any) {
      console.error("Unhandled Error:", err);
      alert('Application Error: ' + err.message);
      set({ error: err.message, isLoading: false });
    }
  }
}));
