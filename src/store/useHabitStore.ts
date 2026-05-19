import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HabitCategory = 'health' | 'productivity' | 'mindfulness' | 'fitness' | 'custom';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  icon: string;
  completedDates: string[];
  createdAt: string;
  order: number;
}

interface HabitState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'order'>) => void;
  updateHabit: (id: string, data: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  reorderHabits: (newHabits: Habit[]) => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [], // always empty for new users — add your own habits!

      addHabit: (habitData) => {
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habitData,
              id: Math.random().toString(36).substring(2, 9),
              completedDates: [],
              createdAt: new Date().toISOString(),
              order: state.habits.length,
            },
          ],
        }));
      },

      updateHabit: (id, data) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...data } : h)),
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        }));
      },

      toggleHabit: (id, date) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id === id) {
              const isCompleted = h.completedDates.includes(date);
              return {
                ...h,
                completedDates: isCompleted
                  ? h.completedDates.filter((d) => d !== date)
                  : [...h.completedDates, date],
              };
            }
            return h;
          }),
        }));
      },

      reorderHabits: (newHabits) => {
        set({ habits: newHabits });
      },
    }),
    {
      // Bump the key name → browser ignores old cached data with default habits
      name: 'tracker-habits-v2',
    }
  )
);
