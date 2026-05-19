import { LayoutDashboard, Target, CheckSquare, Calendar, BookHeart, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useUserStore, TabType } from '../../store/useUserStore';
import { useAuthStore } from '../../store/useAuthStore';

export const TopBanner = () => {
  const { activeTab, setActiveTab } = useUserStore();
  const { user } = useAuthStore();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'beautiful';

  const tabs: { label: string; icon: any; id: TabType }[] = [
    { label: 'Dashboard', icon: LayoutDashboard, id: 'overview' },
    { label: 'Goals', icon: Target, id: 'goals' },
    { label: 'Habits', icon: CheckSquare, id: 'habits' },
    { label: 'Calendar', icon: Calendar, id: 'calendar' },
    { label: 'Journal', icon: BookHeart, id: 'journal' },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Hero Image & Quote */}
      <div className="w-full h-64 rounded-[32px] overflow-hidden relative shadow-sm">
        <img src="/sunset.png" alt="Aesthetic" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FCF9F2] via-[#FCF9F2]/80 to-transparent flex items-center">
          <div className="pl-16">
            <p className="text-sm text-brown-muted mb-2 font-medium tracking-wide">{greeting}, {firstName} ✨</p>
            <h1 className="text-4xl font-serif text-brown-dark leading-tight tracking-wide">
              Be proud of <br />
              how hard you're trying <span className="font-sans font-light">♡</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Horizontal Nav */}
      <div className="glass-card w-full py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {tabs.map(tab => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.id ? "bg-brown-dark/5 text-brown-dark shadow-sm" : "text-brown-muted hover:bg-beige/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            "p-2.5 rounded-xl transition-all text-brown-muted ml-4",
            activeTab === 'settings' ? "bg-beige text-brown-dark" : "hover:bg-beige/50"
          )}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
