import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TabType = 'overview' | 'goals' | 'habits' | 'study' | 'fitness' | 'selfcare' | 'journal' | 'calendar' | 'notes' | 'settings';

interface UserState {
  xp: number;
  level: number;
  theme: 'light' | 'dark';
  activeTab: TabType;
  addXP: (amount: number) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: TabType) => void;
}

const XP_PER_LEVEL = 1000;

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      xp: 0,
      level: 1,
      theme: 'light',
      activeTab: 'overview',
      addXP: (amount) => {
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
          return { xp: newXP, level: newLevel };
        });
      },
      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      },
      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },
    }),
    {
      name: 'aesthetic-tracker-user',
    }
  )
);
