import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '../store/authStore';
import { NotificationPanel } from '../components/ui/NotificationPanel';

export const AppLayout: React.FC = () => {
  const user = useAuthStore(state => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex overflow-hidden">
      <Sidebar />
      <NotificationPanel />
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300 h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
