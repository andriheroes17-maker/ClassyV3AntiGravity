import React from 'react';
import { Menu, Bell, Search, User as UserIcon } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export const Header: React.FC = () => {
  const toggleSidebar = useUIStore(s => s.toggleSidebar);
  const toggleNotificationPanel = useUIStore(s => s.toggleNotificationPanel);
  const user = useAuthStore(s => s.user);
  const unreadCount = useNotificationStore(s => s.notifications.filter(n => !n.isRead).length);

  return (
    <header className="h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 lg:hidden text-zinc-400 hover:text-white hover:bg-surface-hover rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center bg-background border border-border rounded-full px-4 py-1.5 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 w-64 lg:w-96 transition-all shadow-inner">
          <Search className="w-4 h-4 text-zinc-500 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleNotificationPanel}
          className="relative p-2 text-zinc-400 hover:text-brand-400 hover:bg-brand-950/30 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.8)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        <div className="h-8 border-l border-border mx-1"></div>
        
        <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-surface-hover transition-colors">
          <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center overflow-hidden shadow-sm">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 text-zinc-400" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-zinc-100 leading-none">{user?.name || 'User'}</p>
            <p className="text-xs text-brand-400 mt-1 capitalize font-medium">{user?.role?.replace('_', ' ') || 'Guest'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
