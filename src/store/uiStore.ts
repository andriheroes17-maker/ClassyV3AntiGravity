import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  notificationPanelOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleNotificationPanel: () => void;
  closeNotificationPanel: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  notificationPanelOpen: false,
  theme: 'dark',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleNotificationPanel: () => set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen })),
  closeNotificationPanel: () => set({ notificationPanelOpen: false }),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (newTheme === 'light') {
      document.body.classList.add('light-mode-forced');
    } else {
      document.body.classList.remove('light-mode-forced');
    }
    return { theme: newTheme };
  }),
}));
