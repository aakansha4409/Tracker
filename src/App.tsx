import React from 'react';
import { Calendar, Settings, BookOpen, Dumbbell, Heart, BookHeart, FileText } from 'lucide-react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { HabitList } from './components/widgets/HabitList';
import { ProgressOverview } from './components/widgets/ProgressOverview';
import { FocusTimer } from './components/widgets/FocusTimer';
import { MoodTracker } from './components/widgets/MoodTracker';
import { GoalsManager } from './components/widgets/GoalsManager';
import { AuthPage } from './components/auth/AuthPage';
import { useUserStore } from './store/useUserStore';
import { useAuthStore } from './store/useAuthStore';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { StudyDashboard } from './components/dashboard/StudyDashboard';
import { FitnessDashboard } from './components/dashboard/FitnessDashboard';
import { SelfCareDashboard } from './components/dashboard/SelfCareDashboard';
import { JournalDashboard } from './components/dashboard/JournalDashboard';
import { CalendarDashboard } from './components/dashboard/CalendarDashboard';
import { NotesDashboard } from './components/dashboard/NotesDashboard';
import { SettingsDashboard } from './components/dashboard/SettingsDashboard';

interface ComingSoonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ComingSoon = ({ icon, title, description }: ComingSoonProps) => (
  <div className="glass-card p-8 flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="w-20 h-20 rounded-full bg-pink-soft/50 flex items-center justify-center mb-6 text-brown-muted">
      {icon}
    </div>
    <h2 className="text-2xl font-serif text-brown-dark mb-2">{title}</h2>
    <p className="text-brown-muted max-w-xs text-sm">{description}</p>
    <div className="mt-6 px-6 py-2 rounded-full bg-beige text-brown-muted text-sm font-medium">Coming Soon</div>
  </div>
);

function App() {
  const activeTab = useUserStore(state => state.activeTab);
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <AuthPage />;
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 py-4">
        {activeTab === 'overview' && <MainDashboard />}

        {activeTab === 'habits' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HabitList />
            </div>
            <div className="space-y-6">
              <ProgressOverview />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <FocusTimer />
                <MoodTracker />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && <GoalsManager />}

        {activeTab === 'study' && <StudyDashboard />}

        {activeTab === 'fitness' && <FitnessDashboard />}

        {activeTab === 'selfcare' && <SelfCareDashboard />}

        {activeTab === 'journal' && <JournalDashboard />}

        {activeTab === 'calendar' && <CalendarDashboard />}

        {activeTab === 'notes' && <NotesDashboard />}

        {activeTab === 'settings' && <SettingsDashboard />}
      </div>
    </DashboardLayout>
  );
}

export default App;
