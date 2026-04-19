import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  PieChart, 
  LogOut, 
  CreditCard,
  CheckCircle,
  Megaphone,
  Kanban,
  Clock,
  Umbrella,
  Award,
  Archive,
  Settings,
  Shield,
  Share2,
  Boxes
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const role = useAuthStore(s => s.user?.role);
  const logout = useAuthStore(s => s.logout);
  const { sidebarOpen, closeSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuByRole = () => {
    const baseMenu = [{ name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }];
    
    switch (role) {
      case 'client':
        return [
          { name: 'My Projects', icon: Briefcase, path: '/projects' },
          { name: 'Documents', icon: CreditCard, path: '/dashboard/documents' },
          { name: 'Asset Library', icon: Archive, path: '/library' },
        ];
      case 'cfo':
      case 'finance_staff':
        return [
          ...baseMenu,
          { name: 'Finance Overview', icon: PieChart, path: '/dashboard/finance' },
          { name: 'Invoices', icon: CreditCard, path: '/invoices' },
          { name: 'Offerings', icon: CheckCircle, path: '/offerings' },
        ];
      case 'cmo':
      case 'marketing_staff':
        return [
          ...baseMenu,
          { name: 'Marketing Overview', icon: PieChart, path: '/dashboard/marketing' },
          { name: 'Prospects', icon: Users, path: '/crm/prospects' },
          { name: 'Sales Pipeline', icon: Kanban, path: '/crm/pipeline' },
          { name: 'Campaigns', icon: Megaphone, path: '/marketing/campaigns' },
          { name: 'Social Scheduler', icon: Share2, path: '/marketing/social' },
          { name: 'Calendar', icon: Calendar, path: '/calendar' },
        ];
      case 'coo':
        return [
          ...baseMenu,
          { name: 'Operations Overview', icon: LayoutDashboard, path: '/dashboard/coo' },
          { name: 'Attendance', icon: Clock, path: '/hr/attendance' },
          { name: 'Leave Requests', icon: Umbrella, path: '/hr/leaves' },
          { name: 'Team Performance', icon: Award, path: '/hr/performance' },
          { name: 'Projects', icon: Briefcase, path: '/projects' },
          { name: 'Asset Library', icon: Archive, path: '/library' },
          { name: 'Resources', icon: Boxes, path: '/calendar/resources' },
        ];
      case 'super_admin':
      case 'director':
        return [
          ...baseMenu,
          { name: 'Clients', icon: Users, path: '/clients' },
          { name: 'Projects', icon: Briefcase, path: '/projects' },
          { name: 'Invoices', icon: CreditCard, path: '/invoices' },
          { name: 'Offerings', icon: CheckCircle, path: '/offerings' },
          { name: 'Sales Pipeline', icon: Kanban, path: '/crm/pipeline' },
          { name: 'Attendance', icon: Clock, path: '/hr/attendance' },
          { name: 'Leave Requests', icon: Umbrella, path: '/hr/leaves' },
          { name: 'Team Performance', icon: Award, path: '/hr/performance' },
          { name: 'Asset Library', icon: Archive, path: '/library' },
          { name: 'Resources', icon: Boxes, path: '/calendar/resources' },
          { name: 'Social Scheduler', icon: Share2, path: '/marketing/social' },
          { name: 'Calendar', icon: Calendar, path: '/calendar' },
          { name: 'Audit Log', icon: Shield, path: '/settings/audit' },
          { name: 'Users', icon: Users, path: '/settings/users' },
        ];
      default:
        return baseMenu;
    }
  };

  const menus = getMenuByRole();

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 lg:translate-x-0 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-300 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg leading-none">C</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
              ClassyV
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
          {menus.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                 navigate(item.path);
                 closeSidebar();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-surface-hover hover:shadow-sm active:scale-[0.98] transition-all"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border bg-surface-hover/30 space-y-2">
          <button
            onClick={() => { navigate('/settings/profile'); closeSidebar(); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-surface-hover transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
