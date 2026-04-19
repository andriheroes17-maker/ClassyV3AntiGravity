import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, type Role, type User } from '../../../store/authStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const LoginPage: React.FC = () => {
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('super_admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate Supabase Auth network request
    setTimeout(() => {
      const mockUser: User = {
        id: 'user-123',
        email: email || 'demo@classyvisual.com',
        name: 'Demo User',
        role: selectedRole,
      };
      
      login(mockUser);
      setIsLoading(false);
      
      // Redirect logic based on Role
      if (selectedRole === 'client') navigate('/dashboard/client');
      else if (selectedRole === 'cfo' || selectedRole === 'finance_staff') navigate('/dashboard/finance');
      else if (selectedRole === 'cmo' || selectedRole === 'marketing_staff') navigate('/dashboard/crm');
      else navigate('/dashboard');
      
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-300 flex items-center justify-center shadow-lg shadow-brand-500/20 mb-6">
            <span className="text-white font-bold text-3xl leading-none">C</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Sign in to Agency Management System</p>
        </div>

        <div className="glass-panel p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <Input 
              label="Email Address" 
              placeholder="name@classyvisual.com" 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input 
              label="Password" 
              placeholder="••••••••" 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            
            <div className="space-y-1.5 pt-2">
              <label className="block text-sm font-medium text-zinc-300">
                Mock Login Role
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  value={selectedRole || ''}
                  onChange={e => setSelectedRole(e.target.value as Role)}
                >
                  <option value="super_admin">Super Admin / Director</option>
                  <option value="cfo">CFO / Finance Manager</option>
                  <option value="cmo">CMO / Marketing Manager</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="creator">Content Creator</option>
                  <option value="client">Client</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-zinc-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6 py-2.5" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
        </div>
        
        <p className="text-center text-zinc-500 mt-8 text-sm">
          &copy; {new Date().getFullYear()} Classy Visual. All rights reserved.
        </p>
      </div>
    </div>
  );
};
