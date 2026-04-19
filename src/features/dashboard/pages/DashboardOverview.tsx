import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { ExecutiveDashboard } from '../components/ExecutiveDashboard';
import { CFODashboard } from '../components/CFODashboard';
import { CMODashboard } from '../components/CMODashboard';
import { COODashboard } from '../components/COODashboard';
import { ProjectManagerDashboard } from '../components/ProjectManagerDashboard';
import { CreatorDashboard } from '../components/CreatorDashboard';
import { ClientDashboard } from '../components/ClientDashboard';

export const DashboardOverview: React.FC = () => {
  const role = useAuthStore(s => s.user?.role);

  switch (role) {
    case 'super_admin':
    case 'director':
      return <ExecutiveDashboard />;
    case 'cfo':
    case 'finance_staff':
      return <CFODashboard />;
    case 'cmo':
    case 'marketing_staff':
      return <CMODashboard />;
    case 'coo':
      return <COODashboard />;
    case 'project_manager':
      return <ProjectManagerDashboard />;
    case 'creator':
      return <CreatorDashboard />;
    case 'client':
      return <ClientDashboard />;
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-semibold text-zinc-300">Welcome to ClassyVisual</h2>
          <p className="text-zinc-500 mt-2">Please select a valid role to view your dashboard.</p>
        </div>
      );
  }
};
