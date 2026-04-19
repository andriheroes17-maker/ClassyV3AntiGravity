import { create } from 'zustand';

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
}

const mockClients: Client[] = [
  { id: '1', name: 'NexaTech Innovations', industry: 'Technology', picName: 'Sarah Jenkins', picEmail: 'sarah@nexatech.com', picPhone: '+62 812 3456 7890', status: 'active', contractEnd: new Date('2026-12-31'), joinedAt: new Date('2024-01-15') },
  { id: '2', name: 'Lumina Cosmetics', industry: 'Beauty & Lifestyle', picName: 'Amanda Ray', picEmail: 'amanda@lumina.id', picPhone: '+62 811 9876 5432', status: 'active', contractEnd: new Date('2026-08-15'), joinedAt: new Date('2025-02-20') },
  { id: '3', name: 'Urban Estate', industry: 'Real Estate', picName: 'David Chen', picEmail: 'david.c@urbanestate.co', picPhone: '+62 813 5555 4444', status: 'inactive', contractEnd: new Date('2026-02-01'), joinedAt: new Date('2023-11-10') },
];

export const useClientStore = create<ClientState>(() => ({
  clients: mockClients
}));
