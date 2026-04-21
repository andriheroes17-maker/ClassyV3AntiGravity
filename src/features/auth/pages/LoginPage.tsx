import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { TriangleAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    // Supabase Auth Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setErrorMsg(authError.message);
      setIsLoading(false);
      return;
    }

    if (authData.user) {
      const { data: userRow, error: dbError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
        
      if (dbError) {
        setErrorMsg(`Gagal memuat profil: ${dbError.message} (Mungkin belum Insert ke public.users atau RLS)`);
        setIsLoading(false);
        return;
      }

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', userRow.id);
        
      const roles = userRoles as unknown as { roles: { name: string } }[];
      const role = roles && roles.length > 0 ? roles[0].roles.name : null;

      setIsLoading(false);
      
      if (role === 'client') navigate('/dashboard/client');
      else if (role === 'cfo' || role === 'finance_staff') navigate('/dashboard/finance');
      else if (role === 'cmo' || role === 'marketing_staff') navigate('/dashboard/marketing');
      else if (role === 'coo') navigate('/dashboard/coo');
      else navigate('/dashboard');
    }
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
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            
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

            <Button type="submit" className="w-full mt-6 py-2.5 shadow-brand-500/20" isLoading={isLoading}>
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
