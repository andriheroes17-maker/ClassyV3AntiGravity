import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';

// Lazy-loaded pages for code-splitting (Fase 9 optimization)
const DashboardOverview = React.lazy(() => import('../features/dashboard/pages/DashboardOverview').then(m => ({ default: m.DashboardOverview })));
const ClientList = React.lazy(() => import('../features/clients/pages/ClientList').then(m => ({ default: m.ClientList })));
const ClientDetail = React.lazy(() => import('../features/clients/pages/ClientDetail').then(m => ({ default: m.ClientDetail })));
const ProjectList = React.lazy(() => import('../features/projects/pages/ProjectList').then(m => ({ default: m.ProjectList })));
const ProjectDetail = React.lazy(() => import('../features/projects/pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })));
const InvoiceList = React.lazy(() => import('../features/finance/pages/InvoiceList').then(m => ({ default: m.InvoiceList })));
const InvoiceDetail = React.lazy(() => import('../features/finance/pages/InvoiceDetail').then(m => ({ default: m.InvoiceDetail })));
const OfferingList = React.lazy(() => import('../features/finance/pages/OfferingList').then(m => ({ default: m.OfferingList })));
const ProspectList = React.lazy(() => import('../features/crm/pages/ProspectList').then(m => ({ default: m.ProspectList })));
const LeadPipeline = React.lazy(() => import('../features/crm/pages/LeadPipeline').then(m => ({ default: m.LeadPipeline })));
const CampaignTracker = React.lazy(() => import('../features/marketing/pages/CampaignTracker').then(m => ({ default: m.CampaignTracker })));
const CalendarView = React.lazy(() => import('../features/calendar/pages/CalendarView').then(m => ({ default: m.CalendarView })));
const AttendanceList = React.lazy(() => import('../features/hr/pages/AttendanceList').then(m => ({ default: m.AttendanceList })));
const LeaveManagement = React.lazy(() => import('../features/hr/pages/LeaveManagement').then(m => ({ default: m.LeaveManagement })));
const PerformanceReviews = React.lazy(() => import('../features/hr/pages/PerformanceReviews').then(m => ({ default: m.PerformanceReviews })));
const AssetLibrary = React.lazy(() => import('../features/library/pages/AssetLibrary').then(m => ({ default: m.AssetLibrary })));
const SettingsProfile = React.lazy(() => import('../features/settings/pages/SettingsProfile').then(m => ({ default: m.SettingsProfile })));
const ResourceScheduling = React.lazy(() => import('../features/calendar/pages/ResourceScheduling').then(m => ({ default: m.ResourceScheduling })));
const SocialMediaScheduler = React.lazy(() => import('../features/marketing/pages/SocialMediaScheduler').then(m => ({ default: m.SocialMediaScheduler })));
const AuditLog = React.lazy(() => import('../features/settings/pages/AuditLog').then(m => ({ default: m.AuditLog })));

const LazyFallback = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-zinc-400 text-sm">Loading...</span>
    </div>
  </div>
);

const lazy = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<LazyFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: lazy(DashboardOverview) },
      { path: 'dashboard/:role', element: lazy(DashboardOverview) },
      { path: 'clients', element: lazy(ClientList) },
      { path: 'clients/:id', element: lazy(ClientDetail) },
      { path: 'projects', element: lazy(ProjectList) },
      { path: 'projects/:id', element: lazy(ProjectDetail) },
      { path: 'invoices', element: lazy(InvoiceList) },
      { path: 'invoices/:id', element: lazy(InvoiceDetail) },
      { path: 'offerings', element: lazy(OfferingList) },
      { path: 'crm/prospects', element: lazy(ProspectList) },
      { path: 'crm/pipeline', element: lazy(LeadPipeline) },
      { path: 'marketing/campaigns', element: lazy(CampaignTracker) },
      { path: 'calendar', element: lazy(CalendarView) },
      { path: 'hr/attendance', element: lazy(AttendanceList) },
      { path: 'hr/leaves', element: lazy(LeaveManagement) },
      { path: 'hr/performance', element: lazy(PerformanceReviews) },
      { path: 'library', element: lazy(AssetLibrary) },
      { path: 'settings/profile', element: lazy(SettingsProfile) },
      { path: 'calendar/resources', element: lazy(ResourceScheduling) },
      { path: 'marketing/social', element: lazy(SocialMediaScheduler) },
      { path: 'settings/audit', element: lazy(AuditLog) },
      { 
        path: 'settings/users', 
        element: (
          <div className="glass-panel p-12 text-center h-[60vh] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-2">User Management</h2>
            <p className="text-zinc-400">Coming soon in Fase 1 - USR-001</p>
          </div>
        ) 
      },
      { 
        path: '*', 
        element: (
          <div className="glass-panel p-12 text-center min-h-[60vh] flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold text-brand-500 mb-4">404</h1>
            <p className="text-xl text-zinc-300">Page not found</p>
          </div>
        ) 
      }
    ]
  }
]);
