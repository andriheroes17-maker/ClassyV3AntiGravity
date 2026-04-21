import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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
  id: string; // auth.users.id atau public.users.id
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setAuthData: (user: User | null) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  
  setAuthData: (user) => set({ user }),

  initialize: async () => {
    set({ isLoading: true });
    
    // Check active session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Fetch user profile & role dari database public
      const { data: userRow } = await supabase
        .from('users')
        .select('id, name, email, avatar_url')
        .eq('email', session.user.email)
        .single();

      if (userRow) {
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('roles(name)')
          .eq('user_id', userRow.id);

        const roles = userRoles as unknown as { roles: { name: string } }[];
        const roleName = roles && roles.length > 0 ? roles[0].roles.name : null;

        set({
          user: {
            id: userRow.id.toString(),
            email: userRow.email,
            name: userRow.name,
            role: roleName as Role,
            avatarUrl: userRow.avatar_url,
          }
        });
      }
    }
    
    set({ isLoading: false, isInitialized: true });

    // Listen to Auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        if (event === 'SIGNED_IN') {
          const { data: userRow } = await supabase
            .from('users')
            .select('id, name, email, avatar_url')
            .eq('email', session.user.email)
            .single();

          if (userRow) {
            // Fetch roles manually to avoid PostgREST ambiguity (multiple FKs)
            const { data: userRoles } = await supabase
              .from('user_roles')
              .select('roles(name)')
              .eq('user_id', userRow.id);
              
            const roles = userRoles as unknown as { roles: { name: string } }[];
            const roleName = roles && roles.length > 0 ? roles[0].roles.name : null;

            set({
              user: {
                id: userRow.id.toString(),
                email: userRow.email,
                name: userRow.name,
                role: roleName as Role,
                avatarUrl: userRow.avatar_url,
              }
            });
          }
        }
      } else {
        set({ user: null });
      }
    });
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, isLoading: false });
  },
}));
