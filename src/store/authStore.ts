import { create } from 'zustand';

export type Role = 
  | 'super_admin' 
  | 'director' 
  | 'cfo' 
  | 'cmo' 
  | 'coo' 
  | 'project_manager' 
  | 'creator'
  | 'finance_staff'
  | 'marketing_staff'
  | 'client' 
  | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
