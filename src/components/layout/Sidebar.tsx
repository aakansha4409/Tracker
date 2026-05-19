import React from 'react';
import { LayoutDashboard, Target, Calendar, Settings, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useUserStore, TabType } from '../../store/useUserStore';

export const Sidebar = () => {
  const { activeTab, setActiveTab } = useUserStore();

  const navItems: { id: TabType; icon: any; label: string }[] = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-full glass-card m-4 hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-soft flex items-center justify-center text-brown-muted">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-serif font-medium tracking-wide dark:text-gray-800">Aura</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300",
              activeTab === item.id
                ? "bg-beige text-brown-dark font-medium shadow-sm" 
                : "text-gray-500 hover:bg-beige/50 hover:text-brown-muted dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="p-6">
        <div className="bg-pink-soft/50 dark:bg-[#383532] rounded-2xl p-4 text-center">
          <p className="text-sm text-brown-muted dark:text-gray-400 italic font-serif">
            "Discipline today leads to freedom tomorrow."
          </p>
        </div>
      </div>
    </aside>
  );
};
