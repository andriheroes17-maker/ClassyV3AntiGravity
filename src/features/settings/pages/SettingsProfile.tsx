import React, { useState } from 'react';
import { User, Bell, Shield, Smartphone, Globe, Mail, Moon, Sun } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useUIStore } from '../../../store/uiStore';
import { useAuthStore } from '../../../store/authStore';
import { cn } from '../../../lib/utils';

export const SettingsProfile: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();
  const userName = useAuthStore(s => s.user?.name) || 'User';
  
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');
  const [emailNotif, setEmailNotif] = useState(true);
  const [waNotif, setWaNotif] = useState(true);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Personal Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account profile and notification preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
           <button 
             onClick={() => setActiveTab('profile')}
             className={cn(
               "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
               activeTab === 'profile' ? "bg-brand-500/10 text-brand-400 border border-brand-500/20" : "text-zinc-400 hover:text-white hover:bg-surface"
             )}
           >
             <User className="w-4 h-4" /> Account Profile
           </button>
           <button 
             onClick={() => setActiveTab('notifications')}
             className={cn(
               "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
               activeTab === 'notifications' ? "bg-brand-500/10 text-brand-400 border border-brand-500/20" : "text-zinc-400 hover:text-white hover:bg-surface"
             )}
           >
             <Bell className="w-4 h-4" /> Notifications
           </button>
           <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-surface transition-colors cursor-not-allowed opacity-50">
             <Shield className="w-4 h-4" /> Password & Security
           </button>
           <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-surface transition-colors cursor-not-allowed opacity-50">
             <Globe className="w-4 h-4" /> Language & Region
           </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
           {activeTab === 'profile' && (
             <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-amber-300 flex items-center justify-center text-2xl font-bold tracking-wider shadow-lg border-2 border-background">
                      {userName.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-white">Avatar</h3>
                     <p className="text-sm text-zinc-400 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                     <Button variant="glass" className="text-xs py-1.5 h-8">Upload New Image</Button>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                   <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                       <Input defaultValue={userName} />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email Address</label>
                       <Input defaultValue="user@classyvisual.com" type="email" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-zinc-400 mb-1.5">Job Title</label>
                       <Input defaultValue="Executive Officer" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-zinc-400 mb-1.5">Timezone</label>
                       <Input defaultValue="(GMT+08:00) Central Indonesia Time" disabled />
                     </div>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-bold text-white">Interface Theme</h3>
                       <p className="text-sm text-zinc-400">Customize how ClassyV looks on your device.</p>
                     </div>
                     <button
                        onClick={toggleTheme}
                        className={cn(
                          "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
                          theme === 'light' ? "bg-amber-400" : "bg-brand-500"
                        )}
                      >
                        <span className={cn(
                          "inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white transition-transform shadow-md",
                          theme === 'light' ? "translate-x-7" : "translate-x-1"
                        )}>
                          {theme === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-brand-600" />}
                        </span>
                      </button>
                   </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                   <Button variant="ghost">Cancel</Button>
                   <Button>Save Changes</Button>
                </div>
             </div>
           )}

           {activeTab === 'notifications' && (
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                   <h3 className="text-lg font-bold text-white mb-2">Notification Preferences</h3>
                   <p className="text-sm text-zinc-400">Choose what updates you want to receive.</p>
                </div>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-zinc-900/30">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-blue-400" />
                       </div>
                       <div>
                         <h4 className="text-zinc-100 font-semibold text-sm">Email Notifications</h4>
                         <p className="text-zinc-400 text-xs mt-1">Receive daily reports, invoices, and SLA alerts via Email.</p>
                       </div>
                    </div>
                    <button
                        onClick={() => setEmailNotif(!emailNotif)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0",
                          emailNotif ? "bg-brand-500" : "bg-zinc-700"
                        )}
                      >
                        <span className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          emailNotif ? "translate-x-6" : "translate-x-1"
                        )} />
                    </button>
                  </div>

                  {/* WA */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-zinc-900/30">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5 text-emerald-400" />
                       </div>
                       <div>
                         <h4 className="text-zinc-100 font-semibold text-sm">WhatsApp Urgent Alerts</h4>
                         <p className="text-zinc-400 text-xs mt-1">Receive instance messages for Deal WON and Critical Server Down.</p>
                       </div>
                    </div>
                    <button
                        onClick={() => setWaNotif(!waNotif)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0",
                          waNotif ? "bg-brand-500" : "bg-zinc-700"
                        )}
                      >
                        <span className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          waNotif ? "translate-x-6" : "translate-x-1"
                        )} />
                    </button>
                  </div>
                </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
