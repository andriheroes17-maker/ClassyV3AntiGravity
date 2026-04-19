import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useNotificationStore } from '../../store/notificationStore';
import { X, Check, Trash2, BellIcon, Info, AlertTriangle, Play } from 'lucide-react';
import { cn } from '../../lib/utils';

export const NotificationPanel: React.FC = () => {
  const notificationPanelOpen = useUIStore(s => s.notificationPanelOpen);
  const closeNotificationPanel = useUIStore(s => s.closeNotificationPanel);
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'action': return <Play className="w-5 h-5 text-amber-400" />;
      default: return <Info className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <>
      {notificationPanelOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeNotificationPanel}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 right-0 z-[70] w-full sm:w-[26rem] glass-panel bg-surface/95 border-r-0 border-y-0 shadow-2xl rounded-none transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col",
        notificationPanelOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-hover/50">
          <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-zinc-100" />
            <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">Notifications</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={markAllAsRead}
              className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
            >
              Mark all as read
            </button>
            <button 
              onClick={closeNotificationPanel}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700/50">
                <BellIcon className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="font-medium text-zinc-400">All caught up!</p>
              <p className="text-xs text-zinc-600 mt-1">Check back later for new alerts.</p>
            </div>
          ) : (
             notifications.map(notif => (
              <div 
                key={notif.id} 
                className={cn(
                  "p-4 rounded-xl border transition-all",
                  notif.isRead 
                    ? "bg-surface/30 border-border" 
                    : "bg-surface-hover border-brand-500/30 shadow-[0_4px_20px_rgba(234,179,8,0.05)]"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "mt-0.5 shrink-0 flex items-center justify-center w-10 h-10 rounded-full border",
                    notif.isRead ? "bg-surface border-border" : "bg-surface border-brand-500/20"
                  )}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className={cn("text-sm font-semibold truncate", notif.isRead ? "text-zinc-300" : "text-white")}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-2 shrink-0 pt-0.5">
                        {Math.max(1, Math.round((Date.now() - notif.createdAt.getTime()) / 60000))}m ago
                      </span>
                    </div>
                    <p className={cn("text-xs mt-1.5 leading-relaxed", notif.isRead ? "text-zinc-400" : "text-zinc-300")}>
                      {notif.body}
                    </p>
                    
                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/50">
                      {!notif.isRead && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-brand-400 hover:text-brand-300 hover:bg-brand-500/10 rounded-md transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
