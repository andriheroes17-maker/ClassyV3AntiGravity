import { create } from 'zustand';

export type NotificationType = 'urgent' | 'info' | 'action';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notif: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

// Initial mock data
const initialData: AppNotification[] = [
  { id: '1', type: 'urgent', title: 'Invoice Overdue', body: 'Invoice INV-2026-004 is overdue by 3 days.', isRead: false, createdAt: new Date(Date.now() - 3600000) },
  { id: '2', type: 'action', title: 'Content Approval', body: 'New Instagram post for Client A needs your review.', isRead: false, createdAt: new Date(Date.now() - 7200000) },
  { id: '3', type: 'info', title: 'System Maintanance', body: 'System will be under maintenance tonight at 2 AM.', isRead: true, createdAt: new Date(Date.now() - 86400000) },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: initialData,
  addNotification: (notif) => set((state) => ({
    notifications: [{
      ...notif,
      id: Math.random().toString(36).substring(7),
      isRead: false,
      createdAt: new Date()
    }, ...state.notifications]
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true }))
  })),
  deleteNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));
