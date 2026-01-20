import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Scan,
  UserCircle,
  TrendingUp,
  PieChart,
  Target
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { User } from '../../types';
import { APP_COPY } from '../../lib/copy';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: APP_COPY.sidebar.nav.overview, icon: LayoutDashboard },
    { id: 'growth', label: APP_COPY.sidebar.nav.growth, icon: TrendingUp },
    { id: 'analytics', label: APP_COPY.sidebar.nav.analytics, icon: PieChart },
    { id: 'goals', label: APP_COPY.sidebar.nav.milestones, icon: Target },
    { id: 'scan', label: APP_COPY.sidebar.nav.scan, icon: Scan },
    { id: 'settings', label: APP_COPY.sidebar.nav.settings, icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col bg-black text-white fixed left-0 top-0 border-r border-zinc-900">
      {/* Logo Area */}
      <div className="p-10 pb-8">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-400 flex items-center justify-center shadow-lg shadow-brand-400/20">
                <div className="h-4 w-4 bg-black rounded-sm"></div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter block leading-none">{APP_COPY.common.appName}</span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-400 mt-1 block">{APP_COPY.common.appVersion}</span>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-2 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-brand-400 text-black shadow-2xl shadow-brand-400/20" 
                : "text-zinc-500 hover:text-white"
            )}
          >
            <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-black" : "text-zinc-500 group-hover:text-white")} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-5">
        <div className="flex items-center gap-3 rounded-[1.5rem] bg-zinc-900/50 p-4 border border-zinc-800/30">
            {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt={user.name} className="h-11 w-11 rounded-xl object-cover ring-2 ring-zinc-800" />
            ) : (
                <div className="h-11 w-11 rounded-xl bg-zinc-800 flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-zinc-600" />
                </div>
            )}
         
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-xs font-black text-white uppercase tracking-tight">{user?.name || APP_COPY.sidebar.userFallback}</p>
            <p className="truncate text-[10px] text-zinc-500 font-bold mt-0.5">{user?.email}</p>
          </div>
          <button 
            onClick={onLogout}
            className="rounded-lg p-2 text-zinc-600 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};