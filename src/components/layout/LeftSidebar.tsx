import { Home, Target, CheckSquare, BookOpen, Dumbbell, Heart, BookHeart, Calendar, FileText, Settings, LogOut } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';


export const LeftSidebar = () => {
  const { activeTab, setActiveTab } = useUserStore();
  const { user, logout } = useAuthStore();

  const navItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'habits', icon: CheckSquare, label: 'Habits' },
    { id: 'study', icon: BookOpen, label: 'Study' },
    { id: 'fitness', icon: Dumbbell, label: 'Fitness' },
    { id: 'selfcare', icon: Heart, label: 'Self-Care' },
    { id: 'journal', icon: BookHeart, label: 'Journal' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'notes', icon: FileText, label: 'Notes' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  

  return (
    <aside className="w-[280px] hidden lg:flex flex-col h-screen pt-4 flex-shrink-0">
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5 pr-1 pb-6 min-h-0">
        <div className="flex flex-col items-center pb-4 mx-2">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm mb-3 bg-beige flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-serif text-brown-dark">{firstName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <h2 className="font-serif font-medium text-lg text-brown-dark">{greeting}, {firstName}</h2>
          <p className="text-sm text-brown-muted">Let's make today amazing ✨</p>

          <div className="mt-4 bg-beige px-6 py-2 rounded-2xl text-center text-sm font-medium text-brown-dark w-full max-w-[200px]">
            {format(new Date(), 'MMMM d, yyyy')}<br />
            <span className="text-xs font-normal text-brown-muted">{format(new Date(), 'EEEE')}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="glass-card p-4 mx-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-medium",
                  activeTab === item.id
                    ? "bg-white text-brown-dark shadow-sm"
                    : "text-brown-muted hover:bg-white/50"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Quote Widget */}
        <div className="glass-card p-6 mx-2 text-center">
          <p className="font-serif italic text-brown-dark text-sm leading-relaxed mb-4">
            "Discipline today<br />leads to freedom<br />tomorrow."
          </p>
          <Heart className="w-4 h-4 text-brown-muted mx-auto" />
        </div>

        {/* Focus Playlist removed per user request */}
      </div>

      {/* Logout */}
      <div className="shrink-0 mx-2 pt-4 border-t border-white/40 pb-2 bg-cream/80 backdrop-blur-sm">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-brown-muted hover:bg-red-50 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <p className="text-[10px] text-center text-brown-muted/50 mt-2 break-all">{user?.email}</p>
      </div>
    </aside>
  );
};
